/**
 * Paths the panel has taken out of the index.
 *
 * `SITEMAP_ENTRIES` in `sitemap.ts` is this site's route inventory and stays
 * code-owned — service IDs, slugs and route lookup are deliberately not
 * editable, so an editorial change can never break a public URL. This is the
 * one thing the panel may say about them: *don't list this one*.
 *
 * ### The pairing is explicit here, not a prefix
 *
 * `/leistungen/<slug.de>` pairs with `/en/services/<slug.en>` — different
 * segment AND different slug. No rule derives one from the other, so the
 * pairing is read from `SITEMAP_ENTRIES`, which is where it is already stated.
 * That matters because every URL in this sitemap carries reciprocal
 * `hreflang` alternates: removing one side of a pair would leave the other
 * naming a page no longer offered, and a single dangling alternate invalidates
 * the whole set, the German side included.
 *
 * Pages outside the inventory (`/legal/*`, `/install`, the error pages) are
 * already absent from the sitemap and mostly `noindex` in their own right; an
 * exclusion naming one of those still applies to it alone, which is all it
 * could mean.
 *
 * ### Fail-soft, in the safe direction
 *
 * Every failure answers "nothing excluded". The opposite default would empty
 * the sitemap on an API hiccup, and because the API's own route is fail-soft
 * too, neither end would go red. Same direction as `cmsFor()`: a database that
 * cannot be read may leave a page stale, never blank.
 */

import { contentCache } from "./contentCache";
import { contentApiBase } from "./connection";
import { assertKeyAccepted, siteKeyHeaders } from "./siteKey";

/** This site's id in the panel's site registry. */
export const SITE_ID = "landingpage";

const DEMO_MODE = import.meta.env.PUBLIC_DEMO_MODE === "true";

interface ExclusionsResponse {
  site?: string;
  paths?: unknown;
}

/**
 * Trailing slash folded away, root kept — `trailingSlash: "ignore"` in the
 * Astro config, so `/preise` and `/preise/` are one page.
 *
 * Exported because `sitemap.ts` must fold paths the SAME way when it looks a
 * URL up in the inventory: that list stores the home pages as `/` and `/en/`,
 * with the slash, and a lookup that trimmed differently would simply fail to
 * find them.
 */
export function canonicalPath(path: string): string {
  const value = path.trim();
  if (value === "" || value === "/") return "/";
  return value.replace(/\/+$/, "") || "/";
}

const canonical = canonicalPath;

/**
 * One pattern against one path.
 *
 * Deliberately the same two rules the API validates and documents: an exact
 * path, or a trailing `*` making it a raw prefix. Kept dumb on purpose — a
 * glob library here would accept patterns the API rejects, and the
 * disagreement would only ever show as a page that quietly stayed indexed.
 */
export function matchesPattern(path: string, pattern: string): boolean {
  const value = pattern.trim();
  if (value === "") return false;

  if (value.endsWith("*")) {
    const prefix = value.slice(0, -1);
    return prefix === "" || canonical(path).startsWith(prefix);
  }
  return canonical(value) === canonical(path);
}

/** Does any pattern hit any member of this hreflang group? */
export function groupExcluded(paths: readonly string[], patterns: readonly string[]): boolean {
  return paths.some((path) => patterns.some((pattern) => matchesPattern(path, pattern)));
}

async function load(): Promise<string[]> {
  if (DEMO_MODE) return [];

  try {
    const url = new URL(`${contentApiBase()}/sitemap-exclusions`);
    url.searchParams.set("site", SITE_ID);
    const res = await fetch(url, {
      headers: siteKeyHeaders(),
      // A HANGING api host would otherwise block a render until the job
      // timeout, and this one sits in the Layout — it would hang every page.
      signal: AbortSignal.timeout(10_000),
    });
    assertKeyAccepted(res, url);
    if (!res.ok) return [];

    const data = (await res.json()) as ExclusionsResponse;
    if (!Array.isArray(data.paths)) return [];
    return data.paths.filter((p): p is string => typeof p === "string" && p.trim() !== "");
  } catch (err) {
    console.warn("[tds-landingpage] sitemap exclusions unreachable — nothing excluded:", err);
    return [];
  }
}

/**
 * The patterns, memoised for the render generation.
 *
 * Through `contentCache` rather than a module-level promise: the latter would
 * live as long as the server under SSR, so an exclusion added in the panel
 * would never reach a visitor and nothing would log.
 *
 * Imported from `contentCache.ts`, not `cache.ts` — the same cycle-breaking
 * split the content fetches use. A fetch has no business importing the route
 * table, and `cache.ts` imports this module's caller.
 */
export function exclusionPatterns(): Promise<string[]> {
  return contentCache.get("sitemap:exclusions", load);
}
