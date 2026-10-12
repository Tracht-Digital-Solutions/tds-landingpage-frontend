import { describe, expect, it } from "vitest";
import { HOLD_MS, MAX_SPEED, TAU_MS, projectedDistance, velocityTracker } from "./momentum";

describe("release momentum", () => {
  it("reads the speed of the last moments, not the gesture's average", () => {
    const tracker = velocityTracker();
    // A slow start (1 px per 10 ms) ...
    for (let t = 0; t <= 400; t += 10) tracker.push(t / 10, t);
    // ... ending in a quick throw (20 px per 10 ms).
    let x = 40;
    for (let t = 410; t <= 500; t += 10) tracker.push((x += 20), t);
    expect(tracker.release(505)).toBeCloseTo(2, 1);
  });

  it("gives no throw when the hand stopped before letting go", () => {
    const tracker = velocityTracker();
    for (let t = 0; t <= 100; t += 10) tracker.push(t * 2, t);
    expect(tracker.release(100 + HOLD_MS + 1)).toBe(0);
  });

  it("caps a twitch and projects the coast distance", () => {
    const tracker = velocityTracker();
    tracker.push(0, 0);
    tracker.push(500, 10);
    expect(tracker.release(10)).toBe(MAX_SPEED);
    expect(projectedDistance(2)).toBe(2 * TAU_MS);
    expect(projectedDistance(-2)).toBe(-2 * TAU_MS);
    expect(projectedDistance(0.05)).toBe(0);
  });
});
