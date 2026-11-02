// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { tipPosition, tipSource } from "./pointerTooltip";

const box = { width: 100, height: 30 };
const view = { width: 1000, height: 800 };
const html = (markup: string) => {
  document.body.innerHTML = markup;
  return document.getElementById("t");
};

describe("tipPosition", () => {
  it("sits beside the pointer", () => {
    expect(tipPosition(200, 200, box, view)).toEqual({ left: 216, top: 216 });
  });

  it("flips at the window's edges", () => {
    expect(tipPosition(990, 790, box, view)).toEqual({ left: 874, top: 744 });
  });
});

describe("tipSource", () => {
  it("takes a title or data-tip from an ancestor", () => {
    expect(tipSource(html('<a title="x"><svg id="t"></svg></a>'))?.tagName).toBe("A");
    expect(tipSource(html('<span data-tip="x" id="t"></span>'))?.tagName).toBe("SPAN");
  });

  it("takes an aria-label only on an icon-only control", () => {
    expect(tipSource(html('<a aria-label="x"><svg id="t"></svg></a>'))?.tagName).toBe("A");
    expect(tipSource(html('<a aria-label="x" id="t">Words</a>'))).toBeNull();
  });
});
