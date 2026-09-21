/**
 * The mini business card docked on the contact section's right edge.
 *
 * From 64rem with a fine pointer, CSS (`.mini-card` in `Contact.astro`) pins
 * the card to the section's edge with only its tab showing. Without this
 * script it still opens on hover and on keyboard focus, through CSS alone.
 * With it, the card slides out on a spring as soon as the pointer comes
 * NEAR — before the visitor has to find a 44 px tab — and back in once it
 * leaves.
 *
 * Hysteresis (open under 160 px, close beyond 240 px) so a pointer resting on
 * the boundary does not make the card flutter. Pointer positions are read at
 * most once a frame. Keyboard focus opens it too, and it stays open while
 * focus is inside.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

const OPEN_WITHIN = 160;
const CLOSE_BEYOND = 240;
/** Must match `--mini-card-tab` in `Contact.astro`. */
const TAB_PX = 44;
const DOCK_QUERY = "(min-width: 64rem) and (hover: hover) and (pointer: fine)";

/** Distance from a point to a rectangle; 0 inside it. */
export function distanceToRect(x: number, y: number, box: { left: number; right: number; top: number; bottom: number }): number {
  const dx = Math.max(box.left - x, 0, x - box.right);
  const dy = Math.max(box.top - y, 0, y - box.bottom);
  return Math.hypot(dx, dy);
}

export function mountBusinessCard({ animate, pointerSpring, inView }: Dom): void {
  const card = document.querySelector<HTMLElement>("#contact .mini-card");
  const section = document.getElementById("contact");
  if (!card || !section) return;
  const dock = window.matchMedia(DOCK_QUERY);

  let open = false;
  let near = false;
  let frame = 0;
  let px = 0;
  let py = 0;

  const restX = () => card.offsetWidth - TAB_PX;
  const set = (next: boolean) => {
    if (next === open) return;
    open = next;
    card.dataset.open = next ? "true" : "false";
    void animate(card, { x: next ? 0 : restX() }, pointerSpring);
  };

  const place = () => {
    if (dock.matches) {
      card.dataset.docked = "true";
      open = false;
      void animate(card, { x: restX() }, { duration: 0 });
    } else {
      delete card.dataset.docked;
      void animate(card, { x: 0 }, { duration: 0 });
      card.style.removeProperty("transform");
    }
  };

  const check = () => {
    frame = 0;
    const box = card.getBoundingClientRect();
    const distance = distanceToRect(px, py, box);
    if (!open && distance < OPEN_WITHIN) near = true;
    else if (open && distance > CLOSE_BEYOND) near = false;
    if (!card.contains(document.activeElement)) set(near);
  };

  const onMove = (event: PointerEvent) => {
    if (!dock.matches) return;
    px = event.clientX;
    py = event.clientY;
    if (!frame) frame = requestAnimationFrame(check);
  };

  // Listen only while the section is on screen.
  inView(section, () => {
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      near = false;
      if (dock.matches) set(false);
    };
  });

  card.addEventListener("focusin", () => dock.matches && set(true));
  card.addEventListener("focusout", () => dock.matches && set(near));
  dock.addEventListener("change", place);
  window.addEventListener("resize", () => dock.matches && !open && void animate(card, { x: restX() }, { duration: 0 }));
  place();
}
