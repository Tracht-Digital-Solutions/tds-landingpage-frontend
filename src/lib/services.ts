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
   * Stable display ORDER shared by overview, sitemap and navigation — and by
   * `ServiceCard`, which keys each card's decorative shape off it.
   *
   * It is never rendered as text. A visitor reaching a service from a card or
   * from search is told "05" about a list they never saw, so the numerals came
   * off the detail hero and the pricing cards; only the sequence survives.
   */
  number: string;
  /** Stable, code-owned CMS block key. */
  cmsKey: ServiceCmsKey;
  /** Stable, localized route segments. Never editable in the CMS. */
  slug: Record<Lang, string>;
  /**
   * Plain everyday words for the overview card's chips.
   *
   * These used to be `responsibilities.slice(0, 3)`, which put sentences
   * like "Ziele, Abläufe und bestehende Systeme aufnehmen" into a pill
   * three words wide. A visitor scanning six cards wants to know what a
   * service IS — "Webseiten · Webshops · SEO · Backlinks" — not how it is
   * carried out; the detail page answers that.
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
   * box — so this can ship before the artwork exists. The card always has
   * its own geometry layer underneath either way. See IMAGES.md for the
   * open asset tasks and the generation prompts.
   */
  image: string | null;
  fallback: Record<Lang, ServiceContent>;
}

/**
 * Single source of truth for service identity, order, routes and local content.
 * The CMS may override every content field, but never ids, slugs, keywords,
 * images or prices used in structured data. References intentionally default
 * to an empty list: no customer story is published until a real, approved
 * entry exists in the CMS.
 *
 * COPY RULE — `summary` is rendered twice: as the card text on the home page
 * and as the `<meta name="description">` of that service's detail page. It
 * must stay between 81 and 160 characters in BOTH languages, which
 * `services.test.ts` measures. Short, plain wording is the goal; a short
 * KEYWORD list belongs in `keywords`, not here.
 */
