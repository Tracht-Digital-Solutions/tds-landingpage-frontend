import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, w as renderComponent } from "./sequence_CwpToexC.mjs";
import { t as createComponent } from "./compiler_BgboG8oT.mjs";
import { t as $$QuestionsPage } from "./QuestionsPage_CuxFyKyi.mjs";
//#region src/pages/en/questions.astro
var questions_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Questions,
	file: () => $$file,
	url: () => $$url
});
var $$Questions = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "QuestionsPage", $$QuestionsPage, { "lang": "en" })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/questions.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/questions.astro";
var $$url = "/en/questions";
//#endregion
//#region \0virtual:astro:page:src/pages/en/questions@_@astro
var page = () => questions_exports;
//#endregion
export { page };
