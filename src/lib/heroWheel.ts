/**
 * The hero carousel's wheel, as plain numbers.
 *
 * `position` counts cards turned and may run past any bound. A card's slot is
 * its home slot minus the position, wrapped into the rim, so the card crossing
 * the back of the wheel changes sides out of sight.
 */

export interface Spring {
  stiffness: number;
  damping: number;
}

/** The wheel's own turn: unhurried, no swing back. */
export const IDLE_SPRING: Spring = { stiffness: 60, damping: 15 };
/** After the hand lets go: quicker, with a trace of overshoot. */
export const HAND_SPRING: Spring = { stiffness: 120, damping: 20 };

/** Share of a card's travel that counts as a deliberate swipe. */
export const SWIPE_THRESHOLD = 0.12;

/** The slot of a card, in `[-n / 2, n / 2)`. */
export function slotAt(home: number, position: number, n: number): number {
  const half = n / 2;
  return ((((home - position + half) % n) + n) % n) - half;
}

/** One integration step. `dt` is in seconds. */
export function stepSpring(
  position: number,
  velocity: number,
  target: number,
  spring: Spring,
  dt: number,
): { position: number; velocity: number; settled: boolean } {
  // Small fixed steps, so a slow frame cannot make the spring unstable.
  let x = position;
  let v = velocity;
  const STEP = 1 / 240;
  for (let left = dt; left > 0; left -= STEP) {
    const h = Math.min(left, STEP);
    v += (spring.stiffness * (target - x) - spring.damping * v) * h;
    x += v * h;
  }
  const settled = Math.abs(target - x) < 0.0005 && Math.abs(v) < 0.005;
  return settled ? { position: target, velocity: 0, settled } : { position: x, velocity: v, settled };
}

/**
 * Where the wheel goes when the hand lets go.
 *
 * Without the threshold, anything under half a card's travel sprang back to
 * where it started, which read as the wheel refusing the swipe.
 *
 * @param position where the hand left the wheel
 * @param origin the card that stood in front when the press began
 * @param coast how many cards the throw would still carry, signed
 * @param limit the most cards one gesture may turn
 */
export function releaseTarget({
  position,
  origin,
  coast,
  limit,
}: {
  position: number;
  origin: number;
  coast: number;
  limit: number;
}): number {
  const moved = position - origin;
  const projected = moved + coast;
  let by = Math.round(projected);
  if (by === 0 && Math.abs(moved) >= SWIPE_THRESHOLD) by = Math.sign(moved);
  // A throw that ends against its own drag stays where the hand took it.
  if (Math.abs(moved) >= SWIPE_THRESHOLD && Math.sign(by) === -Math.sign(moved)) by = Math.sign(moved);
  return origin + Math.max(-limit, Math.min(limit, by));
}
