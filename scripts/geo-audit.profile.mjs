/**
 * This site's profile for `tds-geo-audit` (the search and answer-engine
 * audit tds-shared ships since 0.59). The checks are shared; what a page here
 * must declare, refuse or close is decided below.
 *
 *   npm run audit:geo -- http://127.0.0.1:4321
 */
export default {
  /** The origin the markup names in canonicals, alternates and the sitemap. */
  site: "https://tracht-digital.de",
  defaultBase: "http://localhost:4321",
  sitemapIndexPath: "/sitemap-index.xml",
  langs: ["de", "en"],
  titleMax: 65,
  descriptionRange: [80, 160],
  minWords: 300,

  /**
   * robots.txt must name every one of these and keep `requiredDisallow`
   * closed in each group. Blocking a search or fetch agent removes the site
   * from that engine's answers without producing any error, so the list is a
   * contract, not a preference. Tier A are answer engines, tier B retired
   * names kept so an old crawler reads the same rules, tier C newer answer
   * surfaces. Dataset-only crawlers (CCBot, Bytespider, Amazonbot, …) are
   * deliberately absent: they have no answer surface for this audience and
   * every added group has to repeat the whole Disallow set.
   */
  agents: [
    "*",
    // A — OpenAI, Anthropic, Perplexity, Google, Apple
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    // B — retired names
    "Claude-Web",
    "anthropic-ai",
    // C — Meta AI, DuckDuckGo, Mistral
    "meta-externalagent",
    "meta-externalfetcher",
    "DuckAssistBot",
    "MistralAI-User",
  ],
  /** Every indexable page here has a real twin by construction. */
  hreflangRequired: true,

  requiredDisallow: ["/install/", "/tds/"],

  /**
   * `@id` values a reference may point at although no node on the page
   * declares them.
   *
   * Organization, Person and WebSite live on the HOME page and every subpage
   * references them by `@id` — that is the rule in AGENTS.md, and it is also
   * how the four public properties share one organisation and one person
   * across four origins. Without these three listed, every subpage would
   * report three warnings per run, and warnings nobody can act on are warnings
   * nobody reads.
   */
  entityAnchors: [
    "https://tracht-digital.de/#organization",
    "https://tracht-digital.de/#person",
    "https://tracht-digital.de/#website",
  ],

  /**
   * Types and properties this site has decided against. Each one was a
   * considered refusal, and prose in AGENTS.md does not stop a future graph
   * from reintroducing it.
   */
  forbiddenTypes: ["SearchAction", "HowTo", "Review", "AggregateRating"],
  forbiddenProps: ["openingHoursSpecification", "aggregateRating", "review"],

  /** "echt" and "wirklich" never appear on the site (decided 2026-09-21). */
  bannedWords: /\b(echt|wirklich)[a-zäöüß]*/i,

  llmsBudgetBytes: 8 * 1024,

  /** Paths the audit must not request. Empty here; the shop's click redirect lives in its copy. */
  skipPaths: [],

  /**
   * Which structured data a page of this kind has to carry, and whether it
   * must name a date. `detail` additionally gets the lead/byline/source
   * checks, which are specific to this site's service and platform pages.
   */
  pageKind(path) {
    if (path === "/" || path === "/en/") {
      return { kind: "home", requiredTypes: ["Organization", "Person", "WebSite", "WebPage", "FAQPage"] };
    }
    if (/^\/(leistungen|en\/services)\/[^/]+$/.test(path)) {
      return {
        kind: "detail",
        requiredTypes: ["WebPage", "Service", "BreadcrumbList"],
        requireDate: true,
        detailChecks: true,
      };
    }
    if (path === "/fragen" || path === "/en/questions") {
      return { kind: "questions", requiredTypes: ["WebPage", "FAQPage", "BreadcrumbList"], requireDate: true };
    }
    if (path === "/qualifikationen" || path === "/en/qualifications") {
      return { kind: "credentials", requiredTypes: ["WebPage", "Person", "BreadcrumbList"], requireDate: true };
    }
    if (path === "/visitenkarte" || path === "/en/business-card") {
      // `ProfilePage` IS a `WebPage`; a second one beside it would describe the
      // same thing twice. No `BreadcrumbList` and no date on purpose: the card
      // is `bare` — it carries no site chrome and no breadcrumb a reader could
      // see, and a contact card's freshness is its vCard, not a "Stand" line.
      // Structured data that claims either would say more than the page.
      return { kind: "card", requiredTypes: ["ProfilePage", "Person"] };
    }
    return { kind: "other", requiredTypes: [] };
  },

  /** Checks this site runs on top of the universal set. */
  extraCheckIds: ["detail.lead", "detail.byline", "detail.table-source"],
};
