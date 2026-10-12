import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PLACE_CENTER, PLACE_EDGE, distanceMeters } from "./placeMap";

const source = readFileSync(resolve(process.cwd(), "src/lib/placeMap.ts"), "utf8");

describe("the live place map", () => {
  it("loads Leaflet's CSS as a string, never as a dynamically imported stylesheet", () => {
    // With `inlineStylesheets: "always"` the CSS chunk of a dynamic import is
    // never emitted, but Vite still preloads it: a 404 that rejects the import
    // and leaves the bubble on the drawn map (fixed 2026-10-12).
    expect(source).toContain('import("leaflet/dist/leaflet.css?inline")');
    expect(source).not.toMatch(/import\(\s*["']leaflet\/dist\/leaflet\.css["']\s*\)/);
  });

  it("reaches Bergedorf from Schwarzenbek (~18 km)", () => {
    const metres = distanceMeters(PLACE_CENTER, PLACE_EDGE);
    expect(metres).toBeGreaterThan(17000);
    expect(metres).toBeLessThan(19500);
  });
});
