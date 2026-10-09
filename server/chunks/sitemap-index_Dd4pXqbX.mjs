import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderSectionIndex, s as sitemapEntries } from "./sitemap_CpitPunX.mjs";
//#region src/pages/sitemap-index.xml.ts
var sitemap_index_xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => new Response(renderSectionIndex(await sitemapEntries()), { headers: { "content-type": "application/xml; charset=utf-8" } });
//#endregion
//#region \0virtual:astro:page:src/pages/sitemap-index.xml@_@ts
var page = () => sitemap_index_xml_exports;
//#endregion
export { page };
