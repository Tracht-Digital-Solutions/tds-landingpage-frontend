import { I as addAttribute, M as maybeRenderHead, T as renderComponent, j as renderTemplate } from "./sequence_BJTD5713.mjs";
import { t as createComponent } from "./astro-component_Bf647iZ6.mjs";
import { t as createAstro } from "./compiler_CC8dBrdY.mjs";
import { c as $$Arrow } from "./Layout_AJxkPOGm.mjs";
// \0virtual:media-versions
var _virtual_media_versions_default = {
	"/demos/demo1-480.webp": "56f00a9779",
	"/demos/demo1-960.webp": "03d7bce11e",
	"/demos/demo1-favicon.svg": "dd9df956e3",
	"/demos/demo1.webp": "b613da8d6f",
	"/demos/demo2-480.webp": "fe4c11610e",
	"/demos/demo2-960.webp": "b7f411d925",
	"/demos/demo2-favicon.svg": "2d8b028ca9",
	"/demos/demo2.webp": "9e7a623314",
	"/demos/demo3-480.webp": "5d20a83382",
	"/demos/demo3-960.webp": "41d13bd07d",
	"/demos/demo3-favicon.svg": "7808e40370",
	"/demos/demo3.webp": "ecab043ac6",
	"/demos/demo4-480.webp": "5f5d910f81",
	"/demos/demo4-960.webp": "9ad3c4df63",
	"/demos/demo4-favicon.svg": "dfc86a6c2a",
	"/demos/demo4.webp": "c280893367",
	"/demos/shop-480.webp": "3b9feefb46",
	"/demos/shop-960.webp": "a0d1fb8b73",
	"/demos/shop-favicon.png": "cf412e13af",
	"/demos/shop.webp": "9b12c5e25b",
	"/references/astera-480.webp": "4f67529a54",
	"/references/astera-960.webp": "122caf9274",
	"/references/astera.webp": "0df5ab8d32",
	"/references/hof-meerheck-480.webp": "11ee6d8d33",
	"/references/hof-meerheck-960.webp": "8b0caa9b5b",
	"/references/hof-meerheck.webp": "66009b8fba",
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
	"/images/business-card.webp": "635526fc7f",
	"/images/products/firmenwebsite-480.avif": "f18575df0e",
	"/images/products/firmenwebsite-480.webp": "16106075a6",
	"/images/products/firmenwebsite-800.avif": "5a7c9ae822",
	"/images/products/firmenwebsite-800.webp": "029716f76c",
	"/images/products/firmenwebsite-960.avif": "7428648bfd",
	"/images/products/firmenwebsite-960.webp": "4c66997190",
	"/images/products/firmenwebsite.avif": "527934c374",
	"/images/products/firmenwebsite.webp": "1255b91cce",
	"/images/products/ki-sichtbarkeit-480.avif": "ab1318a60c",
	"/images/products/ki-sichtbarkeit-480.webp": "d1e595c09a",
	"/images/products/ki-sichtbarkeit-800.avif": "1926882ce8",
	"/images/products/ki-sichtbarkeit-800.webp": "87ad1144dc",
	"/images/products/ki-sichtbarkeit-960.avif": "aee1260788",
	"/images/products/ki-sichtbarkeit-960.webp": "a027b3182d",
	"/images/products/ki-sichtbarkeit.avif": "0ade1a569c",
	"/images/products/ki-sichtbarkeit.webp": "927675f9d9",
	"/images/products/onepager-480.avif": "c0a48259b4",
	"/images/products/onepager-480.webp": "621b246d2f",
	"/images/products/onepager-800.avif": "6bd75ee361",
	"/images/products/onepager-800.webp": "8df078fa12",
	"/images/products/onepager-960.avif": "2886857fde",
	"/images/products/onepager-960.webp": "f2500fd541",
	"/images/products/onepager.avif": "e4fc0ea7f9",
	"/images/products/onepager.webp": "66b7015a41",
	"/images/products/online-formular-480.avif": "852056206d",
	"/images/products/online-formular-480.webp": "86131b4c52",
	"/images/products/online-formular-800.avif": "c39d485c19",
	"/images/products/online-formular-800.webp": "03c26fc4a7",
	"/images/products/online-formular-960.avif": "458eea0539",
	"/images/products/online-formular-960.webp": "cb9270e882",
	"/images/products/online-formular.avif": "dd8ff92b99",
	"/images/products/online-formular.webp": "87cece0b0c",
	"/images/products/wartung-480.avif": "81b074c021",
	"/images/products/wartung-480.webp": "b30c540c9d",
	"/images/products/wartung-800.avif": "7ff95ab917",
	"/images/products/wartung-800.webp": "e7877bd89f",
	"/images/products/wartung-960.avif": "9ded47966c",
	"/images/products/wartung-960.webp": "0574443d49",
	"/images/products/wartung.avif": "6857b2d47e",
	"/images/products/wartung.webp": "2cfb328a3a"
};
// src/lib/mediaSrc.ts
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
// src/lib/cardActions.ts
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
// src/components/ui/CardActions.astro
createAstro("https://tracht-digital.de");
var $$CardActions = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CardActions;
	const { service = null, cta = null, lang } = Astro.props;
	const ui = cardActionUi[lang];
	return renderTemplate`${maybeRenderHead($$result)}<div class="card-actions" data-astro-cid-vltrmc2a>${service && renderTemplate`<a class="card-actions__service"${addAttribute(service.href, "href")} data-astro-cid-vltrmc2a><span class="sr-only" data-astro-cid-vltrmc2a>${ui.service}: </span>${service.label}<span aria-hidden="true" data-astro-cid-vltrmc2a>${renderComponent($$result, "Arrow", $$Arrow, {
		"dir": "right",
		"data-astro-cid-vltrmc2a": true
	})}</span></a>`}${cta?.preview && renderTemplate`<button type="button" class="card-actions__cta" hidden data-preview-open${addAttribute(cta.preview.src, "data-preview-src")}${addAttribute(cta.preview.alt, "data-preview-alt")}${addAttribute(cta.preview.title, "data-preview-title")}${addAttribute(cta.preview.caption, "data-preview-host")}${addAttribute(cta.preview.fit, "data-preview-fit")}${addAttribute(cta.preview.ratio, "data-preview-ratio")}${addAttribute(cta.preview.views ? JSON.stringify(cta.preview.views) : void 0, "data-preview-views")} data-astro-cid-vltrmc2a>${cta.label}${cta.detail && renderTemplate`<span class="sr-only" data-astro-cid-vltrmc2a> — ${cta.detail}</span>`}<span aria-hidden="true" data-astro-cid-vltrmc2a>${renderComponent($$result, "Arrow", $$Arrow, {
		"dir": "right",
		"data-astro-cid-vltrmc2a": true
	})}</span></button>`}${cta && !cta.preview && renderTemplate`<a class="card-actions__cta"${addAttribute(cta.href, "href")}${addAttribute(cta.external ? "_blank" : void 0, "target")}${addAttribute(cta.external ? "noopener noreferrer" : void 0, "rel")}${addAttribute(cta.hreflang, "hreflang")} data-astro-cid-vltrmc2a>${cta.label}${cta.detail && renderTemplate`<span class="sr-only" data-astro-cid-vltrmc2a> — ${cta.detail}</span>`}${cta.external && renderTemplate`<span class="sr-only" data-astro-cid-vltrmc2a> (${ui.newTab})</span>`}${cta.external ? renderTemplate`<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-vltrmc2a><polyline points="8.5 7.5 16.5 7.5 16.5 15.5" data-astro-cid-vltrmc2a></polyline></svg>` : renderTemplate`<span aria-hidden="true" data-astro-cid-vltrmc2a>${renderComponent($$result, "Arrow", $$Arrow, {
		"dir": "right",
		"data-astro-cid-vltrmc2a": true
	})}</span>`}</a>`}</div>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/CardActions.astro", void 0);
export { mediaSrc as n, $$CardActions as t };
