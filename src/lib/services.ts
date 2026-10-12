import { cmsFor, fetchBlocks } from "./cms";
import type { Lang } from "./i18n";
// `references.ts` takes only TYPES back from this module (`import type`, so
// erased at build), which is what keeps this pair from becoming a runtime
// cycle of the kind `contentCache.ts` exists to document.
import { referencesForService } from "./references";

export type ServiceId =
  | "panels"
  | "consulting"
  | "process"
  | "solutions"
  | "web-presence";

export type ServiceCmsKey =
  | "service_panels"
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
   * WHAT the service is, in a few words — the line under its title in the
   * home page's services list (2026-10-05). It used to be the first
   * `outcomes` entry, which told a visitor what they would get but never
   * what the service was. Code-owned like `keywords`, for the same reason.
   */
  tagline: Record<Lang, string>;
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
 * ### The order (since 2026-10-06)
 *
 * Kundenportale & Verwaltungspanels first: the site's focus moved to building
 * a business its own panel, and to digitalization in general. Then the
 * digitalization services — simplify, sort, build — and the web presence
 * last. It stays the service the shop system and CMS pages belong to; it is
 * simply no longer the headline (it stood first from 2026-09-15 to 10-05).
 *
 * ### Copy rules
 *
 * - Neutral voice since 2026-10-12: no "du", no "Sie" (see addressForm.test.ts).
 * - **Short and clear** (asked for 2026-09-15): three points per list, one
 *   statement per line, no filler.
 * - `summary` is rendered twice: as the card text on the pricing grid and as
 *   the `<meta name="description">` of the detail page. It must stay between
 *   81 and 160 characters in BOTH languages, which `services.test.ts` measures.
 */
