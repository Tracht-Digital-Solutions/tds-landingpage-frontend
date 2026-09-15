import type { Lang } from "./i18n";
import { getProcessDetails } from "./processDetails";

/**
 * The home page's process section ("So arbeiten wir zusammen"), as committed
 * copy.
 *
 * It used to come from tds-shared (`translations.process`), which is shared
 * with every site and addressed the reader formally. Since 2026-09-15 this site
 * says "du", and changing the shared bundle for one site's tone would have
 * meant a shared release and a repin across every consumer. The copy is
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
  de: {
    label: "— Vorgehen",
    headline: "So arbeiten",
    headlineAccent: "wir zusammen.",
    body: "Kein starrer Ablauf: Je nach Vorhaben verschiebt sich das Gewicht. Die vier Schritte sind der übliche Rahmen – kein Korsett.",
    steps: [
      {
        number: "01",
        title: "Zuhören",
        duration: "Zum Einstieg",
        description: "Du schilderst mir, wo es hakt. Ich frage nach – und sage dir ehrlich, ob sich eine Umsetzung lohnt.",
      },
      {
        number: "02",
        title: "Konzept",
        duration: "Je nach Umfang",
        description: "Was wird gebraucht, welcher Weg ist sinnvoll, was kostet er? Die Grundlage steht, bevor Budget fließt.",
      },
      {
        number: "03",
        title: "Umsetzung",
        duration: "Nach Absprache",
        description: "Ich baue es und zeige dir Zwischenstände. Nachsteuern ist unterwegs günstig, hinterher teuer.",
      },
      {
        number: "04",
        title: "Betreuung",
        duration: "Auf Wunsch",
        description: "Übergabe, Einweisung und auf Wunsch Pflege und Anpassungen. Dein Ansprechpartner bleibe ich in jedem Fall.",
      },
    ],
  },
  en: {
    label: "— Process",
    headline: "How we",
    headlineAccent: "work together.",
    body: "No rigid process: the weight shifts with each project. The four steps are the usual frame, not a straitjacket.",
    steps: [
      {
        number: "01",
        title: "Listen",
        duration: "To start",
        description: "You tell me where things get stuck. I ask questions – and tell you honestly whether building something is worth it.",
      },
      {
        number: "02",
        title: "Concept",
        duration: "Depending on scope",
        description: "What is needed, which route makes sense, what does it cost? The groundwork is laid before any budget is spent.",
      },
      {
        number: "03",
        title: "Build",
        duration: "As agreed",
        description: "I build it and show you work in progress. Adjusting along the way is cheap; afterwards it is expensive.",
      },
      {
        number: "04",
        title: "Support",
        duration: "If you want",
        description: "Handover, a walkthrough and, if you like, upkeep and changes. I remain your point of contact either way.",
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
