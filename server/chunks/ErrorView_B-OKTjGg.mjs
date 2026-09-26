import { A as renderTemplate, B as createAstro, D as renderSlot, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_CwpToexC.mjs";
import { t as createComponent } from "./compiler_BgboG8oT.mjs";
import { f as localizePath, p as resolveLang, t as $$Layout } from "./Layout_enw8D3cO.mjs";
import { C as siteConfig, b as businessCardCopy, g as platformHref, h as platformDefinitions, l as referencesForPlatform, o as serviceHref, p as JOURNAL_ARTICLES, s as articleUrl, t as getServiceById, u as cmsFor } from "./services_D6I65Rsy.mjs";
import { S as srcsetFor, _ as SERVICE_PHOTO_VARIANT_WIDTHS, l as webPageNode, n as breadcrumbNode, r as faqPageSchema, s as serviceNode, t as asGraph } from "./jsonld_3kdu1TYW.mjs";
import { a as $$FirstCall, d as $$Emphasis, f as stripEmphasis, g as $$Footer, h as getHomeContent, i as getDemos, l as getReferencePreviewsBySiteUrl, m as demosCopy, n as $$BusinessCardTile, o as $$CardActions, r as $$DemoCard, t as $$FaqAccordion, u as $$SectionHeader, y as $$Header } from "./FaqAccordion_CSrqDAGt.mjs";
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
	const serviceLink = variant === "service" ? null : (() => {
		const service = getServiceById("web-presence");
		return {
			label: service.fallback[lang].title,
			href: serviceHref(service, lang)
		};
	})();
	return renderTemplate`${demos.length > 0 && renderTemplate`${maybeRenderHead($$result)}<section id="website-demos" class="section-spacing"${addAttribute(headingId, "aria-labelledby")} data-astro-cid-7ps2fawc><div class="lp-container" data-astro-cid-7ps2fawc>${renderComponent($$result, "SectionHeader", $$SectionHeader, {
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
		"serviceLink": serviceLink,
		"data-astro-cid-7ps2fawc": true
	})}`)}</div></div></section>`}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/WebsiteDemos.astro", void 0);
