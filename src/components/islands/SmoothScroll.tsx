import { useEffect } from "react";
import Lenis from "lenis";
import { JUMP_MAX_MS, jumpDuration, planJump } from "~/lib/scrollJump";
import {
  classifyWheel,
  WHEEL_PROFILE,
  WHEEL_SAMPLE_SIZE,
  type WheelKind,
  type WheelSample,
} from "~/lib/wheelKind";
import { createScrollLock } from "~/lib/scrollLock";
import { SNAP_DURATION_MS, SNAP_IDLE_MS, settleEasing, snapTarget } from "~/lib/sectionSnap";

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
/**
 * The longest a jump may take. The actual duration follows the distance
 * (`jumpDuration`) — a flat 1200 ms made a short jump crawl.
 */
const JUMP_DURATION_MS = JUMP_MAX_MS;

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

/**
 * Clearance for one target: the header's, plus the target's own
 * `scroll-margin-top`. Sections carry a negative margin that cancels the
 * header's (global.css), so they land with their top edge on the screen's.
 */
function clearanceFor(node: HTMLElement): number {
  const margin = Number.parseFloat(getComputedStyle(node).scrollMarginTop);
  return headerClearance() + (Number.isFinite(margin) ? margin : 0);
}

/** Furthest the document can scroll. */
function maxScrollY(): number {
  const doc = document.documentElement;
  return Math.max(0, doc.scrollHeight - doc.clientHeight);
}

/**
 * Where each top-level section of `<main>` starts, as a scroll position (its
 * top minus the header clearance). Measured when a scroll has come to rest,
 * never per frame.
 */
