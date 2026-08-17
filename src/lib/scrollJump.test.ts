import { describe, expect, it } from "vitest";
import {
  MAX_OVERSHOOT,
  easeOutBack,
  fitOvershoot,
  peakOvershoot,
  planJump,
} from "./scrollJump";

/** Highest value the easing reaches, sampled finely. */
function sampledPeak(ease: (t: number) => number): number {
  let peak = 0;
  for (let i = 0; i <= 2000; i += 1) peak = Math.max(peak, ease(i / 2000));
  return peak;
}

describe("easeOutBack", () => {
  it("starts at 0 and lands exactly on 1", () => {
    const ease = easeOutBack(MAX_OVERSHOOT);
    expect(ease(0)).toBeCloseTo(0, 10);
    // Exact, not close: a tween multiplies this by the distance, and a
    // rounding error here is a jump that stops a pixel short.
    expect(ease(1)).toBe(1);
    expect(ease(1.4)).toBe(1);
  });

  it("degrades to a non-overshooting ease-out at c1 = 0", () => {
    const ease = easeOutBack(0);
    expect(sampledPeak(ease)).toBe(1);
    expect(ease(0.5)).toBeCloseTo(1 - 0.5 ** 3, 10);
  });

  it("is monotonic up to its peak and never dips below 0", () => {
    const ease = easeOutBack(MAX_OVERSHOOT);
    for (let i = 1; i <= 1000; i += 1) expect(ease(i / 1000)).toBeGreaterThan(0);
  });
});

describe("peakOvershoot", () => {
  it("matches the sampled maximum of the curve it describes", () => {
    // The closed form is the whole reason a jump can be planned before it
    // moves; if it drifts from the actual curve the fitting below is fiction.
    for (const c1 of [0.05, 0.3, 0.7, 1.05, 1.70158]) {
      expect(peakOvershoot(c1)).toBeCloseTo(sampledPeak(easeOutBack(c1)) - 1, 5);
    }
  });

  it("is zero at or below 0 and rises monotonically", () => {
    expect(peakOvershoot(0)).toBe(0);
    expect(peakOvershoot(-1)).toBe(0);
    let prev = 0;
    for (let i = 1; i <= 100; i += 1) {
      const next = peakOvershoot((i / 100) * MAX_OVERSHOOT);
      expect(next).toBeGreaterThan(prev);
      prev = next;
    }
  });

  it("keeps the brand bounce gentle — a few percent, not a spring", () => {
    expect(peakOvershoot(MAX_OVERSHOOT)).toBeGreaterThan(0.03);
    expect(peakOvershoot(MAX_OVERSHOOT)).toBeLessThan(0.05);
  });
});

describe("fitOvershoot", () => {
  it("uses the full bounce when there is ample runway", () => {
    expect(fitOvershoot(800, 7200)).toBe(MAX_OVERSHOOT);
  });

  it("returns nothing when there is no runway at all", () => {
    expect(fitOvershoot(4000, 0)).toBe(0);
    expect(fitOvershoot(4000, -10)).toBe(0);
  });

  it("scales the bounce to exactly the room available", () => {
    const distance = 1000;
    const room = 12; // less than the 40.8px the full bounce would need
    const c1 = fitOvershoot(distance, room);
    expect(c1).toBeGreaterThan(0);
    expect(c1).toBeLessThan(MAX_OVERSHOOT);
    expect(peakOvershoot(c1) * distance).toBeLessThanOrEqual(room);
    expect(peakOvershoot(c1) * distance).toBeGreaterThan(room - 0.5);
  });

  it("ignores the sign of the distance", () => {
    expect(fitOvershoot(-1000, 12)).toBe(fitOvershoot(1000, 12));
  });
});

describe("planJump", () => {
  const maxY = 8000;

  it("clamps the destination into the document's scroll range", () => {
    expect(planJump({ startY: 0, targetY: -400, maxY }).destY).toBe(0);
    expect(planJump({ startY: 0, targetY: 99999, maxY }).destY).toBe(maxY);
  });

  it("bounces on a mid-document jump", () => {
    const plan = planJump({ startY: 0, targetY: 1200, maxY });
    expect(plan.overshoot).toBe(MAX_OVERSHOOT);
    expect(plan.distance).toBe(1200);
  });

  it("never asks the browser for a position it cannot scroll to", () => {
    // This is the defect the whole module exists for. An overshoot past the
    // top or bottom of the document is silently clamped, so the page used to
    // freeze for the tail of the animation while the curve played out
    // against a wall. Assert on the pixels the easing actually requests.
    const cases = [
      { startY: 6000, targetY: 0, maxY }, // back-to-top (logo, floating CTA)
      { startY: 0, targetY: maxY, maxY }, // jump to the last section
      { startY: maxY - 30, targetY: maxY, maxY }, // short jump, little room
    ];

    for (const geometry of cases) {
      const { destY, distance, easing } = planJump(geometry);
      for (let i = 0; i <= 1000; i += 1) {
        const y = geometry.startY + distance * easing(i / 1000);
        expect(y).toBeGreaterThanOrEqual(-0.001);
        expect(y).toBeLessThanOrEqual(maxY + 0.001);
      }
      expect(geometry.startY + distance * easing(1)).toBeCloseTo(destY, 10);
    }
  });

  it("degrades to a plain ease-out at a hard document edge", () => {
    expect(planJump({ startY: 6000, targetY: 0, maxY }).overshoot).toBe(0);
    expect(planJump({ startY: 0, targetY: maxY, maxY }).overshoot).toBe(0);
  });

  it("reports a zero distance when already at the destination", () => {
    expect(planJump({ startY: 1200, targetY: 1200, maxY }).distance).toBe(0);
  });

  it("survives a page too short to scroll", () => {
    const plan = planJump({ startY: 0, targetY: 500, maxY: 0 });
    expect(plan.destY).toBe(0);
    expect(plan.distance).toBe(0);
    expect(plan.overshoot).toBe(0);
  });
});
