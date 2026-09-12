import { A as renderTemplate, B as createAstro, N as addAttribute, R as unescapeHTML, j as maybeRenderHead, w as renderComponent } from "./sequence_CrsIaRJD.mjs";
import { t as createComponent } from "./compiler_BDfTnRdB.mjs";
import { d as renderScript, i as ThemeToggle, l as tFor, t as $$Layout } from "./Layout_Dugn1bEh.mjs";
import { _ as siteConfig, f as BUSINESS_CARD_QR_PATH, g as businessCardLinks, h as businessCardHref } from "./services_24zuh8Jr.mjs";
import { c as portraitSrcset, m as personSchema, n as PORTRAIT_SIZE, s as portraitSrc, u as asGraph } from "./imageVariants_DAALLCtF.mjs";
import { t as legalCopy } from "./legal_tMZIxtrh.mjs";
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
	const { founder, name, address } = siteConfig;
	const t = tFor(lang);
	const links = businessCardLinks(lang);
	const groups = [{
		id: "contact",
		items: links.filter((link) => link.group === "contact")
	}, {
		id: "more",
		items: links.filter((link) => link.group === "more")
	}];
	const ui = lang === "de" ? {
		eyebrow: "Digitale Visitenkarte",
		bio: "Eine feste Ansprechperson für Beratung, Prozesse, eigene Software und den Webauftritt.",
		save: "Kontakt speichern",
		saveMeta: "vCard für Telefon, Mac und Outlook",
		groupContact: "Direkt erreichbar",
		groupMore: "Mehr von mir",
		qrTitle: "Zum Weitergeben",
		qrText: "Diese Seite als QR-Code — abfotografieren lassen, statt Kontaktdaten zu diktieren.",
		qrAlt: "QR-Code, der auf diese Visitenkarte führt",
		share: "Link teilen",
		shareDone: "Link kopiert",
		newTab: "öffnet in neuem Tab",
		controls: "Sprache und Darstellung",
		langOther: "English",
		toDark: "Auf Dunkel umschalten",
		toLight: "Auf Hell umschalten",
		pitchTitle: "So eine Karte für Ihr Unternehmen?",
		pitchText: "Diese Seite ist kein Sonderfall, sondern Teil des Webauftritts: eine Adresse, die Sie weitergeben, die auf jedem Telefon funktioniert und die sich ändern lässt, ohne dass gedruckte Karten wertlos werden.",
		pitchCta: "Zum Webauftritt"
	} : {
		eyebrow: "Digital business card",
		bio: "One dedicated contact for advice, processes, tailored software and your web presence.",
		save: "Save contact",
		saveMeta: "vCard for phone, Mac and Outlook",
		groupContact: "Reach me directly",
		groupMore: "More from me",
		qrTitle: "To pass on",
		qrText: "This page as a QR code — let people photograph it instead of dictating contact details.",
		qrAlt: "QR code leading to this business card",
		share: "Share link",
		shareDone: "Link copied",
		newTab: "opens in a new tab",
		controls: "Language and appearance",
		langOther: "Deutsch",
		toDark: "Switch to dark mode",
		toLight: "Switch to light mode",
		pitchTitle: "A card like this for your business?",
		pitchText: "This page is not a special case but part of a web presence: one address you hand out, working on every phone, and changeable without making printed cards worthless.",
		pitchCta: "To web presence"
	};
	const groupHeadings = {
		contact: ui.groupContact,
		more: ui.groupMore
	};
	const webPresencePath = lang === "de" ? "/leistungen/webauftritt" : "/en/services/web-presence";
	const agbPath = lang === "de" ? "/legal/agb" : "/en/legal/agb";
	const otherLang = lang === "de" ? "en" : "de";
	const cardUrl = `${siteConfig.url}${businessCardHref(lang)}`;
	const ICONS = {
		save: "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /><circle cx=\"9\" cy=\"7\" r=\"4\" /><line x1=\"19\" y1=\"8\" x2=\"19\" y2=\"14\" /><line x1=\"22\" y1=\"11\" x2=\"16\" y2=\"11\" />",
		phone: "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z\" />",
		whatsapp: "<path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\" />",
		mail: "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" /><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" />",
		website: "<circle cx=\"12\" cy=\"12\" r=\"10\" /><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\" /><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\" />",
		services: "<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" /><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\" />",
		pricing: "<path d=\"M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.58a2 2 0 0 1 0 2.83z\" /><line x1=\"7\" y1=\"7\" x2=\"7.01\" y2=\"7\" />",
		journal: "<path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\" /><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\" /><line x1=\"9\" y1=\"7\" x2=\"16\" y2=\"7\" /><line x1=\"9\" y1=\"11\" x2=\"16\" y2=\"11\" />",
		linkedin: "<path d=\"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z\" /><rect x=\"2\" y=\"9\" width=\"4\" height=\"12\" /><circle cx=\"4\" cy=\"4\" r=\"2\" />",
		github: "<path d=\"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22\" />",
		share: "<circle cx=\"18\" cy=\"5\" r=\"3\" /><circle cx=\"6\" cy=\"12\" r=\"3\" /><circle cx=\"18\" cy=\"19\" r=\"3\" /><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\" /><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\" />"
	};
	const profileSchema = {
		"@type": "ProfilePage",
		"@id": `${cardUrl}#profile`,
		url: cardUrl,
		name: `${founder.name} — ${ui.eyebrow}`,
		inLanguage: lang === "de" ? "de-DE" : "en-GB",
		mainEntity: { "@id": `${siteConfig.url}/#person` }
	};
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${founder.name} — ${ui.eyebrow} | ${name}`,
		"description": pageDescriptions[lang],
		"lang": lang,
		"alternates": {
			de: businessCardHref("de"),
			en: businessCardHref("en")
		},
		"jsonLd": asGraph(personSchema(), profileSchema),
		"bare": true,
		"data-astro-cid-pbperak2": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main" class="card tds-wash" data-astro-cid-pbperak2><div class="card__inner" data-astro-cid-pbperak2><nav class="card__top"${addAttribute(ui.controls, "aria-label")} data-astro-cid-pbperak2><a class="card__lang"${addAttribute(businessCardHref(otherLang), "href")}${addAttribute(otherLang, "hreflang")}${addAttribute(otherLang, "lang")} data-astro-cid-pbperak2>${ui.langOther}</a>${renderComponent($$result, "ThemeToggle", ThemeToggle, {
		"client:idle": true,
		"labelToDark": ui.toDark,
		"labelToLight": ui.toLight,
		"data-astro-cid-pbperak2": true,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "ThemeToggle"
	})}</nav><header class="card__id" data-astro-cid-pbperak2><img${addAttribute(portraitSrc(360), "src")}${addAttribute(portraitSrcset(), "srcset")} sizes="(min-width: 768px) 9rem, 7.5rem"${addAttribute(PORTRAIT_SIZE.width, "width")}${addAttribute(PORTRAIT_SIZE.height, "height")}${addAttribute(founder.name, "alt")} loading="eager" fetchpriority="high" decoding="async" class="card__portrait" data-astro-cid-pbperak2><p class="eyebrow card__eyebrow" data-astro-cid-pbperak2>${ui.eyebrow}</p><h1 class="card__name" data-astro-cid-pbperak2>${founder.name}</h1><p class="card__role" data-astro-cid-pbperak2>${founder.jobTitle}</p><p class="card__org" data-astro-cid-pbperak2>${name}</p><span aria-hidden="true" class="tds-brandbar tds-brandbar--sm card__bar" data-astro-cid-pbperak2></span><p class="card__bio" data-astro-cid-pbperak2>${ui.bio}</p><p class="card__place" data-astro-cid-pbperak2>${address.postalCode} ${address.addressLocality}</p></header><a class="card__save" href="/kontakt.vcf" data-astro-cid-pbperak2><svg class="card__save-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-pbperak2>${unescapeHTML(ICONS.save)}</svg><span data-astro-cid-pbperak2>${ui.save}<span class="card__save-meta" data-astro-cid-pbperak2>${ui.saveMeta}</span></span></a>${groups.map((group) => renderTemplate`<section class="card__group"${addAttribute(`card-group-${group.id}`, "aria-labelledby")} data-astro-cid-pbperak2><h2${addAttribute(`card-group-${group.id}`, "id")} class="eyebrow card__group-title" data-astro-cid-pbperak2>${groupHeadings[group.id]}</h2><ul class="card__list" data-astro-cid-pbperak2>${group.items.map((link) => renderTemplate`<li data-astro-cid-pbperak2><a class="card__row"${addAttribute(link.href, "href")} data-reveal${addAttribute(link.external ? "_blank" : void 0, "target")}${addAttribute(link.external ? "noopener noreferrer" : void 0, "rel")} data-astro-cid-pbperak2><svg class="card__row-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-pbperak2>${unescapeHTML(ICONS[link.id])}</svg><span class="card__row-text" data-astro-cid-pbperak2><span class="card__row-label" data-astro-cid-pbperak2>${link.label}${link.external && renderTemplate`<span class="sr-only" data-astro-cid-pbperak2> (${ui.newTab})</span>`}</span><span class="card__row-meta" data-astro-cid-pbperak2>${link.meta}</span></span><span class="card__row-mark" aria-hidden="true" data-astro-cid-pbperak2>${link.external ? "↗" : "→"}</span></a></li>`)}</ul></section>`)}<section class="card__qr" aria-labelledby="card-qr-title" data-reveal data-astro-cid-pbperak2><img class="card__qr-code"${addAttribute(BUSINESS_CARD_QR_PATH[lang], "src")}${addAttribute(ui.qrAlt, "alt")} width="120" height="120" decoding="async" data-astro-cid-pbperak2><div class="card__qr-body" data-astro-cid-pbperak2><h2 id="card-qr-title" class="card__qr-title" data-astro-cid-pbperak2>${ui.qrTitle}</h2><p class="card__qr-text" data-astro-cid-pbperak2>${ui.qrText}</p><button type="button" class="card__share" data-card-share${addAttribute(ui.shareDone, "data-label-done")} hidden data-astro-cid-pbperak2><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-pbperak2>${unescapeHTML(ICONS.share)}</svg><span data-card-share-label data-astro-cid-pbperak2>${ui.share}</span></button></div></section><aside class="card__pitch" data-reveal data-astro-cid-pbperak2><h2 class="card__pitch-title" data-astro-cid-pbperak2>${ui.pitchTitle}</h2><p class="card__pitch-text" data-astro-cid-pbperak2>${ui.pitchText}</p><a${addAttribute(webPresencePath, "href")} class="link-underline card__pitch-cta" data-astro-cid-pbperak2>${ui.pitchCta}<span aria-hidden="true" data-astro-cid-pbperak2> →</span></a></aside><footer class="card__legal" data-astro-cid-pbperak2><p class="card__legal-copy" data-astro-cid-pbperak2>${t.footer.copyright}</p><ul class="card__legal-links" data-astro-cid-pbperak2><li data-astro-cid-pbperak2><a href="/legal/impressum" data-astro-cid-pbperak2>${t.footer.impressum}</a></li><li data-astro-cid-pbperak2><a href="/legal/datenschutz" data-astro-cid-pbperak2>${t.footer.datenschutz}</a></li><li data-astro-cid-pbperak2><a${addAttribute(agbPath, "href")} data-astro-cid-pbperak2>${legalCopy[lang].agbShort}</a></li></ul></footer></div></main>` })}${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/BusinessCardPage.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/BusinessCardPage.astro", void 0);
//#endregion
export { $$BusinessCardPage as t };
