import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sectionLinks } from "./navigation";
import { SITEMAP_ENTRIES } from "./sitemap";

/**
 * The addresses people type, print and bookmark — and where they land.
 *
 * `/kontakt` answered with a 404 until 2026-09; `/en/preise` landed on `/en#…`,
 * a second spelling of the English home page. These are one-line route files,
 * which is exactly why a test holds them: nothing about a wrong redirect target
 * is visible until somebody follows it.
 */
const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const REDIRECTS: Array<[file: string, target: string]> = [
  ["src/pages/preise.astro", "/#preise"],
  ["src/pages/en/preise.astro", "/en/#preise"],
  ["src/pages/en/pricing.astro", "/en/#preise"],
  ["src/pages/kontakt.astro", "/#contact"],
  ["src/pages/en/contact.astro", "/en/#contact"],
];

describe("addresses that answer with a redirect instead of a 404", () => {
  it.each(REDIRECTS)("%s → %s, permanently", (file, target) => {
    const source = read(file);
    const match = source.match(/Astro\.redirect\("([^"]+)",\s*(\d{3})\)/);
    expect(match?.[1]).toBe(target);
    expect(match?.[2]).toBe("301");
    // On demand: a prerendered redirect would be baked into a static file.
    expect(source).toMatch(/export const prerender = false/);
  });

  it("keeps redirects out of the sitemap", () => {
    // A redirect listed there is a crawl error, not a hint.
    const listed = SITEMAP_ENTRIES.flatMap((entry) => [entry.de, entry.en]);
    for (const path of ["/preise", "/en/preise", "/en/pricing", "/kontakt", "/en/contact"]) {
      expect(listed).not.toContain(path);
    }
  });

  it("points at anchors the home page actually has", () => {
    const pricing = read("src/components/sections/Pricing.astro");
    expect(pricing).toMatch(/<section id="preise"/);
    // Old deep links keep landing on the prices.
    expect(pricing).toMatch(/id="pricing-teaser"/);
    expect(read("src/components/sections/Contact.astro")).toMatch(/id="contact"/);
  });
});

describe("the section navigation", () => {
  const sections = [
    "src/components/sections/Services.astro",
    "src/components/sections/CustomerCases.astro",
    "src/components/sections/Process.astro",
    "src/components/sections/Pricing.astro",
  ]
    .map(read)
    .join("\n");

  it.each(["de", "en"] as const)("links only to sections that exist (%s)", (lang) => {
    for (const link of sectionLinks(lang)) {
      expect(sections, `#${link.id}`).toMatch(new RegExp(`id="${link.id}"`));
    }
  });

  it("renders every home section the navigation names", () => {
    const home = read("src/components/HomePage.astro");
    for (const component of ["Services", "CustomerCases", "Process", "Pricing", "FAQ", "Contact"]) {
      expect(home).toMatch(new RegExp(`<${component} />`));
    }
  });
});
