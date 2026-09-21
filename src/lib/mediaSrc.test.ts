import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { mediaSrc } from "./mediaSrc";
import { srcsetFor } from "./imageVariants";

/**
 * Screenshots keep their names across the sync scripts and browsers keep them
 * for a week, so a new capture only shows on reload if its URL changes too.
 */
describe("mediaSrc", () => {
  it("versions every committed demo screenshot by its bytes", () => {
    const demos = readdirSync(join(__dirname, "..", "..", "public", "demos")).filter((f) => f.endsWith(".webp"));
    expect(demos.length).toBeGreaterThan(0);
    for (const file of demos) {
      expect(mediaSrc(`/demos/${file}`), file).toMatch(/\?v=[0-9a-f]{10}$/);
    }
  });

  it("leaves an unknown path alone", () => {
    expect(mediaSrc("/nope.webp")).toBe("/nope.webp");
  });

  it("versions every srcset candidate, not only the src", () => {
    const set = srcsetFor("/demos/demo1.webp", [480, 960], 1440, mediaSrc);
    for (const candidate of set.split(", ")) expect(candidate).toMatch(/\?v=[0-9a-f]{10} \d+w$/);
  });
});
