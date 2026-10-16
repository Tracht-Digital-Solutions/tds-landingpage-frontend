import { a as writePrefsCookie, i as THEME_STORAGE_KEY, n as THEME_ATTRIBUTE, r as THEME_CHANGE_EVENT } from "./Layout_DoHvQqOs.mjs";
import { q as siteConfig } from "./sitemapSections_B-ha0waI.mjs";
import { n as getDefaultPackages } from "./pricing_AbX1ysXL.mjs";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { flushSync } from "react-dom";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-5Z77KNKZ.js
var DARK_QUERY = "(prefers-color-scheme: dark)";
var hasDocument = () => typeof document !== "undefined";
function systemTheme() {
	try {
		return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function resolveTheme(preference) {
	return preference === "system" ? systemTheme() : preference;
}
function applyThemePreference(preference, options = {}) {
	const theme = resolveTheme(preference);
	try {
		if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
		else localStorage.setItem(THEME_STORAGE_KEY, preference);
	} catch {}
	writePrefsCookie({ theme: preference }, { announce: options.announce });
	if (hasDocument()) document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
	if (options.announce !== false && typeof window !== "undefined") try {
		const detail = {
			preference,
			theme
		};
		window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail }));
	} catch {}
	return theme;
}
function onThemeChange(handler) {
	if (typeof window === "undefined") return () => {};
	const listener = (event) => {
		const detail = event.detail;
		if (detail) handler(detail);
	};
	window.addEventListener(THEME_CHANGE_EVENT, listener);
	return () => window.removeEventListener(THEME_CHANGE_EVENT, listener);
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-VTJDWZ6A.js
var ease = [
	.2,
	.8,
	.2,
	1
];
var cssEase = {
	out: `cubic-bezier(${ease.join(", ")})`,
	inOut: `cubic-bezier(${[
		.4,
		0,
		.2,
		1
	].join(", ")})`
};
var durations = {
	fast: 160,
	base: 200,
	slow: 320
};
var transitions = {
	fast: {
		duration: durations.fast / 1e3,
		ease
	},
	base: {
		duration: durations.base / 1e3,
		ease
	},
	slow: {
		duration: durations.slow / 1e3,
		ease
	}
};
durations.slow / 1e3;
var presence = {
	enter: {
		opacity: 0,
		y: 4
	},
	shown: {
		opacity: 1,
		y: 0,
		transition: transitions.base
	},
	exit: {
		opacity: 0,
		y: -4,
		transition: transitions.fast
	}
};
transitions.base, transitions.fast;
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-NZHTFWXQ.js
function syncCloneState(original, copy, animated, scrolled) {
	if (original.scrollLeft || original.scrollTop) scrolled.push([
		copy,
		original.scrollLeft,
		original.scrollTop
	]);
	if (animated.has(original) && (copy instanceof HTMLElement || copy instanceof SVGElement)) {
		const cs = getComputedStyle(original);
		const style = copy.style;
		style.setProperty("transform", cs.transform);
		style.setProperty("translate", cs.translate);
		style.setProperty("rotate", cs.rotate);
		style.setProperty("scale", cs.scale);
		style.setProperty("opacity", cs.opacity);
	}
	const a = original.children;
	const b = copy.children;
	for (let i = 0; i < a.length && i < b.length; i++) syncCloneState(a[i], b[i], animated, scrolled);
}
function ThemeToggle({ labelToDark = "Auf Dunkel umschalten", labelToLight = "Auf Hell umschalten" } = {}) {
	const [theme, setTheme] = useState("light");
	const [mounted, setMounted] = useState(false);
	const [flipped, setFlipped] = useState(false);
	const buttonRef = useRef(null);
	useEffect(() => {
		const current = document.documentElement.getAttribute(THEME_ATTRIBUTE);
		setTheme(current === "dark" ? "dark" : "light");
		setMounted(true);
		return onThemeChange((detail) => setTheme(detail.theme));
	}, []);
	const previewRef = useRef(null);
	const frameRef = useRef(0);
	const removeTimerRef = useRef(0);
	const pointRef = useRef({
		x: 0,
		y: 0
	});
	const buildClone = (target) => {
		const page = document.createElement("div");
		page.className = "tds-theme-preview__page";
		page.setAttribute("data-theme", target);
		const animated = /* @__PURE__ */ new Set();
		const scrolled = [];
		for (const animation of document.getAnimations?.() ?? []) {
			const target2 = animation.effect?.target;
			if (target2) animated.add(target2);
		}
		for (const node of Array.from(document.body.children)) {
			if (node instanceof HTMLElement && node.classList.contains("tds-theme-preview")) continue;
			if (node.tagName === "SCRIPT" || node.tagName === "LINK") continue;
			if (node instanceof HTMLElement && node.dataset.themePreview === "skip") continue;
			const copy = node.cloneNode(true);
			syncCloneState(node, copy, animated, scrolled);
			page.appendChild(copy);
		}
		for (const stray of page.querySelectorAll("script, link, [name], [data-theme-preview=\"skip\"]")) {
			if (stray.tagName === "SCRIPT" || stray.tagName === "LINK" || stray.dataset?.themePreview === "skip") {
				stray.remove();
				continue;
			}
			stray.removeAttribute("name");
		}
		page.inert = true;
		const restoreScroll = () => {
			for (const [copy, left, top] of scrolled) copy.scrollTo?.({
				left,
				top,
				behavior: "instant"
			});
		};
		return {
			page,
			restoreScroll
		};
	};
	const alignClone = () => {
		const page = previewRef.current?.firstElementChild;
		if (page) page.style.top = `${-window.scrollY}px`;
	};
	const paintPreview = () => {
		frameRef.current = 0;
		const el = previewRef.current;
		if (!el) return;
		el.style.setProperty("--tds-theme-preview-x", `${pointRef.current.x}px`);
		el.style.setProperty("--tds-theme-preview-y", `${pointRef.current.y}px`);
	};
	const trackPointer = (event) => {
		pointRef.current = {
			x: event.clientX,
			y: event.clientY
		};
		if (!previewRef.current || frameRef.current) return;
		frameRef.current = requestAnimationFrame(paintPreview);
	};
	const discardPreview = () => {
		if (removeTimerRef.current) {
			clearTimeout(removeTimerRef.current);
			removeTimerRef.current = 0;
		}
		if (frameRef.current) {
			cancelAnimationFrame(frameRef.current);
			frameRef.current = 0;
		}
		previewRef.current?.remove();
		previewRef.current = null;
	};
	const closePreview = () => {
		if (frameRef.current) {
			cancelAnimationFrame(frameRef.current);
			frameRef.current = 0;
		}
		const el = previewRef.current;
		if (!el || removeTimerRef.current) return;
		el.removeAttribute("data-visible");
		const fade = parseFloat(getComputedStyle(el).transitionDuration) || .2;
		removeTimerRef.current = window.setTimeout(discardPreview, fade * 1e3 + 40);
	};
	const openPreview = (event) => {
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let el = previewRef.current;
		if (el) {
			if (removeTimerRef.current) {
				clearTimeout(removeTimerRef.current);
				removeTimerRef.current = 0;
			}
		} else {
			el = document.createElement("div");
			el.className = "tds-theme-preview";
			el.setAttribute("aria-hidden", "true");
			const current = document.documentElement.getAttribute(THEME_ATTRIBUTE);
			const clone = buildClone(current === "dark" ? "light" : "dark");
			el.appendChild(clone.page);
			document.body.appendChild(el);
			clone.restoreScroll();
			previewRef.current = el;
		}
		pointRef.current = {
			x: event.clientX,
			y: event.clientY
		};
		paintPreview();
		alignClone();
		const target = el;
		requestAnimationFrame(() => {
			if (previewRef.current === target) target.setAttribute("data-visible", "true");
		});
	};
	useEffect(() => {
		const button = buttonRef.current;
		if (!button) return;
		const onEnter = (event) => openPreview(event);
		const onMove = (event) => trackPointer(event);
		button.addEventListener("pointerenter", onEnter);
		button.addEventListener("pointermove", onMove);
		button.addEventListener("pointerleave", closePreview);
		button.addEventListener("pointercancel", closePreview);
		button.addEventListener("blur", closePreview);
		const onScroll = () => {
			if (previewRef.current) alignClone();
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			button.removeEventListener("pointerenter", onEnter);
			button.removeEventListener("pointermove", onMove);
			button.removeEventListener("pointerleave", closePreview);
			button.removeEventListener("pointercancel", closePreview);
			button.removeEventListener("blur", closePreview);
			discardPreview();
		};
	}, []);
	const flip = () => {
		const next = theme === "dark" ? "light" : "dark";
		setFlipped(true);
		closePreview();
		const apply = () => {
			setTheme(next);
			applyThemePreference(next);
		};
		const startViewTransition = document.startViewTransition;
		const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!startViewTransition || prefersReduced) {
			apply();
			return;
		}
		if (window.matchMedia("(pointer: coarse)").matches) {
			startViewTransition.call(document, () => {
				flushSync(apply);
			}).ready.then(() => {
				document.documentElement.animate([
					{ transform: "translateY(-100%)" },
					{
						transform: "translateY(1.5%)",
						offset: .78
					},
					{ transform: "translateY(0)" }
				], {
					duration: 560,
					easing: cssEase.out,
					pseudoElement: "::view-transition-new(root)"
				});
				document.documentElement.animate({ transform: ["translateY(0)", "translateY(10%)"] }, {
					duration: 560,
					easing: cssEase.inOut,
					pseudoElement: "::view-transition-old(root)"
				});
			});
			return;
		}
		const rect = buttonRef.current?.getBoundingClientRect();
		const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
		const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
		const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
		startViewTransition.call(document, () => {
			flushSync(apply);
		}).ready.then(() => {
			document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] }, {
				duration: 480,
				easing: cssEase.inOut,
				pseudoElement: "::view-transition-new(root)"
			});
		});
	};
	const label = mounted && theme === "dark" ? labelToLight : labelToDark;
	return /* @__PURE__ */ jsxs("button", {
		ref: buttonRef,
		type: "button",
		onClick: flip,
		"aria-label": label,
		title: label,
		className: "tds-theme-toggle inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer",
		children: [/* @__PURE__ */ jsx("svg", {
			"aria-hidden": "true",
			width: "18",
			height: "18",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: `${mounted && theme === "dark" ? "hidden" : "block"}${flipped ? " tds-theme-toggle__icon--turn" : ""}`,
			children: /* @__PURE__ */ jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
		}), /* @__PURE__ */ jsxs("svg", {
			"aria-hidden": "true",
			width: "18",
			height: "18",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: `${mounted && theme === "dark" ? "block" : "hidden"}${flipped ? " tds-theme-toggle__icon--turn" : ""}`,
			children: [
				/* @__PURE__ */ jsx("circle", {
					cx: "12",
					cy: "12",
					r: "4"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "12",
					y1: "2",
					x2: "12",
					y2: "5"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "12",
					y1: "19",
					x2: "12",
					y2: "22"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "2",
					y1: "12",
					x2: "5",
					y2: "12"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "19",
					y1: "12",
					x2: "22",
					y2: "12"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "4.93",
					y1: "4.93",
					x2: "6.99",
					y2: "6.99"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "17.01",
					y1: "17.01",
					x2: "19.07",
					y2: "19.07"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "4.93",
					y1: "19.07",
					x2: "6.99",
					y2: "17.01"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "17.01",
					y1: "6.99",
					x2: "19.07",
					y2: "4.93"
				})
			]
		})]
	});
}
//#endregion
//#region src/lib/imageVariants.ts
/**
* Pre-sized copies of committed images, and the one naming rule the page and
* the scripts share.
*
* ### Why the copies exist
*
* Every screenshot on the site was served at its capture size (1440 × 900,
* 65–140 KB) into cards a phone draws 300px wide, and the portrait went through
* Astro's on-request `/_image` endpoint — a sharp resize in the Node process on
* the production host for every uncached request, with a 1500 × 2100 fallback.
* Neither is necessary: these images only change when a script re-captures or a
* person commits a new file, so the smaller copies are made at that moment and
* committed beside the original.
*
* ### The rule
*
* A variant is the original's path with `-<width>` before `.webp`
* (`/demos/demo1.webp` → `/demos/demo1-480.webp`). `scripts/image-variants.ts`
* and `scripts/capture-preview.ts` write them; the components derive `srcset`
* from the same function; `imageVariants.test.ts` fails if any committed
* original lacks one — a `srcset` candidate that 404s breaks the image, it does
* not fall back to `src`.
*
* **No imports.** The scripts run under plain Node (`tsx`).
*/
/** Screenshot cards: a phone card and a desktop card at 2× density. */
var PREVIEW_VARIANT_WIDTHS = [480, 960];
/** The service tiles' photo band, half the page wide at most. */
var SERVICE_PHOTO_VARIANT_WIDTHS = [800];
/** The portrait, from the business card's 7.5rem up to a 24rem column at 2×+. */
var PORTRAIT_WIDTHS = [
	360,
	720,
	1080
];
/** The committed portrait's own size, for the tag's `width`/`height`. */
var PORTRAIT_SIZE = {
	width: 1500,
	height: 2100
};
/** `/x/name.webp` → `/x/name-480.webp`. */
function variantSrc(src, width) {
	return src.replace(/\.webp$/, `-${width}.webp`);
}
/**
* A `srcset` of the variants plus the original at its own width.
*
* Only variants narrower than the original are listed — `sharp` never enlarges
* (`withoutEnlargement`), so a wider "variant" would be a copy of the original
* under a false width.
*/
function srcsetFor(src, widths, intrinsicWidth, url = (path) => path) {
	return [...widths.filter((width) => width < intrinsicWidth).map((width) => `${url(variantSrc(src, width))} ${width}w`), `${url(src)} ${intrinsicWidth}w`].join(", ");
}
/** One portrait copy. There is no full-size original under `public/`. */
function portraitSrc(width) {
	return `/images/portrait/portrait-${width}.webp`;
}
function portraitSrcset() {
	return PORTRAIT_WIDTHS.map((width) => `${portraitSrc(width)} ${width}w`).join(", ");
}
/**
* The header logo — the mark and the wordmark — each served as lossless WebP
* copies of its committed original (`scripts/image-variants.ts`).
*
* The header draws both 24–48px tall: the mark at most 71px wide, the wordmark
* at most 97px. The wordmark's original is a 1289px PNG of 35 KB, and it was
* fetched before the headline on every phone. `width`/`height` are the
* originals' own, so the tags reserve the true ratio before the file arrives.
*/
var LOGO = {
	mark: {
		original: "/images/logo.webp",
		width: 713,
		height: 483,
		widths: [120, 240]
	},
	letters: {
		original: "/images/logo-letters.png",
		width: 1289,
		height: 639,
		widths: [200, 400]
	}
};
/** `/images/logo/<part>-<width>.webp`. */
function logoSrc(part, width) {
	return `/images/logo/${part}-${width}.webp`;
}
function logoSrcset(part) {
	return LOGO[part].widths.map((width) => `${logoSrc(part, width)} ${width}w`).join(", ");
}
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
*
* The author every detail page names in its byline, so the entity carries what
* a reader — or an answer engine — would check: a face (the portrait "Wieso
* ich?" shows) and the topics the pages are written about.
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
		image: `${siteConfig.url}${portraitSrc(720)}`,
		knowsAbout: [...siteConfig.knowsAbout],
		sameAs: siteConfig.founder.sameAs.filter(Boolean)
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
		foundingDate: String(siteConfig.foundingYear),
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
		knowsAbout: [...siteConfig.knowsAbout],
		/**
		* The logo, which Google's Organization rich result and the knowledge
		* panel both look for. The file and its dimensions have been in
		* `lib/imageVariants.ts` the whole time; nothing referenced them from
		* the graph, so the node described a business with no mark.
		*
		* An absolute URL and explicit dimensions, because a crawler fetching
		* this node has no page context to resolve a relative path against.
		*/
		logo: {
			"@type": "ImageObject",
			url: `${siteConfig.url}${LOGO.mark.original}`,
			width: LOGO.mark.width,
			height: LOGO.mark.height
		},
		image: `${siteConfig.url}${LOGO.mark.original}`,
		/**
		* The same two channels as the flat `email`/`telephone` above, but as a
		* ContactPoint — which is the shape that states WHO they are for and in
		* which languages they are answered.
		*/
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: siteConfig.email,
			telephone: siteConfig.telephone,
			areaServed: "DE",
			availableLanguage: ["de", "en"]
		},
		/**
		* Expected on a LocalBusiness-typed entity, and honest: the band is the
		* committed fixed-price packages the page publishes, so this repeats a fact
		* rather than inventing one. No hourly rates since 2026-09-22.
		*
		* NOT here: `openingHoursSpecification`. Julian works by arrangement, and
		* the vocabulary has no way to say that — `opens`/`closes` would be an
		* invented promise of availability. The page says it in words instead.
		* Do not "complete" this node with hours.
		*/
		priceRange: packagePriceRange()
	};
	if (socials.length > 0) base.sameAs = socials;
	return base;
}
/**
* The WebSite node.
*
* **There is no `SearchAction`, and the docblock used to claim one.** This
* site has no search — not a hidden one, none at all — and a `SearchAction`
* pointing at a URL template that answers nothing is a lie told to a crawler
* in a machine-readable format. The comment was wrong, not the code.
*
* `description` takes the page's language. It was pinned to German, so every
* English page described itself in German to anything reading the graph.
*/
function websiteSchema(lang = "de") {
	return {
		"@type": "WebSite",
		"@id": `${siteConfig.url}/#website`,
		url: siteConfig.url,
		name: siteConfig.name,
		description: siteConfig.description[lang],
		publisher: { "@id": `${siteConfig.url}/#organization` },
		inLanguage: ["de-DE", "en-GB"]
	};
}
/**
* Service + OfferCatalog for the pricing section: one Offer per fixed-price
* package. The site publishes no hourly rates any more (2026-09-22), so the
* catalogue holds only what the page shows.
*
* A package total is a plain `PriceSpecification` with no unit — never a
* `UnitPriceSpecification` with `unitCode: "HUR"`, which states "this many
* euros per hour" and would publish a four-figure hourly rate to every
* consumer that reads the markup rather than the page. The figures are net;
* the gross view on the page is derived and is not a second price.
*/
function pricingSchema(packages) {
	const offers = packages.map((item) => ({
		"@type": "Offer",
		itemOffered: {
			"@type": "Service",
			name: item.name,
			...item.description ? { description: item.description } : {}
		},
		priceSpecification: {
			"@type": "PriceSpecification",
			price: item.price,
			priceCurrency: "EUR",
			valueAddedTaxIncluded: false
		}
	}));
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: `${siteConfig.name} — Festpreise`,
		provider: { "@id": `${siteConfig.url}/#organization` },
		serviceType: "Software development & digital consulting",
		areaServed: siteConfig.areaServed.map((a) => ({
			"@type": "Place",
			name: a
		})),
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Festpreise",
			itemListElement: offers
		}
	};
}
/**
* BreadcrumbList as a node of an `@graph` — no `@context` of its own, and an
* `@id` the page's `WebPage` can point at.
*/
function breadcrumbNode(id, items) {
	return {
		"@type": "BreadcrumbList",
		"@id": id,
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: item.url
		}))
	};
}
/**
* The page itself as an entity: part of the site, published by the
* organisation, written by the person the Impressum names, dated.
*
* Every value here must be visible on the page too — the date is the "Stand"
* line, the author the byline beside it. Structured data that says more than
* the page is exactly what search engines are told to distrust.
*/
function webPageNode(input) {
	return {
		"@type": "WebPage",
		"@id": `${input.url}#webpage`,
		url: input.url,
		name: input.name,
		description: input.description,
		inLanguage: input.lang === "de" ? "de-DE" : "en-GB",
		isPartOf: { "@id": `${siteConfig.url}/#website` },
		publisher: { "@id": `${siteConfig.url}/#organization` },
		author: { "@id": `${siteConfig.url}/#person` },
		...input.dateModified ? { dateModified: input.dateModified } : {},
		...input.about ? { about: {
			"@type": "Thing",
			name: input.about.name,
			...input.about.sameAs ? { sameAs: input.about.sameAs } : {}
		} } : {},
		...input.breadcrumbId ? { breadcrumb: { "@id": input.breadcrumbId } } : {}
	};
}
/**
* A service offered on a page, provided by the organisation. No `offers`:
* the site publishes no hourly rates (2026-09-22), and a service page names
* no single price of its own — the packages live in the pricing catalogue.
*/
function serviceNode(input) {
	return {
		"@type": "Service",
		"@id": `${input.url}#service`,
		url: input.url,
		name: input.name,
		description: input.description,
		serviceType: input.serviceType,
		provider: { "@id": `${siteConfig.url}/#organization` },
		areaServed: siteConfig.areaServed.map((name) => ({
			"@type": "Place",
			name
		})),
		inLanguage: input.lang === "de" ? "de-DE" : "en-GB",
		...input.outputs ? { serviceOutput: [...input.outputs] } : {}
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
/** "390–1040 €" — the span of the committed fixed-price packages. */
function packagePriceRange() {
	const prices = getDefaultPackages("de").map((pkg) => pkg.price);
	return `${Math.min(...prices)}–${Math.max(...prices)} €`;
}
//#endregion
export { transitions as S, portraitSrc as _, personSchema as a, ThemeToggle as b, speakableSchema as c, LOGO as d, PORTRAIT_SIZE as f, logoSrcset as g, logoSrc as h, organizationSchema as i, webPageNode as l, SERVICE_PHOTO_VARIANT_WIDTHS as m, breadcrumbNode as n, pricingSchema as o, PREVIEW_VARIANT_WIDTHS as p, faqPageSchema as r, serviceNode as s, asGraph as t, websiteSchema as u, portraitSrcset as v, presence as x, srcsetFor as y };
