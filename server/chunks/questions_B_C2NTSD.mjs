import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, k as renderTemplate } from "./sequence_Bm7JS2R8.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import "./compiler_Cjdbm8vR.mjs";
import { t as $$QuestionsPage } from "./QuestionsPage_DQ3GyA-C.mjs";
// src/pages/en/questions.astro
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
// \0virtual:astro:page:src/pages/en/questions@_@astro
var page = () => questions_exports;
export { page };
