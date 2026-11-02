import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { ReferenceCardData } from "./caseCards";
import type { ResolvedDemo } from "./demos";
import type { DesignStudy } from "./designStudies";
import type { OwnProject } from "./ownProjects";
import { HOME_PROJECT_LIMIT, PROJECTS_SLUG, selectHomeProjects } from "./projects";
import { SITEMAP_ENTRIES } from "./sitemap";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const cases = ["a", "b"].map((id) => ({ id }) as ReferenceCardData);
const projects = ["p1", "p2"].map((id) => ({ id }) as OwnProject);
const demos = ["d1", "d2", "d3", "d4"].map((id) => ({ definition: { id } }) as ResolvedDemo);
const studies = ["s1", "s2"].map((id) => ({ id }) as DesignStudy);
const keys = (pool: Parameters<typeof selectHomeProjects>[0], limit?: number) =>
  selectHomeProjects(pool, limit).map((entry) => entry.key);

describe("the home page's project selection", () => {
  it("leads with client work and shows each kind of sample", () => {
    expect(keys({ cases, projects, demos, studies })).toEqual([
      "case:a",
      "case:b",
      "project:p1",
      "demo:d1",
      "demo:d2",
      "study:s1",
    ]);
  });

  it("stays full when every demo host is down", () => {
    const shown = keys({ cases, projects, demos: [], studies });
    expect(shown).toHaveLength(HOME_PROJECT_LIMIT);
    expect(shown).toEqual(["case:a", "case:b", "project:p1", "project:p2", "study:s2", "study:s1"]);
  });

  it("never exceeds the limit, and keeps client work when space is short", () => {
    expect(keys({ cases, projects, demos, studies }, 2)).toEqual(["case:a", "case:b"]);
    expect(keys({ cases, projects, demos, studies }, 3)).toEqual(["case:a", "case:b", "project:p1"]);
  });
});

describe("the home page and the overview", () => {
  const home = read("src/components/HomePage.astro");
  const section = read("src/components/sections/ProjectReferences.astro");
  const tile = read("src/components/ui/ProjectTile.astro");

  it("combines client work and samples in one section", () => {
    expect(home).toMatch(/<ProjectReferences \/>/);
    expect(home).not.toMatch(/<CustomerCases|<Showcase/);
  });

  it("links to the overview under the tiles", () => {
    expect(section.indexOf("projects-more__link")).toBeGreaterThan(section.indexOf("projects-grid"));
    expect(section).toMatch(/href=\{projectsHref\(lang\)\}/);
  });

  it("labels client work on every grid", () => {
    expect(tile).toMatch(/Kundenprojekt/);
    expect(tile).toMatch(/Client project/);
  });

  it("is a page in both languages and in the sitemap", () => {
    expect(read("src/pages/projekte.astro")).toMatch(/lang="de"/);
    expect(read("src/pages/en/projects.astro")).toMatch(/lang="en"/);
    const entry = SITEMAP_ENTRIES.find((row) => row.de === PROJECTS_SLUG.de);
    expect(entry?.en).toBe(PROJECTS_SLUG.en);
  });
});
