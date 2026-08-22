/**
 * Extended copy for the Process ("Wie ich arbeite") hover panel, keyed by
 * the step `number` from the shared `translations.process.steps`. Lives
 * here — not in tds-shared — for the same reason as `lib/faq.ts`: this is
 * marketing detail that drifts faster than the shared bundle, and the
 * panel is landingpage-only. The step's title/duration/short description
 * still come from tds-shared; this just adds the longer narrative + the
 * one-line outcome shown alongside the visual on hover.
 */

export interface ProcessDetail {
  /** Longer narrative shown in the hover/focus panel. */
  detail: string;
  /** Short takeaway pinned under the visual. */
  outcome: string;
}

const details: Record<"de" | "en", Record<string, ProcessDetail>> = {
  de: {
    "01": {
      detail:
        "Sie erzählen mir, was Sie aufhält — die Liste, die dreimal geführt wird, die Seite, über die niemand anfragt. Ich frage nach und sage ehrlich, ob es sich lohnt.",
      outcome: "Ergebnis: Klarheit, ob und woran wir arbeiten.",
    },
    "02": {
      detail:
        "Daraus wird eine Grundlage, die Sie lesen und entscheiden können: was gebraucht wird, welcher Weg sinnvoll ist, was er kostet, wie lange er dauert.",
      outcome: "Ergebnis: Plan, Zeitrahmen und ein Budget mit Obergrenze.",
    },
    "03": {
      detail:
        "Gebaut wird in kurzen, sichtbaren Schritten. Sie sehen früh Zwischenstände zum Ausprobieren — nachsteuern ist unterwegs günstig, hinterher teuer.",
      outcome: "Ergebnis: Sie sehen früh, wie es wird.",
    },
    "04": {
      detail:
        "Übergabe mit Einweisung, damit Sie Inhalte und Preise selbst pflegen können. Danach kümmere ich mich auf Wunsch weiter — gebunden sind Sie nicht.",
      outcome: "Ergebnis: Sie können selbst damit arbeiten.",
    },
  },
  en: {
    "01": {
      detail:
        "You tell me what holds you up — the list kept in three places, the page nobody gets in touch through. I keep asking, and say honestly whether it's worth it.",
      outcome: "Outcome: clarity on whether, and on what, we work.",
    },
    "02": {
      detail:
        "That turns into something you can read and decide on: what is needed, which route makes sense, roughly what it costs and how long it takes.",
      outcome: "Outcome: a plan, a timeline and a budget with a ceiling.",
    },
    "03": {
      detail:
        "It gets built in short, visible steps. You see work in progress early — changing course is cheap along the way and expensive afterwards.",
      outcome: "Outcome: you see early how it's shaping up.",
    },
    "04": {
      detail:
        "Handover with a walkthrough, so you can maintain content and prices yourself. After that I'll keep going if you want — you aren't tied to it.",
      outcome: "Outcome: you can work with it yourself.",
    },
  },
};

export function getProcessDetails(lang: "de" | "en"): Record<string, ProcessDetail> {
  return details[lang];
}
