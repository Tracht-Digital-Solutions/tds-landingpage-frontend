/**
 * The published reference cases, and the rules that keep them honest.
 *
 * Several of these assertions are content policy rather than code correctness,
 * and they are here on purpose: "anonymised unless that customer approved being
 * named" is a standing instruction that a future edit could quietly undo in a
 * string literal, where no type and no build step would notice.
 *
 * Since a case may now be named, the policy has more than one moving part and
 * they have to agree: the catalog's own `disclosure` flag, the absence of any
 * URL in the prose, and the promise the site makes to its customers in copy
 * that lives in two other files. The last one is the reason for the test that
 * reads `homeContent` and the service catalog from here — a card naming a
 * customer under a sentence swearing anonymity is not a bug any type can catch.
 */
import { describe, expect, it } from "vitest";
import { articleUrl, referenceCases, referencesForService } from "./references";
import {
  getServiceById,
  mergeReferences,
  serviceDefinitions,
  type ServiceReference,
} from "./services";
import { getHomeContent } from "./homeContent";
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

  it("keeps no destination in the prose, named or not", () => {
    // Every case, including a named one. A link is a code-owned field; copy
    // that carries a URL puts a destination somewhere the CMS can rewrite it.
    for (const entry of referenceCases) {
      for (const lang of LANGS) {
        const prose = Object.values(entry.content[lang]).join(" ");
        expect(prose, `${entry.id}.${lang}`).not.toMatch(/https?:\/\//);
      }
    }
  });

  it("keeps an anonymous case anonymous", () => {
    // The standing instruction, now scoped to the cases it still governs.
    // Naming a client is a decision for a person, made once per case — not
    // something an edit to a string literal may drift into.
    const forbidden = [/toner/i, /tintenoffice/i, /woocommerce/i, /strato/i];
    for (const entry of referenceCases) {
      if (entry.disclosure !== "anonymous") continue;
      for (const lang of LANGS) {
        const prose = Object.values(entry.content[lang]).join(" ");
        for (const pattern of forbidden) {
          expect(prose, `${entry.id}.${lang}`).not.toMatch(pattern);
        }
      }
    }
  });

  it("keeps disclosure and the customer link in agreement, both ways", () => {
    // Both directions on purpose. "Anonymous implies no link" alone would let
    // a later edit hang a customer's site off a case still marked anonymous —
    // and the vocabulary check above would not notice, because the address
    // never appears in the prose.
    for (const entry of referenceCases) {
      if (entry.disclosure === "anonymous") {
        expect(entry.siteUrl, entry.id).toBeNull();
        continue;
      }

      expect(entry.siteUrl, entry.id).toBeTruthy();
      const url = new URL(entry.siteUrl!);
      expect(url.protocol, entry.id).toBe("https:");
      // A "customer site" pointing back at anything of ours is a mislabelled
      // internal link. The suffix also rules out the demo hosts, which
      // `demos.test.ts` proves all live under this domain.
      for (const own of [siteConfig.url, siteConfig.blogUrl]) {
        expect(url.host, entry.id).not.toBe(new URL(own).host);
      }
      expect(url.host.endsWith("tracht-digital.de"), entry.id).toBe(false);
    }
  });

  it("does not promise anonymity while a named case is published", () => {
    // The promise and the catalog are edited in different files, months apart.
    // This is the only thing that keeps them from contradicting each other on
    // the page: a card naming a customer sitting under a sentence that says
    // references are anonymised without exception.
    const named = referenceCases.filter((entry) => entry.disclosure === "named");
    if (named.length === 0) return;

    const claimsAnonymity = /ausschließlich anonym|only in anonymised|appear anonymised/i;
    const services = new Set(named.flatMap((entry) => entry.services));

    for (const lang of LANGS) {
      expect(getHomeContent(lang).referencesHome.label, `home.${lang}`).not.toMatch(
        claimsAnonymity,
      );
      for (const service of services) {
        expect(
          getServiceById(service).fallback[lang].referencesLabel,
          `${service}.${lang}`,
        ).not.toMatch(claimsAnonymity);
      }
    }
  });

  it("carries no placeholder copy", () => {
    // A case is not publishable until its prose is real. This fails loudly
    // while a scaffolded entry is still in the catalog, so a half-written
    // reference cannot reach a release by being forgotten.
    for (const entry of referenceCases) {
      for (const lang of LANGS) {
        const prose = Object.values(entry.content[lang]).join(" ");
        expect(prose, `${entry.id}.${lang}`).not.toMatch(/PLATZHALTER|PLACEHOLDER|TODO/i);
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
    // Found by predicate, not by index: an early return on `referenceCases[0]`
    // would silently skip this entire assertion the day the array is reordered.
    const entry = referenceCases.find((candidate) => candidate.articleSlug);
    expect(entry, "no case carries an article slug").toBeDefined();

    const service = entry!.services[0];
    const first = referencesForService(service, "de");
    const second = referencesForService(service, "de");
    const found = first.find((r) => r.title === entry!.content.de.title);

    expect(found?.articleUrl).toBe(articleUrl(entry!.articleSlug!, "de"));
    expect(first).not.toBe(second);
    expect(first[0]).not.toBe(second[0]);
  });

  it("attaches the customer link, and does not vary it by language", () => {
    const entry = referenceCases.find((candidate) => candidate.siteUrl);
    expect(entry, "no case carries a customer site").toBeDefined();

    for (const lang of LANGS) {
      const resolved = referencesForService(entry!.services[0], lang);
      const found = resolved.find((r) => r.title === entry!.content[lang].title);
      // Same address in both trees — unlike the article link, which is
      // language-aware. A customer site has no localized twin.
      expect(found?.siteUrl, lang).toBe(entry!.siteUrl);
    }
  });

  it("leaves an anonymous case without a customer link", () => {
    const entry = referenceCases.find((candidate) => candidate.disclosure === "anonymous");
    expect(entry, "no anonymous case left to check").toBeDefined();

    const resolved = referencesForService(entry!.services[0], "de");
    const found = resolved.find((r) => r.title === entry!.content.de.title);
    expect(found?.siteUrl).toBeUndefined();
  });
});

describe("mergeReferences", () => {
  // Two committed cases with DIFFERENT destinations, mirroring the real
  // catalog: one anonymous case with a journal article, one named case with a
  // customer site and no article. A fixture where every case carries the same
  // link cannot catch a merge that restores the wrong one.
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
    {
      title: "Committed, named",
      context: "c",
      challenge: "c",
      solution: "c",
      result: "c",
      metric: "",
      siteUrl: "https://kunde.example/",
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

  it("overrides the text but keeps every code-owned link", () => {
    const merged = mergeReferences(committed, [override, { ...override, title: "Second" }]);
    expect(merged[0].title).toBe("Edited in the panel");
    expect(merged[0].articleUrl).toBe(committed[0].articleUrl);
    // The customer link has to survive a text edit too. Restoring only
    // `articleUrl` would take a named customer's site off the page the first
    // time somebody rewrote the card, with nothing to show for it.
    expect(merged[1].siteUrl).toBe(committed[1].siteUrl);
  });

  it("does not carry a destination across from a neighbouring case", () => {
    const merged = mergeReferences(committed, [override, override]);
    // Each position gets its own committed links and only those.
    expect(merged[0].siteUrl).toBeUndefined();
    expect(merged[1].articleUrl).toBeUndefined();
  });

  it("does not let the CMS invent a link", () => {
    const hostile = {
      ...override,
      articleUrl: "https://example.invalid/phish",
      siteUrl: "https://example.invalid/phish",
    };
    const merged = mergeReferences(committed, [hostile, hostile, hostile]);

    // Position 0: the committed article link wins, and the CMS cannot bolt a
    // customer site onto a case that has none — which is what publishing a
    // named reference at all makes worth asserting.
    expect(merged[0].articleUrl).toBe(committed[0].articleUrl);
    expect(merged[0].siteUrl).toBeUndefined();

    // Position 1: the committed customer link wins over the supplied one.
    expect(merged[1].siteUrl).toBe(committed[1].siteUrl);
    expect(merged[1].articleUrl).toBeUndefined();

    // Position 2 is past the committed list: an editor may add a case, never
    // a destination for it. This is the assertion that keeps its teeth as the
    // catalog grows — the earlier positions stop proving it the moment a
    // committed case exists behind them.
    expect(merged[2].articleUrl).toBeUndefined();
    expect(merged[2].siteUrl).toBeUndefined();
  });

  it("keeps editor-authored extras beyond the committed list", () => {
    const merged = mergeReferences(committed, [
      override,
      override,
      { ...override, title: "Third" },
    ]);
    expect(merged).toHaveLength(3);
    expect(merged[2].title).toBe("Third");
  });

  it("drops committed cases the editor replaced with a shorter list", () => {
    const two = [...committed, { ...override, title: "Committed 2" }];
    expect(mergeReferences(two, [override])).toHaveLength(1);
  });

  it("returns a copy, never the committed array itself", () => {
    expect(mergeReferences(committed, [])).not.toBe(committed);
  });
});
