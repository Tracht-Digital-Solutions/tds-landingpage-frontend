import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  BUSINESS_CARD_SLUG,
  businessCardHref,
  businessCardLinks,
} from "./businessCard";
import { siteConfig } from "./seo";

/**
 * The digital business card as a STANDALONE page.
 *
 * Two things are worth pinning here, and neither is caught by anything else:
 *
 *  1. **The rows are contact data.** The phone number and the email address on
 *     this page are the same two strings the vCard, the Impressum and the
 *     LocalBusiness schema publish. A card that dials a number the Impressum
 *     no longer names is worse than a card with no number on it.
 *  2. **The page renders `bare`.** It deliberately drops the site Header and
 *     Footer, which is where every other page on this site gets its Impressum
 *     and Datenschutz links — links a public German page has to carry. Nothing
 *     in the build fails if they quietly disappear from the one page that has
 *     to draw them itself, so this suite watches for it.
 */
const read = (rel: string) => readFileSync(resolve(process.cwd(), rel), "utf8");
const page = read("src/components/BusinessCardPage.astro");

describe("the link stack", () => {
  it("offers the same rows in the same order in both languages", () => {
    // The copy is translated; the inventory is not a locale decision. A row
    // that exists in one tree only would also break the hreflang pair.
    const ids = (lang: "de" | "en") => businessCardLinks(lang).map((l) => l.id);
    expect(ids("en")).toEqual(ids("de"));
  });

  it("leads with the three ways to reach a person", () => {
    // The order is the design: someone who just scanned a code off a screen
    // wants to dial, message or write — not to browse a service catalog.
    const contact = businessCardLinks("de")
      .filter((link) => link.group === "contact")
      .map((link) => link.id);
    expect(contact).toEqual(["phone", "whatsapp", "mail"]);
  });

  it("dials and writes the details the Impressum publishes", () => {
    const links = businessCardLinks("de");
    const tel = links.find((link) => link.id === "phone");
    const mail = links.find((link) => link.id === "mail");
    const whatsapp = links.find((link) => link.id === "whatsapp");

    // E.164 — a `tel:` with spaces in it is not dialled by every client, and
    // `wa.me` rejects the `+`.
    const e164 = siteConfig.telephone.replace(/\s/g, "");
    expect(tel?.href).toBe(`tel:${e164}`);
    expect(whatsapp?.href).toBe(`https://wa.me/${e164.replace(/^\+/, "")}`);
    expect(mail?.href).toBe(`mailto:${siteConfig.email}`);
  });

  it("publishes no postal address", () => {
    // Same rule as `kontakt.vcf.ts`: it is a private home address. The page
    // shows postal code + locality, which the site footer already publishes.
    const all = JSON.stringify(businessCardLinks("de")) + JSON.stringify(businessCardLinks("en"));
    expect(all).not.toContain(siteConfig.address.streetAddress);
  });

  it("marks every row that leaves the site, and only those", () => {
    for (const lang of ["de", "en"] as const) {
      for (const link of businessCardLinks(lang)) {
        if (link.external) {
          // The mark drives `target="_blank"` + `rel` + the spoken hint, so a
          // missing one is a silent accessibility regression.
          expect(link.href, link.id).toMatch(/^https:\/\//);
          expect(link.href, link.id).not.toContain(siteConfig.url);
        } else {
          expect(link.href, link.id).toMatch(/^(\/|tel:|mailto:)/);
        }
      }
    }
  });

  it("keeps every internal row inside its own language tree", () => {
    for (const link of businessCardLinks("en")) {
      if (link.external || !link.href.startsWith("/")) continue;
      expect(link.href, link.id).toMatch(/^\/en(\/|#|$)/);
    }
    for (const link of businessCardLinks("de")) {
      if (link.external || !link.href.startsWith("/")) continue;
      expect(link.href, link.id).not.toMatch(/^\/en(\/|#|$)/);
    }
  });

  it("gives every row a label, a meta line and a unique id", () => {
    const links = businessCardLinks("de");
    for (const link of links) {
      expect(link.label.trim(), link.id).toBeTruthy();
      expect(link.meta.trim(), link.id).toBeTruthy();
    }
    expect(new Set(links.map((l) => l.id)).size).toBe(links.length);
  });
});

describe("the page stands alone", () => {
  it("renders without the site chrome", () => {
    // `bare` is what drops the floating CTA, the custom cursor, the scroll
    // bar and the live-chat widget. Header/Footer are dropped by simply not
    // being imported — which is also how they would come back unnoticed.
    expect(page).toMatch(/^\s*bare\s*$/m);
    expect(page).not.toMatch(/^\s*import\s+Header\s/m);
    expect(page).not.toMatch(/^\s*import\s+Footer\s/m);
  });

  it("draws the legal links the dropped footer used to carry", () => {
    // Not decoration: a public German page owes its visitor a reachable
    // Impressum, and this page is the only one that has to draw it itself.
    expect(page).toContain('href="/legal/impressum"');
    expect(page).toContain('href="/legal/datenschutz"');
  });

  it("keeps a way back into both language trees", () => {
    // With no header there is no language dropdown, so the card links its own
    // twin. `businessCardHref` is what both sides resolve through.
    expect(page).toContain("businessCardHref(otherLang)");
    expect(businessCardHref("de")).toBe(BUSINESS_CARD_SLUG.de);
    expect(businessCardHref("en")).toBe(BUSINESS_CARD_SLUG.en);
  });

  it("still offers the vCard the page was built around", () => {
    expect(page).toContain('href="/kontakt.vcf"');
  });
});
