import { describe, expect, it } from "vitest";

import { keyWeights } from "./brandbar";

/** The default bar: 64 · 28 · 14 px with 6px seams. */
const keys = [
  { left: 0, width: 64 },
  { left: 70, width: 28 },
  { left: 104, width: 14 },
];

describe("the brand bar's keys (2026-10-05)", () => {
  it("plays the key under the pointer fully, and nothing out of reach", () => {
    const over = keyWeights(keys, 80, 0);
    expect(over[1]).toBe(1);
    expect(keyWeights(keys, 80, 200)).toEqual([0, 0, 0]);
    expect(keyWeights(keys, 400, 0)).toEqual([0, 0, 0]);
  });

  it("moves the neighbours less, the further they are", () => {
    const [first, second, third] = keyWeights(keys, 72, 0);
    expect(second).toBe(1);
    expect(first).toBeGreaterThan(third!);
    expect(third).toBeLessThan(1);
  });

  it("fades with the distance above or below the bar", () => {
    const near = keyWeights(keys, 10, 10)[0]!;
    const far = keyWeights(keys, 10, 50)[0]!;
    expect(near).toBeGreaterThan(far);
    expect(far).toBeGreaterThan(0);
  });
});
