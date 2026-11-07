import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { O as renderTemplate, S as renderComponent } from "./sequence_-pfDyphk.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import "./compiler_BVs5vHf6.mjs";
import { t as $$ProjectsPage } from "./ProjectsPage_D2704QVZ.mjs";
// src/pages/projekte.astro
var projekte_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Projekte,
	file: () => $$file,
	url: () => $$url
});
var $$Projekte = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "ProjectsPage", $$ProjectsPage, { "lang": "de" })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/projekte.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/projekte.astro";
var $$url = "/projekte";
// \0virtual:astro:page:src/pages/projekte@_@astro
var page = () => projekte_exports;
export { page };
