import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { siteConfig } from "./seo";

/**
 * SEO identity — the single source of truth the JSON-LD helpers read.
 *
 * Two things make this worth pinning rather than trusting:
 *
 *  1. **The NAP (name / address / phone) is duplicated.** `siteConfig` carries
 *     it for structured data, and `/legal/impressum` states it again in prose
 *     for the legal requirement. Nothing links the two, so an address change
 *     applied to one and not the other publishes a mismatch between a site's
 *     schema and its own Impressum — which is exactly the signal local search
 *     ranks on, and a legal problem besides.
 *  2. **The keyword targets are a written commitment** (root CLAUDE.md):
 *     "Digitalisierung für Unternehmen" Germany-wide plus local 21493
 *     Schwarzenbek bei Hamburg. Dropping either from the description or the
 *     schema silently abandons what the site is optimised for.
 */

// Resolved from the repo root: Vitest transforms the module, so
// `import.meta.url` is not a file: URL here.
const read = (rel: string) => readFileSync(resolve(process.cwd(), rel), "utf8");
const impressum = read("src/pages/legal/impressum.astro");
const astroConfig = read("astro.config.mjs");

describe("the NAP matches the Impressum", () => {
  it("states the same street address", () => {
    expect(impressum).toContain(siteConfig.address.streetAddress);
  });

  it("states the same postal code and town", () => {
    expect(impressum).toContain(siteConfig.address.postalCode);
    expect(impressum).toContain(siteConfig.address.addressLocality);
  });

  it("names the same legal entity", () => {
    expect(impressum).toContain(siteConfig.legalName);
  });

  it("publishes only a verified, well-formed address", () => {
    expect(siteConfig.address.postalCode).toMatch(/^\d{5}$/);
    expect(siteConfig.address.addressCountry).toBe("DE");
    expect(siteConfig.address.streetAddress.trim()).toBe(siteConfig.address.streetAddress);
  });
});

describe("the keyword commitments", () => {
  it("keeps the Germany-wide target in the German description", () => {
    // Root CLAUDE.md names this as the primary keyword target.
    expect(siteConfig.description.de).toContain("Digitalisierung für Unternehmen");
  });

  it("keeps the LOCAL signal in the German description", () => {
    expect(siteConfig.description.de).toContain("Schwarzenbek");
    expect(siteConfig.description.de).toMatch(/Hamburg/);
  });

  it("keeps the local signal in the English description too", () => {
    expect(siteConfig.description.en).toMatch(/Schwarzenbek/);
  });

  it("lists the Germany-wide target in knowsAbout", () => {
    expect(siteConfig.knowsAbout).toContain("Digitalisierung für Unternehmen");
  });

  it("serves both the local area and the whole country", () => {
    // A local-only areaServed would drop the Germany-wide half of the target.
    expect(siteConfig.areaServed).toContain("Deutschland");
    expect(siteConfig.areaServed.some((a) => /Schwarzenbek|Hamburg/.test(a))).toBe(true);
  });
});

