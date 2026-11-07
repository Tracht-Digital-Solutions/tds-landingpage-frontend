import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { O as renderTemplate, S as renderComponent } from "./sequence_-pfDyphk.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import "./compiler_BVs5vHf6.mjs";
import { t as $$ProjectsPage } from "./ProjectsPage_BYAbsall.mjs";
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
