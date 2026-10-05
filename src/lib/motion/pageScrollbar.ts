/**
 * The page scrollbar's motion (`components/PageScrollbar.astro`,
 * `lib/pageScrollbar.ts`, 2026-10-05).
 *
 * The bar works without this file: `data-state` on the rail switches it in
 * CSS from one state to the next with no animation, which is also what a
 * visitor with reduced motion gets. Here the same three states are played on
 * springs:
 *
 * - hidden → shown: the rail slides in from the edge and fades up, the thumb
 *   and the arrows at their slim size;
 * - shown → active (the pointer ON the bar, or a drag): the thumb widens and
 *   the arrows grow, with a little bounce;
 * - back to hidden: a short, unbouncy fade out to the edge.
 *
 * Transform and opacity only. The thumb's POSITION is `translate`, written by
 * the behaviour per scroll frame; Motion animates `transform` on the pill
 * inside it and on the rail, so the two never write the same property.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

const IN = { type: "spring", bounce: 0.2, visualDuration: 0.32 } as const;
const GROW = { type: "spring", bounce: 0.4, visualDuration: 0.36 } as const;
const OUT = { duration: 0.22, ease: [0.4, 0, 1, 1] } as const;

/** Thumb width and arrow size per state, as scales of their full size. */
const SIZE = {
  hidden: { pill: 0.4, arrow: 0.6 },
  shown: { pill: 0.5, arrow: 0.75 },
  active: { pill: 1, arrow: 1 },
} as const;

export function mountPageScrollbar({ animate }: Dom): void {
  const rail = document.querySelector<HTMLElement>("[data-page-scrollbar-rail]");
  if (!rail) return;
  const pill = rail.querySelector<HTMLElement>("[data-scrollbar-pill]");
  const arrows = [...rail.querySelectorAll<HTMLElement>("[data-scrollbar-arrow]")];
  if (!pill) return;

  // Start from the CURRENT state, written inline: Motion reads a start value
  // from the inline style, and the CSS state's `translateX(10px)` would be
  // replaced by Motion's own transform at x = 0 — the first slide-in would
  // have no slide.
  let previous = (rail.dataset.state ?? "hidden") as keyof typeof SIZE;
  const now = { duration: 0 } as const;
  void animate(rail, previous === "hidden" ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }, now);
  void animate(pill, { scaleX: SIZE[previous].pill }, now);
  for (const arrow of arrows) void animate(arrow, { scale: SIZE[previous].arrow }, now);

  const play = () => {
    const state = (rail.dataset.state ?? "hidden") as keyof typeof SIZE;
    if (!(state in SIZE)) return;
    if (state === previous) return;
    const size = SIZE[state];
    if (state === "hidden") {
      void animate(rail, { opacity: 0, x: 10 }, OUT);
    } else if (previous === "hidden") {
      void animate(rail, { opacity: 1, x: 0 }, IN);
    }
    const transition = state === "active" ? GROW : state === "hidden" ? OUT : IN;
    void animate(pill, { scaleX: size.pill }, transition);
    for (const arrow of arrows) void animate(arrow, { scale: size.arrow }, transition);
    previous = state;
  };

  new MutationObserver(play).observe(rail, { attributes: true, attributeFilter: ["data-state"] });
}
