import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getPricingDefault, getServiceRate } from "./pricing";
import { platformDefinitions } from "./platforms";
import { serviceDefinitions } from "./services";
import { SITEMAP_ENTRIES, absolute } from "./sitemap";

/**
 * `public/llms.txt` is a hand-written summary for language models, and it had
 * drifted without anyone noticing: until 2026-09-15 it quoted 90/80/80/65 €
 * while the price list said 75/70/70/65 €, listed the services in an old order
 * and knew none of the platform pages. Only crawlers read it, so only a test
 * can keep it tied to the sources it summarises.
 *
 * Its value is small — Google ignores it and few AI crawlers fetch it — but a
 * file that states wrong prices is worse than none.
 */
const llms = readFileSync(resolve(process.cwd(), "public/llms.txt"), "utf8");

describe("llms.txt", () => {
  it("names every page of the sitemap, in both languages", () => {
    for (const entry of SITEMAP_ENTRIES) {
      expect(llms, entry.de).toContain(absolute(entry.de));
      expect(llms, entry.en).toContain(absolute(entry.en));
    }
  });

  it("quotes each service with its current rate, in the catalogue's order", () => {
    const pricing = getPricingDefault("de");
    let previous = -1;
    for (const service of serviceDefinitions) {
      const line = `**${service.fallback.de.title}** (${getServiceRate(pricing, service.id)} € netto/Std.)`;
      const at = llms.indexOf(line);
      expect(at, line).toBeGreaterThan(previous);
      previous = at;
    }
  });

  it("states no amount the price list does not have", () => {
    const pricing = getPricingDefault("de");
    const rates = new Set(serviceDefinitions.map((service) => getServiceRate(pricing, service.id)));
    for (const match of llms.matchAll(/(\d+)\s*€/g)) {
      expect(rates.has(Number(match[1])), match[0]).toBe(true);
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
  });
});
