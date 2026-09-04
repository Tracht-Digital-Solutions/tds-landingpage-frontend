import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { c as tFor, o as localizePath, r as ThemeToggle, s as resolveLang, u as renderScript } from "./Layout_BtTxcu-r.mjs";
import { l as siteConfig, u as cmsFor } from "./services_rIITeUoa.mjs";
import { t as legalCopy } from "./legal_UNLgtV-b.mjs";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/islands/LanguageToggle.tsx
var STORAGE_KEY = "tdsLang";
function FlagDE({ className = "" }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 5 3",
		className,
		"aria-hidden": "true",
		preserveAspectRatio: "xMidYMid slice",
		children: [
			/* @__PURE__ */ jsx("rect", {
				width: "5",
				height: "1",
				y: "0",
				fill: "#000000"
			}),
			/* @__PURE__ */ jsx("rect", {
				width: "5",
				height: "1",
				y: "1",
				fill: "#DD0000"
			}),
			/* @__PURE__ */ jsx("rect", {
				width: "5",
				height: "1",
				y: "2",
				fill: "#FFCE00"
			})
		]
	});
}
function FlagGB({ className = "" }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 60 30",
		className,
		"aria-hidden": "true",
		preserveAspectRatio: "xMidYMid slice",
		children: [
			/* @__PURE__ */ jsx("clipPath", {
				id: "tds-flag-gb-clip",
				children: /* @__PURE__ */ jsx("path", { d: "M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" })
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M0,0 v30 h60 v-30 z",
				fill: "#012169"
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M0,0 L60,30 M60,0 L0,30",
				stroke: "#ffffff",
				strokeWidth: "6"
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M0,0 L60,30 M60,0 L0,30",
				clipPath: "url(#tds-flag-gb-clip)",
				stroke: "#C8102E",
				strokeWidth: "4"
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M30,0 v30 M0,15 h60",
				stroke: "#ffffff",
				strokeWidth: "10"
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M30,0 v30 M0,15 h60",
				stroke: "#C8102E",
				strokeWidth: "6"
			})
		]
	});
}
var options = [{
	code: "de",
	Flag: FlagDE,
	label: "Deutsch"
}, {
	code: "en",
	Flag: FlagGB,
	label: "English"
}];
function swapLocaleInPath(pathname, target) {
	const trimmed = pathname.replace(/\/+$/, "") || "/";
	const inEn = trimmed === "/en" || trimmed.startsWith("/en/");
	if (target === "en") {
		if (inEn) return pathname;
		return trimmed === "/" ? "/en/" : `/en${trimmed}`;
	}
	if (!inEn) return pathname;
	return trimmed.replace(/^\/en/, "") || "/";
}
/**
* Compact language dropdown. Trigger shows the active flag; the
* menu offers both locales with flag + full label. Selecting an
* option persists the choice in localStorage and navigates to the
* sibling URL in the other locale tree.
*
* Active locale is fed in by the server-rendered Header so the
* trigger paints correctly on first frame without a hydration flash.
*/
function LanguageToggle({ lang }) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef(null);
	useEffect(() => {
		if (!open) return;
		const onClickOutside = (e) => {
			if (!rootRef.current?.contains(e.target)) setOpen(false);
		};
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onClickOutside);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onClickOutside);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);
	const choose = (next) => {
		setOpen(false);
		if (next === lang) return;
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {}
		if (typeof window !== "undefined") {
			const alternate = document.querySelector(`link[rel="alternate"][hreflang="${next}"]`);
			const target = alternate ? new URL(alternate.href, window.location.origin).pathname : swapLocaleInPath(window.location.pathname, next);
			window.location.assign(target + window.location.hash);
		}
	};
	const CurrentFlag = (options.find((o) => o.code === lang) ?? options[0]).Flag;
	return /* @__PURE__ */ jsxs("div", {
		ref: rootRef,
		className: "relative",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			"aria-haspopup": "listbox",
			"aria-expanded": open,
			"aria-label": lang === "de" ? "Sprache wählen" : "Select language",
			onClick: () => setOpen((v) => !v),
			className: "flex items-center gap-1.5 px-2 py-1.5 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer",
			children: [/* @__PURE__ */ jsx("span", {
				className: "block w-5 h-3.5 overflow-hidden rounded-[2px]",
				children: /* @__PURE__ */ jsx(CurrentFlag, { className: "block w-full h-full" })
			}), /* @__PURE__ */ jsx("svg", {
				"aria-hidden": "true",
				width: "10",
				height: "10",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				className: `transition-transform duration-200 ${open ? "rotate-180" : ""}`,
				children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
			})]
		}), open && /* @__PURE__ */ jsx("ul", {
			role: "listbox",
			"aria-label": lang === "de" ? "Sprachen" : "Languages",
			className: "absolute right-0 top-full mt-4 min-w-[160px] overflow-hidden rounded-xl bg-[var(--color-card)] shadow-[0_12px_32px_-12px_rgba(5,15,104,0.28)] z-50",
			children: options.map((opt) => {
				const active = opt.code === lang;
				const OptionFlag = opt.Flag;
				return /* @__PURE__ */ jsx("li", {
					role: "option",
					"aria-selected": active,
					children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => choose(opt.code),
						className: `w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors cursor-pointer ${active ? "text-[var(--color-primary)] font-medium bg-black/5" : "text-[var(--color-black)] hover:bg-black/5"}`,
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "block w-6 h-4 overflow-hidden rounded-[2px] shrink-0",
								children: /* @__PURE__ */ jsx(OptionFlag, { className: "block w-full h-full" })
							}),
							/* @__PURE__ */ jsx("span", {
								className: "flex-1",
								children: opt.label
							}),
							active && /* @__PURE__ */ jsx("svg", {
								"aria-hidden": "true",
								width: "14",
								height: "14",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "text-[var(--color-accent)]",
								children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" })
							})
						]
					})
				}, opt.code);
			})
		})]
	});
}
//#endregion
//#region src/components/Header.astro
createAstro("https://tracht-digital.de");
var $$Header = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const lang = resolveLang(Astro.currentLocale);
	const t = tFor(Astro.currentLocale);
	const items = [
		{
			id: "about",
			label: lang === "de" ? "Wieso ich?" : "Why me?"
		},
		{
			id: "services",
			label: lang === "de" ? "Leistungen" : "Services"
		},
		{
			id: "process",
			label: lang === "de" ? "Vorgehen" : "Process"
		}
	];
	const homeHref = localizePath("/", lang);
	const pricingHref = localizePath("/preise", lang);
	const menuLabel = lang === "en" ? "Menu" : "Menü";
	const sectionHref = (id) => `${homeHref}#${id}`;
	return renderTemplate`${maybeRenderHead($$result)}<header id="site-header" class="site-header fixed top-3 left-3 right-3 z-40 px-3 py-2.5 lg:px-5" data-scrolled="false" data-astro-cid-nen7h5rs><nav class="flex items-center justify-between gap-2 text-sm lg:gap-5" data-astro-cid-nen7h5rs><a id="logo-link"${addAttribute(homeHref, "href")} class="flex items-center gap-2 px-2 lg:px-2.5 py-1 lg:py-1 text-[var(--color-primary)] hover:opacity-90 transition-opacity" aria-label="Tracht Digital Solutions" data-astro-cid-nen7h5rs><img src="/images/logo.webp" alt="" width="40" height="28" class="site-logo h-6 lg:h-7 w-auto" data-astro-cid-nen7h5rs><img src="/images/logo-letters.png" alt="" width="1289" height="639" class="site-logo h-6 lg:h-7 w-auto" data-astro-cid-nen7h5rs></a><div class="flex items-center gap-1 lg:gap-3" data-astro-cid-nen7h5rs><div class="hidden lg:flex items-center gap-1" data-astro-cid-nen7h5rs>${items.map((item) => renderTemplate`<a${addAttribute(sectionHref(item.id), "href")} class="px-3 py-1.5 text-[var(--color-muted)] hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] rounded-full transition-colors" data-astro-cid-nen7h5rs>${item.label}</a>`)}<a${addAttribute(pricingHref, "href")} class="px-3 py-1.5 text-[var(--color-muted)] hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] rounded-full transition-colors" data-astro-cid-nen7h5rs>${t.nav.pricing}</a><a${addAttribute(siteConfig.blogUrl, "href")} rel="me noopener" class="inline-flex items-center gap-1 px-3 py-1.5 text-[var(--color-muted)] hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] rounded-full transition-colors" data-astro-cid-nen7h5rs>${t.nav.blog}<span aria-hidden="true" class="text-[10px] leading-none" data-astro-cid-nen7h5rs>↗</span></a></div>${renderComponent($$result, "ThemeToggle", ThemeToggle, {
		"client:load": true,
		"labelToDark": lang === "en" ? "Switch to dark mode" : "Auf Dunkel umschalten",
		"labelToLight": lang === "en" ? "Switch to light mode" : "Auf Hell umschalten",
		"data-astro-cid-nen7h5rs": true,
		"client:component-hydration": "load",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "ThemeToggle"
	})}${renderComponent($$result, "LanguageToggle", LanguageToggle, {
		"client:load": true,
		"lang": lang,
		"data-astro-cid-nen7h5rs": true,
		"client:component-hydration": "load",
		"client:component-path": "~/components/islands/LanguageToggle.tsx",
		"client:component-export": "default"
	})}<button id="menu-toggle" type="button" class="btn btn-ghost tds-menu-toggle" aria-controls="mobile-menu" aria-expanded="false"${addAttribute(menuLabel, "aria-label")} data-astro-cid-nen7h5rs><span class="tds-menu-bar tds-menu-bar-top" aria-hidden="true" data-astro-cid-nen7h5rs></span><span class="tds-menu-bar tds-menu-bar-mid" aria-hidden="true" data-astro-cid-nen7h5rs></span><span class="tds-menu-bar tds-menu-bar-bot" aria-hidden="true" data-astro-cid-nen7h5rs></span></button></div></nav></header><div id="mobile-menu" class="tds-mobile-menu inset-x-3 top-[5.25rem]" style="--tds-mobile-menu-inset: 5.25rem" aria-hidden="true" data-astro-cid-nen7h5rs><ul class="space-y-0.5" data-astro-cid-nen7h5rs>${items.map((item) => renderTemplate`<li data-astro-cid-nen7h5rs><a${addAttribute(sectionHref(item.id), "href")} data-menu-link class="tds-mobile-menu__link" data-astro-cid-nen7h5rs>${item.label}</a></li>`)}</ul><div class="h-4" aria-hidden="true" data-astro-cid-nen7h5rs></div><ul class="space-y-0.5" data-astro-cid-nen7h5rs><li data-astro-cid-nen7h5rs><a${addAttribute(pricingHref, "href")} data-menu-link class="tds-mobile-menu__link" data-astro-cid-nen7h5rs>${t.nav.pricing}</a></li><li data-astro-cid-nen7h5rs><a${addAttribute(siteConfig.blogUrl, "href")} rel="me noopener" data-menu-link class="tds-mobile-menu__link justify-between" data-astro-cid-nen7h5rs><span data-astro-cid-nen7h5rs>${t.nav.blog}</span><span aria-hidden="true" class="text-sm text-[var(--color-muted)]" data-astro-cid-nen7h5rs>↗</span></a></li></ul></div>${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
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
	const pricingHref = localizePath("/preise", lang);
	const agbHref = localizePath("/legal/agb", lang);
	const homeHref = localizePath("/", lang);
	const telHref = `tel:${contact.phone.replace(/\s+/g, "")}`;
	return renderTemplate`${maybeRenderHead($$result)}<footer class="tds-tone-ink pt-16 pb-10"><div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12"><div class="grid md:grid-cols-3 gap-12 mb-12"><div><p class="brand-wordmark text-2xl mb-3">Tracht <span class="italic text-[var(--color-accent-pink)]">Digital</span> Solutions</p><span aria-hidden="true" class="tds-brandbar tds-brandbar--sm tds-brandbar--on-dark mb-4"></span><p class="font-[var(--font-display)] italic text-[var(--color-accent-pink)] text-base mb-4">${footer.slogan}</p><p class="text-white/60 text-sm leading-relaxed max-w-xs">${footer.tagline}</p></div><div><p class="eyebrow text-white/50 mb-4">${footer.nav}</p><ul class="space-y-2 text-sm"><li><a${addAttribute(`${homeHref}#about`, "href")} class="text-white/70 hover:text-white">${lang === "de" ? "Wieso ich?" : "Why me?"}</a></li><li><a${addAttribute(`${homeHref}#services`, "href")} class="text-white/70 hover:text-white">${lang === "de" ? "Was ich anbiete?" : "What I offer?"}</a></li><li><a${addAttribute(pricingHref, "href")} class="text-white/70 hover:text-white">${footer.pricing}</a></li><li><a href="https://blog.tracht-digital.de" class="text-white/70 hover:text-white">${t.nav.blog}</a></li></ul></div><div><p class="eyebrow text-white/50 mb-4">${footer.contactTitle}</p><ul class="space-y-2 text-sm"><li><a${addAttribute(`mailto:${contact.email}`, "href")} class="text-white/70 hover:text-white">${contact.email}</a></li><li><a${addAttribute(telHref, "href")} class="text-white/70 hover:text-white">${contact.phone}</a></li><li class="text-white/50">${siteConfig.address.postalCode} ${siteConfig.address.addressLocality}</li></ul></div></div><div class="pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/40"><p>${footer.copyright}</p><div class="flex flex-wrap gap-6"><a href="/legal/impressum" class="hover:text-white">${footer.impressum}</a><a href="/legal/datenschutz" class="hover:text-white">${footer.datenschutz}</a><a${addAttribute(agbHref, "href")} class="hover:text-white">${legalCopy[lang].agbShort}</a></div></div></div></footer>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Footer.astro", void 0);