//#endregion
//#region src/components/ui/ServiceCard.astro
createAstro("https://tracht-digital.de");
var $$ServiceCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ServiceCard;
	const { href, title, problem, result, keywords, image = null, lang, moreLabel } = Astro.props;
	const ui = lang === "de" ? {
		problem: "Typische Ausgangslage",
		result: "Ergebnis",
		scope: "Umfang",
		more: "Details & Ablauf"
	} : {
		problem: "Typical starting point",
		result: "Outcome",
		scope: "Scope",
		more: "Details & process"
	};
	const PHOTO = {
		width: 1586,
		height: 992
	};
	return renderTemplate`${maybeRenderHead($$result)}<article data-motion-tile class="service-tile group relative flex flex-col bg-[var(--lp-surface-card)] transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--color-accent-pink)_10%,var(--color-card))]" data-astro-cid-hwunfzhe>${image && renderTemplate`<div class="service-tile__shot" aria-hidden="true" data-astro-cid-hwunfzhe><img${addAttribute(image, "src")}${addAttribute(srcsetFor(image, SERVICE_PHOTO_VARIANT_WIDTHS, PHOTO.width), "srcset")} sizes="(min-width: 80rem) 40rem, (min-width: 40rem) 50vw, 100vw" alt=""${addAttribute(PHOTO.width, "width")}${addAttribute(PHOTO.height, "height")} loading="lazy" decoding="async" data-motion-image data-astro-cid-hwunfzhe></div>`}<div class="flex flex-col flex-1 p-6 sm:p-7 md:p-8" data-astro-cid-hwunfzhe><h3 class="font-[var(--font-display)] text-xl md:text-2xl text-[var(--color-black)] mb-5" data-astro-cid-hwunfzhe><a${addAttribute(href, "href")} class="service-tile__link" data-astro-cid-hwunfzhe>${title}</a></h3><dl class="service-tile__facts" data-astro-cid-hwunfzhe>${problem && renderTemplate`<div data-astro-cid-hwunfzhe><dt data-astro-cid-hwunfzhe>${ui.problem}</dt><dd data-astro-cid-hwunfzhe>${problem}</dd></div>`}${result && renderTemplate`<div data-astro-cid-hwunfzhe><dt data-astro-cid-hwunfzhe>${ui.result}</dt><dd data-astro-cid-hwunfzhe>${result}</dd></div>`}${keywords.length > 0 && renderTemplate`<div data-astro-cid-hwunfzhe><dt data-astro-cid-hwunfzhe>${ui.scope}</dt><dd data-astro-cid-hwunfzhe><ul class="flex flex-wrap gap-2 mt-1.5" data-astro-cid-hwunfzhe>${keywords.map((keyword) => renderTemplate`<li class="px-3 py-1 text-xs rounded-full bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--lp-surface-card))] text-[var(--color-accent)] transition-colors duration-200 group-hover:bg-[color-mix(in_srgb,var(--color-accent)_18%,var(--lp-surface-card))]" data-astro-cid-hwunfzhe>${keyword}</li>`)}</ul></dd></div>`}</dl><span aria-hidden="true" class="service-tile__more" data-astro-cid-hwunfzhe>${moreLabel ?? ui.more}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-hwunfzhe><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-hwunfzhe></line><polyline points="12 5 19 12 12 19" data-astro-cid-hwunfzhe></polyline></svg></span></div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/ServiceCard.astro", void 0);
//#endregion
//#region src/components/detail/DetailHero.astro
createAstro("https://tracht-digital.de");
var $$DetailHero = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailHero;
	const { backHref, backLabel, navLabel, title, lead, ctaHref, ctaLabel, image = null } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section class="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28" aria-labelledby="service-title" data-astro-cid-cepj5mfo><div class="tds-decor" aria-hidden="true" data-astro-cid-cepj5mfo>${image && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<img${addAttribute(image, "src")} alt="" aria-hidden="true" fetchpriority="low" decoding="async" class="service-hero__photo absolute inset-0 h-full w-full object-cover" data-motion-image data-astro-cid-cepj5mfo><span class="absolute inset-0 bg-[linear-gradient(to_right,var(--color-paper)_20%,color-mix(in_srgb,var(--color-paper)_82%,transparent)_60%,color-mix(in_srgb,var(--color-paper)_58%,transparent)_100%)]" data-astro-cid-cepj5mfo></span>` })}`}<span class="tds-shape tds-shape--quarter-tl tds-shape--bordeaux" style="right: -8rem; bottom: -11rem; width: 29rem; height: 29rem; --tds-decor-shape-alpha: 0.13;" data-astro-cid-cepj5mfo></span><span class="tds-shape tds-shape--rect tds-shape--outline tds-shape--navy hidden lg:block" style="right: 8%; top: 8rem; width: 12rem; height: 18rem; --tds-decor-shape-alpha: 0.2;" data-astro-cid-cepj5mfo></span></div><div class="relative lp-container" data-astro-cid-cepj5mfo><nav${addAttribute(navLabel, "aria-label")} class="mb-10" data-astro-cid-cepj5mfo><a${addAttribute(backHref, "href")} class="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors group [@media(pointer:coarse)]:min-h-11" data-astro-cid-cepj5mfo><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-0.5" data-astro-cid-cepj5mfo><line x1="19" y1="12" x2="5" y2="12" data-astro-cid-cepj5mfo></line><polyline points="12 19 5 12 12 5" data-astro-cid-cepj5mfo></polyline></svg>${backLabel}</a></nav><div class="max-w-4xl" data-astro-cid-cepj5mfo><h1 id="service-title" class="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--color-black)] leading-[1.04] break-words mb-6" data-astro-cid-cepj5mfo>${title}</h1><span aria-hidden="true" class="tds-brandbar mb-8" data-astro-cid-cepj5mfo></span><p class="lead max-w-3xl text-[var(--color-muted)] mb-9" data-astro-cid-cepj5mfo>${lead}</p><a${addAttribute(ctaHref, "href")} class="btn btn-primary group" data-cta data-astro-cid-cepj5mfo>${ctaLabel}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5" data-astro-cid-cepj5mfo><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-cepj5mfo></line><polyline points="12 5 19 12 12 19" data-astro-cid-cepj5mfo></polyline></svg></a>${renderSlot($$result, $$slots["default"])}</div></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailHero.astro", void 0);
//#endregion
//#region src/components/detail/DetailMeta.astro
createAstro("https://tracht-digital.de");
var $$DetailMeta = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailMeta;
	const { lang, updatedAt } = Astro.props;
	const date = /* @__PURE__ */ new Date(`${updatedAt}T12:00:00Z`);
	const month = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(date);
	const aboutHref = `${localizePath("/", lang)}#about`;
	const ui = lang === "de" ? {
		updated: "Stand",
		by: "Von",
		role: `Inhaber von ${siteConfig.name}, ${siteConfig.address.addressLocality} bei Hamburg`
	} : {
		updated: "Updated",
		by: "By",
		role: `owner of ${siteConfig.name}, ${siteConfig.address.addressLocality} near Hamburg`
	};
	return renderTemplate`${maybeRenderHead($$result)}<p class="mt-8 text-sm leading-relaxed text-[var(--color-muted)]">${ui.updated}: <time${addAttribute(updatedAt, "datetime")}>${month}</time><span aria-hidden="true"> · </span>${ui.by}${" "}<a${addAttribute(aboutHref, "href")} class="underline underline-offset-4 decoration-[var(--color-line)] hover:text-[var(--color-primary)] transition-colors [@media(pointer:coarse)]:inline-flex [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:items-center">${siteConfig.founder.name}</a>, ${ui.role}</p>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailMeta.astro", void 0);
//#endregion
//#region src/components/detail/DetailIntro.astro
createAstro("https://tracht-digital.de");
var $$DetailIntro = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailIntro;
	const { text } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="max-w-5xl mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-16"><p class="font-[var(--font-display)] text-2xl md:text-3xl leading-snug text-[var(--color-black)]">${renderComponent($$result, "Emphasis", $$Emphasis, { "text": text })}</p></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailIntro.astro", void 0);
//#endregion
//#region src/components/detail/DetailLists.astro
createAstro("https://tracht-digital.de");
var $$DetailLists = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailLists;
	const { situationsTitle, situations, responsibilitiesTitle, responsibilities } = Astro.props;
	const items = responsibilities.map((item) => typeof item === "string" ? { text: item } : item);
	return renderTemplate`${maybeRenderHead($$result)}<div class="section-spacing"><div class="lp-container grid lg:grid-cols-2 gap-5 md:gap-6"><section class="bg-[var(--lp-surface-card)] rounded-[6px] p-7 md:p-10" aria-labelledby="service-situations-title"><h2 id="service-situations-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8">${situationsTitle}</h2><ul class="space-y-5">${situations.map((item) => renderTemplate`<li class="flex gap-4 text-[var(--color-muted)] leading-relaxed"><span aria-hidden="true" class="text-[var(--color-accent)] mt-0.5">→</span><span>${item}</span></li>`)}</ul></section><section class="bg-[var(--lp-surface-card)] rounded-[6px] p-7 md:p-10" aria-labelledby="service-responsibilities-title"><h2 id="service-responsibilities-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8">${responsibilitiesTitle}</h2><ul class="space-y-5">${items.map((item) => renderTemplate`<li class="flex gap-4 text-[var(--color-black)] leading-relaxed"><span aria-hidden="true" class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--lp-surface-card))] text-[var(--color-accent)] text-xs">✓</span>${item.href ? renderTemplate`<a${addAttribute(item.href, "href")} class="underline decoration-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] underline-offset-4 hover:text-[var(--color-primary)] transition-colors [@media(pointer:coarse)]:py-2.5">${item.text}</a>` : renderTemplate`<span>${item.text}</span>`}</li>`)}</ul></section></div></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailLists.astro", void 0);
