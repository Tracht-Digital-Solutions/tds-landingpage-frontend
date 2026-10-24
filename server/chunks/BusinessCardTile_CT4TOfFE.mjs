import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_Dep2b-2O.mjs";
import { n as createComponent, t as createAstro } from "./compiler_C1nVjdt_.mjs";
import { d as resolveLang } from "./Layout_BK1z3wQd.mjs";
import { i as contentCache, s as createImageCatalog } from "./siteKey_CDq6A8R3.mjs";
import { G as businessCardHref, V as BUSINESS_CARD_PREVIEW, W as businessCardCopy, f as referenceCases } from "./sitemapSections_DWSxrFhw.mjs";
import { p as PREVIEW_VARIANT_WIDTHS, y as srcsetFor } from "./jsonld_D4HRtxdX.mjs";
import { t as $$AccentLetters } from "./AccentLetters_BdNrbJ8z.mjs";
import { n as mediaSrc, t as $$CardActions } from "./CardActions_hmeYzR4e.mjs";
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
	"/images/sections/hero-editorial.webp": {
		"src": "/images/sections/hero-editorial.webp",
		"width": 1642,
		"height": 924,
		"alt": {
			"de": "Ruhiger digitaler Arbeitsplatz als redaktionelles Symbolbild.",
			"en": "A calm digital workspace as an editorial illustration."
		},
		"variants": [
			{
				"src": "/images/sections/hero-editorial-480.webp",
				"width": 480,
				"height": 270,
				"hash": "b85e2de66e2c",
				"bytes": 10466
			},
			{
				"src": "/images/sections/hero-editorial-800.webp",
				"width": 800,
				"height": 450,
				"hash": "4d8d5e84e591",
				"bytes": 23228
			},
			{
				"src": "/images/sections/hero-editorial-960.webp",
				"width": 960,
				"height": 540,
				"hash": "69f1e6f51c3a",
				"bytes": 30538
			},
			{
				"src": "/images/sections/hero-editorial-1440.webp",
				"width": 1440,
				"height": 810,
				"hash": "f63677c76ccb",
				"bytes": 57630
			},
			{
				"src": "/images/sections/hero-editorial.webp",
				"width": 1642,
				"height": 924,
				"hash": "e5f5aab461ca",
				"bytes": 70074
			}
		],
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"/images/sections/why-me-editorial.webp": {
		"src": "/images/sections/why-me-editorial.webp",
		"width": 1860,
		"height": 840,
		"alt": {
			"de": "Bücher und Notizbuch als Symbol für sorgfältige digitale Arbeit.",
			"en": "Books and a notebook illustrating careful digital work."
		},
		"variants": [
			{
				"src": "/images/sections/why-me-editorial-480.webp",
				"width": 480,
				"height": 217,
				"hash": "2a5ccfdbf1c5",
				"bytes": 11394
			},
			{
				"src": "/images/sections/why-me-editorial-800.webp",
				"width": 800,
				"height": 361,
				"hash": "8434d65dbfa1",
				"bytes": 24146
			},
			{
				"src": "/images/sections/why-me-editorial-960.webp",
				"width": 960,
				"height": 434,
				"hash": "e78232600815",
				"bytes": 32518
			},
			{
				"src": "/images/sections/why-me-editorial-1440.webp",
				"width": 1440,
				"height": 650,
				"hash": "e49416a74857",
				"bytes": 72534
			},
			{
				"src": "/images/sections/why-me-editorial.webp",
				"width": 1860,
				"height": 840,
				"hash": "157cf2cbf983",
				"bytes": 110768
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
	}
}, {
	origin: "https://tracht-digital.de",
	about: "webpage"
});
var demoData_default = {
	generatedAt: "2026-10-24T08:53:59.298Z",
	demos: {
		"demo1": {
			"status": "ok",
			"title": "Demo & Partner Rechtsanwälte",
			"description": "Hochwertige Demonstrationsseite einer fiktiven deutschen Wirtschaftskanzlei. Keine Rechtsberatung, keine gültigen Kontaktdaten.",
			"siteLang": "de",
			"favicon": "/demos/demo1-favicon.svg",
			"preview": "/demos/demo1.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-10-24T08:53:39.277Z"
		},
		"demo2": {
			"status": "ok",
			"title": "Dein Rhythmus. Deine Regeln. — BLOCK/01",
			"description": "Streetwear für deinen eigenen Rhythmus. Entdecke BLOCK/01, die interaktive Shop-Arbeitsprobe von Tracht Digital Solutions.",
			"siteLang": "de",
			"favicon": "/demos/demo2-favicon.svg",
			"preview": "/demos/demo2.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-10-24T08:53:40.561Z"
		},
		"demo3": {
			"status": "ok",
			"title": "Immobilienverwaltung — Nordstern Immobilien",
			"description": "Interaktives Immobilien-Verwaltungspanel mit Beispieldaten",
			"siteLang": "de",
			"favicon": "/demos/demo3-favicon.svg",
			"preview": "/demos/demo3.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-10-24T08:53:41.730Z"
		},
		"demo4": {
			"status": "tls-invalid",
			"title": null,
			"description": null,
			"siteLang": null,
			"favicon": null,
			"preview": null,
			"previewWidth": null,
			"previewHeight": null,
			"checkedAt": "2026-10-24T08:53:42.309Z"
		},
		"demo5": {
			"status": "tls-invalid",
			"title": null,
			"description": null,
			"siteLang": null,
			"favicon": null,
			"preview": null,
			"previewWidth": null,
			"previewHeight": null,
			"checkedAt": "2026-10-24T08:53:43.068Z"
		},
		"shop": {
			"status": "ok",
			"title": "Digitalmarkt von Tracht Digital Solutions",
			"description": "Digitale Leistungen zum Festpreis für Selbstständige und kleine Betriebe: Website, SEO, E-Mail, Wartung und Schulung. Dazu Technik mit eigener Einschätzung.",
			"siteLang": "de",
			"favicon": "/demos/shop-favicon.png",
			"preview": "/demos/shop.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-10-24T08:53:44.539Z"
		}
	}
};
// src/lib/demoCatalog.ts
/**
* What KIND of site a demo is — the one thing on a demo card that this site
* says rather than quotes.
*
* Everything else on a card (name, description, favicon, screenshot) is
* harvested from the demo itself, and that rule stands. This is the single
* deliberate exception, and it is narrow on purpose:
*
* - It applies to OUR OWN demos only. We are not describing anyone's site.
* - It names the GENRE, never the content. "Onlineshop", not "Streetwear-Shop";
*   "Webseite", not "Kanzlei-Webseite". A visitor scanning the shelf wants to
*   know which of these is a shop and which is a page — the demo's own title
*   already tells them what it is about.
* - The vocabulary is CLOSED, so it cannot drift into marketing copy one
*   entry at a time. `demos.test.ts` holds it shut.
*
* A demo whose genre is not in this list means the list is wrong, not that a
* new label should be invented at the call site.
*/
var DEMO_KINDS = {
	website: {
		de: "Webseite",
		en: "Website"
	},
	landing: {
		de: "Landingpage",
		en: "Landing page"
	},
	shop: {
		de: "Onlineshop",
		en: "Online shop"
	}
};
/**
* WHOSE site a card shows — the second, and last, thing this site says about a
* demo, and the one that keeps the shelf honest.
*
* The shelf used to sit in one carousel with the customer cases, and nothing on
* a card said which were customers and which were ours. That matters more than
* the genre: a visitor judging this business by its work has to be able to
* tell a delivered project from a sample, without reading the host name.
*
* - `demo` — a sample site about a business that does not exist (the law firm,
*   the streetwear label, the property manager). Their own descriptions say
*   so; the badge says "Demo", one word (2026-10-11: no "fiktiv" on the card).
* - `own` — a real site of Tracht Digital Solutions itself. The shop is one:
*   it sells for real, so calling it "fictional" would be the opposite lie.
* - `study` — a design study: a picture of a page that was never built and is
*   not hosted anywhere (`designStudies.ts`). It shares this shelf because it
*   is the same kind of evidence; the captures carry the long form as a
*   watermark, the badge only "Designstudie".
*
* Closed, like `DEMO_KINDS`, and for the same reason. No label may ever name a
* client — not even to deny one, which is why the study says what it IS rather
* than what it is not. Customer cases are `references.ts`, a different catalog
* with its own consent rules.
*/
var DEMO_ORIGINS = {
	demo: {
		de: "Demo",
		en: "Demo"
	},
	own: {
		de: "Eigenes Projekt",
		en: "Own project"
	},
	study: {
		de: "Designstudie",
		en: "Design study"
	}
};
/**
* Every demo site, in display order.
*
* Adding one means adding it here AND running `npm run demos:sync`. The tests
* fail on a definition with no snapshot entry, which is what stops a new demo
* from rendering as a card with no picture and no text.
*
* `shop` is the one entry that is not a `demoN` host, and it went in before it
* had anything to show. That is safe, and it is the reason the availability
* check exists: while `shop.tracht-digital.de` answered with the hosting
* panel's "Hier entsteht eine neue Webseite" placeholder, the sync recorded it
* as `placeholder` and no card rendered. The day the shop was deployed, a sync
* turned it into a card without a code change.
*/
var demoDefinitions = [
	{
		id: "demo1",
		number: "01",
		host: "demo1.tracht-digital.de",
		url: "https://demo1.tracht-digital.de/",
		kind: "website",
		origin: "demo"
	},
	{
		id: "demo2",
		number: "02",
		host: "demo2.tracht-digital.de",
		url: "https://demo2.tracht-digital.de/de/",
		kind: "shop",
		origin: "demo"
	},
	{
		id: "demo3",
		number: "03",
		host: "demo3.tracht-digital.de",
		url: "https://demo3.tracht-digital.de/",
		kind: "website",
		origin: "demo"
	},
	{
		id: "demo4",
		number: "04",
		host: "demo4.tracht-digital.de",
		url: "https://demo4.tracht-digital.de/",
		kind: "website",
		origin: "demo"
	},
	{
		id: "demo5",
		number: "05",
		host: "demo5.tracht-digital.de",
		url: "https://demo5.tracht-digital.de/",
		kind: "website",
		origin: "demo"
	},
	{
		id: "shop",
		number: "06",
		host: "shop.tracht-digital.de",
		url: "https://shop.tracht-digital.de/",
		kind: "shop",
		origin: "own"
	}
];
/**
* The screenshot box: viewport for the capture, intrinsic size of the WebP,
* and the aspect ratio the card reserves before the image loads.
*
* 16:10 matches the service grounds in IMAGES.md, so the two card families on
* the home page keep one rhythm.
*/
var DEMO_PREVIEW = {
	width: 1440,
	height: 900
};
// src/lib/demos.ts
/**
* The website demos shown on the home page and on the Webauftritt service page.
*
* Three parts, deliberately separated:
*
* 1. `demoCatalog.ts` — identity, order and URL. Code-owned, like
*    `ServiceDefinition.slug`: the CMS may never name a host this site sends
*    visitors to.
* 2. `demoData.json` — what each demo *said about itself* the last time
*    `npm run demos:sync` ran: title, description, favicon, screenshot. A
*    committed snapshot, so rendering a page costs no screenshot and no HTML
*    parse, and so nothing about a demo can be invented at runtime.
* 3. `getDemos()` — that snapshot, filtered by a short live reachability probe.
*
* ### The rule this file exists to enforce
*
* A demo that is not available is not loaded and not shown. "Available" is
* strict on purpose, because three quite different failures all look like a
* working link from here:
*
* - the host answers, but with a hosting-panel placeholder rather than a site;
* - the host answers over a certificate the visitor's browser rejects;
* - the host was fine at sync time and is down now.
*
* The first two are decided by `scripts/demos-sync.ts` and frozen into the
* snapshot; the third is decided here, per render generation. There is no
* "show it anyway" path — a card that leads to a certificate warning or to
* "Hier entsteht eine neue Webseite" costs more than an absent card.
*
* ### Why the import is `./contentCache` and not `./cache`
*
* The same trap `cms.ts` documents: `cache.ts` imports the service catalog to
* build its route lists, so reaching the memo through it would close
* `services.ts` → … → `cache.ts` → `services.ts`. That throws at module
* evaluation and `astro check` cannot see it.
*/
var demoSnapshot = demoData_default;
function isNonEmpty$1(value) {
	return typeof value === "string" && value.trim() !== "";
}
/**
* The snapshot half of the decision: which demos were presentable at sync time.
*
* Pure and synchronous, so the rule is testable without a network. A card
* needs a status of exactly `ok`, a title and a screenshot; anything else —
* including an unknown status string from an outdated or hand-edited JSON — is
* treated as unavailable. Refusing an unrecognised value rather than trusting
* it is what stops a future status like `redirect-loop` from rendering as a
* working card on an old build.
*/
function resolveSnapshotDemos(source = demoSnapshot, definitions = demoDefinitions) {
	const resolved = [];
	for (const definition of definitions) {
		const entry = source.demos?.[definition.id];
		if (!entry || entry.status !== "ok") continue;
		if (!isNonEmpty$1(entry.title) || !isNonEmpty$1(entry.preview)) continue;
		resolved.push({
			definition,
			title: entry.title.trim(),
			description: isNonEmpty$1(entry.description) ? entry.description.trim() : null,
			siteLang: isNonEmpty$1(entry.siteLang) ? entry.siteLang : null,
			favicon: isNonEmpty$1(entry.favicon) ? entry.favicon : null,
			preview: entry.preview,
			previewWidth: entry.previewWidth ?? DEMO_PREVIEW.width,
			previewHeight: entry.previewHeight ?? DEMO_PREVIEW.height
		});
	}
	return resolved;
}
/** How long one demo gets to answer before it counts as down. */
var PROBE_TIMEOUT_MS$1 = 3e3;
/**
* Is the demo answering right now, over a certificate a browser accepts?
*
* `HEAD` rather than `GET`: this asks whether the visitor's click will land,
* not what it will land on — the snapshot already answered that. TLS
* verification stays on, so an expired or self-signed certificate rejects the
* request and the demo drops out. That is the intended behaviour, not a
* limitation: a link a browser greets with a full-page warning is not a link.
*/
var defaultProbe$1 = async (demo) => {
	return (await fetch(demo.definition.url, {
		method: "HEAD",
		redirect: "follow",
		signal: AbortSignal.timeout(PROBE_TIMEOUT_MS$1)
	})).ok;
};
/**
* Drop every demo that does not answer, without letting one failure take the
* page with it.
*
* `allSettled`, so a DNS error, a timeout or a rejected certificate removes
* one card and nothing else. The probes run in parallel: five sequential 3 s
* timeouts would put fifteen seconds in front of a cache-filling render.
*/
async function filterReachable(demos, probe = defaultProbe$1) {
	if (demos.length === 0) return [];
	const results = await Promise.allSettled(demos.map((demo) => probe(demo)));
	return demos.filter((_, index) => {
		const result = results[index];
		return result !== void 0 && result.status === "fulfilled" && result.value === true;
	});
}
/**
* The demos to render: the snapshot, filtered by a live probe.
*
* Memoised through the generation-scoped content cache so the home page and
* the Webauftritt page share one round of probes per render, and so a cache
* rebuild re-checks instead of replaying a verdict from server boot. That memo
* is also this feature's latency: a demo that goes down disappears at the next
* rebuild of the pages it appears on, not at the next visitor.
*
* In demo mode there is no outbound network worth spending, so the snapshot is
* trusted as-is — the shortcut `fetchBlocks()` takes for the same reason.
*/
async function getDemos(options = {}) {
	const resolved = resolveSnapshotDemos(options.snapshot, options.definitions);
	if (resolved.length === 0) return [];
	if (Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_DEMO_MODE": "false",
		"SITE": "https://tracht-digital.de",
		"SSR": true
	}, { _: "/opt/hostedtoolcache/node/22.23.3/x64/bin/npm" })?.PUBLIC_DEMO_MODE === "true") return resolved;
	const run = () => filterReachable(resolved, options.probe);
	if (options.cache === false) return run();
	const reachable = await contentCache.get("demos:availability", async () => (await run()).map((demo) => demo.definition.id));
	const ids = new Set(reachable);
	return resolved.filter((demo) => ids.has(demo.definition.id));
}
/**
* Card microcopy that belongs to this site, not to the demo.
*
* `zoom` names the magnifier over the screenshot. It says "enlarge", never
* "open": the button shows the captured picture, the card's link goes to the
* live site, and a visitor who confuses the two ends up looking at a
* screenshot when they meant to click through.
*/
var demoUi = {
	de: {
		newTab: "öffnet in neuem Tab",
		visit: "Demo ansehen",
		hostLabel: "Adresse",
		zoom: "Vorschau vergrößern"
	},
	en: {
		newTab: "opens in a new tab",
		visit: "View demo",
		hostLabel: "Address",
		zoom: "Enlarge preview"
	}
};
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
			headline: "Leistungen von",
			headlineAccent: "Tracht Digital.",
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
			headline: "Wissen für",
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
			headline: "Services by",
			headlineAccent: "Tracht Digital.",
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
			headline: "Know-how for",
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
var referencePreviewData_default = {
	generatedAt: "2026-10-24T08:54:07.075Z",
	previews: { "hof-meerheck": {
		"status": "ok",
		"preview": "/references/hof-meerheck.webp",
		"width": 1440,
		"height": 900,
		"capturedAt": "2026-10-24T08:54:06.916Z"
	} }
};
// src/lib/referencePreviewMeta.ts
/**
* Constants shared by the reference-preview sync script and the renderer.
*
* Split out for the same reason `demoCatalog.ts` is split from `demos.ts`: the
* script runs under plain Node and must not drag the content cache, the i18n
* bundle or `import.meta.env` into a context that has none of them.
*/
/** Intrinsic size of a committed preview, and the ratio a card reserves. */
var PREVIEW_SIZE = {
	width: 1440,
	height: 900
};
// src/lib/referencePreviews.ts
/**
* Screenshots of customer sites shown on reference cards.
*
* The same shape as `demos.ts` and for the same reason: a picture of a site is
* only honest while that site still answers. The snapshot says what was
* capturable at sync time; a live probe says whether it is still there. A
* reference whose site has since gone dark loses its band and keeps its text,
* rather than showing a photograph of something that no longer exists.
*
* The extra gate this has and the demos do not is consent. A demo is our own
* site; a customer's is theirs, so `previewAllowed` on the case has to be true
* as well — and it is checked HERE, not only in the sync script, so a stale
* asset left in `public/` after a permission was withdrawn still cannot render.
*/
function isNonEmpty(value) {
	return typeof value === "string" && value.trim() !== "";
}
/**
* Which cases have a usable screenshot, by the snapshot alone.
*
* Pure and synchronous so the rule is testable without a network. Consent is
* re-checked against the committed case rather than trusted from the JSON:
* the snapshot is generated output, the case is the record of the decision.
*/
function resolveSnapshotPreviews(source = referencePreviewData_default, cases = referenceCases) {
	const resolved = [];
	for (const entry of cases) {
		if (!entry.previewAllowed) continue;
		if (entry.disclosure !== "named" || !entry.siteUrl) continue;
		const shot = source.previews?.[entry.id];
		if (!shot || shot.status !== "ok" || !isNonEmpty(shot.preview)) continue;
		resolved.push({
			id: entry.id,
			src: shot.preview,
			width: shot.width ?? PREVIEW_SIZE.width,
			height: shot.height ?? PREVIEW_SIZE.height
		});
	}
	return resolved;
}
/**
* How long one site gets to answer before its preview is withheld.
*
* Eight seconds, not three. A customer's site is not ours: it sits on a foreign
* host, and the FIRST request of a render pays for DNS and a TLS handshake. On
* 2026-09-11 a cold `HEAD https://hof-meerheck.de/` from Node took 3.24 s — just
* over the old limit — so the named case lost its screenshot on the live site
* while the asset and the customer's site were both perfectly fine.
*
* The cost of the longer wait is paid once per cache generation (the result is
* memoised below), never per visitor.
*/
var PROBE_TIMEOUT_MS = 8e3;
var defaultProbe = async (url) => {
	return (await fetch(url, {
		method: "HEAD",
		redirect: "follow",
		signal: AbortSignal.timeout(PROBE_TIMEOUT_MS)
	})).ok;
};
/**
* A map of case id → preview, for the cards to look themselves up in.
*
* Memoised through the generation-scoped content cache, so the home page and
* the service page share one round of probes per render. Only the ids cross
* the memo, for the same reason as in `demos.ts`: caching the resolved objects
* would pin one render's snapshot read into the next generation's result.
*/
async function getReferencePreviews(options = {}) {
	const resolved = resolveSnapshotPreviews(options.snapshot, options.cases);
	if (resolved.length === 0) return /* @__PURE__ */ new Map();
	const cases = options.cases ?? referenceCases;
	const urlFor = (id) => cases.find((entry) => entry.id === id)?.siteUrl ?? null;
	const run = async () => {
		const probe = options.probe ?? defaultProbe;
		const results = await Promise.allSettled(resolved.map((preview) => {
			const url = urlFor(preview.id);
			return url ? probe(url) : Promise.resolve(false);
		}));
		return resolved.filter((_, index) => {
			const result = results[index];
			return result !== void 0 && result.status === "fulfilled" && result.value === true;
		});
	};
	if (Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_DEMO_MODE": "false",
		"SITE": "https://tracht-digital.de",
		"SSR": true
	}, { _: "/opt/hostedtoolcache/node/22.23.3/x64/bin/npm" })?.PUBLIC_DEMO_MODE === "true") return new Map(resolved.map((preview) => [preview.id, preview]));
	let live;
	if (options.cache === false) live = await run();
	else {
		const ids = new Set(await contentCache.get("references:previews", async () => (await run()).map((preview) => preview.id)));
		live = resolved.filter((preview) => ids.has(preview.id));
	}
	return new Map(live.map((preview) => [preview.id, preview]));
}
/**
* The same previews, keyed by the customer's site address.
*
* The service detail page renders `ServiceReference` objects, which carry a
* `siteUrl` but not the case id — the id is deliberately not part of the shape
* the CMS can influence. The address is unique per case (a case has one site,
* and `references.test.ts` forbids two cases sharing one), so it is a safe key.
*/
async function getReferencePreviewsBySiteUrl(options = {}) {
	const byId = await getReferencePreviews(options);
	const cases = options.cases ?? referenceCases;
	const bySite = /* @__PURE__ */ new Map();
	for (const entry of cases) {
		const preview = entry.siteUrl ? byId.get(entry.id) : void 0;
		if (entry.siteUrl && preview) bySite.set(entry.siteUrl, preview);
	}
	return bySite;
}
// src/components/ui/DemoCard.astro
createAstro("https://tracht-digital.de");
var $$DemoCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DemoCard;
	const { demo, lang, serviceLink = null } = Astro.props;
	const ui = demoUi[lang];
	const { definition, title, description, favicon, preview, previewWidth, previewHeight } = demo;
	const previewAlt = lang === "de" ? `Startseite der Demo-Webseite ${title}` : `Home page of the demo website ${title}`;
	const kind = DEMO_KINDS[definition.kind][lang];
	const origin = DEMO_ORIGINS[definition.origin][lang];
	return renderTemplate`${maybeRenderHead($$result)}<article class="demo-card-slot" data-reveal data-astro-cid-ug7wgawq><div class="demo-card" data-motion-tilt data-astro-cid-ug7wgawq><div class="demo-card__shot" data-astro-cid-ug7wgawq><img${addAttribute(mediaSrc(preview), "src")}${addAttribute(srcsetFor(preview, PREVIEW_VARIANT_WIDTHS, previewWidth, mediaSrc), "srcset")} sizes="(min-width: 64rem) 34vw, (min-width: 48rem) 48vw, 85vw"${addAttribute(previewAlt, "alt")}${addAttribute(previewWidth, "width")}${addAttribute(previewHeight, "height")} loading="lazy" decoding="async" data-astro-cid-ug7wgawq><span class="demo-card__origin" data-astro-cid-ug7wgawq>${origin}</span><button type="button" class="demo-card__zoom" hidden data-preview-open${addAttribute(mediaSrc(preview), "data-preview-src")}${addAttribute(previewAlt, "data-preview-alt")}${addAttribute(title, "data-preview-title")}${addAttribute(definition.host, "data-preview-host")}${addAttribute(definition.url, "data-preview-href")} data-astro-cid-ug7wgawq><span class="sr-only" data-astro-cid-ug7wgawq>${ui.zoom}</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-ug7wgawq><circle cx="11" cy="11" r="7" data-astro-cid-ug7wgawq></circle><line x1="16.5" y1="16.5" x2="21" y2="21" data-astro-cid-ug7wgawq></line><line x1="11" y1="8" x2="11" y2="14" data-astro-cid-ug7wgawq></line><line x1="8" y1="11" x2="14" y2="11" data-astro-cid-ug7wgawq></line></svg></button></div><div class="demo-card__body" data-astro-cid-ug7wgawq><p class="demo-card__kind" data-astro-cid-ug7wgawq>${kind}</p><div class="demo-card__head" data-astro-cid-ug7wgawq>${favicon && renderTemplate`<img class="demo-card__favicon"${addAttribute(mediaSrc(favicon), "src")} alt="" aria-hidden="true" width="20" height="20" loading="lazy" decoding="async" data-astro-cid-ug7wgawq>`}<h3 class="demo-card__title" data-astro-cid-ug7wgawq>${title}</h3></div>${description && renderTemplate`<p class="demo-card__text" data-astro-cid-ug7wgawq>${description}</p>`}<p class="demo-card__host" data-astro-cid-ug7wgawq><span class="sr-only" data-astro-cid-ug7wgawq>${ui.hostLabel}: </span>${definition.host}</p></div>${renderComponent($$result, "CardActions", $$CardActions, {
		"lang": lang,
		"service": serviceLink,
		"cta": {
			href: definition.url,
			label: ui.visit,
			external: true,
			hreflang: demo.siteLang ?? void 0,
			detail: title
		},
		"data-astro-cid-ug7wgawq": true
	})}</div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/DemoCard.astro", void 0);
// src/components/ui/BusinessCardTile.astro
createAstro("https://tracht-digital.de");
var $$BusinessCardTile = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BusinessCardTile;
	const { serviceLink = null } = Astro.props;
	const lang = resolveLang(Astro.currentLocale);
	const copy = businessCardCopy[lang];
	const href = businessCardHref(lang);
	return renderTemplate`${maybeRenderHead($$result)}<article class="bc-tile-slot" data-reveal data-astro-cid-foobldl3><div class="bc-tile" data-motion-tilt data-astro-cid-foobldl3><div class="bc-tile__shot" data-astro-cid-foobldl3><img${addAttribute(mediaSrc(BUSINESS_CARD_PREVIEW), "src")}${addAttribute(copy.previewAlt, "alt")}${addAttribute(DEMO_PREVIEW.width, "width")}${addAttribute(DEMO_PREVIEW.height, "height")} loading="lazy" decoding="async" data-astro-cid-foobldl3></div><div class="bc-tile__body" data-astro-cid-foobldl3><p class="bc-tile__eyebrow" data-astro-cid-foobldl3>${copy.eyebrow}</p><h3 class="bc-tile__title" data-astro-cid-foobldl3>${copy.title}</h3><p class="bc-tile__text" data-astro-cid-foobldl3>${copy.text}</p></div>${renderComponent($$result, "CardActions", $$CardActions, {
		"lang": lang,
		"service": serviceLink,
		"cta": {
			href,
			label: copy.cta,
			detail: copy.title
		},
		"data-astro-cid-foobldl3": true
	})}</div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/BusinessCardTile.astro", void 0);
export { $$SectionHeader as a, getDemos as c, imageHints as d, imageObject as f, getReferencePreviewsBySiteUrl as i, DEMO_KINDS as l, $$DemoCard as n, demosCopy as o, getReferencePreviews as r, getHomeContent as s, $$BusinessCardTile as t, DEMO_ORIGINS as u };
