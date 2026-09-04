import { describe, expect, it } from "vitest";
import { getFaqContent } from "./faq";
import { getHomeContent } from "./homeContent";
import { getPricingDefault } from "./pricing";
import { siteConfig } from "./seo";
import { serviceDefinitions } from "./services";

/**
 * Offers that were withdrawn must stop being sold.
 *
 * Deleting a service deletes its page; it does not delete the sentences
 * elsewhere that promise it. Those sentences have no failing state — the page
 * renders, the build is green, and the site simply offers something that is no
 * longer on the menu until a visitor asks for it. Complete IT was promised in
 * seven places outside its own definition (hero, navy band, FAQ, pricing
 * teaser, pricing notes, both site descriptions), which is why this greps the
 * committed prose rather than trusting that they were all found once.
 *
 * A CMS override can still reintroduce the wording; that is a redaktional risk
 * noted in AGENTS.md, not something a unit test can reach.
 */
describe("withdrawn offers stay withdrawn", () => {
  const LANGS = ["de", "en"] as const;
  const retired = [/komplette\s+IT/i, /complete\s+IT/i, /Auftragsprogrammierung/i];

  function prose(lang: (typeof LANGS)[number]): string {
    const home = getHomeContent(lang);
    const pricing = getPricingDefault(lang);
    const faq = getFaqContent(lang);

    return [
      home.hero.headline,
      home.hero.headlineAccent,
      home.hero.headlineSuffix,
      home.hero.sub,
      home.servicesOverview.intro,
      ...home.digitalResponsibility.points,
      home.digitalResponsibility.body,
      pricing.teaserSub,
      pricing.sub,
      ...pricing.notes,
      ...faq.items.flatMap((item) => [item.q, item.a]),
      siteConfig.description[lang],
      ...serviceDefinitions.flatMap((service) => {
        const c = service.fallback[lang];
        return [
          c.title,
          c.summary,
          c.intro,
          ...c.situations,
          ...c.responsibilities,
          ...c.outcomes,
          ...c.boundaries,
          ...c.process,
          c.priceText,
          c.ctaTitle,
          c.ctaText,
        ];
      }),
    ].join("\n");
  }

  for (const lang of LANGS) {
    it(`does not offer a retired service anywhere in ${lang} copy`, () => {
      const text = prose(lang);
      for (const pattern of retired) {
        expect(text, `${lang} still mentions ${pattern}`).not.toMatch(pattern);
      }
    });
  }

  it("still names what the catalog does offer", () => {
    // The inverse guard: a grep test passes trivially if the copy it reads
    // has quietly become empty or unreachable.
    expect(prose("de")).toMatch(/Webauftritt/);
    expect(prose("de")).toMatch(/Marketing/);
    expect(prose("en")).toMatch(/[Mm]arketing/);
  });
});