//#endregion
//#region src/components/detail/DetailOutcomes.astro
createAstro("https://tracht-digital.de");
var $$DetailOutcomes = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailOutcomes;
	const { outcomesTitle, outcomes, boundariesTitle, boundaries } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="section-spacing"><div class="lp-container grid lg:grid-cols-2 gap-12 lg:gap-20"><section aria-labelledby="service-outcomes-title"><h2 id="service-outcomes-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8">${outcomesTitle}</h2><ul class="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">${outcomes.map((item) => renderTemplate`<li class="flex items-start gap-3 bg-[color-mix(in_srgb,var(--color-accent-pink)_12%,var(--color-paper))] rounded-[6px] px-5 py-4 text-[var(--color-black)] leading-snug" data-reveal><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 shrink-0 text-[var(--color-accent)]"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="4.5"></circle><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"></circle></svg><span>${item}</span></li>`)}</ul></section><section aria-labelledby="service-boundaries-title"><h2 id="service-boundaries-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8">${boundariesTitle}</h2><ul class="space-y-6">${boundaries.map((item) => renderTemplate`<li class="flex gap-4 text-[var(--color-muted)] leading-relaxed"><span aria-hidden="true" class="font-mono text-[var(--color-accent)]">—</span><span>${item}</span></li>`)}</ul></section></div></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailOutcomes.astro", void 0);
//#endregion
//#region src/components/detail/DetailProcess.astro
createAstro("https://tracht-digital.de");
var $$DetailProcess = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailProcess;
	const { processTitle, process, priceLabel, priceText, priceLink = null } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="section-spacing" data-astro-cid-o62tvrax><div class="lp-container grid lg:grid-cols-[1.35fr_0.65fr] gap-6" data-astro-cid-o62tvrax><section class="bg-[var(--lp-surface-card)] rounded-[6px] p-7 md:p-10" aria-labelledby="service-process-title" data-astro-cid-o62tvrax><h2 id="service-process-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8" data-astro-cid-o62tvrax>${processTitle}</h2><ol class="stepper" data-astro-cid-o62tvrax>${process.map((step, index) => renderTemplate`<li class="stepper__step" data-reveal${addAttribute(index, "data-reveal-index")} data-astro-cid-o62tvrax>${index < process.length - 1 && renderTemplate`<span class="stepper__line" aria-hidden="true" data-astro-cid-o62tvrax></span>`}<span aria-hidden="true" class="stepper__marker" data-astro-cid-o62tvrax></span><span class="stepper__text" data-astro-cid-o62tvrax>${step}</span></li>`)}</ol></section><aside class="tds-tone-navy relative overflow-hidden rounded-[6px] p-7 md:p-10" data-astro-cid-o62tvrax><span aria-hidden="true" class="tds-shape tds-shape--quarter-bl tds-shape--coral" style="top: -3rem; right: -3rem; width: 12rem; height: 12rem; --tds-decor-shape-alpha: 0.18;" data-astro-cid-o62tvrax></span><div class="relative" data-astro-cid-o62tvrax><p class="eyebrow text-white/60 mb-5" data-astro-cid-o62tvrax>${priceLabel}</p><p class="font-[var(--font-display)] text-xl md:text-2xl leading-snug text-white" data-astro-cid-o62tvrax>${priceText}</p>${priceLink && renderTemplate`<a${addAttribute(priceLink.href, "href")} class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4 decoration-white/40 hover:decoration-white [@media(pointer:coarse)]:min-h-11" data-astro-cid-o62tvrax>${priceLink.label}<span aria-hidden="true" data-astro-cid-o62tvrax>→</span></a>`}</div></aside></div></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailProcess.astro", void 0);
