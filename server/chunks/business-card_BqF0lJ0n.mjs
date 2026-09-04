import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { t as $$BusinessCardPage } from "./BusinessCardPage_CldOaIR3.mjs";
//#region src/pages/en/business-card.astro
var business_card_exports = /* @__PURE__ */ __exportAll({
	default: () => $$BusinessCard,
	file: () => $$file,
	url: () => $$url
});
var $$BusinessCard = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BusinessCardPage", $$BusinessCardPage, { "lang": "en" })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/business-card.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/business-card.astro";
var $$url = "/en/business-card";
//#endregion
//#region \0virtual:astro:page:src/pages/en/business-card@_@astro
var page = () => business_card_exports;
//#endregion
export { page };
