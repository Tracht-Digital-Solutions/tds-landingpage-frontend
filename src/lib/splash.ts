/**
 * First-visit splash (2026-11-13).
 *
 * On the very first page a browser loads from this site, a brand-coloured
 * layer covers the page while fonts and the images in the first screen
 * arrive, then fades away. The page underneath renders exactly as without it:
 * the layer is decoration on top, never a hidden state of the content, so the
 * H1 stays the LCP element and crawlers read the full page.
 *
 * Shown only when all of these hold:
 * - JavaScript runs (the attribute that shows it is set by this script),
 * - the browser has no `lp-splash` entry yet (stored at once, so a reload or
 *   the next page never shows it again),
 * - no reduced motion (OS setting or the site's own switch),
 * - the page was not reached through an internal link (page transition).
 *
 * It leaves when the fonts are ready and every image that intersects the
 * first screen has loaded, but never sooner than `SPLASH_MIN_MS` (no flash)
 * and never later than `SPLASH_MAX_MS` (a slow image cannot hold the page).
 */
export const SPLASH_ATTR = "data-splash";
export const SPLASH_STORAGE_KEY = "lp-splash";
export const SPLASH_MIN_MS = 450;
export const SPLASH_MAX_MS = 1600;
/** Length of the fade-out; the attribute is removed after it. */
export const SPLASH_FADE_MS = 360;

/**
 * Inline, in `<head>` after the a11y and page-enter scripts (it reads both
 * attributes). Written as a string because it must run before the body
 * parses, unbundled.
 */
export const SPLASH_SCRIPT = `try{var d=document,r=d.documentElement;if(!localStorage.getItem("${SPLASH_STORAGE_KEY}")&&!r.hasAttribute("data-page-enter")&&!r.hasAttribute("data-a11y-motion")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){localStorage.setItem("${SPLASH_STORAGE_KEY}","1");r.setAttribute("${SPLASH_ATTR}","");var t0=Date.now(),done=false,leave=function(){if(done)return;done=true;setTimeout(function(){r.setAttribute("${SPLASH_ATTR}","out");setTimeout(function(){r.removeAttribute("${SPLASH_ATTR}")},${SPLASH_FADE_MS})},Math.max(0,${SPLASH_MIN_MS}-(Date.now()-t0)))};setTimeout(leave,${SPLASH_MAX_MS});d.addEventListener("DOMContentLoaded",function(){var h=innerHeight,w=[];d.querySelectorAll("img").forEach(function(i){var b=i.getBoundingClientRect();if(b.bottom>0&&b.top<h&&b.width>0&&!i.complete)w.push(new Promise(function(f){i.addEventListener("load",f,{once:true});i.addEventListener("error",f,{once:true})}))});if(d.fonts&&d.fonts.ready)w.push(d.fonts.ready);Promise.all(w).then(leave,leave)})}}catch(e){}`;