describe("the descriptions are usable as meta descriptions", () => {
  it("does not grow any longer than it already is", () => {
    // Google renders roughly the first 155–160 characters of a meta
    // description and truncates the rest.
    //
    // FINDING (2026-07, not fixed here): both descriptions run past that —
    // 181 chars (de) and 175 (en) — so each loses its last ~20 characters in
    // the SERP. The LOCAL signal survives (see the next test: "Schwarzenbek"
    // sits around index 139), and what actually gets cut is the trailing
    // Germany-wide qualifier ("deutschlandweit."). Worth tightening, but
    // shortening marketing copy is an editorial decision, so this pins the
    // CURRENT lengths as a no-regression bound instead of rewriting it.
    // Lower these when the copy is shortened.
    const BUDGET: Record<string, number> = { de: 181, en: 175 };
    for (const [lang, text] of Object.entries(siteConfig.description)) {
      expect(text.length, `${lang} description is ${text.length} chars`).toBeLessThanOrEqual(BUDGET[lang]!);
    }
  });

  it("keeps the LOCAL signal inside the part Google actually renders", () => {
    // The town is the half of the keyword target that has to survive
    // truncation — it is what local search matches on. Both descriptions
    // currently place it around index 139, comfortably inside the cut.
    const RENDERED = 160;
    for (const [lang, text] of Object.entries(siteConfig.description)) {
      expect(text.slice(0, RENDERED), `${lang} loses the town to truncation`).toMatch(/Schwarzenbek/);
    }
  });

  it("is long enough to be worth rendering", () => {
    for (const [lang, text] of Object.entries(siteConfig.description)) {
      expect(text.length, lang).toBeGreaterThan(80);
    }
  });

  it("ships both languages", () => {
    expect(siteConfig.description.de).toBeTruthy();
    expect(siteConfig.description.en).toBeTruthy();
    expect(siteConfig.description.de).not.toBe(siteConfig.description.en);
  });

  it("carries no stray whitespace that would render oddly", () => {
    for (const [lang, text] of Object.entries(siteConfig.description)) {
      expect(text.trim(), lang).toBe(text);
      expect(text, lang).not.toMatch(/\s{2,}/);
    }
  });
});

describe("the origins", () => {
  it("MIRRORS the site origin declared in astro.config", () => {
    // Astro builds canonical URLs and the sitemap from astro.config#site,
    // while JSON-LD builds them from here. A drift between the two publishes
    // canonicals that disagree with the schema on the same page.
    expect(astroConfig).toContain(`site: "${siteConfig.url}"`);
  });

  it("uses https and no trailing slash for both origins", () => {
    for (const url of [siteConfig.url, siteConfig.blogUrl]) {
      expect(url, url).toMatch(/^https:\/\//);
      expect(url, url).not.toMatch(/\/$/);
    }
  });

  it("points the journal at the blog subdomain", () => {
    expect(siteConfig.blogUrl).toContain("blog.");
    expect(siteConfig.blogUrl).not.toBe(siteConfig.url);
  });

  it("defaults to German", () => {
    expect(siteConfig.defaultLocale).toBe("de");
  });
});

describe("the published contact details", () => {
  it("publishes a real email address", () => {
    expect(siteConfig.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
  });

  it("publishes the phone in an E.164-friendly form", () => {
    // schema.org consumers parse this; a national-format number is ambiguous.
    expect(siteConfig.telephone).toMatch(/^\+49[\d ]+$/);
  });

  it("publishes a German VAT id in the documented format", () => {
    expect(siteConfig.vatID).toMatch(/^DE\d{9}$/);
  });

  it("publishes only https social URLs", () => {
    for (const [key, url] of Object.entries(siteConfig.socials)) {
      if (url) expect(url, key).toMatch(/^https:\/\//);
    }
  });

  it("keeps WhatsApp out of the social profile list", () => {
    // `sameAs` expects social-profile URLs; a wa.me deep link is a messenger
    // link and pollutes the entity graph.
    expect(Object.keys(siteConfig.socials)).not.toContain("whatsapp");
  });
});

describe("the schema identity", () => {
  it("names the brand and its short form distinctly", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(siteConfig.shortName).toBeTruthy();
    expect(siteConfig.shortName).not.toBe(siteConfig.name);
  });

  it("gives the founder a name and a role", () => {
    expect(siteConfig.founder.name).toBeTruthy();
    expect(siteConfig.founder.jobTitle).toBeTruthy();
  });

  it("places the founder's name inside the legal entity", () => {
    expect(siteConfig.legalName).toContain(siteConfig.founder.name);
  });

  it("carries coordinates that actually fall in northern Germany", () => {
    // A transposed lat/lng puts the LocalBusiness pin in the wrong country.
    expect(siteConfig.geo.latitude).toBeGreaterThan(47);
    expect(siteConfig.geo.latitude).toBeLessThan(56);
    expect(siteConfig.geo.longitude).toBeGreaterThan(5);
    expect(siteConfig.geo.longitude).toBeLessThan(16);
  });

  it("points the default OG image at an absolute site path", () => {
    expect(siteConfig.defaultOgImage).toMatch(/^\//);
  });
});
