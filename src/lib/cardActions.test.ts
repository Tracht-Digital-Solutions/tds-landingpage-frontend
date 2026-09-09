import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { cardActionUi } from "./cardActions";

/**
 * The footer bar, as the four card families are obliged to use it.
 *
 * Read as TEXT, like `previewLightbox.test.ts` and for its reason: every rule
 * below is silent when broken. The bar still renders, both links still work,
 * and only the geometry or the destination is quietly wrong — which is exactly
 * the class of mistake that survives a review.
 */
const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const cards = {
  DemoCard: read("src/components/ui/DemoCard.astro"),
  ReferenceCard: read("src/components/ui/ReferenceCard.astro"),
  BusinessCardTile: read("src/components/ui/BusinessCardTile.astro"),
};
const showcase = read("src/components/sections/Showcase.astro");
const websiteDemos = read("src/components/sections/WebsiteDemos.astro");
const serviceDetail = read("src/components/services/ServiceDetailPage.astro");

/** Leading spaces of the first line matching `needle`, or -1. */
function indentOf(source: string, needle: string | RegExp): number {
  const line = source.split("\n").find((candidate) => candidate.match(needle));
  if (line === undefined) return -1;
  return line.length - line.trimStart().length;
}

describe("the footer bar sits on the card, not in its body", () => {
  /**
   * The bar is bound to the card: full width, its own fill, one seam on top.
   *
   * That only holds while it is a SIBLING of the body. Moved inside, it
   * inherits the body's horizontal padding and becomes a tinted rectangle
   * floating in the middle of the card with a gap on either side — which looks
   * like a styling accident rather than a footer, and which nothing in the
   * build would complain about.
   */
  for (const [name, source] of Object.entries(cards)) {
    it(`${name} renders it beside the body`, () => {
      const body = indentOf(source, /<div class="[a-z-]+__body"/);
      const bar = indentOf(source, /<CardActions/);
      expect(body, "a card body").toBeGreaterThan(-1);
      expect(bar, "a footer bar").toBeGreaterThan(-1);
      expect(bar).toBe(body);
    });
  }
});

describe("the service link", () => {
  /**
   * A link back to the page you are standing on is a dead end.
   *
   * The demos and the business card sit on the Webauftritt detail page as
   * evidence for that very service. There, and only there, the bar carries no
   * service link — which is why the link is a prop and not something a card
   * looks up for itself.
   */
  it("is absent from the demos on their own service page", () => {
    expect(websiteDemos).toMatch(/variant === "service"\s*\?\s*null/);
  });

  it("is absent from the reference cards on a service page", () => {
    // The inline card there passes a call to action and nothing else.
    expect(serviceDetail).toMatch(/<CardActions lang=\{lang\} cta=\{referenceCta\(reference\)\} \/>/);
    expect(serviceDetail).not.toMatch(/<CardActions[^>]*service=/);
  });

  it("is present on the home page's shelf", () => {
    // Resolved once per render and handed down, not looked up per card.
    expect(showcase).toMatch(/getServiceById\("web-presence"\)/);
    expect(showcase).toMatch(/<DemoCard[^>]*serviceLink=\{webPresenceLink\}/s);
    expect(showcase).toMatch(/<BusinessCardTile serviceLink=\{webPresenceLink\}/);
  });

  /**
   * The primary service must not appear twice on one card.
   *
   * A reference case can name several services. The bar links the first; the
   * badges above it carry the REST. Rendering `card.services` there again
   * would repeat the bar's link directly above the bar, and the row would read
   * as the complete answer while it is the answer plus one.
   */
  it("is not repeated as a badge on the reference card", () => {
    expect(cards.ReferenceCard).toMatch(/furtherServices\.map/);
    expect(cards.ReferenceCard).not.toMatch(/card\.services\.map/);
  });
});

describe("the bar's own vocabulary", () => {
  it("has both languages for every word", () => {
    for (const [lang, words] of Object.entries(cardActionUi)) {
      for (const [key, value] of Object.entries(words)) {
        expect(value.trim(), `${lang}.${key}`).not.toBe("");
      }
    }
    expect(cardActionUi.de.service).not.toBe(cardActionUi.en.service);
  });
});
