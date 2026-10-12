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
        "Im Erstgespräch geht es um das, was im Betrieb aufhält – die Liste, die dreimal geführt wird, die Seite, über die niemand anfragt. Danach ist klar, ob sich ein Projekt lohnt.",
      outcome: "Klarheit, ob und woran gearbeitet wird.",
    },
    "02": {
      detail:
        "Daraus wird eine Grundlage, die sich lesen und entscheiden lässt: was gebraucht wird, welcher Weg sinnvoll ist, was er kostet, wie lange er dauert.",
      outcome: "Plan, Zeitrahmen und ein Budget mit Obergrenze.",
    },
    "03": {
      detail:
        "Gebaut wird in kurzen, sichtbaren Schritten mit frühen Zwischenständen zum Ausprobieren – nachsteuern ist unterwegs günstig, hinterher teuer.",
      outcome: "Keine Überraschung zum Start.",
    },
    "04": {
      detail:
        "Übergabe mit Einweisung, damit Inhalte selbst gepflegt werden können. Auf Wunsch geht die Betreuung weiter – ohne Bindung.",
      outcome: "Ein System, mit dem der Betrieb selbst arbeitet.",
    },
  },
  en: {
    "01": {
      detail:
        "The first conversation is about what holds the business up — the list kept in three places, the page nobody gets in touch through. Afterwards it is clear whether a project is worth it.",
      outcome: "Clarity on whether, and on what, to work.",
    },
    "02": {
      detail:
        "That turns into something to read and decide on: what is needed, which route makes sense, roughly what it costs and how long it takes.",
      outcome: "A plan, a timeline and a budget with a ceiling.",
    },
    "03": {
      detail:
        "It gets built in short, visible steps with early work in progress to try out — changing course is cheap along the way and expensive afterwards.",
      outcome: "No surprises at launch.",
    },
    "04": {
      detail:
        "Handover with a walkthrough, so content can be maintained in-house. Support continues on request — with no tie-in.",
      outcome: "A system the business runs itself.",
    },
  },
};

export function getProcessDetails(lang: "de" | "en"): Record<string, ProcessDetail> {
  return details[lang];
}
