// src/lib/heading.ts
/**
* One plain heading from the CMS's two-part headline.
*
* Until 2026-11-13 every section set its last words as an italic accent and
* ended on a full stop ("Projekte und *Referenzen*."), the same template seven
* times on one page. The panel still stores the two fields, so they are joined
* here; a closing full stop goes, a question mark stays.
*/
function headingText(headline, accent = "") {
	return [headline, accent].map((part) => part.trim()).filter(Boolean).join(" ").replace(/\s*\.$/, "");
}
export { headingText as t };
