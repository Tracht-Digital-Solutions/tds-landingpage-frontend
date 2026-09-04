import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as legalDocBytes } from "./legal_UNLgtV-b.mjs";
//#region src/pages/en/legal/agb.pdf.ts
var agb_pdf_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
/**
* English AGB endpoint → `/en/legal/agb.pdf`. See the DE twin at
* `src/pages/legal/agb.pdf.ts` for the full contract.
*
* The English document is a separate upload (`lang=en`) — legal text is not
* machine-translated, so unlike the CMS content blocks there is no DeepL
* counterpart here. When none is uploaded the committed German fallback is
* served rather than nothing, so the link is never dead.
*/
var GET = async () => {
	const bytes = await legalDocBytes("agb", "en");
	if (bytes === null) return new Response("Not found", { status: 404 });
	return new Response(new Uint8Array(bytes), { headers: {
		"Content-Type": "application/pdf",
		"Content-Disposition": "inline; filename=\"terms-tracht-digital-solutions.pdf\""
	} });
};
//#endregion
//#region \0virtual:astro:page:src/pages/en/legal/agb.pdf@_@ts
var page = () => agb_pdf_exports;
//#endregion
export { page };