export const serviceDefinitions = [
  {
    id: "consulting",
    number: "01",
    cmsKey: "service_consulting",
    slug: { de: "beratung-konzeption", en: "consulting-planning" },
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
          "Ich sortiere Ihre digitalen Vorhaben, zeige Ihnen die Möglichkeiten mit Kosten und Folgen und mache daraus einen klaren Fahrplan.",
        intro:
          "Nicht alles, was technisch geht, lohnt sich für Ihren Betrieb. Wir klären erst, was Sie erreichen wollen und in welcher Reihenfolge — bevor Zeit und Geld in eine Lösung fließen.",
        situationsTitle: "Kommt Ihnen das bekannt vor?",
        situations: [
          "Es gibt viele Ideen, aber keine Reihenfolge.",
          "Eine größere Anschaffung soll erst geprüft werden.",
          "Mehrere Systeme oder Firmen müssen zusammenarbeiten.",
          "Sie wissen nicht, worauf Sie Ihre Entscheidung stützen sollen.",
        ],
        responsibilitiesTitle: "Was ich übernehme",
        responsibilities: [
          "Ziele, Abläufe und vorhandene Technik aufnehmen",
          "Möglichkeiten, Risiken und Kosten verständlich gegenüberstellen",
          "Ein Konzept schreiben, das man umsetzen kann",
          "Reihenfolge, Etappen und nächste Schritte festlegen",
        ],
        outcomesTitle: "Das erreichen Sie",
        outcomes: [
          "Sie wissen, was zuerst dran ist",
          "Sie kennen die Kosten, bevor Sie entscheiden",
          "Sie haben einen Plan mit klaren Etappen",
          "Sie sparen sich teure Fehlentscheidungen",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Eine Beratung ersetzt keinen Anwalt, Steuerberater oder Prüfer.",
          "Aufwand und Termine stehen erst nach der Bestandsaufnahme fest.",
          "Die Umsetzung ist eine eigene Leistung und wird getrennt vereinbart.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Lage und Ziel gemeinsam aufnehmen",
          "Möglichkeiten und Abhängigkeiten bewerten",
          "Empfehlung, Reihenfolge und Umfang festhalten",
          "Umsetzung starten oder geordnet übergeben",
        ],
        priceLabel: "Preis",
        priceText:
          "90 € netto pro Stunde. Für ein klar abgegrenztes Konzept ist nach der Bestandsaufnahme auch ein Festpreis möglich.",
        referencesLabel:
          "Veröffentlicht wird nur nach ausdrücklicher Freigabe — anonymisiert, sofern nicht anders vereinbart.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Sie möchten zuerst Klarheit?",
        ctaText:
          "Schildern Sie kurz Ihre Lage. Im Erstgespräch klären wir, welche Frage zuerst beantwortet gehört.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Consulting & Planning",
        summary:
          "I sort out your digital plans, show you the options with their costs and consequences, and turn that into a clear roadmap.",
        intro:
          "Not everything that is technically possible is worth it for your business. We first work out what you want to achieve and in what order — before time and money go into a solution.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "There are plenty of ideas, but no order to them.",
          "A larger investment should be checked first.",
          "Several systems or suppliers have to work together.",
          "You do not know what to base the decision on.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Understand your goals, workflows and existing technology",
          "Compare the options, risks and costs in plain language",
          "Write a concept that can actually be built",
          "Set the order, the stages and the next steps",
        ],
        outcomesTitle: "What you achieve",
        outcomes: [
          "You know what comes first",
          "You know the costs before you decide",
          "You have a plan with clear stages",
          "You avoid expensive wrong turns",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Consulting does not replace a lawyer, an accountant or an auditor.",
          "Effort and dates are only firm after the initial assessment.",
          "Building it is a separate service and is agreed separately.",
        ],
        processTitle: "How we proceed",
        process: [
          "Understand the situation and the goal together",
          "Weigh the options and what depends on what",
          "Write down the recommendation, order and scope",
          "Start building, or hand it over in good order",
        ],
        priceLabel: "Price",
        priceText:
          "€90 net per hour. For a clearly bounded concept, a fixed price is possible after the initial assessment.",
        referencesLabel:
          "Published only with the client's explicit approval — anonymised unless agreed otherwise.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Want clarity first?",
        ctaText:
          "Briefly describe your situation. In the first conversation we work out which question deserves an answer first.",
        ctaButton: "Arrange an initial conversation",
      },
    },
  },
  {
    id: "process",
    number: "02",
    cmsKey: "service_process",
    slug: { de: "prozessoptimierung", en: "process-optimization" },
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
          "Ich schaue mir Ihre täglichen Abläufe an, streiche unnötige Schritte und automatisiere das, was wirklich Zeit spart.",
        intro:
          "Gute Digitalisierung fängt nicht mit einem neuen Programm an, sondern mit einem ehrlichen Blick auf die tägliche Arbeit. Erst verstehen, dann vereinfachen.",
        situationsTitle: "Kommt Ihnen das bekannt vor?",
        situations: [
          "Dieselben Daten werden mehrfach eingetippt.",
          "Freigaben und Rückfragen kosten jedes Mal Zeit.",
          "Bei Routinearbeiten schleichen sich Fehler ein.",
          "Ein Ablauf ist über Jahre gewachsen und kennt kaum noch jemand ganz.",
        ],
        responsibilitiesTitle: "Was ich übernehme",
        responsibilities: [
          "Den heutigen Ablauf mit Ihren Leuten durchgehen",
          "Zeitfresser und Fehlerquellen sichtbar machen",
          "Einen einfacheren Weg entwerfen",
          "Passende Automatisierung auswählen und einrichten",
        ],
        outcomesTitle: "Das erreichen Sie",
        outcomes: [
          "Sie tippen dieselben Daten nicht mehr doppelt",
          "Jeder weiß, wer was übernimmt",
          "Weniger Fehler durch Handarbeit",
          "Mehr Zeit für die eigentliche Arbeit",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Nicht jeder seltene Sonderfall gehört automatisiert.",
          "Änderungen werden mit den betroffenen Mitarbeitenden abgestimmt.",
          "Das Ergebnis hängt auch davon ab, wie sauber die Daten gepflegt werden.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ablauf mitverfolgen und aufschreiben",
          "Die größten Zeitfresser zuerst angehen",
          "Den neuen Weg im Kleinen ausprobieren",
          "Einführen, festhalten und bei Bedarf nachbessern",
        ],
        priceLabel: "Preis",
        priceText:
          "80 € netto pro Stunde. Ein Festpreis ist möglich, sobald Ablauf, Datenquellen und Ziel klar sind.",
        referencesLabel:
          "Veröffentlicht wird nur nach ausdrücklicher Freigabe — anonymisiert, sofern nicht anders vereinbart.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Welcher Ablauf kostet Sie jede Woche Zeit?",
        ctaText:
          "Beschreiben Sie ihn kurz. Wir prüfen gemeinsam, wo Vereinfachung oder Automatisierung wirklich lohnt.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Process Optimization",
        summary:
          "I look at your day-to-day workflows, remove the steps nobody needs and automate the ones that really save time.",
        intro:
          "Good digital work does not start with a new program, it starts with an honest look at the daily routine. Understand first, then simplify.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "The same data gets typed in more than once.",
          "Approvals and follow-up questions cost time every time.",
          "Mistakes creep into routine work.",
          "A workflow grew over years and hardly anyone knows all of it.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Walk through the current workflow with your people",
          "Make the time sinks and error sources visible",
          "Design a simpler way through it",
          "Choose and set up the right automation",
        ],
        outcomesTitle: "What you achieve",
        outcomes: [
          "You stop typing the same data twice",
          "Everyone knows who does what",
          "Fewer mistakes from manual work",
          "More time for the actual work",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Not every rare exception should be automated.",
          "Changes are agreed with the people they affect.",
          "The result also depends on how carefully the data is kept.",
        ],
        processTitle: "How we proceed",
        process: [
          "Follow the workflow and write it down",
          "Tackle the biggest time sinks first",
          "Try the new way on a small scale",
          "Roll it out, document it and refine it",
        ],
        priceLabel: "Price",
        priceText:
          "€80 net per hour. A fixed price is possible once the workflow, the data sources and the goal are clear.",
        referencesLabel:
          "Published only with the client's explicit approval — anonymised unless agreed otherwise.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Which routine costs you time every week?",
        ctaText:
          "Describe it briefly. Together we check where simplifying or automating is genuinely worth it.",
        ctaButton: "Arrange an initial conversation",
      },
    },
  },
  {
    id: "solutions",
    number: "03",
    cmsKey: "service_solutions",
    slug: { de: "individuelle-loesungen", en: "tailored-solutions" },
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
          "Ich bringe Ihre vorhandenen Programme zusammen, ergänze passende Werkzeuge und baue eigene Software nur dort, wo sie wirklich hilft.",
        intro:
          "Manchmal reicht ein einzelnes Programm nicht. Dann entsteht ein Paket, das die vorhandene Technik weiter nutzt und nur dort etwas Eigenes ergänzt, wo es einen echten Vorteil bringt.",
        situationsTitle: "Kommt Ihnen das bekannt vor?",
        situations: [
          "Mehrere Programme arbeiten nicht zusammen.",
          "Die Standardsoftware kann eine Besonderheit Ihres Betriebs nicht.",
          "Für eine klar beschriebene Aufgabe gibt es kein passendes Programm.",
          "Daten sollen zuverlässig von einem Werkzeug ins andere fließen.",
        ],
        responsibilitiesTitle: "Was ich übernehme",
        responsibilities: [
          "Anforderungen und vorhandene Technik zusammenbringen",
          "Abwägen: Standardprodukt, Schnittstelle oder Eigenbau",
          "Den Aufbau und die Einführung planen",
          "Nach klarer Aufgabe entwickeln, testen und dokumentieren",
          "Bausteine verbinden, übergeben und weiter betreuen",
        ],
        outcomesTitle: "Das erreichen Sie",
        outcomes: [
          "Ihre Programme arbeiten zusammen",
          "Sie bekommen genau das Werkzeug, das fehlt",
          "Der Quellcode ist lesbar und dokumentiert",
          "Einer verantwortet das Gesamtbild",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Bewährte Standardsoftware wird nicht ohne Grund neu gebaut.",
          "Schnittstellen gehen nur so weit, wie die Anbieter sie zulassen.",
          "Umfang und Betrieb werden vor der Umsetzung schriftlich vereinbart.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ziele, Abläufe und vorhandene Technik erfassen",
          "Passende Bausteine und Verbindungen auswählen",
          "In klaren Etappen bauen und testen",
          "Einführen, dokumentieren und weiter betreuen",
        ],
        priceLabel: "Preis",
        priceText:
          "80 € netto pro Stunde. Steht der Umfang fest, sind Festpreise für einzelne Etappen oder das ganze Paket möglich.",
        referencesLabel:
          "Veröffentlicht wird nur nach ausdrücklicher Freigabe — anonymisiert, sofern nicht anders vereinbart.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Ihre Werkzeuge passen nicht zusammen?",
        ctaText:
          "Zeigen Sie mir, wie es heute läuft. Wir klären, was bleiben kann und wo eine Ergänzung sinnvoll ist.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Tailored Solutions",
        summary:
          "I connect the programs you already use, add the right tools and build custom software only where it genuinely helps.",
        intro:
          "Sometimes one program is not enough. Then it becomes a package that keeps using the technology you have and only adds something custom where it brings a real advantage.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "Several programs do not work together.",
          "Standard software cannot handle a quirk of your business.",
          "There is no program for a clearly described task.",
          "Data should move reliably from one tool to the next.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Bring the requirements and the existing technology together",
          "Weigh it up: off-the-shelf, integration, or custom build",
          "Plan the structure and the rollout",
          "Build, test and document against a clear brief",
          "Connect the pieces, hand them over and keep supporting them",
        ],
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your programs work together",
          "You get exactly the tool that is missing",
          "The source code is readable and documented",
          "One person owns the whole picture",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Proven standard software is not rebuilt without a good reason.",
          "Integrations only go as far as the providers allow.",
          "Scope and operation are agreed in writing before the build.",
        ],
        processTitle: "How we proceed",
        process: [
          "Capture goals, workflows and existing technology",
          "Choose the right pieces and connections",
          "Build and test in clear stages",
          "Roll out, document and keep supporting it",
        ],
        priceLabel: "Price",
        priceText:
          "€80 net per hour. Once the scope is set, fixed prices are possible for single stages or the whole package.",
        referencesLabel:
          "Published only with the client's explicit approval — anonymised unless agreed otherwise.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Your tools do not fit together?",
        ctaText:
          "Show me how it works today. We work out what can stay and where an addition makes sense.",
        ctaButton: "Arrange an initial conversation",
      },
    },
  },
  {
    // The broadest of the four, and deliberately so: a site, a shop and the
    // marketing that brings people to them are one job, not three. Marketing
    // was briefly its own service; splitting it made the visitor choose
    // between building a presence and being found through it, which is not a
    // choice a small business has. The media-budget sentence in `boundaries`
    // came from that entry and has to stay — an hourly rate on its own
    // understates what running ads actually costs.
    id: "web-presence",
    number: "04",
    cmsKey: "service_web_presence",
    slug: { de: "webauftritt", en: "web-presence" },
    keywords: {
      de: ["Webseiten", "Webshops", "Google Ads", "SEO"],
      en: ["Websites", "Online shops", "Google Ads", "SEO"],
    },
    image: "/images/services/04-webauftritt.webp",
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Webauftritt",
        summary:
          "Webseiten, Webshops und Marketing: Ich baue Ihren Auftritt, bringe ihn zu den Kunden – und pflege ihn dauerhaft.",
        intro:
          "Ein Auftritt besteht aus drei Teilen: die Seite, der Verkauf darüber und der Weg, auf dem Kunden dorthin finden. Gestaltung, Technik und Sichtbarkeit werden deshalb zusammen gedacht.",
        situationsTitle: "Kommt Ihnen das bekannt vor?",
        situations: [
          "Die Seite ist alt und lässt sich kaum pflegen.",
          "Der Laden läuft, online verkaufen Sie noch nicht.",
          "Die Seite ist gut, aber es kommt kaum jemand.",
          "Anzeigen laufen, doch niemand erklärt Ihnen die Zahlen.",
        ],
        responsibilitiesTitle: "Was ich übernehme",
        responsibilities: [
          "Ziele, Zielgruppe und Inhalte sortieren",
          "Seite bauen: für Handy und Bildschirm, barrierearm",
          "Webshop einrichten, Artikel und Bestand in den Griff bekommen",
          "Google Ads betreuen und das Unternehmensprofil in Ordnung bringen",
          "Organische Auffindbarkeit, Newsletter und laufende Pflege regeln",
        ],
        outcomesTitle: "Das erreichen Sie",
        outcomes: [
          "Besucher verstehen sofort, was Sie anbieten",
          "Ihr Angebot erscheint, wenn jemand danach sucht",
          "Sie wissen, was eine Anfrage kostet",
          "Die Seite ist auch in zwei Jahren noch pflegbar",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Das Mediabudget zahlen Sie direkt an Google – es ist kein Teil meines Honorars.",
          "Texte, Fotos und Rechtstexte brauchen Ihre Zuarbeit.",
          "Organische Platzierungen lassen sich nicht kaufen, sie brauchen Zeit.",
          "Pflege, Hosting und Dienste Dritter werden offen ausgewiesen.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ziele, Inhalte und gewünschte Funktionen klären",
          "Aufbau und gestalterische Richtung abstimmen",
          "Seite bauen, befüllen und gemeinsam durchgehen",
          "Online stellen, Sichtbarkeit aufbauen und offen berichten",
        ],
        priceLabel: "Preis",
        priceText:
          "65 € netto pro Stunde, bei Anzeigen zuzüglich Ihres Mediabudgets. Steht der Umfang fest, ist ein Festpreis möglich.",
        referencesLabel:
          "Veröffentlicht wird nur nach ausdrücklicher Freigabe — anonymisiert, sofern nicht anders vereinbart.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Soll Ihr Auftritt mehr für Sie arbeiten?",
        ctaText:
          "Erzählen Sie mir, was er leisten soll und wen Sie erreichen wollen. Wir sortieren Inhalte, Kanäle und den sinnvollen Umfang.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Web Presence",
        summary:
          "Websites, online shops and marketing: I build your presence, bring it to your customers – and keep it maintained.",
        intro:
          "A presence has three parts: the site, what you sell through it, and the route customers take to find it. Design, technology and visibility are planned together for that reason.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "The site is old and hard to keep up to date.",
          "The shop runs well, but you do not sell online yet.",
          "The site is fine, but hardly anyone comes.",
          "Ads are running, yet nobody explains the numbers.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Sort out the goals, the audience and the content",
          "Build it: for phones and screens, accessibly",
          "Set up the online shop and get products and stock under control",
          "Run Google Ads and put the business profile in order",
          "Sort out organic findability, newsletters and ongoing upkeep",
        ],
        outcomesTitle: "What you achieve",
        outcomes: [
          "Visitors immediately see what you offer",
          "Your offer shows up when someone searches for it",
          "You know what an enquiry costs",
          "The site is still maintainable in two years",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "The media budget goes to Google directly – it is not part of my fee.",
          "Copy, photos and legal texts need your input.",
          "Organic rankings cannot be bought; they take time.",
          "Upkeep, hosting and third-party services are stated openly.",
        ],
        processTitle: "How we proceed",
        process: [
          "Clarify goals, content and the functions you want",
          "Agree the structure and the visual direction",
          "Build it, fill it and walk through it together",
          "Put it online, build visibility and report openly",
        ],
        priceLabel: "Price",
        priceText:
          "€65 net per hour, plus your media budget where ads are involved. Once the scope is settled, a fixed price is possible.",
        referencesLabel:
          "Published only with the client's explicit approval — anonymised unless agreed otherwise.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Should your presence work harder for you?",
        ctaText:
          "Tell me what it needs to do and who you want to reach. We sort out the content, the channels and a sensible scope.",
        ctaButton: "Arrange an initial conversation",
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
 * lacks a link, a CMS-supplied one passed straight through. That was
 * unreachable while every committed case had an article; it stopped being
 * unreachable the moment a case without one was published.
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
