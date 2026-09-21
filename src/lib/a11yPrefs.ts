/**
 * The visitor's own accessibility settings, from the tools in the floating
 * CTA menu (`components/A11yTools.astro`, 2026-09-21).
 *
 * Three switches, each a boolean attribute on `<html>` that CSS in
 * `styles/global.css` answers:
 *
 * - `data-a11y-text`     — larger text: the root size grows, and everything
 *   sized in `rem` (which is nearly everything) grows with it.
 * - `data-a11y-contrast` — muted text becomes full-strength ink and links are
 *   underlined, so no information rides on a pale grey or on colour alone.
 * - `data-a11y-motion`   — motion off, the same as the operating system's
 *   `prefers-reduced-motion: reduce`, for visitors who cannot or do not know
 *   how to set that. Every JS motion path asks `lessMotion()` rather than the
 *   media query alone.
 *
 * Stored in localStorage and applied by `A11Y_BOOT_SCRIPT`, inline and first
 * in `<head>`, so a page never paints at the wrong size and then jumps. Storage
 * may be blocked (private mode); the switches then last for the page.
 */
export const A11Y_STORAGE_KEY = "lp-a11y";

export const A11Y_PREFS = ["text", "contrast", "motion"] as const;
export type A11yPref = (typeof A11Y_PREFS)[number];

export const a11yAttr = (pref: A11yPref) => `data-a11y-${pref}`;

/** Inline in `<head>`, before anything paints. No imports — it is a string. */
export const A11Y_BOOT_SCRIPT = `try{var p=JSON.parse(localStorage.getItem("${A11Y_STORAGE_KEY}")||"{}"),r=document.documentElement;${A11Y_PREFS.map(
  (pref) => `if(p.${pref}===true)r.setAttribute("${a11yAttr(pref)}","");`,
).join("")}}catch(e){}`;

/** Less motion: the operating system's setting OR the site's own switch. */
export function lessMotion(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.hasAttribute(a11yAttr("motion"))
  );
}

export function readPrefs(): Record<A11yPref, boolean> {
  const root = document.documentElement;
  return Object.fromEntries(A11Y_PREFS.map((pref) => [pref, root.hasAttribute(a11yAttr(pref))])) as Record<
    A11yPref,
    boolean
  >;
}

export function setPref(pref: A11yPref, on: boolean): void {
  document.documentElement.toggleAttribute(a11yAttr(pref), on);
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(readPrefs()));
  } catch {
    /* storage blocked: the switch still holds for this page */
  }
}
