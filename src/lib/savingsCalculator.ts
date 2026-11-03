import type { Lang } from "./i18n";

/**
 * The home page's time-savings calculator (`sections/TimeSavings.astro`).
 *
 * It only multiplies what the visitor enters: minutes per task × tasks per
 * week × the share that runs automatically × 46 working weeks. No measured
 * figure, no promise and no range is published (docs/agents/content-cms.md);
 * the defaults are labelled as example values, and the server renders their
 * result so the section reads the same without JavaScript.
 *
 * Kept free of runtime imports: the section's script bundles this file.
 */
export const WORK_WEEKS = 46;
export const WORKDAY_HOURS = 8;

export interface SavingsInput {
  minutes: number;
  perWeek: number;
  share: number;
}

export const SAVINGS_DEFAULTS: SavingsInput = { minutes: 10, perWeek: 25, share: 70 };

/** Upper bounds of the three fields, mirrored in the inputs' `max`. */
export const SAVINGS_LIMITS: SavingsInput = { minutes: 600, perWeek: 5000, share: 100 };

const clamp = (value: number, max: number) => (Number.isFinite(value) ? Math.min(Math.max(value, 0), max) : 0);

export function savings({ minutes, perWeek, share }: SavingsInput) {
  const weekly =
    (clamp(minutes, SAVINGS_LIMITS.minutes) * clamp(perWeek, SAVINGS_LIMITS.perWeek) * clamp(share, SAVINGS_LIMITS.share)) /
    100 /
    60;
  const year = weekly * WORK_WEEKS;
  return { month: year / 12, year, days: year / WORKDAY_HOURS };
}

/** One decimal below 100, whole numbers above: "11,2", "134", "1.235". */
export function formatSavings(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-GB", {
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);
}

export interface SavingsCopy {
  headline: string;
  headlineAccent: string;
  lead: string;
  examples: string;
  minutes: string;
  perWeek: string;
  share: string;
  month: string;
  year: string;
  days: string;
  benefitsLabel: string;
  benefits: string[];
  formula: string;
  note: string;
  cta: string;
  /** The draft handed to the contact form; `{…}` are filled in by the script. */
  draft: string;
}

const copy: Record<Lang, SavingsCopy> = {
  de: {
    headline: "Was Digitalisierung",
    headlineAccent: "an Zeit spart.",
    lead: "Die gesparte Zeit hängt von drei Zahlen ab: Dauer eines Vorgangs, Häufigkeit und Anteil, der automatisch läuft. Tracht Digital Solutions digitalisiert solche Abläufe, zum Beispiel Bestellungen übertragen, Rechnungen erfassen oder Statusmails schreiben.",
    examples: "Die Felder enthalten Beispielwerte und lassen sich überschreiben.",
    minutes: "Minuten pro Vorgang",
    perWeek: "Vorgänge pro Woche",
    share: "Anteil automatisiert (%)",
    month: "Stunden pro Monat",
    year: "Stunden pro Jahr",
    days: "Arbeitstage pro Jahr",
    benefitsLabel: "Was sich danach ändert",
    benefits: [
      "Keine doppelte Dateneingabe mehr.",
      "Weniger Fehler durch Handarbeit.",
      "Mehr Zeit für Kunden und Aufträge.",
    ],
    formula: "Rechnung: Minuten × Vorgänge pro Woche × Anteil × 46 Arbeitswochen. Ein Arbeitstag hat 8 Stunden.",
    note: "Das Ergebnis ist eine Rechnung mit den eingegebenen Werten, keine Zusage. Eine belastbare Zahl entsteht im Erstgespräch am konkreten Ablauf.",
    cta: "Erstgespräch vereinbaren",
    draft:
      "Aus dem Zeitersparnis-Rechner: {minutes} Minuten pro Vorgang, {perWeek} Vorgänge pro Woche, {share} % automatisiert. Ergebnis: {year} Stunden pro Jahr ({month} pro Monat).\n\nUm diesen Ablauf geht es: ",
  },
  en: {
    headline: "How much time",
    headlineAccent: "digitalization saves.",
    lead: "The time saved depends on three figures: how long a task takes, how often it happens and the share that runs automatically. Tracht Digital Solutions digitalizes such workflows, for example copying orders, entering invoices or writing status emails.",
    examples: "The fields hold example values and can be overwritten.",
    minutes: "Minutes per task",
    perWeek: "Tasks per week",
    share: "Share automated (%)",
    month: "hours per month",
    year: "hours per year",
    days: "working days per year",
    benefitsLabel: "What changes afterwards",
    benefits: [
      "No more double data entry.",
      "Fewer mistakes from manual work.",
      "More time for customers and orders.",
    ],
    formula: "Calculation: minutes × tasks per week × share × 46 working weeks. A working day has 8 hours.",
    note: "The result is a calculation with the values entered, not a promise. A reliable figure comes from the first conversation about the actual task.",
    cta: "Book a first conversation",
    draft:
      "From the time-savings calculator: {minutes} minutes per task, {perWeek} tasks per week, {share} % automated. Result: {year} hours per year ({month} per month).\n\nThe task in question: ",
  },
};

export function getSavingsCopy(lang: Lang): SavingsCopy {
  return copy[lang];
}

export function savingsDraft(template: string, input: SavingsInput, lang: Lang): string {
  const result = savings(input);
  const values: Record<string, string> = {
    minutes: formatSavings(input.minutes, lang),
    perWeek: formatSavings(input.perWeek, lang),
    share: formatSavings(input.share, lang),
    month: formatSavings(result.month, lang),
    year: formatSavings(result.year, lang),
  };
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
