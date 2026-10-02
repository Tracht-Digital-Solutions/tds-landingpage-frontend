import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead } from "./sequence_CwpToexC.mjs";
import { t as createComponent } from "./compiler_BgboG8oT.mjs";
import { g as renderScript } from "./Layout_BDw59Jp-.mjs";
//#region src/components/ui/PreviewLightbox.astro
createAstro("https://tracht-digital.de");
var $$PreviewLightbox = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PreviewLightbox;
	const { lang } = Astro.props;
	const ui = lang === "de" ? {
		label: "Vergrößerte Vorschau",
		close: "Vorschau schließen",
		visit: "Zur Seite",
		newTab: "öffnet in neuem Tab",
		views: "Ansichten"
	} : {
		label: "Enlarged preview",
		close: "Close preview",
		visit: "Open the site",
		newTab: "opens in a new tab",
		views: "Views"
	};
	return renderTemplate`${maybeRenderHead($$result)}<dialog class="preview" data-preview-dialog${addAttribute(ui.label, "aria-label")} data-astro-cid-7etuoo3p><div class="preview__frame" data-astro-cid-7etuoo3p><button type="button" class="preview__close" data-preview-close data-astro-cid-7etuoo3p><span class="sr-only" data-astro-cid-7etuoo3p>${ui.close}</span><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-7etuoo3p><line x1="6" y1="6" x2="18" y2="18" data-astro-cid-7etuoo3p></line><line x1="18" y1="6" x2="6" y2="18" data-astro-cid-7etuoo3p></line></svg></button><div class="preview__well" data-preview-well data-astro-cid-7etuoo3p><img class="preview__img" data-preview-img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" data-astro-cid-7etuoo3p></div><div class="preview__views" data-preview-views-strip hidden role="group"${addAttribute(ui.views, "aria-label")} data-astro-cid-7etuoo3p></div><div class="preview__bar" data-astro-cid-7etuoo3p><div class="preview__meta" data-astro-cid-7etuoo3p><p class="preview__title" data-preview-title data-astro-cid-7etuoo3p></p><p class="preview__host" data-preview-host data-astro-cid-7etuoo3p></p></div><a class="preview__visit" data-preview-visit href="#" target="_blank" rel="noopener noreferrer" data-astro-cid-7etuoo3p>${ui.visit}<span class="sr-only" data-astro-cid-7etuoo3p> (${ui.newTab})</span><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-7etuoo3p><line x1="7" y1="17" x2="17" y2="7" data-astro-cid-7etuoo3p></line><polyline points="7 7 17 7 17 17" data-astro-cid-7etuoo3p></polyline></svg></a></div></div></dialog>${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/PreviewLightbox.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/PreviewLightbox.astro", void 0);
//#endregion
export { $$PreviewLightbox as t };
