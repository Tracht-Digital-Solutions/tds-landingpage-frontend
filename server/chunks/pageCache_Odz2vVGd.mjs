import { a as resolveCacheDirs, i as pageCache, r as forLanguages, t as contentCache } from "./contentCache_DmiZs_tG.mjs";
import { a as serviceDefinitions, h as BUSINESS_CARD_SLUG, o as serviceHref } from "./services_Bv7bmOO1.mjs";
import { r as connection } from "./connection_DyK1K_dS.mjs";
//#region src/lib/cache.ts
/**
* This site's half of the page cache: which pages a content change dates.
*
* The memo a rebuild throws away lives in `contentCache.ts` and is re-exported
* here, so a content fetch never has to import this route table.
*
* The API sends *what changed* (`{type:"block", id:"hero", lang:"de"}`); this
* file answers *which of my pages that is*. Keeping the answer here rather
* than in the API is deliberate — see the note in
* `@tracht-digital-solutions/tds-shared/cache`.
*/
/** Every page that shows editable landing content, per language. */
function contentPages(lang) {
	return [
		...lang === "de" ? ["/", "/preise"] : ["/en/", "/en/preise"],
		...serviceDefinitions.map((service) => serviceHref(service, lang)),
		BUSINESS_CARD_SLUG[lang]
	];
}
function homePages(lang) {
	return [lang === "de" ? "/" : "/en/"];
}
/** Where a legal document is published, per key and language. */
function legalPages(key, lang) {
	const prefix = lang === "de" ? "" : "/en";
	return [`${prefix}/legal/${key}`, `${prefix}/legal/${key}.pdf`];
}
/**
* The route table, as the cache sees it.
*
* Unlisted event types are reported back to the caller rather than ignored —
* a `tool` event legitimately reaches this site and dates nothing here, but a
* *typo* in an event type would otherwise be a silent no-op.
*/
var cacheEvents = {
	/** A landing content block was saved or deleted. */
	block: (event) => {
		if (event.id === "legal_impressum" || event.id === "legal_datenschutz") {
			const slug = event.id.replace("legal_", "");
			return forLanguages(event, (lang) => lang === "de" ? [`/legal/${slug}`] : []);
		}
		return forLanguages(event, contentPages);
	},
	/** A legal PDF was uploaded, replaced or removed. */
	legal: (event) => forLanguages(event, (lang) => legalPages(event.id ?? "agb", lang)),
	/**
	* A blog post changed.
	*
	* This is not the blog — but the home page's Journal section
	* read `/content/blog` at render time, so a published post changes this site
	* too. Missing that is how the marketing page ends up advertising last
	* month's articles.
	*/
	post: (event) => forLanguages(event, homePages),
	/**
	* The sitemap exclusion list changed.
	*
	* The widest event this site has, and it has to be. The list moves TWO
	* things: the sitemap, and the `robots` meta of every page that entered or
	* left it. Rebuilding only the sitemap would leave the excluded page itself
	* serving its old, indexable head out of cache — the omission visible in the
	* XML, the `noindex` nowhere, and nothing red.
	*
	* A pattern may be a prefix, so which pages it covers is not knowable from
	* the event. `contentPages` is the whole indexable inventory, which is
	* exactly the set a new `noindex` might have to reach.
	*/
	sitemap: (event) => forLanguages(event, (lang) => [
		...contentPages(lang),
		"/sitemap-0.xml",
		"/sitemap-index.xml"
	])
};
/**
* Pages a "rebuild everything" must include even when nothing is cached yet.
*
* The cache can only enumerate what it already holds, so without this a
* rebuild on a cold cache would report success having rendered nothing.
*
* The sitemap is in the list now that it renders on demand: it used to be
* prerendered, so there was nothing to invalidate, and the panel's exclusion
* list is exactly the thing that made that untrue.
*/
var alwaysPaths = [
	"/",
	"/en/",
	"/preise",
	"/en/preise",
	...serviceDefinitions.flatMap((service) => [serviceHref(service, "de"), serviceHref(service, "en")]),
	BUSINESS_CARD_SLUG.de,
	BUSINESS_CARD_SLUG.en,
	"/sitemap-0.xml",
	"/sitemap-index.xml"
];
//#endregion
//#region src/lib/pageCache.ts
/**
* The one page-cache instance this site uses.
*
* Both halves must share it — the middleware that stores renders and the
* control endpoint that triggers them read the same store, the same token and
* the same event map. Two instances would each work in isolation and disagree
* about everything that matters.
*/
var siteCache = pageCache({
	...resolveCacheDirs({ logger: (m) => console.warn(`[tds-landingpage] ${m}`) }),
	events: cacheEvents,
	alwaysPaths,
	tokenProvider: () => connection.cacheToken(),
	onInvalidate: () => contentCache.invalidate(),
	logger: (message) => console.warn(`[tds-landingpage] ${message}`)
});
//#endregion
export { siteCache as t };
