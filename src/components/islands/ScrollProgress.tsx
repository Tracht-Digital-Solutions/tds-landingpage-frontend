import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Thin reading-progress bar on the LOWER EDGE OF THE SITE HEADER. Tracks
 * window scroll position against documentElement.scrollHeight; uses
 * requestAnimationFrame to keep updates in the same paint cycle as
 * Lenis-driven smooth scrolling.
 *
 * It was `fixed` to the top of the viewport until 2026-09-29 — a separate line
 * a few pixels above a bar that floats with its own margin, so neither ever
 * looked like it belonged to the other. Mounted inside `Header.astro` it is
 * `absolute` instead and inherits the bar's docking morph: it narrows from
 * full-bleed to 56rem and lifts off the edge with it. The positioning lives
 * here rather than in the header's stylesheet because it is this component's
 * own box; the header only provides the containing block.
 *
 * Renders nothing until the page is actually scrollable — short pages
 * (e.g. /preise on tall viewports) would otherwise show a permanently
 * full bar.
 *
 * The bar's width is written STRAIGHT to the node, not held in state. It
 * changes on every frame of every scroll, and a `useState` for it meant a
 * React render, a reconciliation and a commit per frame, for the whole life
 * of the page, to move one transform by a fraction of a percent. `scrollable`
 * stays state because it changes about once per page and decides whether
 * anything is mounted at all.
 */
export default function ScrollProgress() {
  const [scrollable, setScrollable] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);

  /**
   * Callback ref rather than a plain one: the bar is mounted by the SAME
   * state flip that first measures the page, so on that render there is no
   * node yet to write to and the bar would start at zero however far down
   * the page a reload restored the visitor.
   */
  const attachBar = useCallback((node: HTMLDivElement | null) => {
    barRef.current = node;
    if (node) node.style.transform = `scaleX(${progressRef.current})`;
  }, []);

  useEffect(() => {
    let rafId = 0;

    // Mirrors the state React holds. `setScrollable` is called from inside
    // the scroll rAF, and React only bails out of a re-render AFTER it has
    // entered the update path — on a long page that is a scheduler entry
    // and a bailout check per frame, for a value that flips once. Comparing
    // here means the setter is not reached at all while scrolling.
    let scrollableNow = false;
    const setScrollableOnce = (next: boolean) => {
      if (next === scrollableNow) return;
      scrollableNow = next;
      setScrollable(next);
    };

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) {
        setScrollableOnce(false);
        return;
      }
      setScrollableOnce(true);
      progressRef.current = Math.min(1, Math.max(0, window.scrollY / max));
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progressRef.current})`;
      }
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
  }, []);

  if (!scrollable) return null;

  return (
    <div
      aria-hidden="true"
      // `z-2`: above the header's glass (`::before`, level 0) and its nav
      // (level 1). Inset from both ends and rounded, because the bar it sits on
      // is a full pill — a straight line across its whole width would leave the
      // shape at the curves. `overflow-hidden` keeps the growing fill inside
      // that rounding.
      className="absolute bottom-0 left-5 right-5 z-2 h-[2px] overflow-hidden rounded-full pointer-events-none"
    >
      <div
        ref={attachBar}
        className="h-full origin-left bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-accent-pink)]"
        style={{ transform: `scaleX(${progressRef.current})` }}
      />
    </div>
  );
}
