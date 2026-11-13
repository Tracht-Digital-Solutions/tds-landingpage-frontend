import { PROPERTY_ORIGINS } from "@tracht-digital-solutions/tds-shared/nav";
import { contentApiBase } from "./connection";
import { memoisedOr } from "./contentCache";
import type { Lang } from "./i18n";
import { CATEGORY_IDS } from "./serviceFinder";
import { readContentJson } from "./siteKey";

/**
 * The most important services, shown as products on the home page.
 *
 * Each one is a product of the Shop, which also carries every further
 * solution with its "ab" price. The home page states no amount.
 *
 * Slugs, images and order are code-owned. A product the shop has not released
 * has no page yet, so its tile falls back to the filtered service list.
 */
export interface ServiceProduct {
  id: string;
  slug: Record<Lang, string>;
  title: Record<Lang, string>;
  image: string;
  kind: Record<Lang, string>;
  /** What the tile's picture shows (every image has a text alternative). */
  alt: Record<Lang, string>;
}

export const SERVICE_PRODUCTS: readonly ServiceProduct[] = [
  {
    id: "business-website",
    slug: { de: "firmenwebsite-bis-5-seiten", en: "business-website-up-to-5-pages" },
    title: { de: "Firmenwebsite", en: "Business website" },
    kind: { de: "Webauftritt", en: "Web presence" },
    image: "/images/products/firmenwebsite.webp",
    alt: {
      de: "Laptop und Smartphone zeigen dieselbe Firmenwebsite mit Startseite und Leistungsübersicht",
      en: "Laptop and phone showing the same business website with its home page and services",
    },
  },
  {
    id: "one-pager",
    slug: { de: "onepager-website", en: "one-page-website" },
    title: { de: "Onepager", en: "One-page website" },
    kind: { de: "Webauftritt", en: "Web presence" },
    image: "/images/products/onepager.webp",
    alt: {
      de: "Eine einzelne lange Webseite als Papierbahn neben einem Smartphone",
      en: "A single long web page as a paper strip next to a phone",
    },
  },
  {
    id: "maintenance",
    slug: { de: "website-wartung-12-monate", en: "website-maintenance-12-months" },
    title: { de: "Website-Wartung", en: "Website maintenance" },
    kind: { de: "Betrieb", en: "Operations" },
    image: "/images/products/wartung.webp",
    alt: {
      de: "Laptop mit einer Liste geprüfter Updates und Sicherungen, daneben ein Schraubendrehersatz",
      en: "Laptop with a list of checked updates and backups next to a screwdriver set",
    },
  },
  {
    id: "ai-visibility",
    slug: { de: "ki-sichtbarkeit-geo-verbessern", en: "improve-ai-visibility-geo" },
    title: { de: "KI-Sichtbarkeit", en: "AI visibility" },
    kind: { de: "Sichtbarkeit", en: "Visibility" },
    image: "/images/products/ki-sichtbarkeit.webp",
    alt: {
      de: "Smartphone mit einer KI-Antwort, die eine Website als Quelle nennt, daneben eine Lupe",
      en: "Phone with an AI answer citing a website as its source, next to a magnifying glass",
    },
  },
  {
    id: "online-form",
    slug: { de: "online-formular-statt-papier", en: "online-form-instead-of-paper" },
    title: { de: "Online-Formular", en: "Online form" },
    kind: { de: "Digitalisierung", en: "Digitalisation" },
    image: "/images/products/online-formular.webp",
    alt: {
      de: "Tablet mit einem Online-Formular neben demselben Formular auf Papier",
      en: "Tablet with an online form next to the same form on paper",
    },
  },
];

const shopHome = (lang: Lang) => `${PROPERTY_ORIGINS.shop}${lang === "en" ? "/en/" : "/"}`;

/** The shop's catalogue, filtered in the browser to our own services. */
export const shopServicesHref = (lang: Lang) => `${shopHome(lang)}?art=own#katalog`;

/** One request per category: the list endpoint stops at 48 per page. */
async function fetchReleasedSlugs(lang: Lang): Promise<string[]> {
  const pages = await Promise.all(
    CATEGORY_IDS.map((category) =>
      readContentJson<{ products: { slug: string }[] }>(
        `${contentApiBase()}/shop?lang=${lang}&limit=48&category=${category}`,
      ),
    ),
  );
  return pages.flatMap((page) => page.products.map((product) => product.slug));
}

/** The Shop's released product slugs; empty while the Shop cannot be reached. */
export async function releasedSlugs(lang: Lang): Promise<Set<string>> {
  return new Set(
    await memoisedOr(`service-products:${lang}`, () => fetchReleasedSlugs(lang), [] as string[], "released products"),
  );
}

/** A product's page once the Shop has released it, otherwise the filtered list. */
export function shopProductHref(slug: string, lang: Lang, released: ReadonlySet<string>): string {
  if (!released.has(slug)) return shopServicesHref(lang);
  return `${PROPERTY_ORIGINS.shop}${lang === "en" ? "/en/product/" : "/produkt/"}${slug}`;
}

export interface ServiceProductTile extends ServiceProduct {
  href: string;
}

/** The tiles, each linked to its product page once the shop has released it. */
export async function getServiceProducts(lang: Lang): Promise<ServiceProductTile[]> {
  const released = await releasedSlugs(lang);
  return SERVICE_PRODUCTS.map((product) => ({
    ...product,
    href: shopProductHref(product.slug[lang], lang, released),
  }));
}
