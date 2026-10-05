/**
 * The cursor disappears INTO a button that does something (2026-10-05).
 *
 * Julian: when the pointer hovers a button that performs an action, the
 * cursor vanishes into it, animated, and reappears, animated, once the
 * pointer has left. `islands/CustomCursor.tsx` does the drawing: its dot and
 * ring fly to the button's centre and shrink to nothing on a spring, and pop
 * back out to the pointer with a little overshoot. While the custom cursor
 * runs, the NATIVE pointer is hidden over these targets
 * (`html[data-cursor-absorb]` in `styles/global.css`) — otherwise nothing
 * would have disappeared at all.
 *
 * "Does something" means a control, not navigation and not a field: buttons,
 * button roles, submit inputs, disclosure summaries, and the links that are
 * DRAWN as buttons (`.btn`, the CTAs). Plain text links keep the ring growing
 * over them; text fields keep their caret.
 */

/** The attribute on <html> while the custom cursor runs and absorbs. */
export const CURSOR_ABSORB_ATTR = "data-cursor-absorb";

export const ACTION_SELECTOR = [
  "button:not(:disabled)",
  "[role='button']",
  "input[type='submit']:not(:disabled)",
  "input[type='button']:not(:disabled)",
  "input[type='reset']:not(:disabled)",
  "summary",
  ".btn",
  "[data-cta]",
].join(", ");

/**
 * Bars that are themselves a pointer instrument stay out: the floating page
 * scrollbar's arrows are 16px targets at the window edge, and swallowing the
 * cursor there would leave nothing to aim with.
 */
const EXCLUDED = ".page-scrollbar";

/** The action control the pointer is over, or null. */
export function actionTarget(el: Element | null): HTMLElement | null {
  const hit = el?.closest<HTMLElement>(ACTION_SELECTOR) ?? null;
  if (!hit || hit.closest(EXCLUDED)) return null;
  return hit;
}

/**
 * One step of the absorb spring. `value` 0 = the cursor is out, 1 = it is
 * inside the button. Underdamped, so the way OUT overshoots below 0 — the
 * cursor comes back a touch larger than its size and settles: the "pop".
 */
export function absorbStep(
  value: number,
  velocity: number,
  target: number,
  dt: number,
): [value: number, velocity: number] {
  const STIFFNESS = 320;
  const DAMPING = 20;
  const v = velocity + ((target - value) * STIFFNESS - velocity * DAMPING) * dt;
  return [value + v * dt, v];
}
