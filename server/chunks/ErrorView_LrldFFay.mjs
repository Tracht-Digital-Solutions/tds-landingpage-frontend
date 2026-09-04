import { A as renderTemplate, B as createAstro, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { o as localizePath, s as resolveLang, t as $$Layout } from "./Layout_V8d2QaQ-.mjs";
import { g as businessCardCopy, l as siteConfig, o as serviceHref, u as cmsFor } from "./services_Bv7bmOO1.mjs";
import { d as $$Header, n as breadcrumbSchema, u as $$Footer } from "./jsonld_B_PfucTA.mjs";
import { n as getServiceRate, r as $$Emphasis, t as getPricingContent } from "./pricing_CELklk53.mjs";
import { a as getDemos, c as getHomeContent, i as getReferencePreviewsBySiteUrl, n as $$DemoCard, o as $$SectionHeader, s as demosCopy, t as $$BusinessCardTile } from "./BusinessCardTile_h87uEk04.mjs";
//#region src/components/sections/WebsiteDemos.astro
createAstro("https://tracht-digital.de");
var $$WebsiteDemos = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$WebsiteDemos;
	const { variant = "home" } = Astro.props;
	const lang = resolveLang(Astro.currentLocale);
	const demos = await getDemos();
	const content = await cmsFor("website_demos", lang, getHomeContent(lang).websiteDemos);
	const copy = demosCopy(content, demos.length, variant);
	const headingId = variant === "service" ? "service-demos-heading" : "website-demos-heading";
	return renderTemplate`${demos.length > 0 && renderTemplate`${maybeRenderHead($$result)}<section id="website-demos" class="section-spacing"${addAttribute(headingId, "aria-labelledby")} data-astro-cid-7ps2fawc><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-7ps2fawc>${renderComponent($$result, "SectionHeader", $$SectionHeader, {
		"headline": copy.headline,
		"headlineAccent": copy.headlineAccent,
		"id": headingId,
		"headingClass": "mb-6",
		"data-astro-cid-7ps2fawc": true
	})}<p class="max-w-2xl text-[var(--color-muted)] leading-relaxed mb-12" data-astro-cid-7ps2fawc>${renderComponent($$result, "Emphasis", $$Emphasis, {
		"text": copy.intro,
		"data-astro-cid-7ps2fawc": true
	})}</p><div class="demo-grid"${addAttribute(`--demo-count: ${demos.length}`, "style")} data-astro-cid-7ps2fawc>${demos.map((demo) => renderTemplate`${renderComponent($$result, "DemoCard", $$DemoCard, {
		"demo": demo,
		"lang": lang,
		"data-astro-cid-7ps2fawc": true
	})}`)}</div></div></section>`}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/WebsiteDemos.astro", void 0);
//#endregion
//#region src/components/services/ServiceDetailPage.astro
createAstro("https://tracht-digital.de");
var $$ServiceDetailPage = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ServiceDetailPage;
	const { service, content, lang } = Astro.props;
	const path = serviceHref(service, lang);
	const canonical = `${siteConfig.url}${path}`;
	const homeHref = localizePath("/", lang);
	const servicesHref = `${homeHref}#services`;
	const contactHref = `${homeHref}#contact`;
	const alternatePaths = {
		de: serviceHref(service, "de"),
		en: serviceHref(service, "en")
	};
	const pricing = await getPricingContent(lang);
	const previews = await getReferencePreviewsBySiteUrl();
	const serviceRate = getServiceRate(pricing, service.id);
	const ui = lang === "de" ? {
		breadcrumb: "Brotkrümelnavigation",
		referenceContext: "Kontext",
		referenceResult: "Ergebnis",
		referenceMetric: "Belegbare Kennzahl",
		referencePreviewAlt: (title) => `Startseite der Webseite: ${title}`,
		referenceArticle: "Der Artikel dazu im Journal",
		referenceSite: "Die Webseite ansehen",
		referenceNewTab: "öffnet in neuem Tab"
	} : {
		breadcrumb: "Breadcrumb",
		referenceContext: "Context",
		referenceResult: "Outcome",
		referenceMetric: "Verifiable metric",
		referencePreviewAlt: (title) => `Home page of the website: ${title}`,
		referenceArticle: "The article on this in the Journal",
		referenceSite: "View the website",
		referenceNewTab: "opens in a new tab"
	};
	const offer = {
		"@type": "Offer",
		priceSpecification: {
			"@type": "UnitPriceSpecification",
			price: serviceRate,
			priceCurrency: "EUR",
			unitCode: "HUR",
			referenceQuantity: {
				"@type": "QuantitativeValue",
				value: 1,
				unitCode: "HUR"
			},
			valueAddedTaxIncluded: false
		}
	};
	const jsonLd = [{
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": `${canonical}#service`,
		url: canonical,
		name: content.title,
		description: content.summary,
		serviceType: content.title,
		provider: { "@id": `${siteConfig.url}/#organization` },
		areaServed: siteConfig.areaServed.map((name) => ({
			"@type": "Place",
			name
		})),
		inLanguage: lang === "de" ? "de-DE" : "en-GB",
		serviceOutput: content.outcomes,
		offers: offer
	}, breadcrumbSchema([{
		name: "Home",
		url: `${siteConfig.url}${homeHref}`
	}, {
		name: content.title,
		url: canonical
	}])];
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${content.title} — Tracht Digital Solutions`,
		"description": content.summary,
		"lang": lang,
		"canonical": canonical,
		"alternates": alternatePaths,
		"jsonLd": jsonLd,
		"data-astro-cid-f5m424za": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, { "data-astro-cid-f5m424za": true })}${maybeRenderHead($$result)}<main id="main" class="bg-[var(--color-paper)]" data-astro-cid-f5m424za><section class="tds-wash tds-wash--calm relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28" aria-labelledby="service-title" data-astro-cid-f5m424za><div class="tds-decor" aria-hidden="true" data-astro-cid-f5m424za>${service.image && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<img${addAttribute(service.image, "src")} alt="" aria-hidden="true" fetchpriority="low" decoding="async" class="service-hero__photo absolute inset-0 h-full w-full object-cover" data-astro-cid-f5m424za><span class="absolute inset-0 bg-[linear-gradient(to_right,var(--color-paper)_20%,color-mix(in_srgb,var(--color-paper)_82%,transparent)_60%,color-mix(in_srgb,var(--color-paper)_58%,transparent)_100%)]" data-astro-cid-f5m424za></span>` })}`}<span class="tds-shape tds-shape--quarter-tl tds-shape--bordeaux" style="right: -8rem; bottom: -11rem; width: 29rem; height: 29rem; --tds-decor-shape-alpha: 0.13;" data-astro-cid-f5m424za></span><span class="tds-shape tds-shape--rect tds-shape--outline tds-shape--navy hidden lg:block" style="right: 8%; top: 8rem; width: 12rem; height: 18rem; --tds-decor-shape-alpha: 0.2;" data-astro-cid-f5m424za></span></div><div class="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-f5m424za><nav${addAttribute(ui.breadcrumb, "aria-label")} class="mb-10" data-astro-cid-f5m424za><a${addAttribute(servicesHref, "href")} class="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors group" data-astro-cid-f5m424za><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-0.5" data-astro-cid-f5m424za><line x1="19" y1="12" x2="5" y2="12" data-astro-cid-f5m424za></line><polyline points="12 19 5 12 12 5" data-astro-cid-f5m424za></polyline></svg>${content.label}</a></nav><div class="max-w-4xl" data-astro-cid-f5m424za><h1 id="service-title" class="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--color-black)] leading-[1.04] break-words mb-6" data-astro-cid-f5m424za>${content.title}</h1><span aria-hidden="true" class="tds-brandbar mb-8" data-astro-cid-f5m424za></span><p class="lead max-w-3xl text-[var(--color-muted)] mb-9" data-astro-cid-f5m424za>${content.summary}</p><a${addAttribute(contactHref, "href")} class="btn btn-primary group" data-astro-cid-f5m424za>${content.ctaButton}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5" data-astro-cid-f5m424za><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-f5m424za></line><polyline points="12 5 19 12 12 19" data-astro-cid-f5m424za></polyline></svg></a></div></div></section><div class="max-w-5xl mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-16" data-astro-cid-f5m424za><p class="font-[var(--font-display)] text-2xl md:text-3xl leading-snug text-[var(--color-black)]" data-astro-cid-f5m424za>${renderComponent($$result, "Emphasis", $$Emphasis, {
		"text": content.intro,
		"data-astro-cid-f5m424za": true
	})}</p></div><div class="section-spacing tds-tone-sand" data-astro-cid-f5m424za><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 grid lg:grid-cols-2 gap-5 md:gap-6" data-astro-cid-f5m424za><section class="bg-[var(--lp-surface-card)] rounded-[6px] p-7 md:p-10" aria-labelledby="service-situations-title" data-astro-cid-f5m424za><h2 id="service-situations-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8" data-astro-cid-f5m424za>${content.situationsTitle}</h2><ul class="space-y-5" data-astro-cid-f5m424za>${content.situations.map((item) => renderTemplate`<li class="flex gap-4 text-[var(--color-muted)] leading-relaxed" data-astro-cid-f5m424za><span aria-hidden="true" class="text-[var(--color-accent)] mt-0.5" data-astro-cid-f5m424za>→</span><span data-astro-cid-f5m424za>${item}</span></li>`)}</ul></section><section class="bg-[var(--lp-surface-card)] rounded-[6px] p-7 md:p-10" aria-labelledby="service-responsibilities-title" data-astro-cid-f5m424za><h2 id="service-responsibilities-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8" data-astro-cid-f5m424za>${content.responsibilitiesTitle}</h2><ul class="space-y-5" data-astro-cid-f5m424za>${content.responsibilities.map((item) => renderTemplate`<li class="flex gap-4 text-[var(--color-black)] leading-relaxed" data-astro-cid-f5m424za><span aria-hidden="true" class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--lp-surface-card))] text-[var(--color-accent)] text-xs" data-astro-cid-f5m424za>✓</span><span data-astro-cid-f5m424za>${item}</span></li>`)}</ul></section></div></div><div class="section-spacing" data-astro-cid-f5m424za><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20" data-astro-cid-f5m424za><section aria-labelledby="service-outcomes-title" data-astro-cid-f5m424za><h2 id="service-outcomes-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8" data-astro-cid-f5m424za>${content.outcomesTitle}</h2><ul class="grid sm:grid-cols-2 lg:grid-cols-1 gap-4" data-astro-cid-f5m424za>${content.outcomes.map((item) => renderTemplate`<li class="flex items-start gap-3 bg-[color-mix(in_srgb,var(--color-accent-pink)_12%,var(--color-paper))] rounded-[6px] px-5 py-4 text-[var(--color-black)] leading-snug" data-reveal data-astro-cid-f5m424za><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 shrink-0 text-[var(--color-accent)]" data-astro-cid-f5m424za><circle cx="12" cy="12" r="9" data-astro-cid-f5m424za></circle><circle cx="12" cy="12" r="4.5" data-astro-cid-f5m424za></circle><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" data-astro-cid-f5m424za></circle></svg><span data-astro-cid-f5m424za>${item}</span></li>`)}</ul></section><section aria-labelledby="service-boundaries-title" data-astro-cid-f5m424za><h2 id="service-boundaries-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8" data-astro-cid-f5m424za>${content.boundariesTitle}</h2><ul class="space-y-6" data-astro-cid-f5m424za>${content.boundaries.map((item) => renderTemplate`<li class="flex gap-4 text-[var(--color-muted)] leading-relaxed" data-astro-cid-f5m424za><span aria-hidden="true" class="font-mono text-[var(--color-accent)]" data-astro-cid-f5m424za>—</span><span data-astro-cid-f5m424za>${item}</span></li>`)}</ul></section></div></div><div class="section-spacing tds-tone-sand" data-astro-cid-f5m424za><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 grid lg:grid-cols-[1.35fr_0.65fr] gap-6" data-astro-cid-f5m424za><section class="bg-[var(--lp-surface-card)] rounded-[6px] p-7 md:p-10" aria-labelledby="service-process-title" data-astro-cid-f5m424za><h2 id="service-process-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8" data-astro-cid-f5m424za>${content.processTitle}</h2><ol class="stepper" data-astro-cid-f5m424za>${content.process.map((step, index) => renderTemplate`<li class="stepper__step" data-reveal${addAttribute(index, "data-reveal-index")} data-astro-cid-f5m424za>${index < content.process.length - 1 && renderTemplate`<span class="stepper__line" aria-hidden="true" data-astro-cid-f5m424za></span>`}<span aria-hidden="true" class="stepper__marker" data-astro-cid-f5m424za></span><span class="stepper__text" data-astro-cid-f5m424za>${step}</span></li>`)}</ol></section><aside class="tds-tone-navy relative overflow-hidden rounded-[6px] p-7 md:p-10" data-astro-cid-f5m424za><span aria-hidden="true" class="tds-shape tds-shape--quarter-bl tds-shape--coral" style="top: -3rem; right: -3rem; width: 12rem; height: 12rem; --tds-decor-shape-alpha: 0.18;" data-astro-cid-f5m424za></span><div class="relative" data-astro-cid-f5m424za><p class="eyebrow text-white/60 mb-5" data-astro-cid-f5m424za>${content.priceLabel}</p><p class="font-[var(--font-display)] text-xl md:text-2xl leading-snug text-white" data-astro-cid-f5m424za>${content.priceText}</p></div></aside></div></div>${content.references.length > 0 && renderTemplate`<section class="section-spacing" aria-labelledby="service-references-title" data-astro-cid-f5m424za><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-f5m424za><h2 id="service-references-title" class="display text-4xl md:text-5xl text-[var(--color-black)] mb-5" data-astro-cid-f5m424za>${content.referencesHeadline}</h2><p class="text-[var(--color-muted)] max-w-2xl mb-12" data-astro-cid-f5m424za>${content.referencesLabel}</p><div class="grid lg:grid-cols-2 items-start gap-5 md:gap-6" data-astro-cid-f5m424za>${content.references.map((reference) => renderTemplate`<article class="reference-card bg-[color-mix(in_srgb,var(--color-accent-pink)_12%,var(--color-paper))] rounded-[6px] overflow-hidden flex flex-col" data-astro-cid-f5m424za>${reference.siteUrl && previews.get(reference.siteUrl) && renderTemplate`<div class="reference-card__shot" data-astro-cid-f5m424za><img${addAttribute(previews.get(reference.siteUrl).src, "src")}${addAttribute(ui.referencePreviewAlt(reference.title), "alt")}${addAttribute(previews.get(reference.siteUrl).width, "width")}${addAttribute(previews.get(reference.siteUrl).height, "height")} loading="lazy" decoding="async" data-astro-cid-f5m424za></div>`}<div class="flex flex-col flex-1 p-7 md:p-9" data-astro-cid-f5m424za><p class="eyebrow text-[var(--color-accent)] mb-3" data-astro-cid-f5m424za><span class="sr-only" data-astro-cid-f5m424za>${ui.referenceContext}: </span>${reference.context}</p><h3 class="display text-2xl md:text-3xl text-[var(--color-black)] mb-5" data-astro-cid-f5m424za>${reference.title}</h3><p class="text-[var(--color-black)] leading-relaxed" data-astro-cid-f5m424za><span class="sr-only" data-astro-cid-f5m424za>${ui.referenceResult}: </span>${reference.result}</p>${reference.metric && renderTemplate`<p class="mt-6 font-[var(--font-display)] text-xl text-[var(--color-black)]" data-astro-cid-f5m424za><span class="sr-only" data-astro-cid-f5m424za>${ui.referenceMetric}: </span>${reference.metric}</p>`}${(reference.articleUrl || reference.siteUrl) && renderTemplate`<div class="mt-auto pt-8 flex flex-wrap gap-x-8 gap-y-3" data-astro-cid-f5m424za>${reference.articleUrl && renderTemplate`<a${addAttribute(reference.articleUrl, "href")} class="link-underline text-[var(--color-accent)]" data-astro-cid-f5m424za>${ui.referenceArticle}<span aria-hidden="true" data-astro-cid-f5m424za> →</span></a>`}${reference.siteUrl && renderTemplate`<a${addAttribute(reference.siteUrl, "href")} target="_blank" rel="noopener noreferrer" hreflang="de" class="link-underline inline-flex items-center gap-1.5 text-[var(--color-accent)]" data-astro-cid-f5m424za>${ui.referenceSite}<span class="sr-only" data-astro-cid-f5m424za> (${ui.referenceNewTab})</span><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-f5m424za><line x1="7" y1="17" x2="17" y2="7" data-astro-cid-f5m424za></line><polyline points="7 7 17 7 17 17" data-astro-cid-f5m424za></polyline></svg></a>`}</div>`}</div></article>`)}</div></div></section>`}${service.id === "web-presence" && renderTemplate`${renderComponent($$result, "WebsiteDemos", $$WebsiteDemos, {
		"variant": "service",
		"data-astro-cid-f5m424za": true
	})}`}${service.id === "web-presence" && renderTemplate`<section class="section-spacing" aria-labelledby="service-business-card-title" data-astro-cid-f5m424za><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-f5m424za><h2 id="service-business-card-title" class="sr-only" data-astro-cid-f5m424za>${businessCardCopy[lang].title}</h2><div class="business-card-slot" data-astro-cid-f5m424za>${renderComponent($$result, "BusinessCardTile", $$BusinessCardTile, { "data-astro-cid-f5m424za": true })}</div></div></section>`}<div class="pb-16 md:pb-24 px-6 md:px-8 lg:px-12" data-astro-cid-f5m424za><section class="tds-tone-navy relative overflow-hidden max-w-7xl mx-auto rounded-[6px] px-7 py-12 md:px-12 md:py-16 text-center" aria-labelledby="service-cta-title" data-astro-cid-f5m424za><span aria-hidden="true" class="tds-shape tds-shape--quarter-tr tds-shape--coral" style="left: -5rem; bottom: -6rem; width: 18rem; height: 18rem; --tds-decor-shape-alpha: 0.18;" data-astro-cid-f5m424za></span><div class="relative max-w-3xl mx-auto" data-astro-cid-f5m424za><h2 id="service-cta-title" class="display text-3xl md:text-5xl text-white mb-5" data-astro-cid-f5m424za>${content.ctaTitle}</h2><p class="text-white/75 leading-relaxed max-w-2xl mx-auto mb-8" data-astro-cid-f5m424za>${content.ctaText}</p><a${addAttribute(contactHref, "href")} class="inline-flex items-center gap-2 bg-white text-[var(--color-surface-navy)] px-7 py-3.5 rounded-[100px] text-sm font-medium hover:bg-white/85 transition-colors group" data-astro-cid-f5m424za>${content.ctaButton}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5" data-astro-cid-f5m424za><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-f5m424za></line><polyline points="12 5 19 12 12 19" data-astro-cid-f5m424za></polyline></svg></a></div></section></div></main>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-f5m424za": true })}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/services/ServiceDetailPage.astro", void 0);
//#endregion
//#region src/components/ErrorView.astro
createAstro("https://tracht-digital.de");
var $$ErrorView = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ErrorView;
	const { code } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="err" data-astro-cid-gt6qm5qm><span class="err-glow" aria-hidden="true" data-astro-cid-gt6qm5qm></span><a href="/" class="err-code" aria-label="Zurück zur Startseite" data-astro-cid-gt6qm5qm>${code}</a></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ErrorView.astro", void 0);
//#endregion
export { $$ServiceDetailPage as n, $$ErrorView as t };
