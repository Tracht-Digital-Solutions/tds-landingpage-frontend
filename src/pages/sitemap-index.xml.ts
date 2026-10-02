import type { APIRoute } from "astro";
import { renderSitemapIndex } from "~/lib/sitemap";

/**
 * The entry point `public/robots.txt` advertises and Search Console already
 * knows. `@astrojs/sitemap` produced this exact pair of filenames; keeping
 * them means the migration off the integration is invisible from outside.
 */
export const prerender = true;

// No `<lastmod>`: this file is prerendered, so a date here would be the BUILD
// date, while the sitemap it names is rendered on demand and changes without
// a deploy. An omitted field is honest; a frozen one is not.
export const GET: APIRoute = () =>
  new Response(renderSitemapIndex(), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
