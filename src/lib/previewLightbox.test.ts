import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The four rules the screenshot magnifier depends on.
 *
 * Read as TEXT, for the same reason `showcaseDrag.test.ts` is: jsdom has no
 * `HTMLDialogElement.showModal`, no top layer and no `::backdrop`, so a
 * behavioural test here would either be mocked into meaninglessness or would
 * fail for reasons that have nothing to do with the page. Every rule below is
 * also silent when broken — the card still renders, the link still works, and
 * only a control or a focus position is quietly wrong.
 */
const card = readFileSync(
  resolve(process.cwd(), "src/components/ui/DemoCard.astro"),
  "utf8",
);
const lightbox = readFileSync(
  resolve(process.cwd(), "src/components/ui/PreviewLightbox.astro"),
  "utf8",
);

describe("the demo card's markup", () => {
  /**
   * The reason the card stopped being one big `<a>`.
   *
   * A `<button>` inside an `<a>` is invalid, and browsers recover from it by
   * closing the anchor early — which silently drops everything after the
   * button out of the link. Restoring the wrapper anchor "because it is
   * simpler" would look right in the diff and break both controls.
   */
  it("does not nest the magnifier inside an anchor", () => {
    const anchorStart = card.indexOf("<a\n");
    const zoomStart = card.indexOf('class="demo-card__zoom"');
    expect(anchorStart, "an anchor").toBeGreaterThan(-1);
    expect(zoomStart, "the magnifier").toBeGreaterThan(-1);
    // The magnifier is in the screenshot band, which comes BEFORE the body
    // that holds the link. Nothing can nest them in that order.
    expect(zoomStart).toBeLessThan(anchorStart);
  });

  it("keeps the full-card hit area as a stretched link", () => {
    // The invariant is the hit area, not the tag that used to provide it.
    expect(card).toMatch(/\.demo-card__link::after\s*\{/);
    expect(card).toMatch(/inset:\s*0/);
  });

  it("keeps a focus ring on the whole card", () => {
    // Focus moved to the heading's link, so the ring has to be drawn for the
    // card from there — without this the ring shrinks to two lines of text in
    // the middle of a card-sized target.
    expect(card).toMatch(/\.demo-card:has\(\.demo-card__link:focus-visible\)/);
  });

  it("ships the magnifier hidden", () => {
    const zoom = card.slice(card.indexOf('class="demo-card__zoom"'));
    expect(zoom.slice(0, 200)).toMatch(/\bhidden\b/);
  });

  /**
   * `display: inline-flex` out-specifies the user agent's
   * `[hidden] { display: none }`, so without an explicit override the button
   * would be visible before its dialog exists — and clicking it would do
   * nothing at all.
   */
  it("re-asserts display:none for the hidden magnifier", () => {
    expect(card).toMatch(/\.demo-card__zoom\[hidden\]\s*\{\s*display:\s*none;?\s*\}/);
  });
});

describe("the lightbox script", () => {
  it("reveals the magnifiers only after confirming dialog support", () => {
    const guard = lightbox.indexOf("typeof dialog.showModal");
    const reveal = lightbox.indexOf("button.hidden = false");
    expect(guard, "the support guard").toBeGreaterThan(-1);
    expect(reveal, "the reveal").toBeGreaterThan(-1);
    // Order is the whole contract: a browser without `<dialog>` must `continue`
    // past this dialog with the buttons still in the state they shipped in.
    expect(guard).toBeLessThan(reveal);
  });

  it("returns focus to the control that opened it", () => {
    const onClose = lightbox.slice(lightbox.indexOf('dialog.addEventListener("close"'));
    expect(onClose).toMatch(/opener\?\.focus\(\)/);
  });

  it("dismisses on a backdrop click and not on a click inside", () => {
    // A click on the backdrop reports the dialog itself as its target, because
    // the backdrop has no node; anything inside reports a descendant. An
    // unguarded close handler here would shut the dialog the moment anyone
    // clicked the picture.
    expect(lightbox).toMatch(/event\.target === dialog/);
  });

  it("binds each dialog to its own section", () => {
    // Two shelves on one page must not drive one another's dialog.
    expect(lightbox).toMatch(/dialog\.closest\("section"\)/);
  });
});
