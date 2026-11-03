/**
 * The page ground's shapes follow the scroll, and in the hero the pointer
 * (2026-11-03).
 *
 * Three numbers go onto `.page-ground`; everything else is CSS in
 * `components/PageGround.astro`:
 *
 * - `--lp-ground-y`: the scroll position in whole pixels, from one passive
 *   `scroll` listener. Planes slide by `mod(y × speed, tile)`, bodies turn.
 * - `--lp-ground-px` / `--lp-ground-py`: the pointer in -1…1, only under a
 *   fine pointer and only while `#hero` is on screen. The bodies lean toward
 *   it and the planes shift by their depth. A short frame loop eases toward
 *   the pointer (exponential, the same at any frame rate) and PARKS once it
 *   has settled; when the hero leaves the screen the goal returns to the
 *   centre, the loop eases back and parks again.
 *
 * Rules this keeps (docs/agents/motion.md):
 *
 * - **Onto the layer, never `<html>`.** The variables inherit only into the
 *   ground's own nodes; on the root they would restyle the whole page.
 * - **Nothing runs while nothing moves.** A still page runs zero frames.
 *   Lenis scrolls the native position, so its smoothed scroll arrives here as
 *   ordinary scroll events.
 * - **The motion switch** (`data-a11y-motion`) can flip while the page is
 *   open: the listeners go and the bodies return to their resting pose.
 *   Under reduced motion `boot.ts` never loads this file.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

/** Time constant of the pointer's smoothing, in seconds. */
const SMOOTHING_S = 0.45;
/** A long frame (a busy main thread, a returning tab) counts as this at most. */
const MAX_FRAME_S = 0.05;
/** Closer than this to the goal counts as settled. */
const SETTLE = 0.002;

export function mountGroundScroll(_dom: Dom): void {
  const ground = document.querySelector<HTMLElement>(".page-ground");
  if (!ground || !ground.querySelector(".page-ground__plane")) return;
  const root = document.documentElement;
  const hero = document.getElementById("hero");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  // --- Scroll ----------------------------------------------------------------
  let lastY = Number.NaN;
  const onScroll = () => {
    const y = Math.round(window.scrollY);
    if (y === lastY) return;
    lastY = y;
    ground.style.setProperty("--lp-ground-y", String(y));
  };

  // --- Pointer (hero only) ---------------------------------------------------
  const goal = { x: 0, y: 0 };
  const now = { x: 0, y: 0 };
  let frame = 0;
  let lastTime = 0;

  const writePointer = () => {
    ground.style.setProperty("--lp-ground-px", now.x.toFixed(3));
    ground.style.setProperty("--lp-ground-py", now.y.toFixed(3));
  };
  const tick = (time: number) => {
    const dt = lastTime ? Math.min((time - lastTime) / 1000, MAX_FRAME_S) : 1 / 60;
    lastTime = time;
    const t = 1 - Math.exp(-dt / SMOOTHING_S);
    now.x += (goal.x - now.x) * t;
    now.y += (goal.y - now.y) * t;
    const settled = Math.abs(goal.x - now.x) < SETTLE && Math.abs(goal.y - now.y) < SETTLE;
    if (settled) {
      now.x = goal.x;
      now.y = goal.y;
    }
    writePointer();
    frame = settled ? 0 : requestAnimationFrame(tick);
  };
  const wake = () => {
    if (frame) return;
    lastTime = 0;
    frame = requestAnimationFrame(tick);
  };
  const aim = (x: number, y: number) => {
    goal.x = x;
    goal.y = y;
    wake();
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    aim((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
  };
  const onLeave = () => aim(0, 0);

  // --- Switching ---------------------------------------------------------------
  let heroOnScreen = hero !== null && hero.getBoundingClientRect().bottom > 0;
  let scrolling = false;
  let pointing = false;

  const apply = () => {
    const allowed = !root.hasAttribute("data-a11y-motion");

    if (allowed && !scrolling) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    } else if (!allowed && scrolling) {
      window.removeEventListener("scroll", onScroll);
      ground.style.removeProperty("--lp-ground-y");
      lastY = Number.NaN;
    }
    scrolling = allowed;

    const point = allowed && heroOnScreen && finePointer.matches;
    if (point && !pointing) {
      window.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave);
    } else if (!point && pointing) {
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      if (allowed) {
        aim(0, 0);
      } else {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        goal.x = goal.y = now.x = now.y = 0;
        ground.style.removeProperty("--lp-ground-px");
        ground.style.removeProperty("--lp-ground-py");
      }
    }
    pointing = point;
  };

  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.isIntersecting === heroOnScreen) return;
        heroOnScreen = entry.isIntersecting;
        apply();
      },
      { rootMargin: "0px" },
    ).observe(hero);
  }
  new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ["data-a11y-motion"] });
  finePointer.addEventListener("change", apply);
  apply();
}
