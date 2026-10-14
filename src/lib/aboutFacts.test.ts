import { describe, expect, it } from "vitest";
import { aboutFacts, yearsSince } from "./aboutFacts";

describe("about facts", () => {
  it("computes the years of programming from 2018", () => {
    expect(yearsSince(2018, new Date("2026-10-12"))).toBe(8);
    expect(yearsSince(2018, new Date("2027-01-01"))).toBe(9);
  });

  it("shows a one-word heading and a figure", () => {
    const now = new Date("2026-10-12");
    const de = aboutFacts("de", now);
    expect(de.map((fact) => fact.label)).toEqual(["Programmiererfahrung", "Selbstständig"]);
    for (const fact of [...de, ...aboutFacts("en", now)]) expect(fact.label).not.toMatch(/\s/);
    expect(de.map((fact) => `${fact.prefix}${fact.value}${fact.unit}`)).toEqual(["+8 Jahre", "2024"]);
    expect(de[1]!.sr).toBe("Selbstständig seit 2024");
  });

  it("counts the founding year up from the year programming began", () => {
    const [years, founded] = aboutFacts("de", new Date("2026-10-12"));
    expect(years!.from).toBe(0);
    expect(founded!.from).toBe(2018);
  });
});
