// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SWIPE_MAX,
  SWIPE_THRESHOLD,
  mountReceiverSwipe,
  startsSwipe,
  swipeOffset,
  swipeProgress,
} from "./receiverSwipe";

describe("swipe arithmetic", () => {
  it("follows an upward drag 1:1 and ignores a downward one", () => {
    expect(swipeOffset(-20)).toBe(0);
    expect(swipeOffset(0)).toBe(0);
    expect(swipeOffset(30)).toBe(30);
    expect(swipeOffset(SWIPE_MAX)).toBe(SWIPE_MAX);
  });

  it("rubber-bands past the maximum and never passes max + 12", () => {
    const a = swipeOffset(SWIPE_MAX + 20);
    const b = swipeOffset(SWIPE_MAX + 400);
    expect(a).toBeGreaterThan(SWIPE_MAX);
    expect(b).toBeGreaterThan(a);
    expect(b).toBeLessThan(SWIPE_MAX + 12);
  });

  it("reports progress up to the threshold", () => {
    expect(swipeProgress(0)).toBe(0);
    expect(swipeProgress(SWIPE_THRESHOLD / 2)).toBe(0.5);
    expect(swipeProgress(SWIPE_THRESHOLD * 3)).toBe(1);
  });

  it("starts only on a mostly upward movement past the slop", () => {
    expect(startsSwipe(0, 4)).toBe(false);
    expect(startsSwipe(0, 10)).toBe(true);
    expect(startsSwipe(20, 10)).toBe(false);
    expect(startsSwipe(0, -10)).toBe(false);
  });
});

describe("mountReceiverSwipe", () => {
  let group: HTMLElement;
  let twin: HTMLElement;
  let link: HTMLAnchorElement;
  let top: HTMLButtonElement;
  let navigated: number;
  let topClicks: number;
  let listeners: AbortController;

  // jsdom has no PointerEvent and no pointer capture.
  const pointer = (target: Element, type: string, x: number, y: number) => {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 });
    Object.assign(event, { pointerId: 1, isPrimary: true });
    target.dispatchEvent(event);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <aside class="floating-cta-group">
        <button class="floating-cta-top"></button>
        <a class="floating-cta" href="#contact"><svg class="floating-cta__icon"></svg></a>
      </aside>
      <aside class="floating-cta-group floating-cta-group--twin"></aside>`;
    [group, twin] = Array.from(document.querySelectorAll<HTMLElement>("aside"));
    link = group.querySelector("a")!;
    top = group.querySelector("button")!;
    Object.assign(link, {
      setPointerCapture: vi.fn(),
      releasePointerCapture: vi.fn(),
      hasPointerCapture: () => true,
    });
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
    navigated = 0;
    topClicks = 0;
    // Stands in for the site's own hash-link handling (a bubbling listener).
    listeners = new AbortController();
    document.addEventListener(
      "click",
      (event) => {
        if ((event.target as Element).closest(".floating-cta")) {
          event.preventDefault();
          navigated++;
        }
      },
      { signal: listeners.signal },
    );
    top.addEventListener("click", () => topClicks++);
    mountReceiverSwipe(group, twin);
  });

  afterEach(() => {
    listeners.abort();
    vi.useRealTimers();
  });

  it("lets a plain tap through", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointerup", 100, 200);
    link.click();
    expect(navigated).toBe(1);
    expect(group.dataset.swipe).toBeUndefined();
  });

  it("follows the finger on both layers and arms past the threshold", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointermove", 100, 180);
    expect(group.dataset.swipe).toBe("drag");
    expect(twin.dataset.swipe).toBe("drag");
    expect(twin.style.getPropertyValue("--lp-swipe")).toBe("20.0px");
    expect(link.setPointerCapture).toHaveBeenCalledWith(1);
    pointer(link, "pointermove", 100, 200 - SWIPE_THRESHOLD - 2);
    expect(group.dataset.swipe).toBe("armed");
  });

  it("springs back and swallows the click when released early", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointermove", 100, 180);
    pointer(link, "pointerup", 100, 180);
    link.click();
    vi.runAllTimers();
    expect(navigated).toBe(0);
    expect(group.dataset.swipe).toBeUndefined();
    expect(group.style.getPropertyValue("--lp-swipe")).toBe("0.0px");
  });

  it("picks up past the threshold: one navigation, the native click swallowed", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointermove", 100, 140);
    pointer(link, "pointerup", 100, 140);
    expect(group.dataset.swipe).toBe("answered");
    link.click(); // the click the browser sends after the drag
    expect(navigated).toBe(0);
    vi.runAllTimers();
    expect(navigated).toBe(1);
    expect(group.dataset.swipe).toBeUndefined();
  });

  it("keeps the drag when the icon loses its implicit touch capture", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointermove", 100, 180);
    // Taking the capture from the icon fires the loss on the icon; it bubbles.
    link.querySelector("svg")!.dispatchEvent(new Event("lostpointercapture", { bubbles: true }));
    expect(group.dataset.swipe).toBe("drag");
    link.dispatchEvent(new Event("lostpointercapture"));
    expect(group.dataset.swipe).toBeUndefined();
  });

  it("never touches the buttons above", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointermove", 100, 120);
    pointer(link, "pointerup", 100, 120);
    vi.runAllTimers();
    expect(topClicks).toBe(0);
  });

  it("does not let a swallowed click eat the next real tap", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointermove", 100, 180);
    pointer(link, "pointerup", 100, 180);
    // No click followed the drag (touch); the next tap must still work.
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointerup", 100, 200);
    link.click();
    expect(navigated).toBe(1);
  });
});
