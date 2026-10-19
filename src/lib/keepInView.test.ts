import { describe, expect, it } from "vitest";
import { revealDelta } from "./keepInView";

describe("keeping an opened part on screen", () => {
  it("leaves a part that already fits where it is", () => {
    expect(revealDelta(200, 500, 80, 700)).toBe(0);
  });

  it("scrolls down just far enough to show the part's foot", () => {
    expect(revealDelta(400, 900, 80, 700)).toBe(200);
  });

  it("keeps the title on screen when the part is taller than the view", () => {
    expect(revealDelta(300, 1400, 80, 700)).toBe(220);
  });

  it("scrolls up when the title slid under the header", () => {
    expect(revealDelta(20, 300, 80, 700)).toBe(-60);
  });
});
