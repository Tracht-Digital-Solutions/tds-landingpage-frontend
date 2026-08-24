import type { APIRoute } from "astro";
import { renderUrlset } from "~/lib/sitemap";

/**
 * Prerendered: this site's route set only changes with a deploy, so there is
 * nothing for the page cache to invalidate. (The blog and the tools site do
 * need a cached, on-demand sitemap — their URL lists come from the CMS.)
 */
export const prerender = true;

export const GET: APIRoute = () =>
  new Response(renderUrlset(new Date().toISOString().slice(0, 10)), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
