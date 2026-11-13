import { defineMiddleware, sequence } from "astro:middleware";

import { siteCache } from "./lib/pageCache";
import { withUtf8Charset } from "./lib/charset";
import { guardSiteKey } from "@tracht-digital-solutions/tds-shared/site";

/**
 * Serve cached pages and store rendered ones.
 *
 * The control plane that drives it is NOT here — it is a real route
 * (`src/pages/tds/cache/[action].ts`), because Astro never runs middleware for
 * a path no route matches. See that file.
 *
 * ### In production Apache usually answers first
 *
 * `public/.htaccess` serves an existing cache entry straight off disk, so a
 * hit normally never reaches Node at all — that is the point of the design.
 * The hit path here still matters: it is what `npm run dev`, `npm start` and
 * any host without the rewrite use, and having both read the same store keeps
 * the two implementations honest.
 */

/**
 * Refuse to STORE a page that was rendered while the API rejected our site key.
 *
 * `siteKeyGuard()` in `astro.config.mjs` covers the build, and it cannot cover
 * this: every content fetch is deliberately fail-soft, so at request time a
 * rejected key produces a perfectly valid page full of baked fallbacks. Cached,
 * that page would outlive the misconfiguration and there would be nothing to
 * see — a site quietly serving its own placeholder copy is exactly the failure
 * the build-time guard exists to prevent.
 *
 * Comparing the rejection counter around the render is enough. Two requests
 * racing can only make this refuse to store a page that was fine; it can never
 * make it store one that was not, and a needless miss costs one render.
 */
const refuseStaleKey = defineMiddleware((_context, next) => guardSiteKey(next as () => Promise<Response>));

/**
 * `sequence` runs these outside-in, so the cache wraps the guard: the guard's
 * `no-store` is already on the response by the time the cache decides whether
 * to store it. Reversing the two would put the guard outside the cache, where
 * it would see hits it never rendered and mark them unstorable for no reason.
 */
/**
 * Name the character set in the HTTP header (2026-11-13). Astro answers
 * `text/html` without one, and the SEO checkers flag it; the `<meta charset>`
 * alone only counts once the parser has reached it. Apache adds the same for
 * cache hits it serves itself (`AddDefaultCharset` in `public/.htaccess`).
 */
const utf8Charset = defineMiddleware(async (_context, next) => withUtf8Charset(await next()));

export const onRequest = sequence(
  utf8Charset,
  defineMiddleware((context, next) =>
    siteCache.middleware(
      {
        request: context.request,
        url: context.url,
        isPrerendered: context.isPrerendered,
      },
      next as () => Promise<Response>,
    ),
  ),
  refuseStaleKey,
);
