/**
 * Write the pre-sized copies of every committed image the site serves in more
 * than one size. See `src/lib/imageVariants.ts` for why they exist and for the
 * naming rule.
 *
 *   npm run images:variants
 *
 * Idempotent: every copy is regenerated from its committed original. Run it
 * after replacing the portrait or a service photo. Screenshots get their copies
 * from `capture-preview.ts` during a sync; this script covers captures that are
 * already committed.
 *
 * Nothing here touches the network.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { writePreviewVariants } from "./capture-preview";
import {
  LOGO,
  PORTRAIT_WIDTHS,
  SERVICE_PHOTO_VARIANT_WIDTHS,
  logoSrc,
  portraitSrc,
  variantSrc,
  type LogoPart,
} from "../src/lib/imageVariants";

const root = process.cwd();
const publicDir = path.join(root, "public");
const fromPublic = (src: string) => path.join(publicDir, src.replace(/^\//, ""));

async function resize(source: string, target: string, width: number): Promise<void> {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
  // eslint-disable-next-line no-console
  console.log(`  ${path.relative(root, target)}`);
}

async function main(): Promise<void> {
  // The portrait. Its original stays in `src/assets` (the vCard and the OG card
  // read it there); only the served copies live under `public/`.
  const portrait = path.join(root, "src/assets/portrait.webp");
  const meta = await sharp(portrait).metadata();
  // eslint-disable-next-line no-console
  console.log(`portrait ${meta.width}×${meta.height}`);
  for (const width of PORTRAIT_WIDTHS) {
    await resize(portrait, fromPublic(portraitSrc(width)), width);
  }

  // The header logo. Both originals stay where they are; the served copies are
  // LOSSLESS WebP, because a wordmark with hard edges and an alpha channel is
  // exactly what lossy compression smears.
  for (const part of Object.keys(LOGO) as LogoPart[]) {
    const logo = LOGO[part];
    for (const width of logo.widths) {
      const target = fromPublic(logoSrc(part, width));
      await fs.mkdir(path.dirname(target), { recursive: true });
      await sharp(fromPublic(logo.original))
        .resize({ width, withoutEnlargement: true })
        .webp({ lossless: true, effort: 6 })
        .toFile(target);
      // eslint-disable-next-line no-console
      console.log(`  ${path.relative(root, target)}`);
    }
  }

  // Service photos: originals are `NN-slug.webp`; anything with a width suffix
  // is a copy and is skipped.
  const servicesDir = path.join(publicDir, "images/services");
  for (const file of await fs.readdir(servicesDir)) {
    if (!/^\d{2}-[a-z-]+\.webp$/.test(file)) continue;
    for (const width of SERVICE_PHOTO_VARIANT_WIDTHS) {
      await resize(path.join(servicesDir, file), variantSrc(path.join(servicesDir, file), width), width);
    }
  }

  // Screenshots named by the two committed snapshots.
  const demoData = JSON.parse(await fs.readFile(path.join(root, "src/lib/demoData.json"), "utf8")) as {
    demos?: Record<string, { status?: string; preview?: string | null } | undefined>;
  };
  const referenceData = JSON.parse(
    await fs.readFile(path.join(root, "src/lib/referencePreviewData.json"), "utf8"),
  ) as { previews?: Record<string, { status?: string; preview?: string | null } | undefined> };

  const screenshots = [
    ...Object.values(demoData.demos ?? {}),
    ...Object.values(referenceData.previews ?? {}),
  ]
    .filter((entry) => entry?.status === "ok" && typeof entry.preview === "string")
    .map((entry) => entry!.preview as string);

  for (const src of screenshots) {
    for (const written of await writePreviewVariants(fromPublic(src))) {
      // eslint-disable-next-line no-console
      console.log(`  ${path.relative(root, written)}`);
    }
  }
}

main().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
