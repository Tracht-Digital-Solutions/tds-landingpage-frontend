import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The site says "du" — decided 2026-09-15, lowercase, wherever a visitor is
 * addressed. The one exception is the legal register: Impressum,
 * Datenschutzerklärung and the AGB stay formal.
 *
 * Read as TEXT over every copy source in the repository, comments removed. The
 * sentences that address a visitor are spread over copy modules, components,
 * islands and pages, no single review sees them all, and one "Sie" among the
 * "du" reads as a slip rather than a style.
 *
 * Out of reach here, and listed so nobody mistakes a green run for a finished
 * switch: panel blocks saved before 2026-09-15 (they override these defaults
 * until cleared) and strings that still come from tds-shared.
 */
const FORMAL = /\b(Sie|Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres)\b/;
const SOURCES = ["src/lib", "src/components", "src/layouts", "src/pages", "src/og"];
const LEGAL = /^src\/pages\/legal\//;

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

function filesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(resolve(process.cwd(), dir))) {
    const path = `${dir}/${entry}`;
    if (statSync(resolve(process.cwd(), path)).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(astro|ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(path);
  }
  return out;
}

/** Comments quote what a line replaced — "Bitte geben Sie …" — and are not copy. */
function withoutComments(source: string): string {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

describe("the visitor is addressed with du", () => {
  it("in every copy module, component and page outside the legal texts", () => {
    const offenders: string[] = [];
    for (const file of SOURCES.flatMap(filesUnder)) {
      if (LEGAL.test(file)) continue;
      for (const line of withoutComments(read(file)).split("\n")) {
        const hit = line.match(FORMAL);
        if (hit) offenders.push(`${file}: "${hit[0]}" — ${line.trim().slice(0, 120)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("still finds the formal address where it belongs", () => {
    // Proof that the pattern and the file walk match anything at all — a
    // typo in either would otherwise turn the rule above into a silent pass.
    const legal = SOURCES.flatMap(filesUnder).filter((file) => LEGAL.test(file));
    expect(legal).toContain("src/pages/legal/datenschutz.astro");
    expect(read("src/pages/legal/datenschutz.astro")).toMatch(FORMAL);
  });
});
