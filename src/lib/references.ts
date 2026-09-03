/**
 * The published reference cases — code-owned, like `demoCatalog.ts`.
 *
 * ### Why these live in code and not in the CMS
 *
 * A reference card links to up to three places: the service it belongs to, the
 * article in the journal that goes with it, and — on a named case — the
 * customer's own site. `AGENTS.md` is explicit that a service block must never
 * carry an editable id, slug or URL, and the reason is the same one behind
 * `demoCatalog.ts` — a content editor must not be able to decide where this
 * site sends a visitor. So every destination is committed here, and the CMS
 * keeps what it should keep: the words.
 *
 * A case also appears in several places (one card per service it names, plus
 * the home page). One definition with a list of service ids is the only way
 * those stay in agreement.
 *
 * ### The rule about what a card may say
 *
 * A case is **anonymised by default**: no customer name, no link to their own
 * site, and nothing in the text that identifies them by elimination. Naming a
 * customer is a decision a person makes once, per case, with that customer's
 * approval — never something an edit here may drift into.
 *
 * `disclosure` records that decision explicitly rather than leaving it to be
 * inferred from the presence of a link. The two must agree, and
 * `references.test.ts` checks both directions: an anonymous case may not carry
 * a `siteUrl`, and a case that carries one must be marked `named`. The site's
 * own promise to its customers is checked against this too — while a named
 * case is published, no surface may still claim that references appear
 * "ausschließlich anonymisiert".
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
  /**
   * Whether this case may name its customer. Anonymous is the rule; `named`
   * means that customer approved being named and linked.
   *
   * Deliberately has no default: adding a case forces the decision into the
   * open instead of letting it follow from whether somebody filled in a URL.
   */
  disclosure: "anonymous" | "named";
  /**
   * The customer's own site, or `null`. Code-owned and never CMS-reachable,
   * exactly like {@link ServiceReference.articleUrl}.
   *
   * It sits on the case rather than inside `content`, and NOT only because the
   * address is the same in both languages. Unlike `articleUrl` a customer site
   * has no localized twin to point at, and the anonymisation test joins
   * `Object.values(content[lang])` to forbid any URL in the prose — a `siteUrl`
   * living in there would trip this repo's own guard, correctly.
   */
  siteUrl: string | null;
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
    id: "office-supplies-shop",
    services: ["web-presence", "process", "solutions"],
    articleSlug: "vom-baukasten-shop-zum-eigenen-shop",
    disclosure: "anonymous",
    siteUrl: null,
    content: {
      de: {
        title: "Vom Baukasten-Shop zum eigenen Shop",
        context: "Onlinehandel für Bürobedarf und Druckerzubehör",
        challenge:
          "Der gehostete Baukasten-Shop kam mit dem wachsenden Sortiment nicht mehr mit: Preise ließen sich nur einzeln pflegen, Importe mussten in ein festes Formular passen, und für eigene Abläufe war kein Platz.",
        solution:
          "Aufbau eines eigenen Shops und Umzug des kompletten Sortiments samt Bereinigung der Artikeldaten. Seither läuft die laufende Pflege über mich: Auswertung des Bestands, Filterung nach Marke, Serie und Marge sowie nachvollziehbare Preisläufe — für den Shop und für weitere Vertriebskanäle.",
        result:
          "Sortiment und Preise bleiben über alle Kanäle hinweg aktuell. Preisänderungen laufen als ein Vorgang statt als Reihe von Einzeleingaben, und neue Anforderungen lassen sich ohne Anbieterwechsel umsetzen.",
        metric: "über 20.000 gepflegte Artikel",
      },
      en: {
        title: "From a hosted shop builder to a shop of their own",
        context: "Online retail for office supplies and printer consumables",
        challenge:
          "The hosted shop builder stopped keeping up with the growing catalogue: prices could only be edited one at a time, imports had to fit a fixed form, and there was no room for the company's own routines.",
        solution:
          "Building a shop of their own and moving the entire catalogue across, cleaning up the product data on the way. The ongoing upkeep has run through me since: analysing the catalogue, filtering by brand, series and margin, and traceable price runs — for the shop and for further sales channels.",
        result:
          "Catalogue and prices stay current across every channel. A price change is one run rather than a series of individual edits, and new requirements can be built without changing provider.",
        metric: "more than 20,000 articles maintained",
      },
    },
  },
  {
    // The first case published under a customer's own name, with that
    // customer's approval. No journal article exists for it, so the card
    // carries the service link and the site link and nothing else.
    id: "hof-meerheck",
    services: ["web-presence"],
    articleSlug: null,
    disclosure: "named",
    // The canonical origin. `www.` answers with a 301 to exactly this, and
    // linking at a redirect spends a round trip on every visitor who clicks.
    siteUrl: "https://hof-meerheck.de/",
    content: {
      de: {
        title: "Eine bestehende Webseite, wieder auf dem Stand",
        context: "Schäferei mit eigener Direktvermarktung",
        challenge:
          "Die Webseite war über die Jahre stehen geblieben: ein veralteter Stand, Fehler im Detail, auf dem Telefon umständlich zu bedienen und für die Suche nicht aufgestellt.",
        solution:
          "Übernahme der bestehenden Seite und Überarbeitung: aktueller Stand, ausgebessertes Design, behobene Fehler, eine Darstellung, die auf dem Telefon funktioniert, und die Grundlagen für die Auffindbarkeit. Seither läuft die Wartung über mich — zusammen mit den E-Mail-Postfächern.",
        result:
          "Die Seite bleibt aktuell, ohne dass der Betrieb sich darum kümmern muss. Bei technischen Fragen gibt es einen Ansprechpartner statt einer Suche nach Zuständigkeiten.",
        metric: "",
      },
      en: {
        title: "An existing website, brought back up to date",
        context: "Sheep farm selling directly to its customers",
        challenge:
          "The website had stood still over the years: out of date, faults in the detail, awkward to use on a phone and not set up to be found.",
        solution:
          "Taking the existing site over and reworking it: current again, the design repaired, the faults fixed, a layout that works on a phone, and the groundwork for being found. The upkeep has run through me since — along with the email accounts.",
        result:
          "The site stays current without the business having to attend to it. For technical questions there is one point of contact instead of a hunt for who is responsible.",
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
      // Language-invariant, unlike the article link: a customer site has no
      // localized twin to point at.
      ...(entry.siteUrl ? { siteUrl: entry.siteUrl } : {}),
    }));
}
