/**
 * Gentle section snapping (2026-10-12).
 *
 * When a scroll comes to rest NEAR the start of a section, the page settles
 * onto that start; anywhere else it stays exactly where the visitor left it.
 * No CSS `scroll-snap-type` on the root: Lenis owns the wheel on desktop and
 * the two would fight, and a mandatory snap would trap a reader inside the
 * long sections. One rule for both input paths (`lib/smoothScroll.ts`).
 */

/** Pixels within which a section start pulls the page onto it. */
export function snapThreshold(viewportHeight: number): number {
  return Math.min(140, Math.round(viewportHeight * 0.16));
}

/** Corrections smaller than this are not worth a movement. */
export const SNAP_MIN_PX = 4;
/** How long a scroll has to be still before it counts as at rest. */
export const SNAP_IDLE_MS = 160;
/** Duration of the settle, in ms. Short: a correction, not a jump. */
export const SNAP_DURATION_MS = 520;

/**
 * Where the page should settle, or `null` to leave it.
 *
 * `starts` are the scroll positions at which each section begins (its top
 * minus the header clearance). The nearest one within the threshold wins;
 * the result is clamped to the document's scroll range, and a start beyond
 * the end of the page (the last sections) cannot pull.
 */
export function snapTarget(
  scrollY: number,
  starts: readonly number[],
  viewportHeight: number,
  maxY: number,
): number | null {
  const threshold = snapThreshold(viewportHeight);
  let best: number | null = null;
  for (const raw of starts) {
    if (raw > maxY + 1) continue;
    const start = Math.max(0, Math.min(maxY, raw));
    const distance = Math.abs(start - scrollY);
    if (distance > threshold) continue;
    if (best === null || distance < Math.abs(best - scrollY)) best = start;
  }
  if (best === null || Math.abs(best - scrollY) < SNAP_MIN_PX) return null;
  return best;
}

/** Ease-out cubic: the settle decelerates into the section start. */
export const settleEasing = (t: number) => 1 - Math.pow(1 - t, 3);
