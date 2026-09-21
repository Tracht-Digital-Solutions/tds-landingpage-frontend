/**
 * The page transition's hand-over values, in their own module so `boot.ts`
 * and `Layout.astro` can read them without pulling `pageTransition.ts` out of
 * its lazily loaded chunk.
 */
export const PAGE_ENTER_ATTR = "data-page-enter";
export const PAGE_EXIT_KEY = "lp-page-exit";

/**
 * Runs inline as the first thing in `<head>` (see `Layout.astro`). Written as
 * a string because it must run before the body parses, unbundled.
 */
export const PAGE_ENTER_SCRIPT = `try{if(sessionStorage.getItem("${PAGE_EXIT_KEY}")){sessionStorage.removeItem("${PAGE_EXIT_KEY}");if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&!document.documentElement.hasAttribute("data-a11y-motion"))document.documentElement.setAttribute("${PAGE_ENTER_ATTR}","")}}catch(e){}`;

