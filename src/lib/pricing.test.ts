import { describe, expect, it } from "vitest";
import { getPricingDefault, getServiceRate } from "./pricing";
import { serviceDefinitions } from "./services";

describe("pricing defaults", () => {
  it("keeps the agreed net hourly rates in both languages", () => {
    for (const lang of ["de", "en"] as const) {
      const pricing = getPricingDefault(lang);
      expect(
        serviceDefinitions.map((service) =>
          getServiceRate(pricing, service.id),
        ),
      ).toEqual([75, 70, 70, 65]);
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
