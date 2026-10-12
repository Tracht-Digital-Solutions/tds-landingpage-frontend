import { describe, expect, it } from "vitest";

import { shuffled } from "./shuffle";

describe("shuffled", () => {
  it("keeps every item and leaves the input alone", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffled(input);
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it("draws a different order for a different random source", () => {
    const seq = (values: number[]) => () => values.shift() ?? 0;
    expect(shuffled([1, 2, 3], seq([0, 0]))).toEqual([2, 3, 1]);
    expect(shuffled([1, 2, 3], seq([0.99, 0.99]))).toEqual([1, 2, 3]);
  });
});
