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
          "Was am häufigsten gefragt wird, bevor jemand anfragt — hier kurz vorweg.",
        items: [
          {
            q: "Ich weiß noch nicht genau, was ich brauche. Können wir trotzdem sprechen?",
            a: "Ja, das ist eher der Normalfall. Es reicht, wenn Sie beschreiben können, was Sie im Alltag stört — was daraus wird, klären wir gemeinsam.",
          },
          {
            q: "Was ist der erste Schritt?",
            a: "Schreiben Sie mir in zwei Sätzen, wo es hakt. Ich melde mich in der Regel innerhalb von 24 Stunden und frage nach.",
          },
          {
            q: "Wovon hängt der Preis ab?",
            a: "Vom Umfang und davon, wie klar das Vorhaben ist. Klar abgestecktes gern zum Festpreis, sonst ein Budget mit Obergrenze.",
          },
          {
            q: "Wie lange dauert so etwas?",
            a: "Eine überschaubare Website meist zwei bis vier Wochen, ein kleines Werkzeug oft wenige Tage, ein Webshop vier bis zehn Wochen.",
          },
          {
            q: "Nehmen Sie auch kleine Aufträge an?",
            a: "Ja. Eine Excel-Vorlage, eine Auswertung oder ein paar Anpassungen sind völlig in Ordnung — nicht jedes Vorhaben muss ein Projekt sein.",
          },
          {
            q: "Übernehmen Sie auch eine bestehende Website?",
            a: "Häufig ja. Ich sehe mir an, worauf sie aufgebaut ist, und sage ehrlich, ob Pflegen, Überarbeiten oder Neubauen günstiger ist.",
          },
          {
            q: "Kümmern Sie sich danach weiter darum?",
            a: "Auf Wunsch ja — Updates, kleine Änderungen, neue Inhalte. Entweder bei Bedarf oder als monatliches Kontingent; ein Muss ist es nicht.",
          },
          {
            q: "Brauche ich eine Website oder gleich einen Webshop?",
            a: "Das hängt an Ihrem Sortiment und daran, wer online bei Ihnen kaufen würde. Ein Shop bringt laufende Arbeit mit, eine Website nicht.",
          },
          {
            q: "Kann ich Inhalte später selbst pflegen?",
            a: "Ja. Texte, Bilder, Produkte und Preise ändern Sie selbst — auf Wunsch so eingerichtet, dass das auch vom Handy aus geht.",
          },
          {
            q: "Wie ist das mit Datenschutz und DSGVO?",
            a: "Gehört zur Umsetzung, nicht zum Aufpreis. Formular, Cookies und Einwilligungen setze ich gleich richtig auf, Impressum und Datenschutz vorbereitet.",
          },
          {
            q: "Arbeiten Sie auch außerhalb von Schwarzenbek und Hamburg?",
            a: "Ja, deutschlandweit. Üblich sind Video und E-Mail; Termine vor Ort rund um Hamburg sind gut machbar, Reisekosten kommen separat dazu.",
          },
        ],
      }
    : {
        label: "— FAQ",
        headline: "Common",
        headlineAccent: "questions.",
        intro:
          "What gets asked most often before anyone gets in touch — answered here.",
        items: [
          {
            q: "I don't know exactly what I need yet. Can we still talk?",
            a: "Yes, that's the normal case. It's enough if you can describe what gets in your way day to day — what comes of it we work out together.",
          },
          {
            q: "What's the first step?",
            a: "Tell me in two sentences where things are getting stuck. I usually reply within 24 hours and ask follow-up questions.",
          },
          {
            q: "What does the price depend on?",
            a: "On scope, and on how clearly the job is defined. Clearly scoped work at a fixed price, otherwise a budget with a ceiling.",
          },
          {
            q: "How long does something like this take?",
            a: "A manageable website usually two to four weeks, a small tool often a few days, an online shop four to ten weeks.",
          },
          {
            q: "Do you take on small jobs?",
            a: "Yes. A spreadsheet template, a report or a few changes are all fine — not every piece of work has to be a project.",
          },
          {
            q: "Can you take over an existing website?",
            a: "Often, yes. I look at what it's built on, then tell you honestly whether maintaining, reworking or rebuilding is cheaper.",
          },
          {
            q: "Do you keep looking after it afterwards?",
            a: "If you want — updates, small changes, new content. Either as needed or as a monthly allowance; it isn't compulsory.",
          },
          {
            q: "Do I need a website or an online shop?",
            a: "That depends on your range and on who would actually buy from you online. A shop brings ongoing work with it, a website doesn't.",
          },
          {
            q: "Can I maintain the content myself later?",
            a: "Yes. Text, images, products and prices are yours to change — set up, on request, so it works from a phone too.",
          },
          {
            q: "What about data protection and GDPR?",
            a: "Part of the build, not a surcharge. Form, cookies and consent are set up correctly from the start, imprint and privacy policy prepared.",
          },
          {
            q: "Do you work outside Schwarzenbek and Hamburg?",
            a: "Yes, across Germany. Usually video and email; on-site meetings around Hamburg are straightforward, travel costs billed separately.",
          },
        ],
      };
}
