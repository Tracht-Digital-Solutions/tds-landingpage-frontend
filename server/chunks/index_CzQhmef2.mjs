import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, B as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { a as $$Journal, c as $$Showcase, d as Hero, i as $$Consulting, l as $$Services, n as $$FAQ, o as $$Process, r as getFaqContent, s as $$PricingTeaser, t as $$Contact, u as $$About } from "./Contact_45AW8EYj.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { c as tFor, s as resolveLang, t as $$Layout } from "./Layout_V8d2QaQ-.mjs";
import { l as siteConfig, u as cmsFor } from "./services_Bv7bmOO1.mjs";
import { a as organizationSchema, c as speakableSchema, d as $$Header, i as howToSchema, l as websiteSchema, o as personSchema, r as faqPageSchema, t as asGraph, u as $$Footer } from "./jsonld_B_PfucTA.mjs";
import { c as getHomeContent } from "./BusinessCardTile_h87uEk04.mjs";
//#region src/pages/en/index.astro
var en_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => "/en"
});
createAstro("https://tracht-digital.de");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const lang = resolveLang(Astro.currentLocale);
	const t = tFor(Astro.currentLocale);
	const hero = await cmsFor("home_hero", lang, getHomeContent(lang).hero);
	const faq = await cmsFor("faq_v2", lang, getFaqContent(lang));
	const process = await cmsFor("process", lang, {
		headline: t.process.headline,
		headlineAccent: t.process.headlineAccent,
		steps: t.process.steps
	});
	const jsonLd = asGraph(organizationSchema(), personSchema(), websiteSchema(), faqPageSchema(faq.items), howToSchema(`${process.headline} ${process.headlineAccent}`, process.steps), {
		"@type": "WebPage",
		"@id": `${siteConfig.url}/#webpage-${lang}`,
		url: lang === "de" ? siteConfig.url : `${siteConfig.url}/en`,
		inLanguage: lang === "de" ? "de-DE" : "en-GB",
		isPartOf: { "@id": `${siteConfig.url}/#website` },
		primaryImageOfPage: `${siteConfig.url}/og/default.png`,
		speakable: speakableSchema(["#hero-heading", "[aria-labelledby='digital-responsibility-heading']"])
	});
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": {
			de: "Digitalisierung für Unternehmen — Tracht Digital Solutions",
			en: "Digitalization for Businesses — Tracht Digital Solutions"
		}[lang],
		"description": siteConfig.description[lang],
		"lang": lang,
		"jsonLd": jsonLd
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main id="main">${renderComponent($$result, "Hero", Hero, {
		"client:load": true,
		"lang": lang,
		"hero": hero,
		"client:component-hydration": "load",
		"client:component-path": "~/components/islands/Hero.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "About", $$About, {})}${renderComponent($$result, "Services", $$Services, {})}${renderComponent($$result, "Showcase", $$Showcase, {})}${renderComponent($$result, "Consulting", $$Consulting, {})}${renderComponent($$result, "Process", $$Process, {})}${renderComponent($$result, "PricingTeaser", $$PricingTeaser, {})}${renderComponent($$result, "Journal", $$Journal, {})}${renderComponent($$result, "FAQ", $$FAQ, {})}${renderComponent($$result, "Contact", $$Contact, {})}</main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/index.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/en/index@_@astro
var page = () => en_exports;
//#endregion
export { page };
