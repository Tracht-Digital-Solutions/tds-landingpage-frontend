import { describe, expect, it } from "vitest";
import { getProcessContent } from "./processContent";

describe("the process steps", () => {
  it.each(["de", "en"] as const)("say what happens without 'und' or 'and' (%s)", (lang) => {
    for (const step of getProcessContent(lang).steps) {
      const text = [step.title, step.duration, step.outcome, ...step.actions].join(" ");
      expect(text).not.toMatch(/\b(und|and)\b|&/i);
    }
  });

  it("keep the same four steps in both languages", () => {
    const numbers = (lang: "de" | "en") => getProcessContent(lang).steps.map((step) => step.number);
    expect(numbers("en")).toEqual(numbers("de"));
    expect(numbers("de")).toHaveLength(4);
  });
});
