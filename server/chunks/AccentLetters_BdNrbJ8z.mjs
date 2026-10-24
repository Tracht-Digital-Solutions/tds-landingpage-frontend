import { A as renderTemplate, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent, z as unescapeHTML } from "./sequence_Dep2b-2O.mjs";
import { n as createComponent, t as createAstro } from "./compiler_C1nVjdt_.mjs";
import { c as propertyLinks, d as resolveLang, f as tFor, l as sectionLinks, m as renderScript, u as localizePath } from "./Layout_BK1z3wQd.mjs";
import { b as platformHref, m as cmsFor, q as siteConfig, y as platformDefinitions } from "./sitemapSections_DWSxrFhw.mjs";
import { n as hreflangGroup } from "./sitemap_D6YaABSL.mjs";
import { b as consentLinkMarkup, d as LOGO, g as logoSrcset, h as logoSrc, x as themeToggleMarkup } from "./jsonld_D4HRtxdX.mjs";
import { t as legalCopy } from "./legal_DLSYxpKW.mjs";
// src/lib/languageSwitch.ts
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
// src/components/LanguageSwitch.astro
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
// src/components/Header.astro
createAstro("https://tracht-digital.de");
var $$Header = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const lang = resolveLang(Astro.currentLocale);
	const items = sectionLinks(lang);
	const properties = propertyLinks(lang);
	const homeHref = localizePath("/", lang);
	const menuLabel = lang === "en" ? "Menu" : "Menü";
	const navLabel = lang === "en" ? "Main navigation" : "Hauptnavigation";
	const homeLabel = lang === "en" ? "Tracht Digital Solutions – home" : "Tracht Digital Solutions – Startseite";
	const sectionHref = (id) => `${homeHref}#${id}`;
	return renderTemplate`${maybeRenderHead($$result)}<header id="site-header" class="site-header fixed top-3 left-3 right-3 z-40" data-scrolled="false" data-astro-cid-nen7h5rs><nav${addAttribute(navLabel, "aria-label")} class="flex items-center justify-between gap-2 text-sm lg:gap-5" data-astro-cid-nen7h5rs><div class="site-island" data-astro-cid-nen7h5rs><a id="logo-link"${addAttribute(homeHref, "href")} class="flex items-center gap-2 px-2 lg:px-2.5 py-1 lg:py-1 text-[var(--color-primary)] hover:opacity-90 transition-opacity rounded-full [@media(pointer:coarse)]:min-h-11"${addAttribute(homeLabel, "aria-label")} data-astro-cid-nen7h5rs><img${addAttribute(logoSrc("mark", LOGO.mark.widths[1]), "src")}${addAttribute(logoSrcset("mark"), "srcset")} sizes="(min-width: 1024px) 72px, 48px" alt=""${addAttribute(LOGO.mark.width, "width")}${addAttribute(LOGO.mark.height, "height")} class="site-logo h-6 lg:h-7 w-auto" data-astro-cid-nen7h5rs><img${addAttribute(logoSrc("letters", LOGO.letters.widths[1]), "src")}${addAttribute(logoSrcset("letters"), "srcset")} sizes="(min-width: 1024px) 100px, 66px" alt=""${addAttribute(LOGO.letters.width, "width")}${addAttribute(LOGO.letters.height, "height")} class="site-logo h-6 lg:h-7 w-auto" data-astro-cid-nen7h5rs></a></div><div class="site-island flex items-center gap-1 lg:gap-3" data-astro-cid-nen7h5rs><div class="hidden lg:flex items-center gap-1 relative" data-nav-links data-astro-cid-nen7h5rs><span class="nav-pill" data-nav-pill aria-hidden="true" data-astro-cid-nen7h5rs></span>${items.map((item) => renderTemplate`<a${addAttribute(sectionHref(item.id), "href")}${addAttribute(item.id, "data-section")} class="relative inline-flex items-center px-3 py-1.5 text-[var(--lp-nav-ink)] hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] rounded-full transition-colors [@media(pointer:coarse)]:min-h-11" data-astro-cid-nen7h5rs>${item.label}</a>`)}</div>${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${unescapeHTML(themeToggleMarkup({
		labelToDark: lang === "en" ? "Switch to dark mode" : "Auf Dunkel umschalten",
		labelToLight: lang === "en" ? "Switch to light mode" : "Auf Hell umschalten"
	}))}` })}${renderComponent($$result, "LanguageSwitch", $$LanguageSwitch, { "data-astro-cid-nen7h5rs": true })}<button id="menu-toggle" type="button" class="btn btn-ghost tds-menu-toggle" aria-controls="mobile-menu" aria-expanded="false"${addAttribute(menuLabel, "aria-label")} data-astro-cid-nen7h5rs><span class="tds-menu-bar tds-menu-bar-top" aria-hidden="true" data-astro-cid-nen7h5rs></span><span class="tds-menu-bar tds-menu-bar-mid" aria-hidden="true" data-astro-cid-nen7h5rs></span><span class="tds-menu-bar tds-menu-bar-bot" aria-hidden="true" data-astro-cid-nen7h5rs></span></button></div></nav></header><div id="mobile-menu" class="tds-mobile-menu inset-x-3 top-[5.25rem]" style="--tds-mobile-menu-inset: 5.25rem" aria-hidden="true" data-astro-cid-nen7h5rs><nav${addAttribute(navLabel, "aria-label")} data-astro-cid-nen7h5rs><ul class="space-y-0.5" data-astro-cid-nen7h5rs>${items.map((item) => renderTemplate`<li data-astro-cid-nen7h5rs><a${addAttribute(sectionHref(item.id), "href")} data-menu-link class="tds-mobile-menu__link" data-astro-cid-nen7h5rs>${item.label}</a></li>`)}</ul><div class="h-4" aria-hidden="true" data-astro-cid-nen7h5rs></div><ul class="space-y-0.5" data-astro-cid-nen7h5rs>${properties.map((property) => renderTemplate`<li data-astro-cid-nen7h5rs><a${addAttribute(property.href, "href")}${addAttribute(property.id === "journal" ? "me noopener" : "noopener", "rel")} data-menu-link class="tds-mobile-menu__link justify-between" data-astro-cid-nen7h5rs><span data-astro-cid-nen7h5rs>${property.label}</span><span aria-hidden="true" class="text-sm text-[var(--color-muted)]" data-astro-cid-nen7h5rs>↗</span></a></li>`)}</ul></nav></div>${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Header.astro", void 0);
// src/lib/socials.ts
var ICONS = {
	linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
	github: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
	whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
};
/** wa.me wants E.164 digits without the leading "+". */
function whatsappHref(phone) {
	return `https://wa.me/${phone.replace(/\s/g, "").replace(/^\+/, "")}`;
}
function socialLinks(phone) {
	const links = [];
	if (siteConfig.socials.linkedin) links.push({
		id: "linkedin",
		label: "LinkedIn",
		href: siteConfig.socials.linkedin,
		brand: "#0A66C2",
		icon: ICONS.linkedin
	});
	if (siteConfig.socials.github) links.push({
		id: "github",
		label: "GitHub",
		href: siteConfig.socials.github,
		brand: "#181717",
		icon: ICONS.github
	});
	links.push({
		id: "whatsapp",
		label: "WhatsApp",
		href: whatsappHref(phone),
		brand: "#25D366",
		icon: ICONS.whatsapp
	});
	return links;
}
// src/components/ui/SocialLinks.astro
createAstro("https://tracht-digital.de");
var $$SocialLinks = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SocialLinks;
	const { links, class: className } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<ul${addAttribute(["social-links", className], "class:list")} data-astro-cid-iupex2mz>${links.map((link) => renderTemplate`<li data-astro-cid-iupex2mz><a${addAttribute(link.href, "href")}${addAttribute(link.label, "aria-label")} rel="noopener noreferrer" target="_blank" class="social-link"${addAttribute(`--social-brand: ${link.brand}`, "style")}${addAttribute(link.id, "data-social")} data-astro-cid-iupex2mz><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-astro-cid-iupex2mz><path${addAttribute(link.icon, "d")} data-astro-cid-iupex2mz></path></svg></a></li>`)}</ul>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/SocialLinks.astro", void 0);
// src/components/ui/PlaceMap.astro
createAstro("https://tracht-digital.de");
var $$PlaceMap = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PlaceMap;
	const { lang, class: className } = Astro.props;
	const label = lang === "de" ? "Karte: Schwarzenbek, östlich von Hamburg zwischen Bergedorf, Mölln und Lauenburg an der Elbe" : "Map: Schwarzenbek, east of Hamburg between Bergedorf, Mölln and Lauenburg on the Elbe";
	return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(["place-map", className], "class:list")} viewBox="0 0 320 240" role="img"${addAttribute(label, "aria-label")} data-astro-cid-kc3yt4gz><rect class="place-map__ground" x="0" y="0" width="320" height="240" rx="6" data-astro-cid-kc3yt4gz></rect><path class="place-map__river" d="M0 110.6 L7.1 113.5 L28.4 131.5 L39.1 158.4 L53.3 179.3 L81.8 197.2 L124.5 188.2 L160 186.5 L188.5 200.2 L219.4 216.3 L273.8 212.1 L320 236" data-astro-cid-kc3yt4gz></path><path class="place-map__canal" d="M219.4 214 L238.3 149.4 L263.1 65.7 L273.8 0" data-astro-cid-kc3yt4gz></path><path class="place-map__road" d="M0 101.6 L71.1 104.6 L135.1 104.6 L195.6 116.5 L266.7 119.5 L320 125.5" data-astro-cid-kc3yt4gz></path><g aria-hidden="true" data-astro-cid-kc3yt4gz><text class="place-map__note" x="96" y="211" data-astro-cid-kc3yt4gz>Elbe</text><text class="place-map__note" x="112" y="99" data-astro-cid-kc3yt4gz>A24</text>${[
		{
			name: "Hamburg",
			x: 15,
			y: 107,
			r: 3.5,
			dx: 7,
			dy: -10,
			anchor: "start"
		},
		{
			name: "Ahrensburg",
			x: 103,
			y: 33,
			r: 2,
			dx: 6,
			dy: 3,
			anchor: "start"
		},
		{
			name: "Bergedorf",
			x: 93,
			y: 145,
			r: 2,
			dx: 0,
			dy: 13,
			anchor: "middle"
		},
		{
			name: "Geesthacht",
			x: 150,
			y: 176,
			r: 2,
			dx: -5,
			dy: -4,
			anchor: "end"
		},
		{
			name: "Lauenburg",
			x: 219,
			y: 213,
			r: 2,
			dx: -6,
			dy: -4,
			anchor: "end"
		},
		{
			name: "Mölln",
			x: 263,
			y: 62,
			r: 2,
			dx: 7,
			dy: 3,
			anchor: "start"
		},
		{
			name: "Büchen",
			x: 237,
			y: 149,
			r: 2,
			dx: 7,
			dy: 3,
			anchor: "start"
		}
	].map((town) => renderTemplate`<g data-astro-cid-kc3yt4gz><circle class="place-map__town"${addAttribute(town.x, "cx")}${addAttribute(town.y, "cy")}${addAttribute(town.r, "r")} data-astro-cid-kc3yt4gz></circle><text class="place-map__label"${addAttribute(town.x + town.dx, "x")}${addAttribute(town.y + town.dy, "y")}${addAttribute(town.anchor, "text-anchor")} data-astro-cid-kc3yt4gz>${town.name}</text></g>`)}<circle class="place-map__halo" cx="188" cy="135" r="98" data-astro-cid-kc3yt4gz></circle><path class="place-map__area" d="M180 126 L190 123.5 L198.5 128.5 L199.5 139 L192.5 146 L182 145.5 L176.5 137.5 Z" data-astro-cid-kc3yt4gz></path><circle class="place-map__pin" cx="188" cy="135" r="3.5" data-astro-cid-kc3yt4gz></circle><text class="place-map__label place-map__label--home" x="188" y="174" text-anchor="middle" data-astro-cid-kc3yt4gz>Schwarzenbek</text></g></svg>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/PlaceMap.astro", void 0);
