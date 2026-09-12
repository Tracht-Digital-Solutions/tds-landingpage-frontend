import { A as renderTemplate, At as discriminatedUnion, B as createAstro, D as renderSlot, Dt as _enum, Et as ZodDate, Ft as union, It as _coercedDate, Mt as number, N as addAttribute, Nt as object, Ot as array, Pt as string, j as maybeRenderHead, jt as literal, kt as boolean, w as renderComponent } from "./sequence_CrsIaRJD.mjs";
import { t as createComponent } from "./compiler_BDfTnRdB.mjs";
import { a as coverVariant, c as resolveLang, d as renderScript, l as tFor, o as hasPhotoCover, r as AbstractCover, s as localizePath, t as $$Layout, u as translations } from "./Layout_Dugn1bEh.mjs";
import "./contentCache_Dd-UpjrB.mjs";
import { _ as siteConfig, a as serviceDefinitions, c as referenceCases, h as businessCardHref, l as cmsFor, o as serviceHref, r as resolveServiceContent, s as articleUrl, t as getServiceById, u as fetchBlocks } from "./services_24zuh8Jr.mjs";
import "./connection_BQus1-N1.mjs";
import { _ as websiteSchema, c as portraitSrcset, f as faqPageSchema, g as speakableSchema, h as pricingSchema, i as SERVICE_PHOTO_VARIANT_WIDTHS, l as srcsetFor, m as personSchema, n as PORTRAIT_SIZE, p as organizationSchema, r as PREVIEW_VARIANT_WIDTHS, s as portraitSrc, u as asGraph } from "./imageVariants_DAALLCtF.mjs";
import { _ as $$Footer, a as $$DemoCard, c as $$CardActions, d as $$SectionHeader, f as $$AccentLetters, g as $$Emphasis, h as resolveTrustFacts, i as $$BusinessCardTile, l as getReferencePreviews, m as getHomeContent, n as getServiceRate, o as getDemos, p as demosCopy, r as lowestRate, s as $$FirstCall, t as getPricingContent, v as $$Header } from "./pricing_BuCqkqPh.mjs";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/zod/v4/classic/coerce.js
function date(params) {
	return _coercedDate(ZodDate, params);
}
//#endregion
//#region src/components/ui/CircuitRun.astro
createAstro("https://tracht-digital.de");
var $$CircuitRun = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CircuitRun;
	const { class: className } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(["tds-circuit tds-circuit--draw", className], "class:list")}><svg viewBox="0 0 320 170" fill="none" aria-hidden="true" focusable="false"><path data-circuit-line pathLength="1" d="M0 150 H74 Q92 150 92 132 V58 Q92 40 110 40 H236"></path><path data-circuit-line pathLength="1" d="M150 170 V116 Q150 98 168 98 H320"></path><circle data-circuit-node cx="236" cy="40" r="4"></circle><circle data-circuit-node cx="92" cy="95" r="3"></circle><circle data-circuit-node cx="168" cy="98" r="3"></circle></svg></span>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/CircuitRun.astro", void 0);
//#endregion
//#region src/components/sections/Hero.astro
createAstro("https://tracht-digital.de");
var $$Hero = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Hero;
	const { lang, hero, trust } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section id="hero" class="hero tds-wash relative min-h-svh flex flex-col justify-center overflow-hidden" aria-labelledby="hero-heading"${addAttribute(lang === "en" ? "en" : void 0, "lang")} data-astro-cid-yodha2z4><div class="tds-decor" aria-hidden="true" data-astro-cid-yodha2z4><picture data-astro-cid-yodha2z4><source media="(min-width: 48rem)" srcset="/images/sections/hero.webp" type="image/webp" data-astro-cid-yodha2z4><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" width="1642" height="958" decoding="async" class="hero-photo absolute inset-0 h-full w-full object-cover object-right" data-astro-cid-yodha2z4></picture><span class="hero-photo-scrim hidden md:block absolute inset-0" data-astro-cid-yodha2z4></span><span class="tds-shape tds-shape--capsule tds-shape--navy hidden xl:block" style="bottom: -7rem; left: -16rem; width: 32rem; height: 13rem;" data-astro-cid-yodha2z4></span><span class="tds-shape tds-shape--quarter-tl tds-shape--bordeaux hidden xl:block" style="bottom: -15rem; right: -11rem; width: 26rem; height: 26rem;" data-astro-cid-yodha2z4></span><span class="tds-shape tds-shape--capsule tds-shape--gold hidden lg:block" style="bottom: 7%; left: 44%; width: 0.5rem; height: 0.5rem; opacity: 0.9;" data-astro-cid-yodha2z4></span>${renderComponent($$result, "CircuitRun", $$CircuitRun, {
		"class": "hidden xl:block bottom-[3%] left-[20%] w-[15rem] h-[8rem]",
		"data-astro-cid-yodha2z4": true
	})}</div><div class="hero-body relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 w-full" data-astro-cid-yodha2z4><div class="hero-grid" data-astro-cid-yodha2z4><div class="hero-copy" data-astro-cid-yodha2z4><p class="hero-eyebrow hero-rise" data-astro-cid-yodha2z4>${hero.eyebrow}</p><h1 id="hero-heading" class="hero-title hero-rise" data-astro-cid-yodha2z4>${hero.headline}<br data-astro-cid-yodha2z4><span class="hero-accent" data-astro-cid-yodha2z4>${hero.headlineAccent}</span>${" "}${hero.headlineSuffix}</h1><p id="hero-sub" class="hero-sub hero-rise" data-astro-cid-yodha2z4>${renderComponent($$result, "Emphasis", $$Emphasis, {
		"text": hero.sub,
		"data-astro-cid-yodha2z4": true
	})}</p><div class="hero-actions hero-rise" data-astro-cid-yodha2z4><a href="#contact" class="hero-cta hero-cta--primary" data-astro-cid-yodha2z4>${hero.cta1}</a><a href="#services" class="hero-cta hero-cta--secondary" data-astro-cid-yodha2z4>${hero.cta2}</a></div></div>${trust.facts.length > 0 && renderTemplate`<div class="hero-trust hero-rise" data-astro-cid-yodha2z4><h2 class="hero-trust__title" data-astro-cid-yodha2z4>${trust.title}</h2><ul class="hero-trust__list" data-astro-cid-yodha2z4>${trust.facts.map((fact) => renderTemplate`<li class="hero-trust__fact" data-astro-cid-yodha2z4><span class="hero-trust__mark" aria-hidden="true" data-astro-cid-yodha2z4><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-yodha2z4><polyline points="20 6 9 17 4 12" data-astro-cid-yodha2z4></polyline></svg></span><div data-astro-cid-yodha2z4><p class="hero-trust__name" data-astro-cid-yodha2z4>${fact.title}</p><p class="hero-trust__text" data-astro-cid-yodha2z4>${fact.text}</p><a class="hero-trust__link"${addAttribute(fact.href, "href")} data-astro-cid-yodha2z4>${fact.linkLabel}<span aria-hidden="true" data-astro-cid-yodha2z4>→</span></a></div></li>`)}</ul></div>`}</div></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Hero.astro", void 0);
//#endregion
//#region src/components/sections/About.astro
createAstro("https://tracht-digital.de");
var $$About = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$About;
	const lang = resolveLang(Astro.currentLocale);
	const about = await cmsFor("why_me", lang, getHomeContent(lang).whyMe);
	return renderTemplate`${maybeRenderHead($$result)}<section id="about" class="tds-wash section-spacing" aria-labelledby="about-heading" data-astro-cid-5gtlsymu><span class="tds-decor" aria-hidden="true" data-astro-cid-5gtlsymu><img src="/images/sections/why-me.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" class="about-photo absolute inset-0 h-full w-full object-cover object-left" data-astro-cid-5gtlsymu><span class="about-photo-scrim absolute inset-0" data-astro-cid-5gtlsymu></span></span><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-5gtlsymu><div class="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center" data-astro-cid-5gtlsymu><div class="max-w-sm mx-auto md:mx-0 w-full" data-astro-cid-5gtlsymu><div class="relative" data-astro-cid-5gtlsymu><span aria-hidden="true" class="portrait-shape tds-shape tds-shape--rect tds-shape--coral -z-10" data-astro-cid-5gtlsymu></span><img${addAttribute(portraitSrc(720), "src")}${addAttribute(portraitSrcset(), "srcset")} sizes="(min-width: 768px) 24rem, 60vw"${addAttribute(PORTRAIT_SIZE.width, "width")}${addAttribute(PORTRAIT_SIZE.height, "height")}${addAttribute(siteConfig.founder.name, "alt")} loading="lazy" decoding="async" class="portrait-fade rounded-[2px] aspect-[3/4] object-cover object-top w-full" data-astro-cid-5gtlsymu></div></div><div class="text-center md:text-left" data-astro-cid-5gtlsymu><h2 id="about-heading" class="display text-4xl md:text-5xl lg:text-6xl text-[var(--color-black)] mb-8" data-astro-cid-5gtlsymu>${about.headline}${" "}${renderComponent($$result, "AccentLetters", $$AccentLetters, {
		"text": about.headlineAccent,
		"data-astro-cid-5gtlsymu": true
	})}</h2><p class="text-lg font-medium text-[var(--color-black)] mb-6 leading-relaxed" data-astro-cid-5gtlsymu>${renderComponent($$result, "Emphasis", $$Emphasis, {
		"text": about.lead,
		"data-astro-cid-5gtlsymu": true
	})}</p><p class="text-[var(--color-muted)] mb-4 leading-relaxed" data-astro-cid-5gtlsymu>${about.p1}</p><p class="text-[var(--color-muted)] leading-relaxed" data-astro-cid-5gtlsymu>${about.p2}</p></div></div></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/About.astro", void 0);
//#endregion
//#region src/components/ui/ServiceCard.astro
createAstro("https://tracht-digital.de");
var $$ServiceCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ServiceCard;
	const { href, title, problem, result, keywords, image = null, lang } = Astro.props;
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
	return renderTemplate`${maybeRenderHead($$result)}<article class="service-tile group relative flex flex-col bg-[var(--lp-surface-card)] transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--color-accent-pink)_10%,var(--color-card))]" data-astro-cid-hwunfzhe>${image && renderTemplate`<div class="service-tile__shot" aria-hidden="true" data-astro-cid-hwunfzhe><img${addAttribute(image, "src")}${addAttribute(srcsetFor(image, SERVICE_PHOTO_VARIANT_WIDTHS, PHOTO.width), "srcset")} sizes="(min-width: 80rem) 40rem, (min-width: 40rem) 50vw, 100vw" alt=""${addAttribute(PHOTO.width, "width")}${addAttribute(PHOTO.height, "height")} loading="lazy" decoding="async" data-astro-cid-hwunfzhe></div>`}<div class="flex flex-col flex-1 p-6 sm:p-7 md:p-8" data-astro-cid-hwunfzhe><h3 class="font-[var(--font-display)] text-xl md:text-2xl text-[var(--color-black)] mb-5" data-astro-cid-hwunfzhe><a${addAttribute(href, "href")} class="service-tile__link" data-astro-cid-hwunfzhe>${title}</a></h3><dl class="service-tile__facts" data-astro-cid-hwunfzhe>${problem && renderTemplate`<div data-astro-cid-hwunfzhe><dt data-astro-cid-hwunfzhe>${ui.problem}</dt><dd data-astro-cid-hwunfzhe>${problem}</dd></div>`}${result && renderTemplate`<div data-astro-cid-hwunfzhe><dt data-astro-cid-hwunfzhe>${ui.result}</dt><dd data-astro-cid-hwunfzhe>${result}</dd></div>`}<div data-astro-cid-hwunfzhe><dt data-astro-cid-hwunfzhe>${ui.scope}</dt><dd data-astro-cid-hwunfzhe><ul class="flex flex-wrap gap-2 mt-1.5" data-astro-cid-hwunfzhe>${keywords.map((keyword) => renderTemplate`<li class="px-3 py-1 text-xs rounded-full bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--lp-surface-card))] text-[var(--color-accent)] transition-colors duration-200 group-hover:bg-[color-mix(in_srgb,var(--color-accent)_18%,var(--lp-surface-card))]" data-astro-cid-hwunfzhe>${keyword}</li>`)}</ul></dd></div></dl><span aria-hidden="true" class="service-tile__more" data-astro-cid-hwunfzhe>${ui.more}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-hwunfzhe><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-hwunfzhe></line><polyline points="12 5 19 12 12 19" data-astro-cid-hwunfzhe></polyline></svg></span></div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/ServiceCard.astro", void 0);
