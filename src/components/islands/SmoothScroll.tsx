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

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
