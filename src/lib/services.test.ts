import { describe, expect, it } from "vitest";
import {
  getServiceBySlug,
  serviceDefinitions,
  serviceHref,
  validateServiceReferences,
} from "./services";

describe("service catalog", () => {
  it("pins the six services in the agreed display order", () => {
    expect(serviceDefinitions.map((service) => service.id)).toEqual([
      "consulting",
      "process",
      "solutions",
      "custom-development",
      "web-presence",
      "complete-it",
    ]);
    expect(serviceDefinitions.map((service) => service.cmsKey)).toEqual([
      "service_consulting",
      "service_process",
      "service_solutions",
      "service_custom_development",
      "service_web_presence",
      "service_complete_it",
    ]);
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
    const consulting = serviceDefinitions[0];

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
      // ranking problem; six near-identical service pages would be exactly that.
      const summaries = serviceDefinitions.map((service) => service.fallback[lang].summary);
      expect(new Set(summaries).size).toBe(summaries.length);
    });
  }
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
});
