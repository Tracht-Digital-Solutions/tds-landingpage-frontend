/**
 * Source of truth for the FAQ content. Lives here so the visible `<details>`
 * accordions, the dedicated questions page and the FAQPage JSON-LD all read the
 * same items — structured data has to match the visible answer 1:1, so we
 * render from one place.
 *
 * Copy stays inline (not promoted to tds-shared) — FAQ answers drift faster
 * than the rest of the bundle.
 *
 * ### How the questions are written (2026-09-15, extended 2026-09-29)
 *
 * - As a visitor or a search asks them ("Was kostet eine Website?"), and
 *   answered in the first sentence — a question an answer engine lifts has to
 *   stand on its own.
 * - Each answered in one to three short sentences.
 * - No direct address (since 2026-10-12): questions as a search asks them
 *   ("Übernimmt Tracht Digital …?"), answers about the company. No free and
 *   no timed first conversation, no price range — the one
 *   sentence about the first conversation's cost is fixed
 *   (`homeContent.test.ts`).
 *
 * ### Six on the home page, all of them on `/fragen`
 *
 * The home page prints the first SIX (`HOME_FAQ_COUNT`), which is the site's
 * rule for how much a landing page may ask of a reader. The rest live on
 * `/fragen` (`/en/questions`), grouped by `FAQ_GROUPS`, and the home page links
 * there. The JSON-LD follows what is VISIBLE on each page: six on the home
 * page, twelve on the questions page. Marking up an answer a page does not
 * show is the one thing Google's FAQPage guidance forbids outright.
 *
 * So the ORDER of `items` is load-bearing: the first six are the six a visitor
 * is most likely to arrive with. Adding a question means deciding whether it
 * belongs in that six, not appending it.
 *
 * ### Facts in here that are Julian's, not mine
 *
 * `dauer`, `zugaenge`, `mitwirkung`, `digitalisierung`, `pflegen` and `ausfall`
 * were written from his answers on 2026-09-29. Two constraints came with them:
 * hosting is NOT mentioned anywhere (asked for explicitly), and `mitwirkung` is
 * the one answer he has not confirmed — it promises the least it can while
 * still being useful, and should be read before the next release.
 *
 * `intro` IS STILL PART OF THE SHAPE but is no longer rendered. It stays in the
 * type and therefore in the `faq_v2` block schema so text an admin already
 * saved keeps showing up in the editor. Do not delete it to "clean up".
 */

/**
 * The questions page's route, per language. Code-owned like every other slug on
 * this site: a CMS-controlled route key is a CMS-controlled 404.
 *
 * FULL paths, `/en` included — the same shape as `CREDENTIALS_SLUG` and
 * `BUSINESS_CARD_SLUG`, because `SITEMAP_ENTRIES` reads these directly and
 * `sitemap.test.ts` requires the English entry to start with `/en`. Do not run
 * these through `localizePath`: it would produce `/en/en/questions`.
 */
export const FAQ_PAGE_SLUG = { de: "/fragen", en: "/en/questions" } as const;

/**
 * ISO date of the last change to the committed FAQ copy. Rendered as "Stand"
 * on the questions page, published as its `dateModified`, and the entry's
 * `lastmod` in the sitemap — the same three uses `ServiceDefinition.updatedAt`
 * has. Raise it only when an answer changes; a panel override does not move it,
 * because the panel cannot say when the copy it replaced was written.
 */
export const FAQ_PAGE_UPDATED_AT = "2026-10-12";

/** The questions page, in one language. */
export function faqPageHref(lang: "de" | "en"): string {
  return FAQ_PAGE_SLUG[lang];
}

/** The three sections of the questions page, in the order they appear. */
export const FAQ_GROUPS = ["takeover", "pricing", "cooperation"] as const;
export type FaqGroup = (typeof FAQ_GROUPS)[number];

/** How many the home page shows. The rest are reachable from the link below them. */
export const HOME_FAQ_COUNT = 6;

export interface FaqItem {
  q: string;
  a: string;
  /** Which section of `/fragen` it appears under. */
  group: FaqGroup;
}

export interface FaqContent {
  label: string;
  headline: string;
  headlineAccent: string;
  /** Not rendered — see the note above before removing it. */
  intro: string;
  items: FaqItem[];
}

/** The six the home page shows, in order. */
export function homeFaqItems(content: FaqContent): FaqItem[] {
  return content.items.slice(0, HOME_FAQ_COUNT);
}

