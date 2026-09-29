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

describe("the shelf runs on its own (2026-09-22)", () => {
  it("has no arrow buttons any more", () => {
    expect(source).not.toMatch(/data-carousel-(prev|next|nav)/);
  });

  it("clones the cards only as unreachable copies", () => {
    expect(source).toMatch(/clone\.setAttribute\("aria-hidden", "true"\)/);
    expect(source).toMatch(/clone\.setAttribute\("inert", ""\)/);
    expect(source).toMatch(/node\.removeAttribute\("id"\)/);
  });

  it("never drifts under reduced motion or the site's motion switch", () => {
    // Both preferences, and the flag they produce has to reach the gate the
    // rAF loop actually asks. Asserted as two halves rather than as one source
    // line, because the single line this used to match was the bug below.
    expect(source).toMatch(/const drifts\s*=\s*!reduce\.matches\s*&&\s*!lessMotion\(\)/);
    expect(source).toMatch(/const running\s*=\s*\(\)\s*=>\s*\n?\s*drifts &&/);
  });

  it("still LOOPS when it may not drift", () => {
    /**
     * The white gap at the right end (2026-09-29). Clones and drift shared one
     * `if (reduce.matches || lessMotion() || …) continue;`, so a reader who had
     * asked for less motion got no clones at all — the track simply ended after
     * the last real card and scrolling right ran into the paper edge.
     *
     * A clone is layout: it is `inert`, `aria-hidden` and moves nothing by
     * existing. Only the per-frame `scrollLeft` write is motion.
     *
     * So: no `continue` may depend on either preference, and the clone builder
     * may not consult them either.
     */
    for (const line of source.split("\n")) {
      if (!line.includes("continue")) continue;
      expect(line, `a motion preference gates this: ${line.trim()}`).not.toMatch(
        /reduce\.matches|lessMotion\(\)/,
      );
    }
    const builder = source.slice(
      source.indexOf("const buildClones"),
      source.indexOf("new ResizeObserver(measureLoop)"),
    );
    expect(builder.length).toBeGreaterThan(0);
    expect(builder).not.toMatch(/reduce\.matches|lessMotion\(\)/);
  });

  it("wraps a hand scroll without animating the rewind", () => {
    // `scroll-behavior: smooth` is global (tds-shared base.css) and per spec
    // applies to a `scrollLeft` ASSIGNMENT, so the wrap has to force it off for
    // that one write. `.is-autoplay` covers the drifting case only, and the
    // drift may be switched off entirely — so without this the shelf visibly
    // rewinds across a whole set for exactly the readers the fix above is for.
    const handler = source.slice(source.indexOf('track.addEventListener(\n      "scroll"'));
    expect(handler).toMatch(/scrollBehavior = "auto"/);
    expect(handler).toMatch(/track\.scrollLeft -= loop/);
  });
});
