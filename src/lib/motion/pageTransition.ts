/**
 * Page transitions with Motion: the content leaves, the next page's content
 * arrives, and the navigation bar does not move at all.
 *
 * ### Why the header holds still
 *
 * Only `<main id="main">` is animated. The header is `position: fixed`
 * OUTSIDE `<main>` on every page, so there is nothing to hold still by
 * trickery — it simply is not part of what moves. (The former native
 * cross-document View Transition had to name the header to keep it out of the
 * root snapshot, and did not run in Firefox at all.)
 *
 * ### The hand-over between two documents
 *
 * 1. A click on a same-site link animates `<main>` out, writes a flag into
 *    sessionStorage and then navigates.
 * 2. The inline head script (`PAGE_ENTER_SCRIPT`) of the NEXT page reads the
 *    flag before the body parses and sets `data-page-enter` on `<html>`. CSS
 *    in `global.css` holds `<main>` at its start state under that attribute —
 *    with a failsafe keyframe that shows it after 1.5 s whatever happens.
 * 3. `boot.ts` sees the attribute, loads the runtime at once and animates
 *    `<main>` in, then drops the attribute.
 *
 * A first visit, a reload or a link from another site never carries the flag,
 * so the LCP measurement never sees a hidden `<main>`.
 */
import { PAGE_ENTER_ATTR, PAGE_EXIT_KEY } from "./constants";

type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

export { PAGE_ENTER_ATTR, PAGE_EXIT_KEY, PAGE_ENTER_SCRIPT } from "./constants";

/** File types a link downloads rather than navigates to. */
const DOWNLOAD = /\.(vcf|pdf|zip|png|jpe?g|webp|svg|xml|txt)$/i;

/**
 * Whether a click should play the exit animation. Exported for the tests: the
 * cases it refuses are the ones where animating out would strand the visitor
 * on a faded page (a new tab, a download, an in-page anchor).
 */
export function isTransitionLink(anchor: HTMLAnchorElement, event: MouseEvent, here: Location): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download") || anchor.dataset.noTransition !== undefined) return false;
  let url: URL;
  try {
    url = new URL(anchor.href, here.href);
  } catch {
    return false;
  }
  if (url.origin !== here.origin) return false;
  if (DOWNLOAD.test(url.pathname)) return false;
  // Same document, only a different anchor: scrolling, not navigating.
  if (url.pathname === here.pathname && url.search === here.search) return false;
  return true;
}

export function mountPageTransition({ animate }: Dom): void {
  const root = document.documentElement;
  const main = document.getElementById("main");

  // --- entrance -----------------------------------------------------------
  if (root.hasAttribute(PAGE_ENTER_ATTR) && main) {
    // Motion takes over from the CSS start state in the same frame the
    // attribute goes, so there is no flash in between.
    // Explicit keyframes: Motion would otherwise read its start value from
    // the computed style — which is already the resting 1 once the attribute
    // below is gone, so the entrance measured as a jump. The animation holds
    // its first frame, so dropping the attribute right after cannot flash.
    const entrance = animate(main, { opacity: [0, 1], y: [32, 0] }, { duration: 0.42, ease: [0.2, 0.8, 0.2, 1] });
    root.removeAttribute(PAGE_ENTER_ATTR);
    void entrance.then(() => {
      // A transform left on <main> would make it the containing block of
      // every fixed descendant.
      main.style.removeProperty("transform");
    });
  } else {
    root.removeAttribute(PAGE_ENTER_ATTR);
  }

  if (!main) return;

  // --- exit ---------------------------------------------------------------
  document.addEventListener("click", (event) => {
    const anchor = (event.target as Element | null)?.closest?.("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (!isTransitionLink(anchor, event, window.location)) return;

    event.preventDefault();
    const href = anchor.href;
    try {
      sessionStorage.setItem(PAGE_EXIT_KEY, "1");
    } catch {
      /* private mode: the next page simply arrives without an entrance */
    }
    const go = () => window.location.assign(href);
    // A race, not a chain: in a background tab requestAnimationFrame never
    // fires and the animation promise would never settle.
    const timer = window.setTimeout(go, 320);
    void animate(main, { opacity: 0, y: -24 }, { duration: 0.22, ease: [0.4, 0, 0.2, 1] }).then(() => {
      window.clearTimeout(timer);
      go();
    });
  });

  // Back/forward restores the page from the bfcache exactly as it was left —
  // faded out. Bring it back.
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    try {
      sessionStorage.removeItem(PAGE_EXIT_KEY);
    } catch {
      /* ignore */
    }
    void animate(main, { opacity: 1, y: 0 }, { duration: 0.3 });
  });
}