//#endregion
//#region src/components/detail/DetailReferences.astro
createAstro("https://tracht-digital.de");
var $$DetailReferences = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailReferences;
	const { headline, label, references, lang } = Astro.props;
	const previews = await getReferencePreviewsBySiteUrl();
	const ui = lang === "de" ? {
		referenceContext: "Kontext",
		referenceResult: "Ergebnis",
		referenceMetric: "Belegbare Kennzahl",
		referencePreviewAlt: (title) => `Startseite der Webseite: ${title}`,
		referenceArticle: "Mehr erfahren",
		referenceSite: "Die Webseite ansehen"
	} : {
		referenceContext: "Context",
		referenceResult: "Outcome",
		referenceMetric: "Verifiable metric",
		referencePreviewAlt: (title) => `Home page of the website: ${title}`,
		referenceArticle: "Learn more",
		referenceSite: "View the website"
	};
	const referenceCta = (reference) => reference.articleUrl ? {
		href: reference.articleUrl,
		label: ui.referenceArticle,
		detail: reference.title
	} : reference.siteUrl ? {
		href: reference.siteUrl,
		label: ui.referenceSite,
		external: true,
		hreflang: "de",
		detail: reference.title
	} : null;
	return renderTemplate`${maybeRenderHead($$result)}<section class="section-spacing" aria-labelledby="service-references-title" data-astro-cid-akvu67fj><div class="lp-container" data-astro-cid-akvu67fj><h2 id="service-references-title" class="display text-4xl md:text-5xl text-[var(--color-black)] mb-5" data-astro-cid-akvu67fj>${headline}</h2><p class="text-[var(--color-muted)] max-w-2xl mb-12" data-astro-cid-akvu67fj>${label}</p><div class="grid lg:grid-cols-2 items-start gap-5 md:gap-6" data-astro-cid-akvu67fj>${references.map((reference) => renderTemplate`<article class="reference-card relative bg-[color-mix(in_srgb,var(--color-accent-pink)_12%,var(--color-paper))] rounded-[6px] overflow-hidden flex flex-col" data-astro-cid-akvu67fj>${reference.siteUrl && previews.get(reference.siteUrl) && renderTemplate`<div class="reference-card__shot" data-astro-cid-akvu67fj><img${addAttribute(previews.get(reference.siteUrl).src, "src")}${addAttribute(ui.referencePreviewAlt(reference.title), "alt")}${addAttribute(previews.get(reference.siteUrl).width, "width")}${addAttribute(previews.get(reference.siteUrl).height, "height")} loading="lazy" decoding="async" data-astro-cid-akvu67fj></div>`}<div class="flex flex-col flex-1 p-7 md:p-9" data-astro-cid-akvu67fj><p class="eyebrow text-[var(--color-accent)] mb-3" data-astro-cid-akvu67fj><span class="sr-only" data-astro-cid-akvu67fj>${ui.referenceContext}: </span>${reference.context}</p><h3 class="display text-2xl md:text-3xl text-[var(--color-black)] mb-5" data-astro-cid-akvu67fj>${reference.title}</h3><p class="text-[var(--color-black)] leading-relaxed" data-astro-cid-akvu67fj><span class="sr-only" data-astro-cid-akvu67fj>${ui.referenceResult}: </span>${reference.result}</p>${reference.metric && renderTemplate`<p class="mt-6 font-[var(--font-display)] text-xl text-[var(--color-black)]" data-astro-cid-akvu67fj><span class="sr-only" data-astro-cid-akvu67fj>${ui.referenceMetric}: </span>${reference.metric}</p>`}</div>${renderComponent($$result, "CardActions", $$CardActions, {
		"lang": lang,
		"cta": referenceCta(reference),
		"data-astro-cid-akvu67fj": true
	})}</article>`)}</div></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailReferences.astro", void 0);
//#endregion
//#region src/components/detail/DetailCta.astro
createAstro("https://tracht-digital.de");
var $$DetailCta = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailCta;
	const { title, text, buttonLabel, href } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="pb-16 md:pb-24 lp-container"><section class="tds-tone-navy relative overflow-hidden rounded-[6px] px-7 py-12 md:px-12 md:py-16 text-center" aria-labelledby="service-cta-title"><span aria-hidden="true" class="tds-shape tds-shape--quarter-tr tds-shape--coral" style="left: -5rem; bottom: -6rem; width: 18rem; height: 18rem; --tds-decor-shape-alpha: 0.18;"></span><div class="relative max-w-3xl mx-auto"><h2 id="service-cta-title" class="display text-3xl md:text-5xl text-white mb-5">${title}</h2><p class="text-white/75 leading-relaxed max-w-2xl mx-auto mb-8">${text}</p><div class="mb-8">${renderComponent($$result, "FirstCall", $$FirstCall, { "variant": "service" })}</div><a${addAttribute(href, "href")} data-cta class="inline-flex items-center gap-2 bg-white text-[var(--color-surface-navy)] px-7 py-3.5 rounded-[100px] text-sm font-medium hover:bg-white/85 transition-colors group">${buttonLabel}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a></div></section></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailCta.astro", void 0);
//#endregion
//#region src/components/services/ServiceDetailPage.astro
createAstro("https://tracht-digital.de");
var $$ServiceDetailPage = createComponent(($$result, $$props, $$slots) => {
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
	const ui = lang === "de" ? {
		breadcrumb: "Brotkrümelnavigation",
		home: "Startseite"
	} : {
		breadcrumb: "Breadcrumb",
		home: "Home"
	};
	const platformHub = lang === "de" ? {
		title: "Shopsysteme und CMS",
		intro: "Für diese Systeme gibt es eigene Seiten – mit typischen Problemen und Antworten.",
		otherTitle: "Anderes System?",
		otherProblem: "Du nutzt Jimdo, Wix, IONOS, Shopify oder eine eigene Lösung.",
		otherResult: "Ich sage dir ehrlich, ob ich helfen kann.",
		otherMore: "Kurz schreiben"
	} : {
		title: "Shop systems and CMS",
		intro: "These systems have their own pages – with typical problems and answers.",
		otherTitle: "Another system?",
		otherProblem: "You use Jimdo, Wix, IONOS, Shopify or something custom.",
		otherResult: "I tell you honestly whether I can help.",
		otherMore: "Send a short note"
	};
	const breadcrumbId = `${canonical}#breadcrumb`;
	const jsonLd = asGraph(webPageNode({
		url: canonical,
		name: service.seoTitle[lang],
		description: content.summary,
		lang,
		dateModified: service.updatedAt,
		breadcrumbId
	}), serviceNode({
		url: canonical,
		name: content.title,
		description: content.summary,
		lang,
		serviceType: content.title,
		outputs: content.outcomes
	}), breadcrumbNode(breadcrumbId, [{
		name: ui.home,
		url: `${siteConfig.url}${homeHref}`
	}, {
		name: content.title,
		url: canonical
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": service.seoTitle[lang],
		"description": content.summary,
		"lang": lang,
		"canonical": canonical,
		"alternates": alternatePaths,
		"ogImage": `/og/${lang}/${service.slug[lang]}.png`,
		"jsonLd": jsonLd,
		"data-astro-cid-f5m424za": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, { "data-astro-cid-f5m424za": true })}${maybeRenderHead($$result)}<main id="main" class="bg-[var(--color-paper)]" data-astro-cid-f5m424za>${renderComponent($$result, "DetailHero", $$DetailHero, {
		"backHref": servicesHref,
		"backLabel": content.label,
		"navLabel": ui.breadcrumb,
		"title": content.title,
		"lead": content.summary,
		"ctaHref": contactHref,
		"ctaLabel": content.ctaButton,
		"image": service.image,
		"data-astro-cid-f5m424za": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "DetailMeta", $$DetailMeta, {
		"lang": lang,
		"updatedAt": service.updatedAt,
		"data-astro-cid-f5m424za": true
	})}` })}${renderComponent($$result, "DetailIntro", $$DetailIntro, {
		"text": content.intro,
		"data-astro-cid-f5m424za": true
	})}${renderComponent($$result, "DetailLists", $$DetailLists, {
		"situationsTitle": content.situationsTitle,
		"situations": content.situations,
		"responsibilitiesTitle": content.responsibilitiesTitle,
		"responsibilities": content.responsibilities,
		"data-astro-cid-f5m424za": true
	})}${renderComponent($$result, "DetailOutcomes", $$DetailOutcomes, {
		"outcomesTitle": content.outcomesTitle,
		"outcomes": content.outcomes,
		"boundariesTitle": content.boundariesTitle,
		"boundaries": content.boundaries,
		"data-astro-cid-f5m424za": true
	})}${renderComponent($$result, "DetailProcess", $$DetailProcess, {
		"processTitle": content.processTitle,
		"process": content.process,
		"priceLabel": content.priceLabel,
		"priceText": content.priceText,
		"priceLink": {
			href: `${homeHref}#preise`,
			label: lang === "de" ? "Festpreise ansehen" : "See fixed prices"
		},
		"data-astro-cid-f5m424za": true
	})}${content.references.length > 0 && renderTemplate`${renderComponent($$result, "DetailReferences", $$DetailReferences, {
		"headline": content.referencesHeadline,
		"label": content.referencesLabel,
		"references": content.references,
		"lang": lang,
		"data-astro-cid-f5m424za": true
	})}`}${service.id === "web-presence" && renderTemplate`<section class="section-spacing" aria-labelledby="service-platforms-title" data-astro-cid-f5m424za><div class="lp-container" data-astro-cid-f5m424za><h2 id="service-platforms-title" class="display text-4xl md:text-5xl text-[var(--color-black)] mb-5" data-astro-cid-f5m424za>${platformHub.title}</h2><p class="text-[var(--color-muted)] max-w-2xl mb-12" data-astro-cid-f5m424za>${platformHub.intro}</p><div class="-mx-6 md:mx-0 overflow-hidden rounded-none md:rounded-[6px] bg-[var(--color-line)] grid gap-px sm:grid-cols-2 lg:grid-cols-3" data-astro-cid-f5m424za>${platformDefinitions.map((platform) => renderTemplate`${renderComponent($$result, "ServiceCard", $$ServiceCard, {
		"href": platformHref(platform, lang),
		"title": platform.name,
		"problem": platform.content[lang].situations[0] ?? "",
		"result": platform.content[lang].outcomes[0] ?? "",
		"keywords": platform.keywords[lang],
		"lang": lang,
		"data-astro-cid-f5m424za": true
	})}`)}${renderComponent($$result, "ServiceCard", $$ServiceCard, {
		"href": contactHref,
		"title": platformHub.otherTitle,
		"problem": platformHub.otherProblem,
		"result": platformHub.otherResult,
		"keywords": [],
		"lang": lang,
		"moreLabel": platformHub.otherMore,
		"data-astro-cid-f5m424za": true
	})}</div></div></section>`}${service.id === "web-presence" && renderTemplate`${renderComponent($$result, "WebsiteDemos", $$WebsiteDemos, {
		"variant": "service",
		"data-astro-cid-f5m424za": true
	})}`}${service.id === "web-presence" && renderTemplate`<section class="section-spacing" aria-labelledby="service-business-card-title" data-astro-cid-f5m424za><div class="lp-container" data-astro-cid-f5m424za><h2 id="service-business-card-title" class="sr-only" data-astro-cid-f5m424za>${businessCardCopy[lang].title}</h2><div class="business-card-slot" data-astro-cid-f5m424za>${renderComponent($$result, "BusinessCardTile", $$BusinessCardTile, { "data-astro-cid-f5m424za": true })}</div></div></section>`}${renderComponent($$result, "DetailCta", $$DetailCta, {
		"title": content.ctaTitle,
		"text": content.ctaText,
		"buttonLabel": content.ctaButton,
		"href": contactHref,
		"data-astro-cid-f5m424za": true
	})}</main>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-f5m424za": true })}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/services/ServiceDetailPage.astro", void 0);
