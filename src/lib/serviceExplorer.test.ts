// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { afterClick, mountServiceExplorer, nextIndex } from "./serviceExplorer";

describe("nextIndex", () => {
  it("walks the titles with the arrow keys and wraps", () => {
    expect(nextIndex(0, "ArrowDown", 4)).toBe(1);
    expect(nextIndex(3, "ArrowDown", 4)).toBe(0);
    expect(nextIndex(0, "ArrowUp", 4)).toBe(3);
    expect(nextIndex(2, "Home", 4)).toBe(0);
    expect(nextIndex(1, "End", 4)).toBe(3);
    expect(nextIndex(1, "Enter", 4)).toBeNull();
  });
});

describe("afterClick", () => {
  it("always keeps a panel open on the desktop", () => {
    expect(afterClick(1, 1, true)).toBe(1);
    expect(afterClick(1, 2, true)).toBe(2);
  });
  it("closes the open panel on a second click in the accordion", () => {
    expect(afterClick(1, 1, false)).toBeNull();
    expect(afterClick(null, 2, false)).toBe(2);
  });
});

describe("mountServiceExplorer", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() }));
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
      },
    );
    document.body.innerHTML = `
      <div data-service-explorer>
        ${[0, 1, 2]
          .map(
            (i) => `<h3><button data-explorer-button aria-expanded="true" aria-controls="p${i}">T${i}</button></h3>
                    <div id="p${i}">Panel ${i}</div>`,
          )
          .join("")}
      </div>`;
  });

  it("opens the first panel and hides the rest once it runs", () => {
    const root = document.querySelector<HTMLElement>("[data-service-explorer]")!;
    mountServiceExplorer(root);
    const buttons = [...root.querySelectorAll("button")];
    expect(buttons.map((b) => b.getAttribute("aria-expanded"))).toEqual(["true", "false", "false"]);
    expect(document.getElementById("p1")!.hidden).toBe(true);
    expect(root.dataset.enhanced).toBe("true");
  });

  it("switches and closes panels on click (accordion)", () => {
    const root = document.querySelector<HTMLElement>("[data-service-explorer]")!;
    const onOpen = vi.fn();
    mountServiceExplorer(root, { onOpen });
    const buttons = [...root.querySelectorAll("button")];
    buttons[2]!.click();
    expect(document.getElementById("p2")!.hidden).toBe(false);
    expect(document.getElementById("p0")!.hidden).toBe(true);
    expect(onOpen).toHaveBeenCalledWith(document.getElementById("p2"));
    buttons[2]!.click();
    expect(buttons.every((b) => b.getAttribute("aria-expanded") === "false")).toBe(true);
  });
});

describe("the markup", () => {
  const src = readFileSync(resolve(process.cwd(), "src/components/ui/ServiceExplorer.astro"), "utf8");

  it("is a disclosure: an h3 around a button that controls its region", () => {
    expect(src).toMatch(/<h3[^>]*>\s*<button[\s\S]*?aria-expanded="true"[\s\S]*?aria-controls=/);
    expect(src).toMatch(/role="region"/);
    // Server-rendered open: `hidden` is only ever set by the script.
    expect(src).not.toMatch(/class="svc-explorer__panel"[^>]*\shidden/);
  });

  it("names every detail link after its service", () => {
    expect(src).toMatch(/<span class="sr-only">: \{service\.title\}<\/span>/);
  });
});