//#endregion
//#region src/lib/jsonld.ts
/**
* Schema.org JSON-LD generators.
*
* Each function returns a plain object (or array of objects) ready to
* be JSON.stringify'd inside a <script type="application/ld+json">.
* Components only need to pick which schemas a page emits — the data
* is centralised in `~/lib/seo`.
*
* Why this exists separately from the SEO config: schema shape often
* shifts slightly per consumer (Google rich-result requirements vs.
* what AI search engines parse), so keeping the renderers next to the
* data lets us iterate the shape without touching the source of truth.
*/
/**
* Person schema for the founder. Reused as `author` (Article),
* `founder` (Organization), and standalone on the about page.
*/
function personSchema() {
	return {
		"@type": "Person",
		"@id": `${siteConfig.url}/#person`,
		name: siteConfig.founder.name,
		jobTitle: siteConfig.founder.jobTitle,
		worksFor: { "@id": `${siteConfig.url}/#organization` },
		url: siteConfig.url,
		email: `mailto:${siteConfig.email}`,
		sameAs: Object.values(siteConfig.socials).filter(Boolean)
	};
}
/**
* Organization (+ ProfessionalService traits). Search engines treat
* ProfessionalService as a LocalBusiness subtype, which is what we
* actually are — now emitted with the verified street, postal code and
* phone (they match the Impressum).
*/
function organizationSchema() {
	const socials = Object.values(siteConfig.socials).filter(Boolean);
	const base = {
		"@type": ["Organization", "ProfessionalService"],
		"@id": `${siteConfig.url}/#organization`,
		name: siteConfig.name,
		alternateName: siteConfig.shortName,
		legalName: siteConfig.legalName,
		vatID: siteConfig.vatID,
		url: siteConfig.url,
		email: `mailto:${siteConfig.email}`,
		telephone: siteConfig.telephone,
		founder: { "@id": `${siteConfig.url}/#person` },
		areaServed: siteConfig.areaServed.map((a) => ({
			"@type": "Place",
			name: a
		})),
		address: {
			"@type": "PostalAddress",
			streetAddress: siteConfig.address.streetAddress,
			postalCode: siteConfig.address.postalCode,
			addressLocality: siteConfig.address.addressLocality,
			addressRegion: siteConfig.address.addressRegion,
			addressCountry: siteConfig.address.addressCountry
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: siteConfig.geo.latitude,
			longitude: siteConfig.geo.longitude
		},
		knowsAbout: [...siteConfig.knowsAbout]
	};
	if (socials.length > 0) base.sameAs = socials;
	return base;
}
/**
* WebSite schema with a SearchAction so AI agents that look for a
* site search target know one exists (currently the blog, since the
* marketing site has no first-class search).
*/
function websiteSchema() {
	return {
		"@type": "WebSite",
		"@id": `${siteConfig.url}/#website`,
		url: siteConfig.url,
		name: siteConfig.name,
		description: siteConfig.description.de,
		publisher: { "@id": `${siteConfig.url}/#organization` },
		inLanguage: ["de-DE", "en-GB"]
	};
}
/**
* BreadcrumbList — emit on every subpage so AI engines can place
* the page in the site hierarchy without guessing from URL structure.
*/
function breadcrumbSchema(items) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: item.url
		}))
	};
}
/**
* Service + OfferCatalog for the pricing page. Each rate becomes a
* PriceSpecification (UnitPriceSpecification, hourly) inside an
* OfferCatalog — that's how Schema.org expresses tiered hourly rates.
*/
function pricingSchema(items) {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: `${siteConfig.name} — Stundensätze`,
		provider: { "@id": `${siteConfig.url}/#organization` },
		serviceType: "Software development & digital consulting",
		areaServed: siteConfig.areaServed.map((a) => ({
			"@type": "Place",
			name: a
		})),
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Stundensätze",
			itemListElement: items.map((item) => ({
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: item.name,
					description: item.description
				},
				priceSpecification: {
					"@type": "UnitPriceSpecification",
					price: item.rate,
					priceCurrency: "EUR",
					unitCode: "HUR",
					referenceQuantity: {
						"@type": "QuantitativeValue",
						value: 1,
						unitCode: "HUR"
					},
					valueAddedTaxIncluded: false
				}
			}))
		}
	};
}
/**
* FAQPage schema — Google's eligibility-checked rich snippet. Each
* item becomes a Question with an AnswerType. Renders inline in the
* page where the visible <details>/<summary> accordions live; the
* answer text must match the visible answer 1:1 or Google strips the
* rich result.
*/
function faqPageSchema(items) {
	return {
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.a
			}
		}))
	};
}
/**
* HowTo schema — describes the four-step Process section as a
* structured workflow. Each step becomes a HowToStep with a
* `position` (parsed from the visible "01" / "02" number) and the
* duration in ISO-8601 where possible. Helps both Google's "how to"
* rich snippet and AI agents that try to understand the service
* delivery flow.
*/
function howToSchema(name, steps) {
	return {
		"@type": "HowTo",
		name,
		step: steps.map((step) => ({
			"@type": "HowToStep",
			position: Number(step.number) || void 0,
			name: step.title,
			text: step.description,
			...step.duration ? { performTime: step.duration } : {}
		}))
	};
}
/**
* Speakable schema — points voice assistants / AI summarisers at the
* key text on the page so they read the right thing aloud instead of
* guessing from the DOM. Apply CSS selectors at the wrapper that
* covers the hero headline + sub paragraph.
*/
function speakableSchema(cssSelectors) {
	return {
		"@type": "SpeakableSpecification",
		cssSelector: cssSelectors
	};
}
/**
* Combine multiple schemas into a single @graph node — the canonical
* way to emit several typed entities in one <script> block without
* duplicating the @context.
*/
function asGraph(...nodes) {
	return {
		"@context": "https://schema.org",
		"@graph": nodes
	};
}
//#endregion
export { organizationSchema as a, speakableSchema as c, $$Header as d, howToSchema as i, websiteSchema as l, breadcrumbSchema as n, personSchema as o, faqPageSchema as r, pricingSchema as s, asGraph as t, $$Footer as u };
