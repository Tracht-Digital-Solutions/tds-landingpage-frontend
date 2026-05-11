import { useEffect } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToAnchor(id: string) {
  if (!lenisInstance) return;
  const el = document.getElementById(id);
  if (el) lenisInstance.scrollTo(el, { offset: -80 });
}

/**
 * Mount once at the root of the layout. Lenis hijacks the scroll wheel
 * and produces the smooth-scroll feel; SectionSnap then queries `getLenis()`
 * to drive snap targets through the same instance.
 *
 * Skip on mobile-class touch devices — Lenis on iOS/Android Safari tends
 * to fight native momentum-scroll and ends up feeling worse than the
 * platform default.
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
    lenisInstance = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
