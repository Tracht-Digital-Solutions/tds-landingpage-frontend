import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, B as createAstro, w as renderComponent } from "./sequence_BMhx82Vm.mjs";
import { t as createComponent } from "./compiler_CXeQXDPg.mjs";
import { t as $$Layout } from "./Layout_B749k1M0.mjs";
import { i as retiredServiceTarget, n as getServiceBySlug, p as getPlatformBySlug, r as resolveServiceContent } from "./services_CP3nOvK5.mjs";
import { n as $$PlatformDetailPage, r as $$ServiceDetailPage, t as $$ErrorView } from "./ErrorView_D_VwB0aC.mjs";
//#region src/pages/en/services/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://tracht-digital.de");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const lang = "en";
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
		"title": "404 · Page not found",
		"lang": lang,
		"bare": true,
		"noindex": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "ErrorView", $$ErrorView, { "code": "404" })}` })}`}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/services/[slug].astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/services/[slug].astro";
var $$url = "/en/services/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/en/services/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
