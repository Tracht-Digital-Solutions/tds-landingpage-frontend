import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { t as $$LegalDocPage } from "./LegalDocPage_CIFlhLzM.mjs";
//#region src/pages/legal/agb.astro
var agb_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Agb,
	file: () => $$file,
	url: () => $$url
});
var $$Agb = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "LegalDocPage", $$LegalDocPage, {
		"docKey": "agb",
		"lang": "de"
	})}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/legal/agb.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/legal/agb.astro";
var $$url = "/legal/agb";
//#endregion
//#region \0virtual:astro:page:src/pages/legal/agb@_@astro
var page = () => agb_exports;
//#endregion
export { page };
