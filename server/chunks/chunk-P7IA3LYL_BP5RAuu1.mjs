// node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-P7IA3LYL.js
var PROPERTY_ORIGINS = {
	journal: "https://blog.tracht-digital.de",
	tools: "https://tools.tracht-digital.de",
	shop: "https://shop.tracht-digital.de",
	main: "https://tracht-digital.de"
};
var LABELS = {
	journal: {
		de: "Ratgeber",
		en: "Ratgeber"
	},
	tools: {
		de: "Online-Tools",
		en: "Online-Tools"
	},
	shop: {
		de: "Digitalmarkt",
		en: "Digitalmarkt"
	},
	main: {
		de: "Startseite",
		en: "Home"
	}
};
function propertyLabel(key, lang) {
	return LABELS[key][lang];
}
function propertyHome(key, lang) {
	return `${PROPERTY_ORIGINS[key]}${lang === "en" ? "/en/" : "/"}`;
}
`${PROPERTY_ORIGINS.main}`, `${PROPERTY_ORIGINS.main}`;
[
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
export { propertyHome as n, propertyLabel as r, PROPERTY_ORIGINS as t };
