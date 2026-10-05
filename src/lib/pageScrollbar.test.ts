import { describe, expect, it } from "vitest";

import { MIN_THUMB, scrollForOffset, thumbGeometry } from "./pageScrollbar";

describe("the floating page scrollbar (2026-10-05)", () => {
  it("sizes the thumb by the share of the page on screen", () => {
    expect(thumbGeometry({ viewport: 800, scrollHeight: 3200, scrollY: 0, track: 800 })).toEqual({
      size: 200,
      offset: 0,
    });
  });

  it("puts the thumb at the end of the track at the end of the page", () => {
    const { size, offset } = thumbGeometry({ viewport: 800, scrollHeight: 3200, scrollY: 2400, track: 800 });
    expect(offset + size).toBe(800);
  });

  it("never shrinks the thumb below a grabbable length", () => {
    expect(thumbGeometry({ viewport: 800, scrollHeight: 400_000, scrollY: 0, track: 800 }).size).toBe(MIN_THUMB);
  });

  it("maps a dragged thumb back onto the scroll range, clamped", () => {
    expect(scrollForOffset({ offset: 300, size: 200, track: 800, max: 2400 })).toBe(1200);
    expect(scrollForOffset({ offset: -50, size: 200, track: 800, max: 2400 })).toBe(0);
    expect(scrollForOffset({ offset: 9000, size: 200, track: 800, max: 2400 })).toBe(2400);
  });
});
