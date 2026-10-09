import "./contentFetch_DOBZ-t4p.mjs";
import "./connection_B2KFfIq2.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
//#region src/lib/legal.ts
/**
* Fetch of the legal documents (AGB & co) uploaded in the admin panel, from
* `tds-ext-website-cms-pkg`'s public read surface.
*
* Same model as `cms.ts`: the panel is the editing surface, a save rebuilds
* the affected pages' cache, and this module supplies what those renders read.
* Nothing here runs in a visitor's browser — the PDF is served by the
* `/legal/{key}.pdf` route, which is a cached page like any other.
*
* The graceful-fallback contract is stricter than `cms.ts`'s, because a legal
* document that silently disappears is worse than a stale one: when the API is
* unreachable, or no document has been uploaded yet, the endpoints serve the
* committed copy in `src/assets/legal/`. So `/legal/agb.pdf` always resolves —
* an API hiccup can make it out of date, never absent.
*/
/**
* Every uploaded document's metadata. `{}` on any failure or in demo mode —
* callers then fall back to the committed copy.
*
* Generation-scoped rather than module-scoped: under SSR a module-level memo
* would pin the index for the life of the server, so a replaced AGB would
* never appear no matter how often its cache was rebuilt. See `./cache.ts`.
*/
async function fetchLegalIndex() {
	return {};
}
/** One document's metadata for a language, or null when none is uploaded. */
async function legalDocMeta(key, lang) {
	return (await fetchLegalIndex())[key]?.[lang] ?? null;
}
/**
* The committed fallback PDF for a document key.
*
* Anchored to `process.cwd()` rather than `import.meta.url`, which ENOENTs
* once Astro bundles the endpoint — the same trap the OG renderer and the
* vCard endpoint document.
*
* **Two locations, and the second one is the production one.** `src/assets`
* is right during `astro build`, where the cwd is the project root. This route
* is server-rendered now, so it also runs on the HOST, whose deploy tree has
* no `src/` at all — the fallback simply vanished and `/legal/agb.pdf`
* answered 404, i.e. the one outcome the committed copy exists to make
* impossible. `scripts/pack-release.mjs` copies the directory to
* `assets/legal` beside the server bundle (`tds.release.extraFiles`), and that
* is what the first candidate below reads.
*/
function fallbackBytes(key) {
	for (const dir of ["assets/legal", "src/assets/legal"]) try {
		return readFileSync(join(process.cwd(), dir, `${key}.pdf`));
	} catch {}
	return null;
}
/**
* The bytes to ship for a document: the uploaded PDF when the panel has one,
* else the committed fallback. `null` only when neither exists, which for
* `agb` cannot happen — the fallback is in the repository.
*
* Typed `Uint8Array` rather than `Buffer` because the value is handed straight
* to a `Response`, and lib.dom's `BodyInit` does not accept Node's `Buffer`.
*/
async function legalDocBytes(key, lang) {
	return fallbackBytes(key);
}
/**
* Page copy for the legal-document pages. Local, like the copy the impressum
* and datenschutz pages inline: it names this site's documents only.
*/
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
