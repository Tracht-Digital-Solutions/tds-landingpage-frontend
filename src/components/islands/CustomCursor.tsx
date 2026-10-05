import { useEffect, useRef } from "react";
import { absorbStep, actionTarget, CURSOR_ABSORB_ATTR } from "~/lib/cursorAbsorb";

/**
 * An additive custom cursor: a small dot pinned to the pointer plus a larger
 * ring that trails it. The ring squashes/stretches along the movement vector
 * (faster = more stretch), grows over interactive elements and pinches on
 * click — so it reads as reactive to what the user is doing. Its colour flips
 * between the brand accent (over light surfaces) and a light pink (over dark
 * ones) by sampling the background luminance under the pointer, mirroring the
 * approach in FloatingCta.astro. The native cursor stays visible underneath.
 *
 * It IS the cursor (2026-10-05): while it runs the native pointer is hidden
 * on the whole page (`data-cursor-absorb` in `styles/global.css`), and the
 * dot — pinned to the pointer, so it is the hotspot — is what the visitor
 * aims with. Ring and dot are MANUAL POPOVERS so they live in the top layer:
 * a modal dialog or the accessibility popover is in the top layer too and
 * would otherwise cover the only visible cursor. Each time something enters
 * the top layer they are re-shown, which puts them back on top of it.
 *
 * Over a button that performs an action it DISAPPEARS INTO it (2026-10-05,
 * `lib/cursorAbsorb.ts`): dot and ring fly to the button's centre and shrink
 * to nothing on a spring, the native pointer is hidden there, and on leaving
 * both pop back out to the pointer with a slight overshoot.
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
    // Hides the native pointer over action controls — only while this runs,
    // so touch and reduced motion keep it.
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
    // The action control the pointer is in, and the absorb spring
    // (0 = cursor out, 1 = swallowed). `centreX/Y` outlives `action`, so the
    // way back out starts where the cursor went in.
    let action: HTMLElement | null = null;
    let absorb = 0;
    let absorbV = 0;
    let centreX = 0;
    let centreY = 0;
    let lastFrame = 0;

    const interactiveSelector =
      "a, button, [role='tab'], [role='button'], input, textarea, select, label, summary, .process-step-item";

    // --- Background luminance sampling (flip cursor colour over dark UI) ---
    const parseRgb = (value: string): [number, number, number, number] | null => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const [r, g, b, a = 1] = match[1].split(",").map((p) => parseFloat(p.trim()));
      return [r, g, b, a];
    };
    const isDark = (r: number, g: number, b: number) =>
      0.2126 * r + 0.7152 * g + 0.0722 * b < 115;
    const sampleOnDark = (): boolean => {
      const els = document.elementsFromPoint(mouseX, mouseY);
      for (const el of els) {
        if (el === ring || el === dot) continue;
        const rgb = parseRgb(getComputedStyle(el).backgroundColor);
        if (rgb && rgb[3] > 0.5) return isDark(rgb[0], rgb[1], rgb[2]);
      }
      const body = parseRgb(getComputedStyle(document.body).backgroundColor);
      return body ? isDark(body[0], body[1], body[2]) : false;
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      wake();
      placeDot();
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
      const target = e.target as Element | null;
      setAction(actionTarget(target));
      // The ring grows over links and fields; over an action it is swallowed.
      const next = !action && !!target?.closest(interactiveSelector);
      if (next !== hovering) {
        hovering = next;
        ring.classList.toggle("is-hover", next);
      }
    };

    function setAction(next: HTMLElement | null) {
      if (next === action) return;
      action = next;
      wake();
    }

    /** The dot: on the pointer, pulled into the button as it is absorbed. */
    const placeDot = () => {
      const pull = Math.min(1, Math.max(0, absorb));
      const x = mouseX + (centreX - mouseX) * pull;
      const y = mouseY + (centreY - mouseY) * pull;
      const size = Math.max(0, 1 - absorb);
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${size.toFixed(3)})`;
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");

    // How often the background under the pointer is re-sampled. It used to be
    // "every 6th frame", which is ~100ms only while the loop happens to be
    // running at 60fps; as a wall-clock interval it also survives the loop
    // parking itself below.
    const SAMPLE_MS = 100;
    // Distance at which the trailing ring counts as having caught up. The
    // follow is a 0.28 lerp, so it approaches asymptotically and never
    // arrives exactly.
    const SETTLED_PX = 0.05;

    let raf = 0;
    let lastSample = -Infinity;

    const loop = (now: number) => {
      const dt = Math.min(0.032, lastFrame ? (now - lastFrame) / 1000 : 0.016);
      lastFrame = now;

      // The button's centre, re-read while the cursor is in it — the page
      // can scroll or the button lift (hover) under a still pointer.
      if (action) {
        const box = action.getBoundingClientRect();
        centreX = box.left + box.width / 2;
        centreY = box.top + box.height / 2;
      }
      [absorb, absorbV] = absorbStep(absorb, absorbV, action ? 1 : 0, dt);

      // Snappy follow — of the pointer, or of the button swallowing it.
      const aimX = action ? centreX : mouseX;
      const aimY = action ? centreY : mouseY;
      ringX += (aimX - ringX) * 0.28;
      ringY += (aimY - ringY) * 0.28;

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
      // Absorbed, the ring shrinks to nothing; on the way out the spring
      // overshoots below 0 and the ring pops a touch larger than its size.
      const size = Math.max(0, 1 - absorb);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${(Number(sx) * size).toFixed(3)}, ${(Number(sy) * size).toFixed(3)})`;
      placeDot();

      // Re-sample the background colour a few times a second.
      if (visible && now - lastSample >= SAMPLE_MS) {
        lastSample = now;
        // A scroll can carry a button under a still pointer, or away.
        setAction(actionTarget(document.elementFromPoint(mouseX, mouseY)));
        const next = sampleOnDark();
        if (next !== onDark) {
          onDark = next;
          ring.classList.toggle("is-on-dark", next);
          dot.classList.toggle("is-on-dark", next);
        }
      }

      // Park once the ring has caught up. This loop used to run for the
      // entire life of the page whether or not anything moved: a wake-up on
      // every vsync, a transform write and a hit-test-plus-getComputedStyle
      // walk several times a second, on a decoration that is not even
      // visible until the pointer first moves. Nothing about how it looks
      // depends on the loop still spinning while everything is stationary.
      const absorbSettled = Math.abs((action ? 1 : 0) - absorb) < 0.001 && Math.abs(absorbV) < 0.01;
      if (absorbSettled && Math.abs(aimX - ringX) < SETTLED_PX && Math.abs(aimY - ringY) < SETTLED_PX) {
        raf = 0;
        lastFrame = 0;
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

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });

    return () => {
      root.removeAttribute(CURSOR_ABSORB_ATTR);
      topLayerWatch.disconnect();
      document.removeEventListener("toggle", onToggle, true);
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("scroll", wake);
    };
  }, []);

  return (
    <>
      {/* `data-theme-preview="skip"` keeps these two out of the theme toggle's
          hover preview, which clones the page to show the other theme inside a
          circle (tds-shared `ThemeToggle`).

          They are the one kind of element that must not be copied: a SCRIPT
          positions them, on every `mousemove`, so a clone freezes them wherever
          they stood when it was taken and draws a second cursor that never
          moves. Everything else on the page is placed by layout and lands
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
