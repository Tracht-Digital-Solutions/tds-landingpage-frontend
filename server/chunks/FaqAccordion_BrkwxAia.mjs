import { A as renderTemplate, B as createAstro, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_BMhx82Vm.mjs";
import { t as createComponent } from "./compiler_CXeQXDPg.mjs";
import { d as resolveLang, f as tFor, i as ThemeToggle, m as renderScript, n as ConsentLink, u as localizePath } from "./Layout_B749k1M0.mjs";
import { t as contentCache } from "./contentCache_C2sWg_72.mjs";
import { S as siteConfig, b as businessCardHref, c as referenceCases, g as BUSINESS_CARD_PREVIEW, h as platformHref, m as platformDefinitions, u as cmsFor, y as businessCardCopy } from "./services_CP3nOvK5.mjs";
import { t as hreflangGroup } from "./sitemap_B-lt8yqx.mjs";
import { d as LOGO, g as logoSrcset, h as logoSrc, m as SERVICE_PHOTO_VARIANT_WIDTHS, p as PREVIEW_VARIANT_WIDTHS, y as srcsetFor } from "./jsonld_BLodLwid.mjs";
import { t as legalCopy } from "./legal_DAvriM1N.mjs";
//#region src/lib/languageSwitch.ts
/**
* Where the header's language switch may point on this page — or `null`, in
* which case the switch is not rendered at all.
*
* The target comes from the route inventory (`hreflangGroup` in `sitemap.ts`),
* the same pairing the sitemap and the `hreflang` tags are built from. That is
* the only source that knows `/leistungen/webauftritt` pairs with
* `/en/services/web-presence`; no prefix rule can derive it.
*
* What this replaced is the reason it exists. The old toggle read
* `<link rel="alternate">` from the head and, when there was none, glued `/en`
* onto the path. A page served `noindex` (sitemap exclusion) carries no
* alternates, so a service page sent visitors to `/en/leistungen/…` — a 404.
* Offering a language that does not exist is worse than not offering one.
*
* The inventory is the FULL list, not the panel-filtered one: a page merely
* hidden from search still has its twin, and the switch should still find it.
*/
function alternatePath(pathname, target) {
	const group = hreflangGroup(pathname);
	if (group.length !== 2) return null;
	const [de, en] = group;
	return (target === "de" ? de : en) ?? null;
}
//#endregion
//#region src/components/LanguageSwitch.astro
createAstro("https://tracht-digital.de");
var $$LanguageSwitch = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LanguageSwitch;
	const target = resolveLang(Astro.currentLocale) === "de" ? "en" : "de";
	const href = alternatePath(Astro.url.pathname, target);
	const label = target === "en" ? {
		code: "EN",
		name: "English version"
	} : {
		code: "DE",
		name: "Deutsche Version"
	};
	return renderTemplate`${href && renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(target, "hreflang")}${addAttribute(target, "lang")} class="lang-switch" data-lang-switch data-astro-cid-34uxj53s><span class="lang-switch__flag" aria-hidden="true" data-astro-cid-34uxj53s>${target === "en" ? renderTemplate`<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" focusable="false" data-astro-cid-34uxj53s><clipPath id="lang-switch-gb-clip" data-astro-cid-34uxj53s><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" data-astro-cid-34uxj53s></path></clipPath><path d="M0,0 v30 h60 v-30 z" fill="#012169" data-astro-cid-34uxj53s></path><path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" stroke-width="6" data-astro-cid-34uxj53s></path><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#lang-switch-gb-clip)" stroke="#C8102E" stroke-width="4" data-astro-cid-34uxj53s></path><path d="M30,0 v30 M0,15 h60" stroke="#ffffff" stroke-width="10" data-astro-cid-34uxj53s></path><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6" data-astro-cid-34uxj53s></path></svg>` : renderTemplate`<svg viewBox="0 0 5 3" preserveAspectRatio="xMidYMid slice" focusable="false" data-astro-cid-34uxj53s><rect width="5" height="1" y="0" fill="#000000" data-astro-cid-34uxj53s></rect><rect width="5" height="1" y="1" fill="#DD0000" data-astro-cid-34uxj53s></rect><rect width="5" height="1" y="2" fill="#FFCE00" data-astro-cid-34uxj53s></rect></svg>`}</span><span data-astro-cid-34uxj53s>${label.code}</span><span class="sr-only" data-astro-cid-34uxj53s> – ${label.name}</span></a>`}${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/LanguageSwitch.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/LanguageSwitch.astro", void 0);
//#endregion
//#region src/lib/navigation.ts
function sectionLinks(lang) {
	const de = lang === "de";
	return [
		{
			id: "services",
			label: de ? "Leistungen" : "Services"
		},
		...referenceCases.length > 0 ? [{
			id: "cases",
			label: de ? "Projekte" : "Projects"
		}] : [],
		{
			id: "process",
			label: de ? "Vorgehen" : "Process"
		},
		{
			id: "preise",
			label: de ? "Preise" : "Pricing"
		}
	];
}
//#endregion
//#region src/components/Header.astro
createAstro("https://tracht-digital.de");
var $$Header = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const lang = resolveLang(Astro.currentLocale);
	const items = sectionLinks(lang);
	const homeHref = localizePath("/", lang);
	const menuLabel = lang === "en" ? "Menu" : "Menü";
	const navLabel = lang === "en" ? "Main navigation" : "Hauptnavigation";
	const homeLabel = lang === "en" ? "Tracht Digital Solutions – home" : "Tracht Digital Solutions – Startseite";
	const sectionHref = (id) => `${homeHref}#${id}`;
	return renderTemplate`${maybeRenderHead($$result)}<header id="site-header" class="site-header fixed top-3 left-3 right-3 z-40 px-3 py-2.5 lg:px-5" data-scrolled="false" data-astro-cid-nen7h5rs><nav${addAttribute(navLabel, "aria-label")} class="flex items-center justify-between gap-2 text-sm lg:gap-5" data-astro-cid-nen7h5rs><a id="logo-link"${addAttribute(homeHref, "href")} class="flex items-center gap-2 px-2 lg:px-2.5 py-1 lg:py-1 text-[var(--color-primary)] hover:opacity-90 transition-opacity rounded-full [@media(pointer:coarse)]:min-h-11"${addAttribute(homeLabel, "aria-label")} data-astro-cid-nen7h5rs><img${addAttribute(logoSrc("mark", LOGO.mark.widths[1]), "src")}${addAttribute(logoSrcset("mark"), "srcset")} sizes="(min-width: 1024px) 72px, 48px" alt=""${addAttribute(LOGO.mark.width, "width")}${addAttribute(LOGO.mark.height, "height")} class="site-logo h-6 lg:h-7 w-auto" data-astro-cid-nen7h5rs><img${addAttribute(logoSrc("letters", LOGO.letters.widths[1]), "src")}${addAttribute(logoSrcset("letters"), "srcset")} sizes="(min-width: 1024px) 100px, 66px" alt=""${addAttribute(LOGO.letters.width, "width")}${addAttribute(LOGO.letters.height, "height")} class="site-logo h-6 lg:h-7 w-auto" data-astro-cid-nen7h5rs></a><div class="flex items-center gap-1 lg:gap-3" data-astro-cid-nen7h5rs><div class="hidden lg:flex items-center gap-1" data-astro-cid-nen7h5rs>${items.map((item) => renderTemplate`<a${addAttribute(sectionHref(item.id), "href")} class="inline-flex items-center px-3 py-1.5 text-[var(--color-muted)] hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] rounded-full transition-colors [@media(pointer:coarse)]:min-h-11" data-astro-cid-nen7h5rs>${item.label}</a>`)}<a${addAttribute(siteConfig.blogUrl, "href")} rel="me noopener" class="inline-flex items-center gap-1 px-3 py-1.5 text-[var(--color-muted)] hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] rounded-full transition-colors [@media(pointer:coarse)]:min-h-11" data-astro-cid-nen7h5rs>Journal<span aria-hidden="true" class="text-[10px] leading-none" data-astro-cid-nen7h5rs>↗</span></a></div>${renderComponent($$result, "ThemeToggle", ThemeToggle, {
		"client:idle": true,
		"labelToDark": lang === "en" ? "Switch to dark mode" : "Auf Dunkel umschalten",
		"labelToLight": lang === "en" ? "Switch to light mode" : "Auf Hell umschalten",
		"data-astro-cid-nen7h5rs": true,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "ThemeToggle"
	})}${renderComponent($$result, "LanguageSwitch", $$LanguageSwitch, { "data-astro-cid-nen7h5rs": true })}<button id="menu-toggle" type="button" class="btn btn-ghost tds-menu-toggle" aria-controls="mobile-menu" aria-expanded="false"${addAttribute(menuLabel, "aria-label")} data-astro-cid-nen7h5rs><span class="tds-menu-bar tds-menu-bar-top" aria-hidden="true" data-astro-cid-nen7h5rs></span><span class="tds-menu-bar tds-menu-bar-mid" aria-hidden="true" data-astro-cid-nen7h5rs></span><span class="tds-menu-bar tds-menu-bar-bot" aria-hidden="true" data-astro-cid-nen7h5rs></span></button></div></nav></header><div id="mobile-menu" class="tds-mobile-menu inset-x-3 top-[5.25rem]" style="--tds-mobile-menu-inset: 5.25rem" aria-hidden="true" data-astro-cid-nen7h5rs><nav${addAttribute(navLabel, "aria-label")} data-astro-cid-nen7h5rs><ul class="space-y-0.5" data-astro-cid-nen7h5rs>${items.map((item) => renderTemplate`<li data-astro-cid-nen7h5rs><a${addAttribute(sectionHref(item.id), "href")} data-menu-link class="tds-mobile-menu__link" data-astro-cid-nen7h5rs>${item.label}</a></li>`)}</ul><div class="h-4" aria-hidden="true" data-astro-cid-nen7h5rs></div><ul class="space-y-0.5" data-astro-cid-nen7h5rs><li data-astro-cid-nen7h5rs><a${addAttribute(siteConfig.blogUrl, "href")} rel="me noopener" data-menu-link class="tds-mobile-menu__link justify-between" data-astro-cid-nen7h5rs><span data-astro-cid-nen7h5rs>Journal</span><span aria-hidden="true" class="text-sm text-[var(--color-muted)]" data-astro-cid-nen7h5rs>↗</span></a></li></ul></nav></div>${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Header.astro", void 0);
//#endregion
//#region src/components/Footer.astro
createAstro("https://tracht-digital.de");
var $$Footer = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Footer;
	const lang = resolveLang(Astro.currentLocale);
	const t = tFor(Astro.currentLocale);
	const footer = await cmsFor("footer", lang, t.footer);
	const contact = await cmsFor("contact", lang, {
		label: t.contact.label,
		headline: t.contact.headline,
		headlineAccent: t.contact.headlineAccent,
		sub: t.contact.sub,
		email: t.contact.info.email,
		phone: t.contact.info.phone,
		location: t.contact.info.location
	});
	const agbHref = localizePath("/legal/agb", lang);
	const homeHref = localizePath("/", lang);
	const telHref = `tel:${contact.phone.replace(/\s+/g, "")}`;
	const navItems = [...sectionLinks(lang).map((item) => ({
		href: `${homeHref}#${item.id}`,
		label: item.id === "preise" ? footer.pricing : item.label
	})), {
		href: `${homeHref}#contact`,
		label: lang === "de" ? "Kontakt" : "Contact"
	}];
	const systemsTitle = lang === "de" ? "Shopsysteme & CMS" : "Shop systems & CMS";
	return renderTemplate`${maybeRenderHead($$result)}<footer class="site-footer tds-tone-ink pt-16" data-astro-cid-jo6i4kqk><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12" data-astro-cid-jo6i4kqk><div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12" data-astro-cid-jo6i4kqk><div data-astro-cid-jo6i4kqk><p class="brand-wordmark text-2xl mb-3" data-astro-cid-jo6i4kqk>Tracht <span class="italic text-[var(--color-accent-pink)]" data-astro-cid-jo6i4kqk>Digital</span> Solutions</p><span aria-hidden="true" class="tds-brandbar tds-brandbar--sm tds-brandbar--on-dark mb-4" data-astro-cid-jo6i4kqk></span><p class="font-[var(--font-display)] italic text-[var(--color-accent-pink)] text-base mb-4" data-astro-cid-jo6i4kqk>${footer.slogan}</p><p class="text-white/70 text-sm leading-relaxed max-w-xs" data-astro-cid-jo6i4kqk>${footer.tagline}</p></div><nav aria-labelledby="footer-nav-title" data-astro-cid-jo6i4kqk><p id="footer-nav-title" class="eyebrow text-white/60 mb-4" data-astro-cid-jo6i4kqk>${footer.nav}</p><ul class="space-y-2 text-sm" data-astro-cid-jo6i4kqk>${navItems.map((item) => renderTemplate`<li data-astro-cid-jo6i4kqk><a${addAttribute(item.href, "href")} class="footer-link text-white/80 hover:text-white" data-astro-cid-jo6i4kqk>${item.label}</a></li>`)}<li data-astro-cid-jo6i4kqk><a${addAttribute(siteConfig.blogUrl, "href")} class="footer-link text-white/80 hover:text-white" data-astro-cid-jo6i4kqk>${t.nav.blog}</a></li></ul></nav><nav aria-labelledby="footer-systems-title" data-astro-cid-jo6i4kqk><p id="footer-systems-title" class="eyebrow text-white/60 mb-4" data-astro-cid-jo6i4kqk>${systemsTitle}</p><ul class="space-y-2 text-sm" data-astro-cid-jo6i4kqk>${platformDefinitions.map((platform) => renderTemplate`<li data-astro-cid-jo6i4kqk><a${addAttribute(platformHref(platform, lang), "href")} class="footer-link text-white/80 hover:text-white" data-astro-cid-jo6i4kqk>${platform.name}</a></li>`)}</ul></nav><div data-astro-cid-jo6i4kqk><p class="eyebrow text-white/60 mb-4" data-astro-cid-jo6i4kqk>${footer.contactTitle}</p><ul class="space-y-2 text-sm" data-astro-cid-jo6i4kqk><li data-astro-cid-jo6i4kqk><a${addAttribute(`mailto:${contact.email}`, "href")} class="footer-link text-white/80 hover:text-white" data-astro-cid-jo6i4kqk>${contact.email}</a></li><li data-astro-cid-jo6i4kqk><a${addAttribute(telHref, "href")} class="footer-link text-white/80 hover:text-white" data-astro-cid-jo6i4kqk>${contact.phone}</a></li><li class="text-white/70" data-astro-cid-jo6i4kqk>${siteConfig.address.postalCode} ${siteConfig.address.addressLocality}</li></ul></div></div><div class="pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/70" data-astro-cid-jo6i4kqk><p data-astro-cid-jo6i4kqk>${footer.copyright}</p><div class="flex flex-wrap gap-x-6 gap-y-1" data-astro-cid-jo6i4kqk><a href="/legal/impressum" class="footer-link hover:text-white" data-astro-cid-jo6i4kqk>${footer.impressum}</a><a href="/legal/datenschutz" class="footer-link hover:text-white" data-astro-cid-jo6i4kqk>${footer.datenschutz}</a><a${addAttribute(agbHref, "href")} class="footer-link hover:text-white" data-astro-cid-jo6i4kqk>${legalCopy[lang].agbShort}</a>${renderComponent($$result, "ConsentLink", ConsentLink, {
		"client:idle": true,
		"lang": lang,
		"className": "footer-link hover:text-white",
		"data-astro-cid-jo6i4kqk": true,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/consent",
		"client:component-export": "ConsentLink"
	})}</div></div></div></footer>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Footer.astro", void 0);
//#endregion
//#region src/lib/emphasis.ts
/**
* Split `Ich plane und *setze um*.` into
* `[{ text: "Ich plane und ", strong: false }, { text: "setze um", strong: true }, …]`.
*
* An unpaired asterisk is not an error and not emphasis: it stays in the
* text exactly as written. Anything else would let one typo in the panel
* swallow the rest of a sentence into a `<strong>`.
*/
function splitEmphasis(text) {
	const segments = [];
	const pattern = /\*([^*]+)\*/g;
	let cursor = 0;
	for (const match of text.matchAll(pattern)) {
		const start = match.index ?? 0;
		if (start > cursor) segments.push({
			text: text.slice(cursor, start),
			strong: false
		});
		segments.push({
			text: match[1],
			strong: true
		});
		cursor = start + match[0].length;
	}
	if (cursor < text.length) segments.push({
		text: text.slice(cursor),
		strong: false
	});
	return segments.length > 0 ? segments : [{
		text,
		strong: false
	}];
}
/** The plain reading of a marked-up string — for `alt`, `title`, JSON-LD. */
function stripEmphasis(text) {
	return splitEmphasis(text).map((segment) => segment.text).join("");
}
//#endregion
//#region src/components/ui/Emphasis.astro
createAstro("https://tracht-digital.de");
var $$Emphasis = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Emphasis;
	const { text } = Astro.props;
	const segments = splitEmphasis(text);
	return renderTemplate`${segments.map((segment) => segment.strong ? renderTemplate`${maybeRenderHead($$result)}<strong class="text-emph">${segment.text}</strong>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${segment.text}` })}`)}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/Emphasis.astro", void 0);
//#endregion
//#region src/lib/homeContent.ts
var content = {
	de: {
		hero: {
			eyebrow: "Für Selbstständige, lokale Betriebe und kleine Unternehmen",
			headline: "Websites, die Kunden bringen.",
			headlineAccent: "Digitalisierung,",
			headlineSuffix: "die entlastet.",
			sub: "Veraltete Website, Ärger mit dem Shop oder doppelte Handarbeit? Ich löse das und bleibe *dein fester Ansprechpartner*.",
			cta1: "Erstgespräch vereinbaren",
			cta2: "Leistungen ansehen",
			ctaNote: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren. Antwort in der Regel innerhalb von 24 Stunden.",
			scrollHint: "Wieso ich?"
		},
		whyMe: {
			headline: "Wieso",
			headlineAccent: "ich?",
			lead: "Du brauchst *einen Ansprechpartner* – nicht fünf Anbieter.",
			p1: "Ich berate und setze selbst um: Website, Shop und Abläufe aus einer Hand.",
			p2: "Auf Wunsch bleibe ich nach dem Start dein Ansprechpartner – aus Schwarzenbek bei Hamburg, für Betriebe in ganz Deutschland.",
			reasons: [
				{
					title: "Ein fester Ansprechpartner",
					description: "Du weißt immer, wer sich kümmert."
				},
				{
					title: "Verständlich erklärt",
					description: "Klare Möglichkeiten und Kosten, ohne Fachsprache."
				},
				{
					title: "Beratung und Umsetzung",
					description: "Ich plane es nicht nur – ich baue es auch."
				},
				{
					title: "Auch nach dem Start da",
					description: "Auf Wunsch betreue ich alles dauerhaft weiter."
				}
			]
		},
		servicesOverview: {
			headline: "Wobei ich dir",
			headlineAccent: "helfe.",
			intro: "Vier Leistungen, *ein Ansprechpartner*: vom Webauftritt bis zur Digitalisierung deiner Abläufe."
		},
		websiteDemos: {
			headline: "Beispielseiten zum",
			headlineAccent: "Ausprobieren.",
			intro: "Eigene Demos und Projekte – *keine Kundenaufträge*. Klick dich einfach durch.",
			serviceIntro: "Eigene Demos und Projekte, live im Netz – *keine Kundenaufträge*.",
			headlineSingle: "Eine Beispielseite zum",
			introSingle: "Eine eigene Beispielseite – *kein Kundenauftrag*. Klick dich einfach durch.",
			serviceIntroSingle: "Eine eigene Beispielseite, live im Netz – *kein Kundenauftrag*."
		},
		referencesHome: {
			headline: "Umgesetzt für",
			headlineAccent: "Kunden.",
			intro: "Echte Projekte – und *was sie gebracht haben*.",
			label: "Veröffentlicht nur mit Freigabe der Kunden.",
			serviceCta: "Zur passenden Leistung"
		},
		digitalResponsibility: {
			headline: "Ein Ansprechpartner für",
			headlineAccent: "alles Digitale.",
			body: "Digitale Themen bleiben oft liegen: zwischen Projekten, Anbietern und der Frage, wer eigentlich zuständig ist. Ich behalte den Überblick und sorge dafür, dass alles zusammenpasst.",
			points: [
				"Sagen, was zuerst dran ist – verständlich",
				"Projekte selbst umsetzen oder Beteiligte steuern",
				"Vorhandene Systeme und neue Lösungen zusammenbringen",
				"Den Auftritt sichtbar machen und dort pflegen, wo er wirkt"
			],
			primaryCta: "Erstgespräch vereinbaren",
			secondaryCta: "Preise ansehen"
		},
		contactHeading: {
			headline: "Womit fangen",
			headlineAccent: "wir an?",
			sub: "Schreib mir kurz, wo es hakt. Ich antworte in der Regel innerhalb von 24 Stunden."
		},
		journalHeading: {
			headline: "Wissen für",
			headlineAccent: "deinen Betrieb."
		},
		trust: {
			title: "Darauf kannst du dich verlassen",
			facts: [
				{
					title: "Ein fester Ansprechpartner",
					text: "Du sprichst immer mit mir: {name} aus {town} bei Hamburg.",
					linkLabel: "Wer ich bin"
				},
				{
					title: "Echte Kundenprojekte",
					text: "Veröffentlicht nur mit Freigabe der Kunden.",
					linkLabel: "Projekte ansehen"
				},
				{
					title: "Offene Preise",
					text: "Stundensätze ab {rate} € netto, bei klarem Umfang auch Festpreis.",
					linkLabel: "Preise ansehen"
				}
			]
		},
		firstCall: {
			title: "Das Erstgespräch",
			nextStepsTitle: "So geht es weiter",
			items: [
				{
					label: "Ziel",
					text: "Du erzählst, wo es hakt. Ich sage dir ehrlich, ob ich helfen kann."
				},
				{
					label: "Vorbereitung",
					text: "Zwei, drei Sätze genügen. Ein Link hilft."
				},
				{
					label: "Ergebnis",
					text: "Du weißt, was zuerst dran ist und was es ungefähr kostet."
				},
				{
					label: "Kosten",
					text: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren."
				}
			],
			cta: "Erstgespräch vereinbaren"
		},
		pricingLogic: {
			title: "So entsteht dein Preis",
			steps: [
				{
					title: "Einordnen",
					text: "Im Erstgespräch klären wir Ziel und Umfang."
				},
				{
					title: "Abrechnen",
					text: "Nach Aufwand zum Stundensatz – oder zum Festpreis, wenn der Umfang klar ist."
				},
				{
					title: "Weiter betreuen",
					text: "Für die laufende Betreuung gibt es auf Wunsch Monatsmodelle."
				}
			],
			note: "Der Aufwand hängt vom Umfang ab und davon, wie klar die Aufgabe ist."
		}
	},
	en: {
		hero: {
			eyebrow: "For the self-employed, local businesses and small companies",
			headline: "Websites that bring in customers.",
			headlineAccent: "Digitalization",
			headlineSuffix: "that saves you time.",
			sub: "An outdated website, trouble with your shop or data typed in twice? I fix it and stay *your single point of contact*.",
			cta1: "Arrange an initial consultation",
			cta2: "View services",
			ctaNote: "Costs only arise once we agree on an assignment. I usually reply within 24 hours.",
			scrollHint: "Why me?"
		},
		whyMe: {
			headline: "Why",
			headlineAccent: "me?",
			lead: "You need *one point of contact* – not five suppliers.",
			p1: "I advise and build: website, shop and workflows from one source.",
			p2: "If you like, I stay your point of contact after launch – based in Schwarzenbek near Hamburg, working with businesses across Germany.",
			reasons: [
				{
					title: "One steady contact",
					description: "You always know who is taking care of it."
				},
				{
					title: "Explained plainly",
					description: "Clear options and costs, without the jargon."
				},
				{
					title: "Advice and delivery",
					description: "I do not just plan it — I build it."
				},
				{
					title: "Still there after launch",
					description: "I can keep running and improving it for you."
				}
			]
		},
		servicesOverview: {
			headline: "How I can",
			headlineAccent: "help.",
			intro: "Four services, *one point of contact*: from your web presence to digitalizing your workflows."
		},
		websiteDemos: {
			headline: "Example sites to",
			headlineAccent: "try out.",
			intro: "My own demos and projects – *not client work*. Just click through.",
			serviceIntro: "My own demos and projects, live on the web – *not client work*.",
			headlineSingle: "An example site to",
			introSingle: "One of my own example sites – *not client work*. Just click through.",
			serviceIntroSingle: "One of my own example sites, live on the web – *not client work*."
		},
		referencesHome: {
			headline: "Delivered for",
			headlineAccent: "clients.",
			intro: "Real projects – and *what they achieved*.",
			label: "Published only with the client's approval.",
			serviceCta: "See the matching service"
		},
		digitalResponsibility: {
			headline: "One point of contact for",
			headlineAccent: "everything digital.",
			body: "Digital work tends to stall between one-off projects, suppliers and the question of who owns it. I keep the overview and make sure the pieces fit together.",
			points: [
				"Say what comes first — in plain terms",
				"Deliver projects directly or steer the people involved",
				"Bring existing systems and new solutions together",
				"Make the presence visible and keep it working over time"
			],
			primaryCta: "Arrange an initial consultation",
			secondaryCta: "View pricing"
		},
		contactHeading: {
			headline: "Where shall we",
			headlineAccent: "start?",
			sub: "Tell me briefly where things get stuck. I usually reply within 24 hours."
		},
		journalHeading: {
			headline: "Know-how for",
			headlineAccent: "your business."
		},
		trust: {
			title: "What you can rely on",
			facts: [
				{
					title: "One steady contact",
					text: "You always talk to me: {name}, based in {town} near Hamburg.",
					linkLabel: "Who I am"
				},
				{
					title: "Real client projects",
					text: "Published only with the client's approval.",
					linkLabel: "View projects"
				},
				{
					title: "Open pricing",
					text: "Hourly rates from €{rate} net, a fixed price when the scope is clear.",
					linkLabel: "View pricing"
				}
			]
		},
		firstCall: {
			title: "The first conversation",
			nextStepsTitle: "What happens next",
			items: [
				{
					label: "Goal",
					text: "You tell me where things get stuck. I say honestly whether I can help."
				},
				{
					label: "Preparation",
					text: "Two or three sentences are enough. A link helps."
				},
				{
					label: "Outcome",
					text: "You know what comes first and roughly what it costs."
				},
				{
					label: "Costs",
					text: "Costs only arise once we agree on an assignment."
				}
			],
			cta: "Arrange an initial consultation"
		},
		pricingLogic: {
			title: "How your price comes about",
			steps: [
				{
					title: "Assess",
					text: "In the first conversation we clarify goal and scope."
				},
				{
					title: "Invoice",
					text: "By effort at the hourly rate – or at a fixed price when the scope is clear."
				},
				{
					title: "Look after it",
					text: "Monthly arrangements are available for ongoing support."
				}
			],
			note: "The effort depends on the scope and on how clearly the task is defined."
		}
	}
};
function getHomeContent(lang) {
	return content[lang];
}
/**
* Where each trust fact points, by position. Code-owned like every other
* destination on this site: an editor may reword a fact, never redirect it.
*/
var TRUST_TARGETS = [
	"about",
	"cases",
	"preise"
];
/**
* The trust card, ready to render: placeholders filled, destinations attached.
*
* The "cases" fact is dropped when no case is published — a fact about client
* projects that links to a section which renders nothing would be the one
* unverifiable claim on a card that exists to be verifiable.
*/
function resolveTrustFacts(trust, values) {
	const fill = (text) => text.replaceAll("{name}", values.name).replaceAll("{town}", values.town).replaceAll("{rate}", String(values.rate));
	const facts = [];
	trust.facts.slice(0, TRUST_TARGETS.length).forEach((fact, index) => {
		const target = TRUST_TARGETS[index];
		if (target === "cases" && !values.hasCases) return;
		facts.push({
			title: fact.title,
			text: fill(fact.text),
			href: `#${target}`,
			linkLabel: fact.linkLabel
		});
	});
	return {
		title: trust.title,
		facts
	};
}
/**
* Pick the demo section's framing for the number of cards that survived.
*
* Takes the already-merged content, so a CMS override of any single field is
* honoured on both counts. `count` is the length of `getDemos()`, never a
* configured number: the section only ever describes what it is about to show.
*
* A count of 0 never reaches a reader — the section renders nothing at all —
* but it returns the plural set rather than throwing, because a section header
* is not the place to discover an empty list.
*/
function demosCopy(content, count, variant) {
	const single = count === 1;
	return {
		headline: single ? content.headlineSingle : content.headline,
		headlineAccent: content.headlineAccent,
		intro: single ? variant === "service" ? content.serviceIntroSingle : content.introSingle : variant === "service" ? content.serviceIntro : content.intro
	};
}
//#endregion
//#region src/components/ui/AccentLetters.astro
createAstro("https://tracht-digital.de");
var $$AccentLetters = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AccentLetters;
	const { text, tone = "light", class: className = "" } = Astro.props;
	const chars = Array.from(text);
	return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(["accent-letters", className], "class:list")}${addAttribute(tone, "data-tone")}><span class="sr-only">${text}</span><span class="accent-letters__glyphs" aria-hidden="true">${chars.map((char) => renderTemplate`<span class="accent-letter">${char === " " ? "\xA0" : char}</span>`)}</span></span>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/AccentLetters.astro", void 0);
