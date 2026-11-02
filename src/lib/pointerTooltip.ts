/**
 * Tooltips at the pointer: a resting mouse over a control with a `title`, a
 * `data-tip` or an icon-only `aria-label` shows its text beside the cursor.
 *
 * The site draws its own cursor and the browser places a native `title` wherever
 * it likes, so the `title` moves to `data-tip` on first contact. The text stays
 * available to assistive technology: it is also set as `aria-label` where the
 * element has no name of its own.
 */
export const TIP_DELAY_MS = 700;
const OFFSET = 16;
const MARGIN = 8;

/** The element whose text to show for `target`, if any. */
export function tipSource(target: Element | null): HTMLElement | null {
  const el = target?.closest<HTMLElement>("[data-tip], [title], a[aria-label], button[aria-label]") ?? null;
  if (!el) return null;
  if (el.hasAttribute("data-tip") || el.hasAttribute("title")) return el;
  // An `aria-label` only counts on an icon-only control: visible words need no tip.
  return (el.textContent ?? "").trim() === "" ? el : null;
}

/** Where the tip goes: beside the pointer, flipped before it leaves the window. */
export function tipPosition(
  x: number,
  y: number,
  box: { width: number; height: number },
  view: { width: number; height: number },
): { left: number; top: number } {
  const left = x + OFFSET + box.width + MARGIN > view.width ? x - OFFSET - box.width : x + OFFSET;
  const top = y + OFFSET + box.height + MARGIN > view.height ? y - OFFSET - box.height : y + OFFSET;
  return { left: Math.max(MARGIN, left), top: Math.max(MARGIN, top) };
}

function textOf(el: HTMLElement): string {
  const title = el.getAttribute("title");
  if (title) {
    el.removeAttribute("title");
    el.dataset.tip = title;
    if (!el.hasAttribute("aria-label") && (el.textContent ?? "").trim() === "") el.setAttribute("aria-label", title);
  }
  return el.dataset.tip ?? el.getAttribute("aria-label") ?? "";
}

export function mountPointerTooltip(): void {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const tip = document.createElement("div");
  tip.className = "lp-tooltip";
  tip.setAttribute("role", "tooltip");
  tip.hidden = true;
  document.body.append(tip);

  let timer = 0;
  let source: HTMLElement | null = null;
  let x = 0;
  let y = 0;

  const place = () => {
    const { left, top } = tipPosition(x, y, tip.getBoundingClientRect(), { width: innerWidth, height: innerHeight });
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  };
  const hide = () => {
    window.clearTimeout(timer);
    tip.hidden = true;
  };
  const show = () => {
    const text = source ? textOf(source) : "";
    if (!text) return;
    tip.textContent = text;
    // Inside an open modal dialog: anything else lies under its top layer.
    (document.querySelector("dialog[open]") ?? document.body).append(tip);
    tip.hidden = false;
    place();
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      const next = tipSource(event.target instanceof Element ? event.target : null);
      // Take the native tooltip away at once, or it opens before ours.
      if (next?.hasAttribute("title")) textOf(next);
      if (next !== source) {
        source = next;
        hide();
      }
      if (!tip.hidden) {
        place();
        return;
      }
      window.clearTimeout(timer);
      if (source) timer = window.setTimeout(show, TIP_DELAY_MS);
    },
    { passive: true },
  );
  document.addEventListener("pointerdown", hide, { passive: true });
  document.addEventListener("scroll", hide, { passive: true, capture: true });
  document.addEventListener("keydown", hide);
  document.documentElement.addEventListener("pointerleave", () => {
    source = null;
    hide();
  });
}
