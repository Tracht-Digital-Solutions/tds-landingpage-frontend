import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderLlmsTxt } from "./llmsTxt";
import { getDefaultPackages } from "./pricing";
import { platformDefinitions } from "./platforms";
import { serviceDefinitions } from "./services";
import { SITEMAP_ENTRIES, absolute } from "./sitemap";

/**
 * `/llms.txt` is a summary for language models, and it had drifted without
 * anyone noticing: until 2026-09-15 it quoted 90/80/80/65 € while the price
 * list said 75/70/70/65 €, listed the services in an old order and knew none
 * of the platform pages. Only crawlers read it, so only a test could keep it
 * tied to the sources it summarises.
 *
 * Since 2026-10-02 it is generated from those sources instead of being written
 * by hand (`src/lib/llmsTxt.ts`), so the assertions below check a renderer
 * rather than a file. They are the same assertions: its value is small — Google
 * ignores it and few AI crawlers fetch it — but a file that states wrong prices
 * is worse than none.
 */
const packages = getDefaultPackages("de");

// No `serviceContent`: the renderer then uses each service's committed copy,
// which is what the assertions below read. The endpoint passes the
// CMS-resolved copy instead, so the file says what the page says.
const llms = renderLlmsTxt({ entries: SITEMAP_ENTRIES, packages });

describe("llms.txt", () => {
  it("names every page of the sitemap, in both languages", () => {
    for (const entry of SITEMAP_ENTRIES) {
      expect(llms, entry.de).toContain(absolute(entry.de));
      expect(llms, entry.en).toContain(absolute(entry.en));
    }
  });

  it("lists every service in the catalogue's order, without an hourly rate", () => {
    let previous = -1;
    for (const service of serviceDefinitions) {
      const line = `**${service.fallback.de.title}** (`;
      const at = llms.indexOf(line);
      expect(at, line).toBeGreaterThan(previous);
      previous = at;
    }
    // No hourly rates since 2026-09-22.
    expect(llms).not.toMatch(/Std\.|Stundensatz|pro Stunde/);
  });

  it("states no amount the price list does not have", () => {
    const prices = new Set(packages.map((pkg) => pkg.price));
    for (const match of llms.matchAll(/(\d[\d.]*)\s*€/g)) {
      expect(prices.has(Number(match[1]!.replaceAll(".", ""))), match[0]).toBe(true);
    }
  });

  it("names every shop system and CMS page", () => {
    for (const platform of platformDefinitions) {
      expect(llms, platform.id).toContain(`**${platform.name}**`);
    }
  });

  it("keeps the site's copy rules", () => {
    expect(llms).not.toMatch(/kostenlos|kostenfrei|gratis|Minute/i);
    expect(llms).not.toMatch(/\d+\s*[–-]\s*\d+\s*€/);
    // "echt" and "wirklich" never appear on the site (decided 2026-09-21).
    expect(llms).not.toMatch(/\b(echt|wirklich)[a-zäöüß]*/i);
  });

  it("stays one small file", () => {
    // The budget the audit enforces against the live endpoint. AGENTS.md:
    // keep it true, do not grow it.
    expect(Buffer.byteLength(llms, "utf8")).toBeLessThanOrEqual(8 * 1024);
    expect(llms).not.toMatch(/llms-full/);
  });

  it("has no static copy left to shadow the route", () => {
    // A file in `public/` wins over a route of the same path, so a leftover
    // `public/llms.txt` would silently serve instead of the endpoint — the
    // generated file would never reach a crawler and nothing would say so.
    expect(existsSync(resolve(process.cwd(), "public/llms.txt"))).toBe(false);
  });

  it("names a page that was added to the inventory without a label", () => {
    // The fallback that keeps the sitemap-coverage contract above from being
    // broken by forgetting to describe a new page.
    const rendered = renderLlmsTxt({
      entries: [...SITEMAP_ENTRIES, { de: "/neue-seite", en: "/en/new-page", changefreq: "monthly", priority: 0.5 }],
      packages,
    });
    expect(rendered).toContain(absolute("/neue-seite"));
    expect(rendered).toContain(absolute("/en/new-page"));
  });
});
