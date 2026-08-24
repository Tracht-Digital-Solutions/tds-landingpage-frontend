import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit-test harness for the landingpage's framework-agnostic logic. Astro
 * stays on `npm run type-check`; this covers `src/lib` helpers and React
 * islands.
 *
 * The default environment is `node`, NOT jsdom. jsdom used to be the default
 * "so island tests work", but no suite in this repo ever touched a DOM global
 * — and constructing a jsdom per test file cost more than two minutes of the
 * ~15s run, i.e. the overwhelming majority of it. A suite that does need a
 * document opts in per file with a docblock, which is also the only place a
 * reader can see that it needs one:
 *
 *   // @vitest-environment jsdom
 *
 * `src/lib/scrollLock.test.ts` is the current example.
 */
export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
