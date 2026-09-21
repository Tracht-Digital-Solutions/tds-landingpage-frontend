// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * `<tds-brand-bar>` — the closing bar every example site embeds from
 * `https://tracht-digital.de/embed/tds-brand-bar.js`. One source, so the
 * demos cannot drift apart again; these tests are its contract.
 */
const source = readFileSync(join(__dirname, "..", "..", "public", "embed", "tds-brand-bar.js"), "utf8");

beforeAll(() => {
  new Function(source)();
});

function render(lang?: string) {
  const el = document.createElement("tds-brand-bar");
  if (lang) el.setAttribute("lang", lang);
  el.innerHTML = '<a href="https://tracht-digital.de/">Fallback</a>';
  document.body.append(el);
  return el.shadowRoot!;
}

describe("<tds-brand-bar>", () => {
  it("renders the brand, two actions and the three stripes", () => {
    const root = render("de");
    expect(root.querySelector(".name")?.textContent).toBe("Tracht Digital Solutions");
    expect(root.querySelectorAll(".stripes i")).toHaveLength(3);
    const links = [...root.querySelectorAll("a")];
    expect(links.map((a) => a.textContent?.trim())).toEqual(["Zur Website", "Zum Kontaktformular"]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "https://tracht-digital.de/",
      "https://tracht-digital.de/#contact",
    ]);
  });

  it("opens new tabs safely and keeps the visible words in the accessible name", () => {
    for (const a of render("de").querySelectorAll("a")) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
      expect(a.getAttribute("aria-label")).toContain(a.textContent!.trim());
    }
  });

  it("switches to English copy and the /en/ targets", () => {
    const root = render("en");
    expect([...root.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual([
      "https://tracht-digital.de/en/",
      "https://tracht-digital.de/en/#contact",
    ]);
    expect(root.textContent).toContain("Contact form");
  });

  it("defines itself once, even if a page loads the script twice", () => {
    expect(() => new Function(source)()).not.toThrow();
  });

  it("is a classic script with no imports (a cross-origin module would need CORS)", () => {
    expect(source).not.toMatch(/^\s*(import|export)\s/m);
  });

  it("uses legible type — no 8 px labels", () => {
    for (const [, size] of source.matchAll(/font-size:\s*(\d+)px/g)) {
      expect(Number(size)).toBeGreaterThanOrEqual(11);
    }
  });
});
