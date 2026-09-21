// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { A11Y_BOOT_SCRIPT, A11Y_STORAGE_KEY, lessMotion, readPrefs, setPref } from "./a11yPrefs";

const src = (path: string) => readFileSync(join(__dirname, "..", path), "utf8");

describe("accessibility preferences", () => {
  beforeEach(() => {
    localStorage.clear();
    for (const name of ["data-a11y-text", "data-a11y-contrast", "data-a11y-motion"]) {
      document.documentElement.removeAttribute(name);
    }
  });

  it("stores a switch and the boot script restores it before paint", () => {
    setPref("text", true);
    setPref("contrast", true);
    expect(JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY) ?? "{}")).toEqual({
      text: true,
      contrast: true,
      motion: false,
    });
    document.documentElement.removeAttribute("data-a11y-text");
    document.documentElement.removeAttribute("data-a11y-contrast");
    new Function(A11Y_BOOT_SCRIPT)();
    expect(readPrefs()).toEqual({ text: true, contrast: true, motion: false });
  });

  it("survives garbage in storage", () => {
    localStorage.setItem(A11Y_STORAGE_KEY, "{not json");
    expect(() => new Function(A11Y_BOOT_SCRIPT)()).not.toThrow();
    expect(readPrefs()).toEqual({ text: false, contrast: false, motion: false });
  });

  it("counts the site's motion switch as reduced motion", () => {
    window.matchMedia ??= ((query: string) => ({ matches: false, media: query })) as never;
    expect(lessMotion()).toBe(false);
    setPref("motion", true);
    expect(lessMotion()).toBe(true);
  });

  it("is wired where it has to be", () => {
    const layout = src("layouts/Layout.astro");
    const head = layout.slice(layout.indexOf("<head>"));
    // First, before the page-enter flag that reads the motion switch.
    expect(head.indexOf("A11Y_BOOT_SCRIPT")).toBeLessThan(head.indexOf("PAGE_ENTER_SCRIPT"));
    expect(src("components/FloatingCta.astro")).toContain("<A11yTools />");
    const tools = src("components/A11yTools.astro");
    expect(tools).toContain('aria-pressed="false"');
    expect(tools).toContain("popovertarget=\"a11y-panel\"");
    // The CTA stands down over the hero; the tools must not.
    expect(src("components/FloatingCta.astro")).toMatch(/:not\(\.a11y-toggle\)/);
    for (const file of ["lib/motion/boot.ts", "lib/motion/dialog.ts"]) {
      expect(src(file), file).toContain("lessMotion");
    }
    for (const file of ["lib/reveal.ts", "components/islands/HeroDecor.tsx", "components/islands/SmoothScroll.tsx", "components/islands/CustomCursor.tsx", "lib/motion/constants.ts"]) {
      expect(src(file), file).toContain("data-a11y-motion");
    }
  });
});
