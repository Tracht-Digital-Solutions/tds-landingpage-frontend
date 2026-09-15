import { describe, expect, it } from "vitest";
import { platformDefinitions } from "./platforms";
import {
  getServiceById,
  getServiceBySlug,
  serviceDefinitions,
  serviceHref,
  validateServiceReferences,
} from "./services";

describe("service catalog", () => {
  it("pins the four services in the agreed display order", () => {
    // Webauftritt first since 2026-09-15 — the site leads with websites and
    // shops. Only the order moved: ids, CMS keys and slugs are unchanged, so
    // no URL and no saved panel block changed with it.
    expect(serviceDefinitions.map((service) => service.id)).toEqual([
      "web-presence",
      "consulting",
      "process",
      "solutions",
    ]);
    expect(serviceDefinitions.map((service) => service.cmsKey)).toEqual([
      "service_web_presence",
      "service_consulting",
      "service_process",
      "service_solutions",
    ]);
  });

  it("keeps the display numbers a contiguous sequence", () => {
    // `number` is pure ordering — it is never rendered, and since the mosaic
    // replaced the per-card decoration it no longer keys anything visual
    // either. It is pinned because it is the order the overview, the pricing
    // grid and the sitemap all iterate in, and a gap or a duplicate here is
    // invisible until two services swap places on one surface but not another.
    const numbers = serviceDefinitions.map((service) => service.number);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(numbers).toEqual(["01", "02", "03", "04"]);
  });

  it("keeps ids, CMS keys and localized slugs unique", () => {
    const values = [
      serviceDefinitions.map((service) => service.id),
      serviceDefinitions.map((service) => service.cmsKey),
      serviceDefinitions.map((service) => service.slug.de),
      serviceDefinitions.map((service) => service.slug.en),
    ];

    for (const candidates of values) {
      expect(new Set(candidates).size).toBe(serviceDefinitions.length);
    }
  });

  it("resolves only the slug committed for the requested language", () => {
    const consulting = getServiceById("consulting");

    expect(serviceHref(consulting, "de")).toBe(
      "/leistungen/beratung-konzeption",
    );
    expect(serviceHref(consulting, "en")).toBe(
      "/en/services/consulting-planning",
    );
    expect(getServiceBySlug("de", "beratung-konzeption")?.id).toBe(
      "consulting",
    );
    expect(getServiceBySlug("en", "consulting-planning")?.id).toBe(
      "consulting",
    );
    expect(getServiceBySlug("en", "beratung-konzeption")).toBeUndefined();
  });
});

/**
 * The `<title>` and the "Stand" date are code-owned, like ids and slugs.
 *
 * The title is what a search result shows, so it names what people search for
 * first and the brand last; the platform pages follow the same pattern, and a
 * title shared by two indexable pages makes them compete with each other. The
 * date is printed on the page AND repeated as `dateModified` in its JSON-LD —
 * a malformed or future date would be a claim the page cannot back up.
 */
