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
          "Die Fragen, die in den meisten Erstgesprächen zuerst kommen — kurz vorab beantwortet, falls Sie sie sich auch stellen.",
        items: [
          {
            q: "Wie lange dauert ein typisches Projekt?",
            a: "Stark abhängig vom Umfang. Ein klickbarer Prototyp ist in wenigen Tagen fertig, eine MVP-Web-App meist in 6–10 Wochen, eine ausgewachsene Plattform in 3–6 Monaten. Ich gebe vor dem Start eine ehrliche Schätzung mit Obergrenze ab.",
          },
          {
            q: "Arbeiten Sie remote oder vor Ort?",
            a: "Beides. Standard ist remote mit regelmäßigen Video-Updates. Vor-Ort-Termine in Hamburg und Umgebung sind möglich, alles Weitere nach Absprache. Reisekosten sind nicht in den Sätzen enthalten.",
          },
          {
            q: "Unterschreiben Sie eine NDA?",
            a: "Ja, gerne. Senden Sie mir Ihre NDA vor dem Erstgespräch zu, dann ist sie zum Start unterzeichnet. Wenn Sie keine eigene Vorlage haben, stelle ich einen schlanken Standard-Vertrag bereit.",
          },
          {
            q: "Was ist der erste Schritt?",
            a: "Ein 30–60-minütiges Erstgespräch per Video — kostenfrei, unverbindlich, ohne Sales-Pitch. Ich höre zu, frage nach und sage offen, ob ich der Richtige für Ihr Vorhaben bin.",
          },
          {
            q: "Welche Tech-Stacks bevorzugen Sie?",
            a: "Keine Religionskriege. TypeScript / Node.js fürs Backend, Vue / Angular / React fürs Frontend, Python und KNIME für Datenpipelines, C# für Desktop-Apps. Bei jedem Projekt wähle ich das Werkzeug nach dem Problem, nicht umgekehrt.",
          },
          {
            q: "Können wir auch nur einen Workshop oder ein Audit buchen?",
            a: "Ja. Architektur-Reviews, Code-Audits und Inhouse-Workshops (TypeScript, Architektur, KI im Mittelstand) sind eigenständige Formate. Stundensätze siehe Preise.",
          },
        ],
      }
    : {
        label: "— FAQ",
        headline: "Common",
        headlineAccent: "questions.",
        intro:
          "The questions that come up first in most discovery calls — answered briefly here in case you're wondering the same.",
        items: [
          {
            q: "How long does a typical project take?",
            a: "Heavily scope-dependent. A clickable prototype takes a few days, an MVP web app usually 6–10 weeks, a full platform 3–6 months. I give an honest estimate with a ceiling before the project starts.",
          },
          {
            q: "Do you work remote or on-site?",
            a: "Both. The default is remote with regular video updates. On-site meetings around Hamburg are possible, further travel on request. Travel costs are not included in the rates.",
          },
          {
            q: "Will you sign an NDA?",
            a: "Happily. Send me your NDA before the discovery call so it's signed by the time we start. If you don't have a template, I'll provide a lean standard contract.",
          },
          {
            q: "What's the first step?",
            a: "A 30–60-minute video discovery call — free, no obligation, no sales pitch. I listen, ask questions, and tell you honestly whether I'm the right fit for your project.",
          },
          {
            q: "Which tech stacks do you prefer?",
            a: "No religious wars. TypeScript / Node.js on the backend, Vue / Angular / React on the frontend, Python and KNIME for data pipelines, C# for desktop apps. I pick the tool to fit the problem, not the other way around.",
          },
          {
            q: "Can I book just a workshop or an audit?",
            a: "Yes. Architecture reviews, code audits, and in-house workshops (TypeScript, architecture, AI for mid-market) are standalone formats. See pricing for hourly rates.",
          },
        ],
      };
}
