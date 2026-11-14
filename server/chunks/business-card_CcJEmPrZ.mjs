import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { T as renderComponent, j as renderTemplate } from "./sequence_BJTD5713.mjs";
import { t as createComponent } from "./astro-component_Bf647iZ6.mjs";
import "./compiler_CC8dBrdY.mjs";
import { t as $$BusinessCardPage } from "./BusinessCardPage_D9JCntS5.mjs";
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
