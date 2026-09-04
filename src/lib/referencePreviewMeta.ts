/**
 * Constants shared by the reference-preview sync script and the renderer.
 *
 * Split out for the same reason `demoCatalog.ts` is split from `demos.ts`: the
 * script runs under plain Node and must not drag the content cache, the i18n
 * bundle or `import.meta.env` into a context that has none of them.
 */

/** Intrinsic size of a committed preview, and the ratio a card reserves. */
export const PREVIEW_SIZE = { width: 1440, height: 900 } as const;

/** Folder under `public/` the sync script owns exclusively. */
export const PREVIEW_ASSET_DIR = "references";
