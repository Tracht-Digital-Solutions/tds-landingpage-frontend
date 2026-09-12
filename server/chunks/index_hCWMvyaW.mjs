import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, w as renderComponent } from "./sequence_CrsIaRJD.mjs";
import { t as $$HomePage } from "./HomePage_Dmfh02pt.mjs";
import { t as createComponent } from "./compiler_BDfTnRdB.mjs";
//#region src/pages/en/index.astro
var en_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => "/en"
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "HomePage", $$HomePage, { "lang": "en" })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/index.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/en/index@_@astro
var page = () => en_exports;
//#endregion
export { page };
