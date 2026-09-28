/**
 * Telling a mouse wheel from a trackpad, from the wheel events themselves.
 *
 * ### Why the site cares
 *
 * The two devices want opposite things from a smooth-scroll layer.
 *
 * A MOUSE WHEEL emits coarse, discrete steps — one notch is around a hundred
 * pixels, with gaps between notches. Scrolled natively that is a page jumping
 * in stairs, and a long eased tween per notch is exactly the right answer: it
 * turns the staircase into a glide.
 *
 * A TRACKPAD emits a continuous stream of small deltas, and the operating
 * system has ALREADY applied its own momentum curve to them. Running a second
 * momentum on top is what makes a page feel swimmy and late — the finger has
 * stopped and the page is still arriving. There the layer should follow almost
 * one to one.
 *
 * One setting cannot serve both, which is the whole of "adaptive scrolling"
 * here: the same page, the same code, a different response to the thing the
 * visitor is actually holding.
 *
 * ### Why it is a guess, and why that is fine
 *
 * No browser reports the device. Everything below is inference from the shape
 * of the events, and it can be wrong — so nothing irreversible hangs on it:
 * being wrong costs a scroll that is smoother or tighter than it might have
 * been, never a page that does not scroll. The verdict is deliberately slow to
 * form (several agreeing samples) and, once formed, sticks: a classifier that
 * flips mid-gesture would change the feel under the hand, which is worse than
 * either answer on its own.
 *
 * DOM-free, so the rules are testable without a browser.
 */

export type WheelKind = "mouse" | "trackpad";

export interface WheelSample {
  deltaY: number;
  deltaX: number;
  /** `WheelEvent.deltaMode`: 0 pixels, 1 lines, 2 pages. */
  deltaMode: number;
  /** Milliseconds since the previous wheel event, or `Infinity` for the first. */
  gap: number;
}

/** Below this, a delta is far too small for a wheel notch. */
const FINE_DELTA = 40;
/** At or above this, a single step is far too big for a trackpad frame. */
const COARSE_DELTA = 100;
/** Wheel events this close together are a continuous gesture, not notches. */
const CONTINUOUS_GAP_MS = 30;
/** How many usable samples before a verdict, and how sure they have to be. */
export const WHEEL_SAMPLE_SIZE = 5;
const AGREEMENT = 0.8;

/**
 * What ONE event suggests, or `null` when it suggests nothing.
 *
 * Order matters: the first three tests are facts about the device, the rest
 * are tendencies. A line- or page-mode event only ever comes from a wheel; a
 * fractional delta or a sideways component only ever comes from a touch
 * surface.
 */
export function sampleKind(sample: WheelSample): WheelKind | null {
  if (sample.deltaMode !== 0) return "mouse";
  if (!Number.isInteger(sample.deltaY)) return "trackpad";
  if (sample.deltaX !== 0) return "trackpad";

  const size = Math.abs(sample.deltaY);
  if (size === 0) return null;
  if (size < FINE_DELTA) return "trackpad";
  // A fast two-finger flick does produce whole numbers this big — but not with
  // a gap, because the surface reports every frame it is touched.
  if (sample.gap < CONTINUOUS_GAP_MS) return "trackpad";
  if (size >= COARSE_DELTA) return "mouse";
  return null;
}

/**
 * The verdict for a run of samples, or `null` while they disagree.
 *
 * Unanimity is not required: one stray event inside a gesture should not
 * postpone the answer for ever, and four out of five is already far past
 * chance.
 */
export function classifyWheel(samples: readonly WheelSample[]): WheelKind | null {
  const votes = samples.map(sampleKind).filter((kind): kind is WheelKind => kind !== null);
  if (votes.length < WHEEL_SAMPLE_SIZE) return null;
  const mouse = votes.filter((kind) => kind === "mouse").length;
  const share = mouse / votes.length;
  if (share >= AGREEMENT) return "mouse";
  if (1 - share >= AGREEMENT) return "trackpad";
  return null;
}

/**
 * The smooth-scroll profile for each device.
 *
 * `duration` is seconds for one eased tween to the target. The mouse value is
 * what the site shipped with; the trackpad value is short enough that the
 * layer is a smoothing of the last few frames rather than a momentum of its
 * own.
 */
export const WHEEL_PROFILE: Record<WheelKind, { duration: number }> = {
  mouse: { duration: 1.1 },
  trackpad: { duration: 0.28 },
};
