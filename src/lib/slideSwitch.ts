/**
 * Two-way switches slide by hand (2026-10-19, asked for: "Slidebutton … sollen
 * slidebar sein mit Maus und Touch").
 *
 * The net/gross switch of the price list, the calculator's and the
 * accessibility toggles already change on a tap. Now the thumb can also be
 * dragged: it follows the pointer between its two ends and, on release,
 * settles on the side it is nearer to. A tap stays a tap.
 *
 * - Pointer capture starts only after `SLIDE_SLOP` sideways pixels (capturing
 *   on `pointerdown` swallowed plain clicks on this site), and nothing calls
 *   `preventDefault()` on `pointerdown` (it ends `mousemove` for the press).
 * - The switch is `touch-action: pan-y` in its CSS, so a vertical swipe over
 *   it still scrolls the page and a sideways one reaches the script.
 * - While dragged the thumb is written inline (`transform`, no transition);
 *   on release both inline values go in the same frame, so the switch's own
 *   CSS transition carries the thumb from the hand to its end.
 * - The click a drag ends in is swallowed, or a toggle button would flip back.
 */

/** Sideways movement before a press counts as a slide. */
export const SLIDE_SLOP = 6;

/** The thumb's offset for a drag of `dx` from `start`, kept on the track. */
export function thumbOffset(start: number, dx: number, travel: number): number {
  return Math.min(travel, Math.max(0, start + dx));
}

/** Whether a thumb released at `offset` settles on the far ("on") end. */
export function settlesOn(offset: number, travel: number): boolean {
  return travel > 0 && offset > travel / 2;
}

interface SlideOptions {
  /** The moving part. */
  thumb: HTMLElement;
  /** How far the thumb moves from its "off" end to its "on" end, in px. */
  travel: () => number;
  /** Whether the switch is on (thumb at the far end) right now. */
  isOn: () => boolean;
  /** Apply a state chosen by sliding; called only when it changes. */
  set: (on: boolean) => void;
}

export function mountSlideSwitch(root: HTMLElement, { thumb, travel, isOn, set }: SlideOptions): void {
  let pointer: number | null = null;
  let startX = 0;
  let startY = 0;
  let start = 0;
  let span = 0;
  let offset = 0;
  let sliding = false;
  /** A click arriving before this time ends a slide, not a tap. */
  let swallowUntil = 0;

  const release = () => {
    thumb.style.removeProperty("transition");
    thumb.style.removeProperty("transform");
    delete root.dataset.sliding;
  };

  const end = () => {
    if (pointer !== null && root.hasPointerCapture?.(pointer)) root.releasePointerCapture(pointer);
    pointer = null;
    sliding = false;
  };

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    pointer = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    sliding = false;
    swallowUntil = 0;
  });

  root.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointer) return;
    const dx = event.clientX - startX;
    if (!sliding) {
      if (Math.abs(dx) <= SLIDE_SLOP || Math.abs(dx) <= Math.abs(event.clientY - startY)) return;
      sliding = true;
      span = travel();
      start = isOn() ? span : 0;
      root.setPointerCapture(event.pointerId);
      root.dataset.sliding = "";
      thumb.style.transition = "none";
    }
    offset = thumbOffset(start, dx, span);
    thumb.style.transform = `translateX(${offset.toFixed(1)}px)`;
  });

  root.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointer) return;
    if (!sliding) {
      end();
      return;
    }
    swallowUntil = performance.now() + 400;
    end();
    const on = settlesOn(offset, span);
    release();
    if (on !== isOn()) set(on);
  });

  const cancel = () => {
    if (!sliding) {
      end();
      return;
    }
    end();
    release();
  };
  root.addEventListener("pointercancel", cancel);
  root.addEventListener("lostpointercapture", (event) => {
    if (event.target === root && sliding) cancel();
  });

  root.addEventListener(
    "click",
    (event) => {
      if (performance.now() >= swallowUntil) return;
      swallowUntil = 0;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    { capture: true },
  );
}
