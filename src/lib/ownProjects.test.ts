import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { ownProjects } from "./ownProjects";
import { referenceCases } from "./references";
import { getServiceById } from "./services";

const LANGS = ["de", "en"] as const;

describe("own projects", () => {
  it("shows the WParted program and its website", () => {
    expect(ownProjects.map((p) => p.id)).toEqual(["wparted", "wparted-website"]);
  });

  it("are never listed as client work", () => {
    const clients = referenceCases.map((c) => c.id);
    for (const project of ownProjects) expect(clients).not.toContain(project.id);
  });

  it("have https links, an existing service and a picture per language", () => {
    for (const project of ownProjects) {
      expect(getServiceById(project.service)).toBeTruthy();
      for (const lang of LANGS) {
        expect(project.href[lang]).toMatch(/^https:\/\//);
        expect(existsSync(new URL(`../../public${project.image[lang]}`, import.meta.url)), project.image[lang]).toBe(true);
      }
    }
  });

  it("say what is special about the program, in both languages", () => {
    const program = ownProjects[0]!;
    expect(program.copy.de.highlights?.items).toHaveLength(3);
    expect(program.copy.en.highlights?.items).toHaveLength(3);
  });

  it("describe WParted as an alternative in beta, never as GParted itself", () => {
    for (const lang of LANGS) {
      const text = ownProjects[0]!.copy[lang].text;
      expect(text).toMatch(/GParted[- ]?alternative/i);
      expect(text).toMatch(/beta/i);
      expect(text).toContain("Tracht Digital Solutions");
      expect(text).not.toMatch(/GParted (für|for) Windows/i);
    }
  });
});
