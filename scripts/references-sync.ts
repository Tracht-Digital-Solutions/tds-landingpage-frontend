/**
 * Capture the customer sites that are cleared for a preview.
 *
 * Writes `src/lib/referencePreviewData.json` plus the assets under
 * `public/references/`, both committed — the same arrangement as
 * `demos-sync.ts`, so a page render never takes a screenshot and never reaches
 * a customer's server.
 *
 * This script OWNS `public/references/`. A case that loses its permission, its
 * `named` disclosure or its site is not merely skipped: its file is deleted,
 * so a withdrawn consent cannot survive as an orphan asset in the repo.
 *
 * Run: `npm run references:sync`
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { referenceCases } from "../src/lib/references.ts";
import {
  PREVIEW_ASSET_DIR,
  PREVIEW_SIZE,
} from "../src/lib/referencePreviewMeta.ts";
import { capturePreview } from "./capture-preview.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const assetDir = path.join(root, "public", PREVIEW_ASSET_DIR);
const snapshotFile = path.join(root, "src", "lib", "referencePreviewData.json");

function describe(error: unknown): string {
  if (error instanceof Error) {
    const codes: string[] = [];
    let cause: unknown = error;
    while (cause instanceof Error) {
      const code = (cause as NodeJS.ErrnoException).code;
      if (code) codes.push(code);
      cause = cause.cause;
    }
    return codes.length > 0 ? codes.join(" / ") : error.message;
  }
  return String(error);
}

/** Every case that is allowed to have a picture of its site published. */
const eligible = referenceCases.filter(
  (entry) => entry.previewAllowed && entry.disclosure === "named" && entry.siteUrl,
);

/** Delete assets that belong to no eligible case any more. */
async function pruneAssets(keep: Set<string>): Promise<void> {
  let entries: string[];
  try {
    entries = await fs.readdir(assetDir);
  } catch {
    return;
  }
  for (const file of entries) {
    const id = file.replace(/\.webp$/, "");
    if (keep.has(id)) continue;
    await fs.rm(path.join(assetDir, file), { force: true });
    // eslint-disable-next-line no-console
    console.log(`  removed ${file}`);
  }
}

const previews: Record<string, unknown> = {};
const captured = new Set<string>();

if (eligible.length === 0) {
  // eslint-disable-next-line no-console
  console.log("No reference is cleared for a preview — nothing to capture.");
} else {
  await fs.mkdir(assetDir, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const entry of eligible) {
      process.stdout.write(`  ${entry.id}  screenshot … `);
      try {
        const preview = await capturePreview(
          browser,
          { id: entry.id, url: entry.siteUrl! },
          assetDir,
          PREVIEW_ASSET_DIR,
        );
        previews[entry.id] = {
          status: "ok",
          preview,
          width: PREVIEW_SIZE.width,
          height: PREVIEW_SIZE.height,
          capturedAt: new Date().toISOString(),
        };
        captured.add(entry.id);
        // eslint-disable-next-line no-console
        console.log("ok");
      } catch (error) {
        // No screenshot means no band. The card keeps its text; a reference
        // must never depend on a picture being there.
        previews[entry.id] = {
          status: "unreachable",
          preview: null,
          note: describe(error),
        };
        // eslint-disable-next-line no-console
        console.log(`failed — ${describe(error)}`);
      }
    }
  } finally {
    await browser.close();
  }
}

await pruneAssets(captured);

await fs.writeFile(
  snapshotFile,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), previews }, null, 2)}\n`,
  "utf8",
);

// eslint-disable-next-line no-console
console.log(`\nWrote ${path.relative(root, snapshotFile)} (${captured.size} preview(s)).`);
