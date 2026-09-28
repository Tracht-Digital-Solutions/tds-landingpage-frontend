import { access } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { hasBannedWord } from "./copyRules";
import { DEMO_KINDS, DEMO_ORIGINS, demoDefinitions } from "./demoCatalog";
import { coverView, designStudies } from "./designStudies";
import { STUDY_SOURCES } from "./designStudyMeta";

/**
 * The design studies: pictures of pages that were never built.
 *
 * They ride the showcase shelf beside the demos, which are running sites, and
 * the only thing standing between the two is a label. So the rules here are
 * mostly about honesty — that a study never acquires an address, that the
 * badge stays a badge, and that the pictures it promises are on disk.
 */
const onDisk = (src: string) => access(resolve(process.cwd(), "public", src.replace(/^\//, "")));
const card = readFileSync(resolve(process.cwd(), "src/components/ui/StudyCard.astro"), "utf8");

describe("the catalog", () => {
  it("accounts for every imported capture, and imports every one it names", () => {
    // Both directions matter. A capture imported and then forgotten is an
    // asset nobody serves; a view naming a file the importer does not write is
    // a broken image the next `studies:import` would not repair.
    const imported = [...new Set(Object.values(STUDY_SOURCES))].sort();
    const declared = [
      ...new Set(
        designStudies.flatMap((study) =>
          study.views.map((view) => view.src.replace(/^.*\//, "").replace(/\.webp$/, "")),
        ),
      ),
    ].sort();
    expect(declared).toEqual(imported);
  });

  it("gives every study a unique id and at least one view", () => {
    const ids = designStudies.map((study) => study.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const study of designStudies) {
      expect(study.views.length, study.id).toBeGreaterThan(0);
      expect(coverView(study), study.id).toBe(study.views[0]);
    }
  });

  it("labels every study with a genre from the closed vocabulary", () => {
    for (const study of designStudies) {
      expect(Object.keys(DEMO_KINDS), study.id).toContain(study.kind);
    }
  });

  it("states the committed size of every view", async () => {
    for (const study of designStudies) {
      for (const view of study.views) {
        expect(view.width, `${study.id}/${view.id}`).toBeGreaterThan(0);
        expect(view.height, `${study.id}/${view.id}`).toBeGreaterThan(0);
        await expect(onDisk(view.src), view.src).resolves.toBeUndefined();
        // A `srcset` candidate that 404s does not fall back to `src`.
        for (const width of [480, 960]) {
          if (width >= view.width) continue;
          const variant = view.src.replace(/\.webp$/, `-${width}.webp`);
          await expect(onDisk(variant), variant).resolves.toBeUndefined();
        }
      }
    }
  });

  it("writes every text in both languages", () => {
    for (const study of designStudies) {
      for (const lang of ["de", "en"] as const) {
        expect(study.sector[lang].length, `${study.id}/${lang}`).toBeGreaterThan(0);
        expect(study.description[lang].length, `${study.id}/${lang}`).toBeGreaterThan(20);
        expect(hasBannedWord(study.description[lang]), `${study.id}/${lang}`).toBe(false);
        for (const view of study.views) {
          expect(view.label[lang].length, `${study.id}/${view.id}/${lang}`).toBeGreaterThan(0);
        }
      }
    }
  });

  /**
   * A study has no address, and inventing one would be the single most
   * misleading thing a card could do — a visitor would try it.
   */
  it("never gives a study an address", () => {
    for (const study of designStudies) {
      for (const lang of ["de", "en"] as const) {
        expect(study.description[lang], study.id).not.toMatch(/https?:\/\//);
        expect(study.sector[lang], study.id).not.toMatch(/https?:\/\//);
      }
    }
  });
});

describe("the origin badge", () => {
  it("is part of the shelf's one closed vocabulary", () => {
    expect(DEMO_ORIGINS.study.de.length).toBeGreaterThan(0);
    expect(DEMO_ORIGINS.study.en.length).toBeGreaterThan(0);
  });

  it("says a study is a study", () => {
    expect(DEMO_ORIGINS.study.de).toMatch(/Designstudie/);
    expect(DEMO_ORIGINS.study.en).toMatch(/[Dd]esign study/);
  });

  it("is never worn by a demo", () => {
    // The badge exists to separate a running site from a drawing. A demo
    // carrying it would be the failure it was added to prevent.
    for (const demo of demoDefinitions) {
      expect(demo.origin, demo.id).not.toBe("study");
    }
  });
});

describe("the card", () => {
  it("shows the sector where a demo card shows its host", () => {
    expect(card).toContain("study-card__sector");
    expect(card).not.toContain("study-card__host");
  });

  it("carries no magnifier of its own", () => {
    // A demo card has two destinations and needs a second control. A study has
    // one — the enlargement — and it is the call to action in the bar.
    expect(card).not.toContain("study-card__zoom");
    expect(card).toContain("<CardActions");
  });

  it("reserves the same band as a demo card", () => {
    // These cards share one track and the shelf stretches every slide to the
    // tallest; a different ratio pads every demo card's body by the difference.
    expect(card).toMatch(/\.study-card__shot\s*\{[^}]*aspect-ratio:\s*16 \/ 10/s);
  });

  it("lets a full-page capture scroll in the dialog instead of squashing it", () => {
    expect(card).toContain('cover.height > cover.width ? "tall" : "cover"');
    const lightbox = readFileSync(
      resolve(process.cwd(), "src/components/ui/PreviewLightbox.astro"),
      "utf8",
    );
    expect(lightbox).toMatch(/\.preview\[data-fit="tall"\] \.preview__well\s*\{[^}]*overflow-y:\s*auto/s);
  });
});
