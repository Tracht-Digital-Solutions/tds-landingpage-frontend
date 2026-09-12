import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { B as createAstro } from "./sequence_CrsIaRJD.mjs";
import { t as createComponent } from "./compiler_BDfTnRdB.mjs";
//#region src/pages/kontakt.astro
var kontakt_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Kontakt,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://tracht-digital.de");
var $$Kontakt = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Kontakt;
	return Astro.redirect("/#contact", 301);
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/kontakt.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/kontakt.astro";
var $$url = "/kontakt";
//#endregion
//#region \0virtual:astro:page:src/pages/kontakt@_@astro
var page = () => kontakt_exports;
//#endregion
export { page };
