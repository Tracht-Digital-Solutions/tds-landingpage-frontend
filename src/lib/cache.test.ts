import { describe, expect, it } from "vitest";
import { resolveEvents } from "@tracht-digital-solutions/tds-shared/cache";

import { alwaysPaths, cacheEvents } from "./cache";

/**
 * This site's route table, as the cache sees it.
 *
 * Worth testing precisely because nothing else can catch a mistake here. A
 * resolver that returns the wrong path rebuilds a page nobody was looking at
 * and leaves the changed one stale — a save that reports success and changes
 * nothing, which is the exact silence the page cache exists to remove.
 */
describe("cacheEvents", () => {
  const paths = (events: Parameters<typeof resolveEvents>[1]) =>
    resolveEvents(cacheEvents, events).paths;

  it("rebuilds both content pages of a language when a block is saved", () => {
    // Both, deliberately: `pricing` renders on /preise AND in the home page's
    // teaser, `footer` and `contact` appear on both.
    expect(paths([{ type: "block", id: "hero", lang: "de" }])).toEqual(["/", "/preise"]);
    expect(paths([{ type: "block", id: "hero", lang: "en" }])).toEqual(["/en/", "/en/preise"]);
  });

  it("covers both language trees when the block event names no language", () => {
    expect(paths([{ type: "block", id: "footer" }])).toEqual([
      "/",
      "/en/",
      "/en/preise",
      "/preise",
    ]);
  });

  it("keeps a legal text off the home page", () => {
    // These are content blocks like any other, but they render on their own
    // pages. Dragging a home-page render along would be harmless; missing
    // /legal/impressum would not.
    expect(paths([{ type: "block", id: "legal_impressum", lang: "de" }])).toEqual([
      "/legal/impressum",
    ]);
    expect(paths([{ type: "block", id: "legal_datenschutz", lang: "de" }])).toEqual([
      "/legal/datenschutz",
    ]);
  });

  it("has no English twin for the legal texts", () => {
    // There is no /en/legal/impressum route. Emitting the path would make the
    // rebuild endpoint report a 404 for every save of that block.
    expect(paths([{ type: "block", id: "legal_impressum", lang: "en" }])).toEqual([]);
  });

  it("rebuilds the AGB page AND its PDF endpoint", () => {
    // The PDF is a server-rendered route streaming a CMS blob, not a static
    // file — a replaced upload has to invalidate both.
    expect(paths([{ type: "legal", id: "agb", lang: "de" }])).toEqual([
      "/legal/agb",
      "/legal/agb.pdf",
    ]);
  });

  it("treats a published blog post as a change to this site too", () => {
    // The home page's Journal and Currently sections read /content/blog at
    // render time. Missing this is how the marketing page ends up advertising
    // last month's articles.
    expect(paths([{ type: "post", id: "mein-artikel", lang: "de" }])).toEqual(["/", "/preise"]);
  });

  it("reports an event type it does not know instead of silently doing nothing", () => {
    const result = resolveEvents(cacheEvents, [{ type: "tool", id: "qr" }]);
    expect(result.paths).toEqual([]);
    expect(result.unknown).toEqual(["tool"]);
  });

  it("lists every indexable page in alwaysPaths", () => {
    // "Rebuild everything" can only enumerate what is already cached, so a
    // cold cache would otherwise report success having rendered nothing.
    expect(alwaysPaths).toEqual(["/", "/en/", "/preise", "/en/preise"]);
  });
});
