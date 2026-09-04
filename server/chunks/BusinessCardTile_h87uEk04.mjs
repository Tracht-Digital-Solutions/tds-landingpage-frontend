import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { s as resolveLang } from "./Layout_V8d2QaQ-.mjs";
import { t as contentCache } from "./contentCache_DmiZs_tG.mjs";
import { _ as businessCardHref, c as referenceCases, g as businessCardCopy, p as BUSINESS_CARD_PREVIEW } from "./services_Bv7bmOO1.mjs";
import { i as $$AccentLetters } from "./pricing_CELklk53.mjs";
//#region src/lib/homeContent.ts
var content = {
	de: {
		hero: {
			headline: "Alles Digitale.",
			headlineAccent: "Ein",
			headlineSuffix: "Ansprechpartner.",
			sub: "Ich plane und baue, was Ihr Betrieb wirklich braucht. *Sie haben einen Ansprechpartner* — nicht fünf Firmen, die aufeinander zeigen.",
			cta1: "Erstgespräch vereinbaren",
			cta2: "zu den Leistungen",
			scrollHint: "Wieso ich?"
		},
		whyMe: {
			headline: "Wieso",
			headlineAccent: "ich?",
			lead: "Sie brauchen jemanden, der den *Überblick behält* — nicht jemanden, der einzelne Aufträge abarbeitet.",
			p1: "Ich berate und setze selbst um. Sie müssen nichts zwischen mehreren Firmen übersetzen, und es gibt immer jemanden, der das ganze Bild kennt.",
			p2: "Ich erkläre Ihnen die Möglichkeiten in normaler Sprache und bleibe auf Wunsch auch nach dem Start zuständig.",
			reasons: [
				{
					title: "Ein fester Ansprechpartner",
					description: "Sie wissen immer, wer sich kümmert."
				},
				{
					title: "Verständlich erklärt",
					description: "Klare Möglichkeiten und Kosten, ohne Fachsprache."
				},
				{
					title: "Beratung und Umsetzung",
					description: "Ich plane es nicht nur — ich baue es auch."
				},
				{
					title: "Auch nach dem Start da",
					description: "Auf Wunsch betreue ich alles dauerhaft weiter."
				}
			]
		},
		servicesOverview: {
			headline: "Was ich",
			headlineAccent: "anbiete?",
			intro: "Vier Bereiche, *ein Ansprechpartner*. Wählen Sie einen Einstieg — oder wir klären zuerst gemeinsam, was Sie wirklich brauchen."
		},
		websiteDemos: {
			headline: "Webseiten zum",
			headlineAccent: "Anschauen.",
			intro: "Fertige Beispielseiten, live im Netz. *Klicken Sie sich durch* — so sehen Sie vorher, was Sie bekommen, statt es sich vorstellen zu müssen.",
			serviceIntro: "Fertige Beispielseiten, live im Netz. *Klicken Sie sich durch*, bevor wir über Ihre sprechen.",
			headlineSingle: "Eine Webseite zum",
			introSingle: "Eine fertige Beispielseite, live im Netz. *Sehen Sie sich um* — so sehen Sie vorher, was Sie bekommen, statt es sich vorstellen zu müssen.",
			serviceIntroSingle: "Eine fertige Beispielseite, live im Netz. *Sehen Sie sich um*, bevor wir über Ihre sprechen."
		},
		referencesHome: {
			headline: "Gebaut und",
			headlineAccent: "gezeigt.",
			intro: "Umgesetzte Projekte und fertige Beispielseiten in einer Ansicht — *blättern Sie durch*, statt sich vorstellen zu müssen, was Sie bekommen.",
			label: "Projekte werden nur nach ausdrücklicher Freigabe veröffentlicht — anonymisiert, sofern nicht anders vereinbart. Die Beispielseiten sind eigene Demos und stehen frei im Netz.",
			serviceCta: "Zur passenden Leistung"
		},
		digitalResponsibility: {
			headline: "Ein Ansprechpartner für",
			headlineAccent: "alles Digitale.",
			body: "Digitale Themen bleiben oft liegen: zwischen Projekten, Anbietern und der Frage, wer eigentlich zuständig ist. Ich behalte den Überblick und sorge dafür, dass alles zusammenpasst.",
			points: [
				"Sagen, was zuerst dran ist — verständlich",
				"Projekte selbst umsetzen oder Beteiligte steuern",
				"Vorhandene Systeme und neue Lösungen zusammenbringen",
				"Den Auftritt sichtbar machen und dort pflegen, wo er wirkt"
			],
			primaryCta: "Erstgespräch vereinbaren",
			secondaryCta: "Preise ansehen"
		},
		contactHeading: {
			headline: "Womit fangen",
			headlineAccent: "wir an?"
		}
	},
	en: {
		hero: {
			headline: "Everything digital.",
			headlineAccent: "One",
			headlineSuffix: "point of contact.",
			sub: "I plan and build what your business actually needs. *You get one contact* — not five suppliers pointing at each other.",
			cta1: "Arrange an initial consultation",
			cta2: "View services",
			scrollHint: "Why me?"
		},
		whyMe: {
			headline: "Why",
			headlineAccent: "me?",
			lead: "You need someone who *keeps the whole picture* in view — not someone who works through isolated tasks.",
			p1: "I advise and build. You never have to translate a decision between suppliers, and someone always knows how the whole setup fits together.",
			p2: "I explain the options in plain language and, if you want, stay responsible after launch.",
			reasons: [
				{
					title: "One steady contact",
					description: "You always know who is taking care of it."
				},
				{
					title: "Explained plainly",
					description: "Clear options and costs, without the jargon."
				},
				{
					title: "Advice and delivery",
					description: "I do not just plan it — I build it."
				},
				{
					title: "Still there after launch",
					description: "I can keep running and improving it for you."
				}
			]
		},
		servicesOverview: {
			headline: "What I",
			headlineAccent: "offer?",
			intro: "Four areas, *one point of contact*. Pick a starting point — or let us work out first what you actually need."
		},
		websiteDemos: {
			headline: "Websites to",
			headlineAccent: "look at.",
			intro: "Finished example sites, live on the web. *Click through them* — so you can see beforehand what you get instead of having to imagine it.",
			serviceIntro: "Finished example sites, live on the web. *Click through them* before we talk about yours.",
			headlineSingle: "A website to",
			introSingle: "A finished example site, live on the web. *Take a look around* — so you can see beforehand what you get instead of having to imagine it.",
			serviceIntroSingle: "A finished example site, live on the web. *Take a look around* before we talk about yours."
		},
		referencesHome: {
			headline: "Built and",
			headlineAccent: "shown.",
			intro: "Delivered projects and finished example sites in one place — *page through them* instead of having to imagine what you get.",
			label: "Projects are published only with the client's explicit approval — anonymised unless agreed otherwise. The example sites are our own demos and are openly on the web.",
			serviceCta: "See the matching service"
		},
		digitalResponsibility: {
			headline: "One point of contact for",
			headlineAccent: "everything digital.",
			body: "Digital work tends to stall between one-off projects, suppliers and the question of who owns it. I keep the overview and make sure the pieces fit together.",
			points: [
				"Say what comes first — in plain terms",
				"Deliver projects directly or steer the people involved",
				"Bring existing systems and new solutions together",
				"Make the presence visible and keep it working over time"
			],
			primaryCta: "Arrange an initial consultation",
			secondaryCta: "View pricing"
		},
		contactHeading: {
			headline: "Where shall we",
			headlineAccent: "start?"
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
	return {
		headline: single ? content.headlineSingle : content.headline,
		headlineAccent: content.headlineAccent,
		intro: single ? variant === "service" ? content.serviceIntroSingle : content.introSingle : variant === "service" ? content.serviceIntro : content.intro
	};
}
//#endregion
//#region src/components/ui/SectionHeader.astro
createAstro("https://tracht-digital.de");
var $$SectionHeader = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SectionHeader;
	const { headline, headlineAccent, id, dark = false, headingClass = "mb-16", bar = false } = Astro.props;
	const headingSpacing = bar ? "mb-5" : headingClass;
	return renderTemplate`${maybeRenderHead($$result)}<div class="text-center md:text-left"><h2${addAttribute(id, "id")}${addAttribute([
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
var demoData_default = {
	generatedAt: "2026-09-03T04:45:57.732Z",
	demos: {
		"demo1": {
			"status": "ok",
			"title": "Demo & Partner Rechtsanwälte",
			"description": "Hochwertige Demonstrationsseite einer fiktiven deutschen Wirtschaftskanzlei. Keine Rechtsberatung, keine echten Kontaktdaten.",
			"siteLang": "de",
			"favicon": "/demos/demo1-favicon.svg",
			"preview": "/demos/demo1.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-09-03T04:45:54.014Z"
		},
		"demo2": {
			"status": "tls-invalid",
			"title": null,
			"description": null,
			"siteLang": null,
			"favicon": null,
			"preview": null,
			"previewWidth": null,
			"previewHeight": null,
			"checkedAt": "2026-09-03T04:45:54.102Z"
		},
		"demo3": {
			"status": "tls-invalid",
			"title": null,
			"description": null,
			"siteLang": null,
			"favicon": null,
			"preview": null,
			"previewWidth": null,
			"previewHeight": null,
			"checkedAt": "2026-09-03T04:45:54.210Z"
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
			"checkedAt": "2026-09-03T04:45:54.314Z"
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
			"checkedAt": "2026-09-03T04:45:54.405Z"
		}
	}
};
//#endregion
//#region src/lib/demoCatalog.ts
/**
* Every demo site, in display order.
*
* Adding one means adding it here AND running `npm run demos:sync`. The tests
* fail on a definition with no snapshot entry, which is what stops a new demo
* from rendering as a card with no picture and no text.
*/
var demoDefinitions = [
	{
		id: "demo1",
		number: "01",
		host: "demo1.tracht-digital.de",
		url: "https://demo1.tracht-digital.de/"
	},
	{
		id: "demo2",
		number: "02",
		host: "demo2.tracht-digital.de",
		url: "https://demo2.tracht-digital.de/"
	},
	{
		id: "demo3",
		number: "03",
		host: "demo3.tracht-digital.de",
		url: "https://demo3.tracht-digital.de/"
	},
	{
		id: "demo4",
		number: "04",
		host: "demo4.tracht-digital.de",
		url: "https://demo4.tracht-digital.de/"
	},
	{
		id: "demo5",
		number: "05",
		host: "demo5.tracht-digital.de",
		url: "https://demo5.tracht-digital.de/"
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
//#endregion
//#region src/lib/demos.ts
var demoSnapshot = demoData_default;
function isNonEmpty$1(value) {
	return typeof value === "string" && value.trim() !== "";
}
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
var PROBE_TIMEOUT_MS$1 = 3e3;
var defaultProbe$1 = async (demo) => {
	return (await fetch(demo.definition.url, {
		method: "HEAD",
		redirect: "follow",
		signal: AbortSignal.timeout(PROBE_TIMEOUT_MS$1)
	})).ok;
};
async function filterReachable(demos, probe = defaultProbe$1) {
	if (demos.length === 0) return [];
	const results = await Promise.allSettled(demos.map((demo) => probe(demo)));
	return demos.filter((_, index) => {
		const result = results[index];
		return result !== void 0 && result.status === "fulfilled" && result.value === true;
	});
}
async function getDemos(options = {}) {
	const resolved = resolveSnapshotDemos(options.snapshot, options.definitions);
	if (resolved.length === 0) return [];
	if (Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_DEMO_MODE": "true",
		"SITE": "https://tracht-digital.de",
		"SSR": true
	}, { _: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm" })?.PUBLIC_DEMO_MODE === "true") return resolved;
	const run = () => filterReachable(resolved, options.probe);
	if (options.cache === false) return run();
	const reachable = await contentCache.get("demos:availability", async () => (await run()).map((demo) => demo.definition.id));
	const ids = new Set(reachable);
	return resolved.filter((demo) => ids.has(demo.definition.id));
}
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
	generatedAt: null,
	previews: {}
};
//#endregion
//#region src/lib/referencePreviewMeta.ts
var PREVIEW_SIZE = {
	width: 1440,
	height: 900
};
//#endregion
//#region src/lib/referencePreviews.ts
function isNonEmpty(value) {
	return typeof value === "string" && value.trim() !== "";
}
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
var PROBE_TIMEOUT_MS = 3e3;
var defaultProbe = async (url) => {
	return (await fetch(url, {
		method: "HEAD",
		redirect: "follow",
		signal: AbortSignal.timeout(PROBE_TIMEOUT_MS)
	})).ok;
};
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
		"PUBLIC_DEMO_MODE": "true",
		"SITE": "https://tracht-digital.de",
		"SSR": true
	}, { _: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm" })?.PUBLIC_DEMO_MODE === "true") return new Map(resolved.map((preview) => [preview.id, preview]));
	let live;
	if (options.cache === false) live = await run();
	else {
		const ids = new Set(await contentCache.get("references:previews", async () => (await run()).map((preview) => preview.id)));
		live = resolved.filter((preview) => ids.has(preview.id));
	}
	return new Map(live.map((preview) => [preview.id, preview]));
}
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
//#endregion
//#region src/components/ui/DemoCard.astro
createAstro("https://tracht-digital.de");
var $$DemoCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DemoCard;
	const { demo, lang } = Astro.props;
	const ui = demoUi[lang];
	const { definition, title, description, favicon, preview, previewWidth, previewHeight } = demo;
	const previewAlt = lang === "de" ? `Startseite der Demo-Webseite ${title}` : `Home page of the demo website ${title}`;
	return renderTemplate`${maybeRenderHead($$result)}<article class="demo-card-slot" data-reveal data-astro-cid-ug7wgawq><a class="demo-card"${addAttribute(definition.url, "href")} target="_blank" rel="noopener noreferrer"${addAttribute(demo.siteLang ?? void 0, "hreflang")} data-astro-cid-ug7wgawq><div class="demo-card__shot" data-astro-cid-ug7wgawq><img${addAttribute(preview, "src")}${addAttribute(previewAlt, "alt")}${addAttribute(previewWidth, "width")}${addAttribute(previewHeight, "height")} loading="lazy" decoding="async" data-astro-cid-ug7wgawq></div><div class="demo-card__body" data-astro-cid-ug7wgawq><div class="demo-card__head" data-astro-cid-ug7wgawq>${favicon && renderTemplate`<img class="demo-card__favicon"${addAttribute(favicon, "src")} alt="" aria-hidden="true" width="20" height="20" loading="lazy" decoding="async" data-astro-cid-ug7wgawq>`}<h3 class="demo-card__title" data-astro-cid-ug7wgawq>${title}</h3></div>${description && renderTemplate`<p class="demo-card__text" data-astro-cid-ug7wgawq>${description}</p>`}<div class="demo-card__foot" data-astro-cid-ug7wgawq><span class="demo-card__host" data-astro-cid-ug7wgawq>${definition.host}</span><span class="demo-card__go" data-astro-cid-ug7wgawq>${ui.visit}<span class="sr-only" data-astro-cid-ug7wgawq> (${ui.newTab})</span><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-ug7wgawq><line x1="7" y1="17" x2="17" y2="7" data-astro-cid-ug7wgawq></line><polyline points="7 7 17 7 17 17" data-astro-cid-ug7wgawq></polyline></svg></span></div></div></a></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/DemoCard.astro", void 0);
//#endregion
//#region src/components/ui/BusinessCardTile.astro
createAstro("https://tracht-digital.de");
var $$BusinessCardTile = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BusinessCardTile;
	const lang = resolveLang(Astro.currentLocale);
	const copy = businessCardCopy[lang];
	const href = businessCardHref(lang);
	return renderTemplate`${maybeRenderHead($$result)}<article class="bc-tile-slot" data-reveal data-astro-cid-foobldl3><a class="bc-tile"${addAttribute(href, "href")} data-astro-cid-foobldl3><div class="bc-tile__shot" data-astro-cid-foobldl3><img${addAttribute(BUSINESS_CARD_PREVIEW, "src")}${addAttribute(copy.previewAlt, "alt")}${addAttribute(DEMO_PREVIEW.width, "width")}${addAttribute(DEMO_PREVIEW.height, "height")} loading="lazy" decoding="async" data-astro-cid-foobldl3></div><div class="bc-tile__body" data-astro-cid-foobldl3><p class="bc-tile__eyebrow" data-astro-cid-foobldl3>${copy.eyebrow}</p><h3 class="bc-tile__title" data-astro-cid-foobldl3>${copy.title}</h3><p class="bc-tile__text" data-astro-cid-foobldl3>${copy.text}</p><div class="bc-tile__foot" data-astro-cid-foobldl3><span class="bc-tile__go" data-astro-cid-foobldl3>${copy.cta}<span aria-hidden="true" data-astro-cid-foobldl3> →</span></span></div></div></a></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/BusinessCardTile.astro", void 0);
//#endregion
export { getDemos as a, getHomeContent as c, getReferencePreviewsBySiteUrl as i, $$DemoCard as n, $$SectionHeader as o, getReferencePreviews as r, demosCopy as s, $$BusinessCardTile as t };
