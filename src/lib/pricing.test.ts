import { describe, expect, it } from "vitest";
import {
  PACKAGE_HOURS,
  getDefaultPackages,
  getPricingDefault,
  getServiceRate,
  validatePricePackages,
} from "./pricing";
import { pricingSchema } from "./jsonld";
import { serviceDefinitions } from "./services";

describe("pricing defaults", () => {
  it("keeps the agreed net hourly rates in both languages", () => {
    for (const lang of ["de", "en"] as const) {
      const pricing = getPricingDefault(lang);
      // Catalogue order since 2026-09-15: Webauftritt, Beratung & Konzeption,
      // Prozessoptimierung, Individuelle Lösungen.
      expect(
        serviceDefinitions.map((service) =>
          getServiceRate(pricing, service.id),
        ),
      ).toEqual([65, 75, 70, 70]);
    }
  });

  /**
   * The number in a service's own prose IS the number in the rate map.
   *
   * Two places state each price: `pricing.rate*`, which drives the pricing
   * table and the `Offer` in the structured data, and the service's
   * `priceText`, which is the sentence a visitor actually reads on that
   * service's page. They were changed together when the rates moved toward the
   * 65 € entry, and nothing but this test stops the next change touching only
   * one of them.
   *
   * A drift here is the worst kind: both numbers look deliberate, neither
   * errors, and the page quotes one price while the table beside it and the
   * search result above it quote another.
   */
  it("states the same rate in prose as in the rate map", () => {
    for (const lang of ["de", "en"] as const) {
      const pricing = getPricingDefault(lang);
      for (const service of serviceDefinitions) {
        const rate = getServiceRate(pricing, service.id);
        const prose = service.fallback[lang].priceText;
        expect(prose, `${service.id}/${lang} names no rate`).toMatch(/\d/);
        expect(
          prose.includes(String(rate)),
          `${service.id}/${lang}: prose "${prose.slice(0, 40)}…" vs rate ${rate}`,
        ).toBe(true);
      }
    }
  });

  it("quotes every service it lists", () => {
    // Complete IT used to be the one service without a rate, and the pricing
    // JSON-LD skipped it so no invented price could reach a search result.
    // It is gone, so the guard now runs the other way: a service that reaches
    // the pricing grid without a number would render an empty card.
    const pricing = getPricingDefault("de");
    for (const service of serviceDefinitions) {
      expect(getServiceRate(pricing, service.id), service.id).toBeGreaterThan(0);
    }
  });
});

/**
 * Fixed-price packages.
 *
 * Three committed packages since 2026-09-21, each priced as hours × the
 * Webauftritt rate. A panel list replaces them as a whole when it validates;
 * `validatePricePackages` checks that raw field.
 */
describe("validatePricePackages", () => {
  const complete = {
    title: "Website übernehmen",
    price: 1900,
    description: "Bestand prüfen, Fehler beheben, Technik aktualisieren.",
    includes: ["Bestandsaufnahme", "Fehlerbehebung"],
  };

  it("accepts a complete package", () => {
    expect(validatePricePackages([complete])).toEqual([complete]);
  });

  it("treats nothing, an empty list and a non-list as no packages", () => {
    expect(validatePricePackages(undefined)).toEqual([]);
    expect(validatePricePackages([])).toEqual([]);
    expect(validatePricePackages("Website übernehmen")).toEqual([]);
  });

  it("rejects the whole list when one item is unfinished", () => {
    // Matching cmsFor()'s own list behaviour: dropping the bad item silently
    // changes the editor's ordering and hides the mistake.
    expect(validatePricePackages([complete, { ...complete, title: "  " }])).toEqual([]);
    expect(validatePricePackages([complete, { ...complete, price: 0 }])).toEqual([]);
    expect(validatePricePackages([complete, { ...complete, price: "1900" }])).toEqual([]);
  });

  it("refuses a price of zero rather than showing 0 €", () => {
    // An unfinished package is not a free one, and "0 €" beside a real figure
    // is worse than showing neither.
    expect(validatePricePackages([{ ...complete, price: 0 }])).toEqual([]);
    expect(validatePricePackages([{ ...complete, price: -100 }])).toEqual([]);
  });

  it("allows a package without a bullet list", () => {
    const { includes: _drop, ...noList } = complete;
    expect(validatePricePackages([noList])).toEqual([{ ...noList, includes: [] }]);
  });

  it("prices every committed package as hours × the Webauftritt rate", () => {
    // Decided 2026-09-21: a package is the same work billed by the hour, never
    // a cheaper or dearer figure. A rate change fails here until they follow.
    for (const lang of ["de", "en"] as const) {
      const rate = getPricingDefault(lang).rateWebPresence;
      const packages = getDefaultPackages(lang);
      expect(packages.map((pkg) => pkg.price)).toEqual(PACKAGE_HOURS.map((h) => h * rate));
      // The committed list has to pass the same gate as a panel list.
      expect(validatePricePackages(packages)).toEqual(packages);
    }
  });

  it("keeps both languages in step: same count, same figures", () => {
    const de = getDefaultPackages("de");
    const en = getDefaultPackages("en");
    expect(en.map((p) => p.price)).toEqual(de.map((p) => p.price));
    for (const pkg of [...de, ...en]) {
      expect(pkg.includes.length, pkg.title).toBeLessThanOrEqual(3);
      expect(pkg.description.length, pkg.title).toBeGreaterThan(0);
    }
  });
});

describe("fixed prices in structured data", () => {
  it("never marks a package total as an hourly rate", () => {
    // `UnitPriceSpecification` with unitCode HUR states "this many euros per
    // HOUR". A four-figure package total published that way would read as an
    // hourly rate to every consumer that parses the markup instead of the page.
    const schema = pricingSchema(
      [{ name: "Webauftritt", description: "…", rate: 65 }],
      [{ name: "Website übernehmen", description: "…", price: 1900 }],
    ) as Record<string, any>;
    const offers = schema.hasOfferCatalog.itemListElement;
    expect(offers).toHaveLength(2);

    const hourly = offers[0].priceSpecification;
    expect(hourly["@type"]).toBe("UnitPriceSpecification");
    expect(hourly.unitCode).toBe("HUR");

    const fixed = offers[1].priceSpecification;
    expect(fixed["@type"]).toBe("PriceSpecification");
    expect(fixed.unitCode).toBeUndefined();
    expect(fixed.referenceQuantity).toBeUndefined();
    expect(fixed.price).toBe(1900);
    expect(fixed.valueAddedTaxIncluded).toBe(false);
  });

  it("adds nothing to the catalogue when there are no packages", () => {
    const schema = pricingSchema([
      { name: "Webauftritt", description: "…", rate: 65 },
    ]) as Record<string, any>;
    expect(schema.hasOfferCatalog.itemListElement).toHaveLength(1);
  });
});
