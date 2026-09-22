import { cmsFor, fetchBlocks } from "./cms";
import type { Lang } from "./i18n";
// `references.ts` takes only TYPES back from this module (`import type`, so
// erased at build), which is what keeps this pair from becoming a runtime
// cycle of the kind `contentCache.ts` exists to document.
import { referencesForService } from "./references";

export type ServiceId =
  | "consulting"
  | "process"
  | "solutions"
  | "web-presence";

export type ServiceCmsKey =
  | "service_consulting"
  | "service_process"
  | "service_solutions"
  | "service_web_presence";

export interface ServiceReference {
  title: string;
  context: string;
  challenge: string;
  solution: string;
  result: string;
  /** Optional, verifiable metric. An empty string means no metric is shown. */
  metric: string;
  /**
   * Journal article this case links to. **Code-owned and unreachable from the
   * CMS** — `validateServiceReferences` rebuilds each item field by field and
   * never copies this one, so a block that carries an `articleUrl` cannot put
   * a link on the page. Same rule as `ServiceDefinition.slug` and the demo
   * hosts: editable copy, never an editable destination.
   */
  articleUrl?: string;
  /**
   * The customer's own site, on a case published under their name. Same rule
   * and same enforcement as {@link ServiceReference.articleUrl}: the CMS may
   * rewrite the words around it, never supply or change it.
   *
   * Unlike `articleUrl` this does not vary by language — see
   * `ReferenceCase.siteUrl`.
   */
  siteUrl?: string;
}

