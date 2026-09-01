/**
 * Identity and order of the website demos — and nothing else.
 *
 * Split out of `demos.ts` deliberately: `scripts/demos-sync.ts` runs under
 * plain Node and needs this list, while `demos.ts` reaches for the page-cache
 * memo, the i18n bundle and the committed snapshot. Importing the renderer's
 * module from a build script would drag `tds-shared` and `import.meta.env`
 * into a context that has neither.
 *
 * Everything here is code-owned and never sourced from the CMS — the same
 * rule as `ServiceDefinition.slug`. A content editor must not be able to
 * decide which host this site sends visitors to.
 */

export type DemoId = "demo1" | "demo2" | "demo3" | "demo4" | "demo5";

export interface DemoDefinition {
  /** Stable, code-owned identity, and the basename of its assets. */
  id: DemoId;
  /** Stable display order, shared by the section and the sync report. */
  number: string;
  /** Bare hostname, rendered as the card's caption. */
  host: string;
  /** The link target. HTTPS only — `demos.test.ts` measures that. */
  url: string;
}

/**
 * Every demo site, in display order.
 *
 * Adding one means adding it here AND running `npm run demos:sync`. The tests
 * fail on a definition with no snapshot entry, which is what stops a new demo
 * from rendering as a card with no picture and no text.
 */
export const demoDefinitions: readonly DemoDefinition[] = [
  { id: "demo1", number: "01", host: "demo1.tracht-digital.de", url: "https://demo1.tracht-digital.de/" },
  { id: "demo2", number: "02", host: "demo2.tracht-digital.de", url: "https://demo2.tracht-digital.de/" },
  { id: "demo3", number: "03", host: "demo3.tracht-digital.de", url: "https://demo3.tracht-digital.de/" },
  { id: "demo4", number: "04", host: "demo4.tracht-digital.de", url: "https://demo4.tracht-digital.de/" },
  { id: "demo5", number: "05", host: "demo5.tracht-digital.de", url: "https://demo5.tracht-digital.de/" },
] as const;

/**
 * The screenshot box: viewport for the capture, intrinsic size of the WebP,
 * and the aspect ratio the card reserves before the image loads.
 *
 * 16:10 matches the service grounds in IMAGES.md, so the two card families on
 * the home page keep one rhythm.
 */
export const DEMO_PREVIEW = { width: 1440, height: 900 } as const;

/** Where the sync script writes, and where the components read from. */
export const DEMO_ASSET_DIR = "demos";
