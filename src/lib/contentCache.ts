/**
 * The one memo every content fetch on this site shares.
 *
 * It replaces the module-level `Map`/`let … = null` caches that `cms.ts` and
 * `legal.ts` used to keep. Those were exactly right while this site was a
 * static build — one process, one fetch per language, then exit — and become
 * *permanent* under SSR: the server would answer with whatever it read at
 * boot, for the life of the process, and a cache rebuild would faithfully
 * re-render that stale content and report success. Nothing logs, nothing
 * throws, nothing is red.
 *
 * The middleware calls `invalidate()` before any render a rebuild performs.
 *
 * ### Why this is its own module
 *
 * This memo is infrastructure; the route table in `cache.ts` is application
 * knowledge that has to know every service page. Keeping both in one file made
 * `cms.ts` depend on the route table, which closed a cycle:
 * `services.ts` → `cms.ts` → `cache.ts` → `services.ts`. Entering that graph
 * through `services.ts` left `serviceDefinitions` still uninitialised while
 * `cache.ts` built its top-level path lists, throwing a `TypeError` that no
 * type check can see. Splitting the memo out breaks the cycle at its cause —
 * a content fetch has no business importing the sitemap of the site.
 */

import { createGenerationCache } from "@tracht-digital-solutions/tds-shared/cache";

export const contentCache = createGenerationCache();
