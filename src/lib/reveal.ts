/**
 * Scroll reveal — one implementation for the whole site.
 *
 * It used to exist exactly once, inline at the bottom of `Journal.astro`,
 * writing `element.style.opacity` / `.transform` / `.transition` by hand.
 * Every other section entered with no motion at all, and the one that did
 * carried its own duration, its own easing and its own stagger, none of
 * which any other section could see. The visual state lives in
 * `styles/global.css` now (`[data-reveal]`); this file only decides WHEN.
 *
 * Progressive enhancement is strict here: the hidden state is behind
 * `html[data-reveal-active]`, and only this function sets that attribute.
 * With no JavaScript, with a bundle that fails to load, or with an
 * exception before the flag is written, the selector never matches and the
 * page renders fully visible. That is also why the flag is set FIRST and
 * the observer wired after — the reverse would leave a window in which
 * content is hidden with nothing scheduled to reveal it.
 */

/** Per-item stagger inside one group, and the cap that keeps a long list
 *  from ending on a delay nobody waits for. */
const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 5;

/**
 * Elements already on screen when the script runs are revealed WITHOUT a
 * transition. Hiding them first and animating them in would mean the
 * visitor sees the hero copy, then sees it disappear, then sees it slide
 * back — the module is deferred, so it always runs after first paint.
 */
function revealNow(element: HTMLElement) {
  element.dataset.revealed = "";
}

/**
 * Mount once, at the root of the layout.
 *
 * @returns a teardown that disconnects the observer and lifts the hidden
 *          state, so nothing can be left invisible.
 */
export function mountReveal(root: ParentNode = document): () => void {
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>("[data-reveal]"),
  );
  if (targets.length === 0) return () => {};

  // No flag, no hidden state. Reduced motion therefore costs exactly one
  // matchMedia call and changes nothing else about the page.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  // Stagger is derived from the DOM rather than authored at each call
  // site: sibling `[data-reveal]` elements under one parent are a group
  // (a card grid, a list of FAQ rows), and their index in that group is
  // the delay. A section that wants an explicit order can still set
  // `data-reveal-index` and win.
  const groupCounters = new Map<ParentNode, number>();
  for (const element of targets) {
    const explicit = Number.parseInt(element.dataset.revealIndex ?? "", 10);
    let index: number;
    if (Number.isFinite(explicit)) {
      index = explicit;
    } else {
      const parent = element.parentNode ?? root;
      index = groupCounters.get(parent) ?? 0;
      groupCounters.set(parent, index + 1);
    }
    const steps = Math.min(Math.max(index, 0), MAX_STAGGER_STEPS);
    element.style.setProperty("--lp-reveal-delay", `${steps * STAGGER_MS}ms`);
  }

  document.documentElement.setAttribute("data-reveal-active", "");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        element.dataset.revealed = "";
        // One-shot. Re-hiding on scroll-up is the thing that makes a page
        // feel restless, and it also re-runs the stagger every pass.
        observer.unobserve(element);
      }
    },
    // The bottom inset holds the reveal back until the element is properly
    // inside the viewport rather than clipping its top edge; the low
    // threshold keeps tall elements (a full section) from waiting until
    // they are 15% visible, which for a 900px block is 135px of scrolling.
    { threshold: 0.01, rootMargin: "0px 0px -12% 0px" },
  );

  const viewportHeight = window.innerHeight;
  for (const element of targets) {
    if (element.getBoundingClientRect().top < viewportHeight) {
      revealNow(element);
      continue;
    }
    observer.observe(element);
  }

  return () => {
    observer.disconnect();
    document.documentElement.removeAttribute("data-reveal-active");
  };
}
