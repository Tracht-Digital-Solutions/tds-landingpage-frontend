import { describe, expect, it } from "vitest";
import { getDefaultPackages } from "./pricing";
import {
  asGraph,
  breadcrumbNode,
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  personSchema,
  serviceNode,
  webPageNode,
  websiteSchema,
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

  it("carries no hourly offer on a service node", () => {
    // No hourly rates since 2026-09-22; the packages live in the pricing
    // catalogue, not on each service.
    const base = { url, name: "n", description: "d", lang: "en" as const, serviceType: "t" };
    const node = serviceNode(base) as Record<string, any>;
    expect(node.offers).toBeUndefined();
    expect(JSON.stringify(node)).not.toContain("HUR");
    expect(node.provider["@id"]).toBe(organizationSchema()["@id"]);
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

/**
 * The Organization node's local-business completers, added 2026-09-21.
 *
 * None of these fails visibly: a node without a logo still validates, a
 * `priceRange` copied by hand still renders, and an invented opening hour
 * would look like diligence.
 */
describe("the organization node", () => {
  const org = organizationSchema() as Record<string, any>;

  it("carries a logo Google can actually fetch", () => {
    // Absolute, with dimensions: a crawler reading this node has no page to
    // resolve a relative path against.
    expect(org.logo["@type"]).toBe("ImageObject");
    expect(org.logo.url).toMatch(/^https:\/\/tracht-digital\.de\//);
    expect(org.logo.width).toBeGreaterThan(0);
    expect(org.logo.height).toBeGreaterThan(0);
    expect(org.image).toBe(org.logo.url);
  });

  it("names its contact channels and the languages they are answered in", () => {
    expect(org.contactPoint["@type"]).toBe("ContactPoint");
    expect(org.contactPoint.availableLanguage).toEqual(["de", "en"]);
    expect(org.contactPoint.email).toBe(siteConfig.email);
  });

  it("derives priceRange from the published packages, never from a literal", () => {
    // The figures move. A second place stating them by hand drifts, silently.
    const prices = getDefaultPackages("de").map((pkg) => pkg.price);
    expect(org.priceRange).toContain(String(Math.min(...prices)));
    expect(org.priceRange).toContain(String(Math.max(...prices)));
    expect(org.priceRange).not.toContain("/h");
  });

  it("publishes NO opening hours", () => {
    // Julian works by arrangement and schema.org has no way to say that.
    // `opens`/`closes` would be an invented promise of availability — this
    // guard is here so nobody "completes" the node with one.
    expect(org.openingHoursSpecification).toBeUndefined();
    expect(JSON.stringify(org)).not.toMatch(/opens|closes|openingHours/i);
  });
});

describe("the website node", () => {
  it("describes itself in the page's own language", () => {
    // It was pinned to German, so every English page described itself in
    // German to anything reading the graph.
    expect((websiteSchema("de") as any).description).toBe(siteConfig.description.de);
    expect((websiteSchema("en") as any).description).toBe(siteConfig.description.en);
  });

  it("claims no search it does not have", () => {
    // The docblock promised a SearchAction for years; the site has no search.
    expect((websiteSchema("de") as any).potentialAction).toBeUndefined();
  });
});
