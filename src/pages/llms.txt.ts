import type { APIRoute } from "astro";
import { renderLlmsTxt } from "~/lib/llmsTxt";
import { getPricingContent } from "~/lib/pricing";
import { resolveServiceContent, serviceDefinitions, type ServiceContent, type ServiceId } from "~/lib/services";
import { sitemapEntries } from "~/lib/sitemap";

/**
 * `/llms.txt`, derived from the same sources the pages render.
 *
 * It replaced `public/llms.txt` — which had to go, not merely be left behind:
 * a static asset SHADOWS a route of the same path, so leaving the old file in
 * `public/` would have meant this endpoint never answered and nothing anywhere
 * said so. `llmsTxt.test.ts` asserts the file is gone.
 *
 * Server-rendered, like `/sitemap-0.xml`, so the panel's exclusions and copy
 * overrides apply to what a crawler reads rather than to what the build
 * happened to see.
 *
 * NOT in `alwaysPaths` and on no cache event, unlike the sitemap: the page
 * cache only stores `text/html`, `application/xml`, `application/json`,
 * `application/rss+xml` and `application/pdf`. A `text/plain` response can
 * never be a hit, so warming it would render a document on every rebuild and
 * throw it away. It is fresh by construction instead, which was the point.
 */
export const prerender = false;

export const GET: APIRoute = async () => {
  const [entries, pricing, contents] = await Promise.all([
    sitemapEntries(),
    getPricingContent("de"),
    Promise.all(serviceDefinitions.map((service) => resolveServiceContent(service, "de"))),
  ]);

  // The panel may override a service title; the file has to say what the page
  // says, so the resolved copy is what gets rendered here too.
  const serviceContent: Partial<Record<ServiceId, ServiceContent>> = {};
  serviceDefinitions.forEach((service, index) => {
    serviceContent[service.id] = contents[index];
  });

  return new Response(renderLlmsTxt({ entries, packages: pricing.packages, serviceContent }), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
