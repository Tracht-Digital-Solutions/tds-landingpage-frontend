import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The three rules the pricing drawer's push depends on.
 *
 * Each of them was arrived at from a measurement, and each fails silently:
 * the drawer still opens, the page still moves, and only one part of the
 * composition is quietly wrong. Read as source text for the same reason
 * `heroSliderLayout.test.ts` is — the failures are geometric, and jsdom has no
 * layout engine to see them with.
 */
const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const css = read("src/styles/global.css");
const header = read("src/components/Header.astro");
const home = read("src/pages/index.astro");
const enHome = read("src/pages/en/index.astro");
const list = read("src/components/PricingList.astro");

describe("the push", () => {
  /**
   * `translate`, not `transform`.
   *
   * `Header.astro` sets `transform: none` on `.site-header` in its own scoped
   * block. Astro appends the component id to that selector, making it (0,2,0)
   * against this stylesheet's (0,1,0) — so a `transform` written globally was
   * ignored and the header stood still while the page slid out from under it.
   * `translate` is a separate property the header does not claim, and the two
   * compose where both are set.
   */
  it("moves the page with `translate` so the header's own rule cannot win", () => {
    const block = css.slice(css.indexOf(".site-header,\nmain,\nfooter {"));
    expect(block.slice(0, 300)).toMatch(/translate:\s*calc\(-1 \* var\(--pricing-shift\)\)/);
    expect(block.slice(0, 300)).not.toMatch(/transform:\s*translateX/);
  });

  /**
   * The header's transition list has to name `translate` for the same
   * specificity reason: without it the bar arrives at its shifted position in
   * one frame while the page glides beside it.
   */
  it("lets the header glide rather than snap", () => {
    expect(header).toMatch(/translate 560ms var\(--pricing-ease\)/);
  });

  /**
   * A `position: fixed` element inside a transformed (or translated) ancestor
   * is positioned against that ancestor, not the viewport. The panel is fixed
   * and the page is what moves — so the panel must not be inside `<main>` or
   * the footer, or it would slide away with the very thing it is pushing.
   */
  for (const [name, source] of [
    ["the German home page", home],
    ["the English home page", enHome],
  ] as const) {
    it(`keeps the drawer outside <main> on ${name}`, () => {
      const mainEnd = source.indexOf("</main>");
      const drawerAt = source.indexOf("<PricingDrawer");
      expect(mainEnd, "a <main>").toBeGreaterThan(-1);
      expect(drawerAt, "the drawer").toBeGreaterThan(-1);
      expect(drawerAt).toBeGreaterThan(mainEnd);
    });
  }
});

describe("the price list inside the panel", () => {
  /**
   * The panel is 34rem wide on a 90rem screen. A viewport media query answers
   * for the WINDOW, so `min-width: 60rem` opened two columns inside a 544px
   * drawer and gave each card about 250px for a heading like
   * "Prozessoptimierung".
   */
  it("sizes its columns against the panel, not the window", () => {
    expect(list).toMatch(/@container pricing-list \(min-width/);
    // Anchored to the start of a line so the prose above the rule — which
    // names the media query it replaced, on purpose — is not mistaken for one.
    expect(list).not.toMatch(/^\s*@media\s*\(/m);
    // A container cannot query itself; the panel body declares it.
    expect(css).toMatch(/container:\s*pricing-list \/ inline-size/);
  });
});
