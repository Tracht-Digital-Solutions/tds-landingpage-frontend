/**
 * The generated photographs (`[data-motion-image]`): the four section grounds
 * and the four service photos. They settle into place as they scroll in, then
 * drift slightly slower than the page — a depth cue, never a content move.
 *
 * Why it is safe for the LCP: the photos are decoration (`alt=""`), none is
 * the LCP element (the H1 is, pinned by `audit:perf`), and an image that is
 * already on screen when this runs is NOT reset to a start state — it only
 * gets the drift. On a phone the hero photo is a 1×1 GIF (see `Hero.astro`),
 * so there is nothing to animate there.
 *
 * TRANSFORM ONLY. The section grounds carry their resting opacity in CSS
 * (0.2–0.38, lower in dark mode); an opacity tween would overwrite it. And no
 * clip-path: it is not composited and was measured as jank on phones.
 *
 * The drift needs headroom so the photo's edge never shows: every image rests
 * at scale 1.08, which leaves 4 % of its height on each side for ±20 px.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

const REST_SCALE = 1.08;

function onScreen(el: Element): boolean {
  const box = el.getBoundingClientRect();
  return box.bottom > 0 && box.top < window.innerHeight;
}

export function mountImages({ animate, inView, scroll, hover }: Dom): void {
  const images = Array.from(document.querySelectorAll<HTMLElement>("[data-motion-image]"));
  for (const image of images) {
    const frame = image.parentElement ?? image;
    const visible = onScreen(image);

    // Start values go through Motion (duration 0) rather than a style
    // string, so Motion knows them as its own `scale`/`y` and animates from
    // there instead of parsing a matrix back.
    if (visible) {
      void animate(image, { scale: REST_SCALE }, { duration: 0 });
    } else {
      // Start state, written only now and only off screen.
      // Scale only: `y` belongs to the scroll drift below, and a second
      // animation on the same value would stop the drift for good.
      void animate(image, { scale: REST_SCALE + 0.12 }, { duration: 0 });
      inView(
        frame,
        () => {
          void animate(image, { scale: REST_SCALE }, { duration: 1.1, ease: [0.2, 0.8, 0.2, 1] });
        },
        { amount: 0.15 },
      );
    }

    // Parallax on its own axis (`y`), so it composes with the scale above
    // rather than fighting it for the same transform.
    scroll(animate(image, { y: [-20, 20] }, { ease: "linear" }), {
      target: frame,
      offset: ["start end", "end start"],
    });

    // Service photos zoom a little further while their tile is hovered — the
    // same cue the CSS gave before, now on the transform Motion owns.
    const tile = image.closest<HTMLElement>("[data-motion-tile]");
    if (tile) {
      hover(tile, () => {
        void animate(image, { scale: REST_SCALE + 0.05 }, { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] });
        return () => void animate(image, { scale: REST_SCALE }, { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] });
      });
    }
  }
}
