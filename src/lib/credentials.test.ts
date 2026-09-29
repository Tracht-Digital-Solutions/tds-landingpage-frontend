import { access, readdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { hasBannedWord } from "./copyRules";
import {
  CREDENTIAL_GROUPS,
  CREDENTIAL_GROUP_ORDER,
  CREDENTIALS_SLUG,
  credentials,
  credentialsInGroup,
  featuredCredentials,
  formatDuration,
  shortTitle,
} from "./credentials";
import { CREDENTIAL_IMAGE, CREDENTIAL_PDF_DIR, credentialImageSrc } from "./credentialMeta";
import { SITEMAP_ENTRIES } from "./sitemap";

/**
 * The certificates, and the two things that make the page honest.
 *
 * The page shows each document as a PICTURE, so the caption beside it has to
 * agree with the paper: every field below was transcribed from a PDF that is
 * committed in this repository, and a transcription nobody re-reads drifts.
 * These tests hold the parts a reader could not check at a glance — that an
 * image exists for every entry, that the source PDF is still there, and that
 * the sentence classifying them has not been quietly dropped.
 */
const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const page = read("src/components/CredentialsPage.astro");
const about = read("src/components/sections/About.astro");

describe("the catalog", () => {
  it("has an entry for every committed source PDF, and no more", async () => {
    const pdfs = (await readdir(resolve(process.cwd(), CREDENTIAL_PDF_DIR)))
      .filter((name) => name.endsWith(".pdf"))
      .map((name) => name.replace(/\.pdf$/, ""))
      .sort();
    expect([...credentials].map((entry) => entry.id).sort()).toEqual(pdfs);
  });

  it("gives every certificate a unique id", () => {
    const ids = credentials.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every certificate a unique certificate number", () => {
    // Two cards carrying the same id would mean one of them was transcribed
    // from the wrong document — and both would then point at one picture.
    const numbers = credentials.map((entry) => entry.certificateId);
    expect(new Set(numbers).size).toBe(numbers.length);
    for (const entry of credentials) {
      expect(entry.certificateId, entry.id).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("puts every certificate in a group the page renders", () => {
    for (const entry of credentials) {
      expect(CREDENTIAL_GROUP_ORDER, entry.id).toContain(entry.group);
    }
    // And every group has something in it: an empty heading with a lead
    // underneath advertises the emptiness.
    for (const group of CREDENTIAL_GROUP_ORDER) {
      expect(credentialsInGroup(group).length, group).toBeGreaterThan(0);
    }
    expect(Object.keys(CREDENTIAL_GROUPS).sort()).toEqual([...CREDENTIAL_GROUP_ORDER].sort());
  });

  it("keeps the groups contiguous, in the order the page renders them", () => {
    // The catalog order IS the priority order, and `featuredCredentials()`
    // takes the top of it. An entry filed out of sequence would still render
    // in the right group — and would silently change which three the home page
    // names.
    const seen = credentials.map((entry) => CREDENTIAL_GROUP_ORDER.indexOf(entry.group));
    expect(seen).toEqual([...seen].sort((a, b) => a - b));
  });

  it("states a completion date that has already happened", () => {
    for (const entry of credentials) {
      expect(entry.completedAt, entry.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(entry.completedAt).getTime(), entry.id).toBeLessThanOrEqual(Date.now());
    }
  });

  it("states a course length and at least one skill", () => {
    for (const entry of credentials) {
      expect(entry.durationMinutes, entry.id).toBeGreaterThan(0);
      expect(entry.skills.length, entry.id).toBeGreaterThan(0);
    }
  });

  it("writes the note in both languages, and within the site's vocabulary", () => {
    for (const entry of credentials) {
      for (const lang of ["de", "en"] as const) {
        expect(entry.note[lang].length, `${entry.id}/${lang}`).toBeGreaterThan(10);
        expect(hasBannedWord(entry.note[lang]), `${entry.id}/${lang}`).toBe(false);
      }
    }
  });
});

describe("the pictures", () => {
  it("has a committed image, and both served copies, for every entry", async () => {
    for (const entry of credentials) {
      const src = credentialImageSrc(entry.id);
      const onDisk = (path: string) =>
        access(resolve(process.cwd(), "public", path.replace(/^\//, "")));
      await expect(onDisk(src), src).resolves.toBeUndefined();
      // A `srcset` candidate that 404s does not fall back to `src`; the
      // browser picked it and the certificate is simply missing.
      for (const width of [480, 960]) {
        const variant = src.replace(/\.webp$/, `-${width}.webp`);
        await expect(onDisk(variant), variant).resolves.toBeUndefined();
      }
    }
  });

  it("draws the card's band at the rendered ratio", () => {
    // The band is stated as a literal so a card reserves the box before the
    // file arrives. If the render size ever changes, this is what says so.
    const card = read("src/components/ui/CredentialCard.astro");
    expect(card).toContain(`aspect-ratio: ${CREDENTIAL_IMAGE.width} / ${CREDENTIAL_IMAGE.height}`);
  });

  it("shows the certificate whole, never cropped", () => {
    // `cover` is right for a screenshot, where the hero is the part worth
    // showing. A cropped certificate is an unreadable certificate.
    const card = read("src/components/ui/CredentialCard.astro");
    expect(card).toMatch(/\.credential-card__sheet img\s*\{[^}]*object-fit:\s*contain/s);
  });
});

describe("the page", () => {
  /**
   * The framing sentence is gone (2026-09-29, asked for), and so is the
   * assertion that it must be there. What replaces it as the honest signal is
   * per-card: the issuer line, and the picture of the document itself.
   */
  /**
   * The count counts itself.
   *
   * Both places that state a number — the page lead and the teaser link —
   * interpolate `credentials.length`. A literal there reads perfectly and is
   * wrong the moment a certificate is added or removed, which is exactly the
   * kind of mistake nobody reviews. So the number is asserted to be absent.
   */
  it("takes the number of records from the catalog, never from the copy", () => {
    expect(page).toContain("${credentials.length} Nachweise");
    expect(about).toContain("${credentials.length} Nachweise");
    for (const source of [page, about]) {
      expect(source).not.toMatch(/d+ Nachweise/);
      expect(source).not.toMatch(/d+ (records|credentials)/);
    }
  });

  it("names its issuer on every card rather than once in prose", () => {
    for (const entry of credentials) {
      expect(entry.issuer.trim(), entry.id).not.toBe("");
    }
    expect(page).not.toMatch(/Herstellerpr/);
    expect(page).not.toMatch(/vendor exam/);
  });

  it("is listed in the sitemap, in both languages", () => {
    const entry = SITEMAP_ENTRIES.find((row) => row.de === CREDENTIALS_SLUG.de);
    expect(entry, "the qualifications page").toBeDefined();
    expect(entry!.en).toBe(CREDENTIALS_SLUG.en);
  });
});

describe("the teaser in the about section", () => {
  it("takes its entries from the catalog, not from a list of its own", () => {
    // A teaser with its own copy of three names drifts from the page it teases
    // the first time somebody reorders one of them.
    expect(about).toContain("featuredCredentials()");
    for (const entry of credentials) {
      expect(about, entry.title).not.toContain(entry.title);
    }
  });

  it("names three, and links to all of them", () => {
    expect(featuredCredentials()).toHaveLength(3);
    expect(about).toContain("credentialsHref(lang)");
  });

  it("is not reachable from the CMS", () => {
    // `why_me` stays editable; a qualification is not copy. An editor able to
    // retype these could publish one that does not exist.
    //
    // Comments are stripped before the slice. The anchor is a class name, and
    // the file explains its own layout in prose above the markup — so the
    // moment that prose mentions `.credentials-teaser` (it does, to say where
    // the shared seam came from) an unstripped slice starts in the comment
    // block and swallows the `cmsFor` call at the top of the frontmatter. That
    // failed on a documentation edit while the invariant held.
    const code = about
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
    const teaser = code.slice(code.indexOf("credentials-teaser"));
    expect(teaser).not.toContain("cmsFor");
  });
});

describe("the captions", () => {
  it("shortens a title without losing what it names", () => {
    expect(shortTitle(credentials.find((entry) => entry.id === "seo-moz")!)).toBe(
      "Search Engine Optimization",
    );
    expect(
      shortTitle(credentials.find((entry) => entry.id === "project-management-microsoft")!),
    ).toBe("Project Management");
    for (const entry of credentials) {
      expect(shortTitle(entry).length, entry.id).toBeGreaterThan(0);
    }
  });

  it("spells a length the way each language does", () => {
    expect(formatDuration(292, "de")).toBe("4 Std. 52 Min.");
    expect(formatDuration(292, "en")).toBe("4 hrs 52 min");
    expect(formatDuration(120, "de")).toBe("2 Std.");
    expect(formatDuration(45, "en")).toBe("45 min");
  });
});
