//#region src/assets/portrait.webp
var portrait_default = new Proxy({
	"src": "/_astro/portrait.CiEJjxjj.webp",
	"width": 1500,
	"height": 2100,
	"format": "webp"
}, { get(target, name, receiver) {
	if (name === "clone") return structuredClone(target);
	if (name === "fsPath") return "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/assets/portrait.webp";
	return target[name];
} });
//#endregion
export { portrait_default as t };
