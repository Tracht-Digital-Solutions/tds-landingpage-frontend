import { useEffect } from "react";
import { sectionIds } from "~/lib/sections";
import { getLenis } from "./SmoothScroll";

const HEADER_OFFSET = 80;
const SNAP_DURATION = 1.1;
const EDGE_TOLERANCE = 4;
const WHEEL_THRESHOLD = 6;
const TOUCH_THRESHOLD = 40;

const snapEasing = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Scroll-snap controller for the homepage.
 *
 * Listens for wheel, touch, and keyboard input and advances Lenis to
 * the next/previous section in {@link sectionIds}. Edge-defer: when a
 * section is taller than the viewport, lets the user scroll inside it
 * and only crosses to the next once they reach the edge.
 *
 * Form fields and dialog overlays are exempt so typing and menus keep
 * working. While Lenis is animating to a target the controller swallows
 * further input to prevent stacked snaps.
 */
export default function SectionSnap() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let locked = false;
    let touchStartY: number | null = null;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const getSections = () =>
      sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

    const currentIndex = (sections: HTMLElement[]) => {
      const probeY = HEADER_OFFSET + 1;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top - probeY <= 0) idx = i;
      }
      return idx;
    };

    const shouldDefer = (direction: 1 | -1, section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      const sectionTallerThanViewport =
        rect.height > window.innerHeight - HEADER_OFFSET;
      if (!sectionTallerThanViewport) return false;
      if (direction > 0) {
        return rect.bottom > window.innerHeight + EDGE_TOLERANCE;
      }
      return rect.top < HEADER_OFFSET - EDGE_TOLERANCE;
    };

    const isInteractive = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.closest("input, textarea, select, [contenteditable]"))
        return true;
      if (target.closest('[role="dialog"]')) return true;
      return false;
    };

    const snapTo = (index: number) => {
      const lenis = getLenis();
      const sections = getSections();
      const target = sections[index];
      if (!lenis || !target) return;
      locked = true;
      lenis.scrollTo(target, {
        offset: -HEADER_OFFSET,
        duration: reduceMotion ? 0 : SNAP_DURATION,
        easing: snapEasing,
        immediate: reduceMotion,
        lock: true,
        onComplete: () => {
          locked = false;
        },
      });
    };

    const advance = (direction: 1 | -1, source: Event) => {
      if (locked) {
        source.preventDefault();
        return;
      }
      if (isInteractive(source.target)) return;

      const sections = getSections();
      if (sections.length === 0) return;

      const idx = currentIndex(sections);
      const current = sections[idx];
      if (shouldDefer(direction, current)) return;

      const nextIdx = idx + direction;
      if (nextIdx < 0 || nextIdx >= sections.length) return;

      source.preventDefault();
      snapTo(nextIdx);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      advance(e.deltaY > 0 ? 1 : -1, e);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - endY;
      touchStartY = null;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      advance(delta > 0 ? 1 : -1, e);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isInteractive(e.target)) return;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          advance(1, e);
          break;
        case "ArrowUp":
        case "PageUp":
          advance(-1, e);
          break;
        case "Home":
          e.preventDefault();
          snapTo(0);
          break;
        case "End": {
          e.preventDefault();
          const sections = getSections();
          if (sections.length > 0) snapTo(sections.length - 1);
          break;
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
