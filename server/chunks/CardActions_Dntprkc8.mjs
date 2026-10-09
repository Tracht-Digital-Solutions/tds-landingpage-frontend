import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead } from "./sequence_n1BymCGP.mjs";
import { t as createComponent } from "./compiler_B89CkCkP.mjs";
//#region \0virtual:media-versions
var _virtual_media_versions_default = {
	"/demos/demo1-480.webp": "03e79b4e2e",
	"/demos/demo1-960.webp": "54013d0eb4",
	"/demos/demo1-favicon.svg": "e6d2e59b7b",
	"/demos/demo1.webp": "4a282c6a28",
	"/demos/demo2-480.webp": "8ba6b6230d",
	"/demos/demo2-960.webp": "72cf8b97ee",
	"/demos/demo2-favicon.svg": "2d8b028ca9",
	"/demos/demo2.webp": "2873fceddc",
	"/demos/demo3-480.webp": "cad4988347",
	"/demos/demo3-960.webp": "110f27a705",
	"/demos/demo3-favicon.svg": "7808e40370",
	"/demos/demo3.webp": "0da0b46290",
	"/demos/shop-480.webp": "2dee8234e1",
	"/demos/shop-960.webp": "6ef805a0b2",
	"/demos/shop-favicon.png": "c4ea5a7f9e",
	"/demos/shop.webp": "3afe99bdd0",
	"/references/hof-meerheck-480.webp": "a302980ec0",
	"/references/hof-meerheck-960.webp": "5fb51089fd",
	"/references/hof-meerheck.webp": "70450c8761",
	"/designstudien/jurisblick-480.webp": "e656d4188a",
	"/designstudien/jurisblick-960.webp": "f4e2a28fad",
	"/designstudien/jurisblick.webp": "8b0f83aa89",
	"/designstudien/kinderarztpraxis-sonnengarten-480.webp": "f8362fa998",
	"/designstudien/kinderarztpraxis-sonnengarten-960.webp": "f7fd09df19",
	"/designstudien/kinderarztpraxis-sonnengarten-mobil-480.webp": "3a9e76ff48",
	"/designstudien/kinderarztpraxis-sonnengarten-mobil-960.webp": "4ce5c56070",
	"/designstudien/kinderarztpraxis-sonnengarten-mobil.webp": "901d33ef97",
	"/designstudien/kinderarztpraxis-sonnengarten.webp": "0c9094b149",
	"/designstudien/mira-markt-480.webp": "054b7e6394",
	"/designstudien/mira-markt-960.webp": "eaef839358",
	"/designstudien/mira-markt.webp": "348cf6f98d",
	"/designstudien/mkb-beratung-480.webp": "cda47c15fa",
	"/designstudien/mkb-beratung-960.webp": "7e5f31bf88",
	"/designstudien/mkb-beratung.webp": "b635152767",
	"/designstudien/nordholz-tischlerei-480.webp": "48ba6b0cf7",
	"/designstudien/nordholz-tischlerei-960.webp": "c888f9171b",
	"/designstudien/nordholz-tischlerei.webp": "08efbd0305",
	"/designstudien/prisma-coat-480.webp": "869216626a",
	"/designstudien/prisma-coat-960.webp": "5f26dd3319",
	"/designstudien/prisma-coat.webp": "2c5fef344c",
	"/designstudien/serverspace24-480.webp": "2c68527f44",
	"/designstudien/serverspace24-960.webp": "df6843024f",
	"/designstudien/serverspace24-produktberater-480.webp": "8be21b2199",
	"/designstudien/serverspace24-produktberater-960.webp": "2d94a99070",
	"/designstudien/serverspace24-produktberater.webp": "2eac661efe",
	"/designstudien/serverspace24.webp": "d73ea65179",
	"/zertifikate/agile-project-management-atlassian-480.webp": "05f6f2f5cc",
	"/zertifikate/agile-project-management-atlassian-960.webp": "165c39921a",
	"/zertifikate/agile-project-management-atlassian.webp": "0d1fd154c2",
	"/zertifikate/azure-essentials-microsoft-480.webp": "d7716d5ef5",
	"/zertifikate/azure-essentials-microsoft-960.webp": "a744804c08",
	"/zertifikate/azure-essentials-microsoft.webp": "00596ead07",
	"/zertifikate/business-analysis-microsoft-480.webp": "2e69c5bf56",
	"/zertifikate/business-analysis-microsoft-960.webp": "43aa1e5960",
	"/zertifikate/business-analysis-microsoft.webp": "d650f4afa2",
	"/zertifikate/data-analysis-microsoft-480.webp": "4c3b0b5908",
	"/zertifikate/data-analysis-microsoft-960.webp": "b69e70bbe3",
	"/zertifikate/data-analysis-microsoft.webp": "4e5208d4b6",
	"/zertifikate/data-science-knime-480.webp": "ebdf754b48",
	"/zertifikate/data-science-knime-960.webp": "cbef184e33",
	"/zertifikate/data-science-knime.webp": "088056092d",
	"/zertifikate/docker-foundations-480.webp": "743c15434c",
	"/zertifikate/docker-foundations-960.webp": "15134264a6",
	"/zertifikate/docker-foundations.webp": "c51e0ec779",
	"/zertifikate/generative-ai-microsoft-480.webp": "8209a4e079",
	"/zertifikate/generative-ai-microsoft-960.webp": "f510068472",
	"/zertifikate/generative-ai-microsoft.webp": "7b23ede8ee",
	"/zertifikate/github-career-essentials-480.webp": "69a9387e56",
	"/zertifikate/github-career-essentials-960.webp": "81a7557605",
	"/zertifikate/github-career-essentials.webp": "637245020e",
	"/zertifikate/itsm-atlassian-480.webp": "93165ce4d6",
	"/zertifikate/itsm-atlassian-960.webp": "12ca382650",
	"/zertifikate/itsm-atlassian.webp": "361dddc638",
	"/zertifikate/penetration-testing-cybrary-480.webp": "d55f47cdea",
	"/zertifikate/penetration-testing-cybrary-960.webp": "ea82663f2c",
	"/zertifikate/penetration-testing-cybrary.webp": "75c9b4a5f1",
	"/zertifikate/product-management-aha-480.webp": "112ba98fec",
	"/zertifikate/product-management-aha-960.webp": "14b95eb35c",
	"/zertifikate/product-management-aha.webp": "1b866047cd",
	"/zertifikate/project-management-microsoft-480.webp": "bffd88dcbe",
	"/zertifikate/project-management-microsoft-960.webp": "279be5c1f4",
	"/zertifikate/project-management-microsoft.webp": "0f6abed8b7",
	"/zertifikate/seo-moz-480.webp": "510cccc005",
	"/zertifikate/seo-moz-960.webp": "ed6bed8c27",
	"/zertifikate/seo-moz.webp": "8b465ef023",
	"/images/business-card.webp": "4e9511046c"
};
//#endregion
//#region src/lib/mediaSrc.ts
/**
* A republished screenshot's URL with its content version: `/demos/demo1.webp`
* → `/demos/demo1.webp?v=3f9a…`.
*
* The files keep their names across `demos:sync`, `references:sync` and
* `businesscard:sync`, and browsers may keep them for a week — so without the
* version a new capture did not show on reload. The hash is of the bytes
* (`scripts/media-versions.mjs`), so it changes exactly when the picture does.
* A path without a known version is returned unchanged.
*
* Separate from `imageVariants.ts` on purpose: that module has no imports,
* because the sync scripts run it under plain Node.
*/
function mediaSrc(path) {
	const version = _virtual_media_versions_default[path];
	return version ? `${path}?v=${version}` : path;
}
//#endregion
//#region src/lib/cardActions.ts
/**
* The bar's own words — this site talking about its own controls, so they
* follow the page's locale and are not editable copy. A mislabelled control is
* an accessibility defect, not a matter of tone.
*
* `newTab` says the same thing as `demoUi.newTab` and `ReferenceCard`'s own
* copy of it, and that repetition is deliberate: the bar is used by card
* families that are kept apart on purpose, and reaching into one of their
* vocabularies for one string would couple all of them to it.
*/
var cardActionUi = {
	de: {
		service: "Leistung",
		newTab: "öffnet in neuem Tab"
	},
	en: {
		service: "Service",
		newTab: "opens in a new tab"
	}
};
//#endregion
//#region src/components/ui/CardActions.astro
createAstro("https://tracht-digital.de");
var $$CardActions = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CardActions;
	const { service = null, cta = null, lang } = Astro.props;
	const ui = cardActionUi[lang];
	return renderTemplate`${maybeRenderHead($$result)}<div class="card-actions" data-astro-cid-vltrmc2a>${service && renderTemplate`<a class="card-actions__service"${addAttribute(service.href, "href")} data-astro-cid-vltrmc2a><span class="sr-only" data-astro-cid-vltrmc2a>${ui.service}: </span>${service.label}<span aria-hidden="true" data-astro-cid-vltrmc2a> →</span></a>`}${cta?.preview && renderTemplate`<button type="button" class="card-actions__cta" hidden data-preview-open${addAttribute(cta.preview.src, "data-preview-src")}${addAttribute(cta.preview.alt, "data-preview-alt")}${addAttribute(cta.preview.title, "data-preview-title")}${addAttribute(cta.preview.caption, "data-preview-host")}${addAttribute(cta.preview.fit, "data-preview-fit")}${addAttribute(cta.preview.ratio, "data-preview-ratio")}${addAttribute(cta.preview.views ? JSON.stringify(cta.preview.views) : void 0, "data-preview-views")} data-astro-cid-vltrmc2a>${cta.label}${cta.detail && renderTemplate`<span class="sr-only" data-astro-cid-vltrmc2a> — ${cta.detail}</span>`}<span aria-hidden="true" data-astro-cid-vltrmc2a>→</span></button>`}${cta && !cta.preview && renderTemplate`<a class="card-actions__cta"${addAttribute(cta.href, "href")}${addAttribute(cta.external ? "_blank" : void 0, "target")}${addAttribute(cta.external ? "noopener noreferrer" : void 0, "rel")}${addAttribute(cta.hreflang, "hreflang")} data-astro-cid-vltrmc2a>${cta.label}${cta.detail && renderTemplate`<span class="sr-only" data-astro-cid-vltrmc2a> — ${cta.detail}</span>`}${cta.external && renderTemplate`<span class="sr-only" data-astro-cid-vltrmc2a> (${ui.newTab})</span>`}${cta.external ? renderTemplate`<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-vltrmc2a><line x1="7" y1="17" x2="17" y2="7" data-astro-cid-vltrmc2a></line><polyline points="7 7 17 7 17 17" data-astro-cid-vltrmc2a></polyline></svg>` : renderTemplate`<span aria-hidden="true" data-astro-cid-vltrmc2a>→</span>`}</a>`}</div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/CardActions.astro", void 0);
//#endregion
export { mediaSrc as n, $$CardActions as t };
