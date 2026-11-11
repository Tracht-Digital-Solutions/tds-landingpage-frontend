import { describe, expect, it } from "vitest";
import { avifSrcSet, imageHints } from "./imageCatalog";
import { SERVICE_PRODUCTS as serviceProducts } from "./serviceProducts";

describe("avifSrcSet", () => {
  it("mirrors every WebP candidate of a product tile, width for width", () => {
    for (const product of serviceProducts) {
      const webp = imageHints(product.image, "de")?.srcSet ?? "";
      const avif = avifSrcSet(product.image, "de") ?? "";
      expect(avif, product.image).not.toBe("");
      const widths = (set: string) => set.split(",").map((c) => c.trim().split(/\s+/)[1]);
      expect(widths(avif)).toEqual(widths(webp));
      for (const candidate of avif.split(",")) {
        expect(candidate.trim()).toMatch(/^\/images\/products\/[a-z0-9-]+\.avif\?v=[0-9a-f]{10} \d+w$/);
      }
    }
  });

  it("gives up rather than point at a twin that does not exist", () => {
    expect(avifSrcSet("/images/nope.webp", "de")).toBeUndefined();
  });
});
