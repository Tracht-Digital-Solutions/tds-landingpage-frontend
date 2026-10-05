/**
 * The page's own scrollbar (`components/PageScrollbar.astro`, 2026-10-05).
 *
 * Julian: the scrollbar appears only when the pointer comes near the right
 * edge, is invisible otherwise, and moves with Motion. A native scrollbar can
 * do none of that — it cannot fade, and hiding it changes `clientWidth`, so
 * the page reflows every time it would come and go. So on a device with a
 * mouse the native bar is switched off once, before the first paint
 * (`PAGE_SCROLLBAR_BOOT_SCRIPT` in <head>), and this draws a bar that FLOATS
 * over the content: an up arrow, a thumb, a down arrow.
 *
 * This file is the behaviour and works on its own: geometry, dragging, the
 * arrows, a click on the track, and the state on the rail —
 * `data-state="hidden" | "shown" | "active"` (active = the pointer is ON the
 * bar, or the thumb is being dragged). CSS answers the state without any
 * animation; `lib/motion/pageScrollbar.ts` animates the same changes when
 * the Motion layer is loaded.
 *
 * Keyboard, wheel and touch scroll the page natively as before, so the bar is
 * a pointer aid only: `aria-hidden`, its buttons out of the tab order.
 */

/** The attribute on <html> that switches the native bar off. */
export const PAGE_SCROLLBAR_ATTR = "data-page-scrollbar";

/**
 * Inline, in <head>, before anything paints: a device with a mouse gets the
 * floating bar, so its native one goes. Touch keeps the platform's own.
 */
export const PAGE_SCROLLBAR_BOOT_SCRIPT = `try{if(matchMedia("(hover: hover) and (pointer: fine)").matches)document.documentElement.setAttribute("${PAGE_SCROLLBAR_ATTR}","")}catch(e){}`;

/** How near the right edge the pointer has to come, px. */
export const NEAR = 72;
/** The thumb is never shorter than this, px — it has to stay grabbable. */
export const MIN_THUMB = 36;
/** One arrow click, px. */
export const ARROW_STEP = 140;

export type ScrollbarState = "hidden" | "shown" | "active";

/** Thumb length and offset along a track, for the page's scroll position. */
export function thumbGeometry(input: {
  viewport: number;
  scrollHeight: number;
  scrollY: number;
  track: number;
}): { size: number; offset: number } {
  const { viewport, scrollHeight, scrollY, track } = input;
  const max = Math.max(0, scrollHeight - viewport);
  if (max === 0 || track <= 0) return { size: track, offset: 0 };
  const size = Math.min(track, Math.max(MIN_THUMB, (track * viewport) / scrollHeight));
  const progress = Math.min(1, Math.max(0, scrollY / max));
  return { size, offset: progress * (track - size) };
}

/** The scroll position a thumb at `offset` along the track stands for. */
export function scrollForOffset(input: {
  offset: number;
  size: number;
  track: number;
  max: number;
}): number {
  const { offset, size, track, max } = input;
  const room = track - size;
  if (room <= 0) return 0;
  return Math.min(max, Math.max(0, (offset / room) * max));
}

/** Move the page — through the site's Lenis when it is there. */
function scrollPage(y: number, immediate: boolean): void {
  if (window.tdsScrollTo) window.tdsScrollTo(y, { immediate });
  else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}

export function mountPageScrollbar(rail: HTMLElement): void {
  const root = document.documentElement;
  if (!root.hasAttribute(PAGE_SCROLLBAR_ATTR)) return;

  const track = rail.querySelector<HTMLElement>("[data-scrollbar-track]");
  const thumb = rail.querySelector<HTMLElement>("[data-scrollbar-thumb]");
  const up = rail.querySelector<HTMLButtonElement>("[data-scrollbar-up]");
  const down = rail.querySelector<HTMLButtonElement>("[data-scrollbar-down]");
  if (!track || !thumb || !up || !down) return;

  let trackLength = 0;
  let size = 0;
  let near = false;
  let over = false;
  let dragging = false;
  let frame = 0;

  const maxScroll = () => Math.max(0, root.scrollHeight - root.clientHeight);

  const setState = () => {
    const state: ScrollbarState =
      maxScroll() === 0 ? "hidden" : dragging || over ? "active" : near ? "shown" : "hidden";
    if (rail.dataset.state !== state) rail.dataset.state = state;
  };

  const layout = () => {
    frame = 0;
    trackLength = track.clientHeight;
    const geometry = thumbGeometry({
      viewport: root.clientHeight,
      scrollHeight: root.scrollHeight,
      scrollY: window.scrollY,
      track: trackLength,
    });
    size = geometry.size;
    thumb.style.height = `${size.toFixed(1)}px`;
    thumb.style.translate = `0 ${geometry.offset.toFixed(1)}px`;
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(layout);
  };

  layout();
  setState();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", () => {
    schedule();
    setState();
  });
  new ResizeObserver(() => {
    schedule();
    setState();
  }).observe(document.body);

  // Near: within NEAR px of the right edge. The pointer leaving the window
  // hides the bar — unless a drag is running, which must not lose its thumb.
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      const next = event.clientX >= window.innerWidth - NEAR;
      if (next !== near) {
        near = next;
        setState();
      }
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => {
    near = false;
    setState();
  });
  rail.addEventListener("pointerenter", () => {
    over = true;
    setState();
  });
  rail.addEventListener("pointerleave", () => {
    over = false;
    setState();
  });

  // Dragging the thumb. Capture only from the thumb, and only for the drag —
  // the arrows and the track keep their plain clicks.
  let grab = 0;
  thumb.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const box = thumb.getBoundingClientRect();
    grab = event.clientY - box.top;
    dragging = true;
    thumb.setPointerCapture(event.pointerId);
    setState();
  });
  thumb.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const top = track.getBoundingClientRect().top;
    scrollPage(
      scrollForOffset({ offset: event.clientY - top - grab, size, track: trackLength, max: maxScroll() }),
      true,
    );
  });
  const endDrag = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (thumb.hasPointerCapture(event.pointerId)) thumb.releasePointerCapture(event.pointerId);
    near = event.clientX >= window.innerWidth - NEAR;
    setState();
  };
  thumb.addEventListener("pointerup", endDrag);
  thumb.addEventListener("pointercancel", endDrag);

  // A click on the empty track pages toward it, like a native bar.
  track.addEventListener("click", (event) => {
    if (event.target !== track) return;
    const thumbBox = thumb.getBoundingClientRect();
    const direction = event.clientY < thumbBox.top ? -1 : 1;
    scrollPage(window.scrollY + direction * root.clientHeight * 0.85, false);
  });

  // The arrows: one step per click; held down, they keep going.
  const hold = (button: HTMLButtonElement, direction: -1 | 1) => {
    let timer = 0;
    let repeat = 0;
    const stop = () => {
      window.clearTimeout(timer);
      window.clearInterval(repeat);
    };
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      scrollPage(window.scrollY + direction * ARROW_STEP, false);
      timer = window.setTimeout(() => {
        repeat = window.setInterval(() => scrollPage(window.scrollY + direction * 28, true), 30);
      }, 380);
    });
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointerleave", stop);
    button.addEventListener("pointercancel", stop);
  };
  hold(up, -1);
  hold(down, 1);
}
