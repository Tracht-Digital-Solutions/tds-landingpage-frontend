import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { organizationSchema } from "./jsonld";
import { siteConfig } from "./seo";
import { socialLinks, whatsappHref } from "./socials";

const src = (path: string) => readFileSync(join(__dirname, "..", path), "utf8");

describe("social links", () => {
  it("render in the contact section AND the footer, from one source", () => {
    // The shape rather than one literal call: the contact section filters the
    // list (see below), so pinning its exact expression made a correct change
    // fail. What matters is that both render the shared component and that
    // neither builds a list of its own.
    for (const file of ["components/sections/Contact.astro", "components/Footer.astro"]) {
      const code = src(file);
      expect(code, file).toContain("<SocialLinks links={");
      expect(code, `${file} derives its links from socialLinks()`).toMatch(
        /socialLinks\(contact\.phone\)/,
      );
    }
    // No second, hand-written copy of a profile URL in either component.
    expect(src("components/sections/Contact.astro")).not.toContain("linkedin.com");
    expect(src("components/Footer.astro")).not.toContain("linkedin.com");
  });

  it("keeps WhatsApp out of the contact card's PROFILE row", () => {
    // The contact card (2026-09-29) gives WhatsApp a row of its own among the
    // ways to reach a person, above the seam. Leaving it in the social row as
    // well would print one label for two identical links a centimetre apart —
    // and `socials.ts` already draws the same line in its docblock: a messenger
    // deep link is not a profile, which is why it is absent from `sameAs`.
    const code = src("components/sections/Contact.astro");
    expect(code).toMatch(/filter\(\(link\) => link\.id !== "whatsapp"\)/);
    expect(code).toContain("<SocialLinks links={profileLinks}");
    // And it is still reachable, from the row.
    expect(code).toContain("whatsappHref(contact.phone)");
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
