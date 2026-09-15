import { describe, expect, it } from "vitest";
import {
  JOURNAL_ARTICLES,
  getPlatformById,
  getPlatformBySlug,
  platformDefinitions,
  platformHref,
  type PlatformDefinition,
} from "./platforms";
import { retiredServiceTargets, serviceDefinitions } from "./services";

/**
 * The shop system and CMS pages, and the rules their copy keeps.
 *
 * Several of these are Julian's decisions rather than code correctness — no
 * amount on these pages, "du", no free and no time-boxed first conversation —
 * and they are here because a well-meant sentence could undo each of them with
 * nothing else to notice.
 */
const LANGS = ["de", "en"] as const;
const prose = (platform: PlatformDefinition, lang: (typeof LANGS)[number]) =>
  JSON.stringify(platform.content[lang]);

describe("platform catalog", () => {
  it("keeps ids and slugs unique", () => {
    const ids = platformDefinitions.map((platform) => platform.id);
    const slugs = platformDefinitions.map((platform) => platform.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("never takes a slug a service or a retired service answers under", () => {
    // Both live under `/leistungen/[slug]`; a shared slug would make one of the
    // two pages unreachable, silently.
    for (const lang of LANGS) {
      const taken = [
        ...serviceDefinitions.map((service) => service.slug[lang]),
        ...Object.keys(retiredServiceTargets[lang]),
      ];
      for (const platform of platformDefinitions) {
        expect(taken, `${platform.slug} (${lang})`).not.toContain(platform.slug);
      }
    }
  });

  it("resolves every platform by slug and by id, in both trees", () => {
    for (const platform of platformDefinitions) {
      expect(getPlatformBySlug(platform.slug)?.id).toBe(platform.id);
      expect(getPlatformById(platform.id).slug).toBe(platform.slug);
      expect(platformHref(platform, "de")).toBe(`/leistungen/${platform.slug}`);
      expect(platformHref(platform, "en")).toBe(`/en/services/${platform.slug}`);
    }
    expect(getPlatformBySlug("nicht-vorhanden")).toBeUndefined();
    expect(getPlatformBySlug(undefined)).toBeUndefined();
  });

  it("offers the agreed work: three offers on a shop page, four on a CMS page", () => {
    // WooCommerce and Shopware 6: fixing errors, building a shop, themes.
    // WordPress, TYPO3, STRATO: errors and upkeep, relaunch, themes or
    // templates, migrations and upgrades (decided 2026-09-15).
    for (const platform of platformDefinitions) {
      const expected = platform.kind === "shop" ? 3 : 4;
      for (const lang of LANGS) {
        expect(platform.content[lang].offers, `${platform.id} (${lang})`).toHaveLength(expected);
      }
    }
  });

  it("keeps both languages in step", () => {
    for (const platform of platformDefinitions) {
      const de = platform.content.de;
      const en = platform.content.en;
      for (const key of ["situations", "offers", "outcomes", "boundaries", "process", "faq"] as const) {
        expect(en[key].length, `${platform.id}.${key}`).toBe(de[key].length);
      }
      expect(en.comparison.columns.length, platform.id).toBe(de.comparison.columns.length);
      expect(en.comparison.rows.length, platform.id).toBe(de.comparison.rows.length);
      expect(platform.keywords.en.length, platform.id).toBe(platform.keywords.de.length);
    }
  });

  it("gives every offer an anchor that is unique on its page", () => {
    for (const platform of platformDefinitions) {
      for (const lang of LANGS) {
        const ids = platform.content[lang].offers.map((offer) => offer.id);
        expect(new Set(ids).size, `${platform.id} (${lang})`).toBe(ids.length);
        for (const id of ids) expect(id, `${platform.id} (${lang})`).toMatch(/^[a-z][a-z0-9-]*$/);
      }
    }
  });

  it("keeps every comparison row as wide as its header", () => {
    for (const platform of platformDefinitions) {
      for (const lang of LANGS) {
        const { columns, rows } = platform.content[lang].comparison;
        for (const row of rows) expect(row.length, `${platform.id} (${lang})`).toBe(columns.length);
      }
    }
  });

  it("gives every tile two to four short scope words", () => {
    for (const platform of platformDefinitions) {
      for (const lang of LANGS) {
        const keywords = platform.keywords[lang];
        expect(keywords.length).toBeGreaterThanOrEqual(2);
        expect(keywords.length).toBeLessThanOrEqual(4);
        for (const keyword of keywords) expect(keyword.length, keyword).toBeLessThanOrEqual(24);
      }
    }
  });
});

describe("platform search and answer-engine signals", () => {
  it.each(LANGS)("keeps every summary inside the description budget (%s)", (lang) => {
    for (const platform of platformDefinitions) {
      const summary = platform.content[lang].summary;
      expect(summary.length, `${platform.id}: ${summary}`).toBeGreaterThan(80);
      expect(summary.length, `${platform.id}: ${summary}`).toBeLessThanOrEqual(160);
      expect(summary.trim()).toBe(summary);
    }
  });

  it.each(LANGS)("gives every page a distinct title, system first and brand last (%s)", (lang) => {
    const titles = platformDefinitions.map((platform) => platform.seoTitle[lang]);
    expect(new Set(titles).size).toBe(titles.length);
    for (const platform of platformDefinitions) {
      const title = platform.seoTitle[lang];
      expect(title.length, title).toBeLessThanOrEqual(65);
      expect(title.startsWith(platform.name.split(" ")[0]), title).toBe(true);
      expect(title.endsWith("— Tracht Digital"), title).toBe(true);
    }
  });

  it("dates every page with a real day that is not in the future", () => {
    for (const platform of platformDefinitions) {
      expect(platform.updatedAt, platform.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const date = new Date(`${platform.updatedAt}T00:00:00Z`);
      expect(Number.isNaN(date.getTime()), platform.id).toBe(false);
      expect(date.getTime(), platform.id).toBeLessThanOrEqual(Date.now());
    }
  });

  it("opens with a quotable answer that names who, what and where", () => {
    for (const platform of platformDefinitions) {
      for (const lang of LANGS) {
        const answer = platform.content[lang].answer;
        expect(answer, `${platform.id} (${lang})`).toContain("Tracht Digital Solutions");
        expect(answer, `${platform.id} (${lang})`).toContain("Julian Tracht");
        expect(answer, `${platform.id} (${lang})`).toContain("Schwarzenbek");
        expect(answer, `${platform.id} (${lang})`).toContain(platform.name.split(" ")[0]);
        expect(answer.split(/\s+/).length, `${platform.id} (${lang})`).toBeLessThanOrEqual(75);
      }
    }
  });

  it("backs its facts with https sources and an encyclopedia entry", () => {
    for (const platform of platformDefinitions) {
      expect(platform.sources.length, platform.id).toBeGreaterThan(0);
      for (const source of platform.sources) {
        for (const lang of LANGS) {
          expect(source.url[lang], platform.id).toMatch(/^https:\/\//);
          expect(source.label[lang].trim().length, platform.id).toBeGreaterThan(0);
        }
      }
      expect(platform.wikipedia.de).toMatch(/^https:\/\/de\.wikipedia\.org\/wiki\//);
      expect(platform.wikipedia.en).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\//);
    }
  });

  it("links only journal articles it has words for — and never the anonymous shop case", () => {
    // `vom-baukasten-shop-zum-eigenen-shop` tells the anonymous office-supplies
    // case. Linked from the page of the systems involved, it would identify
    // the client (see `lib/platforms.ts`).
    for (const platform of platformDefinitions) {
      for (const slug of platform.articleSlugs) {
        expect(Object.keys(JOURNAL_ARTICLES), platform.id).toContain(slug);
      }
      expect(platform.articleSlugs as readonly string[]).not.toContain("vom-baukasten-shop-zum-eigenen-shop");
    }
  });
});

describe("platform copy rules", () => {
  it.each(LANGS)("names no amount (%s)", (lang) => {
    // Decided 2026-09-15: these pages point at the rates, they do not state one.
    for (const platform of platformDefinitions) {
      expect(prose(platform, lang), platform.id).not.toMatch(/€|\bEUR\b|\bEuro\b/i);
    }
  });

  it.each(LANGS)("never promises a free or time-boxed first conversation (%s)", (lang) => {
    for (const platform of platformDefinitions) {
      expect(prose(platform, lang), platform.id).not.toMatch(
        /kostenlos|kostenfrei|gratis|\bfree\b|minute|\bmin\.|\bStd\. frei/i,
      );
    }
  });

  it.each(LANGS)("quotes no price range (%s)", (lang) => {
    for (const platform of platformDefinitions) {
      expect(prose(platform, lang), platform.id).not.toMatch(
        /\d[\d.,]*\s*(€|EUR|Stunden|hours)?\s*(–|-|bis|to)\s*\d[\d.,]*\s*(€|EUR|Stunden|hours)/,
      );
    }
  });

  it("states the cost of the first conversation the one agreed way", () => {
    for (const platform of platformDefinitions) {
      expect(platform.content.de.costText, platform.id).toContain(
        "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
      );
    }
  });

  it("addresses the reader with du in German", () => {
    for (const platform of platformDefinitions) {
      const de = prose(platform, "de");
      expect(de, platform.id).not.toMatch(/\b(Sie|Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres)\b/);
      expect(de, platform.id).toMatch(/\b(du|dein|deine|deinen|deinem|deiner|dir|dich)\b/);
    }
  });

  it.each(LANGS)("says it is independent of the vendor (%s)", (lang) => {
    for (const platform of platformDefinitions) {
      expect(platform.content[lang].boundaries.join(" "), platform.id).toMatch(/unabhängig|independently/);
    }
  });

  it("offers nothing that was withdrawn and carries no placeholder", () => {
    for (const platform of platformDefinitions) {
      for (const lang of LANGS) {
        const text = prose(platform, lang);
        expect(text, platform.id).not.toMatch(/komplette\s+IT|complete\s+IT|Auftragsprogrammierung/i);
        expect(text, platform.id).not.toMatch(/PLATZHALTER|PLACEHOLDER|TODO/);
      }
    }
  });
});
