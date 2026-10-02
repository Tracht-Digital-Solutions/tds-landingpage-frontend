import { afterEach, describe, expect, it, vi } from "vitest";

import { contentCache, memoisedOr } from "./contentCache";

afterEach(() => contentCache.invalidate());

describe("memoisedOr", () => {
  it("answers the fallback on a failure WITHOUT remembering it", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const load = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("HTTP 503"))
      .mockResolvedValueOnce("fresh");

    expect(await memoisedOr("k", load, "fallback", "test")).toBe("fallback");
    // The next render asks again instead of reading the failure from the memo.
    expect(await memoisedOr("k", load, "fallback", "test")).toBe("fresh");
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("remembers a success for the generation", async () => {
    const load = vi.fn(async () => "value");
    await memoisedOr("k", load, "fallback", "test");
    await memoisedOr("k", load, "fallback", "test");
    expect(load).toHaveBeenCalledTimes(1);
  });
});