describe("service titles and dates", () => {
  const TITLE_MAX = 65;

  for (const lang of ["de", "en"] as const) {
    it(`gives every ${lang} service a short title with the brand at the end`, () => {
      for (const service of serviceDefinitions) {
        const title = service.seoTitle[lang];
        expect(title.length, `${service.id} (${lang}): ${title}`).toBeLessThanOrEqual(TITLE_MAX);
        expect(title, `${service.id} (${lang})`).toMatch(/\S — Tracht Digital$/);
        expect(title.trim(), `${service.id} (${lang})`).toBe(title);
      }
    });

    it(`keeps every ${lang} title distinct across service and platform pages`, () => {
      const titles = [
        ...serviceDefinitions.map((service) => service.seoTitle[lang]),
        ...platformDefinitions.map((platform) => platform.seoTitle[lang]),
      ];
      expect(new Set(titles).size).toBe(titles.length);
    });
  }

  it("dates every service with a real day that is not in the future", () => {
    for (const service of serviceDefinitions) {
      expect(service.updatedAt, service.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const date = new Date(`${service.updatedAt}T00:00:00Z`);
      // Round-tripping rejects days that do not exist, like 2026-02-30.
      expect(date.toISOString().slice(0, 10), service.id).toBe(service.updatedAt);
      expect(date.getTime(), service.id).toBeLessThanOrEqual(Date.now());
    }
  });
});

/**
 * The summary carries two loads.
 *
 * It is the card text on the home page AND the `<meta name="description">`
 * of the service detail page, which is indexable and listed in the sitemap.
 * `seo.test.ts` budgets every description it can read off a page file, but
 * these are resolved at render time, so they would otherwise be the only
 * indexable descriptions on the site with no length guard at all.
 *
 * This pins the COMMITTED defaults. A CMS override can still shorten a
 * summary below the useful minimum — that is a redaktional risk noted in
 * AGENTS.md, not something a unit test can reach.
 */
describe("service summaries double as meta descriptions", () => {
  const RENDERED = 160;
  const MIN_USEFUL = 80;

  for (const lang of ["de", "en"] as const) {
    it(`keeps every ${lang} summary inside the description budget`, () => {
      for (const service of serviceDefinitions) {
        const summary = service.fallback[lang].summary;
        expect(summary.length, `${service.id} (${lang}) is too long`).toBeLessThanOrEqual(RENDERED);
        expect(summary.length, `${service.id} (${lang}) is too short`).toBeGreaterThan(MIN_USEFUL);
        expect(summary.trim(), `${service.id} (${lang}) has stray whitespace`).toBe(summary);
        expect(summary, `${service.id} (${lang}) has doubled spaces`).not.toMatch(/\s{2,}/);
      }
    });

    it(`gives each ${lang} service a distinct summary`, () => {
      // Duplicate descriptions across indexable pages are a self-inflicted
      // ranking problem; near-identical service pages would be exactly that.
      const summaries = serviceDefinitions.map((service) => service.fallback[lang].summary);
      expect(new Set(summaries).size).toBe(summaries.length);
    });
  }
});

/**
 * The card chips and the optional background image.
 *
 * Both are code-owned — never CMS-sourced — for the same reason ids and
 * slugs are: the overview card, the pricing card and the detail hero all
 * read them, and a blank or malformed value there is a hole in the layout
 * rather than a missing sentence. Nothing else guards them, because the
 * components take whatever the catalog hands over.
 */
describe("service keywords", () => {
  for (const lang of ["de", "en"] as const) {
    it(`gives every service two to four ${lang} keywords`, () => {
      for (const service of serviceDefinitions) {
        const keywords = service.keywords[lang];
        // Two is the floor at which a chip row reads as a list; above four
        // the card's chip row wraps to three lines on a phone.
        expect(keywords.length, `${service.id} (${lang})`).toBeGreaterThanOrEqual(2);
        expect(keywords.length, `${service.id} (${lang})`).toBeLessThanOrEqual(4);
        for (const keyword of keywords) {
          expect(keyword.trim(), `${service.id} (${lang}) has stray whitespace`).toBe(keyword);
          expect(keyword.length, `"${keyword}" is empty`).toBeGreaterThan(0);
          // A chip is not a sentence. This is the exact regression that
          // motivated the field: the chips used to be
          // `responsibilities.slice(0, 3)`, i.e. full sentences in a pill.
          expect(keyword.length, `"${keyword}" reads as a sentence`).toBeLessThanOrEqual(24);
          expect(keyword, `"${keyword}" ends in a full stop`).not.toMatch(/[.!?]$/);
        }
        expect(new Set(keywords).size, `${service.id} (${lang}) repeats a keyword`).toBe(
          keywords.length,
        );
      }
    });
  }
});

describe("service background images", () => {
  it("is either absent or a path the site actually serves", () => {
    for (const service of serviceDefinitions) {
      if (service.image === null) continue;
      // `public/` is served verbatim from the site root, so anything that
      // is not a site-absolute path under this folder is a 404 in a
      // decorative <img> — invisible in review, visible on the page.
      expect(service.image, service.id).toMatch(
        /^\/images\/services\/[a-z0-9-]+\.(webp|avif|png|jpg)$/,
      );
    }
  });
});

describe("validateServiceReferences", () => {
  const complete = {
    title: "Anonymised project",
    context: "Small business",
    challenge: "A documented starting point",
    solution: "A documented approach",
    result: "A documented outcome",
  };

  it("accepts multiple complete references and an optional metric", () => {
    expect(
      validateServiceReferences([
        complete,
        { ...complete, title: "Second project", metric: "20%" },
      ]),
    ).toEqual([
      { ...complete, metric: "" },
      { ...complete, title: "Second project", metric: "20%" },
    ]);
  });

  it("keeps an absent or empty collection invisible", () => {
    expect(validateServiceReferences(undefined)).toEqual([]);
    expect(validateServiceReferences([])).toEqual([]);
  });

  it("rejects the entire list when one item is incomplete or malformed", () => {
    expect(
      validateServiceReferences([complete, { ...complete, result: "" }]),
    ).toEqual([]);
    expect(
      validateServiceReferences([{ ...complete, metric: 42 }]),
    ).toEqual([]);
  });

  it("never copies a destination the CMS supplied", () => {
    // The enforcement point for "editable copy, never an editable
    // destination". It works because the validator rebuilds each item from a
    // fixed field list rather than spreading the candidate — which is easy to
    // undo with a well-meaning `...candidate`, and nothing else would notice.
    // `toEqual` fails on the extra keys, so this is a real assertion.
    expect(
      validateServiceReferences([
        {
          ...complete,
          articleUrl: "https://example.invalid/a",
          siteUrl: "https://example.invalid/b",
        },
      ]),
    ).toEqual([{ ...complete, metric: "" }]);
  });
});
