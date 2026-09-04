import { describe, expect, it } from "vitest";
import { resolveEvents } from "@tracht-digital-solutions/tds-shared/cache";

import { alwaysPaths, cacheEvents } from "./cache";
import { BUSINESS_CARD_SLUG } from "./businessCard";
import { serviceDefinitions, serviceHref } from "./services";
import { SITEMAP_ENTRIES } from "./sitemap";

/**
 * This site's route table, as the cache sees it.
 *
 * Worth testing precisely because nothing else can catch a mistake here. A
 * resolver that returns the wrong path rebuilds a page nobody was looking at
 * and leaves the changed one stale — a save that reports success and changes
 * nothing, which is the exact silence the page cache exists to remove.
 */
describe("cacheEvents", () => {
  const paths = async (events: Parameters<typeof resolveEvents>[1]) =>
    (await resolveEvents(cacheEvents, events)).paths;

  /** Every page of one language tree that renders editable landing content. */
  const contentPaths = (lang: "de" | "en") =>
    [
      ...(lang === "de" ? ["/", "/preise"] : ["/en/", "/en/preise"]),
      ...serviceDefinitions.map((service) => serviceHref(service, lang)),
      // The business card writes none of its own copy, but it renders the
      // CMS-driven footer, so a block save has to reach it like any other
      // page.
      BUSINESS_CARD_SLUG[lang],
    ].sort();

  it("rebuilds every content page of a language when a block is saved", async () => {
    // All of them, deliberately: `pricing` renders on /preise, in the home
    // page's teaser AND on each service page; `footer` and `contact` appear
    // everywhere. A service block additionally owns its own detail page, so
    // narrowing this would leave an edited service stale.
    expect(await paths([{ type: "block", id: "hero", lang: "de" }])).toEqual(contentPaths("de"));
    expect(await paths([{ type: "block", id: "hero", lang: "en" }])).toEqual(contentPaths("en"));
  });

  it("covers both language trees when the block event names no language", async () => {
    expect(await paths([{ type: "block", id: "footer" }])).toEqual(
      [...contentPaths("de"), ...contentPaths("en")].sort(),
    );
  });

  it("keeps a legal text off the home page", async () => {
    // These are content blocks like any other, but they render on their own
    // pages. Dragging a home-page render along would be harmless; missing
    // /legal/impressum would not.
    expect(await paths([{ type: "block", id: "legal_impressum", lang: "de" }])).toEqual([
      "/legal/impressum",
    ]);
    expect(await paths([{ type: "block", id: "legal_datenschutz", lang: "de" }])).toEqual([
      "/legal/datenschutz",
    ]);
  });

  it("has no English twin for the legal texts", async () => {
    // There is no /en/legal/impressum route. Emitting the path would make the
    // rebuild endpoint report a 404 for every save of that block.
    expect(await paths([{ type: "block", id: "legal_impressum", lang: "en" }])).toEqual([]);
  });

  it("rebuilds the AGB page AND its PDF endpoint", async () => {
    // The PDF is a server-rendered route streaming a CMS blob, not a static
    // file — a replaced upload has to invalidate both.
    expect(await paths([{ type: "legal", id: "agb", lang: "de" }])).toEqual([
      "/legal/agb",
      "/legal/agb.pdf",
    ]);
  });

  it("dates only the home page when a blog post is published", async () => {
    // The home page's Journal section reads /content/blog at render time, so a
    // published post changes this site too. It is the ONLY page that does —
    // rebuilding the service or pricing pages for a blog post would be work
    // nobody asked for.
    expect(await paths([{ type: "post", id: "mein-artikel", lang: "de" }])).toEqual(["/"]);
    expect(await paths([{ type: "post", id: "my-article", lang: "en" }])).toEqual(["/en/"]);
  });

  it("reports an event type it does not know instead of silently doing nothing", async () => {
    const result = await resolveEvents(cacheEvents, [{ type: "tool", id: "qr" }]);
    expect(result.paths).toEqual([]);
    expect(result.unknown).toEqual(["tool"]);
  });

  it("lists every indexable page in alwaysPaths", () => {
    // "Rebuild everything" can only enumerate what is already cached, so a
    // cold cache would otherwise report success having rendered nothing.
    //
    // The sitemap is the definition of "indexable" on this site, so it is the
    // honest source to check against: adding a page there without adding it
    // here is exactly the drift this test exists to catch.
    for (const entry of SITEMAP_ENTRIES) {
      expect(alwaysPaths, `missing ${entry.de}`).toContain(entry.de);
      expect(alwaysPaths, `missing ${entry.en}`).toContain(entry.en);
    }
  });

  it("rebuilds every indexable page when the exclusion list changes", async () => {
    // The list moves the `robots` meta of each page it touches, not just the
    // sitemap. Rebuilding only the sitemap would leave the excluded page
    // serving its old indexable head from cache — the omission visible in the
    // XML, the `noindex` nowhere, and nothing red.
    const result = await paths([{ type: "sitemap" }]);
    expect(result).toContain("/sitemap-0.xml");
    expect(result).toContain("/sitemap-index.xml");
    expect(result).toContain("/");
    expect(result).toContain("/en/");
    expect(result).toContain("/preise");
    expect(result).toContain(serviceHref(serviceDefinitions[0], "de"));
  });

  it("includes the sitemap in alwaysPaths now that it renders on demand", () => {
    // It used to be prerendered, so there was nothing to invalidate. The
    // panel's exclusion list is what made that untrue.
    expect(alwaysPaths).toContain("/sitemap-0.xml");
    expect(alwaysPaths).toContain("/sitemap-index.xml");
  });

  it("keeps alwaysPaths free of duplicates", () => {
    expect(alwaysPaths).toEqual([...new Set(alwaysPaths)]);
  });
});
