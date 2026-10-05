/**
 * The brand bar answers the pointer (2026-09-22, rebuilt 2026-09-28, and
 * re-thought 2026-10-05).
 *
 * Every `.tds-brandbar` on screen — the one under the hero's slogan and the
 * one under each section heading — is played like a row of keys: the colour
 * segment UNDER the pointer swells, its neighbours swell less, the seams
 * between them open and the whole bar thickens as the pointer comes near.
 * Running the pointer along a bar runs the swell across its three colours;
 * when the pointer leaves, everything springs back with a bounce.
 *
 * What it replaced: the whole bar leaned toward the pointer and stretched all
 * three segments by fixed shares. It reacted to how NEAR the pointer was, but
 * never to WHERE along the bar it was, so a bar looked the same whichever
 * colour the pointer was over — Julian asked for something different and
 * better. The lean is gone; nothing writes `translate` any more.
 *
 * Only the bar's own tokens (`--tds-brandbar-1/2/3`, `--tds-brandbar-gap`) and
 * `scale` are written, never `transform`: the hero's bar draws itself in with
 * a transform (`hero-bar-draw` in `Hero.astro`), and the two must not fight.
 * `scale` is vertical only, so the thickening never moves the content below
 * the bar. Fine pointers only; bars off screen do not listen at all.
 *
 * The cost rules of the 2026-09-28 rebuild still hold: one listener, one frame
 * loop, geometry measured only when it can change, distances taken from the
 * bar's RESTING box (the live box grows as it swells, and measuring it would
 * feed the swell back into itself), and a spring integrated in place so its
 * velocity survives from frame to frame.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

/** How near the pointer has to come, px from the bar's RESTING box. */
const REACH = 150;
/** How much a segment grows at most when the pointer is right over it, px. */
const SWELL = 30;
/** How much every segment grows anyway at the closest, as a share of its width. */
const LIFT = 0.15;
/** How far the seams open at the closest, px. */
const SEAM = 4;
/** How much thicker the bar gets at the closest, as a share of its height. */
const THICKEN = 0.9;
/**
 * How wide the swell is along the bar, as a share of the bar's length. Wide
 * enough that a neighbour still moves, narrow enough that the segment under
 * the pointer clearly leads.
 */
const SPREAD = 0.3;

/**
 * The spring, integrated per frame.
 *
 * Underdamped on purpose — `DAMPING² < 4·STIFFNESS` is what gives the return
 * its overshoot. These two are the whole feel: stiffer follows the pointer
 * more tightly, less damping bounces longer.
 */
const STIFFNESS = 210;
const DAMPING = 16;
/** Below this a value has arrived and the loop may stop. */
const REST = 0.02;

/** Three segment widths, the seam, and the vertical scale. */
type Values = [number, number, number, number, number];

/**
 * Where each value of a bar should go, for a pointer at `along` (0 = the
 * bar's left end, 1 = its right end, may lie outside) and `closeness` (0 out
 * of reach, 1 touching). Pure, so it can be tested without a DOM.
 */
export function brandbarTarget(
  base: readonly [number, number, number],
  gap: number,
  along: number,
  closeness: number,
): Values {
  const length = base[0] + base[1] + base[2] + 2 * gap;
  const centres = [
    base[0] / 2,
    base[0] + gap + base[1] / 2,
    base[0] + base[1] + 2 * gap + base[2] / 2,
  ].map((centre) => centre / length);
  const swell = (i: 0 | 1 | 2) => {
    const weight = Math.exp(-(((along - centres[i]!) / SPREAD) ** 2));
    return base[i] * (1 + LIFT * closeness) + SWELL * weight * closeness;
  };
  return [swell(0), swell(1), swell(2), gap + SEAM * closeness, 1 + THICKEN * closeness];
}

const px = (value: string, fontSize: number) => {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return 0;
  return value.trim().endsWith("rem") ? number * fontSize : number;
};

interface Bar {
  el: HTMLElement;
  /** Resting segment widths and seam, px. */
  base: readonly [number, number, number];
  gap: number;
  /** Resting box in DOCUMENT coordinates — measured, never read per frame. */
  left: number;
  top: number;
  width: number;
  height: number;
  value: Values;
  target: Values;
  velocity: Values;
  /** In the viewport, and therefore worth integrating. */
  live: boolean;
}

