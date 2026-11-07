import { F as addAttribute, O as renderTemplate, S as renderComponent, T as renderSlot, k as maybeRenderHead } from "./sequence_-pfDyphk.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import { t as createAstro } from "./compiler_BVs5vHf6.mjs";
import { p as resolveLang } from "./Layout_BRUQ3vZE.mjs";
import { i as contentCache } from "./siteKey_BFQrbRAC.mjs";
import { $ as businessCardHref, Q as businessCardCopy, Y as BUSINESS_CARD_PREVIEW, f as referenceCases } from "./sitemapSections_RyOEyUq6.mjs";
import { l as srcsetFor, r as PREVIEW_VARIANT_WIDTHS } from "./imageVariants_68BgY0RI.mjs";
import { n as mediaSrc, t as $$CardActions } from "./CardActions_DSS3bkZA.mjs";
// node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-TIOQP7E6.js
var NAVY = "#050f68";
var BORDEAUX = "#820933";
var CORAL = "#ff7a9c";
var SAND = "#f4efe6";
var SCHEMES = [
	[
		NAVY,
		CORAL,
		BORDEAUX,
		"#ffffff"
	],
	[
		SAND,
		NAVY,
		CORAL,
		NAVY
	],
	[
		BORDEAUX,
		CORAL,
		NAVY,
		"#ffffff"
	],
	[
		"#0b0a07",
		CORAL,
		NAVY,
		"#ffffff"
	],
	[
		SAND,
		BORDEAUX,
		NAVY,
		BORDEAUX
	],
	[
		NAVY,
		"#ffffff",
		CORAL,
		CORAL
	]
];
function placeholderHash(seed) {
	const text = String(seed);
	let h = 2166136261;
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
var escapeXml = (text) => text.replace(/[&<>"']/g, (c) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&apos;"
})[c]);
function tdsPlaceholderSvg({ seed, width = 1200, height = 750, monogram }) {
	const h = placeholderHash(seed);
	const [ground, main, second, line] = SCHEMES[h % SCHEMES.length];
	const u = Math.min(width, height);
	const flipX = h >> 3 & 1;
	const flipY = h >> 4 & 1;
	const x = (value) => flipX ? width - value : value;
	const y = (value) => flipY ? height - value : value;
	const capW = u * .95;
	const capH = u * .36;
	const capX = x(width * .72) - capW / 2;
	const capY = y(height * .78) - capH / 2;
	const rings = [
		1,
		2,
		3,
		4
	].map((step) => {
		const off = step * u * .022;
		return `<rect x="${(capX - off).toFixed(1)}" y="${(capY - off).toFixed(1)}" width="${capW.toFixed(1)}" height="${capH.toFixed(1)}" rx="${(capH / 2).toFixed(1)}" fill="none" stroke="${line}" stroke-opacity="${(.42 - step * .07).toFixed(2)}" stroke-width="${(u * .004).toFixed(1)}"/>`;
	}).join("");
	const capsule = `<rect x="${capX.toFixed(1)}" y="${capY.toFixed(1)}" width="${capW.toFixed(1)}" height="${capH.toFixed(1)}" rx="${(capH / 2).toFixed(1)}" fill="${main}"/>`;
	const r = u * (.32 + (h >> 6) % 12 / 100);
	const cx = x(0);
	const cy = y(0);
	const quarter = `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="${second}"/><circle cx="${cx}" cy="${cy}" r="${(r * 1.28).toFixed(1)}" fill="none" stroke="${line}" stroke-opacity="0.3" stroke-width="${(u * .004).toFixed(1)}"/>`;
	const barH = u * .022;
	const barLeft = flipX ? width * .08 : width * .6;
	const barTop = flipY ? height * .84 : height * .14;
	const bars = [
		[
			0,
			u * .2,
			line
		],
		[
			u * .225,
			u * .09,
			main
		],
		[
			u * .34,
			u * .045,
			second
		]
	].map(([offset, w, colour]) => `<rect x="${(barLeft + offset).toFixed(1)}" y="${barTop.toFixed(1)}" width="${w.toFixed(1)}" height="${barH.toFixed(1)}" rx="${(barH / 2).toFixed(1)}" fill="${colour}"/>`).join("");
	const letters = monogram?.trim().slice(0, 2);
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"><rect width="${width}" height="${height}" fill="${ground}"/>${quarter}${rings}${capsule}${bars}${letters ? `<text x="${width / 2}" y="${height / 2}" dy=".35em" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${(u * .34).toFixed(1)}" fill="${line}" fill-opacity="0.9">${escapeXml(letters)}</text>` : ""}</svg>`;
}
function tdsPlaceholder(options) {
	return `data:image/svg+xml,${encodeURIComponent(tdsPlaceholderSvg(options))}`;
}
var demoData_default = {
	generatedAt: "2026-11-07T11:04:53.174Z",
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
			"checkedAt": "2026-11-07T11:04:27.397Z"
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
			"checkedAt": "2026-11-07T11:04:28.222Z"
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
			"checkedAt": "2026-11-07T11:04:29.707Z"
		},
		"demo4": {
			"status": "ok",
			"title": "Schreinerei in Musterstadt | Schreinerei Lindgrund (Demo-Webseite)",
			"description": "Demo-Webseite der fiktiven Schreinerei Lindgrund: So könnte die Unternehmensseite eines Handwerksbetriebs aussehen.",
			"siteLang": "de",
			"favicon": "/demos/demo4-favicon.svg",
			"preview": "/demos/demo4.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-11-07T11:04:31.014Z"
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
			"checkedAt": "2026-11-07T11:04:31.514Z"
		},
		"shop": {
			"status": "ok",
			"title": "Shop von Tracht Digital Solutions",
			"description": "Digitale Leistungen zum Festpreis für Selbstständige und kleine Betriebe: Website, SEO, E-Mail, Wartung und Schulung. Dazu Technik mit eigener Einschätzung.",
			"siteLang": "de",
			"favicon": "/demos/shop-favicon.png",
			"preview": "/demos/shop.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-11-07T11:04:32.730Z"
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
		origin: "demo",
		labels: {
			de: ["Kanzlei", "Onepager"],
			en: ["Law firm", "One-pager"]
		}
	},
	{
		id: "demo2",
		number: "02",
		host: "demo2.tracht-digital.de",
		url: "https://demo2.tracht-digital.de/de/",
		kind: "shop",
		origin: "demo",
		labels: {
			de: ["Mode", "Interaktiv"],
			en: ["Fashion", "Interactive"]
		}
	},
	{
		id: "demo3",
		number: "03",
		host: "demo3.tracht-digital.de",
		url: "https://demo3.tracht-digital.de/",
		kind: "website",
		origin: "demo",
		labels: {
			de: ["Immobilien", "Verwaltungspanel"],
			en: ["Real estate", "Management panel"]
		}
	},
	{
		id: "demo4",
		number: "04",
		host: "demo4.tracht-digital.de",
		url: "https://demo4.tracht-digital.de/",
		kind: "website",
		origin: "demo",
		labels: {
			de: ["Handwerk", "Schreinerei"],
			en: ["Trades", "Joinery"]
		}
	},
	{
		id: "demo5",
		number: "05",
		host: "demo5.tracht-digital.de",
		url: "https://demo5.tracht-digital.de/",
		kind: "website",
		origin: "demo",
		labels: {
			de: [],
			en: []
		}
	},
	{
		id: "shop",
		number: "06",
		host: "shop.tracht-digital.de",
		url: "https://shop.tracht-digital.de/",
		kind: "shop",
		origin: "own",
		labels: {
			de: ["Festpreise", "Leistungskatalog"],
			en: ["Fixed prices", "Service catalogue"]
		}
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
	}, { _: "/opt/hostedtoolcache/node/22.23.4/x64/bin/npm" })?.PUBLIC_DEMO_MODE === "true") return resolved;
	const run = () => filterReachable(resolved, options.probe);
	if (options.cache === false) return run();
	const reachable = await contentCache.get("demos:availability", async () => (await run()).map((demo) => demo.definition.id));
	const ids = new Set(reachable);
	return resolved.filter((demo) => ids.has(demo.definition.id));
}
/**
* Card microcopy that belongs to this site, not to the demo.
*/
var demoUi = {
	de: {
		newTab: "öffnet in neuem Tab",
		visit: "Demo ansehen",
		hostLabel: "Adresse"
	},
	en: {
		newTab: "opens in a new tab",
		visit: "View demo",
		hostLabel: "Address"
	}
};
var referencePreviewData_default = {
	generatedAt: "2026-11-07T11:05:00.904Z",
	previews: { "hof-meerheck": {
		"status": "ok",
		"preview": "/references/hof-meerheck.webp",
		"width": 1440,
		"height": 900,
		"capturedAt": "2026-11-07T11:05:00.876Z"
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
	}, { _: "/opt/hostedtoolcache/node/22.23.4/x64/bin/npm" })?.PUBLIC_DEMO_MODE === "true") return new Map(resolved.map((preview) => [preview.id, preview]));
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
// src/components/ui/ProjectCard.astro
createAstro("https://tracht-digital.de");
var $$ProjectCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProjectCard;
	const { title, src = null, srcset, sizes = "(min-width: 64rem) 34vw, (min-width: 48rem) 48vw, 85vw", alt = "", width = 1440, height = 900, origin, kind, kindLabel, text, textLabel, caption, captionLabel, labels = [], labelsLabel } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<article class="project-card-slot" data-reveal data-astro-cid-jnje7wnl><div class="project-card__tilt" data-motion-tilt data-astro-cid-jnje7wnl><span class="project-card__shade" aria-hidden="true" data-astro-cid-jnje7wnl></span><div class="project-card" data-astro-cid-jnje7wnl><div class="project-card__shot" data-astro-cid-jnje7wnl>${src ? renderTemplate`<img${addAttribute(src, "src")}${addAttribute(srcset, "srcset")}${addAttribute(srcset ? sizes : void 0, "sizes")}${addAttribute(alt, "alt")}${addAttribute(width, "width")}${addAttribute(height, "height")} loading="lazy" decoding="async" data-astro-cid-jnje7wnl>` : renderTemplate`<img${addAttribute(tdsPlaceholder({
		seed: title,
		width,
		height,
		monogram: title.charAt(0)
	}), "src")} alt=""${addAttribute(width, "width")}${addAttribute(height, "height")} loading="lazy" decoding="async" data-astro-cid-jnje7wnl>`}${origin && renderTemplate`<span class="project-card__origin" data-astro-cid-jnje7wnl>${origin}</span>`}${renderSlot($$result, $$slots["shot"])}</div><div class="project-card__body" data-astro-cid-jnje7wnl>${kind && renderTemplate`<p class="project-card__kind" data-astro-cid-jnje7wnl>${kindLabel && renderTemplate`<span class="sr-only" data-astro-cid-jnje7wnl>${kindLabel}: </span>`}${kind}</p>`}<div class="project-card__head" data-astro-cid-jnje7wnl>${renderSlot($$result, $$slots["before-title"])}<h3 class="project-card__title" data-astro-cid-jnje7wnl>${title}</h3></div>${text && renderTemplate`<p class="project-card__text" data-astro-cid-jnje7wnl>${textLabel && renderTemplate`<span class="sr-only" data-astro-cid-jnje7wnl>${textLabel}: </span>`}${text}</p>`}${renderSlot($$result, $$slots["default"])}${labels.length > 0 && renderTemplate`<ul class="project-card__labels"${addAttribute(labelsLabel, "aria-label")} data-astro-cid-jnje7wnl>${labels.map((label) => renderTemplate`<li data-astro-cid-jnje7wnl>${label}</li>`)}</ul>`}${caption && renderTemplate`<p class="project-card__caption" data-astro-cid-jnje7wnl>${captionLabel && renderTemplate`<span class="sr-only" data-astro-cid-jnje7wnl>${captionLabel}: </span>`}${caption}</p>`}</div>${renderSlot($$result, $$slots["actions"])}</div></div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/ProjectCard.astro", void 0);
