/**
 * The bookmarks on the left edge (`components/PropertyTabs.astro`).
 *
 * CSS parks every tab with only its icon showing and slides it in on hover and
 * focus by itself. With Motion the slide becomes a spring, and the tabs next
 * to the one under the pointer lean out a little with it — a stack of
 * bookmarks being thumbed, not four separate buttons.
 *
 * Transform only: the parked position stays the CSS `translate`, and the
 * travel Motion adds is the tab's width minus its peek, measured when it
 * opens (a label can change width with the language or the font).
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

const DOCK_QUERY = "(min-width: 64rem) and (hover: hover) and (pointer: fine)";
/** Must match `--tab-peek` in `PropertyTabs.astro`. */
const PEEK_PX = 48;
/** How far a neighbour leans out with the open tab. */
const NEIGHBOUR_PX = 10;

/**
 * Coming OUT bounces; going back does not (2026-09-28, asked for).
 *
 * `pointerSpring` settles in one barely visible swing — right for a control
 * that tracks the pointer, too flat for a bookmark being thumbed out of a
 * stack. The overshoot is what makes it read as a physical card catching at
 * the end of its travel. Returning stays on the shared spring: a bookmark
 * springing back past its parked position would look like a mistake, and four
 * of them doing it at once even more so.
 */
const OUT_SPRING = { type: "spring", bounce: 0.38, visualDuration: 0.42 } as const;

export function mountPropertyTabs({ animate, pointerSpring }: Dom): void {
  const nav = document.querySelector<HTMLElement>("[data-property-tabs]");
  if (!nav) return;
  const tabs = Array.from(nav.querySelectorAll<HTMLElement>("[data-property-tab]"));
  if (tabs.length === 0) return;
  const dock = window.matchMedia(DOCK_QUERY);
  // The inverted twin (PropertyTabs.astro) slides with the originals.
  const twinTabs = Array.from(document.querySelectorAll<HTMLElement>(".property-tabs--twin .property-tab"));

  let active: HTMLElement | null = null;
  const travel = (tab: HTMLElement) => Math.max(0, tab.offsetWidth - PEEK_PX);

  const show = (next: HTMLElement | null) => {
    if (next === active) return;
    active = next;
    const index = next ? tabs.indexOf(next) : -1;
    tabs.forEach((tab, i) => {
      let x = 0;
      if (i === index) x = travel(tab);
      else if (index >= 0 && Math.abs(i - index) === 1) x = NEIGHBOUR_PX;
      // Out on the bouncing spring, back on the flat one.
      const transition = x > 0 ? OUT_SPRING : pointerSpring;
      void animate(tab, { x }, transition);
      const twin = twinTabs[i];
      if (twin) void animate(twin, { x }, transition);
    });
  };

  for (const tab of tabs) {
    tab.addEventListener("pointerenter", () => dock.matches && show(tab));
    tab.addEventListener("focus", () => dock.matches && show(tab));
    tab.addEventListener("blur", () => {
      if (!nav.matches(":hover")) show(null);
    });
  }
  nav.addEventListener("pointerleave", () => {
    if (!nav.contains(document.activeElement)) show(null);
  });
  dock.addEventListener("change", () => {
    active = null;
    [...tabs, ...twinTabs].forEach((tab) => void animate(tab, { x: 0 }, { duration: 0 }));
  });
}
