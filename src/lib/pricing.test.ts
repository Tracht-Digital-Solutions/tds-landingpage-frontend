import { describe, expect, it } from "vitest";
import {
  VAT_RATE,
  getDefaultPackages,
  getPricingDefault,
  grossPrice,
  validatePricePackages,
} from "./pricing";
import { pricingSchema } from "./jsonld";
import { serviceDefinitions } from "./services";

describe("pricing defaults", () => {
  it("publishes no hourly rate anywhere a service states its price", () => {
    // Decided 2026-09-22: fixed packages, everything else on request.
    for (const lang of ["de", "en"] as const) {
      for (const service of serviceDefinitions) {
        const prose = service.fallback[lang].priceText;
        expect(prose, `${service.id}/${lang}`).not.toMatch(/Stunde|hour|\/h\b|Std\./i);
      }
      const pricing = getPricingDefault(lang) as unknown as Record<string, unknown>;
      expect(Object.keys(pricing).some((key) => /^rate|hourSuffix/.test(key))).toBe(false);
    }
  });

  it("quotes the lowest package where the Webauftritt page names a figure", () => {
    // The one amount in a service's prose is the entry price of the packages;
    // a package change fails here until the sentence follows.
    for (const lang of ["de", "en"] as const) {
      const lowest = Math.min(...getDefaultPackages(lang).map((pkg) => pkg.price));
      const webPresence = serviceDefinitions.find((service) => service.id === "web-presence")!;
      expect(webPresence.fallback[lang].priceText).toContain(String(lowest));
    }
  });

  it("adds 19 % VAT for the gross view, to the cent", () => {
    expect(VAT_RATE).toBe(0.19);
    expect(getDefaultPackages("de").map((pkg) => grossPrice(pkg.price))).toEqual([464.1, 773.5, 1237.6]);
  });
});

/**
 * Fixed-price packages.
 *
 * Three committed packages since 2026-09-21. A panel list replaces them as a
 * whole when it validates;
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

  it("keeps the committed package figures and passes its own gate", () => {
    for (const lang of ["de", "en"] as const) {
      const packages = getDefaultPackages(lang);
      expect(packages.map((pkg) => pkg.price)).toEqual([390, 650, 1040]);
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
    const schema = pricingSchema([
      { name: "Website übernehmen", description: "…", price: 1900 },
    ]) as Record<string, any>;
    const offers = schema.hasOfferCatalog.itemListElement;
    expect(offers).toHaveLength(1);

    const fixed = offers[0].priceSpecification;
    expect(fixed["@type"]).toBe("PriceSpecification");
    expect(fixed.unitCode).toBeUndefined();
    expect(fixed.referenceQuantity).toBeUndefined();
    expect(fixed.price).toBe(1900);
    expect(fixed.valueAddedTaxIncluded).toBe(false);
    expect(JSON.stringify(schema)).not.toContain("HUR");
  });

  it("names the catalogue after what it holds", () => {
    const schema = pricingSchema([]) as Record<string, any>;
    expect(schema.hasOfferCatalog.name).toBe("Festpreise");
    expect(schema.hasOfferCatalog.itemListElement).toHaveLength(0);
  });
});
