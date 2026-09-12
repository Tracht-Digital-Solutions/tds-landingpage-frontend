/**
 * Pre-sized copies of committed images, and the one naming rule the page and
 * the scripts share.
 *
 * ### Why the copies exist
 *
 * Every screenshot on the site was served at its capture size (1440 × 900,
 * 65–140 KB) into cards a phone draws 300px wide, and the portrait went through
 * Astro's on-request `/_image` endpoint — a sharp resize in the Node process on
 * the production host for every uncached request, with a 1500 × 2100 fallback.
 * Neither is necessary: these images only change when a script re-captures or a
 * person commits a new file, so the smaller copies are made at that moment and
 * committed beside the original.
 *
 * ### The rule
 *
 * A variant is the original's path with `-<width>` before `.webp`
 * (`/demos/demo1.webp` → `/demos/demo1-480.webp`). `scripts/image-variants.ts`
 * and `scripts/capture-preview.ts` write them; the components derive `srcset`
 * from the same function; `imageVariants.test.ts` fails if any committed
 * original lacks one — a `srcset` candidate that 404s breaks the image, it does
 * not fall back to `src`.
 *
 * **No imports.** The scripts run under plain Node (`tsx`).
 */

/** Screenshot cards: a phone card and a desktop card at 2× density. */
export const PREVIEW_VARIANT_WIDTHS = [480, 960] as const;

/** The service tiles' photo band, half the page wide at most. */
export const SERVICE_PHOTO_VARIANT_WIDTHS = [800] as const;

/** The portrait, from the business card's 7.5rem up to a 24rem column at 2×+. */
export const PORTRAIT_WIDTHS = [360, 720, 1080] as const;

/** The committed portrait's own size, for the tag's `width`/`height`. */
export const PORTRAIT_SIZE = { width: 1500, height: 2100 } as const;

/** `/x/name.webp` → `/x/name-480.webp`. */
export function variantSrc(src: string, width: number): string {
  return src.replace(/\.webp$/, `-${width}.webp`);
}

/**
 * A `srcset` of the variants plus the original at its own width.
 *
 * Only variants narrower than the original are listed — `sharp` never enlarges
 * (`withoutEnlargement`), so a wider "variant" would be a copy of the original
 * under a false width.
 */
export function srcsetFor(src: string, widths: readonly number[], intrinsicWidth: number): string {
  return [
    ...widths.filter((width) => width < intrinsicWidth).map((width) => `${variantSrc(src, width)} ${width}w`),
    `${src} ${intrinsicWidth}w`,
  ].join(", ");
}

/** One portrait copy. There is no full-size original under `public/`. */
export function portraitSrc(width: (typeof PORTRAIT_WIDTHS)[number]): string {
  return `/images/portrait/portrait-${width}.webp`;
}

export function portraitSrcset(): string {
  return PORTRAIT_WIDTHS.map((width) => `${portraitSrc(width)} ${width}w`).join(", ");
}
