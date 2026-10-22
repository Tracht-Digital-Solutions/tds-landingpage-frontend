/**
 * Thin reading-progress bar FIXED TO THE TOP EDGE OF THE WINDOW. Tracks
 * window scroll position against documentElement.scrollHeight; uses
 * requestAnimationFrame to keep updates in the same paint cycle as
 * Lenis-driven smooth scrolling.
 *
 * From 2026-09-29 to 2026-10-05 it sat on the header's lower edge and docked
 * with the bar. Julian wanted it back at the top of the page, so it is
 * mounted once in `Layout.astro` again, full width, above the header (z-50
 * over its z-40).
 *
 * The markup is server-rendered in `Layout.astro` with `hidden` and shown
 * only once the page is actually scrollable — short pages (e.g. /preise on
 * tall viewports) would otherwise show a permanently full bar. Until
 * 2026-10-22 this was a React island; React only ever held that one flag.
 *
 * The width is written straight to the node as a transform, once per frame
 * at most. Returns the teardown.
 */
export function mountScrollProgress(track: HTMLElement, bar: HTMLElement): () => void {
  let rafId = 0;
  let scrollable: boolean | null = null;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const next = max > 0;
    // Compared, so a long scroll never touches the attribute again.
    if (next !== scrollable) {
      scrollable = next;
      track.hidden = !next;
    }
    if (!next) return;
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.transform = `scaleX(${progress})`;
  };

  const onScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      update();
    });
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", update);
    if (rafId) cancelAnimationFrame(rafId);
  };
}
