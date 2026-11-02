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
        actions: [
          "Das Gespräch läuft per Telefon, per Video oder vor Ort im Raum Hamburg.",
          "Julian Tracht sieht sich Website, Shop, Tabellen, wiederkehrende Handarbeit an.",
          "Danach sagt er offen, was sich lohnt.",
        ],
        outcome: "Eine klare Einschätzung, woran sich die Arbeit lohnt.",
      },
      {
        number: "02",
        title: "Schriftliches Angebot",
        duration: "Schritt 2",
        actions: [
          "Das Konzept nennt Umfang, angebundene Systeme, Fertigstellungstermin.",
          "Der Preis steht als Festpreis oder Budgetobergrenze darin.",
          "Was nicht dazugehört, steht ebenfalls im Angebot.",
        ],
        outcome: "Ein Angebot, über das sich in Ruhe entscheiden lässt.",
      },
      {
        number: "03",
        title: "Umsetzung",
        duration: "Schritt 3",
        actions: [
          "Gebaut wird in kurzen Etappen auf einer eigenen Vorschau-Adresse.",
          "Jede Etappe lässt sich im Browser ausprobieren, Rückmeldungen fließen in die nächste.",
          "Datenschutz, Barrierefreiheit, Suchmaschinen gehören von Beginn an dazu.",
        ],
        outcome: "Eine getestete Vorschau, bereit für den Start.",
      },
      {
        number: "04",
        title: "Übergabe",
        duration: "Schritt 4",
        actions: [
          "Das Ergebnis geht live.",
          "Alle Zugänge, Code, Daten, eine verständliche Dokumentation gehen an den Betrieb.",
          "Eine Einweisung zeigt die Pflege der Inhalte. Wartung gibt es auf Wunsch, ohne Vertragsbindung.",
        ],
        outcome: "Ein laufendes System in eigener Hand.",
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
        actions: [
          "The conversation runs by phone, by video or in person around Hamburg.",
          "Julian Tracht looks at the website, shop, spreadsheets, recurring manual work.",
          "He then says openly what is worth doing.",
        ],
        outcome: "A clear view of where the work pays off.",
      },
      {
        number: "02",
        title: "Written quote",
        duration: "Step 2",
        actions: [
          "The concept names the scope, connected systems, completion date.",
          "The price is in it as a fixed price or a budget cap.",
          "What is not included is stated in the quote too.",
        ],
        outcome: "A quote to decide on calmly.",
      },
      {
        number: "03",
        title: "Build",
        duration: "Step 3",
        actions: [
          "The work runs in short stages on a separate preview address.",
          "Each stage can be tried in the browser, feedback goes into the next one.",
          "Data protection, accessibility, search engines are part of it from the start.",
        ],
        outcome: "A tested preview, ready to launch.",
      },
      {
        number: "04",
        title: "Handover",
        duration: "Step 4",
        actions: [
          "The result goes live.",
          "All logins, code, data, clear documentation go to the business.",
          "A walkthrough shows how content is maintained. Maintenance is available on request, with no tie-in.",
        ],
        outcome: "A running system in the business's own hands.",
      },
    ],
  },
};

export const getProcessContent = (lang: Lang): ProcessContent => content[lang];
