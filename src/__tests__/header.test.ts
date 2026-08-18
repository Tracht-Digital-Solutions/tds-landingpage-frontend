import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Header posture test.
 *
 * This does not check that the header looks right — nothing in jsdom can. It
 * pins the mobile-navigation invariants whose violation produces no symptom a
 * build or a type-check would show.
 *
 * The mechanics moved into `@tracht-digital-solutions/tds-shared/nav` in
 * tds-shared 0.25.0. This file was the reference the blog and the tools site
 * were aligned to, so a re-hand-rolled copy here is how the four-way drift
 * would start again — and it would look completely normal in review.
 *
 * Precedent for a source-reading posture test in this workspace:
 * tds-blog-frontend/src/__tests__/layout.test.ts.
 */

const HEADER = join(process.cwd(), "src", "components", "Header.astro");
const raw = readFileSync(HEADER, "utf8");

/**
 * Strip comments first. This file documents the very traps being pinned here,
 * so a check for `body.style.overflow` matches the comment explaining that it
 * was removed and the suite fails on its own prose.
 */
const source = raw
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/^\s*\/\/.*$/gm, "");

describe("mobile navigation", () => {
  it("takes its mechanics from tds-shared", () => {
    expect(source).toMatch(
      /import \{ mountMobileNav \} from "@tracht-digital-solutions\/tds-shared\/nav"/,
    );
    expect(source).toContain("mountMobileNav({");
  });

  it("does not hand-roll the scroll lock", () => {
    // A direct write means the first overlay to close unlocks the page behind
    // the second. The shared lock is counted.
    expect(source).not.toContain("body.style.overflow");
    expect(source).not.toContain("drawer-open");
  });

  it("does not hand-roll Escape, outside-click or the resize close", () => {
    expect(source).not.toMatch(/addEventListener\(\s*"keydown"/);
    expect(source).not.toMatch(/matchMedia\(\s*"\(min-width/);
  });

  it("wears the shared classes on the toggle and the panel", () => {
    expect(source).toMatch(/class="btn btn-ghost tds-menu-toggle"/);
    expect(source).toMatch(/class="tds-mobile-menu\b/);
    expect(source).toContain("tds-menu-bar-top");
  });

  it("never hides the mobile chrome with a utility", () => {
    // `hidden` loses to unlayered `.btn { display: inline-flex }`, so an
    // `lg:hidden` hamburger stays visible at every width with nothing to say
    // so. The breakpoint belongs to `.tds-menu-toggle` / `.tds-mobile-menu`.
    const toggle = source.match(/<button[\s\S]*?id="menu-toggle"[\s\S]*?>/)?.[0] ?? "";
    const panel = source.match(/<div[\s\S]*?id="mobile-menu"[\s\S]*?>/)?.[0] ?? "";
    expect(toggle).not.toBe("");
    expect(panel).not.toBe("");
    for (const [name, tag] of [["toggle", toggle], ["panel", panel]] as const) {
      expect(tag, `${name} hides itself with a utility`).not.toMatch(/\blg:hidden\b/);
    }
  });

  it("keeps the panel's docking offset and its max-height in agreement", () => {
    // The offset is app-local because each header floats differently; the
    // shared panel sizes itself from `--tds-mobile-menu-inset`. If the two
    // drift, the menu runs past the bottom of the viewport — silently, since
    // a fixed element has no scrollbar to reveal it.
    const panel = source.match(/<div[\s\S]*?id="mobile-menu"[\s\S]*?>/)?.[0] ?? "";
    const top = panel.match(/top-\[([\d.]+rem)\]/)?.[1];
    const inset = panel.match(/--tds-mobile-menu-inset:\s*([\d.]+rem)/)?.[1];
    expect(top).toBeDefined();
    expect(inset).toBe(top);
  });

  it("bundles the script rather than inlining it", () => {
    // `is:inline` is not bundled, so the import would reach the browser as a
    // bare specifier and the menu would simply never wire up.
    expect(raw).not.toMatch(/<script[^>]*\bis:inline\b/);
  });
});
