import { a as memoisedOr, c as newestDay, l as renderSectionedSitemapIndex, n as readContentJson, o as escapeXml } from "./contentFetch_JZicQrPO.mjs";
import { O as CREDENTIALS_SLUG, S as FAQ_PAGE_UPDATED_AT, U as BUSINESS_CARD_SLUG, b as platformHref, i as sectionPath, k as CREDENTIALS_UPDATED_AT, l as serviceDefinitions, n as SITEMAP_SECTIONS, q as siteConfig, u as serviceHref, x as FAQ_PAGE_SLUG, y as platformDefinitions } from "./sitemapSections_B_rjjcBB.mjs";
import { i as contentApiBase } from "./connection_Bw0diyws.mjs";
//#region src/lib/sitemapExclusions.ts
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
/** This site's id in the panel's site registry. */
var SITE_ID = "landingpage";
/**
* Trailing slash folded away, root kept — `trailingSlash: "ignore"` in the
* Astro config, so `/preise` and `/preise/` are one page.
*
* Exported because `sitemap.ts` must fold paths the SAME way when it looks a
* URL up in the inventory: that list stores the home pages as `/` and `/en/`,
* with the slash, and a lookup that trimmed differently would simply fail to
* find them.
*/
function canonicalPath(path) {
	const value = path.trim();
	if (value === "" || value === "/") return "/";
	return value.replace(/\/+$/, "") || "/";
}
var canonical = canonicalPath;
/**
* One pattern against one path.
*
* Deliberately the same two rules the API validates and documents: an exact
* path, or a trailing `*` making it a raw prefix. Kept dumb on purpose — a
* glob library here would accept patterns the API rejects, and the
* disagreement would only ever show as a page that quietly stayed indexed.
*/
function matchesPattern(path, pattern) {
	const value = pattern.trim();
	if (value === "") return false;
	if (value.endsWith("*")) {
		const prefix = value.slice(0, -1);
		return prefix === "" || canonical(path).startsWith(prefix);
	}
	return canonical(value) === canonical(path);
}
/** Does any pattern hit any member of this hreflang group? */
function groupExcluded(paths, patterns) {
	return paths.some((path) => patterns.some((pattern) => matchesPattern(path, pattern)));
}
async function load() {
	const url = new URL(`${contentApiBase()}/sitemap-exclusions`);
	url.searchParams.set("site", SITE_ID);
	const data = await readContentJson(url);
	if (!Array.isArray(data.paths)) return [];
	return data.paths.filter((p) => typeof p === "string" && p.trim() !== "");
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
function exclusionPatterns() {
	return memoisedOr("sitemap:exclusions", load, [], "sitemap exclusions (nothing excluded)");
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
	return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\">" + entries.flatMap((entry) => ["de", "en"].map((lang) => {
		const loc = absolute(entry[lang]);
		const lastmod = entry.lastmod ?? fallbackLastmod;
		const alternates = [
			`<xhtml:link rel="alternate" hreflang="de-DE" href="${escapeXml(absolute(entry.de))}"/>`,
			`<xhtml:link rel="alternate" hreflang="en-GB" href="${escapeXml(absolute(entry.en))}"/>`,
			`<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absolute(entry.de))}"/>`
		].join("");
		const image = entry.image ? `<image:image><image:loc>${escapeXml(absolute(entry.image.loc))}</image:loc><image:title>${escapeXml(entry.image.title[lang])}</image:title></image:image>` : "";
		return [
			"<url>",
			`<loc>${escapeXml(loc)}</loc>`,
			alternates,
			image,
			lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : "",
			`<changefreq>${entry.changefreq}</changefreq>`,
			`<priority>${entry.priority.toFixed(1)}</priority>`,
			"</url>"
		].join("");
	})).join("") + "</urlset>";
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
//#endregion
export { renderUrlset as a, renderSectionIndex as i, hreflangGroup as n, sectionOf as o, isExcluded as r, sitemapEntries as s, absolute as t };