export const serviceDefinitions = [
  {
    // The headline service since 2026-10-06: one panel per business — orders,
    // customers, appointments and reports in one place, with logins for the
    // team and a portal for the customers. It is built on the same panel
    // platform this studio runs itself (admin + customer portal), which is
    // why the copy may say "a proven base" without inventing a reference.
    id: "panels",
    number: "01",
    cmsKey: "service_panels",
    slug: { de: "kundenportale", en: "customer-portals" },
    seoTitle: {
      de: "Kundenportal & Verwaltungspanel erstellen lassen — Tracht Digital",
      en: "Customer Portal & Admin Panel Development — Tracht Digital",
    },
    // 2026-10-12: the point is structure — from project management to
    // automation, in one system the business runs on.
    updatedAt: "2026-10-12",
    keywords: {
      de: ["Kundenportal", "Projektmanagement", "Automatisierung", "Verwaltungspanel"],
      en: ["Customer portal", "Project management", "Automation", "Admin panel"],
    },
    tagline: {
      de: "Betrieb strukturieren – vom Projekt bis zur Automatisierung",
      en: "Structure the business – from projects to automation",
    },
    image: null,
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Kundenportale & Verwaltungspanels",
        summary:
          "Ein eigenes Panel, das den Betrieb strukturiert: von Projektmanagement über Kunden und Aufträge bis zu Automatisierungen.",
        intro:
          "In vielen Betrieben laufen Tabellen, Mails und Notizen nebeneinander. Ein Panel bringt *Struktur* hinein: Projekte, Aufgaben, Kunden und Unterlagen an einem Ort, wiederkehrende Schritte laufen automatisch. Das Team sieht, was zu tun ist, Kunden finden ihre Unterlagen selbst. Grundlage ist ein erprobtes System, das Tracht Digital Solutions selbst einsetzt – kein Neubau von null.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Aufträge und Kundendaten liegen verteilt in Tabellen, Mails und Ordnern.",
          "Kunden fragen nach Informationen, die sie selbst abrufen könnten.",
          "Ein Überblick über den aktuellen Stand fehlt.",
        ],
        responsibilitiesTitle: "Leistungsumfang",
        responsibilities: [
          "Projektmanagement, Kunden, Aufträge und Unterlagen in einem System",
          "Automatisierungen für wiederkehrende Schritte, z. B. Erinnerungen und Status-Mails",
          "Rollen und sichere Logins für Team und Kunden",
          "Datenübernahme, Einführung und laufende Betreuung",
        ],
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Eine klare Struktur: der aktuelle Stand auf einen Blick",
          "Alle wichtigen Informationen an einem Ort, auch mobil",
          "Kunden erledigen Anfragen selbst im Portal",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "Buchhaltung und Lohn bleiben in den dafür gemachten Programmen.",
          "Was ein fertiges Programm gut kann, wird nicht nachgebaut.",
        ],
        processTitle: "Vorgehen",
        process: [
          "Abläufe und Rollen erfassen",
          "Mit dem Wichtigsten starten, dann erweitern",
          "Einführen, schulen und weiter betreuen",
        ],
        priceLabel: "Preis",
        priceText: "Auf Anfrage. Bei festem Umfang gibt es Festpreise für einzelne Ausbaustufen.",
        referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Zu viele Informationen an zu vielen Orten?",
        ctaText: "Im Erstgespräch zeigt sich, wie ein Panel für den eigenen Betrieb aussehen kann.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Customer Portals & Admin Panels",
        summary:
          "A panel of its own that structures the business: from project management through customers and orders to automation.",
        intro:
          "Many businesses run spreadsheets, emails and notes side by side. A panel brings *structure*: projects, tasks, customers and documents in one place, recurring steps run automatically. The team sees what needs doing, customers find their documents themselves. It is built on a proven system that Tracht Digital Solutions runs itself – not from scratch.",
        situationsTitle: "Typical situations",
        situations: [
          "Orders and customer data are spread across spreadsheets, emails and folders.",
          "Customers ask for information they could look up themselves.",
          "There is no overview of where things stand.",
        ],
        responsibilitiesTitle: "Scope of services",
        responsibilities: [
          "Project management, customers, orders and documents in one system",
          "Automation for recurring steps, e.g. reminders and status emails",
          "Roles and secure logins for team and customers",
          "Data migration, rollout and ongoing support",
        ],
        outcomesTitle: "Results",
        outcomes: [
          "A clear structure: where things stand at a glance",
          "All important information in one place, on mobile too",
          "Customers handle requests themselves in the portal",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "Accounting and payroll stay in the programs made for them.",
          "What a ready-made program does well is not rebuilt.",
        ],
        processTitle: "Approach",
        process: [
          "Capture workflows and roles",
          "Start with what matters most, then extend",
          "Roll out, train and keep supporting",
        ],
        priceLabel: "Price",
        priceText: "On request. Once the scope is set, fixed prices for single stages.",
        referencesLabel: "Published only with the client's approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Too much information in too many places?",
        ctaText: "An initial consultation shows what a panel for the business can look like.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    id: "process",
    number: "02",
    cmsKey: "service_process",
    // The SLUG still says "prozessoptimierung" while the title says "Abläufe
    // digitalisieren", and that is on purpose: the rename (2026-09-29) was
    // about the word a customer reads, not about the URL. Changing the slug
    // would cost a redirect and every inbound link for a word nobody types
    // into a browser bar anyway. `Prozessoptimierung` survives as a keyword
    // chip and inside the title, because it IS what people search for.
    slug: { de: "prozessoptimierung", en: "process-optimization" },
    seoTitle: {
      de: "Digitale Buchführung & Projektmanagement — Tracht Digital",
      en: "Digital Bookkeeping & Project Management — Tracht Digital",
    },
    // 2026-10-12: named by what gets brought in — digital bookkeeping and a
    // project management system — with the workflow around it.
    updatedAt: "2026-10-12",
    keywords: {
      de: ["Digitale Buchführung", "Projektmanagement", "Prozessoptimierung", "Automatisierung"],
      en: ["Digital bookkeeping", "Project management", "Process optimization", "Automation"],
    },
    tagline: {
      de: "Digitale Buchführung und Projektmanagement einführen",
      en: "Introduce digital bookkeeping and project management",
    },
    image: "/images/services/02-prozesse.webp",
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Abläufe digitalisieren",
        summary:
          "Digitale Werkzeuge im Betrieb einbinden, zum Beispiel digitale Buchführung oder ein Projektmanagementsystem, samt passender Abläufe.",
        intro:
          "Digitalisierung heißt nicht, alles neu zu machen. Oft fehlt nur ein passendes Werkzeug, *richtig eingebunden*: Belege und Rechnungen laufen digital in die Buchführung, Projekte und Aufgaben stehen in einem System statt in Mails. Auswahl, Einrichtung und die Einführung im Team gehören dazu.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Belege und Rechnungen wandern auf Papier oder per Mail hin und her.",
          "Projekte und Aufgaben stehen in Mails, auf Zetteln und in Köpfen.",
          "Dieselben Daten werden mehrfach eingetippt.",
        ],
        responsibilitiesTitle: "Leistungsumfang",
        responsibilities: [
          "Digitale Buchführung einbinden: Belege, Rechnungen, Übergabe an die Kanzlei",
          "Projektmanagementsystem auswählen, einrichten und im Team einführen",
          "Bestehende Abläufe mit dem Team aufnehmen, Zeitfresser und Fehlerquellen finden",
          "Einen einfacheren Ablauf einrichten – mit passender Automatisierung",
        ],
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Keine doppelte Dateneingabe mehr",
          "Weniger Fehler durch Handarbeit",
          "Mehr Zeit für die eigentliche Arbeit",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "Die Buchführung selbst und die Steuerberatung bleiben bei der Kanzlei.",
          "Nicht jeder Sonderfall lohnt eine Automatisierung.",
        ],
        processTitle: "Vorgehen",
        process: [
          "Ablauf mitverfolgen und dokumentieren",
          "Die größten Zeitfresser zuerst angehen",
          "Einführen und bei Bedarf nachbessern",
        ],
        priceLabel: "Preis",
        priceText: "Auf Anfrage. Sobald Ablauf und Ziel klar sind, gibt es einen Festpreis.",
        referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Welcher Ablauf kostet jede Woche Zeit?",
        ctaText: "Eine kurze Beschreibung genügt. Im Erstgespräch zeigt sich, ob sich eine Vereinfachung lohnt.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Digitalizing Workflows",
        summary:
          "Bringing digital tools into the business, for example digital bookkeeping or a project management system, with the workflows to match.",
        intro:
          "Digitalizing does not mean starting over. Often all that is missing is a fitting tool, *properly integrated*: receipts and invoices flow digitally into the bookkeeping, projects and tasks live in one system instead of in emails. Selection, setup and team onboarding are part of it.",
        situationsTitle: "Typical situations",
        situations: [
          "Receipts and invoices travel back and forth on paper or by email.",
          "Projects and tasks live in emails, on notes and in people's heads.",
          "The same data gets typed in more than once.",
        ],
        responsibilitiesTitle: "Scope of services",
        responsibilities: [
          "Integrate digital bookkeeping: receipts, invoices, hand-over to the accountant",
          "Choose a project management system, set it up and introduce it to the team",
          "Map existing workflows with the team, find time sinks and error sources",
          "Set up a simpler workflow – with the right automation",
        ],
        outcomesTitle: "Results",
        outcomes: [
          "No more double data entry",
          "Fewer mistakes from manual work",
          "More time for the actual work",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "The bookkeeping itself and tax advice stay with the accountant.",
          "Not every exception is worth automating.",
        ],
        processTitle: "Approach",
        process: [
          "Follow the workflow and document it",
          "Tackle the biggest time sinks first",
          "Roll it out and refine it",
        ],
        priceLabel: "Price",
        priceText: "On request. Once the workflow and the goal are clear, there is a fixed price.",
        referencesLabel: "Published only with the client's approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Which routine costs time every week?",
        ctaText: "A short description is enough. An initial consultation shows whether simplifying it pays off.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    id: "consulting",
    number: "03",
    cmsKey: "service_consulting",
    slug: { de: "beratung-konzeption", en: "consulting-planning" },
    seoTitle: {
      de: "IT- & Digitalisierungsberatung, Konzeption — Tracht Digital",
      en: "IT & Digital Consulting and Planning — Tracht Digital",
    },
    // 2026-10-12: consulting and concept work on what is needed, with the
    // whole of the know-how behind every other service.
    updatedAt: "2026-10-12",
    keywords: {
      de: ["Bedarf klären", "Fachwissen", "Konzeption", "Fahrplan"],
      en: ["Needs assessment", "Expertise", "Concept", "Roadmap"],
    },
    tagline: {
      de: "Klären, was gebraucht wird – mit Fachwissen und Konzept",
      en: "Work out what is needed – with expertise and a plan",
    },
    image: "/images/services/01-beratung.webp",
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Beratung & Konzeption",
        summary:
          "Beratung und Konzeption mit dem ganzen Fachwissen aus IT, Software und Web: was der Betrieb digital braucht, was es kostet, womit es losgeht.",
        intro:
          "Bevor etwas gekauft oder gebaut wird, steht eine Frage: *Was wird gebraucht?* Die Beratung bringt das ganze Fachwissen aus IT, Software und Web ein und geht vom Betrieb aus, nicht vom Produkt. Am Ende steht fest, was sich lohnt, was es kostet und was zuerst kommt. Auch dann, wenn die Antwort lautet: noch nicht.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Es gibt viele Ideen, aber keine Reihenfolge.",
          "Eine größere Anschaffung soll vorher geprüft werden.",
          "Mehrere Systeme oder Anbieter müssen zusammenarbeiten.",
        ],
        responsibilitiesTitle: "Leistungsumfang",
        responsibilities: [
          "Bedarf klären: was der Betrieb digital braucht und was nicht",
          "Ziele, Abläufe und vorhandene Technik aufnehmen",
          "Möglichkeiten und Kosten verständlich vergleichen",
          "Konzept mit umsetzbarem Fahrplan",
        ],
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Ein klarer Startpunkt",
          "Die Kosten sind bekannt, bevor entschieden wird",
          "Teure Fehlentscheidungen werden vermieden",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "Beratung ersetzt keinen Anwalt und keine Steuerberatung.",
          "Die Umsetzung wird getrennt vereinbart.",
        ],
        processTitle: "Vorgehen",
        process: [
          "Ausgangslage und Ziel aufnehmen",
          "Möglichkeiten bewerten",
          "Fahrplan festhalten – dann umsetzen oder übergeben",
        ],
        priceLabel: "Preis",
        priceText: "Auf Anfrage. Für ein klar abgegrenztes Konzept gibt es einen Festpreis.",
        referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Erst Klarheit, dann Entscheidung?",
        ctaText: "Eine kurze Schilderung der Lage genügt. Im Erstgespräch wird geklärt, welche Frage zuerst dran ist.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Consulting & Planning",
        summary:
          "Consulting and planning with full expertise in IT, software and the web: what the business needs digitally, what it costs, where to start.",
        intro:
          "Before anything is bought or built, there is one question: *what is needed?* The consulting brings full expertise in IT, software and the web and starts from the business, not the product. At the end it is clear what pays off, what it costs and what comes first. Including when the answer is: not yet.",
        situationsTitle: "Typical situations",
        situations: [
          "There are plenty of ideas, but no order to them.",
          "A larger investment should be checked first.",
          "Several systems or suppliers have to work together.",
        ],
        responsibilitiesTitle: "Scope of services",
        responsibilities: [
          "Work out what the business needs digitally – and what not",
          "Capture goals, workflows and existing technology",
          "Compare options and costs in plain language",
          "Concept with an actionable roadmap",
        ],
        outcomesTitle: "Results",
        outcomes: [
          "A clear starting point",
          "Costs are known before deciding",
          "Expensive wrong turns are avoided",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "Consulting does not replace a lawyer or tax adviser.",
          "Implementation is agreed separately.",
        ],
        processTitle: "Approach",
        process: [
          "Capture the situation and the goal",
          "Weigh the options",
          "Write down the roadmap – then build or hand over",
        ],
        priceLabel: "Price",
        priceText: "On request. A clearly bounded concept gets a fixed price.",
        referencesLabel: "Published only with the client's approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Clarity before a decision?",
        ctaText: "A short description of the situation is enough. The initial consultation settles which question comes first.",
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
      de: "Auftragsprogrammierung & Automatisierung — Tracht Digital",
      en: "Custom Programming & Automation — Tracht Digital",
    },
    // 2026-10-12: leads with contract programming — small tools and scripts
    // that take over dull data handling and repetitive clicking.
    updatedAt: "2026-10-12",
    keywords: {
      de: ["Auftragsprogrammierung", "Automatisierung", "Schnittstellen", "Eigene Tools"],
      en: ["Contract programming", "Automation", "Integrations", "Custom tools"],
    },
    tagline: {
      de: "Tools und Skripte statt Handarbeit",
      en: "Tools and scripts instead of manual work",
    },
    image: "/images/services/03-loesungen.webp",
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Individuelle Lösungen",
        summary:
          "Auftragsprogrammierung für Betriebe: Tools und Automatisierungsskripte übernehmen stumpfe Datenverarbeitung und Klickarbeit.",
        intro:
          "Daten abtippen, Listen abgleichen, jeden Tag dieselben Klicks: Solche Arbeit kann ein Tool oder Skript übernehmen. Entwickelt wird es im Auftrag, passend zum jeweiligen Ablauf. Die vorhandene Technik bleibt, ergänzt wird *nur, was fehlt*.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Daten werden abgetippt oder jeden Tag dieselben Schritte geklickt.",
          "Mehrere Programme arbeiten nicht zusammen.",
          "Die Standardsoftware kann eine Besonderheit des Betriebs nicht.",
        ],
        responsibilitiesTitle: "Leistungsumfang",
        responsibilities: [
          "Auftragsprogrammierung: Tools und Automatisierungsskripte für Datenverarbeitung und Klickarbeit",
          "Schnittstellen zwischen vorhandenen Programmen",
          "Abwägen: Standardprodukt, Schnittstelle oder Eigenbau",
          "Entwicklung und Test nach klarer Aufgabenstellung",
          "Übergabe, Dokumentation und weitere Betreuung",
        ],
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Stumpfe Handarbeit erledigt ein Skript",
          "Die Programme arbeiten zusammen",
          "Lesbarer, dokumentierter Quellcode",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "Bewährte Standardsoftware wird nicht ohne Grund neu gebaut.",
          "Schnittstellen gehen nur so weit, wie die Anbieter sie zulassen.",
        ],
        processTitle: "Vorgehen",
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
        ctaTitle: "Zu viel Handarbeit am Bildschirm?",
        ctaText: "Eine kurze Beschreibung des Ablaufs genügt. Im Erstgespräch wird geklärt, was sich automatisieren lässt.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Tailored Solutions",
        summary:
          "Contract programming for businesses: tools and automation scripts take over dull data handling and repetitive clicking.",
        intro:
          "Typing data over, matching lists, the same clicks every day: a tool or script can take over that work. It is developed to order, fitted to the workflow. Existing technology stays; only *what is missing* is added.",
        situationsTitle: "Typical situations",
        situations: [
          "Data is typed over or the same steps are clicked every day.",
          "Several programs do not work together.",
          "Standard software cannot handle a quirk of the business.",
        ],
        responsibilitiesTitle: "Scope of services",
        responsibilities: [
          "Contract programming: tools and automation scripts for data handling and repetitive clicking",
          "Integrations between existing programs",
          "Weigh it up: off-the-shelf, integration or custom build",
          "Development and testing against a clear brief",
          "Hand-over, documentation and ongoing support",
        ],
        outcomesTitle: "Results",
        outcomes: [
          "A script does the dull manual work",
          "The programs work together",
          "Readable, documented source code",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "Proven standard software is not rebuilt without reason.",
          "Integrations go only as far as the vendors allow.",
        ],
        processTitle: "Approach",
        process: [
          "Capture goals and existing technology",
          "Build and test in clear stages",
          "Roll out and keep supporting",
        ],
        priceLabel: "Price",
        priceText: "On request. Once the scope is set, fixed prices for single stages.",
        referencesLabel: "Published only with the client's approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Too much manual work at the screen?",
        ctaText: "A short description of the workflow is enough. The initial consultation settles what can be automated.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    // The broadest of the five, and deliberately so: a site, a shop and the
    // marketing that brings people to them are one job, not three. Marketing
    // was briefly its own service; splitting it made the visitor choose
    // between building a presence and being found through it, which is not a
    // choice a small business has. The ad-budget sentence in `boundaries`
    // came from that entry and has to stay — a fixed price on its own
    // understates what running ads actually costs.
    id: "web-presence",
    number: "05",
    cmsKey: "service_web_presence",
    slug: { de: "webauftritt", en: "web-presence" },
    seoTitle: {
      de: "Individuelle Website erstellen lassen — Tracht Digital",
      en: "Custom Websites Built Around Each Business — Tracht Digital",
    },
    // 2026-10-12: the page now leads with what sets the work apart — a site
    // made for this business and its customers, not a template and not
    // generated filler. Taking over existing sites is still offered, second.
    updatedAt: "2026-10-12",
    // "SEO & KI-Suche" rather than "Google Ads & SEO": being found now means
    // two different machines reading the same page, and the second one is the
    // search this site can speak to from its own work. Google Ads is still
    // named in `responsibilities` below, where it belongs — it is a service,
    // not a thing somebody types into a search box.
    keywords: {
      de: ["Individuelle Websites", "Onlineshops", "Passend zum Firmenbild", "SEO & KI-Suche"],
      en: ["Custom websites", "Online shops", "True to the brand", "SEO & AI search"],
    },
    tagline: {
      de: "Websites nach Maß statt Vorlage",
      en: "Made-to-measure websites, not templates",
    },
    image: "/images/services/04-webauftritt.webp",
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Webauftritt",
        summary:
          "Websites und Shops nach Maß: ausgerichtet auf die Kunden und passend zum Firmenbild, ohne Baukasten-Vorlage und ohne KI-Einheitstext.",
        intro:
          "Viele Websites sehen gleich aus: dieselbe Vorlage, dieselben Floskeln, oft von einer KI geschrieben. Eine Website von Tracht Digital Solutions sieht nach dem Betrieb aus, für den sie gebaut ist. Am Anfang steht die Frage, *wer die Kunden sind* und was sie suchen – Gestaltung, Texte und Funktionen folgen daraus. Bestehende Seiten werden auch übernommen; ersetzt wird nur, was im Weg steht.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Die Website sieht aus wie viele andere – Texte und Bilder wirken austauschbar.",
          "Die Seite ist veraltet oder der Shop macht Ärger.",
          "Die Seite sieht gut aus, aber kaum jemand fragt an.",
        ],
        responsibilitiesTitle: "Leistungsumfang",
        responsibilities: [
          "Gestaltung passend zum Firmenbild, für Handy und Bildschirm",
          "Aufbau und Texte aus Sicht der Kunden, nicht aus einer Vorlage",
          "Onlineshops einrichten oder reparieren, z. B. WooCommerce oder Shopware 6",
          "Übernahme bestehender Seiten auf WordPress, TYPO3 oder bei STRATO",
          "Marketing: Auffindbarkeit bei Google und in KI-Antworten (SEO und GEO), Google Ads und Unternehmensprofil",
        ],
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Eine Website, die auf den ersten Blick zum Betrieb gehört",
          "Besucher verstehen sofort das Angebot",
          "Gefunden werden – bei Google und in KI-Antworten",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "Das Werbebudget für Anzeigen geht direkt an Google.",
          "Texte, Fotos und Rechtstexte brauchen Zuarbeit aus dem Betrieb.",
          "Platzierungen bei Google lassen sich nicht kaufen – in KI-Antworten genauso wenig.",
        ],
        processTitle: "Vorgehen",
        process: [
          "Kunden, Ziele und Firmenbild kennenlernen",
          "Gestaltung und Texte entwerfen und gemeinsam abstimmen",
          "Bauen, online stellen und sichtbar machen",
        ],
        priceLabel: "Preis",
        priceText:
          "Festpreise ab 390 € netto, alles andere auf Anfrage.",
        referencesLabel: "Veröffentlicht nur mit Freigabe der Kunden.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Eine Website, die nach dem eigenen Betrieb aussieht?",
        ctaText: "Im Erstgespräch geht es um Betrieb, Kunden und den sinnvollen Umfang.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Web Presence",
        summary:
          "Made-to-measure websites and shops: built around the customers and true to the brand, without site-builder templates or generic AI copy.",
        intro:
          "Many websites look the same: the same template, the same phrases, often written by an AI. A website by Tracht Digital Solutions looks like the business it is built for. It starts with *who the customers are* and what they look for – design, copy and features follow from that. Existing sites are taken over too; only what stands in the way is replaced.",
        situationsTitle: "Typical situations",
        situations: [
          "The website looks like many others – copy and images feel interchangeable.",
          "The site is outdated or the shop is causing problems.",
          "The site looks good, but hardly anyone gets in touch.",
        ],
        responsibilitiesTitle: "Scope of services",
        responsibilities: [
          "Design true to the brand, for phones and screens",
          "Structure and copy from the customers' point of view, not a template",
          "Set up or repair online shops, e.g. WooCommerce or Shopware 6",
          "Take over existing sites on WordPress, TYPO3 or at STRATO",
          "Marketing: findability on Google and in AI answers (SEO and GEO), Google Ads and business profile",
        ],
        outcomesTitle: "Results",
        outcomes: [
          "A website that recognisably belongs to the business",
          "Visitors understand the offer straight away",
          "Being found – on Google and in AI answers",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "The ad budget goes to Google directly.",
          "Copy, photos and legal texts need input from the business.",
          "Google rankings cannot be bought – nor can a mention in an AI answer.",
        ],
        processTitle: "Approach",
        process: [
          "Get to know customers, goals and brand",
          "Draft design and copy and agree on them together",
          "Build, put online and make visible",
        ],
        priceLabel: "Price",
        priceText:
          "Fixed prices from €390 net, everything else on request.",
        referencesLabel: "Published only with the client's approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "A website that looks like the business?",
        ctaText: "The initial consultation covers the business, its customers and a sensible scope.",
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
