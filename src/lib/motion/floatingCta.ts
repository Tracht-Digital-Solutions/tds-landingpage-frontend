/**
 * The floating pill in the bottom corner (`components/FloatingCta.astro`).
 *
 * The pill folds its slots open and shut in CSS (`grid-template-rows`), so
 * it works without this file. Motion adds one thing: when a slot opens — the
 * receiver after the hero or the form has left the screen, "Nach oben" after
 * the first viewport — its icon pops in on a spring, so the eye sees WHICH
 * button just arrived. Transform only, on the icon, never on the pill.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

const SPRING = { type: "spring", bounce: 0.45, visualDuration: 0.42 } as const;

export function mountFloatingCta(dom: Dom): void {
  // The pill and its inverted twin (FloatingCta.astro) pop alike.
  document.querySelectorAll<HTMLElement>(".floating-cta-group").forEach((group) => mountOne(group, dom));
}

function mountOne(group: HTMLElement, { animate }: Dom): void {
  const trunkIcon = group.querySelector<SVGElement>(".floating-cta .tree-icon");
  const topIcon = group.querySelector<SVGElement>(".floating-cta-top .tree-icon");

  const trunkOpen = () => group.dataset.suppressed === "false";
  const topOpen = () => group.dataset.scrolledDown === "true";

  // Nothing on screen at mount time is replayed: remember the current state.
  let trunk = trunkOpen();
  let top = topOpen();

  const pop = (icon: SVGElement | null) => {
    if (!icon) return;
    void animate(icon, { scale: [0.3, 1], rotate: [-25, 0] }, SPRING);
  };

  new MutationObserver(() => {
    const nextTrunk = trunkOpen();
    const nextTop = topOpen();
    if (nextTrunk && !trunk) pop(trunkIcon);
    if (nextTop && !top) pop(topIcon);
    trunk = nextTrunk;
    top = nextTop;
  }).observe(group, { attributes: true, attributeFilter: ["data-suppressed", "data-scrolled-down"] });
}
