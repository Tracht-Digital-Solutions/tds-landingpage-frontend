/**
 * What the drawn cursor does over a control (2026-10-05).
 *
 * First version, same day: the cursor flew into an action control and shrank
 * to nothing. Julian dropped the snapping the same afternoon — the cursor now
 * STAYS on the pointer and takes the INVERTED colour of the control under it
 * (`islands/CustomCursor.tsx`). A navy button gets a pale yellow cursor, a
 * pink one a green-teal one: always the opposite of what it is on, so it
 * never sinks into the button it is pressing.
 *
 * The native pointer is hidden on the whole page while the drawn cursor runs
 * (`html[data-cursor-absorb]` in `styles/global.css`); the attribute keeps
 * its name because the CSS and the docs key on it.
 *
 * "Control" means something that does an action, not navigation and not a
 * field: buttons, button roles, submit inputs, disclosure summaries, and the
 * links that are DRAWN as buttons (`.btn`, the CTAs).
 */

/** The attribute on <html> while the drawn cursor is the only cursor. */
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

/** The action control the pointer is over, or null. */
export function actionTarget(el: Element | null): HTMLElement | null {
  return el?.closest<HTMLElement>(ACTION_SELECTOR) ?? null;
}

export type Rgba = [r: number, g: number, b: number, a: number];

/** The inverse of a colour, alpha dropped — the cursor is always opaque. */
export function invertRgb([r, g, b]: Rgba): string {
  return `rgb(${255 - r} ${255 - g} ${255 - b})`;
}
