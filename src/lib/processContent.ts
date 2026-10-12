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
    body: "Vier Schritte. Nach jedem hast du etwas in der Hand – kein Zwischenstand, den nur ich lesen kann.",
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
        //
        // Neu formuliert 2026-09-29: jeder Satz endet bei dem, was DU danach
        // hast, nicht bei dem, was ich tue.
        description: "Du erzählst mir, wo es hakt. Ich schaue mir an, was schon da ist. Danach weißt du, was sich lohnt – und was nicht.",
      },
      {
        number: "02",
        title: "Konzept & Angebot",
        duration: "Bevor Budget fließt",
        description: "Du bekommst schwarz auf weiß, was entsteht, was es kostet und wann es fertig ist. Dann entscheidest du in Ruhe.",
      },
      {
        number: "03",
        title: "Umsetzung",
        duration: "In kurzen Schritten",
        description: "Ich baue in kurzen Etappen. Du klickst früh durch die ersten Seiten und sagst, was passt. So bleiben Änderungen schnell und günstig.",
      },
      {
        number: "04",
        title: "Übergabe & Betreuung",
        duration: "Ohne Bindung",
        description: "Du bekommst alle Zugänge und eine kurze Einweisung. Danach betreue ich dich weiter – oder du machst selbst weiter.",
      },
    ],
  },
  en: {
    label: "— Process",
    headline: "How we",
    headlineAccent: "work together.",
    body: "Four steps. After each one you have something in hand – not a progress report only I can read.",
    steps: [
      {
        number: "01",
        title: "First conversation",
        duration: "The way in",
        description: "You tell me where things get stuck. I look at what is already there. Afterwards you know what is worth doing – and what is not.",
      },
      {
        number: "02",
        title: "Concept & quote",
        duration: "Before any budget is spent",
        description: "You get it in black and white: what gets built, what it costs and when it is done. Then you decide in your own time.",
      },
      {
        number: "03",
        title: "Build",
        duration: "In short steps",
        description: "I build in short stages. You click through the first pages early and say what works. That keeps changes quick and cheap.",
      },
      {
        number: "04",
        title: "Handover & support",
        duration: "No tie-in",
        description: "You get every login and a short walkthrough. After that I keep looking after it – or you carry on yourself.",
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
