import type { Lang } from "./i18n";

/**
 * The shop systems and CMS that get a page of their own — code-owned, like
 * `references.ts` and `demoCatalog.ts`.
 *
 * ### Why these pages exist
 *
 * People who need help with a shop or a website search for the SYSTEM they
 * have: "WooCommerce Fehler", "Shopware 6 Theme", "TYPO3 Update", "STRATO
 * Homepage-Baukasten". The service pages describe what is on offer in general
 * words; these pages meet that search where it starts, one page per system.
 * They belong to the Webauftritt service: their back link, breadcrumb and hub
 * all point there.
 *
 * One page per system, not one per offer ("WooCommerce Fehler beheben",
 * "WooCommerce Theme" …): three thin pages on one topic compete with each other
 * and none of them says enough. The offers are sections of the page, each with
 * an anchor.
 *
 * ### The rules this content keeps (tests: `platforms.test.ts`)
 *
 * - **No amount.** Decided 2026-09-15: these pages name no price and no rate.
 *   They explain how a price comes about and link to the published rates.
 * - **Du**, lowercase, like the rest of the site since 2026-09-15; no free and
 *   no time-boxed first conversation; the one sentence about its cost is
 *   "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.".
 * - **Nothing invented.** Every fact about a system is in `sources` with a link
 *   to where it is stated, and dated through `updatedAt`. Raise `updatedAt`
 *   only when the content changes — it is rendered as "Stand" and published as
 *   `dateModified`, and a date moved without a change is a false freshness
 *   signal.
 * - **Independent.** Every page says that this is not an official partner of
 *   the vendor, and no page shows a vendor's logo.
 * - **No anonymous case on these pages, ever.** The office supplies case in
 *   `references.ts` is anonymous, and naming the systems involved would
 *   identify the client by elimination — which is why `references.test.ts`
 *   bans exactly those system names from its prose. A case appears here only
 *   when it is published under the client's name and lists the platform in
 *   `ReferenceCase.platforms`.
 *
 * **No runtime imports** beyond types: the page, the sitemap and the cache
 * route table all read this file.
 */

export type PlatformId = "woocommerce" | "shopware" | "wordpress" | "typo3" | "strato";

export interface PlatformSource {
  label: Record<Lang, string>;
  url: Record<Lang, string>;
}

export interface PlatformOffer {
  /** Anchor on the page. Code-owned, in the page's language. */
  id: string;
  title: string;
  /** Opens with what the reader gets — the answer comes first. */
  text: string;
  points: readonly string[];
}

export interface PlatformComparison {
  title: string;
  /** One or two sentences that answer the table's question on their own. */
  intro: string;
  columns: readonly string[];
  /** The first cell of every row is its row header. */
  rows: readonly (readonly string[])[];
}

export interface PlatformFaqItem {
  q: string;
  a: string;
}

