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
 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqContent {
  label: string;
  headline: string;
  headlineAccent: string;
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
            q: "Ich weiß noch nicht genau, was ich brauche. Können wir trotzdem sprechen?",
            a: "Ja. Es reicht, wenn Sie beschreiben, was im Alltag Zeit kostet, unsicher ist oder nicht gut funktioniert — den sinnvollen nächsten Schritt klären wir gemeinsam.",
          },
          {
            q: "Können Sie die Digitalisierung insgesamt verantworten?",
            a: "Ja. Je nach Vereinbarung übernehme ich Planung, Umsetzung, Koordination bestehender Dienstleister und die laufende Betreuung als feste Ansprechperson.",
          },
          {
            q: "Was umfasst ‚Komplette IT‘?",
            a: "Das kann Geräte, Nutzerzugänge, Netzwerk, Sicherheit, Backups, Lizenzen und Support umfassen. Der genaue Umfang und die Erreichbarkeit werden nach einer Bestandsaufnahme vereinbart.",
          },
          {
            q: "Arbeiten Sie mit vorhandenen Systemen und Dienstleistern weiter?",
            a: "Wenn es sinnvoll ist, ja. Ich prüfe, was bleiben kann, schließe Lücken und koordiniere Beteiligte, statt funktionierende Lösungen unnötig zu ersetzen.",
          },
          {
            q: "Was ist der erste Schritt?",
            a: "Im Erstgespräch klären wir Ausgangslage, Ziel und Dringlichkeit. Danach erhalten Sie eine klare Empfehlung für das weitere Vorgehen.",
          },
          {
            q: "Wovon hängt der Preis ab?",
            a: "Vom Leistungsbereich, Umfang und der Klarheit der Aufgabe. Abgegrenzte Vorhaben sind als Festpreis möglich; laufende Betreuung wird individuell vereinbart.",
          },
          {
            q: "Bleiben Sie nach der Umsetzung zuständig?",
            a: "Auf Wunsch ja. Betreuung, Anpassungen und operative Verantwortung können bedarfsgerecht oder als monatliches Modell vereinbart werden.",
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
            q: "I don't know exactly what I need yet. Can we still talk?",
            a: "Yes. It is enough to describe what costs time, creates uncertainty or does not work well day to day — we will identify the sensible next step together.",
          },
          {
            q: "Can you take responsibility for digitalization as a whole?",
            a: "Yes. Depending on the agreement, I can handle planning, implementation, coordination of existing providers and ongoing support as your dedicated contact.",
          },
          {
            q: "What does ‘Complete IT’ include?",
            a: "It can include devices, user accounts, networks, security, backups, licences and support. The exact scope and availability are agreed after an assessment.",
          },
          {
            q: "Will you work with our existing systems and providers?",
            a: "Yes, where that makes sense. I assess what can stay, close the gaps and coordinate contributors instead of replacing working solutions without reason.",
          },
          {
            q: "What is the first step?",
            a: "In the initial consultation we clarify the current situation, goal and urgency. You then receive a clear recommendation for what should happen next.",
          },
          {
            q: "What determines the price?",
            a: "The service area, scope and how clearly the task is defined. Clearly bounded projects can use a fixed price; ongoing support is agreed individually.",
          },
          {
            q: "Will you remain responsible after implementation?",
            a: "If you wish. Support, changes and operational responsibility can be agreed as needed or as a monthly arrangement.",
          },
        ],
      };
}
