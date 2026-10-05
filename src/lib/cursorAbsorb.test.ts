import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { invertRgb } from "./cursorAbsorb";

const css = readFileSync(resolve(process.cwd(), "src/styles/global.css"), "utf8");

describe("the drawn cursor over controls (2026-10-05)", () => {
  it("hides the native pointer on the whole page while the drawn cursor runs", () => {
    expect(css).toMatch(/html\[data-cursor-absorb\] \*,[\s\S]*?cursor: none !important;/);
  });

  it("inverts a control's fill for the cursor", () => {
    expect(invertRgb([5, 15, 104, 1])).toBe("rgb(250 240 151)");
    expect(invertRgb([255, 255, 255, 0.4])).toBe("rgb(0 0 0)");
  });
});
