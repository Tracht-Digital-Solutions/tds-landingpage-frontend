/**
 * The published reference cases, and the rules that keep them honest.
 *
 * Two of these assertions are content policy rather than code correctness, and
 * they are here on purpose: "anonymised, no customer link" is a standing
 * instruction that a future edit could quietly undo in a string literal, where
 * no type and no build step would notice.
 */
import { describe, expect, it } from "vitest";
import { articleUrl, referenceCases, referencesForService } from "./references";
import { mergeReferences, serviceDefinitions, type ServiceReference } from "./services";
import { siteConfig } from "./seo";

const LANGS = ["de", "en"] as const;

describe("reference catalog", () => {
  it("names only services that exist, without repeating one", () => {
    const ids = new Set(serviceDefinitions.map((service) => service.id));
    for (const entry of referenceCases) {
      expect(entry.services.length, entry.id).toBeGreaterThan(0);
      expect(new Set(entry.services).size, entry.id).toBe(entry.services.length);
      for (const service of entry.services) {
        expect(ids, `${entry.id} → ${service}`).toContain(service);
      }
    }
  });

  it("keeps ids unique", () => {
    const ids = referenceCases.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("carries complete copy in both languages", () => {
    for (const entry of referenceCases) {
      for (const lang of LANGS) {
        const c = entry.content[lang];
        for (const field of ["title", "context", "challenge", "solution", "result"] as const) {
          expect(c[field]?.trim(), `${entry.id}.${lang}.${field}`).toBeTruthy();
        }
        // `metric` is optional, but must be a string when present so the
        // renderer's `{reference.metric && …}` gate behaves.
        expect(typeof c.metric, `${entry.id}.${lang}.metric`).toBe("string");
      }
    }
  });

  it("stays anonymised — no customer name and no link off to a customer site", () => {
    // The standing instruction. Naming the client, or linking their shop,
    // is a decision for a person, not something an edit here may drift into.
    const forbidden = [/toner/i, /tintenoffice/i, /woocommerce/i, /strato/i];
    for (const entry of referenceCases) {
      for (const lang of LANGS) {
        const prose = Object.values(entry.content[lang]).join(" ");
        for (const pattern of forbidden) {
          expect(prose, `${entry.id}.${lang}`).not.toMatch(pattern);
        }
        // No URLs in the copy at all: the only destinations a card offers are
        // the code-owned service and article links.
        expect(prose, `${entry.id}.${lang}`).not.toMatch(/https?:\/\//);
      }
    }
  });
});

describe("articleUrl", () => {
  it("points at the journal, language-aware", () => {
    expect(articleUrl("ein-artikel", "de")).toBe(`${siteConfig.blogUrl}/ein-artikel`);
    expect(articleUrl("ein-artikel", "en")).toBe(`${siteConfig.blogUrl}/en/ein-artikel`);
  });

  it("never points at this site", () => {
    for (const lang of LANGS) {
      expect(articleUrl("x", lang).startsWith(siteConfig.blogUrl)).toBe(true);
    }
  });
});

describe("referencesForService", () => {
  it("returns a case for every service it names, in both languages", () => {
    for (const entry of referenceCases) {
      for (const service of entry.services) {
        for (const lang of LANGS) {
          const found = referencesForService(service, lang).find(
            (r) => r.title === entry.content[lang].title,
          );
          expect(found, `${entry.id} on ${service} (${lang})`).toBeDefined();
        }
      }
    }
  });

  it("returns nothing for a service no case names", () => {
    const named = new Set(referenceCases.flatMap((entry) => entry.services));
    const unnamed = serviceDefinitions.find((service) => !named.has(service.id));
    // Only meaningful while some service has no case; skip rather than
    // assert a fixture that a future case would invalidate.
    if (unnamed) expect(referencesForService(unnamed.id, "de")).toEqual([]);
  });

  it("attaches the article link, and hands out a fresh array each call", () => {
    const [entry] = referenceCases;
    if (!entry?.articleSlug) return;
    const first = referencesForService(entry.services[0], "de");
    const second = referencesForService(entry.services[0], "de");
    expect(first[0].articleUrl).toBe(articleUrl(entry.articleSlug, "de"));
    expect(first).not.toBe(second);
    expect(first[0]).not.toBe(second[0]);
  });
});

describe("mergeReferences", () => {
  const committed: ServiceReference[] = [
    {
      title: "Committed",
      context: "c",
      challenge: "c",
      solution: "c",
      result: "c",
      metric: "",
      articleUrl: "https://blog.tracht-digital.de/ein-artikel",
    },
  ];
  const override: ServiceReference = {
    title: "Edited in the panel",
    context: "o",
    challenge: "o",
    solution: "o",
    result: "o",
    metric: "",
  };

  it("renders the committed cases when the CMS says nothing", () => {
    expect(mergeReferences(committed, [])).toEqual(committed);
  });

  it("overrides the text but keeps the code-owned link", () => {
    const merged = mergeReferences(committed, [override]);
    expect(merged[0].title).toBe("Edited in the panel");
    expect(merged[0].articleUrl).toBe(committed[0].articleUrl);
  });

  it("does not let the CMS invent a link", () => {
    const hostile = { ...override, articleUrl: "https://example.invalid/phish" };
    // Position 0 has a committed link, which wins.
    expect(mergeReferences(committed, [hostile])[0].articleUrl).toBe(
      committed[0].articleUrl,
    );
    // Position 1 has none, so the entry simply has no link — the CMS value is
    // never the source of one. (`validateServiceReferences` is what strips it
    // in production; this asserts the merge does not reintroduce it.)
    expect(mergeReferences(committed, [override, override])[1].articleUrl).toBeUndefined();
  });

  it("keeps editor-authored extras beyond the committed list", () => {
    const merged = mergeReferences(committed, [override, { ...override, title: "Second" }]);
    expect(merged).toHaveLength(2);
    expect(merged[1].title).toBe("Second");
  });

  it("drops committed cases the editor replaced with a shorter list", () => {
    const two = [...committed, { ...override, title: "Committed 2" }];
    expect(mergeReferences(two, [override])).toHaveLength(1);
  });

  it("returns a copy, never the committed array itself", () => {
    expect(mergeReferences(committed, [])).not.toBe(committed);
  });
});
