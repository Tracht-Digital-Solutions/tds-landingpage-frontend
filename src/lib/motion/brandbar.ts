/**
 * The brand bar answers the pointer — as THREE KEYS (2026-10-05, third
 * version).
 *
 * Every `.tds-brandbar` on screen is split into its three colour segments,
 * and the segments are played like keys: the one under the pointer JUMPS UP
 * and stretches taller, its neighbours follow a little, and the moment the
 * pointer enters a key it gets a strike — a kick of velocity — so a quick
 * sweep along the bar runs a wave through the three colours. Leaving, they
 * drop back with a short, crisp bounce.
 *
 * What it replaced, the same day: a fisheye that WIDENED the segment under
 * the pointer, and before that (2026-09-22/28) a lean of the whole bar.
 * Julian asked for something completely different and snappier — so this
 * moves the keys vertically instead of stretching them sideways, and the
 * spring is roughly three times as stiff.
 *
 * ### How a background becomes three keys
 *
 * tds-shared draws the bar as three background layers on one element, which
 * cannot move apart. On mount each bar gets three `aria-hidden` spans at the
 * segments' positions, coloured from the bar's own computed layers (so the
 * on-dark variant keeps its colours), and `.lp-brandbar-keys` hides the
 * bar's own layers. No JavaScript, a failed import, reduced motion or a
 * coarse pointer: no spans, and the bar is the plain tds-shared bar.
 *
 * Only `transform` on the spans is written per frame. The bar itself is left
 * alone — the hero's bar draws itself in with a transform on the BAR
 * (`hero-bar-draw` in `Hero.astro`), and the keys simply ride along.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

/** How far above and below the bar the pointer still plays it, px. */
const REACH_Y = 70;
/** How far beside a key the pointer still moves it, px. */
const REACH_X = 26;
/** How high the struck key jumps, px. */
const HOP = 7;
/** How much taller the struck key gets, as a share of its height. */
const STRETCH = 1.2;
/** The strike: upward velocity a key gets when the pointer enters it, px/s. */
const KICK = 260;

/** The spring — stiff and only lightly damped: fast, with a crisp bounce. */
const STIFFNESS = 620;
const DAMPING = 24;
const REST = 0.01;

export interface KeyBox {
  left: number;
  width: number;
}

/**
 * How much each key is played, 0..1, for a pointer `dx` px along the bar and
 * `dy` px from its centre line. Pure, so it can be tested without a DOM.
 */
export function keyWeights(keys: readonly KeyBox[], dx: number, dy: number): number[] {
  const vertical = Math.max(0, 1 - Math.abs(dy) / REACH_Y);
  return keys.map(({ left, width }) => {
    const outside = Math.max(left - dx, 0, dx - (left + width));
    return vertical * Math.max(0, 1 - outside / REACH_X);
  });
}

const px = (value: string, fontSize: number) => {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return 0;
  return value.trim().endsWith("rem") ? number * fontSize : number;
};

