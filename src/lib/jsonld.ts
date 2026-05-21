/**
 * Schema.org JSON-LD generators.
 *
 * Each function returns a plain object (or array of objects) ready to
 * be JSON.stringify'd inside a <script type="application/ld+json">.
 * Components only need to pick which schemas a page emits — the data
 * is centralised in `~/lib/seo`.
 *
 * Why this exists separately from the SEO config: schema shape often
 * shifts slightly per consumer (Google rich-result requirements vs.
 * what AI search engines parse), so keeping the renderers next to the
 * data lets us iterate the shape without touching the source of truth.
 */
import { siteConfig } from "./seo";

type WithContext<T> = T & { "@context": "https://schema.org" };

/**
 * Person schema for the founder. Reused as `author` (Article),
 * `founder` (Organization), and standalone on the about page.
 */
export function personSchema() {
  return {
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.founder.name,
    jobTitle: siteConfig.founder.jobTitle,
    worksFor: { "@id": `${siteConfig.url}/#organization` },
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    sameAs: Object.values(siteConfig.socials).filter(Boolean) as string[],
  };
}

/**
 * Organization (+ ProfessionalService traits). Search engines treat
 * ProfessionalService as a LocalBusiness subtype, which is what we
 * actually are — but emit it without the street/phone until those
 * Impressum placeholders are replaced (see seo.ts TODO).
 */
export function organizationSchema() {
  const socials = Object.values(siteConfig.socials).filter(Boolean) as string[];

  const base: Record<string, unknown> = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    founder: { "@id": `${siteConfig.url}/#person` },
    areaServed: siteConfig.areaServed.map((a) => ({ "@type": "Place", name: a })),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      addressCountry: siteConfig.address.addressCountry,
    },
  };

  if (socials.length > 0) base.sameAs = socials;

  return base;
}

/**
 * WebSite schema with a SearchAction so AI agents that look for a
 * site search target know one exists (currently the blog, since the
 * marketing site has no first-class search).
 */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description.de,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: ["de-DE", "en-GB"],
  };
}

/**
 * BreadcrumbList — emit on every subpage so AI engines can place
 * the page in the site hierarchy without guessing from URL structure.
 */
export function breadcrumbSchema(
  items: { name: string; url: string }[],
): WithContext<object> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface ServiceOffering {
  name: string;
  description: string;
  /** Per-hour EUR rate. */
  rate: number;
}

/**
 * Service + OfferCatalog for the pricing page. Each rate becomes a
 * PriceSpecification (UnitPriceSpecification, hourly) inside an
 * OfferCatalog — that's how Schema.org expresses tiered hourly rates.
 */
export function pricingSchema(items: ServiceOffering[]): WithContext<object> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${siteConfig.name} — Stundensätze`,
    provider: { "@id": `${siteConfig.url}/#organization` },
    serviceType: "Software development & digital consulting",
    areaServed: siteConfig.areaServed.map((a) => ({ "@type": "Place", name: a })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Stundensätze",
      itemListElement: items.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.description,
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: item.rate,
          priceCurrency: "EUR",
          unitCode: "HUR",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "HUR" },
          valueAddedTaxIncluded: false,
        },
      })),
    },
  };
}

/**
 * Combine multiple schemas into a single @graph node — the canonical
 * way to emit several typed entities in one <script> block without
 * duplicating the @context.
 */
export function asGraph(...nodes: object[]): WithContext<object> {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