//#endregion
//#region src/components/detail/DetailOffers.astro
createAstro("https://tracht-digital.de");
var $$DetailOffers = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailOffers;
	const { offers } = Astro.props;
	const columns = offers.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
	return renderTemplate`${maybeRenderHead($$result)}<div class="section-spacing"><div${addAttribute(["lp-container grid gap-5 md:gap-6", columns], "class:list")}>${offers.map((offer) => renderTemplate`<section${addAttribute(offer.id, "id")} class="rounded-[6px] bg-[var(--color-soft)] p-7 md:p-10"${addAttribute(`${offer.id}-title`, "aria-labelledby")}><h2${addAttribute(`${offer.id}-title`, "id")} class="display text-3xl md:text-4xl text-[var(--color-black)] mb-5">${offer.title}</h2><p class="text-[var(--color-muted)] leading-relaxed mb-6">${offer.text}</p><ul class="space-y-3">${offer.points.map((point) => renderTemplate`<li class="flex gap-3 text-[var(--color-black)] leading-relaxed"><span aria-hidden="true" class="text-[var(--color-accent)]">✓</span><span>${point}</span></li>`)}</ul></section>`)}</div></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailOffers.astro", void 0);
//#endregion
//#region src/components/detail/DetailComparison.astro
createAstro("https://tracht-digital.de");
var $$DetailComparison = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailComparison;
	const { comparison, sources, lang, updatedLabel } = Astro.props;
	const ui = lang === "de" ? {
		sources: "Quellen",
		table: "Vergleichstabelle"
	} : {
		sources: "Sources",
		table: "Comparison table"
	};
	return renderTemplate`${maybeRenderHead($$result)}<div class="section-spacing" data-astro-cid-a6pgr374><div class="lp-container" data-astro-cid-a6pgr374><section class="bg-[var(--lp-surface-card)] rounded-[6px] p-7 md:p-10" aria-labelledby="platform-comparison-title" data-astro-cid-a6pgr374><h2 id="platform-comparison-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-5" data-astro-cid-a6pgr374>${comparison.title}</h2><p class="max-w-3xl text-[var(--color-muted)] leading-relaxed mb-8" data-astro-cid-a6pgr374>${comparison.intro}</p><div class="comparison__scroll" tabindex="0" role="region"${addAttribute(`${ui.table}: ${comparison.title}`, "aria-label")} data-astro-cid-a6pgr374><table class="comparison" data-astro-cid-a6pgr374><thead data-astro-cid-a6pgr374><tr data-astro-cid-a6pgr374>${comparison.columns.map((column) => renderTemplate`<th scope="col" data-astro-cid-a6pgr374>${column}</th>`)}</tr></thead><tbody data-astro-cid-a6pgr374>${comparison.rows.map((row) => renderTemplate`<tr data-astro-cid-a6pgr374><th scope="row" data-astro-cid-a6pgr374>${row[0]}</th>${row.slice(1).map((cell) => renderTemplate`<td data-astro-cid-a6pgr374>${cell}</td>`)}</tr>`)}</tbody></table></div>${sources.length > 0 && renderTemplate`<div class="mt-8 text-sm leading-relaxed text-[var(--color-muted)]" data-astro-cid-a6pgr374><p class="font-medium text-[var(--color-black)] mb-2" data-astro-cid-a6pgr374>${ui.sources} <span class="font-normal text-[var(--color-muted)]" data-astro-cid-a6pgr374>(${updatedLabel})</span></p><ul class="comparison__sources" data-astro-cid-a6pgr374>${sources.map((source) => renderTemplate`<li data-astro-cid-a6pgr374><a${addAttribute(source.url[lang], "href")} rel="noopener" class="underline underline-offset-4 decoration-[var(--color-line)] hover:text-[var(--color-primary)] transition-colors" data-astro-cid-a6pgr374>${source.label[lang]}</a></li>`)}</ul></div>`}</section></div></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailComparison.astro", void 0);
