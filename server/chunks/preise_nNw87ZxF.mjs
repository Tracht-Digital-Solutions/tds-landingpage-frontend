import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { t as $$PricingPage } from "./PricingPage_DkWd0YfJ.mjs";
//#region src/pages/en/preise.astro
var preise_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Preise,
	file: () => $$file,
	url: () => $$url
});
var $$Preise = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PricingPage", $$PricingPage, { "lang": "en" })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/preise.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/preise.astro";
var $$url = "/en/preise";
//#endregion
//#region \0virtual:astro:page:src/pages/en/preise@_@astro
var page = () => preise_exports;
//#endregion
export { page };
