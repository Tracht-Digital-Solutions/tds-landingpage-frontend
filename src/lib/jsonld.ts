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

type WithContext<T extends Record<string, unknown> = Record<string, unknown>> =
  T & { "@context": "https://schema.org" };

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
 * actually are — now emitted with the verified street, postal code and
 * phone (they match the Impressum).
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
    telephone: siteConfig.telephone,
    founder: { "@id": `${siteConfig.url}/#person` },
    areaServed: siteConfig.areaServed.map((a) => ({ "@type": "Place", name: a })),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      postalCode: siteConfig.address.postalCode,
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
): WithContext {
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
export function pricingSchema(items: ServiceOffering[]): WithContext {
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

interface FaqItem {
  q: string;
  a: string;
}

/**
 * FAQPage schema — Google's eligibility-checked rich snippet. Each
 * item becomes a Question with an AnswerType. Renders inline in the
 * page where the visible <details>/<summary> accordions live; the
 * answer text must match the visible answer 1:1 or Google strips the
 * rich result.
 */
export function faqPageSchema(items: readonly FaqItem[]): object {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

interface HowToStep {
  number: string;
  title: string;
  duration: string;
  description: string;
}

/**
 * HowTo schema — describes the four-step Process section as a
 * structured workflow. Each step becomes a HowToStep with a
 * `position` (parsed from the visible "01" / "02" number) and the
 * duration in ISO-8601 where possible. Helps both Google's "how to"
 * rich snippet and AI agents that try to understand the service
 * delivery flow.
 */
export function howToSchema(name: string, steps: readonly HowToStep[]): object {
  return {
    "@type": "HowTo",
    name,
    step: steps.map((step) => ({
      "@type": "HowToStep",
      position: Number(step.number) || undefined,
      name: step.title,
      text: step.description,
      ...(step.duration ? { performTime: step.duration } : {}),
    })),
  };
}

/**
 * Speakable schema — points voice assistants / AI summarisers at the
 * key text on the page so they read the right thing aloud instead of
 * guessing from the DOM. Apply CSS selectors at the wrapper that
 * covers the hero headline + sub paragraph.
 */
export function speakableSchema(cssSelectors: readonly string[]): object {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors,
  };
}

/**
 * Combine multiple schemas into a single @graph node — the canonical
 * way to emit several typed entities in one <script> block without
 * duplicating the @context.
 */
export function asGraph(...nodes: object[]): WithContext {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
