import { describe, expect, it } from "vitest";
import { demosCopy, getHomeContent } from "./homeContent";
import type { Lang } from "./i18n";

const langs: Lang[] = ["de", "en"];

/**
 * The demos section says how many demos there are, and how many there are is
 * decided by availability — a host with an expired certificate drops out
 * without anybody editing a word. Plural framing over one card promises a
 * shelf that is not there, so the count picks the copy.
 */
describe("demosCopy", () => {
  const de = getHomeContent("de").websiteDemos;

  it("uses the plural set for several demos", () => {
    expect(demosCopy(de, 3, "home")).toEqual({
      headline: de.headline,
      headlineAccent: de.headlineAccent,
      intro: de.intro,
    });
  });

  it("uses the singular set for exactly one", () => {
    expect(demosCopy(de, 1, "home")).toEqual({
      headline: de.headlineSingle,
      headlineAccent: de.headlineAccent,
      intro: de.introSingle,
    });
  });

  it("keeps the shorter service lead on both counts", () => {
    expect(demosCopy(de, 4, "service").intro).toBe(de.serviceIntro);
    expect(demosCopy(de, 1, "service").intro).toBe(de.serviceIntroSingle);
  });

  /**
   * A count of 0 never reaches a reader — the section renders nothing — but it
   * must not throw or fall into the singular set on the way there.
   */
  it("falls back to the plural set for an empty section", () => {
    expect(demosCopy(de, 0, "home").intro).toBe(de.intro);
  });

  it("honours a CMS override of a single field", () => {
    const overridden = { ...de, introSingle: "Eine Seite, live im Netz." };
    expect(demosCopy(overridden, 1, "home").intro).toBe("Eine Seite, live im Netz.");
    expect(demosCopy(overridden, 2, "home").intro).toBe(de.intro);
  });

  it("has singular copy in every language, distinct from the plural", () => {
    for (const lang of langs) {
      const content = getHomeContent(lang).websiteDemos;
      for (const value of [
        content.headlineSingle,
        content.introSingle,
        content.serviceIntroSingle,
      ]) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
      expect(content.headlineSingle).not.toBe(content.headline);
      expect(content.introSingle).not.toBe(content.intro);
      expect(content.serviceIntroSingle).not.toBe(content.serviceIntro);
    }
  });
});
