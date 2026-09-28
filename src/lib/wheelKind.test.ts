import { describe, expect, it } from "vitest";
import {
  classifyWheel,
  sampleKind,
  WHEEL_PROFILE,
  WHEEL_SAMPLE_SIZE,
  type WheelSample,
} from "./wheelKind";

/**
 * The device behind the wheel events.
 *
 * No browser reports it, so everything here is inference — which is exactly
 * why it is worth a test: the rules are a set of thresholds that look
 * arbitrary six months later, and the shapes they encode are real. A mouse
 * notch is a big whole number with a gap after it; a trackpad frame is small,
 * often fractional, often sideways, and arrives on the heels of the last one.
 */
const sample = (over: Partial<WheelSample> = {}): WheelSample => ({
  deltaY: 100,
  deltaX: 0,
  deltaMode: 0,
  gap: 120,
  ...over,
});

const run = (over: Partial<WheelSample>, count = WHEEL_SAMPLE_SIZE) =>
  Array.from({ length: count }, () => sample(over));

describe("one event", () => {
  it("calls line and page mode a mouse, whatever the size", () => {
    // Only a wheel ever reports in lines or pages, and both sizes here would
    // otherwise read as "far too small for a notch".
    expect(sampleKind(sample({ deltaMode: 1, deltaY: 3 }))).toBe("mouse");
    expect(sampleKind(sample({ deltaMode: 2, deltaY: 1 }))).toBe("mouse");
  });

  it("calls a fractional delta a trackpad", () => {
    expect(sampleKind(sample({ deltaY: 12.5 }))).toBe("trackpad");
  });

  it("calls a sideways component a trackpad", () => {
    // A wheel has one axis; two fingers have two.
    expect(sampleKind(sample({ deltaX: 4 }))).toBe("trackpad");
  });

  it("calls a small step a trackpad and a big one with a gap a mouse", () => {
    expect(sampleKind(sample({ deltaY: 8 }))).toBe("trackpad");
    expect(sampleKind(sample({ deltaY: 100, gap: 140 }))).toBe("mouse");
  });

  /**
   * The case the size test alone gets wrong: a fast two-finger flick does
   * produce whole numbers as big as a notch. What it cannot produce is a gap —
   * the surface reports every frame it is touched.
   */
  it("calls a big step with no gap a trackpad anyway", () => {
    expect(sampleKind(sample({ deltaY: 120, gap: 8 }))).toBe("trackpad");
  });

  it("says nothing about an empty or ambiguous event", () => {
    expect(sampleKind(sample({ deltaY: 0 }))).toBeNull();
    expect(sampleKind(sample({ deltaY: 60, gap: 140 }))).toBeNull();
  });
});

describe("a run of events", () => {
  it("waits for enough of them", () => {
    expect(classifyWheel(run({ deltaY: 100 }, WHEEL_SAMPLE_SIZE - 1))).toBeNull();
    expect(classifyWheel(run({ deltaY: 100 }))).toBe("mouse");
  });

  it("recognises a trackpad stream", () => {
    expect(classifyWheel(run({ deltaY: 7.5, gap: 12 }))).toBe("trackpad");
  });

  it("survives one stray event inside a gesture", () => {
    // Four to one is already far past chance; holding out for unanimity would
    // postpone the verdict for the whole of some visitors' sessions.
    const mostly = [...run({ deltaY: 6, gap: 10 }, 4), sample({ deltaY: 100, gap: 140 })];
    expect(classifyWheel(mostly)).toBe("trackpad");
  });

  it("stays undecided on a genuine split", () => {
    const split = [
      ...run({ deltaY: 6, gap: 10 }, 3),
      ...run({ deltaY: 100, gap: 140 }, 2),
    ];
    expect(classifyWheel(split)).toBeNull();
  });

  it("ignores events that say nothing", () => {
    // Five zero-delta events carry no verdict, and must not add up to one.
    expect(classifyWheel(run({ deltaY: 0 }))).toBeNull();
  });
});

describe("the profiles", () => {
  /**
   * The whole point of the split: a wheel notch is smoothed into a glide, a
   * trackpad is followed closely because the operating system has already
   * applied its own momentum and a second one arrives late.
   */
  it("smooths a mouse notch far more than a trackpad frame", () => {
    expect(WHEEL_PROFILE.mouse.duration).toBeGreaterThan(WHEEL_PROFILE.trackpad.duration * 3);
  });

  it("keeps both inside what still reads as one movement", () => {
    for (const kind of ["mouse", "trackpad"] as const) {
      expect(WHEEL_PROFILE[kind].duration, kind).toBeGreaterThan(0.1);
      expect(WHEEL_PROFILE[kind].duration, kind).toBeLessThanOrEqual(1.5);
    }
  });
});
