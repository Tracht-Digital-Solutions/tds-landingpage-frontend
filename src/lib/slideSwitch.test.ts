import { describe, expect, it } from "vitest";
import { settlesOn, thumbOffset } from "./slideSwitch";

describe("sliding a switch by hand", () => {
  it("follows the pointer from where the thumb rests", () => {
    expect(thumbOffset(0, 30, 80)).toBe(30);
    expect(thumbOffset(80, -30, 80)).toBe(50);
  });

  it("never leaves the track", () => {
    expect(thumbOffset(0, -40, 80)).toBe(0);
    expect(thumbOffset(80, 40, 80)).toBe(80);
  });

  it("settles on the nearer end", () => {
    expect(settlesOn(41, 80)).toBe(true);
    expect(settlesOn(39, 80)).toBe(false);
    expect(settlesOn(0, 0)).toBe(false);
  });
});
