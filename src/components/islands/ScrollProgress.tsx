import { useEffect, useState } from "react";

/**
 * Thin reading-progress bar fixed to the top of the viewport. Tracks
 * window scroll position against documentElement.scrollHeight; uses
 * requestAnimationFrame to keep updates in the same paint cycle as
 * Lenis-driven smooth scrolling.
 *
 * Renders nothing until the page is actually scrollable — short pages
 * (e.g. /preise on tall viewports) would otherwise show a permanently
 * full bar.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollable, setScrollable] = useState(false);

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
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
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
        className="h-full origin-left bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-accent-pink)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
