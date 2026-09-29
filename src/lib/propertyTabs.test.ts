import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The bookmarks on the left edge (`components/PropertyTabs.astro` +
 * `lib/motion/propertyTabs.ts`).
 *
 * ### Why this file exists
 *
 * The parked position is arithmetic spread across two files and three
 * declarations, and it broke silently. `--tab-bleed` grew from 12px to 28px to
 * give the hard shadow and the spring's overshoot room off the left edge of the
 * window — a correct fix — but nothing noticed that the bleed is subtracted
 * from what remains ON screen:
 *
 *   margin-left: -B            box spans [-B, W-B]
 *   translate:   -100% + P     box spans [P-W-B, P-B]
 *   on screen:   0 … P-B       = 48 - 28 = 20px, not 48
 *
 * The icon sits 14…36px in from the tab's right edge, so 6 of its 22 pixels
 * were visible: four bookmarks showing a sliver of a stroke. Reported as "the
 * bookmarks should show their icons when parked" (2026-09-29), which is what the
 * code already believed it did.
 *
 * Nothing about that is visible in a screenshot of a passing test suite, and a
 * browser check of a parked tab is a 20px strip at the edge of a 1440px
 * viewport. So it is asserted here as the arithmetic it is.
 */
const read = (rel: string) => readFileSync(resolve(process.cwd(), rel), "utf8");
const astro = read("src/components/PropertyTabs.astro");
const motion = read("src/lib/motion/propertyTabs.ts");

/** `--tab-peek: 3rem` → 48. */
const peekRem = Number(astro.match(/--tab-peek:\s*([\d.]+)rem/)?.[1]);
const peekPx = peekRem * 16;
/** `--tab-bleed: 28px`. */
const bleedPx = Number(astro.match(/--tab-bleed:\s*(\d+)px/)?.[1]);

describe("the parked bookmark", () => {
  it("declares a peek and a bleed", () => {
    expect(peekRem, "--tab-peek").toBeGreaterThan(0);
    expect(bleedPx, "--tab-bleed").toBeGreaterThan(0);
  });

  it("adds the bleed back, so the peek is what stays on screen", () => {
    // Both declarations: the base rule and the `[data-motion="on"]`
    // neutralisation, which has to park at the same place or Motion's transform
    // starts from somewhere else.
    const parked = astro.match(/translate:\s*calc\(-100% \+ var\(--tab-peek\) \+ var\(--tab-bleed\)\) 0;/g);
    expect(parked, "parked translate must add --tab-bleed").toHaveLength(2);
    // And the old form must be gone from both.
    expect(astro).not.toMatch(/translate:\s*calc\(-100% \+ var\(--tab-peek\)\) 0;/);
  });

  it("leaves the whole icon inside the visible strip", () => {
    // The icon is the tab's right end: `padding-right` + its own width, plus
    // the 2px `margin-left` that separates it from the arrow.
    const paddingRightRem = Number(
      astro.match(/padding:\s*0\s+([\d.]+)rem\s+0\s+calc/)?.[1],
    );
    const iconPx = Number(astro.match(/class="property-tab__icon"\s+width="(\d+)"/)?.[1]);
    expect(paddingRightRem, "the tab's padding-right").toBeGreaterThan(0);
    expect(iconPx, "the icon's width").toBeGreaterThan(0);

    // Distance from the tab's right edge to the icon's LEFT edge.
    const iconFarEdge = paddingRightRem * 16 + iconPx;
    expect(
      iconFarEdge,
      `the icon reaches ${iconFarEdge}px in from the right edge but only ${peekPx}px are on screen`,
    ).toBeLessThanOrEqual(peekPx);
  });

  it("keeps the motion module's constants in step with the CSS", () => {
    // Motion adds `x` on top of the CSS translate, so its idea of both numbers
    // has to be the CSS's. There is no import between an .astro <style> block
    // and a .ts module, which is exactly why this can drift.
    expect(Number(motion.match(/const PEEK_PX = (\d+)/)?.[1]), "PEEK_PX").toBe(peekPx);
    expect(Number(motion.match(/const BLEED_PX = (\d+)/)?.[1]), "BLEED_PX").toBe(bleedPx);
  });

  it("travels the width minus BOTH, so no gap opens at the window edge", () => {
    // The bleed is never travelled: it is the part that stays off the left edge
    // even when the tab is fully out. Adding it to the travel would push the
    // tab `bleed` pixels too far right — the gap the bleed exists to close.
    expect(motion).toMatch(/tab\.offsetWidth - PEEK_PX - BLEED_PX/);
  });
});
