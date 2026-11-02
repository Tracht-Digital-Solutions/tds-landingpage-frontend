/**
 * Leistungsassistent — three questions that point a visitor at products of the
 * Shop's service catalogue.
 *
 * The topics ARE the catalogue's categories, the recommendations ARE its
 * products (`tds-ext-shop-pkg/php/db/seed/own-*.php`). A visitor arrives with a
 * problem, so the second question names situations, and each one points at the
 * products that solve it.
 *
 * ### What it may and may not claim
 *
 * - It names no amount: prices stand in the Shop (`serviceFinder.test.ts`).
 * - It sends nothing. The result becomes a draft in the contact form's message
 *   field (`contactDraft.ts`); the visitor reads it, edits it, and submits.
 * - It addresses no one directly, like the rest of the site, and keeps every
 *   line short, so the catalogue titles here are shortened.
 *
 * **No runtime imports.** The island bundles this file; type imports only.
 */
import type { Lang } from "./i18n";
import type { ServiceId } from "./services";

type Words = Record<Lang, string>;

export const CATEGORY_IDS = [
  "webauftritt",
  "seo-sichtbarkeit",
  "digitalisierung",
  "e-mail-domain",
  "wartung-betrieb",
  "recht-datenschutz",
  "schulung",
] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export type TopicId = CategoryId | "unsure";
export type StageId = "clear" | "rough" | "open";

export const TOPIC_IDS: readonly TopicId[] = [...CATEGORY_IDS, "unsure"];
export const STAGE_IDS: readonly StageId[] = ["clear", "rough", "open"];

/** Topic, starting point, stage. The result is step `STEP_COUNT`. */
export const STEP_COUNT = 3;

/** A result shows this many products at most. */
export const MAX_MATCHES = 4;

export interface CatalogueProduct {
  id: string;
  category: CategoryId;
  slug: Words;
  title: Words;
}

const product = (category: CategoryId, de: string, en: string, titleDe: string, titleEn: string): CatalogueProduct => ({
  id: de,
  category,
  slug: { de, en },
  title: { de: titleDe, en: titleEn },
});

