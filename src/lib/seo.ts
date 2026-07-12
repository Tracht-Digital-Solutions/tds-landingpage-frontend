/**
 * Single source of truth for SEO / structured-data identity.
 *
 * The Organization, Person and WebSite JSON-LD helpers in
 * `~/lib/jsonld` read from this config — changing values here
 * propagates through every page.
 *
 * Street address, postal code, phone, VAT ID and social URLs are all
 * the real verified data (matches the Impressum).
 */
export const siteConfig = {
  /** Brand name as it should appear in search results. */
  name: "Tracht Digital Solutions",
  shortName: "TDS",
  /** Production origin. Mirrors `astro.config.mjs#site`. */
  url: "https://tracht-digital.de",
  /** Sister origin where the journal lives. */
  blogUrl: "https://blog.tracht-digital.de",
  /** Primary content language. */
  defaultLocale: "de" as const,
  description: {
    de: "Digitalisierung für Unternehmen: Beratung, Web- & App-Entwicklung, Automatisierung, Wartung und Schulungen — persönlich und passgenau, aus Schwarzenbek bei Hamburg, deutschlandweit.",
    en: "Digitalization for businesses: consulting, web & app development, automation, maintenance and training — personal and tailored to fit, from Schwarzenbek near Hamburg, Germany.",
  },
  /** Verified contact channel. Safe to publish in schema. */
  email: "kontakt@tracht-digital.de",
  /** Verified phone (WhatsApp). E.164-friendly formatting for schema. */
  telephone: "+49 178 8224022",
  /** Legal entity behind the brand. */
  legalName: "Julian Tracht",
  /** USt-IdNr. gemäß § 27a UStG — verified, matches the Impressum. */
  vatID: "DE450639725",
  founder: {
    name: "Julian Tracht",
    jobTitle: "Inhaber & Entwickler",
    sameAs: [] as string[], // populated from socials below post-launch
  },
  /** Verified business address (matches the Impressum). */
  address: {
    streetAddress: "Elbinger Straße 19",
    postalCode: "21493",
    addressLocality: "Schwarzenbek",
    addressRegion: "Schleswig-Holstein",
    addressCountry: "DE",
  },
  /** Approximate coordinates of the business address (Elbinger Straße 19,
   * 21493 Schwarzenbek) — completes the LocalBusiness signal in schema. */
  geo: { latitude: 53.504, longitude: 10.48 },
  /** Service-area for ProfessionalService schema. */
  areaServed: ["Hamburg", "Schwarzenbek", "Norddeutschland", "Deutschland"],
  /** Topics for schema `knowsAbout` — the keyword set the site targets. */
  knowsAbout: [
    "Digitalisierung für Unternehmen",
    "Prozessautomatisierung",
    "Webentwicklung",
    "App-Entwicklung",
    "Individualsoftware",
    "IT-Beratung",
  ],
  /** Public social URLs — surface in JSON-LD `sameAs` and the
   * Contact aside. WhatsApp is a `wa.me` deep link to the
   * `contact.info.phone` number; it is intentionally not in
   * JSON-LD `sameAs` (which expects social-profile URLs, not
   * messenger links). */
  socials: {
    linkedin: "https://www.linkedin.com/in/julian-tracht/",
    github: "https://github.com/Tracht-Digital-Solutions",
  } as {
    linkedin?: string;
    github?: string;
    whatsapp?: string;
  },
  /** Default OG image (1200×630), generated at /og/default.png. */
  defaultOgImage: "/og/default.png",
} as const;

export type SiteConfig = typeof siteConfig;
