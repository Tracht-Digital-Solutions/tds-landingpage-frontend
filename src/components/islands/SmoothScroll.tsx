import { useEffect } from "react";
import Lenis from "lenis";

type ScrollTarget = number | HTMLElement | string;

declare global {
  interface Window {
    /**
     * Bounce-eased scroll used for click-to-section jumps (nav links, CTAs,
     * logo, back-to-top). Plain mouse-wheel scrolling does NOT go through
     * this — it uses Lenis's default non-bouncy easing.
     */
    tdsScrollTo?: (target: ScrollTarget, opts?: { immediate?: boolean }) => void;
  }
}

/**
 * Mount once at the root of the layout. Lenis hijacks the scroll wheel and
 * produces the smooth-scroll feel for desktop. Wheel scrolling stays a plain
 * expo ease-out; the playful ease-out-back *bounce* is reserved for
 * programmatic jumps triggered by clicking something (see `window.tdsScrollTo`
 * + the delegated anchor-click handler below).
 *
 * Skip on coarse-pointer (touch) devices — Lenis on iOS/Android Safari fights
 * native momentum-scroll and ends up feeling worse than the platform default.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)").matches;
    if (isCoarsePointer) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Plain expo ease-out for wheel scrolling — smooth, no overshoot.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Gentle ease-out-back — settles a hair past the target and eases back.
    // Used ONLY for click-jumps, never for wheel scroll.
    const overshoot = 1.05;
    const bounce = (t: number) => {
      const c3 = overshoot + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
    };

    // Leave a little room under the fixed floating header when jumping to a
    // section so its heading isn't tucked beneath the bar.
    const HEADER_OFFSET = -88;

    const tdsScrollTo: Window["tdsScrollTo"] = (target, opts) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const offset = typeof target === "number" ? 0 : HEADER_OFFSET;
      lenis.scrollTo(target, {
        offset,
        duration: 1.2,
        easing: bounce,
        immediate: opts?.immediate ?? reduce,
      });
    };
    window.tdsScrollTo = tdsScrollTo;

    // Delegated handler: in-page anchor links (nav, footer, CTAs) bounce-jump
    // through Lenis instead of the browser's instant/native scroll.
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const link = (event.target as Element | null)?.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;

      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      const samePath =
        url.pathname.replace(/\/+$/, "") === location.pathname.replace(/\/+$/, "");
      if (!samePath || !url.hash || url.hash === "#") return;

      let el: Element | null = null;
      try {
        el = document.querySelector(url.hash);
      } catch {
        el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      }
      if (!(el instanceof HTMLElement)) return;

      event.preventDefault();
      tdsScrollTo(el);
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
      delete window.tdsScrollTo;
    };
  }, []);

  return null;
}
