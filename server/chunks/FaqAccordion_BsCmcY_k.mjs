import { A as maybeRenderHead, M as addAttribute, k as renderTemplate } from "./sequence_Bm7JS2R8.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import { t as createAstro } from "./compiler_Cjdbm8vR.mjs";
import { m as renderScript } from "./Layout_Dprg3ehF.mjs";
// src/components/ui/FaqAccordion.astro
createAstro("https://tracht-digital.de");
var $$FaqAccordion = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FaqAccordion;
	const { items, name = "faq" } = Astro.props;
	return renderTemplate`${items.map((item, i) => renderTemplate`${maybeRenderHead($$result)}<details${addAttribute(name, "name")}${addAttribute(i === 0, "open")} class="faq-item tds-disclosure" data-reveal data-astro-cid-g3uyybff><summary class="faq-summary" data-astro-cid-g3uyybff><span class="faq-q" data-astro-cid-g3uyybff>${item.q}</span><span aria-hidden="true" class="faq-chevron" data-astro-cid-g3uyybff><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-g3uyybff><polyline points="9 6 15 12 9 18" data-astro-cid-g3uyybff></polyline></svg></span></summary><p class="faq-a" data-astro-cid-g3uyybff>${item.a}</p></details>`)}${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/FaqAccordion.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/FaqAccordion.astro", void 0);
export { $$FaqAccordion as t };
