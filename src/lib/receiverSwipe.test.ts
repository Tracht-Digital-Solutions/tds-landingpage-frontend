// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  HOLD_DELAY,
  TRAVEL_MAX,
  TRAVEL_MIN,
  mountReceiverSwipe,
  startsSwipe,
  swipeOffset,
  swipeProgress,
  swipeTravel,
} from "./receiverSwipe";

describe("swipe arithmetic", () => {
  it("sizes the track to the room above, within one to two buttons", () => {
    expect(swipeTravel(10)).toBe(TRAVEL_MIN);
    expect(swipeTravel(60)).toBe(60);
    expect(swipeTravel(500)).toBe(TRAVEL_MAX);
  });

  it("follows an upward drag 1:1 and stops at the top of the track", () => {
    expect(swipeOffset(-20, 60)).toBe(0);
    expect(swipeOffset(30, 60)).toBe(30);
    expect(swipeOffset(200, 60)).toBe(60);
  });

  it("reports progress along the track", () => {
    expect(swipeProgress(0, 60)).toBe(0);
    expect(swipeProgress(30, 60)).toBe(0.5);
    expect(swipeProgress(90, 60)).toBe(1);
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

  // jsdom has no PointerEvent, no pointer capture and no layout: the track
  // comes out at TRAVEL_MIN.
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
        <span class="floating-cta-track"></span>
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

  it("lets a plain tap through without flashing the track", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointerup", 100, 200);
    vi.runAllTimers();
    link.click();
    expect(navigated).toBe(1);
    expect(group.dataset.swipe).toBeUndefined();
  });

  it("shows the track when the receiver is held", () => {
    pointer(link, "pointerdown", 100, 200);
    expect(group.dataset.swipe).toBeUndefined();
    vi.advanceTimersByTime(HOLD_DELAY);
    expect(group.dataset.swipe).toBe("hold");
    expect(twin.dataset.swipe).toBe("hold");
    expect(group.style.getPropertyValue("--lp-swipe-travel")).toBe(`${TRAVEL_MIN}px`);
    pointer(link, "pointerup", 100, 200);
    expect(group.dataset.swipe).toBeUndefined();
  });

  it("follows the finger on both layers", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointermove", 100, 180);
    expect(group.dataset.swipe).toBe("drag");
    expect(twin.style.getPropertyValue("--lp-swipe")).toBe("20.0px");
    expect(link.setPointerCapture).toHaveBeenCalledWith(1);
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

  it("opens the form the moment it reaches the top, finger still down", () => {
    pointer(link, "pointerdown", 100, 200);
    pointer(link, "pointermove", 100, 180);
    expect(navigated).toBe(0);
    pointer(link, "pointermove", 100, 200 - TRAVEL_MIN);
    expect(navigated).toBe(1);
    expect(group.dataset.swipe).toBe("answered");
    // Moving on and letting go does not navigate a second time.
    pointer(link, "pointermove", 100, 100);
    pointer(link, "pointerup", 100, 100);
    link.click(); // the click the browser sends after the drag
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
