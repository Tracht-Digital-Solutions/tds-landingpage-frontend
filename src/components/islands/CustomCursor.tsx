import { useEffect, useRef } from "react";

/**
 * An additive custom cursor: a small dot pinned to the pointer plus a
 * larger ring that trails it with a smooth lerp, growing over interactive
 * elements. The native cursor stays visible — this rides on top of it.
 *
 * Bails out entirely on coarse pointers (touch) and under
 * `prefers-reduced-motion`; the matching CSS also hides it in those cases
 * as a belt-and-braces guard. Mounted `client:idle` so it never competes
 * with first paint.
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
    let visible = false;
    let hovering = false;

    const interactiveSelector =
      "a, button, [role='tab'], [role='button'], input, textarea, select, label, summary, .process-step-item";

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
      // Lerp the ring toward the pointer for a smooth, weighty trail.
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
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
