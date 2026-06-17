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
          {
            q: "Was kostet ein Projekt ungefähr?",
            a: "Pauschal oder nach Aufwand — je nach Projekt. Für klar umrissene Vorhaben gebe ich gern einen Festpreis ab, für offenere ein Tages- oder Stundenbudget mit Obergrenze. Konkrete Sätze finden Sie auf der Preise-Seite.",
          },
          {
            q: "Übernehmen Sie auch Wartung und Support nach dem Launch?",
            a: "Ja. Nach dem Launch biete ich Wartung, Updates und Weiterentwicklung — auf Abruf oder als monatliches Kontingent. So bleibt Ihre Anwendung sicher und aktuell, ohne dass Sie ein eigenes Team aufbauen müssen.",
          },
          {
            q: "Wem gehört der Code am Ende?",
            a: "Ihnen — vollständig. Nach Bezahlung gehen sämtliche Rechte am erstellten Code an Sie über, inklusive Repository-Zugriff. Kein Vendor-Lock-in, keine versteckten Lizenzen.",
          },
          {
            q: "Können Sie ein bestehendes Projekt übernehmen?",
            a: "Häufig ja. Ich starte mit einem kurzen Code- und Architektur-Audit, um Risiken und Aufwand einzuschätzen, und sage Ihnen ehrlich, ob eine Übernahme, ein Refactoring oder ein Neubau sinnvoller ist.",
          },
          {
            q: "Wie läuft die Zusammenarbeit und Kommunikation ab?",
            a: "Transparent und in Ihrem Takt. Sie bekommen regelmäßige Updates, Zugang zum Projektboard und einen festen Ansprechpartner — mich. Keine Ticket-Hotline, kein Account-Manager dazwischen.",
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
          {
            q: "Roughly what does a project cost?",
            a: "Fixed price or time-and-materials — depending on the project. For clearly scoped work I'm happy to quote a fixed price; for open-ended work, a day or hour budget with a ceiling. Concrete rates are on the pricing page.",
          },
          {
            q: "Do you handle maintenance and support after launch?",
            a: "Yes. After launch I offer maintenance, updates, and further development — on demand or as a monthly retainer. Your app stays secure and current without you building an in-house team.",
          },
          {
            q: "Who owns the code in the end?",
            a: "You do — entirely. On payment, all rights to the code transfer to you, including repository access. No vendor lock-in, no hidden licences.",
          },
          {
            q: "Can you take over an existing project?",
            a: "Often, yes. I start with a short code and architecture audit to gauge risk and effort, and tell you honestly whether taking it over, refactoring, or rebuilding makes more sense.",
          },
          {
            q: "How does collaboration and communication work?",
            a: "Transparently, at your pace. You get regular updates, access to the project board, and one fixed point of contact — me. No ticket hotline, no account manager in between.",
          },
        ],
      };
}
