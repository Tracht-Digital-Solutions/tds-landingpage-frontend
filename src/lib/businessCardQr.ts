/**
 * The business card's QR code, drawn at BUILD time.
 *
 * ### Why this is not a component helper
 *
 * It used to be: `BusinessCardPage.astro` called `QRCode.toString()` in its
 * frontmatter and inlined the SVG. That shipped `qrcode` into the server
 * bundle, and it took production down — Rolldown cannot inline a CJS package's
 * own `require()` calls, so the bundle kept a bare `__require("dijkstrajs")`.
 * `dijkstrajs` is a transitive dependency of `qrcode`, so it was never in
 * `tds.release.runtimeDependencies` and never shipped; on the host the first
 * render of `/visitenkarte` threw `Cannot find module 'dijkstrajs'` and both
 * card pages answered 500. Locally it worked, because Node walked UP out of
 * `release/` into the development checkout's node_modules — the same trap
 * `astro.config.mjs` already documents for `motion` and React.
 *
 * The fix is not to chase that one dependency into the release tree. It is to
 * keep the encoder out of the runtime altogether: the payload is a constant —
 * two URLs known at build time — so nothing about this belongs in a request.
 * The two endpoints that call `render()` are `prerender = true`, exactly like
 * `/og/default.png` and `/kontakt.vcf`, so `qrcode` runs during `astro build`
 * and never enters the server bundle. It is a devDependency for that reason;
 * a `dependencies` entry here would be a claim the runtime needs it.
 */
import QRCode from "qrcode";

import { BUSINESS_CARD_SLUG } from "./businessCard";
import type { Lang } from "./i18n";
import { siteConfig } from "./seo";


/**
 * What the code encodes: the card's own absolute URL.
 *
 * The page, not `/kontakt.vcf`. A scan should land somewhere a human can read,
 * with the save action one tap away; a phone camera that downloads a file
 * unannounced is the worse first impression.
 */
export function businessCardQrTarget(lang: Lang): string {
  return new URL(BUSINESS_CARD_SLUG[lang], siteConfig.url).toString();
}

/**
 * The SVG, as a string.
 *
 * `margin: 0` because the page draws its own plate around it, and
 * `errorCorrectionLevel: "M"` because the payload is a short URL — "H" would
 * only make the modules smaller for no gain at this length. Pure black on a
 * transparent ground: the plate behind it is white in both themes, so the code
 * keeps its contrast without the file knowing anything about the theme.
 */
export async function renderBusinessCardQr(lang: Lang): Promise<string> {
  return QRCode.toString(businessCardQrTarget(lang), {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#0000" },
  });
}
