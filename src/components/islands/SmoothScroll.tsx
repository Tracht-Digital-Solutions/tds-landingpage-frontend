import { useEffect } from "react";
import Lenis from "lenis";

type ScrollTarget = number | HTMLElement | string;

declare global {
  interface Window {
    /**
     * Bounce-eased scroll used for click-to-section jumps (nav links, CTAs,
     * logo, back-to-top). Plain mouse-wheel / touch scrolling does NOT go
     * through this — it uses the platform's default (Lenis expo ease-out on
     * desktop, native momentum on touch).
     */
    tdsScrollTo?: (target: ScrollTarget, opts?: { immediate?: boolean }) => void;
  }
}

/**
 * Mount once at the root of the layout. The playful ease-out-back *bounce* is
 * reserved for programmatic jumps triggered by clicking something (nav links,
 * CTAs, logo, back-to-top) — never for plain scrolling.
 *
 * Two implementations, same feel:
 *  - **Fine pointer (desktop):** Lenis hijacks the wheel for a smooth
 *    expo ease-out, and click-jumps run through `lenis.scrollTo` with the
 *    bounce easing.
 *  - **Coarse pointer (touch):** Lenis is skipped entirely — on iOS/Android
 *    it fights native momentum-scroll and feels worse than the platform
 *    default. Wheel/touch scrolling stays fully native; only click-jumps are
 *    driven, via a self-contained `requestAnimationFrame` tween that reuses
 *    the exact same bounce easing so mobile section-jumps bounce like desktop.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduce = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Gentle ease-out-back — settles a hair past the target and eases back.
    // Used ONLY for click-jumps, never for wheel/touch scroll.
    const overshoot = 1.05;
    const bounce = (t: number) => {
      const c3 = overshoot + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
    };

    // Leave a little room under the fixed floating header when jumping to a
    // section so its heading isn't tucked beneath the bar.
    const HEADER_OFFSET = -88;
    const JUMP_DURATION_MS = 1200;

    // Delegated handler factory: in-page anchor links (nav, footer, CTAs)
    // bounce-jump through `scrollTo` instead of the browser's instant/native
    // scroll. Shared by both the desktop (Lenis) and touch (rAF) paths.
    const makeAnchorClickHandler =
      (scrollTo: NonNullable<Window["tdsScrollTo"]>) => (event: MouseEvent) => {
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
        scrollTo(el);
        history.pushState(null, "", url.hash);
      };

    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)").matches;

    // ── Touch path: native scrolling + self-contained bounce for click-jumps ──
    if (isCoarsePointer) {
      let rafId = 0;
      const cancelTween = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      };

      const tdsScrollTo: Window["tdsScrollTo"] = (target, opts) => {
        cancelTween();
        const reduce = prefersReduce();
        const startY = window.scrollY;
        const maxY = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const el =
          typeof target === "string" ? document.querySelector(target) : target;
        const rawDest =
          typeof el === "number"
            ? el
            : el instanceof HTMLElement
              ? startY + el.getBoundingClientRect().top + HEADER_OFFSET
              : startY;
        const destY = Math.min(Math.max(rawDest, 0), maxY);
        const dist = destY - startY;

        if ((opts?.immediate ?? reduce) || dist === 0) {
          window.scrollTo(0, destY);
          return;
        }

        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / JUMP_DURATION_MS);
          window.scrollTo(0, startY + dist * bounce(t));
          rafId = t < 1 ? requestAnimationFrame(step) : 0;
        };
        rafId = requestAnimationFrame(step);
      };
      window.tdsScrollTo = tdsScrollTo;

      // Hand control straight back to the platform the moment the user
      // starts scrolling themselves, so the tween never fights their touch.
      const onUserScroll = () => cancelTween();
      window.addEventListener("touchstart", onUserScroll, { passive: true });
      window.addEventListener("wheel", onUserScroll, { passive: true });

      const onClick = makeAnchorClickHandler(tdsScrollTo);
      document.addEventListener("click", onClick);

      return () => {
        cancelTween();
        window.removeEventListener("touchstart", onUserScroll);
        window.removeEventListener("wheel", onUserScroll);
        document.removeEventListener("click", onClick);
        delete window.tdsScrollTo;
      };
    }

    // ── Desktop path: Lenis smooth wheel + bounce click-jumps ──
    const lenis = new Lenis({
      duration: 1.1,
      // Plain expo ease-out for wheel scrolling — smooth, no overshoot.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    const tdsScrollTo: Window["tdsScrollTo"] = (target, opts) => {
      const reduce = prefersReduce();
      const offset = typeof target === "number" ? 0 : HEADER_OFFSET;
      lenis.scrollTo(target, {
        offset,
        duration: JUMP_DURATION_MS / 1000,
        easing: bounce,
        immediate: opts?.immediate ?? reduce,
      });
    };
    window.tdsScrollTo = tdsScrollTo;

    const onClick = makeAnchorClickHandler(tdsScrollTo);
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
