import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Mount once at the root of the layout. Lenis hijacks the scroll
 * wheel and produces the smooth-scroll feel for desktop.
 *
 * Skip on coarse-pointer (touch) devices — Lenis on iOS/Android
 * Safari fights native momentum-scroll and ends up feeling worse
 * than the platform default.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)").matches;
    if (isCoarsePointer) return;

    // Gentle ease-out-back: the scroll settles a hair past its target and
    // eases back, giving the page a subtle bounce as it comes to rest.
    // `overshoot` is kept small so anchor jumps land softly, not nauseously.
    const overshoot = 1.05;
    const easeOutBack = (t: number) => {
      const c3 = overshoot + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
    };

    const lenis = new Lenis({
      duration: 1.2,
      easing: easeOutBack,
      smoothWheel: true,
    });

    // Expose the instance so non-Lenis callers (e.g. the BackToTop
    // button) can drive programmatic scrolls through Lenis instead of
    // native scrollTo, which Lenis would otherwise fight.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return null;
}
