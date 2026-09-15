import { describe, expect, it } from "vitest";
import {
  asGraph,
  breadcrumbNode,
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  personSchema,
  serviceNode,
  webPageNode,
} from "./jsonld";
import { siteConfig } from "./seo";

describe("graph nodes for detail pages", () => {
  const url = "https://tracht-digital.de/leistungen/woocommerce";

  it("dates the page, names its author and publisher, and ties it to its topic", () => {
    const node = webPageNode({
      url,
      name: "WooCommerce",
      description: "d",
      lang: "de",
      dateModified: "2026-09-15",
      about: { name: "WooCommerce", sameAs: "https://de.wikipedia.org/wiki/WooCommerce" },
      breadcrumbId: `${url}#breadcrumb`,
    }) as Record<string, any>;
    expect(node["@type"]).toBe("WebPage");
    expect(node["@id"]).toBe(`${url}#webpage`);
    expect(node.author["@id"]).toBe(personSchema()["@id"]);
    expect(node.publisher["@id"]).toBe(organizationSchema()["@id"]);
    expect(node.isPartOf["@id"]).toBe(`${siteConfig.url}/#website`);
    expect(node.dateModified).toBe("2026-09-15");
    expect(node.about.sameAs).toBe("https://de.wikipedia.org/wiki/WooCommerce");
    expect(node.breadcrumb["@id"]).toBe(`${url}#breadcrumb`);
    expect(node.inLanguage).toBe("de-DE");
  });

  it("offers a price only where the page names one", () => {
    const base = { url, name: "n", description: "d", lang: "en" as const, serviceType: "t" };
    expect((serviceNode(base) as Record<string, unknown>).offers).toBeUndefined();
    const priced = serviceNode({ ...base, rate: 65 }) as Record<string, any>;
    expect(priced.offers.priceSpecification.price).toBe(65);
    expect(priced.offers.priceSpecification.valueAddedTaxIncluded).toBe(false);
    expect(priced.provider["@id"]).toBe(organizationSchema()["@id"]);
  });

  it("builds a breadcrumb node with an id and no context of its own", () => {
    const node = breadcrumbNode(`${url}#breadcrumb`, [
      { name: "Start", url: "https://tracht-digital.de/" },
      { name: "WooCommerce", url },
    ]) as Record<string, any>;
    expect(node["@context"]).toBeUndefined();
    expect(node["@id"]).toBe(`${url}#breadcrumb`);
    expect(node.itemListElement.map((item: { position: number }) => item.position)).toEqual([1, 2]);
  });
});

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
