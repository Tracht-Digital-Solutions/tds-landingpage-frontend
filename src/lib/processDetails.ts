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
        "Sie erzählen mir, was Sie im Alltag aufhält — die Liste, die dreimal geführt wird, das Formular, das jemand abtippt, die Seite, über die niemand anfragt. Ich frage nach, bis ich Ihre Arbeit verstanden habe, und sage ehrlich, ob sich eine Umsetzung überhaupt lohnt.",
      outcome: "Ergebnis: Klarheit, ob und woran wir arbeiten.",
    },
    "02": {
      detail:
        "Aus dem Gespräch wird eine verständliche Grundlage: was wirklich gebraucht wird, welcher Weg sinnvoll ist, was er ungefähr kostet und wie lange er dauert. Kein Fachchinesisch, sondern etwas, das Sie lesen und entscheiden können.",
      outcome: "Ergebnis: Plan, Zeitrahmen und ein Budget mit Obergrenze.",
    },
    "03": {
      detail:
        "Gebaut wird in kurzen, sichtbaren Schritten. Sie bekommen früh Zwischenstände zum Anschauen und Ausprobieren, statt am Ende vor etwas Fertigem zu stehen — nachsteuern ist unterwegs günstig und hinterher teuer.",
      outcome: "Ergebnis: Sie sehen früh, wie es wird.",
    },
    "04": {
      detail:
        "Übergabe mit Einweisung, damit Sie Inhalte, Produkte und Preise selbst pflegen können. Danach kümmere ich mich auf Wunsch weiter um Updates und Änderungen — Sie sind aber nicht daran gebunden.",
      outcome: "Ergebnis: Sie können selbst damit arbeiten.",
    },
  },
  en: {
    "01": {
      detail:
        "You tell me what holds you up day to day — the list kept in three places, the form somebody retypes, the page nobody gets in touch through. I keep asking until I understand how you work, and say honestly whether building anything is worth it.",
      outcome: "Outcome: clarity on whether, and on what, we work.",
    },
    "02": {
      detail:
        "The conversation turns into something you can actually read: what is genuinely needed, which route makes sense, roughly what it costs and how long it takes. Not jargon — something you can decide on.",
      outcome: "Outcome: a plan, a timeline and a budget with a ceiling.",
    },
    "03": {
      detail:
        "It gets built in short, visible steps. You see work in progress early and can try it out, instead of being handed something finished at the end — changing course is cheap along the way and expensive afterwards.",
      outcome: "Outcome: you see early how it's shaping up.",
    },
    "04": {
      detail:
        "Handover with a walkthrough, so you can maintain content, products and prices yourself. After that I'll keep handling updates and changes if you want — but you aren't tied to it.",
      outcome: "Outcome: you can work with it yourself.",
    },
  },
};

export function getProcessDetails(lang: "de" | "en"): Record<string, ProcessDetail> {
  return details[lang];
}
