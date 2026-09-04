import type { APIRoute } from "astro";
import { renderBusinessCardQr } from "~/lib/businessCardQr";

/**
 * Build-time QR endpoint → `/visitenkarte-qr.svg`.
 *
 * Prerendered, and it has to stay that way: this is what keeps `qrcode` — and
 * the bare `__require("dijkstrajs")` its CJS interop leaves behind — out of
 * the server bundle. Served on demand it took both card pages down with a 500
 * on the host. Same rule, same reason as `/og/default.png`.
 *
 * The EN twin lives at `src/pages/en/business-card-qr.svg.ts`.
 */
export const prerender = true;

export const GET: APIRoute = async () => {
  return new Response(await renderBusinessCardQr("de"), {
    headers: {
      "Content-Type": "image/svg+xml;charset=utf-8",
      // Immutable in practice: the payload is a compile-time constant, so a
      // changed code means a new build and a new deploy.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
