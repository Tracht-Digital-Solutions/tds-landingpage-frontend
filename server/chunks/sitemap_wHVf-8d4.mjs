import { t as contentCache } from "./contentCache_DmiZs_tG.mjs";
import { a as serviceDefinitions, h as BUSINESS_CARD_SLUG, l as siteConfig, o as serviceHref } from "./services_Bv7bmOO1.mjs";
import "./connection_DyK1K_dS.mjs";
//#region src/lib/sitemapExclusions.ts
function canonicalPath(path) {
	const value = path.trim();
	if (value === "" || value === "/") return "/";
	return value.replace(/\/+$/, "") || "/";
}
var canonical = canonicalPath;
function matchesPattern(path, pattern) {
	const value = pattern.trim();
	if (value === "") return false;
	if (value.endsWith("*")) {
		const prefix = value.slice(0, -1);
		return prefix === "" || canonical(path).startsWith(prefix);
	}
	return canonical(value) === canonical(path);
}
function groupExcluded(paths, patterns) {
	return paths.some((path) => patterns.some((pattern) => matchesPattern(path, pattern)));
}
async function load() {
	return [];
}
function exclusionPatterns() {
	return contentCache.get("sitemap:exclusions", load);
}
//#endregion
//#region src/lib/sitemap.ts
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
		de: "/preise",
		en: "/en/preise",
		changefreq: "monthly",
		priority: .8
	},
	{
		de: BUSINESS_CARD_SLUG.de,
		en: BUSINESS_CARD_SLUG.en,
		changefreq: "monthly",
		priority: .5
	},
	...serviceDefinitions.map((service) => ({
		de: serviceHref(service, "de"),
		en: serviceHref(service, "en"),
		changefreq: "monthly",
		priority: .8
	}))
];
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
function escapeXml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
function renderUrlset(entries, lastmod) {
	return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">" + entries.flatMap((entry) => ["de", "en"].map((lang) => {
		const loc = absolute(entry[lang]);
		const alternates = [
			`<xhtml:link rel="alternate" hreflang="de-DE" href="${escapeXml(absolute(entry.de))}"/>`,
			`<xhtml:link rel="alternate" hreflang="en-GB" href="${escapeXml(absolute(entry.en))}"/>`,
			`<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absolute(entry.de))}"/>`
		].join("");
		return [
			"<url>",
			`<loc>${escapeXml(loc)}</loc>`,
			alternates,
			`<lastmod>${escapeXml(lastmod)}</lastmod>`,
			`<changefreq>${entry.changefreq}</changefreq>`,
			`<priority>${entry.priority.toFixed(1)}</priority>`,
			"</url>"
		].join("");
	})).join("") + "</urlset>";
}
//#endregion
export { renderUrlset as n, sitemapEntries as r, isExcluded as t };
