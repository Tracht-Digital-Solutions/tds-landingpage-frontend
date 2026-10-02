import { a as memoisedOr, n as readContentJson, r as siteKeyHeaders, t as assertKeyAccepted } from "./contentFetch_Bzf-gjNU.mjs";
import { i as contentApiBase } from "./connection_Bw0diyws.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
//#region src/lib/legal.ts
async function fetchLegalIndex() {
	return memoisedOr("legal:index", async () => (await readContentJson(`${contentApiBase()}/legal`)).docs ?? {}, {}, "legal document index");
}
async function legalDocMeta(key, lang) {
	return (await fetchLegalIndex())[key]?.[lang] ?? null;
}
function fallbackBytes(key) {
	for (const dir of ["assets/legal", "src/assets/legal"]) try {
		return readFileSync(join(process.cwd(), dir, `${key}.pdf`));
	} catch {}
	return null;
}
async function legalDocBytes(key, lang) {
	if (await legalDocMeta(key, lang) !== null) try {
		const url = new URL(`${contentApiBase()}/legal/${key}.pdf`);
		url.searchParams.set("lang", lang);
		const res = await fetch(url, {
			headers: siteKeyHeaders(),
			signal: AbortSignal.timeout(2e4)
		});
		assertKeyAccepted(res, url);
		if (res.ok) {
			const bytes = Buffer.from(await res.arrayBuffer());
			if (bytes.subarray(0, 1024).includes("%PDF-")) return bytes;
			console.warn(`[tds-landingpage] /content/legal/${key}.pdf did not return a PDF — using committed fallback`);
		}
	} catch (err) {
		console.warn(`[tds-landingpage] legal document "${key}" fetch failed, using committed fallback:`, err);
	}
	return fallbackBytes(key);
}
var legalCopy = {
	de: {
		agbTitle: "Allgemeine Geschäftsbedingungen",
		agbShort: "AGB",
		agbDescription: "Allgemeine Geschäftsbedingungen von Tracht Digital Solutions — als Seite lesen oder als PDF herunterladen.",
		back: "← Zurück",
		download: "AGB als PDF herunterladen",
		viewerLabel: "AGB als PDF",
		viewerFallback: "Dein Browser kann das PDF nicht direkt anzeigen. Über die Schaltfläche oben öffnest du das Dokument oder lädst es herunter.",
		openInNewTab: "In neuem Tab öffnen"
	},
	en: {
		agbTitle: "Terms and Conditions",
		agbShort: "Terms",
		agbDescription: "Terms and Conditions of Tracht Digital Solutions — read them as a page or download the PDF.",
		back: "← Back",
		download: "Download the Terms as a PDF",
		viewerLabel: "Terms and Conditions as a PDF",
		viewerFallback: "Your browser cannot display the PDF inline. Use the button above to open or download the document.",
		openInNewTab: "Open in a new tab"
	}
};
//#endregion
export { legalDocBytes as n, legalDocMeta as r, legalCopy as t };
