/**
 * The hero slider's slides.
 *
 * What is worth pinning here is not the shape of an object — the type already
 * does that — but the promises the hero makes, every one of which fails
 * silently. A hero that quietly drops a case still renders. A hero that quietly
 * keeps a demo whose certificate expired still renders, and looks exactly like
 * a working one right up until somebody clicks it. A hero that opens on a
 * paragraph of text instead of a picture still renders.
 *
 * The slides are built from two sources that are already tested in depth
 * (`demos.test.ts`, `references.test.ts`). This file tests the JOIN: what the
 * hero takes from each, what it refuses, and in what order.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_KINDS, demoDefinitions } from "./demoCatalog";
import type { ResolvedDemo } from "./demos";
import type { ResolvedPreview } from "./referencePreviews";
import { referenceCases } from "./references";
import { getServiceById, serviceHref } from "./services";

// `getDemos()` probes the network and `getReferencePreviews()` probes it and
// reads consent. Both are exhaustively covered where they live; here they are
// the two taps this module opens, so they are stubbed and the join is what is
// under test. `importOriginal` keeps the pure helpers and the microcopy real.
const getDemosMock = vi.hoisted(() => vi.fn());
const getPreviewsMock = vi.hoisted(() => vi.fn());

vi.mock("./demos", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./demos")>()),
  getDemos: getDemosMock,
}));
vi.mock("./referencePreviews", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./referencePreviews")>()),
  getReferencePreviews: getPreviewsMock,
}));

const { getHeroSlides, leadWithPicture, toDemoSlide, toReferenceSlide, heroSlideUi } =
  await import("./heroSlides");
const { demoUi, resolveSnapshotDemos } = await import("./demos");

const LANGS = ["de", "en"] as const;

/** A presentable demo, built from a real definition so the ids stay real. */
function demoFixture(id: string, overrides: Partial<ResolvedDemo> = {}): ResolvedDemo {
  const definition = demoDefinitions.find((entry) => entry.id === id)!;
  return {
    definition,
    title: `${id} title`,
    description: `${id} description`,
    siteLang: "de",
    favicon: `/demos/${id}-favicon.svg`,
    preview: `/demos/${id}.webp`,
    previewWidth: 1440,
    previewHeight: 900,
    ...overrides,
  };
}

function textSlide(id: string) {
  return { id, image: null } as Parameters<typeof leadWithPicture>[0][number];
}
function pictureSlide(id: string) {
  return { id, image: `/demos/${id}.webp` } as Parameters<typeof leadWithPicture>[0][number];
}

beforeEach(() => {
  // The safe default is "nothing is available": a test that forgets to say
  // what is live must not accidentally assert against a live network.
  getDemosMock.mockReset().mockResolvedValue([]);
  getPreviewsMock.mockReset().mockResolvedValue(new Map<string, ResolvedPreview>());
});

describe("toDemoSlide", () => {
  it.each(LANGS)("quotes the demo and never writes for it (%s)", (lang) => {
    const demo = demoFixture("demo3");
    const slide = toDemoSlide(demo, lang);

    // The title and the sentence are the DEMO's own words, harvested by the
    // sync. Nothing here may put words in a site's mouth.
    expect(slide.title).toBe(demo.title);
    expect(slide.summary).toBe(demo.description);
    expect(slide.image).toBe(demo.preview);
  });

  it("shows no description when the demo publishes none", () => {
    const slide = toDemoSlide(demoFixture("demo1", { description: null }), "de");
    // Empty, not a stand-in sentence. The renderer drops the paragraph.
    expect(slide.summary).toBe("");
  });

  it.each(LANGS)("labels the genre from the closed vocabulary (%s)", (lang) => {
    const demo = demoFixture("demo2");
    expect(toDemoSlide(demo, lang).eyebrow).toBe(DEMO_KINDS[demo.definition.kind][lang]);
    // The one code-owned string on a demo card names the GENRE. If this ever
    // reads like a description of the demo's subject, the rule has been broken.
    expect(Object.values(DEMO_KINDS).map((kind) => kind[lang])).toContain(
      toDemoSlide(demo, lang).eyebrow,
    );
  });

  it.each(LANGS)("links to the demo's own host, off this site (%s)", (lang) => {
    const demo = demoFixture("demo3");
    const slide = toDemoSlide(demo, lang);

    expect(slide.href).toBe(demo.definition.url);
    expect(slide.href.startsWith("https://")).toBe(true);
    // External, so the renderer adds target/rel and the new-tab hint. A demo
    // opening in place would navigate the visitor off the landing page.
    expect(slide.external).toBe(true);
    expect(slide.cta).toBe(demoUi[lang].visit);
    expect(slide.chips).toEqual([demo.definition.host]);
  });
});

