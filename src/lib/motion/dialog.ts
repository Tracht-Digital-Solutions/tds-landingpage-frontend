/**
 * Motion for every modal `<dialog>` on the site: it bounces in when it opens
 * and bounces out before it closes (decided 2026-09-21).
 *
 * The platform keeps doing the hard parts — `showModal()` still traps focus,
 * makes the page inert and gives Escape — this only puts a spring around the
 * two moments. Three details make it safe:
 *
 * - **Escape is animated too.** `cancel` is intercepted and routed through the
 *   same exit, so the keyboard does not get a harder close than the mouse.
 * - **The exit always ends in `dialog.close()`**, raced against a timeout: a
 *   background tab never runs animation frames, and a promise that never
 *   settles would leave a modal open that looks closed.
 * - **Reduced motion, or a runtime that failed to load, means the plain
 *   dialog**, opened and closed at once. The runtime is fetched lazily, like
 *   the rest of `lib/motion`, and never blocks the dialog from opening.
 *
 * The backdrop cannot be animated from JS (it is a pseudo-element); it fades
 * with CSS on `[data-closing]`, which the exit sets.
 */
import { lessMotion } from "~/lib/a11yPrefs";

type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

let runtime: Promise<Dom | null> | null = null;
function load(): Promise<Dom | null> {
  runtime ??= import("@tracht-digital-solutions/tds-shared/motion/dom").catch(() => null);
  return runtime;
}

/** prefers-reduced-motion: reduce, or the site's own motion switch. */
const reduced = () => lessMotion();

/** The bounce: a spring that overshoots once and settles. */
const BOUNCE_IN = { type: "spring", bounce: 0.42, visualDuration: 0.42 } as const;

export interface AnimatedDialog {
  open(): void;
  close(): void;
}

export function animatedDialog(dialog: HTMLDialogElement): AnimatedDialog {
  let closing = false;

  // Warm the runtime once the page is idle, so the first open is not the
  // request that fetches it.
  if (!reduced()) {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(() => void load());
    else window.setTimeout(() => void load(), 1500);
  }

  const reset = () => {
    dialog.style.removeProperty("opacity");
    dialog.style.removeProperty("transform");
    delete dialog.dataset.closing;
  };

  const open = () => {
    if (dialog.open) return;
    reset();
    dialog.showModal();
    if (reduced()) return;
    void load().then((dom) => {
      if (!dom || !dialog.open || closing) return;
      void dom.animate(dialog, { scale: [0.82, 1], y: [28, 0] }, BOUNCE_IN);
      void dom.animate(dialog, { opacity: [0, 1] }, { duration: 0.18 });
    });
  };

  const close = () => {
    if (!dialog.open || closing) return;
    if (reduced()) {
      dialog.close();
      return;
    }
    closing = true;
    dialog.dataset.closing = "";
    const finish = () => {
      if (!closing) return;
      closing = false;
      dialog.close();
      reset();
    };
    const timer = window.setTimeout(finish, 520);
    void load().then((dom) => {
      if (!dom) return finish();
      // A small lift first, then the drop — the bounce read in reverse.
      void dom
        .animate(
          dialog,
          { scale: [1, 1.035, 0.82], y: [0, -8, 28], opacity: [1, 1, 0] },
          { duration: 0.34, times: [0, 0.3, 1], ease: [0.4, 0, 0.8, 0.4] },
        )
        .then(() => {
          window.clearTimeout(timer);
          finish();
        });
    });
  };

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });

  return { open, close };
}
