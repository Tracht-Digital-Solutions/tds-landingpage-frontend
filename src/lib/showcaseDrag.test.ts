import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The three rules a drag gesture over links has to keep.
 *
 * This reads the component as TEXT, deliberately. jsdom implements neither the
 * click retargeting that pointer capture causes nor `pointercancel`, so a
 * behavioural test of these would pass while the shelf was broken in every
 * real browser — the failure mode is silent by nature: no error, the cursor
 * still says grab, the arrows still work, and only the links are dead.
 *
 * `HeroSlider.test.tsx` in the journal guards the same two rules the same way,
 * after they cost that slider every link it had.
 */
const source = readFileSync(
  resolve(process.cwd(), "src/components/sections/Showcase.astro"),
  "utf8",
);

/** The `pointerdown` handler body, where capture must NOT be taken. */
function pointerDownHandler(): string {
  const start = source.indexOf('track.addEventListener("pointerdown"');
  expect(start, "pointerdown handler").toBeGreaterThan(-1);
  const end = source.indexOf('track.addEventListener("pointermove"', start);
  expect(end, "pointermove handler").toBeGreaterThan(start);
  return source.slice(start, end);
}

describe("the showcase drag gesture", () => {
  it("does not take pointer capture on pointerdown", () => {
    // Capture there retargets the compatibility mouse events — click included
    // — at the track, so every link inside the cards stops working.
    //
    // Matched as a CALL, not as a word: the handler's comment names the API
    // on purpose — to record why it is absent — and a substring check would
    // fail on the explanation of the very rule it is testing.
    expect(pointerDownHandler()).not.toMatch(/setPointerCapture\s*\??\.?\s*\(/);
  });

  it("takes capture once the gesture passes the threshold", () => {
    const start = source.indexOf('track.addEventListener("pointermove"');
    const end = source.indexOf('for (const type of ["pointerup"', start);
    expect(source.slice(start, end)).toMatch(/setPointerCapture\s*\??\.?\s*\(/);
  });

  it("prevents the browser's native drag", () => {
    // Without it a horizontal press on a link or a card screenshot starts a
    // link/image drag, Chrome fires pointercancel on the first move, and the
    // gesture dies. It always changes together with the rule above.
    expect(source).toMatch(/addEventListener\(\s*"dragstart"[\s\S]{0,80}preventDefault/);
  });

  it("swallows the click that follows a real drag", () => {
    // In the capture phase, or the card's own <a> sees it first and navigates.
    const start = source.indexOf('track.addEventListener(\n      "click"');
    expect(start, "click suppressor").toBeGreaterThan(-1);
    const handler = source.slice(start, start + 400);
    expect(handler).toContain("preventDefault");
    expect(handler).toMatch(/\n      true,/);
  });

  it("leaves touch to the browser", () => {
    // The track is a native scroll container. A second gesture on top of the
    // platform's own momentum and snapping would fight it.
    expect(pointerDownHandler()).toContain('event.pointerType !== "mouse"');
  });
});
