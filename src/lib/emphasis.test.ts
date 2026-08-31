import { describe, expect, it } from "vitest";

import { splitEmphasis, stripEmphasis } from "./emphasis";

/**
 * The marker runs over copy an admin can rewrite in a plain text field, so
 * the failure that matters is not "does bold work" — it is what happens to
 * a sentence someone typed an asterisk into by accident.
 */
describe("splitEmphasis", () => {
  it("marks the run between a pair of asterisks", () => {
    expect(splitEmphasis("Ich plane und *setze um*.")).toEqual([
      { text: "Ich plane und ", strong: false },
      { text: "setze um", strong: true },
      { text: ".", strong: false },
    ]);
  });

  it("handles several runs in one sentence", () => {
    expect(splitEmphasis("*A* und *B*")).toEqual([
      { text: "A", strong: true },
      { text: " und ", strong: false },
      { text: "B", strong: true },
    ]);
  });

  it("leaves an unpaired asterisk in the text", () => {
    // The alternative — pairing greedily with whatever comes next — lets one
    // typo in the panel swallow the rest of the sentence into a <strong>.
    expect(splitEmphasis("5 * 3 Stunden")).toEqual([
      { text: "5 * 3 Stunden", strong: false },
    ]);
  });

  it("renders unmarked copy as a single plain segment", () => {
    // Every CMS override arrives like this; it is the common case, not an
    // edge case.
    expect(splitEmphasis("Ganz normaler Satz.")).toEqual([
      { text: "Ganz normaler Satz.", strong: false },
    ]);
  });

  it("always returns something to map over", () => {
    expect(splitEmphasis("")).toEqual([{ text: "", strong: false }]);
  });

  it("does not treat an empty pair as emphasis", () => {
    expect(splitEmphasis("Vor ** nach")).toEqual([
      { text: "Vor ** nach", strong: false },
    ]);
  });
});

describe("stripEmphasis", () => {
  it("gives the plain reading for alt text, titles and JSON-LD", () => {
    expect(stripEmphasis("Ich plane und *setze um*.")).toBe(
      "Ich plane und setze um.",
    );
  });

  it("leaves unmarked copy untouched", () => {
    expect(stripEmphasis("5 * 3 Stunden")).toBe("5 * 3 Stunden");
  });
});