export const CATALOGUE_PRODUCTS: readonly CatalogueProduct[] = [
  product("webauftritt", "firmenwebsite-bis-5-seiten", "business-website-up-to-5-pages", "Firmenwebsite bis 5 Seiten", "Business website up to 5 pages"),
  product("webauftritt", "onepager-website", "one-page-website", "Onepager-Website", "One-page website"),
  product("webauftritt", "landingpage-fuer-ein-angebot", "landing-page-for-one-offer", "Landingpage für ein Angebot", "Landing page for one offer"),
  product("webauftritt", "relaunch-konzept", "website-relaunch-plan", "Relaunch-Konzept", "Website relaunch plan"),
  product("webauftritt", "online-terminbuchung-einbinden", "online-booking-on-your-website", "Online-Terminbuchung", "Online booking"),
  product("seo-sichtbarkeit", "technische-seo-grundlagen", "technical-seo-basics", "Technische SEO-Grundlagen", "Technical SEO basics"),
  product("seo-sichtbarkeit", "keyword-plan-fuer-ihre-leistungen", "keyword-plan-for-your-services", "Keyword-Plan", "Keyword plan"),
  product("seo-sichtbarkeit", "ki-sichtbarkeit-geo-verbessern", "improve-ai-visibility-geo", "KI-Sichtbarkeit (GEO)", "AI visibility (GEO)"),
  product("seo-sichtbarkeit", "strukturierte-daten-einbauen", "add-structured-data", "Strukturierte Daten", "Structured data"),
  product("seo-sichtbarkeit", "ladezeit-optimieren", "website-speed-optimisation", "Ladezeit optimieren", "Website speed optimisation"),
  product("seo-sichtbarkeit", "eintraege-in-branchenverzeichnissen", "business-directory-listings", "Einträge in Branchenverzeichnissen", "Business directory listings"),
  product("digitalisierung", "einen-ablauf-automatisieren", "automate-one-workflow", "Einen Arbeitsablauf automatisieren", "Automate one workflow"),
  product("digitalisierung", "online-formular-statt-papier", "online-form-instead-of-paper", "Online-Formular statt Papier", "Online form instead of paper"),
  product("digitalisierung", "rechnungen-digital-schreiben", "digital-invoicing-setup", "Rechnungen digital schreiben", "Digital invoicing setup"),
  product("digitalisierung", "anfragen-automatisch-als-ticket", "enquiries-as-tickets", "Anfragen automatisch als Ticket", "Enquiries as tickets"),
  product("e-mail-domain", "domain-und-e-mail-einrichten", "domain-and-email-setup", "Domain und E-Mail einrichten", "Domain and email setup"),
  product("e-mail-domain", "spf-dkim-dmarc-einrichten", "spf-dkim-dmarc-setup", "SPF, DKIM und DMARC einrichten", "SPF, DKIM and DMARC setup"),
  product("e-mail-domain", "e-mail-umzug", "email-migration", "E-Mail-Umzug", "Email migration"),
  product("e-mail-domain", "microsoft-365-einrichten", "microsoft-365-setup", "Microsoft 365 einrichten", "Microsoft 365 setup"),
  product("e-mail-domain", "google-workspace-einrichten", "google-workspace-setup", "Google Workspace einrichten", "Google Workspace setup"),
  product("wartung-betrieb", "website-wartung-12-monate", "website-maintenance-12-months", "Website-Wartung für 12 Monate", "Website maintenance for 12 months"),
  product("wartung-betrieb", "sicherheits-update-wordpress", "wordpress-security-update", "Sicherheits-Update für WordPress", "WordPress security update"),
  product("wartung-betrieb", "backup-einrichten-und-testen", "website-backup-setup-and-test", "Backup einrichten und testen", "Backup setup and test"),
  product("wartung-betrieb", "gehackte-website-bereinigen", "hacked-website-clean-up", "Gehackte Website bereinigen", "Hacked website clean-up"),
  product("wartung-betrieb", "website-umzug-zu-neuem-hoster", "website-move-to-new-host", "Website-Umzug zu neuem Hoster", "Website move to a new host"),
  product("recht-datenschutz", "impressum-und-datenschutz-einbinden", "legal-notice-and-privacy-policy-setup", "Impressum und Datenschutz einbinden", "Legal notice and privacy policy setup"),
  product("recht-datenschutz", "cookie-banner-einrichten", "cookie-consent-banner-setup", "Cookie-Banner einrichten", "Cookie consent banner setup"),
  product("recht-datenschutz", "barrierefreiheits-check-bfsg", "accessibility-check", "Barrierefreiheits-Check", "Accessibility check"),
  product("recht-datenschutz", "externe-dienste-pruefen", "external-services-check", "Externe Dienste prüfen", "External services check"),
  product("schulung", "website-selbst-pflegen-einweisung", "maintain-your-website-yourself", "Website selbst pflegen", "Maintaining the website in-house"),
  product("schulung", "ki-im-buero-workshop", "ai-at-work-workshop", "KI im Büro: Workshop", "AI at work: workshop"),
  product("schulung", "it-sicherheit-fuer-mitarbeitende", "it-security-awareness-training", "IT-Sicherheit für Mitarbeitende", "IT security awareness training"),
  product("schulung", "e-mail-postfach-im-griff", "get-your-inbox-under-control", "E-Mail-Postfach im Griff", "Inbox under control"),
];

export interface CatalogueCategory {
  name: Words;
  /** The answer to "what matters most". */
  topic: Words;
  /** Recommended as soon as the topic is chosen. */
  lead: readonly string[];
  situations: readonly { text: Words; products: readonly string[] }[];
  /** The contact form's reason for this category (`sections/Contact.astro`). */
  contact: ServiceId;
}

