/**
 * Constants shared by the certificate render script and the renderer.
 *
 * Split out for the same reason `referencePreviewMeta.ts` is split from
 * `referencePreviews.ts`: `scripts/certificates-render.ts` runs under plain
 * Node and must not drag the content cache, the i18n bundle or
 * `import.meta.env` into a context that has none of them.
 *
 * **No imports.**
 */

/** Folder under `public/` the render script owns exclusively. */
export const CREDENTIAL_ASSET_DIR = "zertifikate";

/** Where the source PDFs live in the repository. */
export const CREDENTIAL_PDF_DIR = "src/assets/certificates";

/**
 * Intrinsic size of a rendered certificate, and the ratio a card reserves.
 *
 * Every LinkedIn Learning certificate is one US-Letter page in landscape
 * (792 × 612 pt), measured from the `MediaBox` of all thirteen files. Rendered
 * at scale 2 that is 1584 × 1224 — enough that the certificate stays readable
 * when the lightbox draws it across a desktop screen, and the same file serves
 * the card through its `-480`/`-960` copies.
 */
export const CREDENTIAL_IMAGE = { width: 1584, height: 1224 } as const;

/** The scale the PDF is rasterised at, derived rather than restated. */
export const CREDENTIAL_RENDER_SCALE = CREDENTIAL_IMAGE.width / 792;

/** `/zertifikate/<id>.webp` — the one place this path is spelled. */
export function credentialImageSrc(id: string): string {
  return `/${CREDENTIAL_ASSET_DIR}/${id}.webp`;
}