//#endregion
//#region src/components/detail/DetailFaq.astro
createAstro("https://tracht-digital.de");
var $$DetailFaq = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailFaq;
	const { title, items } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="section-spacing"><section class="lp-container grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 lg:items-start" aria-labelledby="platform-faq-title"><h2 id="platform-faq-title" class="display text-3xl md:text-4xl text-[var(--color-black)]">${title}</h2><div class="grid gap-1">${renderComponent($$result, "FaqAccordion", $$FaqAccordion, {
		"items": items,
		"name": "platform-faq"
	})}</div></section></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailFaq.astro", void 0);
//#endregion
//#region src/components/detail/DetailRelated.astro
createAstro("https://tracht-digital.de");
var $$DetailRelated = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailRelated;
	const { title, parentTitle, parent, platformsTitle, platforms, articlesTitle, articles } = Astro.props;
	const fill = "bg-[var(--color-soft)]";
	const groups = [
		{
			title: parentTitle,
			links: [parent]
		},
		{
			title: platformsTitle,
			links: platforms
		},
		{
			title: articlesTitle,
			links: articles
		}
	].filter((group) => group.links.length > 0);
	return renderTemplate`${maybeRenderHead($$result)}<div class="section-spacing"><section class="lp-container" aria-labelledby="platform-related-title"><h2 id="platform-related-title" class="display text-3xl md:text-4xl text-[var(--color-black)] mb-8">${title}</h2><div class="grid gap-5 md:gap-6 md:grid-cols-3">${groups.map((group) => renderTemplate`<div${addAttribute(["rounded-[6px] p-7", fill], "class:list")}><h3 class="font-[var(--font-display)] text-xl text-[var(--color-black)] mb-4">${group.title}</h3><ul class="space-y-2">${group.links.map((link) => renderTemplate`<li><a${addAttribute(link.href, "href")} class="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors [@media(pointer:coarse)]:min-h-11"><span>${link.label}</span><span aria-hidden="true">→</span></a></li>`)}</ul></div>`)}</div></section></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailRelated.astro", void 0);
//#endregion
//#region src/components/platforms/PlatformDetailPage.astro
createAstro("https://tracht-digital.de");
var $$PlatformDetailPage = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PlatformDetailPage;
	const { platform, lang } = Astro.props;
	const content = platform.content[lang];
	const path = platformHref(platform, lang);
	const canonical = `${siteConfig.url}${path}`;
	const homeHref = localizePath("/", lang);
	const contactHref = `${homeHref}#contact`;
	const pricesHref = `${homeHref}#preise`;
	const webPresence = getServiceById("web-presence");
	const parentHref = serviceHref(webPresence, lang);
	const parentTitle = webPresence.fallback[lang].title;
	const references = referencesForPlatform(platform.id, lang);
	const month = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(/* @__PURE__ */ new Date(`${platform.updatedAt}T12:00:00Z`));
	const ui = lang === "de" ? {
		breadcrumb: "Brotkrümelnavigation",
		home: "Startseite",
		prices: "Festpreise ansehen",
		updated: `Stand: ${month}`,
		relatedTitle: "Wie geht es weiter?",
		parentTitle: "Die Leistung dahinter",
		platformsTitle: "Andere Systeme",
		articlesTitle: "Aus dem Journal"
	} : {
		breadcrumb: "Breadcrumb",
		home: "Home",
		prices: "See fixed prices",
		updated: `as of ${month}`,
		relatedTitle: "Where to next?",
		parentTitle: "The service behind it",
		platformsTitle: "Other systems",
		articlesTitle: "From the journal"
	};
	const siblings = platformDefinitions.filter((candidate) => candidate.id !== platform.id).map((candidate) => ({
		href: platformHref(candidate, lang),
		label: candidate.name
	}));
	const articles = platform.articleSlugs.map((slug) => ({
		href: articleUrl(slug, lang),
		label: JOURNAL_ARTICLES[slug][lang]
	}));
	const hasReferences = references.length > 0;
	const breadcrumbId = `${canonical}#breadcrumb`;
	const jsonLd = asGraph(webPageNode({
		url: canonical,
		name: platform.seoTitle[lang],
		description: content.summary,
		lang,
		dateModified: platform.updatedAt,
		about: {
			name: platform.name,
			sameAs: platform.wikipedia[lang]
		},
		breadcrumbId
	}), serviceNode({
		url: canonical,
		name: content.title,
		description: stripEmphasis(content.answer),
		lang,
		serviceType: platform.name,
		outputs: content.outcomes
	}), breadcrumbNode(breadcrumbId, [
		{
			name: ui.home,
			url: `${siteConfig.url}${homeHref}`
		},
		{
			name: parentTitle,
			url: `${siteConfig.url}${parentHref}`
		},
		{
			name: platform.name,
			url: canonical
		}
	]), faqPageSchema(content.faq));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": platform.seoTitle[lang],
		"description": content.summary,
		"lang": lang,
		"canonical": canonical,
		"alternates": {
			de: platformHref(platform, "de"),
			en: platformHref(platform, "en")
		},
		"ogImage": `/og/${lang}/${platform.slug}.png`,
		"jsonLd": jsonLd
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main id="main" class="bg-[var(--color-paper)]">${renderComponent($$result, "DetailHero", $$DetailHero, {
		"backHref": parentHref,
		"backLabel": content.label,
		"navLabel": ui.breadcrumb,
		"title": content.title,
		"lead": content.summary,
		"ctaHref": contactHref,
		"ctaLabel": content.ctaButton
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "DetailMeta", $$DetailMeta, {
		"lang": lang,
		"updatedAt": platform.updatedAt
	})}` })}${renderComponent($$result, "DetailIntro", $$DetailIntro, { "text": content.answer })}${renderComponent($$result, "DetailLists", $$DetailLists, {
		"situationsTitle": content.situationsTitle,
		"situations": content.situations,
		"responsibilitiesTitle": content.offersTitle,
		"responsibilities": content.offers.map((offer) => ({
			text: offer.title,
			href: `#${offer.id}`
		}))
	})}${renderComponent($$result, "DetailOffers", $$DetailOffers, { "offers": content.offers })}${renderComponent($$result, "DetailComparison", $$DetailComparison, {
		"comparison": content.comparison,
		"sources": platform.sources,
		"lang": lang,
		"updatedLabel": ui.updated
	})}${renderComponent($$result, "DetailOutcomes", $$DetailOutcomes, {
		"outcomesTitle": content.outcomesTitle,
		"outcomes": content.outcomes,
		"boundariesTitle": content.boundariesTitle,
		"boundaries": content.boundaries
	})}${renderComponent($$result, "DetailProcess", $$DetailProcess, {
		"processTitle": content.processTitle,
		"process": content.process,
		"priceLabel": content.costTitle,
		"priceText": content.costText,
		"priceLink": {
			href: pricesHref,
			label: ui.prices
		}
	})}${hasReferences && renderTemplate`${renderComponent($$result, "DetailReferences", $$DetailReferences, {
		"headline": content.referencesHeadline,
		"label": content.referencesLabel,
		"references": references,
		"lang": lang
	})}`}${renderComponent($$result, "DetailFaq", $$DetailFaq, {
		"title": content.faqTitle,
		"items": content.faq
	})}${renderComponent($$result, "DetailRelated", $$DetailRelated, {
		"title": ui.relatedTitle,
		"parentTitle": ui.parentTitle,
		"parent": {
			href: parentHref,
			label: parentTitle
		},
		"platformsTitle": ui.platformsTitle,
		"platforms": siblings,
		"articlesTitle": ui.articlesTitle,
		"articles": articles
	})}${renderComponent($$result, "DetailCta", $$DetailCta, {
		"title": content.ctaTitle,
		"text": content.ctaText,
		"buttonLabel": content.ctaButton,
		"href": contactHref
	})}</main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/platforms/PlatformDetailPage.astro", void 0);
