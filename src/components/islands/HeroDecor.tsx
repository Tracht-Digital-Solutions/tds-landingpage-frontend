import { useEffect, useState } from "react";
import { MotionScope, m, useCoarsePointer } from "@tracht-digital-solutions/tds-shared/motion/react";

/**
 * The hero's constructed geometry, animated.
 *
 * ### The line, and why it is where it is
 *
 * The hero used to be a React island in its entirety. Its eyebrow, headline,
 * sub and buttons were motion elements, so their server-rendered markup
 * carried the entrance's start state — `style="opacity:0"` — and until React
 * hydrated, the most important screen of the site was blank. On a phone the
 * largest thing left to paint was the cookie notice, which became the page's
 * LCP element at 4.1 s.
 *
 * So the rule is not "no motion in the hero". It is: **no text node, and no
 * image, may depend on hydration to become visible.** The copy and the photo
 * are plain HTML in `sections/Hero.astro`. What is left — three geometric
 * shapes that bleed off the section's edges — is what this island renders,
 * and they are `aria-hidden` decoration behind `pointer-events: none`.
 *
 * ### 2026-09-21: it was too quiet to see, and it was missing on phones
 *
 * Measured on the live site: the shapes moved **8–9 px in five seconds**,
 * about 1.7 px/s — under the threshold at which movement registers at all.
 * And below 64 rem the island did not load, so a phone had no motion in the
 * hero whatsoever. Both are deliberate choices reversed on Julian's word.
 *
 * What changed:
 * - The arrival travels far enough to read as an arrival.
 * - The drift is an order of magnitude more present (~10 px/s against 1.7).
 * - The pointer moves the shapes ~60 px instead of 26, by depth.
 * - The gold node walks the conduit instead of blinking in place.
 * - It mounts at every width. That costs a measured ~129 KB of JS on phones,
 *   paid for out of the savings in the same change (the unused Lato 900, the
 *   dead `marked` dependency) and watched by `npm run audit:perf`.
 *
 * ### What is NOT here, on purpose
 *
 * The scroll-linked part of the scene is CSS (`animation-timeline: view()` in
 * `sections/Hero.astro`), not JavaScript. `tds-shared/motion/react` re-exports
 * only `m` and `AnimatePresence`, so a scroll hook would mean either a bare
 * `motion` import — which `__tests__/motion.test.ts` forbids, and rightly:
 * every other site in the workspace goes through the shared entry — or a
 * release of tds-shared for one hook. A scroll-driven CSS animation needs
 * neither, runs on the compositor, and degrades to no movement where it is
 * unsupported.
 *
 * Geometry (position and size, including the phone arrangement) lives in CSS
 * as well. An island's DOM never receives Astro's scoped-style attribute, so
 * those rules are `:global()` in the hero's style block — and keeping size
 * out of here means this file only ever writes transforms, which is what the
 * compositor can animate without touching layout.
 */

/**
 * How far each shape follows the pointer, in px at the screen's edge.
 *
 * The node is absent: it is busy walking the conduit, and adding a pointer
 * offset on the same axis would fight its own path.
 */
const PARALLAX = { capsule: 60, quarter: 42 } as const;

