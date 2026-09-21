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
    body: "Vier Schritte als Rahmen – je nach Vorhaben verschiebt sich das Gewicht.",
    steps: [
      {
        number: "01",
        title: "Zuhören",
        duration: "Zum Einstieg",
        // Bewusst NICHT der Satz aus `homeContent.firstCall.items[0]`. Beide
        // standen wortgleich auf derselben Seite, 26 Zeilen auseinander. Was
        // das Erstgespräch ist, sagt das Formular nach dem Absenden; dieser
        // Schritt sagt, was daraus folgt.
        description: "Du zeigst mir, was du hast. Ich sage dir, was sich lohnt und was nicht.",
      },
      {
        number: "02",
        title: "Konzept",
        duration: "Je nach Umfang",
        description: "Wir legen fest, was gebraucht wird und was es kostet – bevor Budget fließt.",
      },
      {
        number: "03",
        title: "Umsetzung",
        duration: "Nach Absprache",
        description: "Ich baue es und zeige dir früh Zwischenstände.",
      },
      {
        number: "04",
        title: "Betreuung",
        duration: "Auf Wunsch",
        description: "Übergabe mit Einweisung. Danach bleibe ich dein Ansprechpartner.",
      },
    ],
  },
  en: {
    label: "— Process",
    headline: "How we",
    headlineAccent: "work together.",
    body: "Four steps as a frame – the weight shifts with each project.",
    steps: [
      {
        number: "01",
        title: "Listen",
        duration: "To start",
        description: "You show me what you have. I tell you what is worth doing and what is not.",
      },
      {
        number: "02",
        title: "Concept",
        duration: "Depending on scope",
        description: "We settle what is needed and what it costs – before any budget is spent.",
      },
      {
        number: "03",
        title: "Build",
        duration: "As agreed",
        description: "I build it and show you work in progress early.",
      },
      {
        number: "04",
        title: "Support",
        duration: "If you want",
        description: "Handover with a walkthrough. After that I remain your point of contact.",
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
