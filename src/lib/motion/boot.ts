/**
 * The page's motion layer — one entry, mounted once from `Layout.astro`.
 *
 * Everything here animates SERVER-RENDERED markup through
 * `tds-shared/motion/dom` (the vanilla Motion runtime). Three rules, all
 * held by `src/__tests__/motion.test.ts`:
 *
 * 1. **The runtime is fetched with `import()`, never statically.** On a first
 *    visit it waits for an idle moment, so it is never among the requests a
 *    phone waits on before the headline — the H1 is the LCP element and
 *    `npm run audit:perf` pins it. Only an internal navigation loads it at once,
 *    because the incoming page is waiting for its entrance (see
 *    `pageTransition.ts`), and by then the chunk is in the HTTP cache.
 * 2. **Nothing ships hidden.** Every start state is written here, from JS, and
 *    only onto elements that are not on screen yet. With no JavaScript, a
 *    failed chunk or an exception, the page is simply static.
 * 3. **Reduced motion loads nothing at all.** Not a zero duration — no
 *    runtime, no listeners, no frames.
 */
import { PAGE_ENTER_ATTR } from "./constants";
import { lessMotion } from "~/lib/a11yPrefs";

type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

function whenIdle(run: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(run, { timeout: 2500 });
  else window.setTimeout(run, 400);
}

export function bootMotion(): void {
  const root = document.documentElement;
  // The OS setting or the site's own switch (A11yTools) — either one means no runtime.
  // (prefers-reduced-motion: reduce is inside lessMotion.)
  if (lessMotion()) {
    root.removeAttribute(PAGE_ENTER_ATTR);
    return;
  }

  const load = async () => {
    let dom: Dom;
    try {
      dom = await import("@tracht-digital-solutions/tds-shared/motion/dom");
    } catch {
      // No runtime, no motion — and nothing may stay hidden waiting for it.
      root.removeAttribute(PAGE_ENTER_ATTR);
      return;
    }
    const [page, cta, images, card, ux, tabs, floating] = await Promise.all([
      import("./pageTransition"),
      import("./cta"),
      import("./images"),
      import("./businessCard"),
      import("./ux"),
      import("./propertyTabs"),
      import("./floatingCta"),
    ]);
    root.dataset.motion = "on";
    page.mountPageTransition(dom);
    cta.mountCta(dom);
    images.mountImages(dom);
    card.mountBusinessCard(dom);
    ux.mountUx(dom);
    tabs.mountPropertyTabs(dom);
    floating.mountFloatingCta(dom);
  };

  if (root.hasAttribute(PAGE_ENTER_ATTR)) void load();
  else whenIdle(() => void load());
}
