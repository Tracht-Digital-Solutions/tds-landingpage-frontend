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
      ).toEqual([120, 110, 110, 105, 95, undefined]);
    }
  });

  it("never invents a numeric price for Complete IT", () => {
    const pricing = getPricingDefault("de");
    expect(getServiceRate(pricing, "complete-it")).toBeUndefined();
    expect(pricing.customRateLabel).toMatch(/Monatsangebot/);
  });
});
