/**
 * The digital business card's identity: its two routes, and the tile copy the
 * showcase and the Webauftritt page render.
 *
 * A module of its own rather than constants inside the page, for the same
 * reason `demoCatalog.ts` was split out of `demos.ts`: four places need the
 * URL — the page, the sitemap, the contact aside and the tile — and three of
 * them must not import a page component to learn it. `sitemap.ts` in
 * particular would pull `Layout.astro` and every font import behind it into a
 * unit test.
 *
 * The slugs are code-owned and never sourced from the CMS. Same rule as
 * `ServiceDefinition.slug` and the demo hosts: an editor may rewrite the words
 * on a page, never the address it lives at.
 */
import type { Lang } from "./i18n";

/** Localized route segments. Both trees really serve these — see `sitemap.ts`. */
export const BUSINESS_CARD_SLUG: Record<Lang, string> = {
  de: "/visitenkarte",
  en: "/en/business-card",
};

export function businessCardHref(lang: Lang): string {
  return BUSINESS_CARD_SLUG[lang];
}

/**
 * Where the tile's screenshot lives, and the box it is drawn in.
 *
 * The ratio is `DEMO_PREVIEW`'s, imported rather than restated: the tile sits
 * directly beside the demo cards in both places it appears, and a band even a
 * few pixels off would be visible as a broken row.
 */
export const BUSINESS_CARD_PREVIEW = "/images/business-card.webp";

/**
 * Where each language's prerendered QR code is served from.
 *
 * It lives HERE, next to the other constants, and not beside the function
 * that draws it — that separation is load-bearing. `businessCardQr.ts`
 * imports the `qrcode` encoder at module scope, so a page reaching in there
 * for a string drags the encoder into the server bundle with it. It did:
 * Rolldown tree-shook the unused renderer but kept the module's side effects
 * as a bare `import "qrcode";`, the package is a devDependency and not in
 * the release tree, and both card pages answered 500 on the host. Only the
 * two prerendered endpoints may import that module.
 */
export const BUSINESS_CARD_QR_PATH: Record<Lang, string> = {
  de: "/visitenkarte-qr.svg",
  en: "/en/business-card-qr.svg",
};

export interface BusinessCardCopy {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  previewAlt: string;
}

/**
 * The tile's words, in the language of the PAGE.
 *
 * Not CMS-editable, and that is a decision rather than an omission: this tile
 * sits between reference cases whose copy comes from the committed catalog and
 * demo cards whose copy comes from the demos themselves. Making the one tile
 * in the middle editable would put a fourth source of truth on one shelf.
 */
export const businessCardCopy: Record<Lang, BusinessCardCopy> = {
  de: {
    eyebrow: "Eigenes Projekt",
    title: "Digitale Visitenkarte",
    text: "Kontaktdaten, die man scannt statt abtippt — meine eigene, gebaut wie die für Kunden.",
    cta: "Karte ansehen",
    previewAlt: "Vorschau der digitalen Visitenkarte von Julian Tracht",
  },
  en: {
    eyebrow: "Own project",
    title: "Digital business card",
    text: "Contact details people scan instead of typing — mine, built like the ones for customers.",
    cta: "View the card",
    previewAlt: "Preview of Julian Tracht's digital business card",
  },
};
