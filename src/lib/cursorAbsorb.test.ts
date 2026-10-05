import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { absorbStep } from "./cursorAbsorb";

const css = readFileSync(resolve(process.cwd(), "src/styles/global.css"), "utf8");

describe("the cursor disappearing into action controls (2026-10-05)", () => {
  it("hides the native pointer on the whole page while the drawn cursor runs", () => {
    expect(css).toMatch(/html\[data-cursor-absorb\] \*,[\s\S]*?cursor: none !important;/);
  });

  it("swallows the cursor and lets it pop back out past its size", () => {
    let value = 0;
    let velocity = 0;
    for (let i = 0; i < 60; i += 1) [value, velocity] = absorbStep(value, velocity, 1, 1 / 60);
    expect(value).toBeCloseTo(1, 2);
    let lowest = value;
    for (let i = 0; i < 60; i += 1) {
      [value, velocity] = absorbStep(value, velocity, 0, 1 / 60);
      lowest = Math.min(lowest, value);
    }
    // Below 0 on the way out = the cursor larger than its size for a moment.
    expect(lowest).toBeLessThan(0);
    expect(value).toBeCloseTo(0, 2);
  });
});
