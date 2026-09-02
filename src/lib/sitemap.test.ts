import { afterEach, describe, expect, it, vi } from "vitest";

import {
  SITEMAP_ENTRIES,
  absolute,
  hreflangGroup,
  renderSitemapIndex,
  renderUrlset,
  type SitemapEntry,
} from "./sitemap";
import { serviceDefinitions, serviceHref } from "./services";

/**
 * The sitemap document and the route inventory behind it.
 *
 * `AGENTS.md` has asked for this file since the route list moved here ("add
 * both locale paths together and cover them in sitemap tests"); it did not
 * exist. The failure it guards against is the one this codebase keeps meeting —
 * a well-formed file that is quietly wrong, with nothing red anywhere.
 */

const LAST = "2026-09-02";

function locs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function alternates(xml: string): string[] {
  return [...xml.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => `${m[1]} ${m[2]}`);
}

const entry: SitemapEntry = {
  de: "/preise",
  en: "/en/preise",
  changefreq: "monthly",
  priority: 0.8,
};

describe("SITEMAP_ENTRIES", () => {
  it("lists both locale paths for every entry", () => {
    // The invariant the file's own docblock states: an entry may only be added
    // when BOTH trees really serve it, because the alternates are emitted from
    // each side and a page listed without its twin points hreflang at a 404.
    for (const e of SITEMAP_ENTRIES) {
      expect(e.de.startsWith("/"), `${e.de} is not absolute`).toBe(true);
      expect(e.en.startsWith("/en"), `${e.en} is not in the English tree`).toBe(true);
    }
  });

  it("covers the home page, pricing and every service", () => {
    const de = SITEMAP_ENTRIES.map((e) => e.de);
    expect(de).toContain("/");
    expect(de).toContain("/preise");
    for (const service of serviceDefinitions) {
      expect(de).toContain(serviceHref(service, "de"));
    }
  });

  it("keeps the legal pages, /install and the error pages out", () => {
    const all = SITEMAP_ENTRIES.flatMap((e) => [e.de, e.en]);
    for (const path of ["/install", "/legal/impressum", "/legal/datenschutz", "/404", "/500"]) {
      expect(all).not.toContain(path);
    }
  });

  it("has no duplicate URLs", () => {
    const all = SITEMAP_ENTRIES.flatMap((e) => [e.de, e.en]);
    expect(new Set(all).size).toBe(all.length);
  });
});

describe("hreflangGroup", () => {
  it("pairs a service page across the two trees", () => {
    // `/leistungen/<slug.de>` ↔ `/en/services/<slug.en>` — a different segment
    // AND a different slug, so no prefix rule could derive one from the other.
    const service = serviceDefinitions[0];
    const de = serviceHref(service, "de");
    const en = serviceHref(service, "en");
    expect(hreflangGroup(de)).toEqual([de, en]);
    expect(hreflangGroup(en)).toEqual([de, en]);
  });

  it("pairs the two home pages", () => {
    expect(hreflangGroup("/")).toEqual(["/", "/en/"]);
    expect(hreflangGroup("/en/")).toEqual(["/", "/en/"]);
  });

  it("treats a path outside the inventory as its own group", () => {
    // A legal page has no twin in the sitemap to strand.
    expect(hreflangGroup("/legal/impressum")).toEqual(["/legal/impressum"]);
  });
});

describe("renderUrlset", () => {
  it("emits both languages for each entry", () => {
    expect(locs(renderUrlset([entry], LAST))).toEqual([
      absolute("/preise"),
      absolute("/en/preise"),
    ]);
  });

  it("gives both sides the SAME reciprocal alternate block", () => {
    // Search Console treats a set as valid only when the two URLs name each
    // other. Both blocks are compared, not merely counted.
    const expected = [
      `de-DE ${absolute("/preise")}`,
      `en-GB ${absolute("/en/preise")}`,
      `x-default ${absolute("/preise")}`,
    ];
    expect(alternates(renderUrlset([entry], LAST))).toEqual([...expected, ...expected]);
  });

  it("declares the xhtml namespace the alternates need", () => {
    // Without it they are unnamespaced elements every consumer ignores, and
    // the file still validates.
    expect(renderUrlset([entry], LAST)).toContain(
      'xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    );
  });

  it("writes priority with one decimal and the given lastmod", () => {
    const xml = renderUrlset([{ ...entry, priority: 1 }], LAST);
    expect(xml).toContain("<priority>1.0</priority>");
    expect(xml).toContain(`<lastmod>${LAST}</lastmod>`);
  });

  it("escapes XML metacharacters", () => {
    // One unescaped `&` makes the document unparseable, which a crawler
    // reports as "could not read", not "page missing".
    expect(renderUrlset([{ ...entry, de: "/a&b" }], LAST)).toContain("&amp;");
  });

  it("produces an empty urlset rather than malformed XML for no entries", () => {
    const xml = renderUrlset([], LAST);
    expect(xml).toContain("<urlset");
    expect(xml).toContain("</urlset>");
    expect(locs(xml)).toEqual([]);
  });
});

describe("renderSitemapIndex", () => {
  it("names the file robots.txt advertises", () => {
    // Changing the entry point would silently orphan the one Search Console
    // has registered.
    expect(renderSitemapIndex(LAST)).toContain(`<loc>${absolute("/sitemap-0.xml")}</loc>`);
  });
});

describe("sitemapEntries", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  async function entriesWith(patterns: string[]): Promise<SitemapEntry[]> {
    vi.resetModules();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ paths: patterns }), { status: 200 })),
    );
    const mod = await import("./sitemap");
    return mod.sitemapEntries();
  }

  it("returns the whole inventory when nothing is excluded", async () => {
    expect(await entriesWith([])).toEqual(SITEMAP_ENTRIES);
  });

  it("drops an entry named by its German path", async () => {
    const paths = (await entriesWith(["/preise"])).map((e) => e.de);
    expect(paths).not.toContain("/preise");
    expect(paths).toContain("/");
  });

  it("drops the PAIR when only the English URL is named", async () => {
    // The load-bearing case: every URL here carries reciprocal alternates, so
    // a half-removed pair leaves the survivor naming a page that is gone.
    const entries = await entriesWith(["/en/preise"]);
    expect(entries.map((e) => e.de)).not.toContain("/preise");
    expect(entries.map((e) => e.en)).not.toContain("/en/preise");
  });

  it("honours a prefix pattern across the service pages", async () => {
    const entries = await entriesWith(["/leistungen/*"]);
    expect(entries.some((e) => e.de.startsWith("/leistungen/"))).toBe(false);
    // Their English twins go with them, though `/en/services/…` shares no
    // prefix with the pattern — the pair is what is matched.
    expect(entries.some((e) => e.en.startsWith("/en/services/"))).toBe(false);
    expect(entries.map((e) => e.de)).toContain("/");
  });

  it("leaves SITEMAP_ENTRIES itself untouched", async () => {
    // `cache.ts` derives `alwaysPaths` from it, and a rebuild must still be
    // able to render a page the panel has merely hidden from search.
    const before = SITEMAP_ENTRIES.length;
    await entriesWith(["/preise"]);
    expect(SITEMAP_ENTRIES.length).toBe(before);
  });
});
