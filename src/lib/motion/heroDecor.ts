/**
 * The hero's constructed geometry, animated.
 *
 * ### What is where
 *
 * - **Markup** (two shapes, each a filled face with a stack of outline rings
 *   behind it) is server-rendered in `sections/Hero.astro`, inside the
 *   `aria-hidden` decoration layer. No text node and no image depends on any
 *   of this — the rule the 4.1 s mobile LCP taught (see `motion.test.ts`).
 * - **The arrival** is CSS in `Hero.astro` (`translate`, on the first paint, off
 *   under reduced motion).
 * - **The resting pose** is `hero-shape--still`, so the depth reads before
 *   this runs and stays the picture under reduced motion — `boot.ts` loads no
 *   runtime at all then.
 * - **This file** adds the endless drift and sway and the pointer parallax.
 *
 * ### One loop, one write (2026-11-02)
 *
 * It used to start a new Motion spring for every pointer event. A restarted
 * spring loses its velocity, so the shapes stuttered while the mouse moved, and
 * the sway and the tilt wrote the same element from separate animations. Now one
 * frame loop computes the whole pose. The pointer only sets a goal, and the
 * smoothing toward it is exponential, so it reads the same at any frame rate.
 *
 * ### Nothing runs off screen (2026-10-11)
 *
 * The loop stops once `#hero` leaves the viewport or the motion switch is on, and
 * the pointer listener with it.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

/** How far each shape follows the pointer (px at the screen's edge) and tilts toward it (deg). */
const PARALLAX = { capsule: 60, quarter: -42 } as const;
const TILT = { capsule: 10, quarter: -12 } as const;
/** Time constant of the pointer's smoothing, in seconds. */
const SMOOTHING_S = 0.35;
/** A long frame (a busy main thread, a returning tab) counts as this at most. */
const MAX_FRAME_S = 0.05;

/** 0 at the start of a period, 1 halfway, 0 again at its end. */
const wave = (seconds: number, period: number) => 0.5 - 0.5 * Math.cos((2 * Math.PI * seconds) / period);
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

export function mountHeroDecor(_dom: Dom): void {
  const hero = document.getElementById("hero");
  const capsule = document.querySelector<HTMLElement>('[data-hero-shape="capsule"]');
  const quarter = document.querySelector<HTMLElement>('[data-hero-shape="quarter"]');
  const capsuleBody = capsule?.querySelector<HTMLElement>(".hero-shape__body");
  const quarterBody = quarter?.querySelector<HTMLElement>(".hero-shape__body");
  if (!hero || !capsule || !quarter || !capsuleBody || !quarterBody) return;

  const narrowQuery = window.matchMedia("(max-width: 79.999rem)");
  const coarseQuery = window.matchMedia("(pointer: coarse)");

  const goal = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  let frame = 0;
  let last = 0;
  let clock = 0;

  const paint = () => {
    const narrow = narrowQuery.matches;
    const capsuleY = -(narrow ? 16 : 44) * wave(clock, 9);
    const quarterY = (narrow ? 14 : 36) * wave(clock, 11);
    capsule.style.transform =
      `perspective(900px) translate3d(${(eased.x * PARALLAX.capsule).toFixed(2)}px, ${capsuleY.toFixed(2)}px, 0) ` +
      `rotateX(${(-eased.y * TILT.capsule).toFixed(3)}deg) rotateY(${(eased.x * TILT.capsule).toFixed(3)}deg)`;
    quarter.style.transform =
      `perspective(900px) translate3d(${(eased.x * PARALLAX.quarter).toFixed(2)}px, ${quarterY.toFixed(2)}px, 0) ` +
      `rotateX(${(-eased.y * TILT.quarter).toFixed(3)}deg) rotateY(${(eased.x * TILT.quarter).toFixed(3)}deg)`;
    // The body sways on its own, so the depth shows without a pointer.
    const c = wave(clock, 14);
    capsuleBody.style.transform = `rotateX(${mix(16, 4, c).toFixed(3)}deg) rotateY(${mix(-26, 20, c).toFixed(3)}deg)`;
    const q = wave(clock, 17);
    quarterBody.style.transform =
      `rotateX(${mix(-14, 10, q).toFixed(3)}deg) rotateY(${mix(24, -18, q).toFixed(3)}deg) rotateZ(${mix(0, -6, q).toFixed(3)}deg)`;
  };

  const tick = (now: number) => {
    const dt = Math.min(MAX_FRAME_S, (now - last) / 1000);
    last = now;
    clock += dt;
    const share = 1 - Math.exp(-dt / SMOOTHING_S);
    eased.x += (goal.x - eased.x) * share;
    eased.y += (goal.y - eased.y) * share;
    paint();
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    // Back to the resting pose in CSS.
    for (const element of [capsule, quarter, capsuleBody, quarterBody]) element.style.removeProperty("transform");
    clock = 0;
    eased.x = eased.y = goal.x = goal.y = 0;
  };

  // --- Pointer -------------------------------------------------------------
  // On the window, not the hero: the shapes bleed past the section's edges.
  const onMove = (event: PointerEvent) => {
    goal.x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1));
    goal.y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1));
  };
  // A pointer that leaves the window drifts the shapes home instead of leaving them askew.
  const onLeave = () => {
    goal.x = goal.y = 0;
  };
  let listening = false;
  const listen = (on: boolean) => {
    const want = on && !coarseQuery.matches;
    if (want === listening) return;
    listening = want;
    if (want) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    } else {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    }
  };

  // --- On screen -----------------------------------------------------------
  let onScreen = true;
  const stilled = () => document.documentElement.hasAttribute("data-a11y-motion");
  const apply = () => {
    const run = onScreen && !stilled();
    if (run) start();
    else stop();
    listen(run);
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.isIntersecting === onScreen) return;
        onScreen = entry.isIntersecting;
        apply();
      },
      { rootMargin: "64px" },
    ).observe(hero);
  }
  // The site's own motion switch (A11yTools) can flip while the page is open.
  new MutationObserver(apply).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-a11y-motion"],
  });
  coarseQuery.addEventListener("change", () => listen(onScreen && !stilled()));
  apply();
}
