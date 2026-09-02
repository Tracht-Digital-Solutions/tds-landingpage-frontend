import type { APIRoute } from "astro";
import { renderUrlset, sitemapEntries } from "~/lib/sitemap";

/**
 * Server-rendered and cached like any other page.
 *
 * It used to be prerendered, and that was right while the route set could only
 * change with a deploy. It cannot stay that way now that the panel maintains a
 * list of paths to leave out: a prerendered document would freeze the
 * exclusions at build time, so hiding a page would appear to work in the panel
 * and change nothing until the next deploy — a silent no-op, which is the shape
 * of failure this codebase keeps meeting.
 *
 * `application/xml` is on the page cache's storable list, so a hit is served
 * off disk exactly as before; `src/lib/cache.ts` rebuilds it on a `sitemap`
 * event.
 */
export const prerender = false;

export const GET: APIRoute = async () =>
  new Response(renderUrlset(await sitemapEntries(), new Date().toISOString().slice(0, 10)), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
