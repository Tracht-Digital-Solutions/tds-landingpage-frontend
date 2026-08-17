/**
 * Geometry + easing for the bounce-eased section jumps (nav links, CTAs,
 * logo, back-to-top). Kept DOM-free on purpose: the desktop (Lenis) and
 * touch (rAF) paths in `islands/SmoothScroll.tsx` both plan a jump through
 * here, so the two land on the same pixel with the same curve, and the part
 * that used to be wrong is the part a unit test can actually see.
 */

/**
 * Biggest `back` constant we ever use. `easeOutBack` with c1 = 1.05
 * settles ~4% of the distance past the target and eases back — a gentle
 * bounce, not the springy default (1.70158 ⇒ ~10%).
 */
export const MAX_OVERSHOOT = 1.05;

/**
 * How far past its target `easeOutBack(c1)` actually travels, as a fraction
 * of the distance.
 *
 * Closed form rather than a sampled guess: the curve's maximum sits at
 * u = -2·c1 / 3·(c1+1), and substituting that back reduces the peak to
 * (4/27)·c1³/(c1+1)². The jump planner needs this number in pixels *before*
 * it starts moving, which is what lets it refuse an overshoot that would
 * run off the end of the document.
 */
export function peakOvershoot(c1: number): number {
  if (c1 <= 0) return 0;
  return ((4 / 27) * c1 ** 3) / (c1 + 1) ** 2;
}

/**
 * `easeOutBack` for a given back constant. c1 = 0 degrades to a plain
 * ease-out cubic — same arrival feel, no overshoot at all.
 *
 * Returns exactly 1 at t ≥ 1 so a tween lands on its destination pixel
 * instead of a rounding error away from it.
 */
export function easeOutBack(c1: number): (t: number) => number {
  const c3 = c1 + 1;
  return (t) => (t >= 1 ? 1 : 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2);
}

/**
 * The largest back constant whose overshoot still fits inside `room` px.
 *
 * `peakOvershoot` is monotonic in c1, so a short bisection is exact enough
 * and avoids inverting a cubic. Zero room ⇒ zero overshoot: at the very top
 * or bottom of the document there is nothing to bounce into, and asking for
 * one anyway is what made the jump stall (see `planJump`).
 */
export function fitOvershoot(
  distance: number,
  room: number,
  max: number = MAX_OVERSHOOT,
): number {
  const span = Math.abs(distance);
  if (span === 0 || room <= 0 || max <= 0) return 0;

  const wanted = room / span;
  if (wanted >= peakOvershoot(max)) return max;

  let lo = 0;
  let hi = max;
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    if (peakOvershoot(mid) > wanted) hi = mid;
    else lo = mid;
  }
  return lo;
}

export interface JumpGeometry {
  /** Current scroll position, px. */
  startY: number;
  /** Where the caller wants to end up, px — before clamping. */
  targetY: number;
  /** Furthest the document can scroll, px (`scrollHeight - clientHeight`). */
  maxY: number;
}

export interface JumpPlan {
  /** Clamped destination, px. */
  destY: number;
  /** Signed travel, px. Negative scrolls up. */
  distance: number;
  /** Back constant the easing was built with — 0 when no bounce fits. */
  overshoot: number;
  /** Ready-to-use easing for this specific jump. */
  easing: (t: number) => number;
}

/**
 * Resolve a jump against the *current* layout: where it lands, and which
 * easing can actually be drawn there.
 *
 * The second half is the point. An overshooting ease has to travel past its
 * destination, and past the top or bottom of the document there is nowhere
 * to travel to — the browser simply clamps the scroll position, so the page
 * froze for the ~500ms tail of every back-to-top and every jump to the last
 * section while the animation played out against a wall. So the runway
 * beyond the destination *in the direction of travel* is measured first and
 * the overshoot is fitted to it, degrading to a clean ease-out where there
 * is no room. A bounce you cannot draw is worse than no bounce.
 */
export function planJump({ startY, targetY, maxY }: JumpGeometry): JumpPlan {
  const limit = Math.max(0, maxY);
  const destY = Math.min(Math.max(targetY, 0), limit);
  const distance = destY - startY;
  const room = distance > 0 ? limit - destY : destY;
  const overshoot = fitOvershoot(distance, room);

  return { destY, distance, overshoot, easing: easeOutBack(overshoot) };
}
