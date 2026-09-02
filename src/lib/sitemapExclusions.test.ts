import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { groupExcluded, matchesPattern } from "./sitemapExclusions";

/**
 * The comparison this site performs against the list the panel maintains.
 *
 * It has to agree, rule for rule, with `SitemapExclusions::matches()` in
 * `tds-core-frontend-api` — the API validates what an operator may type, so a
 * looser matcher here would accept a pattern the panel rejects, and a stricter
 * one would silently ignore a pattern it accepted. Either way the only symptom
 * is a page that stayed indexed when somebody asked for it to go.
 */
describe("matchesPattern", () => {
  it("matches an exact path either way around the trailing slash", () => {
    expect(matchesPattern("/preise", "/preise")).toBe(true);
    expect(matchesPattern("/preise/", "/preise")).toBe(true);
    expect(matchesPattern("/preise", "/preise/")).toBe(true);
  });

  it("does not match a longer path that merely starts the same", () => {
    expect(matchesPattern("/preise-2026", "/preise")).toBe(false);
  });

  it("treats a trailing star as a prefix", () => {
    expect(matchesPattern("/leistungen/beratung", "/leistungen/*")).toBe(true);
    expect(matchesPattern("/leistungen", "/leistungen/*")).toBe(false);
  });

  it("is a raw prefix when the star follows a segment directly", () => {
    expect(matchesPattern("/leistungen", "/leistungen*")).toBe(true);
  });

  it("is case-sensitive, because URL paths are", () => {
    expect(matchesPattern("/Preise", "/preise")).toBe(false);
  });

  it("ignores an empty pattern instead of matching everything", () => {
    // The difference between "no exclusions" and "exclude the whole site".
    expect(matchesPattern("/preise", "")).toBe(false);
    expect(matchesPattern("/preise", "   ")).toBe(false);
  });
});

describe("groupExcluded", () => {
  it("is true when any member of the group is named", () => {
    expect(groupExcluded(["/preise", "/en/preise"], ["/en/preise"])).toBe(true);
    expect(groupExcluded(["/preise", "/en/preise"], ["/preise"])).toBe(true);
  });

  it("is false when nothing names the group", () => {
    expect(groupExcluded(["/preise", "/en/preise"], ["/kontakt"])).toBe(false);
    expect(groupExcluded(["/preise", "/en/preise"], [])).toBe(false);
  });
});

/**
 * The fetch is fail-soft in ONE direction on purpose: unreachable means
 * "nothing excluded". The opposite default would empty the sitemap on a hiccup,
 * and because the API's own route is fail-soft too, neither end would go red.
 * Same direction as `cmsFor()` — a database that cannot be read leaves a page
 * stale, never blank.
 */
describe("exclusionPatterns", () => {
  const original = globalThis.fetch;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    globalThis.fetch = original;
  });

  async function patternsWith(fetchImpl: typeof globalThis.fetch): Promise<string[]> {
    globalThis.fetch = fetchImpl;
    const mod = await import("./sitemapExclusions");
    return mod.exclusionPatterns();
  }

  it("reads the list the API returns", async () => {
    const patterns = await patternsWith((async () =>
      new Response(JSON.stringify({ site: "landingpage", paths: ["/preise"] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as typeof globalThis.fetch);
    expect(patterns).toEqual(["/preise"]);
  });

  it("asks for THIS site by name", async () => {
    let seen = "";
    await patternsWith((async (input: RequestInfo | URL) => {
      seen = String(input);
      return new Response(JSON.stringify({ paths: [] }), { status: 200 });
    }) as typeof globalThis.fetch);
    // Without it the API can only answer from a verified key, and with
    // `enforcement = off` there is none.
    expect(seen).toContain("site=landingpage");
    expect(seen).toContain("/sitemap-exclusions");
  });

  it("excludes nothing when the API is unreachable", async () => {
    const patterns = await patternsWith((() =>
      Promise.reject(new Error("ECONNREFUSED"))) as typeof globalThis.fetch);
    expect(patterns).toEqual([]);
  });

  it("excludes nothing on a non-OK response", async () => {
    const patterns = await patternsWith((async () =>
      new Response("nope", { status: 500 })) as typeof globalThis.fetch);
    expect(patterns).toEqual([]);
  });

  it("excludes nothing when the payload is the wrong shape", async () => {
    const patterns = await patternsWith((async () =>
      new Response(JSON.stringify({ paths: "everything" }), {
        status: 200,
      })) as typeof globalThis.fetch);
    expect(patterns).toEqual([]);
  });

  it("drops blank entries rather than treating them as a match-all", async () => {
    const patterns = await patternsWith((async () =>
      new Response(JSON.stringify({ paths: ["", "  ", "/keep", 7] }), {
        status: 200,
      })) as typeof globalThis.fetch);
    expect(patterns).toEqual(["/keep"]);
  });
});
