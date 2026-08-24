/**
 * Input lock for the duration of a programmatic scroll.
 *
 * The bounce-eased jumps in `islands/SmoothScroll.tsx` (nav links, the hero
 * CTAs, the logo, the back-to-top nub) drive the scroll position frame by
 * frame for 1.2s. Anything the visitor does with the wheel, a finger or the
 * keyboard in that window fights the tween for the same one property, and
 * both paths handled that differently and badly: on desktop Lenis kept
 * writing its own position, so the visitor's wheel simply did nothing and
 * the page felt stuck; on touch the tween *cancelled itself* on the first
 * touch, so a jump that began while the finger was still on the glass was
 * abandoned halfway to a section — arriving nowhere in particular.
 *
 * This locks the input instead: for the length of the jump the page belongs
 * to the animation, and it is handed back the moment the jump lands.
 *
 * WHAT IS DELIBERATELY NOT BLOCKED, because a scroll lock is the kind of
 * thing that quietly breaks a page:
 *
 *  - **Ctrl/⌘ + wheel** is browser ZOOM, not scrolling. Blocking it takes
 *    page zoom away from someone who very likely needs it.
 *  - **Arrow / Home / End inside an editable control** move the caret. The
 *    contact form is on this page; eating those would look like a dead
 *    keyboard.
 *  - **Space on a button, link or summary** activates it. Space is a scroll
 *    key only when nothing focusable is holding it.
 *  - **Every other key**: Tab, Escape and shortcuts stay live, so focus can
 *    always leave and nothing can trap a keyboard user.
 *
 * And it always ends: the listeners come off on completion, and a safety
 * timeout releases them anyway if a completion callback never fires. A lock
 * that can outlive its animation would be a page that cannot be scrolled at
 * all, with nothing in the console to say why.
 */

/** Keys with which the browser scrolls the document. */
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar", // legacy `key` value, still emitted by older engines
]);

/** Elements whose own keyboard handling outranks scrolling. */
const EDITABLE = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** Elements that treat Space as "activate me". */
const SPACE_ACTIVATES = new Set(["BUTTON", "A", "SUMMARY", "DETAILS", "OPTION"]);

function isEditable(node: EventTarget | null): boolean {
  if (!(node instanceof HTMLElement)) return false;
  return EDITABLE.has(node.tagName) || node.isContentEditable;
}

/**
 * Does this keystroke mean "scroll the document"? Exported because it is the
 * whole policy above expressed as one function, and it is the part worth
 * testing without a scroll animation anywhere near it.
 */
export function isScrollKey(event: KeyboardEvent): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) return false;
  if (!SCROLL_KEYS.has(event.key)) return false;

  const target = event.target;
  if (isEditable(target)) return false;
  if (
    (event.key === " " || event.key === "Spacebar") &&
    target instanceof HTMLElement &&
    SPACE_ACTIVATES.has(target.tagName)
  ) {
    return false;
  }
  return true;
}

/** A wheel event the visitor means as scrolling, rather than as zoom. */
export function isScrollWheel(event: WheelEvent): boolean {
  return !event.ctrlKey && !event.metaKey;
}

export interface ScrollLock {
  /** Start swallowing scroll input. Calling it while engaged only extends the safety window. */
  engage(): void;
  /** Hand the page back. Safe to call when not engaged. */
  release(): void;
  /** Detach everything — for a component unmount. */
  destroy(): void;
  readonly engaged: boolean;
}

export interface ScrollLockOptions {
  /** Where the listeners go. Defaults to `window`; injected in tests. */
  target?: EventTarget;
  /**
   * Hard ceiling, ms. The lock releases itself after this no matter what,
   * so a jump that never reports completion cannot leave the page frozen.
   */
  maxDurationMs?: number;
}

export function createScrollLock(options: ScrollLockOptions = {}): ScrollLock {
  const target = options.target ?? (globalThis as unknown as EventTarget);
  const maxDurationMs = options.maxDurationMs ?? 3000;

  let engaged = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const swallowWheel = (event: Event) => {
    if (isScrollWheel(event as WheelEvent)) event.preventDefault();
  };
  const swallowTouch = (event: Event) => {
    event.preventDefault();
  };
  const swallowKey = (event: Event) => {
    if (isScrollKey(event as KeyboardEvent)) event.preventDefault();
  };

  // `passive: false` is the load-bearing half of every one of these. A wheel
  // or touchmove listener is passive BY DEFAULT on window in every current
  // browser, and `preventDefault()` inside a passive listener does nothing
  // at all — no error, no warning that survives a production build, just a
  // lock that silently is not one.
  const opts: AddEventListenerOptions = { passive: false };

  const attach = () => {
    target.addEventListener("wheel", swallowWheel, opts);
    target.addEventListener("touchmove", swallowTouch, opts);
    target.addEventListener("keydown", swallowKey, opts);
  };
  const detach = () => {
    target.removeEventListener("wheel", swallowWheel, opts);
    target.removeEventListener("touchmove", swallowTouch, opts);
    target.removeEventListener("keydown", swallowKey, opts);
  };

  const release = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (!engaged) return;
    engaged = false;
    detach();
  };

  const engage = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(release, maxDurationMs);
    if (engaged) return;
    engaged = true;
    attach();
  };

  return {
    engage,
    release,
    destroy: release,
    get engaged() {
      return engaged;
    },
  };
}
