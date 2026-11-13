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
    headline: "Ablauf eines Projekts",
    headlineAccent: "",
    steps: [
      {
        number: "01",
        title: "Erstgespräch",
        duration: "Schritt 1",
        actions: ["Ein Gespräch per Telefon oder Video über die Aufgabe.", "Offene Fragen werden notiert, Zugänge zu bestehenden Systemen geklärt."],
        outcome: "Eine schriftliche Zusammenfassung der Aufgabe.",
      },
      {
        number: "02",
        title: "Angebot",
        duration: "Schritt 2",
        actions: ["Umfang, Preis, Termin werden schriftlich festgelegt.", "Was nicht im Angebot steht, wird nicht berechnet."],
        outcome: "Ein Angebot mit Festpreis oder Budgetgrenze.",
      },
      {
        number: "03",
        title: "Umsetzung",
        duration: "Schritt 3",
        actions: ["Die Umsetzung läuft in kurzen Etappen mit Zwischenständen zum Anschauen.", "Änderungen am Umfang werden vor der Arbeit abgestimmt."],
        outcome: "Eine Testversion, die der Betrieb ausprobieren kann.",
      },
      {
        number: "04",
        title: "Übergabe",
        duration: "Schritt 4",
        actions: ["Der Kunde prüft die Testversion.", "Erst nach seiner Freigabe geht sie live."],
        outcome: "Zugänge, Code, Dokumentation gehen an den Betrieb.",
      },
    ],
  },
  en: {
    headline: "How a project runs",
    headlineAccent: "",
    steps: [
      {
        number: "01",
        title: "First conversation",
        duration: "Step 1",
        actions: ["A call by phone or video about the task.", "Open questions are noted, access to existing systems is clarified."],
        outcome: "A written summary of the task.",
      },
      {
        number: "02",
        title: "Quote",
        duration: "Step 2",
        actions: ["Scope, price, date are set in writing.", "Nothing outside the quote is charged."],
        outcome: "A quote with a fixed price or a budget cap.",
      },
      {
        number: "03",
        title: "Build",
        duration: "Step 3",
        actions: ["The work runs in short stages with interim versions to look at.", "Changes to the scope are agreed before the work."],
        outcome: "A test version the business can try out.",
      },
      {
        number: "04",
        title: "Handover",
        duration: "Step 4",
        actions: ["The client reviews the test version.", "It goes live only after their sign-off."],
        outcome: "Access, code, documentation go to the business.",
      },
    ],
  },
};

export const getProcessContent = (lang: Lang): ProcessContent => content[lang];
