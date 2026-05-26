/**
 * Smoke test for the default OG image renderer.
 *
 * Calls renderDefaultOgPng and writes the result next to this script
 * so a human can eyeball it. Exits non-zero on render failure
 * (CI-friendly). Mirrors the og:smoke convention from tds-blog.
 *
 * Run: `npm run og:smoke`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderDefaultOgPng } from "../src/og/render.ts";

const outDir = fileURLToPath(new URL(".", import.meta.url));
const png = await renderDefaultOgPng();
const file = path.join(outDir, "og-smoke.png");
fs.writeFileSync(file, png);
// eslint-disable-next-line no-console
console.log(`✓ rendered ${file} (${(png.length / 1024).toFixed(1)} KB)`);
