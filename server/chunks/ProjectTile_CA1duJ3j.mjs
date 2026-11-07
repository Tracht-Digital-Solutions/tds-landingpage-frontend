import { F as addAttribute, O as renderTemplate, S as renderComponent, k as maybeRenderHead } from "./sequence_-pfDyphk.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import { t as createAstro } from "./compiler_BVs5vHf6.mjs";
import { a as getServiceById, d as articleUrl, f as referenceCases, u as serviceHref } from "./sitemapSections_C04t0f1v.mjs";
import { c as DEMO_ORIGINS, i as getReferencePreviews, l as DEMO_PREVIEW, n as $$BusinessCardTile, r as $$ProjectCard, s as DEMO_KINDS, t as $$DemoCard } from "./DemoCard_BIZs5he5.mjs";
import { l as srcsetFor, r as PREVIEW_VARIANT_WIDTHS } from "./imageVariants_cec24M0W.mjs";
import { n as mediaSrc, t as $$CardActions } from "./CardActions_DcKuTpXy.mjs";
// src/lib/designStudyMeta.ts
/**
* Constants shared by the design-study import script and the renderer.
*
* Split out for the same reason `demoCatalog.ts` is split from `demos.ts`:
* `scripts/design-studies.ts` runs under plain Node and must not drag the
* content cache, the i18n bundle or `import.meta.env` into a context that has
* none of them.
*
* **No imports.**
*/
/** Folder under `public/` the import script owns exclusively. */
var STUDY_ASSET_DIR = "designstudien";
/** `/designstudien/<id>.webp` — the one place this path is spelled. */
function studyImageSrc(id) {
	return `/${STUDY_ASSET_DIR}/${id}.webp`;
}
// src/lib/designStudies.ts
var VIEW_LABELS = {
	desktop: {
		de: "Am Rechner",
		en: "On a desktop"
	},
	mobile: {
		de: "Auf dem Telefon",
		en: "On a phone"
	},
	home: {
		de: "Startseite",
		en: "Home page"
	},
	advisor: {
		de: "Produktberater",
		en: "Product finder"
	}
};
var designStudies = [
	{
		id: "kinderarztpraxis-sonnengarten",
		kind: "website",
		title: "Kinderarztpraxis Sonnengarten",
		sector: {
			de: "Gesundheit · Arztpraxis",
			en: "Health · medical practice"
		},
		description: {
			de: "Eine Praxisseite für Eltern: Leistungen, Sprechzeiten, Anfahrt. Die zweite Ansicht zeigt dieselbe Seite auf dem Telefon.",
			en: "A practice page for parents: services, opening hours, directions. The second view shows the same page on a phone."
		},
		views: [{
			id: "desktop",
			label: VIEW_LABELS.desktop,
			src: studyImageSrc("kinderarztpraxis-sonnengarten"),
			width: 1024,
			height: 1536
		}, {
			id: "mobile",
			label: VIEW_LABELS.mobile,
			src: studyImageSrc("kinderarztpraxis-sonnengarten-mobil"),
			width: 862,
			height: 1825
		}]
	},
	{
		id: "mira-markt",
		kind: "shop",
		title: "Mira Markt",
		sector: {
			de: "Handel · Lebensmittelmarkt",
			en: "Retail · grocery store"
		},
		description: {
			de: "Ein Markt mit Onlinebestellung und Abholung vor Ort. Drei Sprachen im Kopf, die Kategorien als Bildkacheln.",
			en: "A grocery with online ordering and pickup in store. Three languages in the header, the categories as picture tiles."
		},
		views: [{
			id: "home",
			label: VIEW_LABELS.home,
			src: studyImageSrc("mira-markt"),
			width: 1440,
			height: 810
		}]
	},
	{
		id: "prisma-coat",
		kind: "website",
		title: "PRISMA COAT",
		sector: {
			de: "Industrie · Beschichtung",
			en: "Industry · coating"
		},
		description: {
			de: "Ein Industriebetrieb mit sechs Leistungen und fünf Branchen. Das Anfrageformular steht neben der Vorstellung, nicht auf einer eigenen Seite.",
			en: "An industrial supplier with six services and five sectors. The enquiry form sits beside the introduction rather than on a page of its own."
		},
		views: [{
			id: "home",
			label: VIEW_LABELS.home,
			src: studyImageSrc("prisma-coat"),
			width: 1254,
			height: 1254
		}]
	},
	{
		id: "mkb-beratung",
		kind: "website",
		title: "MKB · Psychosoziale Beratung",
		sector: {
			de: "Gesundheit · Beratung",
			en: "Health · counselling"
		},
		description: {
			de: "Eine ruhige Seite für eine Beratungspraxis. Der Ablauf in fünf Schritten, die Qualifikationen, die häufigen Fragen.",
			en: "A quiet page for a counselling practice. The process in five steps, the qualifications, the common questions."
		},
		views: [{
			id: "home",
			label: VIEW_LABELS.home,
			src: studyImageSrc("mkb-beratung"),
			width: 724,
			height: 2172
		}]
	},
	{
		id: "serverspace24",
		kind: "website",
		title: "ServerSpace24",
		sector: {
			de: "IT · Hosting und Domains",
			en: "IT · hosting and domains"
		},
		description: {
			de: "Ein Hoster mit dichter Tarifübersicht und Domainsuche. Die zweite Ansicht ist der Produktberater.",
			en: "A hosting provider with a dense tariff table and a domain search. The second view is the product finder."
		},
		views: [{
			id: "home",
			label: VIEW_LABELS.home,
			src: studyImageSrc("serverspace24"),
			width: 1024,
			height: 1536
		}, {
			id: "advisor",
			label: VIEW_LABELS.advisor,
			src: studyImageSrc("serverspace24-produktberater"),
			width: 1024,
			height: 1536
		}]
	},
	{
		id: "jurisblick",
		kind: "website",
		title: "Jurisblick.de",
		sector: {
			de: "Recht · Informationsportal",
			en: "Law · information portal"
		},
		description: {
			de: "Ein Rechtsportal mit viel Inhalt und wenig Platz. Die Navigation trägt die Struktur, die Startseite nur den Einstieg.",
			en: "A legal portal with a lot of content and little room. The navigation carries the structure, the home page only the way in."
		},
		views: [{
			id: "home",
			label: VIEW_LABELS.home,
			src: studyImageSrc("jurisblick"),
			width: 1024,
			height: 1536
		}]
	}
];
/** The card's picture — `views[0]`, named so nothing indexes the array by hand. */
function coverView(study) {
	return study.views[0];
}
/** This site's own words about its own cards. Not editable copy. */
var studyUi = {
	de: {
		open: "Design ansehen",
		sectorLabel: "Branche",
		viewsLabel: "Ansichten"
	},
	en: {
		open: "View the design",
		sectorLabel: "Sector",
		viewsLabel: "Views"
	}
};
// src/lib/caseCards.ts
async function getCaseCards(lang) {
	const previews = await getReferencePreviews();
	return referenceCases.map((entry) => ({
		id: entry.id,
		preview: previews.get(entry.id) ?? null,
		reference: entry.content[lang],
		services: entry.services.map((id) => {
			const service = getServiceById(id);
			return {
				label: service.fallback[lang].title,
				href: serviceHref(service, lang)
			};
		}),
		articleHref: entry.articleSlug ? articleUrl(entry.articleSlug, lang) : null,
		siteHref: entry.siteUrl
	})).sort((a, b) => Number(b.preview !== null) - Number(a.preview !== null));
}
// src/lib/ownProjects.ts
var ownProjects = [
	{
		id: "wparted",
		image: {
			de: "/projects/wparted-programm-de.webp",
			en: "/projects/wparted-programm-en.webp"
		},
		href: {
			de: "https://wparted.tracht-digital.de/",
			en: "https://wparted.tracht-digital.de/en/"
		},
		hreflang: {
			de: "de",
			en: "en"
		},
		service: "solutions",
		labels: {
			de: [
				"Windows 11",
				"Open Source",
				"Beta"
			],
			en: [
				"Windows 11",
				"Open source",
				"Beta"
			]
		},
		copy: {
			de: {
				title: "WParted",
				kind: "Software",
				text: "Freier Partitionsmanager für Windows 11, eine GParted-Alternative. Open Source, entwickelt von Tracht Digital Solutions. Beta: physische Datenträger bleiben gesperrt.",
				cta: "Zur WParted-Webseite",
				alt: "WParted mit Datenträgerkarte, Partitionsliste und einer ausstehenden Operation",
				highlights: {
					label: "Das Besondere",
					items: [
						"Läuft direkt unter Windows, ohne Installation und ohne Linux-Live-System",
						"Erst planen, dann anwenden; jeder Schritt wird zurückgelesen und geprüft",
						"Eigene Umsetzung von NTFS, exFAT und ext4, geprüft mit unabhängigen Werkzeugen"
					]
				}
			},
			en: {
				title: "WParted",
				kind: "Software",
				text: "Free partition manager for Windows 11, a GParted alternative. Open source, developed by Tracht Digital Solutions. Beta: physical disks stay locked.",
				cta: "Visit the WParted website",
				alt: "WParted showing a disk map, a partition list and one pending operation",
				highlights: {
					label: "What is special",
					items: [
						"Runs directly on Windows, with no installation and no Linux live system",
						"Plan first, then apply; every step is read back and verified",
						"Own implementation of NTFS, exFAT and ext4, checked with independent tools"
					]
				}
			}
		}
	},
	{
		id: "pi-imager-android",
		image: {
			de: "/projects/pi-imager-android.webp",
			en: "/projects/pi-imager-android.webp"
		},
		href: {
			de: "https://github.com/jtracht/rpi-imager-android",
			en: "https://github.com/jtracht/rpi-imager-android"
		},
		hreflang: {
			de: "de",
			en: "de"
		},
		service: "solutions",
		labels: {
			de: [
				"Android",
				"Open Source",
				"USB-OTG"
			],
			en: [
				"Android",
				"Open source",
				"USB OTG"
			]
		},
		copy: {
			de: {
				title: "Pi Imager für Android",
				kind: "App",
				text: "Freie Android-App, die Raspberry-Pi-Images ohne PC und ohne Root über USB-OTG schreibt und jeden Sektor prüft. Unabhängiges Open-Source-Projekt, bisher auf Emulatoren geprüft.",
				cta: "Quellcode ansehen",
				alt: "Pi Imager für Android auf Tablet und Handy, mit fertig vorbereitetem Image und Modellauswahl"
			},
			en: {
				title: "Pi Imager for Android",
				kind: "App",
				text: "Free Android app that writes Raspberry Pi images over USB OTG, with no PC and no root, and verifies every sector. Independent open-source project, tested on emulators so far.",
				cta: "View the source",
				alt: "Pi Imager for Android on tablet and phone, with a prepared image and the model picker (German interface)"
			}
		}
	},
	{
		id: "wparted-website",
		image: {
			de: "/projects/wparted-webseite-de.webp",
			en: "/projects/wparted-webseite-en.webp"
		},
		href: {
			de: "https://wparted.tracht-digital.de/",
			en: "https://wparted.tracht-digital.de/en/"
		},
		hreflang: {
			de: "de",
			en: "en"
		},
		service: "web-presence",
		labels: {
			de: [
				"Zweisprachig",
				"SEO",
				"KI-Sichtbarkeit"
			],
			en: [
				"Bilingual",
				"SEO",
				"AI visibility"
			]
		},
		copy: {
			de: {
				title: "WParted-Webseite",
				kind: "Webseite",
				text: "Die Projektseite zu WParted: zweisprachig, auf Suchmaschinen und KI-Antworten ausgerichtet und an die eigene Plattform angebunden.",
				cta: "Webseite ansehen",
				alt: "Startseite der WParted-Webseite mit dem Maskottchen Parti und einer Datenträgerleiste"
			},
			en: {
				title: "WParted website",
				kind: "Website",
				text: "The project page for WParted: in two languages, set up for search engines and AI answers, and connected to our own platform.",
				cta: "View the website",
				alt: "Home page of the WParted website with the mascot Parti and a disk bar"
			}
		}
	}
];
// src/components/ui/OwnProjectCard.astro
createAstro("https://tracht-digital.de");
var $$OwnProjectCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$OwnProjectCard;
	const { project, lang } = Astro.props;
	const copy = project.copy[lang];
	const service = getServiceById(project.service);
	const serviceLink = {
		label: service.fallback[lang].title,
		href: serviceHref(service, lang)
	};
	return renderTemplate`${renderComponent($$result, "ProjectCard", $$ProjectCard, {
		"title": copy.title,
		"src": mediaSrc(project.image[lang]),
		"alt": copy.alt,
		"width": DEMO_PREVIEW.width,
		"height": DEMO_PREVIEW.height,
		"origin": DEMO_ORIGINS.own[lang],
		"kind": copy.kind,
		"text": copy.text,
		"labels": project.labels[lang]
	}, { "actions": ($$result) => renderTemplate`${renderComponent($$result, "CardActions", $$CardActions, {
		"slot": "actions",
		"lang": lang,
		"service": serviceLink,
		"cta": {
			href: project.href[lang],
			label: copy.cta,
			external: true,
			hreflang: project.hreflang[lang],
			detail: copy.title
		}
	})}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/OwnProjectCard.astro", void 0);
