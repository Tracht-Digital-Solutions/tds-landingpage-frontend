import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The site addresses no one directly — decided 2026-10-12, replacing the "du"
 * of 2026-09-15. The copy is about Tracht Digital Solutions and the work, not
 * about what "du bekommst". The one exception is the legal register:
 * Impressum, Datenschutzerklärung and the AGB stay formal.
 *
 * Read as TEXT over every copy source in the repository, comments removed. The
 * sentences are spread over copy modules, components, islands and pages, no
 * single review sees them all, and one "du" among neutral sentences reads as a
 * slip rather than a style.
 *
 * The informal forms are looked for inside string literals only: "dir" and
 * "du" are also code (`dir` parameters, the `--dir` custom property).
 *
 * Out of reach here, and listed so nobody mistakes a green run for a finished
 * switch: panel blocks saved earlier (they override these defaults until
 * cleared) and strings that still come from tds-shared.
 */
const FORMAL = /\b(Sie|Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres)\b/;
const INFORMAL = /(?<![\w-])(du|Du|dein\w*|Dein\w*|dir|Dir|dich|Dich)(?![\w-])/;
const LITERAL = /"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g;
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

const copyFiles = () => SOURCES.flatMap(filesUnder).filter((file) => !LEGAL.test(file));

describe("the visitor is not addressed directly", () => {
  it("never formally outside the legal texts", () => {
    const offenders: string[] = [];
    for (const file of copyFiles()) {
      for (const line of withoutComments(read(file)).split("\n")) {
        const hit = line.match(FORMAL);
        if (hit) offenders.push(`${file}: "${hit[0]}" — ${line.trim().slice(0, 120)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("never with du in any copy string", () => {
    const offenders: string[] = [];
    for (const file of copyFiles()) {
      for (const literal of withoutComments(read(file)).match(LITERAL) ?? []) {
        // `${dir * …}` inside a template literal is code, not copy.
        const hit = literal.replace(/\$\{[^}]*\}/g, "").match(INFORMAL);
        if (hit) offenders.push(`${file}: "${hit[0]}" — ${literal.slice(0, 120)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("still finds both forms where the patterns should match", () => {
    // Proof that the patterns and the file walk match anything at all — a
    // typo in either would otherwise turn the rules above into a silent pass.
    const legal = SOURCES.flatMap(filesUnder).filter((file) => LEGAL.test(file));
    expect(legal).toContain("src/pages/legal/datenschutz.astro");
    expect(read("src/pages/legal/datenschutz.astro")).toMatch(FORMAL);
    expect('"Was kennst du davon?"'.match(LITERAL)?.[0]).toMatch(INFORMAL);
    expect('"--dir"').not.toMatch(INFORMAL);
  });
});
