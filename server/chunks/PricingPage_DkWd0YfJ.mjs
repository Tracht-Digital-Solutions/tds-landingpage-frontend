import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { o as localizePath, t as $$Layout } from "./Layout_V8d2QaQ-.mjs";
import { a as serviceDefinitions, l as siteConfig, o as serviceHref, r as resolveServiceContent } from "./services_Bv7bmOO1.mjs";
import { d as $$Header, n as breadcrumbSchema, s as pricingSchema, u as $$Footer } from "./jsonld_B_PfucTA.mjs";
import { i as $$AccentLetters, n as getServiceRate, r as $$Emphasis, t as getPricingContent } from "./pricing_CELklk53.mjs";
//#region src/components/PricingPage.astro
createAstro("https://tracht-digital.de");
var $$PricingPage = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PricingPage;
	const { lang } = Astro.props;
	const pricing = await getPricingContent(lang);
	const services = await Promise.all(serviceDefinitions.map(async (definition) => ({
		definition,
		content: await resolveServiceContent(definition, lang)
	})));
	const formatRate = (rate) => new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-IE", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0
	}).format(rate);
	const homeHref = localizePath("/", lang);
	const pricingPath = localizePath("/preise", lang);
	const contactHref = `${homeHref}#contact`;
	const detailsLabel = lang === "de" ? "Leistung im Detail" : "Service details";
	const pageDescriptions = {
		de: "Nettostundensätze für Beratung und Konzeption, Prozessoptimierung, individuelle Lösungen und den Webauftritt mit Webshop und Marketing.",
		en: "Net hourly rates for consulting and planning, process optimisation, tailored solutions, and web presence including online shop and marketing."
	};
	const jsonLd = [pricingSchema(services.map(({ definition, content }) => ({
		name: content.title,
		description: content.summary,
		rate: getServiceRate(pricing, definition.id)
	}))), breadcrumbSchema([{
		name: "Home",
		url: `${siteConfig.url}${homeHref}`
	}, {
		name: pricing.label.replace(/^—\s*/, ""),
		url: `${siteConfig.url}${pricingPath}`
	}])];
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${pricing.label.replace(/^—\s*/, "")} — Tracht Digital Solutions`,
		"description": pageDescriptions[lang],
		"lang": lang,
		"jsonLd": jsonLd,
		"data-astro-cid-ltqv7bgc": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, { "data-astro-cid-ltqv7bgc": true })}${maybeRenderHead($$result)}<main id="main" class="tds-wash min-h-screen bg-[var(--color-paper)] relative overflow-hidden" data-astro-cid-ltqv7bgc><div class="page-flyin relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-36 pb-20 md:pt-44 md:pb-28" data-astro-cid-ltqv7bgc><a${addAttribute(homeHref, "href")} class="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2 group mb-12" data-astro-cid-ltqv7bgc><span aria-hidden="true" class="group-hover:-translate-x-0.5 transition-transform" data-astro-cid-ltqv7bgc>←</span>${pricing.back}</a><h1 class="display text-5xl md:text-6xl lg:text-7xl text-[var(--color-black)] mb-6 max-w-5xl" data-astro-cid-ltqv7bgc>${pricing.headline} ${renderComponent($$result, "AccentLetters", $$AccentLetters, {
		"text": pricing.headlineAccent,
		"data-astro-cid-ltqv7bgc": true
	})}</h1><p class="text-lg text-[var(--color-muted)] max-w-3xl mb-16 leading-relaxed" data-astro-cid-ltqv7bgc>${renderComponent($$result, "Emphasis", $$Emphasis, {
		"text": pricing.sub,
		"data-astro-cid-ltqv7bgc": true
	})}</p><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16" data-astro-cid-ltqv7bgc>${services.map(({ definition, content }) => {
		const rate = getServiceRate(pricing, definition.id);
		return renderTemplate`<article data-reveal class="relative rounded-[6px] p-7 flex flex-col bg-[var(--color-soft)]" data-astro-cid-ltqv7bgc><h2 class="font-[var(--font-display)] text-2xl mb-3 text-[var(--color-black)]" data-astro-cid-ltqv7bgc>${content.title}</h2><div class="flex items-baseline gap-2 mb-5 min-h-12" data-astro-cid-ltqv7bgc><span class="font-[var(--font-display)] font-medium tabular-nums text-4xl text-[var(--color-primary)]" data-astro-cid-ltqv7bgc>${formatRate(rate)}</span><span class="text-sm text-[var(--color-muted)]" data-astro-cid-ltqv7bgc>${pricing.hourSuffix}</span></div><p class="text-sm leading-relaxed mb-7 text-[var(--color-muted)]" data-astro-cid-ltqv7bgc>${content.summary}</p><div class="mt-auto" data-astro-cid-ltqv7bgc><p class="text-xs font-medium tracking-wider uppercase mb-3 text-[var(--color-muted)]" data-astro-cid-ltqv7bgc>${pricing.includesLabel}</p><ul class="space-y-2 mb-7" data-astro-cid-ltqv7bgc>${definition.keywords[lang].map((keyword) => renderTemplate`<li class="text-sm leading-snug flex gap-2 text-[var(--color-black)]" data-astro-cid-ltqv7bgc><span aria-hidden="true" class="text-[var(--color-accent)]" data-astro-cid-ltqv7bgc>✓</span><span data-astro-cid-ltqv7bgc>${keyword}</span></li>`)}</ul><a${addAttribute(serviceHref(definition, lang), "href")} class="inline-flex items-center gap-2 text-sm font-medium transition-colors text-[var(--color-primary)] hover:text-[var(--color-accent)]" data-astro-cid-ltqv7bgc>${detailsLabel}<span aria-hidden="true" data-astro-cid-ltqv7bgc>→</span></a></div></article>`;
	})}</div><section class="rounded-[6px] p-8 mb-16 bg-[var(--color-soft)]" aria-labelledby="pricing-notes-heading" data-astro-cid-ltqv7bgc><h2 id="pricing-notes-heading" class="font-[var(--font-display)] text-2xl text-[var(--color-black)] mb-5" data-astro-cid-ltqv7bgc>${pricing.notesTitle}</h2><ul class="grid sm:grid-cols-2 gap-x-8 gap-y-4" data-astro-cid-ltqv7bgc>${pricing.notes.map((note) => renderTemplate`<li class="text-sm text-[var(--color-black)] leading-relaxed flex gap-3" data-astro-cid-ltqv7bgc><span class="text-[var(--color-accent)]" aria-hidden="true" data-astro-cid-ltqv7bgc>—</span><span data-astro-cid-ltqv7bgc>${note}</span></li>`)}</ul></section><section class="tds-tone-navy relative overflow-hidden rounded-[6px] p-10 md:p-14 text-center" aria-labelledby="pricing-cta-heading" data-astro-cid-ltqv7bgc><span aria-hidden="true" class="tds-shape tds-shape--quarter-bl tds-shape--coral" style="top: -4rem; right: -4rem; width: 20rem; height: 20rem; --tds-decor-shape-alpha: 0.2;" data-astro-cid-ltqv7bgc></span><div class="relative" data-astro-cid-ltqv7bgc><h2 id="pricing-cta-heading" class="display text-3xl md:text-4xl text-white mb-4" data-astro-cid-ltqv7bgc>${pricing.ctaTitle}</h2><p class="text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed" data-astro-cid-ltqv7bgc>${pricing.ctaSub}</p><a${addAttribute(contactHref, "href")} class="inline-flex items-center gap-2 bg-white text-[var(--color-surface-navy)] px-7 py-3.5 rounded-[100px] text-sm font-medium hover:bg-white/85 transition-colors group" data-astro-cid-ltqv7bgc>${pricing.ctaButton}<span aria-hidden="true" class="group-hover:translate-x-0.5 transition-transform" data-astro-cid-ltqv7bgc>→</span></a></div></section></div></main>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-ltqv7bgc": true })}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/PricingPage.astro", void 0);
//#endregion
export { $$PricingPage as t };