//#endregion
//#region src/components/ui/SectionHeader.astro
createAstro("https://tracht-digital.de");
var $$SectionHeader = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SectionHeader;
	const { headline, headlineAccent, id, dark = false, headingClass = "mb-16", bar = false } = Astro.props;
	const headingSpacing = bar ? "mb-5" : headingClass;
	return renderTemplate`${maybeRenderHead($$result)}<div class="text-center md:text-left"><h2${addAttribute(id, "id")}${addAttribute([
		"display text-4xl md:text-5xl lg:text-6xl",
		dark ? "text-white" : "text-[var(--color-black)]",
		headingSpacing
	], "class:list")}>${headline}${" "}${renderComponent($$result, "AccentLetters", $$AccentLetters, {
		"text": headlineAccent,
		"tone": dark ? "dark" : "light"
	})}</h2>${bar && renderTemplate`<span aria-hidden="true"${addAttribute([
		"tds-brandbar mx-auto md:mx-0",
		dark ? "tds-brandbar--on-dark" : null,
		headingClass
	], "class:list")}></span>`}</div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/SectionHeader.astro", void 0);
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
	return renderTemplate`${maybeRenderHead($$result)}<article class="service-tile group relative flex flex-col bg-[var(--lp-surface-card)] transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--color-accent-pink)_10%,var(--color-card))]" data-astro-cid-hwunfzhe>${image && renderTemplate`<div class="service-tile__shot" aria-hidden="true" data-astro-cid-hwunfzhe><img${addAttribute(image, "src")}${addAttribute(srcsetFor(image, SERVICE_PHOTO_VARIANT_WIDTHS, PHOTO.width), "srcset")} sizes="(min-width: 80rem) 40rem, (min-width: 40rem) 50vw, 100vw" alt=""${addAttribute(PHOTO.width, "width")}${addAttribute(PHOTO.height, "height")} loading="lazy" decoding="async" data-astro-cid-hwunfzhe></div>`}<div class="flex flex-col flex-1 p-6 sm:p-7 md:p-8" data-astro-cid-hwunfzhe><h3 class="font-[var(--font-display)] text-xl md:text-2xl text-[var(--color-black)] mb-5" data-astro-cid-hwunfzhe><a${addAttribute(href, "href")} class="service-tile__link" data-astro-cid-hwunfzhe>${title}</a></h3><dl class="service-tile__facts" data-astro-cid-hwunfzhe>${problem && renderTemplate`<div data-astro-cid-hwunfzhe><dt data-astro-cid-hwunfzhe>${ui.problem}</dt><dd data-astro-cid-hwunfzhe>${problem}</dd></div>`}${result && renderTemplate`<div data-astro-cid-hwunfzhe><dt data-astro-cid-hwunfzhe>${ui.result}</dt><dd data-astro-cid-hwunfzhe>${result}</dd></div>`}${keywords.length > 0 && renderTemplate`<div data-astro-cid-hwunfzhe><dt data-astro-cid-hwunfzhe>${ui.scope}</dt><dd data-astro-cid-hwunfzhe><ul class="flex flex-wrap gap-2 mt-1.5" data-astro-cid-hwunfzhe>${keywords.map((keyword) => renderTemplate`<li class="px-3 py-1 text-xs rounded-full bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--lp-surface-card))] text-[var(--color-accent)] transition-colors duration-200 group-hover:bg-[color-mix(in_srgb,var(--color-accent)_18%,var(--lp-surface-card))]" data-astro-cid-hwunfzhe>${keyword}</li>`)}</ul></dd></div>`}</dl><span aria-hidden="true" class="service-tile__more" data-astro-cid-hwunfzhe>${moreLabel ?? ui.more}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-hwunfzhe><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-hwunfzhe></line><polyline points="12 5 19 12 12 19" data-astro-cid-hwunfzhe></polyline></svg></span></div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/ServiceCard.astro", void 0);