/** Keyed in `CATEGORY_IDS` order; products are named by their German slug. */
export const CATALOGUE: Record<CategoryId, CatalogueCategory> = {
  webauftritt: {
    name: { de: "Webauftritt", en: "Websites" },
    topic: { de: "Eine neue oder bessere Website", en: "A new or better website" },
    lead: ["firmenwebsite-bis-5-seiten", "onepager-website"],
    contact: "web-presence",
    situations: [
      { text: { de: "Es gibt noch keine Website.", en: "There is no website yet." }, products: ["onepager-website", "firmenwebsite-bis-5-seiten"] },
      { text: { de: "Die Website ist veraltet.", en: "The website is out of date." }, products: ["relaunch-konzept", "firmenwebsite-bis-5-seiten"] },
      { text: { de: "Ein einzelnes Angebot soll beworben werden.", en: "One offer needs promoting." }, products: ["landingpage-fuer-ein-angebot"] },
      { text: { de: "Termine laufen nur über das Telefon.", en: "Appointments only happen by phone." }, products: ["online-terminbuchung-einbinden"] },
    ],
  },
  "seo-sichtbarkeit": {
    name: { de: "SEO & Sichtbarkeit", en: "SEO & visibility" },
    topic: { de: "Besser gefunden werden", en: "Getting found" },
    lead: ["technische-seo-grundlagen", "ki-sichtbarkeit-geo-verbessern"],
    contact: "web-presence",
    situations: [
      { text: { de: "Bei Google taucht der Betrieb kaum auf.", en: "The business barely shows up on Google." }, products: ["technische-seo-grundlagen", "keyword-plan-fuer-ihre-leistungen"] },
      { text: { de: "Die Website lädt langsam.", en: "The website loads slowly." }, products: ["ladezeit-optimieren"] },
      { text: { de: "KI-Assistenten nennen den Betrieb nicht.", en: "AI assistants do not mention the business." }, products: ["ki-sichtbarkeit-geo-verbessern", "strukturierte-daten-einbauen"] },
      { text: { de: "Einträge in Verzeichnissen fehlen.", en: "Directory listings are missing." }, products: ["eintraege-in-branchenverzeichnissen"] },
    ],
  },
  digitalisierung: {
    name: { de: "Digitalisierung", en: "Digitalisation" },
    topic: { de: "Abläufe vereinfachen", en: "Simpler workflows" },
    lead: ["einen-ablauf-automatisieren", "online-formular-statt-papier"],
    contact: "process",
    situations: [
      { text: { de: "Formulare laufen auf Papier.", en: "Forms are still on paper." }, products: ["online-formular-statt-papier"] },
      { text: { de: "Rechnungen entstehen von Hand.", en: "Invoices are written by hand." }, products: ["rechnungen-digital-schreiben"] },
      { text: { de: "Anfragen gehen im Postfach unter.", en: "Enquiries get lost in the inbox." }, products: ["anfragen-automatisch-als-ticket"] },
      { text: { de: "Dieselbe Aufgabe kehrt ständig wieder.", en: "The same task keeps coming back." }, products: ["einen-ablauf-automatisieren"] },
    ],
  },
  "e-mail-domain": {
    name: { de: "E-Mail & Domain", en: "Email & domain" },
    topic: { de: "E-Mail, Domain oder Microsoft 365", en: "Email, domain or Microsoft 365" },
    lead: ["domain-und-e-mail-einrichten"],
    contact: "web-presence",
    situations: [
      { text: { de: "E-Mails laufen nicht über die eigene Domain.", en: "Email does not run on the company's own domain." }, products: ["domain-und-e-mail-einrichten"] },
      { text: { de: "E-Mails landen im Spam.", en: "Emails end up in spam." }, products: ["spf-dkim-dmarc-einrichten"] },
      { text: { de: "Der E-Mail-Anbieter soll wechseln.", en: "The email provider needs changing." }, products: ["e-mail-umzug"] },
      { text: { de: "Das Team braucht gemeinsame Kalender und Dateien.", en: "The team needs shared calendars and files." }, products: ["microsoft-365-einrichten", "google-workspace-einrichten"] },
    ],
  },
  "wartung-betrieb": {
    name: { de: "Wartung & Betrieb", en: "Maintenance & operations" },
    topic: { de: "Die Website sicher betreiben", en: "Running the website safely" },
    lead: ["website-wartung-12-monate"],
    contact: "web-presence",
    situations: [
      { text: { de: "Updates bleiben liegen.", en: "Updates keep being put off." }, products: ["website-wartung-12-monate", "sicherheits-update-wordpress"] },
      { text: { de: "Es gibt keine geprüfte Sicherung.", en: "There is no tested backup." }, products: ["backup-einrichten-und-testen"] },
      { text: { de: "Die Website wurde gehackt.", en: "The website was hacked." }, products: ["gehackte-website-bereinigen"] },
      { text: { de: "Der Hoster soll wechseln.", en: "The host needs changing." }, products: ["website-umzug-zu-neuem-hoster"] },
    ],
  },
  "recht-datenschutz": {
    name: { de: "Recht & Datenschutz", en: "Legal & privacy" },
    topic: { de: "Rechtstexte, Datenschutz, Barrierefreiheit", en: "Legal texts, privacy, accessibility" },
    lead: ["impressum-und-datenschutz-einbinden", "cookie-banner-einrichten"],
    contact: "web-presence",
    situations: [
      { text: { de: "Impressum oder Datenschutz fehlen.", en: "Legal notice or privacy policy are missing." }, products: ["impressum-und-datenschutz-einbinden"] },
      { text: { de: "Ein Cookie-Banner fehlt.", en: "A cookie banner is missing." }, products: ["cookie-banner-einrichten"] },
      { text: { de: "Die Barrierefreiheit ist ungeprüft.", en: "Accessibility has not been checked." }, products: ["barrierefreiheits-check-bfsg"] },
      { text: { de: "Unklar, welche Daten an Dritte gehen.", en: "Unclear which data reaches third parties." }, products: ["externe-dienste-pruefen"] },
    ],
  },
  schulung: {
    name: { de: "Schulung", en: "Training" },
    topic: { de: "Das Team schulen", en: "Training the team" },
    lead: ["website-selbst-pflegen-einweisung"],
    contact: "consulting",
    situations: [
      { text: { de: "Die Website soll selbst gepflegt werden.", en: "The website should be maintained in-house." }, products: ["website-selbst-pflegen-einweisung"] },
      { text: { de: "KI soll im Büro sinnvoll helfen.", en: "AI should help sensibly at work." }, products: ["ki-im-buero-workshop"] },
      { text: { de: "Das Team soll Phishing erkennen.", en: "The team should spot phishing." }, products: ["it-sicherheit-fuer-mitarbeitende"] },
      { text: { de: "Das Postfach läuft über.", en: "The inbox is overflowing." }, products: ["e-mail-postfach-im-griff"] },
    ],
  },
};

