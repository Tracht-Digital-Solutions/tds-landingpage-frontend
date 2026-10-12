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
 * - No direct address (since 2026-10-12; "du" before), like the rest of the
 *   site: the copy is about Tracht Digital Solutions and the work; no free and
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
 * to read right in this site's neutral voice.
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
    text: "Vor Beginn steht ein Festpreis oder ein eigenes Angebot. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
  },
  en: {
    title: "What does it cost?",
    text: "Work starts only after a fixed price or a quote of its own. Costs only arise once we agree on an assignment.",
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
      "Kurz gesagt: WooCommerce erweitert WordPress, Shopware 6 ist ein eigenständiges Shopsystem. Entscheidend sind die vorhandene Website und das Sortiment.",
    columns: ["Kriterium", "WooCommerce", "Shopware 6"],
    rows: [
      ["Grundlage", "Plugin für WordPress", "Eigenständiges Shopsystem"],
      ["Website und Shop", "Ein System mit der WordPress-Seite", "Inhalte über Erlebniswelten im Shop"],
      ["Gestaltung", "WordPress-Themes, anpassbar per Child-Theme", "Themes auf Basis von Storefront"],
      ["Lizenz", "Open Source", "Community Edition als Open Source, dazu kostenpflichtige Pläne"],
      ["Passt, wenn", "WordPress schon im Einsatz ist", "der Shop das Herzstück ist, mit vielen Artikeln oder Kanälen"],
    ],
  },
  en: {
    title: "WooCommerce or Shopware 6?",
    intro:
      "In short: WooCommerce extends WordPress, Shopware 6 is a standalone shop system. What matters most is the existing website and the catalogue.",
    columns: ["Criterion", "WooCommerce", "Shopware 6"],
    rows: [
      ["Basis", "WordPress plugin", "Standalone shop system"],
      ["Website and shop", "One system with the WordPress site", "Content via Shopping Experiences in the shop"],
      ["Design", "WordPress themes, customisable with a child theme", "Themes based on Storefront"],
      ["Licence", "Open source", "Community Edition as open source, plus paid plans"],
      ["Fits if", "WordPress is already in use", "the shop is the core, with many products or channels"],
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
      en: "WooCommerce: Shop Builds, Themes and Fixes — Tracht Digital",
    },
    updatedAt: "2026-10-12",
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
          "Tracht Digital Solutions baut WooCommerce-Shops, behebt Fehler und passt Themes update-sicher an – aus Schwarzenbek bei Hamburg.",
        answer:
          "Tracht Digital Solutions ist das Unternehmen von Julian Tracht aus Schwarzenbek bei Hamburg. Für WooCommerce richtet es Shops ein, behebt Fehler und passt Themes so an, dass Updates möglich bleiben – mit *einem festen Ansprechpartner*.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Nach einem Update zeigt der Shop eine weiße Seite oder einen kritischen Fehler.",
          "Kunden brechen im Checkout ab, weil Zahlung oder Versand nicht funktionieren.",
          "Der Shop lädt langsam, und niemand weiß, warum.",
        ],
        offersTitle: "Leistungsumfang",
        offers: [
          {
            id: "fehler-beheben",
            title: "WooCommerce-Fehler beheben",
            text: "Gesucht wird die Ursache, statt nur das Symptom zu überdecken.",
            points: [
              "Weiße Seite oder kritischer Fehler nach Updates",
              "Probleme in Warenkorb, Checkout oder Zahlung",
              "Plugin-Konflikte und langsame Ladezeiten",
            ],
          },
          {
            id: "shop-erstellen",
            title: "WooCommerce-Shop erstellen",
            text: "Einrichtung des Shops auf WordPress – bereit für den deutschen Markt.",
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
              "Design passend zur Marke",
              "Produktseiten, Kategorien und Warenkorb",
              "Für Handy und kurze Ladezeiten",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.de,
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Der Shop läuft wieder – mit klarer Ursache",
          "Kunden kommen ohne Hürden durch den Checkout",
          "Das Design übersteht das nächste Update",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "Rechtstexte liefert eine Kanzlei oder ein Rechtstexte-Dienst – eingebaut werden sie hier.",
          "Gebühren und Premium-Plugins werden direkt an den Anbieter gezahlt.",
          "Tracht Digital Solutions arbeitet unabhängig und ist kein offizieller Partner von WooCommerce oder Automattic.",
        ],
        processTitle: "Vorgehen",
        process: [
          "Kurze Beschreibung des Problems – gern mit Link",
          "Prüfung des Shops mit Ursache und Aufwand",
          "Änderungen werden auf einer Kopie getestet, dann gehen sie live",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu WooCommerce",
        faq: [
          {
            q: "Wer behebt Fehler in einem WooCommerce-Shop?",
            a: "Tracht Digital Solutions findet die Ursache – meist ein Plugin, ein Update oder das Theme – und behebt sie.",
          },
          {
            q: "Was kostet ein WooCommerce-Shop?",
            a: "Das hängt von Produkten, Zahlungsarten und Design ab. Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Bleiben Anpassungen bei Theme-Updates erhalten?",
            a: "Ja, wenn sie in einem Child-Theme stehen. Genau so werden sie eingebaut.",
          },
          {
            q: "Für wen ist WooCommerce das richtige Shopsystem?",
            a: "Für Betriebe, die schon WordPress nutzen. Bei großen Sortimenten lohnt der Vergleich mit Shopware 6.",
          },
        ],
        ctaTitle: "Der Shop braucht Hilfe?",
        ctaText: "Eine kurze Nachricht, was nicht läuft, genügt – gern mit Link.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Building, fixing and customising WooCommerce shops",
        summary:
          "Tracht Digital Solutions builds WooCommerce shops, fixes errors and customises themes in an update-safe way – from Schwarzenbek near Hamburg.",
        answer:
          "Tracht Digital Solutions is the company of Julian Tracht, based in Schwarzenbek near Hamburg. For WooCommerce it sets up shops, fixes errors and customises themes so that updates stay possible – with *one steady point of contact*.",
        situationsTitle: "Typical situations",
        situations: [
          "After an update the shop shows a white page or a critical error.",
          "Customers abandon checkout because payment or shipping does not work.",
          "The shop loads slowly, and nobody knows why.",
        ],
        offersTitle: "Scope of services",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing WooCommerce errors",
            text: "The cause is tracked down instead of covering up the symptom.",
            points: [
              "White page or critical error after updates",
              "Problems in cart, checkout or payment",
              "Plugin conflicts and slow loading times",
            ],
          },
          {
            id: "build-shop",
            title: "Building a WooCommerce shop",
            text: "Setting up the shop on WordPress – ready for the German market.",
            points: [
              "Setting up WordPress and WooCommerce",
              "Adding or importing products",
              "Payment, shipping and legal essentials, e.g. with Germanized",
            ],
          },
          {
            id: "theme",
            title: "Customising the WooCommerce theme",
            text: "Changes go into a child theme – so updates stay possible.",
            points: [
              "A design that fits the brand",
              "Product pages, categories and cart",
              "Built for phones and short loading times",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.en,
        outcomesTitle: "Results",
        outcomes: [
          "The shop works again – with a clear cause",
          "Customers get through checkout without obstacles",
          "The design survives the next update",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "Legal texts come from a law firm or a legal text service – they are put in place here.",
          "Fees and premium plugins go to the provider directly.",
          "Tracht Digital Solutions works independently and is not an official partner of WooCommerce or Automattic.",
        ],
        processTitle: "Approach",
        process: [
          "A short description of the problem – a link helps",
          "A review of the shop with cause and effort",
          "Changes are tested on a copy, then they go live",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about WooCommerce",
        faq: [
          {
            q: "Who fixes errors in a WooCommerce shop?",
            a: "Tracht Digital Solutions finds the cause – usually a plugin, an update or the theme – and fixes it.",
          },
          {
            q: "What does a WooCommerce shop cost?",
            a: "That depends on products, payment methods and design. Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Do customisations survive theme updates?",
            a: "Yes, if they live in a child theme. That is how they are built.",
          },
          {
            q: "Who is WooCommerce the right shop system for?",
            a: "For businesses that already use WordPress. With a large catalogue it is worth comparing Shopware 6.",
          },
        ],
        ctaTitle: "Shop needs help?",
        ctaText: "A short note on what is not working is enough – a link helps.",
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
    updatedAt: "2026-10-12",
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
          "Tracht Digital Solutions richtet Shopware-6-Shops ein, behebt Fehler nach Updates und baut Themes – auch beim Umstieg von Shopware 5.",
        answer:
          "Tracht Digital Solutions ist das Unternehmen von Julian Tracht aus Schwarzenbek bei Hamburg. Für Shopware 6 richtet es Shops ein, behebt Fehler und baut Themes. Es begleitet auch den Umstieg von Shopware 5, dessen Sicherheitsupdates *am 31. Juli 2024 endeten*.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Nach einem Update lädt die Storefront oder die Administration nicht mehr richtig.",
          "Eine Erweiterung verträgt sich nicht mit der neuen Version.",
          "Der Shop läuft noch auf Shopware 5 – ohne Sicherheitsupdates.",
        ],
        offersTitle: "Leistungsumfang",
        offers: [
          {
            id: "fehler-beheben",
            title: "Shopware-6-Fehler beheben",
            text: "Fehler werden systematisch eingegrenzt und an der Ursache behoben.",
            points: [
              "Fehler nach Updates",
              "Konflikte zwischen Erweiterungen",
              "Probleme bei Checkout, Zahlung oder Versand",
            ],
          },
          {
            id: "shop-erstellen",
            title: "Shopware-6-Shop erstellen",
            text: "Einrichtung eines neuen Shops – oder der Umzug von Shopware 5.",
            points: [
              "Einrichtung und Verkaufskanäle",
              "Produkte anlegen oder importieren",
              "Umstieg mit dem Migrationsassistenten",
            ],
          },
          {
            id: "theme",
            title: "Shopware-6-Theme anpassen",
            text: "Das Theme baut auf Storefront auf. So bleiben Updates möglich.",
            points: [
              "Eigenes Theme statt Änderungen am Kern",
              "Farben, Schriften und Layout nach der Marke",
              "Erlebniswelten für Startseite und Aktionen",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.de,
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Der Shop läuft auf einer unterstützten Version",
          "Updates sind wieder planbar",
          "Das Design passt zur Marke und übersteht Updates",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "Lizenzen für Shopware-Pläne und Erweiterungen werden direkt an den Anbieter gezahlt.",
          "Beim Umstieg von Shopware 5 ziehen die Daten um, Theme und Erweiterungen entstehen neu.",
          "Tracht Digital Solutions arbeitet unabhängig und ist kein offizieller Shopware-Partner.",
        ],
        processTitle: "Vorgehen",
        process: [
          "Kurze Beschreibung des Problems – mit Shop-Version, falls bekannt",
          "Prüfung des Shops mit Ursache und Aufwand",
          "Updates werden auf einer Kopie getestet, dann gehen sie live",
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
            q: "Wer behebt Fehler nach einem Shopware-Update?",
            a: "Tracht Digital Solutions findet heraus, ob Update, Erweiterung oder Theme den Fehler auslöst, und behebt die Ursache.",
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
        ctaTitle: "Der Shopware-Shop braucht Hilfe?",
        ctaText: "Eine kurze Nachricht, was nicht läuft, genügt – gern mit Shop-Version und Link.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Building, fixing and customising Shopware 6 shops",
        summary:
          "Tracht Digital Solutions sets up Shopware 6 shops, fixes errors after updates and builds themes – including the move from Shopware 5.",
        answer:
          "Tracht Digital Solutions is the company of Julian Tracht, based in Schwarzenbek near Hamburg. For Shopware 6 it sets up shops, fixes errors and builds themes. It also handles the move from Shopware 5, whose security updates *ended on 31 July 2024*.",
        situationsTitle: "Typical situations",
        situations: [
          "After an update the storefront or the administration no longer loads properly.",
          "An extension does not work with the new version.",
          "The shop still runs on Shopware 5 – without security updates.",
        ],
        offersTitle: "Scope of services",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing Shopware 6 errors",
            text: "Errors are narrowed down systematically and fixed at the cause.",
            points: [
              "Errors after updates",
              "Conflicts between extensions",
              "Problems with checkout, payment or shipping",
            ],
          },
          {
            id: "build-shop",
            title: "Building a Shopware 6 shop",
            text: "Setting up a new shop – or moving it over from Shopware 5.",
            points: [
              "Setup and sales channels",
              "Adding or importing products",
              "Moving with the migration assistant",
            ],
          },
          {
            id: "theme",
            title: "Customising the Shopware 6 theme",
            text: "The theme builds on Storefront. That keeps updates possible.",
            points: [
              "A dedicated theme instead of changes to the core",
              "Colours, fonts and layout to match the brand",
              "Shopping Experiences for the home page and promotions",
            ],
          },
        ],
        comparison: SHOP_COMPARISON.en,
        outcomesTitle: "Results",
        outcomes: [
          "The shop runs on a supported version",
          "Updates are plannable again",
          "The design fits the brand and survives updates",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "Licences for Shopware plans and extensions go to the provider directly.",
          "Moving from Shopware 5 carries the data across; theme and extensions are rebuilt.",
          "Tracht Digital Solutions works independently and is not an official Shopware partner.",
        ],
        processTitle: "Approach",
        process: [
          "A short description of the problem – with the shop version if known",
          "A review of the shop with cause and effort",
          "Updates are tested on a copy, then they go live",
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
            q: "Who fixes errors after a Shopware update?",
            a: "Tracht Digital Solutions finds out whether the update, an extension or the theme triggers the error and fixes the cause.",
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
        ctaTitle: "Shopware shop needs help?",
        ctaText: "A short note on what is not working is enough – shop version and a link help.",
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
    updatedAt: "2026-10-12",
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
          "Tracht Digital Solutions baut WordPress-Websites, behebt Fehler, passt Themes an und übernimmt Updates und Pflege – aus Schwarzenbek bei Hamburg.",
        answer:
          "Tracht Digital Solutions ist das Unternehmen von Julian Tracht aus Schwarzenbek bei Hamburg. Es betreut WordPress-Websites: Fehler beheben, Updates, neue Seiten, Themes und Umzüge. WordPress läuft laut W3Techs auf *40,3 % aller Websites* (September 2026).",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Statt der Website erscheint eine weiße Seite oder ein kritischer Fehler.",
          "Updates stehen seit Monaten aus, weil danach etwas kaputtgehen könnte.",
          "Die Seite ist veraltet, langsam oder auf dem Handy schwer zu bedienen.",
        ],
        offersTitle: "Leistungsumfang",
        offers: [
          {
            id: "fehler-beheben",
            title: "Fehler beheben und Wartung",
            text: "Die Ursache wird gefunden, die Seite danach aktuell gehalten.",
            points: [
              "Weiße Seite oder Fehler nach Updates",
              "Updates von WordPress, Themes und Plugins",
              "Sicherung vor jedem Eingriff",
            ],
          },
          {
            id: "relaunch",
            title: "Neue Website oder Relaunch",
            text: "Neubau oder Überarbeitung der Seite – mit klarer Struktur.",
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
              "Eigenes Theme nach eigenem Design",
            ],
          },
          {
            id: "umzug",
            title: "Umzug und Upgrades",
            text: "Umzug der Seite – mit Domain, E-Mail und Weiterleitungen.",
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
            "Kurz gesagt: Block-Themes werden direkt im Website-Editor bearbeitet, klassische Themes über PHP-Vorlagen und den Customizer.",
          columns: ["Kriterium", "Block-Theme", "Klassisches Theme"],
          rows: [
            ["Aufbau", "Vorlagen aus Blöcken, Einstellungen in der theme.json", "PHP-Vorlagen, Einstellungen im Customizer"],
            ["Bearbeiten", "Kopf, Fuß und Vorlagen im Website-Editor", "Vieles nur im Code oder in Theme-Optionen"],
            ["Update-sicher anpassen", "Eigene Styles und Vorlagen, bei Bedarf Child-Theme", "Child-Theme"],
            ["Passt, wenn", "Layout und Inhalte selbst angepasst werden sollen", "eine bestehende Seite stabil weiterlaufen soll"],
          ],
        },
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Die Seite läuft wieder – und bleibt aktuell",
          "Updates mit Sicherung vorher",
          "Eine Seite, die auf dem Handy funktioniert",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "Texte, Bilder und Rechtstexte kommen vom Kunden.",
          "Hosting, Domain und Premium-Plugins werden direkt an den Anbieter gezahlt.",
          "Tracht Digital Solutions arbeitet unabhängig und ist nicht mit WordPress.org oder Automattic verbunden.",
        ],
        processTitle: "Vorgehen",
        process: [
          "Kurze Beschreibung des Problems – ein Link genügt",
          "Prüfung der Seite mit Ursache und Aufwand",
          "Vor jedem Eingriff entsteht eine Sicherung",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu WordPress",
        faq: [
          {
            q: "Eine WordPress-Seite zeigt einen kritischen Fehler – was tun?",
            a: "Meist steckt ein Plugin, das Theme oder ein Update dahinter. Tracht Digital Solutions findet die Ursache und bringt die Seite wieder zum Laufen.",
          },
          {
            q: "Wer übernimmt Updates und Wartung für WordPress?",
            a: "Tracht Digital Solutions hält WordPress, Themes und Plugins aktuell und sichert vorher – nach Bedarf oder als Monatsmodell.",
          },
          {
            q: "Was kostet eine WordPress-Website?",
            a: "Das hängt von Umfang und Funktionen ab. Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Lässt sich eine Seite vom Baukasten zu WordPress umziehen?",
            a: "Ja. Inhalte und Bilder werden übernommen, Weiterleitungen sorgen dafür, dass alte Links funktionieren.",
          },
        ],
        ctaTitle: "Die WordPress-Seite braucht Hilfe?",
        ctaText: "Eine kurze Nachricht, was nicht läuft, genügt – ein Link reicht.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Building, fixing and maintaining WordPress websites",
        summary:
          "Tracht Digital Solutions builds WordPress websites, fixes errors, customises themes and takes care of updates and upkeep – from Schwarzenbek near Hamburg.",
        answer:
          "Tracht Digital Solutions is the company of Julian Tracht, based in Schwarzenbek near Hamburg. It looks after WordPress websites: fixing errors, updates, new sites, themes and migrations. According to W3Techs, WordPress runs *40.3% of all websites* (September 2026).",
        situationsTitle: "Typical situations",
        situations: [
          "Instead of the website there is a white page or a critical error.",
          "Updates have been waiting for months because something might break.",
          "The site is outdated, slow or hard to use on a phone.",
        ],
        offersTitle: "Scope of services",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing errors and maintenance",
            text: "The cause is found, and the site is kept up to date afterwards.",
            points: [
              "White page or errors after updates",
              "Updates of WordPress, themes and plugins",
              "A backup before every change",
            ],
          },
          {
            id: "relaunch",
            title: "New website or relaunch",
            text: "Rebuilding or reworking the site – with a clear structure.",
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
              "A dedicated theme, built to a custom design",
            ],
          },
          {
            id: "migration",
            title: "Migrations and upgrades",
            text: "Moving the site – with domain, email and redirects.",
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
            ["Update-safe changes", "Custom styles and templates, a child theme if needed", "Child theme"],
            ["Fits if", "layout and content should be adjusted in-house", "an existing site should keep running reliably"],
          ],
        },
        outcomesTitle: "Results",
        outcomes: [
          "The site works again – and stays up to date",
          "Updates with a backup first",
          "A site that works on phones",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "Copy, images and legal texts come from the client.",
          "Hosting, domain and premium plugins go to the provider directly.",
          "Tracht Digital Solutions works independently and is not affiliated with WordPress.org or Automattic.",
        ],
        processTitle: "Approach",
        process: [
          "A short description of the problem – a link is enough",
          "A review of the site with cause and effort",
          "A backup before every change",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about WordPress",
        faq: [
          {
            q: "A WordPress site shows a critical error – what now?",
            a: "Usually a plugin, the theme or an update is behind it. Tracht Digital Solutions finds the cause and gets the site running again.",
          },
          {
            q: "Who takes care of WordPress updates and maintenance?",
            a: "Tracht Digital Solutions keeps WordPress, themes and plugins up to date and backs up first – as needed or as a monthly arrangement.",
          },
          {
            q: "What does a WordPress website cost?",
            a: "That depends on scope and features. Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Can a site move from a site builder to WordPress?",
            a: "Yes. Content and images are carried over, and redirects keep old links working.",
          },
        ],
        ctaTitle: "WordPress site needs help?",
        ctaText: "A short note on what is not working is enough – a link will do.",
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
    updatedAt: "2026-10-12",
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
          "Tracht Digital Solutions bringt TYPO3-Websites auf eine unterstützte Version, behebt Fehler und übernimmt die Pflege – aus Schwarzenbek bei Hamburg.",
        answer:
          "Tracht Digital Solutions ist das Unternehmen von Julian Tracht aus Schwarzenbek bei Hamburg. Es betreut TYPO3-Websites: Upgrades, Fehlerbehebung, Templates und Relaunches. Wichtig: TYPO3 v12 bekommt *seit dem 1. Mai 2026 keine Community-Updates mehr*.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Die Seite läuft noch auf TYPO3 v12 oder älter.",
          "Nach einem Update funktioniert eine Extension nicht mehr.",
          "Die Agentur, die die Seite gebaut hat, betreut sie nicht mehr.",
        ],
        offersTitle: "Leistungsumfang",
        offers: [
          {
            id: "fehler-beheben",
            title: "Fehler beheben und Wartung",
            text: "Fehler werden gefunden, TYPO3 bleibt mit Sicherheitsupdates aktuell.",
            points: [
              "Fehler im Backend oder Frontend",
              "Extensions nach Updates reparieren",
              "Sicherung vor jedem Eingriff",
            ],
          },
          {
            id: "relaunch",
            title: "Neue Website oder Relaunch",
            text: "Die Seite wird neu aufgesetzt – mit aktuellem TYPO3 und einem Backend, das die Redaktion gut bedienen kann.",
            points: [
              "Seitenbaum und Inhalte neu ordnen",
              "Für Handy und Bildschirm",
              "Weiterleitungen für alte Adressen",
            ],
          },
          {
            id: "templates",
            title: "Templates und Extensions",
            text: "Templates entstehen in einem eigenen Site-Package – getrennt vom TYPO3-Kern.",
            points: [
              "Fluid-Templates im Site-Package",
              "Extensions prüfen, anpassen oder ersetzen",
              "Eigene Inhaltselemente für die Redaktion",
            ],
          },
          {
            id: "upgrade",
            title: "Upgrades und Umzug",
            text: "Die Installation wird Schritt für Schritt auf eine aktuelle LTS-Version gehoben.",
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
          columns: ["Version", "Stand", "Was das bedeutet"],
          rows: [
            ["TYPO3 v11 LTS", "Community-Support endete im Oktober 2024", "Upgrade dringend einplanen"],
            ["TYPO3 v12 LTS", "Seit dem 1. Mai 2026 keine Community-Updates", "Upgrade planen oder übergangsweise kostenpflichtiges ELTS"],
            ["TYPO3 v13 LTS", "Sicherheitsupdates bis Ende 2027", "Unterstützt – nächster Schritt ist v14"],
            ["TYPO3 v14 LTS", "Sicherheitsupdates bis Juni 2029", "Aktuelle Version für neue Projekte"],
          ],
        },
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Die Seite läuft auf einer unterstützten Version",
          "Sicherheitsupdates kommen wieder regelmäßig",
          "Ein Ansprechpartner, auch ohne die alte Agentur",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "ELTS und Premium-Extensions werden direkt an den Anbieter gezahlt.",
          "Sehr alte Extensions werden nach Absprache ersetzt.",
          "Tracht Digital Solutions arbeitet unabhängig und ist kein offizieller TYPO3-Partner.",
        ],
        processTitle: "Vorgehen",
        process: [
          "Link und TYPO3-Version genügen für den Start",
          "Prüfung der Installation mit Weg und Aufwand",
          "Das Upgrade entsteht auf einer Kopie und wird getestet",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu TYPO3",
        faq: [
          {
            q: "Muss eine Seite von TYPO3 v12 upgraden?",
            a: "Ja, möglichst bald: Seit dem 1. Mai 2026 gibt es keine Community-Updates mehr für v12. Kostenpflichtiges ELTS verschafft Zeit, ersetzt das Upgrade aber nicht.",
          },
          {
            q: "Funktionieren Extensions nach dem Upgrade noch?",
            a: "Das wird vorher für jede Extension geprüft. Was nicht mehr gepflegt wird, wird angepasst oder ersetzt.",
          },
          {
            q: "Was kostet ein TYPO3-Upgrade?",
            a: "Das hängt von Version, Extensions und Templates ab. Nach der Prüfung stehen Aufwand oder Festpreis fest. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
          },
          {
            q: "Übernimmt Tracht Digital Solutions TYPO3-Seiten einer anderen Agentur?",
            a: "Ja. Nach einem Überblick über die Installation geht es um Fehler, Updates und Weiterentwicklung.",
          },
        ],
        ctaTitle: "Die TYPO3-Seite braucht ein Update?",
        ctaText: "Link und TYPO3-Version genügen – danach ist klar, welcher Weg sinnvoll ist.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Upgrading, fixing and maintaining TYPO3 websites",
        summary:
          "Tracht Digital Solutions brings TYPO3 websites onto a supported version, fixes errors and takes over the upkeep – from Schwarzenbek near Hamburg.",
        answer:
          "Tracht Digital Solutions is the company of Julian Tracht, based in Schwarzenbek near Hamburg. It looks after TYPO3 websites: upgrades, fixing errors, templates and relaunches. Important: TYPO3 v12 has had *no community updates since 1 May 2026*.",
        situationsTitle: "Typical situations",
        situations: [
          "The site still runs on TYPO3 v12 or older.",
          "An extension stopped working after an update.",
          "The agency that built the site no longer looks after it.",
        ],
        offersTitle: "Scope of services",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing errors and maintenance",
            text: "Errors are found, and TYPO3 stays current with security updates.",
            points: [
              "Errors in backend or frontend",
              "Repairing extensions after updates",
              "A backup before every change",
            ],
          },
          {
            id: "relaunch",
            title: "New website or relaunch",
            text: "The site is rebuilt – on current TYPO3, with a backend the editors can work with.",
            points: [
              "Reorganising the page tree and content",
              "Built for phones and screens",
              "Redirects for old addresses",
            ],
          },
          {
            id: "templates",
            title: "Templates and extensions",
            text: "Templates live in a site package of their own – separate from the TYPO3 core.",
            points: [
              "Fluid templates in a site package",
              "Checking, adapting or replacing extensions",
              "Custom content elements for the editors",
            ],
          },
          {
            id: "upgrade",
            title: "Upgrades and migrations",
            text: "The installation is raised step by step to a current LTS version.",
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
          columns: ["Version", "Status", "What it means"],
          rows: [
            ["TYPO3 v11 LTS", "Community support ended in October 2024", "Plan the upgrade urgently"],
            ["TYPO3 v12 LTS", "No community updates since 1 May 2026", "Plan the upgrade or use paid ELTS for now"],
            ["TYPO3 v13 LTS", "Security updates until the end of 2027", "Supported – the next step is v14"],
            ["TYPO3 v14 LTS", "Security updates until June 2029", "The current version for new projects"],
          ],
        },
        outcomesTitle: "Results",
        outcomes: [
          "The site runs on a supported version",
          "Security updates arrive regularly again",
          "One point of contact, even without the old agency",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "ELTS and premium extensions go to the provider directly.",
          "Very old extensions are replaced by agreement.",
          "Tracht Digital Solutions works independently and is not an official TYPO3 partner.",
        ],
        processTitle: "Approach",
        process: [
          "The link and the TYPO3 version are enough to start",
          "A review of the installation with the way forward and the effort",
          "The upgrade is built on a copy and tested",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about TYPO3",
        faq: [
          {
            q: "Does a site need to upgrade from TYPO3 v12?",
            a: "Yes, as soon as possible: there have been no community updates for v12 since 1 May 2026. Paid ELTS buys time but does not replace the upgrade.",
          },
          {
            q: "Do extensions still work after the upgrade?",
            a: "Every extension is checked beforehand. Whatever is no longer maintained is adapted or replaced.",
          },
          {
            q: "What does a TYPO3 upgrade cost?",
            a: "That depends on the version, extensions and templates. After the review the effort or a fixed price is clear. Costs only arise once we agree on an assignment.",
          },
          {
            q: "Does Tracht Digital Solutions take over TYPO3 sites from another agency?",
            a: "Yes. After an overview of the installation, the work covers errors, updates and further development.",
          },
        ],
        ctaTitle: "TYPO3 site needs an upgrade?",
        ctaText: "The link and the TYPO3 version are enough – then it is clear which way makes sense.",
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
    updatedAt: "2026-10-12",
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
        title: "Hilfe für STRATO-Websites – vom Baukasten bis WordPress",
        summary:
          "Homepage-Baukasten oder WordPress bei STRATO? Tracht Digital Solutions hilft bei Aufbau, Fehlern und Design – und beim Umzug zu WordPress.",
        answer:
          "Tracht Digital Solutions ist das Unternehmen von Julian Tracht aus Schwarzenbek bei Hamburg. Es hilft bei Websites auf STRATO – ob Homepage-Baukasten oder WordPress: bei Aufbau, Fehlern und Gestaltung und *beim Umzug zu WordPress*.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Der Homepage-Baukasten ist eingerichtet, aber die Seite wirkt nicht professionell.",
          "Die WordPress-Seite bei STRATO zeigt Fehler oder lädt langsam.",
          "Der Baukasten kann nicht, was gebraucht wird.",
        ],
        offersTitle: "Leistungsumfang",
        offers: [
          {
            id: "fehler-beheben",
            title: "Fehler beheben und Pflege",
            text: "Hilfe bei Problemen mit Baukasten, WordPress und Einstellungen.",
            points: [
              "Menüs und Seitenstruktur im Baukasten",
              "Fehler und Updates bei WordPress",
              "Domain, SSL und E-Mail prüfen",
            ],
          },
          {
            id: "relaunch",
            title: "Neue Website oder Relaunch",
            text: "Die Seite wird im Baukasten neu aufgebaut oder mit WordPress umgesetzt.",
            points: [
              "Struktur und Inhalte ordnen",
              "Gestaltung passend zum Betrieb",
              "Für Handy und Bildschirm",
            ],
          },
          {
            id: "vorlagen",
            title: "Vorlagen und Gestaltung",
            text: "Vorlage, Farben, Schriften und Bilder werden angepasst – bei WordPress mit einem Child-Theme.",
            points: [
              "Passende Vorlage auswählen",
              "Farben und Schriften nach der Marke",
              "Einheitliche Seiten statt Flickenteppich",
            ],
          },
          {
            id: "umzug",
            title: "Umzug zu WordPress",
            text: "Stößt der Baukasten an Grenzen, zieht die Seite zu WordPress um.",
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
            ["Passt, wenn", "schnell eine übersichtliche Seite gebraucht wird", "mehr Gestaltung oder Funktionen gebraucht werden"],
          ],
        },
        outcomesTitle: "Ergebnis",
        outcomes: [
          "Die Seite wirkt professionell",
          "Fehler sind behoben – mit klarer Ursache",
          "Ein Umzug zu WordPress, bei dem Domain und E-Mail mitkommen",
        ],
        boundariesTitle: "Nicht enthalten",
        boundaries: [
          "Verträge und Tarife bleiben bei STRATO.",
          "Nicht jede Baukasten-Funktion lässt sich eins zu eins nachbauen – das wird vorher geklärt.",
          "Tracht Digital Solutions arbeitet unabhängig und ist kein Partner von STRATO.",
        ],
        processTitle: "Vorgehen",
        process: [
          "Kurze Beschreibung, was genutzt wird und was nicht klappt – ein Link genügt",
          "Prüfung der Seite mit Weg und Aufwand",
          "Vor einem Umzug werden alle Inhalte gesichert",
        ],
        costTitle: COST.de.title,
        costText: COST.de.text,
        referencesHeadline: REFERENCES.de.headline,
        referencesLabel: REFERENCES.de.label,
        faqTitle: "Häufige Fragen zu STRATO-Websites",
        faq: [
          {
            q: "Hilft Tracht Digital Solutions auch beim STRATO Homepage-Baukasten?",
            a: "Ja. Vorlage, Seiten und Einstellungen werden eingerichtet, dazu gibt es eine Einweisung in die eigene Pflege.",
          },
          {
            q: "Wann lohnt sich der Wechsel vom Baukasten zu WordPress?",
            a: "Wenn Funktionen, Gestaltung oder ein Shop gebraucht werden, die der Baukasten nicht bietet. Sonst bleibt der Baukasten oft die einfachere Lösung.",
          },
          {
            q: "Kann die Domain bei STRATO bleiben?",
            a: "Ja. Die Domain kann bei STRATO bleiben und auf die neue Seite zeigen – oder mit umziehen.",
          },
          {
            q: "Was kostet die Hilfe bei einer STRATO-Website?",
            a: "Abgerechnet wird nach Aufwand oder zum Festpreis. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren. Der STRATO-Tarif läuft wie bisher direkt über STRATO.",
          },
        ],
        ctaTitle: "Die STRATO-Website soll mehr können?",
        ctaText: "Eine kurze Nachricht zu System und Vorhaben genügt – ein Link reicht.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "Web presence",
        title: "Help with STRATO websites – from site builder to WordPress",
        summary:
          "STRATO website builder or WordPress at STRATO? Tracht Digital Solutions helps with setup, errors and design – and with moving to WordPress.",
        answer:
          "Tracht Digital Solutions is the company of Julian Tracht, based in Schwarzenbek near Hamburg. It helps with websites at STRATO – on the Homepage-Baukasten website builder or WordPress: with setup, errors and design, and *with moving to WordPress*.",
        situationsTitle: "Typical situations",
        situations: [
          "The website builder is set up, but the site does not look professional.",
          "The WordPress site at STRATO shows errors or loads slowly.",
          "The builder cannot do what is needed.",
        ],
        offersTitle: "Scope of services",
        offers: [
          {
            id: "fix-errors",
            title: "Fixing errors and upkeep",
            text: "Help with problems in the builder, in WordPress and with settings.",
            points: [
              "Menus and page structure in the builder",
              "WordPress errors and updates",
              "Checking domain, SSL and email",
            ],
          },
          {
            id: "relaunch",
            title: "New website or relaunch",
            text: "The site is rebuilt in the builder or moved onto WordPress.",
            points: [
              "Ordering structure and content",
              "A design that suits the business",
              "Built for phones and screens",
            ],
          },
          {
            id: "templates",
            title: "Templates and design",
            text: "Template, colours, fonts and images are adjusted – on WordPress with a child theme.",
            points: [
              "Choosing a suitable template",
              "Colours and fonts to match the brand",
              "Consistent pages instead of a patchwork",
            ],
          },
          {
            id: "migration",
            title: "Moving to WordPress",
            text: "When the builder reaches its limits, the site moves to WordPress.",
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
            ["Design", "The builder's templates", "Many themes or a custom design"],
            ["Shop", "Via the SmartWebshop", "Via plugins, e.g. WooCommerce"],
            ["Fits if", "a clear site is needed quickly", "more design or features are needed"],
          ],
        },
        outcomesTitle: "Results",
        outcomes: [
          "The site looks professional",
          "Errors are fixed – with a clear cause",
          "A move to WordPress in which domain and email come along",
        ],
        boundariesTitle: "Not included",
        boundaries: [
          "Contracts and plans stay with STRATO.",
          "Not every builder feature can be rebuilt one to one – that is clarified first.",
          "Tracht Digital Solutions works independently and is not a STRATO partner.",
        ],
        processTitle: "Approach",
        process: [
          "A short note on what is used and what is not working – a link is enough",
          "A review of the site with the way forward and the effort",
          "All content is backed up before a move",
        ],
        costTitle: COST.en.title,
        costText: COST.en.text,
        referencesHeadline: REFERENCES.en.headline,
        referencesLabel: REFERENCES.en.label,
        faqTitle: "Common questions about STRATO websites",
        faq: [
          {
            q: "Does Tracht Digital Solutions also help with the STRATO website builder?",
            a: "Yes. Template, pages and settings are set up, together with a walkthrough for in-house upkeep.",
          },
          {
            q: "When is it worth moving from the builder to WordPress?",
            a: "When features, design or a shop are needed that the builder does not offer. Otherwise the builder is often the simpler option.",
          },
          {
            q: "Can the domain stay at STRATO?",
            a: "Yes. It can stay at STRATO and point to the new site – or move along.",
          },
          {
            q: "What does help with a STRATO website cost?",
            a: "Work is billed by effort or at a fixed price. Costs only arise once we agree on an assignment. The STRATO plan stays billed by STRATO.",
          },
        ],
        ctaTitle: "STRATO website should do more?",
        ctaText: "A short note on the system and the plan is enough – a link will do.",
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
