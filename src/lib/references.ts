/**
 * The published reference cases — code-owned, like `demoCatalog.ts`.
 *
 * ### Why these live in code and not in the CMS
 *
 * A reference card links to two places: the service it belongs to and the
 * article in the journal that goes with it. `AGENTS.md` is explicit that a
 * service block must never carry an editable id, slug or URL, and the reason
 * is the same one behind `demoCatalog.ts` — a content editor must not be able
 * to decide where this site sends a visitor. So the link half is committed
 * here, and the CMS keeps what it should keep: the words.
 *
 * A case also appears in four places (three service pages and the home page).
 * One definition with a list of service ids is the only way those four stay in
 * agreement.
 *
 * ### The rule about what a card may say
 *
 * References are **anonymised**. No customer name, no link to the customer's
 * own site, and nothing in the text that identifies them by elimination. That
 * is a standing instruction, not a default — it survived the decision to
 * publish this case at all.
 *
 * Everything below is reported, never inferred: the numbers and the sequence
 * come from the work itself. `metric` in particular is a countable fact, not
 * a percentage anybody would have to take on trust.
 */

import type { Lang } from "./i18n";
import { siteConfig } from "./seo";
import type { ServiceId, ServiceReference } from "./services";

export interface ReferenceCase {
  /** Stable, code-owned identity. Never sourced from the CMS. */
  id: string;
  /**
   * Every service whose detail page shows this case, in catalog order.
   * The first is the primary one — the home page card links there.
   */
  services: readonly ServiceId[];
  /** Slug of the journal article this case links to, or null for none. */
  articleSlug: string | null;
  content: Record<Lang, ServiceReference>;
}

/** Absolute URL of a journal article in one language. */
export function articleUrl(slug: string, lang: Lang): string {
  return lang === "de"
    ? `${siteConfig.blogUrl}/${slug}`
    : `${siteConfig.blogUrl}/en/${slug}`;
}

export const referenceCases: readonly ReferenceCase[] = [
  {
    id: "product-data-pipeline",
    services: ["web-presence", "process", "solutions"],
    articleSlug: "vom-baukasten-shop-zum-eigenen-shop",
    content: {
      de: {
        title: "Produktdaten, die sich selbst pflegen",
        context: "Onlinehandel mit großem, wachsendem Sortiment",
        challenge:
          "Daten aus vielen Quellen und Formaten, Regeln, die sich häufig ändern, und mehrere Zielsysteme mit eigenen Anforderungen: Von Hand ließ sich das Sortiment nicht mehr zuverlässig pflegen.",
        solution:
          "Eine modulare Datenpipeline führt die Daten zusammen, prüft sie auf Plausibilität und Dubletten und hält Fehler in nachvollziehbaren Listen fest. Jedes Zielsystem erhält aus demselben Datenstand seine eigene, regelbasierte Ausgabe; die Regeln sind konfigurierbar statt fest programmiert.",
        result:
          "Ein kompletter Durchlauf dauert rund 10 bis 20 Minuten. Das Sortiment ist während der mehrjährigen Betreuung um ein Vielfaches gewachsen, ohne dass die Pipeline neu gebaut werden musste.",
        metric: "",
      },
      en: {
        title: "Product data that maintains itself",
        context: "Online retail with a large, growing catalogue",
        challenge:
          "Data from many sources and formats, rules that change often and several target systems with their own requirements: the catalogue could no longer be maintained reliably by hand.",
        solution:
          "A modular data pipeline merges the data, checks it for plausibility and duplicates and records errors in traceable lists. Each target system receives its own rule-based output from the same data set; the rules are configurable rather than hard-coded.",
        result:
          "A full run takes around 10 to 20 minutes. The catalogue grew several times over during years of support without the pipeline having to be rebuilt.",
        metric: "",
      },
    },
  },
];

/**
 * The cases shown on one service's detail page, with their links resolved.
 *
 * Returns a fresh array every call: the result is merged with CMS values by
 * `resolveServiceContent`, and handing out a shared object would let one
 * request's override leak into the next.
 */
export function referencesForService(
  service: ServiceId,
  lang: Lang,
): ServiceReference[] {
  return referenceCases
    .filter((entry) => entry.services.includes(service))
    .map((entry) => ({
      ...entry.content[lang],
      ...(entry.articleSlug
        ? { articleUrl: articleUrl(entry.articleSlug, lang) }
        : {}),
    }));
}
