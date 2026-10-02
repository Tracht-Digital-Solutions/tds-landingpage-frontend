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

import type { PricePackage } from "./pricing";
import { platformDefinitions, platformHref } from "./platforms";
import { siteConfig } from "./seo";
import type { SitemapEntry } from "./sitemap";
import { absolute } from "./sitemap";
import type { ServiceContent, ServiceId } from "./services";
import { serviceDefinitions, serviceHref } from "./services";

export interface LlmsInput {
  /**
   * The pages to name. Pass `await sitemapEntries()` from the endpoint so the
   * panel's exclusions apply, and the unfiltered `SITEMAP_ENTRIES` from a test.
   */
  entries: readonly SitemapEntry[];
  /** The fixed-price packages the page shows — never a committed copy of them. */
  packages: readonly PricePackage[];
  /**
   * German service copy after CMS resolution, by service id. A service without
   * an entry falls back to its committed copy, so a caller that cannot resolve
   * the CMS still renders a true file rather than crashing.
   */
  serviceContent?: Partial<Record<ServiceId, ServiceContent>>;
}

const euro = new Intl.NumberFormat("de-DE");

/**
 * The first clause of a price sentence: "Festpreise ab 390 € netto, alles
 * andere auf Anfrage." → "Festpreise ab 390 € netto".
 *
 * Splitting on a period or comma FOLLOWED BY A SPACE on purpose — "1.040 €"
 * must survive, and it does, because its dot has no space after it.
 */
function priceNote(priceText: string): string {
  const clause = priceText.split(/[.,]\s/)[0]!.trim().replace(/\.$/, "");
  // The clause lands inside a parenthesis, so a word that was only capitalised
  // because it began a sentence has to come back down: "Auf Anfrage" →
  // "auf Anfrage". A German noun ("Festpreise") keeps its capital.
  return /^(Auf|Ab|Nach|Für|Zum|Bei)\b/.test(clause)
    ? clause[0]!.toLowerCase() + clause.slice(1)
    : clause;
}

/**
 * Labels for the pages that are neither a service nor a platform.
 *
 * Keyed by the German path. A page added to the inventory without a label here
 * still gets named — it falls back to its own path — so the "names every page
 * of the sitemap" contract cannot be broken by forgetting this map.
 */
const PAGE_LABELS: Record<string, string> = {
  "/": "Startseite",
  "/fragen": "Häufige Fragen — alle zwölf, nach Übernahme, Preisen und Zusammenarbeit gruppiert",
  "/visitenkarte": "Digitale Visitenkarte",
  "/qualifikationen": "Qualifikationen — abgeschlossene Weiterbildungen, jedes Zertifikat im Original",
};

