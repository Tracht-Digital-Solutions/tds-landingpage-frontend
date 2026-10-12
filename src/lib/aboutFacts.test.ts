import { describe, expect, it } from "vitest";
import { aboutFacts, yearsSince } from "./aboutFacts";

describe("about facts", () => {
  it("computes the years of programming from 2018", () => {
    expect(yearsSince(2018, new Date("2026-10-12"))).toBe(8);
    expect(yearsSince(2018, new Date("2027-01-01"))).toBe(9);
  });

  it("states the years and self-employment in both languages", () => {
    const now = new Date("2026-10-12");
    expect(aboutFacts("de", now)).toEqual([
      { value: "8 Jahre", label: "Programmiererfahrung seit 2018" },
      { value: "Seit 2024", label: "selbstständig mit Tracht Digital Solutions" },
    ]);
    expect(aboutFacts("en", now).map((fact) => fact.value)).toEqual(["8 years", "Since 2024"]);
  });
});
