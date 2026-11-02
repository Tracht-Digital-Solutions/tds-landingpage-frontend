import { describe, expect, it } from "vitest";
import { HAND_SPRING, releaseTarget, slotAt, stepSpring } from "./heroWheel";

describe("slotAt", () => {
  it("wraps a card round the back of the rim", () => {
    expect(slotAt(0, 0, 7)).toBe(0);
    expect(slotAt(3, 1, 7)).toBe(2);
    expect(slotAt(-3, 1, 7)).toBe(3);
    expect(slotAt(0, 7, 7)).toBe(0);
  });
});

describe("releaseTarget", () => {
  const base = { origin: 2, coast: 0, limit: 3 };

  it("takes a short swipe to the next card", () => {
    expect(releaseTarget({ ...base, position: 2.2 })).toBe(3);
    expect(releaseTarget({ ...base, position: 1.8 })).toBe(1);
  });

  it("stays on the card after a twitch", () => {
    expect(releaseTarget({ ...base, position: 2.05 })).toBe(2);
  });

  it("never goes against the drag, even when the hand flicks back", () => {
    expect(releaseTarget({ ...base, position: 2.3, coast: -1.5 })).toBe(3);
  });

  it("lets a throw carry further, up to the limit", () => {
    expect(releaseTarget({ ...base, position: 2.3, coast: 1.4 })).toBe(4);
    expect(releaseTarget({ ...base, position: 2.5, coast: 20 })).toBe(5);
  });
});

describe("stepSpring", () => {
  it("arrives and reports it", () => {
    let state = { position: 0, velocity: 0, settled: false };
    for (let i = 0; i < 600 && !state.settled; i++) {
      state = stepSpring(state.position, state.velocity, 1, HAND_SPRING, 1 / 60);
    }
    expect(state.settled).toBe(true);
    expect(state.position).toBe(1);
  });

  it("starts from where the hand left it, without a jump", () => {
    const next = stepSpring(0.4, 0, 1, HAND_SPRING, 1 / 60);
    expect(next.position).toBeGreaterThan(0.4);
    expect(next.position).toBeLessThan(0.45);
  });
});
