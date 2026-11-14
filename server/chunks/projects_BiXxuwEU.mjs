import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { T as renderComponent, j as renderTemplate } from "./sequence_BJTD5713.mjs";
import { t as createComponent } from "./astro-component_Bf647iZ6.mjs";
import "./compiler_CC8dBrdY.mjs";
import { t as $$ProjectsPage } from "./ProjectsPage_Bobj5oMU.mjs";
// src/pages/en/projects.astro
var projects_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Projects,
	file: () => $$file,
	url: () => $$url
});
var $$Projects = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "ProjectsPage", $$ProjectsPage, { "lang": "en" })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/projects.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/projects.astro";
var $$url = "/en/projects";
// \0virtual:astro:page:src/pages/en/projects@_@astro
var page = () => projects_exports;
export { page };
