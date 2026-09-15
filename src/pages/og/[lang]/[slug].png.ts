import type { APIRoute, GetStaticPaths } from "astro";
import { renderPageOgPng } from "~/og/render";
import { platformDefinitions } from "~/lib/platforms";
import { serviceDefinitions } from "~/lib/services";

/**
 * One social card per service and platform page, per language:
 * `/og/de/woocommerce.png`, `/og/en/web-presence.png`, …
 *
 * Prerendered for the same two reasons as `/og/default.png` (see that route):
 * satori and resvg must stay out of the production runtime, and the renderer
 * reads its font from the project root. Service headlines come from the
 * committed catalog, not the CMS — a card is rendered once per deploy.
 */
export const prerender = true;

type Props = { eyebrow: string; title: string };

export const getStaticPaths = (() =>
  (["de", "en"] as const).flatMap((lang) => [
    ...serviceDefinitions.map((service) => ({
      params: { lang, slug: service.slug[lang] },
      props: { eyebrow: "Tracht Digital Solutions", title: service.fallback[lang].title } satisfies Props,
    })),
    ...platformDefinitions.map((platform) => ({
      params: { lang, slug: platform.slug },
      props: { eyebrow: platform.name, title: platform.content[lang].title } satisfies Props,
    })),
  ])) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderPageOgPng(props as Props);
  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
