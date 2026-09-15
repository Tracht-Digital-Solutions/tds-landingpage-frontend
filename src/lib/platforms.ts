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
 * - **Short.** Three points per list, four questions, one statement per
 *   sentence (asked for 2026-09-15). The page is read, not scrolled past.
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
    text: "Abgerechnet wird nach Aufwand zum Stundensatz – oder zum Festpreis, wenn der Umfang klar ist. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
  },
  en: {
    title: "What does it cost?",
    text: "Billed by effort at the hourly rate – or at a fixed price once the scope is clear. Costs only arise once we agree on an assignment.",
  },
};

const REFERENCES: Record<Lang, { headline: string; label: string }> = {
  de: {
    headline: "Aus der Praxis",
    label: "Veröffentlicht nur mit Freigabe der Kunden.",
  },
  en: {
    headline: "From practice",
    label: "Published only with the client's approval.",
  },
};

/** Both shop pages answer the same question the same way. */
const SHOP_COMPARISON: Record<Lang, PlatformComparison> = {
  de: {
    title: "WooCommerce oder Shopware 6?",
    intro:
      "Kurz gesagt: WooCommerce erweitert WordPress, Shopware 6 ist ein eigenständiges Shopsystem. Entscheidend sind deine Website und dein Sortiment.",
    columns: ["Kriterium", "WooCommerce", "Shopware 6"],
    rows: [
      ["Grundlage", "Plugin für WordPress", "Eigenständiges Shopsystem"],
      ["Website und Shop", "Ein System mit deiner WordPress-Seite", "Inhalte über Erlebniswelten im Shop"],
      ["Gestaltung", "WordPress-Themes, anpassbar per Child-Theme", "Themes auf Basis von Storefront"],
      ["Lizenz", "Open Source", "Community Edition als Open Source, dazu kostenpflichtige Pläne"],
      ["Passt, wenn", "du schon WordPress nutzt", "der Shop das Herzstück ist, mit vielen Artikeln oder Kanälen"],
    ],
  },
  en: {
    title: "WooCommerce or Shopware 6?",
    intro:
      "In short: WooCommerce extends WordPress, Shopware 6 is a standalone shop system. What matters most is your website and your catalogue.",
    columns: ["Criterion", "WooCommerce", "Shopware 6"],
    rows: [
      ["Basis", "WordPress plugin", "Standalone shop system"],
      ["Website and shop", "One system with your WordPress site", "Content via Shopping Experiences in the shop"],
      ["Design", "WordPress themes, customisable with a child theme", "Themes based on Storefront"],
      ["Licence", "Open source", "Community Edition as open source, plus paid plans"],
      ["Fits if", "you already use WordPress", "the shop is the core, with many products or channels"],
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
          "Ich baue deinen WooCommerce-Shop, behebe Fehler und passe dein Theme update-sicher an – aus Schwarzenbek bei Hamburg.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Für WooCommerce richte ich Shops ein, behebe Fehler und passe Themes so an, dass Updates möglich bleiben. Du hast *einen festen Ansprechpartner*.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Nach einem Update zeigt der Shop eine weiße Seite oder einen kritischen Fehler.",
          "Kunden brechen im Checkout ab, weil Zahlung oder Versand nicht funktionieren.",
          "Der Shop lädt langsam, und niemand weiß, warum.",
        ],
        offersTitle: "Das übernehme ich für deinen Shop",
        offers: [
          {
            id: "fehler-beheben",
            title: "WooCommerce-Fehler beheben",
            text: "Ich suche die Ursache, statt nur das Symptom zu überdecken.",
            points: [
              "Weiße Seite oder kritischer Fehler nach Updates",
              "Probleme in Warenkorb, Checkout oder Zahlung",
              "Plugin-Konflikte und langsame Ladezeiten",
            ],
          },
          {
            id: "shop-erstellen",
            title: "WooCommerce-Shop erstellen",
            text: "Ich richte deinen Shop auf WordPress ein – bereit für den deutschen Markt.",
            points: [
              "WordPress und WooCommerce einrichten",
              "Produkte anlegen oder importieren",
              "Zahlung, Versand und rechtliche Grundlagen, z. B. mit Germanized",
            ],
          },
          {
            id: "theme",
            title: "WooCommerce-Theme anpassen",
            text: "Änderungen kommen in ein Child-Theme – so bleiben Updates möglich.",
            points: [
              "Design passend zu deiner Marke",
              "Produktseiten, Kategorien und Warenkorb",
              "Für Handy und kurze Ladezeiten",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.de,
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Dein Shop läuft wieder – und du weißt, woran es lag",
          "Kunden kommen ohne Hürden durch den Checkout",
          "Dein Design übersteht das nächste Update",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Rechtstexte liefert eine Kanzlei oder ein Rechtstexte-Dienst – ich baue sie ein.",
          "Gebühren und Premium-Plugins zahlst du direkt an den Anbieter.",
          "Ich bin unabhängig und kein offizieller Partner von WooCommerce oder Automattic.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schilderst das Problem – gern mit Link",
          "Ich prüfe den Shop und nenne dir Ursache und Aufwand",
          "Ich teste Änderungen auf einer Kopie, dann gehen sie live",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu WooCommerce",
        faq: [
          {
            q: "Kannst du Fehler in meinem WooCommerce-Shop beheben?",
            a: "Ja. Ich finde die Ursache – meist ein Plugin, ein Update oder das Theme – und behebe sie.",
          },
          {
            q: "Was kostet ein WooCommerce-Shop?",
            a: "Das hängt von Produkten, Zahlungsarten und Design ab. Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Bleiben meine Anpassungen bei Theme-Updates erhalten?",
            a: "Ja, wenn sie in einem Child-Theme stehen. So baue ich sie ein.",
          },
          {
            q: "Ist WooCommerce das richtige Shopsystem für mich?",
            a: "Ja, wenn du schon WordPress nutzt. Bei großen Sortimenten lohnt der Vergleich mit Shopware 6.",
          },
        ],
        ctaTitle: "Dein Shop braucht Hilfe?",
        ctaText: "Schreib mir kurz, was nicht läuft – gern mit Link.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Build, fix and customise your WooCommerce shop",
        summary:
          "I build your WooCommerce shop, fix errors and customise your theme in an update-safe way – from Schwarzenbek near Hamburg.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. For WooCommerce I set up shops, fix errors and customise themes so that updates stay possible. You get *one steady point of contact*.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "After an update the shop shows a white page or a critical error.",
          "Customers abandon checkout because payment or shipping does not work.",
          "The shop loads slowly, and nobody knows why.",
        ],
        offersTitle: "What I take care of for your shop",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing WooCommerce errors",
            text: "I look for the cause instead of covering up the symptom.",
            points: [
              "White page or critical error after updates",
              "Problems in cart, checkout or payment",
              "Plugin conflicts and slow loading times",
            ],
          },
          {
            id: "build-shop",
            title: "Building a WooCommerce shop",
            text: "I set up your shop on WordPress – ready for the German market.",
            points: [
              "Setting up WordPress and WooCommerce",
              "Adding or importing products",
              "Payment, shipping and legal essentials, e.g. with Germanized",
            ],
          },
          {
            id: "theme",
            title: "Customising your WooCommerce theme",
            text: "Changes go into a child theme – so updates stay possible.",
            points: [
              "A design that fits your brand",
              "Product pages, categories and cart",
              "Built for phones and short loading times",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.en,
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your shop works again – and you know what caused it",
          "Customers get through checkout without obstacles",
          "Your design survives the next update",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Legal texts come from a law firm or a legal text service – I put them in place.",
          "Fees and premium plugins go to the provider directly.",
          "I work independently and am not an official partner of WooCommerce or Automattic.",
        ],
        processTitle: "How it works",
        process: [
          "You describe the problem – a link helps",
          "I review the shop and tell you the cause and the effort",
          "I test changes on a copy, then they go live",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about WooCommerce",
        faq: [
          {
            q: "Can you fix errors in my WooCommerce shop?",
            a: "Yes. I find the cause – usually a plugin, an update or the theme – and fix it.",
          },
          {
            q: "What does a WooCommerce shop cost?",
            a: "That depends on products, payment methods and design. Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Will my customisations survive theme updates?",
            a: "Yes, if they live in a child theme. That is how I build them.",
          },
          {
            q: "Is WooCommerce the right shop system for me?",
            a: "Yes, if you already use WordPress. With a large catalogue it is worth comparing Shopware 6.",
          },
        ],
        ctaTitle: "Does your shop need help?",
        ctaText: "Send me a short note on what is not working – a link helps.",
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
          "Ich richte deinen Shopware-6-Shop ein, behebe Fehler nach Updates und baue Themes – auch beim Umstieg von Shopware 5.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Für Shopware 6 richte ich Shops ein, behebe Fehler und baue Themes. Ich begleite auch den Umstieg von Shopware 5, dessen Sicherheitsupdates *am 31. Juli 2024 endeten*.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Nach einem Update lädt die Storefront oder die Administration nicht mehr richtig.",
          "Eine Erweiterung verträgt sich nicht mit der neuen Version.",
          "Dein Shop läuft noch auf Shopware 5 – ohne Sicherheitsupdates.",
        ],
        offersTitle: "Das übernehme ich für deinen Shop",
        offers: [
          {
            id: "fehler-beheben",
            title: "Shopware-6-Fehler beheben",
            text: "Ich grenze Fehler systematisch ein und behebe die Ursache.",
            points: [
              "Fehler nach Updates",
              "Konflikte zwischen Erweiterungen",
              "Probleme bei Checkout, Zahlung oder Versand",
            ],
          },
          {
            id: "shop-erstellen",
            title: "Shopware-6-Shop erstellen",
            text: "Ich richte deinen Shop ein – oder ziehe ihn von Shopware 5 um.",
            points: [
              "Einrichtung und Verkaufskanäle",
              "Produkte anlegen oder importieren",
              "Umstieg mit dem Migrationsassistenten",
            ],
          },
          {
            id: "theme",
            title: "Shopware-6-Theme anpassen",
            text: "Dein Theme baut auf Storefront auf. So bleiben Updates möglich.",
            points: [
              "Eigenes Theme statt Änderungen am Kern",
              "Farben, Schriften und Layout nach deiner Marke",
              "Erlebniswelten für Startseite und Aktionen",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.de,
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Dein Shop läuft auf einer unterstützten Version",
          "Updates sind wieder planbar",
          "Dein Design passt zur Marke und übersteht Updates",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Lizenzen für Shopware-Pläne und Erweiterungen zahlst du direkt an den Anbieter.",
          "Beim Umstieg von Shopware 5 ziehen die Daten um, Theme und Erweiterungen entstehen neu.",
          "Ich bin unabhängig und kein offizieller Shopware-Partner.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schilderst das Problem – mit Shop-Version, wenn du sie kennst",
          "Ich prüfe den Shop und nenne dir Ursache und Aufwand",
          "Ich teste Updates auf einer Kopie, dann gehen sie live",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu Shopware 6",
        faq: [
          {
            q: "Shopware 5 bekommt keine Sicherheitsupdates mehr – was jetzt?",
            a: "Die Sicherheitsupdates endeten am 31. Juli 2024. Sinnvoll ist der Umstieg auf Shopware 6: Die Daten ziehen mit dem Migrationsassistenten um, Theme und Erweiterungen entstehen neu.",
          },
          {
            q: "Kannst du Fehler nach einem Shopware-Update beheben?",
            a: "Ja. Ich finde heraus, ob Update, Erweiterung oder Theme den Fehler auslöst, und behebe die Ursache.",
          },
          {
            q: "Was kostet ein Shopware-6-Shop?",
            a: "Das hängt von Sortiment, Design und Erweiterungen ab. Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Ist Shopware 6 besser als WooCommerce?",
            a: "Nicht besser, sondern anders: Shopware 6 ist ein eigenständiges Shopsystem, WooCommerce erweitert WordPress.",
          },
        ],
        ctaTitle: "Dein Shopware-Shop braucht Hilfe?",
        ctaText: "Schreib mir kurz, was nicht läuft – gern mit Shop-Version und Link.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Build, fix and customise your Shopware 6 shop",
        summary:
          "I set up your Shopware 6 shop, fix errors after updates and build themes – including the move from Shopware 5.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. For Shopware 6 I set up shops, fix errors and build themes. I also handle the move from Shopware 5, whose security updates *ended on 31 July 2024*.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "After an update the storefront or the administration no longer loads properly.",
          "An extension does not work with the new version.",
          "Your shop still runs on Shopware 5 – without security updates.",
        ],
        offersTitle: "What I take care of for your shop",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing Shopware 6 errors",
            text: "I narrow errors down systematically and fix the cause.",
            points: [
              "Errors after updates",
              "Conflicts between extensions",
              "Problems with checkout, payment or shipping",
            ],
          },
          {
            id: "build-shop",
            title: "Building a Shopware 6 shop",
            text: "I set up your shop – or move it over from Shopware 5.",
            points: [
              "Setup and sales channels",
              "Adding or importing products",
              "Moving with the migration assistant",
            ],
          },
          {
            id: "theme",
            title: "Customising your Shopware 6 theme",
            text: "Your theme builds on Storefront. That keeps updates possible.",
            points: [
              "A theme of your own instead of changes to the core",
              "Colours, fonts and layout to match your brand",
              "Shopping Experiences for the home page and promotions",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.en,
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your shop runs on a supported version",
          "Updates are plannable again",
          "Your design fits your brand and survives updates",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Licences for Shopware plans and extensions go to the provider directly.",
          "Moving from Shopware 5 carries the data across; theme and extensions are rebuilt.",
          "I work independently and am not an official Shopware partner.",
        ],
        processTitle: "How it works",
        process: [
          "You describe the problem – with the shop version if you know it",
          "I review the shop and tell you the cause and the effort",
          "I test updates on a copy, then they go live",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about Shopware 6",
        faq: [
          {
            q: "Shopware 5 no longer gets security updates – what now?",
            a: "Security updates ended on 31 July 2024. Moving to Shopware 6 makes sense: the data moves with the migration assistant, while theme and extensions are rebuilt.",
          },
          {
            q: "Can you fix errors after a Shopware update?",
            a: "Yes. I find out whether the update, an extension or the theme triggers the error and fix the cause.",
          },
          {
            q: "What does a Shopware 6 shop cost?",
            a: "That depends on catalogue, design and extensions. Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Is Shopware 6 better than WooCommerce?",
            a: "Not better, different: Shopware 6 is a standalone shop system, WooCommerce extends WordPress.",
          },
        ],
        ctaTitle: "Does your Shopware shop need help?",
        ctaText: "Send me a short note on what is not working – shop version and a link help.",
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
          "Ich baue deine WordPress-Website, behebe Fehler, passe dein Theme an und übernehme Updates und Pflege – aus Schwarzenbek bei Hamburg.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Ich betreue WordPress-Websites: Fehler beheben, Updates, neue Seiten, Themes und Umzüge. WordPress läuft laut W3Techs auf *40,3 % aller Websites* (September 2026).",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Statt deiner Seite erscheint eine weiße Seite oder ein kritischer Fehler.",
          "Updates stehen seit Monaten aus, weil danach etwas kaputtgehen könnte.",
          "Die Seite ist veraltet, langsam oder auf dem Handy schwer zu bedienen.",
        ],
        offersTitle: "Das übernehme ich für deine Website",
        offers: [
          {
            id: "fehler-beheben",
            title: "Fehler beheben und Wartung",
            text: "Ich finde die Ursache und halte deine Seite danach aktuell.",
            points: [
              "Weiße Seite oder Fehler nach Updates",
              "Updates von WordPress, Themes und Plugins",
              "Sicherung vor jedem Eingriff",
            ],
          },
          {
            id: "relaunch",
            title: "Neue Website oder Relaunch",
            text: "Ich baue deine Seite neu oder überarbeite sie – mit klarer Struktur.",
            points: [
              "Seiten und Inhalte ordnen",
              "Für Handy und Bildschirm",
              "Grundlagen für Google",
            ],
          },
          {
            id: "theme",
            title: "Themes und Templates",
            text: "Anpassungen kommen in ein Child-Theme – so bleiben sie bei Updates erhalten.",
            points: [
              "Bestehendes Theme anpassen",
              "Block-Themes und klassische Themes",
              "Eigenes Theme nach deinem Design",
            ],
          },
          {
            id: "umzug",
            title: "Umzug und Upgrades",
            text: "Ich ziehe deine Seite um – mit Domain, E-Mail und Weiterleitungen.",
            points: [
              "Vom Baukasten zu WordPress",
              "Umzug zu einem anderen Hoster",
              "Aktuelle PHP-Version",
            ],
          },
        ],
        comparison: {
          title: "Block-Theme oder klassisches Theme?",
          intro:
            "Kurz gesagt: Block-Themes bearbeitest du direkt im Website-Editor, klassische Themes über PHP-Vorlagen und den Customizer.",
          columns: ["Kriterium", "Block-Theme", "Klassisches Theme"],
          rows: [
            ["Aufbau", "Vorlagen aus Blöcken, Einstellungen in der theme.json", "PHP-Vorlagen, Einstellungen im Customizer"],
            ["Bearbeiten", "Kopf, Fuß und Vorlagen im Website-Editor", "Vieles nur im Code oder in Theme-Optionen"],
            ["Update-sicher anpassen", "Eigene Styles und Vorlagen, bei Bedarf Child-Theme", "Child-Theme"],
            ["Passt, wenn", "du Layout und Inhalte selbst anpassen willst", "eine bestehende Seite stabil weiterlaufen soll"],
          ],
        },
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Deine Seite läuft wieder – und bleibt aktuell",
          "Updates mit Sicherung vorher",
          "Eine Seite, die auf dem Handy funktioniert",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Texte, Bilder und Rechtstexte brauchen deine Zuarbeit.",
          "Hosting, Domain und Premium-Plugins zahlst du direkt an den Anbieter.",
          "Ich bin unabhängig und nicht mit WordPress.org oder Automattic verbunden.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schilderst das Problem – ein Link genügt",
          "Ich prüfe die Seite und nenne dir Ursache und Aufwand",
          "Vor jedem Eingriff lege ich eine Sicherung an",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu WordPress",
        faq: [
          {
            q: "Meine WordPress-Seite zeigt einen kritischen Fehler – was tun?",
            a: "Meist steckt ein Plugin, das Theme oder ein Update dahinter. Ich finde die Ursache und bringe die Seite wieder zum Laufen.",
          },
          {
            q: "Übernimmst du Updates und Wartung?",
            a: "Ja. Ich halte WordPress, Themes und Plugins aktuell und sichere vorher – nach Bedarf oder als Monatsmodell.",
          },
          {
            q: "Was kostet eine WordPress-Website?",
            a: "Das hängt von Umfang und Funktionen ab. Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Kannst du meine Seite von einem Baukasten zu WordPress umziehen?",
            a: "Ja. Ich übernehme Inhalte und Bilder und richte Weiterleitungen ein, damit alte Links funktionieren.",
          },
        ],
        ctaTitle: "Deine WordPress-Seite braucht Hilfe?",
        ctaText: "Schreib mir kurz, was nicht läuft – ein Link genügt.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Build, fix and maintain your WordPress website",
        summary:
          "I build your WordPress website, fix errors, customise your theme and take care of updates and upkeep – from Schwarzenbek near Hamburg.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. I look after WordPress websites: fixing errors, updates, new sites, themes and migrations. According to W3Techs, WordPress runs *40.3% of all websites* (September 2026).",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "Instead of your site you get a white page or a critical error.",
          "Updates have been waiting for months because something might break.",
          "The site is outdated, slow or hard to use on a phone.",
        ],
        offersTitle: "What I take care of for your website",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing errors and maintenance",
            text: "I find the cause and keep your site up to date afterwards.",
            points: [
              "White page or errors after updates",
              "Updates of WordPress, themes and plugins",
              "A backup before every change",
            ],
          },
          {
            id: "relaunch",
            title: "New website or relaunch",
            text: "I rebuild your site or rework it – with a clear structure.",
            points: [
              "Ordering pages and content",
              "Built for phones and screens",
              "Search essentials",
            ],
          },
          {
            id: "theme",
            title: "Themes and templates",
            text: "Customisations go into a child theme – so they survive updates.",
            points: [
              "Customising an existing theme",
              "Block themes and classic themes",
              "A theme of your own, built to your design",
            ],
          },
          {
            id: "migration",
            title: "Migrations and upgrades",
            text: "I move your site – with domain, email and redirects.",
            points: [
              "From a site builder to WordPress",
              "Moving to another host",
              "A current PHP version",
            ],
          },
        ],
        comparison: {
          title: "Block theme or classic theme?",
          intro:
            "In short: block themes are edited right in the Site Editor, classic themes through PHP templates and the Customizer.",
          columns: ["Criterion", "Block theme", "Classic theme"],
          rows: [
            ["Structure", "Templates made of blocks, settings in theme.json", "PHP templates, settings in the Customizer"],
            ["Editing", "Header, footer and templates in the Site Editor", "Much of it only in code or theme options"],
            ["Update-safe changes", "Your own styles and templates, a child theme if needed", "Child theme"],
            ["Fits if", "you want to adjust layout and content yourself", "an existing site should keep running reliably"],
          ],
        },
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your site works again – and stays up to date",
          "Updates with a backup first",
          "A site that works on phones",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Copy, images and legal texts need your input.",
          "Hosting, domain and premium plugins go to the provider directly.",
          "I work independently and am not affiliated with WordPress.org or Automattic.",
        ],
        processTitle: "How it works",
        process: [
          "You describe the problem – a link is enough",
          "I review the site and tell you the cause and the effort",
          "I make a backup before every change",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about WordPress",
        faq: [
          {
            q: "My WordPress site shows a critical error – what should I do?",
            a: "Usually a plugin, the theme or an update is behind it. I find the cause and get the site running again.",
          },
          {
            q: "Do you take care of updates and maintenance?",
            a: "Yes. I keep WordPress, themes and plugins up to date and back up first – as needed or as a monthly arrangement.",
          },
          {
            q: "What does a WordPress website cost?",
            a: "That depends on scope and features. Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Can you move my site from a site builder to WordPress?",
            a: "Yes. I carry over content and images and set up redirects so old links keep working.",
          },
        ],
        ctaTitle: "Does your WordPress site need help?",
        ctaText: "Send me a short note on what is not working – a link is enough.",
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
          "Ich bringe deine TYPO3-Website auf eine unterstützte Version, behebe Fehler und übernehme die Pflege – aus Schwarzenbek bei Hamburg.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Ich betreue TYPO3-Websites: Upgrades, Fehlerbehebung, Templates und Relaunches. Wichtig: TYPO3 v12 bekommt *seit dem 1. Mai 2026 keine Community-Updates mehr*.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Deine Seite läuft noch auf TYPO3 v12 oder älter.",
          "Nach einem Update funktioniert eine Extension nicht mehr.",
          "Die Agentur, die die Seite gebaut hat, betreut sie nicht mehr.",
        ],
        offersTitle: "Das übernehme ich für deine TYPO3-Seite",
        offers: [
          {
            id: "fehler-beheben",
            title: "Fehler beheben und Wartung",
            text: "Ich finde Fehler und halte TYPO3 mit Sicherheitsupdates aktuell.",
            points: [
              "Fehler im Backend oder Frontend",
              "Extensions nach Updates reparieren",
              "Sicherung vor jedem Eingriff",
            ],
          },
          {
            id: "relaunch",
            title: "Neue Website oder Relaunch",
            text: "Ich setze deine Seite neu auf – mit aktuellem TYPO3 und einem Backend, das deine Redaktion gut bedienen kann.",
            points: [
              "Seitenbaum und Inhalte neu ordnen",
              "Für Handy und Bildschirm",
              "Weiterleitungen für alte Adressen",
            ],
          },
          {
            id: "templates",
            title: "Templates und Extensions",
            text: "Templates baue ich in einem eigenen Site-Package – getrennt vom TYPO3-Kern.",
            points: [
              "Fluid-Templates im Site-Package",
              "Extensions prüfen, anpassen oder ersetzen",
              "Eigene Inhaltselemente für deine Redaktion",
            ],
          },
          {
            id: "upgrade",
            title: "Upgrades und Umzug",
            text: "Ich hebe deine Installation Schritt für Schritt auf eine aktuelle LTS-Version.",
            points: [
              "Upgrade auf TYPO3 v13 oder v14 LTS",
              "Extensions vorher prüfen",
              "Umzug auf einen neuen Server",
            ],
          },
        ],
        comparison: {
          title: "TYPO3-Versionen und ihr Support",
          intro:
            "Kurz gesagt: TYPO3 v12 bekommt seit Mai 2026 keine Community-Updates mehr. Unterstützt werden v13 LTS und v14 LTS.",
          columns: ["Version", "Stand", "Was das für dich heißt"],
          rows: [
            ["TYPO3 v11 LTS", "Community-Support endete im Oktober 2024", "Upgrade dringend einplanen"],
            ["TYPO3 v12 LTS", "Seit dem 1. Mai 2026 keine Community-Updates", "Upgrade planen oder übergangsweise kostenpflichtiges ELTS"],
            ["TYPO3 v13 LTS", "Sicherheitsupdates bis Ende 2027", "Unterstützt – nächster Schritt ist v14"],
            ["TYPO3 v14 LTS", "Sicherheitsupdates bis Juni 2029", "Aktuelle Version für neue Projekte"],
          ],
        },
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Deine Seite läuft auf einer unterstützten Version",
          "Sicherheitsupdates kommen wieder regelmäßig",
          "Ein Ansprechpartner, auch ohne die alte Agentur",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "ELTS und Premium-Extensions zahlst du direkt an den Anbieter.",
          "Sehr alte Extensions ersetze ich nach Absprache.",
          "Ich bin unabhängig und kein offizieller TYPO3-Partner.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schickst mir Link und TYPO3-Version",
          "Ich prüfe die Installation und nenne dir Weg und Aufwand",
          "Ich baue das Upgrade auf einer Kopie und teste es",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu TYPO3",
        faq: [
          {
            q: "Muss ich von TYPO3 v12 upgraden?",
            a: "Ja, möglichst bald: Seit dem 1. Mai 2026 gibt es keine Community-Updates mehr für v12. Kostenpflichtiges ELTS verschafft Zeit, ersetzt das Upgrade aber nicht.",
          },
          {
            q: "Funktionieren meine Extensions nach dem Upgrade noch?",
            a: "Das prüfe ich vorher für jede Extension. Was nicht mehr gepflegt wird, passe ich an oder ersetze es.",
          },
          {
            q: "Was kostet ein TYPO3-Upgrade?",
            a: "Das hängt von Version, Extensions und Templates ab. Nach der Prüfung nenne ich dir Aufwand oder Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Übernimmst du TYPO3-Seiten einer anderen Agentur?",
            a: "Ja. Ich verschaffe mir einen Überblick und kümmere mich dann um Fehler, Updates und Weiterentwicklung.",
          },
        ],
        ctaTitle: "Deine TYPO3-Seite braucht ein Update?",
        ctaText: "Schick mir Link und TYPO3-Version – ich sage dir, welcher Weg sinnvoll ist.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Upgrade, fix and maintain your TYPO3 website",
        summary:
          "I bring your TYPO3 website onto a supported version, fix errors and take over the upkeep – from Schwarzenbek near Hamburg.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. I look after TYPO3 websites: upgrades, fixing errors, templates and relaunches. Important: TYPO3 v12 has had *no community updates since 1 May 2026*.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "Your site still runs on TYPO3 v12 or older.",
          "An extension stopped working after an update.",
          "The agency that built the site no longer looks after it.",
        ],
        offersTitle: "What I take care of for your TYPO3 site",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing errors and maintenance",
            text: "I find errors and keep TYPO3 up to date with security updates.",
            points: [
              "Errors in backend or frontend",
              "Repairing extensions after updates",
              "A backup before every change",
            ],
          },
          {
            id: "relaunch",
            title: "New website or relaunch",
            text: "I rebuild your site – on current TYPO3, with a backend your editors can work with.",
            points: [
              "Reorganising the page tree and content",
              "Built for phones and screens",
              "Redirects for old addresses",
            ],
          },
          {
            id: "templates",
            title: "Templates and extensions",
            text: "I build templates in a site package of their own – separate from the TYPO3 core.",
            points: [
              "Fluid templates in a site package",
              "Checking, adapting or replacing extensions",
              "Custom content elements for your editors",
            ],
          },
          {
            id: "upgrade",
            title: "Upgrades and migrations",
            text: "I raise your installation step by step to a current LTS version.",
            points: [
              "Upgrading to TYPO3 v13 or v14 LTS",
              "Checking extensions first",
              "Moving to a new server",
            ],
          },
        ],
        comparison: {
          title: "TYPO3 versions and their support",
          intro:
            "In short: TYPO3 v12 has had no community updates since May 2026. v13 LTS and v14 LTS are supported.",
          columns: ["Version", "Status", "What it means for you"],
          rows: [
            ["TYPO3 v11 LTS", "Community support ended in October 2024", "Plan the upgrade urgently"],
            ["TYPO3 v12 LTS", "No community updates since 1 May 2026", "Plan the upgrade or use paid ELTS for now"],
            ["TYPO3 v13 LTS", "Security updates until the end of 2027", "Supported – the next step is v14"],
            ["TYPO3 v14 LTS", "Security updates until June 2029", "The current version for new projects"],
          ],
        },
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your site runs on a supported version",
          "Security updates arrive regularly again",
          "One point of contact, even without the old agency",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "ELTS and premium extensions go to the provider directly.",
          "I replace very old extensions after we agree.",
          "I work independently and am not an official TYPO3 partner.",
        ],
        processTitle: "How it works",
        process: [
          "You send me the link and the TYPO3 version",
          "I review the installation and tell you the way forward and the effort",
          "I build the upgrade on a copy and test it",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about TYPO3",
        faq: [
          {
            q: "Do I need to upgrade from TYPO3 v12?",
            a: "Yes, as soon as you can: there have been no community updates for v12 since 1 May 2026. Paid ELTS buys time but does not replace the upgrade.",
          },
          {
            q: "Will my extensions still work after the upgrade?",
            a: "I check every extension beforehand. Whatever is no longer maintained I adapt or replace.",
          },
          {
            q: "What does a TYPO3 upgrade cost?",
            a: "That depends on the version, extensions and templates. After the review I tell you the effort or a fixed price. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Do you take over TYPO3 sites from another agency?",
            a: "Yes. I get an overview first, then take care of errors, updates and further development.",
          },
        ],
        ctaTitle: "Does your TYPO3 site need an upgrade?",
        ctaText: "Send me the link and the TYPO3 version – I will tell you which way makes sense.",
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
          "Homepage-Baukasten oder WordPress bei STRATO? Ich helfe bei Aufbau, Fehlern und Design – und beim Umzug zu WordPress.",
        answer:
          "Tracht Digital Solutions ist Julian Tracht aus Schwarzenbek bei Hamburg. Ich helfe dir mit deiner Website bei STRATO – ob Homepage-Baukasten oder WordPress: bei Aufbau, Fehlern und Gestaltung und *beim Umzug zu WordPress*.",
        situationsTitle: "Kommt dir das bekannt vor?",
        situations: [
          "Der Homepage-Baukasten ist eingerichtet, aber die Seite wirkt nicht professionell.",
          "Deine WordPress-Seite bei STRATO zeigt Fehler oder lädt langsam.",
          "Der Baukasten kann nicht, was du brauchst.",
        ],
        offersTitle: "Das übernehme ich für deine Website",
        offers: [
          {
            id: "fehler-beheben",
            title: "Fehler beheben und Pflege",
            text: "Ich helfe bei Problemen mit Baukasten, WordPress und Einstellungen.",
            points: [
              "Menüs und Seitenstruktur im Baukasten",
              "Fehler und Updates bei WordPress",
              "Domain, SSL und E-Mail prüfen",
            ],
          },
          {
            id: "relaunch",
            title: "Neue Website oder Relaunch",
            text: "Ich baue deine Seite im Baukasten neu auf oder setze sie mit WordPress um.",
            points: [
              "Struktur und Inhalte ordnen",
              "Gestaltung passend zu deinem Betrieb",
              "Für Handy und Bildschirm",
            ],
          },
          {
            id: "vorlagen",
            title: "Vorlagen und Gestaltung",
            text: "Ich passe Vorlage, Farben, Schriften und Bilder an – bei WordPress mit einem Child-Theme.",
            points: [
              "Passende Vorlage auswählen",
              "Farben und Schriften nach deiner Marke",
              "Einheitliche Seiten statt Flickenteppich",
            ],
          },
          {
            id: "umzug",
            title: "Umzug zu WordPress",
            text: "Wenn der Baukasten an Grenzen stößt, ziehe ich deine Seite zu WordPress um.",
            points: [
              "Inhalte und Bilder übernehmen",
              "Domain und E-Mail mitnehmen",
              "Weiterleitungen für alte Adressen",
            ],
          },
        ],
        comparison: {
          title: "STRATO Homepage-Baukasten oder WordPress?",
          intro:
            "Kurz gesagt: Der Baukasten bringt Vorlagen und Technik fertig mit. WordPress bietet mehr Gestaltung und Funktionen, braucht aber Pflege.",
          columns: ["Kriterium", "Homepage-Baukasten", "WordPress, z. B. mit Hosting für WordPress"],
          rows: [
            ["Einstieg", "Vorlage wählen und Inhalte einfügen", "Theme, Plugins und Struktur einrichten"],
            ["Technik", "STRATO kümmert sich um die Technik", "Braucht Updates – Hosting für WordPress aktualisiert WordPress automatisch"],
            ["Gestaltung", "Vorlagen des Baukastens", "Viele Themes oder ein eigenes Design"],
            ["Shop", "Über den SmartWebshop", "Über Plugins, z. B. WooCommerce"],
            ["Passt, wenn", "du schnell eine übersichtliche Seite willst", "du mehr Gestaltung oder Funktionen brauchst"],
          ],
        },
        outcomesTitle: "Das erreichst du",
        outcomes: [
          "Deine Seite wirkt professionell",
          "Fehler sind behoben, und du weißt, woran es lag",
          "Ein Umzug zu WordPress, bei dem Domain und E-Mail mitkommen",
        ],
        boundariesTitle: "Was nicht dazugehört",
        boundaries: [
          "Verträge und Tarife bleiben bei STRATO.",
          "Nicht jede Baukasten-Funktion lässt sich eins zu eins nachbauen – das klären wir vorher.",
          "Ich bin unabhängig und kein Partner von STRATO.",
        ],
        processTitle: "So läuft es ab",
        process: [
          "Du schilderst, was du nutzt und was nicht klappt – ein Link genügt",
          "Ich schaue mir die Seite an und nenne dir Weg und Aufwand",
          "Vor einem Umzug sichere ich alle Inhalte",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu STRATO-Websites",
        faq: [
          {
            q: "Hilfst du auch beim STRATO Homepage-Baukasten?",
            a: "Ja. Ich richte Vorlage, Seiten und Einstellungen ein und zeige dir, wie du die Seite selbst pflegst.",
          },
          {
            q: "Wann lohnt sich der Wechsel vom Baukasten zu WordPress?",
            a: "Wenn du Funktionen, Gestaltung oder einen Shop brauchst, die der Baukasten nicht bietet. Sonst bleibt der Baukasten oft die einfachere Lösung.",
          },
          {
            q: "Kann meine Domain bei STRATO bleiben?",
            a: "Ja. Die Domain kann bei STRATO bleiben und auf die neue Seite zeigen – oder mit umziehen.",
          },
          {
            q: "Was kostet die Hilfe bei meiner STRATO-Website?",
            a: "Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren. Deinen Tarif zahlst du wie bisher an STRATO.",
          },
        ],
        ctaTitle: "Deine STRATO-Website soll mehr können?",
        ctaText: "Schreib mir, was du nutzt und was du vorhast – ein Link genügt.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Help with your STRATO website – from site builder to WordPress",
        summary:
          "Using the STRATO website builder or WordPress at STRATO? I help with setup, errors and design – and with moving to WordPress.",
        answer:
          "Tracht Digital Solutions is Julian Tracht, based in Schwarzenbek near Hamburg. I help you with your website at STRATO – whether you use the Homepage-Baukasten website builder or WordPress: with setup, errors and design, and *with moving to WordPress*.",
        situationsTitle: "Does this sound familiar?",
        situations: [
          "The website builder is set up, but the site does not look professional.",
          "Your WordPress site at STRATO shows errors or loads slowly.",
          "The builder cannot do what you need.",
        ],
        offersTitle: "What I take care of for your website",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing errors and upkeep",
            text: "I help with problems in the builder, in WordPress and with settings.",
            points: [
              "Menus and page structure in the builder",
              "WordPress errors and updates",
              "Checking domain, SSL and email",
            ],
          },
          {
            id: "relaunch",
            title: "New website or relaunch",
            text: "I rebuild your site in the builder or move it onto WordPress.",
            points: [
              "Ordering structure and content",
              "A design that suits your business",
              "Built for phones and screens",
            ],
          },
          {
            id: "templates",
            title: "Templates and design",
            text: "I adjust template, colours, fonts and images – on WordPress with a child theme.",
            points: [
              "Choosing a suitable template",
              "Colours and fonts to match your brand",
              "Consistent pages instead of a patchwork",
            ],
          },
          {
            id: "migration",
            title: "Moving to WordPress",
            text: "When the builder reaches its limits, I move your site to WordPress.",
            points: [
              "Carrying over content and images",
              "Taking domain and email along",
              "Redirects for old addresses",
            ],
          },
        ],
        comparison: {
          title: "STRATO website builder or WordPress?",
          intro:
            "In short: the builder comes with templates and technology ready to go. WordPress offers more design and features but needs upkeep.",
          columns: ["Criterion", "Homepage-Baukasten (website builder)", "WordPress, e.g. with WordPress hosting"],
          rows: [
            ["Getting started", "Pick a template and add content", "Set up theme, plugins and structure"],
            ["Technology", "STRATO takes care of the technology", "Needs updates – STRATO's WordPress hosting updates WordPress automatically"],
            ["Design", "The builder's templates", "Many themes or a design of your own"],
            ["Shop", "Via the SmartWebshop", "Via plugins, e.g. WooCommerce"],
            ["Fits if", "you want a clear site quickly", "you need more design or features"],
          ],
        },
        outcomesTitle: "What you achieve",
        outcomes: [
          "Your site looks professional",
          "Errors are fixed, and you know what caused them",
          "A move to WordPress in which domain and email come along",
        ],
        boundariesTitle: "What this does not cover",
        boundaries: [
          "Contracts and plans stay with STRATO.",
          "Not every builder feature can be rebuilt one to one – we clarify that first.",
          "I work independently and am not a STRATO partner.",
        ],
        processTitle: "How it works",
        process: [
          "You tell me what you use and what is not working – a link is enough",
          "I look at the site and tell you the way forward and the effort",
          "Before a move I back up all content",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about STRATO websites",
        faq: [
          {
            q: "Do you also help with the STRATO website builder?",
            a: "Yes. I set up template, pages and settings and show you how to maintain the site yourself.",
          },
          {
            q: "When is it worth moving from the builder to WordPress?",
            a: "When you need features, design or a shop the builder does not offer. Otherwise the builder is often the simpler option.",
          },
          {
            q: "Can my domain stay at STRATO?",
            a: "Yes. It can stay at STRATO and point to the new site – or move along.",
          },
          {
            q: "What does help with my STRATO website cost?",
            a: "Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment. Your STRATO plan stays billed by STRATO.",
          },
        ],
        ctaTitle: "Should your STRATO website do more?",
        ctaText: "Tell me what you use and what you have in mind – a link is enough.",
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
