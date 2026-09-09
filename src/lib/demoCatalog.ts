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
 *
 * **This file has no imports and must keep none.** That is why `DEMO_KINDS`
 * spells its two languages out by hand instead of using `Record<Lang, …>`
 * from `./i18n`: a type-only import would be erased at runtime, but the rule
 * is easier to keep than to re-derive every time someone adds a field.
 */

export type DemoId = "demo1" | "demo2" | "demo3" | "demo4" | "demo5" | "shop";

/**
 * What KIND of site a demo is — the one thing on a demo card that this site
 * says rather than quotes.
 *
 * Everything else on a card (name, description, favicon, screenshot) is
 * harvested from the demo itself, and that rule stands. This is the single
 * deliberate exception, and it is narrow on purpose:
 *
 * - It applies to OUR OWN demos only. We are not describing anyone's site.
 * - It names the GENRE, never the content. "Onlineshop", not "Streetwear-Shop";
 *   "Webseite", not "Kanzlei-Webseite". A visitor scanning the shelf wants to
 *   know which of these is a shop and which is a page — the demo's own title
 *   already tells them what it is about.
 * - The vocabulary is CLOSED, so it cannot drift into marketing copy one
 *   entry at a time. `demos.test.ts` holds it shut.
 *
 * A demo whose genre is not in this list means the list is wrong, not that a
 * new label should be invented at the call site.
 */
export const DEMO_KINDS = {
  website: { de: "Webseite", en: "Website" },
  landing: { de: "Landingpage", en: "Landing page" },
  shop: { de: "Onlineshop", en: "Online shop" },
} as const;

export type DemoKind = keyof typeof DEMO_KINDS;

export interface DemoDefinition {
  /** Stable, code-owned identity, and the basename of its assets. */
  id: DemoId;
  /** Stable display order, shared by the section and the sync report. */
  number: string;
  /** Bare hostname, rendered as the card's caption. */
  host: string;
  /** The link target. HTTPS only — `demos.test.ts` measures that. */
  url: string;
  /** Genre etiquette, from the closed set above. See {@link DEMO_KINDS}. */
  kind: DemoKind;
}

/**
 * Every demo site, in display order.
 *
 * Adding one means adding it here AND running `npm run demos:sync`. The tests
 * fail on a definition with no snapshot entry, which is what stops a new demo
 * from rendering as a card with no picture and no text.
 *
 * `shop` is the one entry that is not a `demoN` host, and it is here before it
 * has anything to show. That is safe, and it is the reason the availability
 * check exists: while `shop.tracht-digital.de` answers with the hosting
 * panel's "Hier entsteht eine neue Webseite" placeholder, the sync records it
 * as `placeholder` and no card renders. The day the shop is deployed, a sync
 * turns it into a card without a code change.
 */
export const demoDefinitions: readonly DemoDefinition[] = [
  { id: "demo1", number: "01", host: "demo1.tracht-digital.de", url: "https://demo1.tracht-digital.de/", kind: "website" },
  // Not the bare host. `demo2`'s root is a 330-byte language gate whose entire
  // body is one link to `/de/` — no heading, 25 characters of text — which is
  // indistinguishable from a parking page and was rejected as one, correctly:
  // that IS what the root serves. The entry points past the gate, at the site.
  { id: "demo2", number: "02", host: "demo2.tracht-digital.de", url: "https://demo2.tracht-digital.de/de/", kind: "shop" },
  { id: "demo3", number: "03", host: "demo3.tracht-digital.de", url: "https://demo3.tracht-digital.de/", kind: "website" },
  { id: "demo4", number: "04", host: "demo4.tracht-digital.de", url: "https://demo4.tracht-digital.de/", kind: "website" },
  { id: "demo5", number: "05", host: "demo5.tracht-digital.de", url: "https://demo5.tracht-digital.de/", kind: "website" },
  { id: "shop", number: "06", host: "shop.tracht-digital.de", url: "https://shop.tracht-digital.de/", kind: "shop" },
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
