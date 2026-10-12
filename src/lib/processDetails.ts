/**
 * The longer line and the outcome of each process step, keyed by the step's
 * `number` (`processContent.ts`). Lives here — not in tds-shared — for the same
 * reason as `lib/faq.ts`: marketing detail that drifts faster than the shared
 * bundle, and it is landing-only.
 *
 * `detail` is kept in the `process` block's shape for stored panel blocks; the
 * step renders `outcome`.
 *
 * The lines carry NO "Ergebnis:" / "Outcome:" prefix any more (2026-09-28):
 * the step labels the row itself, so the prefix read twice. `sections/Process.astro`
 * strips a leading one anyway, for blocks saved before the change.
 */

export interface ProcessDetail {
  /** Longer narrative of the step. */
  detail: string;
  /** Short takeaway shown under the step. */
  outcome: string;
}

const details: Record<"de" | "en", Record<string, ProcessDetail>> = {
  de: {
    "01": {
      detail:
        "Du erzählst mir, was dich aufhält – die Liste, die dreimal geführt wird, die Seite, über die niemand anfragt. Ich frage nach und sage dir, ob es sich lohnt.",
      outcome: "Klarheit, ob und woran wir arbeiten.",
    },
    "02": {
      detail:
        "Daraus wird eine Grundlage, die du lesen und entscheiden kannst: was gebraucht wird, welcher Weg sinnvoll ist, was er kostet, wie lange er dauert.",
      outcome: "Plan, Zeitrahmen und ein Budget mit Obergrenze.",
    },
    "03": {
      detail:
        "Gebaut wird in kurzen, sichtbaren Schritten. Du siehst früh Zwischenstände zum Ausprobieren – nachsteuern ist unterwegs günstig, hinterher teuer.",
      outcome: "Keine Überraschung zum Start.",
    },
    "04": {
      detail:
        "Übergabe mit Einweisung, damit du Inhalte selbst pflegen kannst. Auf Wunsch kümmere ich mich weiter – gebunden bist du nicht.",
      outcome: "Du kannst selbst damit arbeiten.",
    },
  },
  en: {
    "01": {
      detail:
        "You tell me what holds you up — the list kept in three places, the page nobody gets in touch through. I ask questions and tell you whether it's worth it.",
      outcome: "Clarity on whether, and on what, we work.",
    },
    "02": {
      detail:
        "That turns into something you can read and decide on: what is needed, which route makes sense, roughly what it costs and how long it takes.",
      outcome: "A plan, a timeline and a budget with a ceiling.",
    },
    "03": {
      detail:
        "It gets built in short, visible steps. You see work in progress early — changing course is cheap along the way and expensive afterwards.",
      outcome: "No surprises at launch.",
    },
    "04": {
      detail:
        "Handover with a walkthrough, so you can maintain content yourself. If you want, I keep looking after it — you aren't tied to it.",
      outcome: "You can work with it yourself.",
    },
  },
};

export function getProcessDetails(lang: "de" | "en"): Record<string, ProcessDetail> {
  return details[lang];
}
