import { useEffect } from "react";
import Lenis from "lenis";
import { planJump } from "~/lib/scrollJump";
import { createScrollLock } from "~/lib/scrollLock";

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

/** How long a click-jump takes, both paths. */
const JUMP_DURATION_MS = 1200;

/**
 * Clearance for the fixed floating header, read back off `<html>`'s
 * `scroll-padding-top` (set in `styles/global.css`) instead of a constant
 * kept here.
 *
 * One value then drives all four kinds of section jump: these tweens, the
 * browser's own fragment landing on a cross-page `/#about`, back/forward
 * restoration, and find-in-page / keyboard focus. It is also responsive —
 * the bar is shorter below `lg` — which a JS constant was not.
 *
 * `scroll-padding-top` defaults to the keyword `auto`, which parses to NaN;
 * treat that as no clearance rather than shifting every jump by NaN px.
 */
function headerClearance(): number {
  const raw = getComputedStyle(document.documentElement).scrollPaddingTop;
  const px = Number.parseFloat(raw);
  return Number.isFinite(px) ? px : 0;
}

/** Furthest the document can scroll. */
function maxScrollY(): number {
  const doc = document.documentElement;
  return Math.max(0, doc.scrollHeight - doc.clientHeight);
}

/**
 * Resolve any accepted target to an absolute document Y, then plan the jump
 * against the live layout. A number is taken as-is (back-to-top passes 0);
 * an element gets the header clearance subtracted.
 */
function planFor(target: ScrollTarget) {
  const startY = window.scrollY;
  const node =
    typeof target === "string" ? document.querySelector(target) : target;

  const targetY =
    typeof node === "number"
      ? node
      : node instanceof HTMLElement
        ? startY + node.getBoundingClientRect().top - headerClearance()
        : startY;

  return { startY, ...planJump({ startY, targetY, maxY: maxScrollY() }) };
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
 *
 * Both paths plan through `~/lib/scrollJump`, so the destination pixel and
 * the curve are identical; only the thing doing the writing differs.
 *
 * While a jump is in flight the page belongs to it: wheel, touch and the
 * scroll keys are swallowed (`~/lib/scrollLock`) until it lands, so the
 * visitor and the tween are never writing the same scroll position in the
 * same frame. Clicking a DIFFERENT section mid-jump still works and simply
 * retargets — the lock is on scrolling, not on navigating.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduce = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The page belongs to the tween while a jump is running: wheel, touch
    // and the scroll keys are swallowed until it lands. See ~/lib/scrollLock
    // for what stays live (zoom, typing, Tab/Escape) and why. The safety
    // window is the jump's own duration plus a margin, so even a jump that
    // never reports completion cannot leave the page frozen.
    const inputLock = createScrollLock({
      maxDurationMs: JUMP_DURATION_MS + 600,
    });

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
        inputLock.release();
      };

      // `behavior: "instant"` is load-bearing, not tidiness. tds-shared's
      // base.css sets `html { scroll-behavior: smooth }`, and the two-argument
      // `window.scrollTo(x, y)` form scrolls with behavior `auto`, which
      // resolves to that CSS value. Every frame below therefore used to hand
      // the browser a NEW native smooth scroll to retarget, so the page
      // crawled or sat still and the jump never arrived — the reason a
      // section jump did nothing at all on a phone. Desktop never showed it
      // because Lenis writes its own scroll position with "instant" too.
      const jumpTo = (y: number) =>
        window.scrollTo({ top: y, behavior: "instant" });

      const tdsScrollTo: Window["tdsScrollTo"] = (target, opts) => {
        cancelTween();
        const { startY, destY, distance, easing } = planFor(target);

        if ((opts?.immediate ?? prefersReduce()) || distance === 0) {
          // Nothing to protect: the position changes in one frame, or not
          // at all. Locking here would only cost the visitor input for a
          // jump that has already happened.
          jumpTo(destY);
          return;
        }

        inputLock.engage();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / JUMP_DURATION_MS);
          jumpTo(startY + distance * easing(t));
          if (t < 1) {
            rafId = requestAnimationFrame(step);
            return;
          }
          rafId = 0;
          inputLock.release();
        };
        rafId = requestAnimationFrame(step);
      };
      window.tdsScrollTo = tdsScrollTo;

      // There used to be touchstart/wheel listeners here that ABANDONED the
      // tween the moment the visitor touched the screen, on the reasoning
      // that the platform should get control straight back. In practice the
      // tap that starts a jump is often still on the glass a frame later —
      // and the finger resting on a phone after tapping a nav link cancelled
      // the jump it had just asked for, leaving the page stranded between two
      // sections. The lock is the other half of that decision: rather than
      // letting the tween lose the fight, there is no fight for the ~1.2s it
      // runs.
      const onClick = makeAnchorClickHandler(tdsScrollTo);
      document.addEventListener("click", onClick);

      return () => {
        cancelTween();
        inputLock.destroy();
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
      const { destY, distance, easing } = planFor(target);
      const immediate = opts?.immediate ?? prefersReduce();
      const animated = !immediate && distance !== 0;

      // Two locks, one for each thing that can move the page. Lenis owns the
      // wheel here, so its own "lock" option is what stops the visitor retargeting
      // the tween mid-flight; it knows nothing about the keyboard, which the
      // browser still scrolls natively, so the shared input lock covers that
      // (and the touchpad on a hybrid machine, where the desktop path runs).
      if (animated) inputLock.engage();
      else inputLock.release();
      // Hand Lenis a resolved NUMBER: element lookup, header clearance and
      // the clamp to the document's scroll range all happened in `planFor`,
      // so both paths land on the same pixel. It also keeps Lenis from
      // applying `scroll-padding-top` a second time — it only does that for
      // element targets, which would double the clearance.
      lenis.scrollTo(destY, {
        duration: JUMP_DURATION_MS / 1000,
        easing,
        immediate,
        lock: animated,
        // A locked Lenis REFUSES a further scrollTo, and that refusal is not
        // what the lock is for: the visitor clicking a second nav link is
        // asking for a different section, not fighting the tween. Without
        // this, that click did nothing on desktop while the touch path
        // happily retargeted — the two paths exist to feel the same.
        force: true,
        onComplete: () => inputLock.release(),
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
      inputLock.destroy();
      document.removeEventListener("click", onClick);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
      delete window.tdsScrollTo;
    };
  }, []);

  return null;
}
