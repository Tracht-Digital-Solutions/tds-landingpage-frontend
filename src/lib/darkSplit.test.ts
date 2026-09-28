// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { SHADOW_PAD, darkSpan, makeTwin, splitClip } from "./darkSplit";

const P = SHADOW_PAD;

describe("darkSpan", () => {
  it("returns the overlap with the dark bands, or null", () => {
    expect(darkSpan(100, 200, [[0, 50]])).toBeNull();
    expect(darkSpan(100, 200, [[150, 400]])).toEqual([150, 200]);
    expect(darkSpan(100, 200, [[0, 120], [180, 300]])).toEqual([100, 200]);
  });
});

describe("splitClip", () => {
  it("hides the twin over a light page and shows it whole over a dark band", () => {
    expect(splitClip(100, 200, [])).toBe("inset(100% 0 0 0)");
    expect(splitClip(100, 200, [[0, 500]])).toBe(`inset(${-P}px ${-P}px ${-P}px ${-P}px)`);
  });

  /**
   * The original is NEVER clipped, and that is the whole point of this
   * function returning one string instead of two. `clip-path` clips hit
   * testing as well as paint: clipping the original to the light part left
   * the bookmarks and the floating pill unclickable wherever they went white,
   * because the twin over them is `inert` by design. Nothing here may grow a
   * second return value again.
   */
  it("returns one clip, for the twin alone", () => {
    expect(typeof splitClip(100, 200, [[0, 500]])).toBe("string");
  });

  it("cuts both layers at the line when a band starts inside the element", () => {
    // A dark band from y=160 down: the lower 40 px are white already.
    const clip = splitClip(100, 200, [[160, 900]]);
    expect(clip).toBe(`inset(60px ${-P}px ${-P}px ${-P}px)`);
  });

  it("cuts at the band's lower edge when leaving it", () => {
    const clip = splitClip(100, 200, [[0, 130]]);
    expect(clip).toBe(`inset(${-P}px ${-P}px 70px ${-P}px)`);
  });

  it("shows the twin whole in the dark theme", () => {
    expect(splitClip(100, 200, [], true)).toBe(`inset(${-P}px ${-P}px ${-P}px ${-P}px)`);
  });
});

describe("makeTwin", () => {
  it("copies the look and none of the wiring", () => {
    document.body.innerHTML = `
      <aside class="pill" aria-label="Schnellzugriff">
        <button id="a" popovertarget="p" aria-label="Open">x</button>
        <div id="p" popover class="a11y-panel">panel</div>
        <a href="/#contact" aria-label="Kontakt">y</a>
      </aside>`;
    const twin = makeTwin(document.querySelector<HTMLElement>(".pill")!, "pill--twin");
    expect(twin.getAttribute("aria-hidden")).toBe("true");
    expect(twin.hasAttribute("inert")).toBe(true);
    expect(twin.querySelector("[id]")).toBeNull();
    expect(twin.querySelector("[href]")).toBeNull();
    expect(twin.querySelector("[popovertarget]")).toBeNull();
    expect(twin.querySelector(".a11y-panel")).toBeNull();
    expect(twin.querySelector("[aria-label]")).toBeNull();
    expect(twin.classList.contains("pill--twin")).toBe(true);
  });
});
