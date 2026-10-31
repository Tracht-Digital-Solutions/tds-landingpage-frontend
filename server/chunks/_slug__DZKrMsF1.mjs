import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, k as renderTemplate } from "./sequence_Bm7JS2R8.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import { t as createAstro } from "./compiler_Cjdbm8vR.mjs";
import { n as $$PlatformDetailPage, r as $$ServiceDetailPage, t as $$ErrorView } from "./ErrorView_RJOI-JP2.mjs";
import { t as $$Layout } from "./Layout_Dprg3ehF.mjs";
import { c as retiredServiceTarget, o as getServiceBySlug, s as resolveServiceContent, v as getPlatformBySlug } from "./sitemapSections_BCT2ePl9.mjs";
// src/pages/leistungen/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://tracht-digital.de");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const lang = "de";
	const retired = retiredServiceTarget(lang, Astro.params.slug);
	if (retired) return Astro.redirect(retired, 301);
	const service = getServiceBySlug(lang, Astro.params.slug);
	const platform = service ? void 0 : getPlatformBySlug(Astro.params.slug);
	const content = service ? await resolveServiceContent(service, lang) : void 0;
	if (!service && !platform) Astro.response.status = 404;
	return renderTemplate`${service && content ? renderTemplate`${renderComponent($$result, "ServiceDetailPage", $$ServiceDetailPage, {
		"service": service,
		"content": content,
		"lang": lang
	})}` : platform ? renderTemplate`${renderComponent($$result, "PlatformDetailPage", $$PlatformDetailPage, {
		"platform": platform,
		"lang": lang
	})}` : renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "404 · Seite nicht gefunden",
		"lang": lang,
		"bare": true,
		"noindex": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "ErrorView", $$ErrorView, { "code": "404" })}` })}`}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/leistungen/[slug].astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/leistungen/[slug].astro";
var $$url = "/leistungen/[slug]";
// \0virtual:astro:page:src/pages/leistungen/[slug]@_@astro
var page = () => _slug__exports;
export { page };
