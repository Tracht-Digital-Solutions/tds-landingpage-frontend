import type { APIRoute } from "astro";
import { renderSectionIndex, sitemapEntries } from "~/lib/sitemap";

/**
 * The entry point `public/robots.txt` advertises and Search Console knows.
 *
 * Since 2026-10-06 it names one child per section (src/lib/sitemapSections.ts)
 * with the newest date inside each. Server-rendered now, no longer
 * prerendered: the panel's exclusions decide which sections exist, and the
 * page cache rebuilds it with the others (cache.ts, SITEMAP_PATHS).
 */
export const prerender = false;

export const GET: APIRoute = async () =>
  new Response(renderSectionIndex(await sitemapEntries()), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
