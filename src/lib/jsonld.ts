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
import { LOGO, portraitSrc } from "./imageVariants";
// Sync helpers only — `getDefaultPackages` reads the committed list and
// touches neither the CMS nor `contentCache`, so this stays a leaf import and
// cannot close an import cycle the way `contentCache` once did.
import { getDefaultPackages } from "./pricing";
import { siteConfig } from "./seo";

type WithContext<T extends Record<string, unknown> = Record<string, unknown>> =
  T & { "@context": "https://schema.org" };

/**
 * Person schema for the founder. Reused as `author` (Article),
 * `founder` (Organization), and standalone on the about page.
 *
 * The author every detail page names in its byline, so the entity carries what
 * a reader — or an answer engine — would check: a face (the portrait "Wieso
 * ich?" shows) and the topics the pages are written about.
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
    image: `${siteConfig.url}${portraitSrc(720)}`,
    knowsAbout: [...siteConfig.knowsAbout],
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
    vatID: siteConfig.vatID,
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
    // Local-SEO completers: coordinates make the LocalBusiness signal
    // unambiguous; knowsAbout states the topical focus in plain terms.
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    knowsAbout: [...siteConfig.knowsAbout],
    /**
     * The logo, which Google's Organization rich result and the knowledge
     * panel both look for. The file and its dimensions have been in
     * `lib/imageVariants.ts` the whole time; nothing referenced them from
     * the graph, so the node described a business with no mark.
     *
     * An absolute URL and explicit dimensions, because a crawler fetching
     * this node has no page context to resolve a relative path against.
     */
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${LOGO.mark.original}`,
      width: LOGO.mark.width,
      height: LOGO.mark.height,
    },
    image: `${siteConfig.url}${LOGO.mark.original}`,
    /**
     * The same two channels as the flat `email`/`telephone` above, but as a
     * ContactPoint — which is the shape that states WHO they are for and in
     * which languages they are answered.
     */
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: siteConfig.email,
      telephone: siteConfig.telephone,
      areaServed: "DE",
      availableLanguage: ["de", "en"],
    },
    /**
     * Expected on a LocalBusiness-typed entity, and honest: the band is the
     * committed fixed-price packages the page publishes, so this repeats a fact
     * rather than inventing one. No hourly rates since 2026-09-22.
     *
     * NOT here: `openingHoursSpecification`. Julian works by arrangement, and
     * the vocabulary has no way to say that — `opens`/`closes` would be an
     * invented promise of availability. The page says it in words instead.
     * Do not "complete" this node with hours.
     */
    priceRange: packagePriceRange(),
  };

  if (socials.length > 0) base.sameAs = socials;

  return base;
}

/**
 * The WebSite node.
 *
 * **There is no `SearchAction`, and the docblock used to claim one.** This
 * site has no search — not a hidden one, none at all — and a `SearchAction`
 * pointing at a URL template that answers nothing is a lie told to a crawler
 * in a machine-readable format. The comment was wrong, not the code.
 *
 * `description` takes the page's language. It was pinned to German, so every
 * English page described itself in German to anything reading the graph.
 */
export function websiteSchema(lang: "de" | "en" = "de") {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description[lang],
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

/** A fixed-price package, as it appears in the offer catalogue. */
export interface PackageOffering {
  name: string;
  description: string;
  /** Net EUR, a single figure for the whole package. */
  price: number;
}

/**
 * Service + OfferCatalog for the pricing section: one Offer per fixed-price
 * package. The site publishes no hourly rates any more (2026-09-22), so the
 * catalogue holds only what the page shows.
 *
 * A package total is a plain `PriceSpecification` with no unit — never a
 * `UnitPriceSpecification` with `unitCode: "HUR"`, which states "this many
 * euros per hour" and would publish a four-figure hourly rate to every
 * consumer that reads the markup rather than the page. The figures are net;
 * the gross view on the page is derived and is not a second price.
 */
export function pricingSchema(packages: PackageOffering[]): WithContext {
  const offers = packages.map((item) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
    },
    priceSpecification: {
      "@type": "PriceSpecification",
      price: item.price,
      priceCurrency: "EUR",
      valueAddedTaxIncluded: false,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${siteConfig.name} — Festpreise`,
    provider: { "@id": `${siteConfig.url}/#organization` },
    serviceType: "Software development & digital consulting",
    areaServed: siteConfig.areaServed.map((a) => ({ "@type": "Place", name: a })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Festpreise",
      itemListElement: offers,
    },
  };
}

/**
 * BreadcrumbList as a node of an `@graph` — no `@context` of its own, and an
 * `@id` the page's `WebPage` can point at.
 */
export function breadcrumbNode(
  id: string,
  items: { name: string; url: string }[],
): object {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface WebPageInput {
  url: string;
  name: string;
  description: string;
  lang: "de" | "en";
  /** ISO date of the last content change — the same date the page shows. */
  dateModified?: string;
  /** What the page is about, tied to a public entry so the entity is unambiguous. */
  about?: { name: string; sameAs?: string };
  breadcrumbId?: string;
}

/**
 * The page itself as an entity: part of the site, published by the
 * organisation, written by the person the Impressum names, dated.
 *
 * Every value here must be visible on the page too — the date is the "Stand"
 * line, the author the byline beside it. Structured data that says more than
 * the page is exactly what search engines are told to distrust.
 */
export function webPageNode(input: WebPageInput): object {
  return {
    "@type": "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: input.lang === "de" ? "de-DE" : "en-GB",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    author: { "@id": `${siteConfig.url}/#person` },
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.about
      ? {
          about: {
            "@type": "Thing",
            name: input.about.name,
            ...(input.about.sameAs ? { sameAs: input.about.sameAs } : {}),
          },
        }
      : {}),
    ...(input.breadcrumbId ? { breadcrumb: { "@id": input.breadcrumbId } } : {}),
  };
}

interface ServiceInput {
  url: string;
  name: string;
  description: string;
  lang: "de" | "en";
  serviceType: string;
  outputs?: readonly string[];
}

/**
 * A service offered on a page, provided by the organisation. No `offers`:
 * the site publishes no hourly rates (2026-09-22), and a service page names
 * no single price of its own — the packages live in the pricing catalogue.
 */
export function serviceNode(input: ServiceInput): object {
  return {
    "@type": "Service",
    "@id": `${input.url}#service`,
    url: input.url,
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "Place", name })),
    inLanguage: input.lang === "de" ? "de-DE" : "en-GB",
    ...(input.outputs ? { serviceOutput: [...input.outputs] } : {}),
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

/*
 * `howToSchema` lived here until 2026-09 and is gone on purpose. Google retired
 * HowTo rich results in 2023, and the markup never fit anyway: the Process
 * section describes how a working relationship runs, not a set of instructions
 * a reader follows — and it put "Je nach Umfang" into `performTime`, a field
 * that expects an ISO-8601 duration.
 */

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

/** "390–1040 €" — the span of the committed fixed-price packages. */
function packagePriceRange(): string {
  const prices = getDefaultPackages("de").map((pkg) => pkg.price);
  return `${Math.min(...prices)}–${Math.max(...prices)} €`;
}
