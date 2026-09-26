import { C as siteConfig, d as fetchBlocks, f as hasBannedWord, u as cmsFor } from "./services_D6I65Rsy.mjs";
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
//#region src/lib/pricing.ts
/**
* Pricing copy and the fixed-price packages.
*
* **No hourly rates** (decided 2026-09-22). The site used to publish four
* rates beside the packages; now it shows the packages and says that
* everything else is quoted individually. The rate fields are gone from this
* block, so a panel block that still carries them is simply ignored — cmsFor()
* merges only the keys the defaults know.
*
* `*asterisks*` mark a word for emphasis (see `./emphasis`); a CMS override
* without them renders as plain text.
*/
/**
* German VAT, for the net/gross switch in the price list. The published
* figures are net; gross is derived, never stored.
*/
var VAT_RATE = .19;
/** A net amount with VAT added, rounded to the cent. */
function grossPrice(net) {
	return Math.round(net * 1.19 * 100) / 100;
}
var defaults = {
	de: {
		label: "— Preise",
		headline: "Preise ohne",
		headlineAccent: "Überraschungen.",
		sub: "Drei Pakete zum *Festpreis*. Alles andere bekommst du als eigenes Angebot.",
		notesTitle: "Gut zu wissen",
		notes: [],
		ctaTitle: "Individuelle Lösungen",
		ctaSub: "Passt dein Vorhaben in kein Paket? Dann gibt es den Preis auf Anfrage.",
		ctaButton: "Anfrage stellen",
		back: "Zurück zur Startseite"
	},
	en: {
		label: "— Pricing",
		headline: "Pricing without",
		headlineAccent: "surprises.",
		sub: "Three packages at a *fixed price*. Everything else gets its own quote.",
		notesTitle: "Good to know",
		notes: [],
		ctaTitle: "Custom solutions",
		ctaSub: "Your project fits no package? Then the price is on request.",
		ctaButton: "Send a request",
		back: "Back to the homepage"
	}
};
/**
* The committed fixed-price packages (decided 2026-09-21).
*
* Checked against the market that day: freelance web rates 60–120 €/h,
* one-pagers 700–1,500 €, a takeover audit well under an agency's. The middle
* package became "Website-Optimierung" at 780 € on 2026-09-22 (12 h × 65 €):
* freelance page-speed work runs 299–799 €, an on-page SEO package 499–999 €.
*
* Not `cmsFor`-merged (see `ResolvedPricing`): a valid panel list REPLACES
* this one as a whole, an empty or malformed one falls back to it.
*/
var defaultPackages = {
	de: [
		{
			title: "Website-Check",
			price: 390,
			description: "Ich prüfe deine Seite und sage dir, was zuerst dran ist.",
			includes: [
				"Technik, Sicherheit und Ladezeit geprüft",
				"Schriftlicher Bericht mit Prioritäten",
				"Besprechung der Ergebnisse"
			]
		},
		{
			title: "Website-Optimierung",
			price: 780,
			description: "Ich mache deine bestehende Seite schneller, sicherer und besser auffindbar.",
			includes: [
				"Ladezeit optimiert: Bilder, Caching, Code",
				"Technische Fehler behoben, Updates eingespielt",
				"Titel und Beschreibungen für Google überarbeitet"
			]
		},
		{
			title: "Onepager",
			price: 1040,
			description: "Eine neue Seite, die alles Wichtige auf einen Blick zeigt.",
			includes: [
				"Bis zu fünf Abschnitte",
				"Kontaktformular, Impressum und Datenschutz eingebunden",
				"Für Handy und Desktop gebaut"
			]
		}
	],
	en: [
		{
			title: "Website check",
			price: 390,
			description: "I review your site and tell you what to fix first.",
			includes: [
				"Tech, security and load time reviewed",
				"Written report with priorities",
				"Walk-through of the results"
			]
		},
		{
			title: "Website optimisation",
			price: 780,
			description: "I make your existing site faster, safer and easier to find.",
			includes: [
				"Load time optimised: images, caching, code",
				"Technical faults fixed, updates applied",
				"Titles and descriptions reworked for Google"
			]
		},
		{
			title: "One-pager",
			price: 1040,
			description: "A new site that shows everything important at a glance.",
			includes: [
				"Up to five sections",
				"Contact form, imprint and privacy policy included",
				"Built for phone and desktop"
			]
		}
	]
};
function getDefaultPackages(lang) {
	return defaultPackages[lang];
}
function getPricingDefault(lang) {
	return defaults[lang];
}
async function getPricingContent(lang) {
	const resolved = await cmsFor("pricing_services", lang, getPricingDefault(lang));
	const block = (await fetchBlocks(lang))["pricing_services"];
	const fromPanel = isRecord(block) ? validatePricePackages(block.packages) : [];
	const packages = fromPanel.length > 0 ? fromPanel : getDefaultPackages(lang);
	return {
		...resolved,
		packages
	};
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
* Validate the panel's fixed-price packages (`pricing_services.packages`).
*
* The raw block field, outside `cmsFor()` — see `ResolvedPricing`. An empty
* or invalid list means "use the committed packages".
*
* Strict on purpose, and one malformed item rejects the whole list — matching
* `cmsFor()`'s own list behaviour. A package with a missing title or a price
* of `0` is not a cheaper package, it is an unfinished one, and a page that
* shows "0 €" beside a real figure is worse than a page that shows neither.
*/
function validatePricePackages(value) {
	if (!Array.isArray(value) || value.length === 0) return [];
	const packages = [];
	for (const candidate of value) {
		if (!isRecord(candidate)) return [];
		const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
		const description = typeof candidate.description === "string" ? candidate.description.trim() : "";
		const price = typeof candidate.price === "number" ? candidate.price : NaN;
		if (title === "" || !Number.isFinite(price) || price <= 0) return [];
		if (hasBannedWord(title) || hasBannedWord(description)) return [];
		const includesRaw = candidate.includes;
		let includes = [];
		if (Array.isArray(includesRaw)) for (const entry of includesRaw) {
			if (typeof entry !== "string" || entry.trim() === "" || hasBannedWord(entry)) return [];
			includes.push(entry.trim());
		}
		else if (includesRaw !== void 0 && includesRaw !== null) return [];
		packages.push({
			title,
			price,
			description,
			includes
		});
	}
	return packages;
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
export { srcsetFor as S, SERVICE_PHOTO_VARIANT_WIDTHS as _, personSchema as a, portraitSrc as b, speakableSchema as c, VAT_RATE as d, getPricingContent as f, PREVIEW_VARIANT_WIDTHS as g, PORTRAIT_SIZE as h, organizationSchema as i, webPageNode as l, LOGO as m, breadcrumbNode as n, pricingSchema as o, grossPrice as p, faqPageSchema as r, serviceNode as s, asGraph as t, websiteSchema as u, logoSrc as v, portraitSrcset as x, logoSrcset as y };