describe("toReferenceSlide", () => {
  const [primaryCase] = referenceCases;

  it.each(LANGS)("carries the case's own context and result (%s)", (lang) => {
    const content = primaryCase!.content[lang];
    const slide = toReferenceSlide(primaryCase!, lang, null);

    expect(slide.eyebrow).toBe(content.context);
    expect(slide.title).toBe(content.title);
    // The outcome, not the problem — see the note on the builder.
    expect(slide.summary).toBe(content.result);
  });

  it.each(LANGS)("links into the right locale tree, internally (%s)", (lang) => {
    const slide = toReferenceSlide(primaryCase!, lang, null);
    const service = getServiceById(primaryCase!.services[0]!);

    expect(slide.href).toBe(serviceHref(service, lang));
    // Relative and localized. An absolute URL here would leave the locale
    // behind and send an English reader to the German page.
    expect(slide.href.startsWith(lang === "en" ? "/en/" : "/leistungen/")).toBe(true);
    expect(slide.external).toBe(false);
    expect(slide.cta).toBe(heroSlideUi[lang].more);
  });

  it("shows a metric only when the case reports one", () => {
    const withMetric = referenceCases.find((entry) => entry.content.de.metric.trim() !== "");
    const without = referenceCases.find((entry) => entry.content.de.metric.trim() === "");

    expect(toReferenceSlide(withMetric!, "de", null).chips).toEqual([
      withMetric!.content.de.metric,
    ]);
    // An empty metric is not a chip. A blank pill is a rendering artefact.
    expect(toReferenceSlide(without!, "de", null).chips).toEqual([]);
  });

  it("shows no screenshot without a resolved preview", () => {
    // `getReferencePreviews()` already enforces consent AND liveness; a case
    // that did not clear both arrives here as `null` and renders text only.
    const slide = toReferenceSlide(primaryCase!, "de", null);
    expect(slide.image).toBeNull();
    expect(slide.imageWidth).toBeNull();
  });

  it("uses the preview it is given", () => {
    const preview: ResolvedPreview = {
      id: primaryCase!.id,
      src: "/references/case.webp",
      width: 1440,
      height: 900,
    };
    const slide = toReferenceSlide(primaryCase!, "de", preview);
    expect(slide.image).toBe(preview.src);
    expect(slide.imageWidth).toBe(preview.width);
  });
});

describe("leadWithPicture", () => {
  it("hoists the first slide that carries a picture", () => {
    const order = leadWithPicture([textSlide("a"), textSlide("b"), pictureSlide("c")]);
    expect(order.map((slide) => slide.id)).toEqual(["c", "a", "b"]);
  });

  it("leaves an order that already opens on a picture alone", () => {
    const order = leadWithPicture([pictureSlide("a"), textSlide("b"), pictureSlide("c")]);
    expect(order.map((slide) => slide.id)).toEqual(["a", "b", "c"]);
  });

  it("leaves an all-text shelf in its own order", () => {
    // Not a failure: every case is anonymised and every demo can be down.
    const order = leadWithPicture([textSlide("a"), textSlide("b")]);
    expect(order.map((slide) => slide.id)).toEqual(["a", "b"]);
  });

  it("does not mutate its input", () => {
    const input = [textSlide("a"), pictureSlide("b")];
    leadWithPicture(input);
    expect(input.map((slide) => slide.id)).toEqual(["a", "b"]);
  });
});

