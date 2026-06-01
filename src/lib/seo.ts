/**
 * Single source of truth for SEO / structured-data identity.
 *
 * The Organization, Person and WebSite JSON-LD helpers in
 * `~/lib/jsonld` read from this config — changing values here
 * propagates through every page.
 *
 * TODO(real data): the Impressum + Contact section still carry
 * placeholders (street, phone, USt-IdNr, social URLs). They're
 * intentionally absent from the config below so Google + AI search
 * engines don't cache wrong data. Once issues #5, #6 and #7 land:
 *   - flip `address.streetAddress` + `postalCode` on
 *   - add `telephone` + `vatID`
 *   - populate `socials.linkedin` / `.github` / `.xing`
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
    de: "Persönlich entwickelte digitale Lösungen für den Mittelstand — Beratung, Web- und App-Entwicklung, Digitalisierung, Wartung und Schulungen aus Schwarzenbek bei Hamburg.",
    en: "Personally crafted digital solutions for the mid-market — consulting, web and app development, digitalization, maintenance and training from Schwarzenbek near Hamburg, Germany.",
  },
  /** Verified contact channel. Safe to publish in schema. */
  email: "hallo@tracht-digital.de",
  /** Legal entity behind the brand. */
  legalName: "Julian Tracht",
  founder: {
    name: "Julian Tracht",
    jobTitle: "Inhaber & Entwickler",
    sameAs: [] as string[], // populated from socials below post-launch
  },
  /**
   * Verified location is the city only (Schwarzenbek bei Hamburg).
   * Real street address pending Impressum cleanup (#5).
   */
  address: {
    addressLocality: "Schwarzenbek",
    addressRegion: "Schleswig-Holstein",
    addressCountry: "DE",
    // streetAddress: "...",  // pending #5
    // postalCode: "21493",   // matches Impressum but kept off until real street lands
  },
  /** Service-area for ProfessionalService schema. */
  areaServed: ["Hamburg", "Schwarzenbek", "Norddeutschland", "Deutschland"],
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
