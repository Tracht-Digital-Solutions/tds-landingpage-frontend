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
        actions: ["Das Erstgespräch dient dem Kennenlernen.", "Ziele, Wünsche, offene Fragen kommen auf den Tisch."],
        outcome: "Ein gemeinsames Bild.",
      },
      {
        number: "02",
        title: "Angebot",
        duration: "Schritt 2",
        actions: ["Die Konzeption wird ausgearbeitet.", "Umfang, Preis, Termin werden schriftlich festgelegt."],
        outcome: "Ein Festpreis-Angebot.",
      },
      {
        number: "03",
        title: "Umsetzung",
        duration: "Schritt 3",
        actions: ["Das Produkt entsteht in kurzen Etappen.", "Probleme oder Änderungen werden sofort gemeldet."],
        outcome: "Volle Transparenz.",
      },
      {
        number: "04",
        title: "Übergabe",
        duration: "Schritt 4",
        actions: ["Der Kunde prüft das Ergebnis.", "Erst nach seiner Freigabe geht es live."],
        outcome: "Ein freigegebenes Ergebnis.",
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
        actions: ["The first conversation is for getting to know each other.", "Goals, wishes, open questions are laid out."],
        outcome: "A shared picture.",
      },
      {
        number: "02",
        title: "Quote",
        duration: "Step 2",
        actions: ["The concept is worked out.", "Scope, price, date are set in writing."],
        outcome: "A fixed-price quote.",
      },
      {
        number: "03",
        title: "Build",
        duration: "Step 3",
        actions: ["The product takes shape in short stages.", "Problems or changes are reported straight away."],
        outcome: "Full transparency.",
      },
      {
        number: "04",
        title: "Handover",
        duration: "Step 4",
        actions: ["The client reviews the result.", "It goes live only after their sign-off."],
        outcome: "A signed-off result.",
      },
    ],
  },
};

export const getProcessContent = (lang: Lang): ProcessContent => content[lang];