// src/components/ui/ReferenceCard.astro
createAstro("https://tracht-digital.de");
var $$ReferenceCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ReferenceCard;
	const { card, lang, badge } = Astro.props;
	const ui = lang === "de" ? {
		context: "Kontext",
		result: "Ergebnis",
		metric: "Belegbare Kennzahl",
		article: "Mehr erfahren",
		site: "Webseite ansehen",
		previewAlt: (title) => `Startseite der Webseite: ${title}`
	} : {
		context: "Context",
		result: "Outcome",
		metric: "Verifiable metric",
		article: "Learn more",
		site: "View the website",
		previewAlt: (title) => `Home page of the website: ${title}`
	};
	const [primaryService, ...furtherServices] = card.services;
	const cta = card.articleHref ? {
		href: card.articleHref,
		label: ui.article,
		detail: card.reference.title
	} : card.siteHref ? {
		href: card.siteHref,
		label: ui.site,
		external: true,
		hreflang: "de",
		detail: card.reference.title
	} : null;
	return renderTemplate`${renderComponent($$result, "ProjectCard", $$ProjectCard, {
		"title": card.reference.title,
		"src": card.preview ? mediaSrc(card.preview.src) : null,
		"srcset": card.preview ? srcsetFor(card.preview.src, PREVIEW_VARIANT_WIDTHS, card.preview.width, mediaSrc) : void 0,
		"alt": ui.previewAlt(card.reference.title),
		"width": card.preview?.width,
		"height": card.preview?.height,
		"origin": badge,
		"kind": card.reference.context,
		"kindLabel": ui.context,
		"text": card.reference.result,
		"textLabel": ui.result,
		"data-astro-cid-ew64svfl": true
	}, {
		"default": ($$result) => renderTemplate`${card.reference.metric && renderTemplate`${maybeRenderHead($$result)}<p class="reference-card__metric" data-astro-cid-ew64svfl><span class="sr-only" data-astro-cid-ew64svfl>${ui.metric}: </span>${card.reference.metric}</p>`}${furtherServices.length > 0 && renderTemplate`<ul class="reference-card__services" data-astro-cid-ew64svfl>${furtherServices.map((service) => renderTemplate`<li data-astro-cid-ew64svfl><a${addAttribute(service.href, "href")} class="status-pill status-pill--accent reference-card__service" data-astro-cid-ew64svfl>${service.label}</a></li>`)}</ul>`}`,
		"actions": ($$result) => renderTemplate`${renderComponent($$result, "CardActions", $$CardActions, {
			"slot": "actions",
			"lang": lang,
			"service": primaryService ? {
				href: primaryService.href,
				label: primaryService.label
			} : null,
			"cta": cta,
			"data-astro-cid-ew64svfl": true
		})}`
	})}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/ReferenceCard.astro", void 0);
// src/components/ui/StudyCard.astro
createAstro("https://tracht-digital.de");
var $$StudyCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$StudyCard;
	const { study, lang, serviceLink = null } = Astro.props;
	const ui = studyUi[lang];
	const cover = coverView(study);
	const kind = DEMO_KINDS[study.kind][lang];
	const origin = DEMO_ORIGINS.study[lang];
	const sector = study.sector[lang];
	const alt = lang === "de" ? `Designstudie für ${study.title} – ${sector}` : `Design study for ${study.title} – ${sector}`;
	const views = study.views.length > 1 ? study.views.map((view) => ({
		id: view.id,
		label: view.label[lang],
		src: mediaSrc(view.src),
		ratio: `${view.width} / ${view.height}`
	})) : void 0;
	const fit = cover.height > cover.width ? "tall" : "cover";
	return renderTemplate`${renderComponent($$result, "ProjectCard", $$ProjectCard, {
		"title": study.title,
		"src": mediaSrc(cover.src),
		"srcset": srcsetFor(cover.src, PREVIEW_VARIANT_WIDTHS, cover.width, mediaSrc),
		"alt": alt,
		"width": cover.width,
		"height": cover.height,
		"origin": origin,
		"kind": kind,
		"text": study.description[lang],
		"labels": sector.split(" · "),
		"labelsLabel": ui.sectorLabel
	}, { "actions": ($$result) => renderTemplate`${renderComponent($$result, "CardActions", $$CardActions, {
		"slot": "actions",
		"lang": lang,
		"service": serviceLink,
		"cta": {
			label: ui.open,
			detail: study.title,
			preview: {
				src: mediaSrc(cover.src),
				alt,
				title: study.title,
				caption: sector,
				fit,
				ratio: `${cover.width} / ${cover.height}`,
				views
			}
		}
	})}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/StudyCard.astro", void 0);
// src/components/ui/ProjectTile.astro
createAstro("https://tracht-digital.de");
var $$ProjectTile = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProjectTile;
	const { entry, lang, serviceLink } = Astro.props;
	const clientBadge = lang === "de" ? "Kundenprojekt" : "Client project";
	return renderTemplate`${entry.kind === "case" && renderTemplate`${renderComponent($$result, "ReferenceCard", $$ReferenceCard, {
		"card": entry.card,
		"lang": lang,
		"badge": clientBadge
	})}`}${entry.kind === "project" && renderTemplate`${renderComponent($$result, "OwnProjectCard", $$OwnProjectCard, {
		"project": entry.project,
		"lang": lang
	})}`}${entry.kind === "demo" && renderTemplate`${renderComponent($$result, "DemoCard", $$DemoCard, {
		"demo": entry.demo,
		"lang": lang,
		"serviceLink": serviceLink
	})}`}${entry.kind === "study" && renderTemplate`${renderComponent($$result, "StudyCard", $$StudyCard, {
		"study": entry.study,
		"lang": lang,
		"serviceLink": serviceLink
	})}`}${entry.kind === "business-card" && renderTemplate`${renderComponent($$result, "BusinessCardTile", $$BusinessCardTile, { "serviceLink": serviceLink })}`}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/ProjectTile.astro", void 0);
export { designStudies as a, coverView as i, ownProjects as n, getCaseCards as r, $$ProjectTile as t };