//#endregion
//#region src/lib/serviceFinder.ts
/** The catalogue order — also the tie-breaker between equally strong matches. */
var SERVICE_ORDER = [
	"consulting",
	"process",
	"solutions",
	"web-presence"
];
var TOPIC_IDS = [...SERVICE_ORDER, "unsure"];
var STAGE_IDS = [
	"clear",
	"rough",
	"open"
];
var TOPIC_WEIGHT = 3;
var SITUATION_WEIGHT = 2;
var STAGE_CONSULTING_WEIGHT = {
	clear: 0,
	rough: 1,
	open: 2
};
var MIN_SCORE = 2;
var FINDER_COPY = {
	de: {
		progress: (step, total) => `Schritt ${step} von ${total}`,
		topicsQuestion: "Worum geht es Ihnen vor allem?",
		topicsHelp: "Mehrfachauswahl möglich.",
		topics: {
			consulting: { label: "Erst klären, was sinnvoll ist" },
			process: { label: "Abläufe kosten zu viel Zeit" },
			solutions: { label: "Programme arbeiten nicht zusammen" },
			"web-presence": { label: "Webseite, Webshop oder Sichtbarkeit" },
			unsure: {
				label: "Ich weiß es noch nicht",
				hint: "Dann sortieren wir zuerst gemeinsam."
			}
		},
		situationsQuestion: "Was davon kennen Sie aus Ihrem Betrieb?",
		situationsHelp: "Mehrfachauswahl möglich – oder ohne Auswahl weiter.",
		stageQuestion: "Wie weit ist Ihr Vorhaben?",
		stageHelp: "Eine Antwort.",
		stages: {
			clear: {
				label: "Klar umrissen",
				hint: "Ziel und Umfang stehen, es soll umgesetzt werden."
			},
			rough: {
				label: "Eine grobe Idee",
				hint: "Die Richtung ist klar, die Details noch nicht."
			},
			open: {
				label: "Noch ganz offen",
				hint: "Erst einmal sortieren, was überhaupt dran ist."
			}
		},
		pickOne: "Bitte wählen Sie mindestens eine Antwort.",
		pickStage: "Bitte wählen Sie eine Antwort.",
		next: "Weiter",
		back: "Zurück",
		showResult: "Ergebnis anzeigen",
		restart: "Neu starten",
		resultTitle: "Das passt zu Ihrem Anliegen",
		rankBest: "Passt am besten",
		rankAlso: "Passt ebenfalls",
		whyLabel: "Ihre Angaben dazu:",
		detailLink: "Leistung im Detail",
		note: "Eine erste Orientierung, keine Festlegung – im Erstgespräch klären wir, was wirklich passt.",
		cta: "Mit dieser Auswahl Erstgespräch vereinbaren",
		handoffNote: "Ihre Auswahl steht dann im Nachrichtenfeld des Kontaktformulars. Gesendet wird erst, wenn Sie das Formular selbst abschicken.",
		draft: {
			intro: "Aus dem Leistungs-Finder:",
			services: "Passende Leistungen",
			situations: "Ausgangslage",
			stage: "Stand"
		}
	},
	en: {
		progress: (step, total) => `Step ${step} of ${total}`,
		topicsQuestion: "What matters most to you?",
		topicsHelp: "Choose as many as apply.",
		topics: {
			consulting: { label: "Work out first what makes sense" },
			process: { label: "Workflows take too much time" },
			solutions: { label: "Programs do not work together" },
			"web-presence": { label: "Website, online shop or visibility" },
			unsure: {
				label: "I do not know yet",
				hint: "Then we sort things out together first."
			}
		},
		situationsQuestion: "Which of these do you recognise from your business?",
		situationsHelp: "Choose as many as apply – or continue without.",
		stageQuestion: "How far along is your project?",
		stageHelp: "One answer.",
		stages: {
			clear: {
				label: "Clearly defined",
				hint: "Goal and scope are set, and it needs to be built."
			},
			rough: {
				label: "A rough idea",
				hint: "The direction is clear, the details are not."
			},
			open: {
				label: "Still completely open",
				hint: "First work out what actually needs doing."
			}
		},
		pickOne: "Please choose at least one answer.",
		pickStage: "Please choose one answer.",
		next: "Next",
		back: "Back",
		showResult: "Show result",
		restart: "Start again",
		resultTitle: "What fits your request",
		rankBest: "Best fit",
		rankAlso: "Also fits",
		whyLabel: "Your answers:",
		detailLink: "Service details",
		note: "A first sense of direction, not a commitment – in the first conversation we work out what really fits.",
		cta: "Arrange an initial consultation with this selection",
		handoffNote: "Your selection then appears in the message field of the contact form. Nothing is sent until you submit the form yourself.",
		draft: {
			intro: "From the service finder:",
			services: "Matching services",
			situations: "Starting point",
			stage: "Stage"
		}
	}
};
/** The section around the finder, and the pointer to it from the services. */
var FINDER_SECTION = {
	de: {
		headline: "Welche Leistung passt zu",
		headlineAccent: "Ihnen?",
		intro: "Drei kurze Fragen, eine erste Orientierung. Das Ergebnis können Sie direkt ins Kontaktformular übernehmen – gesendet wird erst, wenn Sie es selbst abschicken.",
		servicesLink: "Unsicher, was passt? Zum Leistungs-Finder"
	},
	en: {
		headline: "Which service fits",
		headlineAccent: "you?",
		intro: "Three short questions, a first sense of direction. You can take the result straight into the contact form – nothing is sent until you submit it yourself.",
		servicesLink: "Not sure which fits? Try the service finder"
	}
};
/**
* The starting points offered in step two.
*
* Those of the chosen services, or a couple of every service when the visitor
* chose none (only "not sure yet"). Never more than eight: four services with
* four sentences each is a wall nobody reads on a phone.
*/
function situationOptions(topics, services) {
	const chosen = SERVICE_ORDER.filter((id) => topics.includes(id));
	const ids = chosen.length > 0 ? chosen : SERVICE_ORDER;
	const perService = ids.length <= 2 ? 4 : 2;
	return ids.flatMap((id) => {
		return (services.find((candidate) => candidate.id === id)?.situations ?? []).slice(0, perService).map((text, index) => ({
			key: `${id}:${index}`,
			serviceId: id,
			text
		}));
	});
}
/** Services worth suggesting, strongest first. Never empty. */
function recommend(answers, lang) {
	const copy = FINDER_COPY[lang];
	const tally = new Map(SERVICE_ORDER.map((id) => [id, {
		score: 0,
		reasons: []
	}]));
	const add = (id, weight, reason) => {
		const entry = tally.get(id);
		if (!entry || weight <= 0) return;
		entry.score += weight;
		if (!entry.reasons.includes(reason)) entry.reasons.push(reason);
	};
	for (const topic of answers.topics) add(topic === "unsure" ? "consulting" : topic, TOPIC_WEIGHT, copy.topics[topic].label);
	for (const choice of answers.situations) add(choice.serviceId, SITUATION_WEIGHT, choice.text);
	if (answers.stage) add("consulting", STAGE_CONSULTING_WEIGHT[answers.stage], copy.stages[answers.stage].label);
	const matches = SERVICE_ORDER.map((serviceId, order) => ({
		serviceId,
		order,
		...tally.get(serviceId)
	})).filter((match) => match.score >= MIN_SCORE).sort((a, b) => b.score - a.score || a.order - b.order).map(({ serviceId, score, reasons }) => ({
		serviceId,
		score,
		reasons
	}));
	return matches.length > 0 ? matches : [{
		serviceId: "consulting",
		score: 0,
		reasons: []
	}];
}
/** The text handed to the contact form — the visitor's choices, nothing invented. */
function buildDraft(matches, answers, services, lang) {
	const { draft, stages } = FINDER_COPY[lang];
	const title = (id) => services.find((service) => service.id === id)?.title ?? id;
	const lines = [draft.intro, `${draft.services}: ${matches.map((match) => title(match.serviceId)).join(", ")}`];
	if (answers.situations.length > 0) lines.push(`${draft.situations}: ${answers.situations.map((choice) => choice.text).join(" ")}`);
	if (answers.stage) lines.push(`${draft.stage}: ${stages[answers.stage].label}`);
	return `${lines.join("\n")}\n\n`;
}
//#endregion
//#region src/components/sections/Services.astro
createAstro("https://tracht-digital.de");
var $$Services = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Services;
	const lang = resolveLang(Astro.currentLocale);
	const servicesContent = await cmsFor("services_overview", lang, getHomeContent(lang).servicesOverview);
	const services = await Promise.all(serviceDefinitions.map(async (definition) => ({
		definition,
		content: await resolveServiceContent(definition, lang)
	})));
	return renderTemplate`${maybeRenderHead($$result)}<section id="services" class="tds-wash tds-wash--calm section-spacing tds-tone-sand" aria-labelledby="services-heading"><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">${renderComponent($$result, "SectionHeader", $$SectionHeader, {
		"headline": servicesContent.headline,
		"headlineAccent": servicesContent.headlineAccent,
		"id": "services-heading",
		"headingClass": "mb-6",
		"bar": true
	})}<p class="max-w-2xl text-[var(--color-muted)] leading-relaxed mb-3 text-center md:text-left mx-auto md:mx-0">${renderComponent($$result, "Emphasis", $$Emphasis, { "text": servicesContent.intro })}</p><p class="mb-10 text-center md:text-left"><a href="#leistungsfinder" class="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">${FINDER_SECTION[lang].servicesLink}<span aria-hidden="true">↓</span></a></p><div data-reveal class="-mx-6 md:mx-0 overflow-hidden rounded-none md:rounded-[6px] bg-[var(--color-line)] grid gap-px sm:grid-cols-2">${services.map(({ definition, content }) => renderTemplate`${renderComponent($$result, "ServiceCard", $$ServiceCard, {
		"href": serviceHref(definition, lang),
		"title": content.title,
		"problem": content.situations[0] ?? "",
		"result": content.outcomes[0] ?? "",
		"keywords": definition.keywords[lang],
		"image": definition.image,
		"lang": lang
	})}`)}</div></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Services.astro", void 0);
//#endregion
//#region src/lib/contactDraft.ts
/**
* The hand-over from the service finder to the contact form.
*
* Text for the message field, nothing more: it is never sent by itself. Two
* channels, because the contact form hydrates `client:visible` — when the
* finder's link jumps down to it, the form usually is not live yet:
*
* - `sessionStorage` holds the draft until the form mounts and reads it;
* - the event reaches a form that is already hydrated.
*
* Whichever applies it removes the stored copy, so a later visit in the same
* tab does not find an old draft in the field.
*/
var CONTACT_DRAFT_KEY = "tds-contact-draft";
var CONTACT_DRAFT_EVENT = "tds:contact-draft";
function handOffContactDraft(draft) {
	try {
		window.sessionStorage.setItem(CONTACT_DRAFT_KEY, draft);
	} catch {}
	window.dispatchEvent(new CustomEvent(CONTACT_DRAFT_EVENT, { detail: draft }));
}
//#endregion
//#region src/components/islands/ServiceFinder.tsx
/**
* Leistungs-Finder — see `lib/serviceFinder.ts` for what it asks and why.
*
* ### Built as a form, not as a quiz widget
*
* - Every question is a `<fieldset>` whose `<legend>` is the question, and the
*   answers are native checkboxes and radios inside their labels: announced,
*   operable with Space, grouped, no ARIA to keep in sync.
* - A step change moves focus to the new question (and to the result heading),
*   so a screen reader hears where it is and a phone does not stay scrolled
*   below a list that is gone. Never on the first render — hydrating must not
*   pull focus out of the page.
* - A missing answer is said in words (`role="alert"`, tied to the group), not
*   by a disabled button nobody can explain.
* - It sends nothing: the result's link hands a draft to the contact form.
*/
function ServiceFinder({ lang = "de", services, contactHref }) {
	const copy = FINDER_COPY[lang];
	const uid = useId();
	const [step, setStep] = useState(0);
	const [topics, setTopics] = useState([]);
	const [situations, setSituations] = useState([]);
	const [stage, setStage] = useState(null);
	const [hint, setHint] = useState("");
	const questionRef = useRef(null);
	const resultRef = useRef(null);
	const firstRender = useRef(true);
	const options = useMemo(() => situationOptions(topics, services), [topics, services]);
	const matches = useMemo(() => step === 3 ? recommend({
		topics,
		situations,
		stage
	}, lang) : [], [
		step,
		topics,
		situations,
		stage,
		lang
	]);
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		(step === 3 ? resultRef.current : questionRef.current)?.focus();
	}, [step]);
	const serviceTitle = (id) => services.find((service) => service.id === id)?.title;
	const toggleTopic = (id) => {
		setHint("");
		setTopics((current) => current.includes(id) ? current.filter((topic) => topic !== id) : [...current, id]);
	};
	const toggleSituation = (choice) => {
		setSituations((current) => current.some((selected) => selected.key === choice.key) ? current.filter((selected) => selected.key !== choice.key) : [...current, choice]);
	};
	const next = (event) => {
		event.preventDefault();
		if (step === 0 && topics.length === 0) {
			setHint(copy.pickOne);
			return;
		}
		if (step === 2 && stage === null) {
			setHint(copy.pickStage);
			return;
		}
		if (step === 0) {
			const offered = new Set(situationOptions(topics, services).map((choice) => choice.key));
			setSituations((current) => current.filter((choice) => offered.has(choice.key)));
		}
		setHint("");
		setStep((current) => Math.min(current + 1, 3));
	};
	const back = () => {
		setHint("");
		setStep((current) => Math.max(current - 1, 0));
	};
	const restart = () => {
		setTopics([]);
		setSituations([]);
		setStage(null);
		setHint("");
		setStep(0);
	};
	const handOff = () => {
		handOffContactDraft(buildDraft(matches, {
			topics,
			situations,
			stage
		}, services, lang));
	};
	if (step === 3) return /* @__PURE__ */ jsxs("div", {
		className: "finder",
		"data-step": "result",
		children: [
			/* @__PURE__ */ jsx("h3", {
				ref: resultRef,
				tabIndex: -1,
				className: "finder__result-title",
				children: copy.resultTitle
			}),
			/* @__PURE__ */ jsx("ol", {
				className: "finder__matches",
				children: matches.map((match, index) => {
					const service = services.find((candidate) => candidate.id === match.serviceId);
					if (!service) return null;
					return /* @__PURE__ */ jsxs("li", {
						className: "finder__match",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "finder__rank",
								children: index === 0 ? copy.rankBest : copy.rankAlso
							}),
							/* @__PURE__ */ jsx("h4", {
								className: "finder__match-title",
								children: service.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "finder__summary",
								children: service.summary
							}),
							match.reasons.length > 0 && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("p", {
								className: "finder__why-label",
								children: copy.whyLabel
							}), /* @__PURE__ */ jsx("ul", {
								className: "finder__why",
								children: match.reasons.map((reason) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("span", {
									"aria-hidden": "true",
									className: "finder__tick",
									children: "✓"
								}), /* @__PURE__ */ jsx("span", { children: reason })] }, reason))
							})] }),
							/* @__PURE__ */ jsxs("a", {
								className: "finder__detail",
								href: service.href,
								children: [copy.detailLink, /* @__PURE__ */ jsx("span", {
									"aria-hidden": "true",
									children: "→"
								})]
							})
						]
					}, match.serviceId);
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "finder__note",
				children: copy.note
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "finder__actions",
				children: [
					/* @__PURE__ */ jsxs("a", {
						className: "finder__cta",
						href: contactHref,
						onClick: handOff,
						children: [copy.cta, /* @__PURE__ */ jsx("span", {
							"aria-hidden": "true",
							children: "→"
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "finder__secondary",
						onClick: restart,
						children: copy.restart
					}),
					/* @__PURE__ */ jsx("p", {
						className: "finder__handoff",
						children: copy.handoffNote
					})
				]
			})
		]
	});
	const question = step === 0 ? copy.topicsQuestion : step === 1 ? copy.situationsQuestion : copy.stageQuestion;
	const help = step === 0 ? copy.topicsHelp : step === 1 ? copy.situationsHelp : copy.stageHelp;
	const helpId = `${uid}-help`;
	const hintId = `${uid}-hint`;
	return /* @__PURE__ */ jsxs("form", {
		className: "finder",
		"data-step": step + 1,
		onSubmit: next,
		noValidate: true,
		children: [
			/* @__PURE__ */ jsxs("p", {
				className: "finder__progress",
				children: [/* @__PURE__ */ jsx("span", { children: copy.progress(step + 1, 3) }), /* @__PURE__ */ jsx("span", {
					className: "finder__bar",
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsx("i", { style: { width: `${(step + 1) / 3 * 100}%` } })
				})]
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "finder__fieldset",
				"aria-describedby": hint ? `${helpId} ${hintId}` : helpId,
				children: [
					/* @__PURE__ */ jsx("legend", {
						ref: questionRef,
						tabIndex: -1,
						className: "finder__question",
						children: question
					}),
					/* @__PURE__ */ jsx("p", {
						id: helpId,
						className: "finder__help",
						children: help
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "finder__options",
						children: [
							step === 0 && TOPIC_IDS.map((id) => /* @__PURE__ */ jsxs("label", {
								className: "finder__option",
								children: [/* @__PURE__ */ jsx("input", {
									className: "finder__input",
									type: "checkbox",
									name: `${uid}-topic`,
									value: id,
									checked: topics.includes(id),
									onChange: () => toggleTopic(id)
								}), /* @__PURE__ */ jsxs("span", {
									className: "finder__option-body",
									children: [/* @__PURE__ */ jsx("span", {
										className: "finder__option-label",
										children: copy.topics[id].label
									}), /* @__PURE__ */ jsx("span", {
										className: "finder__option-hint",
										children: copy.topics[id].hint ?? serviceTitle(id)
									})]
								})]
							}, id)),
							step === 1 && options.map((choice) => /* @__PURE__ */ jsxs("label", {
								className: "finder__option",
								children: [/* @__PURE__ */ jsx("input", {
									className: "finder__input",
									type: "checkbox",
									name: `${uid}-situation`,
									value: choice.key,
									checked: situations.some((selected) => selected.key === choice.key),
									onChange: () => toggleSituation(choice)
								}), /* @__PURE__ */ jsx("span", {
									className: "finder__option-body",
									children: /* @__PURE__ */ jsx("span", {
										className: "finder__option-label",
										children: choice.text
									})
								})]
							}, choice.key)),
							step === 2 && STAGE_IDS.map((id) => /* @__PURE__ */ jsxs("label", {
								className: "finder__option",
								children: [/* @__PURE__ */ jsx("input", {
									className: "finder__input",
									type: "radio",
									name: `${uid}-stage`,
									value: id,
									checked: stage === id,
									onChange: () => {
										setHint("");
										setStage(id);
									}
								}), /* @__PURE__ */ jsxs("span", {
									className: "finder__option-body",
									children: [/* @__PURE__ */ jsx("span", {
										className: "finder__option-label",
										children: copy.stages[id].label
									}), /* @__PURE__ */ jsx("span", {
										className: "finder__option-hint",
										children: copy.stages[id].hint
									})]
								})]
							}, id))
						]
					})
				]
			}),
			hint && /* @__PURE__ */ jsx("p", {
				id: hintId,
				className: "finder__hint",
				role: "alert",
				children: hint
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "finder__nav",
				children: [step > 0 && /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "finder__secondary",
					onClick: back,
					children: copy.back
				}), /* @__PURE__ */ jsxs("button", {
					type: "submit",
					className: "finder__cta",
					children: [step === 2 ? copy.showResult : copy.next, /* @__PURE__ */ jsx("span", {
						"aria-hidden": "true",
						children: "→"
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/sections/ServiceFinder.astro
createAstro("https://tracht-digital.de");
var $$ServiceFinder = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ServiceFinder;
	const lang = resolveLang(Astro.currentLocale);
	const section = FINDER_SECTION[lang];
	const services = await Promise.all(serviceDefinitions.map(async (definition) => {
		const content = await resolveServiceContent(definition, lang);
		return {
			id: definition.id,
			title: content.title,
			summary: content.summary,
			href: serviceHref(definition, lang),
			situations: content.situations.slice(0, 4)
		};
	}));
	const contactHref = `${localizePath("/", lang)}#contact`;
	return renderTemplate`${maybeRenderHead($$result)}<section id="leistungsfinder" class="section-spacing tds-tone-sand" aria-labelledby="finder-heading" data-astro-cid-gslr3il5><div class="max-w-5xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-gslr3il5>${renderComponent($$result, "SectionHeader", $$SectionHeader, {
		"headline": section.headline,
		"headlineAccent": section.headlineAccent,
		"id": "finder-heading",
		"headingClass": "mb-6",
		"data-astro-cid-gslr3il5": true
	})}<p class="max-w-2xl text-[var(--color-muted)] leading-relaxed mb-10 text-center md:text-left mx-auto md:mx-0" data-astro-cid-gslr3il5>${section.intro}</p>${renderComponent($$result, "ServiceFinderIsland", ServiceFinder, {
		"client:visible": true,
		"lang": lang,
		"services": services,
		"contactHref": contactHref,
		"data-astro-cid-gslr3il5": true,
		"client:component-hydration": "visible",
		"client:component-path": "~/components/islands/ServiceFinder",
		"client:component-export": "default"
	})}</div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/ServiceFinder.astro", void 0);
//#endregion
//#region src/components/ui/ReferenceCard.astro
createAstro("https://tracht-digital.de");
var $$ReferenceCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ReferenceCard;
	const { card, lang, badge } = Astro.props;
	const ui = lang === "de" ? {
		context: "Kontext",
		result: "Ergebnis",
		metric: "Belegbare Kennzahl",
		article: "Mehr erfahren",
		site: "Webseite ansehen",
		previewAlt: (title) => `Startseite der Webseite: ${title}`
	} : {
		context: "Context",
		result: "Outcome",
		metric: "Verifiable metric",
		article: "Learn more",
		site: "View the website",
		previewAlt: (title) => `Home page of the website: ${title}`
	};
	const [primaryService, ...furtherServices] = card.services;
	const cta = card.articleHref ? {
		href: card.articleHref,
		label: ui.article,
		detail: card.reference.title
	} : card.siteHref ? {
		href: card.siteHref,
		label: ui.site,
		external: true,
		hreflang: "de",
		detail: card.reference.title
	} : null;
	return renderTemplate`${maybeRenderHead($$result)}<article class="reference-card-slot" data-reveal data-astro-cid-ew64svfl><div class="reference-card" data-astro-cid-ew64svfl>${card.preview && renderTemplate`<div class="reference-card__shot" data-astro-cid-ew64svfl><img${addAttribute(card.preview.src, "src")}${addAttribute(srcsetFor(card.preview.src, PREVIEW_VARIANT_WIDTHS, card.preview.width), "srcset")} sizes="(min-width: 80rem) 40rem, (min-width: 48rem) 50vw, 100vw"${addAttribute(ui.previewAlt(card.reference.title), "alt")}${addAttribute(card.preview.width, "width")}${addAttribute(card.preview.height, "height")} loading="lazy" decoding="async" data-astro-cid-ew64svfl></div>`}<div class="reference-card__body" data-astro-cid-ew64svfl>${badge && renderTemplate`<p class="reference-card__badge" data-astro-cid-ew64svfl>${badge}</p>`}<p class="eyebrow text-[var(--color-accent)] mb-3" data-astro-cid-ew64svfl><span class="sr-only" data-astro-cid-ew64svfl>${ui.context}: </span>${card.reference.context}</p><h3 class="reference-card__title" data-astro-cid-ew64svfl>${card.reference.title}</h3><p class="reference-card__result" data-astro-cid-ew64svfl><span class="sr-only" data-astro-cid-ew64svfl>${ui.result}: </span>${card.reference.result}</p>${card.reference.metric && renderTemplate`<p class="reference-card__metric" data-astro-cid-ew64svfl><span class="sr-only" data-astro-cid-ew64svfl>${ui.metric}: </span>${card.reference.metric}</p>`}${furtherServices.length > 0 && renderTemplate`<ul class="reference-card__services" data-astro-cid-ew64svfl>${furtherServices.map((service) => renderTemplate`<li data-astro-cid-ew64svfl><a${addAttribute(service.href, "href")} class="status-pill status-pill--accent reference-card__service" data-astro-cid-ew64svfl>${service.label}</a></li>`)}</ul>`}</div>${renderComponent($$result, "CardActions", $$CardActions, {
		"lang": lang,
		"service": primaryService ? {
			href: primaryService.href,
			label: primaryService.label
		} : null,
		"cta": cta,
		"data-astro-cid-ew64svfl": true
	})}</div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/ReferenceCard.astro", void 0);
//#endregion
//#region src/components/sections/CustomerCases.astro
createAstro("https://tracht-digital.de");
var $$CustomerCases = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CustomerCases;
	const lang = resolveLang(Astro.currentLocale);
	const content = await cmsFor("references_home", lang, getHomeContent(lang).referencesHome);
	const previews = await getReferencePreviews();
	const cards = referenceCases.map((entry) => ({
		id: entry.id,
		preview: previews.get(entry.id) ?? null,
		reference: entry.content[lang],
		services: entry.services.map((id) => {
			const service = getServiceById(id);
			return {
				label: service.fallback[lang].title,
				href: serviceHref(service, lang)
			};
		}),
		articleHref: entry.articleSlug ? articleUrl(entry.articleSlug, lang) : null,
		siteHref: entry.siteUrl
	})).sort((a, b) => Number(b.preview !== null) - Number(a.preview !== null));
	const badge = lang === "de" ? "Kundenprojekt" : "Client project";
	return renderTemplate`${cards.length > 0 && renderTemplate`${maybeRenderHead($$result)}<section id="cases" class="section-spacing" aria-labelledby="cases-heading" data-astro-cid-yb3gni2u><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-yb3gni2u><div class="max-w-2xl mx-auto md:mx-0" data-astro-cid-yb3gni2u>${renderComponent($$result, "SectionHeader", $$SectionHeader, {
		"headline": content.headline,
		"headlineAccent": content.headlineAccent,
		"id": "cases-heading",
		"headingClass": "mb-6",
		"data-astro-cid-yb3gni2u": true
	})}<p class="text-[var(--color-muted)] leading-relaxed mb-3 text-center md:text-left" data-astro-cid-yb3gni2u>${renderComponent($$result, "Emphasis", $$Emphasis, {
		"text": content.intro,
		"data-astro-cid-yb3gni2u": true
	})}</p><p class="text-sm text-[var(--color-muted)] text-center md:text-left" data-astro-cid-yb3gni2u>${content.label}</p></div><div class="cases-grid" data-astro-cid-yb3gni2u>${cards.map((card) => renderTemplate`${renderComponent($$result, "ReferenceCard", $$ReferenceCard, {
		"card": card,
		"lang": lang,
		"badge": badge,
		"data-astro-cid-yb3gni2u": true
	})}`)}</div></div></section>`}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/CustomerCases.astro", void 0);
//#endregion
//#region src/components/ui/ProcessIcon.astro
createAstro("https://tracht-digital.de");
var $$ProcessIcon = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProcessIcon;
	const { number, class: className = "" } = Astro.props;
	return renderTemplate`${number === "01" && renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(className, "class")} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5 C21 16 17 19 12 19 C10.6 19 9.3 18.8 8 18.4 L3 20 L4.5 15.5 C3.6 14.4 3 13 3 11.5 C3 7 7 4 12 4 C17 4 21 7 21 11.5 Z"></path></svg>`}${number === "02" && renderTemplate`<svg${addAttribute(className, "class")} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4 L21 4 L17 20 L7 20 Z"></path><line x1="6" y1="10" x2="18" y2="10"></line><line x1="10" y1="4" x2="10" y2="20"></line></svg>`}${number === "03" && renderTemplate`<svg${addAttribute(className, "class")} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="8,6 2,12 8,18"></polyline><polyline points="16,6 22,12 16,18"></polyline><line x1="14" y1="4" x2="10" y2="20"></line></svg>`}${number === "04" && renderTemplate`<svg${addAttribute(className, "class")} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 L11 13"></path><path d="M22 2 L15 22 L11 13 L2 9 Z"></path></svg>`}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/ProcessIcon.astro", void 0);
//#endregion
//#region src/components/ui/ProcessStep.astro
createAstro("https://tracht-digital.de");
var $$ProcessStep = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProcessStep;
	const { number, title, duration, description, outcome = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="relative flex gap-4 md:gap-6 py-5 md:py-6"><div class="relative flex-shrink-0"><span aria-hidden="true" class="relative z-10 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--color-paper)] text-[var(--color-accent)] ring-4 ring-[var(--color-soft)]">${renderComponent($$result, "ProcessIcon", $$ProcessIcon, { "number": number })}</span></div><div class="flex-1 min-w-0 pb-2"><div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2"><span aria-hidden="true" class="text-xs font-medium tracking-widest text-[var(--color-muted)] tabular-nums">${number}</span><h3 class="text-lg font-[var(--font-display)] font-medium text-[var(--color-black)]">${title}</h3><span class="text-xs text-[var(--color-muted)] bg-[var(--color-card)] px-2.5 py-1 rounded-[100px]">${duration}</span></div><p class="text-sm text-[var(--color-muted)] leading-relaxed">${description}</p>${outcome && renderTemplate`<p class="mt-3 text-sm font-medium text-[var(--color-accent)]">${outcome}</p>`}</div></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/ProcessStep.astro", void 0);
//#endregion
//#region src/lib/processDetails.ts
var details = {
	de: {
		"01": {
			detail: "Sie erzählen mir, was Sie aufhält — die Liste, die dreimal geführt wird, die Seite, über die niemand anfragt. Ich frage nach und sage ehrlich, ob es sich lohnt.",
			outcome: "Ergebnis: Klarheit, ob und woran wir arbeiten."
		},
		"02": {
			detail: "Daraus wird eine Grundlage, die Sie lesen und entscheiden können: was gebraucht wird, welcher Weg sinnvoll ist, was er kostet, wie lange er dauert.",
			outcome: "Ergebnis: Plan, Zeitrahmen und ein Budget mit Obergrenze."
		},
		"03": {
			detail: "Gebaut wird in kurzen, sichtbaren Schritten. Sie sehen früh Zwischenstände zum Ausprobieren — nachsteuern ist unterwegs günstig, hinterher teuer.",
			outcome: "Ergebnis: Sie sehen früh, wie es wird."
		},
		"04": {
			detail: "Übergabe mit Einweisung, damit Sie Inhalte und Preise selbst pflegen können. Danach kümmere ich mich auf Wunsch weiter — gebunden sind Sie nicht.",
			outcome: "Ergebnis: Sie können selbst damit arbeiten."
		}
	},
	en: {
		"01": {
			detail: "You tell me what holds you up — the list kept in three places, the page nobody gets in touch through. I keep asking, and say honestly whether it's worth it.",
			outcome: "Outcome: clarity on whether, and on what, we work."
		},
		"02": {
			detail: "That turns into something you can read and decide on: what is needed, which route makes sense, roughly what it costs and how long it takes.",
			outcome: "Outcome: a plan, a timeline and a budget with a ceiling."
		},
		"03": {
			detail: "It gets built in short, visible steps. You see work in progress early — changing course is cheap along the way and expensive afterwards.",
			outcome: "Outcome: you see early how it's shaping up."
		},
		"04": {
			detail: "Handover with a walkthrough, so you can maintain content and prices yourself. After that I'll keep going if you want — you aren't tied to it.",
			outcome: "Outcome: you can work with it yourself."
		}
	}
};
function getProcessDetails(lang) {
	return details[lang];
}
//#endregion
//#region src/components/sections/Process.astro
createAstro("https://tracht-digital.de");
var $$Process = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Process;
	const t = tFor(Astro.currentLocale);
	const lang = resolveLang(Astro.currentLocale);
	const pd = getProcessDetails(lang);
	const defaultProcess = {
		label: t.process.label,
		headline: t.process.headline,
		headlineAccent: t.process.headlineAccent,
		body: t.process.body,
		steps: t.process.steps.map((s) => ({
			number: s.number,
			title: s.title,
			duration: s.duration,
			description: s.description,
			detail: pd[s.number]?.detail ?? "",
			outcome: pd[s.number]?.outcome ?? ""
		}))
	};
	const process = await cmsFor("process", lang, defaultProcess);
	const steps = process.steps;
	return renderTemplate`${maybeRenderHead($$result)}<section id="process" class="tds-wash tds-wash--mirror section-spacing tds-tone-sand" aria-labelledby="process-heading"><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">${renderComponent($$result, "SectionHeader", $$SectionHeader, {
		"headline": process.headline,
		"headlineAccent": process.headlineAccent,
		"id": "process-heading",
		"headingClass": "mb-6",
		"bar": true
	})}<p class="max-w-2xl text-[var(--color-muted)] leading-relaxed mb-12 text-center md:text-left mx-auto md:mx-0">${process.body}</p><div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-x-14 lg:items-start"><div class="relative"><span aria-hidden="true" class="absolute left-[1.375rem] md:left-6 top-6 bottom-6 w-px bg-gradient-to-b from-[var(--color-accent)]/40 via-[var(--color-line)] to-[var(--color-accent)]/20"></span><span aria-hidden="true" class="absolute left-[1.375rem] md:left-6 -translate-x-1/2 top-5 w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-soft)]"></span><ol class="relative pt-6 pb-6">${steps.map((step) => renderTemplate`<li>${renderComponent($$result, "ProcessStep", $$ProcessStep, {
		"number": step.number,
		"title": step.title,
		"duration": step.duration,
		"description": step.description,
		"outcome": step.outcome
	})}</li>`)}</ol><span aria-hidden="true" class="absolute left-[1.375rem] md:left-6 -translate-x-1/2 bottom-5 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-soft)]"></span></div><div class="lg:sticky lg:top-28">${renderComponent($$result, "FirstCall", $$FirstCall, { "variant": "process" })}</div></div></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Process.astro", void 0);
//#endregion
//#region src/components/ui/PreviewLightbox.astro
createAstro("https://tracht-digital.de");
var $$PreviewLightbox = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PreviewLightbox;
	const { lang } = Astro.props;
	const ui = lang === "de" ? {
		label: "Vergrößerte Vorschau",
		close: "Vorschau schließen",
		visit: "Zur Seite",
		newTab: "öffnet in neuem Tab"
	} : {
		label: "Enlarged preview",
		close: "Close preview",
		visit: "Open the site",
		newTab: "opens in a new tab"
	};
	return renderTemplate`${maybeRenderHead($$result)}<dialog class="preview" data-preview-dialog${addAttribute(ui.label, "aria-label")} data-astro-cid-7etuoo3p><div class="preview__frame" data-astro-cid-7etuoo3p><button type="button" class="preview__close" data-preview-close data-astro-cid-7etuoo3p><span class="sr-only" data-astro-cid-7etuoo3p>${ui.close}</span><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-7etuoo3p><line x1="6" y1="6" x2="18" y2="18" data-astro-cid-7etuoo3p></line><line x1="18" y1="6" x2="6" y2="18" data-astro-cid-7etuoo3p></line></svg></button><img class="preview__img" data-preview-img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" data-astro-cid-7etuoo3p><div class="preview__bar" data-astro-cid-7etuoo3p><div class="preview__meta" data-astro-cid-7etuoo3p><p class="preview__title" data-preview-title data-astro-cid-7etuoo3p></p><p class="preview__host" data-preview-host data-astro-cid-7etuoo3p></p></div><a class="preview__visit" data-preview-visit href="#" target="_blank" rel="noopener noreferrer" data-astro-cid-7etuoo3p>${ui.visit}<span class="sr-only" data-astro-cid-7etuoo3p> (${ui.newTab})</span><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-7etuoo3p><line x1="7" y1="17" x2="17" y2="7" data-astro-cid-7etuoo3p></line><polyline points="7 7 17 7 17 17" data-astro-cid-7etuoo3p></polyline></svg></a></div></div></dialog>${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/PreviewLightbox.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/PreviewLightbox.astro", void 0);