export interface ServiceContent {
  /** Back-link label for the services overview on the homepage. */
  label: string;
  title: string;
  /** Shared by the homepage card and the detail-page lead. */
  summary: string;
  intro: string;
  situationsTitle: string;
  situations: string[];
  responsibilitiesTitle: string;
  responsibilities: string[];
  outcomesTitle: string;
  outcomes: string[];
  boundariesTitle: string;
  boundaries: string[];
  processTitle: string;
  process: string[];
  priceLabel: string;
  priceText: string;
  referencesLabel: string;
  referencesHeadline: string;
  references: ServiceReference[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
}

export interface ServiceDefinition {
  /** Stable, code-owned identity. Never sourced from the CMS. */
  id: ServiceId;
  /**
   * Stable display ORDER shared by overview, sitemap and navigation.
   *
   * It is never rendered as text. A visitor reaching a service from a card or
   * from search is told "04" about a list they never saw, so the numerals came
   * off the detail hero and the pricing cards; only the sequence survives.
   */
  number: string;
  /** Stable, code-owned CMS block key. */
  cmsKey: ServiceCmsKey;
  /** Stable, localized route segments. Never editable in the CMS. */
  slug: Record<Lang, string>;
  /**
   * The detail page's `<title>`: what a searcher types first, the brand last.
   *
   * Code-owned like `slug` and `keywords`. The H1 stays the service's short
   * name ("Webauftritt"), which is what the rest of the site calls it; the
   * title is where the search words go ("Website & Onlineshop erstellen
   * lassen") — a bare "Webauftritt — Tracht Digital Solutions" matched no
   * query anybody makes.
   */
  seoTitle: Record<Lang, string>;
  /**
   * ISO date of the last change to this service's committed copy. Rendered as
   * "Stand" on the detail page and published as its `dateModified`. Raise it
   * only when the content changes; a panel override does not move it.
   */
  updatedAt: string;
  /**
   * Plain everyday words for the overview card's chips.
   *
   * A visitor scanning the cards wants to know what a service IS — "Websites ·
   * Onlineshops · Google Ads & SEO" — not how it is carried out; the detail
   * page answers that.
   *
   * Code-owned like `number` and `slug`, deliberately: keeping them out of
   * the CMS means the Website-CMS structured schema (another repository)
   * does not have to change in step with this file.
   */
  keywords: Record<Lang, readonly string[]>;
  /**
   * Optional background image for the card and the detail hero, as a path
   * under `/images/services/`.
   *
   * `null` renders no image at all — not a broken `<img>`, not an empty
   * box — so this can ship before the artwork exists.
   */
  image: string | null;
  fallback: Record<Lang, ServiceContent>;
}

/**
 * Single source of truth for service identity, order, routes and local content.
 * The CMS may override every content field, but never ids, slugs, keywords,
 * images or prices used in structured data. References come from
 * `references.ts`; no customer story is published until a real, approved case
 * exists there.
 *
 * ### The order (since 2026-09-15)
 *
 * Webauftritt first: the site's focus is web presence and digitalization, and
 * the web presence is what most visitors arrive asking about — it is also the
 * service the shop system and CMS pages belong to. The other three are the
 * digitalization half, in the order a project runs: sort, simplify, build.
 *
 * ### Copy rules
 *
 * - **du**, lowercase, like the rest of the site (decided 2026-09-15).
 * - **Short and clear** (asked for 2026-09-15): three points per list, one
 *   statement per line, no filler.
 * - `summary` is rendered twice: as the card text on the pricing grid and as
 *   the `<meta name="description">` of the detail page. It must stay between
 *   81 and 160 characters in BOTH languages, which `services.test.ts` measures.
 */
export const serviceDefinitions = [
  {
    // The broadest of the four, and deliberately so: a site, a shop and the
    // marketing that brings people to them are one job, not three. Marketing
    // was briefly its own service; splitting it made the visitor choose
    // between building a presence and being found through it, which is not a
    // choice a small business has. The ad-budget sentence in `boundaries`
    // came from that entry and has to stay — a fixed price on its own
    // understates what running ads actually costs.
    id: "web-presence",
    number: "01",
    cmsKey: "service_web_presence",
    slug: { de: "webauftritt", en: "web-presence" },
    seoTitle: {
      de: "Website & Onlineshop erstellen lassen — Tracht Digital",
      en: "Websites and Online Shops, Built and Maintained — Tracht Digital",
    },
    updatedAt: "2026-09-15",
    keywords: {
      de: ["Websites", "Onlineshops", "Shopsysteme & CMS", "Google Ads & SEO"],
      en: ["Websites", "Online shops", "Shop systems & CMS", "Google Ads & SEO"],
    },
    image: "/images/services/04-webauftritt.webp",
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Webauftritt",
        summary:
          "Bestehende Website oder Shop übernehmen, reparieren und pflegen – oder neu bauen, wenn sich das nicht mehr lohnt.",
        intro:
          "Meistens muss nichts neu gebaut werden. Ich übernehme, *was trägt* – und ersetze nur, was sich nicht mehr retten lässt.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Deine Website ist veraltet und schwer zu pflegen.",
          "Dein Shop auf WooCommerce, Shopware oder einem Baukasten macht Probleme.",
          "Die Seite sieht gut aus, aber kaum jemand fragt an.",
        ],
        responsibilitiesTitle: "Das übernehme ich",
        responsibilities: [
          "Website bauen – für Handy und Bildschirm",
          "Onlineshop einrichten oder reparieren, z. B. WooCommerce oder Shopware 6",
          "Bestehende Seiten auf WordPress, TYPO3 oder bei STRATO übernehmen",
          "Marketing: Google Ads, Unternehmensprofil und Auffindbarkeit",
        ],
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Besucher verstehen sofort, was du anbietest",
          "Du wirst gefunden, wenn jemand danach sucht",
          "Deine Seite bleibt leicht zu pflegen",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Das Werbebudget für Anzeigen zahlst du direkt an Google.",
          "Texte, Fotos und Rechtstexte brauchen deine Zuarbeit.",
          "Platzierungen bei Google lassen sich nicht kaufen.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ziele und Inhalte klären",
          "Seite oder Shop bauen und gemeinsam durchgehen",
          "Online stellen und sichtbar machen",
        ],
        priceLabel: "Preis",
        priceText:
          "Festpreise ab 390 € netto, alles andere auf Anfrage.",
        referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Soll deine Website mehr für dich tun?",
        ctaText: "Erzähl mir, was sie leisten soll. Wir klären den sinnvollen Umfang.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Web Presence",
        summary:
          "Taking over, repairing and maintaining an existing website or shop – or building new where that no longer pays off.",
        intro:
          "Usually nothing has to be rebuilt. I take over *what holds up* – and replace only what cannot be saved.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "Your website is outdated and hard to maintain.",
          "Your shop on WooCommerce, Shopware or a site builder is causing problems.",
          "The site looks good, but hardly anyone gets in touch.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Build the website – for phones and screens",
          "Set up or repair an online shop, e.g. WooCommerce or Shopware 6",
          "Take over existing sites on WordPress, TYPO3 or at STRATO",
          "Marketing: Google Ads, business profile and findability",
        ],
        outcomesTitle: "What you achieve",
        outcomes: [
          "Visitors see straight away what you offer",
          "You are found when someone searches for it",
          "Your site stays easy to maintain",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "The ad budget goes to Google directly.",
          "Copy, photos and legal texts need your input.",
          "Google rankings cannot be bought.",
        ],
        processTitle: "How we proceed",
        process: [
          "Clarify goals and content",
          "Build the site or shop and walk through it together",
          "Put it online and make it visible",
        ],
        priceLabel: "Price",
        priceText:
          "Fixed prices from €390 net, everything else on request.",
        referencesLabel: "Published only with the client's approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Should your website do more for you?",
        ctaText: "Tell me what it needs to do. We work out a sensible scope.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    id: "consulting",
    number: "02",
    cmsKey: "service_consulting",
    slug: { de: "beratung-konzeption", en: "consulting-planning" },
    seoTitle: {
      de: "Digitalisierungsberatung & Konzept — Tracht Digital",
      en: "Digital Consulting & Planning — Tracht Digital",
    },
    updatedAt: "2026-09-15",
    keywords: {
      de: ["Einordnung", "Optionen & Kosten", "Konzept", "Fahrplan"],
      en: ["Assessment", "Options & costs", "Concept", "Roadmap"],
    },
    image: "/images/services/01-beratung.webp",
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Beratung & Konzeption",
        summary:
          "Ich sortiere deine digitalen Vorhaben, zeige dir Möglichkeiten mit Kosten und mache daraus einen klaren Fahrplan.",
        intro:
          "Nicht alles, was technisch geht, lohnt sich. Wir klären zuerst, *was du erreichen willst*.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Es gibt viele Ideen, aber keine Reihenfolge.",
          "Eine größere Anschaffung soll erst geprüft werden.",
          "Mehrere Systeme oder Firmen müssen zusammenarbeiten.",
        ],
        responsibilitiesTitle: "Das übernehme ich",
        responsibilities: [
          "Ziele, Abläufe und Technik aufnehmen",
          "Möglichkeiten und Kosten verständlich vergleichen",
          "Einen umsetzbaren Fahrplan schreiben",
        ],
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Du weißt, was zuerst dran ist",
          "Du kennst die Kosten, bevor du entscheidest",
          "Du sparst dir teure Fehlentscheidungen",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Beratung ersetzt keinen Anwalt oder Steuerberater.",
          "Die Umsetzung wird getrennt vereinbart.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Lage und Ziel aufnehmen",
          "Möglichkeiten bewerten",
          "Fahrplan festhalten – dann umsetzen oder übergeben",
        ],
        priceLabel: "Preis",
        priceText: "Auf Anfrage. Für ein klar abgegrenztes Konzept bekommst du einen Festpreis.",
        referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Du willst zuerst Klarheit?",
        ctaText: "Schildere kurz deine Lage. Wir klären, welche Frage zuerst dran ist.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Consulting & Planning",
        summary:
          "I sort out your digital plans, show you the options and their costs, and turn that into a clear roadmap.",
        intro:
          "Not everything that is technically possible is worth it. We first work out *what you want to achieve*.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "There are plenty of ideas, but no order to them.",
          "A larger investment should be checked first.",
          "Several systems or suppliers have to work together.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Understand your goals, workflows and technology",
          "Compare the options and costs in plain language",
          "Write a roadmap you can act on",
        ],
        outcomesTitle: "What you achieve",
        outcomes: [
          "You know what comes first",
          "You know the costs before you decide",
          "You avoid expensive wrong turns",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Consulting does not replace a lawyer or an accountant.",
          "Building it is agreed separately.",
        ],
        processTitle: "How we proceed",
        process: [
          "Understand the situation and the goal",
          "Weigh the options",
          "Write down the roadmap – then build or hand over",
        ],
        priceLabel: "Price",
        priceText: "On request. A clearly bounded concept gets a fixed price.",
        referencesLabel: "Published only with the client's approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Want clarity first?",
        ctaText: "Briefly describe your situation. We work out which question comes first.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    id: "process",
    number: "03",
    cmsKey: "service_process",
    slug: { de: "prozessoptimierung", en: "process-optimization" },
    seoTitle: {
      de: "Prozessoptimierung & Automatisierung — Tracht Digital",
      en: "Process Optimization & Automation — Tracht Digital",
    },
    updatedAt: "2026-09-15",
    keywords: {
      de: ["Abläufe", "Automatisierung", "Weniger Handarbeit"],
      en: ["Workflows", "Automation", "Less manual work"],
    },
    image: "/images/services/02-prozesse.webp",
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Prozessoptimierung",
        summary:
          "Ich schaue mir deine täglichen Abläufe an, streiche unnötige Schritte und automatisiere, was spürbar Zeit spart.",
        intro:
          "Gute Digitalisierung beginnt mit einem ehrlichen Blick auf deinen Alltag. *Erst verstehen, dann vereinfachen.*",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Dieselben Daten werden mehrfach eingetippt.",
          "Freigaben und Rückfragen kosten jedes Mal Zeit.",
          "Bei Routinearbeiten schleichen sich Fehler ein.",
        ],
        responsibilitiesTitle: "Das übernehme ich",
        responsibilities: [
          "Den heutigen Ablauf mit deinem Team durchgehen",
          "Zeitfresser und Fehlerquellen finden",
          "Einen einfacheren Weg einrichten – mit passender Automatisierung",
        ],
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Du tippst Daten nicht mehr doppelt",
          "Weniger Fehler durch Handarbeit",
          "Mehr Zeit für deine eigentliche Arbeit",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Nicht jeder Sonderfall lohnt eine Automatisierung.",
          "Änderungen stimmen wir mit deinem Team ab.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ablauf mitverfolgen und aufschreiben",
          "Die größten Zeitfresser zuerst angehen",
          "Einführen und bei Bedarf nachbessern",
        ],
        priceLabel: "Preis",
        priceText: "Auf Anfrage. Sobald Ablauf und Ziel klar sind, bekommst du einen Festpreis.",
        referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Welcher Ablauf kostet dich jede Woche Zeit?",
        ctaText: "Beschreib ihn kurz. Wir prüfen, ob sich eine Vereinfachung lohnt.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Process Optimization",
        summary:
          "I look at your day-to-day workflows, remove the steps nobody needs and automate what noticeably saves time.",
        intro:
          "Good digital work starts with an honest look at your daily routine. *Understand first, then simplify.*",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "The same data gets typed in more than once.",
          "Approvals and follow-up questions cost time every time.",
          "Mistakes creep into routine work.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Walk through the current workflow with your team",
          "Find the time sinks and error sources",
          "Set up a simpler way – with the right automation",
        ],
        outcomesTitle: "What you achieve",
        outcomes: [
          "You stop typing the same data twice",
          "Fewer mistakes from manual work",
          "More time for the actual work",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Not every exception is worth automating.",
          "Changes are agreed with your team.",
        ],
        processTitle: "How we proceed",
        process: [
          "Follow the workflow and write it down",
          "Tackle the biggest time sinks first",
          "Roll it out and refine it",
        ],
        priceLabel: "Price",
        priceText: "On request. Once the workflow and the goal are clear, you get a fixed price.",
        referencesLabel: "Published only with the client's approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Which routine costs you time every week?",
        ctaText: "Describe it briefly. We check whether simplifying it is worth it.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    id: "solutions",
    number: "04",
    cmsKey: "service_solutions",
    slug: { de: "individuelle-loesungen", en: "tailored-solutions" },
    seoTitle: {
      de: "Individuelle Software & Schnittstellen — Tracht Digital",
      en: "Custom Software & Integrations — Tracht Digital",
    },
    updatedAt: "2026-09-15",
    keywords: {
      de: ["Systeme verbinden", "Schnittstellen", "Eigene Software", "Auftragsentwicklung"],
      en: ["Connected systems", "Integrations", "Custom software", "Contract development"],
    },
    image: "/images/services/03-loesungen.webp",
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Individuelle Lösungen",
        summary:
          "Ich verbinde deine vorhandenen Programme, ergänze passende Werkzeuge und baue eigene Software nur dort, wo sie hilft.",
        intro:
          "Manchmal reicht ein einzelnes Programm nicht. Dann nutze ich deine vorhandene Technik weiter und *ergänze nur, was fehlt*.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Mehrere Programme arbeiten nicht zusammen.",
          "Die Standardsoftware kann eine Besonderheit deines Betriebs nicht.",
          "Daten sollen zuverlässig von einem Werkzeug ins andere fließen.",
        ],
        responsibilitiesTitle: "Das übernehme ich",
        responsibilities: [
          "Abwägen: Standardprodukt, Schnittstelle oder Eigenbau",
          "Nach klarer Aufgabe entwickeln und testen",
          "Übergeben, dokumentieren und weiter betreuen",
        ],
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Deine Programme arbeiten zusammen",
          "Du bekommst genau das Werkzeug, das fehlt",
          "Der Quellcode ist lesbar und dokumentiert",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Bewährte Standardsoftware wird nicht ohne Grund neu gebaut.",
          "Schnittstellen gehen nur so weit, wie die Anbieter sie zulassen.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ziele und vorhandene Technik erfassen",
          "In klaren Etappen bauen und testen",
          "Einführen und weiter betreuen",
        ],
        priceLabel: "Preis",
        priceText: "Auf Anfrage. Bei festem Umfang gibt es Festpreise für einzelne Etappen.",
        referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Deine Werkzeuge passen nicht zusammen?",
        ctaText: "Zeig mir, wie es heute läuft. Wir klären, was bleiben kann.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Tailored Solutions",
        summary:
          "I connect the programs you already use, add the right tools and build custom software only where it helps.",
        intro:
          "Sometimes one program is not enough. Then I keep your existing technology and *add only what is missing*.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "Several programs do not work together.",
          "Standard software cannot handle a quirk of your business.",
          "Data should move reliably from one tool to the next.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Weigh it up: off-the-shelf, integration or custom build",
          "Build and test against a clear brief",
          "Hand over, document and keep supporting it",
        ],
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your programs work together",
          "You get exactly the tool that is missing",
          "The source code is readable and documented",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Proven standard software is not rebuilt without a good reason.",
          "Integrations only go as far as the providers allow.",
        ],
        processTitle: "How we proceed",
        process: [
          "Capture goals and existing technology",
          "Build and test in clear stages",
          "Roll out and keep supporting it",
        ],
        priceLabel: "Price",
        priceText: "On request. Once the scope is set, fixed prices for single stages.",
        referencesLabel: "Published only with the client's approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Your tools do not fit together?",
        ctaText: "Show me how it works today. We work out what can stay.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
] satisfies readonly ServiceDefinition[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

/**
 * Validate the special empty-by-default reference collection.
 *
 * `cmsFor()` deliberately refuses to infer a schema from an empty fallback
 * list. References need an empty local default (publishing invented examples
 * is not acceptable), so this boundary validates the raw CMS field instead.
 * One malformed item rejects the complete collection, matching `cmsFor()`'s
 * safe list-boundary fallback behaviour.
 */
export function validateServiceReferences(value: unknown): ServiceReference[] {
  if (!Array.isArray(value) || value.length === 0) return [];

  const references: ServiceReference[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate)) return [];

    const title = requiredString(candidate.title);
    const context = requiredString(candidate.context);
    const challenge = requiredString(candidate.challenge);
    const solution = requiredString(candidate.solution);
    const result = requiredString(candidate.result);
    const metric =
      candidate.metric === undefined || candidate.metric === null || candidate.metric === ""
        ? ""
        : requiredString(candidate.metric);

    if (!title || !context || !challenge || !solution || !result || metric === null) {
      return [];
    }

    references.push({ title, context, challenge, solution, result, metric });
  }

  return references;
}

