/**
 * The sitemap, as data.
 *
 * ### Why this is hand-written now
 *
 * `@astrojs/sitemap` derives its entries from the routes the build EMITS. This
 * site's two indexable pages are server-rendered now, so the integration would
 * have emitted a sitemap containing only the pages its own `filter` used to
 * exclude — a near-empty, technically valid file, with nothing red anywhere.
 * That is the exact shape of failure this codebase keeps meeting: correct
 * config, green build, silently wrong output.
 *
 * Keeping the route list here rather than in the `.xml.ts` endpoints means the
 * hreflang rules can be unit-tested, which is the only way the invariant below
 * is enforceable.
 */

import { siteConfig } from "./seo";
import { serviceDefinitions, serviceHref } from "./services";

/** One indexable page, in both languages. */
export interface SitemapEntry {
  /** Path in the German tree. */
  de: string;
  /** Path in the English tree. */
  en: string;
  changefreq: "weekly" | "monthly";
  priority: number;
}

/**
 * Every indexable page of this site.
 *
 * **An entry may only be added when BOTH trees really serve it.** The
 * alternates below are emitted from each side, so a page listed here without
 * its twin points `hreflang` at a 404 — which invalidates the whole set, the
 * German side included. That is why `/install`, `/legal/*`, `/404`, `/500`,
 * the OG endpoint and the vCard are absent: the first has no English twin, the
 * legal pages are `noindex`, and the rest are not pages.
 */
export const SITEMAP_ENTRIES: SitemapEntry[] = [
  { de: "/", en: "/en/", changefreq: "weekly", priority: 1.0 },
  { de: "/preise", en: "/en/preise", changefreq: "monthly", priority: 0.8 },
  ...serviceDefinitions.map((service) => ({
    de: serviceHref(service, "de"),
    en: serviceHref(service, "en"),
    changefreq: "monthly" as const,
    priority: 0.8,
  })),
];

/** Absolute URL for a path on this site. */
export function absolute(path: string): string {
  return new URL(path, siteConfig.url).href;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * The `<urlset>` document listing every indexable URL in both languages.
 *
 * Each URL carries the same de/en/x-default block, emitted from BOTH sides —
 * Search Console only treats a set as valid when the two URLs name each other,
 * and the commonest way a set goes wrong is one side pointing at a URL that
 * does not point back.
 */
export function renderUrlset(lastmod: string): string {
  const urls = SITEMAP_ENTRIES.flatMap((entry) =>
    (["de", "en"] as const).map((lang) => {
      const loc = absolute(entry[lang]);
      const alternates = [
        `<xhtml:link rel="alternate" hreflang="de-DE" href="${escapeXml(absolute(entry.de))}"/>`,
        `<xhtml:link rel="alternate" hreflang="en-GB" href="${escapeXml(absolute(entry.en))}"/>`,
        `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absolute(entry.de))}"/>`,
      ].join("");
      return [
        "<url>",
        `<loc>${escapeXml(loc)}</loc>`,
        alternates,
        `<lastmod>${escapeXml(lastmod)}</lastmod>`,
        `<changefreq>${entry.changefreq}</changefreq>`,
        `<priority>${entry.priority.toFixed(1)}</priority>`,
        "</url>",
      ].join("");
    }),
  ).join("");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    urls +
    "</urlset>"
  );
}

/**
 * The index document.
 *
 * A single-child index looks redundant, but the filename is what
 * `public/robots.txt` advertises and what Search Console already knows —
 * `@astrojs/sitemap` produced exactly this pair, and changing the entry point
 * would silently orphan the registered one.
 */
export function renderSitemapIndex(lastmod: string): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    "<sitemap>" +
    `<loc>${escapeXml(absolute("/sitemap-0.xml"))}</loc>` +
    `<lastmod>${escapeXml(lastmod)}</lastmod>` +
    "</sitemap>" +
    "</sitemapindex>"
  );
}
