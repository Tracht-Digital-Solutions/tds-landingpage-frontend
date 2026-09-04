import { A as renderTemplate, B as createAstro, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { u as cmsFor } from "./services_rIITeUoa.mjs";
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
//#endregion
//#region src/components/ui/AccentLetters.astro
createAstro("https://tracht-digital.de");
var $$AccentLetters = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AccentLetters;
	const { text, tone = "light", class: className = "" } = Astro.props;
	const chars = Array.from(text);
	return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(text, "aria-label")}${addAttribute(["accent-letters", className], "class:list")}${addAttribute(tone, "data-tone")}>${chars.map((char) => renderTemplate`<span aria-hidden="true" class="accent-letter">${char === " " ? "\xA0" : char}</span>`)}</span>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/AccentLetters.astro", void 0);
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
//#endregion
//#region src/lib/pricing.ts
var defaults = {
	de: {
		label: "— Preise",
		headline: "Preise ohne",
		headlineAccent: "Überraschungen.",
		sub: "Sie sehen, was welche Leistung kostet. Steht der Umfang vorher fest, geht es auch zum *Festpreis*.",
		teaserHeadline: "Planbare Sätze,",
		teaserHeadlineAccent: "passende Modelle.",
		teaserSub: "Ab 65 € netto pro Stunde. Steht der Umfang vorher fest, rechne ich auch zum Festpreis ab.",
		teaserCta: "Preise ansehen",
		teaserFromLabel: "ab",
		hourSuffix: "/ Stunde",
		includesLabel: "Enthalten:",
		rateConsulting: 90,
		rateProcess: 80,
		rateSolutions: 80,
		rateWebPresence: 65,
		notesTitle: "Gut zu wissen",
		notes: [
			"Alle Preise sind netto, zuzüglich Mehrwertsteuer.",
			"Festpreis, wenn Ziel und Umfang vorher klar sind.",
			"Für laufende Betreuung gibt es Monatsmodelle.",
			"Bei Anzeigen kommt Ihr Mediabudget dazu; es geht direkt an Google."
		],
		ctaTitle: "Welcher Rahmen passt zu Ihnen?",
		ctaSub: "Im Erstgespräch ordnen wir Ihr Vorhaben ein. Danach wissen Sie, welches Modell passt.",
		ctaButton: "Erstgespräch vereinbaren",
		back: "Zurück zur Startseite"
	},
	en: {
		label: "— Pricing",
		headline: "Pricing without",
		headlineAccent: "surprises.",
		sub: "You can see what each service costs. When the scope is settled up front, a *fixed price* works too.",
		teaserHeadline: "Predictable rates,",
		teaserHeadlineAccent: "models that fit.",
		teaserSub: "From €65 net per hour. When the scope is settled up front, I work to a fixed price too.",
		teaserCta: "View pricing",
		teaserFromLabel: "from",
		hourSuffix: "/ hour",
		includesLabel: "Included:",
		rateConsulting: 90,
		rateProcess: 80,
		rateSolutions: 80,
		rateWebPresence: 65,
		notesTitle: "Good to know",
		notes: [
			"All prices are net and exclude VAT.",
			"A fixed price works when the goal and scope are clear up front.",
			"Monthly arrangements are available for ongoing support.",
			"Where ads are involved your media budget is extra; it goes to Google directly."
		],
		ctaTitle: "Which setup fits you?",
		ctaSub: "In the first conversation we place your project. After that you know which model fits.",
		ctaButton: "Arrange an initial consultation",
		back: "Back to the homepage"
	}
};
function getPricingDefault(lang) {
	return defaults[lang];
}
async function getPricingContent(lang) {
	return cmsFor("pricing_services", lang, getPricingDefault(lang));
}
/**
* The hourly rate for a service.
*
* Total, not partial. Complete IT used to be absent from this map on purpose —
* that omission WAS the "no invented price" rule, and every caller carried an
* `undefined` branch for it. With that service gone the branch was dead code
* that still forced a null check at three call sites, so the map is now
* exhaustive and the return type says so. A new rate-less service would fail
* to compile here, which is the right place to notice it.
*/
function getServiceRate(pricing, serviceId) {
	return {
		consulting: pricing.rateConsulting,
		process: pricing.rateProcess,
		solutions: pricing.rateSolutions,
		"web-presence": pricing.rateWebPresence
	}[serviceId];
}
//#endregion
export { splitEmphasis as a, $$AccentLetters as i, getServiceRate as n, $$Emphasis as r, getPricingContent as t };