export function getServiceById(id: ServiceId): ServiceDefinition {
  const service = serviceDefinitions.find((candidate) => candidate.id === id);
  // The ServiceId union and the committed catalog are maintained together.
  // Throwing here exposes an internal drift during development instead of
  // returning a broken link in production.
  if (!service) throw new Error(`Unknown service id: ${id}`);
  return service;
}

export function getServiceBySlug(
  lang: Lang,
  slug: string | undefined,
): ServiceDefinition | undefined {
  if (!slug) return undefined;
  return serviceDefinitions.find((service) => service.slug[lang] === slug);
}

export function serviceHref(service: ServiceDefinition, lang: Lang): string {
  return lang === "de"
    ? `/leistungen/${service.slug.de}`
    : `/en/services/${service.slug.en}`;
}

/**
 * Services that were published and then withdrawn, and where their visitors
 * should land instead.
 *
 * These slugs were indexed and linked, so answering them with the 404 the
 * route would otherwise produce throws that away — and for Marketing it would
 * be wrong as well as wasteful: the content did not disappear, it moved into
 * Web Presence. Contract development moved into Tailored Solutions the same
 * way. Complete IT has no successor, so it points at the overview rather than
 * at a service that would have to pretend to cover it.
 *
 * Keyed by the retired slug, per language, because the pair is what a visitor
 * actually typed. `retiredServiceTarget` is called by both `[slug]` routes
 * BEFORE they give up and 404 — the dynamic route still matches these paths,
 * which is the only reason no new redirect mechanism is needed.
 */
