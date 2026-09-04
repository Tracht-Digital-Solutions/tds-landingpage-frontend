/**
 * How a service page's references resolve against the CMS.
 *
 * Three states that look alike from the outside and must not behave alike.
 * The dangerous one is the third: before there were committed cases, an empty
 * list was the ONLY state, so "hide the section" and "nothing published yet"
 * were the same thing. Now that a case ships in code, an editor who empties
 * the list in the panel is making a decision, and it has to survive.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./cms", () => ({
  cmsFor: vi.fn(async (_section: string, _lang: string, fallback: unknown) => fallback),
  fetchBlocks: vi.fn(async () => ({})),
}));

const cms = await import("./cms");
const { getServiceById, resolveServiceContent } = await import("./services");
const { referencesForService } = await import("./references");

const service = getServiceById("web-presence");
const committed = referencesForService("web-presence", "de");

beforeEach(() => {
  vi.mocked(cms.fetchBlocks).mockReset();
  vi.mocked(cms.fetchBlocks).mockResolvedValue({});
});

describe("resolveServiceContent — references", () => {
  it("has the committed cases the assertions below assume", () => {
    // Guards the fixture: every assertion below is vacuous without this, and
    // the shape matters as much as the count. Position 0 must be the case with
    // a journal article, position 1 the named one with a customer site —
    // reorder the catalog and these tests would keep passing while proving
    // something else.
    expect(committed.length).toBeGreaterThan(1);
    expect(committed[0].articleUrl).toBeTruthy();
    expect(committed[0].siteUrl).toBeUndefined();
    expect(committed[1].siteUrl).toBeTruthy();
  });

  it("renders the committed cases when the block has no references key", async () => {
    vi.mocked(cms.fetchBlocks).mockResolvedValue({
      service_web_presence: { title: "Webauftritt" },
    } as never);

    const content = await resolveServiceContent(service, "de");
    expect(content.references).toEqual(committed);
  });

  it("renders them when there is no block for this service at all", async () => {
    const content = await resolveServiceContent(service, "de");
    expect(content.references).toEqual(committed);
  });

  it("keeps every code-owned link when the panel rewrites the text", async () => {
    // Two entries, not one: the merge maps over the CMS list, so a one-entry
    // override would truncate the result and never reach the named case at
    // position 1 — the only place the customer link can be proven to survive.
    const edited = {
      context: "Kontext",
      challenge: "Ausgangslage",
      solution: "Lösungsweg",
      result: "Ergebnis",
      metric: "",
    };
    vi.mocked(cms.fetchBlocks).mockResolvedValue({
      service_web_presence: {
        references: [
          { ...edited, title: "Im Panel umformuliert" },
          { ...edited, title: "Ebenfalls umformuliert" },
        ],
      },
    } as never);

    const content = await resolveServiceContent(service, "de");
    expect(content.references[0].title).toBe("Im Panel umformuliert");
    expect(content.references[0].articleUrl).toBe(committed[0].articleUrl);
    expect(content.references[1].title).toBe("Ebenfalls umformuliert");
    expect(content.references[1].siteUrl).toBe(committed[1].siteUrl);
  });

  it("never takes a destination from the CMS", async () => {
    // Three entries, each carrying both kinds of link, because the interesting
    // positions are now different from one another: one committed case with an
    // article, one named committed case with a customer site, and one past the
    // end of the committed list.
    const hostile = {
      context: "c",
      challenge: "c",
      solution: "c",
      result: "c",
      metric: "",
      articleUrl: "https://example.invalid/anywhere",
      siteUrl: "https://example.invalid/anywhere",
    };
    vi.mocked(cms.fetchBlocks).mockResolvedValue({
      service_web_presence: {
        references: [
          { ...hostile, title: "A" },
          { ...hostile, title: "B" },
          { ...hostile, title: "C" },
        ],
      },
    } as never);

    const references = (await resolveServiceContent(service, "de")).references;

    // The committed article link wins — and no customer site is bolted onto an
    // anonymised case. That second assertion is the one that matters now that
    // naming a customer is possible at all: it must not be reachable from the
    // panel.
    expect(references[0].articleUrl).toBe(committed[0].articleUrl);
    expect(references[0].siteUrl).toBeUndefined();

    // The committed customer link wins over the supplied one, rather than
    // merely coexisting with it.
    expect(references[1].siteUrl).toBe(committed[1].siteUrl);
    expect(references[1].siteUrl).not.toBe(hostile.siteUrl);
    expect(references[1].articleUrl).toBeUndefined();

    // Past the committed list: an editor may add a case, never a destination
    // for it. This position is what keeps the rule under test as the catalog
    // grows — the ones above stop proving it as soon as something committed
    // sits behind them.
    expect(references[2].articleUrl).toBeUndefined();
    expect(references[2].siteUrl).toBeUndefined();
  });

  it("hides the section on an EXPLICITLY empty list", async () => {
    vi.mocked(cms.fetchBlocks).mockResolvedValue({
      service_web_presence: { references: [] },
    } as never);

    const content = await resolveServiceContent(service, "de");
    expect(content.references).toEqual([]);
  });

  it("falls back to the committed cases when one CMS entry is malformed", async () => {
    // `validateServiceReferences` rejects the list as a unit; the committed
    // cases must reappear rather than the page losing its references.
    vi.mocked(cms.fetchBlocks).mockResolvedValue({
      service_web_presence: {
        references: [{ title: "Unvollständig" }],
      },
    } as never);

    const content = await resolveServiceContent(service, "de");
    expect(content.references).toEqual(committed);
  });

  it("shows nothing for a service no case names, unchanged from before", async () => {
    const content = await resolveServiceContent(getServiceById("consulting"), "de");
    expect(content.references).toEqual([]);
  });

  it("resolves the English twin with English copy and an English article link", async () => {
    const content = await resolveServiceContent(service, "en");
    expect(content.references[0]).toEqual(referencesForService("web-presence", "en")[0]);
    expect(content.references[0].articleUrl).toContain("/en/");
  });
});