/** Every question, bucketed for the questions page. Empty groups are dropped. */
export function groupedFaqItems(content: FaqContent): Array<{ group: FaqGroup; items: FaqItem[] }> {
  return FAQ_GROUPS.map((group) => ({
    group,
    items: content.items.filter((item) => item.group === group),
  })).filter((section) => section.items.length > 0);
}

/** Headings for the questions page's three sections, and the page's own copy. */
export function getFaqPageCopy(lang: "de" | "en") {
  return lang === "de"
    ? {
        title: "Häufige Fragen",
        headline: "Alle",
        headlineAccent: "Fragen.",
        intro:
          "Übernahme, Preise und Zusammenarbeit – die Fragen, die Tracht Digital Solutions am häufigsten gestellt werden.",
        // The answer-first paragraph: who answers, what about, for whom, where.
        // It is the first thing an answer engine reads after the headline, and
        // the first thing a reader needs in order to trust the rest.
        answer:
          "Die Fragen auf dieser Seite beantwortet Julian Tracht selbst – Inhaber von Tracht Digital Solutions in Schwarzenbek bei Hamburg, tätig für Unternehmen in ganz Deutschland. Es geht um Websites und eigene Software, um Festpreise und Dauer, um den Umgang mit KI und um die Betreuung nach dem Start.",
        seoTitle: "Häufige Fragen zu Website, Preis und Ablauf — Tracht Digital",
        description:
          "Antworten zu Websites, eigener Software, Festpreisen, Dauer, KI und Betreuung – kurz beantwortet, ohne Fachsprache.",
        groups: {
          takeover: "Übernahme und Umsetzung",
          pricing: "Preise und Dauer",
          cooperation: "Zusammenarbeit",
        } satisfies Record<FaqGroup, string>,
        backLabel: "Zurück zur Startseite",
        ctaTitle: "Eine Frage ist offen geblieben?",
        ctaText: "Eine kurze Nachricht genügt – Antwort in der Regel innerhalb von 24 Stunden.",
        ctaButton: "Nachricht schreiben",
      }
    : {
        title: "Common questions",
        headline: "All",
        headlineAccent: "questions.",
        intro:
          "Takeovers, pricing and working together – the questions Tracht Digital Solutions is asked most often.",
        answer:
          "The questions on this page are answered by Julian Tracht himself – owner of Tracht Digital Solutions in Schwarzenbek near Hamburg, working with companies across Germany. They cover websites and custom software, fixed prices and timelines, the use of AI and support after launch.",
        seoTitle: "Common Questions on Websites and Pricing — Tracht Digital",
        description:
          "Answers on websites, custom software, fixed prices, timelines, AI and ongoing support – answered briefly, without the jargon.",
        groups: {
          takeover: "Takeover and build",
          pricing: "Pricing and timelines",
          cooperation: "Working together",
        } satisfies Record<FaqGroup, string>,
        backLabel: "Back to the home page",
        ctaTitle: "A question still open?",
        ctaText: "A short message is enough – replies usually within 24 hours.",
        ctaButton: "Send a message",
      };
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
          // --- The six the home page shows ------------------------------
          // Erste Position, seit die Seite auf die Übernahme bestehender
          // Auftritte zugespitzt ist: das ist die Frage, mit der die meisten
          // hier ankommen, und sie steht damit über der Preisfrage.
          {
            q: "Übernimmt Tracht Digital Solutions bestehende Websites und Shops?",
            a: "Ja – auch bei WordPress, WooCommerce, Shopware, TYPO3 oder STRATO. Tracht Digital Solutions behebt Fehler und übernimmt die laufende Pflege.",
            group: "takeover",
          },
          {
            q: "Muss die Seite dafür neu gebaut werden?",
            a: "Meistens nicht. Was trägt, bleibt – neu gebaut wird nur, was sich nicht mehr reparieren lässt.",
            group: "takeover",
          },
          {
            q: "Was kostet eine Website oder ein Onlineshop?",
            a: "Für drei Pakete gilt ein Festpreis – sie stehen bei den Preisen. Alles andere wird als eigenes Angebot kalkuliert.",
            group: "pricing",
          },
          {
            // The one sentence about cost the site makes (decided 2026-09-12).
            // No "kostenlos", no duration — `homeContent.test.ts` holds both out.
            q: "Was kostet das Erstgespräch?",
            a: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
            group: "pricing",
          },
          {
            q: "Wie lange dauert ein Projekt?",
            a: "Das hängt vom Umfang ab, deshalb gibt es keine Pauschale. Im Angebot steht ein verbindlicher Termin – vor der Zusage, nicht danach.",
            group: "pricing",
          },
          {
            q: "Wem gehören Daten und Zugänge?",
            a: "Dem Kunden. Bei der Übergabe gehen alle Zugänge und alles, was zum Projekt gehört, an den Betrieb. Bei einem späteren Wechsel geht alles mit.",
            group: "cooperation",
          },

          // --- Only on /fragen ------------------------------------------
          {
            q: "Was heißt „Abläufe digitalisieren“ für einen kleinen Betrieb?",
            a: "Arbeit, die heute auf Papier, in Mails oder Tabellen läuft, wandert in ein passendes digitales Werkzeug. Den Anfang macht ein Ablauf, der jede Woche Zeit kostet. Manchmal lautet die ehrliche Antwort auch: so lassen.",
            group: "takeover",
          },
          {
            // Added 2026-10-02. The question people now arrive with, and the
            // answer is deliberately unexciting: it is the same work as always,
            // plus one technical freigabe. No promise of a placement — that is
            // the boundary the Webauftritt page draws for Google and this one
            // draws for the same reason.
            q: "Findet ChatGPT meine Seite – und kann man das beeinflussen?",
            a: "Ja, und ja. KI-Suchen lesen dieselbe Seite wie Google, achten aber auf anderes: eine klare Antwort im ersten Absatz, Fragen als Überschriften, prüfbare Angaben mit Quelle, Datum und Autor. Außerdem dürfen die KI-Crawler nicht ausgesperrt sein. Das nennt sich GEO – eine Platzierung kann trotzdem niemand versprechen.",
            group: "takeover",
          },
          {
            // Added 2026-10-12, with the Webauftritt page's new lead: the
            // question behind "nach Maß", answered without a slogan.
            q: "Baut Tracht Digital Solutions Websites aus Vorlagen?",
            a: "Nein. Gestaltung, Aufbau und Texte entstehen für jeden Betrieb neu: passend zum Firmenbild und zu dem, was seine Kunden suchen. Eine Vorlage mit ausgetauschtem Logo gibt es nicht.",
            group: "takeover",
          },
          {
            // Added 2026-10-12 at Julian's request: AI is a tool here, not the
            // one doing the job. Stated plainly, without claiming it is never
            // used — it is.
            q: "Wie nutzt Tracht Digital Solutions KI?",
            a: "Als Werkzeug, nicht als Ersatz für die Arbeit. KI hilft beim Recherchieren, Prüfen und bei Routineschritten. Entscheidungen, Gestaltung und Prüfung bleiben in Menschenhand – ungeprüfte KI-Texte gehen nicht online.",
            group: "cooperation",
          },
          {
            // Added 2026-10-12 with the "Individuelle Lösungen" lead.
            q: "Bietet Tracht Digital Solutions Auftragsprogrammierung an?",
            a: "Ja. Es entstehen Tools und Skripte für Arbeit, die heute von Hand läuft: Daten übertragen, Listen abgleichen, Berichte erstellen. Bei festem Umfang gilt ein Festpreis pro Etappe.",
            group: "takeover",
          },
          {
            // Added 2026-10-12 with the "Abläufe digitalisieren" lead.
            q: "Hilft Tracht Digital Solutions bei der Umstellung auf digitale Buchführung?",
            a: "Ja, bei der Technik. Tracht Digital Solutions bindet das Buchhaltungsprogramm ein, richtet den Weg von Belegen und Rechnungen bis zur Kanzlei ein und erklärt ihn dem Team. Die Buchführung selbst und die Steuerberatung bleiben bei der Kanzlei.",
            group: "takeover",
          },
          {
            q: "Lassen sich Texte und Bilder selbst ändern?",
            a: "Ja. Zur Übergabe gehören ein eigener Zugang und eine Einweisung. Alternativ genügt eine kurze Nachricht mit der Änderung – das ist Teil der Pflege, kein Aufpreis.",
            group: "cooperation",
          },
          {
            q: "Was ist, wenn die Seite ausfällt?",
            a: "Bei einem Ausfall kümmert sich Tracht Digital Solutions sofort, auch am Wochenende. Alle anderen Anfragen werden werktags beantwortet, in der Regel am selben Tag.",
            group: "cooperation",
          },
          {
            q: "Was wird für den Projektstart gebraucht?",
            a: "Erst einmal nur, was schon vorhanden ist: Texte, Bilder, Zugänge. Fehlt etwas, kommt eine klare Liste – Texte schreibt Tracht Digital Solutions auf Wunsch auch selbst.",
            group: "cooperation",
          },
          {
            q: "Funktioniert die Zusammenarbeit mit bisherigen Anbietern weiter?",
            a: "Wenn es sinnvoll ist, ja. Was gut läuft, bleibt.",
            group: "cooperation",
          },
          {
            q: "Gibt es Betreuung nach dem Start?",
            a: "Ja, auf Wunsch – nach Bedarf oder als festes Monatsmodell mit Wartung, Updates und Weiterentwicklung.",
            group: "cooperation",
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
            q: "Does Tracht Digital Solutions take over existing websites and shops?",
            a: "Yes – including WordPress, WooCommerce, Shopware, TYPO3 or STRATO. Tracht Digital Solutions fixes errors and takes over ongoing maintenance.",
            group: "takeover",
          },
          {
            q: "Does the site have to be rebuilt for that?",
            a: "Usually not. What holds up stays — only what cannot be repaired gets rebuilt.",
            group: "takeover",
          },
          {
            q: "What does a website or an online shop cost?",
            a: "Three packages have a fixed price, listed under Pricing. Everything else gets a quote of its own.",
            group: "pricing",
          },
          {
            q: "What does the first conversation cost?",
            a: "Costs only arise once we agree on an assignment.",
            group: "pricing",
          },
          {
            q: "How long does a project take?",
            a: "That depends on the scope, so there is no blanket figure. The quote carries a binding date — before any commitment, not after.",
            group: "pricing",
          },
          {
            q: "Who owns the data and the logins?",
            a: "The client does. At handover every login and everything belonging to the project goes to the business. A later switch takes all of it along.",
            group: "cooperation",
          },

          {
            q: "What does “digitalizing workflows” mean for a small business?",
            a: "Work that runs on paper, in emails or spreadsheets today moves into a suitable digital tool. It starts with one routine that costs time every week. Sometimes the honest answer is: leave it as it is.",
            group: "takeover",
          },
          {
            q: "Does ChatGPT find my site – and can that be influenced?",
            a: "Yes, and yes. AI search reads the same page Google does, but weighs different things: a clear answer in the first paragraph, questions as headings, checkable facts with sources, a date and an author. And the AI crawlers must not be shut out. It is called GEO – but nobody can promise a placement.",
            group: "takeover",
          },
          {
            q: "Does Tracht Digital Solutions build websites from templates?",
            a: "No. Design, structure and copy are made for each business: true to its brand and to what its customers look for. There is no template with a swapped-in logo.",
            group: "takeover",
          },
          {
            q: "How does Tracht Digital Solutions use AI?",
            a: "As a tool, not as a substitute for the work. AI helps with research, checking and routine steps. Decisions, design and review stay with a person – unchecked AI copy does not go online.",
            group: "cooperation",
          },
          {
            q: "Does Tracht Digital Solutions offer contract programming?",
            a: "Yes. It builds tools and scripts for work that is done by hand today: moving data, matching lists, building reports. A fixed scope gets a fixed price per stage.",
            group: "takeover",
          },
          {
            q: "Does Tracht Digital Solutions help with the switch to digital bookkeeping?",
            a: "Yes, with the technology. Tracht Digital Solutions integrates the accounting software, sets up the path from receipts and invoices to the accountant and explains it to the team. The bookkeeping itself and tax advice stay with the accountant.",
            group: "takeover",
          },
          {
            q: "Can text and images be changed in-house?",
            a: "Yes. Handover includes a login and a walkthrough. Alternatively a short message with the change is enough — that is part of maintenance, not an extra.",
            group: "cooperation",
          },
          {
            q: "What happens if the site goes down?",
            a: "If the site is down, Tracht Digital Solutions deals with it straight away, at the weekend too. All other requests are answered on weekdays, usually the same day.",
            group: "cooperation",
          },
          {
            q: "What is needed to start a project?",
            a: "To begin with, only what already exists: text, images, logins. If something is missing, a clear list follows — and Tracht Digital Solutions can write the text as well.",
            group: "cooperation",
          },
          {
            q: "Does the work continue alongside current suppliers?",
            a: "Where it makes sense, yes. What works stays.",
            group: "cooperation",
          },
          {
            q: "Is there support after launch?",
            a: "Yes, on request — as needed, or as a fixed monthly arrangement covering maintenance, updates and further development.",
            group: "cooperation",
          },
        ],
      };
}
