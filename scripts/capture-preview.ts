/**
 * Screenshot a live page and write it as a committed WebP.
 *
 * Extracted from `demos-sync.ts` when the reference cards gained previews of
 * their own: two scripts capturing the same way must not drift, because the
 * capture settings ARE the picture — a different viewport or a missing
 * `reducedMotion` produces a visibly different shot of the same site.
 *
 * Runs under plain Node (`tsx`), so it imports nothing from the render tree.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Browser } from "playwright-core";

/**
 * The capture box: viewport for the shot, intrinsic size of the WebP, and the
 * aspect ratio a card reserves before the image loads. 16:10, matching the
 * service grounds in IMAGES.md.
 */
export const PREVIEW_VIEWPORT = { width: 1440, height: 900 } as const;

export const NAVIGATION_TIMEOUT_MS = 30_000;

/**
 * Hide consent dialogs before the shot — do not click them away.
 *
 * A first visit to almost any German site opens a consent overlay across the
 * middle of the viewport, and a screenshot of that is a picture of a dialog,
 * not of the site. The fix is to HIDE it, never to press "accept": clicking
 * would record a consent on somebody's behalf and, on a customer's own site,
 * would do it in their analytics.
 *
 * This is a heuristic and it will miss overlays that name themselves something
 * else. That is tolerable here and nowhere else, because the capture is
 * committed: a bad shot is visible in review before it ever reaches the site.
 */
async function hideConsentOverlays(page: {
  addStyleTag: (o: { content: string }) => Promise<unknown>;
  waitForTimeout: (ms: number) => Promise<void>;
}): Promise<void> {
  const selectors = [
    "[id*='cookie' i]",
    "[class*='cookie' i]",
    "[id*='consent' i]",
    "[class*='consent' i]",
    "[id*='cmplz' i]",
    "[class*='cmplz' i]",
    "[id*='usercentrics' i]",
    "[id*='borlabs' i]",
    "[class*='borlabs' i]",
    "[aria-label*='cookie' i]",
    "[role='dialog']",
  ].join(",");

  await page.addStyleTag({
    content: `${selectors} { display: none !important; }
      html, body { overflow: auto !important; }`,
  });
  await page.waitForTimeout(300);
}

/**
 * Screenshot `url` as a visitor first sees it and write `<dir>/<id>.webp`.
 *
 * `reducedMotion: "reduce"` so an entrance animation is not caught halfway
 * through, and the capture is viewport-sized rather than full-page: a card
 * shows the top of the site, not a metre-long strip scaled into illegibility.
 *
 * Returns the site-absolute path to the written file. Throws if the page never
 * becomes reachable — the caller decides what an unreachable target means.
 */
export async function capturePreview(
  browser: Browser,
  target: { id: string; url: string },
  outDir: string,
  publicDir: string,
): Promise<string> {
  const context = await browser.newContext({
    viewport: { ...PREVIEW_VIEWPORT },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    colorScheme: "light",
    locale: "de-DE",
  });

  try {
    const page = await context.newPage();
    try {
      await page.goto(target.url, {
        waitUntil: "networkidle",
        timeout: NAVIGATION_TIMEOUT_MS,
      });
    } catch {
      // A site that polls never goes idle. `load` plus the settle below is
      // enough for a screenshot, and is better than no preview at all.
      await page.goto(target.url, {
        waitUntil: "load",
        timeout: NAVIGATION_TIMEOUT_MS,
      });
    }
    await page.waitForTimeout(1_000);
    await hideConsentOverlays(page);

    const png = await page.screenshot({ type: "png" });
    const file = `${target.id}.webp`;
    await fs.mkdir(outDir, { recursive: true });
    await sharp(png).webp({ quality: 82 }).toFile(path.join(outDir, file));
    return `/${publicDir}/${file}`;
  } finally {
    await context.close();
  }
}
