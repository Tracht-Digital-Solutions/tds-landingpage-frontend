import { describe, expect, it } from "vitest";

import { brandbarTarget } from "./brandbar";

const base = [64, 28, 14] as const;
const gap = 6;

describe("brandbarTarget (2026-10-05)", () => {
  it("rests exactly at the bar's own sizes when the pointer is out of reach", () => {
    expect(brandbarTarget(base, gap, 0.5, 0)).toEqual([64, 28, 14, 6, 1]);
  });

  it("swells the segment under the pointer the most", () => {
    const grown = (along: number) =>
      brandbarTarget(base, gap, along, 1)
        .slice(0, 3)
        .map((width, i) => width - base[i]!);
    // Over the first segment, the first leads; over the last, the last does.
    const left = grown(0.25);
    expect(left[0]).toBeGreaterThan(left[2]!);
    const right = grown(0.95);
    expect(right[2]).toBeGreaterThan(right[0]!);
  });

  it("opens the seams and thickens the bar as the pointer comes near", () => {
    const [, , , farGap, farScale] = brandbarTarget(base, gap, 0.5, 0.2);
    const [, , , nearGap, nearScale] = brandbarTarget(base, gap, 0.5, 0.9);
    expect(nearGap).toBeGreaterThan(farGap);
    expect(nearScale).toBeGreaterThan(farScale);
  });
});
