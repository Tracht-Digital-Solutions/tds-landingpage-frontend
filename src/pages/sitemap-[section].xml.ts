import type { APIRoute } from "astro";
import { renderUrlset, sectionOf, sitemapEntries } from "~/lib/sitemap";
import { isSitemapSection } from "~/lib/sitemapSections";

/**
 * One child of the sectioned sitemap: `/sitemap-pages.xml`,
 * `/sitemap-services.xml`, `/sitemap-platforms.xml`. `/sitemap-0.xml` keeps its
 * own static route and still lists everything.
 */
export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  if (!isSitemapSection(params.section)) return new Response(null, { status: 404 });
  const entries = (await sitemapEntries()).filter((e) => sectionOf(e) === params.section);
  if (entries.length === 0) return new Response(null, { status: 404 });
  return new Response(renderUrlset(entries), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
};
