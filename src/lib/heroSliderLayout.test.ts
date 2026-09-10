import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The phone layout of the hero slider, guarded as CSS text.
 *
 * Every rule below was a real, measured defect, and every one of them was
 * INVISIBLE: `.hero-slider__stage` clips, so an overhanging panel does not
 * push the page sideways — it cuts the copy off mid-word, which reads as a
 * sentence that simply ends. Nothing errors, no test that renders the
 * component would notice, and the layout looks deliberate.
 *
 * Read as text for the same reason `previewLightbox.test.ts` is: the failure
 * is geometric and jsdom has no layout engine, so a rendering test here would
 * pass in every state including the broken ones. The real check is a browser
 * measurement across widths; this file's job is to stop the fix being
 * "simplified" away by someone who cannot see what it is holding up.
 */
const css = readFileSync(resolve(process.cwd(), "src/styles/global.css"), "utf8");

/** The declaration block of one selector, as written. */
function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return "";
  return css.slice(start, css.indexOf("}", start));
}

describe("the hero slider's min-content floors", () => {
  /**
   * Three nested boxes, three separate automatic minimums, and fixing any one
   * or two of them changes nothing.
   *
   * The stage is a grid, so its TRACK has a min-content minimum. The panel is
   * that track's item — and a grid item's automatic minimum size is its
   * min-content size. Below `lg` the panel is also a flex row, so its copy
   * column is a flex item with the same floor again.
   *
   * Measured at 320px before the fix: a 340px panel inside a 272px stage.
   */
  it("gives the stage track an explicit zero minimum", () => {
    expect(block(".hero-slider__stage")).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  });

  it("lets the panel shrink below its min-content width", () => {
    expect(block(".hero-slider__panel")).toMatch(/min-width:\s*0/);
  });

  it("lets the copy column shrink below its min-content width", () => {
    expect(block(".hero-slider__body")).toMatch(/min-width:\s*0/);
  });

  /**
   * A German compound in a 130px column has no break opportunity, so it sets
   * the min-content width the three rules above exist to defeat. `anywhere`
   * rather than `break-word` because only `anywhere` is taken into account
   * when min-content is calculated — which is the entire point here.
   */
  it("allows a long title to break", () => {
    expect(block(".hero-slider__title")).toMatch(/overflow-wrap:\s*anywhere/);
  });
});

describe("the hero slider's thumbnail on a phone", () => {
  /**
   * A DEFINITE ratio, never `auto`.
   *
   * `auto` let the box stretch to the row's full height, and a 1440 × 900
   * screenshot forced into a 112 × 157 portrait box is not a small picture of
   * a page — it is a vertical slice through one. `cover` scaled it to 17 % and
   * showed the middle 45 % of the width: no logo, no header, no structure.
   *
   * Nothing errors when this regresses. The image loads, the card sits at
   * exactly the same height, and only the content of the picture is useless.
   */
  it("gives the picture the source's own ratio so nothing is cropped", () => {
    const mobile = css.slice(css.indexOf("@media (max-width: 63.9375rem)"));
    const shot = mobile.slice(mobile.indexOf(".hero-slider__shot {"));
    expect(shot.slice(0, 1400)).toMatch(/aspect-ratio:\s*16\s*\/\s*10/);
    expect(shot.slice(0, 1400)).not.toMatch(/aspect-ratio:\s*auto/);
  });

  /**
   * The short-viewport squeeze is for the COLUMN layout only.
   *
   * `#hero .hero-slider__shot { aspect-ratio: 21 / 9 }` buys hero height back
   * where the picture is a full-width band above the copy. In the row layout
   * the height comes from the copy beside it, so the squeeze saves nothing and
   * only crops — it made an 88px-wide thumbnail 38px tall. `#hero` gives that
   * rule (1,1,0), so it silently beats anything the mobile block says.
   */
  it("keeps the 21/9 squeeze away from the row layout", () => {
    expect(css).toMatch(/@media \(max-height: 800px\) and \(min-width: 64rem\)/);
    const shared = css.slice(
      css.indexOf("@media (max-height: 800px) {"),
      css.indexOf("@media (max-height: 800px) and (min-width: 64rem)"),
    );
    expect(shared).not.toMatch(/aspect-ratio:\s*21\s*\/\s*9/);
  });
});

describe("the hero slider's controls", () => {
  /**
   * The row holds one 44px dot per slide plus the arrows. With six slides it
   * wants more width than a phone has, and the arrows were the only items that
   * could give — so they were squeezed to 18px wide at 320, 360 and 390px,
   * i.e. on every common phone: a round button rendered as a half-width oval,
   * under half the minimum touch target.
   */
  it("never lets a control be squeezed", () => {
    expect(block(".hero-slider__arrow,\n.hero-slider__toggle")).toMatch(/flex:\s*none/);
    expect(block(".hero-slider__dot")).toMatch(/flex:\s*none/);
    expect(block(".hero-slider__dots")).toMatch(/flex:\s*none/);
  });

  /**
   * The arrows are a pointer affordance, exactly as on the showcase shelf.
   * The stage handles a horizontal drag itself, so on a touch screen they
   * offer a slower version of the gesture the visitor is already making while
   * taking the width the dots need.
   *
   * The query must ask about the POINTER, never the width: a laptop with both
   * a touchscreen and a mouse keeps them.
   */
  it("shows the arrows on pointer devices only", () => {
    expect(block(".hero-slider__arrow")).toMatch(/display:\s*none/);
    const gate = css.indexOf("@media (hover: hover) and (pointer: fine)", css.indexOf(".hero-slider__arrow {"));
    expect(gate, "a pointer-gated re-enable").toBeGreaterThan(-1);
    expect(css.slice(gate, gate + 200)).toMatch(/\.hero-slider__arrow\s*\{[^}]*display:\s*inline-flex/);
  });
});
