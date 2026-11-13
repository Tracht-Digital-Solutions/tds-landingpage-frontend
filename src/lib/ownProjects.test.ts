import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { ownProjects } from "./ownProjects";
import { referenceCases } from "./references";
import { getServiceById } from "./services";

const LANGS = ["de", "en"] as const;

describe("own projects", () => {
  it("shows WParted, Pi Imager for Android, Kanlo and the WParted website", () => {
    expect(ownProjects.map((p) => p.id)).toEqual(["wparted", "pi-imager-android", "kanlo", "wparted-website"]);
  });

  it("names Kanlo's released version and no longer calls it a development build", () => {
    const kanlo = ownProjects.find((p) => p.id === "kanlo")!;
    expect(kanlo.copy.de.text).toMatch(/Version 1.0/);
    expect(kanlo.copy.en.text).toMatch(/Version 1.0/);
    expect(kanlo.copy.de.text).not.toMatch(/Entwicklungsversion/);
  });

  it("call Pi Imager independent and do not hide its test state", () => {
    const app = ownProjects.find((p) => p.id === "pi-imager-android")!;
    expect(app.copy.de.text).toMatch(/Unabhängiges.*Emulatoren/);
    expect(app.copy.en.text).toMatch(/Independent.*emulators/);
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

  it("lead from the program card to the WParted website", () => {
    const program = ownProjects[0]!;
    for (const lang of LANGS) expect(program.href[lang]).toMatch(/^https:\/\/wparted\.tracht-digital\.de\//);
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
