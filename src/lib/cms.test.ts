import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Build-time CMS layer for the landingpage content editor. The contract:
 * a failed/partial fetch must never blank a section — cmsFor falls back to
 * the baked default unless the API block is present AND shape-compatible.
 * fetchBlocks memoises per language so all sections share one request.
 *
 * cms.ts keeps a module-level cache, so each test re-imports the module
 * fresh (vi.resetModules) to isolate that cache.
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

  it("returns the API block when present and shape-compatible", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonOk({ blocks: { hero: { headline: "Edited", body: "Edited body" } } })),
    );
    const { cmsFor } = await load();

    const out = await cmsFor("hero", "de", fallback);
    expect(out.headline).toBe("Edited");
  });

  it("falls back to the default when the section is absent", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonOk({ blocks: {} })));
    const { cmsFor } = await load();

    expect(await cmsFor("hero", "de", fallback)).toBe(fallback);
  });

  it("falls back when the API block is missing a fallback key (partial/malformed)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonOk({ blocks: { hero: { headline: "only headline" } } })),
    );
    const { cmsFor } = await load();

    // body key missing → shape guard rejects → baked default wins.
    expect(await cmsFor("hero", "de", fallback)).toBe(fallback);
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
