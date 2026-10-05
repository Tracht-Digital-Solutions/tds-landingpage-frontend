import { useEffect, useRef } from "react";
import { actionTarget, CURSOR_ABSORB_ATTR, tintForFill, type Rgba } from "~/lib/cursorAbsorb";

/**
 * The site's cursor: a small dot pinned to the pointer plus a larger ring
 * that trails it. The ring squashes/stretches along the movement vector
 * (faster = more stretch), grows over interactive elements and pinches on
 * press. Its colour flips between the brand accent (over light surfaces) and
 * a light pink (over dark ones) by sampling the background under the pointer.
 *
 * It IS the cursor (2026-10-05): while it runs the native pointer is hidden
 * on the whole page (`data-cursor-absorb` in `styles/global.css`), and the
 * dot — pinned to the pointer, so it is the hotspot — is what the visitor
 * aims with. Ring and dot are MANUAL POPOVERS so they live in the top layer:
 * a modal dialog or the accessibility popover is in the top layer too and
 * would otherwise cover the only visible cursor. Each time something enters
 * the top layer they are re-shown, which puts them back on top of it.
 *
 * Over an action control it turns WHITE on a dark control and BLUE on a
 * light one (`lib/cursorAbsorb.ts`) and stays on the pointer — it used to fly
 * into the control, then took its inverted colour; Julian dropped both.
 *
 * POINTER events, not mouse events. The floating scrollbar (and anything
 * else that calls `preventDefault()` on `pointerdown`) suppresses the
 * compatibility mouse events for the rest of that press: on `mousemove` the
 * cursor froze where a scrollbar drag began. Pointer events keep coming, and
 * under pointer capture they still bubble to the window.
 *
 * Bails out on coarse pointers (touch) and under `prefers-reduced-motion`;
 * matching CSS hides it there too. Mounted `client:idle`.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.hasAttribute("data-a11y-motion");
    if (!fine || reduce) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;
    // Hides the native pointer — only while this runs, so touch and reduced
    // motion keep it.
    const root = document.documentElement;
    root.setAttribute(CURSOR_ABSORB_ATTR, "");

    // Into the top layer, and back on top whenever a dialog or popover opens
    // after them. No popover support: they stay ordinary fixed elements, and
    // the CSS keeps the native pointer over a modal (see global.css).
    const canPopover = typeof ring.showPopover === "function";
    const raise = () => {
      if (!canPopover) return;
      for (const el of [ring, dot]) {
        try {
          if (el.matches(":popover-open")) el.hidePopover();
          el.showPopover();
        } catch {
          // A popover that is mid-transition or detached refuses; harmless.
        }
      }
    };
    raise();
    // A modal opened with showModal() sets `open`; popovers fire `toggle`,
    // which does not bubble — hence capture.
    const topLayerWatch = new MutationObserver((records) => {
      if (records.some((r) => r.target instanceof HTMLDialogElement && r.target.open)) raise();
    });
    topLayerWatch.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
    const onToggle = (event: Event) => {
      const target = event.target;
      if (target === ring || target === dot) return;
      if ((event as ToggleEvent).newState === "open") raise();
    };
    document.addEventListener("toggle", onToggle, true);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let prevX = ringX;
    let prevY = ringY;
    let visible = false;
    let hovering = false;
    let onDark = false;
    /** The action control under the pointer, and the tint last given for it. */
    let action: HTMLElement | null = null;
    let actionTint = "";

    const interactiveSelector =
      "a, button, [role='tab'], [role='button'], input, textarea, select, label, summary, .process-step-item";

    // --- Colour reading --------------------------------------------------
    // Computed colours come back as rgb(), oklab(), color(srgb …) — whatever
    // the stylesheet mixed them in. A 1×1 canvas turns every one into RGBA;
    // the old regex read only rgb() and silently judged every oklab fill
    // "not dark". Memoised: a page has a few dozen distinct fills.
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const cache = new Map<string, Rgba | null>();
    const toRgba = (value: string): Rgba | null => {
      if (!ctx || !value || value === "transparent") return null;
      const known = cache.get(value);
      if (known !== undefined) return known;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000";
      ctx.fillStyle = value;
      ctx.fillRect(0, 0, 1, 1);
      const [r = 0, g = 0, b = 0, a = 0] = ctx.getImageData(0, 0, 1, 1).data;
      const rgba: Rgba = [r, g, b, a / 255];
      cache.set(value, rgba);
      return rgba;
    };
    const isDark = ([r, g, b]: Rgba) => 0.2126 * r + 0.7152 * g + 0.0722 * b < 115;

    /** The first opaque fill under the pointer (from `start` if given). */
    const fillUnderPointer = (start?: Element): Rgba | null => {
      const els = document.elementsFromPoint(mouseX, mouseY);
      const list = start ? [start, ...els] : els;
      for (const el of list) {
        if (el === ring || el === dot) continue;
        const rgba = toRgba(getComputedStyle(el).backgroundColor);
        if (rgba && rgba[3] > 0.5) return rgba;
      }
      return toRgba(getComputedStyle(document.body).backgroundColor);
    };

    /** Over an action: white or blue by how bright its fill (or what shows
     *  through it) is. */
    const tintForAction = () => {
      const next = action ? tintForFill(fillUnderPointer(action) ?? [255, 255, 255, 1]) : "";
      if (next === actionTint) return;
      actionTint = next;
      for (const el of [ring, dot]) {
        if (next) el.style.setProperty("--cursor-tint", next);
        else el.style.removeProperty("--cursor-tint");
        el.classList.toggle("is-action", next !== "");
      }
    };
    // A control's hover colour arrives on a transition: read it again while
    // it settles, or the cursor keeps the inverse of the resting colour.
    let retint: number[] = [];
    const setAction = (next: HTMLElement | null) => {
      if (next === action) return;
      action = next;
      for (const id of retint) window.clearTimeout(id);
      tintForAction();
      retint = next ? [90, 200, 360].map((ms) => window.setTimeout(tintForAction, ms)) : [];
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      wake();
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
      // Under pointer capture `e.target` is the capturing element, not what
      // is under the pointer; hit-test instead while a button is held.
      const target = (e.buttons ? document.elementFromPoint(mouseX, mouseY) : e.target) as Element | null;
      setAction(actionTarget(target));
      const next = !!target?.closest(interactiveSelector);
      if (next !== hovering) {
        hovering = next;
        ring.classList.toggle("is-hover", next);
      }
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") ring.classList.add("is-down");
    };
    const onUp = () => ring.classList.remove("is-down");

    // How often the background under the pointer is re-sampled. It used to be
    // "every 6th frame", which is ~100ms only while the loop happens to be
    // running at 60fps; as a wall-clock interval it also survives the loop
    // parking itself below.
    const SAMPLE_MS = 100;
    // Distance at which the trailing ring counts as having caught up. The
    // follow is a lerp, so it approaches asymptotically and never
    // arrives exactly.
    const SETTLED_PX = 0.05;
    const FOLLOW = 0.5;

    let raf = 0;
    let lastSample = -Infinity;

    const loop = (now: number) => {
      // Follow. 0.5 per frame (2026-10-05, was 0.28): the ring trailed far
      // enough behind a quick move to read as lag; at 0.5 it closes 97 % of
      // the gap in five frames and still shows the squash of a fast stroke.
      ringX += (mouseX - ringX) * FOLLOW;
      ringY += (mouseY - ringY) * FOLLOW;

      // Velocity → directional squash/stretch.
      const vx = ringX - prevX;
      const vy = ringY - prevY;
      prevX = ringX;
      prevY = ringY;
      const speed = Math.hypot(vx, vy);
      const stretch = Math.min(speed / 28, 0.45);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const sx = (1 + stretch).toFixed(3);
      const sy = (1 - stretch * 0.6).toFixed(3);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${sx}, ${sy})`;

      // Re-sample a few times a second: a scroll can carry a dark band or a
      // button under a still pointer.
      if (visible && now - lastSample >= SAMPLE_MS) {
        lastSample = now;
        setAction(actionTarget(document.elementFromPoint(mouseX, mouseY)));
        const under = fillUnderPointer();
        const next = under ? isDark(under) : false;
        if (next !== onDark) {
          onDark = next;
          ring.classList.toggle("is-on-dark", next);
          dot.classList.toggle("is-on-dark", next);
        }
      }

      // Park once the ring has caught up. Nothing about how it looks depends
      // on the loop still spinning while everything is stationary.
      if (Math.abs(mouseX - ringX) < SETTLED_PX && Math.abs(mouseY - ringY) < SETTLED_PX) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    // Anything that can change what the cursor should look like restarts it.
    // SCROLL is in the list for a reason that is invisible in a diff: the
    // pointer can sit perfectly still while the page moves a dark section
    // underneath it, and that is exactly when the ring has to flip colour.
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    wake();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });

    return () => {
      root.removeAttribute(CURSOR_ABSORB_ATTR);
      topLayerWatch.disconnect();
      document.removeEventListener("toggle", onToggle, true);
      for (const id of retint) window.clearTimeout(id);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", wake);
    };
  }, []);

  return (
    <>
      {/* `data-theme-preview="skip"` keeps these two out of the theme toggle's
          hover preview, which clones the page to show the other theme inside a
          circle (tds-shared `ThemeToggle`).

          They are the one kind of element that must not be copied: a SCRIPT
          positions them, on every `pointermove`, so a clone freezes them
          wherever they stood when it was taken and draws a second cursor that
          never moves. Everything else on the page is placed by layout and lands
          correctly in the copy — the bar, the floating pill, the bookmarks all
          sit at the same viewport position and simply appear in the other theme
          inside the circle, which is what the preview is for. */}
      <div
        ref={ringRef}
        popover="manual"
        className="tds-cursor-ring"
        aria-hidden="true"
        data-theme-preview="skip"
      />
      <div
        ref={dotRef}
        popover="manual"
        className="tds-cursor-dot"
        aria-hidden="true"
        data-theme-preview="skip"
      />
    </>
  );
}
