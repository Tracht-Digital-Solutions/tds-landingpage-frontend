/**
 * Capture the screenshot the business-card tile shows.
 *
 * ### Why this is so much shorter than its two siblings
 *
 * `demos-sync.ts` and `references-sync.ts` both write a JSON snapshot beside
 * their images, because both photograph pages this deployment does not
 * control: a demo host can go dark, a customer can withdraw consent, and the
 * renderer has to be able to drop the card at request time. None of that
 * applies here. `/visitenkarte` ships in the same build as the tile that shows
 * it — there is no state in which the site is up and the page is missing — so
 * there is nothing to record and nothing to probe. The picture is the whole
 * output.
 *
 * ### Why it points at localhost
 *
 * Against the live domain this could not run before the first deploy: the page
 * would not exist yet, and the tile would ship pointing at a missing image.
 * Capturing from a local preview breaks that circle, and it is also the more
 * honest source — it photographs the build in front of you, not whatever is
 * currently deployed.
 *
 *   npm run build && npm run preview        # in one terminal
 *   npm run businesscard:sync               # in another
 *
 * Override with BUSINESS_CARD_URL to shoot a different origin.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

import { capturePreview } from "./capture-preview";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Must match `BUSINESS_CARD_PREVIEW` in `src/lib/businessCard.ts`. */
const ASSET_DIR = "images";
const ASSET_ID = "business-card";

const url = process.env.BUSINESS_CARD_URL ?? "http://localhost:4321/visitenkarte";
const outDir = path.join(root, "public", ASSET_DIR);

process.stdout.write(`  ${ASSET_ID}  screenshot of ${url} … `);

const browser = await chromium.launch();
try {
  const written = await capturePreview(browser, { id: ASSET_ID, url }, outDir, ASSET_DIR);
  // eslint-disable-next-line no-console
  console.log(`ok → ${written}`);
} catch (error) {
  // eslint-disable-next-line no-console
  console.log("failed");
  // eslint-disable-next-line no-console
  console.error(
    `\nCould not reach ${url}.\n` +
      "Start the site first (npm run build && npm run preview), or point\n" +
      "BUSINESS_CARD_URL at a running origin.\n",
  );
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await browser.close();
}
