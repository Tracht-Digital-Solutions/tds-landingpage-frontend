/**
 * The receiver can be SWIPED UP, like answering a call (2026-10-06).
 *
 * A tap still follows the link. A drag that starts on the receiver and goes
 * up lifts it out of the pill; released past `SWIPE_THRESHOLD` it "picks up"
 * and opens the contact form, released earlier it springs back and nothing
 * happens. The buttons above are never touched: the pointer is captured by
 * the receiver once the drag has started, so neither hover nor click reaches
 * them while it passes over them.
 *
 * Pointer capture starts only after `SWIPE_SLOP` pixels — capturing on
 * `pointerdown` swallowed plain clicks elsewhere on this site — and nothing
 * calls `preventDefault()` on `pointerdown`, which would end `mousemove` for
 * the whole press.
 *
 * The state goes onto the pill AND its inverted twin as `data-swipe`
 * ("drag", "armed" once a release would pick up, "answered") and
 * `--lp-swipe` / `--lp-swipe-progress`, so both layers move alike over a
 * dark band. The CSS lives in `FloatingCta.astro`.
 */

/** Movement before a press counts as a drag rather than a tap. */
export const SWIPE_SLOP = 6;
/** How far up a release must be to pick up. */
export const SWIPE_THRESHOLD = 40;
/** The receiver never travels further than this, however far the drag goes. */
export const SWIPE_MAX = 72;

/**
 * The offset for an upward drag of `dy` pixels (`dy > 0` is up): followed 1:1
 * up to `max`, then a rubber band that slows and stops at `max + 12`.
 * A downward drag stays at 0.
 */
export function swipeOffset(dy: number, max: number = SWIPE_MAX): number {
  if (!(dy > 0)) return 0;
  if (dy <= max) return dy;
  const over = dy - max;
  return max + 12 * (1 - 1 / (1 + over / 24));
}

/** 0 at rest, 1 at the threshold (clamped). */
export function swipeProgress(offset: number, threshold: number = SWIPE_THRESHOLD): number {
  return Math.min(1, Math.max(0, offset / threshold));
}

/**
 * Whether a movement of (`dx`, `dy`) since the press starts a swipe: past
 * the slop, upwards, and more up than sideways.
 */
export function startsSwipe(dx: number, dy: number, slop: number = SWIPE_SLOP): boolean {
  return dy > slop && dy > Math.abs(dx);
}

/**
 * Wire the gesture onto the receiver of `group`, mirrored onto `twin`.
 * `navigate` opens the destination; it defaults to clicking the link, so a
 * swipe goes exactly where a tap goes.
 */
export function mountReceiverSwipe(group: HTMLElement, twin?: HTMLElement | null): void {
  const link = group.querySelector<HTMLAnchorElement>(".floating-cta");
  if (!link) return;
  const layers = twin ? [group, twin] : [group];

  let pointer: number | null = null;
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let offset = 0;
  let max = SWIPE_MAX;
  /** A click arriving before this time ends a drag, not a tap. */
  let swallowUntil = 0;
  /** Set while WE click the link after a swipe. */
  let passThrough = false;

  const write = (state: "drag" | "armed" | "answered" | null) => {
    for (const layer of layers) {
      if (state) layer.dataset.swipe = state;
      else delete layer.dataset.swipe;
      layer.style.setProperty("--lp-swipe", `${offset.toFixed(1)}px`);
      layer.style.setProperty("--lp-swipe-progress", swipeProgress(offset).toFixed(3));
    }
  };

  const end = () => {
    if (pointer !== null && link.hasPointerCapture?.(pointer)) link.releasePointerCapture(pointer);
    pointer = null;
    dragging = false;
  };

  const reset = () => {
    end();
    offset = 0;
    write(null);
  };

  link.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    pointer = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    dragging = false;
    // A new press: whatever click is still pending from a drag has passed.
    swallowUntil = 0;
    // Room up to the pill's top edge, inside the bounds above.
    const reach = link.getBoundingClientRect().top - group.getBoundingClientRect().top;
    max = Math.min(SWIPE_MAX, Math.max(SWIPE_THRESHOLD + 8, reach));
  });

  link.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointer) return;
    const dx = event.clientX - startX;
    const dy = startY - event.clientY;
    if (!dragging) {
      if (!startsSwipe(dx, dy)) return;
      dragging = true;
      link.setPointerCapture(event.pointerId);
    }
    offset = swipeOffset(dy, max);
    write(offset >= SWIPE_THRESHOLD ? "armed" : "drag");
  });

  link.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointer) return;
    if (!dragging) {
      end();
      return;
    }
    swallowUntil = performance.now() + 500;
    if (offset < SWIPE_THRESHOLD) {
      reset();
      return;
    }
    end();
    write("answered");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      passThrough = true;
      link.click();
      passThrough = false;
      offset = 0;
      write(null);
    }, reduce ? 0 : 180);
  });

  link.addEventListener("pointercancel", reset);
  // Only the link's own loss. A touch starts with an implicit capture on the
  // element under the finger (the icon's path); taking it over fires
  // `lostpointercapture` THERE, and the event bubbles up to here.
  link.addEventListener("lostpointercapture", (event) => {
    if (event.target === link && dragging) reset();
  });

  // The click that ends a drag is not a tap. Capture phase, so the site's
  // own hash-link handling never sees it.
  link.addEventListener(
    "click",
    (event) => {
      if (passThrough || performance.now() >= swallowUntil) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    { capture: true },
  );

  // A mouse drag on a link starts the browser's own link drag otherwise.
  link.addEventListener("dragstart", (event) => event.preventDefault());
}