export default function HeroDecor() {
  const coarse = useCoarsePointer();
  const [reduced, setReduced] = useState(false);
  /**
   * Below 80rem only the node is drawn (see the CSS in `sections/Hero.astro`),
   * and it walks a DIFFERENT path there: the hero's free band on a phone is
   * about 100 px tall, and the conduit walk lifts the node 58 px, which put it
   * on the eyebrow — `audit:ux` reported it as decoration over content at
   * every narrow width. On a narrow screen it therefore runs horizontally and
   * stays in its lane.
   *
   * Read SYNCHRONOUSLY on the first client render, not in the effect. With
   * the effect answering one tick later, the node spent its opening frames on
   * the desktop path — which lifts it 58 px, straight under the fixed header,
   * and `audit:ux` reported it as decoration over the navigation. Nothing
   * mismatches at hydration: `narrow` only ever feeds `animate`, and the
   * server-rendered style comes from `initial`, which is the same either way.
   */
  const [narrow, setNarrow] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(max-width: 79.999rem)").matches,
  );
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const query = window.matchMedia("(max-width: 79.999rem)");
    setNarrow(query.matches);
    const onChange = () => setNarrow(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    // The site's own motion switch (A11yTools) counts the same as the OS one.
    const siteSwitch = () => document.documentElement.hasAttribute("data-a11y-motion");
    setReduced(query.matches || siteSwitch());
    const onChange = () => setReduced(query.matches || siteSwitch());
    query.addEventListener("change", onChange);
    // Flipped live from the tools panel, not only at load.
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-a11y-motion"] });
    return () => {
      query.removeEventListener("change", onChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reduced || coarse) return;
    /**
     * Listener on the window, not on the hero: the shapes bleed past the
     * section's edges, and a pointer that leaves the section should keep
     * pushing them rather than snapping them home.
     *
     * No rAF throttle and no `elementsFromPoint`: this handler writes one
     * state object and does no layout reads, so it cannot force a reflow.
     */
    const onMove = (event: PointerEvent) => {
      setPointer({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, coarse]);

  // Reduced motion: the finished picture, no motion values, no listener, no
  // animation frames. Not a zero duration — nothing starts at all.
  if (reduced) {
    return (
      <>
        <span className="hero-shape hero-shape--capsule tds-shape tds-shape--capsule tds-shape--navy" />
        <span className="hero-shape hero-shape--quarter tds-shape tds-shape--quarter-tl tds-shape--bordeaux" />
        <span className="hero-shape hero-shape--node tds-shape tds-shape--capsule tds-shape--gold" />
      </>
    );
  }

  return (
    <MotionScope>
      {/* The navy capsule — cut by the left edge, so it arrives from there
          and leans furthest into the pointer: it is the nearest of the three. */}
      <m.span
        className="hero-shape hero-shape--capsule tds-shape tds-shape--capsule tds-shape--navy"
        initial={{ opacity: 0, x: -180 }}
        animate={{
          opacity: 1,
          x: pointer.x * PARALLAX.capsule,
          y: [0, -44, 0],
        }}
        transition={{
          opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          x: { type: "spring", stiffness: 46, damping: 16, mass: 1.1 },
          y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* The bordeaux quarter circle — cut by the lower right corner, moving
          against the capsule so the two never travel as one block. */}
      <m.span
        className="hero-shape hero-shape--quarter tds-shape tds-shape--quarter-tl tds-shape--bordeaux"
        initial={{ opacity: 0, x: 140, y: 140 }}
        animate={{
          opacity: 1,
          x: pointer.x * -PARALLAX.quarter,
          y: [0, 36, 0],
        }}
        transition={{
          opacity: { duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
          x: { type: "spring", stiffness: 40, damping: 18, mass: 1.2 },
          y: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.1 },
        }}
      />

      {/* The gold node WALKS THE CONDUIT instead of blinking where it stands.
          The waypoints trace `ui/CircuitRun.astro`'s first path — right along
          the lower run, up at the corner, then right again — as fractions of
          the shape's own offset parent, so it keeps to the line at any width.
          It is the farthest of the three, so it answers the pointer least. */}
      <m.span
        className="hero-shape hero-shape--node tds-shape tds-shape--capsule tds-shape--gold"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          scale: 1,
          x: narrow ? [0, 60, 120, 180, 220] : [0, 90, 90, 190, 190],
          y: narrow ? [0, 0, 0, 0, 0] : [0, 0, -58, -58, -58],
        }}
        transition={{
          scale: { type: "spring", stiffness: 200, damping: 15, delay: 0.5 },
          opacity: { duration: 7, repeat: Infinity, times: [0, 0.12, 0.5, 0.88, 1], delay: 0.5 },
          x: { duration: 7, repeat: Infinity, times: [0, 0.3, 0.45, 0.85, 1], ease: "easeInOut", delay: 0.5 },
          y: { duration: 7, repeat: Infinity, times: [0, 0.3, 0.45, 0.85, 1], ease: "easeInOut", delay: 0.5 },
        }}
      />
    </MotionScope>
  );
}