var referencePreviewData_default = {
	generatedAt: "2026-09-09T18:28:55.290Z",
	previews: { "hof-meerheck": {
		"status": "ok",
		"preview": "/references/hof-meerheck.webp",
		"width": 1440,
		"height": 900,
		"capturedAt": "2026-09-09T18:28:55.231Z"
	} }
};
//#endregion
//#region src/lib/referencePreviewMeta.ts
var PREVIEW_SIZE = {
	width: 1440,
	height: 900
};
//#endregion
//#region src/lib/referencePreviews.ts
function isNonEmpty$1(value) {
	return typeof value === "string" && value.trim() !== "";
}
function resolveSnapshotPreviews(source = referencePreviewData_default, cases = referenceCases) {
	const resolved = [];
	for (const entry of cases) {
		if (!entry.previewAllowed) continue;
		if (entry.disclosure !== "named" || !entry.siteUrl) continue;
		const shot = source.previews?.[entry.id];
		if (!shot || shot.status !== "ok" || !isNonEmpty$1(shot.preview)) continue;
		resolved.push({
			id: entry.id,
			src: shot.preview,
			width: shot.width ?? PREVIEW_SIZE.width,
			height: shot.height ?? PREVIEW_SIZE.height
		});
	}
	return resolved;
}
var PROBE_TIMEOUT_MS$1 = 8e3;
var defaultProbe$1 = async (url) => {
	return (await fetch(url, {
		method: "HEAD",
		redirect: "follow",
		signal: AbortSignal.timeout(PROBE_TIMEOUT_MS$1)
	})).ok;
};
async function getReferencePreviews(options = {}) {
	const resolved = resolveSnapshotPreviews(options.snapshot, options.cases);
	if (resolved.length === 0) return /* @__PURE__ */ new Map();
	const cases = options.cases ?? referenceCases;
	const urlFor = (id) => cases.find((entry) => entry.id === id)?.siteUrl ?? null;
	const run = async () => {
		const probe = options.probe ?? defaultProbe$1;
		const results = await Promise.allSettled(resolved.map((preview) => {
			const url = urlFor(preview.id);
			return url ? probe(url) : Promise.resolve(false);
		}));
		return resolved.filter((_, index) => {
			const result = results[index];
			return result !== void 0 && result.status === "fulfilled" && result.value === true;
		});
	};
	if (Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_DEMO_MODE": "false",
		"SITE": "https://tracht-digital.de",
		"SSR": true
	}, { _: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm" })?.PUBLIC_DEMO_MODE === "true") return new Map(resolved.map((preview) => [preview.id, preview]));
	let live;
	if (options.cache === false) live = await run();
	else {
		const ids = new Set(await contentCache.get("references:previews", async () => (await run()).map((preview) => preview.id)));
		live = resolved.filter((preview) => ids.has(preview.id));
	}
	return new Map(live.map((preview) => [preview.id, preview]));
}
async function getReferencePreviewsBySiteUrl(options = {}) {
	const byId = await getReferencePreviews(options);
	const cases = options.cases ?? referenceCases;
	const bySite = /* @__PURE__ */ new Map();
	for (const entry of cases) {
		const preview = entry.siteUrl ? byId.get(entry.id) : void 0;
		if (entry.siteUrl && preview) bySite.set(entry.siteUrl, preview);
	}
	return bySite;
}
//#endregion
//#region src/lib/cardActions.ts
/**
* The bar's own words — this site talking about its own controls, so they
* follow the page's locale and are not editable copy. A mislabelled control is
* an accessibility defect, not a matter of tone.
*
* `newTab` says the same thing as `demoUi.newTab` and `ReferenceCard`'s own
* copy of it, and that repetition is deliberate: the bar is used by card
* families that are kept apart on purpose, and reaching into one of their
* vocabularies for one string would couple all of them to it.
*/
var cardActionUi = {
	de: {
		service: "Leistung",
		newTab: "öffnet in neuem Tab"
	},
	en: {
		service: "Service",
		newTab: "opens in a new tab"
	}
};
//#endregion
//#region src/components/ui/CardActions.astro
createAstro("https://tracht-digital.de");
var $$CardActions = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CardActions;
	const { service = null, cta = null, lang } = Astro.props;
	const ui = cardActionUi[lang];
	return renderTemplate`${maybeRenderHead($$result)}<div class="card-actions" data-astro-cid-vltrmc2a>${service && renderTemplate`<a class="card-actions__service"${addAttribute(service.href, "href")} data-astro-cid-vltrmc2a><span class="sr-only" data-astro-cid-vltrmc2a>${ui.service}: </span>${service.label}<span aria-hidden="true" data-astro-cid-vltrmc2a> →</span></a>`}${cta && renderTemplate`<a class="card-actions__cta"${addAttribute(cta.href, "href")}${addAttribute(cta.external ? "_blank" : void 0, "target")}${addAttribute(cta.external ? "noopener noreferrer" : void 0, "rel")}${addAttribute(cta.hreflang, "hreflang")} data-astro-cid-vltrmc2a>${cta.label}${cta.detail && renderTemplate`<span class="sr-only" data-astro-cid-vltrmc2a> — ${cta.detail}</span>`}${cta.external && renderTemplate`<span class="sr-only" data-astro-cid-vltrmc2a> (${ui.newTab})</span>`}${cta.external ? renderTemplate`<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-vltrmc2a><line x1="7" y1="17" x2="17" y2="7" data-astro-cid-vltrmc2a></line><polyline points="7 7 17 7 17 17" data-astro-cid-vltrmc2a></polyline></svg>` : renderTemplate`<span aria-hidden="true" data-astro-cid-vltrmc2a>→</span>`}</a>`}</div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/CardActions.astro", void 0);
//#endregion
//#region src/components/ui/FirstCall.astro
createAstro("https://tracht-digital.de");
var $$FirstCall = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FirstCall;
	const { variant = "process" } = Astro.props;
	const lang = resolveLang(Astro.currentLocale);
	const content = await cmsFor("first_call", lang, getHomeContent(lang).firstCall);
	const title = variant === "contact" ? content.nextStepsTitle : content.title;
	const contactHref = `${localizePath("/", lang)}#contact`;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["first-call", `first-call--${variant}`], "class:list")} data-astro-cid-3klv6zur>${variant === "process" && renderTemplate`<div class="first-call__shot" aria-hidden="true" data-astro-cid-3klv6zur><img src="/images/process/step-01.webp" alt="" loading="lazy" decoding="async" data-astro-cid-3klv6zur></div>`}<div class="first-call__body" data-astro-cid-3klv6zur><h3 class="first-call__title" data-astro-cid-3klv6zur>${title}</h3><dl class="first-call__list" data-astro-cid-3klv6zur>${content.items.map((item) => renderTemplate`<div class="first-call__item" data-astro-cid-3klv6zur><dt data-astro-cid-3klv6zur>${item.label}</dt><dd data-astro-cid-3klv6zur>${item.text}</dd></div>`)}</dl>${variant === "process" && renderTemplate`<a${addAttribute(contactHref, "href")} class="first-call__cta" data-astro-cid-3klv6zur>${content.cta}<span aria-hidden="true" data-astro-cid-3klv6zur>→</span></a>`}</div></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/FirstCall.astro", void 0);
var demoData_default = {
	generatedAt: "2026-09-09T18:29:18.209Z",
	demos: {
		"demo1": {
			"status": "ok",
			"title": "Demo & Partner Rechtsanwälte",
			"description": "Hochwertige Demonstrationsseite einer fiktiven deutschen Wirtschaftskanzlei. Keine Rechtsberatung, keine echten Kontaktdaten.",
			"siteLang": "de",
			"favicon": "/demos/demo1-favicon.svg",
			"preview": "/demos/demo1.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-09-09T18:29:06.891Z"
		},
		"demo2": {
			"status": "ok",
			"title": "Dein Rhythmus. Deine Regeln. — BLOCK/01",
			"description": "Streetwear für deinen eigenen Rhythmus. Entdecke BLOCK/01, die interaktive Shop-Arbeitsprobe von Tracht Digital Solutions.",
			"siteLang": "de",
			"favicon": "/demos/demo2-favicon.svg",
			"preview": "/demos/demo2.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-09-09T18:29:07.128Z"
		},
		"demo3": {
			"status": "ok",
			"title": "Immobilienverwaltung — Nordstern Immobilien",
			"description": "Interaktives Immobilien-Verwaltungspanel mit Beispieldaten",
			"siteLang": "de",
			"favicon": "/demos/demo3-favicon.ico",
			"preview": "/demos/demo3.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-09-09T18:29:07.434Z"
		},
		"demo4": {
			"status": "tls-invalid",
			"title": null,
			"description": null,
			"siteLang": null,
			"favicon": null,
			"preview": null,
			"previewWidth": null,
			"previewHeight": null,
			"checkedAt": "2026-09-09T18:29:07.522Z"
		},
		"demo5": {
			"status": "tls-invalid",
			"title": null,
			"description": null,
			"siteLang": null,
			"favicon": null,
			"preview": null,
			"previewWidth": null,
			"previewHeight": null,
			"checkedAt": "2026-09-09T18:29:07.637Z"
		},
		"shop": {
			"status": "ok",
			"title": "TDShop",
			"description": "Kuratierte Technik für Digitalisierung im Betrieb: Hardware, Netzwerk und Software mit eigener Einschätzung statt Herstellertext.",
			"siteLang": "de",
			"favicon": "/demos/shop-favicon.png",
			"preview": "/demos/shop.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-09-09T18:29:07.904Z"
		}
	}
};
//#endregion
//#region src/lib/demoCatalog.ts
/**
* What KIND of site a demo is — the one thing on a demo card that this site
* says rather than quotes.
*
* Everything else on a card (name, description, favicon, screenshot) is
* harvested from the demo itself, and that rule stands. This is the single
* deliberate exception, and it is narrow on purpose:
*
* - It applies to OUR OWN demos only. We are not describing anyone's site.
* - It names the GENRE, never the content. "Onlineshop", not "Streetwear-Shop";
*   "Webseite", not "Kanzlei-Webseite". A visitor scanning the shelf wants to
*   know which of these is a shop and which is a page — the demo's own title
*   already tells them what it is about.
* - The vocabulary is CLOSED, so it cannot drift into marketing copy one
*   entry at a time. `demos.test.ts` holds it shut.
*
* A demo whose genre is not in this list means the list is wrong, not that a
* new label should be invented at the call site.
*/
var DEMO_KINDS = {
	website: {
		de: "Webseite",
		en: "Website"
	},
	landing: {
		de: "Landingpage",
		en: "Landing page"
	},
	shop: {
		de: "Onlineshop",
		en: "Online shop"
	}
};
/**
* WHOSE site a card shows — the second, and last, thing this site says about a
* demo, and the one that keeps the shelf honest.
*
* The shelf used to sit in one carousel with the customer cases, and nothing on
* a card said which were customers and which were ours. That matters more than
* the genre: a visitor judging this business by its work has to be able to
* tell a delivered project from a sample, without reading the host name.
*
* - `demo` — a sample site about a business that does not exist (the law firm,
*   the streetwear label, the property manager). Their own descriptions say
*   so; the badge says it before anybody has to read.
* - `own` — a real site of Tracht Digital Solutions itself. The shop is one:
*   it sells for real, so calling it "fictional" would be the opposite lie.
*
* Closed, like `DEMO_KINDS`, and for the same reason. Neither label may ever be
* "Kundenprojekt" — customer cases are `references.ts`, a different catalog
* with its own consent rules.
*/
var DEMO_ORIGINS = {
	demo: {
		de: "Demo · fiktives Beispiel",
		en: "Demo · fictional example"
	},
	own: {
		de: "Eigenes Projekt",
		en: "Own project"
	}
};
/**
* Every demo site, in display order.
*
* Adding one means adding it here AND running `npm run demos:sync`. The tests
* fail on a definition with no snapshot entry, which is what stops a new demo
* from rendering as a card with no picture and no text.
*
* `shop` is the one entry that is not a `demoN` host, and it went in before it
* had anything to show. That is safe, and it is the reason the availability
* check exists: while `shop.tracht-digital.de` answered with the hosting
* panel's "Hier entsteht eine neue Webseite" placeholder, the sync recorded it
* as `placeholder` and no card rendered. The day the shop was deployed, a sync
* turned it into a card without a code change.
*/
var demoDefinitions = [
	{
		id: "demo1",
		number: "01",
		host: "demo1.tracht-digital.de",
		url: "https://demo1.tracht-digital.de/",
		kind: "website",
		origin: "demo"
	},
	{
		id: "demo2",
		number: "02",
		host: "demo2.tracht-digital.de",
		url: "https://demo2.tracht-digital.de/de/",
		kind: "shop",
		origin: "demo"
	},
	{
		id: "demo3",
		number: "03",
		host: "demo3.tracht-digital.de",
		url: "https://demo3.tracht-digital.de/",
		kind: "website",
		origin: "demo"
	},
	{
		id: "demo4",
		number: "04",
		host: "demo4.tracht-digital.de",
		url: "https://demo4.tracht-digital.de/",
		kind: "website",
		origin: "demo"
	},
	{
		id: "demo5",
		number: "05",
		host: "demo5.tracht-digital.de",
		url: "https://demo5.tracht-digital.de/",
		kind: "website",
		origin: "demo"
	},
	{
		id: "shop",
		number: "06",
		host: "shop.tracht-digital.de",
		url: "https://shop.tracht-digital.de/",
		kind: "shop",
		origin: "own"
	}
];
/**
* The screenshot box: viewport for the capture, intrinsic size of the WebP,
* and the aspect ratio the card reserves before the image loads.
*
* 16:10 matches the service grounds in IMAGES.md, so the two card families on
* the home page keep one rhythm.
*/
var DEMO_PREVIEW = {
	width: 1440,
	height: 900
};
//#endregion
//#region src/lib/demos.ts
var demoSnapshot = demoData_default;
function isNonEmpty(value) {
	return typeof value === "string" && value.trim() !== "";
}
function resolveSnapshotDemos(source = demoSnapshot, definitions = demoDefinitions) {
	const resolved = [];
	for (const definition of definitions) {
		const entry = source.demos?.[definition.id];
		if (!entry || entry.status !== "ok") continue;
		if (!isNonEmpty(entry.title) || !isNonEmpty(entry.preview)) continue;
		resolved.push({
			definition,
			title: entry.title.trim(),
			description: isNonEmpty(entry.description) ? entry.description.trim() : null,
			siteLang: isNonEmpty(entry.siteLang) ? entry.siteLang : null,
			favicon: isNonEmpty(entry.favicon) ? entry.favicon : null,
			preview: entry.preview,
			previewWidth: entry.previewWidth ?? DEMO_PREVIEW.width,
			previewHeight: entry.previewHeight ?? DEMO_PREVIEW.height
		});
	}
	return resolved;
}
var PROBE_TIMEOUT_MS = 3e3;
var defaultProbe = async (demo) => {
	return (await fetch(demo.definition.url, {
		method: "HEAD",
		redirect: "follow",
		signal: AbortSignal.timeout(PROBE_TIMEOUT_MS)
	})).ok;
};
async function filterReachable(demos, probe = defaultProbe) {
	if (demos.length === 0) return [];
	const results = await Promise.allSettled(demos.map((demo) => probe(demo)));
	return demos.filter((_, index) => {
		const result = results[index];
		return result !== void 0 && result.status === "fulfilled" && result.value === true;
	});
}
async function getDemos(options = {}) {
	const resolved = resolveSnapshotDemos(options.snapshot, options.definitions);
	if (resolved.length === 0) return [];
	if (Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_DEMO_MODE": "false",
		"SITE": "https://tracht-digital.de",
		"SSR": true
	}, { _: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm" })?.PUBLIC_DEMO_MODE === "true") return resolved;
	const run = () => filterReachable(resolved, options.probe);
	if (options.cache === false) return run();
	const reachable = await contentCache.get("demos:availability", async () => (await run()).map((demo) => demo.definition.id));
	const ids = new Set(reachable);
	return resolved.filter((demo) => ids.has(demo.definition.id));
}
var demoUi = {
	de: {
		newTab: "öffnet in neuem Tab",
		visit: "Demo ansehen",
		hostLabel: "Adresse",
		zoom: "Vorschau vergrößern"
	},
	en: {
		newTab: "opens in a new tab",
		visit: "View demo",
		hostLabel: "Address",
		zoom: "Enlarge preview"
	}
};
//#endregion
//#region src/components/ui/DemoCard.astro
createAstro("https://tracht-digital.de");
var $$DemoCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DemoCard;
	const { demo, lang, serviceLink = null } = Astro.props;
	const ui = demoUi[lang];
	const { definition, title, description, favicon, preview, previewWidth, previewHeight } = demo;
	const previewAlt = lang === "de" ? `Startseite der Demo-Webseite ${title}` : `Home page of the demo website ${title}`;
	const kind = DEMO_KINDS[definition.kind][lang];
	const origin = DEMO_ORIGINS[definition.origin][lang];
	return renderTemplate`${maybeRenderHead($$result)}<article class="demo-card-slot" data-reveal data-astro-cid-ug7wgawq><div class="demo-card" data-astro-cid-ug7wgawq><div class="demo-card__shot" data-astro-cid-ug7wgawq><img${addAttribute(preview, "src")}${addAttribute(srcsetFor(preview, PREVIEW_VARIANT_WIDTHS, previewWidth), "srcset")} sizes="(min-width: 64rem) 34vw, (min-width: 48rem) 48vw, 85vw"${addAttribute(previewAlt, "alt")}${addAttribute(previewWidth, "width")}${addAttribute(previewHeight, "height")} loading="lazy" decoding="async" data-astro-cid-ug7wgawq><span class="demo-card__origin" data-astro-cid-ug7wgawq>${origin}</span><button type="button" class="demo-card__zoom" hidden data-preview-open${addAttribute(preview, "data-preview-src")}${addAttribute(previewAlt, "data-preview-alt")}${addAttribute(title, "data-preview-title")}${addAttribute(definition.host, "data-preview-host")}${addAttribute(definition.url, "data-preview-href")} data-astro-cid-ug7wgawq><span class="sr-only" data-astro-cid-ug7wgawq>${ui.zoom}</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-ug7wgawq><circle cx="11" cy="11" r="7" data-astro-cid-ug7wgawq></circle><line x1="16.5" y1="16.5" x2="21" y2="21" data-astro-cid-ug7wgawq></line><line x1="11" y1="8" x2="11" y2="14" data-astro-cid-ug7wgawq></line><line x1="8" y1="11" x2="14" y2="11" data-astro-cid-ug7wgawq></line></svg></button></div><div class="demo-card__body" data-astro-cid-ug7wgawq><p class="demo-card__kind" data-astro-cid-ug7wgawq>${kind}</p><div class="demo-card__head" data-astro-cid-ug7wgawq>${favicon && renderTemplate`<img class="demo-card__favicon"${addAttribute(favicon, "src")} alt="" aria-hidden="true" width="20" height="20" loading="lazy" decoding="async" data-astro-cid-ug7wgawq>`}<h3 class="demo-card__title" data-astro-cid-ug7wgawq>${title}</h3></div>${description && renderTemplate`<p class="demo-card__text" data-astro-cid-ug7wgawq>${description}</p>`}<p class="demo-card__host" data-astro-cid-ug7wgawq><span class="sr-only" data-astro-cid-ug7wgawq>${ui.hostLabel}: </span>${definition.host}</p></div>${renderComponent($$result, "CardActions", $$CardActions, {
		"lang": lang,
		"service": serviceLink,
		"cta": {
			href: definition.url,
			label: ui.visit,
			external: true,
			hreflang: demo.siteLang ?? void 0,
			detail: title
		},
		"data-astro-cid-ug7wgawq": true
	})}</div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/DemoCard.astro", void 0);
//#endregion
//#region src/components/ui/BusinessCardTile.astro
createAstro("https://tracht-digital.de");
var $$BusinessCardTile = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BusinessCardTile;
	const { serviceLink = null } = Astro.props;
	const lang = resolveLang(Astro.currentLocale);
	const copy = businessCardCopy[lang];
	const href = businessCardHref(lang);
	return renderTemplate`${maybeRenderHead($$result)}<article class="bc-tile-slot" data-reveal data-astro-cid-foobldl3><div class="bc-tile" data-astro-cid-foobldl3><div class="bc-tile__shot" data-astro-cid-foobldl3><img${addAttribute(BUSINESS_CARD_PREVIEW, "src")}${addAttribute(copy.previewAlt, "alt")}${addAttribute(DEMO_PREVIEW.width, "width")}${addAttribute(DEMO_PREVIEW.height, "height")} loading="lazy" decoding="async" data-astro-cid-foobldl3></div><div class="bc-tile__body" data-astro-cid-foobldl3><p class="bc-tile__eyebrow" data-astro-cid-foobldl3>${copy.eyebrow}</p><h3 class="bc-tile__title" data-astro-cid-foobldl3>${copy.title}</h3><p class="bc-tile__text" data-astro-cid-foobldl3>${copy.text}</p></div>${renderComponent($$result, "CardActions", $$CardActions, {
		"lang": lang,
		"service": serviceLink,
		"cta": {
			href,
			label: copy.cta,
			detail: copy.title
		},
		"data-astro-cid-foobldl3": true
	})}</div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/BusinessCardTile.astro", void 0);
//#endregion
//#region src/lib/pricing.ts
var defaults = {
	de: {
		label: "— Preise",
		headline: "Preise ohne",
		headlineAccent: "Überraschungen.",
		sub: "Du siehst vorher, was jede Leistung pro Stunde kostet. Bei klarem Umfang geht auch ein *Festpreis*.",
		teaserHeadline: "Planbare Sätze,",
		teaserHeadlineAccent: "passende Modelle.",
		teaserSub: "Ab 65 € netto pro Stunde. Steht der Umfang vorher fest, rechne ich auch zum Festpreis ab.",
		teaserCta: "Preise ansehen",
		teaserFromLabel: "ab",
		hourSuffix: "/ Stunde",
		includesLabel: "Enthalten:",
		rateConsulting: 75,
		rateProcess: 70,
		rateSolutions: 70,
		rateWebPresence: 65,
		notesTitle: "Gut zu wissen",
		notes: ["Alle Preise netto, zuzüglich Mehrwertsteuer.", "Bei Anzeigen kommt dein Werbebudget dazu. Es geht direkt an Google."],
		ctaTitle: "Welcher Rahmen passt zu dir?",
		ctaSub: "Das klären wir im Erstgespräch.",
		ctaButton: "Erstgespräch vereinbaren",
		back: "Zurück zur Startseite"
	},
	en: {
		label: "— Pricing",
		headline: "Pricing without",
		headlineAccent: "surprises.",
		sub: "You can see up front what each service costs per hour. When the scope is clear, a *fixed price* works too.",
		teaserHeadline: "Predictable rates,",
		teaserHeadlineAccent: "models that fit.",
		teaserSub: "From €65 net per hour. When the scope is settled up front, I work to a fixed price too.",
		teaserCta: "View pricing",
		teaserFromLabel: "from",
		hourSuffix: "/ hour",
		includesLabel: "Included:",
		rateConsulting: 75,
		rateProcess: 70,
		rateSolutions: 70,
		rateWebPresence: 65,
		notesTitle: "Good to know",
		notes: ["All prices are net, plus VAT.", "Ads come with your own media budget. It goes to Google directly."],
		ctaTitle: "Which setup fits you?",
		ctaSub: "We work that out in the first conversation.",
		ctaButton: "Arrange an initial consultation",
		back: "Back to the homepage"
	}
};
function getPricingDefault(lang) {
	return defaults[lang];
}
async function getPricingContent(lang) {
	return cmsFor("pricing_services", lang, getPricingDefault(lang));
}
/**
* The hourly rate for a service.
*
* Total, not partial. Complete IT used to be absent from this map on purpose —
* that omission WAS the "no invented price" rule, and every caller carried an
* `undefined` branch for it. With that service gone the branch was dead code
* that still forced a null check at three call sites, so the map is now
* exhaustive and the return type says so. A new rate-less service would fail
* to compile here, which is the right place to notice it.
*/
function getServiceRate(pricing, serviceId) {
	return {
		consulting: pricing.rateConsulting,
		process: pricing.rateProcess,
		solutions: pricing.rateSolutions,
		"web-presence": pricing.rateWebPresence
	}[serviceId];
}
/**
* The lowest of the four rates — "ab …" wherever the site quotes a floor.
*
* Computed from the resolved block, never typed into copy: the hero's trust
* card says "Stundensätze ab {rate} €", and a rate edited in the panel has to
* move that sentence too.
*/
function lowestRate(pricing) {
	return Math.min(pricing.rateConsulting, pricing.rateProcess, pricing.rateSolutions, pricing.rateWebPresence);
}
//#endregion
//#region src/components/ui/FaqAccordion.astro
createAstro("https://tracht-digital.de");
var $$FaqAccordion = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FaqAccordion;
	const { items, name = "faq" } = Astro.props;
	return renderTemplate`${items.map((item, i) => renderTemplate`${maybeRenderHead($$result)}<details${addAttribute(name, "name")}${addAttribute(i === 0, "open")} class="faq-item tds-disclosure" data-reveal data-astro-cid-g3uyybff><summary class="faq-summary" data-astro-cid-g3uyybff><span class="faq-q" data-astro-cid-g3uyybff>${item.q}</span><span aria-hidden="true" class="faq-chevron" data-astro-cid-g3uyybff><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-g3uyybff><polyline points="9 6 15 12 9 18" data-astro-cid-g3uyybff></polyline></svg></span></summary><p class="faq-a" data-astro-cid-g3uyybff>${item.a}</p></details>`)}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/FaqAccordion.astro", void 0);
//#endregion
export { resolveTrustFacts as _, $$BusinessCardTile as a, $$Footer as b, $$FirstCall as c, getReferencePreviewsBySiteUrl as d, $$ServiceCard as f, getHomeContent as g, demosCopy as h, lowestRate as i, $$CardActions as l, $$AccentLetters as m, getPricingContent as n, $$DemoCard as o, $$SectionHeader as p, getServiceRate as r, getDemos as s, $$FaqAccordion as t, getReferencePreviews as u, $$Emphasis as v, $$Header as x, stripEmphasis as y };
