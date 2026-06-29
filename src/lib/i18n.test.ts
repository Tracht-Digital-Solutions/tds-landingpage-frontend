import { describe, expect, it } from "vitest";
import { localizePath, resolveLang, tFor } from "./i18n";

/**
 * The i18n helpers were once the cause of a no-op language toggle (an
 * island read translations.de directly). These pin the locale resolution
 * and the EN path-prefixing that the whole site's links depend on.
 */
describe("resolveLang", () => {
  it("returns 'en' only for the exact 'en' locale", () => {
    expect(resolveLang("en")).toBe("en");
  });

  it("defaults everything else (incl. undefined) to 'de'", () => {
    expect(resolveLang("de")).toBe("de");
    expect(resolveLang(undefined)).toBe("de");
    expect(resolveLang("fr")).toBe("de");
  });
});

describe("tFor", () => {
  it("returns the matching translation bundle", () => {
    expect(tFor("en")).not.toBe(tFor("de"));
    expect(tFor("en").nav.contact).not.toBe(tFor("de").nav.contact);
  });
});

describe("localizePath", () => {
  it("leaves DE paths untouched", () => {
    expect(localizePath("/impressum", "de")).toBe("/impressum");
    expect(localizePath("/", "de")).toBe("/");
  });

  it("maps the EN home to /en/", () => {
    expect(localizePath("/", "en")).toBe("/en/");
  });

  it("prefixes EN paths with /en", () => {
    expect(localizePath("/impressum", "en")).toBe("/en/impressum");
  });

  it("is idempotent for already-localized EN paths", () => {
    expect(localizePath("/en/impressum", "en")).toBe("/en/impressum");
    expect(localizePath("/en", "en")).toBe("/en");
  });

  it("handles a path without a leading slash", () => {
    expect(localizePath("impressum", "en")).toBe("/en/impressum");
  });
});