/** What the island receives per product, its link resolved on the server. */
export interface FinderProduct {
  id: string;
  title: string;
  categoryName: string;
  href: string;
}

export interface SituationChoice {
  /** `<categoryId>:<index>` — stable while the offered list does not change. */
  key: string;
  category: CategoryId;
  text: string;
  products: readonly string[];
}

export interface FinderAnswers {
  topics: readonly TopicId[];
  situations: readonly SituationChoice[];
  stage: StageId | null;
}

export interface FinderMatch {
  productId: string;
  score: number;
  /** The visitor's own choices that pointed here, in the order they were made. */
  reasons: string[];
}

/* A recognised situation names the problem (3); the topic alone only points at
   the category's usual start (2). */
const TOPIC_WEIGHT = 2;
const SITUATION_WEIGHT = 3;

interface FinderCopy {
  progress: (step: number, total: number) => string;
  resultLabel: string;
  topicsQuestion: string;
  topicsHelp: string;
  unsure: { label: string; hint: string };
  situationsQuestion: string;
  situationsHelp: string;
  stageQuestion: string;
  stageHelp: string;
  stages: Record<StageId, { label: string; hint: string }>;
  pickOne: string;
  pickStage: string;
  next: string;
  back: string;
  showResult: string;
  restart: string;
  resultTitle: string;
  rankBest: string;
  rankAlso: string;
  whyLabel: string;
  detailLink: string;
  noMatch: string;
  note: string;
  catalogueLink: string;
  cta: string;
  handoffNote: string;
  draft: { intro: string; services: string; situations: string; stage: string };
}

