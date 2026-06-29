import { describe, expect, it } from "vitest";
import {
  asGraph,
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  personSchema,
} from "./jsonld";

/**
 * The JSON-LD generators feed Google rich results + AI search parsers.
 * Their shape is a contract: a wrong @type or a 0-indexed breadcrumb
 * position silently drops the rich result with no build error. Pin the
 * structural invariants.
 */
describe("breadcrumbSchema", () => {
  it("emits a 1-indexed ListItem per crumb", () => {
    const schema = breadcrumbSchema([
      { name: "Home", url: "https://x/" },
      { name: "Blog", url: "https://x/blog" },
    ]);

    expect(schema["@type"]).toBe("BreadcrumbList");
    const items = schema.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(2);
    expect(items[0].position).toBe(1);
    expect(items[1].position).toBe(2);
    expect(items[1].name).toBe("Blog");
  });

  it("yields an empty list for no crumbs", () => {
    expect((breadcrumbSchema([]).itemListElement as unknown[]).length).toBe(0);
  });
});

describe("faqPageSchema", () => {
  it("maps each Q/A to a Question with an accepted Answer", () => {
    const schema = faqPageSchema([{ q: "Wie?", a: "So." }]) as Record<string, unknown>;
    expect(schema["@type"]).toBe("FAQPage");
    const entities = schema.mainEntity as Array<Record<string, any>>;
    expect(entities[0]["@type"]).toBe("Question");
    expect(entities[0].name).toBe("Wie?");
    expect(entities[0].acceptedAnswer.text).toBe("So.");
  });
});

describe("asGraph", () => {
  it("wraps nodes in an @context/@graph envelope", () => {
    const graph = asGraph({ a: 1 }, { b: 2 });
    expect(graph["@context"]).toBe("https://schema.org");
    expect(graph["@graph"]).toEqual([{ a: 1 }, { b: 2 }]);
  });
});

describe("identity schemas", () => {
  it("personSchema and organizationSchema cross-reference by @id", () => {
    const person = personSchema();
    const org = organizationSchema();

    expect(person["@type"]).toBe("Person");
    expect((person.worksFor as Record<string, unknown>)["@id"]).toBe(org["@id"]);
    expect((org.founder as Record<string, unknown>)["@id"]).toBe(person["@id"]);
  });

  it("filters falsy social links out of sameAs", () => {
    const sameAs = personSchema().sameAs as string[];
    expect(sameAs.every(Boolean)).toBe(true);
  });
});