// src/components/ui/PlaceBubble.astro
createAstro("https://tracht-digital.de");
var $$PlaceBubble = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PlaceBubble;
	const { lang, id, anchor = "start", inline = false, class: className } = Astro.props;
	const inlineLabel = lang === "de" ? "Karte: Schwarzenbek und Umgebung. Berühren oder fokussieren lädt die interaktive Karte." : "Map: Schwarzenbek and surroundings. Touch or focus it to load the interactive map.";
	const placeCaption = lang === "de" ? "Schwarzenbek bei Hamburg · Kreis Herzogtum Lauenburg" : "Schwarzenbek near Hamburg · District of Herzogtum Lauenburg";
	return renderTemplate`${inline ? renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(`place place--inline${className ? ` ${className}` : ""}`, "class")} data-place data-place-inline${addAttribute(id, "id")} tabindex="0" role="group"${addAttribute(inlineLabel, "aria-label")} data-astro-cid-q2hagz3p><span class="place__map" data-astro-cid-q2hagz3p>${renderComponent($$result, "PlaceMap", $$PlaceMap, {
		"lang": lang,
		"data-astro-cid-q2hagz3p": true
	})}<span class="place__live" data-place-live data-astro-cid-q2hagz3p></span></span></span>` : renderTemplate`<span${addAttribute(`place place--${anchor}${className ? ` ${className}` : ""}`, "class")} data-place data-astro-cid-q2hagz3p><button type="button" class="place__trigger footer-link" aria-expanded="false"${addAttribute(id, "aria-controls")} data-astro-cid-q2hagz3p>${siteConfig.address.postalCode} ${siteConfig.address.addressLocality}</button><span class="place__bubble"${addAttribute(id, "id")} data-astro-cid-q2hagz3p><span class="place__card" data-astro-cid-q2hagz3p><span class="place__map" data-astro-cid-q2hagz3p>${renderComponent($$result, "PlaceMap", $$PlaceMap, {
		"lang": lang,
		"data-astro-cid-q2hagz3p": true
	})}<span class="place__live" data-place-live data-astro-cid-q2hagz3p></span></span><span class="place__caption" data-astro-cid-q2hagz3p>${placeCaption}</span></span></span></span>`}${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/PlaceBubble.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/PlaceBubble.astro", void 0);
// src/components/Footer.astro
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
	return renderTemplate`${maybeRenderHead($$result)}<footer class="site-footer tds-tone-ink pt-16" data-astro-cid-jo6i4kqk><div class="lp-container" data-astro-cid-jo6i4kqk><div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12" data-astro-cid-jo6i4kqk><div data-astro-cid-jo6i4kqk><p class="brand-wordmark text-2xl mb-3" data-astro-cid-jo6i4kqk>Tracht <span class="italic text-[var(--color-accent-pink)]" data-astro-cid-jo6i4kqk>Digital</span> Solutions</p><span aria-hidden="true" class="tds-brandbar tds-brandbar--sm tds-brandbar--on-dark mb-4" data-astro-cid-jo6i4kqk></span><p class="font-[var(--font-display)] italic text-[var(--color-accent-pink)] text-base mb-4" data-astro-cid-jo6i4kqk>${footer.slogan}</p></div><nav aria-labelledby="footer-nav-title" data-astro-cid-jo6i4kqk><p id="footer-nav-title" class="eyebrow text-white/60 mb-4" data-astro-cid-jo6i4kqk>${footer.nav}</p><ul class="space-y-2 text-sm" data-astro-cid-jo6i4kqk>${navItems.map((item) => renderTemplate`<li data-astro-cid-jo6i4kqk><a${addAttribute(item.href, "href")} class="footer-link text-white/80 hover:text-white" data-astro-cid-jo6i4kqk>${item.label}</a></li>`)}<li data-astro-cid-jo6i4kqk><a${addAttribute(siteConfig.blogUrl, "href")} class="footer-link text-white/80 hover:text-white" data-astro-cid-jo6i4kqk>${t.nav.blog}</a></li><li data-astro-cid-jo6i4kqk><a${addAttribute(`${siteConfig.freelanceUrl}${lang === "en" ? "/en/" : "/"}`, "href")} class="footer-link text-white/80 hover:text-white" data-astro-cid-jo6i4kqk>${lang === "de" ? "Freelancer-Portfolio" : "Freelance portfolio"}</a></li></ul></nav><nav aria-labelledby="footer-systems-title" data-astro-cid-jo6i4kqk><p id="footer-systems-title" class="eyebrow text-white/60 mb-4" data-astro-cid-jo6i4kqk>${systemsTitle}</p><ul class="space-y-2 text-sm" data-astro-cid-jo6i4kqk>${platformDefinitions.map((platform) => renderTemplate`<li data-astro-cid-jo6i4kqk><a${addAttribute(platformHref(platform, lang), "href")} class="footer-link text-white/80 hover:text-white" data-astro-cid-jo6i4kqk>${platform.name}</a></li>`)}</ul></nav><div data-astro-cid-jo6i4kqk><p class="eyebrow text-white/60 mb-4" data-astro-cid-jo6i4kqk>${footer.contactTitle}</p><ul class="footer-contact text-sm" data-astro-cid-jo6i4kqk><li class="footer-contact__row" data-astro-cid-jo6i4kqk><span class="footer-contact__icon" aria-hidden="true" data-astro-cid-jo6i4kqk><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-jo6i4kqk><rect x="2" y="4" width="20" height="16" rx="2" data-astro-cid-jo6i4kqk></rect><path d="m2 7 10 6 10-6" data-astro-cid-jo6i4kqk></path></svg></span><span class="footer-contact__text" data-astro-cid-jo6i4kqk><a${addAttribute(`mailto:${contact.email}`, "href")} class="footer-link text-white/85 hover:text-white" data-astro-cid-jo6i4kqk>${contact.email}</a></span></li><li class="footer-contact__row" data-astro-cid-jo6i4kqk><span class="footer-contact__icon" aria-hidden="true" data-astro-cid-jo6i4kqk><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-jo6i4kqk><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" data-astro-cid-jo6i4kqk></path></svg></span><span class="footer-contact__text" data-astro-cid-jo6i4kqk><a${addAttribute(telHref, "href")} class="footer-link text-white/85 hover:text-white" data-astro-cid-jo6i4kqk>${contact.phone}</a></span></li><li class="footer-contact__row" data-astro-cid-jo6i4kqk><span class="footer-contact__icon" aria-hidden="true" data-astro-cid-jo6i4kqk><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-jo6i4kqk><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" data-astro-cid-jo6i4kqk></path><circle cx="12" cy="10" r="3" data-astro-cid-jo6i4kqk></circle></svg></span><span class="footer-contact__text" data-astro-cid-jo6i4kqk>${renderComponent($$result, "PlaceBubble", $$PlaceBubble, {
		"lang": lang,
		"id": "footer-place-bubble",
		"anchor": "end",
		"data-astro-cid-jo6i4kqk": true
	})}</span></li></ul></div></div><div class="footer-bottom pt-12 text-xs text-white/70" data-astro-cid-jo6i4kqk><p class="footer-bottom__copy" data-astro-cid-jo6i4kqk>${footer.copyright}</p>${renderComponent($$result, "SocialLinks", $$SocialLinks, {
		"links": socialLinks(contact.phone),
		"class": "footer-bottom__social",
		"data-astro-cid-jo6i4kqk": true
	})}<div class="footer-bottom__legal flex flex-wrap gap-x-6 gap-y-1" data-astro-cid-jo6i4kqk><a href="/legal/impressum" class="footer-link hover:text-white" data-astro-cid-jo6i4kqk>${footer.impressum}</a><a href="/legal/datenschutz" class="footer-link hover:text-white" data-astro-cid-jo6i4kqk>${footer.datenschutz}</a><a${addAttribute(agbHref, "href")} class="footer-link hover:text-white" data-astro-cid-jo6i4kqk>${legalCopy[lang].agbShort}</a>${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result) => renderTemplate`${unescapeHTML(consentLinkMarkup({
		lang,
		className: "footer-link hover:text-white"
	}))}` })}</div></div></div></footer>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Footer.astro", void 0);
// src/components/ui/AccentLetters.astro
createAstro("https://tracht-digital.de");
var $$AccentLetters = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AccentLetters;
	const { text, tone = "light", class: className = "" } = Astro.props;
	const chars = Array.from(text);
	return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(["accent-letters", className], "class:list")}${addAttribute(tone, "data-tone")}><span class="sr-only">${text}</span><span class="accent-letters__glyphs" aria-hidden="true">${chars.map((char) => renderTemplate`<span class="accent-letter">${char === " " ? "\xA0" : char}</span>`)}</span></span>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/AccentLetters.astro", void 0);
export { socialLinks as a, $$SocialLinks as i, $$Footer as n, whatsappHref as o, $$PlaceBubble as r, $$Header as s, $$AccentLetters as t };
