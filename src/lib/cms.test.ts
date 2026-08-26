import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Server-rendered CMS layer for the landingpage content editor. The contract:
 * a failed/partial fetch must never blank a section — cmsFor validates the
 * fields it can use and merges them over the baked default.
 * fetchBlocks memoises per language so all sections share one request.
 *
 * cms.ts uses the shared generation cache, so each test re-imports the module
 * fresh (`vi.resetModules`) to isolate the cache instance.
 */
async function load() {
  vi.resetModules();
  return import("./cms");
}

function jsonOk(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("cmsFor", () => {
  const fallback = { headline: "Default", body: "Default body" };

  it("returns all valid API fields when a complete block is present", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonOk({ blocks: { hero: { headline: "Edited", body: "Edited body" } } })),
    );
    const { cmsFor } = await load();

    const out = await cmsFor("hero", "de", fallback);
    expect(out).toEqual({ headline: "Edited", body: "Edited body" });
  });

  it("falls back to the default when the section is absent", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonOk({ blocks: {} })));
    const { cmsFor } = await load();

    expect(await cmsFor("hero", "de", fallback)).toBe(fallback);
  });

  it("merges a partial first block over the local defaults", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonOk({ blocks: { hero: { headline: "only headline" } } })),
    );
    const { cmsFor } = await load();

    // A newly connected site starts this editor form from `{}`. Touching one
    // field therefore persists only that field; the untouched copy must still
    // come from the local fallback.
    expect(await cmsFor("hero", "de", fallback)).toEqual({
      headline: "only headline",
      body: "Default body",
    });
  });

  it("keeps the fallback object when the saved block is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonOk({ blocks: { hero: {} } })),
    );
    const { cmsFor } = await load();

    expect(await cmsFor("hero", "de", fallback)).toBe(fallback);
  });

  it("uses valid siblings while rejecting wrong, empty and unknown fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonOk({
          blocks: {
            hero: {
              headline: 42,
              body: "Edited body",
              unused: "must not leak into the render shape",
            },
          },
        }),
      ),
    );
    const { cmsFor } = await load();

    expect(await cmsFor("hero", "de", fallback)).toEqual({
      headline: "Default",
      body: "Edited body",
    });
  });

  it("does not let blank values erase baked copy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonOk({ blocks: { hero: { headline: "   ", body: "" } } }),
      ),
    );
    const { cmsFor } = await load();

    expect(await cmsFor("hero", "de", fallback)).toBe(fallback);
  });

  it("validates nested list items and preserves their missing defaults", async () => {
    const listFallback = {
      headline: "Default",
      items: [
        { title: "First", description: "First body", tags: ["one"] },
        { title: "Second", description: "Second body", tags: ["two"] },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonOk({
          blocks: {
            services: {
              items: [
                { title: "Edited first" },
                { title: 99, description: "Edited second body" },
              ],
            },
          },
        }),
      ),
    );
    const { cmsFor } = await load();

    expect(await cmsFor("services", "de", listFallback)).toEqual({
      headline: "Default",
      items: [
        { title: "Edited first", description: "First body", tags: ["one"] },
        { title: "Second", description: "Edited second body", tags: ["two"] },
      ],
    });
  });

  it("rejects a newly appended list item with an invalid required value", async () => {
    const listFallback = {
      items: [
        {
          title: "Consulting",
          rate: 120,
          includes: ["Workshop"],
          highlight: false,
        },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonOk({
          blocks: {
            pricing: {
              items: [
                {
                  title: "Edited consulting",
                  rate: 125,
                  includes: ["Review"],
                  highlight: false,
                },
                {
                  title: "Broken package",
                  rate: "not-a-number",
                  includes: [],
                  highlight: false,
                },
              ],
            },
          },
        }),
      ),
    );
    const { cmsFor } = await load();

    // There is no baked second item whose rate could be used as a fallback.
    // Publishing an invented zero price would be worse than keeping the
    // complete committed list at this list boundary.
    expect(await cmsFor("pricing", "de", listFallback)).toBe(listFallback);
  });

  it("accepts a complete appended item without copying the template's list content", async () => {
    const listFallback = {
      items: [
        {
          number: "01",
          title: "Default service",
          description: "Default body",
          tags: ["Default tag"],
        },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonOk({
          blocks: {
            services: {
              items: [
                {
                  number: "01",
                  title: "Edited service",
                  description: "Edited body",
                },
                {
                  number: "02",
                  title: "New service",
                  description: "New body",
                },
              ],
            },
          },
        }),
      ),
    );
    const { cmsFor } = await load();

    expect(await cmsFor("services", "de", listFallback)).toEqual({
      items: [
        {
          number: "01",
          title: "Edited service",
          description: "Edited body",
          tags: ["Default tag"],
        },
        {
          number: "02",
          title: "New service",
          description: "New body",
          tags: [],
        },
      ],
    });
  });

  it("keeps a list default when the override list is empty", async () => {
    const listFallback = { items: [{ title: "Default item" }] };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonOk({ blocks: { services: { items: [] } } })),
    );
    const { cmsFor } = await load();

    expect(await cmsFor("services", "de", listFallback)).toBe(listFallback);
  });
});

describe("fetchBlocks", () => {
  it("returns {} on a non-OK response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 503 })));
    const { fetchBlocks } = await load();

    expect(await fetchBlocks("de")).toEqual({});
  });

  it("returns {} when fetch throws (build stays green)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ENOTFOUND")));
    const { fetchBlocks } = await load();

    expect(await fetchBlocks("de")).toEqual({});
  });

  it("memoises so multiple sections share one request per language", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonOk({ blocks: { hero: {} } }));
    vi.stubGlobal("fetch", fetchMock);
    const { fetchBlocks } = await load();

    await fetchBlocks("de");
    await fetchBlocks("de");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
