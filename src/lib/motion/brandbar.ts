/**
 * The brand bar answers the pointer (2026-09-22).
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
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

/** How near the pointer has to come, px from the bar's centre. */
const REACH = 260;
/** How far the bar leans toward it at most, px. */
const LEAN = 14;
/** How much each segment grows at the closest, as a share of its width. */
const STRETCH = [0.7, 0.45, 1.1] as const;
const FOLLOW = { type: "spring", stiffness: 260, damping: 22 } as const;
const HOME = { type: "spring", bounce: 0.55, visualDuration: 0.55 } as const;

const px = (value: string, fontSize: number) => {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return 0;
  return value.trim().endsWith("rem") ? number * fontSize : number;
};

export function mountBrandbars({ animate, inView, hasFinePointer }: Dom): void {
  if (!hasFinePointer()) return;
  const root = document.documentElement;
  const rootFont = Number.parseFloat(getComputedStyle(root).fontSize) || 16;

  document.querySelectorAll<HTMLElement>(".tds-brandbar").forEach((bar) => {
    const style = getComputedStyle(bar);
    const base = [1, 2, 3].map((n) => px(style.getPropertyValue(`--tds-brandbar-${n}`), rootFont));
    if (base.some((width) => width <= 0)) return;

    const state = { x: 0, s1: base[0]!, s2: base[1]!, s3: base[2]! };
    const apply = () => {
      bar.style.translate = `${state.x.toFixed(2)}px 0`;
      bar.style.setProperty("--tds-brandbar-1", `${state.s1.toFixed(2)}px`);
      bar.style.setProperty("--tds-brandbar-2", `${state.s2.toFixed(2)}px`);
      bar.style.setProperty("--tds-brandbar-3", `${state.s3.toFixed(2)}px`);
    };

    let near = false;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const check = () => {
      frame = 0;
      const box = bar.getBoundingClientRect();
      const cx = box.left - state.x + box.width / 2;
      const cy = box.top + box.height / 2;
      const distance = Math.hypot(pointerX - cx, pointerY - cy);
      const p = Math.max(0, 1 - distance / REACH);
      if (p <= 0) {
        if (!near) return;
        near = false;
        void animate(state, { x: 0, s1: base[0]!, s2: base[1]!, s3: base[2]! }, { ...HOME, onUpdate: apply });
        return;
      }
      near = true;
      const lean = Math.max(-1, Math.min(1, (pointerX - cx) / REACH));
      void animate(
        state,
        {
          x: lean * LEAN * p,
          s1: base[0]! * (1 + STRETCH[0] * p),
          s2: base[1]! * (1 + STRETCH[1] * p),
          s3: base[2]! * (1 + STRETCH[2] * p),
        },
        { ...FOLLOW, onUpdate: apply },
      );
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(check);
    };

    inView(bar, () => {
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => {
        window.removeEventListener("pointermove", onMove);
        if (near) {
          near = false;
          void animate(state, { x: 0, s1: base[0]!, s2: base[1]!, s3: base[2]! }, { ...HOME, onUpdate: apply });
        }
      };
    });
  });
}
