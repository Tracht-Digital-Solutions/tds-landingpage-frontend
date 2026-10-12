import { describe, expect, it } from "vitest";
import { snapTarget, snapThreshold } from "./sectionSnap";

const starts = [0, 900, 2400, 4000];
const vh = 900;
const maxY = 4200;

describe("gentle section snapping", () => {
  it("settles onto a section start close by", () => {
    expect(snapTarget(960, starts, vh, maxY)).toBe(900);
    expect(snapTarget(2310, starts, vh, maxY)).toBe(2400);
  });

  it("leaves the page alone in the middle of a section", () => {
    expect(snapTarget(1500, starts, vh, maxY)).toBeNull();
  });

  it("does not move for a few pixels", () => {
    expect(snapTarget(902, starts, vh, maxY)).toBeNull();
  });

  it("never pulls past the end of the page", () => {
    expect(snapTarget(4150, [0, 4300], vh, maxY)).toBeNull();
    expect(snapTarget(3950, [0, 3990.5], vh, 3990)).toBe(3990);
  });

  it("pulls less on a short screen", () => {
    expect(snapThreshold(600)).toBe(96);
    expect(snapThreshold(1200)).toBe(140);
  });
});
