import { A as renderTemplate, B as createAstro, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_n1BymCGP.mjs";
import { t as createComponent } from "./compiler_B89CkCkP.mjs";
import { _ as localizePath, v as resolveLang } from "./Layout_Bk719o5h.mjs";
import { t as contentCache } from "./contentFetch_DOBZ-t4p.mjs";
import { G as businessCardHref, V as BUSINESS_CARD_PREVIEW, W as businessCardCopy, f as referenceCases, m as cmsFor } from "./sitemapSections_C2iJeOpf.mjs";
import { p as PREVIEW_VARIANT_WIDTHS, y as srcsetFor } from "./jsonld_C1JBQ_Xg.mjs";
import { t as $$AccentLetters } from "./AccentLetters_Ctj67FSp.mjs";
import { n as mediaSrc, t as $$CardActions } from "./CardActions_Dntprkc8.mjs";
//#region src/lib/homeContent.ts
var content = {
	de: {
		hero: {
			eyebrow: "Für Betriebe, die digital besser arbeiten wollen",
			headline: "Alles an einem Ort.",
			headlineAccent: "Dein eigenes",
			headlineSuffix: "Panel.",
			sub: "Aufträge, Kunden und Termine in einem Kundenportal – dazu Abläufe, die *digital und ohne Umwege* laufen. Ich bleibe dein fester Ansprechpartner.",
			cta1: "Erstgespräch vereinbaren",
			cta2: "Leistungen ansehen",
			ctaNote: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren. Antwort in der Regel innerhalb von 24 Stunden.",
			scrollHint: "Wieso ich?"
		},
		whyMe: {
			headline: "Wieso",
			headlineAccent: "ich?",
			lead: "Du brauchst *einen Ansprechpartner* – nicht fünf Anbieter.",
			p1: "Ich baue auf dem auf, was du schon hast, statt alles neu zu machen.",
			p2: "Danach bleibe ich auf Wunsch dein Ansprechpartner – aus Schwarzenbek bei Hamburg, für Betriebe in ganz Deutschland.",
			motivation: {
				title: "Warum ich das mache",
				body: ["Ich habe zu oft gesehen, woran digitale Arbeit hängt: eine Tabelle hier, ein Zettel dort, ein Zugang für alle.", "Das ist mein Antrieb. Ich baue, was zum Ablauf passt – und was sicher ist, ohne dass du dich darum kümmern musst."]
			},
			reasons: [
				{
					title: "Ich übernehme Bestehendes",
					description: "Auch fremden Code und fremde Systeme."
				},
				{
					title: "Ein fester Ansprechpartner",
					description: "Du weißt immer, wer sich kümmert."
				},
				{
					title: "Verständlich erklärt",
					description: "Klare Möglichkeiten und Kosten, ohne Fachsprache."
				},
				{
					title: "Auch nach dem Start da",
					description: "Auf Wunsch betreue ich alles dauerhaft weiter."
				}
			]
		},
		servicesOverview: {
			headline: "Wobei ich dir",
			headlineAccent: "helfe.",
			intro: "Fünf Leistungen, *ein Ansprechpartner*: vom eigenen Panel über digitale Abläufe bis zu deiner Website."
		},
		websiteDemos: {
			headline: "Beispielseiten und",
			headlineAccent: "Designstudien.",
			intro: "Eigene Demos und Entwürfe – *keine Kundenaufträge*.",
			serviceIntro: "Eigene Demos und Projekte, live im Netz – *keine Kundenaufträge*.",
			headlineSingle: "Eine Beispielseite zum",
			introSingle: "Eine eigene Beispielseite – *kein Kundenauftrag*. Klick dich einfach durch.",
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
			body: "Digitale Themen bleiben liegen, weil niemand zuständig ist. Ich übernehme die Zuständigkeit.",
			points: [
				"Sagen, was zuerst dran ist – verständlich",
				"Arbeit und Daten in einem Panel bündeln",
				"Vorhandene Systeme übernehmen statt ersetzen"
			],
			primaryCta: "Erstgespräch vereinbaren",
			secondaryCta: "Preise ansehen"
		},
		contactHeading: {
			headline: "Womit fangen",
			headlineAccent: "wir an?",
			sub: "Schreib mir kurz, wo es hakt. Ich antworte in der Regel innerhalb von 24 Stunden."
		},
		journalHeading: {
			headline: "Wissen für",
			headlineAccent: "deinen Betrieb."
		},
		trust: {
			title: "Darauf kannst du dich verlassen",
			facts: [
				{
					title: "Ein fester Ansprechpartner",
					text: "Du sprichst immer mit mir: {name} aus {town} bei Hamburg.",
					linkLabel: "Wer ich bin"
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
					text: "Du erzählst, wo es hakt. Ich sage dir ehrlich, ob ich helfen kann."
				},
				{
					label: "Vorbereitung",
					text: "Zwei, drei Sätze genügen. Ein Link hilft."
				},
				{
					label: "Ergebnis",
					text: "Du weißt, was zuerst dran ist und was es ungefähr kostet."
				},
				{
					label: "Kosten",
					text: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren."
				}
			],
			cta: "Erstgespräch vereinbaren"
		},
		pricingLogic: {
			title: "So entsteht dein Preis",
			steps: [
				{
					title: "Wie klar die Aufgabe ist",
					text: "Ein fertiges Ziel ist günstiger als eine offene Idee. Im Erstgespräch machen wir daraus etwas Zählbares."
				},
				{
					title: "Wie viel Verantwortung dranhängt",
					text: "Eine Infoseite kostet weniger als ein Shop, der Geld annimmt. Wo Zahlungen oder Kundendaten im Spiel sind, wird es teurer."
				},
				{
					title: "Was am Ende dasteht",
					text: "Passt es in ein Paket, gilt der Festpreis. Sonst bekommst du ein eigenes Angebot – mit Preis und Termin, vor der Zusage."
				}
			],
			note: "Was ich nicht einschätzen kann, schätze ich nicht: dann sehe ich vorher hinein und sage dir danach den Preis."
		}
	},
	en: {
		hero: {
			eyebrow: "For businesses that want to work better digitally",
			headline: "Everything in one place.",
			headlineAccent: "Your own",
			headlineSuffix: "panel.",
			sub: "Orders, customers and appointments in one customer portal – plus workflows that run *digitally, without detours*. I stay your single point of contact.",
			cta1: "Arrange an initial consultation",
			cta2: "View services",
			ctaNote: "Costs only arise once we agree on an assignment. I usually reply within 24 hours.",
			scrollHint: "Why me?"
		},
		whyMe: {
			headline: "Why",
			headlineAccent: "me?",
			lead: "You need *one point of contact* – not five suppliers.",
			p1: "I build on what you already have instead of starting from scratch.",
			p2: "After that I stay your point of contact if you want – based in Schwarzenbek near Hamburg, working with businesses across Germany.",
			motivation: {
				title: "Why I do this",
				body: ["I have seen too often what digital work hangs on: a spreadsheet here, a note there, one login for everyone.", "That is what drives me. I build what fits the way you work – and what is secure, without you having to think about it."]
			},
			reasons: [
				{
					title: "I take over what exists",
					description: "Someone else’s code and systems included."
				},
				{
					title: "One steady contact",
					description: "You always know who is taking care of it."
				},
				{
					title: "Explained plainly",
					description: "Clear options and costs, without the jargon."
				},
				{
					title: "Still there after launch",
					description: "I can keep running and improving it for you."
				}
			]
		},
		servicesOverview: {
			headline: "How I can",
			headlineAccent: "help.",
			intro: "Five services, *one point of contact*: from your own panel and digital workflows to your website."
		},
		websiteDemos: {
			headline: "Example sites and",
			headlineAccent: "design studies.",
			intro: "My own demos and drafts – *not client work*. The demos are live on the web.",
			serviceIntro: "My own demos and projects, live on the web – *not client work*.",
			headlineSingle: "An example site to",
			introSingle: "One of my own example sites – *not client work*. Just click through.",
			serviceIntroSingle: "One of my own example sites, live on the web – *not client work*."
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
			body: "Digital work stalls because nobody owns it. I take that ownership on.",
			points: [
				"Say what comes first — in plain terms",
				"Bring work and data together in one panel",
				"Take existing systems over rather than replace them"
			],
			primaryCta: "Arrange an initial consultation",
			secondaryCta: "View pricing"
		},
		contactHeading: {
			headline: "Where shall we",
			headlineAccent: "start?",
			sub: "Tell me briefly where things get stuck. I usually reply within 24 hours."
		},
		journalHeading: {
			headline: "Know-how for",
			headlineAccent: "your business."
		},
		trust: {
			title: "What you can rely on",
			facts: [
				{
					title: "One steady contact",
					text: "You always talk to me: {name}, based in {town} near Hamburg.",
					linkLabel: "Who I am"
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
					text: "You tell me where things get stuck. I say honestly whether I can help."
				},
				{
					label: "Preparation",
					text: "Two or three sentences are enough. A link helps."
				},
				{
					label: "Outcome",
					text: "You know what comes first and roughly what it costs."
				},
				{
					label: "Costs",
					text: "Costs only arise once we agree on an assignment."
				}
			],
			cta: "Arrange an initial consultation"
		},
		pricingLogic: {
			title: "How your price comes about",
			steps: [
				{
					title: "How clear the task is",
					text: "A finished goal costs less than an open idea. The first conversation turns yours into something countable."
				},
				{
					title: "How much responsibility it carries",
					text: "An information page costs less than a shop that takes money. Where payments or customer data are involved, it gets more expensive."
				},
				{
					title: "What stands at the end",
					text: "If it fits a package, the fixed price applies. Otherwise you get a quote of its own – with a price and a date, before you commit."
				}
			],
			note: "What I cannot assess, I do not estimate: then I look into it first and give you the price afterwards."
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
//#endregion
//#region src/components/ui/SectionHeader.astro
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
//#endregion
//#region src/lib/emphasis.ts
/**
* Split `Ich plane und *setze um*.` into
* `[{ text: "Ich plane und ", strong: false }, { text: "setze um", strong: true }, …]`.
*
* An unpaired asterisk is not an error and not emphasis: it stays in the
* text exactly as written. Anything else would let one typo in the panel
* swallow the rest of a sentence into a `<strong>`.
*/
function splitEmphasis(text) {
	const segments = [];
	const pattern = /\*([^*]+)\*/g;
	let cursor = 0;
	for (const match of text.matchAll(pattern)) {
		const start = match.index ?? 0;
		if (start > cursor) segments.push({
			text: text.slice(cursor, start),
			strong: false
		});
		segments.push({
			text: match[1],
			strong: true
		});
		cursor = start + match[0].length;
	}
	if (cursor < text.length) segments.push({
		text: text.slice(cursor),
		strong: false
	});
	return segments.length > 0 ? segments : [{
		text,
		strong: false
	}];
}
/** The plain reading of a marked-up string — for `alt`, `title`, JSON-LD. */
function stripEmphasis(text) {
	return splitEmphasis(text).map((segment) => segment.text).join("");
}
//#endregion
//#region src/components/ui/Emphasis.astro
createAstro("https://tracht-digital.de");
var $$Emphasis = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Emphasis;
	const { text } = Astro.props;
	const segments = splitEmphasis(text);
	return renderTemplate`${segments.map((segment) => segment.strong ? renderTemplate`${maybeRenderHead($$result)}<strong class="text-emph">${segment.text}</strong>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${segment.text}` })}`)}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/Emphasis.astro", void 0);
var referencePreviewData_default = {
	generatedAt: "2026-09-28T15:19:25.445Z",
	previews: { "hof-meerheck": {
		"status": "ok",
		"preview": "/references/hof-meerheck.webp",
		"width": 1440,
		"height": 900,
		"capturedAt": "2026-09-28T15:19:25.386Z"
	} }
};
//#endregion
//#region src/lib/referencePreviewMeta.ts
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
//#endregion
//#region src/lib/referencePreviews.ts
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
function isNonEmpty$1(value) {
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
		if (!shot || shot.status !== "ok" || !isNonEmpty$1(shot.preview)) continue;
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
var PROBE_TIMEOUT_MS$1 = 8e3;
var defaultProbe$1 = async (url) => {
	return (await fetch(url, {
		method: "HEAD",
		redirect: "follow",
		signal: AbortSignal.timeout(PROBE_TIMEOUT_MS$1)
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
		const probe = options.probe ?? defaultProbe$1;
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
//#endregion
//#region src/components/ui/FirstCall.astro
createAstro("https://tracht-digital.de");
var $$FirstCall = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FirstCall;
	const { variant = "process" } = Astro.props;
	const lang = resolveLang(Astro.currentLocale);
	const content = await cmsFor("first_call", lang, getHomeContent(lang).firstCall);
	const title = variant === "contact" ? content.nextStepsTitle : content.title;
	const contactHref = `${localizePath("/", lang)}#contact`;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["first-call", `first-call--${variant}`], "class:list")} data-astro-cid-3klv6zur>${variant === "process" && renderTemplate`<div class="first-call__shot" aria-hidden="true" data-astro-cid-3klv6zur><img src="/images/process/step-01.webp" alt="" loading="lazy" decoding="async" data-astro-cid-3klv6zur></div>`}<div class="first-call__body" data-astro-cid-3klv6zur><h3 class="first-call__title" data-astro-cid-3klv6zur>${title}</h3><dl class="first-call__list" data-astro-cid-3klv6zur>${content.items.map((item) => renderTemplate`<div class="first-call__item" data-astro-cid-3klv6zur><dt data-astro-cid-3klv6zur>${item.label}</dt><dd data-astro-cid-3klv6zur>${item.text}</dd></div>`)}</dl>${variant === "process" && renderTemplate`<a${addAttribute(contactHref, "href")} class="first-call__cta" data-astro-cid-3klv6zur>${content.cta}<span aria-hidden="true" data-astro-cid-3klv6zur>→</span></a>`}</div></div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/FirstCall.astro", void 0);
var demoData_default = {
	generatedAt: "2026-10-05T13:56:49.475Z",
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
			"checkedAt": "2026-10-05T13:56:36.970Z"
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
			"checkedAt": "2026-10-05T13:56:37.173Z"
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
			"checkedAt": "2026-10-05T13:56:37.447Z"
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
			"checkedAt": "2026-10-05T13:56:37.536Z"
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
			"checkedAt": "2026-10-05T13:56:37.648Z"
		},
		"shop": {
			"status": "ok",
			"title": "TDShop",
			"description": "Kuratierte Technik für Digitalisierung im Betrieb: Hardware, Netzwerk und Software mit eigener Einschätzung statt Herstellertext.",
			"siteLang": "de",
			"favicon": "/demos/shop-favicon.png",
			"preview": "/demos/shop.webp",
			"previewWidth": 1440,
			"previewHeight": 900,
			"checkedAt": "2026-10-05T13:56:37.861Z"
		}
	}
};
//#endregion
//#region src/lib/demoCatalog.ts
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
*   so; the badge says it before anybody has to read.
* - `own` — a real site of Tracht Digital Solutions itself. The shop is one:
*   it sells for real, so calling it "fictional" would be the opposite lie.
* - `study` — a design study: a picture of a page that was never built and is
*   not hosted anywhere (`designStudies.ts`). It shares this shelf because it
*   is the same kind of evidence, and "eigenständig erstellt" is the phrase
*   the captures themselves carry as a watermark.
*
* Closed, like `DEMO_KINDS`, and for the same reason. No label may ever name a
* client — not even to deny one, which is why the study says what it IS rather
* than what it is not. Customer cases are `references.ts`, a different catalog
* with its own consent rules.
*/
var DEMO_ORIGINS = {
	demo: {
		de: "Demo · fiktives Beispiel",
		en: "Demo · fictional example"
	},
	own: {
		de: "Eigenes Projekt",
		en: "Own project"
	},
	study: {
		de: "Designstudie · eigenständig erstellt",
		en: "Design study · self-initiated"
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
//#endregion
//#region src/lib/demos.ts
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
function isNonEmpty(value) {
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
		if (!isNonEmpty(entry.title) || !isNonEmpty(entry.preview)) continue;
		resolved.push({
			definition,
			title: entry.title.trim(),
			description: isNonEmpty(entry.description) ? entry.description.trim() : null,
			siteLang: isNonEmpty(entry.siteLang) ? entry.siteLang : null,
			favicon: isNonEmpty(entry.favicon) ? entry.favicon : null,
			preview: entry.preview,
			previewWidth: entry.previewWidth ?? DEMO_PREVIEW.width,
			previewHeight: entry.previewHeight ?? DEMO_PREVIEW.height
		});
	}
	return resolved;
}
/** How long one demo gets to answer before it counts as down. */
var PROBE_TIMEOUT_MS = 3e3;
/**
* Is the demo answering right now, over a certificate a browser accepts?
*
* `HEAD` rather than `GET`: this asks whether the visitor's click will land,
* not what it will land on — the snapshot already answered that. TLS
* verification stays on, so an expired or self-signed certificate rejects the
* request and the demo drops out. That is the intended behaviour, not a
* limitation: a link a browser greets with a full-page warning is not a link.
*/
var defaultProbe = async (demo) => {
	return (await fetch(demo.definition.url, {
		method: "HEAD",
		redirect: "follow",
		signal: AbortSignal.timeout(PROBE_TIMEOUT_MS)
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
async function filterReachable(demos, probe = defaultProbe) {
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
		"PUBLIC_DEMO_MODE": "true",
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
//#endregion
//#region src/components/ui/DemoCard.astro
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
	return renderTemplate`${maybeRenderHead($$result)}<article class="demo-card-slot" data-reveal data-astro-cid-ug7wgawq><div class="demo-card" data-astro-cid-ug7wgawq><div class="demo-card__shot" data-astro-cid-ug7wgawq><img${addAttribute(mediaSrc(preview), "src")}${addAttribute(srcsetFor(preview, PREVIEW_VARIANT_WIDTHS, previewWidth, mediaSrc), "srcset")} sizes="(min-width: 64rem) 34vw, (min-width: 48rem) 48vw, 85vw"${addAttribute(previewAlt, "alt")}${addAttribute(previewWidth, "width")}${addAttribute(previewHeight, "height")} loading="lazy" decoding="async" data-astro-cid-ug7wgawq><span class="demo-card__origin" data-astro-cid-ug7wgawq>${origin}</span><button type="button" class="demo-card__zoom" hidden data-preview-open${addAttribute(mediaSrc(preview), "data-preview-src")}${addAttribute(previewAlt, "data-preview-alt")}${addAttribute(title, "data-preview-title")}${addAttribute(definition.host, "data-preview-host")}${addAttribute(definition.url, "data-preview-href")} data-astro-cid-ug7wgawq><span class="sr-only" data-astro-cid-ug7wgawq>${ui.zoom}</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-ug7wgawq><circle cx="11" cy="11" r="7" data-astro-cid-ug7wgawq></circle><line x1="16.5" y1="16.5" x2="21" y2="21" data-astro-cid-ug7wgawq></line><line x1="11" y1="8" x2="11" y2="14" data-astro-cid-ug7wgawq></line><line x1="8" y1="11" x2="14" y2="11" data-astro-cid-ug7wgawq></line></svg></button></div><div class="demo-card__body" data-astro-cid-ug7wgawq><p class="demo-card__kind" data-astro-cid-ug7wgawq>${kind}</p><div class="demo-card__head" data-astro-cid-ug7wgawq>${favicon && renderTemplate`<img class="demo-card__favicon"${addAttribute(mediaSrc(favicon), "src")} alt="" aria-hidden="true" width="20" height="20" loading="lazy" decoding="async" data-astro-cid-ug7wgawq>`}<h3 class="demo-card__title" data-astro-cid-ug7wgawq>${title}</h3></div>${description && renderTemplate`<p class="demo-card__text" data-astro-cid-ug7wgawq>${description}</p>`}<p class="demo-card__host" data-astro-cid-ug7wgawq><span class="sr-only" data-astro-cid-ug7wgawq>${ui.hostLabel}: </span>${definition.host}</p></div>${renderComponent($$result, "CardActions", $$CardActions, {
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
//#endregion
//#region src/components/ui/BusinessCardTile.astro
createAstro("https://tracht-digital.de");
var $$BusinessCardTile = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BusinessCardTile;
	const { serviceLink = null } = Astro.props;
	const lang = resolveLang(Astro.currentLocale);
	const copy = businessCardCopy[lang];
	const href = businessCardHref(lang);
	return renderTemplate`${maybeRenderHead($$result)}<article class="bc-tile-slot" data-reveal data-astro-cid-foobldl3><div class="bc-tile" data-astro-cid-foobldl3><div class="bc-tile__shot" data-astro-cid-foobldl3><img${addAttribute(mediaSrc(BUSINESS_CARD_PREVIEW), "src")}${addAttribute(copy.previewAlt, "alt")}${addAttribute(DEMO_PREVIEW.width, "width")}${addAttribute(DEMO_PREVIEW.height, "height")} loading="lazy" decoding="async" data-astro-cid-foobldl3></div><div class="bc-tile__body" data-astro-cid-foobldl3><p class="bc-tile__eyebrow" data-astro-cid-foobldl3>${copy.eyebrow}</p><h3 class="bc-tile__title" data-astro-cid-foobldl3>${copy.title}</h3><p class="bc-tile__text" data-astro-cid-foobldl3>${copy.text}</p></div>${renderComponent($$result, "CardActions", $$CardActions, {
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
//#endregion
export { DEMO_ORIGINS as a, getReferencePreviewsBySiteUrl as c, $$SectionHeader as d, demosCopy as f, DEMO_KINDS as i, $$Emphasis as l, $$DemoCard as n, $$FirstCall as o, getHomeContent as p, getDemos as r, getReferencePreviews as s, $$BusinessCardTile as t, stripEmphasis as u };
