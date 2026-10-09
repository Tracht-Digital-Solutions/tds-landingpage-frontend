import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_n1BymCGP.mjs";
import { t as createComponent } from "./compiler_B89CkCkP.mjs";
import { _ as localizePath, t as $$Layout } from "./Layout_C6zy917v.mjs";
import { C as faqPageHref, E as groupedFaqItems, S as FAQ_PAGE_UPDATED_AT, T as getFaqPageCopy, m as cmsFor, w as getFaqContent } from "./sitemapSections_B_rjjcBB.mjs";
import { t as absolute } from "./sitemap_CpitPunX.mjs";
import { i as organizationSchema, l as webPageNode, n as breadcrumbNode, r as faqPageSchema, t as asGraph } from "./jsonld_Yziu0Wol.mjs";
import { n as $$Footer, o as $$Header, t as $$AccentLetters } from "./AccentLetters_CgCCjpPr.mjs";
import { t as $$FaqAccordion } from "./FaqAccordion_ysKbzjvW.mjs";
import { t as $$DetailMeta } from "./DetailMeta_kqBX3QPD.mjs";
//#region src/components/QuestionsPage.astro
createAstro("https://tracht-digital.de");
var $$QuestionsPage = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$QuestionsPage;
	const { lang } = Astro.props;
	const pageDescriptions = {
		de: "Antworten zu Übernahme bestehender Seiten, Festpreisen, Dauer, Zugängen und Betreuung. Zwölf Fragen, kurz beantwortet, ohne Fachsprache.",
		en: "Answers on taking over existing sites, fixed prices, timelines, logins and support. Twelve questions, answered briefly, without the jargon."
	};
	const content = await cmsFor("faq_v2", lang, getFaqContent(lang));
	const ui = getFaqPageCopy(lang);
	const sections = groupedFaqItems(content);
	const homeHref = localizePath("/", lang);
	const contactHref = `${homeHref}#contact`;
	const pageUrl = absolute(faqPageHref(lang));
	const breadcrumbId = `${pageUrl}#breadcrumb`;
	const graph = asGraph(webPageNode({
		url: pageUrl,
		name: ui.title,
		description: pageDescriptions[lang],
		lang,
		dateModified: FAQ_PAGE_UPDATED_AT,
		breadcrumbId
	}), breadcrumbNode(breadcrumbId, [{
		name: lang === "de" ? "Startseite" : "Home",
		url: absolute(homeHref)
	}, {
		name: ui.title,
		url: pageUrl
	}]), faqPageSchema(content.items), organizationSchema());
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": ui.seoTitle,
		"description": pageDescriptions[lang],
		"lang": lang,
		"alternates": {
			de: faqPageHref("de"),
			en: faqPageHref("en")
		},
		"jsonLd": graph,
		"data-astro-cid-wkbjjgph": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, { "data-astro-cid-wkbjjgph": true })}${maybeRenderHead($$result)}<main id="main" data-astro-cid-wkbjjgph><section class="relative pt-36 pb-12 md:pt-44 md:pb-16" aria-labelledby="questions-title" data-astro-cid-wkbjjgph><div class="tds-decor" aria-hidden="true" data-astro-cid-wkbjjgph><span class="tds-shape tds-shape--quarter-tl tds-shape--navy" style="right: -8rem; bottom: -11rem; width: 29rem; height: 29rem; --tds-decor-shape-alpha: 0.12;" data-astro-cid-wkbjjgph></span></div><div class="relative lp-container" data-astro-cid-wkbjjgph><nav${addAttribute(lang === "de" ? "Seitenpfad" : "Breadcrumb", "aria-label")} class="mb-10" data-astro-cid-wkbjjgph><a${addAttribute(homeHref, "href")} class="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors group [@media(pointer:coarse)]:min-h-11" data-astro-cid-wkbjjgph><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-0.5" data-astro-cid-wkbjjgph><line x1="19" y1="12" x2="5" y2="12" data-astro-cid-wkbjjgph></line><polyline points="12 19 5 12 12 5" data-astro-cid-wkbjjgph></polyline></svg>${ui.backLabel}</a></nav><div class="max-w-3xl" data-astro-cid-wkbjjgph><h1 id="questions-title" class="display text-4xl sm:text-5xl md:text-6xl text-[var(--color-black)] leading-[1.04] mb-6" data-astro-cid-wkbjjgph>${ui.headline}${" "}${renderComponent($$result, "AccentLetters", $$AccentLetters, {
		"text": ui.headlineAccent,
		"data-astro-cid-wkbjjgph": true
	})}</h1><span aria-hidden="true" class="tds-brandbar mb-8" data-astro-cid-wkbjjgph></span><p class="lead text-[var(--color-muted)] mb-5" data-astro-cid-wkbjjgph>${ui.intro}</p><p class="text-[var(--color-muted)] leading-relaxed" data-astro-cid-wkbjjgph>${ui.answer}</p>${renderComponent($$result, "DetailMeta", $$DetailMeta, {
		"lang": lang,
		"updatedAt": FAQ_PAGE_UPDATED_AT,
		"data-astro-cid-wkbjjgph": true
	})}</div></div></section>${sections.map((section) => renderTemplate`<section class="pb-12 md:pb-16"${addAttribute(`questions-${section.group}`, "aria-labelledby")} data-astro-cid-wkbjjgph><div class="lp-container" data-astro-cid-wkbjjgph><div class="questions-group" data-astro-cid-wkbjjgph><h2${addAttribute(`questions-${section.group}`, "id")} class="display text-2xl md:text-3xl text-[var(--color-black)]" data-astro-cid-wkbjjgph>${ui.groups[section.group]}</h2><div class="questions-list" data-astro-cid-wkbjjgph>${renderComponent($$result, "FaqAccordion", $$FaqAccordion, {
		"items": section.items,
		"name": `faq-${section.group}`,
		"data-astro-cid-wkbjjgph": true
	})}</div></div></div></section>`)}<section class="pb-20 md:pb-28" aria-labelledby="questions-cta" data-astro-cid-wkbjjgph><div class="lp-container" data-astro-cid-wkbjjgph><div class="questions-cta" data-astro-cid-wkbjjgph><div data-astro-cid-wkbjjgph><h2 id="questions-cta" class="display text-2xl text-[var(--color-black)]" data-astro-cid-wkbjjgph>${ui.ctaTitle}</h2><p class="questions-cta__text" data-astro-cid-wkbjjgph>${ui.ctaText}</p></div><a class="btn btn-primary"${addAttribute(contactHref, "href")} data-astro-cid-wkbjjgph>${ui.ctaButton}</a></div></div></section></main>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-wkbjjgph": true })}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/QuestionsPage.astro", void 0);
//#endregion
export { $$QuestionsPage as t };
