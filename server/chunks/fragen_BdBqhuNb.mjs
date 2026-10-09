import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, w as renderComponent } from "./sequence_n1BymCGP.mjs";
import { t as createComponent } from "./compiler_B89CkCkP.mjs";
import { t as $$QuestionsPage } from "./QuestionsPage_BmARr7fr.mjs";
//#region src/pages/fragen.astro
var fragen_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Fragen,
	file: () => $$file,
	url: () => $$url
});
var $$Fragen = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "QuestionsPage", $$QuestionsPage, { "lang": "de" })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/fragen.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/fragen.astro";
var $$url = "/fragen";
//#endregion
//#region \0virtual:astro:page:src/pages/fragen@_@astro
var page = () => fragen_exports;
//#endregion
export { page };
