import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The audit ships in tds-shared (`tds-geo-audit`, 0.59), which pins its check
 * list; this repo keeps only `scripts/geo-audit.profile.mjs`. Both are read as
 * TEXT and never imported: the audit fetches a site on load and calls
 * `process.exit`, neither of which belongs in a test run.
 */
const script = readFileSync(resolve(process.cwd(), "scripts/geo-audit.profile.mjs"), "utf8");
const shared = readFileSync(
  resolve(process.cwd(), "node_modules/@tracht-digital-solutions/tds-shared/scripts/geo-audit.mjs"),
  "utf8",
);

/**
 * An array literal, read without evaluating the module. Matches both a
 * top-level `const NAME = [...]` and a `NAME: [...]` key in the profile.
 */
function arrayLiteral(name: string, source = script): string[] {
  // None of these arrays nests a bracket, so "up to the next ]" is exact and
  // works for the one-line and the multi-line form alike.
  const match = source.match(new RegExp(`(?:const ${name} = |\\b${name}: )\\[([^\\]]*)\\]`));
  if (!match) throw new Error(`${name} not found`);
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

describe("geo-audit check list", () => {
  it("keeps the site-specific checks out of the shared list", () => {
    // The lead/byline/source checks only make sense where a detail page
    // promises them; they belong to the profile, not to the shared contract.
    const ids = arrayLiteral("CHECK_IDS", shared);
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
