import { describe, expect, it } from "vitest";
import {
  SAVINGS_DEFAULTS,
  formatSavings,
  getSavingsCopy,
  savings,
  savingsDraft,
} from "./savingsCalculator";

describe("time-savings calculator", () => {
  it("multiplies only the entered figures over 46 working weeks", () => {
    const result = savings(SAVINGS_DEFAULTS);
    expect(Math.round(result.year)).toBe(134);
    expect(formatSavings(result.month, "de")).toBe("11,2");
    expect(formatSavings(result.days, "en")).toBe("16.8");
  });

  it("clamps impossible input instead of inventing a figure", () => {
    expect(savings({ minutes: -5, perWeek: 10, share: 50 }).year).toBe(0);
    expect(savings({ minutes: Number.NaN, perWeek: 10, share: 50 }).year).toBe(0);
    expect(savings({ minutes: 10, perWeek: 10, share: 500 }).year).toBe((10 * 10 * 46) / 60);
  });

  it("formats whole hours from 100 upwards", () => {
    expect(formatSavings(1234.5, "de")).toBe("1.235");
    expect(formatSavings(1234.5, "en")).toBe("1,235");
  });

  it("fills the contact draft with the visitor's figures", () => {
    const draft = savingsDraft(getSavingsCopy("de").draft, SAVINGS_DEFAULTS, "de");
    expect(draft).toContain("10 Minuten pro Vorgang");
    expect(draft).toContain("134 Stunden pro Jahr");
    expect(draft).not.toMatch(/\{\w+\}/);
  });

  it("labels the defaults as examples and makes no promise in both languages", () => {
    for (const lang of ["de", "en"] as const) {
      const copy = getSavingsCopy(lang);
      expect(copy.examples).toMatch(lang === "de" ? /Beispielwerte/ : /example values/);
      expect(copy.note).toMatch(lang === "de" ? /keine Zusage/ : /not a promise/);
      expect(copy.benefits).toHaveLength(3);
    }
  });
});
