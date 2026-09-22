/**
 * A colour change exactly at a section line (2026-09-22).
 *
 * The floating pill and the bookmarks are navy on the light page and white on
 * the dark bands (`.tds-tone-navy`, `.tds-tone-ink`). They used to flip as a
 * whole once their middle crossed a band; now an inverted TWIN lies over the
 * element and both are clipped: the twin to the part over a dark band, the
 * original to the rest. The colour changes at the line itself.
 *
 * Everything here is arithmetic on rectangles measured beforehand — nothing
 * reads layout during a scroll frame.
 */

export type Range = readonly [top: number, bottom: number];

/** How far the clip may reach past the box, so the hard shadow is kept. */
export const SHADOW_PAD = 12;

/** The dark bands of the document, in page coordinates. */
export function measureDarkRanges(filter: (element: HTMLElement) => boolean = () => true): Range[] {
  const offset = window.scrollY;
  return Array.from(document.querySelectorAll<HTMLElement>(".tds-tone-navy, .tds-tone-ink"))
    .filter(filter)
    .map((element) => {
      const box = element.getBoundingClientRect();
      return [box.top + offset, box.bottom + offset] as const;
    });
}

/**
 * The part of `[top, bottom]` that lies over dark bands, as one span (the
 * union of every overlap), or `null` when none does.
 */
export function darkSpan(top: number, bottom: number, ranges: readonly Range[]): Range | null {
  let from = Infinity;
  let to = -Infinity;
  for (const [start, end] of ranges) {
    if (end <= top || start >= bottom) continue;
    from = Math.min(from, Math.max(start, top));
    to = Math.max(to, Math.min(end, bottom));
  }
  return from < to ? [from, to] : null;
}

export interface SplitClip {
  /** For the inverted twin: the dark part. */
  twin: string;
  /** For the original: the light part (unclipped when dark sits in the middle). */
  original: string;
}

const HIDDEN = "inset(100% 0 0 0)";

/**
 * Clip paths for an element spanning `[top, bottom]` (same coordinates as the
 * ranges). `allDark` is the dark theme, where every ground is dark.
 */
export function splitClip(top: number, bottom: number, ranges: readonly Range[], allDark = false): SplitClip {
  const pad = SHADOW_PAD;
  const full = `inset(${-pad}px ${-pad}px ${-pad}px ${-pad}px)`;
  if (allDark) return { twin: full, original: HIDDEN };
  const span = darkSpan(top, bottom, ranges);
  if (!span) return { twin: HIDDEN, original: full };
  const [from, to] = span;
  const coversTop = from <= top;
  const coversBottom = to >= bottom;
  if (coversTop && coversBottom) return { twin: full, original: HIDDEN };
  const twinTop = coversTop ? -pad : from - top;
  const twinBottom = coversBottom ? -pad : bottom - to;
  const twin = `inset(${twinTop}px ${-pad}px ${twinBottom}px ${-pad}px)`;
  // The original keeps what the twin does not cover — one side of one line.
  let original = full;
  if (coversTop) original = `inset(${to - top}px ${-pad}px ${-pad}px ${-pad}px)`;
  else if (coversBottom) original = `inset(${-pad}px ${-pad}px ${bottom - from}px ${-pad}px)`;
  return { twin, original };
}

/**
 * A visual-only copy of `source`: `aria-hidden`, `inert`, no ids, no popover
 * wiring, no links and no accessible names, so nothing about it can be
 * reached, announced or submitted twice.
 */
export function makeTwin<T extends HTMLElement>(source: T, twinClass: string): T {
  const twin = source.cloneNode(true) as T;
  twin.classList.add(twinClass);
  twin.setAttribute("aria-hidden", "true");
  twin.setAttribute("inert", "");
  twin.removeAttribute("aria-label");
  for (const node of [twin, ...Array.from(twin.querySelectorAll<HTMLElement>("*"))]) {
    node.removeAttribute("id");
    for (const attr of ["popover", "popovertarget", "popovertargetaction", "href", "aria-label", "aria-labelledby", "aria-controls", "aria-expanded", "role", "data-a11y-open", "data-property-tabs", "data-property-tab"]) {
      if (node !== twin || attr !== "aria-label") node.removeAttribute(attr);
    }
    if (node.tabIndex >= 0 && node !== twin) node.tabIndex = -1;
  }
  // A popover that is closed is display: none; the copy of the a11y panel is
  // not needed at all.
  twin.querySelectorAll(".a11y-panel").forEach((panel) => panel.remove());
  return twin;
}
