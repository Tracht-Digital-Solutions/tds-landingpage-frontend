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
  /**
   * Meta descriptions. Google renders roughly the first 155-160 characters and
   * truncates the rest, so both of these are kept under 160 — see
   * `seo.test.ts`, which fails the build if either grows past its budget.
   *
   * Both must keep the two keyword targets intact inside that budget: the exact
   * phrase "Digitalisierung für Unternehmen" (Germany-wide) and the local
   * signal "Schwarzenbek"/"Hamburg". Trim the service list before either of
   * those.
   */
  description: {
    de: "Bestehende Webseiten und Onlineshops übernehmen, reparieren, pflegen. Digitalisierung für Unternehmen – aus Schwarzenbek bei Hamburg.",
    en: "Taking over, repairing and maintaining existing websites and online shops. Digitalization for businesses – from Schwarzenbek near Hamburg.",
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
    // Websites first, like the site since 2026-09-15. Shown on the business
    // card and in the vCard as well.
    jobTitle: "Webentwickler & Digitalisierungsberater",
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
  /**
   * Topics for schema `knowsAbout` — the keyword set the site targets, in the
   * words people search with. Every system named here has a page of its own
   * (`lib/platforms.ts`); a topic without one would be a claim the site does
   * not back up.
   */
  knowsAbout: [
    "Digitalisierung für Unternehmen",
    "Website erstellen",
    "Webdesign",
    "Webentwicklung",
    "Onlineshop erstellen",
    "Website-Wartung",
    "WordPress",
    "WooCommerce",
    "Shopware 6",
    "TYPO3",
    "Onlineshop für lokale Geschäfte",
    "Google Ads",
    "Suchmaschinenwerbung",
    "Lokale Sichtbarkeit",
    "Prozessautomatisierung",
    "Individualsoftware",
    "Schnittstellen",
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
