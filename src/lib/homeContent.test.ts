import { describe, expect, it } from "vitest";
import { getFaqContent } from "./faq";
import { TRUST_TARGETS, demosCopy, getHomeContent, resolveTrustFacts } from "./homeContent";
import type { Lang } from "./i18n";
import { getPricingDefault } from "./pricing";

const langs: Lang[] = ["de", "en"];

/**
 * The copy rules Julian has decided, as a test — each of them is a sentence a
 * well-meant edit could quietly undo.
 *
 * - No free and no time-boxed first conversation on the website (the ads offer
 *   one, the site deliberately does not; decided 2026-08, confirmed
 *   2026-09-12). The one sentence about cost is fixed.
 * - No project price ranges — the cost logic is explained, nothing estimated.
 */
describe("the copy rules", () => {
  const decisionCopy = (lang: Lang) => {
    const home = getHomeContent(lang);
    return JSON.stringify({
      hero: home.hero,
      trust: home.trust,
      firstCall: home.firstCall,
      pricingLogic: home.pricingLogic,
      references: home.referencesHome,
      demos: home.websiteDemos,
      faq: getFaqContent(lang),
      pricing: getPricingDefault(lang),
    });
  };

  it.each(langs)("never promises a free or time-boxed first conversation (%s)", (lang) => {
    expect(decisionCopy(lang)).not.toMatch(/kostenlos|kostenfrei|gratis|\bfree\b|minute|\bmin\.|\bStd\. frei/i);
  });

  it("states the cost of the first conversation the one agreed way", () => {
    const de = getHomeContent("de").firstCall.items.map((item) => item.text);
    expect(de).toContain("Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.");
    expect(getFaqContent("de").items.map((item) => item.a)).toContain(
      "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
    );
  });

  it.each(langs)("quotes no price range (%s)", (lang) => {
    // "1.500–4.000 €", "€1,500 to €4,000", "10–20 Stunden" …
    expect(decisionCopy(lang)).not.toMatch(/\d[\d.,]*\s*(€|EUR|Stunden|hours)?\s*(–|-|bis|to)\s*\d[\d.,]*\s*(€|EUR|Stunden|hours)/);
  });
});

describe("the trust card", () => {
  const values = { name: "Julian Tracht", town: "Schwarzenbek", rate: 65, hasCases: true };

  it("never carries more than three facts", () => {
    expect(TRUST_TARGETS.length).toBeLessThanOrEqual(3);
    for (const lang of langs) {
      expect(resolveTrustFacts(getHomeContent(lang).trust, values).facts.length).toBeLessThanOrEqual(3);
    }
  });

  it.each(langs)("fills every placeholder from the values it states (%s)", (lang) => {
    const { facts } = resolveTrustFacts(getHomeContent(lang).trust, values);
    for (const fact of facts) {
      expect(fact.text).not.toMatch(/\{[a-z]+\}/);
    }
    expect(facts.map((fact) => fact.text).join(" ")).toContain("Julian Tracht");
    expect(facts.map((fact) => fact.text).join(" ")).toContain("65");
  });

  it("links each fact to the section that proves it", () => {
    const { facts } = resolveTrustFacts(getHomeContent("de").trust, values);
    expect(facts.map((fact) => fact.href)).toEqual(TRUST_TARGETS.map((target) => `#${target}`));
  });

  it("drops the client-projects fact when no case is published", () => {
    const { facts } = resolveTrustFacts(getHomeContent("de").trust, { ...values, hasCases: false });
    expect(facts.map((fact) => fact.href)).not.toContain("#cases");
    expect(facts).toHaveLength(2);
  });
});

describe("both languages stay in step", () => {
  it("in the blocks added by the redesign", () => {
    const de = getHomeContent("de");
    const en = getHomeContent("en");
    expect(en.trust.facts).toHaveLength(de.trust.facts.length);
    expect(en.firstCall.items).toHaveLength(de.firstCall.items.length);
    expect(en.pricingLogic.steps).toHaveLength(de.pricingLogic.steps.length);
    expect(getFaqContent("en").items).toHaveLength(getFaqContent("de").items.length);
    for (const lang of langs) {
      const home = getHomeContent(lang);
      for (const value of [home.hero.eyebrow, home.trust.title, home.firstCall.title, home.pricingLogic.title]) {
        expect(value.trim().length, lang).toBeGreaterThan(0);
      }
    }
  });
});

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
