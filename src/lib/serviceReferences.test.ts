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
  it("has a committed case to work with at all", () => {
    // Guards the fixture: every assertion below is vacuous without this.
    expect(committed.length).toBeGreaterThan(0);
    expect(committed[0].articleUrl).toBeTruthy();
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

  it("keeps the code-owned link when the panel rewrites the text", async () => {
    vi.mocked(cms.fetchBlocks).mockResolvedValue({
      service_web_presence: {
        references: [
          {
            title: "Im Panel umformuliert",
            context: "Kontext",
            challenge: "Ausgangslage",
            solution: "Lösungsweg",
            result: "Ergebnis",
            metric: "",
          },
        ],
      },
    } as never);

    const content = await resolveServiceContent(service, "de");
    expect(content.references[0].title).toBe("Im Panel umformuliert");
    expect(content.references[0].articleUrl).toBe(committed[0].articleUrl);
  });

  it("never takes a link from the CMS", async () => {
    vi.mocked(cms.fetchBlocks).mockResolvedValue({
      service_web_presence: {
        references: [
          {
            title: "A",
            context: "c",
            challenge: "c",
            solution: "c",
            result: "c",
            metric: "",
            articleUrl: "https://example.invalid/anywhere",
          },
          {
            title: "B",
            context: "c",
            challenge: "c",
            solution: "c",
            result: "c",
            metric: "",
            articleUrl: "https://example.invalid/anywhere",
          },
        ],
      },
    } as never);

    const content = await resolveServiceContent(service, "de");
    expect(content.references[0].articleUrl).toBe(committed[0].articleUrl);
    // Position 1 has no committed case behind it, so it gets no link — the
    // CMS value is dropped rather than trusted.
    expect(content.references[1].articleUrl).toBeUndefined();
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
    const content = await resolveServiceContent(getServiceById("complete-it"), "de");
    expect(content.references).toEqual([]);
  });

  it("resolves the English twin with English copy and an English article link", async () => {
    const content = await resolveServiceContent(service, "en");
    expect(content.references[0]).toEqual(referencesForService("web-presence", "en")[0]);
    expect(content.references[0].articleUrl).toContain("/en/");
  });
});
