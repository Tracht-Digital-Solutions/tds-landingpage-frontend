import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as legalDocBytes } from "./legal_UNLgtV-b.mjs";
//#region src/pages/legal/agb.pdf.ts
var agb_pdf_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
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
var GET = async () => {
	const bytes = await legalDocBytes("agb", "de");
	if (bytes === null) return new Response("Not found", { status: 404 });
	return new Response(new Uint8Array(bytes), { headers: {
		"Content-Type": "application/pdf",
		"Content-Disposition": "inline; filename=\"agb-tracht-digital-solutions.pdf\""
	} });
};
//#endregion
//#region \0virtual:astro:page:src/pages/legal/agb.pdf@_@ts
var page = () => agb_pdf_exports;
//#endregion
export { page };
