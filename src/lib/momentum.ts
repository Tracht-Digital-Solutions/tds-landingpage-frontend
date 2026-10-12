/**
 * Release momentum for mouse drags (2026-10-12).
 *
 * Touch already flings natively; a mouse drag written by hand stopped dead
 * wherever the hand let go. These helpers give it the same throw: the speed of
 * the last moments of the drag carries on and decays exponentially, like a
 * native scroller.
 *
 * Only the last `WINDOW_MS` of movement count. Averaging the whole gesture
 * (what the hero carousel did first) makes a slow drag that ends in a quick
 * throw read as slow, and a quick drag that came to rest before the release
 * still read as a flick.
 */

/** Samples older than this are ignored when the release speed is measured. */
export const WINDOW_MS = 100;
/**
 * A release this long after the last move is a hold, not a throw. The hand
 * stopped, then let go — nothing carries on.
 */
export const HOLD_MS = 60;
/**
 * Decay time constant in ms: the speed falls to 1/e after this long, and the
 * whole glide travels `speed × TAU_MS`. 325 ms is the figure native momentum
 * scrollers are commonly tuned to.
 */
export const TAU_MS = 325;
/** Below this release speed (px/ms) there is no glide. */
export const MIN_SPEED = 0.15;
/** A cap so a twitch of a high-DPI mouse cannot throw the shelf a whole set. */
export const MAX_SPEED = 6;

export interface VelocityTracker {
  /** Record the pointer position at time `t` (ms, e.g. `event.timeStamp`). */
  push(x: number, t: number): void;
  /** Release speed in px/ms at time `t`; 0 for a hold or too few samples. */
  release(t: number): number;
  reset(): void;
}

export function velocityTracker(): VelocityTracker {
  let samples: Array<{ x: number; t: number }> = [];
  return {
    push(x, t) {
      samples.push({ x, t });
      while (samples.length > 2 && t - samples[0]!.t > WINDOW_MS) samples.shift();
    },
    release(t) {
      const last = samples[samples.length - 1];
      if (!last || t - last.t > HOLD_MS) return 0;
      const first = samples.find((s) => last.t - s.t <= WINDOW_MS) ?? samples[0]!;
      const dt = last.t - first.t;
      if (dt <= 0) return 0;
      const v = (last.x - first.x) / dt;
      return Math.max(-MAX_SPEED, Math.min(MAX_SPEED, v));
    },
    reset() {
      samples = [];
    },
  };
}

/** How far a throw at `speed` px/ms travels before it comes to rest. */
export function projectedDistance(speed: number): number {
  return Math.abs(speed) < MIN_SPEED ? 0 : speed * TAU_MS;
}

/**
 * Run a glide: `apply(delta)` receives the pixels to move each frame until the
 * speed has decayed (or `apply` returns false — an edge was hit). Returns a
 * cancel function. `done` runs once at the end, cancelled or not.
 */
export function glide(
  speed: number,
  apply: (delta: number) => boolean | void,
  done: () => void,
): () => void {
  let v = speed;
  let last = 0;
  let frame = 0;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    done();
  };
  if (Math.abs(v) < MIN_SPEED) {
    finish();
    return finish;
  }
  const tick = (now: number) => {
    if (last) {
      const dt = Math.min(64, now - last);
      const decay = Math.exp(-dt / TAU_MS);
      // The exact distance covered by an exponentially decaying speed over dt.
      const delta = v * TAU_MS * (1 - decay);
      v *= decay;
      if (apply(delta) === false || Math.abs(v) < 0.02) {
        finish();
        return;
      }
    }
    last = now;
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return finish;
}
