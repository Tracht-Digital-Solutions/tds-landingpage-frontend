import { assertKeyAccepted, siteKeyHeaders } from "./siteKey";
import { contentApiBase } from "./connection";
import { contentCache } from "./cache";
/**
 * Server-side fetch of editable landingpage content blocks from
 * tds-content-api's `GET /landing?lang=…`. Each block is the content object
 * for one section (faq, process, …), edited in the admin panel and read while
 * a page render fills the file-backed cache.
 *
 * Mirrors the graceful-fallback contract of `content.ts`: any failure
 * returns an empty map so the build never breaks — sections then render
 * their baked tds-shared / local defaults via `cmsFor()`.
 */

/** Resolved at build time from env, with the production default. */
/** Map of section key → content object, as returned by the API. */
export type ContentBlocks = Record<string, unknown>;

type MergeResult = {
  /** The validated value to render. */
  value: unknown;
  /** Whether at least one candidate value was safe and useful to apply. */
  applied: boolean;
};

/** JSON object, excluding arrays and `null`. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type NewListItemResult = {
  value: unknown;
  valid: boolean;
};

/**
 * Validate an appended list item for which no committed value exists.
 *
 * An existing item can safely inherit a missing or invalid field from the
 * item at the same index in `fallback`. An appended item cannot: inventing
 * `0` for a malformed price or `""` for a missing title would publish data
 * that exists in neither source. Scalars are therefore required and valid;
 * list fields may be omitted and become an empty list (the structured CMS
 * deliberately omits service tags, while the renderer safely accepts `[]`).
 */
function validateNewListItem(schema: unknown, candidate: unknown): NewListItemResult {
  if (typeof schema === "string") {
    return typeof candidate === "string" && candidate.trim() !== ""
      ? { value: candidate, valid: true }
      : { value: schema, valid: false };
  }

  if (typeof schema === "number") {
    return typeof candidate === "number" && Number.isFinite(candidate)
      ? { value: candidate, valid: true }
      : { value: schema, valid: false };
  }

  if (typeof schema === "boolean") {
    return typeof candidate === "boolean"
      ? { value: candidate, valid: true }
      : { value: schema, valid: false };
  }

  if (Array.isArray(schema)) {
    if (!Array.isArray(candidate)) return { value: schema, valid: false };
    if (candidate.length === 0) return { value: [], valid: true };
    if (schema.length === 0) return { value: schema, valid: false };

    const items: unknown[] = [];
    for (const candidateItem of candidate) {
      const item = validateNewListItem(schema[0], candidateItem);
      if (!item.valid) return { value: schema, valid: false };
      items.push(item.value);
    }
    return { value: items, valid: true };
  }

  if (isRecord(schema)) {
    if (!isRecord(candidate)) return { value: schema, valid: false };

    const value: Record<string, unknown> = {};
    const keys = Object.keys(schema);
    if (keys.length === 0) return { value: schema, valid: false };

    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(candidate, key)) {
        if (Array.isArray(schema[key])) {
          value[key] = [];
          continue;
        }
        return { value: schema, valid: false };
      }
      const child = validateNewListItem(schema[key], candidate[key]);
      if (!child.valid) return { value: schema, valid: false };
      value[key] = child.value;
    }
    return { value, valid: true };
  }

  return { value: schema, valid: false };
}

/**
 * Validate one CMS value against its local fallback and merge recursively.
 *
 * The fallback doubles as the runtime schema: strings stay strings, arrays
 * stay arrays and object keys not known locally never reach a component.
 * Empty strings/lists mean "no override" because the editor starts a missing
 * block at `{}`; letting an untouched empty control win would silently erase
 * the baked copy.
 */
