// @vitest-environment jsdom
//
// The only suite in this repo that needs a document — see vitest.config.ts.
// It needs one because the entire point of the module is which listeners it
// attaches and with what options, and `preventDefault()` inside a passive
// listener is a no-op that no unit test of a pure function could ever see.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createScrollLock, isScrollKey, isScrollWheel } from "./scrollLock";

function key(init: KeyboardEventInit & { target?: HTMLElement }) {
  const event = new KeyboardEvent("keydown", { cancelable: true, ...init });
  if (init.target) Object.defineProperty(event, "target", { value: init.target });
  return event;
}

describe("isScrollKey", () => {
  it("accepts the keys the browser scrolls with", () => {
    for (const k of ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]) {
      expect(isScrollKey(key({ key: k }))).toBe(true);
    }
  });

  it("ignores keys that do not scroll, so Tab and Escape stay live", () => {
    for (const k of ["Tab", "Escape", "Enter", "a"]) {
      expect(isScrollKey(key({ key: k }))).toBe(false);
    }
  });

  it("leaves caret movement alone inside an editable control", () => {
    const input = document.createElement("input");
    const area = document.createElement("textarea");
    const rich = document.createElement("div");
    rich.setAttribute("contenteditable", "true");
    // jsdom does not implement isContentEditable from the attribute.
    Object.defineProperty(rich, "isContentEditable", { value: true });

    expect(isScrollKey(key({ key: "Home", target: input }))).toBe(false);
    expect(isScrollKey(key({ key: "ArrowDown", target: area }))).toBe(false);
    expect(isScrollKey(key({ key: "End", target: rich }))).toBe(false);
  });

  it("leaves Space alone on a control that Space activates", () => {
    const button = document.createElement("button");
    expect(isScrollKey(key({ key: " ", target: button }))).toBe(false);
    // ...but an arrow key over that same button still scrolls.
    expect(isScrollKey(key({ key: "ArrowDown", target: button }))).toBe(true);
  });

  it("never swallows a modified keystroke", () => {
    expect(isScrollKey(key({ key: "End", ctrlKey: true }))).toBe(false);
    expect(isScrollKey(key({ key: "ArrowDown", metaKey: true }))).toBe(false);
  });
});

describe("isScrollWheel", () => {
  it("treats ctrl/meta + wheel as zoom, not as scrolling", () => {
    expect(isScrollWheel(new WheelEvent("wheel"))).toBe(true);
    expect(isScrollWheel(new WheelEvent("wheel", { ctrlKey: true }))).toBe(false);
    expect(isScrollWheel(new WheelEvent("wheel", { metaKey: true }))).toBe(false);
  });
});

describe("createScrollLock", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const dispatch = (target: EventTarget, event: Event) => {
    target.dispatchEvent(event);
    return event.defaultPrevented;
  };

  it("swallows wheel, touch and scroll keys only while engaged", () => {
    const target = new EventTarget();
    const lock = createScrollLock({ target });

    expect(dispatch(target, new WheelEvent("wheel", { cancelable: true }))).toBe(false);

    lock.engage();
    expect(lock.engaged).toBe(true);
    expect(dispatch(target, new WheelEvent("wheel", { cancelable: true }))).toBe(true);
    expect(dispatch(target, new Event("touchmove", { cancelable: true }))).toBe(true);
    expect(dispatch(target, key({ key: "PageDown" }))).toBe(true);

    lock.release();
    expect(lock.engaged).toBe(false);
    expect(dispatch(target, new WheelEvent("wheel", { cancelable: true }))).toBe(false);
    expect(dispatch(target, key({ key: "PageDown" }))).toBe(false);
  });

  it("keeps zoom and typing working even while engaged", () => {
    const target = new EventTarget();
    const lock = createScrollLock({ target });
    lock.engage();

    expect(
      dispatch(target, new WheelEvent("wheel", { cancelable: true, ctrlKey: true })),
    ).toBe(false);
    expect(dispatch(target, key({ key: "Tab" }))).toBe(false);
  });

  it("releases itself if nothing ever reports the jump complete", () => {
    // The failure this exists for: a lock that outlives its animation is a
    // page that cannot be scrolled at all, with nothing to say why.
    const target = new EventTarget();
    const lock = createScrollLock({ target, maxDurationMs: 1000 });

    lock.engage();
    vi.advanceTimersByTime(999);
    expect(lock.engaged).toBe(true);

    vi.advanceTimersByTime(2);
    expect(lock.engaged).toBe(false);
    expect(dispatch(target, new WheelEvent("wheel", { cancelable: true }))).toBe(false);
  });

  it("extends the safety window rather than stacking listeners on re-engage", () => {
    const target = new EventTarget();
    const add = vi.spyOn(target, "addEventListener");
    const lock = createScrollLock({ target, maxDurationMs: 1000 });

    lock.engage();
    vi.advanceTimersByTime(800);
    lock.engage(); // a second jump starts before the first would have expired
    expect(add).toHaveBeenCalledTimes(3); // wheel + touchmove + keydown, once

    vi.advanceTimersByTime(800);
    expect(lock.engaged).toBe(true); // the first jump's deadline did not fire

    vi.advanceTimersByTime(300);
    expect(lock.engaged).toBe(false);
  });

  it("attaches every listener non-passively, or preventDefault is a silent no-op", () => {
    const target = new EventTarget();
    const add = vi.spyOn(target, "addEventListener");
    createScrollLock({ target }).engage();

    for (const call of add.mock.calls) {
      expect(call[2]).toMatchObject({ passive: false });
    }
  });

  it("is safe to release when it was never engaged", () => {
    const lock = createScrollLock({ target: new EventTarget() });
    expect(() => lock.release()).not.toThrow();
    expect(lock.engaged).toBe(false);
  });
});
