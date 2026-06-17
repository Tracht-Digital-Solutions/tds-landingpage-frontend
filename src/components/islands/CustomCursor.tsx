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
    let frame = 0;

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

    let raf = 0;
    const loop = () => {
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
      frame = (frame + 1) % 6;
      if (frame === 0 && visible) {
        const next = sampleOnDark();
        if (next !== onDark) {
          onDark = next;
          ring.classList.toggle("is-on-dark", next);
          dot.classList.toggle("is-on-dark", next);
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="tds-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="tds-cursor-dot" aria-hidden="true" />
    </>
  );
}
