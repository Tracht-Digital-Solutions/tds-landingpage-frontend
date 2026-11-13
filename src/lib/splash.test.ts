// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SPLASH_ATTR, SPLASH_FADE_MS, SPLASH_MAX_MS, SPLASH_MIN_MS, SPLASH_SCRIPT, SPLASH_STORAGE_KEY } from "./splash";

const root = () => document.documentElement;

function run({ reduce = false } = {}) {
  window.matchMedia = ((q: string) => ({ matches: reduce && q.includes("reduce") })) as typeof window.matchMedia;
  new Function(SPLASH_SCRIPT)();
}

describe("first-visit splash", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    for (const a of [SPLASH_ATTR, "data-page-enter", "data-a11y-motion"]) root().removeAttribute(a);
  });
  afterEach(() => vi.useRealTimers());

  it("shows on the first visit and remembers it at once", () => {
    run();
    expect(root().hasAttribute(SPLASH_ATTR)).toBe(true);
    expect(localStorage.getItem(SPLASH_STORAGE_KEY)).toBe("1");
  });

  it("never shows twice", () => {
    run();
    root().removeAttribute(SPLASH_ATTR);
    run();
    expect(root().hasAttribute(SPLASH_ATTR)).toBe(false);
  });

  it("stays away under reduced motion, the site's motion switch and an internal navigation", () => {
    run({ reduce: true });
    expect(root().hasAttribute(SPLASH_ATTR)).toBe(false);
    root().setAttribute("data-a11y-motion", "");
    run();
    expect(root().hasAttribute(SPLASH_ATTR)).toBe(false);
    root().removeAttribute("data-a11y-motion");
    root().setAttribute("data-page-enter", "");
    run();
    expect(root().hasAttribute(SPLASH_ATTR)).toBe(false);
  });

  it("leaves after the hard limit even if nothing reports ready", () => {
    run();
    vi.advanceTimersByTime(SPLASH_MAX_MS - 1);
    expect(root().getAttribute(SPLASH_ATTR)).toBe("");
    vi.advanceTimersByTime(1);
    vi.advanceTimersToNextTimer();
    expect(root().getAttribute(SPLASH_ATTR)).toBe("out");
    vi.advanceTimersByTime(SPLASH_FADE_MS);
    expect(root().hasAttribute(SPLASH_ATTR)).toBe(false);
  });

  it("covers content without hiding it: the layer is the only thing the attribute changes", () => {
    const file = readFileSync("src/components/Splash.astro", "utf8");
    const css = file.slice(file.indexOf("<style"));
    const rules = css.match(/html\[data-splash[^\]]*\][^{]*\{[^}]*\}/g) ?? [];
    for (const rule of rules) {
      const selector = rule.slice(0, rule.indexOf("{"));
      // Only the layer itself, or the scroll lock on <html>, may be styled.
      expect(selector, rule).toMatch(/\.lp-splash\s*$|^html\[data-splash\]:not\(\[data-splash="out"\]\)\s*$/);
    }
    expect(rules.length).toBeGreaterThan(1);
    expect(file).not.toMatch(/<img/);
  });
});
