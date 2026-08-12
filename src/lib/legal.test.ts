import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Build-time legal-document layer. The contract that matters here is stronger
 * than `cms.ts`'s: a section falling back to its baked default is invisible,
 * but an AGB that vanishes is a legal problem. So `legalDocBytes` must return
 * the committed PDF whenever the uploaded one cannot be had — including when
 * the API answers 200 with something that is not a PDF, which is exactly what
 * a misrouted request to a static host's SPA fallback looks like.
 *
 * legal.ts memoises the index at module level, so each test re-imports it
 * fresh (vi.resetModules) to isolate that cache.
 */
async function load() {
  vi.resetModules();
  return import("./legal");
}

function jsonOk(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/** Decode bytes for an assertion — Uint8Array has no encoding-aware toString. */
const text = (bytes: Uint8Array | null) => new TextDecoder().decode(bytes ?? new Uint8Array());

/** Bytes that pass the `%PDF-` sniff. */
const REAL_PDF = new TextEncoder().encode("%PDF-1.7\nuploaded\n%%EOF");

const INDEX = {
  docs: {
    agb: {
      de: { filename: "AGB.pdf", sizeBytes: 1234, versionLabel: "Stand: 09/2025", updatedAt: "2026-08-12 10:00:00" },
    },
  },
};

const isIndexCall = (url: unknown) => String(url).endsWith("/legal");

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("legalDocMeta", () => {
  it("returns the uploaded document's metadata", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonOk(INDEX)));
    const { legalDocMeta } = await load();

    expect(await legalDocMeta("agb", "de")).toMatchObject({ versionLabel: "Stand: 09/2025" });
  });

  it("returns null for a language with no upload", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonOk(INDEX)));
    const { legalDocMeta } = await load();

    expect(await legalDocMeta("agb", "en")).toBeNull();
  });

  it("returns null instead of throwing when the API is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { legalDocMeta } = await load();

    expect(await legalDocMeta("agb", "de")).toBeNull();
  });

  it("fetches the index once and reuses it", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonOk(INDEX));
    vi.stubGlobal("fetch", fetchMock);
    const { legalDocMeta } = await load();

    await legalDocMeta("agb", "de");
    await legalDocMeta("agb", "en");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("legalDocBytes", () => {
  it("serves the uploaded PDF when one exists", async () => {
    const fetchMock = vi.fn(async (url: unknown) =>
      isIndexCall(url) ? jsonOk(INDEX) : new Response(REAL_PDF, { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { legalDocBytes } = await load();

    const bytes = await legalDocBytes("agb", "de");
    expect(text(bytes)).toContain("uploaded");
    // The language rides on the query string — the DE and EN documents are
    // separate uploads, not translations of one another.
    expect(String(fetchMock.mock.calls.at(-1)![0])).toContain("lang=de");
  });

  it("falls back to the committed PDF when nothing is uploaded", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonOk({ docs: {} })));
    const { legalDocBytes } = await load();

    const bytes = await legalDocBytes("agb", "de");
    // The repository copy, not an empty response.
    expect(bytes).not.toBeNull();
    expect(text(bytes).startsWith("%PDF-")).toBe(true);
  });

  it("falls back when the API is unreachable entirely", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { legalDocBytes } = await load();

    expect(text(await legalDocBytes("agb", "de")).startsWith("%PDF-")).toBe(true);
  });

  it("falls back when a 200 response is NOT a PDF", async () => {
    // The failure mode this guards: a proxy or SPA fallback answering the
    // document URL with HTML and a 200. Writing that into dist/ would ship an
    // error page as the AGB, and nothing downstream would notice.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: unknown) =>
        isIndexCall(url) ? jsonOk(INDEX) : new Response("<!doctype html><title>Oops</title>", { status: 200 }),
      ),
    );
    const { legalDocBytes } = await load();

    const bytes = await legalDocBytes("agb", "de");
    expect(text(bytes).startsWith("%PDF-")).toBe(true);
    expect(text(bytes)).not.toContain("doctype");
    expect(warn).toHaveBeenCalled();
  });

  it("falls back when the document endpoint 404s", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: unknown) => (isIndexCall(url) ? jsonOk(INDEX) : new Response("", { status: 404 }))),
    );
    const { legalDocBytes } = await load();

    expect(text(await legalDocBytes("agb", "de")).startsWith("%PDF-")).toBe(true);
  });

  it("returns null for a document key with no committed fallback", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonOk({ docs: {} })));
    const { legalDocBytes } = await load();

    expect(await legalDocBytes("widerruf", "de")).toBeNull();
  });
});

describe("legalCopy", () => {
  it("carries both languages with the same keys", async () => {
    const { legalCopy } = await load();
    expect(Object.keys(legalCopy.de).sort()).toEqual(Object.keys(legalCopy.en).sort());
  });
});
