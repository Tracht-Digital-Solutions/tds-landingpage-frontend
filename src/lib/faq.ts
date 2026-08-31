/**
 * Source of truth for the FAQ section content. Lives here so both
 * the visible `<details>` accordions and the FAQPage JSON-LD on the
 * homepage can read the same items — Google's rich-result eligibility
 * check rejects FAQ schema where the answer text doesn't match the
 * visible answer 1:1, so we render from one place.
 *
 * Copy stays inline (not promoted to tds-shared) — FAQ answers drift
 * faster than the rest of the bundle.
 *
 * Antworten bleiben bei höchstens zwei Sätzen. Elf Fragen mit je vier
 * Sätzen liest niemand; eine FAQ, die gelesen wird, nimmt der Anfrage
 * die Hürde, eine ungelesene ist nur Seitenlänge.
 *
 * `intro` IS STILL PART OF THE SHAPE but is no longer rendered: a heading
 * reading "Häufige Fragen" followed by a sentence saying these are the
 * frequent questions earned nothing. It stays in the type and therefore in
 * the `faq_v2` block schema so text an admin already saved keeps showing
 * up in the editor instead of vanishing from the field list. Do not delete
 * it to "clean up" — that is what would drop it from the CMS.
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
          "Die wichtigsten Fragen zu Zusammenarbeit, Verantwortung und Kosten — kurz beantwortet.",
        items: [
          {
            q: "Ich weiß noch nicht, was ich brauche. Können wir trotzdem reden?",
            a: "Ja. Sagen Sie einfach, was im Alltag Zeit kostet oder nicht rundläuft. Den nächsten Schritt finden wir gemeinsam.",
          },
          {
            q: "Können Sie sich um alles Digitale kümmern?",
            a: "Ja. Je nach Absprache übernehme ich Planung, Umsetzung, die Abstimmung mit Ihren bisherigen Anbietern und die laufende Betreuung.",
          },
          {
            q: "Was gehört zu „Komplette IT“?",
            a: "Geräte, Zugänge, Netzwerk, Sicherheit, Backups, Lizenzen und Support. Was genau dazugehört, vereinbaren wir nach einer Bestandsaufnahme.",
          },
          {
            q: "Arbeiten Sie mit meinen bisherigen Anbietern weiter?",
            a: "Wenn es sinnvoll ist, ja. Was gut läuft, bleibt — ich schließe die Lücken und koordiniere die Beteiligten.",
          },
          {
            q: "Was ist der erste Schritt?",
            a: "Ein Erstgespräch. Danach wissen Sie, was zuerst dran ist und was es ungefähr kostet.",
          },
          {
            q: "Wovon hängt der Preis ab?",
            a: "Vom Bereich, vom Umfang und davon, wie klar die Aufgabe ist. Abgegrenzte Vorhaben gehen auch zum Festpreis.",
          },
          {
            q: "Bleiben Sie nach der Umsetzung dabei?",
            a: "Auf Wunsch ja — nach Bedarf oder als festes Monatsmodell.",
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
            q: "I don't know what I need yet. Can we still talk?",
            a: "Yes. Just say what costs you time or does not run smoothly. We work out the next step together.",
          },
          {
            q: "Can you look after everything digital?",
            a: "Yes. Depending on what we agree, I handle planning, delivery, coordination with your existing suppliers and the ongoing support.",
          },
          {
            q: "What is included in “Complete IT”?",
            a: "Devices, accounts, network, security, backups, licences and support. Exactly what is included is agreed after an assessment.",
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
            q: "What does the price depend on?",
            a: "The area, the scope, and how clearly the task is defined. Bounded projects can be done at a fixed price.",
          },
          {
            q: "Do you stay involved after launch?",
            a: "If you want — as needed, or as a fixed monthly arrangement.",
          },
        ],
      };
}
