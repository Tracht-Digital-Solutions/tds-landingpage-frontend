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
    body: "Vier Schritte. An jedem weißt du, was passiert und was du danach hast.",
    steps: [
      {
        number: "01",
        title: "Erstgespräch",
        // Die Zeile sagt jetzt, WANN der Schritt liegt, statt "je nach Umfang"
        // zu achselzucken — vier Schulterzucken untereinander waren der Grund,
        // warum die Liste unstrukturiert wirkte.
        duration: "Der Einstieg",
        // Bewusst NICHT der Satz aus `homeContent.firstCall.items[0]`. Beide
        // standen wortgleich auf derselben Seite, 26 Zeilen auseinander. Was
        // das Erstgespräch ist, sagt das Formular nach dem Absenden; dieser
        // Schritt sagt, was daraus folgt.
        description: "Du zeigst mir, was du hast und was dich aufhält. Ich frage nach und sage dir, was sich lohnt.",
      },
      {
        number: "02",
        title: "Konzept & Angebot",
        duration: "Bevor Budget fließt",
        description: "Ich halte fest, was gebraucht wird, welcher Weg sinnvoll ist und was er kostet.",
      },
      {
        number: "03",
        title: "Umsetzung",
        duration: "In kurzen Schritten",
        description: "Ich baue es und zeige dir früh Zwischenstände zum Ausprobieren.",
      },
      {
        number: "04",
        title: "Übergabe & Betreuung",
        duration: "Ohne Bindung",
        description: "Übergabe mit Einweisung. Danach kümmere ich mich auf Wunsch weiter.",
      },
    ],
  },
  en: {
    label: "— Process",
    headline: "How we",
    headlineAccent: "work together.",
    body: "Four steps. At each one you know what happens and what you have afterwards.",
    steps: [
      {
        number: "01",
        title: "First conversation",
        duration: "The way in",
        description: "You show me what you have and what holds you up. I ask, and tell you what is worth doing.",
      },
      {
        number: "02",
        title: "Concept & quote",
        duration: "Before any budget is spent",
        description: "I set down what is needed, which route makes sense and what it costs.",
      },
      {
        number: "03",
        title: "Build",
        duration: "In short steps",
        description: "I build it and show you work in progress early, to try out.",
      },
      {
        number: "04",
        title: "Handover & support",
        duration: "No tie-in",
        description: "Handover with a walkthrough. After that I keep going if you want.",
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
