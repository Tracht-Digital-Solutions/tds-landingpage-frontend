/**
 * Cards that answer the pointer in depth (`[data-motion-tilt]`): price
 * packages and the showcase cards. Not the service tiles: they are cells of
 * a 1 px seam mosaic, and a tilted cell tears the seams.
 *
 * - **Tilt:** under a fine pointer the card leans toward it, up to `MAX`
 *   degrees on each axis, through a fixed perspective. Never on touch — a
 *   finger has no position to lean toward before it lands.
 * - **Return:** leaving the card springs it back flat with a light bounce,
 *   like the CTA's magnetic return.
 * - **Dragging the showcase** flattens the card and holds it flat; the shelf
 *   is moving, not the card.
 *
 * Delegated from `document`, so the showcase's cloned slides tilt too. Only
 * `rotateX`/`rotateY`/`transformPerspective` are written — they compose with
 * the package cards' `y` lift from `ux.ts`; the hard shadow's CSS `translate`
 * lift is a separate property and tilts along. No glare, no animated shadow.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

/** Degrees at the card's edge: enough to read as depth, calm enough for text. */
const MAX = 6;
const PERSPECTIVE = 900;
const RETURN = { type: "spring", bounce: 0.35, visualDuration: 0.5 } as const;

export function mountTilt({ animate, pointerSpring, hasFinePointer }: Dom): void {
  if (!hasFinePointer()) return;
  if (!document.querySelector("[data-motion-tilt]")) return;

  let current: HTMLElement | null = null;

  const flatten = (card: HTMLElement) => {
    void animate(card, { rotateX: 0, rotateY: 0, transformPerspective: PERSPECTIVE }, RETURN);
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const target = event.target instanceof Element ? event.target : null;
      const card = target?.closest<HTMLElement>("[data-motion-tilt]") ?? null;
      if (card !== current) {
        if (current) flatten(current);
        current = card;
      }
      if (!card) return;
      if (card.closest(".is-dragging")) {
        flatten(card);
        return;
      }
      const box = card.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (event.clientX - (box.left + box.width / 2)) / (box.width / 2)));
      const dy = Math.max(-1, Math.min(1, (event.clientY - (box.top + box.height / 2)) / (box.height / 2)));
      void animate(card, { rotateX: -dy * MAX, rotateY: dx * MAX, transformPerspective: PERSPECTIVE }, pointerSpring);
    },
    { passive: true },
  );

  // The pointer leaving the window over a card never reaches another target.
  document.documentElement.addEventListener("pointerleave", () => {
    if (current) flatten(current);
    current = null;
  });
}
