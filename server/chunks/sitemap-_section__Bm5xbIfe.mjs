import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as isSitemapSection } from "./sitemapSections_C2iJeOpf.mjs";
import { a as renderUrlset, o as sectionOf, s as sitemapEntries } from "./sitemap_C38SXlK7.mjs";
//#region src/pages/sitemap-[section].xml.ts
var sitemap__section__xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params }) => {
	if (!isSitemapSection(params.section)) return new Response(null, { status: 404 });
	const entries = (await sitemapEntries()).filter((e) => sectionOf(e) === params.section);
	if (entries.length === 0) return new Response(null, { status: 404 });
	return new Response(renderUrlset(entries), { headers: { "content-type": "application/xml; charset=utf-8" } });
};
//#endregion
//#region \0virtual:astro:page:src/pages/sitemap-[section].xml@_@ts
var page = () => sitemap__section__xml_exports;
//#endregion
export { page };
