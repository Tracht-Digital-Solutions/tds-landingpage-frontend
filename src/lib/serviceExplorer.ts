/**
 * The services list on the home page (`components/ui/ServiceExplorer.astro`,
 * 2026-09-22): four titles, one open panel.
 *
 * ONE markup for both layouts — the disclosure pattern: every service is an
 * `<h3><button aria-expanded aria-controls>` followed by its panel.
 *
 * - **Desktop (≥ 64rem)** lays the titles out in the left column and every
 *   panel in the right one; exactly one is open. A click opens it, and so
 *   does a pointer that RESTS on a title (`HOVER_INTENT_MS`), so the panel
 *   does not flicker while the pointer crosses the list.
 * - **Phone** is an accordion: the panel sits under its title, one at a time,
 *   and a second click closes it again.
 * - ↑/↓, Home and End move between the titles in both.
 *
 * Without JavaScript every panel is visible — `hidden` is only ever set here,
 * so the content is in the server-rendered page for readers and crawlers.
 */

export const EXPLORER_DESKTOP_QUERY = "(min-width: 64rem)";
export const HOVER_INTENT_MS = 140;

/** The title a key press moves the focus to, or `null` for any other key. */
export function nextIndex(current: number, key: string, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case "ArrowDown":
      return (current + 1) % count;
    case "ArrowUp":
      return (current - 1 + count) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}

/**
 * Which panel is open after a click on `clicked`. Desktop never closes the
 * last one — there is always a panel beside the list; the accordion does.
 */
export function afterClick(open: number | null, clicked: number, desktop: boolean): number | null {
  if (desktop) return clicked;
  return open === clicked ? null : clicked;
}

interface MountOptions {
  /** Called with the panel that just opened, for its entrance animation. */
  onOpen?: (panel: HTMLElement) => void;
}

export function mountServiceExplorer(root: HTMLElement, options: MountOptions = {}): void {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-explorer-button]"));
  const panels = buttons.map((button) =>
    document.getElementById(button.getAttribute("aria-controls") ?? ""),
  );
  if (buttons.length === 0 || panels.some((panel) => !panel)) return;
  const marker = root.querySelector<HTMLElement>("[data-explorer-marker]");
  const desktop = window.matchMedia(EXPLORER_DESKTOP_QUERY);

  let open: number | null = 0;

  const placeMarker = () => {
    if (!marker) return;
    const head = open === null ? null : buttons[open]!.parentElement;
    if (!desktop.matches || !head) {
      marker.hidden = true;
      return;
    }
    marker.hidden = false;
    marker.style.setProperty("--marker-y", `${head.offsetTop}px`);
    marker.style.setProperty("--marker-h", `${head.offsetHeight}px`);
    marker.style.setProperty("--marker-w", `${head.offsetWidth}px`);
  };

  const show = (next: number | null, animate: boolean) => {
    const changed = next !== open;
    open = next;
    buttons.forEach((button, index) => {
      const expanded = index === open;
      button.setAttribute("aria-expanded", String(expanded));
      panels[index]!.hidden = !expanded;
    });
    root.dataset.open = open === null ? "" : String(open);
    placeMarker();
    if (animate && changed && open !== null) options.onOpen?.(panels[open]!);
  };

  let hoverTimer = 0;
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => show(afterClick(open, index, desktop.matches), true));
    button.addEventListener("keydown", (event) => {
      const target = nextIndex(index, event.key, buttons.length);
      if (target === null) return;
      event.preventDefault();
      buttons[target]!.focus();
    });
    button.addEventListener("pointerenter", (event) => {
      if (!desktop.matches || event.pointerType !== "mouse") return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => show(index, true), HOVER_INTENT_MS);
    });
    button.addEventListener("pointerleave", () => window.clearTimeout(hoverTimer));
  });

  // Desktop always shows a panel; switching layouts keeps (or restores) one.
  desktop.addEventListener("change", () => show(open ?? 0, false));
  new ResizeObserver(placeMarker).observe(root);

  root.dataset.enhanced = "true";
  show(0, false);
}
