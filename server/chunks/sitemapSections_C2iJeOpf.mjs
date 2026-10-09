import "./contentFetch_DOBZ-t4p.mjs";
import "./connection_B2KFfIq2.mjs";
//#region src/lib/seo.ts
/**
* Single source of truth for SEO / structured-data identity.
*
* The Organization, Person and WebSite JSON-LD helpers in
* `~/lib/jsonld` read from this config — changing values here
* propagates through every page.
*
* Street address, postal code, phone, VAT ID and social URLs are all
* the real verified data (matches the Impressum).
*/
/**
* The public profile URLs, lifted out of `siteConfig` so that `socials` and
* `founder.sameAs` cannot be two different answers to the same question.
*
* `founder.sameAs` was an empty array with a "populated post-launch" note on
* it for long enough to become a small lie: the Person node fell back to
* reading `socials` directly, and anything that trusted `founder.sameAs` — an
* answer engine resolving the author of a page, for instance — was told the
* person has no profiles anywhere.
*
* Both profiles belong on both entities here, which is unusual and correct for
* this business: it is a sole proprietorship, `legalName` IS "Julian Tracht",
* so the person and the organisation are the same legal entity. `socials.test.ts`
* holds the Organization's `sameAs` to the same list the page renders.
*
* WhatsApp is deliberately absent: a `wa.me` deep link is a messenger link,
* not a profile, and `sameAs` means "the same entity, elsewhere".
*/
var PROFILES = {
	linkedin: "https://www.linkedin.com/in/julian-tracht/",
	github: "https://github.com/Tracht-Digital-Solutions"
};
var siteConfig = {
	/** Brand name as it should appear in search results. */
	name: "Tracht Digital Solutions",
	shortName: "TDS",
	/** Production origin. Mirrors `astro.config.mjs#site`. */
	url: "https://tracht-digital.de",
	/** Sister origin where the journal lives. */
	blogUrl: "https://blog.tracht-digital.de",
	/** The customer portal (tds-customer-frontend). */
	portalUrl: "https://app.tracht-digital.de",
	/** Primary content language. */
	defaultLocale: "de",
	/**
	* Meta descriptions. Google renders roughly the first 155-160 characters and
	* truncates the rest, so both of these are kept under 160 — see
	* `seo.test.ts`, which fails the build if either grows past its budget.
	*
	* Both must keep the two keyword targets intact inside that budget: the exact
	* phrase "Digitalisierung für Unternehmen" (Germany-wide) and the local
	* signal "Schwarzenbek"/"Hamburg". Trim the service list before either of
	* those.
	*/
	description: {
		de: "Kundenportale, Verwaltungspanels und Digitalisierung für Unternehmen – dazu Websites ab 390 €. Aus Schwarzenbek bei Hamburg.",
		en: "Customer portals, admin panels and digitalization for businesses – plus websites from €390. From Schwarzenbek near Hamburg."
	},
	/** Verified contact channel. Safe to publish in schema. */
	email: "kontakt@tracht-digital.de",
	/** Verified phone (WhatsApp). E.164-friendly formatting for schema. */
	telephone: "+49 178 8224022",
	/** Legal entity behind the brand. */
	legalName: "Julian Tracht",
	/** USt-IdNr. gemäß § 27a UStG — verified, matches the Impressum. */
	vatID: "DE450639725",
	founder: {
		name: "Julian Tracht",
		jobTitle: "Webentwickler & Digitalisierungsberater",
		/** The same profiles `socials` renders — see `PROFILES` above. */
		sameAs: Object.values(PROFILES)
	},
	/** Verified business address (matches the Impressum). */
	address: {
		streetAddress: "Elbinger Straße 19",
		postalCode: "21493",
		addressLocality: "Schwarzenbek",
		addressRegion: "Schleswig-Holstein",
		addressCountry: "DE"
	},
	/** Approximate coordinates of the business address (Elbinger Straße 19,
	* 21493 Schwarzenbek) — completes the LocalBusiness signal in schema. */
	geo: {
		latitude: 53.504,
		longitude: 10.48
	},
	/** Service-area for ProfessionalService schema. */
	areaServed: [
		"Hamburg",
		"Schwarzenbek",
		"Norddeutschland",
		"Deutschland"
	],
	/**
	* Topics for schema `knowsAbout` — the keyword set the site targets, in the
	* words people search with. Every system named here has a page of its own
	* (`lib/platforms.ts`); a topic without one would be a claim the site does
	* not back up.
	*/
	knowsAbout: [
		"Digitalisierung für Unternehmen",
		"Website erstellen",
		"Webdesign",
		"Webentwicklung",
		"Onlineshop erstellen",
		"Website-Wartung",
		"WordPress",
		"WooCommerce",
		"Shopware 6",
		"TYPO3",
		"Onlineshop für lokale Geschäfte",
		"Google Ads",
		"Suchmaschinenwerbung",
		"Suchmaschinenoptimierung",
		"Sichtbarkeit in KI-Antworten",
		"Lokale Sichtbarkeit",
		"Prozessautomatisierung",
		"Individualsoftware",
		"Schnittstellen",
		"IT-Beratung"
	],
	/** Public social URLs — surface in JSON-LD `sameAs` and the
	* Contact aside. WhatsApp is a `wa.me` deep link to the
	* `contact.info.phone` number; it is intentionally not in
	* JSON-LD `sameAs` (which expects social-profile URLs, not
	* messenger links). */
	socials: { ...PROFILES },
	/** Default OG image (1200×630), generated at /og/default.png. */
	defaultOgImage: "/og/default.png"
};
//#endregion
//#region src/lib/businessCard.ts
/** Localized route segments. Both trees really serve these — see `sitemap.ts`. */
var BUSINESS_CARD_SLUG = {
	de: "/visitenkarte",
	en: "/en/business-card"
};
function businessCardHref(lang) {
	return BUSINESS_CARD_SLUG[lang];
}
/**
* Where the tile's screenshot lives, and the box it is drawn in.
*
* The ratio is `DEMO_PREVIEW`'s, imported rather than restated: the tile sits
* directly beside the demo cards in both places it appears, and a band even a
* few pixels off would be visible as a broken row.
*/
var BUSINESS_CARD_PREVIEW = "/images/business-card.webp";
/**
* Where each language's prerendered QR code is served from.
*
* It lives HERE, next to the other constants, and not beside the function
* that draws it — that separation is load-bearing. `businessCardQr.ts`
* imports the `qrcode` encoder at module scope, so a page reaching in there
* for a string drags the encoder into the server bundle with it. It did:
* Rolldown tree-shook the unused renderer but kept the module's side effects
* as a bare `import "qrcode";`, the package is a devDependency and not in
* the release tree, and both card pages answered 500 on the host. Only the
* two prerendered endpoints may import that module.
*/
var BUSINESS_CARD_QR_PATH = {
	de: "/visitenkarte-qr.svg",
	en: "/en/business-card-qr.svg"
};
/**
* The tile's words, in the language of the PAGE.
*
* Not CMS-editable, and that is a decision rather than an omission: this tile
* sits between reference cases whose copy comes from the committed catalog and
* demo cards whose copy comes from the demos themselves. Making the one tile
* in the middle editable would put a fourth source of truth on one shelf.
*/
var businessCardCopy = {
	de: {
		eyebrow: "Eigenes Projekt",
		title: "Digitale Visitenkarte",
		text: "Kontaktdaten, die man scannt statt abtippt — meine eigene, gebaut wie die für Kunden.",
		cta: "Karte ansehen",
		previewAlt: "Vorschau der digitalen Visitenkarte von Julian Tracht"
	},
	en: {
		eyebrow: "Own project",
		title: "Digital business card",
		text: "Contact details people scan instead of typing — mine, built like the ones for customers.",
		cta: "View the card",
		previewAlt: "Preview of Julian Tracht's digital business card"
	}
};
/**
* The site's own destinations, per language.
*
* Written out rather than resolved through `localizePath()`, for the reason
* this module exists at all: `sitemap.ts` and `cache.ts` import it, and a
* runtime import of `i18n.ts` would pull the whole shared translation table
* into both of them (and into their unit tests) to produce four constants.
* The slugs are code-owned anyway — the same rule as `BUSINESS_CARD_SLUG`.
*/
var SITE_LINKS = {
	de: {
		home: "/",
		services: "/#services",
		pricing: "/#preise"
	},
	en: {
		home: "/en/",
		services: "/en/#services",
		pricing: "/en/#preise"
	}
};
/**
* Every row the card stacks, in the order it stacks them.
*
* The order is the point of the list: dial, message, write — the three things
* someone who just scanned a code off a screen actually wants — before
* anything that leads back into the site. The reference shelf below it is
* where a link hub is allowed to be a link hub.
*
* Contact values come from `siteConfig`, like the vCard and the JSON-LD, so
* the card cannot drift from the Impressum. The postal address stays out, as
* it does in `kontakt.vcf.ts`: it is a private home address.
*/
function businessCardLinks(lang) {
	const { email, telephone, socials, blogUrl, name } = siteConfig;
	const phoneHref = telephone.replace(/\s/g, "");
	const site = SITE_LINKS[lang];
	const de = lang === "de";
	const links = [
		{
			id: "phone",
			group: "contact",
			label: de ? "Anrufen" : "Call",
			meta: telephone,
			href: `tel:${phoneHref}`
		},
		{
			id: "whatsapp",
			group: "contact",
			label: "WhatsApp",
			meta: de ? "Kurz schreiben, statt zu telefonieren" : "Message instead of calling",
			href: `https://wa.me/${phoneHref.replace(/^\+/, "")}`,
			external: true
		},
		{
			id: "mail",
			group: "contact",
			label: de ? "E-Mail" : "Email",
			meta: email,
			href: `mailto:${email}`
		},
		{
			id: "website",
			group: "more",
			label: de ? "Website" : "Website",
			meta: name,
			href: site.home
		},
		{
			id: "services",
			group: "more",
			label: de ? "Leistungen" : "Services",
			meta: de ? "Beratung, Prozesse, Software, Webauftritt" : "Advice, processes, software, web presence",
			href: site.services
		},
		{
			id: "pricing",
			group: "more",
			label: de ? "Preise" : "Pricing",
			meta: de ? "Festpreise und Pakete" : "Fixed prices and packages",
			href: site.pricing
		},
		{
			id: "journal",
			group: "more",
			label: "Journal",
			meta: de ? "Beiträge zur Digitalisierung" : "Notes on digitalization",
			href: blogUrl,
			external: true
		}
	];
	if (socials.linkedin) links.push({
		id: "linkedin",
		group: "more",
		label: "LinkedIn",
		meta: "/in/julian-tracht",
		href: socials.linkedin,
		external: true
	});
	if (socials.github) links.push({
		id: "github",
		group: "more",
		label: "GitHub",
		meta: "Tracht-Digital-Solutions",
		href: socials.github,
		external: true
	});
	return links;
}
//#endregion
//#region src/lib/credentialMeta.ts
/**
* Constants shared by the certificate render script and the renderer.
*
* Split out for the same reason `referencePreviewMeta.ts` is split from
* `referencePreviews.ts`: `scripts/certificates-render.ts` runs under plain
* Node and must not drag the content cache, the i18n bundle or
* `import.meta.env` into a context that has none of them.
*
* **No imports.**
*/
/** Folder under `public/` the render script owns exclusively. */
var CREDENTIAL_ASSET_DIR = "zertifikate";
/**
* Intrinsic size of a rendered certificate, and the ratio a card reserves.
*
* Every LinkedIn Learning certificate is one US-Letter page in landscape
* (792 × 612 pt), measured from the `MediaBox` of all thirteen files. Rendered
* at scale 2 that is 1584 × 1224 — enough that the certificate stays readable
* when the lightbox draws it across a desktop screen, and the same file serves
* the card through its `-480`/`-960` copies.
*/
var CREDENTIAL_IMAGE = {
	width: 1584,
	height: 1224
};
CREDENTIAL_IMAGE.width / 792;
/** `/zertifikate/<id>.webp` — the one place this path is spelled. */
function credentialImageSrc(id) {
	return `/${CREDENTIAL_ASSET_DIR}/${id}.webp`;
}
//#endregion
//#region src/lib/credentials.ts
/** Localized route segments. Both trees really serve these — see `sitemap.ts`. */
var CREDENTIALS_SLUG = {
	de: "/qualifikationen",
	en: "/en/qualifications"
};
function credentialsHref(lang) {
	return CREDENTIALS_SLUG[lang];
}
/**
* ISO date of the last change to this page's committed copy — the "Stand"
* line, the `dateModified` of its `WebPage`, and the entry's `lastmod` in the
* sitemap. Raise it when a certificate or the surrounding copy changes.
*/
var CREDENTIALS_UPDATED_AT = "2026-10-02";
/**
* The four headings, in display order.
*
* Closed, like `DEMO_KINDS`: a certificate whose subject fits none of these
* means the list is wrong, not that a fifth heading should be invented at the
* call site.
*/
var CREDENTIAL_GROUPS = {
	web: {
		de: {
			title: "Web & Sichtbarkeit",
			lead: "Damit die Seite gefunden wird."
		},
		en: {
			title: "Web & visibility",
			lead: "So the site gets found."
		}
	},
	projects: {
		de: {
			title: "Projekte & Prozesse",
			lead: "Damit ein Vorhaben ankommt."
		},
		en: {
			title: "Projects & processes",
			lead: "So a project lands."
		}
	},
	operations: {
		de: {
			title: "Technik & Betrieb",
			lead: "Damit es danach läuft und sicher bleibt."
		},
		en: {
			title: "Engineering & operations",
			lead: "So it keeps running, and stays safe."
		}
	},
	data: {
		de: {
			title: "Daten & KI",
			lead: "Damit Entscheidungen auf Zahlen stehen."
		},
		en: {
			title: "Data & AI",
			lead: "So decisions stand on numbers."
		}
	}
};
/** The groups in display order — one list, so nothing can iterate them differently. */
var CREDENTIAL_GROUP_ORDER = [
	"web",
	"projects",
	"operations",
	"data"
];
var credentials = [
	{
		id: "seo-moz",
		group: "web",
		title: "Search Engine Optimization Professional Certificate by Moz",
		issuer: "LinkedIn Learning · Moz",
		completedAt: "2026-09-27",
		durationMinutes: 292,
		skills: [
			"AI for Marketing",
			"Search Engine Optimization (SEO)",
			"SEO Copywriting"
		],
		certificateId: "cae4d56b67d967880a57a63d13fea751f8eef40b2f29447f0f918a80347f511c",
		note: {
			de: "Suchmaschinen, Inhalte und Technik — die Grundlage der Arbeit an Sichtbarkeit.",
			en: "Search engines, content and the technical side — the groundwork for being found."
		}
	},
	{
		id: "project-management-microsoft",
		group: "projects",
		title: "Career Essentials in Project Management by Microsoft and LinkedIn",
		issuer: "LinkedIn Learning · Microsoft",
		completedAt: "2026-09-16",
		durationMinutes: 878,
		skills: [
			"Budget Development",
			"Project Management",
			"Project Communications"
		],
		note: {
			de: "Vorhaben planen, Budgets führen, Beteiligte auf dem Laufenden halten.",
			en: "Planning work, running a budget, keeping everyone informed."
		},
		certificateId: "d971058a0ce9b44f0a16f414250eea69547513dab7ff331e7074b8748435aabe"
	},
	{
		id: "business-analysis-microsoft",
		group: "projects",
		title: "Career Essentials in Business Analysis by Microsoft and LinkedIn",
		issuer: "LinkedIn Learning · Microsoft",
		completedAt: "2026-09-17",
		durationMinutes: 779,
		skills: [
			"Requirements Gathering",
			"Project Management",
			"Business Analysis"
		],
		certificateId: "f7757a4cdaf249fc4bde9f7b6f8d6b74f4c6d93d38af20132d107b717a8c8e19",
		note: {
			de: "Anforderungen sauber aufnehmen, bevor irgendjemand etwas baut.",
			en: "Getting the requirements straight before anybody builds anything."
		}
	},
	{
		id: "agile-project-management-atlassian",
		group: "projects",
		title: "Atlassian Agile Project Management Professional Certificate",
		issuer: "LinkedIn Learning · Atlassian",
		completedAt: "2026-08-30",
		durationMinutes: 471,
		skills: [
			"Jira",
			"Agile Methodologies",
			"Agile Project Management"
		],
		certificateId: "2c2909c060e7c4c8a019cfc5548bcb4b23a2ffeaef91b1cd72042f7148565c8a",
		note: {
			de: "In kurzen Schritten liefern statt einmal am Ende.",
			en: "Delivering in short steps instead of once at the end."
		}
	},
	{
		id: "itsm-atlassian",
		group: "projects",
		title: "Atlassian IT Service Management (ITSM) Professional Certificate",
		issuer: "LinkedIn Learning · Atlassian",
		completedAt: "2026-08-30",
		durationMinutes: 339,
		skills: [
			"IT Service Management",
			"IT Management Monitoring",
			"Change Management"
		],
		certificateId: "4de1f4d0f9d06c7cf63acb4814ce796954c363f584e002e4914a4761634dd713",
		note: {
			de: "Störungen, Änderungen und Zuständigkeiten in geordnete Bahnen bringen.",
			en: "Putting faults, changes and responsibilities into an orderly track."
		}
	},
	{
		id: "product-management-aha",
		group: "projects",
		title: "Aha! Product Management Professional Certificate",
		issuer: "LinkedIn Learning · Aha!",
		completedAt: "2026-09-16",
		durationMinutes: 337,
		skills: [
			"Product Management",
			"Product Road Mapping",
			"Product Strategy"
		],
		certificateId: "25d633b13b4728fb458fed1edf67a1b4ebcc05ba3ce47cba9993160916067284",
		note: {
			de: "Entscheiden, was zuerst gebaut wird — und was gar nicht.",
			en: "Deciding what gets built first, and what does not get built at all."
		}
	},
	{
		id: "penetration-testing-cybrary",
		group: "operations",
		title: "Penetration Testing Professional Certificate by Cybrary",
		issuer: "LinkedIn Learning · Cybrary",
		completedAt: "2026-09-28",
		durationMinutes: 735,
		skills: ["Ethical Hacking", "Penetration Testing"],
		certificateId: "9a2b2e6c565cea7034b57f0f880598942e11ab0e1c0e1e47f7a83fd648ee421d",
		note: {
			de: "Die Seite aus der Sicht eines Angreifers ansehen, bevor es jemand anders tut.",
			en: "Looking at a site the way an attacker would, before somebody else does."
		}
	},
	{
		id: "github-career-essentials",
		group: "operations",
		title: "Career Essentials in GitHub Professional Certificate",
		issuer: "LinkedIn Learning · GitHub",
		completedAt: "2026-08-30",
		durationMinutes: 260,
		skills: ["GitHub"],
		certificateId: "d1a879fb782c650064bc202b63def3ab42c6b1bd657f5f1e6d2c0d91b2a726be",
		note: {
			de: "Jede Änderung ist nachvollziehbar und lässt sich zurücknehmen.",
			en: "Every change is traceable, and every change can be taken back."
		}
	},
	{
		id: "docker-foundations",
		group: "operations",
		title: "Docker Foundations Professional Certificate",
		issuer: "LinkedIn Learning · Docker",
		completedAt: "2026-08-30",
		durationMinutes: 222,
		skills: ["Containerization", "Docker Products"],
		certificateId: "55ca84d7121bbebb26e2f14d8a157b17d9b857e1b8ee7d206653dd43622976c9",
		note: {
			de: "Eine Anwendung läuft auf dem Server so wie auf meinem Rechner.",
			en: "An application runs on the server the way it runs on my machine."
		}
	},
	{
		id: "azure-essentials-microsoft",
		group: "operations",
		title: "Microsoft Azure Essentials Professional Certificate by Microsoft and LinkedIn",
		issuer: "LinkedIn Learning · Microsoft",
		completedAt: "2026-08-28",
		durationMinutes: 154,
		skills: ["Microsoft Azure", "Cloud Computing"],
		certificateId: "076b9073ba155aead6499fb42bab73365bd905202fe346a29615ab5f2e748e1a",
		note: {
			de: "Wann eine Cloud die passende Antwort ist — und wann ein Server genügt.",
			en: "When the cloud is the right answer, and when a server will do."
		}
	},
	{
		id: "data-analysis-microsoft",
		group: "data",
		title: "Career Essentials in Data Analysis by Microsoft and LinkedIn",
		issuer: "LinkedIn Learning · Microsoft",
		completedAt: "2026-09-28",
		durationMinutes: 738,
		skills: [
			"Data Analysis",
			"Data Visualization",
			"Data Analytics"
		],
		certificateId: "2ca3cbf97b5820837b7bcea578e816274c3ca1bd70a5d5e8447b6c31b48790ef",
		note: {
			de: "Aus Zahlen im Betrieb eine Auswertung machen, die jemand lesen kann.",
			en: "Turning a company's numbers into a report somebody can read."
		}
	},
	{
		id: "data-science-knime",
		group: "data",
		title: "Data Science Professional Certificate by KNIME",
		issuer: "LinkedIn Learning · KNIME",
		completedAt: "2026-09-16",
		durationMinutes: 881,
		skills: [
			"AI for Business",
			"Data Science",
			"Artificial Intelligence (AI)"
		],
		certificateId: "97a8d55346fc711c5b3c5888ad985b62a1081802ad0e11c8fdf517f61dd0e24d",
		note: {
			de: "Größere Datenmengen aufbereiten, ohne dafür ein Programm zu schreiben.",
			en: "Preparing larger sets of data without writing a program for it."
		}
	},
	{
		id: "generative-ai-microsoft",
		group: "data",
		title: "Build Your Generative AI Productivity Skills with Microsoft and LinkedIn",
		issuer: "LinkedIn Learning · Microsoft",
		completedAt: "2026-08-28",
		durationMinutes: 339,
		skills: [
			"AI for Business",
			"AI Productivity",
			"Generative AI"
		],
		certificateId: "b38e4a4843623e7474d286baf88563bf7711f8bac463d9ec7f2c3d98246e5130",
		note: {
			de: "Wo KI im Alltag Zeit spart — und wo sie nur Arbeit verlagert.",
			en: "Where AI saves time day to day, and where it only moves the work."
		}
	}
];
/** The certificates of one group, in catalog order. */
function credentialsInGroup(group) {
	return credentials.filter((entry) => entry.group === group);
}
/**
* The three the "Wieso ich?" section names.
*
* Derived from the catalog order rather than listed a second time: a teaser
* with its own list drifts away from the page it teases the first time
* somebody reorders one of them.
*/
function featuredCredentials() {
	return credentials.slice(0, 3);
}
/**
* The short name a teaser or a card caption uses.
*
* The full titles run to nine words ("…Professional Certificate by Microsoft
* and LinkedIn"); three of those in a column beside a portrait is a wall. The
* partner is already on the line below, so the trailing boilerplate goes.
*/
function shortTitle(entry) {
	return entry.title.replace(/^Career Essentials in /, "").replace(/\s*Professional Certificate\b/, "").replace(/\s*\bby [^,]+$/, "").replace(/\s*with Microsoft and LinkedIn$/, "").replace(/\s*by Microsoft and LinkedIn$/, "").trim();
}
/** "4 Std. 52 Min." / "4 hrs 52 min", from the printed length. */
function formatDuration(minutes, lang) {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	const unit = lang === "de" ? {
		h: "Std.",
		m: "Min."
	} : {
		h: "hrs",
		m: "min"
	};
	if (hours === 0) return `${rest} ${unit.m}`;
	if (rest === 0) return `${hours} ${unit.h}`;
	return `${hours} ${unit.h} ${rest} ${unit.m}`;
}
/** The completion date, spelled out in the page's language. */
function formatCompleted(iso, lang) {
	const [year, month, day] = iso.split("-").map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
		year: "numeric",
		month: "long",
		timeZone: "UTC"
	}).format(date);
}
//#endregion
//#region src/lib/faq.ts
/**
* Source of truth for the FAQ content. Lives here so the visible `<details>`
* accordions, the dedicated questions page and the FAQPage JSON-LD all read the
* same items — structured data has to match the visible answer 1:1, so we
* render from one place.
*
* Copy stays inline (not promoted to tds-shared) — FAQ answers drift faster
* than the rest of the bundle.
*
* ### How the questions are written (2026-09-15, extended 2026-09-29)
*
* - As a visitor or a search asks them ("Was kostet eine Website?"), and
*   answered in the first sentence — a question an answer engine lifts has to
*   stand on its own.
* - Each answered in one to three short sentences.
* - "du", no free and no timed first conversation, no price range — the one
*   sentence about the first conversation's cost is fixed
*   (`homeContent.test.ts`).
*
* ### Six on the home page, all of them on `/fragen`
*
* The home page prints the first SIX (`HOME_FAQ_COUNT`), which is the site's
* rule for how much a landing page may ask of a reader. The rest live on
* `/fragen` (`/en/questions`), grouped by `FAQ_GROUPS`, and the home page links
* there. The JSON-LD follows what is VISIBLE on each page: six on the home
* page, twelve on the questions page. Marking up an answer a page does not
* show is the one thing Google's FAQPage guidance forbids outright.
*
* So the ORDER of `items` is load-bearing: the first six are the six a visitor
* is most likely to arrive with. Adding a question means deciding whether it
* belongs in that six, not appending it.
*
* ### Facts in here that are Julian's, not mine
*
* `dauer`, `zugaenge`, `mitwirkung`, `digitalisierung`, `pflegen` and `ausfall`
* were written from his answers on 2026-09-29. Two constraints came with them:
* hosting is NOT mentioned anywhere (asked for explicitly), and `mitwirkung` is
* the one answer he has not confirmed — it promises the least it can while
* still being useful, and should be read before the next release.
*
* `intro` IS STILL PART OF THE SHAPE but is no longer rendered. It stays in the
* type and therefore in the `faq_v2` block schema so text an admin already
* saved keeps showing up in the editor. Do not delete it to "clean up".
*/
/**
* The questions page's route, per language. Code-owned like every other slug on
* this site: a CMS-controlled route key is a CMS-controlled 404.
*
* FULL paths, `/en` included — the same shape as `CREDENTIALS_SLUG` and
* `BUSINESS_CARD_SLUG`, because `SITEMAP_ENTRIES` reads these directly and
* `sitemap.test.ts` requires the English entry to start with `/en`. Do not run
* these through `localizePath`: it would produce `/en/en/questions`.
*/
var FAQ_PAGE_SLUG = {
	de: "/fragen",
	en: "/en/questions"
};
/**
* ISO date of the last change to the committed FAQ copy. Rendered as "Stand"
* on the questions page, published as its `dateModified`, and the entry's
* `lastmod` in the sitemap — the same three uses `ServiceDefinition.updatedAt`
* has. Raise it only when an answer changes; a panel override does not move it,
* because the panel cannot say when the copy it replaced was written.
*/
var FAQ_PAGE_UPDATED_AT = "2026-10-02";
/** The questions page, in one language. */
function faqPageHref(lang) {
	return FAQ_PAGE_SLUG[lang];
}
/** The three sections of the questions page, in the order they appear. */
var FAQ_GROUPS = [
	"takeover",
	"pricing",
	"cooperation"
];
/** The six the home page shows, in order. */
function homeFaqItems(content) {
	return content.items.slice(0, 6);
}
/** Every question, bucketed for the questions page. Empty groups are dropped. */
function groupedFaqItems(content) {
	return FAQ_GROUPS.map((group) => ({
		group,
		items: content.items.filter((item) => item.group === group)
	})).filter((section) => section.items.length > 0);
}
/** Headings for the questions page's three sections, and the page's own copy. */
function getFaqPageCopy(lang) {
	return lang === "de" ? {
		title: "Häufige Fragen",
		headline: "Alle",
		headlineAccent: "Fragen.",
		intro: "Übernahme, Preise und Zusammenarbeit – die Fragen, die mir am häufigsten gestellt werden.",
		answer: "Die Fragen auf dieser Seite beantwortet Julian Tracht selbst – Inhaber von Tracht Digital Solutions in Schwarzenbek bei Hamburg, tätig für Unternehmen in ganz Deutschland. Es geht um die Übernahme einer fremd gebauten Website, darum was ein Festpreis abdeckt, wie lange eine Umsetzung dauert und wer nach der Übergabe zuständig ist.",
		seoTitle: "Häufige Fragen zu Website, Preis und Ablauf — Tracht Digital",
		description: "Antworten zu Übernahme bestehender Seiten, Festpreisen, Dauer, Zugängen und laufender Betreuung. Kurz beantwortet, ohne Fachsprache.",
		groups: {
			takeover: "Übernahme und Umsetzung",
			pricing: "Preise und Dauer",
			cooperation: "Zusammenarbeit"
		},
		backLabel: "Zurück zur Startseite",
		ctaTitle: "Deine Frage war nicht dabei?",
		ctaText: "Schreib mir direkt – Antwort in der Regel innerhalb von 24 Stunden.",
		ctaButton: "Schreib mir"
	} : {
		title: "Common questions",
		headline: "All",
		headlineAccent: "questions.",
		intro: "Takeovers, pricing and working together – the questions I am asked most often.",
		answer: "The questions on this page are answered by Julian Tracht himself – owner of Tracht Digital Solutions in Schwarzenbek near Hamburg, working with companies across Germany. They cover taking over a site somebody else built, what a fixed price includes, how long a project runs and who is responsible after handover.",
		seoTitle: "Common Questions on Websites and Pricing — Tracht Digital",
		description: "Answers on taking over existing sites, fixed prices, timelines, logins and ongoing support. Answered briefly, without the jargon.",
		groups: {
			takeover: "Takeover and build",
			pricing: "Pricing and timelines",
			cooperation: "Working together"
		},
		backLabel: "Back to the home page",
		ctaTitle: "Your question was not here?",
		ctaText: "Write to me directly – I usually reply within 24 hours.",
		ctaButton: "Write to me"
	};
}
function getFaqContent(lang) {
	return lang === "de" ? {
		label: "— FAQ",
		headline: "Häufige",
		headlineAccent: "Fragen.",
		intro: "Die wichtigsten Fragen zu Zusammenarbeit, Verantwortung und Kosten – kurz beantwortet.",
		items: [
			{
				q: "Kannst du meine bestehende Website oder meinen Shop übernehmen?",
				a: "Ja, auch mit WordPress, WooCommerce, Shopware, TYPO3 oder bei STRATO. Ich behebe Fehler und pflege sie weiter.",
				group: "takeover"
			},
			{
				q: "Muss die Seite dafür neu gebaut werden?",
				a: "Meistens nicht. Was trägt, bleibt – neu gebaut wird nur, was sich nicht mehr reparieren lässt.",
				group: "takeover"
			},
			{
				q: "Was kostet eine Website oder ein Onlineshop?",
				a: "Drei Pakete haben einen Festpreis, sie stehen bei den Preisen. Alles andere bekommst du als eigenes Angebot.",
				group: "pricing"
			},
			{
				q: "Was kostet das Erstgespräch?",
				a: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
				group: "pricing"
			},
			{
				q: "Wie lange dauert es, bis meine Seite läuft?",
				a: "Das hängt vom Umfang ab, deshalb nenne ich keine Pauschale. Im Angebot steht ein verbindlicher Termin – vor der Zusage, nicht danach.",
				group: "pricing"
			},
			{
				q: "Wem gehören die Seite und die Zugänge?",
				a: "Dir. Du bekommst alle Zugänge, und bei der Übergabe gehört dir alles, was zur Seite gehört. Wenn du später zu jemand anderem willst, nimmst du es vollständig mit.",
				group: "cooperation"
			},
			{
				q: "Was heißt „Abläufe digitalisieren“ bei einem Betrieb wie meinem?",
				a: "Nenn mir einen Ablauf, der dich jede Woche Zeit kostet – Angebote, Terminvergabe, Rechnungen. Ich sage dir, was sich automatisieren lässt und was den Aufwand nicht wert ist. Auch wenn die Antwort lautet: so lassen.",
				group: "takeover"
			},
			{
				q: "Findet ChatGPT meine Seite – und kann man das beeinflussen?",
				a: "Ja, und ja. Antwortmaschinen lesen dieselbe Seite wie Google, achten aber auf anderes: eine klare Antwort gleich im ersten Absatz, Überschriften, die als Frage formuliert und im ersten Satz beantwortet sind, prüfbare Angaben mit Quelle, ein sichtbares Stand-Datum und einen genannten Autor. Dazu kommt eine technische Freigabe – wer die KI-Crawler aussperrt, verschwindet aus deren Antworten, ohne dass irgendwo ein Fehler erscheint. Das nennt sich GEO, und es ist kein zweites Projekt neben der Suchmaschinenoptimierung, sondern dieselbe Arbeit sauber gemacht. Eine Platzierung versprechen kann dir niemand.",
				group: "takeover"
			},
			{
				q: "Kann ich Texte und Bilder selbst ändern?",
				a: "Wie du willst. Möchtest du selbst ran, richte ich dir den Zugang ein und zeige es dir. Wenn nicht, schickst du mir die Änderung – das ist Teil der Pflege, kein Aufpreis.",
				group: "cooperation"
			},
			{
				q: "Was ist, wenn die Seite ausfällt?",
				a: "Melde dich, ich kümmere mich. Eine Seite, die offline ist, sehe ich mir auch am Wochenende an. Alles andere beantworte ich werktags, in der Regel am selben Tag.",
				group: "cooperation"
			},
			{
				q: "Was brauchst du von mir?",
				a: "Erst einmal nur das, was du schon hast: Texte, Bilder, Zugänge. Fehlt etwas, sage ich dir welches Material gebraucht wird – schreiben kann ich es auch.",
				group: "cooperation"
			},
			{
				q: "Arbeitest du mit meinen bisherigen Anbietern weiter?",
				a: "Wenn es sinnvoll ist, ja. Was gut läuft, bleibt.",
				group: "cooperation"
			},
			{
				q: "Bleibst du nach dem Start dabei?",
				a: "Auf Wunsch ja – nach Bedarf oder als festes Monatsmodell.",
				group: "cooperation"
			}
		]
	} : {
		label: "— FAQ",
		headline: "Common",
		headlineAccent: "questions.",
		intro: "The key questions about working together, ownership and pricing — answered briefly.",
		items: [
			{
				q: "Can you take over my existing website or shop?",
				a: "Yes, including WordPress, WooCommerce, Shopware, TYPO3 or STRATO. I fix errors and keep it maintained.",
				group: "takeover"
			},
			{
				q: "Does the site have to be rebuilt for that?",
				a: "Usually not. What holds up stays — only what cannot be repaired gets rebuilt.",
				group: "takeover"
			},
			{
				q: "What does a website or an online shop cost?",
				a: "Three packages have a fixed price, listed under Pricing. Everything else gets a quote of its own.",
				group: "pricing"
			},
			{
				q: "What does the first conversation cost?",
				a: "Costs only arise once we agree on an assignment.",
				group: "pricing"
			},
			{
				q: "How long until my site is live?",
				a: "That depends on the scope, so I do not quote a blanket figure. The quote carries a binding date — before you commit, not after.",
				group: "pricing"
			},
			{
				q: "Who owns the site and the logins?",
				a: "You do. You get every login, and at handover everything belonging to the site belongs to you. If you move to someone else later, you take all of it with you.",
				group: "cooperation"
			},
			{
				q: "What does “digitalizing workflows” mean for a business like mine?",
				a: "Name a routine that costs you time every week — quotes, scheduling, invoices. I will tell you what can be automated and what is not worth the effort. Including when the answer is: leave it as it is.",
				group: "takeover"
			},
			{
				q: "Does ChatGPT find my site – and can that be influenced?",
				a: "Yes, and yes. Answer engines read the same page Google does, but they weigh different things: a clear answer in the first paragraph, headings that are real questions, checkable facts with their sources, a visible date and a named author. On top of that comes a technical permission – shut the AI crawlers out and you disappear from their answers, with no error showing anywhere. It is called GEO, and it is not a second project beside search engine optimisation but the same work done properly. Nobody can promise you a placement.",
				group: "takeover"
			},
			{
				q: "Can I change text and images myself?",
				a: "However you prefer. If you want to do it yourself, I set up your access and show you how. If not, you send me the change — that is part of maintenance, not an extra.",
				group: "cooperation"
			},
			{
				q: "What happens if the site goes down?",
				a: "Get in touch and I will deal with it. A site that is offline I look at at the weekend too. Everything else I answer on weekdays, usually the same day.",
				group: "cooperation"
			},
			{
				q: "What do you need from me?",
				a: "To begin with, only what you already have: text, images, logins. If something is missing I tell you what material is needed — and I can write it as well.",
				group: "cooperation"
			},
			{
				q: "Will you keep working with my current suppliers?",
				a: "Where it makes sense, yes. What works stays.",
				group: "cooperation"
			},
			{
				q: "Do you stay involved after launch?",
				a: "If you want — as needed, or as a fixed monthly arrangement.",
				group: "cooperation"
			}
		]
	};
}
//#endregion
//#region src/lib/platforms.ts
/**
* Journal articles a platform page may point to, with committed link text.
*
* The labels are this site's words for the link, not the articles' titles
* (those are the blog's copy and addressed its readers formally): a link has
* to read right on a page that says "du".
*/
var JOURNAL_ARTICLES = {
	"website-fuenf-dinge-die-fehlen": {
		de: "Fünf Dinge, die auf vielen Websites fehlen",
		en: "Five things many websites are missing"
	},
	"lohnt-sich-ein-webshop": {
		de: "Lohnt sich ein Webshop für ein Ladengeschäft?",
		en: "Is an online shop worth it for a local business?"
	},
	"produktpflege-per-handy": {
		de: "Produktpflege muss nicht am Schreibtisch hängen",
		en: "Product upkeep does not have to be tied to a desk"
	},
	"konzept-vor-umsetzung": {
		de: "Warum ein Konzept billiger ist als ein zweiter Versuch",
		en: "Why a concept is cheaper than a second attempt"
	}
};
var COST = {
	de: {
		title: "Was kostet das?",
		text: "Du bekommst einen Festpreis oder ein eigenes Angebot, bevor ich anfange. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren."
	},
	en: {
		title: "What does it cost?",
		text: "You get a fixed price or a quote of your own before I start. Costs only arise once we agree on an assignment."
	}
};
var REFERENCES = {
	de: {
		headline: "Aus der Praxis",
		label: "Veröffentlicht nur mit Freigabe der Kunden."
	},
	en: {
		headline: "From practice",
		label: "Published only with the client's approval."
	}
};
/** Both shop pages answer the same question the same way. */
var SHOP_COMPARISON = {
	de: {
		title: "WooCommerce oder Shopware 6?",
		intro: "Kurz gesagt: WooCommerce erweitert WordPress, Shopware 6 ist ein eigenständiges Shopsystem. Entscheidend sind deine Website und dein Sortiment.",
		columns: [
			"Kriterium",
			"WooCommerce",
			"Shopware 6"
		],
		rows: [
			[
				"Grundlage",
				"Plugin für WordPress",
				"Eigenständiges Shopsystem"
			],
			[
				"Website und Shop",
				"Ein System mit deiner WordPress-Seite",
				"Inhalte über Erlebniswelten im Shop"
			],
			[
				"Gestaltung",
				"WordPress-Themes, anpassbar per Child-Theme",
				"Themes auf Basis von Storefront"
			],
			[
				"Lizenz",
				"Open Source",
				"Community Edition als Open Source, dazu kostenpflichtige Pläne"
			],
			[
				"Passt, wenn",
				"du schon WordPress nutzt",
				"der Shop das Herzstück ist, mit vielen Artikeln oder Kanälen"
			]
		]
	},
	en: {
		title: "WooCommerce or Shopware 6?",
		intro: "In short: WooCommerce extends WordPress, Shopware 6 is a standalone shop system. What matters most is your website and your catalogue.",
		columns: [
			"Criterion",
			"WooCommerce",
			"Shopware 6"
		],
		rows: [
			[
				"Basis",
				"WordPress plugin",
				"Standalone shop system"
			],
			[
				"Website and shop",
				"One system with your WordPress site",
				"Content via Shopping Experiences in the shop"
			],
			[
				"Design",
				"WordPress themes, customisable with a child theme",
				"Themes based on Storefront"
			],
			[
				"Licence",
				"Open source",
				"Community Edition as open source, plus paid plans"
			],
			[
				"Fits if",
				"you already use WordPress",
				"the shop is the core, with many products or channels"
			]
		]
	}
};
var same = (url) => ({
	de: url,
	en: url
});
var SOURCE = {
	childThemes: {
		label: {
			de: "WordPress-Entwicklerdoku: Child-Themes",
			en: "WordPress developer docs: child themes"
		},
		url: same("https://developer.wordpress.org/themes/advanced-topics/child-themes/")
	},
	wpThemes: {
		label: {
			de: "WordPress-Entwicklerdoku: Themes (Block- und klassische Themes)",
			en: "WordPress developer docs: themes (block and classic)"
		},
		url: same("https://developer.wordpress.org/themes/")
	},
	w3techs: {
		label: {
			de: "W3Techs: Verbreitung von WordPress (September 2026)",
			en: "W3Techs: WordPress usage statistics (September 2026)"
		},
		url: same("https://w3techs.com/technologies/details/cm-wordpress")
	},
	wooGithub: {
		label: {
			de: "WooCommerce auf GitHub (Quellcode und Lizenz)",
			en: "WooCommerce on GitHub (source code and licence)"
		},
		url: same("https://github.com/woocommerce/woocommerce")
	},
	shopwareGithub: {
		label: {
			de: "Shopware auf GitHub (Quellcode und Lizenz)",
			en: "Shopware on GitHub (source code and licence)"
		},
		url: same("https://github.com/shopware/shopware")
	},
	shopwareEol: {
		label: {
			de: "endoflife.date: Shopware-Versionen und Supportzeiträume",
			en: "endoflife.date: Shopware versions and support periods"
		},
		url: same("https://endoflife.date/shopware")
	},
	shopwareMigration: {
		label: {
			de: "Shopware: Migration von Shopware 5 zu Shopware 6",
			en: "Shopware: migrating from Shopware 5 to Shopware 6"
		},
		url: {
			de: "https://www.shopware.com/de/migration/shopware-5-zu-shopware-6/",
			en: "https://www.shopware.com/en/migration/shopware-5-to-shopware-6/"
		}
	},
	typo3News: {
		label: {
			de: "TYPO3 News: Supportende für TYPO3 v12 LTS",
			en: "TYPO3 News: end of support for TYPO3 v12 LTS"
		},
		url: same("https://news.typo3.com/article/typo3-v12-lts-end-of-free-support")
	},
	typo3Roadmap: {
		label: {
			de: "TYPO3: Roadmap und Supportzeiträume",
			en: "TYPO3: roadmap and support periods"
		},
		url: same("https://typo3.com/typo3-cms/development-roadmap/roadmap")
	},
	typo3Sitepackage: {
		label: {
			de: "TYPO3-Doku: Site-Package-Tutorial",
			en: "TYPO3 docs: site package tutorial"
		},
		url: same("https://docs.typo3.org/m/typo3/tutorial-sitepackage/main/en-us/")
	},
	stratoBuilder: {
		label: {
			de: "STRATO: Homepage-Baukasten",
			en: "STRATO: Homepage-Baukasten website builder (German)"
		},
		url: same("https://www.strato.de/homepage-baukasten/")
	},
	stratoWordpress: {
		label: {
			de: "STRATO: Hosting für WordPress",
			en: "STRATO: WordPress hosting (German)"
		},
		url: same("https://www.strato.de/hosting/wordpress-hosting/")
	}
};
var platformDefinitions = [
	{
		id: "woocommerce",
		name: "WooCommerce",
		kind: "shop",
		slug: "woocommerce",
		seoTitle: {
			de: "WooCommerce: Shop erstellen & Fehler beheben — Tracht Digital",
			en: "WooCommerce: Build, Fix and Theme Your Shop — Tracht Digital"
		},
		updatedAt: "2026-09-15",
		wikipedia: {
			de: "https://de.wikipedia.org/wiki/WooCommerce",
			en: "https://en.wikipedia.org/wiki/WooCommerce"
		},
		keywords: {
			de: [
				"Fehler beheben",
				"Shop erstellen",
				"Theme anpassen"
			],
			en: [
				"Fixing errors",
				"Building shops",
				"Themes"
			]
		},
		articleSlugs: ["lohnt-sich-ein-webshop", "produktpflege-per-handy"],
		sources: [
			SOURCE.childThemes,
			SOURCE.wooGithub,
			SOURCE.shopwareGithub
		],
		content: {
			de: {
				label: "Webauftritt",
				title: "WooCommerce-Shop erstellen, reparieren und anpassen",
				summary: "Ich baue deinen WooCommerce-Shop, behebe Fehler und passe dein Theme update-sicher an – aus Schwarzenbek bei Hamburg.",
				answer: "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Für WooCommerce richte ich Shops ein, behebe Fehler und passe Themes so an, dass Updates möglich bleiben. Du hast *einen festen Ansprechpartner*.",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Nach einem Update zeigt der Shop eine weiße Seite oder einen kritischen Fehler.",
					"Kunden brechen im Checkout ab, weil Zahlung oder Versand nicht funktionieren.",
					"Der Shop lädt langsam, und niemand weiß, warum."
				],
				offersTitle: "Das übernehme ich für deinen Shop",
				offers: [
					{
						id: "fehler-beheben",
						title: "WooCommerce-Fehler beheben",
						text: "Ich suche die Ursache, statt nur das Symptom zu überdecken.",
						points: [
							"Weiße Seite oder kritischer Fehler nach Updates",
							"Probleme in Warenkorb, Checkout oder Zahlung",
							"Plugin-Konflikte und langsame Ladezeiten"
						]
					},
					{
						id: "shop-erstellen",
						title: "WooCommerce-Shop erstellen",
						text: "Ich richte deinen Shop auf WordPress ein – bereit für den deutschen Markt.",
						points: [
							"WordPress und WooCommerce einrichten",
							"Produkte anlegen oder importieren",
							"Zahlung, Versand und rechtliche Grundlagen, z. B. mit Germanized"
						]
					},
					{
						id: "theme",
						title: "WooCommerce-Theme anpassen",
						text: "Änderungen kommen in ein Child-Theme – so bleiben Updates möglich.",
						points: [
							"Design passend zu deiner Marke",
							"Produktseiten, Kategorien und Warenkorb",
							"Für Handy und kurze Ladezeiten"
						]
					}
				],
				comparison: SHOP_COMPARISON.de,
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Dein Shop läuft wieder – und du weißt, woran es lag",
					"Kunden kommen ohne Hürden durch den Checkout",
					"Dein Design übersteht das nächste Update"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: [
					"Rechtstexte liefert eine Kanzlei oder ein Rechtstexte-Dienst – ich baue sie ein.",
					"Gebühren und Premium-Plugins zahlst du direkt an den Anbieter.",
					"Ich bin unabhängig und kein offizieller Partner von WooCommerce oder Automattic."
				],
				processTitle: "So läuft es ab",
				process: [
					"Du schilderst das Problem – gern mit Link",
					"Ich prüfe den Shop und nenne dir Ursache und Aufwand",
					"Ich teste Änderungen auf einer Kopie, dann gehen sie live"
				],
				costTitle: COST.de.title,
				costText: COST.de.text,
				referencesHeadline: REFERENCES.de.headline,
				referencesLabel: REFERENCES.de.label,
				faqTitle: "Häufige Fragen zu WooCommerce",
				faq: [
					{
						q: "Kannst du Fehler in meinem WooCommerce-Shop beheben?",
						a: "Ja. Ich finde die Ursache – meist ein Plugin, ein Update oder das Theme – und behebe sie."
					},
					{
						q: "Was kostet ein WooCommerce-Shop?",
						a: "Das hängt von Produkten, Zahlungsarten und Design ab. Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren."
					},
					{
						q: "Bleiben meine Anpassungen bei Theme-Updates erhalten?",
						a: "Ja, wenn sie in einem Child-Theme stehen. So baue ich sie ein."
					},
					{
						q: "Ist WooCommerce das richtige Shopsystem für mich?",
						a: "Ja, wenn du schon WordPress nutzt. Bei großen Sortimenten lohnt der Vergleich mit Shopware 6."
					}
				],
				ctaTitle: "Dein Shop braucht Hilfe?",
				ctaText: "Schreib mir kurz, was nicht läuft – gern mit Link.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "Web presence",
				title: "Build, fix and customise your WooCommerce shop",
				summary: "I build your WooCommerce shop, fix errors and customise your theme in an update-safe way – from Schwarzenbek near Hamburg.",
				answer: "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. For WooCommerce I set up shops, fix errors and customise themes so that updates stay possible. You get *one steady point of contact*.",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"After an update the shop shows a white page or a critical error.",
					"Customers abandon checkout because payment or shipping does not work.",
					"The shop loads slowly, and nobody knows why."
				],
				offersTitle: "What I take care of for your shop",
				offers: [
					{
						id: "fix-errors",
						title: "Fixing WooCommerce errors",
						text: "I look for the cause instead of covering up the symptom.",
						points: [
							"White page or critical error after updates",
							"Problems in cart, checkout or payment",
							"Plugin conflicts and slow loading times"
						]
					},
					{
						id: "build-shop",
						title: "Building a WooCommerce shop",
						text: "I set up your shop on WordPress – ready for the German market.",
						points: [
							"Setting up WordPress and WooCommerce",
							"Adding or importing products",
							"Payment, shipping and legal essentials, e.g. with Germanized"
						]
					},
					{
						id: "theme",
						title: "Customising your WooCommerce theme",
						text: "Changes go into a child theme – so updates stay possible.",
						points: [
							"A design that fits your brand",
							"Product pages, categories and cart",
							"Built for phones and short loading times"
						]
					}
				],
				comparison: SHOP_COMPARISON.en,
				outcomesTitle: "What you achieve",
				outcomes: [
					"Your shop works again – and you know what caused it",
					"Customers get through checkout without obstacles",
					"Your design survives the next update"
				],
				boundariesTitle: "What this does not cover",
				boundaries: [
					"Legal texts come from a law firm or a legal text service – I put them in place.",
					"Fees and premium plugins go to the provider directly.",
					"I work independently and am not an official partner of WooCommerce or Automattic."
				],
				processTitle: "How it works",
				process: [
					"You describe the problem – a link helps",
					"I review the shop and tell you the cause and the effort",
					"I test changes on a copy, then they go live"
				],
				costTitle: COST.en.title,
				costText: COST.en.text,
				referencesHeadline: REFERENCES.en.headline,
				referencesLabel: REFERENCES.en.label,
				faqTitle: "Common questions about WooCommerce",
				faq: [
					{
						q: "Can you fix errors in my WooCommerce shop?",
						a: "Yes. I find the cause – usually a plugin, an update or the theme – and fix it."
					},
					{
						q: "What does a WooCommerce shop cost?",
						a: "That depends on products, payment methods and design. Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment."
					},
					{
						q: "Will my customisations survive theme updates?",
						a: "Yes, if they live in a child theme. That is how I build them."
					},
					{
						q: "Is WooCommerce the right shop system for me?",
						a: "Yes, if you already use WordPress. With a large catalogue it is worth comparing Shopware 6."
					}
				],
				ctaTitle: "Does your shop need help?",
				ctaText: "Send me a short note on what is not working – a link helps.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	},
	{
		id: "shopware",
		name: "Shopware 6",
		kind: "shop",
		slug: "shopware",
		seoTitle: {
			de: "Shopware 6: Shop, Theme & Fehlerbehebung — Tracht Digital",
			en: "Shopware 6: Shops, Themes and Fixes — Tracht Digital"
		},
		updatedAt: "2026-09-15",
		wikipedia: {
			de: "https://de.wikipedia.org/wiki/Shopware",
			en: "https://en.wikipedia.org/wiki/Shopware"
		},
		keywords: {
			de: [
				"Fehler beheben",
				"Shop erstellen",
				"Theme anpassen",
				"Umstieg von Shopware 5"
			],
			en: [
				"Fixing errors",
				"Building shops",
				"Themes",
				"Moving from Shopware 5"
			]
		},
		articleSlugs: ["lohnt-sich-ein-webshop", "produktpflege-per-handy"],
		sources: [
			SOURCE.shopwareEol,
			SOURCE.shopwareMigration,
			SOURCE.shopwareGithub,
			SOURCE.wooGithub
		],
		content: {
			de: {
				label: "Webauftritt",
				title: "Shopware-6-Shop erstellen, reparieren und anpassen",
				summary: "Ich richte deinen Shopware-6-Shop ein, behebe Fehler nach Updates und baue Themes – auch beim Umstieg von Shopware 5.",
				answer: "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Für Shopware 6 richte ich Shops ein, behebe Fehler und baue Themes. Ich begleite auch den Umstieg von Shopware 5, dessen Sicherheitsupdates *am 31. Juli 2024 endeten*.",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Nach einem Update lädt die Storefront oder die Administration nicht mehr richtig.",
					"Eine Erweiterung verträgt sich nicht mit der neuen Version.",
					"Dein Shop läuft noch auf Shopware 5 – ohne Sicherheitsupdates."
				],
				offersTitle: "Das übernehme ich für deinen Shop",
				offers: [
					{
						id: "fehler-beheben",
						title: "Shopware-6-Fehler beheben",
						text: "Ich grenze Fehler systematisch ein und behebe die Ursache.",
						points: [
							"Fehler nach Updates",
							"Konflikte zwischen Erweiterungen",
							"Probleme bei Checkout, Zahlung oder Versand"
						]
					},
					{
						id: "shop-erstellen",
						title: "Shopware-6-Shop erstellen",
						text: "Ich richte deinen Shop ein – oder ziehe ihn von Shopware 5 um.",
						points: [
							"Einrichtung und Verkaufskanäle",
							"Produkte anlegen oder importieren",
							"Umstieg mit dem Migrationsassistenten"
						]
					},
					{
						id: "theme",
						title: "Shopware-6-Theme anpassen",
						text: "Dein Theme baut auf Storefront auf. So bleiben Updates möglich.",
						points: [
							"Eigenes Theme statt Änderungen am Kern",
							"Farben, Schriften und Layout nach deiner Marke",
							"Erlebniswelten für Startseite und Aktionen"
						]
					}
				],
				comparison: SHOP_COMPARISON.de,
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Dein Shop läuft auf einer unterstützten Version",
					"Updates sind wieder planbar",
					"Dein Design passt zur Marke und übersteht Updates"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: [
					"Lizenzen für Shopware-Pläne und Erweiterungen zahlst du direkt an den Anbieter.",
					"Beim Umstieg von Shopware 5 ziehen die Daten um, Theme und Erweiterungen entstehen neu.",
					"Ich bin unabhängig und kein offizieller Shopware-Partner."
				],
				processTitle: "So läuft es ab",
				process: [
					"Du schilderst das Problem – mit Shop-Version, wenn du sie kennst",
					"Ich prüfe den Shop und nenne dir Ursache und Aufwand",
					"Ich teste Updates auf einer Kopie, dann gehen sie live"
				],
				costTitle: COST.de.title,
				costText: COST.de.text,
				referencesHeadline: REFERENCES.de.headline,
				referencesLabel: REFERENCES.de.label,
				faqTitle: "Häufige Fragen zu Shopware 6",
				faq: [
					{
						q: "Shopware 5 bekommt keine Sicherheitsupdates mehr – was jetzt?",
						a: "Die Sicherheitsupdates endeten am 31. Juli 2024. Sinnvoll ist der Umstieg auf Shopware 6: Die Daten ziehen mit dem Migrationsassistenten um, Theme und Erweiterungen entstehen neu."
					},
					{
						q: "Kannst du Fehler nach einem Shopware-Update beheben?",
						a: "Ja. Ich finde heraus, ob Update, Erweiterung oder Theme den Fehler auslöst, und behebe die Ursache."
					},
					{
						q: "Was kostet ein Shopware-6-Shop?",
						a: "Das hängt von Sortiment, Design und Erweiterungen ab. Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren."
					},
					{
						q: "Ist Shopware 6 besser als WooCommerce?",
						a: "Nicht besser, sondern anders: Shopware 6 ist ein eigenständiges Shopsystem, WooCommerce erweitert WordPress."
					}
				],
				ctaTitle: "Dein Shopware-Shop braucht Hilfe?",
				ctaText: "Schreib mir kurz, was nicht läuft – gern mit Shop-Version und Link.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "Web presence",
				title: "Build, fix and customise your Shopware 6 shop",
				summary: "I set up your Shopware 6 shop, fix errors after updates and build themes – including the move from Shopware 5.",
				answer: "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. For Shopware 6 I set up shops, fix errors and build themes. I also handle the move from Shopware 5, whose security updates *ended on 31 July 2024*.",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"After an update the storefront or the administration no longer loads properly.",
					"An extension does not work with the new version.",
					"Your shop still runs on Shopware 5 – without security updates."
				],
				offersTitle: "What I take care of for your shop",
				offers: [
					{
						id: "fix-errors",
						title: "Fixing Shopware 6 errors",
						text: "I narrow errors down systematically and fix the cause.",
						points: [
							"Errors after updates",
							"Conflicts between extensions",
							"Problems with checkout, payment or shipping"
						]
					},
					{
						id: "build-shop",
						title: "Building a Shopware 6 shop",
						text: "I set up your shop – or move it over from Shopware 5.",
						points: [
							"Setup and sales channels",
							"Adding or importing products",
							"Moving with the migration assistant"
						]
					},
					{
						id: "theme",
						title: "Customising your Shopware 6 theme",
						text: "Your theme builds on Storefront. That keeps updates possible.",
						points: [
							"A theme of your own instead of changes to the core",
							"Colours, fonts and layout to match your brand",
							"Shopping Experiences for the home page and promotions"
						]
					}
				],
				comparison: SHOP_COMPARISON.en,
				outcomesTitle: "What you achieve",
				outcomes: [
					"Your shop runs on a supported version",
					"Updates are plannable again",
					"Your design fits your brand and survives updates"
				],
				boundariesTitle: "What this does not cover",
				boundaries: [
					"Licences for Shopware plans and extensions go to the provider directly.",
					"Moving from Shopware 5 carries the data across; theme and extensions are rebuilt.",
					"I work independently and am not an official Shopware partner."
				],
				processTitle: "How it works",
				process: [
					"You describe the problem – with the shop version if you know it",
					"I review the shop and tell you the cause and the effort",
					"I test updates on a copy, then they go live"
				],
				costTitle: COST.en.title,
				costText: COST.en.text,
				referencesHeadline: REFERENCES.en.headline,
				referencesLabel: REFERENCES.en.label,
				faqTitle: "Common questions about Shopware 6",
				faq: [
					{
						q: "Shopware 5 no longer gets security updates – what now?",
						a: "Security updates ended on 31 July 2024. Moving to Shopware 6 makes sense: the data moves with the migration assistant, while theme and extensions are rebuilt."
					},
					{
						q: "Can you fix errors after a Shopware update?",
						a: "Yes. I find out whether the update, an extension or the theme triggers the error and fix the cause."
					},
					{
						q: "What does a Shopware 6 shop cost?",
						a: "That depends on catalogue, design and extensions. Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment."
					},
					{
						q: "Is Shopware 6 better than WooCommerce?",
						a: "Not better, different: Shopware 6 is a standalone shop system, WooCommerce extends WordPress."
					}
				],
				ctaTitle: "Does your Shopware shop need help?",
				ctaText: "Send me a short note on what is not working – shop version and a link help.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	},
	{
		id: "wordpress",
		name: "WordPress",
		kind: "cms",
		slug: "wordpress",
		seoTitle: {
			de: "WordPress: Website, Wartung & Fehlerhilfe — Tracht Digital",
			en: "WordPress: Websites, Maintenance and Fixes — Tracht Digital"
		},
		updatedAt: "2026-09-15",
		wikipedia: {
			de: "https://de.wikipedia.org/wiki/WordPress",
			en: "https://en.wikipedia.org/wiki/WordPress"
		},
		keywords: {
			de: [
				"Fehler & Wartung",
				"Relaunch",
				"Themes",
				"Umzug"
			],
			en: [
				"Errors & maintenance",
				"Relaunch",
				"Themes",
				"Migration"
			]
		},
		articleSlugs: ["website-fuenf-dinge-die-fehlen", "konzept-vor-umsetzung"],
		sources: [
			SOURCE.w3techs,
			SOURCE.childThemes,
			SOURCE.wpThemes
		],
		content: {
			de: {
				label: "Webauftritt",
				title: "WordPress-Website erstellen, reparieren und pflegen",
				summary: "Ich baue deine WordPress-Website, behebe Fehler, passe dein Theme an und übernehme Updates und Pflege – aus Schwarzenbek bei Hamburg.",
				answer: "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Ich betreue WordPress-Websites: Fehler beheben, Updates, neue Seiten, Themes und Umzüge. WordPress läuft laut W3Techs auf *40,3 % aller Websites* (September 2026).",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Statt deiner Seite erscheint eine weiße Seite oder ein kritischer Fehler.",
					"Updates stehen seit Monaten aus, weil danach etwas kaputtgehen könnte.",
					"Die Seite ist veraltet, langsam oder auf dem Handy schwer zu bedienen."
				],
				offersTitle: "Das übernehme ich für deine Website",
				offers: [
					{
						id: "fehler-beheben",
						title: "Fehler beheben und Wartung",
						text: "Ich finde die Ursache und halte deine Seite danach aktuell.",
						points: [
							"Weiße Seite oder Fehler nach Updates",
							"Updates von WordPress, Themes und Plugins",
							"Sicherung vor jedem Eingriff"
						]
					},
					{
						id: "relaunch",
						title: "Neue Website oder Relaunch",
						text: "Ich baue deine Seite neu oder überarbeite sie – mit klarer Struktur.",
						points: [
							"Seiten und Inhalte ordnen",
							"Für Handy und Bildschirm",
							"Grundlagen für Google"
						]
					},
					{
						id: "theme",
						title: "Themes und Templates",
						text: "Anpassungen kommen in ein Child-Theme – so bleiben sie bei Updates erhalten.",
						points: [
							"Bestehendes Theme anpassen",
							"Block-Themes und klassische Themes",
							"Eigenes Theme nach deinem Design"
						]
					},
					{
						id: "umzug",
						title: "Umzug und Upgrades",
						text: "Ich ziehe deine Seite um – mit Domain, E-Mail und Weiterleitungen.",
						points: [
							"Vom Baukasten zu WordPress",
							"Umzug zu einem anderen Hoster",
							"Aktuelle PHP-Version"
						]
					}
				],
				comparison: {
					title: "Block-Theme oder klassisches Theme?",
					intro: "Kurz gesagt: Block-Themes bearbeitest du direkt im Website-Editor, klassische Themes über PHP-Vorlagen und den Customizer.",
					columns: [
						"Kriterium",
						"Block-Theme",
						"Klassisches Theme"
					],
					rows: [
						[
							"Aufbau",
							"Vorlagen aus Blöcken, Einstellungen in der theme.json",
							"PHP-Vorlagen, Einstellungen im Customizer"
						],
						[
							"Bearbeiten",
							"Kopf, Fuß und Vorlagen im Website-Editor",
							"Vieles nur im Code oder in Theme-Optionen"
						],
						[
							"Update-sicher anpassen",
							"Eigene Styles und Vorlagen, bei Bedarf Child-Theme",
							"Child-Theme"
						],
						[
							"Passt, wenn",
							"du Layout und Inhalte selbst anpassen willst",
							"eine bestehende Seite stabil weiterlaufen soll"
						]
					]
				},
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Deine Seite läuft wieder – und bleibt aktuell",
					"Updates mit Sicherung vorher",
					"Eine Seite, die auf dem Handy funktioniert"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: [
					"Texte, Bilder und Rechtstexte brauchen deine Zuarbeit.",
					"Hosting, Domain und Premium-Plugins zahlst du direkt an den Anbieter.",
					"Ich bin unabhängig und nicht mit WordPress.org oder Automattic verbunden."
				],
				processTitle: "So läuft es ab",
				process: [
					"Du schilderst das Problem – ein Link genügt",
					"Ich prüfe die Seite und nenne dir Ursache und Aufwand",
					"Vor jedem Eingriff lege ich eine Sicherung an"
				],
				costTitle: COST.de.title,
				costText: COST.de.text,
				referencesHeadline: REFERENCES.de.headline,
				referencesLabel: REFERENCES.de.label,
				faqTitle: "Häufige Fragen zu WordPress",
				faq: [
					{
						q: "Meine WordPress-Seite zeigt einen kritischen Fehler – was tun?",
						a: "Meist steckt ein Plugin, das Theme oder ein Update dahinter. Ich finde die Ursache und bringe die Seite wieder zum Laufen."
					},
					{
						q: "Übernimmst du Updates und Wartung?",
						a: "Ja. Ich halte WordPress, Themes und Plugins aktuell und sichere vorher – nach Bedarf oder als Monatsmodell."
					},
					{
						q: "Was kostet eine WordPress-Website?",
						a: "Das hängt von Umfang und Funktionen ab. Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren."
					},
					{
						q: "Kannst du meine Seite von einem Baukasten zu WordPress umziehen?",
						a: "Ja. Ich übernehme Inhalte und Bilder und richte Weiterleitungen ein, damit alte Links funktionieren."
					}
				],
				ctaTitle: "Deine WordPress-Seite braucht Hilfe?",
				ctaText: "Schreib mir kurz, was nicht läuft – ein Link genügt.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "Web presence",
				title: "Build, fix and maintain your WordPress website",
				summary: "I build your WordPress website, fix errors, customise your theme and take care of updates and upkeep – from Schwarzenbek near Hamburg.",
				answer: "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. I look after WordPress websites: fixing errors, updates, new sites, themes and migrations. According to W3Techs, WordPress runs *40.3% of all websites* (September 2026).",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"Instead of your site you get a white page or a critical error.",
					"Updates have been waiting for months because something might break.",
					"The site is outdated, slow or hard to use on a phone."
				],
				offersTitle: "What I take care of for your website",
				offers: [
					{
						id: "fix-errors",
						title: "Fixing errors and maintenance",
						text: "I find the cause and keep your site up to date afterwards.",
						points: [
							"White page or errors after updates",
							"Updates of WordPress, themes and plugins",
							"A backup before every change"
						]
					},
					{
						id: "relaunch",
						title: "New website or relaunch",
						text: "I rebuild your site or rework it – with a clear structure.",
						points: [
							"Ordering pages and content",
							"Built for phones and screens",
							"Search essentials"
						]
					},
					{
						id: "theme",
						title: "Themes and templates",
						text: "Customisations go into a child theme – so they survive updates.",
						points: [
							"Customising an existing theme",
							"Block themes and classic themes",
							"A theme of your own, built to your design"
						]
					},
					{
						id: "migration",
						title: "Migrations and upgrades",
						text: "I move your site – with domain, email and redirects.",
						points: [
							"From a site builder to WordPress",
							"Moving to another host",
							"A current PHP version"
						]
					}
				],
				comparison: {
					title: "Block theme or classic theme?",
					intro: "In short: block themes are edited right in the Site Editor, classic themes through PHP templates and the Customizer.",
					columns: [
						"Criterion",
						"Block theme",
						"Classic theme"
					],
					rows: [
						[
							"Structure",
							"Templates made of blocks, settings in theme.json",
							"PHP templates, settings in the Customizer"
						],
						[
							"Editing",
							"Header, footer and templates in the Site Editor",
							"Much of it only in code or theme options"
						],
						[
							"Update-safe changes",
							"Your own styles and templates, a child theme if needed",
							"Child theme"
						],
						[
							"Fits if",
							"you want to adjust layout and content yourself",
							"an existing site should keep running reliably"
						]
					]
				},
				outcomesTitle: "What you achieve",
				outcomes: [
					"Your site works again – and stays up to date",
					"Updates with a backup first",
					"A site that works on phones"
				],
				boundariesTitle: "What this does not cover",
				boundaries: [
					"Copy, images and legal texts need your input.",
					"Hosting, domain and premium plugins go to the provider directly.",
					"I work independently and am not affiliated with WordPress.org or Automattic."
				],
				processTitle: "How it works",
				process: [
					"You describe the problem – a link is enough",
					"I review the site and tell you the cause and the effort",
					"I make a backup before every change"
				],
				costTitle: COST.en.title,
				costText: COST.en.text,
				referencesHeadline: REFERENCES.en.headline,
				referencesLabel: REFERENCES.en.label,
				faqTitle: "Common questions about WordPress",
				faq: [
					{
						q: "My WordPress site shows a critical error – what should I do?",
						a: "Usually a plugin, the theme or an update is behind it. I find the cause and get the site running again."
					},
					{
						q: "Do you take care of updates and maintenance?",
						a: "Yes. I keep WordPress, themes and plugins up to date and back up first – as needed or as a monthly arrangement."
					},
					{
						q: "What does a WordPress website cost?",
						a: "That depends on scope and features. Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment."
					},
					{
						q: "Can you move my site from a site builder to WordPress?",
						a: "Yes. I carry over content and images and set up redirects so old links keep working."
					}
				],
				ctaTitle: "Does your WordPress site need help?",
				ctaText: "Send me a short note on what is not working – a link is enough.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	},
	{
		id: "typo3",
		name: "TYPO3",
		kind: "cms",
		slug: "typo3",
		seoTitle: {
			de: "TYPO3: Update, Relaunch & Wartung — Tracht Digital",
			en: "TYPO3: Upgrades, Relaunches and Maintenance — Tracht Digital"
		},
		updatedAt: "2026-09-15",
		wikipedia: {
			de: "https://de.wikipedia.org/wiki/TYPO3",
			en: "https://en.wikipedia.org/wiki/TYPO3"
		},
		keywords: {
			de: [
				"Fehler & Wartung",
				"Relaunch",
				"Templates",
				"Upgrade"
			],
			en: [
				"Errors & maintenance",
				"Relaunch",
				"Templates",
				"Upgrades"
			]
		},
		articleSlugs: ["website-fuenf-dinge-die-fehlen", "konzept-vor-umsetzung"],
		sources: [
			SOURCE.typo3News,
			SOURCE.typo3Roadmap,
			SOURCE.typo3Sitepackage
		],
		content: {
			de: {
				label: "Webauftritt",
				title: "TYPO3-Website updaten, reparieren und pflegen",
				summary: "Ich bringe deine TYPO3-Website auf eine unterstützte Version, behebe Fehler und übernehme die Pflege – aus Schwarzenbek bei Hamburg.",
				answer: "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Ich betreue TYPO3-Websites: Upgrades, Fehlerbehebung, Templates und Relaunches. Wichtig: TYPO3 v12 bekommt *seit dem 1. Mai 2026 keine Community-Updates mehr*.",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Deine Seite läuft noch auf TYPO3 v12 oder älter.",
					"Nach einem Update funktioniert eine Extension nicht mehr.",
					"Die Agentur, die die Seite gebaut hat, betreut sie nicht mehr."
				],
				offersTitle: "Das übernehme ich für deine TYPO3-Seite",
				offers: [
					{
						id: "fehler-beheben",
						title: "Fehler beheben und Wartung",
						text: "Ich finde Fehler und halte TYPO3 mit Sicherheitsupdates aktuell.",
						points: [
							"Fehler im Backend oder Frontend",
							"Extensions nach Updates reparieren",
							"Sicherung vor jedem Eingriff"
						]
					},
					{
						id: "relaunch",
						title: "Neue Website oder Relaunch",
						text: "Ich setze deine Seite neu auf – mit aktuellem TYPO3 und einem Backend, das deine Redaktion gut bedienen kann.",
						points: [
							"Seitenbaum und Inhalte neu ordnen",
							"Für Handy und Bildschirm",
							"Weiterleitungen für alte Adressen"
						]
					},
					{
						id: "templates",
						title: "Templates und Extensions",
						text: "Templates baue ich in einem eigenen Site-Package – getrennt vom TYPO3-Kern.",
						points: [
							"Fluid-Templates im Site-Package",
							"Extensions prüfen, anpassen oder ersetzen",
							"Eigene Inhaltselemente für deine Redaktion"
						]
					},
					{
						id: "upgrade",
						title: "Upgrades und Umzug",
						text: "Ich hebe deine Installation Schritt für Schritt auf eine aktuelle LTS-Version.",
						points: [
							"Upgrade auf TYPO3 v13 oder v14 LTS",
							"Extensions vorher prüfen",
							"Umzug auf einen neuen Server"
						]
					}
				],
				comparison: {
					title: "TYPO3-Versionen und ihr Support",
					intro: "Kurz gesagt: TYPO3 v12 bekommt seit Mai 2026 keine Community-Updates mehr. Unterstützt werden v13 LTS und v14 LTS.",
					columns: [
						"Version",
						"Stand",
						"Was das für dich heißt"
					],
					rows: [
						[
							"TYPO3 v11 LTS",
							"Community-Support endete im Oktober 2024",
							"Upgrade dringend einplanen"
						],
						[
							"TYPO3 v12 LTS",
							"Seit dem 1. Mai 2026 keine Community-Updates",
							"Upgrade planen oder übergangsweise kostenpflichtiges ELTS"
						],
						[
							"TYPO3 v13 LTS",
							"Sicherheitsupdates bis Ende 2027",
							"Unterstützt – nächster Schritt ist v14"
						],
						[
							"TYPO3 v14 LTS",
							"Sicherheitsupdates bis Juni 2029",
							"Aktuelle Version für neue Projekte"
						]
					]
				},
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Deine Seite läuft auf einer unterstützten Version",
					"Sicherheitsupdates kommen wieder regelmäßig",
					"Ein Ansprechpartner, auch ohne die alte Agentur"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: [
					"ELTS und Premium-Extensions zahlst du direkt an den Anbieter.",
					"Sehr alte Extensions ersetze ich nach Absprache.",
					"Ich bin unabhängig und kein offizieller TYPO3-Partner."
				],
				processTitle: "So läuft es ab",
				process: [
					"Du schickst mir Link und TYPO3-Version",
					"Ich prüfe die Installation und nenne dir Weg und Aufwand",
					"Ich baue das Upgrade auf einer Kopie und teste es"
				],
				costTitle: COST.de.title,
				costText: COST.de.text,
				referencesHeadline: REFERENCES.de.headline,
				referencesLabel: REFERENCES.de.label,
				faqTitle: "Häufige Fragen zu TYPO3",
				faq: [
					{
						q: "Muss ich von TYPO3 v12 upgraden?",
						a: "Ja, möglichst bald: Seit dem 1. Mai 2026 gibt es keine Community-Updates mehr für v12. Kostenpflichtiges ELTS verschafft Zeit, ersetzt das Upgrade aber nicht."
					},
					{
						q: "Funktionieren meine Extensions nach dem Upgrade noch?",
						a: "Das prüfe ich vorher für jede Extension. Was nicht mehr gepflegt wird, passe ich an oder ersetze es."
					},
					{
						q: "Was kostet ein TYPO3-Upgrade?",
						a: "Das hängt von Version, Extensions und Templates ab. Nach der Prüfung nenne ich dir Aufwand oder Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren."
					},
					{
						q: "Übernimmst du TYPO3-Seiten einer anderen Agentur?",
						a: "Ja. Ich verschaffe mir einen Überblick und kümmere mich dann um Fehler, Updates und Weiterentwicklung."
					}
				],
				ctaTitle: "Deine TYPO3-Seite braucht ein Update?",
				ctaText: "Schick mir Link und TYPO3-Version – ich sage dir, welcher Weg sinnvoll ist.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "Web presence",
				title: "Upgrade, fix and maintain your TYPO3 website",
				summary: "I bring your TYPO3 website onto a supported version, fix errors and take over the upkeep – from Schwarzenbek near Hamburg.",
				answer: "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. I look after TYPO3 websites: upgrades, fixing errors, templates and relaunches. Important: TYPO3 v12 has had *no community updates since 1 May 2026*.",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"Your site still runs on TYPO3 v12 or older.",
					"An extension stopped working after an update.",
					"The agency that built the site no longer looks after it."
				],
				offersTitle: "What I take care of for your TYPO3 site",
				offers: [
					{
						id: "fix-errors",
						title: "Fixing errors and maintenance",
						text: "I find errors and keep TYPO3 up to date with security updates.",
						points: [
							"Errors in backend or frontend",
							"Repairing extensions after updates",
							"A backup before every change"
						]
					},
					{
						id: "relaunch",
						title: "New website or relaunch",
						text: "I rebuild your site – on current TYPO3, with a backend your editors can work with.",
						points: [
							"Reorganising the page tree and content",
							"Built for phones and screens",
							"Redirects for old addresses"
						]
					},
					{
						id: "templates",
						title: "Templates and extensions",
						text: "I build templates in a site package of their own – separate from the TYPO3 core.",
						points: [
							"Fluid templates in a site package",
							"Checking, adapting or replacing extensions",
							"Custom content elements for your editors"
						]
					},
					{
						id: "upgrade",
						title: "Upgrades and migrations",
						text: "I raise your installation step by step to a current LTS version.",
						points: [
							"Upgrading to TYPO3 v13 or v14 LTS",
							"Checking extensions first",
							"Moving to a new server"
						]
					}
				],
				comparison: {
					title: "TYPO3 versions and their support",
					intro: "In short: TYPO3 v12 has had no community updates since May 2026. v13 LTS and v14 LTS are supported.",
					columns: [
						"Version",
						"Status",
						"What it means for you"
					],
					rows: [
						[
							"TYPO3 v11 LTS",
							"Community support ended in October 2024",
							"Plan the upgrade urgently"
						],
						[
							"TYPO3 v12 LTS",
							"No community updates since 1 May 2026",
							"Plan the upgrade or use paid ELTS for now"
						],
						[
							"TYPO3 v13 LTS",
							"Security updates until the end of 2027",
							"Supported – the next step is v14"
						],
						[
							"TYPO3 v14 LTS",
							"Security updates until June 2029",
							"The current version for new projects"
						]
					]
				},
				outcomesTitle: "What you achieve",
				outcomes: [
					"Your site runs on a supported version",
					"Security updates arrive regularly again",
					"One point of contact, even without the old agency"
				],
				boundariesTitle: "What this does not cover",
				boundaries: [
					"ELTS and premium extensions go to the provider directly.",
					"I replace very old extensions after we agree.",
					"I work independently and am not an official TYPO3 partner."
				],
				processTitle: "How it works",
				process: [
					"You send me the link and the TYPO3 version",
					"I review the installation and tell you the way forward and the effort",
					"I build the upgrade on a copy and test it"
				],
				costTitle: COST.en.title,
				costText: COST.en.text,
				referencesHeadline: REFERENCES.en.headline,
				referencesLabel: REFERENCES.en.label,
				faqTitle: "Common questions about TYPO3",
				faq: [
					{
						q: "Do I need to upgrade from TYPO3 v12?",
						a: "Yes, as soon as you can: there have been no community updates for v12 since 1 May 2026. Paid ELTS buys time but does not replace the upgrade."
					},
					{
						q: "Will my extensions still work after the upgrade?",
						a: "I check every extension beforehand. Whatever is no longer maintained I adapt or replace."
					},
					{
						q: "What does a TYPO3 upgrade cost?",
						a: "That depends on the version, extensions and templates. After the review I tell you the effort or a fixed price. Costs only arise once we agree on an assignment."
					},
					{
						q: "Do you take over TYPO3 sites from another agency?",
						a: "Yes. I get an overview first, then take care of errors, updates and further development."
					}
				],
				ctaTitle: "Does your TYPO3 site need an upgrade?",
				ctaText: "Send me the link and the TYPO3 version – I will tell you which way makes sense.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	},
	{
		id: "strato",
		name: "STRATO",
		kind: "builder",
		slug: "strato",
		seoTitle: {
			de: "STRATO-Website: Hilfe & Umzug zu WordPress — Tracht Digital",
			en: "STRATO Websites: Help and Moving to WordPress — Tracht Digital"
		},
		updatedAt: "2026-09-15",
		wikipedia: {
			de: "https://de.wikipedia.org/wiki/Strato_AG",
			en: "https://en.wikipedia.org/wiki/Strato_AG"
		},
		keywords: {
			de: [
				"Baukasten-Hilfe",
				"Relaunch",
				"Gestaltung",
				"Umzug zu WordPress"
			],
			en: [
				"Builder help",
				"Relaunch",
				"Design",
				"Moving to WordPress"
			]
		},
		articleSlugs: ["website-fuenf-dinge-die-fehlen", "konzept-vor-umsetzung"],
		sources: [
			SOURCE.stratoBuilder,
			SOURCE.stratoWordpress,
			SOURCE.childThemes
		],
		content: {
			de: {
				label: "Webauftritt",
				title: "Hilfe für deine STRATO-Website – vom Baukasten bis WordPress",
				summary: "Homepage-Baukasten oder WordPress bei STRATO? Ich helfe bei Aufbau, Fehlern und Design – und beim Umzug zu WordPress.",
				answer: "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Ich helfe dir mit deiner Website bei STRATO – ob Homepage-Baukasten oder WordPress: bei Aufbau, Fehlern und Gestaltung und *beim Umzug zu WordPress*.",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Der Homepage-Baukasten ist eingerichtet, aber die Seite wirkt nicht professionell.",
					"Deine WordPress-Seite bei STRATO zeigt Fehler oder lädt langsam.",
					"Der Baukasten kann nicht, was du brauchst."
				],
				offersTitle: "Das übernehme ich für deine Website",
				offers: [
					{
						id: "fehler-beheben",
						title: "Fehler beheben und Pflege",
						text: "Ich helfe bei Problemen mit Baukasten, WordPress und Einstellungen.",
						points: [
							"Menüs und Seitenstruktur im Baukasten",
							"Fehler und Updates bei WordPress",
							"Domain, SSL und E-Mail prüfen"
						]
					},
					{
						id: "relaunch",
						title: "Neue Website oder Relaunch",
						text: "Ich baue deine Seite im Baukasten neu auf oder setze sie mit WordPress um.",
						points: [
							"Struktur und Inhalte ordnen",
							"Gestaltung passend zu deinem Betrieb",
							"Für Handy und Bildschirm"
						]
					},
					{
						id: "vorlagen",
						title: "Vorlagen und Gestaltung",
						text: "Ich passe Vorlage, Farben, Schriften und Bilder an – bei WordPress mit einem Child-Theme.",
						points: [
							"Passende Vorlage auswählen",
							"Farben und Schriften nach deiner Marke",
							"Einheitliche Seiten statt Flickenteppich"
						]
					},
					{
						id: "umzug",
						title: "Umzug zu WordPress",
						text: "Wenn der Baukasten an Grenzen stößt, ziehe ich deine Seite zu WordPress um.",
						points: [
							"Inhalte und Bilder übernehmen",
							"Domain und E-Mail mitnehmen",
							"Weiterleitungen für alte Adressen"
						]
					}
				],
				comparison: {
					title: "STRATO Homepage-Baukasten oder WordPress?",
					intro: "Kurz gesagt: Der Baukasten bringt Vorlagen und Technik fertig mit. WordPress bietet mehr Gestaltung und Funktionen, braucht aber Pflege.",
					columns: [
						"Kriterium",
						"Homepage-Baukasten",
						"WordPress, z. B. mit Hosting für WordPress"
					],
					rows: [
						[
							"Einstieg",
							"Vorlage wählen und Inhalte einfügen",
							"Theme, Plugins und Struktur einrichten"
						],
						[
							"Technik",
							"STRATO kümmert sich um die Technik",
							"Braucht Updates – Hosting für WordPress aktualisiert WordPress automatisch"
						],
						[
							"Gestaltung",
							"Vorlagen des Baukastens",
							"Viele Themes oder ein eigenes Design"
						],
						[
							"Shop",
							"Über den SmartWebshop",
							"Über Plugins, z. B. WooCommerce"
						],
						[
							"Passt, wenn",
							"du schnell eine übersichtliche Seite willst",
							"du mehr Gestaltung oder Funktionen brauchst"
						]
					]
				},
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Deine Seite wirkt professionell",
					"Fehler sind behoben, und du weißt, woran es lag",
					"Ein Umzug zu WordPress, bei dem Domain und E-Mail mitkommen"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: [
					"Verträge und Tarife bleiben bei STRATO.",
					"Nicht jede Baukasten-Funktion lässt sich eins zu eins nachbauen – das klären wir vorher.",
					"Ich bin unabhängig und kein Partner von STRATO."
				],
				processTitle: "So läuft es ab",
				process: [
					"Du schilderst, was du nutzt und was nicht klappt – ein Link genügt",
					"Ich schaue mir die Seite an und nenne dir Weg und Aufwand",
					"Vor einem Umzug sichere ich alle Inhalte"
				],
				costTitle: COST.de.title,
				costText: COST.de.text,
				referencesHeadline: REFERENCES.de.headline,
				referencesLabel: REFERENCES.de.label,
				faqTitle: "Häufige Fragen zu STRATO-Websites",
				faq: [
					{
						q: "Hilfst du auch beim STRATO Homepage-Baukasten?",
						a: "Ja. Ich richte Vorlage, Seiten und Einstellungen ein und zeige dir, wie du die Seite selbst pflegst."
					},
					{
						q: "Wann lohnt sich der Wechsel vom Baukasten zu WordPress?",
						a: "Wenn du Funktionen, Gestaltung oder einen Shop brauchst, die der Baukasten nicht bietet. Sonst bleibt der Baukasten oft die einfachere Lösung."
					},
					{
						q: "Kann meine Domain bei STRATO bleiben?",
						a: "Ja. Die Domain kann bei STRATO bleiben und auf die neue Seite zeigen – oder mit umziehen."
					},
					{
						q: "Was kostet die Hilfe bei meiner STRATO-Website?",
						a: "Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren. Deinen Tarif zahlst du wie bisher an STRATO."
					}
				],
				ctaTitle: "Deine STRATO-Website soll mehr können?",
				ctaText: "Schreib mir, was du nutzt und was du vorhast – ein Link genügt.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "Web presence",
				title: "Help with your STRATO website – from site builder to WordPress",
				summary: "Using the STRATO website builder or WordPress at STRATO? I help with setup, errors and design – and with moving to WordPress.",
				answer: "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. I help you with your website at STRATO – whether you use the Homepage-Baukasten website builder or WordPress: with setup, errors and design, and *with moving to WordPress*.",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"The website builder is set up, but the site does not look professional.",
					"Your WordPress site at STRATO shows errors or loads slowly.",
					"The builder cannot do what you need."
				],
				offersTitle: "What I take care of for your website",
				offers: [
					{
						id: "fix-errors",
						title: "Fixing errors and upkeep",
						text: "I help with problems in the builder, in WordPress and with settings.",
						points: [
							"Menus and page structure in the builder",
							"WordPress errors and updates",
							"Checking domain, SSL and email"
						]
					},
					{
						id: "relaunch",
						title: "New website or relaunch",
						text: "I rebuild your site in the builder or move it onto WordPress.",
						points: [
							"Ordering structure and content",
							"A design that suits your business",
							"Built for phones and screens"
						]
					},
					{
						id: "templates",
						title: "Templates and design",
						text: "I adjust template, colours, fonts and images – on WordPress with a child theme.",
						points: [
							"Choosing a suitable template",
							"Colours and fonts to match your brand",
							"Consistent pages instead of a patchwork"
						]
					},
					{
						id: "migration",
						title: "Moving to WordPress",
						text: "When the builder reaches its limits, I move your site to WordPress.",
						points: [
							"Carrying over content and images",
							"Taking domain and email along",
							"Redirects for old addresses"
						]
					}
				],
				comparison: {
					title: "STRATO website builder or WordPress?",
					intro: "In short: the builder comes with templates and technology ready to go. WordPress offers more design and features but needs upkeep.",
					columns: [
						"Criterion",
						"Homepage-Baukasten (website builder)",
						"WordPress, e.g. with WordPress hosting"
					],
					rows: [
						[
							"Getting started",
							"Pick a template and add content",
							"Set up theme, plugins and structure"
						],
						[
							"Technology",
							"STRATO takes care of the technology",
							"Needs updates – STRATO's WordPress hosting updates WordPress automatically"
						],
						[
							"Design",
							"The builder's templates",
							"Many themes or a design of your own"
						],
						[
							"Shop",
							"Via the SmartWebshop",
							"Via plugins, e.g. WooCommerce"
						],
						[
							"Fits if",
							"you want a clear site quickly",
							"you need more design or features"
						]
					]
				},
				outcomesTitle: "What you achieve",
				outcomes: [
					"Your site looks professional",
					"Errors are fixed, and you know what caused them",
					"A move to WordPress in which domain and email come along"
				],
				boundariesTitle: "What this does not cover",
				boundaries: [
					"Contracts and plans stay with STRATO.",
					"Not every builder feature can be rebuilt one to one – we clarify that first.",
					"I work independently and am not a STRATO partner."
				],
				processTitle: "How it works",
				process: [
					"You tell me what you use and what is not working – a link is enough",
					"I look at the site and tell you the way forward and the effort",
					"Before a move I back up all content"
				],
				costTitle: COST.en.title,
				costText: COST.en.text,
				referencesHeadline: REFERENCES.en.headline,
				referencesLabel: REFERENCES.en.label,
				faqTitle: "Common questions about STRATO websites",
				faq: [
					{
						q: "Do you also help with the STRATO website builder?",
						a: "Yes. I set up template, pages and settings and show you how to maintain the site yourself."
					},
					{
						q: "When is it worth moving from the builder to WordPress?",
						a: "When you need features, design or a shop the builder does not offer. Otherwise the builder is often the simpler option."
					},
					{
						q: "Can my domain stay at STRATO?",
						a: "Yes. It can stay at STRATO and point to the new site – or move along."
					},
					{
						q: "What does help with my STRATO website cost?",
						a: "Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment. Your STRATO plan stays billed by STRATO."
					}
				],
				ctaTitle: "Should your STRATO website do more?",
				ctaText: "Tell me what you use and what you have in mind – a link is enough.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	}
];
/** `/leistungen/<slug>` or `/en/services/<slug>`. */
function platformHref(platform, lang) {
	return lang === "de" ? `/leistungen/${platform.slug}` : `/en/services/${platform.slug}`;
}
/** The platform served under this slug, if any. Slugs are the same in both trees. */
function getPlatformBySlug(slug) {
	if (!slug) return void 0;
	return platformDefinitions.find((platform) => platform.slug === slug);
}
//#endregion
//#region src/lib/copyRules.ts
/**
* Words the site never says (decided 2026-09-21): "echt" and "wirklich", in any
* inflection. A claim that something is REAL or TRULY so is the one claim a
* visitor cannot check.
*
* Enforced in three places, one per way a word can reach a page:
* - committed copy: `bannedWords.test.ts`;
* - panel overrides: `cms.ts` refuses a string that contains one and keeps the
*   committed default, so a block saved before the rule cannot bring it back;
* - everything rendered: `npm run audit:seo`.
*
* No imports — `cms.ts` sits at the bottom of the module graph.
*/
var BANNED_WORDS = /\b(echt|wirklich)[a-zäöüß]*/i;
function hasBannedWord(text) {
	return BANNED_WORDS.test(text);
}
//#endregion
//#region src/lib/cms.ts
/** JSON object, excluding arrays and `null`. */
function isRecord$1(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
* Validate an appended list item for which no committed value exists.
*
* An existing item can safely inherit a missing or invalid field from the
* item at the same index in `fallback`. An appended item cannot: inventing
* `0` for a malformed price or `""` for a missing title would publish data
* that exists in neither source. Scalars are therefore required and valid;
* list fields may be omitted and become an empty list (the structured CMS
* deliberately omits service tags, while the renderer safely accepts `[]`).
*/
function validateNewListItem(schema, candidate) {
	if (typeof schema === "string") return typeof candidate === "string" && candidate.trim() !== "" && !hasBannedWord(candidate) ? {
		value: candidate,
		valid: true
	} : {
		value: schema,
		valid: false
	};
	if (typeof schema === "number") return typeof candidate === "number" && Number.isFinite(candidate) ? {
		value: candidate,
		valid: true
	} : {
		value: schema,
		valid: false
	};
	if (typeof schema === "boolean") return typeof candidate === "boolean" ? {
		value: candidate,
		valid: true
	} : {
		value: schema,
		valid: false
	};
	if (Array.isArray(schema)) {
		if (!Array.isArray(candidate)) return {
			value: schema,
			valid: false
		};
		if (candidate.length === 0) return {
			value: [],
			valid: true
		};
		if (schema.length === 0) return {
			value: schema,
			valid: false
		};
		const items = [];
		for (const candidateItem of candidate) {
			const item = validateNewListItem(schema[0], candidateItem);
			if (!item.valid) return {
				value: schema,
				valid: false
			};
			items.push(item.value);
		}
		return {
			value: items,
			valid: true
		};
	}
	if (isRecord$1(schema)) {
		if (!isRecord$1(candidate)) return {
			value: schema,
			valid: false
		};
		const value = {};
		const keys = Object.keys(schema);
		if (keys.length === 0) return {
			value: schema,
			valid: false
		};
		for (const key of keys) {
			if (!Object.prototype.hasOwnProperty.call(candidate, key)) {
				if (Array.isArray(schema[key])) {
					value[key] = [];
					continue;
				}
				return {
					value: schema,
					valid: false
				};
			}
			const child = validateNewListItem(schema[key], candidate[key]);
			if (!child.valid) return {
				value: schema,
				valid: false
			};
			value[key] = child.value;
		}
		return {
			value,
			valid: true
		};
	}
	return {
		value: schema,
		valid: false
	};
}
/**
* Validate one CMS value against its local fallback and merge recursively.
*
* The fallback doubles as the runtime schema: strings stay strings, arrays
* stay arrays and object keys not known locally never reach a component.
* Empty strings/lists mean "no override" because the editor starts a missing
* block at `{}`; letting an untouched empty control win would silently erase
* the baked copy.
*/
function mergeCmsValue(fallback, candidate) {
	if (typeof fallback === "string") return typeof candidate === "string" && candidate.trim() !== "" && !hasBannedWord(candidate) ? {
		value: candidate,
		applied: true
	} : {
		value: fallback,
		applied: false
	};
	if (typeof fallback === "number") return typeof candidate === "number" && Number.isFinite(candidate) ? {
		value: candidate,
		applied: true
	} : {
		value: fallback,
		applied: false
	};
	if (typeof fallback === "boolean") return typeof candidate === "boolean" ? {
		value: candidate,
		applied: true
	} : {
		value: fallback,
		applied: false
	};
	if (Array.isArray(fallback)) {
		if (!Array.isArray(candidate) || candidate.length === 0) return {
			value: fallback,
			applied: false
		};
		if (fallback.length === 0) return {
			value: fallback,
			applied: false
		};
		const merged = [];
		for (let index = 0; index < candidate.length; index += 1) {
			if (index >= fallback.length) {
				const item = validateNewListItem(fallback[0], candidate[index]);
				if (!item.valid) return {
					value: fallback,
					applied: false
				};
				merged.push(item.value);
				continue;
			}
			const item = mergeCmsValue(fallback[index], candidate[index]);
			if (!item.applied) return {
				value: fallback,
				applied: false
			};
			merged.push(item.value);
		}
		return {
			value: merged,
			applied: true
		};
	}
	if (isRecord$1(fallback)) {
		if (!isRecord$1(candidate)) return {
			value: fallback,
			applied: false
		};
		let merged = fallback;
		let applied = false;
		for (const key of Object.keys(fallback)) {
			if (!Object.prototype.hasOwnProperty.call(candidate, key)) continue;
			const child = mergeCmsValue(fallback[key], candidate[key]);
			if (!child.applied) continue;
			if (!applied) merged = { ...fallback };
			merged[key] = child.value;
			applied = true;
		}
		return {
			value: merged,
			applied
		};
	}
	return {
		value: fallback,
		applied: false
	};
}
/**
* Fetch every saved content block for a language, memoised so the dozen
* section components rendering one page share a single request. Returns `{}`
* on any failure or in demo mode.
*
* **The memo is generation-scoped, not module-scoped.** A plain module-level
* `Map` was right while this site was a static build — one process, one fetch
* per language, then exit. Under SSR the same `Map` lives as long as the
* server does, so the site would answer with the blocks it read at boot
* forever, and a cache rebuild would faithfully re-render that stale content
* and report success. `contentCache.invalidate()` runs before any render a
* rebuild performs; see `src/lib/cache.ts`.
*/
async function fetchBlocks(lang) {
	return {};
}
/**
* Resolve one section's content: validated API fields merged over the baked
* default. A block is deliberately allowed to be partial: the Website-CMS
* creates a missing block from `{}`, so its first save contains only controls
* the editor actually touched.
*/
async function cmsFor(section, lang, fallback) {
	const block = (await fetchBlocks(lang))[section];
	if (!isRecord$1(block)) return fallback;
	return mergeCmsValue(fallback, block).value;
}
//#endregion
//#region src/lib/references.ts
/** Absolute URL of a journal article in one language. */
function articleUrl(slug, lang) {
	return lang === "de" ? `${siteConfig.blogUrl}/${slug}` : `${siteConfig.blogUrl}/en/${slug}`;
}
var referenceCases = [{
	id: "office-supplies-shop",
	services: [
		"web-presence",
		"process",
		"solutions"
	],
	articleSlug: "vom-baukasten-shop-zum-eigenen-shop",
	disclosure: "anonymous",
	siteUrl: null,
	previewAllowed: false,
	content: {
		de: {
			title: "Vom Baukasten-Shop zum eigenen Shop",
			context: "Onlinehandel für Bürobedarf und Druckerzubehör",
			challenge: "Der gehostete Baukasten-Shop kam mit dem wachsenden Sortiment nicht mehr mit: Preise ließen sich nur einzeln pflegen, Importe mussten in ein festes Formular passen, und für eigene Abläufe war kein Platz.",
			solution: "Aufbau eines eigenen Shops und Umzug des kompletten Sortiments samt Bereinigung der Artikeldaten. Seither läuft die laufende Pflege über mich: Auswertung des Bestands, Filterung nach Marke, Serie und Marge sowie nachvollziehbare Preisläufe — für den Shop und für weitere Vertriebskanäle.",
			result: "Sortiment und Preise bleiben über alle Kanäle hinweg aktuell. Preisänderungen laufen als ein Vorgang statt als Reihe von Einzeleingaben, und neue Anforderungen lassen sich ohne Anbieterwechsel umsetzen.",
			metric: "über 20.000 gepflegte Artikel"
		},
		en: {
			title: "From a hosted shop builder to a shop of their own",
			context: "Online retail for office supplies and printer consumables",
			challenge: "The hosted shop builder stopped keeping up with the growing catalogue: prices could only be edited one at a time, imports had to fit a fixed form, and there was no room for the company's own routines.",
			solution: "Building a shop of their own and moving the entire catalogue across, cleaning up the product data on the way. The ongoing upkeep has run through me since: analysing the catalogue, filtering by brand, series and margin, and traceable price runs — for the shop and for further sales channels.",
			result: "Catalogue and prices stay current across every channel. A price change is one run rather than a series of individual edits, and new requirements can be built without changing provider.",
			metric: "more than 20,000 articles maintained"
		}
	}
}, {
	id: "hof-meerheck",
	services: ["web-presence"],
	articleSlug: null,
	disclosure: "named",
	siteUrl: "https://hof-meerheck.de/",
	previewAllowed: true,
	platforms: ["wordpress"],
	content: {
		de: {
			title: "Eine bestehende Webseite, wieder auf dem Stand",
			context: "Schäferei mit eigener Direktvermarktung",
			challenge: "Die Webseite war über die Jahre stehen geblieben: ein veralteter Stand, Fehler im Detail, auf dem Telefon umständlich zu bedienen und für die Suche nicht aufgestellt.",
			solution: "Übernahme der bestehenden Seite und Überarbeitung: aktueller Stand, ausgebessertes Design, behobene Fehler, eine Darstellung, die auf dem Telefon funktioniert, und die Grundlagen für die Auffindbarkeit. Seither läuft die Wartung über mich — zusammen mit den E-Mail-Postfächern.",
			result: "Die Seite bleibt aktuell, ohne dass der Betrieb sich darum kümmern muss. Bei technischen Fragen gibt es einen Ansprechpartner statt einer Suche nach Zuständigkeiten.",
			metric: ""
		},
		en: {
			title: "An existing website, brought back up to date",
			context: "Sheep farm selling directly to its customers",
			challenge: "The website had stood still over the years: out of date, faults in the detail, awkward to use on a phone and not set up to be found.",
			solution: "Taking the existing site over and reworking it: current again, the design repaired, the faults fixed, a layout that works on a phone, and the groundwork for being found. The upkeep has run through me since — along with the email accounts.",
			result: "The site stays current without the business having to attend to it. For technical questions there is one point of contact instead of a hunt for who is responsible.",
			metric: ""
		}
	}
}];
/**
* The cases shown on one service's detail page, with their links resolved.
*
* Returns a fresh array every call: the result is merged with CMS values by
* `resolveServiceContent`, and handing out a shared object would let one
* request's override leak into the next.
*/
function referencesForService(service, lang) {
	return referenceCases.filter((entry) => entry.services.includes(service)).map((entry) => resolveCase(entry, lang));
}
/**
* The cases shown on one platform page — named cases only.
*
* The `disclosure` check is not redundant with the test: it is the rule itself,
* applied where the page asks, so a future anonymous case that is given a
* `platforms` list by mistake still cannot appear (see
* `ReferenceCase.platforms`).
*/
function referencesForPlatform(platform, lang) {
	return referenceCases.filter((entry) => entry.disclosure === "named" && entry.platforms?.includes(platform)).map((entry) => resolveCase(entry, lang));
}
function resolveCase(entry, lang) {
	return {
		...entry.content[lang],
		...entry.articleSlug ? { articleUrl: articleUrl(entry.articleSlug, lang) } : {},
		...entry.siteUrl ? { siteUrl: entry.siteUrl } : {}
	};
}
//#endregion
//#region src/lib/services.ts
/**
* Single source of truth for service identity, order, routes and local content.
* The CMS may override every content field, but never ids, slugs, keywords,
* images or prices used in structured data. References come from
* `references.ts`; no customer story is published until a real, approved case
* exists there.
*
* ### The order (since 2026-10-06)
*
* Kundenportale & Verwaltungspanels first: the site's focus moved to building
* a business its own panel, and to digitalization in general. Then the
* digitalization services — simplify, sort, build — and the web presence
* last. It stays the service the shop system and CMS pages belong to; it is
* simply no longer the headline (it stood first from 2026-09-15 to 10-05).
*
* ### Copy rules
*
* - **du**, lowercase, like the rest of the site (decided 2026-09-15).
* - **Short and clear** (asked for 2026-09-15): three points per list, one
*   statement per line, no filler.
* - `summary` is rendered twice: as the card text on the pricing grid and as
*   the `<meta name="description">` of the detail page. It must stay between
*   81 and 160 characters in BOTH languages, which `services.test.ts` measures.
*/
var serviceDefinitions = [
	{
		id: "panels",
		number: "01",
		cmsKey: "service_panels",
		slug: {
			de: "kundenportale",
			en: "customer-portals"
		},
		seoTitle: {
			de: "Kundenportal & Verwaltungspanel erstellen lassen — Tracht Digital",
			en: "Customer Portal & Admin Panel Development — Tracht Digital"
		},
		updatedAt: "2026-10-06",
		keywords: {
			de: [
				"Kundenportal",
				"Verwaltungspanel",
				"Logins fürs Team",
				"Auswertungen"
			],
			en: [
				"Customer portal",
				"Admin panel",
				"Team logins",
				"Reports"
			]
		},
		tagline: {
			de: "Dein Betrieb in einem Panel – im Browser und auf dem Handy",
			en: "Your business in one panel – in the browser and on the phone"
		},
		image: null,
		fallback: {
			de: {
				label: "Alle Leistungen",
				title: "Kundenportale & Verwaltungspanels",
				summary: "Ich baue dir ein eigenes Panel: Aufträge, Kunden, Termine und Auswertungen an einem Ort – mit Zugängen für Team und Kunden.",
				intro: "Viele Betriebe arbeiten mit Tabellen, Mails und Zetteln nebeneinander. Ein Panel bündelt das *an einem Ort*: dein Team sieht, was zu tun ist, und deine Kunden finden ihre Unterlagen selbst. Ich baue es auf einer bewährten Grundlage, die ich selbst einsetze – nicht jedes Mal von null.",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Aufträge und Kundendaten liegen in Tabellen, Mails und Ordnern verteilt.",
					"Kunden fragen nach, was sie selbst nachsehen könnten.",
					"Niemand sieht auf einen Blick, wie es gerade läuft."
				],
				responsibilitiesTitle: "Das übernehme ich",
				responsibilities: [
					"Klären, was das Panel können muss – und was nicht",
					"Das Panel mit Rollen und sicheren Logins bauen",
					"Daten übernehmen, einführen und weiter betreuen"
				],
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Alles Wichtige an einem Ort, auch unterwegs",
					"Kunden erledigen Anfragen selbst im Portal",
					"Du siehst auf einen Blick, wie es läuft"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: ["Buchhaltung und Lohn bleiben in den Programmen, die dafür gemacht sind.", "Was ein fertiges Programm gut kann, baue ich nicht nach."],
				processTitle: "So gehen wir vor",
				process: [
					"Abläufe und Rollen erfassen",
					"Mit dem Wichtigsten starten, dann erweitern",
					"Einführen, erklären und weiter betreuen"
				],
				priceLabel: "Preis",
				priceText: "Auf Anfrage. Bei festem Umfang gibt es Festpreise für einzelne Ausbaustufen.",
				referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
				referencesHeadline: "Einblicke aus der Praxis",
				references: [],
				ctaTitle: "Zu viel liegt verteilt herum?",
				ctaText: "Zeig mir, wie ihr heute arbeitet. Ich zeige dir, wie ein Panel dafür aussieht.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "All services",
				title: "Customer Portals & Admin Panels",
				summary: "I build you your own panel: orders, customers, appointments and reports in one place – with logins for your team and customers.",
				intro: "Many businesses juggle spreadsheets, emails and notes side by side. A panel brings it together *in one place*: your team sees what needs doing, and your customers find their documents themselves. I build it on a proven base that I use myself – not from scratch every time.",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"Orders and customer data are spread across spreadsheets, emails and folders.",
					"Customers ask about things they could look up themselves.",
					"Nobody sees at a glance how things are going."
				],
				responsibilitiesTitle: "What I take care of",
				responsibilities: [
					"Work out what the panel must do – and what not",
					"Build the panel with roles and secure logins",
					"Move your data over, roll it out and keep supporting it"
				],
				outcomesTitle: "What you achieve",
				outcomes: [
					"Everything important in one place, on the go too",
					"Customers handle requests themselves in the portal",
					"You see at a glance how things are going"
				],
				boundariesTitle: "What this does not cover",
				boundaries: ["Accounting and payroll stay in the programs made for them.", "What a ready-made program does well, I do not rebuild."],
				processTitle: "How we proceed",
				process: [
					"Capture workflows and roles",
					"Start with what matters most, then extend",
					"Roll out, explain and keep supporting it"
				],
				priceLabel: "Price",
				priceText: "On request. Once the scope is set, fixed prices for single stages.",
				referencesLabel: "Published only with the client's approval.",
				referencesHeadline: "Examples from practice",
				references: [],
				ctaTitle: "Too much is scattered around?",
				ctaText: "Show me how you work today. I will show you what a panel for it looks like.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	},
	{
		id: "process",
		number: "02",
		cmsKey: "service_process",
		slug: {
			de: "prozessoptimierung",
			en: "process-optimization"
		},
		seoTitle: {
			de: "Abläufe digitalisieren: Prozesse automatisieren — Tracht Digital",
			en: "Digitalizing Workflows & Automating Processes — Tracht Digital"
		},
		updatedAt: "2026-10-05",
		keywords: {
			de: [
				"Abläufe",
				"Prozessoptimierung",
				"Automatisierung",
				"Weniger Handarbeit"
			],
			en: [
				"Workflows",
				"Process optimization",
				"Automation",
				"Less manual work"
			]
		},
		tagline: {
			de: "Wiederkehrende Arbeit vereinfachen und automatisieren",
			en: "Simplify and automate recurring work"
		},
		image: "/images/services/02-prozesse.webp",
		fallback: {
			de: {
				label: "Alle Leistungen",
				title: "Abläufe digitalisieren",
				summary: "Ich nehme mir einen Ablauf vor, der dich jede Woche Zeit kostet, streiche unnötige Schritte und automatisiere den Rest.",
				intro: "Digitalisierung heißt nicht, alles neu zu machen. Ich gehe einen Ablauf mit dir durch, streiche die Schritte, die niemand braucht, und richte den Rest *einmal richtig* ein. Wo eine Tabelle nur ein Behelf war, steht danach etwas, das zu deiner Arbeit passt.",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Dieselben Daten werden mehrfach eingetippt.",
					"Freigaben und Rückfragen kosten jedes Mal Zeit.",
					"Bei Routinearbeiten schleichen sich Fehler ein."
				],
				responsibilitiesTitle: "Das übernehme ich",
				responsibilities: [
					"Den heutigen Ablauf mit deinem Team durchgehen",
					"Zeitfresser und Fehlerquellen finden",
					"Einen einfacheren Weg einrichten – mit passender Automatisierung"
				],
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Du tippst Daten nicht mehr doppelt",
					"Weniger Fehler durch Handarbeit",
					"Mehr Zeit für deine eigentliche Arbeit"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: ["Nicht jeder Sonderfall lohnt eine Automatisierung.", "Änderungen stimmen wir mit deinem Team ab."],
				processTitle: "So gehen wir vor",
				process: [
					"Ablauf mitverfolgen und aufschreiben",
					"Die größten Zeitfresser zuerst angehen",
					"Einführen und bei Bedarf nachbessern"
				],
				priceLabel: "Preis",
				priceText: "Auf Anfrage. Sobald Ablauf und Ziel klar sind, bekommst du einen Festpreis.",
				referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
				referencesHeadline: "Einblicke aus der Praxis",
				references: [],
				ctaTitle: "Welcher Ablauf kostet dich jede Woche Zeit?",
				ctaText: "Beschreib ihn kurz. Wir prüfen, ob sich eine Vereinfachung lohnt.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "All services",
				title: "Digitalizing Workflows",
				summary: "I take a routine that costs you time every week, cut the steps nobody needs and automate the rest.",
				intro: "Digitalizing does not mean starting over. I walk one routine through with you, cut the steps nobody needs, and set the rest up *once, properly*. Where a spreadsheet was only a workaround, something that fits the way you work stands instead.",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"The same data gets typed in more than once.",
					"Approvals and follow-up questions cost time every time.",
					"Mistakes creep into routine work."
				],
				responsibilitiesTitle: "What I take care of",
				responsibilities: [
					"Walk through the current workflow with your team",
					"Find the time sinks and error sources",
					"Set up a simpler way – with the right automation"
				],
				outcomesTitle: "What you achieve",
				outcomes: [
					"You stop typing the same data twice",
					"Fewer mistakes from manual work",
					"More time for the actual work"
				],
				boundariesTitle: "What this does not cover",
				boundaries: ["Not every exception is worth automating.", "Changes are agreed with your team."],
				processTitle: "How we proceed",
				process: [
					"Follow the workflow and write it down",
					"Tackle the biggest time sinks first",
					"Roll it out and refine it"
				],
				priceLabel: "Price",
				priceText: "On request. Once the workflow and the goal are clear, you get a fixed price.",
				referencesLabel: "Published only with the client's approval.",
				referencesHeadline: "Examples from practice",
				references: [],
				ctaTitle: "Which routine costs you time every week?",
				ctaText: "Describe it briefly. We check whether simplifying it is worth it.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	},
	{
		id: "consulting",
		number: "03",
		cmsKey: "service_consulting",
		slug: {
			de: "beratung-konzeption",
			en: "consulting-planning"
		},
		seoTitle: {
			de: "Digitalisierungsberatung & Konzept — Tracht Digital",
			en: "Digital Consulting & Planning — Tracht Digital"
		},
		updatedAt: "2026-10-05",
		keywords: {
			de: [
				"Einordnung",
				"Optionen & Kosten",
				"Konzept",
				"Fahrplan"
			],
			en: [
				"Assessment",
				"Options & costs",
				"Concept",
				"Roadmap"
			]
		},
		tagline: {
			de: "Klären, was sich lohnt – mit Kosten und Reihenfolge",
			en: "Work out what pays off – with costs and an order"
		},
		image: "/images/services/01-beratung.webp",
		fallback: {
			de: {
				label: "Alle Leistungen",
				title: "Beratung & Konzeption",
				summary: "Ich ordne deine digitalen Vorhaben, vergleiche die Möglichkeiten mit ihren Kosten und sage dir klar, womit du anfängst.",
				intro: "Nicht alles, was technisch geht, lohnt sich. Wir klären zuerst, *was du erreichen willst* – danach sage ich dir, was es kostet und was ich an deiner Stelle zuerst anfassen würde. Auch dann, wenn die Antwort lautet: noch nicht.",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Es gibt viele Ideen, aber keine Reihenfolge.",
					"Eine größere Anschaffung soll erst geprüft werden.",
					"Mehrere Systeme oder Firmen müssen zusammenarbeiten."
				],
				responsibilitiesTitle: "Das übernehme ich",
				responsibilities: [
					"Ziele, Abläufe und Technik aufnehmen",
					"Möglichkeiten und Kosten verständlich vergleichen",
					"Einen umsetzbaren Fahrplan schreiben"
				],
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Du weißt, womit du anfängst",
					"Du kennst die Kosten, bevor du entscheidest",
					"Du sparst dir teure Fehlentscheidungen"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: ["Beratung ersetzt keinen Anwalt oder Steuerberater.", "Die Umsetzung wird getrennt vereinbart."],
				processTitle: "So gehen wir vor",
				process: [
					"Lage und Ziel aufnehmen",
					"Möglichkeiten bewerten",
					"Fahrplan festhalten – dann umsetzen oder übergeben"
				],
				priceLabel: "Preis",
				priceText: "Auf Anfrage. Für ein klar abgegrenztes Konzept bekommst du einen Festpreis.",
				referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
				referencesHeadline: "Einblicke aus der Praxis",
				references: [],
				ctaTitle: "Du willst zuerst Klarheit?",
				ctaText: "Schildere kurz deine Lage. Wir klären, welche Frage zuerst dran ist.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "All services",
				title: "Consulting & Planning",
				summary: "I put your digital plans in order, compare the options with their costs and tell you plainly where to start.",
				intro: "Not everything that is technically possible is worth it. We first work out *what you want to achieve* – then I tell you what it costs and what I would touch first in your position. Including when the answer is: not yet.",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"There are plenty of ideas, but no order to them.",
					"A larger investment should be checked first.",
					"Several systems or suppliers have to work together."
				],
				responsibilitiesTitle: "What I take care of",
				responsibilities: [
					"Understand your goals, workflows and technology",
					"Compare the options and costs in plain language",
					"Write a roadmap you can act on"
				],
				outcomesTitle: "What you achieve",
				outcomes: [
					"You know where to start",
					"You know the costs before you decide",
					"You avoid expensive wrong turns"
				],
				boundariesTitle: "What this does not cover",
				boundaries: ["Consulting does not replace a lawyer or an accountant.", "Building it is agreed separately."],
				processTitle: "How we proceed",
				process: [
					"Understand the situation and the goal",
					"Weigh the options",
					"Write down the roadmap – then build or hand over"
				],
				priceLabel: "Price",
				priceText: "On request. A clearly bounded concept gets a fixed price.",
				referencesLabel: "Published only with the client's approval.",
				referencesHeadline: "Examples from practice",
				references: [],
				ctaTitle: "Want clarity first?",
				ctaText: "Briefly describe your situation. We work out which question comes first.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	},
	{
		id: "solutions",
		number: "04",
		cmsKey: "service_solutions",
		slug: {
			de: "individuelle-loesungen",
			en: "tailored-solutions"
		},
		seoTitle: {
			de: "Individuelle Software & Schnittstellen — Tracht Digital",
			en: "Custom Software & Integrations — Tracht Digital"
		},
		updatedAt: "2026-10-05",
		keywords: {
			de: [
				"Systeme verbinden",
				"Schnittstellen",
				"Eigene Software",
				"Auftragsentwicklung"
			],
			en: [
				"Connected systems",
				"Integrations",
				"Custom software",
				"Contract development"
			]
		},
		tagline: {
			de: "Programme verbinden, Fehlendes selbst bauen",
			en: "Connect your programs, build what is missing"
		},
		image: "/images/services/03-loesungen.webp",
		fallback: {
			de: {
				label: "Alle Leistungen",
				title: "Individuelle Lösungen",
				summary: "Ich verbinde die Programme, die du schon nutzt, und baue eigene Software nur dort, wo keine fertige Lösung passt.",
				intro: "Manchmal reicht ein einzelnes Programm nicht. Dann nutze ich deine vorhandene Technik weiter und *ergänze nur, was fehlt*. Eigene Software ist die letzte Antwort, nicht die erste – sie muss gepflegt werden, und das kostet dich Geld.",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Mehrere Programme arbeiten nicht zusammen.",
					"Die Standardsoftware kann eine Besonderheit deines Betriebs nicht.",
					"Daten sollen zuverlässig von einem Werkzeug ins andere fließen."
				],
				responsibilitiesTitle: "Das übernehme ich",
				responsibilities: [
					"Abwägen: Standardprodukt, Schnittstelle oder Eigenbau",
					"Nach klarer Aufgabe entwickeln und testen",
					"Übergeben, dokumentieren und weiter betreuen"
				],
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Deine Programme arbeiten zusammen",
					"Du bekommst genau das Werkzeug, das fehlt",
					"Der Quellcode ist lesbar und dokumentiert"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: ["Bewährte Standardsoftware wird nicht ohne Grund neu gebaut.", "Schnittstellen gehen nur so weit, wie die Anbieter sie zulassen."],
				processTitle: "So gehen wir vor",
				process: [
					"Ziele und vorhandene Technik erfassen",
					"In klaren Etappen bauen und testen",
					"Einführen und weiter betreuen"
				],
				priceLabel: "Preis",
				priceText: "Auf Anfrage. Bei festem Umfang gibt es Festpreise für einzelne Etappen.",
				referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
				referencesHeadline: "Einblicke aus der Praxis",
				references: [],
				ctaTitle: "Deine Werkzeuge passen nicht zusammen?",
				ctaText: "Zeig mir, wie es heute läuft. Wir klären, was bleiben kann.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "All services",
				title: "Tailored Solutions",
				summary: "I connect the programs you already use and build custom software only where no ready-made product fits.",
				intro: "Sometimes one program is not enough. Then I keep your existing technology and *add only what is missing*. Custom software is the last answer, not the first — it has to be maintained, and that costs you money.",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"Several programs do not work together.",
					"Standard software cannot handle a quirk of your business.",
					"Data should move reliably from one tool to the next."
				],
				responsibilitiesTitle: "What I take care of",
				responsibilities: [
					"Weigh it up: off-the-shelf, integration or custom build",
					"Build and test against a clear brief",
					"Hand over, document and keep supporting it"
				],
				outcomesTitle: "What you achieve",
				outcomes: [
					"Your programs work together",
					"You get exactly the tool that is missing",
					"The source code is readable and documented"
				],
				boundariesTitle: "What this does not cover",
				boundaries: ["Proven standard software is not rebuilt without a good reason.", "Integrations only go as far as the providers allow."],
				processTitle: "How we proceed",
				process: [
					"Capture goals and existing technology",
					"Build and test in clear stages",
					"Roll out and keep supporting it"
				],
				priceLabel: "Price",
				priceText: "On request. Once the scope is set, fixed prices for single stages.",
				referencesLabel: "Published only with the client's approval.",
				referencesHeadline: "Examples from practice",
				references: [],
				ctaTitle: "Your tools do not fit together?",
				ctaText: "Show me how it works today. We work out what can stay.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	},
	{
		id: "web-presence",
		number: "05",
		cmsKey: "service_web_presence",
		slug: {
			de: "webauftritt",
			en: "web-presence"
		},
		seoTitle: {
			de: "Website & Onlineshop erstellen lassen — Tracht Digital",
			en: "Websites and Online Shops, Built and Maintained — Tracht Digital"
		},
		updatedAt: "2026-10-05",
		keywords: {
			de: [
				"Websites",
				"Onlineshops",
				"Shopsysteme & CMS",
				"SEO & KI-Suche"
			],
			en: [
				"Websites",
				"Online shops",
				"Shop systems & CMS",
				"SEO & AI search"
			]
		},
		tagline: {
			de: "Website und Shop übernehmen, reparieren, pflegen",
			en: "Take over, fix and maintain your site or shop"
		},
		image: "/images/services/04-webauftritt.webp",
		fallback: {
			de: {
				label: "Alle Leistungen",
				title: "Webauftritt",
				summary: "Ich übernehme deine bestehende Website oder deinen Shop, behebe Fehler und halte alles aktuell – auch wenn jemand anderes sie gebaut hat.",
				intro: "Meistens muss nichts neu gebaut werden. Ich sehe mir an, *was trägt*, und ersetze nur, was dich aufhält. Danach bleibt die Seite in Ordnung, ohne dass du an Updates denken musst.",
				situationsTitle: "Kommt dir das bekannt vor?",
				situations: [
					"Deine Website ist veraltet und schwer zu pflegen.",
					"Dein Shop auf WooCommerce, Shopware oder einem Baukasten macht Ärger.",
					"Die Seite sieht gut aus, aber kaum jemand fragt an."
				],
				responsibilitiesTitle: "Das übernehme ich",
				responsibilities: [
					"Website bauen – für Handy und Bildschirm",
					"Onlineshop einrichten oder reparieren, z. B. WooCommerce oder Shopware 6",
					"Bestehende Seiten auf WordPress, TYPO3 oder bei STRATO übernehmen",
					"Marketing: Google Ads, Unternehmensprofil und Auffindbarkeit",
					"Auffindbarkeit für Suchmaschinen und für KI-Antworten (SEO und GEO)"
				],
				outcomesTitle: "Das erreichst du",
				outcomes: [
					"Deine Seite ist aktuell und läuft zuverlässig",
					"Besucher verstehen sofort, was du anbietest",
					"Du wirst gefunden – bei Google und in KI-Antworten"
				],
				boundariesTitle: "Was nicht dazugehört",
				boundaries: [
					"Das Werbebudget für Anzeigen zahlst du direkt an Google.",
					"Texte, Fotos und Rechtstexte brauchen deine Zuarbeit.",
					"Platzierungen bei Google lassen sich nicht kaufen – in KI-Antworten genauso wenig."
				],
				processTitle: "So gehen wir vor",
				process: [
					"Ziele und Inhalte klären",
					"Seite oder Shop bauen und gemeinsam durchgehen",
					"Online stellen und sichtbar machen"
				],
				priceLabel: "Preis",
				priceText: "Festpreise ab 390 € netto, alles andere auf Anfrage.",
				referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
				referencesHeadline: "Einblicke aus der Praxis",
				references: [],
				ctaTitle: "Soll deine Website mehr für dich tun?",
				ctaText: "Erzähl mir, was sie leisten soll. Wir klären den sinnvollen Umfang.",
				ctaButton: "Erstgespräch vereinbaren"
			},
			en: {
				label: "All services",
				title: "Web Presence",
				summary: "I take over your existing website or shop, fix what is broken and keep it up to date – even if somebody else built it.",
				intro: "Usually nothing has to be rebuilt. I look at *what holds up* and replace only what is holding you back. After that the site stays in order without you thinking about updates.",
				situationsTitle: "Does this sound familiar?",
				situations: [
					"Your website is outdated and hard to maintain.",
					"Your shop on WooCommerce, Shopware or a site builder is causing problems.",
					"The site looks good, but hardly anyone gets in touch."
				],
				responsibilitiesTitle: "What I take care of",
				responsibilities: [
					"Build the website – for phones and screens",
					"Set up or repair an online shop, e.g. WooCommerce or Shopware 6",
					"Take over existing sites on WordPress, TYPO3 or at STRATO",
					"Marketing: Google Ads, business profile and findability",
					"Findability for search engines and for AI answers (SEO and GEO)"
				],
				outcomesTitle: "What you achieve",
				outcomes: [
					"Your site is up to date and runs reliably",
					"Visitors see straight away what you offer",
					"You are found – on Google and in AI answers"
				],
				boundariesTitle: "What this does not cover",
				boundaries: [
					"The ad budget goes to Google directly.",
					"Copy, photos and legal texts need your input.",
					"Google rankings cannot be bought – nor can a mention in an AI answer."
				],
				processTitle: "How we proceed",
				process: [
					"Clarify goals and content",
					"Build the site or shop and walk through it together",
					"Put it online and make it visible"
				],
				priceLabel: "Price",
				priceText: "Fixed prices from €390 net, everything else on request.",
				referencesLabel: "Published only with the client's approval.",
				referencesHeadline: "Examples from practice",
				references: [],
				ctaTitle: "Should your website do more for you?",
				ctaText: "Tell me what it needs to do. We work out a sensible scope.",
				ctaButton: "Arrange an initial consultation"
			}
		}
	}
];
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requiredString(value) {
	return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}
/**
* Validate the special empty-by-default reference collection.
*
* `cmsFor()` deliberately refuses to infer a schema from an empty fallback
* list. References need an empty local default (publishing invented examples
* is not acceptable), so this boundary validates the raw CMS field instead.
* One malformed item rejects the complete collection, matching `cmsFor()`'s
* safe list-boundary fallback behaviour.
*/
function validateServiceReferences(value) {
	if (!Array.isArray(value) || value.length === 0) return [];
	const references = [];
	for (const candidate of value) {
		if (!isRecord(candidate)) return [];
		const title = requiredString(candidate.title);
		const context = requiredString(candidate.context);
		const challenge = requiredString(candidate.challenge);
		const solution = requiredString(candidate.solution);
		const result = requiredString(candidate.result);
		const metric = candidate.metric === void 0 || candidate.metric === null || candidate.metric === "" ? "" : requiredString(candidate.metric);
		if (!title || !context || !challenge || !solution || !result || metric === null) return [];
		references.push({
			title,
			context,
			challenge,
			solution,
			result,
			metric
		});
	}
	return references;
}
function getServiceById(id) {
	const service = serviceDefinitions.find((candidate) => candidate.id === id);
	if (!service) throw new Error(`Unknown service id: ${id}`);
	return service;
}
function getServiceBySlug(lang, slug) {
	if (!slug) return void 0;
	return serviceDefinitions.find((service) => service.slug[lang] === slug);
}
function serviceHref(service, lang) {
	return lang === "de" ? `/leistungen/${service.slug.de}` : `/en/services/${service.slug.en}`;
}
/**
* Services that were published and then withdrawn, and where their visitors
* should land instead.
*
* These slugs were indexed and linked, so answering them with the 404 the
* route would otherwise produce throws that away — and for Marketing it would
* be wrong as well as wasteful: the content did not disappear, it moved into
* Web Presence. Contract development moved into Tailored Solutions the same
* way. Complete IT has no successor, so it points at the overview rather than
* at a service that would have to pretend to cover it.
*
* Keyed by the retired slug, per language, because the pair is what a visitor
* actually typed. `retiredServiceTarget` is called by both `[slug]` routes
* BEFORE they give up and 404 — the dynamic route still matches these paths,
* which is the only reason no new redirect mechanism is needed.
*/
var retiredServiceTargets = {
	de: {
		auftragsprogrammierung: "/leistungen/individuelle-loesungen",
		marketing: "/leistungen/webauftritt",
		"komplette-it": "/#services"
	},
	en: {
		"contract-development": "/en/services/tailored-solutions",
		marketing: "/en/services/web-presence",
		"complete-it": "/en/#services"
	}
};
function retiredServiceTarget(lang, slug) {
	if (!slug) return void 0;
	return retiredServiceTargets[lang][slug];
}
/**
* Merge CMS reference text onto the committed cases, position by position.
*
* The committed list is the base and owns **every destination**; the CMS owns
* the words. An editor rewriting the first card rewrites the first committed
* case and keeps its links. A CMS entry past the end of the committed list is
* an editor-authored case and simply has none — there is nowhere for it to
* point that this repo could vouch for.
*
* Every destination is stripped off the override before anything is restored,
* rather than only overwritten where a committed one exists. `validateService
* References` already drops them upstream, so this is belt and braces — but
* the old form leaned entirely on that: at any position whose committed case
* lacks a link, a CMS-supplied one passed straight through.
*/
function mergeReferences(committed, fromCms) {
	if (fromCms.length === 0) return [...committed];
	return fromCms.map((override, i) => {
		const base = committed[i];
		const { articleUrl: _article, siteUrl: _site, ...text } = override;
		return {
			...text,
			...base?.articleUrl ? { articleUrl: base.articleUrl } : {},
			...base?.siteUrl ? { siteUrl: base.siteUrl } : {}
		};
	});
}
/**
* Resolve the editable CMS block over the committed localized fallback.
*
* References do not go through `cmsFor` — it infers its schema from the
* fallback and cannot describe this list — so they are resolved here, in three
* cases that are deliberately distinct:
*
*  - **No `references` key**, or a malformed one: the committed cases render.
*    That is the normal state; nobody has to retype a published case into the
*    panel for it to appear.
*  - **An explicitly empty array**: the section disappears entirely. This is
*    the documented way to pull a reference off the site without a deploy, and
*    a committed base would have silently taken it away — hence the key check
*    rather than a length check on the validated result.
*  - **A valid non-empty array**: it overrides the text, position by position,
*    and never the links (see {@link mergeReferences}).
*/
async function resolveServiceContent(service, lang) {
	const { references: _references, ...fallback } = service.fallback[lang];
	const resolved = await cmsFor(service.cmsKey, lang, fallback);
	const block = (await fetchBlocks(lang))[service.cmsKey];
	const committed = referencesForService(service.id, lang);
	const references = isRecord(block) && "references" in block && Array.isArray(block.references) && block.references.length === 0 ? [] : mergeReferences(committed, isRecord(block) ? validateServiceReferences(block.references) : []);
	return {
		...resolved,
		references
	};
}
//#endregion
//#region src/lib/sitemapSections.ts
/**
* The sections of the sitemap (2026-10-06): the general pages, the services
* and the platform pages, one child sitemap each, listed by
* `/sitemap-index.xml` with each child's own newest date. A crawler re-reads
* only the section that moved, and Search Console reports coverage per section.
*
* No imports — `cache.ts` needs the paths without the content modules.
*/
var SITEMAP_SECTIONS = [
	"pages",
	"services",
	"platforms"
];
function isSitemapSection(value) {
	return SITEMAP_SECTIONS.includes(value ?? "");
}
function sectionPath(section) {
	return `/sitemap-${section}.xml`;
}
/** Every sitemap document a rebuild must refresh (index, sections, legacy single file). */
var SITEMAP_PATHS = [
	"/sitemap-index.xml",
	"/sitemap-0.xml",
	...SITEMAP_SECTIONS.map(sectionPath)
];
//#endregion
export { CREDENTIAL_GROUPS as A, credentialImageSrc as B, faqPageHref as C, homeFaqItems as D, groupedFaqItems as E, featuredCredentials as F, businessCardHref as G, BUSINESS_CARD_QR_PATH as H, formatCompleted as I, businessCardLinks as K, formatDuration as L, credentials as M, credentialsHref as N, CREDENTIALS_SLUG as O, credentialsInGroup as P, shortTitle as R, FAQ_PAGE_UPDATED_AT as S, getFaqPageCopy as T, BUSINESS_CARD_SLUG as U, BUSINESS_CARD_PREVIEW as V, businessCardCopy as W, JOURNAL_ARTICLES as _, getServiceById as a, platformHref as b, retiredServiceTarget as c, articleUrl as d, referenceCases as f, hasBannedWord as g, fetchBlocks as h, sectionPath as i, CREDENTIAL_GROUP_ORDER as j, CREDENTIALS_UPDATED_AT as k, serviceDefinitions as l, cmsFor as m, SITEMAP_SECTIONS as n, getServiceBySlug as o, referencesForPlatform as p, siteConfig as q, isSitemapSection as r, resolveServiceContent as s, SITEMAP_PATHS as t, serviceHref as u, getPlatformBySlug as v, getFaqContent as w, FAQ_PAGE_SLUG as x, platformDefinitions as y, CREDENTIAL_IMAGE as z };
