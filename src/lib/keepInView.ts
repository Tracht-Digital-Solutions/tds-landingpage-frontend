/**
 * Something opened on a phone stays on screen (2026-10-19, asked for: "Wenn
 * man etwas aufklappt auf der Mobile View soll dieser Part im Bildschirm
 * sein").
 *
 * An accordion row that opens near the bottom edge grew its answer below the
 * fold, and one that closed a longer row above it slid the opened title up
 * past the header. After the fold has played, the page scrolls just far
 * enough that the title and its content fit between the header and the
 * floating pill — both clearances come from `<html>`'s `scroll-padding`
 * (global.css). A part taller than the screen lands with its title at the
 * top; nothing is scrolled when it already fits.
 *
 * The scroll goes through `window.tdsScrollTo` (`SmoothScroll.tsx`), which
 * also keeps the section settle from pulling the page elsewhere afterwards.
 */

/**
 * How far to scroll (positive = down) so the span `top`–`bottom` lies inside
 * `viewTop`–`viewBottom`. When it is taller than the view, its top wins.
 */
export function revealDelta(top: number, bottom: number, viewTop: number, viewBottom: number): number {
  if (top < viewTop) return top - viewTop;
  if (bottom <= viewBottom) return 0;
  return Math.max(0, Math.min(bottom - viewBottom, top - viewTop));
}

/** The width below which the site's accordions are the phone layout. */
export const PHONE_QUERY = "(max-width: 47.99rem)";

let timer = 0;

const padding = (value: string) => {
  const px = Number.parseFloat(value);
  return Number.isFinite(px) ? px : 0;
};

/**
 * Scroll so `from` (the title that was tapped) down to `to` (what it opened)
 * is on screen, once `delay` ms of fold animation have passed. A newer call
 * replaces a pending one.
 */
export function keepInView(from: HTMLElement, to: HTMLElement = from, delay = 0): void {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    const root = getComputedStyle(document.documentElement);
    const delta = revealDelta(
      from.getBoundingClientRect().top,
      to.getBoundingClientRect().bottom,
      padding(root.scrollPaddingTop),
      window.innerHeight - padding(root.scrollPaddingBottom),
    );
    if (Math.abs(delta) < 1) return;
    const target = window.scrollY + delta;
    if (window.tdsScrollTo) window.tdsScrollTo(target);
    else {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
    }
  }, delay);
}