/** The first colour of each `linear-gradient(...)` layer, in order. */
function layerColours(backgroundImage: string): string[] {
  const out: string[] = [];
  const pattern = /linear-gradient\(\s*([a-z-]+\([^()]*\)|#[0-9a-fA-F]{3,8}|[a-z]+)/g;
  for (const match of backgroundImage.matchAll(pattern)) out.push(match[1]!);
  return out;
}

interface Key {
  el: HTMLSpanElement;
  box: KeyBox;
  y: number;
  vy: number;
  s: number;
  vs: number;
  weight: number;
  target: { y: number; s: number };
}

interface Bar {
  el: HTMLElement;
  keys: Key[];
  /** Resting box in DOCUMENT coordinates — measured, never read per frame. */
  left: number;
  centreY: number;
  live: boolean;
}

export function mountBrandbars({ inView, hasFinePointer }: Dom): void {
  if (!hasFinePointer()) return;
  const rootFont = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const bars: Bar[] = [];

  /** Key positions from the bar's tokens, which can change per breakpoint. */
  function layoutKeys(bar: Bar): void {
    const style = getComputedStyle(bar.el);
    const widths = [1, 2, 3].map((n) => px(style.getPropertyValue(`--tds-brandbar-${n}`), rootFont));
    const gap = px(style.getPropertyValue("--tds-brandbar-gap"), rootFont);
    let left = 0;
    bar.keys.forEach((key, i) => {
      key.box = { left, width: widths[i]! };
      key.el.style.left = `${left}px`;
      key.el.style.width = `${widths[i]}px`;
      left += widths[i]! + gap;
    });
  }

  for (const el of document.querySelectorAll<HTMLElement>(".tds-brandbar")) {
    const colours = layerColours(getComputedStyle(el).backgroundImage);
    if (colours.length < 3) continue;
    const keys: Key[] = colours.slice(0, 3).map((colour) => {
      const span = document.createElement("span");
      span.className = "lp-brandbar-key";
      span.setAttribute("aria-hidden", "true");
      span.style.background = colour;
      el.append(span);
      return { el: span, box: { left: 0, width: 0 }, y: 0, vy: 0, s: 1, vs: 0, weight: 0, target: { y: 0, s: 1 } };
    });
    el.classList.add("lp-brandbar-keys");
    const bar: Bar = { el, keys, left: 0, centreY: 0, live: false };
    layoutKeys(bar);
    bars.push(bar);
    inView(el, () => {
      bar.live = true;
      measure(bar);
      return () => {
        bar.live = false;
        for (const key of bar.keys) key.target = { y: 0, s: 1 };
        start();
      };
    });
  }
  if (bars.length === 0) return;

  /** The bar's resting box. Keys move only by transform, so it never drifts. */
  function measure(bar: Bar): void {
    const box = bar.el.getBoundingClientRect();
    bar.left = box.left + window.scrollX;
    bar.centreY = box.top + box.height / 2 + window.scrollY;
  }

  let pointerX = 0;
  let pointerY = 0;
  let hasPointer = false;
  let frame = 0;
  let last = 0;

  /** Re-aim every live bar at the pointer. Pure arithmetic — no layout. */
  function aim(): void {
    for (const bar of bars) {
      if (!bar.live) continue;
      const weights = hasPointer
        ? keyWeights(
            bar.keys.map((key) => key.box),
            pointerX + window.scrollX - bar.left,
            pointerY + window.scrollY - bar.centreY,
          )
        : bar.keys.map(() => 0);
      bar.keys.forEach((key, i) => {
        const weight = weights[i]!;
        // The strike: entering a key kicks it upward, so it jumps rather
        // than rises.
        if (weight >= 0.5 && key.weight < 0.5) key.vy -= KICK;
        key.weight = weight;
        key.target = { y: -HOP * weight, s: 1 + STRETCH * weight };
      });
    }
  }

  function tick(now: number): void {
    frame = 0;
    // Clamped: a tab returning from the background hands over a gap of
    // seconds, and integrating that in one step throws the spring away.
    const dt = Math.min(0.032, last ? (now - last) / 1000 : 0.016);
    last = now;

    let moving = false;
    for (const bar of bars) {
      for (const key of bar.keys) {
        key.vy += ((key.target.y - key.y) * STIFFNESS - key.vy * DAMPING) * dt;
        key.y += key.vy * dt;
        key.vs += ((key.target.s - key.s) * STIFFNESS - key.vs * DAMPING) * dt;
        key.s += key.vs * dt;
        const settled =
          Math.abs(key.target.y - key.y) < REST &&
          Math.abs(key.vy) < REST &&
          Math.abs(key.target.s - key.s) < REST / 10 &&
          Math.abs(key.vs) < REST;
        if (settled) {
          key.y = key.target.y;
          key.s = key.target.s;
          key.vy = 0;
          key.vs = 0;
        } else {
          moving = true;
        }
        key.el.style.transform =
          key.y === 0 && key.s === 1 ? "" : `translateY(${key.y.toFixed(2)}px) scaleY(${key.s.toFixed(3)})`;
      }
    }

    if (moving) frame = requestAnimationFrame(tick);
    else last = 0;
  }

  function start(): void {
    if (!frame) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  // ONE listener for every bar on the page, and no layout read in it.
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      hasPointer = true;
      aim();
      start();
    },
    { passive: true },
  );

  // The pointer leaving the window is not a pointermove; without this the
  // keys stay up at whatever the last position was.
  document.addEventListener("pointerleave", () => {
    hasPointer = false;
    aim();
    start();
  });

  /**
   * Geometry changes only when the page does. A scroll moves every bar in the
   * viewport, and `aim()` already accounts for that through `scrollY` — so a
   * scroll needs no re-measure, only a re-aim.
   */
  const remeasure = () => {
    for (const bar of bars) {
      layoutKeys(bar);
      if (bar.live) measure(bar);
    }
    aim();
    start();
  };
  window.addEventListener("resize", remeasure);
  new ResizeObserver(remeasure).observe(document.documentElement);
  window.addEventListener(
    "scroll",
    () => {
      aim();
      start();
    },
    { passive: true },
  );
}