//#endregion
//#region src/components/sections/Showcase.astro
createAstro("https://tracht-digital.de");
var $$Showcase = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Showcase;
	const lang = resolveLang(Astro.currentLocale);
	const content = await cmsFor("website_demos", lang, getHomeContent(lang).websiteDemos);
	const demos = await getDemos();
	const copy = demosCopy(content, demos.length, "home");
	const webPresence = getServiceById("web-presence");
	const webPresenceLink = {
		label: webPresence.fallback[lang].title,
		href: serviceHref(webPresence, lang)
	};
	const slides = [...demos.map((demo) => ({
		kind: "demo",
		key: `demo:${demo.definition.id}`,
		demo
	})), {
		kind: "business-card",
		key: "business-card"
	}];
	const leadKey = demos.length > 0 ? slides[0].key : null;
	const ui = lang === "de" ? {
		carousel: "Beispielseiten und eigene Projekte",
		prev: "Vorherige Karten",
		next: "Weitere Karten"
	} : {
		carousel: "Example sites and own projects",
		prev: "Previous cards",
		next: "More cards"
	};
	return renderTemplate`${maybeRenderHead($$result)}<section id="showcase" class="section-spacing" aria-labelledby="showcase-heading" data-astro-cid-e5tmfi75><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-e5tmfi75><div class="max-w-2xl mx-auto md:mx-0" data-astro-cid-e5tmfi75>${renderComponent($$result, "SectionHeader", $$SectionHeader, {
		"headline": copy.headline,
		"headlineAccent": copy.headlineAccent,
		"id": "showcase-heading",
		"headingClass": "mb-6",
		"data-astro-cid-e5tmfi75": true
	})}<p class="text-[var(--color-muted)] leading-relaxed text-center md:text-left" data-astro-cid-e5tmfi75>${renderComponent($$result, "Emphasis", $$Emphasis, {
		"text": copy.intro,
		"data-astro-cid-e5tmfi75": true
	})}</p></div><div class="showcase" data-carousel data-astro-cid-e5tmfi75><div class="showcase__track" data-carousel-track tabindex="0" role="group"${addAttribute(ui.carousel, "aria-label")} data-astro-cid-e5tmfi75>${slides.map((slide) => renderTemplate`<div${addAttribute(["showcase__slide", slide.key === leadKey && "showcase__slide--lead"], "class:list")} data-astro-cid-e5tmfi75>${slide.kind === "demo" && renderTemplate`${renderComponent($$result, "DemoCard", $$DemoCard, {
		"demo": slide.demo,
		"lang": lang,
		"serviceLink": webPresenceLink,
		"data-astro-cid-e5tmfi75": true
	})}`}${slide.kind === "business-card" && renderTemplate`${renderComponent($$result, "BusinessCardTile", $$BusinessCardTile, {
		"serviceLink": webPresenceLink,
		"data-astro-cid-e5tmfi75": true
	})}`}</div>`)}</div><div class="showcase-nav" aria-hidden="true" data-carousel-nav hidden data-astro-cid-e5tmfi75><button type="button" class="showcase-nav__btn" data-carousel-prev tabindex="-1" data-astro-cid-e5tmfi75><span class="sr-only" data-astro-cid-e5tmfi75>${ui.prev}</span><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-e5tmfi75><path d="M15 5 8 12l7 7" data-astro-cid-e5tmfi75></path></svg></button><button type="button" class="showcase-nav__btn" data-carousel-next tabindex="-1" data-astro-cid-e5tmfi75><span class="sr-only" data-astro-cid-e5tmfi75>${ui.next}</span><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-e5tmfi75><path d="m9 5 7 7-7 7" data-astro-cid-e5tmfi75></path></svg></button></div></div></div>${renderComponent($$result, "PreviewLightbox", $$PreviewLightbox, {
		"lang": lang,
		"data-astro-cid-e5tmfi75": true
	})}</section>${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Showcase.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Showcase.astro", void 0);
//#endregion
//#region src/lib/content.ts
async function fetchTopics(lang, limit = 3) {
	return [];
}
async function fetchPostsBySlug(slugs, lang) {
	return [];
}
//#endregion
//#region src/components/ui/BlogPostCard.astro
createAstro("https://tracht-digital.de");
var $$BlogPostCard = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$BlogPostCard;
	const { category, title, excerpt, slug, formattedDate, readMore, coverHint = null } = Astro2.props;
	const blogBase = "https://blog.tracht-digital.de";
	const hasPhoto = hasPhotoCover(coverHint);
	return renderTemplate`${maybeRenderHead($$result)}<article class="post-card-slot" data-reveal data-astro-cid-szrnyh26><a class="post-card"${addAttribute(`${blogBase}/${slug}`, "href")} data-astro-cid-szrnyh26><div class="post-card__cover" data-astro-cid-szrnyh26><div class="post-card__art" data-astro-cid-szrnyh26>${hasPhoto ? renderTemplate`<img${addAttribute(coverHint, "src")}${addAttribute(title, "alt")} width="1200" height="900" loading="lazy" decoding="async" data-astro-cid-szrnyh26>` : renderTemplate`${renderComponent($$result, "AbstractCover", AbstractCover, {
		"variant": coverVariant(slug),
		"data-astro-cid-szrnyh26": true
	})}`}</div></div><div class="post-card__body" data-astro-cid-szrnyh26><div class="post-card__meta" data-astro-cid-szrnyh26><span class="eyebrow" data-astro-cid-szrnyh26>${category}</span><span class="post-card__date" data-astro-cid-szrnyh26>${formattedDate}</span></div><h3 class="card-title" data-astro-cid-szrnyh26>${title}</h3><p class="post-card__excerpt" data-astro-cid-szrnyh26>${excerpt}</p><div class="post-card__foot" data-astro-cid-szrnyh26><span class="post-card__more" data-astro-cid-szrnyh26>${readMore}<span aria-hidden="true" data-astro-cid-szrnyh26>→</span></span></div></div></a></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/BlogPostCard.astro", void 0);
//#endregion
//#region src/components/sections/Journal.astro
createAstro("https://tracht-digital.de");
var $$Journal = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Journal;
	const t = tFor(Astro.currentLocale);
	const lang = resolveLang(Astro.currentLocale);
	const curatedSlugs = (await fetchBlocks("de")).journal?.slugs ?? [];
	let livePosts = [];
	if (curatedSlugs.length > 0) livePosts = await fetchPostsBySlug(curatedSlugs.slice(0, 3), lang);
	else livePosts = await fetchTopics(lang, 3);
	const formatter = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-IE", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	const posts = livePosts.length > 0 ? livePosts.map((p) => ({
		slug: p.slug,
		category: p.category,
		title: p.title,
		excerpt: p.excerpt,
		formattedDate: p.publishedAt ? formatter.format(new Date(p.publishedAt)) : "",
		coverHint: p.coverHint
	})) : t.blog.posts.slice(0, 3).map((p) => ({
		slug: p.slug,
		category: p.category,
		title: p.title,
		excerpt: p.excerpt,
		formattedDate: formatter.format(new Date(p.date)),
		coverHint: null
	}));
	const gridCols = {
		1: "sm:grid-cols-1",
		2: "sm:grid-cols-2",
		3: "sm:grid-cols-3"
	}[Math.min(posts.length, 3)] ?? "sm:grid-cols-3";
	return renderTemplate`${maybeRenderHead($$result)}<section id="blog" class="py-16 md:py-24 tds-tone-sand" aria-labelledby="journal-heading"><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12"><div class="flex items-end justify-between mb-10"><h2 id="journal-heading" class="display text-4xl md:text-5xl lg:text-6xl text-[var(--color-black)]">${t.blog.headline}${" "}${renderComponent($$result, "AccentLetters", $$AccentLetters, { "text": t.blog.headlineAccent })}</h2><a href="https://blog.tracht-digital.de" class="hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors group [@media(pointer:coarse)]:min-h-11">${t.blog.allPosts}<span aria-hidden="true" class="group-hover:translate-x-1 transition-transform duration-200">→</span></a></div><div${addAttribute(["grid gap-6", gridCols], "class:list")}>${posts.map((post) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": post.slug,
		"category": post.category,
		"title": post.title,
		"excerpt": post.excerpt,
		"formattedDate": post.formattedDate,
		"readMore": t.blog.readMore,
		"coverHint": post.coverHint
	})}`)}</div><a href="https://blog.tracht-digital.de" class="sm:hidden mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-paper)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary)]">${t.blog.allPosts}<span aria-hidden="true">↗</span></a></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Journal.astro", void 0);
//#endregion
//#region src/components/PricingList.astro
createAstro("https://tracht-digital.de");
var $$PricingList = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PricingList;
	const { lang, headingLevel = 2, factsTitle } = Astro.props;
	const CardHeading = `h${headingLevel}`;
	const SectionHeading = `h${headingLevel}`;
	const hasFacts = Astro.slots.has("default");
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
	const contactHref = `${localizePath("/", lang)}#contact`;
	const detailsLabel = lang === "de" ? "Leistung im Detail" : "Service details";
	return renderTemplate`${maybeRenderHead($$result)}<div class="pricing-list" data-astro-cid-6wlolrpl><div class="pricing-list__grid" data-astro-cid-6wlolrpl>${services.map(({ definition, content }) => {
		const rate = getServiceRate(pricing, definition.id);
		return renderTemplate`<article class="relative rounded-[6px] p-6 md:p-7 flex flex-col bg-[var(--color-soft)]" data-astro-cid-6wlolrpl>${renderComponent($$result, "CardHeading", CardHeading, {
			"class": "font-[var(--font-display)] text-2xl mb-3 text-[var(--color-black)]",
			"data-astro-cid-6wlolrpl": true
		}, { "default": ($$result) => renderTemplate`${content.title}` })}<div class="flex items-baseline gap-2 mb-5 min-h-12" data-astro-cid-6wlolrpl><span class="font-[var(--font-display)] font-medium tabular-nums text-4xl text-[var(--color-primary)]" data-astro-cid-6wlolrpl>${formatRate(rate)}</span><span class="text-sm text-[var(--color-muted)]" data-astro-cid-6wlolrpl>${pricing.hourSuffix}</span></div><p class="text-sm leading-relaxed mb-7 text-[var(--color-muted)]" data-astro-cid-6wlolrpl>${content.summary}</p><div class="mt-auto" data-astro-cid-6wlolrpl><p class="text-xs font-medium tracking-wider uppercase mb-3 text-[var(--color-muted)]" data-astro-cid-6wlolrpl>${pricing.includesLabel}</p><ul class="pricing-list__includes" data-astro-cid-6wlolrpl>${definition.keywords[lang].map((keyword) => renderTemplate`<li class="text-sm leading-snug flex gap-2 text-[var(--color-black)]" data-astro-cid-6wlolrpl><span aria-hidden="true" class="text-[var(--color-accent)]" data-astro-cid-6wlolrpl>✓</span><span data-astro-cid-6wlolrpl>${keyword}</span></li>`)}</ul><a${addAttribute(serviceHref(definition, lang), "href")} class="inline-flex items-center gap-2 text-sm font-medium transition-colors text-[var(--color-primary)] hover:text-[var(--color-accent)] [@media(pointer:coarse)]:min-h-11" data-astro-cid-6wlolrpl>${detailsLabel}<span aria-hidden="true" data-astro-cid-6wlolrpl>→</span></a></div></article>`;
	})}</div><section class="rounded-[6px] p-6 md:p-8 mb-10 bg-[var(--color-soft)]" aria-labelledby="pricing-notes-heading" data-astro-cid-6wlolrpl>${renderComponent($$result, "SectionHeading", SectionHeading, {
		"id": "pricing-notes-heading",
		"class": "font-[var(--font-display)] text-2xl text-[var(--color-black)] mb-5",
		"data-astro-cid-6wlolrpl": true
	}, { "default": ($$result) => renderTemplate`${factsTitle ?? pricing.notesTitle}` })}${renderSlot($$result, $$slots["default"])}<ul${addAttribute(["grid sm:grid-cols-2 gap-x-8 gap-y-4", hasFacts && "pricing-list__notes--after"], "class:list")} data-astro-cid-6wlolrpl>${pricing.notes.map((note) => renderTemplate`<li class="text-sm text-[var(--color-black)] leading-relaxed flex gap-3" data-astro-cid-6wlolrpl><span class="text-[var(--color-accent)]" aria-hidden="true" data-astro-cid-6wlolrpl>—</span><span data-astro-cid-6wlolrpl>${note}</span></li>`)}</ul></section><section class="tds-tone-navy relative overflow-hidden rounded-[6px] p-8 md:p-12 text-center" aria-labelledby="pricing-cta-heading" data-astro-cid-6wlolrpl><span aria-hidden="true" class="tds-shape tds-shape--quarter-bl tds-shape--coral" style="top: -4rem; right: -4rem; width: 20rem; height: 20rem; --tds-decor-shape-alpha: 0.2;" data-astro-cid-6wlolrpl></span><div class="relative" data-astro-cid-6wlolrpl>${renderComponent($$result, "SectionHeading", SectionHeading, {
		"id": "pricing-cta-heading",
		"class": "display text-3xl text-white mb-4",
		"data-astro-cid-6wlolrpl": true
	}, { "default": ($$result) => renderTemplate`${pricing.ctaTitle}` })}<p class="text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed" data-astro-cid-6wlolrpl>${pricing.ctaSub}</p><a${addAttribute(contactHref, "href")} class="inline-flex items-center gap-2 bg-white text-[var(--color-surface-navy)] px-7 py-3.5 rounded-[100px] text-sm font-medium hover:bg-white/85 transition-colors group" data-astro-cid-6wlolrpl>${pricing.ctaButton}<span aria-hidden="true" class="group-hover:translate-x-0.5 transition-transform" data-astro-cid-6wlolrpl>→</span></a></div></section></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/PricingList.astro", void 0);
//#endregion
//#region src/components/sections/Pricing.astro
createAstro("https://tracht-digital.de");
var $$Pricing = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Pricing;
	const lang = resolveLang(Astro.currentLocale);
	const pricing = await getPricingContent(lang);
	const logic = await cmsFor("pricing_logic", lang, getHomeContent(lang).pricingLogic);
	return renderTemplate`${maybeRenderHead($$result)}<section id="preise" class="section-spacing" aria-labelledby="pricing-heading" data-astro-cid-nwtk6cma><span id="pricing-teaser" class="block" aria-hidden="true" data-astro-cid-nwtk6cma></span><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-nwtk6cma><div class="max-w-2xl mx-auto md:mx-0" data-astro-cid-nwtk6cma>${renderComponent($$result, "SectionHeader", $$SectionHeader, {
		"headline": pricing.headline,
		"headlineAccent": pricing.headlineAccent,
		"id": "pricing-heading",
		"headingClass": "mb-6",
		"data-astro-cid-nwtk6cma": true
	})}<p class="text-[var(--color-muted)] leading-relaxed text-center md:text-left" data-astro-cid-nwtk6cma>${renderComponent($$result, "Emphasis", $$Emphasis, {
		"text": pricing.sub,
		"data-astro-cid-nwtk6cma": true
	})}</p></div><div class="pricing-host" data-astro-cid-nwtk6cma>${renderComponent($$result, "PricingList", $$PricingList, {
		"lang": lang,
		"headingLevel": 3,
		"factsTitle": logic.title,
		"data-astro-cid-nwtk6cma": true
	}, { "default": ($$result) => renderTemplate`<ol class="pricing-logic__steps" data-astro-cid-nwtk6cma>${logic.steps.map((step) => renderTemplate`<li class="pricing-logic__step" data-astro-cid-nwtk6cma><span class="pricing-logic__marker" aria-hidden="true" data-astro-cid-nwtk6cma></span><p class="pricing-logic__name" data-astro-cid-nwtk6cma>${step.title}</p><p class="pricing-logic__text" data-astro-cid-nwtk6cma>${step.text}</p></li>`)}</ol><p class="pricing-logic__note" data-astro-cid-nwtk6cma>${logic.note}</p>` })}</div></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Pricing.astro", void 0);
