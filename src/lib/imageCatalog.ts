import { createImageCatalog } from "@tracht-digital-solutions/tds-shared/site";
import raw from "./imageCatalog.json";
import { mediaSrc } from "./mediaSrc";

/** The generated editorial image catalogue (tds-shared helper). */
export const { imageInfo, imageHints, imageObject } = createImageCatalog(raw, {
  origin: "https://tracht-digital.de",
  about: "webpage",
});

/**
 * The AVIF twin of a catalogued WebP's `srcset`, for a `<source type="image/avif">`
 * (2026-11-11). The image export writes every variant in both formats at the
 * same width; AVIF is about 40 % smaller. Each candidate carries its own
 * content version (`virtual:media-versions`), so a candidate without one —
 * a twin that was never exported — drops the whole set and the `<img>`
 * keeps serving WebP alone. Same pixels, same widths: nothing on screen moves.
 */
export function avifSrcSet(src: string, lang: "de" | "en"): string | undefined {
  const set = imageHints(src, lang)?.srcSet;
  if (!set) return undefined;
  const out: string[] = [];
  for (const candidate of set.split(",")) {
    const [url, width] = candidate.trim().split(/\s+/);
    const path = url.split("?")[0].replace(/\.webp$/, ".avif");
    const versioned = mediaSrc(path);
    if (!path.endsWith(".avif") || versioned === path) return undefined;
    out.push(`${versioned} ${width}`);
  }
  return out.join(", ");
}
