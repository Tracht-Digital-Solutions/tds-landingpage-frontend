import { PROPERTY_ORIGINS } from "@tracht-digital-solutions/tds-shared/nav";
import { contentApiBase } from "./connection";
import { memoisedOr } from "./contentCache";
import type { Lang } from "./i18n";
import { readContentJson } from "./siteKey";

/**
 * The most important services, shown as products on the home page.
 *
 * Each one is a product of the Digitalmarkt, which also carries every further
 * solution with its "ab" price. The home page states no amount.
 *
 * Slugs, images and order are code-owned. A product the shop has not released
 * has no page yet, so its tile falls back to the filtered service list.
 */
export interface ServiceProduct {
  id: string;
  slug: Record<Lang, string>;
  title: Record<Lang, string>;
  text: Record<Lang, string>;
  image: string;
  kind: Record<Lang, string>;
}

export const SERVICE_PRODUCTS: readonly ServiceProduct[] = [
  {
    id: "business-website",
    slug: { de: "firmenwebsite-bis-5-seiten", en: "business-website-up-to-5-pages" },
    title: { de: "Firmenwebsite", en: "Business website" },
    kind: { de: "Webauftritt", en: "Web presence" },
    text: {
      de: "Bis zu fünf Seiten für einen Betrieb, im Alltag selbst pflegbar.",
      en: "Up to five pages for a business, easy to maintain day to day.",
    },
    image: "/images/services/04-webauftritt-editorial.webp",
  },
  {
    id: "one-pager",
    slug: { de: "onepager-website", en: "one-page-website" },
    title: { de: "Onepager", en: "One-page website" },
    kind: { de: "Webauftritt", en: "Web presence" },
    text: {
      de: "Eine schlanke Seite: wer der Betrieb ist, was er anbietet, wie er erreichbar ist.",
      en: "One lean page: who the business is, what it offers, how to reach it.",
    },
    image: "/images/services/03-loesungen-editorial.webp",
  },
  {
    id: "maintenance",
    slug: { de: "website-wartung-12-monate", en: "website-maintenance-12-months" },
    title: { de: "Website-Wartung", en: "Website maintenance" },
    kind: { de: "Betrieb", en: "Operations" },
    text: {
      de: "Ein Jahr Updates, Sicherungen, Überwachung der Erreichbarkeit.",
      en: "A year of updates, backups, uptime monitoring.",
    },
    image: "/images/services/05-kundenportale-editorial.webp",
  },
  {
    id: "ai-visibility",
    slug: { de: "ki-sichtbarkeit-geo-verbessern", en: "improve-ai-visibility-geo" },
    title: { de: "KI-Sichtbarkeit", en: "AI visibility" },
    kind: { de: "Sichtbarkeit", en: "Visibility" },
    text: {
      de: "Damit ChatGPT, Perplexity, Google-KI eine Website verstehen und als Quelle nennen.",
      en: "So ChatGPT, Perplexity, Google AI understand a website and cite it as a source.",
    },
    image: "/images/services/01-beratung-editorial.webp",
  },
  {
    id: "online-form",
    slug: { de: "online-formular-statt-papier", en: "online-form-instead-of-paper" },
    title: { de: "Online-Formular", en: "Online form" },
    kind: { de: "Digitalisierung", en: "Digitalisation" },
    text: {
      de: "Ein Papierformular wird digital, die Antworten kommen geordnet an.",
      en: "A paper form goes digital, the answers arrive in order.",
    },
    image: "/images/services/02-prozesse-editorial.webp",
  },
];

const shopHome = (lang: Lang) => `${PROPERTY_ORIGINS.shop}${lang === "en" ? "/en/" : "/"}`;

/** The shop's catalogue, filtered in the browser to our own services. */
export const shopServicesHref = (lang: Lang) => `${shopHome(lang)}?art=own#katalog`;

const productHref = (product: ServiceProduct, lang: Lang) =>
  `${PROPERTY_ORIGINS.shop}${lang === "en" ? "/en/product/" : "/produkt/"}${product.slug[lang]}`;

async function releasedSlugs(lang: Lang): Promise<string[]> {
  const page = await readContentJson<{ products: { slug: string }[] }>(
    `${contentApiBase()}/shop?lang=${lang}&limit=48`,
  );
  return page.products.map((product) => product.slug);
}

export interface ServiceProductTile extends ServiceProduct {
  href: string;
}

/** The tiles, each linked to its product page once the shop has released it. */
export async function getServiceProducts(lang: Lang): Promise<ServiceProductTile[]> {
  const released = new Set(
    await memoisedOr(`service-products:${lang}`, () => releasedSlugs(lang), [] as string[], "released products"),
  );
  return SERVICE_PRODUCTS.map((product) => ({
    ...product,
    href: released.has(product.slug[lang]) ? productHref(product, lang) : shopServicesHref(lang),
  }));
}
