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
import type { PlatformId } from "./platforms";
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
  /**
   * Whether a screenshot of {@link ReferenceCase.siteUrl} may be published.
   *
   * Separate from `disclosure` and, like it, deliberately without a default.
   * Naming a customer and linking their site is one permission; reproducing
   * the site as a picture on our own page is another, and inferring the second
   * from the first would decide it for them. `false` is always safe: the card
   * simply renders without a band.
   *
   * Only ever true together with `disclosure: "named"` and a `siteUrl`, which
   * `references.test.ts` enforces.
   */
  previewAllowed: boolean;
  /**
   * The shop system or CMS pages (`lib/platforms.ts`) that show this case.
   *
   * Only ever set on a `named` case, and `referencesForPlatform` enforces that
   * too: putting an ANONYMOUS case on the page of the system it ran on names
   * the system, and the system plus the story is enough to identify the client.
   * `references.test.ts` holds both.
   */
  platforms?: readonly PlatformId[];
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
    disclosure: "anonymous",
    siteUrl: null,
    previewAllowed: false,
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
    // The customer was asked about the screenshot itself and approved it. It
    // was a second question on purpose: being named and linked is one
    // permission, having your site reproduced as a picture on someone else's
    // page is another, and inferring the second from the first would have
    // decided it for them. Withdrawing it is one boolean — set this back to
    // `false` and the picture stops rendering immediately, before
    // `npm run references:sync` has even deleted the asset.
    previewAllowed: true,
    // The site runs on WordPress (visible in its own markup), and the work
    // described below is exactly what the WordPress page offers.
    platforms: ["wordpress"],
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
    .map((entry) => resolveCase(entry, lang));
}

/**
 * The cases shown on one platform page — named cases only.
 *
 * The `disclosure` check is not redundant with the test: it is the rule itself,
 * applied where the page asks, so a future anonymous case that is given a
 * `platforms` list by mistake still cannot appear (see
 * `ReferenceCase.platforms`).
 */
export function referencesForPlatform(platform: PlatformId, lang: Lang): ServiceReference[] {
  return referenceCases
    .filter((entry) => entry.disclosure === "named" && entry.platforms?.includes(platform))
    .map((entry) => resolveCase(entry, lang));
}

function resolveCase(entry: ReferenceCase, lang: Lang): ServiceReference {
  return {
    ...entry.content[lang],
    ...(entry.articleSlug ? { articleUrl: articleUrl(entry.articleSlug, lang) } : {}),
    // Language-invariant, unlike the article link: a customer site has no
    // localized twin to point at.
    ...(entry.siteUrl ? { siteUrl: entry.siteUrl } : {}),
  };
}
