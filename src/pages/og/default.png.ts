import type { APIRoute } from "astro";
import { renderDefaultOgPng } from "~/og/render";

/**
 * Prerendered, and it has to stay that way.
 *
 * Two reasons, either of which alone would settle it. The renderer pulls in
 * satori and @resvg/resvg-js, the second of which is a native addon — served
 * on demand they would have to be installed on the production host. And
 * `src/og/render.ts` anchors its font directory to `process.cwd()`, which is
 * the project root during `astro build` but a deploy tree with no `src/` at
 * runtime: on demand this route would ENOENT on its first request in
 * production and nowhere else.
 */
export const prerender = true;

/**
 * Default OG image for the marketing site. Astro emits this as a
 * static `/og/default.png` at build time. Layout.astro references it
 * via siteConfig.defaultOgImage on every page that doesn't pass its
 * own `ogImage` prop.
 */
export const GET: APIRoute = async () => {
  const png = await renderDefaultOgPng();
  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
