/**
 * What the drawn cursor does over a control (2026-10-05).
 *
 * First version, same day: the cursor flew into an action control and shrank
 * to nothing; the second took the control's INVERTED colour (a navy button
 * gave a pale yellow cursor, a pink one a mint one). Julian wanted neither:
 * the cursor stays on the pointer and turns WHITE on a dark control and the
 * brand BLUE on a light one (`islands/CustomCursor.tsx`) — two colours that
 * belong to the site, chosen by how bright the control is.
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
  // Links DRAWN as buttons that carry no `data-cta` — the same controls the
  // shadow list in global.css names. The hero's second button was missed.
  ".hero-cta",
  ".svc-explorer__more",
  ".first-call__cta",
  ".faq-cta",
  ".property-tab",
  ".lp-ink",
].join(", ");

/** The action control the pointer is over, or null. */
export function actionTarget(el: Element | null): HTMLElement | null {
  return el?.closest<HTMLElement>(ACTION_SELECTOR) ?? null;
}

export type Rgba = [r: number, g: number, b: number, a: number];

/** The cursor over a dark control. */
export const CURSOR_ON_DARK = "#ffffff";
/** The cursor over a light control: the brand navy. */
export const CURSOR_ON_LIGHT = "#050f68";

/** Relative luminance below which a fill counts as dark (0..255 scale). */
const DARK_BELOW = 140;

/** White on a dark control, blue on a light one. */
export function tintForFill([r, g, b]: Rgba): string {
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < DARK_BELOW ? CURSOR_ON_DARK : CURSOR_ON_LIGHT;
}