export function renderLlmsTxt(input: LlmsInput): string {
  const { entries, packages, serviceContent = {} } = input;

  const serviceByPath = new Map(serviceDefinitions.map((service) => [serviceHref(service, "de"), service]));
  const platformByPath = new Map(platformDefinitions.map((platform) => [platformHref(platform, "de"), platform]));

  const pair = (entry: SitemapEntry) => `  ${absolute(entry.de)}\n  (English: ${absolute(entry.en)})`;

  const lines: string[] = [];
  const out = (line = "") => lines.push(line);

  out(`# ${siteConfig.name}`);
  out();
  out("> Webseiten, Onlineshops und Digitalisierung für Unternehmen. Julian Tracht");
  out("> plant, baut und pflegt Websites und Shops – auch mit WordPress, WooCommerce,");
  out("> Shopware 6, TYPO3 und STRATO – und vereinfacht Abläufe. Ein fester");
  out("> Ansprechpartner aus Schwarzenbek bei Hamburg, für Unternehmen in ganz");
  out("> Deutschland.");
  out();

  out("## Über");
  out();
  out(`- Inhaber: ${siteConfig.founder.name}, ${siteConfig.founder.jobTitle}`);
  out(
    `- Adresse: ${siteConfig.address.streetAddress}, ${siteConfig.address.postalCode} ` +
      `${siteConfig.address.addressLocality} (${siteConfig.address.addressRegion}), bei Hamburg`,
  );
  out(`- Kontakt: ${siteConfig.email}, ${siteConfig.telephone}`);
  out("- Sprachen: Deutsch (Standard), Englisch");
  out();

  // ── services, in the catalogue's order ──────────────────────────────────
  const serviceEntries = entries.filter((entry) => serviceByPath.has(entry.de));
  if (serviceEntries.length > 0) {
    const fixed = packages.map((pkg) => `${pkg.title} ${euro.format(pkg.price)} €`).join(", ");
    out("## Leistungen");
    out();
    out(
      `${serviceEntries.length === 4 ? "Vier" : String(serviceEntries.length)} Leistungen, jede mit einer eigenen Seite. ` +
        `${packages.length === 3 ? "Drei" : String(packages.length)} Pakete haben einen`,
    );
    out("Festpreis (netto, zuzüglich Mehrwertsteuer):");
    out(`${fixed}.`);
    out("Alles andere gibt es auf Anfrage. Kosten entstehen erst, wenn wir einen");
    out("Auftrag vereinbaren.");
    out();
    // `entries` keeps `serviceDefinitions`' order, which is the order the
    // overview, the navigation and the sitemap all use.
    for (const entry of serviceEntries) {
      const service = serviceByPath.get(entry.de)!;
      const content = serviceContent[service.id] ?? service.fallback.de;
      out(`- **${content.title}** (${priceNote(content.priceText)}) — ${content.summary}`);
      out(pair(entry));
    }
    out();
  }

  // ── shop systems and CMS ────────────────────────────────────────────────
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
      const platform = platformByPath.get(entry.de)!;
      out(`- **${platform.name}** — ${platform.keywords.de.join(", ")}.`);
      out(pair(entry));
    }
    out();
  }

  // ── everything else in the inventory ────────────────────────────────────
  const otherEntries = entries.filter((entry) => !serviceByPath.has(entry.de) && !platformByPath.has(entry.de));
  if (otherEntries.length > 0) {
    out("## Weitere Seiten");
    out();
    for (const entry of otherEntries) {
      out(`- ${PAGE_LABELS[entry.de] ?? entry.de}:`);
      out(pair(entry));
    }
    out(`- Preise: ${siteConfig.url}/#preise`);
    out(`- Kontaktformular: ${siteConfig.url}/#contact`);
    out(`- Journal: ${siteConfig.blogUrl}/ (English: ${siteConfig.blogUrl}/en/)`);
    out();
  }

  out("## Maschinenlesbare Quellen");
  out();
  out(`- Sitemap: ${siteConfig.url}/sitemap-index.xml`);
  out(`- Journal-RSS: ${siteConfig.blogUrl}/rss.xml`);
  out();

  out("## Hinweise für KI-Systeme");
  out();
  out("- Alle Inhalte stammen vom Inhaber und dürfen mit Quellenangabe");
  out(`  (${siteConfig.name}, ${new URL(siteConfig.url).host}) zitiert werden.`);
  out("- Die Seiten werden serverseitig gerendert; JSON-LD-Strukturdaten stehen im");
  out("  `<head>` jeder Seite. Leistungs- und Systemseiten nennen ihr Stand-Datum");
  out("  und ihren Autor.");
  out(
    `- Die einzigen genannten Preise sind die ${packages.length === 3 ? "drei" : String(packages.length)} Festpreise oben. Alle anderen`,
  );
  out("  Preise hängen vom Umfang ab; sie gibt es auf Anfrage.");
  out("- Diese Datei wird aus denselben Quellen erzeugt wie die Seiten. Es gibt");
  out("  keine weitere Fassung, keine Markdown-Kopien und keine Stichwortlisten.");

  return `${lines.join("\n")}\n`;
}