//#endregion
//#region src/lib/faq.ts
function getFaqContent(lang) {
	return lang === "de" ? {
		label: "— FAQ",
		headline: "Häufige",
		headlineAccent: "Fragen.",
		intro: "Die wichtigsten Fragen zu Zusammenarbeit, Verantwortung und Kosten — kurz beantwortet.",
		items: [
			{
				q: "Ich weiß noch nicht, was ich brauche. Können wir trotzdem reden?",
				a: "Ja. Sagen Sie einfach, was im Alltag Zeit kostet oder nicht rundläuft. Den nächsten Schritt finden wir gemeinsam."
			},
			{
				q: "Können Sie ein Vorhaben von Anfang bis Ende übernehmen?",
				a: "Ja. Je nach Absprache übernehme ich Planung, Umsetzung, die Abstimmung mit Ihren bisherigen Anbietern und die laufende Pflege."
			},
			{
				q: "Was gehört zum Webauftritt dazu?",
				a: "Die Webseite, auf Wunsch ein Webshop und das Marketing, über das Kunden Sie finden — Google Ads, Auffindbarkeit und Newsletter. Was davon sinnvoll ist, klären wir vorher."
			},
			{
				q: "Arbeiten Sie mit meinen bisherigen Anbietern weiter?",
				a: "Wenn es sinnvoll ist, ja. Was gut läuft, bleibt — ich schließe die Lücken und koordiniere die Beteiligten."
			},
			{
				q: "Was ist der erste Schritt?",
				a: "Ein Erstgespräch. Danach wissen Sie, was zuerst dran ist und was es ungefähr kostet."
			},
			{
				q: "Was kostet das Erstgespräch?",
				a: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren."
			},
			{
				q: "Wovon hängt der Preis ab?",
				a: "Vom Bereich, vom Umfang und davon, wie klar die Aufgabe ist. Abgegrenzte Vorhaben gehen auch zum Festpreis."
			},
			{
				q: "Bleiben Sie nach der Umsetzung dabei?",
				a: "Auf Wunsch ja — nach Bedarf oder als festes Monatsmodell."
			}
		]
	} : {
		label: "— FAQ",
		headline: "Common",
		headlineAccent: "questions.",
		intro: "The key questions about working together, ownership and pricing — answered briefly.",
		items: [
			{
				q: "I don't know what I need yet. Can we still talk?",
				a: "Yes. Just say what costs you time or does not run smoothly. We work out the next step together."
			},
			{
				q: "Can you take a project from start to finish?",
				a: "Yes. Depending on what we agree, I handle planning, delivery, coordination with your existing suppliers and the ongoing upkeep."
			},
			{
				q: "What does web presence include?",
				a: "The website, an online shop if you want one, and the marketing that brings customers to it — Google Ads, findability and newsletters. We agree up front which of those makes sense."
			},
			{
				q: "Will you keep working with my current suppliers?",
				a: "Where it makes sense, yes. What works stays — I close the gaps and coordinate the people involved."
			},
			{
				q: "What is the first step?",
				a: "A first conversation. After it you know what comes first and roughly what it costs."
			},
			{
				q: "What does the first conversation cost?",
				a: "Costs only arise once we agree on an assignment."
			},
			{
				q: "What does the price depend on?",
				a: "The area, the scope, and how clearly the task is defined. Bounded projects can be done at a fixed price."
			},
			{
				q: "Do you stay involved after launch?",
				a: "If you want — as needed, or as a fixed monthly arrangement."
			}
		]
	};
}
//#endregion
//#region src/components/sections/FAQ.astro
createAstro("https://tracht-digital.de");
var $$FAQ = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FAQ;
	const lang = resolveLang(Astro.currentLocale);
	const content = await cmsFor("faq_v2", lang, getFaqContent(lang));
	const ui = lang === "de" ? {
		moreTitle: "Ihre Frage war nicht dabei?",
		moreText: "Schreiben Sie mir direkt — Antwort in der Regel innerhalb von 24 Stunden.",
		moreCta: "Schreiben Sie mir"
	} : {
		moreTitle: "Not the question you had?",
		moreText: "Write to me directly — usually answered within 24 hours.",
		moreCta: "Get in touch"
	};
	const contactHref = `${localizePath("/", lang)}#contact`;
	return renderTemplate`${maybeRenderHead($$result)}<section id="faq" class="relative section-spacing tds-tone-sand" aria-labelledby="faq-heading" data-astro-cid-4chapdkw><div class="tds-decor" aria-hidden="true" data-astro-cid-4chapdkw>${renderComponent($$result, "CircuitRun", $$CircuitRun, {
		"class": "hidden lg:block bottom-[6%] left-[3%] w-[15rem] h-[8rem]",
		"data-astro-cid-4chapdkw": true
	})}</div><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-4chapdkw><div class="faq-layout" data-astro-cid-4chapdkw><div class="faq-layout__head" data-astro-cid-4chapdkw>${renderComponent($$result, "SectionHeader", $$SectionHeader, {
		"headline": content.headline,
		"headlineAccent": content.headlineAccent,
		"id": "faq-heading",
		"headingClass": "mb-0",
		"data-astro-cid-4chapdkw": true
	})}</div><div class="faq-list" data-astro-cid-4chapdkw>${content.items.map((item, i) => renderTemplate`<details name="faq"${addAttribute(i === 0, "open")} class="faq-item" data-reveal data-astro-cid-4chapdkw><summary class="faq-summary" data-astro-cid-4chapdkw><span class="faq-q" data-astro-cid-4chapdkw>${item.q}</span><span aria-hidden="true" class="faq-chevron" data-astro-cid-4chapdkw><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-4chapdkw><polyline points="9 6 15 12 9 18" data-astro-cid-4chapdkw></polyline></svg></span></summary><p class="faq-a" data-astro-cid-4chapdkw>${item.a}</p></details>`)}</div><a${addAttribute(contactHref, "href")} class="faq-cta group relative block overflow-hidden rounded-[6px] p-7 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-soft)]" data-astro-cid-4chapdkw><span class="tds-decor" aria-hidden="true" data-astro-cid-4chapdkw><span class="tds-shape tds-shape--quarter-bl tds-shape--coral" style="top: -4rem; right: -4rem; width: 14rem; height: 14rem;" data-astro-cid-4chapdkw></span></span><span class="flex flex-col gap-4" data-astro-cid-4chapdkw><span class="block" data-astro-cid-4chapdkw><span class="block font-[var(--font-display)] text-xl text-[var(--color-black)]" data-astro-cid-4chapdkw>${ui.moreTitle}</span><span class="faq-cta-sub mt-1.5 block text-sm" data-astro-cid-4chapdkw>${ui.moreText}</span></span><span class="faq-cta-pill inline-flex shrink-0 items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-medium" data-astro-cid-4chapdkw>${ui.moreCta}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="faq-cta-arrow" data-astro-cid-4chapdkw><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-4chapdkw></line><polyline points="12 5 19 12 12 19" data-astro-cid-4chapdkw></polyline></svg></span></span></a></div></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/FAQ.astro", void 0);
//#endregion
//#region node_modules/react-hook-form/dist/index.esm.mjs
var isCheckBoxInput = (element) => element.type === "checkbox";
var isFileInput = (element) => element.type === "file";
var isDateObject = (value) => value instanceof Date;
var isNullOrUndefined = (value) => value == null;
var isObjectType = (value) => typeof value === "object";
var isObject = (value) => !isNullOrUndefined(value) && !Array.isArray(value) && isObjectType(value) && !isDateObject(value);
var getEventValue = (event) => isObject(event) && event.target ? isCheckBoxInput(event.target) ? event.target.checked : isFileInput(event.target) ? event.target.files : event.target.value : event;
var FIELD_PATH_RE = /[.[\]'"]/;
var stringToPath = (input) => input.split(FIELD_PATH_RE).filter(Boolean);
var isNameInFieldArray = (names, name) => name.split(".").some((part, index, arr) => !isNaN(Number(part)) && names.has(arr.slice(0, index).join(".")));
var isWeb = typeof window !== "undefined" && typeof window.HTMLElement !== "undefined" && typeof document !== "undefined";
function cloneObject(data) {
	if (data === null || typeof data !== "object") return data;
	if (data instanceof Date) return new Date(data);
	const isBlobInstance = typeof Blob !== "undefined" && data instanceof Blob;
	const isFileListInstance = typeof FileList !== "undefined" && data instanceof FileList;
	if (isWeb && (isBlobInstance || isFileListInstance)) return data;
	const isArray = Array.isArray(data);
	if (!isArray && data.constructor !== Object) return data;
	const copy = isArray ? [] : Object.create(Object.getPrototypeOf(data));
	for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) copy[key] = cloneObject(data[key]);
	return copy;
}
var EVENTS = {
	BLUR: "blur",
	FOCUS_OUT: "focusout",
	CHANGE: "change",
	SUBMIT: "submit",
	TRIGGER: "trigger",
	VALID: "valid"
};
var VALIDATION_MODE = {
	onBlur: "onBlur",
	onChange: "onChange",
	onSubmit: "onSubmit",
	onTouched: "onTouched",
	all: "all"
};
var INPUT_VALIDATION_RULES = {
	max: "max",
	min: "min",
	maxLength: "maxLength",
	minLength: "minLength",
	pattern: "pattern",
	required: "required",
	validate: "validate"
};
var ROOT_ERROR_TYPE = "root";
var PROTOTYPE_KEYWORDS = [
	"__proto__",
	"constructor",
	"prototype"
];
var IS_KEY_RE = /^\w*$/;
var isKey = (value) => IS_KEY_RE.test(value);
var isUndefined = (val) => val === void 0;
var get = (object, path, defaultValue) => {
	if (!path || !isObject(object)) return defaultValue;
	const paths = isKey(path) ? [path] : stringToPath(path);
	if (paths.some((key) => PROTOTYPE_KEYWORDS.includes(key))) return defaultValue;
	const result = paths.reduce((result, key) => {
		return isNullOrUndefined(result) ? void 0 : result[key];
	}, object);
	return isUndefined(result) || result === object ? isUndefined(object[path]) ? defaultValue : object[path] : result;
};
var isBoolean = (value) => typeof value === "boolean";
var isFunction = (value) => typeof value === "function";
var set = (object, path, value) => {
	let index = -1;
	const tempPath = isKey(path) ? [path] : stringToPath(path);
	const length = tempPath.length;
	const lastIndex = length - 1;
	while (++index < length) {
		const key = tempPath[index];
		let newValue = value;
		if (index !== lastIndex) {
			const objValue = object[key];
			newValue = isObject(objValue) || Array.isArray(objValue) ? objValue : !isNaN(+tempPath[index + 1]) ? [] : {};
		}
		if (PROTOTYPE_KEYWORDS.includes(key)) return;
		object[key] = newValue;
		object = object[key];
	}
};
/**
* Separate context for `control` to prevent unnecessary rerenders.
* Internal hooks that only need control use this instead of full form context.
*/
var HookFormControlContext = React.createContext(null);
HookFormControlContext.displayName = "HookFormControlContext";
var getProxyFormState = (formState, control, localProxyFormState, isRoot = true) => {
	const result = {};
	for (const key in formState) Object.defineProperty(result, key, { get: () => {
		const _key = key;
		if (control._proxyFormState[_key] !== VALIDATION_MODE.all) control._proxyFormState[_key] = !isRoot || VALIDATION_MODE.all;
		localProxyFormState && (localProxyFormState[_key] = true);
		return formState[_key];
	} });
	return result;
};
var useIsomorphicLayoutEffect = isWeb ? React.useLayoutEffect : React.useEffect;
var isPlainObject = (tempObject) => {
	const prototypeCopy = tempObject.constructor && tempObject.constructor.prototype;
	return isObject(prototypeCopy) && prototypeCopy.hasOwnProperty("isPrototypeOf");
};
var isPrimitive = (value) => isNullOrUndefined(value) || !isObjectType(value);
var isEmptyObjectWithCustomPrototype = (object, keys) => keys.length === 0 && !Array.isArray(object) && !isPlainObject(object);
function deepEqual(object1, object2, visited = /* @__PURE__ */ new WeakMap()) {
	if (object1 === object2) return true;
	if (isPrimitive(object1) || isPrimitive(object2)) return Object.is(object1, object2);
	if (isDateObject(object1) && isDateObject(object2)) return Object.is(object1.getTime(), object2.getTime());
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);
	if (keys1.length !== keys2.length) return false;
	if (isEmptyObjectWithCustomPrototype(object1, keys1) || isEmptyObjectWithCustomPrototype(object2, keys2)) return Object.is(object1, object2);
	if (!keys1.length && Array.isArray(object1) !== Array.isArray(object2)) return false;
	const visitedPairs = visited.get(object1);
	if (visitedPairs && visitedPairs.has(object2)) return true;
	if (visitedPairs) visitedPairs.add(object2);
	else {
		const ws = /* @__PURE__ */ new WeakSet();
		ws.add(object2);
		visited.set(object1, ws);
	}
	for (const key of keys1) {
		const val1 = object1[key];
		if (!(key in object2)) return false;
		if (key !== "ref") {
			const val2 = object2[key];
			if (isDateObject(val1) && isDateObject(val2) || (isObject(val1) || Array.isArray(val1)) && (isObject(val2) || Array.isArray(val2)) ? !deepEqual(val1, val2, visited) : !Object.is(val1, val2)) return false;
		}
	}
	return true;
}
function useResyncOnReconnect(getInitialValue) {
	const _connected = React.useRef(false);
	const _initialized = React.useRef(false);
	const _prevValue = React.useRef(void 0);
	const _renderCount = React.useRef(0);
	_renderCount.current++;
	if (!_initialized.current && getInitialValue) {
		_initialized.current = true;
		_prevValue.current = cloneObject(getInitialValue());
	}
	return {
		resyncIfNeeded: React.useCallback((enabled, getCurrentValue, setValue) => {
			if (enabled && (_connected.current || _initialized.current && _renderCount.current > 1)) {
				const currentValue = getCurrentValue();
				if (!deepEqual(_prevValue.current, currentValue)) setValue(currentValue);
			}
			_connected.current = true;
		}, []),
		snapshot: React.useCallback((enabled, getCurrentValue) => {
			if (enabled) _prevValue.current = cloneObject(getCurrentValue());
		}, [])
	};
}
var isString = (value) => typeof value === "string";
var generateWatchOutput = (names, _names, formValues, isGlobal, defaultValue) => {
	if (isString(names)) {
		isGlobal && _names.watch.add(names);
		return get(formValues, names, defaultValue);
	}
	if (Array.isArray(names)) return names.map((fieldName) => (isGlobal && _names.watch.add(fieldName), get(formValues, fieldName, get(defaultValue, fieldName))));
	isGlobal && (_names.watchAll = true);
	return formValues;
};
var getValidationModes = (mode) => ({
	isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
	isOnBlur: mode === VALIDATION_MODE.onBlur,
	isOnChange: mode === VALIDATION_MODE.onChange,
	isOnAll: mode === VALIDATION_MODE.all,
	isOnTouch: mode === VALIDATION_MODE.onTouched
});
var isWatched = (name, _names, isBlurEvent) => {
	if (isBlurEvent) return false;
	if (_names.watchAll || _names.watch.has(name)) return true;
	for (const watchName of _names.watch) if (name.startsWith(watchName) && name.charAt(watchName.length) === ".") return true;
	return false;
};
var iterateFieldsByAction = (fields, action, fieldsNames) => {
	for (const key of fieldsNames || Object.keys(fields)) {
		if (key === "_f") continue;
		const field = fieldsNames ? get(fields, key) : fields[key];
		if (field) {
			const { _f } = field;
			if (_f) {
				if (_f.refs && _f.refs[0] && action(_f.refs[0], _f.name)) return true;
				else if (_f.ref && action(_f.ref, _f.name)) return true;
				else if (iterateFieldsByAction(field, action)) return true;
			} else if (isObject(field) || Array.isArray(field)) {
				if (iterateFieldsByAction(field, action)) return true;
			}
		}
	}
};
var updateFieldArrayRootError = (errors, error, name) => {
	const existingErrors = get(errors, name);
	const fieldArrayErrors = Array.isArray(existingErrors) ? existingErrors : [];
	set(fieldArrayErrors, ROOT_ERROR_TYPE, error[name]);
	set(errors, name, fieldArrayErrors);
	return errors;
};
var isEmptyObject = (value) => isObject(value) && !Object.keys(value).length;
var isHTMLElement = (value) => {
	if (!isWeb) return false;
	const owner = value ? value.ownerDocument : 0;
	return value instanceof (owner && owner.defaultView ? owner.defaultView.HTMLElement : HTMLElement);
};
var isRadioInput = (element) => element.type === "radio";
var isRegex = (value) => value instanceof RegExp;
var appendErrors = (name, validateAllFieldCriteria, errors, type, message) => validateAllFieldCriteria ? {
	...errors[name],
	types: {
		...errors[name] && errors[name].types ? errors[name].types : {},
		[type]: message || true
	}
} : {};
var defaultResult = {
	value: false,
	isValid: false
};
var validResult = {
	value: true,
	isValid: true
};
var getCheckboxValue = (options) => {
	if (!Array.isArray(options)) return defaultResult;
	if (options.length > 1) {
		const values = options.filter((option) => option && option.checked && !option.disabled).map((option) => option.value);
		return {
			value: values,
			isValid: !!values.length
		};
	}
	const option = options[0];
	if (!option || !option.checked || option.disabled) return defaultResult;
	if (!option.attributes || !("value" in option.attributes)) return validResult;
	return isUndefined(option.value) || option.value === "" ? validResult : {
		value: option.value,
		isValid: true
	};
};
var defaultReturn = {
	isValid: false,
	value: null
};
var getRadioValue = (options) => Array.isArray(options) ? options.reduce((previous, option) => option && option.checked && !option.disabled ? {
	isValid: true,
	value: option.value
} : previous, defaultReturn) : defaultReturn;
function getValidateError(result, ref, type = "validate") {
	if (isString(result) || Array.isArray(result) && result.every(isString) || isBoolean(result) && !result) return {
		type,
		message: isString(result) ? result : "",
		ref
	};
}
var getValueAndMessage = (validationData) => isObject(validationData) && !isRegex(validationData) ? validationData : {
	value: validationData,
	message: ""
};
var validateField = async (field, disabledFieldNames, formValues, validateAllFieldCriteria, shouldUseNativeValidation, isFieldArray) => {
	const { ref, refs, required, maxLength, minLength, min, max, pattern, validate, name, valueAsNumber, mount } = field._f;
	const inputValue = get(formValues, name);
	if (!mount || disabledFieldNames.has(name)) return {};
	const inputRef = refs ? refs[0] : ref;
	const setCustomValidity = (message) => {
		if (shouldUseNativeValidation && inputRef.reportValidity) {
			const validityMessage = isBoolean(message) ? "" : message || "";
			if (refs) refs.forEach((ref) => ref.setCustomValidity(validityMessage));
			else inputRef.setCustomValidity(validityMessage);
			inputRef.reportValidity();
		}
	};
	const error = {};
	const isRadio = isRadioInput(ref);
	const isCheckBox = isCheckBoxInput(ref);
	const isRadioOrCheckbox = isRadio || isCheckBox;
	const isEmpty = (valueAsNumber || isFileInput(ref)) && isUndefined(ref.value) && isUndefined(inputValue) || isHTMLElement(ref) && ref.value === "" || inputValue === "" || Array.isArray(inputValue) && !inputValue.length;
	const appendErrorsCurry = appendErrors.bind(null, name, validateAllFieldCriteria, error);
	const getMinMaxMessage = (exceedMax, maxLengthMessage, minLengthMessage, maxType = INPUT_VALIDATION_RULES.maxLength, minType = INPUT_VALIDATION_RULES.minLength) => {
		const message = exceedMax ? maxLengthMessage : minLengthMessage;
		error[name] = {
			type: exceedMax ? maxType : minType,
			message,
			ref,
			...appendErrorsCurry(exceedMax ? maxType : minType, message)
		};
	};
	if (isFieldArray ? !Array.isArray(inputValue) || !inputValue.length : required && (!isRadioOrCheckbox && (isEmpty || isNullOrUndefined(inputValue)) || isBoolean(inputValue) && !inputValue || isCheckBox && !getCheckboxValue(refs).isValid || isRadio && !getRadioValue(refs).isValid)) {
		const { value, message } = isString(required) ? {
			value: !!required,
			message: required
		} : getValueAndMessage(required);
		if (value) {
			error[name] = {
				type: INPUT_VALIDATION_RULES.required,
				message,
				ref: inputRef,
				...appendErrorsCurry(INPUT_VALIDATION_RULES.required, message)
			};
			if (!validateAllFieldCriteria) {
				setCustomValidity(message);
				return error;
			}
		}
	}
	if (!isEmpty && (!isNullOrUndefined(min) || !isNullOrUndefined(max))) {
		let exceedMax;
		let exceedMin;
		const maxOutput = getValueAndMessage(max);
		const minOutput = getValueAndMessage(min);
		if (!isNullOrUndefined(inputValue) && !isDateObject(inputValue) && !isNaN(inputValue)) {
			const valueNumber = ref.valueAsNumber || (inputValue ? +inputValue : inputValue);
			if (!isNullOrUndefined(maxOutput.value)) exceedMax = valueNumber > maxOutput.value;
			if (!isNullOrUndefined(minOutput.value)) exceedMin = valueNumber < minOutput.value;
		} else {
			const valueDate = ref.valueAsDate || new Date(inputValue);
			const convertTimeToDate = (time) => /* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).toDateString() + " " + time);
			const isTime = ref.type == "time";
			const isWeek = ref.type == "week";
			if (isString(maxOutput.value) && inputValue) exceedMax = isTime ? convertTimeToDate(inputValue) > convertTimeToDate(maxOutput.value) : isWeek ? inputValue > maxOutput.value : valueDate > new Date(maxOutput.value);
			if (isString(minOutput.value) && inputValue) exceedMin = isTime ? convertTimeToDate(inputValue) < convertTimeToDate(minOutput.value) : isWeek ? inputValue < minOutput.value : valueDate < new Date(minOutput.value);
		}
		if (exceedMax || exceedMin) {
			getMinMaxMessage(!!exceedMax, maxOutput.message, minOutput.message, INPUT_VALIDATION_RULES.max, INPUT_VALIDATION_RULES.min);
			if (!validateAllFieldCriteria) {
				setCustomValidity(error[name].message);
				return error;
			}
		}
	}
	if ((maxLength || minLength) && !isEmpty && (isString(inputValue) || isFieldArray && Array.isArray(inputValue))) {
		const maxLengthOutput = getValueAndMessage(maxLength);
		const minLengthOutput = getValueAndMessage(minLength);
		const exceedMax = !isNullOrUndefined(maxLengthOutput.value) && inputValue.length > +maxLengthOutput.value;
		const exceedMin = !isNullOrUndefined(minLengthOutput.value) && inputValue.length < +minLengthOutput.value;
		if (exceedMax || exceedMin) {
			getMinMaxMessage(exceedMax, maxLengthOutput.message, minLengthOutput.message);
			if (!validateAllFieldCriteria) {
				setCustomValidity(error[name].message);
				return error;
			}
		}
	}
	if (pattern && !isEmpty && isString(inputValue)) {
		const { value: patternValue, message } = getValueAndMessage(pattern);
		if (isRegex(patternValue) && !inputValue.match(patternValue)) {
			error[name] = {
				type: INPUT_VALIDATION_RULES.pattern,
				message,
				ref,
				...appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, message)
			};
			if (!validateAllFieldCriteria) {
				setCustomValidity(message);
				return error;
			}
		}
	}
	if (validate) {
		if (isFunction(validate)) {
			const validateError = getValidateError(await validate(inputValue, formValues), inputRef);
			if (validateError) {
				error[name] = {
					...validateError,
					...appendErrorsCurry(INPUT_VALIDATION_RULES.validate, validateError.message)
				};
				if (!validateAllFieldCriteria) {
					setCustomValidity(validateError.message);
					return error;
				}
			}
		} else if (isObject(validate)) {
			let validationResult = {};
			for (const key in validate) {
				if (!isEmptyObject(validationResult) && !validateAllFieldCriteria) break;
				const validateError = getValidateError(await validate[key](inputValue, formValues), inputRef, key);
				if (validateError) {
					validationResult = {
						...validateError,
						...appendErrorsCurry(key, validateError.message)
					};
					if (!validateAllFieldCriteria) setCustomValidity(validateError.message);
					if (validateAllFieldCriteria) error[name] = validationResult;
				}
			}
			if (!isEmptyObject(validationResult)) {
				error[name] = {
					ref: inputRef,
					...validationResult
				};
				if (!validateAllFieldCriteria) return error;
			}
		}
	}
	const fieldError = error[name];
	setCustomValidity(fieldError ? fieldError.message : true);
	return error;
};
var convertToArrayPayload = (value) => Array.isArray(value) ? value : [value];
var compact = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
function baseGet(object, updatePath) {
	const length = updatePath.length - 1;
	let index = 0;
	while (index < length) {
		if (isNullOrUndefined(object)) {
			object = void 0;
			break;
		}
		object = object[updatePath[index]];
		index++;
	}
	return object;
}
function isEmptyArray(obj) {
	for (const key in obj) if (obj.hasOwnProperty(key) && !isUndefined(obj[key])) return false;
	return true;
}
function unset(object, path) {
	if (isString(path) && Object.prototype.hasOwnProperty.call(object, path)) {
		delete object[path];
		return object;
	}
	const paths = Array.isArray(path) ? path : isKey(path) ? [path] : stringToPath(path);
	if (paths.some((segment) => PROTOTYPE_KEYWORDS.includes(String(segment)))) return object;
	const childObject = paths.length === 1 ? object : baseGet(object, paths);
	const index = paths.length - 1;
	const key = paths[index];
	if (childObject) delete childObject[key];
	if (index !== 0 && (isObject(childObject) && isEmptyObject(childObject) || Array.isArray(childObject) && isEmptyArray(childObject))) unset(object, paths.slice(0, -1));
	return object;
}
var HookFormContext = React.createContext(null);
HookFormContext.displayName = "HookFormContext";
var createSubject = () => {
	let _observers = [];
	const next = (value) => {
		for (const observer of _observers) observer.next && observer.next(value);
	};
	const subscribe = (observer) => {
		_observers.push(observer);
		return { unsubscribe: () => {
			_observers = _observers.filter((o) => o !== observer);
		} };
	};
	const unsubscribe = () => {
		_observers = [];
	};
	return {
		get observers() {
			return _observers;
		},
		next,
		subscribe,
		unsubscribe
	};
};
function extractFormValues(fieldsState, formValues) {
	const values = {};
	for (const key in fieldsState) if (fieldsState.hasOwnProperty(key)) {
		const fieldState = fieldsState[key];
		const fieldValue = formValues[key];
		if (fieldState && isObject(fieldState) && fieldValue) {
			const nestedFieldsState = extractFormValues(fieldState, fieldValue);
			if (isObject(nestedFieldsState)) values[key] = nestedFieldsState;
		} else if (fieldsState[key]) values[key] = fieldValue;
	}
	return values;
}
var hasOwn = (value, key) => value !== null && isObjectType(value) && Object.prototype.hasOwnProperty.call(value, key);
var has = (object, path) => {
	if (!path) return false;
	let result = object;
	for (const key of isKey(path) ? [path] : stringToPath(path)) {
		if (!hasOwn(result, key)) return hasOwn(object, path);
		result = result[key];
	}
	return true;
};
var isMultipleSelect = (element) => element.type === `select-multiple`;
var isRadioOrCheckbox = (ref) => isRadioInput(ref) || isCheckBoxInput(ref);
var live = (ref) => isHTMLElement(ref) && ref.isConnected;
function isDirtyContainer(value) {
	return Array.isArray(value) || isObject(value);
}
function collectDirtyFieldNames(dirtyTree, cachedDirtyFields, prefix = "", names = []) {
	for (const key in dirtyTree) {
		const path = prefix ? `${prefix}.${key}` : key;
		const value = dirtyTree[key];
		if (isDirtyContainer(value) && isDirtyContainer(get(cachedDirtyFields, path))) collectDirtyFieldNames(value, cachedDirtyFields, path, names);
		else names.push(path);
	}
	return names;
}
var objectHasFunction = (data) => {
	for (const key in data) if (isFunction(data[key])) return true;
	return false;
};
function isTraversable(value) {
	return Array.isArray(value) || isObject(value) && !objectHasFunction(value);
}
function isRegisteredLeaf(fieldRef) {
	return !!(fieldRef && "_f" in fieldRef);
}
function isEmptyDirtyContainer(value) {
	return Array.isArray(value) ? !value.some((item) => !isUndefined(item)) : !Object.keys(value).length;
}
function clearDirtyField(container, key) {
	if (Array.isArray(container)) container[key] = void 0;
	else delete container[key];
}
function markFieldsDirty(data, fields = {}, fieldRefs) {
	for (const key in data) {
		const value = data[key];
		const fieldRef = fieldRefs && fieldRefs[key];
		if (isTraversable(value) && (!Array.isArray(value) || !isRegisteredLeaf(fieldRef))) {
			fields[key] = Array.isArray(value) ? [] : {};
			markFieldsDirty(value, fields[key], fieldRef);
			if (isEmptyDirtyContainer(fields[key])) clearDirtyField(fields, key);
		} else if (!isUndefined(value)) fields[key] = true;
	}
	return fields;
}
function getDirtyFields(data, formValues, dirtyFieldsFromValues, fieldRefs) {
	if (!dirtyFieldsFromValues) dirtyFieldsFromValues = markFieldsDirty(formValues, {}, fieldRefs);
	for (const key in data) {
		const value = data[key];
		const fieldRef = fieldRefs && fieldRefs[key];
		if (isTraversable(value) && (!Array.isArray(value) || !isRegisteredLeaf(fieldRef))) {
			if (isUndefined(formValues) || isPrimitive(dirtyFieldsFromValues[key])) dirtyFieldsFromValues[key] = markFieldsDirty(value, Array.isArray(value) ? [] : {}, fieldRef);
			else getDirtyFields(value, isNullOrUndefined(formValues) ? {} : formValues[key], dirtyFieldsFromValues[key], fieldRef);
			if (isEmptyDirtyContainer(dirtyFieldsFromValues[key])) clearDirtyField(dirtyFieldsFromValues, key);
		} else if (deepEqual(value, formValues[key])) clearDirtyField(dirtyFieldsFromValues, key);
		else dirtyFieldsFromValues[key] = true;
	}
	return dirtyFieldsFromValues;
}
var getFieldArrayItemNames = (names, name) => {
	const segments = name.split(".");
	const matches = [];
	let prefix = segments[0];
	for (let i = 1; i < segments.length; prefix += "." + segments[i++]) if (!isNaN(+segments[i]) && names.has(prefix)) matches.push(`${prefix}.${segments[i]}`);
	return matches;
};
var getFieldValueAs = (value, { valueAsNumber, valueAsDate, setValueAs }) => isUndefined(value) ? value : valueAsNumber ? value === "" ? NaN : value ? +value : value : valueAsDate && isString(value) ? new Date(value) : setValueAs ? setValueAs(value) : value;
function getFieldValue(_f) {
	const ref = _f.ref;
	if (isFileInput(ref)) return ref.files;
	if (isRadioInput(ref)) return getRadioValue(_f.refs).value;
	if (isMultipleSelect(ref)) return [...ref.selectedOptions].map(({ value }) => value);
	if (isCheckBoxInput(ref)) return getCheckboxValue(_f.refs).value;
	return getFieldValueAs(ref.value, _f);
}
var getResolverOptions = (fieldsNames, _fields, criteriaMode, shouldUseNativeValidation) => {
	const fields = {};
	for (const name of fieldsNames) {
		const field = get(_fields, name);
		field && set(fields, name, field._f);
	}
	return {
		criteriaMode,
		names: [...fieldsNames],
		fields,
		shouldUseNativeValidation
	};
};
var getRuleValue = (rule) => isUndefined(rule) ? rule : isRegex(rule) ? rule.source : isObject(rule) ? isRegex(rule.value) ? rule.value.source : rule.value : rule;
var ASYNC_FUNCTION = "AsyncFunction";
var hasPromiseValidation = (fieldReference) => {
	if (!fieldReference || !fieldReference.validate) return false;
	if (isFunction(fieldReference.validate)) return fieldReference.validate.constructor.name === ASYNC_FUNCTION;
	if (isObject(fieldReference.validate)) {
		for (const key in fieldReference.validate) if (fieldReference.validate[key].constructor.name === ASYNC_FUNCTION) return true;
	}
	return false;
};
var hasValidation = (options) => options.mount && (options.required || !isUndefined(options.required) && options.required !== false || !isUndefined(options.min) || !isUndefined(options.max) || !isUndefined(options.maxLength) || !isUndefined(options.minLength) || options.pattern || options.validate);
function schemaErrorLookup(errors, _fields, name) {
	const error = get(errors, name);
	if ((error === null || error === void 0 ? void 0 : error.type) || (error === null || error === void 0 ? void 0 : error.message) || Array.isArray(error)) return {
		error,
		name
	};
	const names = name.split(".");
	while (names.length) {
		const fieldName = names.join(".");
		const field = get(_fields, fieldName);
		const foundError = get(errors, fieldName);
		if (field && !Array.isArray(field) && name !== fieldName) return { name };
		if (foundError && foundError.type) return {
			name: fieldName,
			error: foundError
		};
		if (foundError && foundError.root && foundError.root.type) return {
			name: `${fieldName}.root`,
			error: foundError.root
		};
		names.pop();
	}
	return { name };
}
var shouldRenderFormState = (formStateData, _proxyFormState, updateFormState, isRoot) => {
	updateFormState(formStateData);
	const keys = Object.keys(formStateData).filter((key) => key !== "name");
	return !keys.length || isRoot && keys.length >= Object.keys(_proxyFormState).length || keys.find((key) => _proxyFormState[key] === (!isRoot || VALIDATION_MODE.all));
};
var shouldSubscribeByName = (name, signalName, exact) => !name || !signalName || name === signalName || convertToArrayPayload(name).some((currentName) => currentName && (exact ? currentName === signalName || currentName.startsWith(signalName + ".") : currentName.startsWith(signalName) || signalName.startsWith(currentName)));
var skipValidation = (isBlurEvent, isTouched, isSubmitted, reValidateMode, mode) => {
	if (mode.isOnAll) return false;
	else if (!isSubmitted && mode.isOnTouch) return !(isTouched || isBlurEvent);
	else if (isSubmitted ? reValidateMode.isOnBlur : mode.isOnBlur) return !isBlurEvent;
	else if (isSubmitted ? reValidateMode.isOnChange : mode.isOnChange) return isBlurEvent;
	return true;
};
var unsetEmptyArray = (ref, name) => {
	const array = get(ref, name);
	!compact(array).length && !(array !== null && array !== void 0 && array.root) && unset(ref, name);
};
var defaultOptions = {
	mode: VALIDATION_MODE.onSubmit,
	reValidateMode: VALIDATION_MODE.onChange,
	shouldFocusError: true
};
var FORM_ERROR_TYPE = "form";
var updateDirtyFields = (dirtyFields, nextDirtyFields) => {
	for (const key in dirtyFields) if (!(key in nextDirtyFields)) delete dirtyFields[key];
	Object.assign(dirtyFields, nextDirtyFields);
};
var DEFAULT_FORM_STATE = {
	submitCount: 0,
	isDirty: false,
	isReady: false,
	isValidating: false,
	isSubmitted: false,
	isSubmitting: false,
	isSubmitSuccessful: false,
	isValid: false,
	touchedFields: {},
	dirtyFields: {},
	validatingFields: {}
};
function createFormControl(props = {}) {
	let _options = {
		...defaultOptions,
		...props
	};
	let _formState = {
		...cloneObject(DEFAULT_FORM_STATE),
		isLoading: isFunction(_options.defaultValues),
		errors: _options.errors || {},
		disabled: _options.disabled || false
	};
	let _fields = {};
	let _defaultValues = isObject(_options.defaultValues) || isObject(_options.values) ? cloneObject(_options.defaultValues || _options.values) || {} : {};
	let _formValues = _options.shouldUnregister ? {} : cloneObject(_defaultValues);
	let _state = {
		action: false,
		actionArrayLengths: /* @__PURE__ */ new Map(),
		mount: false,
		watch: false,
		keepIsValid: false
	};
	let _names = {
		mount: /* @__PURE__ */ new Set(),
		disabled: /* @__PURE__ */ new Set(),
		unMount: /* @__PURE__ */ new Set(),
		array: /* @__PURE__ */ new Set(),
		watch: /* @__PURE__ */ new Set(),
		registerName: /* @__PURE__ */ new Set()
	};
	const delayErrorCallbacks = {};
	const timers = {};
	let _valuesSubscriberCount = 0;
	let _validationModeBeforeSubmit = getValidationModes(_options.mode);
	let _validationModeAfterSubmit = getValidationModes(_options.reValidateMode);
	const defaultProxyFormState = {
		isDirty: false,
		dirtyFields: false,
		validatingFields: false,
		touchedFields: false,
		isValidating: false,
		isValid: false,
		errors: false
	};
	const _proxyFormState = { ...defaultProxyFormState };
	let _proxySubscribeFormState = { ..._proxyFormState };
	const _isTracked = (...keys) => keys.some((key) => _proxyFormState[key] || _proxySubscribeFormState[key]);
	const _subjects = {
		array: createSubject(),
		state: createSubject()
	};
	let _setValidCallId = 0;
	let _resetCallId = 0;
	let shouldDisplayAllAssociatedErrors = _options.criteriaMode === VALIDATION_MODE.all;
	const debounce = (name, callback) => (wait) => {
		clearTimeout(timers[name]);
		timers[name] = setTimeout(callback, wait);
	};
	const cancelDelayedError = (name) => {
		clearTimeout(timers[name]);
		delete timers[name];
		delete delayErrorCallbacks[name];
	};
	const cancelDelayedErrorTree = (name) => {
		cancelDelayedError(name);
		const prefix = `${name}.`;
		for (const key of Object.keys(delayErrorCallbacks)) key.startsWith(prefix) && cancelDelayedError(key);
	};
	const _setValid = async (shouldUpdateValid) => {
		if (_state.keepIsValid) return;
		if (!_options.disabled && (_isTracked("isValid") || shouldUpdateValid)) {
			const callId = ++_setValidCallId;
			let isValid;
			if (_options.resolver) {
				isValid = isEmptyObject((await _runSchema()).errors);
				callId === _setValidCallId && _updateIsValidating();
			} else isValid = await executeBuiltInValidation({
				fields: _fields,
				onlyCheckValid: true,
				eventType: EVENTS.VALID
			});
			if (callId === _setValidCallId && isValid !== _formState.isValid) _subjects.state.next({ isValid });
		}
	};
	const _updateIsValidating = (names, isValidating) => {
		if (!_options.disabled && _isTracked("isValidating", "validatingFields")) {
			(names || _names.mount).forEach((name) => {
				if (name) isValidating ? set(_formState.validatingFields, name, isValidating) : unset(_formState.validatingFields, name);
			});
			_subjects.state.next({
				validatingFields: _formState.validatingFields,
				isValidating: !isEmptyObject(_formState.validatingFields)
			});
		}
	};
	const _updateDirtyFields = () => {
		_formState.dirtyFields = getDirtyFields(_defaultValues, _formValues, void 0, _fields);
	};
	const _setFieldArray = (name, values = [], method, args, shouldSetValues = true, shouldUpdateFieldsAndState = true) => {
		if (args && method && !_options.disabled) {
			_state.action = true;
			const fields = get(_fields, name);
			if (!_state.actionArrayLengths.has(name)) _state.actionArrayLengths.set(name, Array.isArray(fields) ? fields.length : 0);
			if (shouldUpdateFieldsAndState && Array.isArray(fields)) {
				const fieldValues = method(fields, args.argA, args.argB);
				shouldSetValues && set(_fields, name, fieldValues);
			}
			const fieldArrayErrors = get(_formState.errors, name);
			if (shouldUpdateFieldsAndState && Array.isArray(fieldArrayErrors)) {
				const rootError = fieldArrayErrors.root;
				const errors = method(fieldArrayErrors, args.argA, args.argB) || fieldArrayErrors;
				if (rootError) errors.root = rootError;
				shouldSetValues && set(_formState.errors, name, errors);
				unsetEmptyArray(_formState.errors, name);
			}
			const touchedFieldsArray = get(_formState.touchedFields, name);
			if (_isTracked("touchedFields") && shouldUpdateFieldsAndState && Array.isArray(touchedFieldsArray)) {
				const touchedFields = method(touchedFieldsArray, args.argA, args.argB);
				shouldSetValues && set(_formState.touchedFields, name, touchedFields);
			}
			if (_isTracked("dirtyFields")) _updateDirtyFields();
			_subjects.state.next({
				name,
				isDirty: _getDirty(name, values),
				dirtyFields: _formState.dirtyFields,
				errors: _formState.errors,
				isValid: _formState.isValid
			});
		} else set(_formValues, name, values);
	};
	const updateErrors = (name, error) => {
		set(_formState.errors, name, error);
		_formState.errors = { ..._formState.errors };
		_subjects.state.next({ errors: _formState.errors });
	};
	const _setErrors = (errors) => {
		Object.keys(delayErrorCallbacks).forEach(cancelDelayedError);
		_formState.errors = errors;
		_subjects.state.next({
			errors: _formState.errors,
			isValid: false
		});
	};
	const hasExplicitNullIntermediate = (name) => {
		const segments = isKey(name) ? [name] : stringToPath(name);
		let formValues = _formValues;
		let defaultValues = _defaultValues;
		for (let i = 0; i < segments.length - 1; i++) {
			const key = segments[i];
			formValues = isNullOrUndefined(formValues) ? formValues : formValues[key];
			defaultValues = isNullOrUndefined(defaultValues) ? defaultValues : defaultValues[key];
			if (formValues === null && defaultValues !== null) return true;
		}
		return false;
	};
	const isStaleArrayField = (name) => {
		if (!_state.actionArrayLengths.size) return false;
		const segments = isKey(name) ? [name] : stringToPath(name);
		let node = _formValues;
		let path = "";
		let ownerDepth = -1;
		let ownerPreActionLength = 0;
		for (let i = 0; i < segments.length; i++) {
			if (isNullOrUndefined(node)) return false;
			const key = segments[i];
			path = path ? `${path}.${key}` : key;
			if (Array.isArray(node) && +key >= node.length) return ownerDepth === -1 ? false : i === ownerDepth ? +key < ownerPreActionLength : true;
			if (_state.actionArrayLengths.has(path)) {
				ownerDepth = i + 1;
				ownerPreActionLength = _state.actionArrayLengths.get(path);
			}
			node = node[key];
			if (isUndefined(node) && ownerDepth !== -1 && i > ownerDepth && +segments[ownerDepth] < ownerPreActionLength) return true;
		}
		return false;
	};
	const updateValidAndValue = (name, shouldSkipSetValueAs, value, ref) => {
		const field = get(_fields, name);
		if (field) {
			if (hasExplicitNullIntermediate(name) || isStaleArrayField(name)) return;
			const wasUnsetInFormValues = isUndefined(get(_formValues, name));
			const defaultValue = get(_formValues, name, isUndefined(value) ? get(_defaultValues, name) : value);
			isUndefined(defaultValue) || ref && ref.defaultChecked || shouldSkipSetValueAs ? set(_formValues, name, shouldSkipSetValueAs ? defaultValue : getFieldValue(field._f)) : setFieldValue(name, defaultValue);
			if (_state.mount && !_state.action) {
				_setValid();
				if (wasUnsetInFormValues && _formState.isDirty && _isTracked("isDirty")) {
					if (!_getDirty()) {
						_formState.isDirty = false;
						_subjects.state.next({ ..._formState });
					}
				}
				if (props.shouldUnregister && wasUnsetInFormValues && !isUndefined(get(_formValues, name)) && isWatched(name, _names)) _state.watch = true;
			}
		}
	};
	const updateTouchAndDirty = (name, fieldValue, isBlurEvent, shouldDirty, shouldRender) => {
		let shouldUpdateField = false;
		let isPreviousDirty = false;
		const output = { name };
		if (!_options.disabled || shouldDirty === true) {
			if (!isBlurEvent || shouldDirty) {
				const isCurrentFieldPristine = deepEqual(get(_defaultValues, name), fieldValue);
				if (_isTracked("isDirty")) {
					isPreviousDirty = _formState.isDirty;
					_formState.isDirty = output.isDirty = !isCurrentFieldPristine || _getDirty();
					shouldUpdateField = isPreviousDirty !== output.isDirty;
				}
				isPreviousDirty = !!get(_formState.dirtyFields, name);
				if (isCurrentFieldPristine !== _formState.isDirty) updateDirtyFields(_formState.dirtyFields, getDirtyFields(_defaultValues, _formValues, void 0, _fields));
				else isCurrentFieldPristine ? unset(_formState.dirtyFields, name) : set(_formState.dirtyFields, name, true);
				output.dirtyFields = _formState.dirtyFields;
				shouldUpdateField = shouldUpdateField || _isTracked("dirtyFields") && isPreviousDirty !== !isCurrentFieldPristine;
			}
			if (isBlurEvent) {
				const isPreviousFieldTouched = get(_formState.touchedFields, name);
				if (!isPreviousFieldTouched) {
					set(_formState.touchedFields, name, isBlurEvent);
					output.touchedFields = _formState.touchedFields;
					shouldUpdateField = shouldUpdateField || _isTracked("touchedFields") && isPreviousFieldTouched !== isBlurEvent;
				}
			}
			shouldUpdateField && shouldRender && _subjects.state.next(output);
		}
		return shouldUpdateField ? output : {};
	};
	const shouldRenderByError = (name, isValid, error, fieldState) => {
		const previousFieldError = get(_formState.errors, name);
		const shouldUpdateValid = _isTracked("isValid") && isBoolean(isValid) && _formState.isValid !== isValid;
		if (_options.delayError && error) {
			delayErrorCallbacks[name] = debounce(name, () => updateErrors(name, error));
			delayErrorCallbacks[name](_options.delayError);
		} else {
			cancelDelayedError(name);
			error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
			_formState.errors = { ..._formState.errors };
		}
		if ((error ? !deepEqual(previousFieldError, error) : previousFieldError) || !isEmptyObject(fieldState) || shouldUpdateValid) {
			const updatedFormState = {
				...fieldState,
				...shouldUpdateValid && isBoolean(isValid) ? { isValid } : {},
				errors: _formState.errors,
				name
			};
			_subjects.state.next(updatedFormState);
		}
	};
	const _runSchema = async (name) => {
		_updateIsValidating(name, true);
		return await _options.resolver(_formValues, _options.context, getResolverOptions(name || _names.mount, _fields, _options.criteriaMode, _options.shouldUseNativeValidation));
	};
	const executeSchemaAndUpdateState = async (names) => {
		const resetCallId = _resetCallId;
		const { errors } = await _runSchema(names);
		if (resetCallId !== _resetCallId) return errors;
		_updateIsValidating(names);
		if (names) {
			for (const name of names) {
				const error = get(errors, name);
				cancelDelayedError(name);
				const isFieldArrayRootError = _names.array.has(name) && isObject(error) && !Object.keys(error).some((key) => !Number.isNaN(Number(key)));
				const field = get(_fields, name);
				const hasNestedFields = isObject(field) && Object.keys(field).some((key) => key !== "_f");
				isFieldArrayRootError ? updateFieldArrayRootError(_formState.errors, { [name]: error }, name) : (error === null || error === void 0 ? void 0 : error.type) || (error === null || error === void 0 ? void 0 : error.message) || Array.isArray(error) || isObject(error) && hasNestedFields ? set(_formState.errors, name, error) : unset(_formState.errors, name);
			}
			_formState.errors = { ..._formState.errors };
		} else {
			Object.keys(delayErrorCallbacks).forEach(cancelDelayedError);
			_formState.errors = errors;
		}
		return errors;
	};
	const validateForm = async ({ name, eventType }) => {
		if (props.validate) {
			const result = await props.validate({
				formValues: _formValues,
				formState: _formState,
				name,
				eventType
			});
			if (isObject(result)) for (const key in result) {
				const error = result[key];
				if (error) setError(`${FORM_ERROR_TYPE}.${key}`, {
					message: isString(error.message) ? error.message : "",
					type: error.type || INPUT_VALIDATION_RULES.validate
				});
			}
			else if (isString(result) || !result) setError(FORM_ERROR_TYPE, {
				message: result || "",
				type: INPUT_VALIDATION_RULES.validate
			});
			else clearErrors(FORM_ERROR_TYPE);
			return result;
		}
		return true;
	};
	const executeBuiltInValidation = async ({ fields, onlyCheckValid, name, eventType, context = {
		valid: true,
		runRootValidation: false
	} }) => {
		if (props.validate) {
			context.runRootValidation = true;
			if (!await validateForm({
				name,
				eventType
			})) {
				context.valid = false;
				if (onlyCheckValid) return context.valid;
			}
		}
		for (const name in fields) {
			const field = fields[name];
			if (field) {
				const { _f, ...fieldValue } = field;
				if (_f) {
					const isFieldArrayRoot = _names.array.has(_f.name);
					const isPromiseFunction = field._f && hasPromiseValidation(field._f);
					const shouldTrackIsValidatingState = _isTracked("isValidating", "validatingFields");
					if (isPromiseFunction && shouldTrackIsValidatingState) _updateIsValidating([_f.name], true);
					const fieldError = await validateField(field, _names.disabled, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation && !onlyCheckValid, isFieldArrayRoot);
					if (isPromiseFunction && shouldTrackIsValidatingState) _updateIsValidating([_f.name]);
					if (fieldError[_f.name]) {
						context.valid = false;
						if (onlyCheckValid) break;
					}
					if (!onlyCheckValid) {
						cancelDelayedError(_f.name);
						get(fieldError, _f.name) ? isFieldArrayRoot ? updateFieldArrayRootError(_formState.errors, fieldError, _f.name) : set(_formState.errors, _f.name, fieldError[_f.name]) : unset(_formState.errors, _f.name);
					}
					if (props.shouldUseNativeValidation && fieldError[_f.name]) break;
				}
				!isEmptyObject(fieldValue) && await executeBuiltInValidation({
					context,
					onlyCheckValid,
					fields: fieldValue,
					name,
					eventType
				});
			}
		}
		return context.valid;
	};
	const _removeUnmounted = () => {
		for (const name of _names.unMount) {
			const field = get(_fields, name);
			field && (field._f.refs ? field._f.refs.every((ref) => !live(ref)) : !live(field._f.ref)) && unregister(name);
		}
		_names.unMount = /* @__PURE__ */ new Set();
	};
	const _getDirty = (name, data) => (name && data && set(_formValues, name, data), !deepEqual(_state.mount ? _formValues : _defaultValues, _defaultValues));
	const _getWatch = (names, defaultValue, isGlobal) => generateWatchOutput(names, _names, { ..._state.mount ? _formValues : isUndefined(defaultValue) || isString(names) ? _defaultValues : defaultValue }, isGlobal, defaultValue);
	const _getFieldArray = (name) => compact(get(_state.mount ? _formValues : _defaultValues, name, _options.shouldUnregister ? get(_defaultValues, name, []) : []));
	const setFieldValue = (name, value, options = {}, skipClone = false, skipRender = false, skipValueRender = false) => {
		const field = get(_fields, name);
		let fieldValue = value;
		if (field) {
			const fieldReference = field._f;
			if (fieldReference) {
				!fieldReference.disabled && set(_formValues, name, getFieldValueAs(value, fieldReference));
				fieldValue = isHTMLElement(fieldReference.ref) && isNullOrUndefined(value) ? "" : value;
				if (isMultipleSelect(fieldReference.ref)) [...fieldReference.ref.options].forEach((optionRef) => optionRef.selected = fieldValue.includes(optionRef.value));
				else if (fieldReference.refs) {
					if (isCheckBoxInput(fieldReference.ref)) fieldReference.refs.forEach((checkboxRef) => {
						if (!checkboxRef.defaultChecked || !checkboxRef.disabled) {
							if (Array.isArray(fieldValue)) checkboxRef.checked = !!fieldValue.find((data) => data === checkboxRef.value);
							else checkboxRef.checked = fieldValue === checkboxRef.value || !!fieldValue;
						}
					});
					else fieldReference.refs.forEach((radioRef) => radioRef.checked = radioRef.value === fieldValue);
				} else if (isFileInput(fieldReference.ref)) fieldReference.ref.value = "";
				else {
					fieldReference.ref.value = fieldValue;
					if (!fieldReference.ref.type && !skipRender && !skipValueRender) _subjects.state.next({
						name,
						values: skipClone ? _formValues : cloneObject(_formValues)
					});
				}
			}
		}
		(options.shouldDirty || options.shouldTouch) && updateTouchAndDirty(name, field && field._f && !field._f.disabled && (field._f.valueAsNumber || field._f.valueAsDate || field._f.setValueAs) ? getFieldValueAs(value, field._f) : fieldValue, options.shouldTouch, options.shouldDirty, !skipRender);
		options.shouldValidate && trigger(name, { delayError: options.delayError });
	};
	const setFieldValues = (name, value, options, skipClone = false, skipRender = false, skipValueRender = false) => {
		if (_names.array.has(name)) _subjects.array.next({
			name,
			values: skipClone ? _formValues : cloneObject(_formValues)
		});
		for (const fieldKey in value) {
			if (!value.hasOwnProperty(fieldKey)) continue;
			const fieldValue = value[fieldKey];
			const fieldName = name + "." + fieldKey;
			const field = get(_fields, fieldName);
			(_names.array.has(name) || isObject(fieldValue) || field && !field._f) && !isDateObject(fieldValue) ? setFieldValues(fieldName, fieldValue, options, skipClone, skipRender, skipValueRender) : setFieldValue(fieldName, fieldValue, options, skipClone, skipRender, skipValueRender);
		}
	};
	const _setValue = (name, value, options, skipClone, skipStateEmit = false) => {
		const field = get(_fields, name);
		const isFieldArray = _names.array.has(name);
		const cloneValue = skipClone ? value : cloneObject(value);
		const isValueUnchanged = deepEqual(get(_formValues, name), cloneValue);
		if (!isValueUnchanged) set(_formValues, name, cloneValue);
		if (isFieldArray) {
			_subjects.array.next({
				name,
				values: skipClone ? _formValues : cloneObject(_formValues)
			});
			if (_isTracked("isDirty", "dirtyFields") && options.shouldDirty) {
				_updateDirtyFields();
				if (!skipStateEmit) _subjects.state.next({
					name,
					dirtyFields: _formState.dirtyFields,
					isDirty: _getDirty(name, cloneValue)
				});
			}
		} else {
			const isEmpty = Array.isArray(cloneValue) && !cloneValue.length || isEmptyObject(cloneValue);
			const skipValueRender = !isValueUnchanged && !skipStateEmit;
			if (!field || field._f || isNullOrUndefined(cloneValue) || isEmpty) setFieldValue(name, cloneValue, options, skipClone, skipStateEmit, skipValueRender);
			else setFieldValues(name, cloneValue, options, skipClone, skipStateEmit, skipValueRender);
		}
		if (!isValueUnchanged && !skipStateEmit) {
			const watched = isWatched(name, _names);
			const values = skipClone ? _formValues : cloneObject(_formValues);
			_subjects.state.next({
				...watched && _formState,
				name: _state.mount || watched ? name : void 0,
				values
			});
			if (!isFieldArray) for (const itemName of getFieldArrayItemNames(_names.array, name)) _subjects.state.next({
				name: itemName,
				values
			});
		}
	};
	const setValue = (name, value, options = {}) => _setValue(name, value, options, false);
	const setValues = (formValues, options = {}) => {
		const updatedFormValues = isFunction(formValues) ? formValues(_formValues) : formValues;
		if (!deepEqual(_formValues, updatedFormValues)) {
			_formValues = {
				..._formValues,
				...updatedFormValues
			};
			for (const fieldName of _names.mount) if (has(updatedFormValues, fieldName)) _setValue(fieldName, get(updatedFormValues, fieldName), options, true, true);
			_subjects.state.next({
				..._formState,
				name: void 0,
				type: void 0,
				..._valuesSubscriberCount ? { values: _formValues } : {}
			});
			if (options.shouldValidate) _setValid();
		}
	};
	const onChange = async (event) => {
		_state.mount = true;
		const target = event.target;
		let name = target.name;
		let isFieldValueUpdated = true;
		const field = get(_fields, name);
		const _updateIsFieldValueUpdated = (fieldValue) => {
			isFieldValueUpdated = Number.isNaN(fieldValue) || isDateObject(fieldValue) && isNaN(fieldValue.getTime()) || deepEqual(fieldValue, get(_formValues, name, fieldValue));
		};
		if (field) {
			let error;
			let isValid;
			const fieldValue = target.type ? getFieldValue(field._f) : getEventValue(event);
			const isBlurEvent = event.type === EVENTS.BLUR || event.type === EVENTS.FOCUS_OUT;
			const hasNoValidationEffect = !hasValidation(field._f) && !props.validate && !_options.resolver && !get(_formState.errors, name) && !field._f.deps;
			const shouldSkipValidation = hasNoValidationEffect || skipValidation(isBlurEvent, get(_formState.touchedFields, name), _formState.isSubmitted, _validationModeAfterSubmit, _validationModeBeforeSubmit);
			const watched = isWatched(name, _names, isBlurEvent);
			set(_formValues, name, cloneObject(fieldValue));
			if (isBlurEvent) {
				if (!target || !target.readOnly) {
					field._f.onBlur && field._f.onBlur(event);
					const pendingDelayError = delayErrorCallbacks[name];
					pendingDelayError && pendingDelayError(0);
				}
			} else if (field._f.onChange) field._f.onChange(event);
			const fieldState = updateTouchAndDirty(name, fieldValue, isBlurEvent);
			const shouldRender = !isEmptyObject(fieldState) || watched;
			!isBlurEvent && _subjects.state.next({
				name,
				type: event.type,
				..._valuesSubscriberCount ? { values: cloneObject(_formValues) } : {}
			});
			if (shouldSkipValidation) {
				if ((!hasNoValidationEffect || !_formState.isValid) && _isTracked("isValid")) {
					if (_options.mode === "onBlur") {
						if (isBlurEvent) _setValid();
					} else if (!isBlurEvent) _setValid();
				}
				return shouldRender && _subjects.state.next({
					name,
					...watched ? {} : fieldState
				});
			}
			if (!_options.resolver && props.validate) await validateForm({
				name,
				eventType: event.type
			});
			!isBlurEvent && watched && _subjects.state.next({ ..._formState });
			if (_options.resolver) {
				const { errors } = await _runSchema([name]);
				_updateIsValidating([name]);
				_updateIsFieldValueUpdated(fieldValue);
				if (!isFieldValueUpdated) {
					!isEmptyObject(fieldState) && _subjects.state.next(fieldState);
					return;
				}
				const previousErrorLookupResult = schemaErrorLookup(_formState.errors, _fields, name);
				const errorLookupResult = schemaErrorLookup(errors, _fields, previousErrorLookupResult.name || name);
				error = errorLookupResult.error;
				name = errorLookupResult.name;
				isValid = isEmptyObject(errors);
			} else {
				_updateIsValidating([name], true);
				error = (await validateField(field, _names.disabled, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation))[name];
				_updateIsValidating([name]);
				_updateIsFieldValueUpdated(fieldValue);
				if (isFieldValueUpdated) {
					if (error) isValid = false;
					else if (_isTracked("isValid")) isValid = await executeBuiltInValidation({
						fields: _fields,
						onlyCheckValid: true,
						name,
						eventType: event.type
					});
				}
			}
			if (isFieldValueUpdated) {
				field._f.deps && (!Array.isArray(field._f.deps) || field._f.deps.length > 0) && trigger(field._f.deps);
				shouldRenderByError(name, isValid, error, fieldState);
			}
		}
	};
	const _focusInput = (ref, key) => {
		if (get(_formState.errors, key) && ref.focus) {
			ref.focus();
			return 1;
		}
	};
	const trigger = async (name, options = {}) => {
		let isValid;
		let validationResult;
		const fieldNames = convertToArrayPayload(name);
		if (_options.resolver) {
			const resetCallId = _resetCallId;
			const errors = await executeSchemaAndUpdateState(isUndefined(name) ? name : fieldNames);
			isValid = isEmptyObject(errors);
			validationResult = name ? !fieldNames.some((name) => get(errors, name)) : isValid;
			if (resetCallId !== _resetCallId) return validationResult;
		} else if (name) {
			validationResult = (await Promise.all(fieldNames.map(async (fieldName) => {
				const field = get(_fields, fieldName);
				return await executeBuiltInValidation({
					fields: field && field._f ? { [fieldName]: field } : field,
					eventType: EVENTS.TRIGGER
				});
			}))).every(Boolean);
			(validationResult || _formState.isValid) && _setValid();
		} else validationResult = isValid = await executeBuiltInValidation({
			fields: _fields,
			name,
			eventType: EVENTS.TRIGGER
		});
		if (options.delayError && _options.delayError && isString(name)) {
			const error = get(_formState.errors, name);
			if (error) {
				unset(_formState.errors, name);
				delayErrorCallbacks[name] = debounce(name, () => updateErrors(name, error));
				delayErrorCallbacks[name](_options.delayError);
			} else cancelDelayedError(name);
		}
		if (options.shouldTouch) for (const fieldName of name ? fieldNames : _names.mount) !_names.array.has(fieldName) && set(_formState.touchedFields, fieldName, true);
		_subjects.state.next({
			...!isString(name) || _isTracked("isValid") && isValid !== _formState.isValid ? {} : { name },
			..._options.resolver || !name ? { isValid } : {},
			...options.shouldTouch && _isTracked("touchedFields") ? { touchedFields: _formState.touchedFields } : {},
			errors: _formState.errors
		});
		options.shouldFocus && !validationResult && iterateFieldsByAction(_fields, _focusInput, name ? fieldNames : _names.mount);
		return validationResult;
	};
	const getValues = (fieldNames, config) => {
		let values = { ..._state.mount ? _formValues : _defaultValues };
		if (config) values = extractFormValues(config.dirtyFields ? _formState.dirtyFields : _formState.touchedFields, values);
		return isUndefined(fieldNames) ? values : isString(fieldNames) ? get(values, fieldNames) : fieldNames.map((name) => get(values, name));
	};
	const getErrors = (fieldNames) => isUndefined(fieldNames) ? { ..._formState.errors } : isString(fieldNames) ? get(_formState.errors, fieldNames) : fieldNames.map((name) => get(_formState.errors, name));
	const getFieldState = (name, formState) => {
		const targetFormState = formState || _formState;
		const error = get(targetFormState.errors, name);
		return {
			invalid: !!error,
			isDirty: !!get(targetFormState.dirtyFields, name),
			error,
			isValidating: !!get(targetFormState.validatingFields, name),
			isTouched: !!get(targetFormState.touchedFields, name)
		};
	};
	const clearErrors = (name) => {
		const names = name ? convertToArrayPayload(name) : void 0;
		if (names) names.forEach((inputName) => {
			cancelDelayedErrorTree(inputName);
			unset(_formState.errors, inputName);
			_subjects.state.next({
				name: inputName,
				errors: _formState.errors
			});
		});
		else {
			Object.keys(delayErrorCallbacks).forEach(cancelDelayedError);
			_formState.errors = {};
			_subjects.state.next({ errors: _formState.errors });
		}
	};
	const setError = (name, error, options) => {
		cancelDelayedError(name);
		const ref = (get(_fields, name, { _f: {} })._f || {}).ref;
		const { ref: currentRef, message, type, types, ...restOfErrorTree } = get(_formState.errors, name) || {};
		set(_formState.errors, name, {
			...restOfErrorTree,
			...error,
			ref
		});
		_subjects.state.next({
			name,
			errors: _formState.errors,
			isValid: false
		});
		options && options.shouldFocus && ref && ref.focus && ref.focus();
	};
	const watch = (name, defaultValue) => {
		if (isFunction(name)) {
			_valuesSubscriberCount++;
			const { unsubscribe } = _subjects.state.subscribe({ next: (payload) => "values" in payload && name(payload.values || _getWatch(void 0, defaultValue), payload) });
			let called = false;
			return { unsubscribe: () => {
				if (called) return;
				called = true;
				_valuesSubscriberCount--;
				unsubscribe();
			} };
		}
		return _getWatch(name, defaultValue, true);
	};
	const _subscribe = (props) => {
		var _a;
		const needsValues = !!((_a = props.formState) === null || _a === void 0 ? void 0 : _a.values);
		if (needsValues) _valuesSubscriberCount++;
		const { unsubscribe } = _subjects.state.subscribe({ next: (formState) => {
			if (shouldSubscribeByName(props.name, formState.name, props.exact) && shouldRenderFormState(formState, props.formState || _proxyFormState, _setFormState, props.reRenderRoot)) {
				const snapshot = { ..._formValues };
				props.callback({
					values: snapshot,
					..._formState,
					...formState,
					defaultValues: _defaultValues
				});
			}
		} });
		if (!needsValues) return unsubscribe;
		let called = false;
		return () => {
			if (called) return;
			called = true;
			_valuesSubscriberCount--;
			unsubscribe();
		};
	};
	const subscribe = (props) => {
		_state.mount = true;
		_proxySubscribeFormState = {
			..._proxySubscribeFormState,
			...props.formState
		};
		return _subscribe({
			...props,
			formState: {
				...defaultProxyFormState,
				...props.formState
			}
		});
	};
	const unregister = (name, options = {}) => {
		for (const fieldName of name ? convertToArrayPayload(name) : _names.mount) {
			_names.mount.delete(fieldName);
			_names.array.delete(fieldName);
			_names.disabled.delete(fieldName);
			if (!options.keepValue) {
				unset(_fields, fieldName);
				unset(_formValues, fieldName);
			}
			if (!options.keepError) {
				cancelDelayedErrorTree(fieldName);
				unset(_formState.errors, fieldName);
			}
			!options.keepDirty && unset(_formState.dirtyFields, fieldName);
			!options.keepTouched && unset(_formState.touchedFields, fieldName);
			!options.keepIsValidating && unset(_formState.validatingFields, fieldName);
			!_options.shouldUnregister && !options.keepDefaultValue && unset(_defaultValues, fieldName);
		}
		_valuesSubscriberCount && _subjects.state.next({ values: cloneObject(_formValues) });
		_subjects.state.next({
			..._formState,
			...options.keepDirty ? {} : { isDirty: _getDirty() },
			...options.keepIsValidating ? {} : { isValidating: !isEmptyObject(_formState.validatingFields) }
		});
		!options.keepIsValid && _setValid();
	};
	const _setDisabledField = ({ disabled, name }) => {
		if (isBoolean(disabled) && _state.mount || !!disabled || _names.disabled.has(name)) {
			const disabledStateChanged = _names.disabled.has(name) !== !!disabled;
			disabled ? _names.disabled.add(name) : _names.disabled.delete(name);
			disabledStateChanged && _state.mount && !_state.action && _setValid();
		}
	};
	const register = (name, options = {}) => {
		let field = get(_fields, name);
		const disabledIsDefined = isBoolean(options.disabled) || isBoolean(_options.disabled);
		const shouldRevalidateRemount = !_names.registerName.has(name) && field && field._f && !field._f.mount;
		set(_fields, name, {
			...field || {},
			_f: {
				...field && field._f ? field._f : { ref: { name } },
				name,
				mount: true,
				...options
			}
		});
		_names.mount.add(name);
		if (field && !shouldRevalidateRemount) _setDisabledField({
			disabled: isBoolean(options.disabled) ? options.disabled : _options.disabled,
			name
		});
		else updateValidAndValue(name, true, options.value);
		return {
			...disabledIsDefined ? { disabled: options.disabled || _options.disabled } : {},
			..._options.progressive ? {
				required: !!options.required,
				min: getRuleValue(options.min),
				max: getRuleValue(options.max),
				minLength: getRuleValue(options.minLength),
				maxLength: getRuleValue(options.maxLength),
				pattern: getRuleValue(options.pattern)
			} : {},
			name,
			onChange,
			onBlur: onChange,
			ref: (ref) => {
				if (ref) {
					_names.registerName.add(name);
					register(name, options);
					_names.registerName.delete(name);
					field = get(_fields, name);
					const fieldRef = isUndefined(ref.value) ? ref.querySelectorAll ? ref.querySelectorAll("input,select,textarea")[0] || ref : ref : ref;
					const radioOrCheckbox = isRadioOrCheckbox(fieldRef);
					const refs = field._f.refs || [];
					if (radioOrCheckbox ? refs.find((option) => option === fieldRef) : fieldRef === field._f.ref) return;
					const newField = { ...field._f };
					if (radioOrCheckbox) {
						newField.refs = [
							...refs.filter(live),
							fieldRef,
							...Array.isArray(get(_defaultValues, name)) ? [{}] : []
						];
						newField.ref = {
							type: fieldRef.type,
							name
						};
					} else {
						newField.ref = fieldRef;
						delete newField.refs;
					}
					set(_fields, name, { _f: newField });
					updateValidAndValue(name, false, void 0, fieldRef);
				} else {
					field = get(_fields, name, {});
					if (field._f) field._f.mount = false;
					(_options.shouldUnregister || options.shouldUnregister) && !(isNameInFieldArray(_names.array, name) && _state.action) && _names.unMount.add(name);
				}
			}
		};
	};
	const _focusError = () => _options.shouldFocusError && !_options.shouldUseNativeValidation && iterateFieldsByAction(_fields, _focusInput, _names.mount);
	const _disableForm = (disabled) => {
		if (isBoolean(disabled)) {
			_subjects.state.next({ disabled });
			iterateFieldsByAction(_fields, (ref, name) => {
				const currentField = get(_fields, name);
				if (currentField) {
					ref.disabled = currentField._f.disabled || disabled;
					if (Array.isArray(currentField._f.refs)) currentField._f.refs.forEach((inputRef) => {
						inputRef.disabled = currentField._f.disabled || disabled;
					});
				}
			}, 0);
		}
	};
	const handleSubmit = (onValid, onInvalid) => async (e) => {
		let result = void 0;
		let onValidError = void 0;
		if (e) {
			e.preventDefault && e.preventDefault();
			e.persist && e.persist();
		}
		let fieldValues = cloneObject(_formValues);
		_subjects.state.next({ isSubmitting: true });
		if (_options.resolver) {
			const resetCallId = _resetCallId;
			const { errors, values } = await _runSchema();
			if (resetCallId !== _resetCallId) return;
			_updateIsValidating();
			Object.keys(delayErrorCallbacks).forEach(cancelDelayedError);
			_formState.errors = errors;
			fieldValues = cloneObject(values);
		} else {
			await executeBuiltInValidation({
				fields: _fields,
				eventType: EVENTS.SUBMIT
			});
			unset(_formState.errors, ROOT_ERROR_TYPE);
		}
		if (_names.disabled.size) for (const name of _names.disabled) unset(fieldValues, name);
		if (isEmptyObject(_formState.errors)) {
			_subjects.state.next({ errors: {} });
			try {
				result = await onValid(fieldValues, e);
			} catch (error) {
				onValidError = error;
			}
		} else {
			if (onInvalid) await onInvalid({ ..._formState.errors }, e);
			_focusError();
			setTimeout(_focusError);
		}
		_subjects.state.next({
			isSubmitted: true,
			isSubmitting: false,
			isSubmitSuccessful: isEmptyObject(_formState.errors) && !onValidError,
			submitCount: _formState.submitCount + 1,
			errors: _formState.errors
		});
		if (onValidError) throw onValidError;
		return result;
	};
	const resetField = (name, options = {}) => {
		if (get(_fields, name)) {
			unset(_formState.validatingFields, name);
			if (isUndefined(options.defaultValue)) setValue(name, cloneObject(get(_defaultValues, name)));
			else {
				setValue(name, options.defaultValue);
				set(_defaultValues, name, cloneObject(options.defaultValue));
			}
			if (!options.keepTouched) unset(_formState.touchedFields, name);
			if (!options.keepDirty) {
				unset(_formState.dirtyFields, name);
				_formState.isDirty = options.defaultValue ? _getDirty(name, cloneObject(get(_defaultValues, name))) : _getDirty();
			}
			if (!options.keepError) {
				cancelDelayedError(name);
				unset(_formState.errors, name);
				_setValid();
			}
			_subjects.state.next({
				..._formState,
				isValidating: !isEmptyObject(_formState.validatingFields)
			});
		}
	};
	const _reset = (formValues, keepStateOptions = {}) => {
		_resetCallId++;
		const updatedValues = formValues ? cloneObject(formValues) : _defaultValues;
		const cloneUpdatedValues = cloneObject(updatedValues);
		const isEmptyResetValues = isEmptyObject(formValues);
		const values = cloneUpdatedValues;
		const fieldRefs = _fields;
		Object.keys(delayErrorCallbacks).forEach(cancelDelayedError);
		if (!keepStateOptions.keepDefaultValues) _defaultValues = updatedValues;
		if (!keepStateOptions.keepValues) {
			if (keepStateOptions.keepDirtyValues) {
				const fieldsToCheck = /* @__PURE__ */ new Set([..._names.mount, ...collectDirtyFieldNames(getDirtyFields(_defaultValues, _formValues, void 0, fieldRefs), _formState.dirtyFields)]);
				for (const fieldName of fieldsToCheck) {
					const isDirty = get(_formState.dirtyFields, fieldName);
					const existingValue = get(_formValues, fieldName);
					const newValue = get(values, fieldName);
					if (isDirty && !isUndefined(existingValue)) set(values, fieldName, existingValue);
					else if (!isDirty && !isUndefined(newValue)) setValue(fieldName, newValue);
				}
			} else {
				if (isWeb && isUndefined(formValues)) for (const name of _names.mount) {
					const field = get(_fields, name);
					if (field && field._f) {
						const fieldReference = Array.isArray(field._f.refs) ? field._f.refs[0] : field._f.ref;
						if (isHTMLElement(fieldReference)) {
							const form = fieldReference.closest("form");
							if (form) {
								form.reset();
								break;
							}
						}
					}
				}
				if (keepStateOptions.keepFieldsRef) for (const fieldName of _names.mount) setValue(fieldName, get(values, fieldName));
				else _fields = {};
			}
			if (_options.shouldUnregister) {
				_formValues = keepStateOptions.keepDefaultValues ? cloneObject(_defaultValues) : {};
				if (keepStateOptions.keepFieldsRef) for (const fieldName of _names.mount) set(_formValues, fieldName, get(values, fieldName));
			} else _formValues = cloneObject(values);
			_subjects.array.next({ values: { ...values } });
			_subjects.state.next({
				name: void 0,
				type: void 0,
				values: { ...values }
			});
		}
		_names = {
			mount: keepStateOptions.keepDirtyValues ? _names.mount : /* @__PURE__ */ new Set(),
			unMount: /* @__PURE__ */ new Set(),
			array: /* @__PURE__ */ new Set(),
			registerName: /* @__PURE__ */ new Set(),
			disabled: /* @__PURE__ */ new Set(),
			watch: /* @__PURE__ */ new Set(),
			watchAll: false,
			focus: ""
		};
		_state.mount = !_proxyFormState.isValid || !!keepStateOptions.keepIsValid || !!keepStateOptions.keepDirtyValues || !_options.shouldUnregister && !isEmptyObject(values);
		_state.watch = !!_options.shouldUnregister;
		_state.keepIsValid = !!keepStateOptions.keepIsValid;
		_state.action = false;
		_state.actionArrayLengths.clear();
		if (!keepStateOptions.keepErrors) _formState.errors = {};
		_subjects.state.next({
			submitCount: keepStateOptions.keepSubmitCount ? _formState.submitCount : 0,
			isDirty: isEmptyResetValues ? false : keepStateOptions.keepDirty ? _formState.isDirty : keepStateOptions.keepValues ? _getDirty() : !!(keepStateOptions.keepDefaultValues && !deepEqual(formValues, _defaultValues)),
			isSubmitted: keepStateOptions.keepIsSubmitted ? _formState.isSubmitted : false,
			dirtyFields: isEmptyResetValues ? {} : keepStateOptions.keepDirtyValues ? keepStateOptions.keepDefaultValues && _formValues ? getDirtyFields(_defaultValues, _formValues, void 0, fieldRefs) : _formState.dirtyFields : keepStateOptions.keepDefaultValues && formValues ? getDirtyFields(_defaultValues, formValues, void 0, fieldRefs) : keepStateOptions.keepDirty ? _formState.dirtyFields : keepStateOptions.keepValues ? getDirtyFields(_defaultValues, _formValues, void 0, fieldRefs) : {},
			touchedFields: keepStateOptions.keepTouched ? _formState.touchedFields : {},
			...!keepStateOptions.keepIsValidating && (_formState.isValidating || !isEmptyObject(_formState.validatingFields)) ? {
				validatingFields: {},
				isValidating: false
			} : null,
			errors: keepStateOptions.keepErrors ? _formState.errors : {},
			isSubmitSuccessful: keepStateOptions.keepIsSubmitSuccessful ? _formState.isSubmitSuccessful : false,
			isSubmitting: false,
			defaultValues: _defaultValues
		});
	};
	const reset = (formValues, keepStateOptions) => _reset(isFunction(formValues) ? formValues(_formValues) : formValues, {
		..._options.resetOptions,
		...keepStateOptions
	});
	const setFocus = (name, options = {}) => {
		const field = get(_fields, name);
		const fieldReference = field && field._f;
		if (fieldReference) {
			const fieldRef = fieldReference.refs ? fieldReference.refs[0] : fieldReference.ref;
			if (fieldRef.focus) setTimeout(() => {
				fieldRef.focus();
				options.shouldSelect && isFunction(fieldRef.select) && fieldRef.select();
			});
		}
	};
	const _setFormState = (updatedFormState) => {
		const { name, type, values, ...formState } = updatedFormState;
		_formState = {
			..._formState,
			...formState
		};
	};
	_subjects.state.subscribe({ next: _setFormState });
	const _resetDefaultValues = () => isFunction(_options.defaultValues) && _options.defaultValues().then((values) => {
		reset(values, _options.resetOptions);
		_subjects.state.next({ isLoading: false });
	});
	const resetDefaultValues = (values, options = {}) => {
		_defaultValues = cloneObject(values);
		if (!options.keepDirty) {
			const newDirtyFields = getDirtyFields(_defaultValues, _formValues, void 0, _fields);
			_formState.dirtyFields = newDirtyFields;
			_formState.isDirty = !isEmptyObject(newDirtyFields);
		}
		if (!options.keepIsValid) _setValid();
		_subjects.state.next({
			..._formState,
			defaultValues: _defaultValues
		});
	};
	const methods = {
		control: {
			register,
			unregister,
			getFieldState,
			handleSubmit,
			setError,
			_subscribe,
			_runSchema,
			_updateIsValidating,
			_focusError,
			_getWatch,
			_getDirty,
			_setValid,
			_setFieldArray,
			_setDisabledField,
			_setErrors,
			_getFieldArray,
			_reset,
			_resetDefaultValues,
			_removeUnmounted,
			_disableForm,
			_subjects,
			_proxyFormState,
			get _fields() {
				return _fields;
			},
			get _formValues() {
				return _formValues;
			},
			get _state() {
				return _state;
			},
			set _state(value) {
				_state = value;
			},
			get _defaultValues() {
				return _defaultValues;
			},
			get _names() {
				return _names;
			},
			set _names(value) {
				_names = value;
			},
			get _formState() {
				return _formState;
			},
			get _options() {
				return _options;
			},
			set _options(value) {
				_options = {
					..._options,
					...value
				};
				_validationModeBeforeSubmit = getValidationModes(_options.mode);
				_validationModeAfterSubmit = getValidationModes(_options.reValidateMode);
				shouldDisplayAllAssociatedErrors = _options.criteriaMode === VALIDATION_MODE.all;
			}
		},
		subscribe,
		trigger,
		register,
		handleSubmit,
		watch,
		setValue,
		setValues,
		getValues,
		getErrors,
		reset,
		resetField,
		resetDefaultValues,
		clearErrors,
		unregister,
		setError,
		setFocus,
		getFieldState
	};
	return {
		...methods,
		formControl: methods
	};
}
/**
* Core hook for managing a form. Returns all methods and state for
* registration, validation, and submission.
*
* @see [API](https://react-hook-form.com/docs/useform)
*
* @example
* ```tsx
* const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
* <form onSubmit={handleSubmit(onSubmit)}>
*   <input {...register("email", { required: true })} />
* </form>
* ```
*/
function useForm(props = {}) {
	const _formControl = React.useRef(void 0);
	const _values = React.useRef(void 0);
	const _formControlProp = React.useRef(props.formControl);
	const [formState, updateFormState] = React.useState(() => ({
		...cloneObject(DEFAULT_FORM_STATE),
		isLoading: isFunction(props.defaultValues),
		errors: props.errors || {},
		disabled: props.disabled || false,
		defaultValues: isFunction(props.defaultValues) ? void 0 : props.defaultValues
	}));
	if (!_formControl.current || props.formControl && _formControlProp.current !== props.formControl) {
		_formControlProp.current = props.formControl;
		if (props.formControl) {
			_formControl.current = {
				...props.formControl,
				formState
			};
			if (props.defaultValues && !isFunction(props.defaultValues)) props.formControl.reset(props.defaultValues, props.resetOptions);
		} else {
			const { formControl, ...rest } = createFormControl(props);
			_formControl.current = {
				...rest,
				formState
			};
		}
	}
	const control = _formControl.current.control;
	control._options = props;
	const getCurrentFormState = () => ({
		...control._formState,
		defaultValues: control._defaultValues
	});
	const { resyncIfNeeded, snapshot } = useResyncOnReconnect(getCurrentFormState);
	useIsomorphicLayoutEffect(() => {
		resyncIfNeeded(true, getCurrentFormState, updateFormState);
		const unsubscribe = control._subscribe({
			formState: control._proxyFormState,
			callback: () => updateFormState({
				...control._formState,
				defaultValues: control._defaultValues
			}),
			reRenderRoot: true
		});
		updateFormState((data) => ({
			...data,
			isReady: true
		}));
		control._formState.isReady = true;
		return () => {
			unsubscribe();
			snapshot(true, getCurrentFormState);
		};
	}, [
		control,
		resyncIfNeeded,
		snapshot
	]);
	React.useEffect(() => control._disableForm(props.disabled), [control, props.disabled]);
	React.useEffect(() => {
		if (props.mode) control._options.mode = props.mode;
		if (props.reValidateMode) control._options.reValidateMode = props.reValidateMode;
	}, [
		control,
		props.mode,
		props.reValidateMode
	]);
	React.useEffect(() => {
		if (props.errors) {
			control._setErrors(props.errors);
			control._focusError();
		}
	}, [control, props.errors]);
	React.useEffect(() => {
		props.shouldUnregister && control._subjects.state.next({ values: control._getWatch() });
	}, [control, props.shouldUnregister]);
	React.useEffect(() => {
		if (control._proxyFormState.isDirty) {
			const isDirty = control._getDirty();
			if (isDirty !== formState.isDirty) control._subjects.state.next({ isDirty });
		}
	}, [control, formState.isDirty]);
	React.useEffect(() => {
		var _a;
		if (props.values && !deepEqual(props.values, _values.current)) {
			control._reset(props.values, {
				keepFieldsRef: true,
				...control._options.resetOptions
			});
			if (!((_a = control._options.resetOptions) === null || _a === void 0 ? void 0 : _a.keepIsValid)) control._setValid();
			_values.current = props.values;
			updateFormState((state) => ({ ...state }));
		} else control._resetDefaultValues();
	}, [control, props.values]);
	React.useEffect(() => {
		if (!control._state.mount) {
			control._setValid();
			control._state.mount = true;
		}
		if (control._state.watch) {
			control._state.watch = false;
			control._subjects.state.next({ ...control._formState });
		}
		control._removeUnmounted();
	});
	_formControl.current.formState = React.useMemo(() => getProxyFormState(formState, control), [control, formState]);
	return _formControl.current;
}
//#endregion
//#region node_modules/@hookform/resolvers/dist/resolvers.mjs
var t$1 = (r, t, s) => {
	if (r && "reportValidity" in r) {
		const o = get(s, t);
		r.setCustomValidity(o && o.message || ""), r.reportValidity();
	}
};
var s$1 = (e, r) => {
	for (const s in r.fields) {
		const o = r.fields[s];
		o && o.ref && "reportValidity" in o.ref ? t$1(o.ref, s, e) : o && o.refs && o.refs.forEach((r) => t$1(r, s, e));
	}
};
var o$1 = (t, o) => {
	o.shouldUseNativeValidation && s$1(t, o);
	const n = {};
	for (const s in t) {
		const f = get(o.fields, s), c = Object.assign(t[s] || {}, { ref: f && f.refs ? f.refs[0] : f && f.ref });
		if (i$1(o.names || Object.keys(t), s)) {
			const t = Object.assign({}, get(n, s));
			set(t, "root", c), set(n, s, t);
		} else set(n, s, c);
	}
	return n;
};
var i$1 = (e, r) => {
	const t = n(r).replace(/[.*+?^${}()|\\]/g, "\\$&");
	return e.some((e) => n(e).match(`^${t}\\.\\d+`));
};
function n(e) {
	return e.replace(/\[(\d+)]/g, ".$1").replace(/[[\]]/g, "");
}
//#endregion
//#region node_modules/@hookform/resolvers/zod/dist/zod.mjs
function o() {
	return o = Object.assign ? Object.assign.bind() : function(r) {
		for (var e = 1; e < arguments.length; e++) {
			var n = arguments[e];
			for (var o in n) ({}).hasOwnProperty.call(n, o) && (r[o] = n[o]);
		}
		return r;
	}, o.apply(null, arguments);
}
function t(r, e) {
	try {
		var n = r();
	} catch (r) {
		return e(r);
	}
	return n && n.then ? n.then(void 0, e) : n;
}
function s(r, e) {
	for (var o = Object.create(null); r.length;) {
		var t = r[0], s = t.code, i = t.message, u = t.path.join(".");
		if (!o[u]) if ("unionErrors" in t) {
			var a, c, l = t.unionErrors.reduce(function(r, e) {
				return e.errors.length < r.errors.length ? e : r;
			}).errors[0];
			o[u] = {
				message: null != (a = null == l ? void 0 : l.message) ? a : i,
				type: null != (c = null == l ? void 0 : l.code) ? c : s
			};
		} else o[u] = {
			message: i,
			type: s
		};
		if ("unionErrors" in t && t.unionErrors.forEach(function(e) {
			return e.errors.forEach(function(e) {
				return r.push(e);
			});
		}), e) {
			var f = o[u].types, d = f && f[t.code];
			o[u] = appendErrors(u, e, o, s, d ? [].concat(d, t.message) : t.message);
		}
		r.shift();
	}
	return o;
}
function i(r, e) {
	for (var t = Object.create(null), s = function() {
		var s = r[0], i = s.code, u = s.message, a = s.path.join(".");
		if (!t[a]) if ("invalid_union" === s.code && s.errors.length > 0) {
			var c, l, f = s.errors.reduce(function(r, e) {
				return e.length < r.length ? e : r;
			})[0];
			t[a] = {
				message: null != (c = null == f ? void 0 : f.message) ? c : u,
				type: null != (l = null == f ? void 0 : f.code) ? l : i
			};
		} else t[a] = {
			message: u,
			type: i
		};
		if ("invalid_union" === s.code && s.errors.forEach(function(e) {
			return e.forEach(function(e) {
				return r.push(o({}, e, { path: [].concat(s.path, e.path) }));
			});
		}), e) {
			var d = t[a].types, h = d && d[s.code];
			t[a] = appendErrors(a, e, t, i, h ? [].concat(h, s.message) : s.message);
		}
		r.shift();
	}; r.length;) s();
	return t;
}
function u(n, o, u) {
	if (void 0 === u && (u = {}), function(r) {
		return "_zod" in r && "object" == typeof r._zod;
	}(n)) return function(s, a, c) {
		try {
			return Promise.resolve(t(function() {
				function e(e) {
					return c.shouldUseNativeValidation && s$1({}, c), {
						errors: {},
						values: u.raw ? Object.assign({}, s) : e
					};
				}
				var t = n;
				return "sync" === u.mode ? e(t.parse(s, o)) : Promise.resolve(t.parseAsync(s, o)).then(e);
			}, function(r) {
				if (function(r) {
					var e;
					return !(null == r || null == (e = r._zod) || null == (e = e.traits) || !e.has("$ZodError"));
				}(r)) return {
					values: {},
					errors: o$1(i(r.issues, !c.shouldUseNativeValidation && "all" === c.criteriaMode), c)
				};
				throw r;
			}));
		} catch (r) {
			return Promise.reject(r);
		}
	};
	if (function(r) {
		return "_def" in r && "object" == typeof r._def;
	}(n)) return function(i, a, c) {
		try {
			return Promise.resolve(t(function() {
				return Promise.resolve(n["sync" === u.mode ? "parse" : "parseAsync"](i, o)).then(function(e) {
					return c.shouldUseNativeValidation && s$1({}, c), {
						errors: {},
						values: u.raw ? Object.assign({}, i) : e
					};
				});
			}, function(r) {
				if (function(r) {
					return Array.isArray(null == r ? void 0 : r.issues);
				}(r)) return {
					values: {},
					errors: o$1(s(r.errors, !c.shouldUseNativeValidation && "all" === c.criteriaMode), c)
				};
				throw r;
			}));
		} catch (r) {
			return Promise.reject(r);
		}
	};
	throw new Error("Invalid input: not a Zod schema");
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/schemas/index.js
var PORTAL_PERMISSIONS = [
	"projects:read",
	"invoices:read",
	"invoices:pay",
	"documents:read",
	"documents:write",
	"messages:read",
	"messages:write",
	"tickets:read",
	"tickets:write"
];
var PERMISSION_KEY_PATTERN = /^[a-z0-9][a-z0-9-]{0,31}:[a-z0-9][a-z0-9-]{0,31}$/;
var MAX_PERMISSION_KEYS = 128;
[...PORTAL_PERMISSIONS], PORTAL_PERMISSIONS.filter((p) => p.endsWith(":read"));
var HeadingBlock = object({
	type: literal("heading"),
	level: union([literal(2), literal(3)]),
	text: string().max(300)
});
var ParagraphBlock = object({
	type: literal("paragraph"),
	text: string().max(5e3)
});
var ListBlock = object({
	type: literal("list"),
	ordered: boolean(),
	items: array(string().max(2e3)).max(100)
});
var QuoteBlock = object({
	type: literal("quote"),
	text: string().max(2e3),
	cite: string().max(200).optional().nullable()
});
var CodeBlock = object({
	type: literal("code"),
	lang: string().max(30),
	code: string().max(2e4)
});
var ImageBlock = object({
	type: literal("image"),
	url: string().max(600),
	alt: string().max(300),
	caption: string().max(300).optional().nullable()
});
var DividerBlock = object({ type: literal("divider") });
var CalloutBlock = object({
	type: literal("callout"),
	variant: _enum([
		"info",
		"warn",
		"tip"
	]),
	text: string().max(3e3)
});
var ButtonBlock = object({
	type: literal("button"),
	label: string().max(120),
	href: string().max(600),
	style: _enum(["primary", "ghost"])
});
var VideoBlock = object({
	type: literal("video"),
	provider: _enum(["youtube", "vimeo"]),
	url: string().max(600)
});
var AdsenseBlock = object({
	type: literal("adsense"),
	placement: literal("inline"),
	slot: string().max(60).optional().nullable()
});
var CustomBlock = object({
	type: literal("custom"),
	snippetId: number().int().positive()
});
var ProductBlock = object({
	type: literal("product"),
	slug: string().max(120),
	/** `card` = full product card, `inline` = one compact row, `list` = card + all offers. */
	variant: _enum([
		"card",
		"inline",
		"list"
	])
});
var BlogBlockSchema = discriminatedUnion("type", [
	HeadingBlock,
	ParagraphBlock,
	ListBlock,
	QuoteBlock,
	CodeBlock,
	ImageBlock,
	DividerBlock,
	CalloutBlock,
	ButtonBlock,
	VideoBlock,
	AdsenseBlock,
	CustomBlock,
	ProductBlock
]);
object({
	version: literal(1),
	blocks: array(BlogBlockSchema).min(1).max(400)
});
var ShopOfferSchema = object({
	id: number().int().positive(),
	kind: _enum(["own", "affiliate"]),
	network: _enum([
		"amazon",
		"awin",
		"belboon",
		"digistore",
		"direct"
	]),
	/** Merchant-facing label ("Amazon", "Hetzner"), already localised by the API. */
	merchant: string().max(120),
	/** The outbound URL, affiliate tag already appended by the API. */
	url: string().max(1e3),
	/** Net-of-nothing gross price in minor units; null when we have no quote. */
	priceCents: number().int().nonnegative().nullable(),
	currency: string().length(3).default("EUR"),
	/**
	* When {@link priceCents} was last confirmed, ISO-8601. Null means "never
	* fetched" — which is not the same as a stale price and renders differently:
	* a never-fetched offer simply shows no price, a stale one shows why.
	*/
	priceCheckedAt: string().datetime({ offset: true }).nullable(),
	availability: _enum([
		"in_stock",
		"out_of_stock",
		"unknown"
	]).default("unknown"),
	position: number().int().nonnegative().default(0)
});
var ShopProductRefSchema = object({
	slug: string().max(120),
	lang: _enum(["de", "en"]),
	title: string().max(200),
	teaser: string().max(400),
	category: string().max(60),
	imageUrl: string().max(1e3).nullable(),
	/** Absolute URL of the product page on the shop site. */
	url: string().max(1e3),
	offers: array(ShopOfferSchema).max(20).default([])
});
ShopProductRefSchema.extend({
	/** Blocks JSON or markdown, same dual format as a blog post body. */
	body: string(),
	bodyFormat: _enum(["markdown", "blocks"]).default("blocks"),
	tags: array(string().max(60)).max(20).default([]),
	metaDescription: string().max(300).nullable(),
	publishedAt: string().datetime({ offset: true }).nullable(),
	updatedAt: string().datetime({ offset: true }).nullable(),
	machineTranslated: boolean().default(false)
});
object({
	key: string().max(60),
	/** Heading shown above the slot, already localised. Null renders no heading. */
	heading: string().max(120).nullable(),
	/**
	* The legally required advertising label ("Anzeige" / "Advertisement").
	*
	* Served rather than hard-coded so the label is right in both languages and
	* cannot be forgotten by a consumer — see `ProductCard`, which refuses to
	* render an affiliate offer without one.
	*/
	label: string().max(60),
	products: array(ShopProductRefSchema).max(12).default([])
});
var ContactSchema = object({
	name: string().min(2, "name"),
	email: string().email("email"),
	company: string().optional(),
	message: string().min(20, "message"),
	consent: literal(true, { error: () => ({ message: "consent" }) }),
	website: string().max(0).optional()
});
object({
	slug: string().min(3).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
	lang: _enum(["de", "en"]).default("de"),
	category: string().min(2).max(40),
	title: string().min(4).max(200),
	excerpt: string().min(10).max(400),
	body: string().min(20),
	/** Storage format of `body`. `markdown` keeps the legacy single-string path. */
	bodyFormat: _enum(["markdown", "blocks"]).default("markdown"),
	coverHint: string().max(400).optional().nullable(),
	publishedAt: date().optional().nullable(),
	draft: boolean().default(false),
	/** Per-post ad rendering mode (blog only). Mirrors the PHP validator. */
	adsMode: _enum([
		"default",
		"off",
		"auto",
		"manual"
	]).default("default"),
	/**
	* auth-api `app_user.id` of the author. Admins may set any eligible author;
	* for a non-admin blog author the server forces it to themselves. Null /
	* omitted leaves the post unassigned. The PHP validator mirrors this.
	*/
	authorId: number().int().positive().optional().nullable()
});
object({
	name: string().min(1).max(200),
	slug: string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
	avatarUrl: string().max(500).optional().nullable(),
	bio: string().max(500).optional().nullable(),
	active: boolean().default(true)
});
object({
	email: string().email().optional(),
	password: string().min(1).optional(),
	token: string().min(1).optional()
});
_enum(PORTAL_PERMISSIONS);
var PermissionKeySchema = string().regex(PERMISSION_KEY_PATTERN, "expected <resource>:<action>");
var MembershipSchema = object({
	companyId: number().int().positive().optional(),
	/** @deprecated legacy name for `companyId`; removed in the follow-up release. */
	customerId: number().int().positive().optional(),
	permissions: array(PermissionKeySchema).max(MAX_PERMISSION_KEYS).default([]),
	/** Ids of the groups assigned to this user IN this company. */
	groupIds: array(number().int().positive()).default([]),
	/** Whether this membership may manage the company's own users. */
	isCompanyAdmin: boolean().default(false),
	/**
	* The most this membership may ever be granted, `null` = inherit the
	* company policy. Platform-admin only — a company admin cannot raise it.
	*/
	permissionCeiling: array(PermissionKeySchema).nullish(),
	/**
	* Rights withheld from THIS person even where an assigned group grants
	* them — the per-person override of the group's decision.
	*
	* Not the same field as `permissionCeiling`, and the difference is easy to
	* lose: the ceiling is the platform admin's limit on what a company admin
	* may ever hand out; this is the ordinary decision about one person, which
	* a company admin owns. A right can be inside the ceiling and denied; it
	* cannot be outside the ceiling and granted.
	*
	* Unlike the ceiling there is no null/empty distinction — an empty deny
	* list and no deny list say the same thing — so this defaults to `[]`
	* rather than being nullish.
	*/
	permissionDenies: array(PermissionKeySchema).max(MAX_PERMISSION_KEYS).default([])
}).refine((m) => m.companyId !== void 0 || m.customerId !== void 0, { message: "companyId is required" }).transform((m) => ({
	...m,
	companyId: m.companyId ?? m.customerId
}));
object({
	email: string().email(),
	name: string().min(1).max(200).optional().nullable(),
	password: string().min(12).optional(),
	isAdmin: boolean().default(false),
	isSupportAgent: boolean().default(false),
	/** Grants blog-authoring access (see `AppUser.isBlogAuthor`). */
	isBlogAuthor: boolean().default(false),
	/** Author bio shown on the public blog author page. */
	bio: string().max(500).optional().nullable(),
	memberships: array(MembershipSchema).optional(),
	/** @deprecated use `memberships` — kept as a single-company fallback. */
	customerId: number().int().positive().optional().nullable(),
	/** @deprecated use `memberships`. */
	permissions: array(PermissionKeySchema).max(MAX_PERMISSION_KEYS).default([]),
	status: _enum(["active", "disabled"]).default("active")
});
object({
	email: string().email().optional(),
	name: string().min(1).max(200).optional().nullable(),
	isAdmin: boolean().optional(),
	isSupportAgent: boolean().optional(),
	/** Grants blog-authoring access (see `AppUser.isBlogAuthor`). */
	isBlogAuthor: boolean().optional(),
	/** Author bio shown on the public blog author page. */
	bio: string().max(500).optional().nullable(),
	memberships: array(MembershipSchema).optional(),
	/** @deprecated use `memberships`. */
	customerId: number().int().positive().optional().nullable(),
	/** @deprecated use `memberships`. */
	permissions: array(PermissionKeySchema).max(MAX_PERMISSION_KEYS).optional(),
	status: _enum(["active", "disabled"]).optional()
});
var TICKET_PRIORITIES = [
	"low",
	"normal",
	"high",
	"urgent"
];
var TICKET_TYPES = [
	"question",
	"bug",
	"feature",
	"other"
];
var TicketPrioritySchema = _enum(TICKET_PRIORITIES);
var TicketTypeSchema = _enum(TICKET_TYPES);
object({
	subject: string().min(3).max(200),
	description: string().min(10).max(1e4),
	priority: TicketPrioritySchema.default("normal"),
	type: TicketTypeSchema.default("question"),
	projectId: number().int().positive().optional().nullable()
});
object({
	body: string().min(1).max(1e4),
	isInternal: boolean().default(false)
});
var RUNTIME_CONFIG_PATH = "/tds-runtime.json";
var STATE_KEY = /* @__PURE__ */ Symbol.for("@tracht-digital-solutions/tds-shared:api-state");
var state = (() => {
	const host = globalThis;
	const existing = host[STATE_KEY];
	if (existing !== void 0) return existing;
	const fresh = {
		cached: null,
		runtimePromise: null,
		runtimeValue: null,
		onUnauthorized: null,
		headersProvider: null
	};
	host[STATE_KEY] = fresh;
	return fresh;
})();
var trimEnd = (value) => value.replace(/\/+$/, "");
async function runtimeConfig() {
	if (state.runtimePromise !== null) return state.runtimePromise;
	if (typeof document === "undefined" || typeof fetch !== "function") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	let declared = "";
	try {
		declared = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	if (declared.trim() !== "") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	state.runtimePromise = (async () => {
		try {
			const res = await fetch(RUNTIME_CONFIG_PATH, {
				credentials: "same-origin",
				headers: { Accept: "application/json" },
				signal: typeof AbortSignal?.timeout === "function" ? AbortSignal.timeout(3e3) : void 0
			});
			if (!res.ok) return null;
			if (!(res.headers.get("content-type") ?? "").includes("json")) return null;
			const parsed = await res.json();
			if (parsed === null || typeof parsed !== "object") return null;
			const config = parsed;
			if (typeof config.apiBase === "string" && config.apiBase !== "") state.cached = trimEnd(config.apiBase);
			state.runtimeValue = config;
			return config;
		} catch {
			return null;
		}
	})();
	return state.runtimePromise;
}
async function runtimeSetting(key, fallback) {
	const value = (await runtimeConfig())?.[key];
	return typeof value === "string" && value !== "" ? value : fallback;
}
//#endregion
//#region src/components/islands/ContactForm.tsx
var CONTACT_API_URL = "https://api.tracht-digital.de/contact";
function ContactForm({ lang = "de" }) {
	const t = translations[lang];
	const errorCopy = lang === "de" ? "Die Nachricht konnte gerade nicht gesendet werden. Bitte versuchen Sie es später noch einmal oder schreiben Sie mir direkt: " : "The message could not be sent just now. Please try again later or email me directly: ";
	const [submitState, setSubmitState] = useState("idle");
	const [shake, setShake] = useState(false);
	const shakeTimerRef = useRef(null);
	const successHeadingRef = useRef(null);
	const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
		resolver: u(ContactSchema),
		defaultValues: { consent: void 0 }
	});
	useEffect(() => {
		if (submitState === "success") successHeadingRef.current?.focus();
	}, [submitState]);
	useEffect(() => {
		const apply = (draft) => {
			if (typeof draft !== "string" || draft.trim() === "") return;
			const current = String(getValues("message") ?? "");
			if (current.includes(draft.trim())) return;
			setValue("message", current.trim() ? `${current.trimEnd()}

