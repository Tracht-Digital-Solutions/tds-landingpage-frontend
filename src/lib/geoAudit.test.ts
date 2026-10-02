import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * `scripts/geo-audit.mjs` is the same file in all four public repos; only its
 * `PROFILE` block differs. Nothing else keeps the copies in step, and the one
 * failure that matters is silent: a site that quietly audits less than its
 * siblings still reports "No hard failures".
 *
 * So this test reads the script as TEXT and pulls the `CHECK_IDS` array out
 * with a regex. It never imports or executes it — the script fetches a site on
 * the first line and calls `process.exit`, neither of which belongs in a test
 * run. Byte-parity across 400 lines would be brittle; the list of checks is
 * the part that has to agree.
 *
 * This repo is where the script is maintained, so the contract list lives here
 * and the other three compare their own copy against this file.
 */
const script = readFileSync(resolve(process.cwd(), "scripts/geo-audit.mjs"), "utf8");

/** The checks every one of the four sites has to run. */
const UNIVERSAL = [
  "robots.agents",
  "robots.disallow",
  "robots.sitemap",
  "sitemap.index",
  "sitemap.pages",
  "page.status",
  "page.noindex",
  "page.lang",
  "title.present",
  "title.length",
  "title.distinct",
  "description.present",
  "description.length",
  "description.distinct",
  "heading.single-h1",
  "heading.levels",
  "canonical.self",
  "hreflang.present",
  "hreflang.reciprocal",
  "og.title-description",
  "og.image",
  "og.image-answers",
  "jsonld.parses",
  "jsonld.required-types",
  "jsonld.forbidden-types",
  "jsonld.id-unique",
  "jsonld.id-resolves",
  "jsonld.date-visible",
  "img.alt",
  "link.internal-resolves",
  "text.banned-words",
  "text.word-count",
  "llms.status",
  "llms.type",
  "llms.budget",
  "llms.covers-sitemap",
] as const;

/**
 * The array literal, read without evaluating the module. Matches both a
 * top-level `const NAME = [...]` and a `NAME: [...]` key inside `PROFILE`.
 */
function arrayLiteral(name: string): string[] {
  // None of these arrays nests a bracket, so "up to the next ]" is exact and
  // works for the one-line and the multi-line form alike.
  const match = script.match(new RegExp(`(?:const ${name} = |\\b${name}: )\\[([^\\]]*)\\]`));
  if (!match) throw new Error(`${name} not found in scripts/geo-audit.mjs`);
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

describe("geo-audit check list", () => {
  const ids = arrayLiteral("CHECK_IDS");

  it.each(UNIVERSAL)("runs %s", (id) => {
    expect(ids).toContain(id);
  });

  it("lists each check once", () => {
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps the site-specific checks out of the universal list", () => {
    // The lead/byline/source checks only make sense where a detail page
    // promises them; they belong to PROFILE, not to the shared contract.
    for (const id of arrayLiteral("extraCheckIds")) {
      expect(ids, id).not.toContain(id);
    }
  });
});

describe("geo-audit profile", () => {
  it("names the answer agents robots.txt is tested against", () => {
    // Both files carry the list; a name added to one and not the other means
    // the audit passes a robots.txt the contract test would reject.
    const robots = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");
    for (const agent of arrayLiteral("agents")) {
      if (agent === "*") continue;
      expect(robots, agent).toMatch(new RegExp(`^User-agent: ${agent}$`, "mi"));
    }
  });

  it("closes the same paths the robots.txt test closes", () => {
    expect(arrayLiteral("requiredDisallow")).toEqual(["/install/", "/tds/"]);
  });
});
