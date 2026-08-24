import type { APIRoute } from "astro";
import { siteCache } from "~/lib/pageCache";

/**
 * The page cache's control plane: `status`, `rebuild`, `purge`.
 *
 * ### Why this is a route and not middleware
 *
 * Middleware is the obvious home — it runs on every request — and it is wrong.
 * **Astro does not run middleware for a path no route matches**: `App.render()`
 * matches first and short-circuits into the 404 response. Mounted in
 * middleware, every rebuild request came back as this site's own 404 page,
 * with no cache activity and a status code that reads like a typo in the URL.
 *
 * The directory name matters too: Astro excludes any path segment beginning
 * with `_` from routing, so `_cache/` would not be a route either. Hence
 * `/tds/cache/…` — and note it is NOT the storage directory, which is
 * `_tds-cache` in the document root and blocked outright by `.htaccess`.
 *
 * Token-gated inside the handler (`TDS_CACHE_TOKEN`, constant-time compare).
 * With no token configured it answers 503 rather than running open: an
 * unauthenticated rebuild endpoint on a public origin is free render
 * amplification.
 */
export const prerender = false;

const handle: APIRoute = ({ params, request, url }) =>
  siteCache.control(String(params.action ?? ""), request, url);

export const GET = handle;
export const POST = handle;
