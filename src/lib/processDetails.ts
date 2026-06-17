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
        "Wir sprechen offen über Ihr Vorhaben: Wo drückt der Schuh, was soll am Ende herauskommen, welche Rahmenbedingungen gibt es? Ich höre zu, frage nach und sage ehrlich, ob und wie ich helfen kann — ganz ohne Verkaufsdruck.",
      outcome: "Ergebnis: Klarheit, ob wir zueinander passen.",
    },
    "02": {
      detail:
        "Aus dem Gespräch wird ein greifbares Konzept: Architektur-Skizze, sinnvoll geschnittener Umfang, realistischer Zeitplan und ein Budget mit Obergrenze. Sie wissen vor dem ersten Commit, woran Sie sind.",
      outcome: "Ergebnis: Plan, Zeitrahmen und Festpreis-Korridor.",
    },
    "03": {
      detail:
        "Entwickelt wird in kurzen, sichtbaren Schritten. Sie bekommen regelmäßig lauffähige Stände zum Anschauen und Testen, dazu Zugang zum Projektboard — kein Blackbox-Development, keine bösen Überraschungen am Ende.",
      outcome: "Ergebnis: Lauffähige Software in jedem Sprint.",
    },
    "04": {
      detail:
        "Sauberes Deployment, vollständige Übergabe inklusive Code und Repository, plus eine Einweisung für Ihr Team. Und danach bleibe ich Ansprechpartner für Wartung, Updates und die nächste Ausbaustufe.",
      outcome: "Ergebnis: Live-Produkt — und ein Partner danach.",
    },
  },
  en: {
    "01": {
      detail:
        "We talk openly about your project: where it hurts, what the outcome should be, and what constraints exist. I listen, ask questions, and tell you honestly whether and how I can help — with zero sales pressure.",
      outcome: "Outcome: clarity on whether we're a fit.",
    },
    "02": {
      detail:
        "The conversation turns into a tangible concept: an architecture sketch, a sensibly scoped feature set, a realistic timeline, and a budget with a ceiling. You know where you stand before the first commit.",
      outcome: "Outcome: a plan, a timeline, and a fixed-price corridor.",
    },
    "03": {
      detail:
        "Development happens in short, visible steps. You get running builds to review and test regularly, plus access to the project board — no black-box development, no nasty surprises at the end.",
      outcome: "Outcome: working software every sprint.",
    },
    "04": {
      detail:
        "A clean deployment, a full handover including code and repository, and a walkthrough for your team. After that I stay on as your contact for maintenance, updates, and the next stage.",
      outcome: "Outcome: a live product — and a partner afterwards.",
    },
  },
};

export function getProcessDetails(lang: "de" | "en"): Record<string, ProcessDetail> {
  return details[lang];
}
