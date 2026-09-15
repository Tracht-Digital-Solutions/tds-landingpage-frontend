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
 * - At most two or three sentences. A FAQ that is read takes the hurdle out of
 *   the enquiry; an unread one is only page length.
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
          {
            q: "Was kostet eine Website oder ein Onlineshop?",
            a: "Das hängt vom Umfang ab. Abgerechnet wird nach Aufwand zum Stundensatz – oder zum Festpreis, wenn Ziel und Umfang vorher klar sind. Alle Stundensätze findest du bei den Preisen.",
          },
          {
            q: "Ich weiß noch nicht, was ich brauche. Können wir trotzdem reden?",
            a: "Ja. Erzähl mir, was im Alltag Zeit kostet oder nicht rundläuft – oder probier den Leistungsassistenten aus. Den nächsten Schritt finden wir gemeinsam.",
          },
          {
            q: "Kannst du meine bestehende Website oder meinen Shop übernehmen?",
            a: "Ja – auch wenn sie mit WordPress, WooCommerce, Shopware, TYPO3 oder bei STRATO läuft. Ich verschaffe mir einen Überblick, behebe Fehler und kümmere mich um die Pflege.",
          },
          {
            q: "Was gehört zum Webauftritt dazu?",
            a: "Die Website, auf Wunsch ein Onlineshop und das Marketing, über das Kunden dich finden – Google Ads, Auffindbarkeit und Newsletter. Was davon sinnvoll ist, klären wir vorher.",
          },
          {
            q: "Arbeitest du mit meinen bisherigen Anbietern weiter?",
            a: "Wenn es sinnvoll ist, ja. Was gut läuft, bleibt – ich schließe die Lücken und koordiniere die Beteiligten.",
          },
          {
            q: "Was ist der erste Schritt?",
            a: "Ein Erstgespräch. Danach weißt du, was zuerst dran ist und was es ungefähr kostet.",
          },
          {
            // The one sentence about cost the site makes (decided 2026-09-12).
            // No "kostenlos", no duration — `homeContent.test.ts` holds both out.
            q: "Was kostet das Erstgespräch?",
            a: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
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
            q: "What does a website or an online shop cost?",
            a: "That depends on the scope. Work is billed by effort at the hourly rate – or at a fixed price when goal and scope are clear up front. You will find every hourly rate under Pricing.",
          },
          {
            q: "I don't know what I need yet. Can we still talk?",
            a: "Yes. Tell me what costs you time or does not run smoothly – or try the service assistant. We work out the next step together.",
          },
          {
            q: "Can you take over my existing website or shop?",
            a: "Yes – including sites running on WordPress, WooCommerce, Shopware, TYPO3 or at STRATO. I get an overview, fix errors and take care of the upkeep.",
          },
          {
            q: "What does web presence include?",
            a: "The website, an online shop if you want one, and the marketing that brings customers to it — Google Ads, findability and newsletters. We agree up front which of those makes sense.",
          },
          {
            q: "Will you keep working with my current suppliers?",
            a: "Where it makes sense, yes. What works stays — I close the gaps and coordinate the people involved.",
          },
          {
            q: "What is the first step?",
            a: "A first conversation. After it you know what comes first and roughly what it costs.",
          },
          {
            q: "What does the first conversation cost?",
            a: "Costs only arise once we agree on an assignment.",
          },
          {
            q: "Do you stay involved after launch?",
            a: "If you want — as needed, or as a fixed monthly arrangement.",
          },
        ],
      };
}
