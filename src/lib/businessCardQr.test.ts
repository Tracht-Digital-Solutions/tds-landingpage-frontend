import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Who may import the QR encoder.
 *
 * `businessCardQr.ts` imports `qrcode` at module scope. `qrcode` is a
 * devDependency and is NOT in the release tree, so any module that reaches
 * into it drags a bare `import "qrcode";` into the server bundle and answers
 * with a 500 on the host — which is exactly how both business-card pages went
 * down. The rule is therefore narrow: only the two prerendered endpoints may
 * import it, because a prerendered route runs during `astro build` and never
 * enters the server bundle.
 *
 * `scripts/pack-release.mjs` catches the same mistake at build time and is the
 * real guard. This suite states the rule where someone would break it — in the
 * source, next to the module — and it fails in a second rather than after a
 * full build.
 */
const root = process.cwd();
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

/** Every file under src/, so a new importer cannot appear unnoticed. */
function* sourceFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(resolve(root, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) yield* sourceFiles(rel);
    else if (/\.(ts|tsx|astro)$/.test(entry.name)) yield rel;
  }
}

const ALLOWED_IMPORTERS = [
  "src/pages/visitenkarte-qr.svg.ts",
  "src/pages/en/business-card-qr.svg.ts",
];

describe("the QR encoder stays out of the server bundle", () => {
  it("is imported only by the prerendered endpoints", () => {
    const importers = [...sourceFiles("src")]
      .filter((rel) => rel !== "src/lib/businessCardQr.ts" && rel !== "src/lib/businessCardQr.test.ts")
      .filter((rel) => /from\s+["'][^"']*businessCardQr["']/.test(read(rel)));

    expect(importers.sort()).toEqual([...ALLOWED_IMPORTERS].sort());
  });

  it("keeps every one of those endpoints prerendered", () => {
    for (const rel of ALLOWED_IMPORTERS) {
      expect(read(rel), rel).toMatch(/export const prerender = true/);
    }
  });

  it("keeps the path constants in the module that has no encoder", () => {
    // The page needs the URL, not the drawing. Splitting the two is what stops
    // a string lookup from pulling `qrcode` in behind it.
    expect(read("src/lib/businessCard.ts")).toContain("BUSINESS_CARD_QR_PATH");
    // An import STATEMENT, not the word: the doc comment right above the
    // constant names the package on purpose, and a substring check would fail
    // on the explanation of the very rule it is testing.
    expect(read("src/lib/businessCard.ts")).not.toMatch(
      /^\s*import\s[^\n]*["']qrcode["']/m,
    );
    expect(read("src/components/BusinessCardPage.astro")).not.toMatch(
      /^\s*import\s[^\n]*businessCardQr/m,
    );
  });
});
