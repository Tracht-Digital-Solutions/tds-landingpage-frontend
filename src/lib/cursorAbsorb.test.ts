import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { CURSOR_ON_DARK, CURSOR_ON_LIGHT, tintForFill } from "./cursorAbsorb";

const css = readFileSync(resolve(process.cwd(), "src/styles/global.css"), "utf8");

describe("the drawn cursor over controls (2026-10-05)", () => {
  it("hides the native pointer on the whole page while the drawn cursor runs", () => {
    expect(css).toMatch(/html\[data-cursor-absorb\] \*,[\s\S]*?cursor: none !important;/);
  });

  it("turns white on a dark control and blue on a light one — never an inverse", () => {
    expect(tintForFill([5, 15, 104, 1])).toBe(CURSOR_ON_DARK); // navy
    expect(tintForFill([130, 9, 51, 1])).toBe(CURSOR_ON_DARK); // bordeaux
    expect(tintForFill([255, 122, 156, 1])).toBe(CURSOR_ON_LIGHT); // pink
    expect(tintForFill([250, 250, 247, 1])).toBe(CURSOR_ON_LIGHT); // paper
    expect([CURSOR_ON_DARK, CURSOR_ON_LIGHT]).toEqual(["#ffffff", "#050f68"]);
  });
});
