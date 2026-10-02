import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as sitemapEntries, i as renderUrlset } from "./sitemap_WH9G0bFJ.mjs";
//#region src/pages/sitemap-0.xml.ts
var sitemap_0_xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => new Response(renderUrlset(await sitemapEntries()), { headers: { "content-type": "application/xml; charset=utf-8" } });
//#endregion
//#region \0virtual:astro:page:src/pages/sitemap-0.xml@_@ts
var page = () => sitemap_0_xml_exports;
//#endregion
export { page };
