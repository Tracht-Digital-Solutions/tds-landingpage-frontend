import type { APIRoute } from "astro";
import { renderDefaultOgPng } from "~/og/render";

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
