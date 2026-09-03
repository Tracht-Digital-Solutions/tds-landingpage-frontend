import { describe, expect, it, vi } from "vitest";
import {
  demoDefinitions,
  demoSnapshot,
  filterReachable,
  getDemos,
  resolveSnapshotDemos,
  type DemoDefinition,
  type DemoSnapshot,
  type DemoSnapshotEntry,
  type ResolvedDemo,
} from "./demos";

/**
 * The rule under test is a business rule, not a rendering detail: a demo that
 * is not available is not loaded and not shown. It has two halves — what the
 * sync script recorded, and whether the host answers right now — and both are
 * exercised here without a network.
 */

function entry(overrides: Partial<DemoSnapshotEntry> = {}): DemoSnapshotEntry {
  return {
    status: "ok",
    title: "Beispielseite",
    description: "Eine Beschreibung, die von der Demo selbst stammt.",
    siteLang: "de",
    favicon: "/demos/demo1-favicon.png",
    preview: "/demos/demo1.webp",
    previewWidth: 1440,
    previewHeight: 900,
    checkedAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}

function snapshotOf(entries: Record<string, DemoSnapshotEntry>): DemoSnapshot {
  return { generatedAt: "2026-09-01T00:00:00.000Z", demos: entries };
}

const one = [demoDefinitions[0]!] as readonly DemoDefinition[];

describe("the committed catalog", () => {
  it("has a unique id and number per demo", () => {
    const ids = demoDefinitions.map((demo) => demo.id);
    const numbers = demoDefinitions.map((demo) => demo.number);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("only ever links to https on our own domain", () => {
    for (const demo of demoDefinitions) {
      const url = new URL(demo.url);
      expect(url.protocol).toBe("https:");
      expect(url.hostname).toBe(demo.host);
      expect(demo.host.endsWith(".tracht-digital.de")).toBe(true);
    }
  });

  /**
   * Adding a demo to the catalog without re-running `npm run demos:sync`
   * leaves it with no entry at all. That case is already handled — it renders
   * nothing — but silently, and "my new demo does not show up" is a much
   * worse afternoon than a red test.
   */
  it("has a snapshot entry for every definition", () => {
    for (const demo of demoDefinitions) {
      expect(Object.keys(demoSnapshot.demos)).toContain(demo.id);
    }
  });
});

describe("resolveSnapshotDemos", () => {
  it("keeps a complete, ok entry", () => {
    const resolved = resolveSnapshotDemos(snapshotOf({ demo1: entry() }), one);
    expect(resolved).toHaveLength(1);
    expect(resolved[0]!.title).toBe("Beispielseite");
    expect(resolved[0]!.definition.host).toBe("demo1.tracht-digital.de");
  });

  it.each([
    ["placeholder", "a hosting placeholder page"],
    ["control-panel", "the hosting control panel"],
    ["tls-invalid", "a certificate the browser rejects"],
    ["unreachable", "a host that did not answer"],
    ["http-404", "an error response"],
  ])("drops a demo recorded as %s (%s)", (status) => {
    const resolved = resolveSnapshotDemos(snapshotOf({ demo1: entry({ status }) }), one);
    expect(resolved).toEqual([]);
  });

  /**
   * An unrecognised status must fail closed. Trusting anything that is not a
   * known failure would let a status added in a later version render as a
   * working card on a build that predates it.
   */
  it("drops a demo whose status it does not recognise", () => {
    const resolved = resolveSnapshotDemos(snapshotOf({ demo1: entry({ status: "redirect-loop" }) }), one);
    expect(resolved).toEqual([]);
  });

  it("drops an ok demo with no screenshot", () => {
    expect(resolveSnapshotDemos(snapshotOf({ demo1: entry({ preview: null }) }), one)).toEqual([]);
    expect(resolveSnapshotDemos(snapshotOf({ demo1: entry({ preview: "  " }) }), one)).toEqual([]);
  });

  it("drops an ok demo with no title", () => {
    expect(resolveSnapshotDemos(snapshotOf({ demo1: entry({ title: null }) }), one)).toEqual([]);
  });

  it("drops a demo with no entry at all", () => {
    expect(resolveSnapshotDemos(snapshotOf({}), one)).toEqual([]);
  });

  /**
   * No description is a legitimate state — the demo has no meta description —
   * and the card then shows only its name. What must never happen is a
   * substitute sentence appearing from somewhere.
   */
  it("keeps a demo that has no description, as null", () => {
    const resolved = resolveSnapshotDemos(snapshotOf({ demo1: entry({ description: null }) }), one);
    expect(resolved).toHaveLength(1);
    expect(resolved[0]!.description).toBeNull();
  });

  it("falls back to the standard preview box on an older snapshot", () => {
    const resolved = resolveSnapshotDemos(
      snapshotOf({ demo1: entry({ previewWidth: null, previewHeight: null }) }),
      one,
    );
    expect(resolved[0]!.previewWidth).toBe(1440);
    expect(resolved[0]!.previewHeight).toBe(900);
  });

  it("preserves catalog order rather than snapshot key order", () => {
    const resolved = resolveSnapshotDemos(
      snapshotOf({ demo3: entry(), demo1: entry(), demo2: entry() }),
      demoDefinitions.slice(0, 3),
    );
    expect(resolved.map((demo) => demo.definition.id)).toEqual(["demo1", "demo2", "demo3"]);
  });
});

describe("filterReachable", () => {
  const demos = (ids: string[]): ResolvedDemo[] =>
    ids.map((id) => ({
      definition: demoDefinitions.find((demo) => demo.id === id)!,
      title: id,
      description: null,
      siteLang: null,
      favicon: null,
      preview: `/demos/${id}.webp`,
      previewWidth: 1440,
      previewHeight: 900,
    }));

  it("keeps only the demos that answer", async () => {
    const reachable = await filterReachable(demos(["demo1", "demo2", "demo3"]), async (demo) =>
      demo.definition.id !== "demo2",
    );
    expect(reachable.map((demo) => demo.definition.id)).toEqual(["demo1", "demo3"]);
  });

  /**
   * The failure this guards against is the expensive one: an unhandled
   * rejection from a probe would take down the render of the whole page, so a
   * demo going offline would blank the home page rather than one card.
   */
  it("drops only the demo whose probe rejects, and never throws", async () => {
    const reachable = await filterReachable(demos(["demo1", "demo2"]), async (demo) => {
      if (demo.definition.id === "demo1") throw new Error("CERT_HAS_EXPIRED");
      return true;
    });
    expect(reachable.map((demo) => demo.definition.id)).toEqual(["demo2"]);
  });

  it("treats a probe that resolves to anything but true as unavailable", async () => {
    const reachable = await filterReachable(demos(["demo1"]), async () => false);
    expect(reachable).toEqual([]);
  });

  it("probes in parallel rather than one timeout after another", async () => {
    const started: string[] = [];
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    const pending = filterReachable(demos(["demo1", "demo2", "demo3"]), async (demo) => {
      started.push(demo.definition.id);
      await gate;
      return true;
    });

    await Promise.resolve();
    expect(started).toHaveLength(3);
    release();
    await pending;
  });

  it("does nothing when there is nothing to probe", async () => {
    const probe = vi.fn();
    expect(await filterReachable([], probe)).toEqual([]);
    expect(probe).not.toHaveBeenCalled();
  });
});

describe("getDemos", () => {
  it("returns nothing when no demo is presentable, and probes nothing", async () => {
    const probe = vi.fn();
    const demos = await getDemos({
      snapshot: snapshotOf({ demo1: entry({ status: "tls-invalid" }) }),
      definitions: one,
      probe,
      cache: false,
    });
    expect(demos).toEqual([]);
    // The point of the early return: an unavailable demo is not LOADED either.
    expect(probe).not.toHaveBeenCalled();
  });

  it("combines both halves of the rule", async () => {
    const demos = await getDemos({
      snapshot: snapshotOf({
        demo1: entry(),
        demo2: entry({ status: "placeholder" }),
        demo3: entry(),
      }),
      definitions: demoDefinitions.slice(0, 3),
      probe: async (demo) => demo.definition.id !== "demo3",
      cache: false,
    });
    expect(demos.map((demo) => demo.definition.id)).toEqual(["demo1"]);
  });

  /**
   * The state the site actually ships in today: five hosts, of which only the
   * ones `npm run demos:sync` found presentable render. When that is none, the
   * section renders nothing at all.
   */
  it("returns nothing for the committed snapshot when nothing qualifies", async () => {
    const presentable = resolveSnapshotDemos();
    if (presentable.length === 0) {
      expect(await getDemos({ probe: async () => true, cache: false })).toEqual([]);
    } else {
      // Once real demos are synced this branch takes over and asserts the
      // committed snapshot is renderable rather than half-filled.
      for (const demo of presentable) {
        expect(demo.preview.startsWith("/demos/")).toBe(true);
        expect(demo.title.length).toBeGreaterThan(0);
      }
    }
  });
});

/**
 * The half of the snapshot that lives outside the JSON.
 *
 * `demos:sync` writes `demoData.json` AND the files under `public/demos/`, and
 * only the JSON is tracked by default — a sync committed without its assets
 * ships a card whose screenshot 404s. Nothing else would catch it: the entry
 * is perfectly well formed, `getDemos()` returns it, and the page renders an
 * empty box. So the paths in the committed snapshot are checked against disk.
 */
describe("the committed assets", () => {
  it("has every file the committed snapshot points at", async () => {
    const fs = await import("node:fs/promises");
    const { fileURLToPath } = await import("node:url");
    const publicDir = fileURLToPath(new URL("../../public/", import.meta.url));

    for (const demo of resolveSnapshotDemos()) {
      const paths = [demo.preview, demo.favicon].filter(
        (value): value is string => typeof value === "string" && value !== "",
      );
      for (const publicPath of paths) {
        const file = publicDir + publicPath.replace(/^\//, "");
        await expect(
          fs.access(file),
          `${demo.definition.id}: ${publicPath} is in demoData.json but not on disk`,
        ).resolves.toBeUndefined();
      }
    }
  });
});
