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

import { createSitemapExclusions } from "@tracht-digital-solutions/tds-shared/site";
import { memoisedOr } from "./contentCache";
import { contentApiBase } from "./connection";
import { readContentJson } from "./siteKey";

export { canonicalPath, groupExcluded, matchesPattern } from "@tracht-digital-solutions/tds-shared/site";

/** This site's id in the panel's site registry. */
export const SITE_ID = "landingpage";

const exclusions = createSitemapExclusions({
  siteId: SITE_ID,
  contentBase: contentApiBase,
  read: (url) => readContentJson(new URL(url)),
  memo: memoisedOr,
  disabled: import.meta.env.PUBLIC_DEMO_MODE === "true",
});

/**
 * The patterns, memoised for the render generation. Through the generation
 * cache rather than a module-level promise, which would live as long as the
 * SSR server and never see an exclusion added later. Failures exclude nothing.
 */
export const exclusionPatterns = exclusions.exclusionPatterns;
