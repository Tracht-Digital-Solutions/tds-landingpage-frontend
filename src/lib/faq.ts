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
        seoTitle: "Häufige Fragen zu Website, Preis und Ablauf — Tracht Digital",
        description:
          "Antworten zu Übernahme bestehender Seiten, Festpreisen, Dauer, Zugängen und laufender Betreuung. Kurz beantwortet, ohne Fachsprache.",
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
        seoTitle: "Common Questions on Websites, Pricing and Process — Tracht Digital",
        description:
          "Answers on taking over existing sites, fixed prices, timelines, logins and ongoing support. Answered briefly, without the jargon.",
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
            a: "Ja, auch mit WordPress, WooCommerce, Shopware, TYPO3 oder bei STRATO. Ich behebe Fehler und pflege sie weiter.",
            group: "takeover",
          },
          {
            q: "Muss die Seite dafür neu gebaut werden?",
            a: "Meistens nicht. Was trägt, bleibt – neu gebaut wird nur, was sich nicht mehr reparieren lässt.",
            group: "takeover",
          },
          {
            q: "Was kostet eine Website oder ein Onlineshop?",
            a: "Drei Pakete haben einen Festpreis, sie stehen bei den Preisen. Alles andere bekommst du als eigenes Angebot.",
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
            a: "Dir. Du bekommst alle Zugänge, und bei der Übergabe gehört dir alles, was zur Seite gehört. Wenn du später zu jemand anderem willst, nimmst du es vollständig mit.",
            group: "cooperation",
          },

          // --- Only on /fragen ------------------------------------------
          {
            q: "Was heißt „Abläufe digitalisieren“ bei einem Betrieb wie meinem?",
            a: "Nenn mir einen Ablauf, der dich jede Woche Zeit kostet – Angebote, Terminvergabe, Rechnungen. Ich sage dir, was sich automatisieren lässt und was den Aufwand nicht wert ist. Auch wenn die Antwort lautet: so lassen.",
            group: "takeover",
          },
          {
            q: "Kann ich Texte und Bilder selbst ändern?",
            a: "Wie du willst. Möchtest du selbst ran, richte ich dir den Zugang ein und zeige es dir. Wenn nicht, schickst du mir die Änderung – das ist Teil der Pflege, kein Aufpreis.",
            group: "cooperation",
          },
          {
            q: "Was ist, wenn die Seite ausfällt?",
            a: "Melde dich, ich kümmere mich. Eine Seite, die offline ist, sehe ich mir auch am Wochenende an. Alles andere beantworte ich werktags, in der Regel am selben Tag.",
            group: "cooperation",
          },
          {
            q: "Was brauchst du von mir?",
            a: "Erst einmal nur das, was du schon hast: Texte, Bilder, Zugänge. Fehlt etwas, sage ich dir welches Material gebraucht wird – schreiben kann ich es auch.",
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
            a: "Yes, including WordPress, WooCommerce, Shopware, TYPO3 or STRATO. I fix errors and keep it maintained.",
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
            a: "You do. You get every login, and at handover everything belonging to the site belongs to you. If you move to someone else later, you take all of it with you.",
            group: "cooperation",
          },

          {
            q: "What does “digitalizing workflows” mean for a business like mine?",
            a: "Name a routine that costs you time every week — quotes, scheduling, invoices. I will tell you what can be automated and what is not worth the effort. Including when the answer is: leave it as it is.",
            group: "takeover",
          },
          {
            q: "Can I change text and images myself?",
            a: "However you prefer. If you want to do it yourself, I set up your access and show you how. If not, you send me the change — that is part of maintenance, not an extra.",
            group: "cooperation",
          },
          {
            q: "What happens if the site goes down?",
            a: "Get in touch and I will deal with it. A site that is offline I look at at the weekend too. Everything else I answer on weekdays, usually the same day.",
            group: "cooperation",
          },
          {
            q: "What do you need from me?",
            a: "To begin with, only what you already have: text, images, logins. If something is missing I tell you what material is needed — and I can write it as well.",
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
