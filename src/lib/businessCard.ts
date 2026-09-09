/**
 * The digital business card's identity: its two routes, the rows the card
 * stacks, and the tile copy the showcase and the Webauftritt page render.
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
import { siteConfig } from "./seo";

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

/* ===================================================================
   The link stack
   =================================================================== */

/**
 * Which block of the card a row belongs to.
 *
 * Two, and deliberately not more: the card answers "how do I reach this
 * person" first and "where else does he exist" second. A third group would
 * turn a card into a menu, which is the failure mode of every link hub.
 */
export type BusinessCardLinkGroup = "contact" | "more";

export interface BusinessCardLink {
  /**
   * Stable, language-independent id. It keys the icon in the page and is what
   * `businessCard.test.ts` names a row by, so it must never carry copy.
   */
  id: string;
  group: BusinessCardLinkGroup;
  /** First line — what the row offers. */
  label: string;
  /** Second line — the number, the address, the handle. */
  meta: string;
  href: string;
  /** Leaves this site: gets `target="_blank"`, `rel` and the ↗ mark. */
  external?: boolean;
}

/**
 * The site's own destinations, per language.
 *
 * Written out rather than resolved through `localizePath()`, for the reason
 * this module exists at all: `sitemap.ts` and `cache.ts` import it, and a
 * runtime import of `i18n.ts` would pull the whole shared translation table
 * into both of them (and into their unit tests) to produce four constants.
 * The slugs are code-owned anyway — the same rule as `BUSINESS_CARD_SLUG`.
 */
const SITE_LINKS: Record<Lang, { home: string; services: string; pricing: string }> = {
  de: { home: "/", services: "/#services", pricing: "/preise" },
  en: { home: "/en/", services: "/en/#services", pricing: "/en/preise" },
};

/**
 * Every row the card stacks, in the order it stacks them.
 *
 * The order is the point of the list: dial, message, write — the three things
 * someone who just scanned a code off a screen actually wants — before
 * anything that leads back into the site. The reference shelf below it is
 * where a link hub is allowed to be a link hub.
 *
 * Contact values come from `siteConfig`, like the vCard and the JSON-LD, so
 * the card cannot drift from the Impressum. The postal address stays out, as
 * it does in `kontakt.vcf.ts`: it is a private home address.
 */
export function businessCardLinks(lang: Lang): BusinessCardLink[] {
  const { email, telephone, socials, blogUrl, name } = siteConfig;
  // → E.164 for `tel:` and `wa.me`, exactly as the contact aside derives it.
  const phoneHref = telephone.replace(/\s/g, "");
  const site = SITE_LINKS[lang];
  const de = lang === "de";

  const links: BusinessCardLink[] = [
    {
      id: "phone",
      group: "contact",
      label: de ? "Anrufen" : "Call",
      meta: telephone,
      href: `tel:${phoneHref}`,
    },
    {
      id: "whatsapp",
      group: "contact",
      label: "WhatsApp",
      meta: de ? "Kurz schreiben, statt zu telefonieren" : "Message instead of calling",
      href: `https://wa.me/${phoneHref.replace(/^\+/, "")}`,
      external: true,
    },
    {
      id: "mail",
      group: "contact",
      label: de ? "E-Mail" : "Email",
      meta: email,
      href: `mailto:${email}`,
    },
    {
      id: "website",
      group: "more",
      label: de ? "Website" : "Website",
      meta: name,
      href: site.home,
    },
    {
      id: "services",
      group: "more",
      label: de ? "Leistungen" : "Services",
      meta: de
        ? "Beratung, Prozesse, Software, Webauftritt"
        : "Advice, processes, software, web presence",
      href: site.services,
    },
    {
      id: "pricing",
      group: "more",
      label: de ? "Preise" : "Pricing",
      meta: de ? "Stundensatz und Pakete" : "Hourly rate and packages",
      href: site.pricing,
    },
    {
      id: "journal",
      group: "more",
      label: "Journal",
      meta: de ? "Beiträge zur Digitalisierung" : "Notes on digitalization",
      href: blogUrl,
      external: true,
    },
  ];

  // Both socials are optional in `siteConfig` and the card must survive one of
  // them being emptied — the same guard the contact aside makes.
  if (socials.linkedin) {
    links.push({
      id: "linkedin",
      group: "more",
      label: "LinkedIn",
      meta: "/in/julian-tracht",
      href: socials.linkedin,
      external: true,
    });
  }
  if (socials.github) {
    links.push({
      id: "github",
      group: "more",
      label: "GitHub",
      meta: "Tracht-Digital-Solutions",
      href: socials.github,
      external: true,
    });
  }

  return links;
}