export const FINDER_COPY: Record<Lang, FinderCopy> = {
  de: {
    progress: (step, total) => `Schritt ${step} von ${total}`,
    resultLabel: "Ergebnis",
    topicsQuestion: "Worum geht es vor allem?",
    topicsHelp: "Mehrfachauswahl möglich.",
    unsure: { label: "Noch unklar", hint: "Dann wird zuerst gemeinsam sortiert." },
    situationsQuestion: "Was davon kommt im Betrieb vor?",
    situationsHelp: "Mehrfachauswahl möglich – oder einfach weiter.",
    stageQuestion: "Wie weit ist das Vorhaben?",
    stageHelp: "Eine Antwort.",
    stages: {
      clear: { label: "Klar umrissen", hint: "Ziel und Umfang stehen fest." },
      rough: { label: "Eine grobe Idee", hint: "Die Richtung steht, die Details noch nicht." },
      open: { label: "Noch ganz offen", hint: "Erst sortieren, was dran ist." },
    },
    pickOne: "Bitte mindestens eine Antwort wählen.",
    pickStage: "Bitte eine Antwort wählen.",
    next: "Weiter",
    back: "Zurück",
    showResult: "Ergebnis anzeigen",
    restart: "Neu starten",
    resultTitle: "Das passt zum Anliegen",
    rankBest: "Passt am besten",
    rankAlso: "Passt ebenfalls",
    whyLabel: "Angaben dazu:",
    detailLink: "Im Shop ansehen",
    noMatch: "Das lässt sich am besten im Erstgespräch sortieren.",
    note: "Eine erste Orientierung. Was genau passt, klären wir im Erstgespräch.",
    catalogueLink: "Alle Leistungen",
    cta: "Mit dieser Auswahl Erstgespräch vereinbaren",
    handoffNote: "Die Auswahl landet im Kontaktformular. Gesendet wird erst beim Absenden.",
    draft: {
      intro: "Aus dem Leistungsassistenten:",
      services: "Passende Leistungen",
      situations: "Ausgangslage",
      stage: "Stand",
    },
  },
  en: {
    progress: (step, total) => `Step ${step} of ${total}`,
    resultLabel: "Result",
    topicsQuestion: "What matters most?",
    topicsHelp: "Choose as many as apply.",
    unsure: { label: "Not clear yet", hint: "Then things get sorted out together first." },
    situationsQuestion: "Which of these happen in the business?",
    situationsHelp: "Choose as many as apply – or just continue.",
    stageQuestion: "How far along is the project?",
    stageHelp: "One answer.",
    stages: {
      clear: { label: "Clearly defined", hint: "Goal and scope are settled." },
      rough: { label: "A rough idea", hint: "The direction is set, the details are not." },
      open: { label: "Still completely open", hint: "First work out what needs doing." },
    },
    pickOne: "Please choose at least one answer.",
    pickStage: "Please choose one answer.",
    next: "Next",
    back: "Back",
    showResult: "Show result",
    restart: "Start again",
    resultTitle: "What fits the request",
    rankBest: "Best fit",
    rankAlso: "Also fits",
    whyLabel: "Answers given:",
    detailLink: "View in the shop",
    noMatch: "This is best sorted out in a first conversation.",
    note: "A first sense of direction. We work out exactly what fits in the first conversation.",
    catalogueLink: "All services",
    cta: "Arrange an initial consultation with this selection",
    handoffNote: "The selection goes into the contact form. Nothing is sent until it is submitted.",
    draft: {
      intro: "From the service assistant:",
      services: "Matching services",
      situations: "Starting point",
      stage: "Stage",
    },
  },
};

/** The dialog around the assistant, and the tile that opens it. */
export const FINDER_SECTION: Record<
  Lang,
  { title: string; intro: string; close: string; tileKind: string; tileTitle: string }
