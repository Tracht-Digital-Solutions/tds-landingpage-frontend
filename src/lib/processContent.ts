import type { Lang } from "./i18n";
import { getProcessDetails } from "./processDetails";

/**
 * The home page's process section ("So arbeiten wir zusammen"), as committed
 * copy.
 *
 * It used to come from tds-shared (`translations.process`), which is shared
 * with every site and addressed the reader formally. This site addresses no
 * one directly (since 2026-10-12; "du" before), and changing the shared bundle
 * for one site's tone would have meant a shared release and a repin across
 * every consumer. The copy is
 * landing-only, so it lives here — in exactly the shape of the `process` CMS
 * block, which `sections/Process.astro` still merges over it with `cmsFor`.
 *
 * `number` keys the step's icon (`ui/ProcessIcon.astro`) and its detail line
 * (`processDetails.ts`); it is the one field that must not change.
 */
export interface ProcessStepContent {
  number: string;
  title: string;
  duration: string;
  description: string;
  detail: string;
  outcome: string;
}

export interface ProcessContent {
  label: string;
  headline: string;
  headlineAccent: string;
  body: string;
  steps: ProcessStepContent[];
}

const base: Record<Lang, Omit<ProcessContent, "steps"> & { steps: Omit<ProcessStepContent, "detail" | "outcome">[] }> = {
  // Seit 2026-10-12 ohne direkte Anrede und mit längeren Beschreibungen: jede
  // Karte beantwortet für sich, was in dem Schritt bei Tracht Digital
  // Solutions passiert und was danach vorliegt — so lässt sie sich auch
  // einzeln zitieren (Suchmaschinen und KI-Antworten).
  de: {
    label: "— Vorgehen",
    headline: "So arbeiten",
    headlineAccent: "wir zusammen.",
    body: "Ein Projekt mit Tracht Digital Solutions läuft in vier Schritten. Nach jedem liegt etwas Greifbares vor – kein Zwischenstand, den nur der Entwickler lesen kann.",
    steps: [
      {
        number: "01",
        title: "Erstgespräch",
        duration: "Der Einstieg",
        description:
          "Jedes Projekt bei Tracht Digital Solutions beginnt mit einem Gespräch per Telefon, Video oder vor Ort im Raum Hamburg. Gemeinsam wird geklärt, wo es im Betrieb hakt: bei der Website, im Shop, in Tabellen oder in wiederkehrender Handarbeit. Julian Tracht sieht sich an, was schon vorhanden ist, und sagt offen, was sich lohnt – und was nicht. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
      },
      {
        number: "02",
        title: "Konzept & Angebot",
        duration: "Bevor Budget fließt",
        description:
          "Aus dem Gespräch entsteht ein schriftliches Konzept mit Festpreis oder Budgetobergrenze. Es beschreibt, was gebaut wird, welche Systeme angebunden werden, was ausdrücklich nicht dazugehört und bis wann es fertig ist. Bestehende Websites, Shops und Programme werden weitergenutzt, wo es sinnvoll ist. Die Entscheidung fällt in Ruhe und ohne Zeitdruck.",
      },
      {
        number: "03",
        title: "Umsetzung",
        duration: "In kurzen Schritten",
        description:
          "Die Umsetzung erfolgt in kurzen Etappen mit frühen, testbaren Zwischenständen in einer eigenen Vorschau. Rückmeldungen fließen direkt in den nächsten Schritt ein, so bleiben Änderungen schnell und günstig. Datenschutz, Barrierefreiheit und Suchmaschinenoptimierung gehören von Anfang an dazu, nicht erst kurz vor dem Start.",
      },
      {
        number: "04",
        title: "Übergabe & Betreuung",
        duration: "Ohne Bindung",
        description:
          "Zum Abschluss gibt es alle Zugänge, eine verständliche Dokumentation und eine kurze Einweisung, damit Inhalte im Alltag selbst gepflegt werden können. Auf Wunsch übernimmt Tracht Digital Solutions danach Wartung, Updates und Weiterentwicklung. Eine Vertragsbindung gibt es nicht: Code, Daten und Zugänge bleiben jederzeit beim Kunden.",
      },
    ],
  },
  en: {
    label: "— Process",
    headline: "How we",
    headlineAccent: "work together.",
    body: "A project with Tracht Digital Solutions runs in four steps. Each one ends with something tangible – not a progress report only the developer can read.",
    steps: [
      {
        number: "01",
        title: "First conversation",
        duration: "The way in",
        description:
          "Every project at Tracht Digital Solutions starts with a conversation by phone, video or in person around Hamburg. Together we find out where the business gets stuck: the website, the shop, spreadsheets or recurring manual work. Julian Tracht looks at what already exists and says openly what is worth doing – and what is not. Costs only arise once we agree on an assignment.",
      },
      {
        number: "02",
        title: "Concept & quote",
        duration: "Before any budget is spent",
        description:
          "The conversation turns into a written concept with a fixed price or a budget ceiling. It sets out what gets built, which systems are connected, what is explicitly not included and when it is done. Existing websites, shops and software stay in use wherever that makes sense. The decision is made calmly and without time pressure.",
      },
      {
        number: "03",
        title: "Build",
        duration: "In short steps",
        description:
          "The build runs in short stages with early, testable work in progress on a separate preview. Feedback goes straight into the next step, which keeps changes quick and cheap. Data protection, accessibility and search engine optimisation are part of the work from the start, not an add-on shortly before launch.",
      },
      {
        number: "04",
        title: "Handover & support",
        duration: "No tie-in",
        description:
          "At the end come every login, clear documentation and a short walkthrough, so content can be maintained in day-to-day work. On request, Tracht Digital Solutions then takes on maintenance, updates and further development. There is no lock-in: code, data and logins stay with the client at all times.",
      },
    ],
  },
};

/** The section's default content: steps merged with their detail and outcome lines. */
export function getProcessContent(lang: Lang): ProcessContent {
  const details = getProcessDetails(lang);
  const { steps, ...rest } = base[lang];
  return {
    ...rest,
    steps: steps.map((step) => ({
      ...step,
      detail: details[step.number]?.detail ?? "",
      outcome: details[step.number]?.outcome ?? "",
    })),
  };
}
