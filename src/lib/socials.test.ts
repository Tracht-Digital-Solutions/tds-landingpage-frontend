import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { organizationSchema } from "./jsonld";
import { siteConfig } from "./seo";
import { socialLinks, whatsappHref } from "./socials";

const src = (path: string) => readFileSync(join(__dirname, "..", path), "utf8");

describe("social links", () => {
  it("give every destination ONE link on the home page (2026-11-13)", () => {
    // Profiles live in the footer, WhatsApp in the contact card. Both rows
    // used to carry all three, which doubled the external links and repeated
    // their anchor texts for every SEO checker.
    const footer = src("components/Footer.astro");
    expect(footer).toContain("<SocialLinks");
    expect(footer).toContain('socialLinks(contact.phone).filter((link) => link.id !== "whatsapp")');
    const contact = src("components/sections/Contact.astro");
    expect(contact).not.toContain("<SocialLinks");
    expect(contact).toContain("whatsappHref(contact.phone)");
    // No hand-written copy of a profile URL in either component.
    expect(contact).not.toContain("linkedin.com");
    expect(footer).not.toContain("linkedin.com");
  });

  it("use the same profile URLs as the JSON-LD sameAs", () => {
    const profiles = socialLinks(siteConfig.telephone)
      .filter((link) => link.id !== "whatsapp")
      .map((link) => link.href);
    const org = organizationSchema() as { sameAs?: string[] };
    for (const href of profiles) expect(org.sameAs).toContain(href);
  });

  it("link WhatsApp as E.164 digits without the plus", () => {
    expect(whatsappHref("+49 178 8224022")).toBe("https://wa.me/491788224022");
  });

  it("name every icon-only link and open it safely", () => {
    const markup = src("components/ui/SocialLinks.astro");
    expect(markup).toContain("aria-label={link.label}");
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('aria-hidden="true"');
  });
});
