/**
 * Convert the design-study screenshots into the WebP files the showcase shelf
 * and its lightbox serve.
 *
 *   npm run studies:import -- --from "<folder with the PNG originals>"
 *
 * ### Why the originals are not committed
 *
 * They are full-page captures of 1.5–2 MB each, nine of them. The same rule
 * already applies to the service photos under `public/images/services/`: the
 * served WebP is what this repository keeps, the original lives with the rest
 * of the design material. `IMAGES.md` records where it came from.
 *
 * Unlike `demos-sync.ts` this takes no screenshots and probes nothing — a
 * design study is not a running site. It is a picture, and the picture is the
 * whole of it.
 *
 * Runs under plain Node (`tsx`), so it imports nothing from the render tree.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { writePreviewVariants } from "./capture-preview";
// No-import module, shared with the catalog the components render from.
import { STUDY_ASSET_DIR, STUDY_MAX_WIDTH, STUDY_SOURCES } from "../src/lib/designStudyMeta";

const root = process.cwd();
const outDir = path.join(root, "public", STUDY_ASSET_DIR);

/** `--from <dir>`, the folder holding the PNG originals. */
function sourceDir(): string {
  const flag = process.argv.indexOf("--from");
  const value = flag === -1 ? undefined : process.argv[flag + 1];
  if (!value) {
    throw new Error('Missing --from. Example: npm run studies:import -- --from "C:\\...\\Beispieldesigns"');
  }
  return path.resolve(value);
}

async function main(): Promise<void> {
  const from = sourceDir();
  await fs.mkdir(outDir, { recursive: true });

  for (const [file, id] of Object.entries(STUDY_SOURCES)) {
    const source = path.join(from, file);
    const target = path.join(outDir, `${id}.webp`);

    await sharp(source)
      // `withoutEnlargement` so a capture narrower than the cap keeps its own
      // pixels rather than being blown up into a soft copy of itself. The
      // height is free: these are full-page shots and cropping one to a ratio
      // would cut off the part the lightbox exists to show.
      .resize({ width: STUDY_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(target);

    const { width, height } = await sharp(target).metadata();
    const variants = await writePreviewVariants(target);

    // eslint-disable-next-line no-console
    console.log(`${id}  ${width}×${height}  +${variants.length} copies`);
  }
}

await main();