export function mountBrandbars({ inView, hasFinePointer }: Dom): void {
  if (!hasFinePointer()) return;
  const root = document.documentElement;
  const rootFont = Number.parseFloat(getComputedStyle(root).fontSize) || 16;

  const bars: Bar[] = [];

  for (const el of document.querySelectorAll<HTMLElement>(".tds-brandbar")) {
    const style = getComputedStyle(el);
    const base = [1, 2, 3].map((n) => px(style.getPropertyValue(`--tds-brandbar-${n}`), rootFont));
    const gap = px(style.getPropertyValue("--tds-brandbar-gap"), rootFont);
    if (base.some((width) => width <= 0)) continue;
    const rest = brandbarTarget(base as unknown as [number, number, number], gap, 0, 0);
    const bar: Bar = {
      el,
      base: base as unknown as readonly [number, number, number],
      gap,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      value: [...rest],
      target: [...rest],
      velocity: [0, 0, 0, 0, 0],
      live: false,
    };
    bars.push(bar);
    inView(el, () => {
      bar.live = true;
      measure(bar);
      return () => {
        bar.live = false;
        // Send it home rather than freezing it mid-swell off screen.
        bar.target = brandbarTarget(bar.base, bar.gap, 0, 0);
        start();
      };
    });
  }
  if (bars.length === 0) return;

  /**
   * The bar's RESTING box, in document coordinates.
   *
   * Resting, because the box grows as the bar swells: measuring the live box
   * made the distance depend on the swell it was supposed to produce. The
   * width is computed from the base values, and the left edge is where the
   * bar starts — a swelling bar grows to the right.
   */
  function measure(bar: Bar): void {
    const box = bar.el.getBoundingClientRect();
    bar.left = box.left + window.scrollX;
    bar.width = bar.base[0] + bar.base[1] + bar.base[2] + 2 * bar.gap;
    // `scale` grows the box around its centre; take it back out.
    bar.height = box.height / bar.value[4];
    bar.top = box.top + box.height / 2 - bar.height / 2 + window.scrollY;
  }

  function apply(bar: Bar): void {
    const [s1, s2, s3, gap, sy] = bar.value;
    bar.el.style.setProperty("--tds-brandbar-1", `${s1.toFixed(2)}px`);
    bar.el.style.setProperty("--tds-brandbar-2", `${s2.toFixed(2)}px`);
    bar.el.style.setProperty("--tds-brandbar-3", `${s3.toFixed(2)}px`);
    bar.el.style.setProperty("--tds-brandbar-gap", `${gap.toFixed(2)}px`);
    bar.el.style.scale = `1 ${sy.toFixed(3)}`;
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
      if (!hasPointer) {
        bar.target = brandbarTarget(bar.base, bar.gap, 0, 0);
        continue;
      }
      const x = pointerX + window.scrollX;
      const y = pointerY + window.scrollY;
      // Distance to the resting BOX, not to its centre: a long bar answers
      // along its whole length, and the pointer right on it is distance 0.
      const dx = Math.max(bar.left - x, 0, x - (bar.left + bar.width));
      const dy = Math.max(bar.top - y, 0, y - (bar.top + bar.height));
      const closeness = Math.max(0, 1 - Math.hypot(dx, dy) / REACH);
      const along = (x - bar.left) / bar.width;
      bar.target = brandbarTarget(bar.base, bar.gap, along, closeness);
    }
  }

  function tick(now: number): void {
    frame = 0;
    // Clamped: a tab returning from the background hands over a gap of
    // seconds, and integrating that in one step throws the spring across the
    // screen before it settles.
    const dt = Math.min(0.032, last ? (now - last) / 1000 : 0.016);
    last = now;

    let moving = false;
    for (const bar of bars) {
      let settled = true;
      for (let i = 0; i < 5; i += 1) {
        const distance = bar.target[i]! - bar.value[i]!;
        const v = bar.velocity[i]! + (distance * STIFFNESS - bar.velocity[i]! * DAMPING) * dt;
        bar.velocity[i] = v;
        bar.value[i] = bar.value[i]! + v * dt;
        if (Math.abs(distance) > REST || Math.abs(v) > REST) settled = false;
      }
      if (settled) {
        // Land exactly, so a bar at rest carries no rounding drift.
        for (let i = 0; i < 5; i += 1) {
          bar.value[i] = bar.target[i]!;
          bar.velocity[i] = 0;
        }
      } else {
        moving = true;
      }
      apply(bar);
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
  // bars stay swollen at whatever the last position was.
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
    for (const bar of bars) if (bar.live) measure(bar);
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
