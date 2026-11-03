import { describe, expect, it } from "vitest";
import { mostRelevantPosts } from "./journalRelevance";

const post = (title: string, category: string, publishedAt: string) => ({ title, category, excerpt: "", publishedAt });

describe("Blog für Betriebe", () => {
  it("prefers business topics over newer project posts", () => {
    const posts = [
      post("Pi Imager für Android", "Open Source", "2026-11-02"),
      post("WParted: Partitionen unter Windows", "Open Source", "2026-11-01"),
      post("Digitalisierung fängt klein an", "Digitalisierung", "2026-07-01"),
      post("Datensicherung für kleine Betriebe", "IT-Sicherheit", "2026-08-01"),
      post("Lohnt sich ein Webshop?", "Webshop", "2026-07-02"),
    ];
    const titles = mostRelevantPosts(posts).map((item) => item.title);
    expect(titles).toHaveLength(3);
    expect(titles.join(" ")).not.toMatch(/Pi Imager|WParted/);
  });

  it("breaks ties by date, newest first", () => {
    const posts = [post("A", "Webshop", "2026-01-01"), post("B", "Webshop", "2026-02-01")];
    expect(mostRelevantPosts(posts, 1)[0].title).toBe("B");
  });
});
