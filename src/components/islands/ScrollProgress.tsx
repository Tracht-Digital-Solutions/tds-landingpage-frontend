import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Thin reading-progress bar fixed to the top of the viewport. Tracks
 * window scroll position against documentElement.scrollHeight; uses
 * requestAnimationFrame to keep updates in the same paint cycle as
 * Lenis-driven smooth scrolling.
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

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) {
        setScrollable(false);
        return;
      }
      setScrollable(true);
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
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
    >
      <div
        ref={attachBar}
        className="h-full origin-left bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-accent-pink)]"
        style={{ transform: `scaleX(${progressRef.current})` }}
      />
    </div>
  );
}
