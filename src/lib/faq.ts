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
 * - "du", no free and no timed first conversation, no price range — the one
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
          "Übernahme, Preise und Zusammenarbeit – die Fragen, die mir am häufigsten gestellt werden.",
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
        ctaTitle: "Deine Frage war nicht dabei?",
        ctaText: "Schreib mir direkt – Antwort in der Regel innerhalb von 24 Stunden.",
        ctaButton: "Schreib mir",
      }
    : {
        title: "Common questions",
        headline: "All",
        headlineAccent: "questions.",
        intro:
          "Takeovers, pricing and working together – the questions I am asked most often.",
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
        ctaTitle: "Your question was not here?",
        ctaText: "Write to me directly – I usually reply within 24 hours.",
        ctaButton: "Write to me",
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
            q: "Kannst du meine bestehende Website oder meinen Shop übernehmen?",
            a: "Ja – auch bei WordPress, WooCommerce, Shopware, TYPO3 oder STRATO. Ich behebe Fehler und übernehme die Pflege.",
            group: "takeover",
          },
          {
            q: "Muss die Seite dafür neu gebaut werden?",
            a: "Meistens nicht. Was trägt, bleibt – neu gebaut wird nur, was sich nicht mehr reparieren lässt.",
            group: "takeover",
          },
          {
            q: "Was kostet eine Website oder ein Onlineshop?",
            a: "Für drei Pakete gilt ein Festpreis – sie stehen bei den Preisen. Alles andere bekommst du als eigenes Angebot.",
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
            q: "Wie lange dauert es, bis meine Seite läuft?",
            a: "Das hängt vom Umfang ab, deshalb nenne ich keine Pauschale. Im Angebot steht ein verbindlicher Termin – vor der Zusage, nicht danach.",
            group: "pricing",
          },
          {
            q: "Wem gehören die Seite und die Zugänge?",
            a: "Dir. Du bekommst alle Zugänge, und bei der Übergabe gehört dir alles, was zur Seite gehört. Wechselst du später, nimmst du alles mit.",
            group: "cooperation",
          },

          // --- Only on /fragen ------------------------------------------
          {
            q: "Was heißt „Abläufe digitalisieren“ bei einem Betrieb wie meinem?",
            a: "Arbeit, die heute auf Papier, in Mails oder Tabellen läuft, wandert in ein passendes digitales Werkzeug. Nenn mir einen Ablauf, der dich jede Woche Zeit kostet – ich sage dir, was sich lohnt. Manchmal lautet die Antwort auch: so lassen.",
            group: "takeover",
          },
          {
            // Added 2026-10-02. The question people now arrive with, and the
            // answer is deliberately unexciting: it is the same work as always,
            // plus one technical freigabe. No promise of a placement — that is
            // the boundary the Webauftritt page draws for Google and this one
            // draws for the same reason.
            q: "Findet ChatGPT meine Seite – und kann man das beeinflussen?",
            a: "Ja, und ja. KI-Suchen lesen dieselbe Seite wie Google, achten aber auf anderes: eine klare Antwort im ersten Absatz, Fragen als Überschriften, prüfbare Angaben mit Quelle, Datum und Autor. Außerdem dürfen die KI-Crawler nicht ausgesperrt sein. Das nennt sich GEO – eine Platzierung kann dir trotzdem niemand versprechen.",
            group: "takeover",
          },
          {
            // Added 2026-10-12, with the Webauftritt page's new lead: the
            // question behind "nach Maß", answered without a slogan.
            q: "Baust du Websites aus Vorlagen?",
            a: "Nein. Gestaltung, Aufbau und Texte entstehen für deinen Betrieb: passend zu deinem Firmenbild und zu dem, was deine Kunden suchen. Eine Vorlage mit ausgetauschtem Logo bekommst du von mir nicht.",
            group: "takeover",
          },
          {
            // Added 2026-10-12 at Julian's request: AI is a tool here, not the
            // one doing the job. Stated plainly, without claiming it is never
            // used — it is.
            q: "Wie gehst du mit KI um?",
            a: "Als Werkzeug, nicht als Ersatz für meine Arbeit. KI hilft mir beim Recherchieren, Prüfen und bei Routineschritten. Was du bekommst, entscheide, gestalte und prüfe ich selbst – ungeprüfte KI-Texte gehen bei mir nicht online.",
            group: "cooperation",
          },
          {
            // Added 2026-10-12 with the "Individuelle Lösungen" lead.
            q: "Programmierst du auch im Auftrag?",
            a: "Ja. Ich schreibe Tools und Skripte für Arbeit, die heute von Hand läuft: Daten übertragen, Listen abgleichen, Berichte erstellen. Du beschreibst den Ablauf, ich sage dir, was sich lohnt – bei festem Umfang zum Festpreis pro Etappe.",
            group: "takeover",
          },
          {
            // Added 2026-10-12 with the "Abläufe digitalisieren" lead.
            q: "Hilfst du bei der Umstellung auf digitale Buchführung?",
            a: "Ja, bei der Technik. Ich binde das Buchhaltungsprogramm ein, richte den Weg von Belegen und Rechnungen bis zur Kanzlei ein und erkläre ihn deinem Team. Die Buchführung selbst und die Steuerberatung bleiben bei deiner Kanzlei.",
            group: "takeover",
          },
          {
            q: "Kann ich Texte und Bilder selbst ändern?",
            a: "Ja, wenn du willst. Ich richte dir den Zugang ein und zeige dir, wie es geht. Oder du schickst mir die Änderung – das ist Teil der Pflege, kein Aufpreis.",
            group: "cooperation",
          },
          {
            q: "Was ist, wenn die Seite ausfällt?",
            a: "Dann kümmere ich mich – bei einem Ausfall auch am Wochenende. Alles andere beantworte ich werktags, in der Regel am selben Tag.",
            group: "cooperation",
          },
          {
            q: "Was brauchst du von mir?",
            a: "Erst einmal nur, was du schon hast: Texte, Bilder, Zugänge. Fehlt etwas, sage ich dir, was noch gebraucht wird – Texte kann ich auch schreiben.",
            group: "cooperation",
          },
          {
            q: "Arbeitest du mit meinen bisherigen Anbietern weiter?",
            a: "Wenn es sinnvoll ist, ja. Was gut läuft, bleibt.",
            group: "cooperation",
          },
          {
            q: "Bleibst du nach dem Start dabei?",
            a: "Auf Wunsch ja – nach Bedarf oder als festes Monatsmodell.",
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
            q: "Can you take over my existing website or shop?",
            a: "Yes – including WordPress, WooCommerce, Shopware, TYPO3 or STRATO. I fix errors and take over the maintenance.",
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
            q: "How long until my site is live?",
            a: "That depends on the scope, so I do not quote a blanket figure. The quote carries a binding date — before you commit, not after.",
            group: "pricing",
          },
          {
            q: "Who owns the site and the logins?",
            a: "You do. You get every login, and at handover everything belonging to the site belongs to you. If you switch later, you take all of it with you.",
            group: "cooperation",
          },

          {
            q: "What does “digitalizing workflows” mean for a business like mine?",
            a: "Work that runs on paper, in emails or spreadsheets today moves into a suitable digital tool. Name a routine that costs you time every week — I will tell you what is worth it. Sometimes the answer is: leave it as it is.",
            group: "takeover",
          },
          {
            q: "Does ChatGPT find my site – and can that be influenced?",
            a: "Yes, and yes. AI search reads the same page Google does, but weighs different things: a clear answer in the first paragraph, questions as headings, checkable facts with sources, a date and an author. And the AI crawlers must not be shut out. It is called GEO – but nobody can promise you a placement.",
            group: "takeover",
          },
          {
            q: "Do you build websites from templates?",
            a: "No. Design, structure and copy are made for your business: true to your brand and to what your customers look for. You will not get a template with your logo swapped in.",
            group: "takeover",
          },
          {
            q: "How do you use AI?",
            a: "As a tool, not as a substitute for my work. AI helps me with research, checking and routine steps. What you get is decided, designed and checked by me – unchecked AI copy does not go online.",
            group: "cooperation",
          },
          {
            q: "Do you also do contract programming?",
            a: "Yes. I write tools and scripts for work that is done by hand today: moving data, matching lists, building reports. You describe the process, I tell you what is worth it – with a fixed scope at a fixed price per stage.",
            group: "takeover",
          },
          {
            q: "Do you help with the switch to digital bookkeeping?",
            a: "Yes, with the technology. I integrate the accounting software, set up the path from receipts and invoices to your accountant and explain it to your team. The bookkeeping itself and tax advice stay with your accountant.",
            group: "takeover",
          },
          {
            q: "Can I change text and images myself?",
            a: "Yes, if you want to. I set up your access and show you how. Or you send me the change — that is part of maintenance, not an extra.",
            group: "cooperation",
          },
          {
            q: "What happens if the site goes down?",
            a: "Then I deal with it – at the weekend too if the site is down. Everything else I answer on weekdays, usually the same day.",
            group: "cooperation",
          },
          {
            q: "What do you need from me?",
            a: "To begin with, only what you already have: text, images, logins. If something is missing, I tell you what is still needed — and I can write the text as well.",
            group: "cooperation",
          },
          {
            q: "Will you keep working with my current suppliers?",
            a: "Where it makes sense, yes. What works stays.",
            group: "cooperation",
          },
          {
            q: "Do you stay involved after launch?",
            a: "If you want — as needed, or as a fixed monthly arrangement.",
            group: "cooperation",
          },
        ],
      };
}
