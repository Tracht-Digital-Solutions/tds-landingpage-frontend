import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { translations } from "@tracht-digital-solutions/tds-shared/i18n";
import { BANNED_WORDS } from "./copyRules";

/**
 * "echt" and "wirklich" never appear on the landing page (decided 2026-09-21),
 * in any inflection: echt, echte, echten, Echtheit … wirklich, wirkliche …
 *
 * A claim that something is REAL or TRULY so is the claim a visitor cannot
 * check, and it quietly implies the rest of the page might not be. The slogan
 * lost its "wirklich" for the same reason (tds-shared 0.40).
 *
 * Checked against every source that can put text on a page — copy modules,
 * components, islands, the OG card — with COMMENTS STRIPPED, because the
 * documentation is allowed to talk about the rule. Plus the tds-shared
 * strings this site renders. Panel overrides are not in the repository;
 * `npm run audit:seo` scans the rendered pages for them.
 */
const BANNED = BANNED_WORDS;

const root = join(__dirname, "..");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(astro|tsx?|json)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

export function stripComments(source: string): string {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");
}

describe("the banned words", () => {
  it("appear in no source that renders text", () => {
    const hits: string[] = [];
    for (const path of files(root)) {
      // Legal texts are statutory wording, not copy (and say "Sie" for the
      // same reason, see addressForm.test.ts).
      if (path.includes(`${join("pages", "legal")}`)) continue;
      // The rule itself has to name the words.
      if (path.endsWith("copyRules.ts")) continue;
      const code = stripComments(readFileSync(path, "utf8"));
      code.split("\n").forEach((line, index) => {
        const match = line.match(BANNED);
        if (match) hits.push(`${relative(root, path)}:${index + 1} "${match[0]}"`);
      });
    }
    expect(hits).toEqual([]);
  });

  it("appear in none of the tds-shared strings", () => {
    const text = JSON.stringify(translations);
    expect(text.match(BANNED)?.[0]).toBeUndefined();
  });
});
