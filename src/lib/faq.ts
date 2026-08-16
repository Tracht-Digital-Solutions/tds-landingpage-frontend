/**
 * Source of truth for the FAQ section content. Lives here so both
 * the visible `<details>` accordions and the FAQPage JSON-LD on the
 * homepage can read the same items — Google's rich-result eligibility
 * check rejects FAQ schema where the answer text doesn't match the
 * visible answer 1:1, so we render from one place.
 *
 * Copy stays inline (not promoted to tds-shared) — FAQ answers drift
 * faster than the rest of the bundle.
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
          "Die Fragen, die am häufigsten kommen, bevor jemand anfragt — hier kurz vorweg beantwortet.",
        items: [
          {
            q: "Ich weiß noch nicht genau, was ich brauche. Können wir trotzdem sprechen?",
            a: "Ja, und das ist eher der Normalfall als die Ausnahme. Es reicht, wenn Sie beschreiben können, was Sie im Alltag stört. Was daraus wird — eine Website, ein Shop, ein kleines Werkzeug oder erst einmal gar nichts — klären wir gemeinsam.",
          },
          {
            q: "Was ist der erste Schritt?",
            a: "Schreiben Sie mir in zwei Sätzen, wo es gerade hakt. Ich melde mich in der Regel innerhalb von 24 Stunden und stelle Rückfragen, bis ich Ihre Arbeit verstanden habe. Erst danach reden wir über Umsetzung.",
          },
          {
            q: "Wovon hängt der Preis ab?",
            a: "Vom Umfang und davon, wie klar das Vorhaben umrissen ist. Für klar abgesteckte Arbeiten gebe ich gern einen Festpreis, sonst ein Stunden- oder Tagesbudget mit Obergrenze, auf die Sie sich verlassen können. Die Stundensätze stehen offen auf der Preise-Seite.",
          },
          {
            q: "Wie lange dauert so etwas?",
            a: "Eine überschaubare Website ist meist in zwei bis vier Wochen fertig, ein kleines Werkzeug oft in wenigen Tagen, ein Webshop je nach Sortiment in vier bis zehn Wochen. Vor dem Start bekommen Sie eine ehrliche Schätzung, keine Wunschzahl.",
          },
          {
            q: "Nehmen Sie auch kleine Aufträge an?",
            a: "Ja. Eine Excel-Vorlage, eine Auswertung oder ein paar Anpassungen an einer bestehenden Seite sind völlig in Ordnung. Nicht jedes Vorhaben muss ein Projekt sein, um sich zu lohnen.",
          },
          {
            q: "Übernehmen Sie auch eine bestehende Website?",
            a: "Häufig ja. Ich sehe mir zuerst an, worauf sie aufgebaut ist, und sage Ihnen dann ehrlich, ob Weiterpflegen, Überarbeiten oder Neubauen der günstigere Weg ist. Manchmal ist es das Weiterpflegen.",
          },
          {
            q: "Kümmern Sie sich danach weiter darum?",
            a: "Auf Wunsch ja — Updates, kleine Änderungen, neue Inhalte. Entweder bei Bedarf oder als festes monatliches Kontingent. Es ist aber kein Muss: Sie sind nach der Übergabe nicht an mich gebunden.",
          },
          {
            q: "Brauche ich eine Website oder gleich einen Webshop?",
            a: "Das hängt an Ihrem Sortiment und daran, wer online bei Ihnen kaufen würde. Ein Shop bringt laufende Arbeit mit sich, die eine Website nicht hat. Wenn das nicht passt, sage ich Ihnen das lieber vorher als hinterher.",
          },
          {
            q: "Kann ich Inhalte später selbst pflegen?",
            a: "Ja. Texte, Bilder, Produkte und Preise können Sie selbst ändern, ohne mich zu fragen. Auf Wunsch richte ich das so ein, dass Artikel und Bestand auch vom Handy aus gepflegt werden können.",
          },
          {
            q: "Wie ist das mit Datenschutz und DSGVO?",
            a: "Gehört für mich zur Umsetzung, nicht zum Aufpreis. Kontaktformular, Cookies, Einwilligungen und Auftragsverarbeitung werden gleich richtig aufgesetzt, und Sie bekommen Impressum und Datenschutzerklärung so vorbereitet, dass Ihre Rechtsberatung nur noch prüfen muss.",
          },
          {
            q: "Arbeiten Sie auch außerhalb von Schwarzenbek und Hamburg?",
            a: "Ja, deutschlandweit. Der übliche Weg ist per Video und E-Mail; Termine vor Ort in Hamburg und Umgebung sind gut machbar, weitere Anfahrten nach Absprache. Reisekosten kommen dann separat dazu.",
          },
        ],
      }
    : {
        label: "— FAQ",
        headline: "Common",
        headlineAccent: "questions.",
        intro:
          "The questions that come up most often before anyone gets in touch — answered briefly here.",
        items: [
          {
            q: "I don't know exactly what I need yet. Can we still talk?",
            a: "Yes, and that's the normal case rather than the exception. It's enough if you can describe what gets in your way day to day. What comes of it — a website, a shop, a small tool, or nothing at all for now — we work out together.",
          },
          {
            q: "What's the first step?",
            a: "Tell me in two sentences where things are getting stuck. I usually reply within 24 hours and keep asking until I understand how you work. Only then do we talk about building anything.",
          },
          {
            q: "What does the price depend on?",
            a: "On scope, and on how clearly the job is defined. For clearly scoped work I'm happy to quote a fixed price; otherwise an hourly or daily budget with a ceiling you can rely on. The hourly rates are published openly on the pricing page.",
          },
          {
            q: "How long does something like this take?",
            a: "A manageable website is usually done in two to four weeks, a small tool often in a few days, an online shop in four to ten weeks depending on the range. You get an honest estimate before the start, not a hopeful one.",
          },
          {
            q: "Do you take on small jobs?",
            a: "Yes. A spreadsheet template, a report, or a few changes to an existing site are all fine. Not every piece of work has to be a project to be worth doing.",
          },
          {
            q: "Can you take over an existing website?",
            a: "Often, yes. I first look at what it's built on, then tell you honestly whether maintaining, reworking or rebuilding is the cheaper route. Sometimes it's maintaining.",
          },
          {
            q: "Do you keep looking after it afterwards?",
            a: "If you want — updates, small changes, new content. Either as needed or as a fixed monthly allowance. It isn't compulsory: you aren't tied to me once it's handed over.",
          },
          {
            q: "Do I need a website or an online shop?",
            a: "That depends on your range and on who would actually buy from you online. A shop brings ongoing work with it that a website doesn't. If that doesn't fit you, I'd rather say so beforehand than afterwards.",
          },
          {
            q: "Can I maintain the content myself later?",
            a: "Yes. Text, images, products and prices are yours to change without asking me. On request I'll set it up so items and stock can also be maintained from a phone.",
          },
          {
            q: "What about data protection and GDPR?",
            a: "Part of the build for me, not a surcharge. The contact form, cookies, consent and data-processing agreements are set up correctly from the start, and you get the imprint and privacy policy prepared so your legal advisor only has to check them.",
          },
          {
            q: "Do you work outside Schwarzenbek and Hamburg?",
            a: "Yes, across Germany. The usual route is video and email; on-site meetings around Hamburg are straightforward, further travel on request. Travel costs are then billed separately.",
          },
        ],
      };
}
