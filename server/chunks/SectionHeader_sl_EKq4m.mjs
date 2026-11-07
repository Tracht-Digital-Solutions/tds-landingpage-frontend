import { F as addAttribute, O as renderTemplate, S as renderComponent, k as maybeRenderHead } from "./sequence_-pfDyphk.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import { t as createAstro } from "./compiler_BVs5vHf6.mjs";
import { a as memoisedOr, n as readContentJson, s as createImageCatalog } from "./siteKey_BFQrbRAC.mjs";
import { i as contentApiBase } from "./connection_DRnNNV70.mjs";
import { t as PROPERTY_ORIGINS } from "./chunk-HBL4WJRR_DElGvGBP.mjs";
import { t as $$AccentLetters } from "./AccentLetters_uelZXL28.mjs";
// src/lib/homeContent.ts
var content = {
	de: {
		hero: {
			eyebrow: "Digitale Lösungen für kleine und mittlere Betriebe",
			headline: "Alles an einem Ort.",
			headlineAccent: "Ein eigenes",
			headlineSuffix: "Panel.",
			sub: "Tracht Digital Solutions bündelt Aufträge, Kunden und Termine in einem System – für Team und Kundschaft. Wiederkehrende Arbeit läuft *automatisch*, mit einem festen Ansprechpartner.",
			cta1: "Erstgespräch vereinbaren",
			cta2: "Leistungen ansehen",
			ctaNote: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren. Antwort in der Regel innerhalb von 24 Stunden.",
			scrollHint: "Wieso ich?"
		},
		whyMe: {
			headline: "Wieso",
			headlineAccent: "ich?",
			lead: "*Ein Ansprechpartner* statt fünf Anbieter.",
			p1: "Tracht Digital Solutions baut auf dem auf, was schon da ist, statt alles neu zu machen.",
			p2: "Hinter Tracht Digital Solutions steht Julian Tracht – aus Schwarzenbek bei Hamburg, für Betriebe in ganz Deutschland.",
			portfolioLink: "Freelancer-Portfolio ansehen",
			motivation: {
				title: "Warum ich das mache",
				body: ["Zu oft hängt digitale Arbeit an Behelfen: eine Tabelle hier, ein Zettel dort, ein Passwort für alle.", "Das will ich ändern. Ich baue, was zum Ablauf eines Betriebs passt – sicher und ohne Pflegeaufwand im Alltag."]
			},
			reasons: [
				{
					title: "Bestehendes wird übernommen",
					description: "Auch fremder Code und fremde Systeme."
				},
				{
					title: "Ein fester Ansprechpartner",
					description: "Eine Person ist zuständig, vom ersten Gespräch bis zur Betreuung."
				},
				{
					title: "Verständlich erklärt",
					description: "Klare Möglichkeiten und Kosten, ohne Fachsprache."
				},
				{
					title: "Auch nach dem Start da",
					description: "Auf Wunsch dauerhafte Betreuung."
				}
			]
		},
		servicesOverview: {
			headline: "Digitale",
			headlineAccent: "Lösungen.",
			intro: "Fünf Leistungen, *ein Ansprechpartner*: vom eigenen Panel über digitale Abläufe bis zur Website."
		},
		websiteDemos: {
			headline: "Beispielseiten und",
			headlineAccent: "Designstudien.",
			intro: "Eigene Demos und Entwürfe – *keine Kundenaufträge*.",
			serviceIntro: "Eigene Demos und Projekte, live im Netz – *keine Kundenaufträge*.",
			headlineSingle: "Eine Beispielseite zum",
			introSingle: "Eine eigene Beispielseite – *kein Kundenauftrag*. Zum Durchklicken.",
			serviceIntroSingle: "Eine eigene Beispielseite, live im Netz – *kein Kundenauftrag*."
		},
		referencesHome: {
			headline: "Umgesetzt für",
			headlineAccent: "Kunden.",
			intro: "Abgeschlossene Projekte – und *was sie gebracht haben*.",
			label: "Veröffentlicht nur mit Freigabe der Kunden.",
			serviceCta: "Zur passenden Leistung"
		},
		digitalResponsibility: {
			headline: "Ein Ansprechpartner für",
			headlineAccent: "alles Digitale.",
			body: "Digitale Themen bleiben liegen, weil niemand zuständig ist. Tracht Digital Solutions übernimmt die Zuständigkeit.",
			points: [
				"Klar benennen, was zuerst dran ist",
				"Arbeit und Daten in einem Panel bündeln",
				"Vorhandene Systeme übernehmen statt ersetzen"
			],
			primaryCta: "Erstgespräch vereinbaren",
			secondaryCta: "Preise ansehen"
		},
		contactHeading: {
			headline: "Womit fangen",
			headlineAccent: "wir an?",
			sub: "Eine kurze Nachricht genügt. Die Antwort kommt in der Regel innerhalb von 24 Stunden."
		},
		journalHeading: {
			headline: "Blog für",
			headlineAccent: "Betriebe."
		},
		trust: {
			title: "Worauf Verlass ist",
			facts: [
				{
					title: "Ein fester Ansprechpartner",
					text: "Jedes Gespräch führt {name} aus {town} bei Hamburg.",
					linkLabel: "Über Tracht Digital"
				},
				{
					title: "Kundenprojekte mit Freigabe",
					text: "Veröffentlicht nur mit Freigabe der Kunden.",
					linkLabel: "Projekte ansehen"
				},
				{
					title: "Offene Preise",
					text: "Festpreise ab {rate} € netto, alles andere auf Anfrage.",
					linkLabel: "Preise ansehen"
				}
			]
		},
		firstCall: {
			title: "Das Erstgespräch",
			nextStepsTitle: "So geht es weiter",
			items: [
				{
					label: "Ziel",
					text: "Klären, wo es hakt – und ob und wie Tracht Digital helfen kann."
				},
				{
					label: "Vorbereitung",
					text: "Zwei, drei Sätze genügen. Ein Link hilft."
				},
				{
					label: "Ergebnis",
					text: "Klarheit, was zuerst dran ist und was es ungefähr kostet."
				},
				{
					label: "Kosten",
					text: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren."
				}
			],
			cta: "Erstgespräch vereinbaren"
		},
		pricingLogic: {
			title: "So entsteht der Preis",
			steps: [
				{
					title: "Wie klar die Aufgabe ist",
					text: "Ein klares Ziel kostet weniger als eine offene Idee. Im Erstgespräch wird aus der Idee eine klare Aufgabe."
				},
				{
					title: "Wie viel Verantwortung dranhängt",
					text: "Eine Infoseite kostet weniger als ein Shop, der Geld annimmt. Zahlungen und Kundendaten brauchen mehr Sorgfalt – das kostet mehr."
				},
				{
					title: "Was am Ende steht",
					text: "Passt es in ein Paket, gilt der Festpreis. Sonst gibt es ein eigenes Angebot mit Preis und Termin – vor jeder Zusage."
				}
			],
			note: "Was sich nicht einschätzen lässt, wird nicht geraten: erst ansehen, dann einen Preis nennen."
		}
	},
	en: {
		hero: {
			eyebrow: "Digital solutions for small and mid-sized businesses",
			headline: "Everything in one place.",
			headlineAccent: "A panel of",
			headlineSuffix: "its own.",
			sub: "Tracht Digital Solutions brings orders, customers and appointments together in one system – for the team and its customers. Recurring work runs *automatically*, with one steady point of contact.",
			cta1: "Arrange an initial consultation",
			cta2: "View services",
			ctaNote: "Costs only arise once we agree on an assignment. Replies usually within 24 hours.",
			scrollHint: "Why me?"
		},
		whyMe: {
			headline: "Why",
			headlineAccent: "me?",
			portfolioLink: "View freelance portfolio",
			lead: "*One point of contact* instead of five suppliers.",
			p1: "Tracht Digital Solutions builds on what already exists instead of starting from scratch.",
			p2: "Behind Tracht Digital Solutions is Julian Tracht – based in Schwarzenbek near Hamburg, working with businesses across Germany.",
			motivation: {
				title: "Why I do this",
				body: ["Too often digital work hangs on stopgaps: a spreadsheet here, a note there, one password for everyone.", "I want to change that. I build what fits the way a business works – secure, and without upkeep in day-to-day work."]
			},
			reasons: [
				{
					title: "Existing systems taken over",
					description: "Someone else’s code and systems included."
				},
				{
					title: "One steady contact",
					description: "One person in charge, from the first conversation to ongoing support."
				},
				{
					title: "Explained plainly",
					description: "Clear options and costs, without the jargon."
				},
				{
					title: "Still there after launch",
					description: "Ongoing support on request."
				}
			]
		},
		servicesOverview: {
			headline: "Digital",
			headlineAccent: "solutions.",
			intro: "Five services, *one point of contact*: from a panel of its own and digital workflows to the website."
		},
		websiteDemos: {
			headline: "Example sites and",
			headlineAccent: "design studies.",
			intro: "Own demos and drafts – *not client work*. The demos are live on the web.",
			serviceIntro: "Own demos and projects, live on the web – *not client work*.",
			headlineSingle: "An example site to",
			introSingle: "An example site of our own – *not client work*. Ready to click through.",
			serviceIntroSingle: "An example site of our own, live on the web – *not client work*."
		},
		referencesHome: {
			headline: "Delivered for",
			headlineAccent: "clients.",
			intro: "Finished projects – and *what they achieved*.",
			label: "Published only with the client's approval.",
			serviceCta: "See the matching service"
		},
		digitalResponsibility: {
			headline: "One point of contact for",
			headlineAccent: "everything digital.",
			body: "Digital work stalls because nobody owns it. Tracht Digital Solutions takes that ownership on.",
			points: [
				"Name plainly what comes first",
				"Bring work and data together in one panel",
				"Take existing systems over rather than replace them"
			],
			primaryCta: "Arrange an initial consultation",
			secondaryCta: "View pricing"
		},
		contactHeading: {
			headline: "Where shall we",
			headlineAccent: "start?",
			sub: "A short message is enough. Replies usually arrive within 24 hours."
		},
		journalHeading: {
			headline: "Blog for",
			headlineAccent: "businesses."
		},
		trust: {
			title: "What to rely on",
			facts: [
				{
					title: "One steady contact",
					text: "Every conversation is with {name}, based in {town} near Hamburg.",
					linkLabel: "About Tracht Digital"
				},
				{
					title: "Approved client projects",
					text: "Published only with the client's approval.",
					linkLabel: "View projects"
				},
				{
					title: "Open pricing",
					text: "Fixed prices from €{rate} net, everything else on request.",
					linkLabel: "View pricing"
				}
			]
		},
		firstCall: {
			title: "The first conversation",
			nextStepsTitle: "What happens next",
			items: [
				{
					label: "Goal",
					text: "Find out where things get stuck – and whether and how Tracht Digital can help."
				},
				{
					label: "Preparation",
					text: "Two or three sentences are enough. A link helps."
				},
				{
					label: "Outcome",
					text: "Clarity on what comes first and roughly what it costs."
				},
				{
					label: "Costs",
					text: "Costs only arise once we agree on an assignment."
				}
			],
			cta: "Arrange an initial consultation"
		},
		pricingLogic: {
			title: "How a price comes about",
			steps: [
				{
					title: "How clear the task is",
					text: "A clear goal costs less than an open idea. The first conversation turns the idea into a clear task."
				},
				{
					title: "How much responsibility it carries",
					text: "An information page costs less than a shop that takes money. Payments and customer data need more care – and that costs more."
				},
				{
					title: "What stands at the end",
					text: "If it fits a package, the fixed price applies. Otherwise there is a quote of its own with a price and a date – before any commitment."
				}
			],
			note: "What cannot be assessed is not guessed: look first, then name a price."
		}
	}
};
function getHomeContent(lang) {
	return content[lang];
}
/**
* Pick the demo section's framing for the number of cards that survived.
*
* Takes the already-merged content, so a CMS override of any single field is
* honoured on both counts. `count` is the length of `getDemos()`, never a
* configured number: the section only ever describes what it is about to show.
*
* A count of 0 never reaches a reader — the section renders nothing at all —
* but it returns the plural set rather than throwing, because a section header
* is not the place to discover an empty list.
*/
function demosCopy(content, count, variant) {
	const single = count === 1;
	const intro = single ? variant === "service" ? content.serviceIntroSingle : content.introSingle : variant === "service" ? content.serviceIntro : content.intro;
	return {
		headline: single ? content.headlineSingle : content.headline,
		headlineAccent: content.headlineAccent,
		intro: dropRetiredSentences(intro)
	};
}
/**
* Sentences the section no longer says, removed from whatever arrives here.
*
* A render-side removal rather than only an edit to the strings above, and the
* same arrangement the "Wieso ich?" section uses: `content` is the committed
* copy MERGED WITH a CMS block, so a block an editor saved before today would
* otherwise put the sentence straight back — on the live site, with nothing in
* this repository to explain it.
*
* "Die Demos laufen live im Netz." went on 2026-09-29, asked for. The cards say
* where they lead; the sentence only repeated it.
*/
function dropRetiredSentences(intro) {
	return intro.replace(/\s*Die Demos laufen live im Netz\.\s*/g, " ").trim();
}
// src/lib/imageCatalog.ts
/** The generated editorial image catalogue (tds-shared helper). */
var { imageInfo, imageHints, imageObject } = createImageCatalog({
	"/images/services/04-webauftritt-editorial.webp": {
		"src": "/images/services/04-webauftritt-editorial.webp",
		"width": 1536,
		"height": 960,
		"alt": {
			"de": "Laptop, Telefon und Layoutkarten als Symbol für Webauftritte und Onlineshops.",
			"en": "Laptop, phone and layout cards illustrating websites and online shops."
		},
		"variants": [
			{
				"src": "/images/services/04-webauftritt-editorial-480.webp",
				"width": 480,
				"height": 300,
				"hash": "60f5b6478bf8",
				"bytes": 19936
			},
			{
				"src": "/images/services/04-webauftritt-editorial-800.webp",
				"width": 800,
				"height": 500,
				"hash": "39435f9b3ea9",
				"bytes": 38584
			},
			{
				"src": "/images/services/04-webauftritt-editorial-960.webp",
				"width": 960,
				"height": 600,
				"hash": "a566c32dfcda",
				"bytes": 48868
			},
			{
				"src": "/images/services/04-webauftritt-editorial-1440.webp",
				"width": 1440,
				"height": 900,
				"hash": "d0b35926e427",
				"bytes": 81590
			},
			{
				"src": "/images/services/04-webauftritt-editorial.webp",
				"width": 1536,
				"height": 960,
				"hash": "b7c19dfb25c7",
				"bytes": 88872
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/services/01-beratung-editorial.webp": {
		"src": "/images/services/01-beratung-editorial.webp",
		"width": 1536,
		"height": 960,
		"alt": {
			"de": "Hände und Planungskarten als Symbol für Beratung und Konzeption.",
			"en": "Hands and planning cards illustrating consulting and planning."
		},
		"variants": [
			{
				"src": "/images/services/01-beratung-editorial-480.webp",
				"width": 480,
				"height": 300,
				"hash": "c96a5c5b6190",
				"bytes": 20724
			},
			{
				"src": "/images/services/01-beratung-editorial-800.webp",
				"width": 800,
				"height": 500,
				"hash": "ae2317dc601b",
				"bytes": 41964
			},
			{
				"src": "/images/services/01-beratung-editorial-960.webp",
				"width": 960,
				"height": 600,
				"hash": "0f0f4762e72e",
				"bytes": 53052
			},
			{
				"src": "/images/services/01-beratung-editorial-1440.webp",
				"width": 1440,
				"height": 900,
				"hash": "a5acf2608937",
				"bytes": 94196
			},
			{
				"src": "/images/services/01-beratung-editorial.webp",
				"width": 1536,
				"height": 960,
				"hash": "ea83ab5c2f1b",
				"bytes": 104394
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/services/02-prozesse-editorial.webp": {
		"src": "/images/services/02-prozesse-editorial.webp",
		"width": 1536,
		"height": 960,
		"alt": {
			"de": "Geordnete Ablagen und Paket als Symbol für betriebliche Prozessoptimierung.",
			"en": "Organised trays and a parcel illustrating business process optimisation."
		},
		"variants": [
			{
				"src": "/images/services/02-prozesse-editorial-480.webp",
				"width": 480,
				"height": 300,
				"hash": "f828d102d4bc",
				"bytes": 25666
			},
			{
				"src": "/images/services/02-prozesse-editorial-800.webp",
				"width": 800,
				"height": 500,
				"hash": "abd69aa2bc41",
				"bytes": 53876
			},
			{
				"src": "/images/services/02-prozesse-editorial-960.webp",
				"width": 960,
				"height": 600,
				"hash": "ca405e056fcc",
				"bytes": 69158
			},
			{
				"src": "/images/services/02-prozesse-editorial-1440.webp",
				"width": 1440,
				"height": 900,
				"hash": "b9bb140329b7",
				"bytes": 126318
			},
			{
				"src": "/images/services/02-prozesse-editorial.webp",
				"width": 1536,
				"height": 960,
				"hash": "c0083d387fbb",
				"bytes": 140234
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/services/03-loesungen-editorial.webp": {
		"src": "/images/services/03-loesungen-editorial.webp",
		"width": 1536,
		"height": 960,
		"alt": {
			"de": "Verbundene Geräte als Symbol für individuelle digitale Lösungen.",
			"en": "Connected devices illustrating tailored digital solutions."
		},
		"variants": [
			{
				"src": "/images/services/03-loesungen-editorial-480.webp",
				"width": 480,
				"height": 300,
				"hash": "79252947ebee",
				"bytes": 18048
			},
			{
				"src": "/images/services/03-loesungen-editorial-800.webp",
				"width": 800,
				"height": 500,
				"hash": "c2b80de7d62c",
				"bytes": 35080
			},
			{
				"src": "/images/services/03-loesungen-editorial-960.webp",
				"width": 960,
				"height": 600,
				"hash": "2be9a41555f2",
				"bytes": 44272
			},
			{
				"src": "/images/services/03-loesungen-editorial-1440.webp",
				"width": 1440,
				"height": 900,
				"hash": "a17d1dc12dae",
				"bytes": 74422
			},
			{
				"src": "/images/services/03-loesungen-editorial.webp",
				"width": 1536,
				"height": 960,
				"hash": "a629dd4011fb",
				"bytes": 81458
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/sections/contact-editorial.webp": {
		"src": "/images/sections/contact-editorial.webp",
		"width": 1860,
		"height": 840,
		"alt": {
			"de": "Telefon und Notizbuch als Symbol für ein Projektgespräch.",
			"en": "Phone and notebook illustrating a project conversation."
		},
		"variants": [
			{
				"src": "/images/sections/contact-editorial-480.webp",
				"width": 480,
				"height": 217,
				"hash": "d230c8706ef2",
				"bytes": 6158
			},
			{
				"src": "/images/sections/contact-editorial-800.webp",
				"width": 800,
				"height": 361,
				"hash": "ed6272bf21b0",
				"bytes": 11294
			},
			{
				"src": "/images/sections/contact-editorial-960.webp",
				"width": 960,
				"height": 434,
				"hash": "288f00ebc757",
				"bytes": 14250
			},
			{
				"src": "/images/sections/contact-editorial-1440.webp",
				"width": 1440,
				"height": 650,
				"hash": "6db10079139a",
				"bytes": 24616
			},
			{
				"src": "/images/sections/contact-editorial.webp",
				"width": 1860,
				"height": 840,
				"hash": "1c3384c084ae",
				"bytes": 35340
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/editorial/power-2026.webp": {
		"src": "/images/editorial/power-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "Notstromgerät und Steckdosenleiste als Symbol für Stromschutz im Büro.",
			"en": "Backup power unit and power strip illustrating office power protection."
		},
		"variants": [
			{
				"src": "/images/editorial/power-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "d7d784fd1a74",
				"bytes": 23748
			},
			{
				"src": "/images/editorial/power-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "5e6bdc0dddfe",
				"bytes": 48930
			},
			{
				"src": "/images/editorial/power-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "68c39a3ea19d",
				"bytes": 62758
			},
			{
				"src": "/images/editorial/power-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "642c15deea08",
				"bytes": 107984
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/editorial/mobile-2026.webp": {
		"src": "/images/editorial/mobile-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "Laptop und Zubehör am Zugfenster als Symbol für mobiles Arbeiten.",
			"en": "Laptop and accessories beside a train window illustrating mobile work."
		},
		"variants": [
			{
				"src": "/images/editorial/mobile-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "974e4b65c144",
				"bytes": 20622
			},
			{
				"src": "/images/editorial/mobile-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "6228bc1db9c6",
				"bytes": 43988
			},
			{
				"src": "/images/editorial/mobile-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "0d186e209549",
				"bytes": 57432
			},
			{
				"src": "/images/editorial/mobile-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "29b802a6bbb9",
				"bytes": 99894
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/editorial/paper-2026.webp": {
		"src": "/images/editorial/paper-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "Dokumentenscanner und Ablage als Symbol für ein papierloses Büro.",
			"en": "Document scanner and filing folder illustrating a paperless office."
		},
		"variants": [
			{
				"src": "/images/editorial/paper-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "0ce3319555c0",
				"bytes": 19424
			},
			{
				"src": "/images/editorial/paper-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "d30174e3d275",
				"bytes": 37118
			},
			{
				"src": "/images/editorial/paper-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "afe10fa2153d",
				"bytes": 48562
			},
			{
				"src": "/images/editorial/paper-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "1aa58949cda4",
				"bytes": 84206
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/editorial/video-2026.webp": {
		"src": "/images/editorial/video-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "Kamera, Mikrofon und Bildschirm als Symbol für Videocalls und Homeoffice.",
			"en": "Camera, microphone and monitor illustrating video calls and home working."
		},
		"variants": [
			{
				"src": "/images/editorial/video-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "af9bd6a52ad9",
				"bytes": 24514
			},
			{
				"src": "/images/editorial/video-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "e69c48f9024b",
				"bytes": 52054
			},
			{
				"src": "/images/editorial/video-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "5924499c51ad",
				"bytes": 68362
			},
			{
				"src": "/images/editorial/video-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "ea5797b08b7b",
				"bytes": 121580
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/editorial/keys-2026.webp": {
		"src": "/images/editorial/keys-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "USB-Sicherheitsschlüssel als Symbol für Passkeys und sichere Anmeldung.",
			"en": "USB security keys illustrating passkeys and secure sign-in."
		},
		"variants": [
			{
				"src": "/images/editorial/keys-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "20834be31ba0",
				"bytes": 21128
			},
			{
				"src": "/images/editorial/keys-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "ab2100c24f76",
				"bytes": 51312
			},
			{
				"src": "/images/editorial/keys-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "222a82cb2467",
				"bytes": 69380
			},
			{
				"src": "/images/editorial/keys-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "873c586892da",
				"bytes": 128932
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/editorial/backup-2026.webp": {
		"src": "/images/editorial/backup-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "Separate Datenträger als Symbol für betriebliche Datensicherung.",
			"en": "Separate storage drives illustrating business backups."
		},
		"variants": [
			{
				"src": "/images/editorial/backup-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "d405f4bd64d8",
				"bytes": 19032
			},
			{
				"src": "/images/editorial/backup-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "a217dab7afd4",
				"bytes": 38504
			},
			{
				"src": "/images/editorial/backup-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "3ae1fe347856",
				"bytes": 51218
			},
			{
				"src": "/images/editorial/backup-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "050426db9d20",
				"bytes": 93992
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/editorial/wifi-2026.webp": {
		"src": "/images/editorial/wifi-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "Netzwerkgerät und Kabel als Symbol für Büro-WLAN.",
			"en": "Network device and cable illustrating office Wi-Fi."
		},
		"variants": [
			{
				"src": "/images/editorial/wifi-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "3d4d63b8bc7b",
				"bytes": 19572
			},
			{
				"src": "/images/editorial/wifi-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "7b6501d118a3",
				"bytes": 39786
			},
			{
				"src": "/images/editorial/wifi-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "f79cec252daf",
				"bytes": 51660
			},
			{
				"src": "/images/editorial/wifi-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "deefaf77136c",
				"bytes": 101872
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/editorial/inventory-2026.webp": {
		"src": "/images/editorial/inventory-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "Smartphone am Warenregal als Symbol für mobile Produktpflege.",
			"en": "Smartphone beside a product shelf illustrating mobile inventory management."
		},
		"variants": [
			{
				"src": "/images/editorial/inventory-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "46c40b23427a",
				"bytes": 19154
			},
			{
				"src": "/images/editorial/inventory-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "4c80e50ecce2",
				"bytes": 37068
			},
			{
				"src": "/images/editorial/inventory-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "2bb5aa995d36",
				"bytes": 47028
			},
			{
				"src": "/images/editorial/inventory-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "177d5f30a803",
				"bytes": 79974
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/services/05-kundenportale-editorial.webp": {
		"src": "/images/services/05-kundenportale-editorial.webp",
		"width": 1536,
		"height": 960,
		"alt": {
			"de": "Geordnete Unterlagen und Geräte als Symbol für Kundenportale.",
			"en": "Organised documents and devices illustrating customer portals."
		},
		"variants": [
			{
				"src": "/images/services/05-kundenportale-editorial-480.webp",
				"width": 480,
				"height": 300,
				"hash": "1ce9f0a7d5c8",
				"bytes": 22124
			},
			{
				"src": "/images/services/05-kundenportale-editorial-800.webp",
				"width": 800,
				"height": 500,
				"hash": "8ed3bd85e3d5",
				"bytes": 47446
			},
			{
				"src": "/images/services/05-kundenportale-editorial-960.webp",
				"width": 960,
				"height": 600,
				"hash": "49e09738d2ec",
				"bytes": 62984
			},
			{
				"src": "/images/services/05-kundenportale-editorial-1440.webp",
				"width": 1440,
				"height": 900,
				"hash": "bf3fe4109e85",
				"bytes": 113342
			},
			{
				"src": "/images/services/05-kundenportale-editorial.webp",
				"width": 1536,
				"height": 960,
				"hash": "9390500621fd",
				"bytes": 125462
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/editorial/pi-imager-android-2026.webp": {
		"src": "/images/editorial/pi-imager-android-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "Pi Imager für Android auf Tablet und Handy, mit fertig vorbereitetem Image und Modellauswahl.",
			"en": "Pi Imager for Android on tablet and phone, with a prepared image and the model picker (German interface)."
		},
		"variants": [
			{
				"src": "/images/editorial/pi-imager-android-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "5b0c7d5f701d",
				"bytes": 11582
			},
			{
				"src": "/images/editorial/pi-imager-android-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "78b368ab7005",
				"bytes": 27026
			},
			{
				"src": "/images/editorial/pi-imager-android-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "5634d70a0499",
				"bytes": 35362
			},
			{
				"src": "/images/editorial/pi-imager-android-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "56d1a5608056",
				"bytes": 62258
			}
		]
	},
	"/images/editorial/wparted-2026.webp": {
		"src": "/images/editorial/wparted-2026.webp",
		"width": 1440,
		"height": 960,
		"alt": {
			"de": "WParted mit Datenträgerkarte, Partitionsliste und einer ausstehenden Operation.",
			"en": "WParted with a disk map, a partition list and one pending operation (German interface)."
		},
		"variants": [
			{
				"src": "/images/editorial/wparted-2026-480.webp",
				"width": 480,
				"height": 320,
				"hash": "a86ca87d26e2",
				"bytes": 11576
			},
			{
				"src": "/images/editorial/wparted-2026-800.webp",
				"width": 800,
				"height": 533,
				"hash": "aa1b2897d159",
				"bytes": 25430
			},
			{
				"src": "/images/editorial/wparted-2026-960.webp",
				"width": 960,
				"height": 640,
				"hash": "ca8350fdfff1",
				"bytes": 33132
			},
			{
				"src": "/images/editorial/wparted-2026.webp",
				"width": 1440,
				"height": 960,
				"hash": "e2a9ebbc0807",
				"bytes": 58300
			}
		]
	}
}, {
	origin: "https://tracht-digital.de",
	about: "webpage"
});
// src/lib/serviceFinder.ts
var CATEGORY_IDS = [
	"webauftritt",
	"seo-sichtbarkeit",
	"digitalisierung",
	"e-mail-domain",
	"wartung-betrieb",
	"recht-datenschutz",
	"schulung"
];
var TOPIC_IDS = [...CATEGORY_IDS, "unsure"];
var STAGE_IDS = [
	"clear",
	"rough",
	"open"
];
var SAVINGS_LEVELS = [
	"low",
	"medium",
	"high"
];
var HIGH = /* @__PURE__ */ new Set([
	"online-terminbuchung-einbinden",
	"einen-ablauf-automatisieren",
	"rechnungen-digital-schreiben",
	"ki-im-buero-workshop"
]);
var MEDIUM = /* @__PURE__ */ new Set([
	"firmenwebsite-bis-5-seiten",
	"online-formular-statt-papier",
	"anfragen-automatisch-als-ticket",
	"microsoft-365-einrichten",
	"google-workspace-einrichten",
	"website-wartung-12-monate",
	"website-selbst-pflegen-einweisung",
	"e-mail-postfach-im-griff"
]);
/** The estimated band of a product; anything not listed saves little time. */
function savingsLevel(productId) {
	if (HIGH.has(productId)) return "high";
	if (MEDIUM.has(productId)) return "medium";
	return "low";
}
var product = (category, de, en, titleDe, titleEn) => ({
	id: de,
	category,
	slug: {
		de,
		en
	},
	title: {
		de: titleDe,
		en: titleEn
	}
});
var CATALOGUE_PRODUCTS = [
	product("webauftritt", "firmenwebsite-bis-5-seiten", "business-website-up-to-5-pages", "Firmenwebsite bis 5 Seiten", "Business website up to 5 pages"),
	product("webauftritt", "onepager-website", "one-page-website", "Onepager-Website", "One-page website"),
	product("webauftritt", "landingpage-fuer-ein-angebot", "landing-page-for-one-offer", "Landingpage für ein Angebot", "Landing page for one offer"),
	product("webauftritt", "relaunch-konzept", "website-relaunch-plan", "Relaunch-Konzept", "Website relaunch plan"),
	product("webauftritt", "online-terminbuchung-einbinden", "online-booking-on-your-website", "Online-Terminbuchung", "Online booking"),
	product("seo-sichtbarkeit", "technische-seo-grundlagen", "technical-seo-basics", "Technische SEO-Grundlagen", "Technical SEO basics"),
	product("seo-sichtbarkeit", "keyword-plan-fuer-ihre-leistungen", "keyword-plan-for-your-services", "Keyword-Plan", "Keyword plan"),
	product("seo-sichtbarkeit", "ki-sichtbarkeit-geo-verbessern", "improve-ai-visibility-geo", "KI-Sichtbarkeit (GEO)", "AI visibility (GEO)"),
	product("seo-sichtbarkeit", "strukturierte-daten-einbauen", "add-structured-data", "Strukturierte Daten", "Structured data"),
	product("seo-sichtbarkeit", "ladezeit-optimieren", "website-speed-optimisation", "Ladezeit optimieren", "Website speed optimisation"),
	product("seo-sichtbarkeit", "eintraege-in-branchenverzeichnissen", "business-directory-listings", "Einträge in Branchenverzeichnissen", "Business directory listings"),
	product("digitalisierung", "einen-ablauf-automatisieren", "automate-one-workflow", "Einen Arbeitsablauf automatisieren", "Automate one workflow"),
	product("digitalisierung", "online-formular-statt-papier", "online-form-instead-of-paper", "Online-Formular statt Papier", "Online form instead of paper"),
	product("digitalisierung", "rechnungen-digital-schreiben", "digital-invoicing-setup", "Rechnungen digital schreiben", "Digital invoicing setup"),
	product("digitalisierung", "anfragen-automatisch-als-ticket", "enquiries-as-tickets", "Anfragen automatisch als Ticket", "Enquiries as tickets"),
	product("e-mail-domain", "domain-und-e-mail-einrichten", "domain-and-email-setup", "Domain und E-Mail einrichten", "Domain and email setup"),
	product("e-mail-domain", "spf-dkim-dmarc-einrichten", "spf-dkim-dmarc-setup", "SPF, DKIM und DMARC einrichten", "SPF, DKIM and DMARC setup"),
	product("e-mail-domain", "e-mail-umzug", "email-migration", "E-Mail-Umzug", "Email migration"),
	product("e-mail-domain", "microsoft-365-einrichten", "microsoft-365-setup", "Microsoft 365 einrichten", "Microsoft 365 setup"),
	product("e-mail-domain", "google-workspace-einrichten", "google-workspace-setup", "Google Workspace einrichten", "Google Workspace setup"),
	product("wartung-betrieb", "website-wartung-12-monate", "website-maintenance-12-months", "Website-Wartung für 12 Monate", "Website maintenance for 12 months"),
	product("wartung-betrieb", "sicherheits-update-wordpress", "wordpress-security-update", "Sicherheits-Update für WordPress", "WordPress security update"),
	product("wartung-betrieb", "backup-einrichten-und-testen", "website-backup-setup-and-test", "Backup einrichten und testen", "Backup setup and test"),
	product("wartung-betrieb", "gehackte-website-bereinigen", "hacked-website-clean-up", "Gehackte Website bereinigen", "Hacked website clean-up"),
	product("wartung-betrieb", "website-umzug-zu-neuem-hoster", "website-move-to-new-host", "Website-Umzug zu neuem Hoster", "Website move to a new host"),
	product("recht-datenschutz", "impressum-und-datenschutz-einbinden", "legal-notice-and-privacy-policy-setup", "Impressum und Datenschutz einbinden", "Legal notice and privacy policy setup"),
	product("recht-datenschutz", "cookie-banner-einrichten", "cookie-consent-banner-setup", "Cookie-Banner einrichten", "Cookie consent banner setup"),
	product("recht-datenschutz", "barrierefreiheits-check-bfsg", "accessibility-check", "Barrierefreiheits-Check", "Accessibility check"),
	product("recht-datenschutz", "externe-dienste-pruefen", "external-services-check", "Externe Dienste prüfen", "External services check"),
	product("schulung", "website-selbst-pflegen-einweisung", "maintain-your-website-yourself", "Website selbst pflegen", "Maintaining the website in-house"),
	product("schulung", "ki-im-buero-workshop", "ai-at-work-workshop", "KI im Büro: Workshop", "AI at work: workshop"),
	product("schulung", "it-sicherheit-fuer-mitarbeitende", "it-security-awareness-training", "IT-Sicherheit für Mitarbeitende", "IT security awareness training"),
	product("schulung", "e-mail-postfach-im-griff", "get-your-inbox-under-control", "E-Mail-Postfach im Griff", "Inbox under control")
];
/** Keyed in `CATEGORY_IDS` order; products are named by their German slug. */
var CATALOGUE = {
	webauftritt: {
		name: {
			de: "Webauftritt",
			en: "Websites"
		},
		topic: {
			de: "Eine neue oder bessere Website",
			en: "A new or better website"
		},
		lead: ["firmenwebsite-bis-5-seiten", "onepager-website"],
		contact: "web-presence",
		situations: [
			{
				text: {
					de: "Es gibt noch keine Website.",
					en: "There is no website yet."
				},
				products: ["onepager-website", "firmenwebsite-bis-5-seiten"]
			},
			{
				text: {
					de: "Die Website ist veraltet.",
					en: "The website is out of date."
				},
				products: ["relaunch-konzept", "firmenwebsite-bis-5-seiten"]
			},
			{
				text: {
					de: "Ein einzelnes Angebot soll beworben werden.",
					en: "One offer needs promoting."
				},
				products: ["landingpage-fuer-ein-angebot"]
			},
			{
				text: {
					de: "Termine laufen nur über das Telefon.",
					en: "Appointments only happen by phone."
				},
				products: ["online-terminbuchung-einbinden"]
			}
		]
	},
	"seo-sichtbarkeit": {
		name: {
			de: "SEO & Sichtbarkeit",
			en: "SEO & visibility"
		},
		topic: {
			de: "Besser gefunden werden",
			en: "Getting found"
		},
		lead: ["technische-seo-grundlagen", "ki-sichtbarkeit-geo-verbessern"],
		contact: "web-presence",
		situations: [
			{
				text: {
					de: "Bei Google taucht der Betrieb kaum auf.",
					en: "The business barely shows up on Google."
				},
				products: ["technische-seo-grundlagen", "keyword-plan-fuer-ihre-leistungen"]
			},
			{
				text: {
					de: "Die Website lädt langsam.",
					en: "The website loads slowly."
				},
				products: ["ladezeit-optimieren"]
			},
			{
				text: {
					de: "KI-Assistenten nennen den Betrieb nicht.",
					en: "AI assistants do not mention the business."
				},
				products: ["ki-sichtbarkeit-geo-verbessern", "strukturierte-daten-einbauen"]
			},
			{
				text: {
					de: "Einträge in Verzeichnissen fehlen.",
					en: "Directory listings are missing."
				},
				products: ["eintraege-in-branchenverzeichnissen"]
			}
		]
	},
	digitalisierung: {
		name: {
			de: "Digitalisierung",
			en: "Digitalisation"
		},
		topic: {
			de: "Abläufe vereinfachen",
			en: "Simpler workflows"
		},
		lead: ["einen-ablauf-automatisieren", "online-formular-statt-papier"],
		contact: "process",
		situations: [
			{
				text: {
					de: "Formulare laufen auf Papier.",
					en: "Forms are still on paper."
				},
				products: ["online-formular-statt-papier"]
			},
			{
				text: {
					de: "Rechnungen entstehen von Hand.",
					en: "Invoices are written by hand."
				},
				products: ["rechnungen-digital-schreiben"]
			},
			{
				text: {
					de: "Anfragen gehen im Postfach unter.",
					en: "Enquiries get lost in the inbox."
				},
				products: ["anfragen-automatisch-als-ticket"]
			},
			{
				text: {
					de: "Dieselbe Aufgabe kehrt ständig wieder.",
					en: "The same task keeps coming back."
				},
				products: ["einen-ablauf-automatisieren"]
			}
		]
	},
	"e-mail-domain": {
		name: {
			de: "E-Mail & Domain",
			en: "Email & domain"
		},
		topic: {
			de: "E-Mail, Domain oder Microsoft 365",
			en: "Email, domain or Microsoft 365"
		},
		lead: ["domain-und-e-mail-einrichten"],
		contact: "web-presence",
		situations: [
			{
				text: {
					de: "E-Mails laufen nicht über die eigene Domain.",
					en: "Email does not run on the company's own domain."
				},
				products: ["domain-und-e-mail-einrichten"]
			},
			{
				text: {
					de: "E-Mails landen im Spam.",
					en: "Emails end up in spam."
				},
				products: ["spf-dkim-dmarc-einrichten"]
			},
			{
				text: {
					de: "Der E-Mail-Anbieter soll wechseln.",
					en: "The email provider needs changing."
				},
				products: ["e-mail-umzug"]
			},
			{
				text: {
					de: "Das Team braucht gemeinsame Kalender und Dateien.",
					en: "The team needs shared calendars and files."
				},
				products: ["microsoft-365-einrichten", "google-workspace-einrichten"]
			}
		]
	},
	"wartung-betrieb": {
		name: {
			de: "Wartung & Betrieb",
			en: "Maintenance & operations"
		},
		topic: {
			de: "Die Website sicher betreiben",
			en: "Running the website safely"
		},
		lead: ["website-wartung-12-monate"],
		contact: "web-presence",
		situations: [
			{
				text: {
					de: "Updates bleiben liegen.",
					en: "Updates keep being put off."
				},
				products: ["website-wartung-12-monate", "sicherheits-update-wordpress"]
			},
			{
				text: {
					de: "Es gibt keine geprüfte Sicherung.",
					en: "There is no tested backup."
				},
				products: ["backup-einrichten-und-testen"]
			},
			{
				text: {
					de: "Die Website wurde gehackt.",
					en: "The website was hacked."
				},
				products: ["gehackte-website-bereinigen"]
			},
			{
				text: {
					de: "Der Hoster soll wechseln.",
					en: "The host needs changing."
				},
				products: ["website-umzug-zu-neuem-hoster"]
			}
		]
	},
	"recht-datenschutz": {
		name: {
			de: "Recht & Datenschutz",
			en: "Legal & privacy"
		},
		topic: {
			de: "Rechtstexte, Datenschutz, Barrierefreiheit",
			en: "Legal texts, privacy, accessibility"
		},
		lead: ["impressum-und-datenschutz-einbinden", "cookie-banner-einrichten"],
		contact: "web-presence",
		situations: [
			{
				text: {
					de: "Impressum oder Datenschutz fehlen.",
					en: "Legal notice or privacy policy are missing."
				},
				products: ["impressum-und-datenschutz-einbinden"]
			},
			{
				text: {
					de: "Ein Cookie-Banner fehlt.",
					en: "A cookie banner is missing."
				},
				products: ["cookie-banner-einrichten"]
			},
			{
				text: {
					de: "Die Barrierefreiheit ist ungeprüft.",
					en: "Accessibility has not been checked."
				},
				products: ["barrierefreiheits-check-bfsg"]
			},
			{
				text: {
					de: "Unklar, welche Daten an Dritte gehen.",
					en: "Unclear which data reaches third parties."
				},
				products: ["externe-dienste-pruefen"]
			}
		]
	},
	schulung: {
		name: {
			de: "Schulung",
			en: "Training"
		},
		topic: {
			de: "Das Team schulen",
			en: "Training the team"
		},
		lead: ["website-selbst-pflegen-einweisung"],
		contact: "consulting",
		situations: [
			{
				text: {
					de: "Die Website soll selbst gepflegt werden.",
					en: "The website should be maintained in-house."
				},
				products: ["website-selbst-pflegen-einweisung"]
			},
			{
				text: {
					de: "KI soll im Büro sinnvoll helfen.",
					en: "AI should help sensibly at work."
				},
				products: ["ki-im-buero-workshop"]
			},
			{
				text: {
					de: "Das Team soll Phishing erkennen.",
					en: "The team should spot phishing."
				},
				products: ["it-sicherheit-fuer-mitarbeitende"]
			},
			{
				text: {
					de: "Das Postfach läuft über.",
					en: "The inbox is overflowing."
				},
				products: ["e-mail-postfach-im-griff"]
			}
		]
	}
};
var TOPIC_WEIGHT = 2;
var SITUATION_WEIGHT = 3;
var FINDER_COPY = {
	de: {
		progress: (step, total) => `Schritt ${step} von ${total}`,
		resultLabel: "Ergebnis",
		topicsQuestion: "Worum geht es vor allem?",
		topicsHelp: "Mehrfachauswahl möglich.",
		unsure: {
			label: "Noch unklar",
			hint: "Dann wird zuerst gemeinsam sortiert."
		},
		situationsQuestion: "Was davon kommt im Betrieb vor?",
		situationsHelp: "Mehrfachauswahl möglich – oder einfach weiter.",
		stageQuestion: "Wie weit ist das Vorhaben?",
		stageHelp: "Eine Antwort.",
		stages: {
			clear: {
				label: "Klar umrissen",
				hint: "Ziel und Umfang stehen fest."
			},
			rough: {
				label: "Eine grobe Idee",
				hint: "Die Richtung steht, die Details noch nicht."
			},
			open: {
				label: "Noch ganz offen",
				hint: "Erst sortieren, was dran ist."
			}
		},
		pickOne: "Bitte mindestens eine Antwort wählen.",
		pickStage: "Bitte eine Antwort wählen.",
		next: "Weiter",
		back: "Zurück",
		showResult: "Ergebnis anzeigen",
		restart: "Neu starten",
		resultTitle: "Das passt zum Anliegen",
		rankBest: "Passt am besten",
		rankAlso: "Passt ebenfalls",
		whyLabel: "Angaben dazu:",
		detailLink: "Im Shop ansehen",
		savingsLabel: "Geschätzte Zeitersparnis",
		savingsLevels: {
			low: "gering, unter 1 Std. im Monat",
			medium: "mittel, 1–5 Std. im Monat",
			high: "hoch, über 5 Std. im Monat"
		},
		savingsNote: "Die Zeitersparnis ist eine grobe Schätzung für einen kleinen Betrieb, keine Zusage.",
		noMatch: "Das lässt sich am besten im Erstgespräch sortieren.",
		note: "Eine erste Orientierung. Was genau passt, klären wir im Erstgespräch.",
		catalogueLink: "Alle Leistungen",
		cta: "Mit dieser Auswahl Erstgespräch vereinbaren",
		handoffNote: "Die Auswahl landet im Kontaktformular. Gesendet wird erst beim Absenden.",
		draft: {
			intro: "Aus dem Leistungsassistenten:",
			services: "Passende Leistungen",
			situations: "Ausgangslage",
			stage: "Stand"
		}
	},
	en: {
		progress: (step, total) => `Step ${step} of ${total}`,
		resultLabel: "Result",
		topicsQuestion: "What matters most?",
		topicsHelp: "Choose as many as apply.",
		unsure: {
			label: "Not clear yet",
			hint: "Then things get sorted out together first."
		},
		situationsQuestion: "Which of these happen in the business?",
		situationsHelp: "Choose as many as apply – or just continue.",
		stageQuestion: "How far along is the project?",
		stageHelp: "One answer.",
		stages: {
			clear: {
				label: "Clearly defined",
				hint: "Goal and scope are settled."
			},
			rough: {
				label: "A rough idea",
				hint: "The direction is set, the details are not."
			},
			open: {
				label: "Still completely open",
				hint: "First work out what needs doing."
			}
		},
		pickOne: "Please choose at least one answer.",
		pickStage: "Please choose one answer.",
		next: "Next",
		back: "Back",
		showResult: "Show result",
		restart: "Start again",
		resultTitle: "What fits the request",
		rankBest: "Best fit",
		rankAlso: "Also fits",
		whyLabel: "Answers given:",
		detailLink: "View in the shop",
		savingsLabel: "Estimated time saved",
		savingsLevels: {
			low: "low, under 1 hour a month",
			medium: "medium, 1–5 hours a month",
			high: "high, over 5 hours a month"
		},
		savingsNote: "Time saved is a rough estimate for a small business, not a promise.",
		noMatch: "This is best sorted out in a first conversation.",
		note: "A first sense of direction. We work out exactly what fits in the first conversation.",
		catalogueLink: "All services",
		cta: "Arrange an initial consultation with this selection",
		handoffNote: "The selection goes into the contact form. Nothing is sent until it is submitted.",
		draft: {
			intro: "From the service assistant:",
			services: "Matching services",
			situations: "Starting point",
			stage: "Stage"
		}
	}
};
/** The dialog around the assistant, and the tile that opens it. */
var FINDER_SECTION = {
	de: {
		title: "Welche Leistung passt?",
		intro: "Drei kurze Fragen. Danach ist klar, welche Leistungen aus dem Shop passen.",
		close: "Leistungsassistent schließen",
		tileKind: "Leistungsassistent",
		tileTitle: "Welche Leistung passt?"
	},
	en: {
		title: "Which service fits?",
		intro: "Three short questions. Then it is clear which services from the shop fit.",
		close: "Close the service assistant",
		tileKind: "Service assistant",
		tileTitle: "Which service fits?"
	}
};
/** Label and hint of a first-step answer. */
function topicWords(id, lang) {
	if (id === "unsure") return FINDER_COPY[lang].unsure;
	return {
		label: CATALOGUE[id].topic[lang],
		hint: CATALOGUE[id].name[lang]
	};
}
/**
* The starting points offered in step two: those of the chosen categories, or a
* few of each when none was chosen. Never more than eight: a longer list is a
* wall nobody reads on a phone.
*/
function situationOptions(topics, lang) {
	const chosen = CATEGORY_IDS.filter((id) => topics.includes(id));
	const ids = chosen.length > 0 ? chosen : CATEGORY_IDS;
	const perCategory = Math.min(4, Math.max(1, Math.floor(8 / ids.length)));
	return ids.flatMap((category) => CATALOGUE[category].situations.slice(0, perCategory).map((situation, index) => ({
		key: `${category}:${index}`,
		category,
		text: situation.text[lang],
		products: situation.products
	})));
}
/** Products worth suggesting, strongest first, catalogue order on a tie. Empty when nothing pointed anywhere. */
function recommend(answers, lang) {
	const tally = /* @__PURE__ */ new Map();
	const add = (id, weight, reason) => {
		const entry = tally.get(id) ?? {
			score: 0,
			reasons: []
		};
		entry.score += weight;
		if (!entry.reasons.includes(reason)) entry.reasons.push(reason);
		tally.set(id, entry);
	};
	for (const topic of answers.topics) {
		if (topic === "unsure") continue;
		for (const id of CATALOGUE[topic].lead) add(id, TOPIC_WEIGHT, CATALOGUE[topic].topic[lang]);
	}
	for (const choice of answers.situations) for (const id of choice.products) add(id, SITUATION_WEIGHT, choice.text);
	const order = (id) => CATALOGUE_PRODUCTS.findIndex((item) => item.id === id);
	return [...tally.entries()].map(([productId, entry]) => ({
		productId,
		...entry
	})).sort((a, b) => b.score - a.score || order(a.productId) - order(b.productId)).slice(0, 4);
}
/**
* What is handed to the contact form — the visitor's choices, nothing invented.
* `service` is the strongest match's contact reason, an id rather than a label:
* `sections/Contact.astro` owns the mapping to its CMS-editable options.
*/
function buildDraft(matches, answers, lang) {
	const { draft, stages, unsure } = FINDER_COPY[lang];
	const products = matches.map((match) => CATALOGUE_PRODUCTS.find((item) => item.id === match.productId));
	const lines = [draft.intro, `${draft.services}: ${products.map((item) => item?.title[lang]).filter(Boolean).join(", ") || unsure.label}`];
	if (answers.situations.length > 0) lines.push(`${draft.situations}: ${answers.situations.map((choice) => choice.text).join(" ")}`);
	if (answers.stage) lines.push(`${draft.stage}: ${stages[answers.stage].label}`);
	return {
		message: `${lines.join("\n")}\n\n`,
		service: products[0] ? CATALOGUE[products[0].category].contact : "consulting"
	};
}
// src/lib/serviceProducts.ts
var SERVICE_PRODUCTS = [
	{
		id: "business-website",
		slug: {
			de: "firmenwebsite-bis-5-seiten",
			en: "business-website-up-to-5-pages"
		},
		title: {
			de: "Firmenwebsite",
			en: "Business website"
		},
		kind: {
			de: "Webauftritt",
			en: "Web presence"
		},
		image: "/images/services/04-webauftritt-editorial.webp"
	},
	{
		id: "one-pager",
		slug: {
			de: "onepager-website",
			en: "one-page-website"
		},
		title: {
			de: "Onepager",
			en: "One-page website"
		},
		kind: {
			de: "Webauftritt",
			en: "Web presence"
		},
		image: "/images/services/03-loesungen-editorial.webp"
	},
	{
		id: "maintenance",
		slug: {
			de: "website-wartung-12-monate",
			en: "website-maintenance-12-months"
		},
		title: {
			de: "Website-Wartung",
			en: "Website maintenance"
		},
		kind: {
			de: "Betrieb",
			en: "Operations"
		},
		image: "/images/services/05-kundenportale-editorial.webp"
	},
	{
		id: "ai-visibility",
		slug: {
			de: "ki-sichtbarkeit-geo-verbessern",
			en: "improve-ai-visibility-geo"
		},
		title: {
			de: "KI-Sichtbarkeit",
			en: "AI visibility"
		},
		kind: {
			de: "Sichtbarkeit",
			en: "Visibility"
		},
		image: "/images/services/01-beratung-editorial.webp"
	},
	{
		id: "online-form",
		slug: {
			de: "online-formular-statt-papier",
			en: "online-form-instead-of-paper"
		},
		title: {
			de: "Online-Formular",
			en: "Online form"
		},
		kind: {
			de: "Digitalisierung",
			en: "Digitalisation"
		},
		image: "/images/services/02-prozesse-editorial.webp"
	}
];
var shopHome = (lang) => `${PROPERTY_ORIGINS.shop}${lang === "en" ? "/en/" : "/"}`;
/** The shop's catalogue, filtered in the browser to our own services. */
var shopServicesHref = (lang) => `${shopHome(lang)}?art=own#katalog`;
/** One request per category: the list endpoint stops at 48 per page. */
async function fetchReleasedSlugs(lang) {
	return (await Promise.all(CATEGORY_IDS.map((category) => readContentJson(`${contentApiBase()}/shop?lang=${lang}&limit=48&category=${category}`)))).flatMap((page) => page.products.map((product) => product.slug));
}
/** The Shop's released product slugs; empty while the Shop cannot be reached. */
async function releasedSlugs(lang) {
	return new Set(await memoisedOr(`service-products:${lang}`, () => fetchReleasedSlugs(lang), [], "released products"));
}
/** A product's page once the Shop has released it, otherwise the filtered list. */
function shopProductHref(slug, lang, released) {
	if (!released.has(slug)) return shopServicesHref(lang);
	return `${PROPERTY_ORIGINS.shop}${lang === "en" ? "/en/product/" : "/produkt/"}${slug}`;
}
/** The tiles, each linked to its product page once the shop has released it. */
async function getServiceProducts(lang) {
	const released = await releasedSlugs(lang);
	return SERVICE_PRODUCTS.map((product) => ({
		...product,
		href: shopProductHref(product.slug[lang], lang, released)
	}));
}
// src/components/ui/SectionHeader.astro
createAstro("https://tracht-digital.de");
var $$SectionHeader = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SectionHeader;
	const { headline, headlineAccent, id, dark = false, headingClass = "mb-16", bar = false } = Astro.props;
	const headingSpacing = bar ? "mb-5" : headingClass;
	return renderTemplate`${maybeRenderHead($$result)}<div class="text-center md:text-left" data-reveal><h2${addAttribute(id, "id")}${addAttribute([
		"display text-4xl md:text-5xl lg:text-6xl",
		dark ? "text-white" : "text-[var(--color-black)]",
		headingSpacing
	], "class:list")}>${headline}${" "}${renderComponent($$result, "AccentLetters", $$AccentLetters, {
		"text": headlineAccent,
		"tone": dark ? "dark" : "light"
	})}</h2>${bar && renderTemplate`<span aria-hidden="true"${addAttribute([
		"tds-brandbar mx-auto md:mx-0",
		dark ? "tds-brandbar--on-dark" : null,
		headingClass
	], "class:list")}></span>`}</div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/SectionHeader.astro", void 0);
export { topicWords as _, shopServicesHref as a, demosCopy as b, FINDER_COPY as c, STAGE_IDS as d, TOPIC_IDS as f, situationOptions as g, savingsLevel as h, shopProductHref as i, FINDER_SECTION as l, recommend as m, getServiceProducts as n, CATALOGUE as o, buildDraft as p, releasedSlugs as r, CATALOGUE_PRODUCTS as s, $$SectionHeader as t, SAVINGS_LEVELS as u, imageHints as v, getHomeContent as x, imageObject as y };
