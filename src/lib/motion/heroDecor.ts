/**
 * The hero's constructed geometry, animated — on the vanilla Motion runtime
 * since 2026-10-22 (it was the React island `HeroDecor.tsx`, and with it the
 * React runtime on the home page's first screen).
 *
 * ### What is where
 *
 * - **Markup** (two shapes, each a filled face with a stack of outline rings
 *   behind it) is server-rendered in `sections/Hero.astro`, inside the
 *   `aria-hidden` decoration layer. No text node and no image depends on any
 *   of this — the rule the 4.1 s mobile LCP taught (see `motion.test.ts`).
 * - **The arrival** is CSS in `Hero.astro` (`translate` + `opacity`, on the
 *   first paint, off under reduced motion). It used to wait for hydration.
 * - **The resting pose** is `hero-shape--still`, so the depth reads before
 *   this runs and stays the picture under reduced motion — `boot.ts` loads no
 *   runtime at all then.
 * - **This file** adds the endless drift and sway and the pointer parallax.
 *   It writes `transform` only (Motion's independent transforms), which never
 *   collides with the arrival's `translate`.
 *
 * ### Numbers (2026-09-21, on Julian's word)
 *
 * The drift is ~10 px/s (it was 1.7, too quiet to register); the pointer
 * moves the shapes up to ~60 px by depth and tilts them toward it. Narrower
 * than 80rem the scene is in the phone arrangement and drifts less.
 *
 * ### Nothing runs off screen (2026-10-11)
 *
 * The loops run on Motion's frame loop, which the shared off-screen watcher
 * cannot reach, so they stop here once `#hero` leaves the viewport (one short
 * settle, then nothing), and the pointer listener with them.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");
type Controls = ReturnType<Dom["animate"]>;

/** How far each shape follows the pointer (px at the screen's edge) and tilts toward it (deg). */
const PARALLAX = { capsule: 60, quarter: 42 } as const;
const TILT = { capsule: 16, quarter: 20 } as const;
/** The body's resting turn — the first frame of its sway, and `hero-shape--still`. */
const REST = {
  capsule: { rotateX: 16, rotateY: -26 },
  quarter: { rotateX: -14, rotateY: 24, rotateZ: 0 },
} as const;

export function mountHeroDecor(dom: Dom): void {
  const hero = document.getElementById("hero");
  const capsule = document.querySelector<HTMLElement>('[data-hero-shape="capsule"]');
  const quarter = document.querySelector<HTMLElement>('[data-hero-shape="quarter"]');
  const capsuleBody = capsule?.querySelector<HTMLElement>(".hero-shape__body");
  const quarterBody = quarter?.querySelector<HTMLElement>(".hero-shape__body");
  if (!hero || !capsule || !quarter || !capsuleBody || !quarterBody) return;

  const { animate } = dom;
  const narrowQuery = window.matchMedia("(max-width: 79.999rem)");
  const coarseQuery = window.matchMedia("(pointer: coarse)");

  // The perspective sits on the shape itself, as it did on the island.
  for (const shape of [capsule, quarter]) animate(shape, { transformPerspective: 900 }, { duration: 0 });

  let loops: Controls[] = [];
  const stopLoops = () => {
    for (const control of loops) control.stop();
    loops = [];
  };
  const loop = (duration: number, delay = 0) => ({ duration, repeat: Infinity, ease: "easeInOut" as const, delay });

  const startLoops = () => {
    stopLoops();
    // A shorter drift on a narrow screen: the bands there are tight.
    const narrow = narrowQuery.matches;
    loops = [
      animate(capsule, { y: narrow ? [0, -16, 0] : [0, -44, 0] }, loop(9)),
      // The body sways on its own, so the depth shows without a pointer.
      animate(capsuleBody, { rotateX: [16, 4, 16], rotateY: [-26, 20, -26] }, loop(14)),
      // Moving and turning against the capsule, so the two never travel as one block.
      animate(quarter, { y: narrow ? [0, 14, 0] : [0, 36, 0] }, loop(11, 0.1)),
      animate(quarterBody, { rotateX: [-14, 10, -14], rotateY: [24, -18, 24], rotateZ: [0, -6, 0] }, loop(17, 0.4)),
    ];
  };

  const settle = () => {
    stopLoops();
    const ease = { duration: 0.4, ease: "easeOut" as const };
    animate(capsule, { y: 0 }, ease);
    animate(quarter, { y: 0 }, ease);
    animate(capsuleBody, REST.capsule, ease);
    animate(quarterBody, REST.quarter, ease);
  };

  // --- Pointer -------------------------------------------------------------
  // On the window, not the hero: the shapes bleed past the section's edges,
  // and a pointer that leaves the section should keep pushing them rather
  // than snapping them home. One spring per frame at most, no layout reads.
  let frame = 0;
  let point = { x: 0, y: 0 };
  const follow = () => {
    frame = 0;
    const { x, y } = point;
    animate(capsule, { x: x * PARALLAX.capsule }, { type: "spring", stiffness: 46, damping: 16, mass: 1.1 });
    animate(
      capsule,
      { rotateX: y * -TILT.capsule, rotateY: x * TILT.capsule },
      { type: "spring", stiffness: 60, damping: 14 },
    );
    animate(quarter, { x: x * -PARALLAX.quarter }, { type: "spring", stiffness: 40, damping: 18, mass: 1.2 });
    animate(
      quarter,
      { rotateX: y * TILT.quarter, rotateY: x * -TILT.quarter },
      { type: "spring", stiffness: 50, damping: 16 },
    );
  };
  const onMove = (event: PointerEvent) => {
    point = { x: (event.clientX / window.innerWidth) * 2 - 1, y: (event.clientY / window.innerHeight) * 2 - 1 };
    if (!frame) frame = requestAnimationFrame(follow);
  };
  let listening = false;
  const listen = (on: boolean) => {
    const want = on && !coarseQuery.matches;
    if (want === listening) return;
    listening = want;
    if (want) window.addEventListener("pointermove", onMove, { passive: true });
    else {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  // --- On screen -----------------------------------------------------------
  let onScreen = true;
  const apply = () => {
    const run = onScreen && !document.documentElement.hasAttribute("data-a11y-motion");
    if (run) startLoops();
    else settle();
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
  narrowQuery.addEventListener("change", () => onScreen && !stilled() && startLoops());
  // The site's own motion switch (A11yTools, `data-a11y-motion`) can flip
  // while the page is open: then the shapes go back to the resting pose and
  // nothing runs. `boot.ts` covers the switch at load.
  const stilled = () => document.documentElement.hasAttribute("data-a11y-motion");
  new MutationObserver(() => {
    if (stilled()) {
      settle();
      listen(false);
    } else apply();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-a11y-motion"] });
  coarseQuery.addEventListener("change", () => listen(onScreen));
  apply();
}
