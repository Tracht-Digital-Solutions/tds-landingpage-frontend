import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveSnapshotDemos } from "./demos";
import {
  PORTRAIT_WIDTHS,
  PREVIEW_VARIANT_WIDTHS,
  SERVICE_PHOTO_VARIANT_WIDTHS,
  portraitSrc,
  srcsetFor,
  variantSrc,
} from "./imageVariants";
import { resolveSnapshotPreviews } from "./referencePreviews";
import { serviceDefinitions } from "./services";

/**
 * Every `srcset` candidate the site emits has to exist.
 *
 * A candidate that 404s does not fall back to `src` — the browser picked it,
 * and the image is simply broken. The variants are committed files written by
 * scripts, so the only way to catch a missing one before a visitor does is to
 * check the disk against the same lists the components render from.
 */
const onDisk = (src: string) =>
  access(resolve(process.cwd(), "public", src.replace(/^\//, "")));

describe("the naming rule", () => {
  it("puts the width before the extension", () => {
    expect(variantSrc("/demos/demo1.webp", 480)).toBe("/demos/demo1-480.webp");
  });

  it("lists only variants narrower than the original, then the original", () => {
    expect(srcsetFor("/a.webp", [480, 960], 900)).toBe("/a-480.webp 480w, /a.webp 900w");
  });
});

describe("every srcset candidate is committed", () => {
  it("for each renderable demo screenshot", async () => {
    for (const demo of resolveSnapshotDemos()) {
      for (const width of PREVIEW_VARIANT_WIDTHS) {
        if (width >= demo.previewWidth) continue;
        await expect(onDisk(variantSrc(demo.preview, width)), variantSrc(demo.preview, width)).resolves.toBeUndefined();
      }
    }
  });

  it("for each reference screenshot", async () => {
    for (const preview of resolveSnapshotPreviews()) {
      for (const width of PREVIEW_VARIANT_WIDTHS) {
        if (width >= preview.width) continue;
        await expect(onDisk(variantSrc(preview.src, width)), variantSrc(preview.src, width)).resolves.toBeUndefined();
      }
    }
  });

  it("for each service photo", async () => {
    for (const service of serviceDefinitions) {
      if (!service.image) continue;
      for (const width of SERVICE_PHOTO_VARIANT_WIDTHS) {
        await expect(onDisk(variantSrc(service.image, width)), variantSrc(service.image, width)).resolves.toBeUndefined();
      }
    }
  });

  it("for the portrait", async () => {
    for (const width of PORTRAIT_WIDTHS) {
      await expect(onDisk(portraitSrc(width)), portraitSrc(width)).resolves.toBeUndefined();
    }
  });
});
