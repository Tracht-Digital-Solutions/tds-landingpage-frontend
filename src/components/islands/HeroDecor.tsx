import { useEffect, useState } from "react";
import { MotionScope, m, useCoarsePointer } from "@tracht-digital-solutions/tds-shared/motion/react";

/**
 * The hero's constructed geometry, animated.
 *
 * ### What this island is allowed to touch, and why the line is where it is
 *
 * The hero used to be a React island in its entirety. Its eyebrow, headline,
 * sub and buttons were motion elements, so their server-rendered markup
 * carried the entrance's start state — `style="opacity:0"` — and until React
 * hydrated, the most important screen of the site was blank. On a phone the
 * largest thing left to paint was the cookie notice, which became the page's
 * LCP element at 4.1 s.
 *
 * So the rule is not "no motion in the hero". It is: **no text node, and no
 * image, may depend on hydration to become visible.** The copy is plain HTML
 * in `sections/Hero.astro` and paints with the first frame. The background
 * photo is a plain `<picture>` there too. What is left — three geometric
 * shapes that bleed off the section's edges — is what this island renders.
 *
 * Two properties make an entrance state safe here where it was fatal there:
 *
 * 1. These shapes are `hidden xl:block` / `hidden lg:block`. Below 1280 px
 *    (and the gold node below 1024 px) they do not exist at all, so the phone
 *    — the device the incident was measured on — renders exactly what it
 *    rendered before this island existed.
 * 2. They are `aria-hidden` decoration behind `pointer-events: none`. Nothing
 *    reads them, nothing clicks them, and no text waits on them.
 *
 * `src/__tests__/motion.test.ts` holds that line as a contract.
 *
 * ### The choreography
 *
 * Three movements, all quiet, in the vocabulary the design system already
 * uses (`AGENTS.md`: geometry, no pulses, no blobs, no glows):
 *
 * - **Arrival.** Each shape drifts in along the axis it is already cut by —
 *   the capsule from the left edge, the quarter circle from the lower right,
 *   the node straight up. Springs, not curves: a cut shape that overshoots
 *   its own edge slightly reads as weight rather than as a slide.
 * - **Drift.** Afterwards they keep moving, a handful of pixels over fifteen
 *   to twenty-odd seconds, each on its own period so the group never returns
 *   to a formation the eye can catch. This is the part that makes the screen
 *   feel alive rather than painted.
 * - **Parallax.** The pointer pushes them apart by depth — the big navy
 *   capsule furthest, the small node least. Mouse only: on a touch screen
 *   there is no pointer to follow, and `useCoarsePointer` answers that
 *   without guessing from the viewport width.
 *
 * Reduced motion: this component renders the resting shapes and returns. Not
 * a zero duration, not a transition removed — no motion values, no listener,
 * no animation frames at all.
 */

/** How far each shape follows the pointer, in px at the screen's edge. */
const PARALLAX = { capsule: 26, quarter: 18, node: 8 } as const;

export default function HeroDecor() {
  const coarse = useCoarsePointer();
  const [reduced, setReduced] = useState(false);
  /**
   * Pointer offset in [-1, 1] per axis. Plain state rather than motion values:
   * it is written from one `pointermove` listener on the window and read by
   * three springs, and at this scale the extra indirection buys nothing.
   */
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
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

  // The resting markup, identical to what this section rendered before the
  // island existed. Also what the server renders on a reduced-motion request
  // is irrelevant — the client decides — but a visitor who never gets past
  // this branch sees the finished picture, not an empty hero.
  if (reduced) {
    return (
      <>
        <span
          className="tds-shape tds-shape--capsule tds-shape--navy hidden xl:block"
          style={{ bottom: "-7rem", left: "-16rem", width: "32rem", height: "13rem" }}
        />
        <span
          className="tds-shape tds-shape--quarter-tl tds-shape--bordeaux hidden xl:block"
          style={{ bottom: "-15rem", right: "-11rem", width: "26rem", height: "26rem" }}
        />
        <span
          className="tds-shape tds-shape--capsule tds-shape--gold hidden lg:block"
          style={{ bottom: "7%", left: "44%", width: "0.5rem", height: "0.5rem", opacity: 0.9 }}
        />
      </>
    );
  }

  return (
    <MotionScope>
      {/* The navy capsule — cut by the left edge, so it arrives from there. */}
      <m.span
        className="tds-shape tds-shape--capsule tds-shape--navy hidden xl:block"
        style={{ bottom: "-7rem", left: "-16rem", width: "32rem", height: "13rem" }}
        initial={{ opacity: 0, x: -64 }}
        animate={{
          opacity: 1,
          x: pointer.x * PARALLAX.capsule,
          y: [0, -14, 0],
        }}
        transition={{
          opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          x: { type: "spring", stiffness: 42, damping: 18, mass: 1.1 },
          y: { duration: 19, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* The bordeaux quarter circle — cut by the lower right corner. */}
      <m.span
        className="tds-shape tds-shape--quarter-tl tds-shape--bordeaux hidden xl:block"
        style={{ bottom: "-15rem", right: "-11rem", width: "26rem", height: "26rem" }}
        initial={{ opacity: 0, x: 48, y: 48 }}
        animate={{
          opacity: 1,
          x: pointer.x * -PARALLAX.quarter,
          y: [0, 12, 0],
        }}
        transition={{
          opacity: { duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
          x: { type: "spring", stiffness: 38, damping: 20, mass: 1.2 },
          y: { duration: 23, repeat: Infinity, ease: "easeInOut", delay: 0.12 },
        }}
      />

      {/* The single gold node. The one thing here that may be read as a
          highlight, so it arrives last and moves least. */}
      <m.span
        className="tds-shape tds-shape--capsule tds-shape--gold hidden lg:block"
        style={{ bottom: "7%", left: "44%", width: "0.5rem", height: "0.5rem" }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: [0.9, 0.55, 0.9],
          scale: 1,
          x: pointer.x * PARALLAX.node,
          y: pointer.y * PARALLAX.node,
        }}
        transition={{
          opacity: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          scale: { type: "spring", stiffness: 180, damping: 14, delay: 0.45 },
          x: { type: "spring", stiffness: 60, damping: 22 },
          y: { type: "spring", stiffness: 60, damping: 22 },
        }}
      />
    </MotionScope>
  );
}
