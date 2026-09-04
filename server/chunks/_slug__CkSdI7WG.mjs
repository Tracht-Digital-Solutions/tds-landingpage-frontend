import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, B as createAstro, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { t as $$Layout } from "./Layout_V8d2QaQ-.mjs";
import { i as retiredServiceTarget, n as getServiceBySlug, r as resolveServiceContent } from "./services_Bv7bmOO1.mjs";
import { n as $$ServiceDetailPage, t as $$ErrorView } from "./ErrorView_LrldFFay.mjs";
//#region src/pages/leistungen/[slug].astro
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
	const content = service ? await resolveServiceContent(service, lang) : void 0;
	if (!service) Astro.response.status = 404;
	return renderTemplate`${service && content ? renderTemplate`${renderComponent($$result, "ServiceDetailPage", $$ServiceDetailPage, {
		"service": service,
		"content": content,
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
//#endregion
//#region \0virtual:astro:page:src/pages/leistungen/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