describe("getHeroSlides", () => {
  it.each(LANGS)("joins every case with every available demo (%s)", async (lang) => {
    getDemosMock.mockResolvedValue([demoFixture("demo2"), demoFixture("demo3")]);
    getPreviewsMock.mockResolvedValue(new Map<string, ResolvedPreview>());

    const slides = await getHeroSlides(lang);

    expect(slides).toHaveLength(referenceCases.length + 2);
    expect(new Set(slides.map((slide) => slide.id)).size).toBe(slides.length);
    for (const entry of referenceCases) {
      expect(slides.some((slide) => slide.id === `reference:${entry.id}`)).toBe(true);
    }
  });

  it("never shows a demo that failed its availability check", async () => {
    // THE rule of this feature. `getDemos()` decides; the hero does not get a
    // "show it anyway" path, least of all in the first thing a visitor touches.
    getDemosMock.mockResolvedValue([]);

    const slides = await getHeroSlides("de");
    expect(slides.every((slide) => slide.kind === "reference")).toBe(true);
  });

  it("opens on a slide that shows something", async () => {
    getDemosMock.mockResolvedValue([demoFixture("demo3")]);
    const slides = await getHeroSlides("de");
    expect(slides[0]!.image).not.toBeNull();
  });

  it("never emits a slide with nothing to render", async () => {
    // `Hero.tsx` drops its whole second column on an empty list, so the
    // dangerous state is not "empty" — it is a slide that exists but has no
    // title, no link or no label, which renders as a blank card with dots.
    getDemosMock.mockResolvedValue([demoFixture("demo2"), demoFixture("demo3")]);

    for (const slide of await getHeroSlides("de")) {
      expect(slide.title.trim(), slide.id).not.toBe("");
      expect(slide.eyebrow.trim(), slide.id).not.toBe("");
      expect(slide.href.trim(), slide.id).not.toBe("");
      expect(slide.cta.trim(), slide.id).not.toBe("");
      // A slide with a picture must be able to describe it.
      if (slide.image !== null) expect(slide.imageAlt.trim(), slide.id).not.toBe("");
    }
  });
});

describe("the demos the hero currently shows", () => {
  /**
   * Pins the CURRENT committed snapshot, deliberately — the same kind of check
   * `demos.test.ts` makes about assets.
   *
   * `demo2` and `demo3` are asked for by name. `demo2` is only presentable
   * because its catalog entry points past its language gate at `/de/`, and
   * `demo3` only because its certificate was repaired; both are one expired
   * certificate away from silently vanishing from the hero. A sync that drops
   * either should be a decision somebody reads, not a diff nobody noticed.
   *
   * It asserts presence, never absence: `demo4` and `demo5` coming back is a
   * good day, not a test failure.
   */
  it("has demo2 and demo3 presentable in the committed snapshot", () => {
    const presentable = resolveSnapshotDemos().map((demo) => demo.definition.id);
    expect(presentable).toContain("demo2");
    expect(presentable).toContain("demo3");
  });

  it.each(LANGS)("turns them into slides that link to them (%s)", (lang) => {
    const wanted = resolveSnapshotDemos().filter((demo) =>
      ["demo2", "demo3"].includes(demo.definition.id),
    );

    for (const demo of wanted) {
      const slide = toDemoSlide(demo, lang);
      expect(slide.href).toBe(demo.definition.url);
      expect(slide.href).toContain(demo.definition.host);
      expect(slide.image).not.toBeNull();
      expect(slide.title.trim()).not.toBe("");
    }
  });
});
