import { useEffect, useRef } from "react";

/**
 * An additive custom cursor: a small dot pinned to the pointer plus a larger
 * ring that trails it. The ring squashes/stretches along the movement vector
 * (faster = more stretch), grows over interactive elements and pinches on
 * click — so it reads as reactive to what the user is doing. Its colour flips
 * between the brand accent (over light surfaces) and a light pink (over dark
 * ones) by sampling the background luminance under the pointer, mirroring the
 * approach in FloatingCta.astro. The native cursor stays visible underneath.
 *
 * Bails out on coarse pointers (touch) and under `prefers-reduced-motion`;
 * matching CSS hides it there too. Mounted `client:idle`.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let prevX = ringX;
    let prevY = ringY;
    let visible = false;
    let hovering = false;
    let onDark = false;

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
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
      const target = e.target as Element | null;
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
      // Snappy follow.
      ringX += (mouseX - ringX) * 0.28;
      ringY += (mouseY - ringY) * 0.28;

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

      // Re-sample the background colour a few times a second.
      if (visible && now - lastSample >= SAMPLE_MS) {
        lastSample = now;
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

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });

    return () => {
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
      <div ref={ringRef} className="tds-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="tds-cursor-dot" aria-hidden="true" />
    </>
  );
}
