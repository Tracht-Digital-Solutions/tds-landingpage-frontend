/**
 * The floating tree in the bottom corner (`components/FloatingCta.astro`).
 *
 * Two things become springs here; without Motion both still happen in CSS.
 *
 * 1. **The spread.** `--tree-spread` (0 → 1) moves the branches apart and
 *    stretches their necks. CSS transitions it on a bezier; here it follows
 *    the same states — pointer near, hover, keyboard focus inside — on a
 *    spring, written inline, so it overshoots a little and settles.
 * 2. **The trunk standing down.** When `data-suppressed` flips (hero or
 *    contact form on screen), the receiver shrinks away and comes back on a
 *    spring. CSS keeps `visibility: hidden` back until the exit has played
 *    (see the `data-motion="on"` rules there). The two branches are left
 *    alone on purpose: the accessibility tools never leave, and "Nach oben"
 *    follows the scroll with its own CSS rule.
 *
 * Transform and opacity only, plus the one custom property.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

const SPRING = { type: "spring", bounce: 0.38, visualDuration: 0.42 } as const;

export function mountFloatingCta({ animate }: Dom): void {
  const group = document.querySelector<HTMLElement>(".floating-cta-group");
  const trunk = group?.querySelector<HTMLElement>(".floating-cta");
  if (!group || !trunk) return;

  // --- Spread -------------------------------------------------------------
  let spread = 0;
  let hovered = false;
  const syncSpread = () => {
    const next = hovered || group.dataset.near === "true" || group.matches(":focus-within") ? 1 : 0;
    if (next === spread) return;
    const from = spread;
    spread = next;
    void animate(from, next, {
      ...SPRING,
      onUpdate: (value: number) => group.style.setProperty("--tree-spread", String(value)),
    });
  };
  group.style.setProperty("--tree-spread", "0");
  for (const child of Array.from(group.children) as HTMLElement[]) {
    child.addEventListener("pointerenter", () => {
      hovered = true;
      syncSpread();
    });
    child.addEventListener("pointerleave", () => {
      hovered = false;
      syncSpread();
    });
  }
  group.addEventListener("focusin", syncSpread);
  group.addEventListener("focusout", () => requestAnimationFrame(syncSpread));

  // --- Trunk in and out ---------------------------------------------------
  const hidden = () =>
    group.dataset.suppressed === "true" ||
    (group.dataset.suppressed === undefined && document.getElementById("hero") !== null);

  let shown = !hidden();
  // The resting state is written without animation: nothing on screen at
  // mount time is ever reset or replayed.
  if (!shown) void animate(trunk, { opacity: 0, scale: 0.3, y: 18 }, { duration: 0 });

  const syncTrunk = () => {
    const next = !hidden();
    if (next === shown) return;
    shown = next;
    if (next) {
      void animate(trunk, { opacity: [0, 1] }, { duration: 0.18 });
      void animate(trunk, { scale: [0.3, 1], y: [18, 0] }, SPRING);
    } else {
      void animate(trunk, { opacity: 0 }, { duration: 0.2, delay: 0.12 });
      void animate(trunk, { scale: 0.3, y: 18 }, { type: "spring", bounce: 0, visualDuration: 0.3 });
    }
  };

  new MutationObserver(() => {
    syncSpread();
    syncTrunk();
  }).observe(group, { attributes: true, attributeFilter: ["data-suppressed", "data-near"] });
}
