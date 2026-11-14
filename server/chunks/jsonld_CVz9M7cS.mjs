import { u as imageRights } from "./siteKey_CUhDfVqm.mjs";
import { s as portraitSrc, t as LOGO } from "./imageVariants_CcEhls79.mjs";
import { tt as siteConfig } from "./sitemapSections_DLBFBv_Z.mjs";
// src/lib/jsonld.ts
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
		image: {
			"@type": "ImageObject",
			url: `${siteConfig.url}${portraitSrc(720)}`,
			contentUrl: `${siteConfig.url}${portraitSrc(720)}`,
			...imageRights("de", { portrait: true })
		},
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
		areaServed: areaServedNodes(),
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
			height: LOGO.mark.height,
			...imageRights("de")
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
		}
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
		areaServed: areaServedNodes(),
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
/**
* The service area as typed places (2026-11-11). A bare `Place` with a name
* leaves an engine to guess whether "Hamburg" is a city or a street; the type
* and, for the two towns, the Wikipedia article settle it. "Norddeutschland"
* is a region without an administrative body, so it stays a `Place`.
*/
var AREA_TYPES = {
	Hamburg: {
		type: "City",
		sameAs: "https://de.wikipedia.org/wiki/Hamburg"
	},
	Schwarzenbek: {
		type: "City",
		sameAs: "https://de.wikipedia.org/wiki/Schwarzenbek"
	},
	Deutschland: {
		type: "Country",
		sameAs: "https://de.wikipedia.org/wiki/Deutschland"
	}
};
function areaServedNodes() {
	return siteConfig.areaServed.map((name) => {
		const known = AREA_TYPES[name];
		return known ? {
			"@type": known.type,
			name,
			...known.sameAs ? { sameAs: known.sameAs } : {}
		} : {
			"@type": "Place",
			name
		};
	});
}
function asGraph(...nodes) {
	return {
		"@context": "https://schema.org",
		"@graph": nodes
	};
}
export { personSchema as a, webPageNode as c, organizationSchema as i, websiteSchema as l, breadcrumbNode as n, serviceNode as o, faqPageSchema as r, speakableSchema as s, asGraph as t };
