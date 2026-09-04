import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { o as localizePath, t as $$Layout } from "./Layout_V8d2QaQ-.mjs";
import { _ as businessCardHref, l as siteConfig, m as BUSINESS_CARD_QR_PATH } from "./services_Bv7bmOO1.mjs";
import { i as $$Image } from "./_astro_assets_IQp2aswF.mjs";
import { d as $$Header, o as personSchema, u as $$Footer } from "./jsonld_B_PfucTA.mjs";
import { t as portrait_default } from "./portrait_BZEVrq7D.mjs";
//#region src/components/BusinessCardPage.astro
createAstro("https://tracht-digital.de");
var $$BusinessCardPage = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BusinessCardPage;
	const { lang } = Astro.props;
	const pageDescriptions = {
		de: "Die digitale Visitenkarte von Julian Tracht: anrufen, schreiben, Kontakt speichern oder den QR-Code scannen — und ein Beispiel dafür, was ich für Kunden baue.",
		en: "The digital business card of Julian Tracht: call, write, save the contact or scan the QR code — and an example of what I build for customers."
	};
	const { founder, email, telephone, socials, name } = siteConfig;
	const phoneHref = telephone.replace(/\s/g, "");
	const whatsappHref = `https://wa.me/${phoneHref.replace(/^\+/, "")}`;
	const ui = lang === "de" ? {
		eyebrow: "Digitale Visitenkarte",
		call: "Anrufen",
		mail: "E-Mail schreiben",
		whatsapp: "WhatsApp",
		save: "Kontakt speichern",
		qrTitle: "Zum Weitergeben",
		qrText: "Diese Seite als QR-Code — abfotografieren lassen, statt Kontaktdaten zu diktieren.",
		qrAlt: "QR-Code, der auf diese Visitenkarte führt",
		back: "Zur Startseite",
		newTab: "öffnet in neuem Tab",
		pitchTitle: "So eine Karte für Ihr Unternehmen?",
		pitchText: "Diese Seite ist kein Sonderfall, sondern Teil des Webauftritts: eine Adresse, die Sie weitergeben, die auf jedem Telefon funktioniert und die sich ändern lässt, ohne dass gedruckte Karten wertlos werden.",
		pitchCta: "Zum Webauftritt"
	} : {
		eyebrow: "Digital business card",
		call: "Call",
		mail: "Write an email",
		whatsapp: "WhatsApp",
		save: "Save contact",
		qrTitle: "To pass on",
		qrText: "This page as a QR code — let people photograph it instead of dictating contact details.",
		qrAlt: "QR code leading to this business card",
		back: "To the homepage",
		newTab: "opens in a new tab",
		pitchTitle: "A card like this for your business?",
		pitchText: "This page is not a special case but part of a web presence: one address you hand out, working on every phone, and changeable without making printed cards worthless.",
		pitchCta: "To web presence"
	};
	const webPresencePath = lang === "de" ? "/leistungen/webauftritt" : "/en/services/web-presence";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${founder.name} — ${ui.eyebrow} | ${name}`,
		"description": pageDescriptions[lang],
		"lang": lang,
		"alternates": {
			de: businessCardHref("de"),
			en: businessCardHref("en")
		},
		"jsonLd": personSchema(),
		"data-astro-cid-pbperak2": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {
		"lang": lang,
		"data-astro-cid-pbperak2": true
	})}${maybeRenderHead($$result)}<main id="main" class="min-h-screen bg-[var(--color-paper)]" data-astro-cid-pbperak2><div class="max-w-3xl mx-auto px-6 md:px-8 py-24 md:py-32" data-astro-cid-pbperak2><a${addAttribute(localizePath("/", lang), "href")} class="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-12 inline-block" data-astro-cid-pbperak2>← ${ui.back}</a><article class="vcard" data-astro-cid-pbperak2><p class="eyebrow text-[var(--color-accent)] mb-6" data-astro-cid-pbperak2>${ui.eyebrow}</p><div class="vcard__head" data-astro-cid-pbperak2>${renderComponent($$result, "Image", $$Image, {
		"src": portrait_default,
		"alt": founder.name,
		"widths": [160, 260],
		"sizes": "(min-width: 768px) 6.5rem, 5rem",
		"loading": "eager",
		"class": "vcard__portrait",
		"data-astro-cid-pbperak2": true
	})}<div data-astro-cid-pbperak2><h1 class="vcard__name" data-astro-cid-pbperak2>${founder.name}</h1><p class="vcard__role" data-astro-cid-pbperak2>${founder.jobTitle}</p><p class="vcard__org" data-astro-cid-pbperak2>${name}</p></div></div><div class="vcard__actions" data-astro-cid-pbperak2><a class="vcard__action"${addAttribute(`tel:${phoneHref}`, "href")} data-astro-cid-pbperak2><span class="vcard__action-label" data-astro-cid-pbperak2>${ui.call}</span><span class="vcard__action-value" data-astro-cid-pbperak2>${telephone}</span></a><a class="vcard__action"${addAttribute(`mailto:${email}`, "href")} data-astro-cid-pbperak2><span class="vcard__action-label" data-astro-cid-pbperak2>${ui.mail}</span><span class="vcard__action-value" data-astro-cid-pbperak2>${email}</span></a><a class="vcard__action"${addAttribute(whatsappHref, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-pbperak2><span class="vcard__action-label" data-astro-cid-pbperak2>${ui.whatsapp}<span class="sr-only" data-astro-cid-pbperak2> (${ui.newTab})</span></span><span class="vcard__action-value" data-astro-cid-pbperak2>${telephone}</span></a>${socials.linkedin && renderTemplate`<a class="vcard__action"${addAttribute(socials.linkedin, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-pbperak2><span class="vcard__action-label" data-astro-cid-pbperak2>LinkedIn<span class="sr-only" data-astro-cid-pbperak2> (${ui.newTab})</span></span><span class="vcard__action-value" data-astro-cid-pbperak2>/in/julian-tracht</span></a>`}</div><a class="vcard__save" href="/kontakt.vcf" data-astro-cid-pbperak2><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-pbperak2><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" data-astro-cid-pbperak2></path><circle cx="9" cy="7" r="4" data-astro-cid-pbperak2></circle><line x1="19" y1="8" x2="19" y2="14" data-astro-cid-pbperak2></line><line x1="22" y1="11" x2="16" y2="11" data-astro-cid-pbperak2></line></svg>${ui.save}</a><div class="vcard__qr" data-astro-cid-pbperak2><img class="vcard__qr-code"${addAttribute(BUSINESS_CARD_QR_PATH[lang], "src")}${addAttribute(ui.qrAlt, "alt")} width="120" height="120" decoding="async" data-astro-cid-pbperak2><div data-astro-cid-pbperak2><p class="vcard__qr-title" data-astro-cid-pbperak2>${ui.qrTitle}</p><p class="vcard__qr-text" data-astro-cid-pbperak2>${ui.qrText}</p></div></div></article><aside class="vcard-pitch" data-astro-cid-pbperak2><h2 class="vcard-pitch__title" data-astro-cid-pbperak2>${ui.pitchTitle}</h2><p class="vcard-pitch__text" data-astro-cid-pbperak2>${ui.pitchText}</p><a${addAttribute(webPresencePath, "href")} class="link-underline text-[var(--color-accent)]" data-astro-cid-pbperak2>${ui.pitchCta}<span aria-hidden="true" data-astro-cid-pbperak2> →</span></a></aside></div></main>${renderComponent($$result, "Footer", $$Footer, {
		"lang": lang,
		"data-astro-cid-pbperak2": true
	})}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/BusinessCardPage.astro", void 0);
//#endregion
export { $$BusinessCardPage as t };