${draft}` : draft, { shouldDirty: true });
		};
		try {
			const stored = window.sessionStorage.getItem(CONTACT_DRAFT_KEY);
			if (stored) {
				apply(stored);
				window.sessionStorage.removeItem(CONTACT_DRAFT_KEY);
			}
		} catch {}
		const onDraft = (event) => {
			apply(event.detail);
			try {
				window.sessionStorage.removeItem(CONTACT_DRAFT_KEY);
			} catch {}
		};
		window.addEventListener(CONTACT_DRAFT_EVENT, onDraft);
		return () => window.removeEventListener(CONTACT_DRAFT_EVENT, onDraft);
	}, [getValues, setValue]);
	useEffect(() => () => {
		if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
	}, []);
	const triggerShake = () => {
		if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
		setShake(true);
		shakeTimerRef.current = setTimeout(() => setShake(false), 600);
	};
	const onSubmit = async (data) => {
		setSubmitState("submitting");
		try {
			const endpoint = await runtimeSetting("contactUrl", CONTACT_API_URL);
			if ((await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...data,
					lang
				})
			})).ok) setSubmitState("success");
			else {
				setSubmitState("error");
				triggerShake();
			}
		} catch {
			setSubmitState("error");
			triggerShake();
		}
	};
	const fieldClass = [
		"contact-field block w-full appearance-none bg-transparent",
		"px-3 py-3 text-base text-white leading-snug",
		"border-0 outline-none focus:outline-none focus:ring-0"
	].join(" ");
	const errorId = (field) => `contact-${field}-error`;
	const a11yFor = (field) => errors[field] ? {
		"aria-invalid": true,
		"aria-describedby": errorId(field)
	} : {};
	const rowClass = (field) => `contact-field-row ${field && errors[field] ? "contact-field-row--error" : ""}`;
	if (submitState === "success") return /* @__PURE__ */ jsxs("div", {
		className: "contact-success flex flex-col items-start gap-4 py-12",
		role: "status",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "contact-success__mark",
				"aria-hidden": "true",
				children: "✓"
			}),
			/* @__PURE__ */ jsx("h3", {
				ref: successHeadingRef,
				tabIndex: -1,
				className: "text-2xl font-[var(--font-display)] font-medium text-white outline-none",
				style: { fontVariationSettings: "\"opsz\" 144" },
				children: t.contact.form.successTitle
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-white/75",
				children: t.contact.form.successMessage
			})
		]
	});
	const submitting = submitState === "submitting";
	return /* @__PURE__ */ jsx("div", {
		className: shake ? "shake" : "",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-6 sm:space-y-8",
			noValidate: true,
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						position: "absolute",
						left: "-9999px",
						opacity: 0,
						pointerEvents: "none"
					},
					"aria-hidden": "true",
					children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "website",
						children: "Website"
					}), /* @__PURE__ */ jsx("input", {
						id: "website",
						type: "text",
						tabIndex: -1,
						autoComplete: "off",
						...register("website")
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: rowClass("name"),
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "name",
							className: "contact-field-label",
							children: t.contact.form.name
						}),
						/* @__PURE__ */ jsx("input", {
							id: "name",
							type: "text",
							autoComplete: "name",
							required: true,
							placeholder: t.contact.form.namePlaceholder,
							className: fieldClass,
							...a11yFor("name"),
							...register("name")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "contact-field-line",
							"aria-hidden": "true"
						}),
						errors.name && /* @__PURE__ */ jsx("p", {
							id: errorId("name"),
							className: "contact-field-error text-xs mt-2",
							children: t.errors.name
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: rowClass("email"),
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "email",
							className: "contact-field-label",
							children: t.contact.form.email
						}),
						/* @__PURE__ */ jsx("input", {
							id: "email",
							type: "email",
							autoComplete: "email",
							required: true,
							placeholder: t.contact.form.emailPlaceholder,
							className: fieldClass,
							...a11yFor("email"),
							...register("email")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "contact-field-line",
							"aria-hidden": "true"
						}),
						errors.email && /* @__PURE__ */ jsx("p", {
							id: errorId("email"),
							className: "contact-field-error text-xs mt-2",
							children: t.errors.email
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: rowClass(),
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "company",
							className: "contact-field-label",
							children: t.contact.form.company
						}),
						/* @__PURE__ */ jsx("input", {
							id: "company",
							type: "text",
							autoComplete: "organization",
							placeholder: t.contact.form.companyPlaceholder,
							className: fieldClass,
							...register("company")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "contact-field-line",
							"aria-hidden": "true"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: rowClass("message"),
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "message",
							className: "contact-field-label",
							children: t.contact.form.message
						}),
						/* @__PURE__ */ jsx("textarea", {
							id: "message",
							rows: 4,
							required: true,
							placeholder: t.contact.form.messagePlaceholder,
							className: `${fieldClass} resize-none`,
							...a11yFor("message"),
							...register("message")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "contact-field-line",
							"aria-hidden": "true"
						}),
						errors.message && /* @__PURE__ */ jsx("p", {
							id: errorId("message"),
							className: "contact-field-error text-xs mt-2",
							children: t.errors.message
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
					className: "flex items-center gap-3 cursor-pointer",
					children: [
						/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							className: "contact-consent-input",
							required: true,
							...a11yFor("consent"),
							...register("consent")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "contact-consent-box",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "text-xs text-white/75 leading-relaxed",
							children: [
								t.contact.form.consent,
								" ",
								/* @__PURE__ */ jsx("a", {
									href: "/legal/datenschutz",
									className: "underline underline-offset-2 hover:no-underline",
									style: { color: "var(--color-accent-pink)" },
									children: t.contact.form.consentLink
								}),
								" ",
								t.contact.form.consentSuffix
							]
						})
					]
				}), errors.consent && /* @__PURE__ */ jsx("p", {
					id: errorId("consent"),
					className: "contact-field-error text-xs mt-2",
					children: t.errors.consent
				})] }),
				submitState === "error" && /* @__PURE__ */ jsxs("p", {
					id: "contact-form-error",
					className: "contact-field-error text-sm",
					role: "alert",
					children: [errorCopy, /* @__PURE__ */ jsx("a", {
						href: `mailto:${t.contact.info.email}`,
						className: "underline",
						children: t.contact.info.email
					})]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "submit",
					disabled: submitting,
					className: "submit-button group relative w-full min-h-[3.25rem] py-4 text-sm font-medium rounded-full overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer",
					children: /* @__PURE__ */ jsxs("span", {
						className: "relative z-10 inline-flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-0.5",
						children: [submitting ? t.contact.form.submitting : t.contact.form.submit, submitting ? /* @__PURE__ */ jsx("span", {
							className: "tds-spinner tds-spinner--sm",
							"aria-hidden": "true"
						}) : /* @__PURE__ */ jsxs("svg", {
							"aria-hidden": "true",
							width: "16",
							height: "16",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							className: "transition-transform duration-200 group-hover:translate-x-1",
							children: [/* @__PURE__ */ jsx("line", {
								x1: "5",
								y1: "12",
								x2: "19",
								y2: "12"
							}), /* @__PURE__ */ jsx("polyline", { points: "12 5 19 12 12 19" })]
						})]
					})
				}),
				/* @__PURE__ */ jsx("p", {
					className: "sr-only",
					"aria-live": "polite",
					children: submitting ? t.contact.form.submitting : ""
				})
			]
		})
	});
}
//#endregion
//#region src/components/sections/Contact.astro
createAstro("https://tracht-digital.de");
var $$Contact = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Contact;
	const lang = resolveLang(Astro.currentLocale);
	const t = tFor(Astro.currentLocale);
	const heading = getHomeContent(lang).contactHeading;
	const contact = await cmsFor("contact", lang, {
		label: t.contact.label,
		headline: heading.headline,
		headlineAccent: heading.headlineAccent,
		sub: t.contact.sub,
		email: t.contact.info.email,
		phone: t.contact.info.phone,
		location: t.contact.info.location
	});
	const phoneDisplay = contact.phone;
	const phoneHref = phoneDisplay.replace(/\s/g, "");
	const socials = {
		linkedin: "https://www.linkedin.com/in/julian-tracht/",
		github: "https://github.com/Tracht-Digital-Solutions",
		whatsapp: `https://wa.me/${phoneHref.replace(/^\+/, "")}`
	};
	return renderTemplate`${maybeRenderHead($$result)}<section id="contact" class="section-spacing tds-tone-navy relative" aria-labelledby="contact-heading"><span class="tds-decor" aria-hidden="true"><img src="/images/sections/contact.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" class="contact-photo absolute inset-0 h-full w-full object-cover object-right-bottom"><span class="contact-photo-scrim absolute inset-0"></span></span><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12"><h2 id="contact-heading" class="display text-4xl md:text-5xl lg:text-6xl text-white mb-4 text-center md:text-left">${contact.headline}${" "}${renderComponent($$result, "AccentLetters", $$AccentLetters, {
		"text": contact.headlineAccent,
		"tone": "dark"
	})}</h2><span aria-hidden="true" class="tds-brandbar tds-brandbar--on-dark mx-auto md:mx-0 mb-6"></span><p class="text-white/75 max-w-lg mb-8 leading-relaxed text-center md:text-left mx-auto md:mx-0">${contact.sub}</p><div class="mb-10 md:mb-14">${renderComponent($$result, "FirstCall", $$FirstCall, { "variant": "contact" })}</div><div class="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-24">${renderComponent($$result, "ContactForm", ContactForm, {
		"client:visible": true,
		"lang": lang,
		"client:component-hydration": "visible",
		"client:component-path": "~/components/islands/ContactForm.tsx",
		"client:component-export": "default"
	})}<aside class="space-y-6 md:space-y-8"><div><p class="eyebrow text-white/50 mb-3">${t.contact.info.emailLabel}</p><a${addAttribute(`mailto:${contact.email}`, "href")} class="flex items-center gap-3 text-white hover:text-[var(--color-accent-pink)] transition-colors [@media(pointer:coarse)]:min-h-11"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-shrink-0"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m2 7 10 6 10-6"></path></svg>${contact.email}</a></div><div><p class="eyebrow text-white/50 mb-3">${t.contact.info.phoneLabel}</p><a${addAttribute(`tel:${phoneHref}`, "href")} class="flex items-center gap-3 text-white hover:text-[var(--color-accent-pink)] transition-colors [@media(pointer:coarse)]:min-h-11"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>${phoneDisplay}</a></div><div><p class="eyebrow text-white/50 mb-3">${t.contact.info.locationLabel}</p><span class="flex items-center gap-3 text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${contact.location}</span></div><div><p class="eyebrow text-white/50 mb-3">${t.contact.info.socialLabel}</p><div class="flex gap-3"><a${addAttribute(socials.linkedin, "href")} aria-label="LinkedIn" rel="noopener noreferrer" target="_blank" class="group flex items-center justify-center p-2.5 [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:min-w-11 rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-[#0A66C2] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] transition-all duration-200"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg></a><a${addAttribute(socials.github, "href")} aria-label="GitHub" rel="noopener noreferrer" target="_blank" class="group flex items-center justify-center p-2.5 [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:min-w-11 rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-[#181717] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] transition-all duration-200"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg></a><a${addAttribute(socials.whatsapp, "href")} aria-label="WhatsApp" rel="noopener noreferrer" target="_blank" class="group flex items-center justify-center p-2.5 [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:min-w-11 rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-[#25D366] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] transition-all duration-200"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg></a></div></div><div><a href="/kontakt.vcf" class="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm text-white hover:bg-white hover:text-[var(--color-surface-navy)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] transition-all duration-200"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>${lang === "en" ? "Save contact" : "Kontakt speichern"}</a><a${addAttribute(businessCardHref(lang), "href")} class="mt-3 inline-flex items-center gap-2 text-sm text-white/70 hover:text-[var(--color-accent-pink)] transition-colors [@media(pointer:coarse)]:min-h-11"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-shrink-0"><rect x="2" y="4" width="20" height="16" rx="2"></rect><circle cx="9" cy="11" r="2.25"></circle><path d="M5.5 17c.6-1.6 2-2.4 3.5-2.4s2.9.8 3.5 2.4"></path><line x1="15" y1="9.5" x2="19" y2="9.5"></line><line x1="15" y1="13" x2="19" y2="13"></line></svg>${lang === "en" ? "Open the digital business card" : "Digitale Visitenkarte ansehen"}<span aria-hidden="true">→</span></a></div></aside></div></div></section>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Contact.astro", void 0);
//#endregion
//#region src/components/HomePage.astro
createAstro("https://tracht-digital.de");
var $$HomePage = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$HomePage;
	const { lang } = Astro.props;
	const home = getHomeContent(lang);
	const hero = await cmsFor("home_hero", lang, home.hero);
	const trustContent = await cmsFor("home_trust", lang, home.trust);
	const pricing = await getPricingContent(lang);
	const trust = resolveTrustFacts(trustContent, {
		name: siteConfig.founder.name,
		town: siteConfig.address.addressLocality,
		rate: lowestRate(pricing),
		hasCases: referenceCases.length > 0
	});
	const faq = await cmsFor("faq_v2", lang, getFaqContent(lang));
	const pricedServices = await Promise.all(serviceDefinitions.map(async (definition) => ({
		definition,
		content: await resolveServiceContent(definition, lang)
	})));
	const jsonLd = asGraph(organizationSchema(), personSchema(), websiteSchema(), pricingSchema(pricedServices.map(({ definition, content }) => ({
		name: content.title,
		description: content.summary,
		rate: getServiceRate(pricing, definition.id)
	}))), faqPageSchema(faq.items), {
		"@type": "WebPage",
		"@id": `${siteConfig.url}/#webpage-${lang}`,
		url: lang === "de" ? `${siteConfig.url}/` : `${siteConfig.url}/en/`,
		inLanguage: lang === "de" ? "de-DE" : "en-GB",
		isPartOf: { "@id": `${siteConfig.url}/#website` },
		primaryImageOfPage: `${siteConfig.url}/og/default.png`,
		speakable: speakableSchema(["#hero-heading", "#hero-sub"])
	});
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": {
			de: "Digitalisierung für Unternehmen — Tracht Digital Solutions",
			en: "Digitalization for Businesses — Tracht Digital Solutions"
		}[lang],
		"description": siteConfig.description[lang],
		"lang": lang,
		"jsonLd": jsonLd
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main id="main">${renderComponent($$result, "Hero", $$Hero, {
		"lang": lang,
		"hero": hero,
		"trust": trust
	})}${renderComponent($$result, "About", $$About, {})}${renderComponent($$result, "Services", $$Services, {})}${renderComponent($$result, "ServiceFinder", $$ServiceFinder, {})}${renderComponent($$result, "CustomerCases", $$CustomerCases, {})}${renderComponent($$result, "Process", $$Process, {})}${renderComponent($$result, "Showcase", $$Showcase, {})}${renderComponent($$result, "Journal", $$Journal, {})}${renderComponent($$result, "Pricing", $$Pricing, {})}${renderComponent($$result, "FAQ", $$FAQ, {})}${renderComponent($$result, "Contact", $$Contact, {})}</main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/HomePage.astro", void 0);
//#endregion
export { $$HomePage as t };
