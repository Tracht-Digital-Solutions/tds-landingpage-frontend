import { describe, expect, it } from "vitest";
import {
  CATALOGUE,
  CATALOGUE_PRODUCTS,
  CATEGORY_IDS,
  FINDER_COPY,
  FINDER_SECTION,
  MAX_MATCHES,
  STAGE_IDS,
  TOPIC_IDS,
  buildDraft,
  recommend,
  situationOptions,
  topicWords,
  type FinderAnswers,
} from "./serviceFinder";

const answers = (over: Partial<FinderAnswers> = {}): FinderAnswers => ({
  topics: [],
  situations: [],
  stage: null,
  ...over,
});

const ids = (result: ReturnType<typeof recommend>) => result.map((match) => match.productId);

describe("the catalogue", () => {
  it("names only products it lists, in their own category", () => {
    const known = new Map(CATALOGUE_PRODUCTS.map((product) => [product.id, product.category]));
    for (const id of CATEGORY_IDS) {
      const pointed = [...CATALOGUE[id].lead, ...CATALOGUE[id].situations.flatMap((situation) => situation.products)];
      for (const product of pointed) expect(known.get(product), product).toBe(id);
    }
  });

  it("has a slug and a title per language", () => {
    for (const product of CATALOGUE_PRODUCTS) {
      for (const value of [product.slug.de, product.slug.en, product.title.de, product.title.en]) {
        expect(value, product.id).toBeTruthy();
      }
    }
    expect(new Set(CATALOGUE_PRODUCTS.map((product) => product.slug.en)).size).toBe(CATALOGUE_PRODUCTS.length);
  });
});

describe("recommend", () => {
  it.each(CATEGORY_IDS)("starts %s with that category's products", (id) => {
    expect(ids(recommend(answers({ topics: [id] }), "de"))).toEqual(CATALOGUE[id].lead);
  });

  it("puts what a recognised situation names first", () => {
    const [spam] = situationOptions(["e-mail-domain"], "de").slice(1);
    const result = recommend(answers({ topics: ["e-mail-domain"], situations: [spam!] }), "de");
    expect(ids(result)[0]).toBe("spf-dkim-dmarc-einrichten");
  });

  it("gives the visitor's own choices as the reasons", () => {
    const [form] = situationOptions(["digitalisierung"], "de").slice(0, 1);
    const match = recommend(answers({ topics: ["digitalisierung"], situations: [form!] }), "de").find(
      (item) => item.productId === "online-formular-statt-papier",
    );
    expect(match?.reasons).toEqual([CATALOGUE.digitalisierung.topic.de, "Formulare laufen auf Papier."]);
  });

  it("shows a handful at most", () => {
    const all = situationOptions(["webauftritt", "seo-sichtbarkeit"], "de");
    expect(recommend(answers({ topics: ["webauftritt", "seo-sichtbarkeit"], situations: all }), "de").length).toBeLessThanOrEqual(MAX_MATCHES);
  });

  it("stays empty for 'not sure yet', so the result offers the conversation", () => {
    expect(recommend(answers({ topics: ["unsure"], stage: "open" }), "de")).toEqual([]);
  });
});

describe("situationOptions", () => {
  it("offers the starting points of the chosen category", () => {
    const options = situationOptions(["schulung"], "de");
    expect(options).toHaveLength(4);
    expect(options.every((option) => option.category === "schulung")).toBe(true);
  });

  it("offers some of every category when the visitor chose none", () => {
    const options = situationOptions(["unsure"], "de");
    expect(new Set(options.map((option) => option.category)).size).toBe(CATEGORY_IDS.length);
    expect(options.length).toBeLessThanOrEqual(8);
  });

  it("never offers more than eight", () => {
    expect(situationOptions(CATEGORY_IDS, "de").length).toBeLessThanOrEqual(8);
    expect(situationOptions(["schulung", "webauftritt", "e-mail-domain"], "de").length).toBeLessThanOrEqual(8);
  });
});

describe("buildDraft", () => {
  it("names the products, the starting points and the stage", () => {
    const [form] = situationOptions(["digitalisierung"], "de");
    const given = answers({ topics: ["digitalisierung"], situations: [form!], stage: "rough" });
    const { message, service } = buildDraft(recommend(given, "de"), given, "de");
    expect(message).toContain(FINDER_COPY.de.draft.intro);
    expect(message).toContain("Online-Formular statt Papier");
    expect(message).toContain("Formulare laufen auf Papier.");
    expect(message).toContain(FINDER_COPY.de.stages.rough.label);
    expect(service).toBe("process");
  });

  it("falls back to the conversation, long enough for the contact form", () => {
    // ContactSchema (tds-shared) wants a message of at least 20 characters.
    const { message, service } = buildDraft([], answers({ topics: ["unsure"] }), "en");
    expect(service).toBe("consulting");
    expect(message.trim().length).toBeGreaterThanOrEqual(20);
  });
});

describe("the finder's copy", () => {
  it("has every answer in both languages", () => {
    for (const id of TOPIC_IDS) {
      expect(topicWords(id, "de").label, id).toBeTruthy();
      expect(topicWords(id, "en").label, id).toBeTruthy();
    }
    for (const id of STAGE_IDS) {
      expect(FINDER_COPY.de.stages[id].label, id).toBeTruthy();
      expect(FINDER_COPY.en.stages[id].label, id).toBeTruthy();
    }
    expect(Object.keys(FINDER_COPY.de).sort()).toEqual(Object.keys(FINDER_COPY.en).sort());
  });

  it("keeps the site's rules: no direct address, nothing free, no durations", () => {
    const german = JSON.stringify([FINDER_COPY.de, FINDER_SECTION.de, CATALOGUE, CATALOGUE_PRODUCTS.map((product) => product.title.de)]);
    expect(german).not.toMatch(/kostenlos|kostenfrei|gratis|Minute/i);
    expect(german).not.toMatch(/\b(Sie|Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres)\b/);
    expect(german).not.toMatch(/\b(du|dein\w*|dir|dich)\b/i);
    expect(JSON.stringify([FINDER_COPY.en, FINDER_SECTION.en])).not.toMatch(/\bfree\b|minute/i);
  });

  it("names no amount", () => {
    const words = JSON.stringify([FINDER_COPY, FINDER_SECTION, CATALOGUE]);
    expect(words).not.toMatch(/€|\bEUR\b|\bEuro\b/);
    expect(words).not.toMatch(/Stunde|hourly|per hour|an hour/i);
  });
});

describe("estimated time saved", () => {
  it("gives every product a band and calls it an estimate", async () => {
    const { CATALOGUE_PRODUCTS, FINDER_COPY, SAVINGS_LEVELS, savingsLevel } = await import("./serviceFinder");
    for (const product of CATALOGUE_PRODUCTS) expect(SAVINGS_LEVELS).toContain(savingsLevel(product.id));
    expect(savingsLevel("einen-ablauf-automatisieren")).toBe("high");
    expect(FINDER_COPY.de.savingsNote).toMatch(/Schätzung.*keine Zusage/);
    expect(FINDER_COPY.en.savingsNote).toMatch(/estimate.*not a promise/);
  });
});
