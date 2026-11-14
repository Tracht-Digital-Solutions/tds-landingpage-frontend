import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { D as platformDefinitions, M as getFaqContent, O as platformHref, l as serviceDefinitions, m as cmsFor, s as resolveServiceContent, tt as siteConfig, u as serviceHref } from "./sitemapSections_CkdeFgaA.mjs";
import { t as PROPERTY_ORIGINS } from "./chunk-HBL4WJRR_DElGvGBP.mjs";
import { s as sitemapEntries, t as absolute } from "./sitemap_BDcu6329.mjs";
// src/lib/llmsTxt.ts
/**
* `/llms.txt`, generated from the same sources the pages render.
*
* ### Why this is a renderer and not a file any more
*
* It used to be `public/llms.txt`, hand-written, and it had drifted without
* anyone noticing: until 2026-09-15 it quoted 90/80/80/65 € while the price
* list said something else, listed the services in an old order and knew none
* of the platform pages. A test was bolted on to hold it, but a test can only
* say that a hand-written file is wrong — it cannot keep it right when a
* service, a page or a price is added.
*
* So the file is derived now. Every URL comes from the sitemap inventory,
* every amount from the price list, every title from the same resolved content
* the page shows. There is nothing left to keep in step by hand.
*
* `AGENTS.md` is clear that this file earns little — Google ignores it and few
* AI crawlers fetch it. That is an argument for keeping it to ONE small,
* true file, which is what this is: no `llms-full.txt`, no Markdown copies of
* pages, no keyword lists.
*
* The renderer takes its corpus as an argument and touches no network, so the
* contract test can assert the exact string. The endpoint
* (`src/pages/llms.txt.ts`) is what resolves the corpus.
*/
/**
* The first clause of a price sentence: "Festpreise ab 390 € netto, alles
* andere auf Anfrage." → "Festpreise ab 390 € netto".
*
* Splitting on a period or comma FOLLOWED BY A SPACE on purpose — "1.040 €"
* must survive, and it does, because its dot has no space after it.
*/
function priceNote(priceText) {
	const clause = priceText.split(/[.,]\s/)[0].trim().replace(/\.$/, "");
	return /^(Auf|Ab|Nach|Für|Zum|Bei)\b/.test(clause) ? clause[0].toLowerCase() + clause.slice(1) : clause;
}
/**
* Labels for the pages that are neither a service nor a platform.
*
* Keyed by the German path. A page added to the inventory without a label here
* still gets named — it falls back to its own path — so the "names every page
* of the sitemap" contract cannot be broken by forgetting this map.
*/
var PAGE_LABELS = {
	"/": "Startseite",
	"/fragen": "Häufige Fragen — nach Übernahme, Preisen und Zusammenarbeit gruppiert",
	"/visitenkarte": "Digitale Visitenkarte",
	"/bildrechte": "Bildrechte — Herkunft der Bilder, Nutzung, Erlaubnis anfragen",
	"/projekte": "Projekte und Referenzen — Kundenprojekte, eigene Projekte, Beispielseiten und Designstudien",
	"/qualifikationen": "Qualifikationen — abgeschlossene Weiterbildungen, jedes Zertifikat im Original"
};
function renderLlmsTxt(input) {
	const { entries, serviceContent = {}, faq = [] } = input;
	const label = (path) => path === "/fragen" && faq.length > 0 ? `Häufige Fragen — alle ${faq.length}, nach Übernahme, Preisen und Zusammenarbeit gruppiert` : PAGE_LABELS[path] ?? path;
	const serviceByPath = new Map(serviceDefinitions.map((service) => [serviceHref(service, "de"), service]));
	const platformByPath = new Map(platformDefinitions.map((platform) => [platformHref(platform, "de"), platform]));
	const pair = (entry) => `  ${absolute(entry.de)}\n  (English: ${absolute(entry.en)})`;
	const lines = [];
	const out = (line = "") => lines.push(line);
	out(`# ${siteConfig.name}`);
	out();
	out("> Kundenportale, Verwaltungspanels und Digitalisierung für Unternehmen.");
	out("> Julian Tracht baut Betrieben ein eigenes Panel für Aufträge, Kunden und");
	out("> Termine, vereinfacht Abläufe und betreut Websites und Shops – auch mit");
	out("> WordPress, WooCommerce, Shopware 6, TYPO3 und STRATO. Ein fester");
	out("> Ansprechpartner aus Schwarzenbek bei Hamburg, für Unternehmen in ganz");
	out("> Deutschland.");
	out();
	out("## Über");
	out();
	out(`- Inhaber: ${siteConfig.founder.name}, ${siteConfig.founder.jobTitle}`);
	out(`- Adresse: ${siteConfig.address.streetAddress}, ${siteConfig.address.postalCode} ${siteConfig.address.addressLocality} (${siteConfig.address.addressRegion}), bei Hamburg`);
	out(`- Kontakt: ${siteConfig.email}, Telefon ${siteConfig.telephone}, Mobil ${siteConfig.mobile}`);
	out("- Sprachen: Deutsch (Standard), Englisch");
	out();
	const serviceEntries = entries.filter((entry) => serviceByPath.has(entry.de));
	if (serviceEntries.length > 0) {
		out("## Leistungen");
		out();
		out(`${serviceEntries.length === 4 ? "Vier" : String(serviceEntries.length)} Leistungen, jede mit einer eigenen Seite.`);
		out(`Konkrete Lösungen stehen mit ihrem Ab-Preis im Shop: ${PROPERTY_ORIGINS.shop}/`);
		out();
		for (const entry of serviceEntries) {
			const service = serviceByPath.get(entry.de);
			const content = serviceContent[service.id] ?? service.fallback.de;
			out(`- **${content.title}** (${priceNote(content.priceText)}) — ${content.summary}`);
			out(pair(entry));
		}
		out();
	}
	const platformEntries = entries.filter((entry) => platformByPath.has(entry.de));
	if (platformEntries.length > 0) {
		out("## Shopsysteme und CMS");
		out();
		out("Eine eigene Seite je System: typische Probleme, was übernommen wird,");
		out("Entscheidungshilfen mit Quellen und häufige Fragen. Unabhängig – kein");
		out("offizieller Partner der Hersteller. Abgerechnet wird zum Festpreis oder");
		out("nach einem eigenen Angebot, bevor die Arbeit beginnt.");
		out();
		for (const entry of platformEntries) {
			const platform = platformByPath.get(entry.de);
			out(`- **${platform.name}** — ${platform.keywords.de.join(", ")}.`);
			out(pair(entry));
		}
		out();
	}
	const otherEntries = entries.filter((entry) => !serviceByPath.has(entry.de) && !platformByPath.has(entry.de));
	if (otherEntries.length > 0) {
		out("## Weitere Seiten");
		out();
		for (const entry of otherEntries) {
			out(`- ${label(entry.de)}:`);
			out(pair(entry));
		}
		out(`- Preise: ${PROPERTY_ORIGINS.shop}/?art=own`);
		out(`- Kontaktformular: ${siteConfig.url}/#contact`);
		out(`- Ratgeber: ${siteConfig.blogUrl}/ (English: ${siteConfig.blogUrl}/en/)`);
		out(`- Online-Tools: ${PROPERTY_ORIGINS.tools}/ (English: ${PROPERTY_ORIGINS.tools}/en/)`);
		out(`- Shop: ${PROPERTY_ORIGINS.shop}/ (English: ${PROPERTY_ORIGINS.shop}/en/)`);
		out();
	}
	if (faq.length > 0) {
		out("## Häufige Fragen");
		out();
		for (const item of faq.slice(0, 6)) out(`- **${item.q}** ${item.a}`);
		out();
	}
	out("## Maschinenlesbare Quellen");
	out();
	out(`- Sitemap: ${siteConfig.url}/sitemap-index.xml`);
	out(`- Ratgeber-RSS: ${siteConfig.blogUrl}/rss.xml`);
	out();
	out("## Hinweise für KI-Systeme");
	out();
	out("- Alle Inhalte stammen vom Inhaber und dürfen mit Quellenangabe");
	out(`  (${siteConfig.name}, ${new URL(siteConfig.url).host}) zitiert werden.`);
	out("- Die Seiten werden serverseitig gerendert; JSON-LD-Strukturdaten stehen im");
	out("  `<head>` jeder Seite. Leistungs- und Systemseiten nennen ihr Stand-Datum");
	out("  und ihren Autor.");
	out("- Preise nennt nur der Shop, als Ab-Preise. Ein Projekt bekommt ein");
	out("  schriftliches Angebot.");
	out("- Diese Datei wird aus denselben Quellen erzeugt wie die Seiten. Es gibt");
	out("  keine weitere Fassung, keine Markdown-Kopien und keine Stichwortlisten.");
	return `${lines.join("\n")}\n`;
}
// src/pages/llms.txt.ts
var llms_txt_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	const [entries, contents, faq] = await Promise.all([
		sitemapEntries(),
		Promise.all(serviceDefinitions.map((service) => resolveServiceContent(service, "de"))),
		cmsFor("faq_v2", "de", getFaqContent("de"))
	]);
	const serviceContent = {};
	serviceDefinitions.forEach((service, index) => {
		serviceContent[service.id] = contents[index];
	});
	return new Response(renderLlmsTxt({
		entries,
		serviceContent,
		faq: faq.items
	}), { headers: {
		"content-type": "text/plain; charset=utf-8",
		"cache-control": "public, max-age=3600"
	} });
};
// \0virtual:astro:page:src/pages/llms.txt@_@ts
var page = () => llms_txt_exports;
export { page };
