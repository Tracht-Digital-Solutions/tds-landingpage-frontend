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
      ).toEqual([110, 100, 100, 85]);
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
