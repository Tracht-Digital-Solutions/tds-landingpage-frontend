import type { Lang } from "./i18n";

/**
 * The home page's process section ("So arbeiten wir zusammen"), as committed
 * copy.
 *
 * Every step says what happens, in plain sentences, without "und" or "and"
 * (`processContent.test.ts`): a sentence that needs the word is usually two
 * things, and each deserves its own line.
 *
 * `number` keys the step's icon (`ui/ProcessIcon.astro`).
 */
export interface ProcessStepContent {
  number: string;
  title: string;
  duration: string;
  actions: string[];
  outcome: string;
}

export interface ProcessContent {
  headline: string;
  headlineAccent: string;
  steps: ProcessStepContent[];
}

const content: Record<Lang, ProcessContent> = {
  de: {
    headline: "So arbeiten",
    headlineAccent: "wir zusammen.",
    steps: [
      {
        number: "01",
        title: "Erstgespräch",
        duration: "Schritt 1",
        actions: ["Per Telefon, Video oder vor Ort im Raum Hamburg.", "Gemeinsam wird geklärt, was sich lohnt."],
        outcome: "Klare Aufgaben.",
      },
      {
        number: "02",
        title: "Angebot",
        duration: "Schritt 2",
        actions: ["Umfang, Termin, Festpreis stehen schriftlich fest.", "Was nicht dazugehört, steht auch drin."],
        outcome: "Ein festes Angebot.",
      },
      {
        number: "03",
        title: "Umsetzung",
        duration: "Schritt 3",
        actions: ["Gebaut wird in kurzen Etappen auf einer Vorschau.", "Jede Etappe lässt sich im Browser testen."],
        outcome: "Eine getestete Vorschau.",
      },
      {
        number: "04",
        title: "Übergabe",
        duration: "Schritt 4",
        actions: ["Das Ergebnis geht live.", "Zugänge, Code, Daten, Doku gehen an den Betrieb."],
        outcome: "Ein laufendes System.",
      },
    ],
  },
  en: {
    headline: "How we",
    headlineAccent: "work together.",
    steps: [
      {
        number: "01",
        title: "First conversation",
        duration: "Step 1",
        actions: ["By phone, video or in person around Hamburg.", "Together we work out what is worth doing."],
        outcome: "Clear tasks.",
      },
      {
        number: "02",
        title: "Quote",
        duration: "Step 2",
        actions: ["Scope, date, fixed price are set in writing.", "What is not included is stated too."],
        outcome: "A firm quote.",
      },
      {
        number: "03",
        title: "Build",
        duration: "Step 3",
        actions: ["The work runs in short stages on a preview.", "Each stage can be tried in the browser."],
        outcome: "A tested preview.",
      },
      {
        number: "04",
        title: "Handover",
        duration: "Step 4",
        actions: ["The result goes live.", "Logins, code, data, docs go to the business."],
        outcome: "A running system.",
      },
    ],
  },
};

export const getProcessContent = (lang: Lang): ProcessContent => content[lang];
