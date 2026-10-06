/**
 * The receiver can be SWIPED UP, like answering a call (2026-10-06).
 *
 * A tap still follows the link. Holding the receiver shows a slide TRACK
 * above it, up to the pill's top edge; dragging moves the receiver along it.
 * The moment it reaches the top the contact form opens — while the finger is
 * still down, not on release. Let go earlier and it springs back and nothing
 * happens. The buttons above are never touched: the pointer is captured by
 * the receiver once the drag has started, so neither hover nor click reaches
 * them while it passes over them (the track covers them meanwhile).
 *
 * Pointer capture starts only after `SWIPE_SLOP` pixels — capturing on
 * `pointerdown` swallowed plain clicks elsewhere on this site — and nothing
 * calls `preventDefault()` on `pointerdown`, which would end `mousemove` for
 * the whole press.
 *
 * The state goes onto the pill AND its inverted twin as `data-swipe`
 * ("hold" while pressed, "drag", "answered" once it reached the top) with
 * `--lp-swipe` (the offset), `--lp-swipe-travel` (the track's length) and
 * `--lp-swipe-progress` (0–1), so both layers move alike over a dark band.
 * The CSS lives in `FloatingCta.astro`.
 */

/** Movement before a press counts as a drag rather than a tap. */
export const SWIPE_SLOP = 6;
/** A press held this long shows the track before any movement. */
export const HOLD_DELAY = 120;
/** The track is never shorter than one button… */
export const TRAVEL_MIN = 48;
/** …and never longer than two. */
export const TRAVEL_MAX = 96;

/** The track's length for the room between the receiver and the pill's top. */
export function swipeTravel(reach: number): number {
  return Math.min(TRAVEL_MAX, Math.max(TRAVEL_MIN, Math.round(reach)));
}

/** The receiver's offset for an upward drag of `dy` (`dy > 0` is up). */
export function swipeOffset(dy: number, travel: number): number {
  return Math.min(travel, Math.max(0, dy));
}

/** 0 at rest, 1 at the top of the track. */
export function swipeProgress(offset: number, travel: number): number {
  return travel > 0 ? Math.min(1, Math.max(0, offset / travel)) : 0;
}

/**
 * Whether a movement of (`dx`, `dy`) since the press starts a swipe: past
 * the slop, upwards, and more up than sideways.
 */
export function startsSwipe(dx: number, dy: number, slop: number = SWIPE_SLOP): boolean {
  return dy > slop && dy > Math.abs(dx);
}

type State = "hold" | "drag" | "answered" | null;

/** Wire the gesture onto the receiver of `group`, mirrored onto `twin`. */
export function mountReceiverSwipe(group: HTMLElement, twin?: HTMLElement | null): void {
  const link = group.querySelector<HTMLAnchorElement>(".floating-cta");
  if (!link) return;
  const layers = twin ? [group, twin] : [group];

  let pointer: number | null = null;
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let answered = false;
  let offset = 0;
  let travel = TRAVEL_MIN;
  let holdTimer = 0;
  /** A click arriving before this time ends a drag, not a tap. */
  let swallowUntil = 0;
  /** Set while WE click the link at the top of the track. */
  let passThrough = false;

  const write = (state: State) => {
    for (const layer of layers) {
      if (state) layer.dataset.swipe = state;
      else delete layer.dataset.swipe;
      layer.style.setProperty("--lp-swipe", `${offset.toFixed(1)}px`);
      layer.style.setProperty("--lp-swipe-travel", `${travel}px`);
      layer.style.setProperty("--lp-swipe-progress", swipeProgress(offset, travel).toFixed(3));
    }
  };

  const end = () => {
    window.clearTimeout(holdTimer);
    if (pointer !== null && link.hasPointerCapture?.(pointer)) link.releasePointerCapture(pointer);
    pointer = null;
    dragging = false;
  };

  const reset = () => {
    end();
    answered = false;
    offset = 0;
    write(null);
  };

  link.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    pointer = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    dragging = false;
    answered = false;
    offset = 0;
    // A new press: whatever click is still pending from a drag has passed.
    swallowUntil = 0;
    // The room up to the inside of the pill's top edge (its padding ring).
    const padding = parseFloat(getComputedStyle(group).paddingTop) || 0;
    travel = swipeTravel(link.getBoundingClientRect().top - group.getBoundingClientRect().top - padding);
    window.clearTimeout(holdTimer);
    holdTimer = window.setTimeout(() => {
      if (pointer !== null && !dragging) write("hold");
    }, HOLD_DELAY);
  });

  link.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointer || answered) return;
    const dx = event.clientX - startX;
    const dy = startY - event.clientY;
    if (!dragging) {
      if (!startsSwipe(dx, dy)) return;
      dragging = true;
      window.clearTimeout(holdTimer);
      link.setPointerCapture(event.pointerId);
    }
    offset = swipeOffset(dy, travel);
    if (offset < travel) {
      write("drag");
      return;
    }
    // At the top: pick up NOW. The capture stays until the finger lifts, so
    // the rest of the press still reaches no other button.
    answered = true;
    write("answered");
    passThrough = true;
    link.click();
    passThrough = false;
  });

  link.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointer) return;
    if (!dragging) {
      // A tap, or a press held without moving: the click follows as usual.
      end();
      write(null);
      return;
    }
    swallowUntil = performance.now() + 500;
    if (!answered) {
      reset();
      return;
    }
    end();
    // Let the receiver sit at the top a moment before it drops back.
    window.setTimeout(reset, 260);
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
