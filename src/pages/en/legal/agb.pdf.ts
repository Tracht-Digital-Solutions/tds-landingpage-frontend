import type { APIRoute } from "astro";
import { legalDocBytes } from "~/lib/legal";

/**
 * English AGB endpoint → `/en/legal/agb.pdf`. See the DE twin at
 * `src/pages/legal/agb.pdf.ts` for the full contract.
 *
 * The English document is a separate upload (`lang=en`) — legal text is not
 * machine-translated, so unlike the CMS content blocks there is no DeepL
 * counterpart here. When none is uploaded the committed German fallback is
 * served rather than nothing, so the link is never dead.
 */
export const GET: APIRoute = async () => {
  const bytes = await legalDocBytes("agb", "en");
  if (bytes === null) {
    return new Response("Not found", { status: 404 });
  }
  // See the DE twin: `BodyInit` rejects `Uint8Array<ArrayBufferLike>`.
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="terms-tracht-digital-solutions.pdf"',
    },
  });
};
