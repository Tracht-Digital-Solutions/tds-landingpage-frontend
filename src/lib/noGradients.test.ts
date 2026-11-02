import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(astro|css|tsx)$/.test(name) ? [path] : [];
  });
}

describe("the site's surfaces", () => {
  it("use no gradients", () => {
    const offenders = files("src").filter((file) => /-gradient\(|bg-gradient-|\bbg-\[[a-z-]*gradient/.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});
