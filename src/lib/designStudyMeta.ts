/**
 * Constants shared by the design-study import script and the renderer.
 *
 * Split out for the same reason `demoCatalog.ts` is split from `demos.ts`:
 * `scripts/design-studies.ts` runs under plain Node and must not drag the
 * content cache, the i18n bundle or `import.meta.env` into a context that has
 * none of them.
 *
 * **No imports.**
 */

/** Folder under `public/` the import script owns exclusively. */
export const STUDY_ASSET_DIR = "designstudien";

/**
 * How wide a committed study may be.
 *
 * The originals run from 724 px (a phone-width full-page shot) to 1672 px. The
 * cap is the demo screenshots' own width, so the widest study is no heavier
 * than a demo capture; the narrow ones keep their pixels untouched
 * (`withoutEnlargement`).
 */
export const STUDY_MAX_WIDTH = 1440;

/**
 * Original file name → committed id.
 *
 * Here rather than in the script so the catalog and the importer cannot drift
 * into two different spellings of the same picture, and so a reader can see in
 * one place which capture became which card.
 */
export const STUDY_SOURCES: Record<string, string> = {
  "Nordholz.png": "nordholz-tischlerei",
  "Kinderarztpraxis_Sonnengarten.png": "kinderarztpraxis-sonnengarten",
  "Kinderarztpraxis_Sonnengarten_mobil.png": "kinderarztpraxis-sonnengarten-mobil",
  "Mira_Markt.png": "mira-markt",
  "prisma_coat.png": "prisma-coat",
  "MKB.png": "mkb-beratung",
  "serverspace24.png": "serverspace24",
  "serverspace24_produktberater.png": "serverspace24-produktberater",
  "jurisblick.png": "jurisblick",
};

/** `/designstudien/<id>.webp` — the one place this path is spelled. */
export function studyImageSrc(id: string): string {
  return `/${STUDY_ASSET_DIR}/${id}.webp`;
}
