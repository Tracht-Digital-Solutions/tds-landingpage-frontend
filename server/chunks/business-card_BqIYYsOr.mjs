import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { A as renderTemplate, w as renderComponent } from "./sequence_Dep2b-2O.mjs";
import { n as createComponent } from "./compiler_C1nVjdt_.mjs";
import { t as $$BusinessCardPage } from "./BusinessCardPage_DOq3sMi4.mjs";
// src/pages/en/business-card.astro
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
// \0virtual:astro:page:src/pages/en/business-card@_@astro
var page = () => business_card_exports;
export { page };