// src/components/ui/BusinessCardTile.astro
createAstro("https://tracht-digital.de");
var $$BusinessCardTile = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BusinessCardTile;
	const { serviceLink = null } = Astro.props;
	const lang = resolveLang(Astro.currentLocale);
	const copy = businessCardCopy[lang];
	const href = businessCardHref(lang);
	return renderTemplate`${renderComponent($$result, "ProjectCard", $$ProjectCard, {
		"title": copy.title,
		"src": mediaSrc(BUSINESS_CARD_PREVIEW),
		"alt": copy.previewAlt,
		"width": DEMO_PREVIEW.width,
		"height": DEMO_PREVIEW.height,
		"origin": copy.eyebrow,
		"kind": copy.kind,
		"text": copy.text,
		"labels": lang === "de" ? ["QR-Code", "Kontakt speichern"] : ["QR code", "Save contact"]
	}, { "actions": ($$result) => renderTemplate`${renderComponent($$result, "CardActions", $$CardActions, {
		"slot": "actions",
		"lang": lang,
		"service": serviceLink,
		"cta": {
			href,
			label: copy.cta,
			detail: copy.title
		}
	})}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/BusinessCardTile.astro", void 0);
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
	return renderTemplate`${renderComponent($$result, "ProjectCard", $$ProjectCard, {
		"title": title,
		"src": mediaSrc(preview),
		"srcset": srcsetFor(preview, PREVIEW_VARIANT_WIDTHS, previewWidth, mediaSrc),
		"alt": previewAlt,
		"width": previewWidth,
		"height": previewHeight,
		"origin": origin,
		"kind": kind,
		"text": description,
		"labels": definition.labels[lang],
		"data-astro-cid-ug7wgawq": true
	}, {
		"before-title": ($$result) => renderTemplate`${favicon && renderTemplate`${maybeRenderHead($$result)}<img class="demo-card__favicon"${addAttribute(mediaSrc(favicon), "src")} alt="" aria-hidden="true" width="20" height="20" loading="lazy" decoding="async" data-astro-cid-ug7wgawq>`}`,
		"actions": ($$result) => renderTemplate`${renderComponent($$result, "CardActions", $$CardActions, {
			"slot": "actions",
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
		})}`
	})}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/DemoCard.astro", void 0);
export { getReferencePreviewsBySiteUrl as a, DEMO_ORIGINS as c, getReferencePreviews as i, DEMO_PREVIEW as l, $$BusinessCardTile as n, getDemos as o, $$ProjectCard as r, DEMO_KINDS as s, $$DemoCard as t, tdsPlaceholder as u };
