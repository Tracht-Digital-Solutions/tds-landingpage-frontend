import { describe, expect, it } from "vitest";
import { BUSINESS_CARD_SLUG } from "./businessCard";
import { alternatePath } from "./languageSwitch";
import { serviceDefinitions, serviceHref } from "./services";

/**
 * The header's language switch may only point at a page that exists.
 *
 * Its predecessor built the English URL by gluing `/en` onto the German path
 * whenever the head carried no alternates — which is every `noindex` page — and
 * sent visitors from `/leistungen/webauftritt` to `/en/leistungen/webauftritt`,
 * a 404.
 */
describe("alternatePath", () => {
  it("pairs the two home pages, with or without the trailing slash", () => {
    expect(alternatePath("/", "en")).toBe("/en/");
    expect(alternatePath("/en/", "de")).toBe("/");
    expect(alternatePath("/en", "de")).toBe("/");
  });

  it("pairs every service page with its OWN slug in the other language", () => {
    for (const service of serviceDefinitions) {
      expect(alternatePath(serviceHref(service, "de"), "en")).toBe(serviceHref(service, "en"));
      expect(alternatePath(serviceHref(service, "en"), "de")).toBe(serviceHref(service, "de"));
    }
  });

  it("never derives a path by prefixing /en", () => {
    for (const service of serviceDefinitions) {
      expect(alternatePath(serviceHref(service, "de"), "en")).not.toBe(
        `/en${serviceHref(service, "de")}`,
      );
    }
  });

  it("pairs the business card", () => {
    expect(alternatePath(BUSINESS_CARD_SLUG.de, "en")).toBe(BUSINESS_CARD_SLUG.en);
    expect(alternatePath(BUSINESS_CARD_SLUG.en, "de")).toBe(BUSINESS_CARD_SLUG.de);
  });

  it("offers nothing for a page without a twin", () => {
    // Offering a language that does not exist is worse than offering none.
    expect(alternatePath("/legal/impressum", "en")).toBeNull();
    expect(alternatePath("/legal/datenschutz", "en")).toBeNull();
    expect(alternatePath("/install", "en")).toBeNull();
    expect(alternatePath("/gibt-es-nicht", "en")).toBeNull();
  });
});
