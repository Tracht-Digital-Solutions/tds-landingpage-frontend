import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { B as createAstro } from "./sequence_CrsIaRJD.mjs";
import { t as createComponent } from "./compiler_BDfTnRdB.mjs";
//#region src/pages/preise.astro
var preise_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Preise,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://tracht-digital.de");
var $$Preise = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Preise;
	return Astro.redirect("/#preise", 301);
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/preise.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/preise.astro";
var $$url = "/preise";
//#endregion
//#region \0virtual:astro:page:src/pages/preise@_@astro
var page = () => preise_exports;
//#endregion
export { page };