//#endregion
//#region src/components/ErrorView.astro
createAstro("https://tracht-digital.de");
var $$ErrorView = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ErrorView;
	const { code } = Astro.props;
	const copy = code === "404" ? {
		de: "Diese Seite gibt es nicht.",
		en: "This page does not exist."
	} : {
		de: "Hier ist etwas schiefgelaufen.",
		en: "Something went wrong here."
	};
	return renderTemplate`${maybeRenderHead($$result)}<div class="err" data-astro-cid-gt6qm5qm><span class="err-glow" aria-hidden="true" data-astro-cid-gt6qm5qm></span><div class="err-body" data-astro-cid-gt6qm5qm><p class="err-code" aria-hidden="true" data-astro-cid-gt6qm5qm>${code}</p><h1 class="err-title" data-astro-cid-gt6qm5qm><span lang="de" data-astro-cid-gt6qm5qm>${copy.de}</span><span class="err-title-en" lang="en" data-astro-cid-gt6qm5qm>${copy.en}</span></h1><nav class="err-links" aria-label="Weiter / Continue" data-astro-cid-gt6qm5qm><a href="/" data-astro-cid-gt6qm5qm>Zur Startseite</a><a href="/#services" data-astro-cid-gt6qm5qm>Leistungen</a><a href="/#contact" data-astro-cid-gt6qm5qm>Kontakt</a><a href="/en/" lang="en" hreflang="en" data-astro-cid-gt6qm5qm>English</a></nav></div></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ErrorView.astro", void 0);
//#endregion
export { $$PlatformDetailPage as n, $$ServiceDetailPage as r, $$ErrorView as t };
