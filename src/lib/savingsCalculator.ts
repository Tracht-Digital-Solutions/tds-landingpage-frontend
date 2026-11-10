import type { Lang } from "./i18n";

/**
 * The home page's time-savings questionnaire (`sections/TimeSavings.astro`).
 *
 * Three questions with fixed answers instead of number fields. Each answer
 * stands for a mid value (minutes, times a week, share of routine); the result
 * multiplies them over 46 working weeks. It is an estimate from the visitor's
 * answers, labelled as such, never a measured figure or a promise
 * (docs/agents/content-cms.md).
 *
 * Kept free of runtime imports: the section's script bundles this file.
 */
export const WORK_WEEKS = 46;
export const WORKDAY_HOURS = 8;
/** One working year: 46 weeks of 40 hours. The chart draws the saved hours as a slice of it. */
export const WORK_YEAR_HOURS = WORK_WEEKS * 5 * WORKDAY_HOURS;

export interface SavingsInput {
  minutes: number;
  perWeek: number;
  share: number;
}

export type QuestionId = keyof SavingsInput;

type Words = Record<Lang, string>;

export interface SavingsQuestion {
  id: QuestionId;
  question: Words;
  answers: readonly { value: number; label: Words }[];
}

export const SAVINGS_QUESTIONS: readonly SavingsQuestion[] = [
  {
    id: "minutes",
    question: { de: "Wie lange dauert der Vorgang?", en: "How long does the task take?" },
    answers: [
      { value: 3, label: { de: "Unter 5 Minuten", en: "Under 5 minutes" } },
      { value: 10, label: { de: "5 bis 15 Minuten", en: "5 to 15 minutes" } },
      { value: 25, label: { de: "15 bis 30 Minuten", en: "15 to 30 minutes" } },
      { value: 45, label: { de: "Länger", en: "Longer" } },
    ],
  },
  {
    id: "perWeek",
    question: { de: "Wie oft fällt er an?", en: "How often does it come up?" },
    answers: [
      { value: 3, label: { de: "Ein paarmal pro Woche", en: "A few times a week" } },
      { value: 5, label: { de: "Täglich", en: "Daily" } },
      { value: 20, label: { de: "Mehrmals täglich", en: "Several times a day" } },
      { value: 50, label: { de: "Ständig", en: "All the time" } },
    ],
  },
  {
    id: "share",
    question: { de: "Wie viel davon ist Routine?", en: "How much of it is routine?" },
    answers: [
      { value: 30, label: { de: "Ein kleiner Teil", en: "A small part" } },
      { value: 50, label: { de: "Etwa die Hälfte", en: "About half" } },
      { value: 80, label: { de: "Fast alles", en: "Almost all" } },
    ],
  },
];

const clamp = (value: number, max: number) => (Number.isFinite(value) ? Math.min(Math.max(value, 0), max) : 0);

/**
 * `year` is the routine share of the task's yearly time, the part software can
 * take over; `days` the same in working days. The chart in the section draws
 * `yearShare`, the saved hours as a slice of one working year
 * (`WORK_YEAR_HOURS`), and `rest` is the working time that remains.
 */
export function savings({ minutes, perWeek, share }: SavingsInput) {
  const totalWeekly = (clamp(minutes, 600) * clamp(perWeek, 5000)) / 60;
  const ratio = clamp(share, 100) / 100;
  const total = totalWeekly * WORK_WEEKS;
  const year = total * ratio;
  const saved = Math.min(year, WORK_YEAR_HOURS);
  return {
    month: year / 12,
    year,
    days: year / WORKDAY_HOURS,
    total,
    share: ratio,
    rest: WORK_YEAR_HOURS - saved,
    yearShare: saved / WORK_YEAR_HOURS,
  };
}

/** Whole hours, one decimal below 10: "8,5", "134", "1.235". */
export function formatSavings(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-GB", {
    maximumFractionDigits: value < 10 ? 1 : 0,
  }).format(value);
}

export interface SavingsCopy {
  headline: string;
  headlineAccent: string;
  pending: string;
  /** While answers are missing: one left, two left. Nothing is numbered. */
  pendingOne: string;
  pendingTwo: string;
  resultPrefix: string;
  year: string;
  days: string;
  /** The chart's two slices and its accessible summary; `{…}` filled in by the script. */
  sliceSaved: string;
  sliceRest: string;
  /** Under the number of days in the middle of the ring. */
  centre: string;
  chartLabel: string;
  note: string;
  cta: string;
  /** The CTA once an estimate stands, and the line that says what it carries. */
  ctaReady: string;
  handoff: string;
  /** The draft handed to the contact form; `{…}` are filled in by the script. */
  draft: string;
}

const copy: Record<Lang, SavingsCopy> = {
  de: {
    headline: "Was Digitalisierung",
    headlineAccent: "an Zeit spart.",
    pending: "Nach drei Antworten steht hier die Schätzung.",
    pendingOne: "Noch eine Antwort bis zur Schätzung.",
    pendingTwo: "Noch zwei Antworten bis zur Schätzung.",
    resultPrefix: "Etwa",
    year: "Stunden pro Jahr",
    days: "Arbeitstage",
    sliceSaved: "Gesparte Zeit",
    sliceRest: "Übrige Arbeitszeit",
    centre: "Tage",
    chartLabel: "Etwa {year} Stunden oder {days} Arbeitstage gespart, von {work} Stunden Arbeitszeit im Jahr.",
    note: "Eine grobe Schätzung aus den Antworten, keine Zusage.",
    cta: "Erstgespräch vereinbaren",
    ctaReady: "Diesen Ablauf besprechen",
    handoff: "Die drei Antworten gehen als Entwurf ins Kontaktformular.",
    draft:
      "Aus dem Zeitersparnis-Fragebogen: Dauer {minutes}, Häufigkeit {perWeek}, Routine {share}. Geschätzt etwa {year} Stunden pro Jahr.\n\nUm diesen Ablauf geht es: ",
  },
  en: {
    headline: "How much time",
    headlineAccent: "digitalization saves.",
    pending: "The estimate appears here after three answers.",
    pendingOne: "One more answer to the estimate.",
    pendingTwo: "Two more answers to the estimate.",
    resultPrefix: "About",
    year: "hours per year",
    days: "working days",
    sliceSaved: "Time saved",
    sliceRest: "Remaining working time",
    centre: "days",
    chartLabel: "About {year} hours or {days} working days saved, out of {work} working hours a year.",
    note: "A rough estimate from the answers, not a promise.",
    cta: "Book a first conversation",
    ctaReady: "Talk this task through",
    handoff: "The three answers go into the contact form as a draft.",
    draft:
      "From the time-savings questionnaire: duration {minutes}, frequency {perWeek}, routine {share}. Estimated at about {year} hours per year.\n\nThe task in question: ",
  },
};

export function getSavingsCopy(lang: Lang): SavingsCopy {
  return copy[lang];
}

/** The answer label behind a value, for the contact draft. */
export function answerLabel(id: QuestionId, value: number, lang: Lang): string {
  const question = SAVINGS_QUESTIONS.find((item) => item.id === id);
  return question?.answers.find((answer) => answer.value === value)?.label[lang] ?? String(value);
}

export function savingsDraft(template: string, input: SavingsInput, lang: Lang): string {
  const values: Record<string, string> = {
    minutes: answerLabel("minutes", input.minutes, lang),
    perWeek: answerLabel("perWeek", input.perWeek, lang),
    share: answerLabel("share", input.share, lang),
    year: formatSavings(savings(input).year, lang),
  };
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