> = {
  de: {
    title: "Welche Leistung passt?",
    intro: "Drei kurze Fragen. Danach ist klar, welche Leistungen aus dem Shop passen.",
    close: "Leistungsassistent schließen",
    tileKind: "Leistungsassistent",
    tileTitle: "Welche Leistung passt?",
  },
  en: {
    title: "Which service fits?",
    intro: "Three short questions. Then it is clear which services from the shop fit.",
    close: "Close the service assistant",
    tileKind: "Service assistant",
    tileTitle: "Which service fits?",
  },
};

/** Label and hint of a first-step answer. */
export function topicWords(id: TopicId, lang: Lang): { label: string; hint: string } {
  if (id === "unsure") return FINDER_COPY[lang].unsure;
  return { label: CATALOGUE[id].topic[lang], hint: CATALOGUE[id].name[lang] };
}

/**
 * The starting points offered in step two: those of the chosen categories, or a
 * few of each when none was chosen. Never more than eight: a longer list is a
 * wall nobody reads on a phone.
 */
export function situationOptions(topics: readonly TopicId[], lang: Lang): SituationChoice[] {
  const chosen = CATEGORY_IDS.filter((id) => topics.includes(id));
  const ids = chosen.length > 0 ? chosen : CATEGORY_IDS;
  const perCategory = Math.min(4, Math.max(1, Math.floor(8 / ids.length)));
  return ids.flatMap((category) =>
    CATALOGUE[category].situations.slice(0, perCategory).map((situation, index) => ({
      key: `${category}:${index}`,
      category,
      text: situation.text[lang],
      products: situation.products,
    })),
  );
}

/** Products worth suggesting, strongest first, catalogue order on a tie. Empty when nothing pointed anywhere. */
export function recommend(answers: FinderAnswers, lang: Lang): FinderMatch[] {
  const tally = new Map<string, { score: number; reasons: string[] }>();
  const add = (id: string, weight: number, reason: string) => {
    const entry = tally.get(id) ?? { score: 0, reasons: [] };
    entry.score += weight;
    if (!entry.reasons.includes(reason)) entry.reasons.push(reason);
    tally.set(id, entry);
  };

  for (const topic of answers.topics) {
    if (topic === "unsure") continue;
    for (const id of CATALOGUE[topic].lead) add(id, TOPIC_WEIGHT, CATALOGUE[topic].topic[lang]);
  }
  for (const choice of answers.situations) {
    for (const id of choice.products) add(id, SITUATION_WEIGHT, choice.text);
  }

  const order = (id: string) => CATALOGUE_PRODUCTS.findIndex((item) => item.id === id);
  return [...tally.entries()]
    .map(([productId, entry]) => ({ productId, ...entry }))
    .sort((a, b) => b.score - a.score || order(a.productId) - order(b.productId))
    .slice(0, MAX_MATCHES);
}

/**
 * What is handed to the contact form — the visitor's choices, nothing invented.
 * `service` is the strongest match's contact reason, an id rather than a label:
 * `sections/Contact.astro` owns the mapping to its CMS-editable options.
 */
export function buildDraft(
  matches: readonly FinderMatch[],
  answers: FinderAnswers,
  lang: Lang,
): { message: string; service: ServiceId } {
  const { draft, stages, unsure } = FINDER_COPY[lang];
  const products = matches.map((match) => CATALOGUE_PRODUCTS.find((item) => item.id === match.productId));
  const lines = [
    draft.intro,
    `${draft.services}: ${products.map((item) => item?.title[lang]).filter(Boolean).join(", ") || unsure.label}`,
  ];
  if (answers.situations.length > 0) {
    lines.push(`${draft.situations}: ${answers.situations.map((choice) => choice.text).join(" ")}`);
  }
  if (answers.stage) lines.push(`${draft.stage}: ${stages[answers.stage].label}`);
  return {
    message: `${lines.join("\n")}\n\n`,
    service: products[0] ? CATALOGUE[products[0].category].contact : "consulting",
  };
}
