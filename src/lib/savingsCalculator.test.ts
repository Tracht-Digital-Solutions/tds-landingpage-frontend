import { describe, expect, it } from "vitest";
import {
  SAVINGS_QUESTIONS,
  answerLabel,
  formatSavings,
  getSavingsCopy,
  savings,
  savingsDraft,
} from "./savingsCalculator";

describe("time-savings questionnaire", () => {
  it("asks three questions with fixed answers in both languages", () => {
    expect(SAVINGS_QUESTIONS).toHaveLength(3);
    for (const question of SAVINGS_QUESTIONS) {
      expect(question.answers.length).toBeGreaterThanOrEqual(3);
      for (const answer of question.answers) {
        expect(answer.label.de).not.toBe("");
        expect(answer.label.en).not.toBe("");
      }
    }
  });

  it("multiplies the answers' values over 46 working weeks", () => {
    const result = savings({ minutes: 10, perWeek: 20, share: 50 });
    expect(Math.round(result.year)).toBe(77);
    expect(formatSavings(result.days, "de")).toBe("9,6");
  });

  it("clamps impossible input instead of inventing a figure", () => {
    expect(savings({ minutes: -5, perWeek: 10, share: 50 }).year).toBe(0);
    expect(savings({ minutes: Number.NaN, perWeek: 10, share: 50 }).year).toBe(0);
  });

  it("puts the chosen answers, not raw numbers, into the contact draft", () => {
    const input = { minutes: 10, perWeek: 20, share: 50 };
    const draft = savingsDraft(getSavingsCopy("de").draft, input, "de");
    expect(draft).toContain(answerLabel("perWeek", 20, "de"));
    expect(draft).toContain("Mehrmals täglich");
    expect(draft).toContain("77 Stunden pro Jahr");
    expect(draft).not.toMatch(/\{\w+\}/);
  });

  it("calls the result an estimate and makes no promise in both languages", () => {
    expect(getSavingsCopy("de").note).toMatch(/Schätzung.*keine Zusage/);
    expect(getSavingsCopy("en").note).toMatch(/estimate.*not a promise/);
  });

  it("counts down the missing answers and names the hand-off in both languages", () => {
    for (const lang of ["de", "en"] as const) {
      const copy = getSavingsCopy(lang);
      for (const text of [copy.pendingOne, copy.pendingTwo, copy.ctaReady, copy.handoff]) {
        expect(text).not.toBe("");
        expect(text).not.toMatch(/\d/);
      }
      expect(copy.ctaReady).not.toBe(copy.cta);
    }
    expect(getSavingsCopy("de").handoff).toMatch(/Kontaktformular/);
    expect(getSavingsCopy("en").handoff).toMatch(/contact form/);
  });
});
