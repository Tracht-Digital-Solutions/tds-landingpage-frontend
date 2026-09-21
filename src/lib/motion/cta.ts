/**
 * The primary call to action, animated with Motion. Every `[data-cta]` —
 * the hero's "Erstgespräch vereinbaren", the floating button, the one under
 * the prices and the one closing a service page.
 *
 * - **Magnetic:** under a fine pointer the button leans up to 6 px toward the
 *   cursor and springs back when it leaves. Never on touch — a finger has no
 *   position to lean toward before it lands.
 * - **Press:** a short squeeze to 0.96 on pointer AND keyboard activation,
 *   released on a spring.
 * - **Arrival:** one light sweep across the button the first time it scrolls
 *   into view — the one moment it asks for attention. Not a loop: a pulsing
 *   CTA is exactly the "gratuitous motion" AGENTS.md rules out.
 *
 * Transforms only; the button's colour change on hover stays CSS.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

const PULL = 6;

export function mountCta({ animate, hover, press, inView, pointerSpring, hasFinePointer }: Dom): void {
  const buttons = Array.from(document.querySelectorAll<HTMLElement>("[data-cta]"));
  if (buttons.length === 0) return;
  const fine = hasFinePointer();

  for (const button of buttons) {
    if (fine) {
      hover(button, () => {
        const move = (event: PointerEvent) => {
          const box = button.getBoundingClientRect();
          const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
          const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
          void animate(button, { x: dx * PULL, y: dy * PULL * 0.6 }, pointerSpring);
        };
        button.addEventListener("pointermove", move);
        return () => {
          button.removeEventListener("pointermove", move);
          void animate(button, { x: 0, y: 0 }, pointerSpring);
        };
      });
    }

    press(button, () => {
      void animate(button, { scale: 0.96 }, { duration: 0.12 });
      return () => void animate(button, { scale: 1 }, pointerSpring);
    });

    // The arrival sweep: a child layer, so the button's own background and
    // its hover colour are untouched.
    const shine = document.createElement("span");
    shine.className = "cta-shine";
    shine.setAttribute("aria-hidden", "true");
    button.append(shine);
    inView(
      button,
      () => {
        void animate(shine, { x: ["-120%", "220%"] }, { duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.25 });
      },
      { amount: 0.8 },
    );
  }
}
