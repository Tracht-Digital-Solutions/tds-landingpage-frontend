import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * `public/robots.txt` is served verbatim — nothing but this test reads it
 * before a crawler does.
 *
 * Two rules. The search and fetch agents behind AI answers (OpenAI, Anthropic,
 * Perplexity) are allowed by name: blocking one takes the site out of that
 * engine's answers, and no report anywhere would say so. Googlebot and Bingbot
 * — which also feed AI Overviews, Copilot and ChatGPT search — fall under `*`.
 * And `/install/`, the host-side setup wizard, is disallowed in EVERY group,
 * because a crawler obeys only the group that names it.
 */
const robots = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");

interface Group {
  agents: string[];
  allow: string[];
  disallow: string[];
}

/** Consecutive `User-agent` lines open one group; the rules after them belong to it. */
function parse(text: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let previousWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (field === "user-agent") {
      if (!current || !previousWasAgent) {
        current = { agents: [], allow: [], disallow: [] };
        groups.push(current);
      }
      current.agents.push(value);
      previousWasAgent = true;
      continue;
    }
    previousWasAgent = false;
    if (field === "allow") current?.allow.push(value);
    if (field === "disallow") current?.disallow.push(value);
  }
  return groups;
}

const groups = parse(robots);
const groupFor = (agent: string) =>
  groups.find((group) => group.agents.some((name) => name.toLowerCase() === agent.toLowerCase()));

/** Search indexes and user-triggered fetchers of the answer engines. */
const ANSWER_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
] as const;

describe("robots.txt", () => {
  it("lets every other crawler in", () => {
    expect(groupFor("*")?.allow).toContain("/");
  });

  it.each(ANSWER_AGENTS)("names %s and allows it the site", (agent) => {
    const group = groupFor(agent);
    expect(group, agent).toBeDefined();
    expect(group?.allow, agent).toContain("/");
  });

  it("keeps the setup wizard out of every group", () => {
    for (const group of groups) {
      expect(group.disallow, group.agents.join(", ")).toContain("/install/");
    }
  });

  it("never closes the whole site to anyone", () => {
    for (const group of groups) {
      expect(group.disallow, group.agents.join(", ")).not.toContain("/");
    }
  });

  it("points at the sitemap index on the production origin", () => {
    expect(robots).toMatch(/^Sitemap: https:\/\/tracht-digital\.de\/sitemap-index\.xml$/m);
  });
});