function sectionStarts(): number[] {
  const y = window.scrollY;
  return Array.from(document.querySelectorAll<HTMLElement>("main section[id]"))
    .filter((section) => !section.parentElement?.closest("main section[id]"))
    .map((section) => y + section.getBoundingClientRect().top - clearanceFor(section));
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
        ? startY + node.getBoundingClientRect().top - clearanceFor(node)
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
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.hasAttribute("data-a11y-motion");

    // The page belongs to the tween while a jump is running: wheel, touch
    // and the scroll keys are swallowed until it lands. See ~/lib/scrollLock
    // for what stays live (zoom, typing, Tab/Escape) and why. The safety
    // window is the jump's own duration plus a margin, so even a jump that
    // never reports completion cannot leave the page frozen.
    const inputLock = createScrollLock({
      maxDurationMs: JUMP_DURATION_MS + 600,
    });

    /**
     * Gentle section snap (2026-10-12, `lib/sectionSnap.ts`): once a scroll
     * has been still for a moment near the start of a section, the page
     * settles onto it. Never after a click-jump (it chose its own target),
     * never while a pointer holds the page (the floating scroll bar), a
     * dialog is open or someone is typing, and not under reduced motion.
     */
    let skipNextSnap = false;
    let pointerHeld = false;
    const onPointerDown = () => (pointerHeld = true);
    const onPointerUp = () => (pointerHeld = false);
    window.addEventListener("pointerdown", onPointerDown, { passive: true, capture: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true, capture: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true, capture: true });
    const snapBlocked = () =>
      prefersReduce() ||
      pointerHeld ||
      document.querySelector("dialog[open]") !== null ||
      document.activeElement?.matches("input, textarea, select, [contenteditable]") === true;
    /** The position to settle on now, or null. Consumes the click-jump flag. */
    const settleTarget = (): number | null => {
      if (skipNextSnap) {
        skipNextSnap = false;
        return null;
      }
      if (snapBlocked()) return null;
      return snapTarget(window.scrollY, sectionStarts(), window.innerHeight, maxScrollY());
    };
    const removeSnapListeners = () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onPointerUp, true);
    };

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
        cancelSettle();
        skipNextSnap = true;
        const { startY, destY, distance, easing } = planFor(target);

        if ((opts?.immediate ?? prefersReduce()) || distance === 0) {
          // Nothing to protect: the position changes in one frame, or not
          // at all. Locking here would only cost the visitor input for a
          // jump that has already happened.
          jumpTo(destY);
          return;
        }

        inputLock.engage();
        const durationMs = jumpDuration(distance);
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
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

      // The settle: after native scrolling (momentum included) has been still
      // for a moment and no finger is on the glass. A new touch cancels it.
      let settleRaf = 0;
      let settleTimer = 0;
      let touching = false;
      function cancelSettle() {
        if (settleRaf) cancelAnimationFrame(settleRaf);
        settleRaf = 0;
        window.clearTimeout(settleTimer);
      }
      const settle = () => {
        if (touching || rafId || settleRaf) return;
        const destY = settleTarget();
        if (destY === null) return;
        const startY = window.scrollY;
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / SNAP_DURATION_MS);
          jumpTo(startY + (destY - startY) * settleEasing(t));
          settleRaf = t < 1 ? requestAnimationFrame(step) : 0;
        };
        settleRaf = requestAnimationFrame(step);
      };
      const onScroll = () => {
        if (settleRaf || rafId) return;
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(settle, SNAP_IDLE_MS);
      };
      const onTouchStart = () => {
        touching = true;
        cancelSettle();
      };
      const onTouchEnd = () => {
        touching = false;
        onScroll();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });

      return () => {
        cancelTween();
        cancelSettle();
        inputLock.destroy();
        removeSnapListeners();
        document.removeEventListener("click", onClick);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchEnd);
        delete window.tdsScrollTo;
      };
    }

    // ── Desktop path: Lenis smooth wheel + bounce click-jumps ──
    const lenis = new Lenis({
      duration: WHEEL_PROFILE.mouse.duration,
      // Plain expo ease-out for wheel scrolling — smooth, no overshoot.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // While a modal is open the wheel belongs to it (2026-10-12): Lenis
      // listens on window and used to turn every wheel inside a dialog into a
      // scroll of the page behind it. Prevented events scroll natively; the
      // page itself is locked by `html[data-modal-open]` (lib/motion/dialog.ts).
      prevent: () => document.documentElement.hasAttribute("data-modal-open"),
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    /**
     * Tell the stylesheet that a library owns the scroll now.
     *
     * `tds-shared/styles/base.css` sets `html { scroll-behavior: smooth }` for
     * every site, and on this one Lenis smooths the wheel on top of it — two
     * smoothings on one scroll. That is what the `behavior: "instant"` below
     * (and the note at it) has been working around: a `scrollTo` whose
     * `behavior` resolves to `auto` picks up the CSS value, so a programmatic
     * jump was handed to the CSS engine while Lenis was already tweening it,
     * and on a phone the jump never arrived.
     *
     * `global.css` reverts `scroll-behavior` to `auto` while this attribute is
     * set, so the CSS smoothing exists exactly where nothing else is doing it:
     * a coarse pointer, reduced motion, or no JavaScript at all.
     */
    document.body.dataset.lenis = "on";

    /**
     * Adapt the smoothing to what the visitor is actually holding.
     *
     * A mouse wheel sends coarse notches that want a long tween to become a
     * glide; a trackpad sends a continuous stream the operating system has
     * already given momentum to, and a second momentum on top of that is what
     * makes a page feel late under the hand. The device is inferred from the
     * events (`lib/wheelKind.ts`), never from the user agent.
     *
     * It starts on the mouse profile — the one the site shipped with, and the
     * safe way round: too smooth for a trackpad is pleasant, too tight for a
     * wheel is a staircase. Once a verdict forms it STAYS: a classifier that
     * flipped mid-gesture would change the feel under a hand that is still
     * moving.
     */
    let wheelKind: WheelKind | null = null;
    const samples: WheelSample[] = [];
    let lastWheelAt = 0;
    const onWheel = (event: WheelEvent) => {
      if (wheelKind) return;
      const now = event.timeStamp;
      samples.push({
        deltaY: event.deltaY,
        deltaX: event.deltaX,
        deltaMode: event.deltaMode,
        gap: lastWheelAt ? now - lastWheelAt : Infinity,
      });
      lastWheelAt = now;
      if (samples.length > WHEEL_SAMPLE_SIZE) samples.shift();
      const verdict = classifyWheel(samples);
      if (!verdict) return;
      wheelKind = verdict;
      // `duration` is the one profile knob Lenis exposes on a live instance.
      lenis.options.duration = WHEEL_PROFILE[verdict].duration;
    };
    window.addEventListener("wheel", onWheel, { passive: true });

    const tdsScrollTo: Window["tdsScrollTo"] = (target, opts) => {
      window.clearTimeout(settleTimer);
      skipNextSnap = true;
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
        duration: jumpDuration(distance) / 1000,
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
      wake();
    };
    window.tdsScrollTo = tdsScrollTo;

    const onClick = makeAnchorClickHandler(tdsScrollTo);
    document.addEventListener("click", onClick);

    // The settle: Lenis reports every frame of a scroll (wheel, keys, the
    // floating bar); once it has been still for a moment, settle near a
    // section start with a short ease-out through Lenis itself.
    let settleTimer = 0;
    let settling = false;
    const settle = () => {
      if (lenis.isScrolling) return;
      const destY = settleTarget();
      if (destY === null) return;
      settling = true;
      lenis.scrollTo(destY, {
        duration: SNAP_DURATION_MS / 1000,
        easing: settleEasing,
      });
      // A timer, not `onComplete`: a settle interrupted by a key or the
      // scroll bar never completes, and the flag would stay up for good.
      window.setTimeout(() => (settling = false), SNAP_DURATION_MS + 120);
      wake();
    };
    const offScroll = lenis.on("scroll", () => {
      if (settling) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SNAP_IDLE_MS);
    });
    // A new wheel turn takes the page back from a running settle.
    const onWheelDuringSettle = () => (settling = false);
    window.addEventListener("wheel", onWheelDuringSettle, { passive: true });

    /**
     * Lenis only needs frames while it is moving the page (2026-10-11). The
     * loop used to run every frame for the whole visit, scrolling or not —
     * a page sitting still kept the main thread awake 60 times a second.
     * Now a wheel, a scroll or a jump wakes it, and it parks itself once
     * Lenis has been still for half a second. `lenis.time = 0` before a wake:
     * Lenis advances by `time - this.time`, and after a pause that gap would
     * finish a fresh wheel tween in one frame.
     */
    let rafId = 0;
    let stillFrames = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      stillFrames = lenis.isScrolling ? 0 : stillFrames + 1;
      rafId = stillFrames > 30 ? 0 : requestAnimationFrame(raf);
    };
    function wake() {
      stillFrames = 0;
      if (rafId) return;
      lenis.time = 0;
      rafId = requestAnimationFrame(raf);
    }
    window.addEventListener("wheel", wake, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    wake();

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      offScroll();
      removeSnapListeners();
      window.removeEventListener("wheel", onWheelDuringSettle);
      window.removeEventListener("wheel", wake);
      window.removeEventListener("scroll", wake);
      inputLock.destroy();
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", onWheel);
      lenis.destroy();
      // The CSS smoothing is the fallback again the moment Lenis is gone.
      delete document.body.dataset.lenis;
      delete (window as unknown as { lenis?: Lenis }).lenis;
      delete window.tdsScrollTo;
    };
  }, []);

  return null;
}