const retiredServiceTargets: Record<Lang, Record<string, string>> = {
  de: {
    auftragsprogrammierung: "/leistungen/individuelle-loesungen",
    marketing: "/leistungen/webauftritt",
    "komplette-it": "/#services",
  },
  en: {
    "contract-development": "/en/services/tailored-solutions",
    marketing: "/en/services/web-presence",
    "complete-it": "/en/#services",
  },
};

export function retiredServiceTarget(
  lang: Lang,
  slug: string | undefined,
): string | undefined {
  if (!slug) return undefined;
  return retiredServiceTargets[lang][slug];
}

/** Exported for the test that keeps the table honest as the catalog changes. */
export { retiredServiceTargets };

/**
 * Merge CMS reference text onto the committed cases, position by position.
 *
 * The committed list is the base and owns **every destination**; the CMS owns
 * the words. An editor rewriting the first card rewrites the first committed
 * case and keeps its links. A CMS entry past the end of the committed list is
 * an editor-authored case and simply has none — there is nowhere for it to
 * point that this repo could vouch for.
 *
 * Every destination is stripped off the override before anything is restored,
 * rather than only overwritten where a committed one exists. `validateService
 * References` already drops them upstream, so this is belt and braces — but
 * the old form leaned entirely on that: at any position whose committed case
 * lacks a link, a CMS-supplied one passed straight through.
 */
