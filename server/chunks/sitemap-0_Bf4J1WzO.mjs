import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { a as renderUrlset, s as sitemapEntries } from "./sitemap_DZF-RY6o.mjs";
// src/pages/sitemap-0.xml.ts
var sitemap_0_xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => new Response(renderUrlset(await sitemapEntries()), { headers: { "content-type": "application/xml; charset=utf-8" } });
// \0virtual:astro:page:src/pages/sitemap-0.xml@_@ts
var page = () => sitemap_0_xml_exports;
export { page };
