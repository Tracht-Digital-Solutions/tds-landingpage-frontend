/**
 * Does hovering a link actually prefetch its document?
 *
 *   node scripts/prefetch-probe.mjs https://tracht-digital.de
 *
 * Astro's prefetch cannot be checked by grepping the HTML: the logic ships
 * inside the page's module chunk (look for `prefetchAll` there), not as anything
 * visible in the document. A first attempt grepped the served HTML for
 * "prefetch" and got a false PASS on two sites from their unrelated
 * `rel="dns-prefetch"` hints, and a false FAIL on the two without them.
 *
 * So this watches the network instead: count document requests, hover an
 * internal link, count again.
 */
import { chromium } from "playwright-core";

const base = (process.argv[2] ?? "http://localhost:4321").replace(/\/$/, "");
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const prefetched = [];
page.on("request", (request) => {
  // Astro prefetches with `<link rel="prefetch">` where supported and a bare
  // fetch otherwise; both show up as a request for the document.
  if (request.resourceType() === "document" || request.resourceType() === "other") {
    const url = request.url();
    if (url.startsWith(base) && url !== `${base}/`) prefetched.push(url);
  }
});

await page.goto(`${base}/`, { waitUntil: "networkidle" });
prefetched.length = 0;

/**
 * Any same-origin link that is not the current page and not a fragment.
 *
 * Deliberately generic: a hand-written list of path prefixes was the first
 * attempt and it matched only the landingpage, reporting "no internal link" on
 * the other three — a failure of the probe that looked like a failure of the
 * four sites. The four have entirely different route shapes, and which link gets
 * hovered does not matter.
 */
const href = await page.evaluate(() => {
  const here = location.pathname.replace(/\/$/, "");
  for (const a of document.querySelectorAll("a[href]")) {
    const raw = a.getAttribute("href");
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) continue;
    // Same origin, resolved — catches absolute hrefs to the site's own domain.
    let url;
    try {
      url = new URL(raw, location.href);
    } catch {
      continue;
    }
    if (url.origin !== location.origin) continue;
    if (url.pathname.replace(/\/$/, "") === here) continue;
    // Astro skips a link it is told to (`data-astro-prefetch="false"`).
    if (a.dataset.astroPrefetch === "false") continue;
    // VISIBLE, or `hover()` waits for a box that never arrives and times out.
    // Every one of these sites opens with a skip link parked off-screen, and it
    // is the first anchor in the document — the blog probe hung on it for 30s.
    const box = a.getBoundingClientRect();
    if (box.width < 8 || box.height < 8) continue;
    const style = getComputedStyle(a);
    if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) continue;
    if (box.bottom < 0 || box.right < 0) continue;
    return url.pathname;
  }
  return null;
});
if (!href) {
  console.log("no internal link found to test");
  await browser.close();
  process.exit(1);
}
const link = await page.$(`a[href="${href}"], a[href="${href}/"]`);
if (!link) {
  console.log(`link ${href} vanished between finding and hovering`);
  await browser.close();
  process.exit(1);
}
await link.scrollIntoViewIfNeeded();
await link.hover();
await page.waitForTimeout(1500);

const hit = prefetched.some((url) => url.includes(href.replace(/^\//, "")));
console.log(`hovered ${href}`);
console.log(`document requests after hover: ${prefetched.length}`);
for (const url of prefetched.slice(0, 5)) console.log(`  ${url}`);
console.log(hit ? "\n✓ the hovered page was prefetched" : "\n✗ no prefetch for the hovered link");

await browser.close();
process.exit(hit ? 0 : 1);
