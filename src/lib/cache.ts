/**
 * This site's half of the page cache: which pages a content change dates, and
 * the memo that a rebuild throws away.
 *
 * The API sends *what changed* (`{type:"block", id:"hero", lang:"de"}`); this
 * file answers *which of my pages that is*. Keeping the answer here rather
 * than in the API is deliberate — see the note in
 * `@tracht-digital-solutions/tds-shared/cache`.
 */

import {
  createGenerationCache,
  forLanguages,
  type EventMap,
} from "@tracht-digital-solutions/tds-shared/cache";

/**
 * The one memo every content fetch on this site shares.
 *
 * It replaces the module-level `Map`/`let … = null` caches that `cms.ts` and
 * `legal.ts` used to keep. Those were exactly right while this site was a
 * static build — one process, one fetch per language, then exit — and become
 * *permanent* under SSR: the server would answer with whatever it read at
 * boot, for the life of the process, and a cache rebuild would faithfully
 * re-render that stale content and report success. Nothing logs, nothing
 * throws, nothing is red.
 *
 * The middleware calls `invalidate()` before any render a rebuild performs.
 */
export const contentCache = createGenerationCache();

/** Every page that shows editable landing content, per language. */
function contentPages(lang: "de" | "en"): string[] {
  // Both, unconditionally: `pricing` is rendered by /preise AND by the
  // PricingTeaser on the home page, `footer` and `contact` appear on both, and
  // getting the mapping subtly wrong shows up as a page that never updates —
  // the exact silence this mechanism exists to remove. Two renders is a
  // rounding error against that.
  return lang === "de" ? ["/", "/preise"] : ["/en/", "/en/preise"];
}

/** Where a legal document is published, per key and language. */
function legalPages(key: string, lang: "de" | "en"): string[] {
  const prefix = lang === "de" ? "" : "/en";
  // The PDF endpoint is a cached page like any other: it streams bytes the
  // CMS holds, so a replaced upload has to invalidate it too. It falls back to
  // the committed `src/assets/legal/agb.pdf`, which is why a stale entry here
  // would be invisible rather than broken.
  return [`${prefix}/legal/${key}`, `${prefix}/legal/${key}.pdf`];
}

/**
 * The route table, as the cache sees it.
 *
 * Unlisted event types are reported back to the caller rather than ignored —
 * a `tool` event legitimately reaches this site and dates nothing here, but a
 * *typo* in an event type would otherwise be a silent no-op.
 */
export const cacheEvents: EventMap = {
  /** A landing content block was saved or deleted. */
  block: (event) => {
    // The two legal texts are content blocks too (`legal_impressum`,
    // `legal_datenschutz`), but they live on their own pages rather than on
    // the home page, so they must not drag a home-page render along.
    if (event.id === "legal_impressum" || event.id === "legal_datenschutz") {
      const slug = event.id.replace("legal_", "");
      return forLanguages(event, (lang) => (lang === "de" ? [`/legal/${slug}`] : []));
    }
    return forLanguages(event, contentPages);
  },

  /** A legal PDF was uploaded, replaced or removed. */
  legal: (event) => forLanguages(event, (lang) => legalPages(event.id ?? "agb", lang)),

  /**
   * A blog post changed.
   *
   * This is not the blog — but the home page's Journal and Currently sections
   * read `/content/blog` at render time, so a published post changes this site
   * too. Missing that is how the marketing page ends up advertising last
   * month's articles.
   */
  post: (event) => forLanguages(event, contentPages),
};

/**
 * Pages a "rebuild everything" must include even when nothing is cached yet.
 *
 * The cache can only enumerate what it already holds, so without this a
 * rebuild on a cold cache would report success having rendered nothing.
 */
export const alwaysPaths = ["/", "/en/", "/preise", "/en/preise"];