export interface PlatformContent {
  /** The back link's words: the parent service. */
  label: string;
  /** The H1. */
  title: string;
  /** The lead under the H1 AND the page's meta description (81–160 characters). */
  summary: string;
  /**
   * The statement a reader — or an answer engine — can quote on its own: who,
   * what, for whom, where. Rendered as the large paragraph under the hero.
   */
  answer: string;
  situationsTitle: string;
  situations: readonly string[];
  /** Title of the card that lists the offers as the page's table of contents. */
  offersTitle: string;
  offers: readonly PlatformOffer[];
  comparison: PlatformComparison;
  outcomesTitle: string;
  outcomes: readonly string[];
  boundariesTitle: string;
  boundaries: readonly string[];
  processTitle: string;
  process: readonly string[];
  costTitle: string;
  /** How a price comes about — without an amount. */
  costText: string;
  referencesHeadline: string;
  referencesLabel: string;
  faqTitle: string;
  faq: readonly PlatformFaqItem[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
}

export interface PlatformDefinition {
  id: PlatformId;
  /** The system's own name, as its vendor writes it. */
  name: string;
  kind: "shop" | "cms" | "builder";
  /** The same in both trees: `/leistungen/<slug>` and `/en/services/<slug>`. */
  slug: string;
  /** The `<title>`: system and intent first, the brand last. */
  seoTitle: Record<Lang, string>;
  /** ISO date of the last content change. See the rules above. */
  updatedAt: string;
  /** The system's encyclopedia entry — `about.sameAs` in the page's JSON-LD. */
  wikipedia: Record<Lang, string>;
  /**
   * Short scope words for the system's tile on the Webauftritt page — the same
   * job `ServiceDefinition.keywords` does: two to four, none a sentence.
   */
  keywords: Record<Lang, readonly string[]>;
  articleSlugs: readonly JournalSlug[];
  sources: readonly PlatformSource[];
  content: Record<Lang, PlatformContent>;
}

/**
 * Journal articles a platform page may point to, with committed link text.
 *
 * The labels are this site's words for the link, not the articles' titles
 * (those are the blog's copy and addressed its readers formally): a link has
 * to read right on a page that says "du".
 */
export const JOURNAL_ARTICLES = {
  "website-fuenf-dinge-die-fehlen": {
    de: "Fünf Dinge, die auf vielen Websites fehlen",
    en: "Five things many websites are missing",
  },
  "lohnt-sich-ein-webshop": {
    de: "Lohnt sich ein Webshop für ein Ladengeschäft?",
    en: "Is an online shop worth it for a local business?",
  },
  "produktpflege-per-handy": {
    de: "Produktpflege muss nicht am Schreibtisch hängen",
    en: "Product upkeep does not have to be tied to a desk",
  },
  "konzept-vor-umsetzung": {
    de: "Warum ein Konzept billiger ist als ein zweiter Versuch",
    en: "Why a concept is cheaper than a second attempt",
  },
} as const satisfies Record<string, Record<Lang, string>>;

export type JournalSlug = keyof typeof JOURNAL_ARTICLES;

const COST: Record<Lang, { title: string; text: string }> = {
  de: {
    title: "Was kostet das?",
    text: "Abgerechnet wird nach Aufwand zum Stundensatz für den Webauftritt – oder zum Festpreis, sobald der Umfang klar ist. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
  },
  en: {
    title: "What does it cost?",
    text: "Work is billed by effort at the web presence hourly rate – or at a fixed price once the scope is clear. Costs only arise once we agree on an assignment.",
  },
};

const REFERENCES: Record<Lang, { headline: string; label: string }> = {
  de: {
    headline: "Aus der Praxis",
    label: "Veröffentlicht nur mit ausdrücklicher Freigabe – anonymisiert, sofern nicht anders vereinbart.",
  },
  en: {
    headline: "From practice",
    label: "Published only with the client's explicit approval – anonymised unless agreed otherwise.",
  },
};

/** Both shop pages answer the same question the same way. */
const SHOP_COMPARISON: Record<Lang, PlatformComparison> = {
  de: {
    title: "WooCommerce oder Shopware 6?",
    intro:
      "Kurz gesagt: WooCommerce ist eine Erweiterung für WordPress, Shopware 6 ein eigenständiges Shopsystem. Welches besser passt, hängt vor allem von deiner bestehenden Website, deinem Sortiment und deinen Verkaufskanälen ab.",
    columns: ["Kriterium", "WooCommerce", "Shopware 6"],
    rows: [
      ["Grundlage", "Plugin für WordPress", "Eigenständiges Shopsystem"],
      ["Website und Shop", "Ein System zusammen mit deiner WordPress-Seite", "Inhalte über Erlebniswelten im Shop"],
      ["Gestaltung", "WordPress-Themes, anpassbar per Child-Theme", "Themes auf Basis des Standard-Themes Storefront"],
      ["Erweiterungen", "WordPress-Plugins und WooCommerce-Erweiterungen", "Erweiterungen aus dem Shopware Store"],
      ["Lizenz", "Open Source", "Community Edition als Open Source, dazu kostenpflichtige Pläne"],
      [
        "Passt, wenn",
        "du schon WordPress nutzt oder Seite und Shop gemeinsam pflegen willst",
        "der Shop das Herzstück ist und du viele Artikel, Varianten oder Kanäle hast",
      ],
    ],
  },
  en: {
    title: "WooCommerce or Shopware 6?",
    intro:
      "In short: WooCommerce is an extension for WordPress, Shopware 6 a standalone shop system. Which fits better depends mostly on your existing website, your catalogue and your sales channels.",
    columns: ["Criterion", "WooCommerce", "Shopware 6"],
    rows: [
      ["Basis", "WordPress plugin", "Standalone shop system"],
      ["Website and shop", "One system together with your WordPress site", "Content via Shopping Experiences inside the shop"],
      ["Design", "WordPress themes, customisable with a child theme", "Themes based on the default Storefront theme"],
      ["Extensions", "WordPress plugins and WooCommerce extensions", "Extensions from the Shopware Store"],
      ["Licence", "Open source", "Community Edition as open source, plus paid plans"],
      [
        "Fits if",
        "you already use WordPress or want to run site and shop together",
        "the shop is the core of your business and you have many products, variants or channels",
      ],
    ],
  },
};

const same = (url: string): Record<Lang, string> => ({ de: url, en: url });

const SOURCE = {
  childThemes: {
    label: { de: "WordPress-Entwicklerdoku: Child-Themes", en: "WordPress developer docs: child themes" },
    url: same("https://developer.wordpress.org/themes/advanced-topics/child-themes/"),
  },
  wpThemes: {
    label: {
      de: "WordPress-Entwicklerdoku: Themes (Block- und klassische Themes)",
      en: "WordPress developer docs: themes (block and classic)",
    },
    url: same("https://developer.wordpress.org/themes/"),
  },
  w3techs: {
    label: {
      de: "W3Techs: Verbreitung von WordPress (September 2026)",
      en: "W3Techs: WordPress usage statistics (September 2026)",
    },
    url: same("https://w3techs.com/technologies/details/cm-wordpress"),
  },
  wooGithub: {
    label: { de: "WooCommerce auf GitHub (Quellcode und Lizenz)", en: "WooCommerce on GitHub (source code and licence)" },
    url: same("https://github.com/woocommerce/woocommerce"),
  },
  shopwareGithub: {
    label: { de: "Shopware auf GitHub (Quellcode und Lizenz)", en: "Shopware on GitHub (source code and licence)" },
    url: same("https://github.com/shopware/shopware"),
  },
  shopwareEol: {
    label: {
      de: "endoflife.date: Shopware-Versionen und Supportzeiträume",
      en: "endoflife.date: Shopware versions and support periods",
    },
    url: same("https://endoflife.date/shopware"),
  },
  shopwareMigration: {
    label: {
      de: "Shopware: Migration von Shopware 5 zu Shopware 6",
      en: "Shopware: migrating from Shopware 5 to Shopware 6",
    },
    url: {
      de: "https://www.shopware.com/de/migration/shopware-5-zu-shopware-6/",
      en: "https://www.shopware.com/en/migration/shopware-5-to-shopware-6/",
    },
  },
  typo3News: {
    label: { de: "TYPO3 News: Supportende für TYPO3 v12 LTS", en: "TYPO3 News: end of support for TYPO3 v12 LTS" },
    url: same("https://news.typo3.com/article/typo3-v12-lts-end-of-free-support"),
  },
  typo3Roadmap: {
    label: { de: "TYPO3: Roadmap und Supportzeiträume", en: "TYPO3: roadmap and support periods" },
    url: same("https://typo3.com/typo3-cms/development-roadmap/roadmap"),
  },
  typo3Sitepackage: {
    label: { de: "TYPO3-Doku: Site-Package-Tutorial", en: "TYPO3 docs: site package tutorial" },
    url: same("https://docs.typo3.org/m/typo3/tutorial-sitepackage/main/en-us/"),
  },
  stratoBuilder: {
    label: { de: "STRATO: Homepage-Baukasten", en: "STRATO: Homepage-Baukasten website builder (German)" },
    url: same("https://www.strato.de/homepage-baukasten/"),
  },
  stratoWordpress: {
    label: { de: "STRATO: Hosting für WordPress", en: "STRATO: WordPress hosting (German)" },
    url: same("https://www.strato.de/hosting/wordpress-hosting/"),
  },
} as const satisfies Record<string, PlatformSource>;

export const platformDefinitions: readonly PlatformDefinition[] = [
  {
    id: "woocommerce",
    name: "WooCommerce",
    kind: "shop",
    slug: "woocommerce",
    seoTitle: {
      de: "WooCommerce: Shop erstellen & Fehler beheben — Tracht Digital",
      en: "WooCommerce: Build, Fix and Theme Your Shop — Tracht Digital",
    },
    updatedAt: "2026-09-15",
    wikipedia: {
      de: "https://de.wikipedia.org/wiki/WooCommerce",
      en: "https://en.wikipedia.org/wiki/WooCommerce",
    },
    keywords: {
      de: ["Fehler beheben", "Shop erstellen", "Theme anpassen"],
      en: ["Fixing errors", "Building shops", "Themes"],
    },
    articleSlugs: ["lohnt-sich-ein-webshop", "produktpflege-per-handy"],
    sources: [SOURCE.childThemes, SOURCE.wooGithub, SOURCE.shopwareGithub],
    content: {
      de: {
        label: "Webauftritt",
        title: "WooCommerce-Shop erstellen, reparieren und anpassen",
        summary:
          "Ich baue deinen WooCommerce-Shop, behebe Fehler nach Updates oder im Checkout und passe dein Theme update-sicher an – aus Schwarzenbek bei Hamburg.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Für WooCommerce heißt das: Ich richte neue Shops ein, finde und behebe Fehler in bestehenden Shops und passe Themes so an, dass Updates möglich bleiben. Du hast *einen festen Ansprechpartner* – auch nach dem Start.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Nach einem Update zeigt der Shop eine weiße Seite oder die Meldung über einen kritischen Fehler.",
          "Kunden brechen im Checkout ab, weil eine Zahlungsart oder der Versand nicht richtig funktioniert.",
          "Der Shop lädt langsam, und niemand weiß, welches Plugin bremst.",
          "Du willst online verkaufen, aber WordPress und WooCommerce wirken unübersichtlich.",
        ],
        offersTitle: "Das übernehme ich für deinen Shop",
        offers: [
          {
            id: "fehler-beheben",
            title: "WooCommerce-Fehler beheben",
            text: "Ich suche die Ursache, statt nur das Symptom zu überdecken – bei Konflikten zwischen Plugins, Fehlern nach Updates und Problemen im Checkout.",
            points: [
              "Weiße Seite oder kritischer Fehler nach einem Update",
              "Warenkorb, Checkout oder Zahlungsarten funktionieren nicht",
              "Konflikte zwischen Plugins und veraltete Erweiterungen",
              "Langsamer Shop: Plugins, Bilder und Datenbank prüfen",
            ],
          },
          {
            id: "shop-erstellen",
            title: "WooCommerce-Shop erstellen",
            text: "Ich richte deinen Shop auf WordPress ein – mit Produkten, Zahlungsarten, Versand und den Grundlagen für den deutschen Markt.",
            points: [
              "WordPress und WooCommerce einrichten",
              "Produkte anlegen oder per Import übernehmen",
              "Zahlungsarten, Versandregeln und Bestell-E-Mails",
              "Rechtliche Grundlagen einbauen, z. B. mit Germanized oder German Market",
            ],
          },
          {
            id: "theme",
            title: "WooCommerce-Theme anpassen",
            text: "Änderungen kommen in ein Child-Theme oder ein eigenes Theme. So kann das Theme weiter aktualisiert werden, ohne dass deine Anpassungen verloren gehen.",
            points: [
              "Design passend zu deiner Marke",
              "Produktseiten, Kategorien und Warenkorb gestalten",
              "Child-Theme für update-sichere Änderungen",
              "Für Handy und kurze Ladezeiten optimiert",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.de,
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Dein Shop läuft wieder – und du weißt, woran es lag",
          "Kunden kommen ohne Hürden durch den Checkout",
          "Dein Design übersteht das nächste Theme-Update",
          "Ein Ansprechpartner statt Support-Pingpong zwischen Plugin-Anbietern",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Rechtstexte wie AGB und Widerrufsbelehrung liefert eine Kanzlei oder ein Rechtstexte-Dienst – ich baue sie ein.",
          "Gebühren von Zahlungsanbietern und Lizenzen für Premium-Plugins zahlst du direkt an den Anbieter.",
          "Hosting und Domain bleiben bei deinem Anbieter, sofern wir nichts anderes vereinbaren.",
          "Ich bin unabhängig und kein offizieller Partner von WooCommerce oder Automattic.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schilderst das Problem oder dein Vorhaben – gern mit Link und Screenshot",
          "Ich prüfe den Shop und nenne dir Ursache, Weg und Aufwand",
          "Änderungen teste ich zuerst auf einer Kopie, bevor sie live gehen",
          "Übergabe mit Erklärung – auf Wunsch bleibe ich für Updates und Pflege dran",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu WooCommerce",
        faq: [
          {
            q: "Kannst du Fehler in meinem bestehenden WooCommerce-Shop beheben?",
            a: "Ja. Ich suche die Ursache – meist ein Plugin-Konflikt, ein Update oder das Theme – und behebe sie so, dass der Fehler beim nächsten Update nicht zurückkommt.",
          },
          {
            q: "Was kostet es, einen WooCommerce-Shop erstellen zu lassen?",
            a: "Das hängt vom Umfang ab: Produkte, Zahlungsarten, Design und Anbindungen. Abgerechnet wird nach Aufwand oder zum Festpreis, sobald der Umfang klar ist. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Bleiben meine Anpassungen bei Theme-Updates erhalten?",
            a: "Ja, wenn sie in einem Child-Theme oder einem eigenen Theme stehen – so baue ich sie ein. Änderungen direkt im Theme würden beim nächsten Update überschrieben.",
          },
          {
            q: "Ist WooCommerce das richtige Shopsystem für mich?",
            a: "WooCommerce passt gut, wenn du schon WordPress nutzt oder Website und Shop in einem System pflegen willst. Bei großen Sortimenten oder vielen Verkaufskanälen lohnt der Vergleich mit Shopware 6 – das klären wir im Erstgespräch.",
          },
          {
            q: "Arbeitest du mit meinem bisherigen Hosting?",
            a: "In der Regel ja. Ich brauche Zugang zu WordPress und zum Hosting, damit ich Fehler nachvollziehen und vor Änderungen Sicherungen anlegen kann.",
          },
        ],
        ctaTitle: "Dein Shop braucht Hilfe?",
        ctaText:
          "Schreib mir kurz, was nicht läuft oder was du vorhast – gern mit Link. Ich antworte in der Regel innerhalb von 24 Stunden.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Build, fix and customise your WooCommerce shop",
        summary:
          "I build your WooCommerce shop, fix errors after updates or in checkout, and customise your theme in an update-safe way – from Schwarzenbek near Hamburg.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. For WooCommerce that means: I set up new shops, find and fix errors in existing ones, and customise themes so that updates stay possible. You get *one steady point of contact* – after launch as well.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "After an update the shop shows a white page or a message about a critical error.",
          "Customers abandon checkout because a payment method or shipping does not work properly.",
          "The shop loads slowly, and nobody knows which plugin is slowing it down.",
          "You want to sell online, but WordPress and WooCommerce feel overwhelming.",
        ],
        offersTitle: "What I take care of for your shop",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing WooCommerce errors",
            text: "I look for the cause instead of covering up the symptom – plugin conflicts, errors after updates and checkout problems.",
            points: [
              "White page or critical error after an update",
              "Cart, checkout or payment methods not working",
              "Conflicts between plugins and outdated extensions",
              "A slow shop: checking plugins, images and the database",
            ],
          },
          {
            id: "build-shop",
            title: "Building a WooCommerce shop",
            text: "I set up your shop on WordPress – with products, payment methods, shipping and the essentials for selling in Germany.",
            points: [
              "Setting up WordPress and WooCommerce",
              "Adding products or importing them",
              "Payment methods, shipping rules and order emails",
              "Legal essentials for the German market, e.g. with Germanized or German Market",
            ],
          },
          {
            id: "theme",
            title: "Customising your WooCommerce theme",
            text: "Changes go into a child theme or a theme of your own. That way the theme can keep being updated without your customisations getting lost.",
            points: [
              "A design that fits your brand",
              "Product pages, categories and cart",
              "A child theme for update-safe changes",
              "Optimised for phones and short loading times",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.en,
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your shop works again – and you know what caused the problem",
          "Customers get through checkout without obstacles",
          "Your design survives the next theme update",
          "One point of contact instead of support ping-pong between plugin vendors",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Legal texts such as terms and the cancellation policy come from a law firm or a legal text service – I put them in place.",
          "Payment provider fees and licences for premium plugins go to the provider directly.",
          "Hosting and domain stay with your provider unless we agree otherwise.",
          "I work independently and am not an official partner of WooCommerce or Automattic.",
        ],
        processTitle: "How it works",
        process: [
          "You describe the problem or your plans – a link and a screenshot help",
          "I review the shop and tell you the cause, the way forward and the effort",
          "I test changes on a copy first before they go live",
          "Handover with an explanation – if you like, I stay on for updates and upkeep",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about WooCommerce",
        faq: [
          {
            q: "Can you fix errors in my existing WooCommerce shop?",
            a: "Yes. I look for the cause – usually a plugin conflict, an update or the theme – and fix it so the error does not come back with the next update.",
          },
          {
            q: "What does it cost to have a WooCommerce shop built?",
            a: "That depends on the scope: products, payment methods, design and integrations. Work is billed by effort or at a fixed price once the scope is clear. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Will my customisations survive theme updates?",
            a: "Yes, if they live in a child theme or a theme of your own – that is how I build them. Changes made directly in the theme would be overwritten by the next update.",
          },
          {
            q: "Is WooCommerce the right shop system for me?",
            a: "WooCommerce is a good fit if you already use WordPress or want to run website and shop in one system. With a large catalogue or many sales channels it is worth comparing Shopware 6 – we work that out in the first conversation.",
          },
          {
            q: "Do you work with my current hosting?",
            a: "Usually, yes. I need access to WordPress and the hosting so I can trace errors and make backups before changing anything.",
          },
        ],
        ctaTitle: "Does your shop need help?",
        ctaText:
          "Send me a short note on what is not working or what you have in mind – a link helps. I usually reply within 24 hours.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    id: "shopware",
    name: "Shopware 6",
    kind: "shop",
    slug: "shopware",
    seoTitle: {
      de: "Shopware 6: Shop, Theme & Fehlerbehebung — Tracht Digital",
      en: "Shopware 6: Shops, Themes and Fixes — Tracht Digital",
    },
    updatedAt: "2026-09-15",
    wikipedia: {
      de: "https://de.wikipedia.org/wiki/Shopware",
      en: "https://en.wikipedia.org/wiki/Shopware",
    },
    keywords: {
      de: ["Fehler beheben", "Shop erstellen", "Theme anpassen", "Umstieg von Shopware 5"],
      en: ["Fixing errors", "Building shops", "Themes", "Moving from Shopware 5"],
    },
    articleSlugs: ["lohnt-sich-ein-webshop", "produktpflege-per-handy"],
    sources: [SOURCE.shopwareEol, SOURCE.shopwareMigration, SOURCE.shopwareGithub, SOURCE.wooGithub],
    content: {
      de: {
        label: "Webauftritt",
        title: "Shopware-6-Shop erstellen, reparieren und anpassen",
        summary:
          "Ich richte deinen Shopware-6-Shop ein, behebe Fehler nach Updates und baue Themes auf Basis von Storefront – auch beim Umstieg von Shopware 5.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Für Shopware 6 heißt das: Ich richte Shops ein, finde Fehler nach Updates oder in Erweiterungen, baue Themes auf Basis des Standard-Themes und begleite den Umstieg von Shopware 5 – dessen Sicherheitsupdates *am 31. Juli 2024 endeten*.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Nach einem Update lädt die Storefront oder die Administration nicht mehr richtig.",
          "Eine Erweiterung verträgt sich nicht mit der neuen Shopware-Version.",
          "Dein Shop läuft noch auf Shopware 5 – ohne Sicherheitsupdates.",
          "Das Design passt nicht zu deiner Marke, und Anpassungen gehen bei Updates kaputt.",
        ],
        offersTitle: "Das übernehme ich für deinen Shop",
        offers: [
          {
            id: "fehler-beheben",
            title: "Shopware-6-Fehler beheben",
            text: "Ich grenze Fehler systematisch ein – Erweiterung für Erweiterung und mit Blick in die Logs – und behebe die Ursache.",
            points: [
              "Fehler nach Shopware-Updates",
              "Konflikte zwischen Erweiterungen",
              "Probleme bei Checkout, Zahlung oder Versand",
              "Langsame Seiten, Cache und Indexierung",
            ],
          },
          {
            id: "shop-erstellen",
            title: "Shopware-6-Shop erstellen",
            text: "Ich richte deinen Shop ein und bereite ihn für den Start vor – oder ziehe deinen bestehenden Shop von Shopware 5 um.",
            points: [
              "Einrichtung, Verkaufskanäle und Grundeinstellungen",
              "Produkte, Kategorien und Eigenschaften anlegen oder importieren",
              "Zahlungsarten, Versand und E-Mail-Vorlagen",
              "Umstieg von Shopware 5 mit dem Migrationsassistenten",
            ],
          },
          {
            id: "theme",
            title: "Shopware-6-Theme anpassen",
            text: "Dein Theme baut auf dem Standard-Theme Storefront auf. So bleiben Updates möglich, und dein Design bleibt erhalten.",
            points: [
              "Eigenes Theme statt Änderungen am Kern",
              "Farben, Schriften und Layout nach deiner Marke",
              "Erlebniswelten für Startseite und Aktionen",
              "Für Handy und kurze Ladezeiten optimiert",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.de,
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Dein Shop läuft auf einer unterstützten Version",
          "Updates sind wieder planbar statt riskant",
          "Dein Design passt zur Marke und übersteht Updates",
          "Ein Ansprechpartner für Technik, Theme und Erweiterungen",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Lizenzen für Shopware-Pläne und Erweiterungen zahlst du direkt an den Anbieter.",
          "Der Umstieg von Shopware 5 ist ein Wechsel auf ein neues System: Die Daten ziehen um, Theme und Erweiterungen werden neu umgesetzt.",
          "Rechtstexte liefert eine Kanzlei oder ein Rechtstexte-Dienst – ich baue sie ein.",
          "Ich bin unabhängig und kein offizieller Shopware-Partner.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schilderst das Problem oder dein Vorhaben – mit Shop-Version und Erweiterungen, wenn du sie kennst",
          "Ich prüfe den Shop und nenne dir Ursache, Weg und Aufwand",
          "Updates und Änderungen teste ich zuerst auf einer Kopie deines Shops",
          "Übergabe mit Erklärung – auf Wunsch betreue ich den Shop dauerhaft",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu Shopware 6",
        faq: [
          {
            q: "Shopware 5 bekommt keine Sicherheitsupdates mehr – was jetzt?",
            a: "Die Sicherheitsupdates für Shopware 5 endeten am 31. Juli 2024. Sinnvoll ist der Umstieg auf Shopware 6: Die Daten lassen sich mit dem Migrationsassistenten übernehmen, Theme und Erweiterungen werden neu umgesetzt.",
          },
          {
            q: "Kannst du Fehler nach einem Shopware-Update beheben?",
            a: "Ja. Ich finde heraus, ob das Update, eine Erweiterung oder das Theme den Fehler auslöst, und behebe die Ursache – getestet auf einer Kopie deines Shops.",
          },
          {
            q: "Was kostet ein Shopware-6-Shop?",
            a: "Das hängt von Sortiment, Design, Erweiterungen und Anbindungen ab. Abgerechnet wird nach Aufwand oder zum Festpreis, sobald der Umfang klar ist. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Ist Shopware 6 besser als WooCommerce?",
            a: "Nicht besser, sondern anders: Shopware 6 ist ein eigenständiges Shopsystem, WooCommerce eine Erweiterung für WordPress. Welches passt, hängt von Sortiment, Abläufen und deiner bestehenden Website ab.",
          },
          {
            q: "Bist du Shopware-Partner?",
            a: "Nein. Ich arbeite unabhängig – meine Empfehlung richtet sich nach deinem Shop, nicht nach einem Partnerprogramm.",
          },
        ],
        ctaTitle: "Dein Shopware-Shop braucht Hilfe?",
        ctaText:
          "Schreib mir kurz, was nicht läuft oder was du vorhast – gern mit Shop-Version und Link. Ich antworte in der Regel innerhalb von 24 Stunden.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Build, fix and customise your Shopware 6 shop",
        summary:
          "I set up your Shopware 6 shop, fix errors after updates and build themes on top of Storefront – including the move from Shopware 5.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. For Shopware 6 that means: I set up shops, track down errors after updates or in extensions, build themes on top of the default theme and handle the move from Shopware 5, whose security updates *ended on 31 July 2024*.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "After an update the storefront or the administration no longer loads properly.",
          "An extension does not work with the new Shopware version.",
          "Your shop still runs on Shopware 5 – without security updates.",
          "The design does not fit your brand, and customisations break with updates.",
        ],
        offersTitle: "What I take care of for your shop",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing Shopware 6 errors",
            text: "I narrow errors down systematically – extension by extension, with a look at the logs – and fix the cause.",
            points: [
              "Errors after Shopware updates",
              "Conflicts between extensions",
              "Problems with checkout, payment or shipping",
              "Slow pages, cache and indexing",
            ],
          },
          {
            id: "build-shop",
            title: "Building a Shopware 6 shop",
            text: "I set up your shop and get it ready for launch – or move your existing shop over from Shopware 5.",
            points: [
              "Setup, sales channels and basic settings",
              "Adding or importing products, categories and properties",
              "Payment methods, shipping and email templates",
              "Moving from Shopware 5 with the migration assistant",
            ],
          },
          {
            id: "theme",
            title: "Customising your Shopware 6 theme",
            text: "Your theme builds on the default Storefront theme. That keeps updates possible and your design intact.",
            points: [
              "A theme of your own instead of changes to the core",
              "Colours, fonts and layout to match your brand",
              "Shopping Experiences for the home page and promotions",
              "Optimised for phones and short loading times",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.en,
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your shop runs on a supported version",
          "Updates are plannable again instead of risky",
          "Your design fits your brand and survives updates",
          "One point of contact for technology, theme and extensions",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Licences for Shopware plans and extensions go to the provider directly.",
          "Moving from Shopware 5 means a new system: the data moves across, theme and extensions are rebuilt.",
          "Legal texts come from a law firm or a legal text service – I put them in place.",
          "I work independently and am not an official Shopware partner.",
        ],
        processTitle: "How it works",
        process: [
          "You describe the problem or your plans – with shop version and extensions if you know them",
          "I review the shop and tell you the cause, the way forward and the effort",
          "I test updates and changes on a copy of your shop first",
          "Handover with an explanation – if you like, I look after the shop long term",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about Shopware 6",
        faq: [
          {
            q: "Shopware 5 no longer gets security updates – what now?",
            a: "Security updates for Shopware 5 ended on 31 July 2024. Moving to Shopware 6 makes sense: the data can be transferred with the migration assistant, while theme and extensions are rebuilt.",
          },
          {
            q: "Can you fix errors after a Shopware update?",
            a: "Yes. I find out whether the update, an extension or the theme triggers the error and fix the cause – tested on a copy of your shop.",
          },
          {
            q: "What does a Shopware 6 shop cost?",
            a: "That depends on catalogue, design, extensions and integrations. Work is billed by effort or at a fixed price once the scope is clear. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Is Shopware 6 better than WooCommerce?",
            a: "Not better, different: Shopware 6 is a standalone shop system, WooCommerce an extension for WordPress. Which fits depends on your catalogue, your workflows and your existing website.",
          },
          {
            q: "Are you a Shopware partner?",
            a: "No. I work independently – my recommendation follows your shop, not a partner programme.",
          },
        ],
        ctaTitle: "Does your Shopware shop need help?",
        ctaText:
          "Send me a short note on what is not working or what you have in mind – shop version and a link help. I usually reply within 24 hours.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    id: "wordpress",
    name: "WordPress",
    kind: "cms",
    slug: "wordpress",
    seoTitle: {
      de: "WordPress: Website, Wartung & Fehlerhilfe — Tracht Digital",
      en: "WordPress: Websites, Maintenance and Fixes — Tracht Digital",
    },
    updatedAt: "2026-09-15",
    wikipedia: {
      de: "https://de.wikipedia.org/wiki/WordPress",
      en: "https://en.wikipedia.org/wiki/WordPress",
    },
    keywords: {
      de: ["Fehler & Wartung", "Relaunch", "Themes", "Umzug"],
      en: ["Errors & maintenance", "Relaunch", "Themes", "Migration"],
    },
    articleSlugs: ["website-fuenf-dinge-die-fehlen", "konzept-vor-umsetzung"],
    sources: [SOURCE.w3techs, SOURCE.childThemes, SOURCE.wpThemes],
    content: {
      de: {
        label: "Webauftritt",
        title: "WordPress-Website erstellen, reparieren und pflegen",
        summary:
          "Ich baue deine WordPress-Website, behebe Fehler wie weiße Seiten, passe dein Theme an und übernehme Updates und Pflege – aus Schwarzenbek bei Hamburg.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Ich kümmere mich um WordPress-Websites von Selbstständigen und kleinen Unternehmen: Fehler beheben, Updates und Wartung, neue Seiten, Themes und Umzüge. WordPress läuft laut W3Techs auf *40,3 % aller Websites* (September 2026) – umso wichtiger ist eine Seite, die gepflegt wird.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Statt deiner Seite erscheint eine weiße Seite oder die Meldung über einen kritischen Fehler.",
          "Updates stehen seit Monaten aus, weil danach etwas kaputtgehen könnte.",
          "Die Seite ist veraltet, langsam oder auf dem Handy schwer zu bedienen.",
          "Du willst von einem Baukasten zu WordPress wechseln – oder den Hoster wechseln.",
        ],
        offersTitle: "Das übernehme ich für deine Website",
        offers: [
          {
            id: "fehler-beheben",
            title: "Fehler beheben und Wartung",
            text: "Ich finde die Ursache von Fehlern und halte deine Seite danach aktuell – WordPress, Themes und Plugins, mit einer Sicherung vor jedem Eingriff.",
            points: [
              "Weiße Seite, kritischer Fehler oder Fehler nach Updates",
              "Regelmäßige Updates von WordPress, Themes und Plugins",
              "Sicherungen und Wiederherstellung",
              "Ladezeit und Sicherheit prüfen",
            ],
          },
          {
            id: "relaunch",
            title: "Neue Website oder Relaunch",
            text: "Ich baue deine Seite neu auf oder überarbeite die bestehende – mit klarer Struktur, für Handy und Bildschirm und mit den Grundlagen für die Suche.",
            points: [
              "Seiten und Inhalte sinnvoll ordnen",
              "Mobil und barrierearm umsetzen",
              "Grundlagen für Google: Titel, Beschreibungen, Weiterleitungen",
              "Einweisung, damit du Inhalte selbst pflegen kannst",
            ],
          },
          {
            id: "theme",
            title: "Themes und Templates",
            text: "Anpassungen kommen in ein Child-Theme oder ein eigenes Theme – so gehen sie beim nächsten Update nicht verloren.",
            points: [
              "Bestehendes Theme anpassen",
              "Child-Theme für update-sichere Änderungen",
              "Block-Themes und klassische Themes",
              "Eigenes Theme nach deinem Design",
            ],
          },
          {
            id: "umzug",
            title: "Umzug und Upgrades",
            text: "Ich ziehe deine Seite um – zu WordPress, zu einem anderen Hoster oder auf eine neue Domain – und achte darauf, dass Weiterleitungen, Domain und E-Mail mitkommen.",
            points: [
              "Umzug von Baukästen wie STRATO, Jimdo oder Wix zu WordPress",
              "Hosting-Umzug inklusive Domain und E-Mail-Postfächern",
              "Weiterleitungen, damit alte Links weiter funktionieren",
              "Umstellung auf eine aktuelle PHP-Version",
            ],
          },
        ],
        comparison: {
          title: "Block-Theme oder klassisches Theme?",
          intro:
            "Kurz gesagt: Block-Themes bearbeitest du im Website-Editor von WordPress direkt mit Blöcken; klassische Themes setzen auf PHP-Vorlagen und den Customizer. Beide sind verbreitet – entscheidend ist, wie viel du selbst gestalten willst.",
          columns: ["Kriterium", "Block-Theme", "Klassisches Theme"],
          rows: [
            ["Aufbau", "Vorlagen aus Blöcken, Einstellungen in der theme.json", "PHP-Vorlagen, Einstellungen im Customizer"],
            ["Bearbeiten", "Kopfbereich, Fußbereich und Vorlagen im Website-Editor", "Vieles nur im Code oder über Theme-Optionen"],
            ["Anpassen ohne Update-Verlust", "Eigene Styles und Vorlagen, bei Bedarf Child-Theme", "Child-Theme"],
            ["Passt, wenn", "du Layout und Inhalte selbst anpassen willst", "eine bestehende Seite stabil weiterlaufen soll"],
          ],
        },
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Deine Seite läuft wieder – und bleibt aktuell",
          "Updates ohne Bauchschmerzen, mit Sicherung vorher",
          "Eine Seite, die auf dem Handy funktioniert und gefunden werden kann",
          "Ein Ansprechpartner für Technik, Pflege und Fragen",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Texte, Bilder und Rechtstexte brauchen deine Zuarbeit.",
          "Hosting, Domain und Premium-Plugins zahlst du direkt an den Anbieter.",
          "Eine bestimmte Platzierung bei Google kann niemand garantieren – die Grundlagen dafür lege ich.",
          "Ich bin unabhängig und nicht mit WordPress.org oder Automattic verbunden.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schilderst das Problem oder dein Vorhaben – ein Link zur Seite genügt für den Anfang",
          "Ich prüfe die Seite und nenne dir Ursache, Weg und Aufwand",
          "Vor jedem Eingriff lege ich eine Sicherung an, größere Änderungen teste ich auf einer Kopie",
          "Übergabe mit Erklärung – auf Wunsch übernehme ich die Pflege dauerhaft",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu WordPress",
        faq: [
          {
            q: "Meine WordPress-Seite zeigt einen kritischen Fehler – was tun?",
            a: "Meist steckt ein Plugin, das Theme oder ein Update dahinter. Probier nicht auf gut Glück herum: Ich finde die Ursache, bringe die Seite wieder zum Laufen und sorge dafür, dass der Fehler nicht zurückkommt.",
          },
          {
            q: "Übernimmst du Updates und Wartung?",
            a: "Ja. Ich halte WordPress, Themes und Plugins aktuell, lege vorher Sicherungen an und prüfe die Seite danach – nach Bedarf oder als festes Monatsmodell.",
          },
          {
            q: "Was kostet eine WordPress-Website?",
            a: "Das hängt von Umfang, Design und Funktionen ab. Abgerechnet wird nach Aufwand oder zum Festpreis, sobald der Umfang klar ist. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Kannst du meine Seite von einem Baukasten zu WordPress umziehen?",
            a: "Ja. Ich übernehme Inhalte und Bilder, baue die Seite in WordPress auf und richte Weiterleitungen ein, damit alte Links weiter funktionieren.",
          },
          {
            q: "Muss ich mich danach selbst um die Technik kümmern?",
            a: "Nein. Texte und Bilder pflegst du auf Wunsch selbst, um Updates, Sicherungen und Technik kümmere ich mich.",
          },
        ],
        ctaTitle: "Deine WordPress-Seite braucht Hilfe?",
        ctaText:
          "Schreib mir kurz, was nicht läuft oder was du vorhast – ein Link genügt. Ich antworte in der Regel innerhalb von 24 Stunden.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Build, fix and maintain your WordPress website",
        summary:
          "I build your WordPress website, fix errors such as white pages, customise your theme and take care of updates and upkeep – from Schwarzenbek near Hamburg.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. I look after WordPress websites for the self-employed and small businesses: fixing errors, updates and maintenance, new sites, themes and migrations. According to W3Techs, WordPress runs *40.3% of all websites* (September 2026) – which makes a well-maintained site all the more important.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "Instead of your site you get a white page or a message about a critical error.",
          "Updates have been waiting for months because something might break afterwards.",
          "The site is outdated, slow or hard to use on a phone.",
          "You want to move from a site builder to WordPress – or switch hosting.",
        ],
        offersTitle: "What I take care of for your website",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing errors and maintenance",
            text: "I find the cause of errors and keep your site up to date afterwards – WordPress, themes and plugins, with a backup before every change.",
            points: [
              "White page, critical error or errors after updates",
              "Regular updates of WordPress, themes and plugins",
              "Backups and restores",
              "Checking loading time and security",
            ],
          },
          {
            id: "relaunch",
            title: "New website or relaunch",
            text: "I rebuild your site or rework the existing one – with a clear structure, for phones and screens, and with the groundwork for search.",
            points: [
              "Ordering pages and content sensibly",
              "Built for phones and accessibility",
              "Search essentials: titles, descriptions, redirects",
              "A walkthrough so you can maintain content yourself",
            ],
          },
          {
            id: "theme",
            title: "Themes and templates",
            text: "Customisations go into a child theme or a theme of your own – so they are not lost with the next update.",
            points: [
              "Customising an existing theme",
              "A child theme for update-safe changes",
              "Block themes and classic themes",
              "A theme of your own, built to your design",
            ],
          },
          {
            id: "migration",
            title: "Migrations and upgrades",
            text: "I move your site – to WordPress, to another host or to a new domain – and make sure redirects, domain and email come along.",
            points: [
              "Moving from site builders such as STRATO, Jimdo or Wix to WordPress",
              "Moving hosts, including domain and mailboxes",
              "Redirects so old links keep working",
              "Switching to a current PHP version",
            ],
          },
        ],
        comparison: {
          title: "Block theme or classic theme?",
          intro:
            "In short: block themes are edited in the WordPress Site Editor using blocks; classic themes rely on PHP templates and the Customizer. Both are common – what matters is how much you want to design yourself.",
          columns: ["Criterion", "Block theme", "Classic theme"],
          rows: [
            ["Structure", "Templates made of blocks, settings in theme.json", "PHP templates, settings in the Customizer"],
            ["Editing", "Header, footer and templates in the Site Editor", "Much of it only in code or via theme options"],
            ["Customising without losing updates", "Your own styles and templates, a child theme if needed", "Child theme"],
            ["Fits if", "you want to adjust layout and content yourself", "an existing site should keep running reliably"],
          ],
        },
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your site works again – and stays up to date",
          "Updates without worry, with a backup first",
          "A site that works on phones and can be found",
          "One point of contact for technology, upkeep and questions",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Copy, images and legal texts need your input.",
          "Hosting, domain and premium plugins go to the provider directly.",
          "Nobody can guarantee a particular Google ranking – I lay the groundwork for it.",
          "I work independently and am not affiliated with WordPress.org or Automattic.",
        ],
        processTitle: "How it works",
        process: [
          "You describe the problem or your plans – a link to the site is enough to start",
          "I review the site and tell you the cause, the way forward and the effort",
          "I make a backup before every change and test bigger changes on a copy",
          "Handover with an explanation – if you like, I take over upkeep long term",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about WordPress",
        faq: [
          {
            q: "My WordPress site shows a critical error – what should I do?",
            a: "Usually a plugin, the theme or an update is behind it. Do not change things at random: I find the cause, get the site running again and make sure the error does not come back.",
          },
          {
            q: "Do you take care of updates and maintenance?",
            a: "Yes. I keep WordPress, themes and plugins up to date, make backups first and check the site afterwards – as needed or as a fixed monthly arrangement.",
          },
          {
            q: "What does a WordPress website cost?",
            a: "That depends on scope, design and features. Work is billed by effort or at a fixed price once the scope is clear. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Can you move my site from a site builder to WordPress?",
            a: "Yes. I carry over content and images, rebuild the site in WordPress and set up redirects so old links keep working.",
          },
          {
            q: "Will I have to deal with the technology myself afterwards?",
            a: "No. You can maintain copy and images yourself if you like – I take care of updates, backups and the technology.",
          },
        ],
        ctaTitle: "Does your WordPress site need help?",
        ctaText:
          "Send me a short note on what is not working or what you have in mind – a link is enough. I usually reply within 24 hours.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    id: "typo3",
    name: "TYPO3",
    kind: "cms",
    slug: "typo3",
    seoTitle: {
      de: "TYPO3: Update, Relaunch & Wartung — Tracht Digital",
      en: "TYPO3: Upgrades, Relaunches and Maintenance — Tracht Digital",
    },
    updatedAt: "2026-09-15",
    wikipedia: {
      de: "https://de.wikipedia.org/wiki/TYPO3",
      en: "https://en.wikipedia.org/wiki/TYPO3",
    },
    keywords: {
      de: ["Fehler & Wartung", "Relaunch", "Templates", "Upgrade"],
      en: ["Errors & maintenance", "Relaunch", "Templates", "Upgrades"],
    },
    articleSlugs: ["website-fuenf-dinge-die-fehlen", "konzept-vor-umsetzung"],
    sources: [SOURCE.typo3News, SOURCE.typo3Roadmap, SOURCE.typo3Sitepackage],
    content: {
      de: {
        label: "Webauftritt",
        title: "TYPO3-Website updaten, reparieren und pflegen",
        summary:
          "Ich bringe deine TYPO3-Website auf eine unterstützte Version, behebe Fehler, passe Templates an und übernehme die Pflege – aus Schwarzenbek bei Hamburg.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Ich betreue TYPO3-Websites: Upgrades auf eine aktuelle LTS-Version, Fehlerbehebung, Templates, Extensions und Relaunches. Wichtig für viele Seiten: Für TYPO3 v12 veröffentlicht die Community *seit dem 1. Mai 2026 keine Updates mehr* – wer noch darauf läuft, sollte das Upgrade jetzt planen.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Deine Seite läuft noch auf TYPO3 v12 oder einer älteren Version.",
          "Nach einem Update funktioniert eine Extension nicht mehr.",
          "Das Backend ist langsam oder zeigt Fehlermeldungen.",
          "Die Agentur, die die Seite gebaut hat, betreut sie nicht mehr.",
        ],
        offersTitle: "Das übernehme ich für deine TYPO3-Seite",
        offers: [
          {
            id: "fehler-beheben",
            title: "Fehler beheben und Wartung",
            text: "Ich finde Fehler in Backend, Frontend und Extensions und halte TYPO3 danach mit Sicherheitsupdates aktuell.",
            points: [
              "Fehlermeldungen im Backend oder Frontend",
              "Extensions nach Updates wieder lauffähig machen",
              "Regelmäßige Sicherheitsupdates",
              "Sicherung vor jedem Eingriff",
            ],
          },
          {
            id: "relaunch",
            title: "Neue Website oder Relaunch",
            text: "Ich setze deine Seite neu auf – mit aktuellem TYPO3, klarer Seitenstruktur und einem Backend, mit dem deine Redaktion gut arbeiten kann.",
            points: [
              "Seitenbaum und Inhaltselemente neu ordnen",
              "Mobil und barrierearm umsetzen",
              "Weiterleitungen für alte Adressen",
              "Einweisung für die Redaktion",
            ],
          },
          {
            id: "templates",
            title: "Templates und Extensions",
            text: "Templates baue ich mit Fluid in einem eigenen Site-Package – so bleibt dein Design vom TYPO3-Kern getrennt und updatefähig.",
            points: [
              "Fluid-Templates in einem Site-Package",
              "Extensions prüfen, anpassen oder ersetzen",
              "Eigene Inhaltselemente für deine Redaktion",
              "Design nach deiner Marke",
            ],
          },
          {
            id: "upgrade",
            title: "Upgrades und Umzug",
            text: "Ich hebe deine Installation Schritt für Schritt auf eine aktuelle LTS-Version – Extensions und Templates ziehen mit.",
            points: [
              "Upgrade auf TYPO3 v13 oder v14 LTS",
              "Extensions vorher auf Kompatibilität prüfen",
              "PHP-Version passend mit anheben",
              "Umzug auf einen neuen Server oder zu einem anderen Hoster",
            ],
          },
        ],
        comparison: {
          title: "TYPO3-Versionen und ihr Support",
          intro:
            "Kurz gesagt: TYPO3 v12 bekommt seit Mai 2026 keine Community-Updates mehr. Unterstützt werden v13 LTS und v14 LTS; für ältere Versionen bleibt nur kostenpflichtiger Extended Long Term Support (ELTS).",
          columns: ["Version", "Stand", "Was das für dich heißt"],
          rows: [
            ["TYPO3 v11 LTS", "Community-Support endete im Oktober 2024", "Upgrade dringend einplanen"],
            ["TYPO3 v12 LTS", "Seit dem 1. Mai 2026 keine Community-Updates mehr", "Upgrade planen oder übergangsweise ELTS nutzen"],
            ["TYPO3 v13 LTS", "Veröffentlicht im Oktober 2024, Sicherheitsupdates bis Ende 2027", "Unterstützt – nächster Schritt ist v14"],
            ["TYPO3 v14 LTS", "Veröffentlicht im April 2026, Sicherheitsupdates bis Juni 2029", "Aktuelle LTS-Version für neue Projekte"],
          ],
        },
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Deine Seite läuft auf einer unterstützten TYPO3-Version",
          "Sicherheitsupdates kommen wieder regelmäßig",
          "Deine Redaktion arbeitet mit einem aufgeräumten Backend",
          "Ein Ansprechpartner, auch wenn die alte Agentur nicht mehr zuständig ist",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "ELTS und Premium-Extensions zahlst du direkt an den Anbieter.",
          "Sehr alte Extensions lassen sich nicht immer übernehmen – dann ersetze ich sie nach Absprache.",
          "Texte, Bilder und Rechtstexte brauchen deine Zuarbeit.",
          "Ich bin unabhängig und kein offizieller TYPO3-Partner.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schickst mir Link, TYPO3-Version und – wenn vorhanden – die Liste deiner Extensions",
          "Ich prüfe die Installation und nenne dir Weg, Reihenfolge und Aufwand",
          "Upgrades baue ich auf einer Kopie und teste sie, bevor sie live gehen",
          "Übergabe mit Einweisung – auf Wunsch übernehme ich Updates und Pflege dauerhaft",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu TYPO3",
        faq: [
          {
            q: "Muss ich von TYPO3 v12 upgraden?",
            a: "Ja, möglichst bald: Seit dem 1. Mai 2026 veröffentlicht die TYPO3-Community keine Updates mehr für v12. Kostenpflichtiger Extended Long Term Support (ELTS) verschafft Zeit, ersetzt das Upgrade aber nicht.",
          },
          {
            q: "Funktionieren meine Extensions nach dem Upgrade noch?",
            a: "Das prüfe ich vorher für jede Extension. Für viele gibt es eine passende Version; was nicht mehr gepflegt wird, passe ich an oder ersetze es nach Absprache.",
          },
          {
            q: "Was kostet ein TYPO3-Upgrade?",
            a: "Das hängt von Version, Extensions und Templates ab. Nach der Prüfung nenne ich dir den Aufwand oder einen Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Übernimmst du TYPO3-Seiten, die eine andere Agentur gebaut hat?",
            a: "Ja. Ich verschaffe mir einen Überblick über Installation, Extensions und Templates und kümmere mich dann um Fehler, Updates und Weiterentwicklung.",
          },
          {
            q: "Lohnt sich TYPO3 für eine kleine Website noch?",
            a: "Wenn Redaktion, Rechte oder Mehrsprachigkeit wichtig sind, oft ja. Für eine kleine Seite kann WordPress einfacher sein – das klären wir ehrlich im Erstgespräch.",
          },
        ],
        ctaTitle: "Deine TYPO3-Seite braucht ein Update?",
        ctaText:
          "Schick mir Link und TYPO3-Version – ich sage dir, welcher Weg sinnvoll ist. Ich antworte in der Regel innerhalb von 24 Stunden.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Upgrade, fix and maintain your TYPO3 website",
        summary:
          "I bring your TYPO3 website onto a supported version, fix errors, customise templates and take over the upkeep – from Schwarzenbek near Hamburg.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. I look after TYPO3 websites: upgrades to a current LTS version, fixing errors, templates, extensions and relaunches. Important for many sites: the TYPO3 community has published *no updates for v12 since 1 May 2026* – if you still run it, plan the upgrade now.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "Your site still runs on TYPO3 v12 or an older version.",
          "An extension stopped working after an update.",
          "The backend is slow or shows error messages.",
          "The agency that built the site no longer looks after it.",
        ],
        offersTitle: "What I take care of for your TYPO3 site",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing errors and maintenance",
            text: "I find errors in the backend, the frontend and extensions and keep TYPO3 up to date with security updates afterwards.",
            points: [
              "Error messages in backend or frontend",
              "Getting extensions running again after updates",
              "Regular security updates",
              "A backup before every change",
            ],
          },
          {
            id: "relaunch",
            title: "New website or relaunch",
            text: "I rebuild your site – on current TYPO3, with a clear page structure and a backend your editors can work with.",
            points: [
              "Reorganising the page tree and content elements",
              "Built for phones and accessibility",
              "Redirects for old addresses",
              "A walkthrough for your editors",
            ],
          },
          {
            id: "templates",
            title: "Templates and extensions",
            text: "I build templates with Fluid in a site package of their own – that keeps your design separate from the TYPO3 core and ready for updates.",
            points: [
              "Fluid templates in a site package",
              "Checking, adapting or replacing extensions",
              "Custom content elements for your editors",
              "A design that fits your brand",
            ],
          },
          {
            id: "upgrade",
            title: "Upgrades and migrations",
            text: "I raise your installation step by step to a current LTS version – extensions and templates come along.",
            points: [
              "Upgrading to TYPO3 v13 or v14 LTS",
              "Checking extensions for compatibility first",
              "Raising the PHP version to match",
              "Moving to a new server or another host",
            ],
          },
        ],
        comparison: {
          title: "TYPO3 versions and their support",
          intro:
            "In short: TYPO3 v12 has had no community updates since May 2026. v13 LTS and v14 LTS are supported; older versions only have paid Extended Long Term Support (ELTS).",
          columns: ["Version", "Status", "What it means for you"],
          rows: [
            ["TYPO3 v11 LTS", "Community support ended in October 2024", "Plan the upgrade urgently"],
            ["TYPO3 v12 LTS", "No community updates since 1 May 2026", "Plan the upgrade or use ELTS in the meantime"],
            ["TYPO3 v13 LTS", "Released October 2024, security updates until the end of 2027", "Supported – the next step is v14"],
            ["TYPO3 v14 LTS", "Released April 2026, security updates until June 2029", "The current LTS version for new projects"],
          ],
        },
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your site runs on a supported TYPO3 version",
          "Security updates arrive regularly again",
          "Your editors work with a tidy backend",
          "One point of contact, even if the old agency has moved on",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "ELTS and premium extensions go to the provider directly.",
          "Very old extensions cannot always be carried over – then I replace them after we agree.",
          "Copy, images and legal texts need your input.",
          "I work independently and am not an official TYPO3 partner.",
        ],
        processTitle: "How it works",
        process: [
          "You send me the link, the TYPO3 version and, if you have it, the list of extensions",
          "I review the installation and tell you the way forward, the order and the effort",
          "I build upgrades on a copy and test them before they go live",
          "Handover with a walkthrough – if you like, I take over updates and upkeep long term",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about TYPO3",
        faq: [
          {
            q: "Do I need to upgrade from TYPO3 v12?",
            a: "Yes, as soon as you can: the TYPO3 community has published no updates for v12 since 1 May 2026. Paid Extended Long Term Support (ELTS) buys time but does not replace the upgrade.",
          },
          {
            q: "Will my extensions still work after the upgrade?",
            a: "I check every extension beforehand. Many have a matching version; whatever is no longer maintained I adapt or replace after we agree.",
          },
          {
            q: "What does a TYPO3 upgrade cost?",
            a: "That depends on the version, extensions and templates. After the review I tell you the effort or a fixed price. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Do you take over TYPO3 sites built by another agency?",
            a: "Yes. I get an overview of the installation, extensions and templates, then take care of errors, updates and further development.",
          },
          {
            q: "Is TYPO3 still worth it for a small website?",
            a: "If editorial workflows, permissions or multiple languages matter, often yes. For a small site WordPress can be simpler – we work that out honestly in the first conversation.",
          },
        ],
        ctaTitle: "Does your TYPO3 site need an upgrade?",
        ctaText:
          "Send me the link and the TYPO3 version – I will tell you which way makes sense. I usually reply within 24 hours.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
  {
    id: "strato",
    name: "STRATO",
    kind: "builder",
    slug: "strato",
    seoTitle: {
      de: "STRATO-Website: Hilfe & Umzug zu WordPress — Tracht Digital",
      en: "STRATO Websites: Help and Moving to WordPress — Tracht Digital",
    },
    updatedAt: "2026-09-15",
    wikipedia: {
      de: "https://de.wikipedia.org/wiki/Strato_AG",
      en: "https://en.wikipedia.org/wiki/Strato_AG",
    },
    keywords: {
      de: ["Baukasten-Hilfe", "Relaunch", "Gestaltung", "Umzug zu WordPress"],
      en: ["Builder help", "Relaunch", "Design", "Moving to WordPress"],
    },
    articleSlugs: ["website-fuenf-dinge-die-fehlen", "konzept-vor-umsetzung"],
    sources: [SOURCE.stratoBuilder, SOURCE.stratoWordpress, SOURCE.childThemes],
    content: {
      de: {
        label: "Webauftritt",
        title: "Hilfe für deine STRATO-Website – vom Baukasten bis WordPress",
        summary:
          "Du nutzt den STRATO Homepage-Baukasten oder WordPress bei STRATO? Ich helfe bei Aufbau, Fehlern und Design – oder beim Umzug zu WordPress.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Ich helfe dir mit deiner Website bei STRATO – ob Homepage-Baukasten, SmartWebshop oder Hosting für WordPress: bei Aufbau, Fehlern und Gestaltung und, wenn der Baukasten nicht mehr reicht, *beim Umzug zu WordPress* samt Domain und E-Mail. Ich arbeite unabhängig von STRATO.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Der Homepage-Baukasten ist eingerichtet, aber die Seite wirkt noch nicht professionell.",
          "Du kommst mit Vorlagen, Menüs oder Einstellungen nicht weiter.",
          "Deine WordPress-Seite bei STRATO zeigt Fehler oder lädt langsam.",
          "Der Baukasten kann nicht, was du brauchst – und du fragst dich, wie ein Wechsel geht.",
        ],
        offersTitle: "Das übernehme ich für deine Website",
        offers: [
          {
            id: "fehler-beheben",
            title: "Fehler beheben und Pflege",
            text: "Ich helfe bei Problemen mit Baukasten, WordPress und Einstellungen – und übernehme auf Wunsch die laufende Pflege.",
            points: [
              "Einstellungen, Menüs und Seitenstruktur im Baukasten",
              "Fehler und Updates bei WordPress",
              "Domain, SSL und E-Mail-Einrichtung prüfen",
              "Laufende Pflege von Inhalten und Technik",
            ],
          },
          {
            id: "relaunch",
            title: "Neue Website oder Relaunch",
            text: "Ich baue deine Seite im Baukasten neu auf oder setze sie mit WordPress um – mit klarer Struktur und Texten, die Besucher verstehen.",
            points: [
              "Seitenstruktur und Inhalte ordnen",
              "Gestaltung passend zu deinem Betrieb",
              "Grundlagen für Google: Titel und Beschreibungen",
              "Für Handy und Bildschirm optimiert",
            ],
          },
          {
            id: "vorlagen",
            title: "Vorlagen und Gestaltung",
            text: "Im Baukasten passe ich Vorlage, Farben, Schriften und Bilder an; bei WordPress arbeite ich mit einem Child-Theme oder einem eigenen Theme.",
            points: [
              "Passende Vorlage auswählen und anpassen",
              "Farben, Schriften und Bilder nach deiner Marke",
              "Einheitliche Seiten statt Flickenteppich",
              "Bei WordPress: Child-Theme oder eigenes Theme",
            ],
          },
          {
            id: "umzug",
            title: "Umzug zu WordPress",
            text: "Wenn der Baukasten an Grenzen stößt, ziehe ich deine Seite zu WordPress um – bei STRATO oder einem anderen Hoster, mit Domain, E-Mail und Weiterleitungen.",
            points: [
              "Inhalte und Bilder übernehmen",
              "WordPress einrichten, auf Wunsch mit WooCommerce-Shop",
              "Domain und E-Mail-Postfächer mitnehmen",
              "Weiterleitungen für alte Adressen",
            ],
          },
        ],
        comparison: {
          title: "STRATO Homepage-Baukasten oder WordPress?",
          intro:
            "Kurz gesagt: Der Homepage-Baukasten bringt Vorlagen und Technik fertig mit und passt für einen schnellen, übersichtlichen Auftritt. WordPress lässt mehr Raum für Gestaltung und Funktionen, braucht aber regelmäßige Pflege.",
          columns: ["Kriterium", "Homepage-Baukasten", "WordPress, z. B. mit Hosting für WordPress"],
          rows: [
            ["Einstieg", "Vorlage wählen und Inhalte im Editor einfügen", "Theme, Plugins und Seitenstruktur einrichten"],
            [
              "Technik",
              "STRATO kümmert sich um die Technik des Baukastens",
              "WordPress, Themes und Plugins brauchen Updates – Hosting für WordPress bringt automatische WordPress-Updates mit",
            ],
            ["Gestaltung", "Vorlagen des Baukastens", "Große Auswahl an Themes oder ein eigenes Design"],
            ["Shop", "Über den SmartWebshop", "Über Plugins, z. B. WooCommerce"],
            [
              "Passt, wenn",
              "du schnell eine übersichtliche Seite willst",
              "du mehr Gestaltung, mehr Funktionen oder später einen größeren Shop brauchst",
            ],
          ],
        },
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Deine Seite wirkt professionell und ist leicht zu bedienen",
          "Fehler sind behoben, und du weißt, woran es lag",
          "Ein geplanter Wechsel zu WordPress, bei dem Domain und E-Mail mitkommen",
          "Ein Ansprechpartner, der deine Seite kennt",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Verträge, Tarife und Rechnungen bleiben bei STRATO – darauf habe ich keinen Einfluss.",
          "Nicht jede Baukasten-Funktion lässt sich eins zu eins in WordPress nachbauen; das klären wir vorher.",
          "Texte, Bilder und Rechtstexte brauchen deine Zuarbeit.",
          "Ich bin unabhängig und kein Partner von STRATO.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schilderst, was du nutzt und was nicht klappt – ein Link genügt",
          "Ich schaue mir Seite und Einstellungen an und nenne dir Weg und Aufwand",
          "Für Änderungen brauche ich einen Zugang; vor einem Umzug sichere ich alle Inhalte",
          "Übergabe mit Erklärung – auf Wunsch bleibe ich für Pflege und Fragen da",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu STRATO-Websites",
        faq: [
          {
            q: "Hilfst du auch beim STRATO Homepage-Baukasten?",
            a: "Ja. Ich richte Vorlage, Seiten und Einstellungen ein, verbessere Gestaltung und Texte und zeige dir, wie du die Seite danach selbst pflegst.",
          },
          {
            q: "Wann lohnt sich der Wechsel vom Baukasten zu WordPress?",
            a: "Wenn du Funktionen, Gestaltung oder einen Shop brauchst, die der Baukasten nicht bietet. Reicht dir eine übersichtliche Seite, kann der Baukasten die einfachere Lösung bleiben.",
          },
          {
            q: "Kann meine Domain bei STRATO bleiben?",
            a: "Ja. Die Domain kann bei STRATO bleiben und auf die neue Seite zeigen – oder mit umziehen, wenn du alles an einem Ort haben willst.",
          },
          {
            q: "Was kostet die Hilfe bei meiner STRATO-Website?",
            a: "Abgerechnet wird nach Aufwand oder zum Festpreis, sobald klar ist, was zu tun ist. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren. Deinen STRATO-Tarif zahlst du wie bisher direkt an STRATO.",
          },
          {
            q: "Arbeitest du für STRATO?",
            a: "Nein. Ich bin unabhängig und helfe dir als Kunde von STRATO – ohne Tarife oder Produkte zu verkaufen.",
          },
        ],
        ctaTitle: "Deine STRATO-Website soll mehr können?",
        ctaText:
          "Schreib mir, was du nutzt und was du vorhast – ein Link genügt. Ich antworte in der Regel innerhalb von 24 Stunden.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Help with your STRATO website – from site builder to WordPress",
        summary:
          "Using the STRATO website builder or WordPress hosting at STRATO? I help with setup, errors and design – or with moving to WordPress.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. I help you with your website at STRATO – whether you use the Homepage-Baukasten website builder, the SmartWebshop or WordPress hosting: with setup, errors and design and, once the builder is no longer enough, *with moving to WordPress* including domain and email. I work independently of STRATO.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "The website builder is set up, but the site does not look professional yet.",
          "You are stuck with templates, menus or settings.",
          "Your WordPress site at STRATO shows errors or loads slowly.",
          "The builder cannot do what you need – and you wonder how switching works.",
        ],
        offersTitle: "What I take care of for your website",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing errors and upkeep",
            text: "I help with problems in the builder, in WordPress and with settings – and take over ongoing upkeep if you like.",
            points: [
              "Settings, menus and page structure in the builder",
              "WordPress errors and updates",
              "Checking domain, SSL and email setup",
              "Ongoing upkeep of content and technology",
            ],
          },
          {
            id: "relaunch",
            title: "New website or relaunch",
            text: "I rebuild your site in the builder or move it onto WordPress – with a clear structure and copy visitors understand.",
            points: [
              "Ordering page structure and content",
              "A design that suits your business",
              "Search essentials: titles and descriptions",
              "Optimised for phones and screens",
            ],
          },
          {
            id: "templates",
            title: "Templates and design",
            text: "In the builder I adjust template, colours, fonts and images; on WordPress I work with a child theme or a theme of your own.",
            points: [
              "Choosing and adapting a suitable template",
              "Colours, fonts and images to match your brand",
              "Consistent pages instead of a patchwork",
              "On WordPress: a child theme or a theme of your own",
            ],
          },
          {
            id: "migration",
            title: "Moving to WordPress",
            text: "When the builder reaches its limits, I move your site to WordPress – at STRATO or another host, with domain, email and redirects.",
            points: [
              "Carrying over content and images",
              "Setting up WordPress, with a WooCommerce shop if needed",
              "Taking domain and mailboxes along",
              "Redirects for old addresses",
            ],
          },
        ],
        comparison: {
          title: "STRATO website builder or WordPress?",
          intro:
            "In short: the website builder comes with templates and technology ready to go and suits a quick, clear site. WordPress gives you more room for design and features but needs regular upkeep.",
          columns: ["Criterion", "Homepage-Baukasten (website builder)", "WordPress, e.g. with WordPress hosting"],
          rows: [
            ["Getting started", "Pick a template and add content in the editor", "Set up theme, plugins and page structure"],
            [
              "Technology",
              "STRATO takes care of the builder's technology",
              "WordPress, themes and plugins need updates – STRATO's WordPress hosting includes automatic WordPress updates",
            ],
            ["Design", "The builder's templates", "A wide choice of themes or a design of your own"],
            ["Shop", "Via the SmartWebshop", "Via plugins, e.g. WooCommerce"],
            ["Fits if", "you want a clear site quickly", "you need more design, more features or a bigger shop later"],
          ],
        },
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your site looks professional and is easy to use",
          "Errors are fixed, and you know what caused them",
          "A planned move to WordPress in which domain and email come along",
          "One point of contact who knows your site",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Contracts, plans and invoices stay with STRATO – I have no influence on them.",
          "Not every builder feature can be rebuilt one to one in WordPress; we clarify that first.",
          "Copy, images and legal texts need your input.",
          "I work independently and am not a STRATO partner.",
        ],
        processTitle: "How it works",
        process: [
          "You tell me what you use and what is not working – a link is enough",
          "I look at the site and settings and tell you the way forward and the effort",
          "For changes I need access; before a move I back up all content",
          "Handover with an explanation – if you like, I stay available for upkeep and questions",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about STRATO websites",
        faq: [
          {
            q: "Do you also help with the STRATO website builder?",
            a: "Yes. I set up template, pages and settings, improve design and copy, and show you how to maintain the site yourself afterwards.",
          },
          {
            q: "When is it worth moving from the builder to WordPress?",
            a: "When you need features, design or a shop the builder does not offer. If a clear, simple site is all you need, the builder can remain the easier option.",
          },
          {
            q: "Can my domain stay at STRATO?",
            a: "Yes. The domain can stay at STRATO and point to the new site – or move along if you want everything in one place.",
          },
          {
            q: "What does help with my STRATO website cost?",
            a: "Work is billed by effort or at a fixed price once it is clear what needs doing. Costs only arise once we agree on an assignment. Your STRATO plan stays billed by STRATO as before.",
          },
          {
            q: "Do you work for STRATO?",
            a: "No. I work independently and help you as a STRATO customer – without selling plans or products.",
          },
        ],
        ctaTitle: "Should your STRATO website do more?",
        ctaText:
          "Tell me what you use and what you have in mind – a link is enough. I usually reply within 24 hours.",
        ctaButton: "Arrange an initial consultation",
      },
    },
  },
];

/** `/leistungen/<slug>` or `/en/services/<slug>`. */
export function platformHref(platform: PlatformDefinition, lang: Lang): string {
  return lang === "de" ? `/leistungen/${platform.slug}` : `/en/services/${platform.slug}`;
}

/** The platform served under this slug, if any. Slugs are the same in both trees. */
export function getPlatformBySlug(slug: string | undefined): PlatformDefinition | undefined {
  if (!slug) return undefined;
  return platformDefinitions.find((platform) => platform.slug === slug);
}

export function getPlatformById(id: PlatformId): PlatformDefinition {
  const platform = platformDefinitions.find((candidate) => candidate.id === id);
  // Same contract as `getServiceById`: the union and the catalog are kept together.
  if (!platform) throw new Error(`Unknown platform id: ${id}`);
  return platform;
}