export function mergeReferences(
  committed: readonly ServiceReference[],
  fromCms: readonly ServiceReference[],
): ServiceReference[] {
  if (fromCms.length === 0) return [...committed];

  return fromCms.map((override, i) => {
    const base = committed[i];
    const { articleUrl: _article, siteUrl: _site, ...text } = override;
    return {
      ...text,
      ...(base?.articleUrl ? { articleUrl: base.articleUrl } : {}),
      ...(base?.siteUrl ? { siteUrl: base.siteUrl } : {}),
    };
  });
}

/**
 * Resolve the editable CMS block over the committed localized fallback.
 *
 * References do not go through `cmsFor` — it infers its schema from the
 * fallback and cannot describe this list — so they are resolved here, in three
 * cases that are deliberately distinct:
 *
 *  - **No `references` key**, or a malformed one: the committed cases render.
 *    That is the normal state; nobody has to retype a published case into the
 *    panel for it to appear.
 *  - **An explicitly empty array**: the section disappears entirely. This is
 *    the documented way to pull a reference off the site without a deploy, and
 *    a committed base would have silently taken it away — hence the key check
 *    rather than a length check on the validated result.
 *  - **A valid non-empty array**: it overrides the text, position by position,
 *    and never the links (see {@link mergeReferences}).
 */
export async function resolveServiceContent(
  service: ServiceDefinition,
  lang: Lang,
): Promise<ServiceContent> {
  const { references: _references, ...fallback } = service.fallback[lang];
  const resolved = await cmsFor(service.cmsKey, lang, fallback);
  const blocks = await fetchBlocks(lang);
  const block = blocks[service.cmsKey];

  const committed = referencesForService(service.id, lang);
  const hasKey = isRecord(block) && "references" in block;
  const emptied = hasKey && Array.isArray(block.references) && block.references.length === 0;

  const references = emptied
    ? []
    : mergeReferences(
        committed,
        isRecord(block) ? validateServiceReferences(block.references) : [],
      );

  return { ...resolved, references };
}
