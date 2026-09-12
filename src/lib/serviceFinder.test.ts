import { describe, expect, it } from "vitest";
import {
  FINDER_COPY,
  FINDER_SECTION,
  SERVICE_ORDER,
  STAGE_IDS,
  TOPIC_IDS,
  buildDraft,
  recommend,
  situationOptions,
  type FinderAnswers,
  type FinderService,
} from "./serviceFinder";
import { serviceDefinitions } from "./services";

const services: FinderService[] = SERVICE_ORDER.map((id) => ({
  id,
  title: `Titel ${id}`,
  summary: `Zusammenfassung ${id}`,
  href: `/leistungen/${id}`,
  situations: [1, 2, 3, 4, 5].map((n) => `${id} Ausgangslage ${n}.`),
}));

const answers = (over: Partial<FinderAnswers> = {}): FinderAnswers => ({
  topics: [],
  situations: [],
  stage: null,
  ...over,
});

const ids = (result: ReturnType<typeof recommend>) => result.map((match) => match.serviceId);

describe("recommend", () => {
  it.each(SERVICE_ORDER)("puts %s first when it is the only topic", (id) => {
    expect(ids(recommend(answers({ topics: [id] }), "de"))[0]).toBe(id);
  });

  it("returns every service the visitor pointed at, strongest first", () => {
    const result = recommend(
      answers({
        topics: ["process", "web-presence"],
        situations: [{ key: "web-presence:0", serviceId: "web-presence", text: "Die Seite ist alt." }],
      }),
      "de",
    );
    expect(ids(result)).toEqual(["web-presence", "process"]);
  });

  it("keeps the catalogue order between equally strong matches", () => {
    expect(ids(recommend(answers({ topics: ["web-presence", "consulting"] }), "de"))).toEqual([
      "consulting",
      "web-presence",
    ]);
  });

  it("counts a recognised starting point on its own", () => {
    const result = recommend(
      answers({ situations: [{ key: "solutions:0", serviceId: "solutions", text: "Programme arbeiten nicht zusammen." }] }),
      "de",
    );
    expect(ids(result)).toEqual(["solutions"]);
  });

  it("brings the sorting conversation along when the project is still open", () => {
    expect(ids(recommend(answers({ topics: ["web-presence"], stage: "open" }), "de"))).toEqual([
      "web-presence",
      "consulting",
    ]);
    // A rough idea only nudges; it does not add a service by itself.
    expect(ids(recommend(answers({ topics: ["web-presence"], stage: "rough" }), "de"))).toEqual(["web-presence"]);
  });

  it("answers 'not sure yet' with Beratung & Konzeption", () => {
    expect(ids(recommend(answers({ topics: ["unsure"] }), "de"))).toEqual(["consulting"]);
  });

  it("never comes back empty", () => {
    expect(ids(recommend(answers(), "de"))).toEqual(["consulting"]);
    expect(ids(recommend(answers({ stage: "clear" }), "en"))).toEqual(["consulting"]);
  });

  it("gives the visitor's own choices as the reasons", () => {
    const [match] = recommend(
      answers({
        topics: ["process"],
        situations: [{ key: "process:0", serviceId: "process", text: "Dieselben Daten werden mehrfach eingetippt." }],
      }),
      "de",
    );
    expect(match?.reasons).toEqual([FINDER_COPY.de.topics.process.label, "Dieselben Daten werden mehrfach eingetippt."]);
  });
});

describe("situationOptions", () => {
  it("offers the starting points of the chosen services", () => {
    const options = situationOptions(["process"], services);
    expect(options).toHaveLength(4);
    expect(options.every((option) => option.serviceId === "process")).toBe(true);
  });

  it("offers a couple of every service when the visitor chose none", () => {
    const options = situationOptions(["unsure"], services);
    expect(new Set(options.map((option) => option.serviceId)).size).toBe(SERVICE_ORDER.length);
    expect(options).toHaveLength(8);
  });

  it("never offers more than eight", () => {
    expect(situationOptions(SERVICE_ORDER, services).length).toBeLessThanOrEqual(8);
    expect(situationOptions(["consulting", "process", "solutions"], services).length).toBeLessThanOrEqual(8);
  });

  it("keys each option by service and position", () => {
    expect(situationOptions(["solutions"], services)[1]).toEqual({
      key: "solutions:1",
      serviceId: "solutions",
      text: "solutions Ausgangslage 2.",
    });
  });
});

describe("buildDraft", () => {
  it("names the matches, the starting points and the stage", () => {
    const given = answers({
      topics: ["process"],
      situations: [{ key: "process:0", serviceId: "process", text: "Dieselben Daten werden mehrfach eingetippt." }],
      stage: "rough",
    });
    const draft = buildDraft(recommend(given, "de"), given, services, "de");
    expect(draft).toContain(FINDER_COPY.de.draft.intro);
    expect(draft).toContain("Titel process");
    expect(draft).toContain("Dieselben Daten werden mehrfach eingetippt.");
    expect(draft).toContain(FINDER_COPY.de.stages.rough.label);
  });

  it("is long enough for the contact form on its own", () => {
    // ContactSchema (tds-shared) wants a message of at least 20 characters.
    const draft = buildDraft(recommend(answers({ topics: ["unsure"] }), "en"), answers({ topics: ["unsure"] }), services, "en");
    expect(draft.trim().length).toBeGreaterThanOrEqual(20);
  });
});

describe("the finder's copy", () => {
  it("covers the whole service catalogue", () => {
    expect([...SERVICE_ORDER].sort()).toEqual(serviceDefinitions.map((service) => service.id).sort());
  });

  it("has every answer in both languages", () => {
    for (const id of TOPIC_IDS) {
      expect(FINDER_COPY.de.topics[id].label, id).toBeTruthy();
      expect(FINDER_COPY.en.topics[id].label, id).toBeTruthy();
    }
    for (const id of STAGE_IDS) {
      expect(FINDER_COPY.de.stages[id].label, id).toBeTruthy();
      expect(FINDER_COPY.en.stages[id].label, id).toBeTruthy();
    }
    expect(Object.keys(FINDER_COPY.de).sort()).toEqual(Object.keys(FINDER_COPY.en).sort());
  });

  it("keeps the site's rules: formal address, nothing free, no durations", () => {
    const german = JSON.stringify([FINDER_COPY.de, FINDER_SECTION.de]);
    expect(german).not.toMatch(/kostenlos|kostenfrei|gratis|Minute/i);
    expect(german).not.toMatch(/\b(du|dich|dir|dein|deine)\b/i);
    expect(JSON.stringify([FINDER_COPY.en, FINDER_SECTION.en])).not.toMatch(/\bfree\b|minute/i);
  });
});
