/**
 * Build-time fetch of editable landingpage content blocks from
 * tds-content-api's `GET /landing?lang=…`. Each block is the content object
 * for one section (faq, process, …), edited in the admin panel and baked
 * into the static site at build time.
 *
 * Mirrors the graceful-fallback contract of `content.ts`: any failure
 * returns an empty map so the build never breaks — sections then render
 * their baked tds-shared / local defaults via `cmsFor()`.
 */

/** Resolved at build time from env, with the production default. */
const CONTENT_API_URL =
  (import.meta.env.PUBLIC_CONTENT_API_URL as string | undefined) ??
  "https://api.tracht-digital.de/content";

/** Map of section key → content object, as returned by the API. */
export type ContentBlocks = Record<string, unknown>;

const cache = new Map<string, ContentBlocks>();

/**
 * Fetch every saved content block for a language, once per build (memoised
 * so multiple sections share a single request). Returns `{}` on any
 * failure or in demo mode.
 */
export async function fetchBlocks(lang: "de" | "en"): Promise<ContentBlocks> {
  if (import.meta.env.PUBLIC_DEMO_MODE === "true") return {};
  const cached = cache.get(lang);
  if (cached) return cached;

  let blocks: ContentBlocks = {};
  try {
    const url = new URL(`${CONTENT_API_URL}/landing`);
    url.searchParams.set("lang", lang);
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
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
  cache.set(lang, blocks);
  return blocks;
}

/**
 * Resolve one section's content: the API-edited block when present and
 * shaped like the fallback, else the baked default. The shallow
 * shape-guard (same top-level keys present) keeps a malformed/partial
 * block from blanking a section.
 */
export async function cmsFor<T extends object>(
  section: string,
  lang: "de" | "en",
  fallback: T,
): Promise<T> {
  const blocks = await fetchBlocks(lang);
  const block = blocks[section];
  if (block && typeof block === "object" && hasSameShape(block as object, fallback)) {
    return block as T;
  }
  return fallback;
}

/** True when every top-level key of `fallback` exists on `candidate`. */
function hasSameShape(candidate: object, fallback: object): boolean {
  return Object.keys(fallback).every((k) => k in candidate);
}
