/**
 * The brand bar answers the pointer (2026-09-22, rebuilt 2026-09-28).
 *
 * Every `.tds-brandbar` on screen — the one under the hero's slogan and the
 * one under each section heading — leans toward a pointer that comes near and
 * stretches its three segments, the more the closer it is; when the pointer
 * leaves, it springs back with a bounce.
 *
 * Only `translate` and the bar's own segment tokens (`--tds-brandbar-1/2/3`)
 * are written, never `transform`: the hero's bar draws itself in with a
 * transform (`hero-bar-draw` in `Hero.astro`), and the two must not fight.
 * Fine pointers only; bars off screen do not listen at all.
 *
 * ### What was wrong with the first version
 *
 * It felt mushy and it was expensive, for three reasons that compounded:
 *
 * 1. **A new spring every frame.** Each pointer move called `animate()` with a
 *    fresh target, which tears down the running animation and starts another.
 *    A spring's whole character is its velocity carried across frames; restart
 *    it sixty times a second and what is left is a lag, not a spring.
 * 2. **A layout read per bar per frame.** `getBoundingClientRect()` inside the
 *    move handler, once for every bar on screen, forces layout on each one.
 * 3. **A feedback loop.** The distance was measured to the centre of the
 *    CURRENT box — but the box grows as it stretches, so stretching moved the
 *    centre, which changed the distance, which changed the stretch. Near the
 *    edge of the reach the bar oscillated on its own.
 *
 * Now: one listener, one frame loop, geometry measured when it can actually
 * change, distances taken from the bar's RESTING centre, and the values driven
 * by a spring integrated in place — so velocity survives, the reach is stable,
 * and the cost is one loop no matter how many bars are on the page.
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

/** How near the pointer has to come, px from the bar's resting centre. */
const REACH = 260;
/** How far the bar leans toward it at most, px. */
const LEAN = 14;
/** How much each segment grows at the closest, as a share of its width. */
const STRETCH = [0.7, 0.45, 1.1] as const;

/**
 * The spring, integrated per frame.
 *
 * Underdamped on purpose — `DAMPING² < 4·STIFFNESS` is what gives the return
 * its overshoot. These two are the whole feel: stiffer follows the pointer
 * more tightly, less damping bounces longer.
 */
const STIFFNESS = 190;
const DAMPING = 17;
/** Below this, in px and px/s, a value has arrived and the loop may stop. */
const REST = 0.05;

const px = (value: string, fontSize: number) => {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return 0;
  return value.trim().endsWith("rem") ? number * fontSize : number;
};

interface Bar {
  el: HTMLElement;
  /** Resting segment widths, px. */
  base: readonly [number, number, number];
  /** Resting centre in DOCUMENT coordinates — measured, never read per frame. */
  cx: number;
  cy: number;
  /** Current and target value, plus velocity, for lean and the three segments. */
  value: [number, number, number, number];
  target: [number, number, number, number];
  velocity: [number, number, number, number];
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
    if (base.some((width) => width <= 0)) continue;
    const bar: Bar = {
      el,
      base: base as unknown as readonly [number, number, number],
      cx: 0,
      cy: 0,
      value: [0, base[0]!, base[1]!, base[2]!],
      target: [0, base[0]!, base[1]!, base[2]!],
      velocity: [0, 0, 0, 0],
      live: false,
    };
    bars.push(bar);
    inView(el, () => {
      bar.live = true;
      measure(bar);
      return () => {
        bar.live = false;
        // Send it home rather than freezing it mid-lean off screen.
        setTarget(bar, 0);
        start();
      };
    });
  }
  if (bars.length === 0) return;

  /**
   * The bar's RESTING centre, in document coordinates.
   *
   * Resting, because the box grows as the bar stretches: measuring the live
   * box made the distance depend on the stretch it was supposed to produce.
   * `state.x` is undone and the base widths are used instead of the current
   * ones, so this number is the same whatever the bar is doing.
   */
  function measure(bar: Bar): void {
    const box = bar.el.getBoundingClientRect();
    const restWidth = bar.base[0] + bar.base[1] + bar.base[2];
    // `box.left` already carries the lean; take it back out.
    const left = box.left - bar.value[0];
    bar.cx = left + restWidth / 2 + window.scrollX;
    bar.cy = box.top + box.height / 2 + window.scrollY;
  }

  function setTarget(bar: Bar, closeness: number, lean = 0): void {
    bar.target[0] = lean;
    bar.target[1] = bar.base[0] * (1 + STRETCH[0] * closeness);
    bar.target[2] = bar.base[1] * (1 + STRETCH[1] * closeness);
    bar.target[3] = bar.base[2] * (1 + STRETCH[2] * closeness);
  }

  function apply(bar: Bar): void {
    const [x, s1, s2, s3] = bar.value;
    bar.el.style.translate = `${x.toFixed(2)}px 0`;
    bar.el.style.setProperty("--tds-brandbar-1", `${s1.toFixed(2)}px`);
    bar.el.style.setProperty("--tds-brandbar-2", `${s2.toFixed(2)}px`);
    bar.el.style.setProperty("--tds-brandbar-3", `${s3.toFixed(2)}px`);
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
        setTarget(bar, 0);
        continue;
      }
      const dx = pointerX - (bar.cx - window.scrollX);
      const dy = pointerY - (bar.cy - window.scrollY);
      const closeness = Math.max(0, 1 - Math.hypot(dx, dy) / REACH);
      setTarget(bar, closeness, Math.max(-1, Math.min(1, dx / REACH)) * LEAN * closeness);
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
      for (let i = 0; i < 4; i += 1) {
        const distance = bar.target[i]! - bar.value[i]!;
        const v = bar.velocity[i]! + (distance * STIFFNESS - bar.velocity[i]! * DAMPING) * dt;
        bar.velocity[i] = v;
        bar.value[i] = bar.value[i]! + v * dt;
        if (Math.abs(distance) > REST || Math.abs(v) > REST) settled = false;
      }
      if (settled) {
        // Land exactly, so a bar at rest carries no rounding drift.
        for (let i = 0; i < 4; i += 1) {
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
  // bars stay leaning at whatever the last position was.
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
