import { _ as siteConfig } from "./services_SEV84zjo.mjs";
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
function srcsetFor(src, widths, intrinsicWidth) {
	return [...widths.filter((width) => width < intrinsicWidth).map((width) => `${variantSrc(src, width)} ${width}w`), `${src} ${intrinsicWidth}w`].join(", ");
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
export { websiteSchema as _, logoSrc as a, portraitSrcset as c, breadcrumbSchema as d, faqPageSchema as f, speakableSchema as g, pricingSchema as h, SERVICE_PHOTO_VARIANT_WIDTHS as i, srcsetFor as l, personSchema as m, PORTRAIT_SIZE as n, logoSrcset as o, organizationSchema as p, PREVIEW_VARIANT_WIDTHS as r, portraitSrc as s, LOGO as t, asGraph as u };
