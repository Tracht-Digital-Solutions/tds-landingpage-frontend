import "./contentCache_DmiZs_tG.mjs";
import "./connection_DyK1K_dS.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
//#region src/lib/legal.ts
async function fetchLegalIndex() {
	return {};
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
		viewerFallback: "Ihr Browser kann das PDF nicht direkt anzeigen. Über die Schaltfläche oben öffnen bzw. laden Sie das Dokument herunter.",
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
