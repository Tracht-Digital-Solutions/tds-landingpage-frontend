/**
 * Source of truth for the FAQ section content. Lives here so both
 * the visible `<details>` accordions and the FAQPage JSON-LD on the
 * homepage can read the same items — structured data has to match the
 * visible answer 1:1, so we render from one place.
 *
 * Copy stays inline (not promoted to tds-shared) — FAQ answers drift
 * faster than the rest of the bundle.
 *
 * ### How the questions are written (2026-09-15)
 *
 * - As a visitor or a search asks them ("Was kostet eine Website?"), and
 *   answered in the first sentence — a question an answer engine lifts has to
 *   stand on its own.
 * - Six questions, each answered in one to three short sentences. A FAQ that is
 *   read takes the hurdle out of the enquiry; an unread one is only page length.
 * - "du", no free and no timed first conversation, no price range — the one
 *   sentence about the first conversation's cost is fixed (`homeContent.test.ts`).
 *
 * `intro` IS STILL PART OF THE SHAPE but is no longer rendered. It stays in the
 * type and therefore in the `faq_v2` block schema so text an admin already
 * saved keeps showing up in the editor. Do not delete it to "clean up".
 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqContent {
  label: string;
  headline: string;
  headlineAccent: string;
  /** Not rendered — see the note above before removing it. */
  intro: string;
  items: FaqItem[];
}

export function getFaqContent(lang: "de" | "en"): FaqContent {
  return lang === "de"
    ? {
        label: "— FAQ",
        headline: "Häufige",
        headlineAccent: "Fragen.",
        intro:
          "Die wichtigsten Fragen zu Zusammenarbeit, Verantwortung und Kosten – kurz beantwortet.",
        items: [
          // Erste Position, seit die Seite auf die Übernahme bestehender
          // Auftritte zugespitzt ist: das ist die Frage, mit der die meisten
          // hier ankommen, und sie steht damit über der Preisfrage.
          {
            q: "Kannst du meine bestehende Website oder meinen Shop übernehmen?",
            a: "Ja, auch mit WordPress, WooCommerce, Shopware, TYPO3 oder bei STRATO. Ich behebe Fehler und pflege sie weiter.",
          },
          {
            q: "Muss die Seite dafür neu gebaut werden?",
            a: "Meistens nicht. Was trägt, bleibt – neu gebaut wird nur, was sich nicht mehr reparieren lässt.",
          },
          {
            q: "Was kostet eine Website oder ein Onlineshop?",
            a: "Das hängt vom Umfang ab. Abgerechnet wird nach Aufwand oder zum Festpreis bei klarem Umfang. Die Stundensätze stehen bei den Preisen.",
          },
          {
            // The one sentence about cost the site makes (decided 2026-09-12).
            // No "kostenlos", no duration — `homeContent.test.ts` holds both out.
            q: "Was kostet das Erstgespräch?",
            a: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Arbeitest du mit meinen bisherigen Anbietern weiter?",
            a: "Wenn es sinnvoll ist, ja. Was gut läuft, bleibt.",
          },
          {
            q: "Bleibst du nach dem Start dabei?",
            a: "Auf Wunsch ja – nach Bedarf oder als festes Monatsmodell.",
          },
        ],
      }
    : {
        label: "— FAQ",
        headline: "Common",
        headlineAccent: "questions.",
        intro:
          "The key questions about working together, ownership and pricing — answered briefly.",
        items: [
          {
            q: "Can you take over my existing website or shop?",
            a: "Yes, including WordPress, WooCommerce, Shopware, TYPO3 or STRATO. I fix errors and keep it maintained.",
          },
          {
            q: "Does the site have to be rebuilt for that?",
            a: "Usually not. What holds up stays — only what cannot be repaired gets rebuilt.",
          },
          {
            q: "What does a website or an online shop cost?",
            a: "That depends on the scope. Work is billed by effort, or at a fixed price once the scope is clear. The hourly rates are under Pricing.",
          },
          {
            q: "What does the first conversation cost?",
            a: "Costs only arise once we agree on an assignment.",
          },
          {
            q: "Will you keep working with my current suppliers?",
            a: "Where it makes sense, yes. What works stays.",
          },
          {
            q: "Do you stay involved after launch?",
            a: "If you want — as needed, or as a fixed monthly arrangement.",
          },
        ],
      };
}
