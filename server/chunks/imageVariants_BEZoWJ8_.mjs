import { p as translations } from "./Layout_Dun72iYX.mjs";
// node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-3MVSQKM5.js
var MOON_PATH = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
var SUN_RAYS = [
	[
		12,
		2,
		12,
		5
	],
	[
		12,
		19,
		12,
		22
	],
	[
		2,
		12,
		5,
		12
	],
	[
		19,
		12,
		22,
		12
	],
	[
		4.93,
		4.93,
		6.99,
		6.99
	],
	[
		17.01,
		17.01,
		19.07,
		19.07
	],
	[
		4.93,
		19.07,
		6.99,
		17.01
	],
	[
		17.01,
		6.99,
		19.07,
		4.93
	]
];
// node_modules/@tracht-digital-solutions/tds-shared/dist/dom/index.js
var escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var ICON_ATTRS = "aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"";
function themeToggleMarkup({ labelToDark = "Auf Dunkel umschalten", labelToLight = "Auf Hell umschalten" } = {}) {
	const toDark = escapeAttr(labelToDark);
	return `<button type="button" data-tds-theme-toggle data-label-dark="${toDark}" data-label-light="${escapeAttr(labelToLight)}" aria-label="${toDark}" title="${toDark}" class="tds-theme-toggle inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"><svg ${ICON_ATTRS} class="tds-theme-toggle__moon"><path d="${MOON_PATH}"/></svg><svg ${ICON_ATTRS} class="tds-theme-toggle__sun"><circle cx="12" cy="12" r="4"/>${SUN_RAYS.map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`).join("")}</svg></button>`;
}
function consentLinkMarkup({ lang = "de", className } = {}) {
	return `<button type="button" data-tds-consent-open class="${escapeAttr(className ? `consent-link ${className}` : "consent-link")}">${escapeAttr(translations[lang].consent.manage)}</button>`;
}
// src/lib/imageVariants.ts
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
var PREVIEW_VARIANT_WIDTHS = [480, 960];
/** The service tiles' photo band, half the page wide at most. */
var SERVICE_PHOTO_VARIANT_WIDTHS = [800];
/** The portrait, from the business card's 7.5rem up to a 24rem column at 2×+. */
var PORTRAIT_WIDTHS = [
	360,
	720,
	1080
];
/** The committed portrait's own size, for the tag's `width`/`height`. */
var PORTRAIT_SIZE = {
	width: 1500,
	height: 2100
};
/** `/x/name.webp` → `/x/name-480.webp`. */
function variantSrc(src, width) {
	return src.replace(/\.webp$/, `-${width}.webp`);
}
/**
* A `srcset` of the variants plus the original at its own width.
*
* Only variants narrower than the original are listed — `sharp` never enlarges
* (`withoutEnlargement`), so a wider "variant" would be a copy of the original
* under a false width.
*/
function srcsetFor(src, widths, intrinsicWidth, url = (path) => path) {
	return [...widths.filter((width) => width < intrinsicWidth).map((width) => `${url(variantSrc(src, width))} ${width}w`), `${url(src)} ${intrinsicWidth}w`].join(", ");
}
/** One portrait copy. There is no full-size original under `public/`. */
function portraitSrc(width) {
	return `/images/portrait/portrait-${width}.webp`;
}
function portraitSrcset() {
	return PORTRAIT_WIDTHS.map((width) => `${portraitSrc(width)} ${width}w`).join(", ");
}
/**
* The header logo — the mark and the wordmark — each served as lossless WebP
* copies of its committed original (`scripts/image-variants.ts`).
*
* The header draws both 24–48px tall: the mark at most 71px wide, the wordmark
* at most 97px. The wordmark's original is a 1289px PNG of 35 KB, and it was
* fetched before the headline on every phone. `width`/`height` are the
* originals' own, so the tags reserve the true ratio before the file arrives.
*/
var LOGO = {
	mark: {
		original: "/images/logo.webp",
		width: 713,
		height: 483,
		widths: [120, 240]
	},
	letters: {
		original: "/images/logo-letters.png",
		width: 1289,
		height: 639,
		widths: [200, 400]
	}
};
/** `/images/logo/<part>-<width>.webp`. */
function logoSrc(part, width) {
	return `/images/logo/${part}-${width}.webp`;
}
function logoSrcset(part) {
	return LOGO[part].widths.map((width) => `${logoSrc(part, width)} ${width}w`).join(", ");
}
export { logoSrc as a, portraitSrcset as c, themeToggleMarkup as d, SERVICE_PHOTO_VARIANT_WIDTHS as i, srcsetFor as l, PORTRAIT_SIZE as n, logoSrcset as o, PREVIEW_VARIANT_WIDTHS as r, portraitSrc as s, LOGO as t, consentLinkMarkup as u };
