/**
 * The page chrome that used to be React islands — one entry, mounted once from
 * `Layout.astro` (2026-10-22).
 *
 * The theme toggle, the consent link, smooth scrolling, the drawn cursor and
 * the reading progress were five islands, and any one of them put the whole
 * React runtime on every page. None of them used React for more than a
 * `useEffect`. Now:
 *
 * - The toggle and the consent link are tds-shared's plain-DOM twins
 *   (`tds-shared/dom`), wired at once — they are controls, and the toggle's
 *   icon already follows the theme in CSS.
 * - Smooth scrolling, the cursor and the progress bar start at idle, the
 *   timing `client:idle` gave them, each in its own chunk (Lenis is the big
 *   one), so none of it competes with the first paint. Until then an anchor
 *   jump is the browser's own smooth scroll and the pointer is the native one.
 */
import { mountConsentLinks, mountThemeToggles } from "@tracht-digital-solutions/tds-shared/dom";

function whenIdle(run: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(run, { timeout: 2000 });
  else window.setTimeout(run, 200);
}

export function bootChrome(): void {
  mountThemeToggles();
  mountConsentLinks();

  whenIdle(() => {
    // A bare page (embeds, previews) gets none of these, as before.
    if (document.body.hasAttribute("data-bare")) return;
    if (document.body.dataset.lenis === undefined) {
      void import("./smoothScroll").then(({ mountSmoothScroll }) => mountSmoothScroll());
    }
    const ring = document.querySelector<HTMLElement>("[data-cursor-ring]");
    const dot = document.querySelector<HTMLElement>("[data-cursor-dot]");
    if (ring && dot) void import("./customCursor").then(({ mountCustomCursor }) => mountCustomCursor(ring, dot));
    const track = document.querySelector<HTMLElement>("[data-scroll-progress]");
    const bar = document.querySelector<HTMLElement>("[data-scroll-progress-bar]");
    if (track && bar) void import("./scrollProgress").then(({ mountScrollProgress }) => mountScrollProgress(track, bar));
  });
}
