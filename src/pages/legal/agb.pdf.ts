import type { APIRoute } from "astro";
import { legalDocBytes } from "~/lib/legal";

/**
 * Build-time AGB endpoint → `/legal/agb.pdf`. Prerendered under
 * `output: "static"`, so it ships as a plain file (no runtime) — the same
 * pattern as `/kontakt.vcf`.
 *
 * The bytes come from the document uploaded in the admin panel
 * (`tds-ext-website-cms-pkg` → `GET /content/legal/agb.pdf`), falling back to
 * the committed copy in `src/assets/legal/` when the API is unreachable or
 * nothing has been uploaded yet. Editing the AGB is therefore: upload in the
 * panel → the save fires a rebuild → this file is regenerated.
 *
 * The EN twin lives at `src/pages/en/legal/agb.pdf.ts`.
 */
export const GET: APIRoute = async () => {
  const bytes = await legalDocBytes("agb", "de");
  if (bytes === null) {
    // Neither uploaded nor committed. A 404 page is a truthful answer; a
    // zero-byte "PDF" would not be.
    return new Response("Not found", { status: 404 });
  }
  // Re-wrapped like the OG endpoint does: lib.dom's `BodyInit` rejects a
  // `Uint8Array<ArrayBufferLike>`, and this re-types it to `<ArrayBuffer>`.
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="agb-tracht-digital-solutions.pdf"',
    },
  });
};