function mergeCmsValue(fallback: unknown, candidate: unknown): MergeResult {
  if (typeof fallback === "string") {
    return typeof candidate === "string" && candidate.trim() !== ""
      ? { value: candidate, applied: true }
      : { value: fallback, applied: false };
  }

  if (typeof fallback === "number") {
    return typeof candidate === "number" && Number.isFinite(candidate)
      ? { value: candidate, applied: true }
      : { value: fallback, applied: false };
  }

  if (typeof fallback === "boolean") {
    return typeof candidate === "boolean"
      ? { value: candidate, applied: true }
      : { value: fallback, applied: false };
  }

  if (Array.isArray(fallback)) {
    if (!Array.isArray(candidate) || candidate.length === 0) {
      return { value: fallback, applied: false };
    }

    // With no committed item there is no runtime shape to validate against.
    // Refuse the override instead of asserting an arbitrary JSON array as T.
    if (fallback.length === 0) return { value: fallback, applied: false };

    const merged: unknown[] = [];
    for (let index = 0; index < candidate.length; index += 1) {
      if (index >= fallback.length) {
        const item = validateNewListItem(fallback[0], candidate[index]);
        if (!item.valid) return { value: fallback, applied: false };
        merged.push(item.value);
        continue;
      }

      const item = mergeCmsValue(fallback[index], candidate[index]);

      // One malformed item makes the collection unsafe as a whole. Falling
      // back to the complete local list is preferable to quietly dropping an
      // item and changing the editor's ordering.
      if (!item.applied) return { value: fallback, applied: false };
      merged.push(item.value);
    }
    return { value: merged, applied: true };
  }

  if (isRecord(fallback)) {
    if (!isRecord(candidate)) return { value: fallback, applied: false };

    let merged: Record<string, unknown> = fallback;
    let applied = false;
    for (const key of Object.keys(fallback)) {
      if (!Object.prototype.hasOwnProperty.call(candidate, key)) continue;
      const child = mergeCmsValue(fallback[key], candidate[key]);
      if (!child.applied) continue;
      if (!applied) merged = { ...fallback };
      merged[key] = child.value;
      applied = true;
    }
    return { value: merged, applied };
  }

  // Content defaults are JSON-shaped today. `null` (or a future unsupported
  // value) supplies no useful runtime schema, so it cannot be overridden
  // safely by this generic layer.
  return { value: fallback, applied: false };
}

/**
 * Fetch every saved content block for a language, memoised so the dozen
 * section components rendering one page share a single request. Returns `{}`
 * on any failure or in demo mode.
 *
 * **The memo is generation-scoped, not module-scoped.** A plain module-level
 * `Map` was right while this site was a static build — one process, one fetch
 * per language, then exit. Under SSR the same `Map` lives as long as the
 * server does, so the site would answer with the blocks it read at boot
 * forever, and a cache rebuild would faithfully re-render that stale content
 * and report success. `contentCache.invalidate()` runs before any render a
 * rebuild performs; see `src/lib/cache.ts`.
 */
export async function fetchBlocks(lang: "de" | "en"): Promise<ContentBlocks> {
  if (import.meta.env.PUBLIC_DEMO_MODE === "true") return {};

  return contentCache.get(`landing:${lang}`, async () => {
    let blocks: ContentBlocks = {};
    try {
      const url = new URL(`${contentApiBase()}/landing`);
      url.searchParams.set("lang", lang);
      const res = await fetch(url, {
        headers: siteKeyHeaders(),
        signal: AbortSignal.timeout(10_000),
      });
      assertKeyAccepted(res, url);
      if (res.ok) {
        const data = (await res.json()) as { blocks?: ContentBlocks };
        blocks = data.blocks ?? {};
      }
    } catch (err) {
      console.warn(
        "[tds-landingpage] content blocks fetch failed, using baked defaults:",
        err,
      );
    }
    return blocks;
  });
}

/**
 * Resolve one section's content: validated API fields merged over the baked
 * default. A block is deliberately allowed to be partial: the Website-CMS
 * creates a missing block from `{}`, so its first save contains only controls
 * the editor actually touched.
 */
export async function cmsFor<T extends object>(
  section: string,
  lang: "de" | "en",
  fallback: T,
): Promise<T> {
  const blocks = await fetchBlocks(lang);
  const block = blocks[section];
  if (!isRecord(block)) return fallback;
  return mergeCmsValue(fallback, block).value as T;
}

/**
 * Whether the public cookie banner is enabled. The `cookie_banner` block is
 * language-agnostic (stored under `lang=de`, like the Journal selection), so
 * this always reads the DE block regardless of page locale. Absent block,
 * demo mode or an unreachable API all mean "off" — the safe default.
 */
export async function cookieBannerEnabled(): Promise<boolean> {
  const blocks = await fetchBlocks("de");
  const block = blocks["cookie_banner"];
  return (
    typeof block === "object" &&
    block !== null &&
    (block as { enabled?: unknown }).enabled === true
  );
}
