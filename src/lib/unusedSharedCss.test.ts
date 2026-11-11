import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DROPPED_BLOCKS, pruneSelector, splitTop } from "../../scripts/postcss-drop-unused-shared.mjs";

/**
 * The build drops tds-shared component styles this site never renders
 * (scripts/postcss-drop-unused-shared.mjs). Two things must hold: the pruning
 * never takes a selector that still styles something here, and the site never
 * starts using a dropped block without taking it off the list.
 */
describe("pruneSelector", () => {
  it("drops a selector naming a dropped block, element or modifier", () => {
    expect(pruneSelector(".tds-dropzone")).toBeNull();
    expect(pruneSelector(".tds-dropzone__label:hover")).toBeNull();
    expect(pruneSelector("[data-surface=marketing] .tds-product-card--wide")).toBeNull();
  });

  it("keeps the other members of an :is()/:where() list", () => {
    expect(pruneSelector(":is(.tds-card,.tds-widget,.cookie-notice)")).toBe(":is(.tds-card,.cookie-notice)");
    expect(pruneSelector(":where(.tds-widget) .x")).toBeNull();
  });

  it("never touches :not() or :has(), and never a longer block name", () => {
    expect(pruneSelector(".btn:not(.tds-dropdown__item)")).toBe(".btn:not(.tds-dropdown__item)");
    expect(pruneSelector(".a:has(.tds-widget)")).toBe(".a:has(.tds-widget)");
    expect(pruneSelector(".tds-product-cards")).toBe(".tds-product-cards");
    expect(pruneSelector(".tds-card")).toBe(".tds-card");
  });

  it("splits selector lists only at the top level", () => {
    expect(splitTop(":is(.a,.b), .c")).toEqual([":is(.a,.b)", ".c"]);
  });
});

describe("the site does not use a block the build drops", () => {
  const root = resolve(__dirname, "../..");
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(astro|tsx?|css|mjs)$/.test(name) && !name.includes(".test.")) files.push(path);
    }
  };
  walk(join(root, "src"));

  it.each(DROPPED_BLOCKS as string[])("%s appears nowhere in src/", (block) => {
    const hit = files.find((file) => new RegExp(`${block}(?=$|__|--|[^\\w-])`).test(readFileSync(file, "utf8")));
    expect(hit, `${block} is used in ${hit}; remove it from DROPPED_BLOCKS`).toBeUndefined();
  });
});
