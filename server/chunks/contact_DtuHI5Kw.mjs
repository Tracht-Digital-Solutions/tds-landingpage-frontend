import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { n as createComponent, t as createAstro } from "./compiler_C1nVjdt_.mjs";
// src/pages/en/contact.astro
var contact_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Contact,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://tracht-digital.de");
var $$Contact = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Contact;
	return Astro.redirect("/en/#contact", 301);
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/contact.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/contact.astro";
var $$url = "/en/contact";
// \0virtual:astro:page:src/pages/en/contact@_@astro
var page = () => contact_exports;
export { page };
