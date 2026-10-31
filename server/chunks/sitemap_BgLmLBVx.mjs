import { O as CREDENTIALS_SLUG, S as FAQ_PAGE_UPDATED_AT, U as BUSINESS_CARD_SLUG, b as platformHref, i as sectionPath, k as CREDENTIALS_UPDATED_AT, l as serviceDefinitions, n as SITEMAP_SECTIONS, q as siteConfig, u as serviceHref, x as FAQ_PAGE_SLUG, y as platformDefinitions } from "./sitemapSections_BCT2ePl9.mjs";
import { c as groupExcluded, d as renderSectionedSitemapIndex, f as renderUrlset$1, i as canonicalPath, o as createSitemapExclusions, r as memoisedOr, t as readContentJson, u as newestDay } from "./siteKey_DkoG8XIf.mjs";
import { i as contentApiBase } from "./connection_BTKKGuV2.mjs";
/**
* The patterns, memoised for the render generation. Through the generation
* cache rather than a module-level promise, which would live as long as the
* SSR server and never see an exclusion added later. Failures exclude nothing.
*/
var exclusionPatterns = createSitemapExclusions({
	siteId: "landingpage",
	contentBase: contentApiBase,
	read: (url) => readContentJson(new URL(url)),
	memo: memoisedOr,
	disabled: true
}).exclusionPatterns;
// src/lib/sitemap.ts
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
/**
* Every indexable page of this site.
*
* **An entry may only be added when BOTH trees really serve it.** The
* alternates below are emitted from each side, so a page listed here without
* its twin points `hreflang` at a 404 — which invalidates the whole set, the
* German side included. That is why `/install`, `/legal/*`, `/404`, `/500`,
* the OG endpoint and the vCard are absent: the first has no English twin, the
* legal pages are `noindex`, and the rest are not pages. The business CARD is
* listed — it is a real page in both trees; the `.vcf` beside it is not.
*/
var SITEMAP_ENTRIES = [
	{
		de: "/",
		en: "/en/",
		changefreq: "weekly",
		priority: 1
	},
	{
		de: BUSINESS_CARD_SLUG.de,
		en: BUSINESS_CARD_SLUG.en,
		changefreq: "monthly",
		priority: .5
	},
	{
		de: CREDENTIALS_SLUG.de,
		en: CREDENTIALS_SLUG.en,
		changefreq: "monthly",
		priority: .6,
		lastmod: CREDENTIALS_UPDATED_AT
	},
	{
		de: FAQ_PAGE_SLUG.de,
		en: FAQ_PAGE_SLUG.en,
		changefreq: "monthly",
		priority: .6,
		lastmod: FAQ_PAGE_UPDATED_AT
	},
	...serviceDefinitions.map((service) => ({
		de: serviceHref(service, "de"),
		en: serviceHref(service, "en"),
		section: "services",
		...service.image ? { image: {
			loc: service.image,
			title: {
				de: service.fallback.de.title,
				en: service.fallback.en.title
			}
		} } : {},
		changefreq: "monthly",
		priority: .8,
		lastmod: service.updatedAt
	})),
	...platformDefinitions.map((platform) => ({
		de: platformHref(platform, "de"),
		en: platformHref(platform, "en"),
		section: "platforms",
		changefreq: "monthly",
		priority: .7,
		lastmod: platform.updatedAt
	}))
];
SITEMAP_ENTRIES[0].lastmod = SITEMAP_ENTRIES.map((e) => e.lastmod).filter((d) => Boolean(d)).sort().at(-1);
/**
* Both URLs of the page this path belongs to.
*
* Read from the inventory rather than derived: `/leistungen/<slug.de>` pairs
* with `/en/services/<slug.en>`, a different segment AND a different slug, so
* no prefix rule could produce it. A path that is not in the inventory is its
* own group — it has no twin in the sitemap to strand.
*/
function hreflangGroup(pathname) {
	const path = canonicalPath(pathname);
	const entry = SITEMAP_ENTRIES.find((e) => canonicalPath(e.de) === path || canonicalPath(e.en) === path);
	return entry ? [entry.de, entry.en] : [pathname];
}
/**
* The entries that actually go in the sitemap.
*
* `SITEMAP_ENTRIES` stays the full, code-owned inventory — `cache.ts` derives
* `alwaysPaths` from it, and a rebuild must still be able to render a page the
* panel has merely hidden from search.
*/
async function sitemapEntries() {
	const patterns = await exclusionPatterns();
	if (patterns.length === 0) return SITEMAP_ENTRIES;
	return SITEMAP_ENTRIES.filter((entry) => !groupExcluded([entry.de, entry.en], patterns));
}
/** Is this page excluded — counting its twin in the other tree as the same page? */
async function isExcluded(pathname) {
	const patterns = await exclusionPatterns();
	if (patterns.length === 0) return false;
	return groupExcluded(hreflangGroup(pathname), patterns);
}
/** Absolute URL for a path on this site. */
function absolute(path) {
	return new URL(path, siteConfig.url).href;
}
/**
* The `<urlset>` document listing every indexable URL in both languages.
*
* Each URL carries the same de/en/x-default block, emitted from BOTH sides —
* Search Console only treats a set as valid when the two URLs name each other,
* and the commonest way a set goes wrong is one side pointing at a URL that
* does not point back.
*
* Takes the entries rather than reading the constant, so the caller decides
* whether the panel's exclusions have been applied — and so the rendering can
* be tested against a fixed list instead of the live inventory.
*/
function renderUrlset(entries, fallbackLastmod) {
	return renderUrlset$1(entries.flatMap((entry) => ["de", "en"].map((lang) => ({
		loc: absolute(entry[lang]),
		alternates: {
			de: absolute(entry.de),
			en: absolute(entry.en)
		},
		image: entry.image ? {
			loc: absolute(entry.image.loc),
			title: entry.image.title[lang]
		} : void 0,
		lastmod: entry.lastmod ?? fallbackLastmod,
		changefreq: entry.changefreq,
		priority: entry.priority
	}))));
}
/** The section an entry belongs to — general pages carry none. */
function sectionOf(entry) {
	return entry.section ?? "pages";
}
/**
* The sectioned index (2026-10-06): one child per non-empty section, each with
* the newest real date inside it (none when nothing there carries one).
*/
function renderSectionIndex(entries) {
	return renderSectionedSitemapIndex(SITEMAP_SECTIONS.flatMap((section) => {
		const inSection = entries.filter((e) => sectionOf(e) === section);
		if (inSection.length === 0) return [];
		return [{
			loc: absolute(sectionPath(section)),
			lastmod: newestDay(inSection.map((e) => e.lastmod))
		}];
	}));
}
export { renderUrlset as a, renderSectionIndex as i, hreflangGroup as n, sectionOf as o, isExcluded as r, sitemapEntries as s, absolute as t };
