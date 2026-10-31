import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, k as renderTemplate } from "./sequence_Bm7JS2R8.mjs";
import "./compiler_Cjdbm8vR.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import { t as $$HomePage } from "./HomePage_BNZ84bnc.mjs";
// src/pages/en/index.astro
var en_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => "/en"
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "HomePage", $$HomePage, { "lang": "en" })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/index.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/index.astro";
// \0virtual:astro:page:src/pages/en/index@_@astro
var page = () => en_exports;
export { page };
