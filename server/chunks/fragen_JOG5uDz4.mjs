import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { O as renderTemplate, S as renderComponent } from "./sequence_-pfDyphk.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import "./compiler_BVs5vHf6.mjs";
import { t as $$QuestionsPage } from "./QuestionsPage_CclMDItB.mjs";
// src/pages/fragen.astro
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
// \0virtual:astro:page:src/pages/fragen@_@astro
var page = () => fragen_exports;
export { page };
