import { t as __exportAll } from "./chunks/rolldown-runtime_D7D4PA-g.mjs";
import { D as LocalsReassigned, E as LocalsNotAnObject, G as ReservedSlotName, H as PrerenderClientAddressNotAvailable, I as NoManifestAvailable, J as SessionStorageInitError, K as ResponseSentError, O as MiddlewareNoDataOrNextCalled, X as StaticClientAddressNotAvailable, Y as SessionStorageSaveError, a as AstroResponseHeadersReassigned, et as i18nNoLocaleFoundInPath, h as ForbiddenRewrite, i as ActionsReturnedInvalidDataError, k as MiddlewareNotAResponse, n as isAstroError, o as CacheNotEnabled, r as ActionNotFoundError, s as ClientAddressNotAvailable, t as AstroError } from "./chunks/errors_BP0o2XvA.mjs";
import { $ as ASTRO_ERROR_HEADER, C as renderJSX, Ct as stripRequestBase, E as chunkToString, F as isRenderInstruction, G as getDefaultStatusCode, H as createManifestMemo, I as normalizeCspResourceEntry, J as isRoute500, K as routeHasHtmlExtension, L as pushDirective, O as renderSlotToString, Q as pathHasLocale, S as renderPage, St as slash, Tt as generateCspDigest, U as getCustom404Route, V as createAsyncManifestMemo, W as getCustom500Route, X as normalizeTheLocale, Y as getErrorRoutePath, Z as normalizeThePath, _ as DEFAULT_404_ROUTE, _t as joinPaths, a as getRouteGenerator, at as nodeRequestAbortControllerCleanupSymbol, b as readBodyWithLimit, ct as shouldAppendForwardSlash, d as getEnvironment, dt as collapseDuplicateSlashes, et as ASTRO_GENERATOR, f as copyRequest, ft as collapseDuplicateTrailingSlashes, g as validateAndDecodePathname, h as MultiLevelEncodingError, i as getRouteCache, it as fetchStateSymbol, k as isRenderTemplateResult, l as AstroIntegrationLogger, lt as defineMiddleware, m as setOriginPathname, mt as isInternalPath, n as getParams, nt as REROUTABLE_STATUS_CODES, o as getLogger, ot as originPathnameSymbol, p as getOriginPathname, pt as hasFileExtension, q as isRoute404, r as getProps, rt as clientAddressSymbol, s as getResolvedLogger, st as responseSentSymbol$1, t as sequence, tt as REDIRECT_STATUS_CODES, u as astroToRuntimeLogger, ut as appendForwardSlash, v as SERVER_ISLAND_COMPONENT, vt as prependForwardSlash$1, wt as decodeKey, xt as removeTrailingForwardSlash, y as BodySizeLimitError, yt as removeLeadingForwardSlash, z as renderEndpoint } from "./chunks/sequence_CNTE2LHY.mjs";
import { n as matchPattern } from "./chunks/remote_BgpFkaRQ.mjs";
import React, { createElement, memo } from "react";
import ReactDOM from "react-dom/server";
import picomatch from "picomatch";
import { parse, stringify, unflatten } from "devalue";
import colors from "piccolore";
import { parseCookie, stringifySetCookie } from "cookie";
import { escape } from "html-escaper";
import { createStorage } from "unstorage";
import { AsyncLocalStorage } from "node:async_hooks";
import fs, { createReadStream } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { Http2ServerResponse } from "node:http2";
import url from "node:url";
import http from "node:http";
import https from "node:https";
import enableDestroy from "server-destroy";
import os from "node:os";
import send from "send";
//#region node_modules/astro/dist/core/middleware/noop-middleware.js
var NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
	return await next();
};
//#endregion
//#region node_modules/astro/dist/core/app/manifest.js
function deserializeManifest(serializedManifest, routesList) {
	const routes = [];
	if (serializedManifest.routes) for (const serializedRoute of serializedManifest.routes) routes.push({
		...serializedRoute,
		routeData: deserializeRouteData(serializedRoute.routeData)
	});
	if (routesList) for (const route of routesList?.routes) routes.push({
		file: "",
		links: [],
		scripts: [],
		styles: [],
		routeData: route
	});
	const assets = new Set(serializedManifest.assets);
	const componentMetadata = new Map(serializedManifest.componentMetadata);
	const inlinedScripts = new Map(serializedManifest.inlinedScripts);
	const clientDirectives = new Map(serializedManifest.clientDirectives);
	const key = decodeKey(serializedManifest.key);
	return {
		middleware() {
			return { onRequest: NOOP_MIDDLEWARE_FN };
		},
		...serializedManifest,
		rootDir: new URL(serializedManifest.rootDir),
		srcDir: new URL(serializedManifest.srcDir),
		publicDir: new URL(serializedManifest.publicDir),
		outDir: new URL(serializedManifest.outDir),
		cacheDir: new URL(serializedManifest.cacheDir),
		buildClientDir: new URL(serializedManifest.buildClientDir),
		buildServerDir: new URL(serializedManifest.buildServerDir),
		assets,
		componentMetadata,
		inlinedScripts,
		clientDirectives,
		routes,
		key
	};
}
function deserializeRouteData(rawRouteData) {
	return {
		route: rawRouteData.route,
		type: rawRouteData.type,
		pattern: new RegExp(rawRouteData.pattern),
		params: rawRouteData.params,
		component: rawRouteData.component,
		pathname: rawRouteData.pathname || void 0,
		segments: rawRouteData.segments,
		prerender: rawRouteData.prerender,
		redirect: rawRouteData.redirect,
		redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
		fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
			return deserializeRouteData(fallback);
		}),
		isIndex: rawRouteData.isIndex,
		origin: rawRouteData.origin,
		distURL: rawRouteData.distURL
	};
}
function deserializeRouteInfo(rawRouteInfo) {
	return {
		styles: rawRouteInfo.styles,
		file: rawRouteInfo.file,
		links: rawRouteInfo.links,
		scripts: rawRouteInfo.scripts,
		routeData: deserializeRouteData(rawRouteInfo.routeData)
	};
}
//#endregion
//#region \0astro:react:opts
var _astro_react_opts_default = {
	include: void 0,
	exclude: void 0,
	experimentalReactChildren: false,
	experimentalDisableStreaming: false
};
//#endregion
//#region node_modules/@astrojs/react/dist/context.js
var contexts = /* @__PURE__ */ new WeakMap();
var ID_PREFIX = "r";
function getContext(rendererContextResult) {
	if (contexts.has(rendererContextResult)) return contexts.get(rendererContextResult);
	const ctx = {
		currentIndex: 0,
		get id() {
			return ID_PREFIX + this.currentIndex.toString();
		}
	};
	contexts.set(rendererContextResult, ctx);
	return ctx;
}
function incrementId(rendererContextResult) {
	const ctx = getContext(rendererContextResult);
	const id = ctx.id;
	ctx.currentIndex++;
	return id;
}
//#endregion
//#region node_modules/@astrojs/react/dist/static-html.js
var StaticHtml = ({ value, name, hydrate = true }) => {
	if (value == null || value.trim() === "") return null;
	return createElement(hydrate ? "astro-slot" : "astro-static-slot", {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value }
	});
};
var static_html_default = memo(StaticHtml, () => true);
//#endregion
//#region node_modules/@astrojs/internal-helpers/dist/create-filter.js
function ensureArray(thing) {
	if (Array.isArray(thing)) return thing;
	if (thing == null) return [];
	return [thing];
}
function toMatcher(pattern) {
	if (pattern instanceof RegExp) return pattern;
	const normalized = slash(pattern);
	const fn = picomatch(normalized, { dot: true });
	return { test: (what) => fn(what) };
}
function createFilter(include, exclude) {
	const includeMatchers = ensureArray(include).map(toMatcher);
	const excludeMatchers = ensureArray(exclude).map(toMatcher);
	if (!includeMatchers.length && !excludeMatchers.length) return (id) => typeof id === "string" && !id.includes("\0");
	return function(id) {
		if (typeof id !== "string") return false;
		if (id.includes("\0")) return false;
		const pathId = slash(id);
		for (const matcher of excludeMatchers) {
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return false;
		}
		for (const matcher of includeMatchers) {
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return true;
		}
		return !includeMatchers.length;
	};
}
//#endregion
//#region node_modules/@astrojs/react/dist/server.js
var slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
var reactTypeof = /* @__PURE__ */ Symbol.for("react.element");
var reactTransitionalTypeof = /* @__PURE__ */ Symbol.for("react.transitional.element");
var filter = _astro_react_opts_default?.include || _astro_react_opts_default?.exclude ? createFilter(_astro_react_opts_default.include, _astro_react_opts_default.exclude) : null;
async function check(Component, props, children, metadata) {
	if (typeof Component === "object") return Component["$$typeof"].toString().slice(7).startsWith("react");
	if (typeof Component !== "function") return false;
	if (Component.name === "QwikComponent") return false;
	if (typeof Component === "function" && Component["$$typeof"] === /* @__PURE__ */ Symbol.for("react.forward_ref")) return false;
	if (Component.prototype != null && typeof Component.prototype.render === "function") return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	if (filter && metadata?.componentUrl && !filter(metadata.componentUrl)) return false;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && (vnode["$$typeof"] === reactTypeof || vnode["$$typeof"] === reactTransitionalTypeof)) isReactComponent = true;
		} catch {}
		return React.createElement("div");
	}
	await renderToStaticMarkup.call(this, Tester, props, children);
	return isReactComponent;
}
async function getNodeWritable() {
	let { Writable } = await import(
		/* @vite-ignore */
		"node:stream"
);
	return Writable;
}
function needsHydration(metadata) {
	return metadata?.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
	let prefix;
	if (this && this.result) prefix = incrementId(this.result);
	const attrs = { prefix };
	delete props["class"];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName(key);
		slots[name] = React.createElement(static_html_default, {
			hydrate: needsHydration(metadata),
			value,
			name
		});
	}
	const newProps = {
		...props,
		...slots
	};
	const newChildren = children ?? props.children;
	if (children && _astro_react_opts_default.experimentalReactChildren) {
		attrs["data-react-children"] = true;
		newProps.children = (await import("./chunks/vnode-children_B6vVcKTz.mjs").then((mod) => mod.default))(children);
	} else if (newChildren != null) newProps.children = React.createElement(static_html_default, {
		hydrate: needsHydration(metadata),
		value: newChildren
	});
	const formState = this ? await getFormState(this) : void 0;
	if (formState) {
		attrs["data-action-result"] = JSON.stringify(formState[0]);
		attrs["data-action-key"] = formState[1];
		attrs["data-action-name"] = formState[2];
	}
	const vnode = React.createElement(Component, newProps);
	const renderOptions = {
		identifierPrefix: prefix,
		formState
	};
	let html;
	if (_astro_react_opts_default.experimentalDisableStreaming) html = ReactDOM.renderToString(vnode);
	else if ("renderToReadableStream" in ReactDOM) html = await renderToReadableStreamAsync(vnode, renderOptions);
	else html = await renderToPipeableStreamAsync(vnode, renderOptions);
	html = html.replace(/<link\s[^>]*rel="(?:preload|modulepreload|stylesheet|preconnect|dns-prefetch)"[^>]*>/g, "");
	return {
		html,
		attrs
	};
}
async function getFormState({ result }) {
	const { request, actionResult } = result;
	if (!actionResult) return void 0;
	if (!isFormRequest(request.headers.get("content-type"))) return void 0;
	const { searchParams } = new URL(request.url);
	const actionKey = (await request.clone().formData()).get("$ACTION_KEY")?.toString();
	const actionName = searchParams.get("_action");
	if (!actionKey || !actionName) return void 0;
	return [
		actionResult,
		actionKey,
		actionName
	];
}
async function renderToPipeableStreamAsync(vnode, options) {
	const Writable = await getNodeWritable();
	let html = "";
	return new Promise((resolve, reject) => {
		let error = void 0;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			...options,
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(new Writable({
					write(chunk, _encoding, callback) {
						html += chunk.toString("utf-8");
						callback();
					},
					destroy() {
						resolve(html);
					}
				}));
			}
		});
	});
}
async function readResult(stream) {
	const reader = stream.getReader();
	let result = "";
	const decoder = new TextDecoder("utf-8");
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) result += decoder.decode(value);
			else decoder.decode(/* @__PURE__ */ new Uint8Array());
			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}
async function renderToReadableStreamAsync(vnode, options) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode, options));
}
var formContentTypes$1 = ["application/x-www-form-urlencoded", "multipart/form-data"];
function isFormRequest(contentType) {
	const type = contentType?.split(";")[0].toLowerCase();
	return formContentTypes$1.some((t) => type === t);
}
//#endregion
//#region \0virtual:astro:renderers
var renderers = [Object.assign({
	"name": "@astrojs/react",
	"clientEntrypoint": "@astrojs/react/client.js",
	"serverEntrypoint": "@astrojs/react/server.js"
}, { ssr: {
	name: "@astrojs/react",
	check,
	renderToStaticMarkup,
	supportsAstroStaticSlot: true
} })];
[
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "page",
			"component": "_server-islands.astro",
			"params": ["name"],
			"segments": [[{
				"content": "_server-islands",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "name",
				"dynamic": true,
				"spread": false
			}]],
			"pattern": "^\\/_server-islands\\/([^/]+?)\\/?$",
			"prerender": false,
			"isIndex": false,
			"fallbackRoutes": [],
			"route": "/_server-islands/[name]",
			"origin": "internal",
			"distURL": [],
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/_image",
			"component": "node_modules/astro/dist/assets/endpoint/node.js",
			"params": [],
			"pathname": "/_image",
			"pattern": "^\\/_image\\/?$",
			"segments": [[{
				"content": "_image",
				"dynamic": false,
				"spread": false
			}]],
			"type": "endpoint",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"isIndex": false,
			"origin": "internal",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/en/business-card",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/en\\/business-card\\/?$",
			"segments": [[{
				"content": "en",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "business-card",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/en/business-card.astro",
			"pathname": "/en/business-card",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/en/legal/agb",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/en\\/legal\\/agb\\/?$",
			"segments": [
				[{
					"content": "en",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "legal",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "agb",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/en/legal/agb.astro",
			"pathname": "/en/legal/agb",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/en/legal/agb.pdf",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/en\\/legal\\/agb\\.pdf$",
			"segments": [
				[{
					"content": "en",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "legal",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "agb.pdf",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/en/legal/agb.pdf.ts",
			"pathname": "/en/legal/agb.pdf",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/en/preise",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/en\\/preise\\/?$",
			"segments": [[{
				"content": "en",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "preise",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/en/preise.astro",
			"pathname": "/en/preise",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/en/services/[slug]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/en\\/services\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "en",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "services",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["slug"],
			"component": "src/pages/en/services/[slug].astro",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/en",
			"isIndex": true,
			"type": "page",
			"pattern": "^\\/en\\/?$",
			"segments": [[{
				"content": "en",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/en/index.astro",
			"pathname": "/en",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/legal/agb",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/legal\\/agb\\/?$",
			"segments": [[{
				"content": "legal",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "agb",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/legal/agb.astro",
			"pathname": "/legal/agb",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/legal/agb.pdf",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/legal\\/agb\\.pdf$",
			"segments": [[{
				"content": "legal",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "agb.pdf",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/legal/agb.pdf.ts",
			"pathname": "/legal/agb.pdf",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/legal/datenschutz",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/legal\\/datenschutz\\/?$",
			"segments": [[{
				"content": "legal",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "datenschutz",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/legal/datenschutz.astro",
			"pathname": "/legal/datenschutz",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/legal/impressum",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/legal\\/impressum\\/?$",
			"segments": [[{
				"content": "legal",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "impressum",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/legal/impressum.astro",
			"pathname": "/legal/impressum",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/leistungen/[slug]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/leistungen\\/([^/]+?)\\/?$",
			"segments": [[{
				"content": "leistungen",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "slug",
				"dynamic": true,
				"spread": false
			}]],
			"params": ["slug"],
			"component": "src/pages/leistungen/[slug].astro",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/preise",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/preise\\/?$",
			"segments": [[{
				"content": "preise",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/preise.astro",
			"pathname": "/preise",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/sitemap-0.xml",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/sitemap-0\\.xml$",
			"segments": [[{
				"content": "sitemap-0.xml",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/sitemap-0.xml.ts",
			"pathname": "/sitemap-0.xml",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/tds/cache/[action]",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/tds\\/cache\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "tds",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "cache",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "action",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["action"],
			"component": "src/pages/tds/cache/[action].ts",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/tds/connect/status",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/tds\\/connect\\/status\\/?$",
			"segments": [
				[{
					"content": "tds",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "connect",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "status",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/tds/connect/status.ts",
			"pathname": "/tds/connect/status",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/tds/connect",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/tds\\/connect\\/?$",
			"segments": [[{
				"content": "tds",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "connect",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/tds/connect.ts",
			"pathname": "/tds/connect",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/tds-runtime.json",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/tds-runtime\\.json$",
			"segments": [[{
				"content": "tds-runtime.json",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/tds-runtime.json.ts",
			"pathname": "/tds-runtime.json",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/visitenkarte",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/visitenkarte\\/?$",
			"segments": [[{
				"content": "visitenkarte",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/visitenkarte.astro",
			"pathname": "/visitenkarte",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/",
			"isIndex": true,
			"type": "page",
			"pattern": "^\\/$",
			"segments": [],
			"params": [],
			"component": "src/pages/index.astro",
			"pathname": "/",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	}
].map(deserializeRouteInfo);
//#endregion
//#region \0virtual:astro:pages
var _page0 = () => import("./chunks/node_CsrkemkU.mjs");
var _page1 = () => import("./chunks/business-card_BqF0lJ0n.mjs");
var _page2 = () => import("./chunks/agb_BM4JljXd.mjs");
var _page3 = () => import("./chunks/agb_CUN8Itqz.mjs");
var _page4 = () => import("./chunks/preise_nNw87ZxF.mjs");
var _page5 = () => import("./chunks/_slug__D1t8xFfU.mjs");
var _page6 = () => import("./chunks/index_CzQhmef2.mjs");
var _page7 = () => import("./chunks/agb_DJxqPaW4.mjs");
var _page8 = () => import("./chunks/agb_D19EDCVh.mjs");
var _page9 = () => import("./chunks/datenschutz_imFcJjI2.mjs");
var _page10 = () => import("./chunks/impressum_DQQE6F_7.mjs");
var _page11 = () => import("./chunks/_slug__CkSdI7WG.mjs");
var _page12 = () => import("./chunks/preise_Dk6MVJiE.mjs");
var _page13 = () => import("./chunks/sitemap-0_BcfG9V_u.mjs");
var _page14 = () => import("./chunks/_action__C25BJ7KX.mjs");
var _page15 = () => import("./chunks/status_DFMdLP0L.mjs");
var _page16 = () => import("./chunks/connect_C4GxZUOa.mjs");
var _page17 = () => import("./chunks/tds-runtime_GkAkSCJb.mjs");
var _page18 = () => import("./chunks/visitenkarte_Fr4Tol-z.mjs");
var _page19 = () => import("./chunks/index_CKqm5-xz.mjs");
var pageMap = /* @__PURE__ */ new Map([
	["node_modules/astro/dist/assets/endpoint/node.js", _page0],
	["src/pages/en/business-card.astro", _page1],
	["src/pages/en/legal/agb.astro", _page2],
	["src/pages/en/legal/agb.pdf.ts", _page3],
	["src/pages/en/preise.astro", _page4],
	["src/pages/en/services/[slug].astro", _page5],
	["src/pages/en/index.astro", _page6],
	["src/pages/legal/agb.astro", _page7],
	["src/pages/legal/agb.pdf.ts", _page8],
	["src/pages/legal/datenschutz.astro", _page9],
	["src/pages/legal/impressum.astro", _page10],
	["src/pages/leistungen/[slug].astro", _page11],
	["src/pages/preise.astro", _page12],
	["src/pages/sitemap-0.xml.ts", _page13],
	["src/pages/tds/cache/[action].ts", _page14],
	["src/pages/tds/connect/status.ts", _page15],
	["src/pages/tds/connect.ts", _page16],
	["src/pages/tds-runtime.json.ts", _page17],
	["src/pages/visitenkarte.astro", _page18],
	["src/pages/index.astro", _page19]
]);
//#endregion
//#region \0virtual:astro:manifest
var _manifest = deserializeManifest({"rootDir":"file:///home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/","cacheDir":"file:///home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/node_modules/.astro/","outDir":"file:///home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/dist/","srcDir":"file:///home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/","publicDir":"file:///home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/public/","buildClientDir":"file:///home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/dist/client/","buildServerDir":"file:///home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/dist/server/","adapterName":"@astrojs/node","assetsDir":"_astro","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/_image","component":"node_modules/astro/dist/assets/endpoint/node.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/500","isIndex":false,"type":"page","pattern":"^\\/500\\/?$","segments":[[{"content":"500","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/500.astro","pathname":"/500","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"},{"type":"inline","content":":root[data-theme=dark] .site-logo[data-astro-cid-nen7h5rs]{filter:brightness(0)invert()}.site-logo[data-astro-cid-nen7h5rs]{transition:height .32s cubic-bezier(.4,0,.2,1)}.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:2rem}@media (min-width:1024px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:3rem}}@media (prefers-reduced-motion:reduce){.site-logo[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}.site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:62%;border-radius:var(--tds-radius-pill);background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);-webkit-backdrop-filter:blur(22px)saturate(150%);backdrop-filter:blur(22px)saturate(150%);transition:background-color .25s,box-shadow .25s}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:68%;background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:none}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:0 8px 22px -16px #0000008c}@media (max-width:1023px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false],:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{box-shadow:none;background-color:#0000}}@media (min-width:1024px){:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{background-color:#0000}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent)}.site-header[data-astro-cid-nen7h5rs]{max-width:100%;box-shadow:none;-webkit-backdrop-filter:blur(24px)saturate(150%);backdrop-filter:blur(24px)saturate(150%);background-color:#0000;margin-inline:auto;transition:max-width .32s cubic-bezier(.4,0,.2,1),top .32s cubic-bezier(.4,0,.2,1),background-color .25s,box-shadow .25s;top:.75rem;left:0;right:0;transform:none}.site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);max-width:56rem;top:1rem;box-shadow:0 8px 22px -16px #050f6847}}@media (prefers-reduced-motion:reduce){.site-header[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}\n.vcard[data-astro-cid-pbperak2]{background:var(--color-soft);border-radius:6px;padding:2rem 1.75rem}.vcard__head[data-astro-cid-pbperak2]{flex-wrap:wrap;align-items:center;gap:1.5rem;display:flex}.vcard__portrait[data-astro-cid-pbperak2]{border-radius:var(--tds-radius-pill);object-fit:cover;flex:none;width:5rem;height:5rem}.vcard__name[data-astro-cid-pbperak2]{font-family:var(--font-display);letter-spacing:-.02em;color:var(--color-black);margin:0;font-size:clamp(1.75rem,1.2rem + 2vw,2.5rem);line-height:1.1}.vcard__role[data-astro-cid-pbperak2]{color:var(--color-accent);margin:.5rem 0 0}.vcard__org[data-astro-cid-pbperak2]{color:var(--color-muted);margin:.15rem 0 0;font-size:.9375rem}.vcard__actions[data-astro-cid-pbperak2]{grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr));gap:.75rem;margin-top:2rem;display:grid}.vcard__action[data-astro-cid-pbperak2]{background:var(--color-paper);transition:background-color .2s var(--tds-ease-out), transform .2s var(--tds-ease-out);border-radius:6px;flex-direction:column;gap:.15rem;padding:.875rem 1rem;text-decoration:none;display:flex}.vcard__action[data-astro-cid-pbperak2]:hover{background:color-mix(in srgb, var(--color-accent) 8%, var(--color-paper));transform:translateY(-2px)}.vcard__action-label[data-astro-cid-pbperak2]{letter-spacing:.04em;text-transform:uppercase;color:var(--color-muted);font-size:.75rem}.vcard__action-value[data-astro-cid-pbperak2]{color:var(--color-black);overflow-wrap:anywhere}.vcard__save[data-astro-cid-pbperak2]{border-radius:var(--tds-radius-pill);background:var(--color-black);color:var(--color-paper);transition:transform .2s var(--tds-ease-out), opacity .2s var(--tds-ease-out);align-items:center;gap:.6rem;margin-top:1.5rem;padding:.85rem 1.5rem;text-decoration:none;display:inline-flex}.vcard__save[data-astro-cid-pbperak2]:hover{opacity:.9;transform:translateY(-2px)}.vcard__qr[data-astro-cid-pbperak2]{border-top:1px solid color-mix(in srgb, var(--color-black) 10%, transparent);flex-wrap:wrap;align-items:center;gap:1.5rem;margin-top:2rem;padding-top:2rem;display:flex}.vcard__qr-code[data-astro-cid-pbperak2]{box-sizing:border-box;background:#fff;border-radius:6px;flex:none;width:7.5rem;height:7.5rem;padding:.625rem;display:block}.vcard__qr-title[data-astro-cid-pbperak2]{font-family:var(--font-display);color:var(--color-black);margin:0 0 .35rem;font-size:1.125rem}.vcard__qr-text[data-astro-cid-pbperak2]{max-width:26rem;color:var(--color-muted);margin:0;line-height:1.6}.vcard-pitch[data-astro-cid-pbperak2]{margin-top:3rem}.vcard-pitch__title[data-astro-cid-pbperak2]{font-family:var(--font-display);color:var(--color-black);margin:0 0 .75rem;font-size:1.5rem;line-height:1.2}.vcard-pitch__text[data-astro-cid-pbperak2]{max-width:40rem;color:var(--color-muted);margin:0 0 1rem;line-height:1.7}@media (min-width:768px){.vcard[data-astro-cid-pbperak2]{padding:2.5rem}.vcard__portrait[data-astro-cid-pbperak2]{width:6.5rem;height:6.5rem}}@media (prefers-reduced-motion:reduce){.vcard__action[data-astro-cid-pbperak2]:hover,.vcard__save[data-astro-cid-pbperak2]:hover{transform:none}}\n"}],"routeData":{"route":"/en/business-card","isIndex":false,"type":"page","pattern":"^\\/en\\/business-card\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"business-card","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/business-card.astro","pathname":"/en/business-card","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/business-card-qr.svg","isIndex":false,"type":"endpoint","pattern":"^\\/en\\/business-card-qr\\.svg$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"business-card-qr.svg","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/business-card-qr.svg.ts","pathname":"/en/business-card-qr.svg","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"}],"routeData":{"route":"/en/legal/agb","isIndex":false,"type":"page","pattern":"^\\/en\\/legal\\/agb\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"legal","dynamic":false,"spread":false}],[{"content":"agb","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/legal/agb.astro","pathname":"/en/legal/agb","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/legal/agb.pdf","isIndex":false,"type":"endpoint","pattern":"^\\/en\\/legal\\/agb\\.pdf$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"legal","dynamic":false,"spread":false}],[{"content":"agb.pdf","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/legal/agb.pdf.ts","pathname":"/en/legal/agb.pdf","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"},{"type":"inline","content":":root[data-theme=dark] .site-logo[data-astro-cid-nen7h5rs]{filter:brightness(0)invert()}.site-logo[data-astro-cid-nen7h5rs]{transition:height .32s cubic-bezier(.4,0,.2,1)}.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:2rem}@media (min-width:1024px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:3rem}}@media (prefers-reduced-motion:reduce){.site-logo[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}.site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:62%;border-radius:var(--tds-radius-pill);background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);-webkit-backdrop-filter:blur(22px)saturate(150%);backdrop-filter:blur(22px)saturate(150%);transition:background-color .25s,box-shadow .25s}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:68%;background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:none}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:0 8px 22px -16px #0000008c}@media (max-width:1023px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false],:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{box-shadow:none;background-color:#0000}}@media (min-width:1024px){:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{background-color:#0000}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent)}.site-header[data-astro-cid-nen7h5rs]{max-width:100%;box-shadow:none;-webkit-backdrop-filter:blur(24px)saturate(150%);backdrop-filter:blur(24px)saturate(150%);background-color:#0000;margin-inline:auto;transition:max-width .32s cubic-bezier(.4,0,.2,1),top .32s cubic-bezier(.4,0,.2,1),background-color .25s,box-shadow .25s;top:.75rem;left:0;right:0;transform:none}.site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);max-width:56rem;top:1rem;box-shadow:0 8px 22px -16px #050f6847}}@media (prefers-reduced-motion:reduce){.site-header[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}\n.text-emph{color:var(--color-black);text-decoration:underline;-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-underline-offset:.22em;font-weight:600;text-decoration-thickness:2px}.tds-tone-navy .text-emph,.tds-tone-ink .text-emph{-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent)}\n@keyframes page-flyin{0%{opacity:0;transform:translate(-2rem)}to{opacity:1;transform:translate(0)}}.page-flyin[data-astro-cid-ltqv7bgc]{animation:page-flyin .52s var(--lp-ease-soft) both}@media (prefers-reduced-motion:reduce){.page-flyin[data-astro-cid-ltqv7bgc]{animation:none}}\n"}],"routeData":{"route":"/en/preise","isIndex":false,"type":"page","pattern":"^\\/en\\/preise\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"preise","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/preise.astro","pathname":"/en/preise","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"},{"type":"inline","content":".demo-grid[data-astro-cid-7ps2fawc]{--demo-gap:1rem;gap:var(--demo-gap);max-width:calc(var(--demo-count,5) * 26rem + (var(--demo-count,5) - 1) * var(--demo-gap));grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr));display:grid}@media (min-width:768px){.demo-grid[data-astro-cid-7ps2fawc]{--demo-gap:1.5rem}}.business-card-slot[data-astro-cid-f5m424za]{max-width:24rem}.reference-card__shot[data-astro-cid-f5m424za]{aspect-ratio:16/10;background:var(--color-soft);border-bottom:1px solid color-mix(in srgb, var(--color-black) 8%, transparent);position:relative;overflow:hidden}.reference-card__shot[data-astro-cid-f5m424za] img[data-astro-cid-f5m424za]{object-fit:cover;object-position:top center;width:100%;height:100%;display:block}.service-hero__photo[data-astro-cid-f5m424za]{opacity:.36}:root[data-theme=dark] .service-hero__photo[data-astro-cid-f5m424za]{opacity:.23}.stepper[data-astro-cid-f5m424za]{--stepper-marker:.875rem;gap:1.75rem;display:grid}.stepper__step[data-astro-cid-f5m424za]{grid-template-columns:auto minmax(0,1fr);align-items:start;gap:.875rem;display:grid;position:relative}.stepper__marker[data-astro-cid-f5m424za]{z-index:1;width:var(--stepper-marker);height:var(--stepper-marker);background:var(--color-accent);border-radius:9999px;margin-top:.35rem;position:relative}.stepper__text[data-astro-cid-f5m424za]{color:var(--color-black);line-height:1.55}.stepper__line[data-astro-cid-f5m424za]{left:calc(var(--stepper-marker) / 2);top:calc(var(--stepper-marker) + .35rem);background:color-mix(in srgb, var(--color-accent) 22%, transparent);transform-origin:top;width:2px;transition:transform .48s var(--tds-ease-out) var(--lp-reveal-delay,0s);position:absolute;bottom:-1.75rem;transform:translate(-1px)}html[data-reveal-active] .stepper__step[data-astro-cid-f5m424za]:not([data-revealed]) .stepper__line[data-astro-cid-f5m424za]{transform:translate(-1px)scaleY(0)}@media (min-width:40rem){.stepper[data-astro-cid-f5m424za]{grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:1.25rem}.stepper__step[data-astro-cid-f5m424za]{grid-template-columns:minmax(0,1fr);gap:.875rem}.stepper__marker[data-astro-cid-f5m424za]{margin-top:0}.stepper__text[data-astro-cid-f5m424za]{font-size:.9375rem}.stepper__line[data-astro-cid-f5m424za]{left:var(--stepper-marker);right:-1.25rem;top:calc(var(--stepper-marker) / 2);transform-origin:0;width:auto;height:2px;bottom:auto;transform:translateY(-1px)}html[data-reveal-active] .stepper__step[data-astro-cid-f5m424za]:not([data-revealed]) .stepper__line[data-astro-cid-f5m424za]{transform:translateY(-1px)scaleX(0)}}@media (prefers-reduced-motion:reduce){.stepper__line[data-astro-cid-f5m424za]{transition:none}}.err[data-astro-cid-gt6qm5qm]{text-align:center;background:var(--color-paper);place-items:center;min-height:100svh;padding:2rem;display:grid;position:relative;overflow:hidden}.err-glow[data-astro-cid-gt6qm5qm]{z-index:0;aspect-ratio:1;background:radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%);pointer-events:none;border-radius:50%;width:min(72vmin,540px);animation:6s ease-in-out infinite err-glow;position:absolute}.err-code[data-astro-cid-gt6qm5qm]{z-index:1;font-family:var(--font-display);letter-spacing:-.03em;color:var(--color-ink);font-size:clamp(7rem,34vw,22rem);font-weight:400;line-height:1;text-decoration:none;transition:color .2s;animation:.7s cubic-bezier(.22,1,.36,1) both err-in,7s ease-in-out .7s infinite err-float;position:relative}:is(.err-code[data-astro-cid-gt6qm5qm]:hover,.err-code[data-astro-cid-gt6qm5qm]:focus-visible){color:var(--color-accent)}@keyframes err-in{0%{opacity:0;transform:translateY(1.5rem)scale(.96)}to{opacity:1;transform:translateY(0)scale(1)}}@keyframes err-float{0%,to{transform:translateY(0)}50%{transform:translateY(-.6rem)}}@keyframes err-glow{0%,to{opacity:.45;transform:scale(1)}50%{opacity:.85;transform:scale(1.08)}}\n:root[data-theme=dark] .site-logo[data-astro-cid-nen7h5rs]{filter:brightness(0)invert()}.site-logo[data-astro-cid-nen7h5rs]{transition:height .32s cubic-bezier(.4,0,.2,1)}.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:2rem}@media (min-width:1024px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:3rem}}@media (prefers-reduced-motion:reduce){.site-logo[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}.site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:62%;border-radius:var(--tds-radius-pill);background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);-webkit-backdrop-filter:blur(22px)saturate(150%);backdrop-filter:blur(22px)saturate(150%);transition:background-color .25s,box-shadow .25s}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:68%;background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:none}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:0 8px 22px -16px #0000008c}@media (max-width:1023px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false],:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{box-shadow:none;background-color:#0000}}@media (min-width:1024px){:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{background-color:#0000}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent)}.site-header[data-astro-cid-nen7h5rs]{max-width:100%;box-shadow:none;-webkit-backdrop-filter:blur(24px)saturate(150%);backdrop-filter:blur(24px)saturate(150%);background-color:#0000;margin-inline:auto;transition:max-width .32s cubic-bezier(.4,0,.2,1),top .32s cubic-bezier(.4,0,.2,1),background-color .25s,box-shadow .25s;top:.75rem;left:0;right:0;transform:none}.site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);max-width:56rem;top:1rem;box-shadow:0 8px 22px -16px #050f6847}}@media (prefers-reduced-motion:reduce){.site-header[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}\n"},{"type":"external","src":"_astro/BusinessCardTile.B4evfchc.css"},{"type":"inline","content":".text-emph{color:var(--color-black);text-decoration:underline;-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-underline-offset:.22em;font-weight:600;text-decoration-thickness:2px}.tds-tone-navy .text-emph,.tds-tone-ink .text-emph{-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent)}\n"}],"routeData":{"route":"/en/services/[slug]","isIndex":false,"type":"page","pattern":"^\\/en\\/services\\/([^/]+?)\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"services","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/en/services/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"},{"type":"inline","content":":root[data-theme=dark] .site-logo[data-astro-cid-nen7h5rs]{filter:brightness(0)invert()}.site-logo[data-astro-cid-nen7h5rs]{transition:height .32s cubic-bezier(.4,0,.2,1)}.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:2rem}@media (min-width:1024px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:3rem}}@media (prefers-reduced-motion:reduce){.site-logo[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}.site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:62%;border-radius:var(--tds-radius-pill);background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);-webkit-backdrop-filter:blur(22px)saturate(150%);backdrop-filter:blur(22px)saturate(150%);transition:background-color .25s,box-shadow .25s}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:68%;background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:none}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:0 8px 22px -16px #0000008c}@media (max-width:1023px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false],:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{box-shadow:none;background-color:#0000}}@media (min-width:1024px){:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{background-color:#0000}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent)}.site-header[data-astro-cid-nen7h5rs]{max-width:100%;box-shadow:none;-webkit-backdrop-filter:blur(24px)saturate(150%);backdrop-filter:blur(24px)saturate(150%);background-color:#0000;margin-inline:auto;transition:max-width .32s cubic-bezier(.4,0,.2,1),top .32s cubic-bezier(.4,0,.2,1),background-color .25s,box-shadow .25s;top:.75rem;left:0;right:0;transform:none}.site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);max-width:56rem;top:1rem;box-shadow:0 8px 22px -16px #050f6847}}@media (prefers-reduced-motion:reduce){.site-header[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}\n"},{"type":"external","src":"_astro/Contact.DIKKDVMP.css"},{"type":"inline","content":".text-emph{color:var(--color-black);text-decoration:underline;-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-underline-offset:.22em;font-weight:600;text-decoration-thickness:2px}.tds-tone-navy .text-emph,.tds-tone-ink .text-emph{-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent)}\n"},{"type":"external","src":"_astro/BusinessCardTile.B4evfchc.css"}],"routeData":{"route":"/en","isIndex":true,"type":"page","pattern":"^\\/en\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/index.astro","pathname":"/en","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/install","isIndex":false,"type":"page","pattern":"^\\/install\\/?$","segments":[[{"content":"install","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/install.astro","pathname":"/install","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/kontakt.vcf","isIndex":false,"type":"endpoint","pattern":"^\\/kontakt\\.vcf$","segments":[[{"content":"kontakt.vcf","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kontakt.vcf.ts","pathname":"/kontakt.vcf","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"}],"routeData":{"route":"/legal/agb","isIndex":false,"type":"page","pattern":"^\\/legal\\/agb\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"agb","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/agb.astro","pathname":"/legal/agb","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/legal/agb.pdf","isIndex":false,"type":"endpoint","pattern":"^\\/legal\\/agb\\.pdf$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"agb.pdf","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/agb.pdf.ts","pathname":"/legal/agb.pdf","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"}],"routeData":{"route":"/legal/datenschutz","isIndex":false,"type":"page","pattern":"^\\/legal\\/datenschutz\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"datenschutz","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/datenschutz.astro","pathname":"/legal/datenschutz","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"}],"routeData":{"route":"/legal/impressum","isIndex":false,"type":"page","pattern":"^\\/legal\\/impressum\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"impressum","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/impressum.astro","pathname":"/legal/impressum","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"},{"type":"inline","content":".demo-grid[data-astro-cid-7ps2fawc]{--demo-gap:1rem;gap:var(--demo-gap);max-width:calc(var(--demo-count,5) * 26rem + (var(--demo-count,5) - 1) * var(--demo-gap));grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr));display:grid}@media (min-width:768px){.demo-grid[data-astro-cid-7ps2fawc]{--demo-gap:1.5rem}}.business-card-slot[data-astro-cid-f5m424za]{max-width:24rem}.reference-card__shot[data-astro-cid-f5m424za]{aspect-ratio:16/10;background:var(--color-soft);border-bottom:1px solid color-mix(in srgb, var(--color-black) 8%, transparent);position:relative;overflow:hidden}.reference-card__shot[data-astro-cid-f5m424za] img[data-astro-cid-f5m424za]{object-fit:cover;object-position:top center;width:100%;height:100%;display:block}.service-hero__photo[data-astro-cid-f5m424za]{opacity:.36}:root[data-theme=dark] .service-hero__photo[data-astro-cid-f5m424za]{opacity:.23}.stepper[data-astro-cid-f5m424za]{--stepper-marker:.875rem;gap:1.75rem;display:grid}.stepper__step[data-astro-cid-f5m424za]{grid-template-columns:auto minmax(0,1fr);align-items:start;gap:.875rem;display:grid;position:relative}.stepper__marker[data-astro-cid-f5m424za]{z-index:1;width:var(--stepper-marker);height:var(--stepper-marker);background:var(--color-accent);border-radius:9999px;margin-top:.35rem;position:relative}.stepper__text[data-astro-cid-f5m424za]{color:var(--color-black);line-height:1.55}.stepper__line[data-astro-cid-f5m424za]{left:calc(var(--stepper-marker) / 2);top:calc(var(--stepper-marker) + .35rem);background:color-mix(in srgb, var(--color-accent) 22%, transparent);transform-origin:top;width:2px;transition:transform .48s var(--tds-ease-out) var(--lp-reveal-delay,0s);position:absolute;bottom:-1.75rem;transform:translate(-1px)}html[data-reveal-active] .stepper__step[data-astro-cid-f5m424za]:not([data-revealed]) .stepper__line[data-astro-cid-f5m424za]{transform:translate(-1px)scaleY(0)}@media (min-width:40rem){.stepper[data-astro-cid-f5m424za]{grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:1.25rem}.stepper__step[data-astro-cid-f5m424za]{grid-template-columns:minmax(0,1fr);gap:.875rem}.stepper__marker[data-astro-cid-f5m424za]{margin-top:0}.stepper__text[data-astro-cid-f5m424za]{font-size:.9375rem}.stepper__line[data-astro-cid-f5m424za]{left:var(--stepper-marker);right:-1.25rem;top:calc(var(--stepper-marker) / 2);transform-origin:0;width:auto;height:2px;bottom:auto;transform:translateY(-1px)}html[data-reveal-active] .stepper__step[data-astro-cid-f5m424za]:not([data-revealed]) .stepper__line[data-astro-cid-f5m424za]{transform:translateY(-1px)scaleX(0)}}@media (prefers-reduced-motion:reduce){.stepper__line[data-astro-cid-f5m424za]{transition:none}}.err[data-astro-cid-gt6qm5qm]{text-align:center;background:var(--color-paper);place-items:center;min-height:100svh;padding:2rem;display:grid;position:relative;overflow:hidden}.err-glow[data-astro-cid-gt6qm5qm]{z-index:0;aspect-ratio:1;background:radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%);pointer-events:none;border-radius:50%;width:min(72vmin,540px);animation:6s ease-in-out infinite err-glow;position:absolute}.err-code[data-astro-cid-gt6qm5qm]{z-index:1;font-family:var(--font-display);letter-spacing:-.03em;color:var(--color-ink);font-size:clamp(7rem,34vw,22rem);font-weight:400;line-height:1;text-decoration:none;transition:color .2s;animation:.7s cubic-bezier(.22,1,.36,1) both err-in,7s ease-in-out .7s infinite err-float;position:relative}:is(.err-code[data-astro-cid-gt6qm5qm]:hover,.err-code[data-astro-cid-gt6qm5qm]:focus-visible){color:var(--color-accent)}@keyframes err-in{0%{opacity:0;transform:translateY(1.5rem)scale(.96)}to{opacity:1;transform:translateY(0)scale(1)}}@keyframes err-float{0%,to{transform:translateY(0)}50%{transform:translateY(-.6rem)}}@keyframes err-glow{0%,to{opacity:.45;transform:scale(1)}50%{opacity:.85;transform:scale(1.08)}}\n:root[data-theme=dark] .site-logo[data-astro-cid-nen7h5rs]{filter:brightness(0)invert()}.site-logo[data-astro-cid-nen7h5rs]{transition:height .32s cubic-bezier(.4,0,.2,1)}.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:2rem}@media (min-width:1024px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:3rem}}@media (prefers-reduced-motion:reduce){.site-logo[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}.site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:62%;border-radius:var(--tds-radius-pill);background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);-webkit-backdrop-filter:blur(22px)saturate(150%);backdrop-filter:blur(22px)saturate(150%);transition:background-color .25s,box-shadow .25s}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:68%;background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:none}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:0 8px 22px -16px #0000008c}@media (max-width:1023px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false],:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{box-shadow:none;background-color:#0000}}@media (min-width:1024px){:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{background-color:#0000}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent)}.site-header[data-astro-cid-nen7h5rs]{max-width:100%;box-shadow:none;-webkit-backdrop-filter:blur(24px)saturate(150%);backdrop-filter:blur(24px)saturate(150%);background-color:#0000;margin-inline:auto;transition:max-width .32s cubic-bezier(.4,0,.2,1),top .32s cubic-bezier(.4,0,.2,1),background-color .25s,box-shadow .25s;top:.75rem;left:0;right:0;transform:none}.site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);max-width:56rem;top:1rem;box-shadow:0 8px 22px -16px #050f6847}}@media (prefers-reduced-motion:reduce){.site-header[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}\n"},{"type":"external","src":"_astro/BusinessCardTile.B4evfchc.css"},{"type":"inline","content":".text-emph{color:var(--color-black);text-decoration:underline;-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-underline-offset:.22em;font-weight:600;text-decoration-thickness:2px}.tds-tone-navy .text-emph,.tds-tone-ink .text-emph{-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent)}\n"}],"routeData":{"route":"/leistungen/[slug]","isIndex":false,"type":"page","pattern":"^\\/leistungen\\/([^/]+?)\\/?$","segments":[[{"content":"leistungen","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/leistungen/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/og/default.png","isIndex":false,"type":"endpoint","pattern":"^\\/og\\/default\\.png$","segments":[[{"content":"og","dynamic":false,"spread":false}],[{"content":"default.png","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/og/default.png.ts","pathname":"/og/default.png","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"},{"type":"inline","content":":root[data-theme=dark] .site-logo[data-astro-cid-nen7h5rs]{filter:brightness(0)invert()}.site-logo[data-astro-cid-nen7h5rs]{transition:height .32s cubic-bezier(.4,0,.2,1)}.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:2rem}@media (min-width:1024px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:3rem}}@media (prefers-reduced-motion:reduce){.site-logo[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}.site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:62%;border-radius:var(--tds-radius-pill);background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);-webkit-backdrop-filter:blur(22px)saturate(150%);backdrop-filter:blur(22px)saturate(150%);transition:background-color .25s,box-shadow .25s}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:68%;background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:none}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:0 8px 22px -16px #0000008c}@media (max-width:1023px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false],:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{box-shadow:none;background-color:#0000}}@media (min-width:1024px){:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{background-color:#0000}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent)}.site-header[data-astro-cid-nen7h5rs]{max-width:100%;box-shadow:none;-webkit-backdrop-filter:blur(24px)saturate(150%);backdrop-filter:blur(24px)saturate(150%);background-color:#0000;margin-inline:auto;transition:max-width .32s cubic-bezier(.4,0,.2,1),top .32s cubic-bezier(.4,0,.2,1),background-color .25s,box-shadow .25s;top:.75rem;left:0;right:0;transform:none}.site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);max-width:56rem;top:1rem;box-shadow:0 8px 22px -16px #050f6847}}@media (prefers-reduced-motion:reduce){.site-header[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}\n.text-emph{color:var(--color-black);text-decoration:underline;-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-underline-offset:.22em;font-weight:600;text-decoration-thickness:2px}.tds-tone-navy .text-emph,.tds-tone-ink .text-emph{-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent)}\n@keyframes page-flyin{0%{opacity:0;transform:translate(-2rem)}to{opacity:1;transform:translate(0)}}.page-flyin[data-astro-cid-ltqv7bgc]{animation:page-flyin .52s var(--lp-ease-soft) both}@media (prefers-reduced-motion:reduce){.page-flyin[data-astro-cid-ltqv7bgc]{animation:none}}\n"}],"routeData":{"route":"/preise","isIndex":false,"type":"page","pattern":"^\\/preise\\/?$","segments":[[{"content":"preise","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/preise.astro","pathname":"/preise","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sitemap-0.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap-0\\.xml$","segments":[[{"content":"sitemap-0.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap-0.xml.ts","pathname":"/sitemap-0.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sitemap-index.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap-index\\.xml$","segments":[[{"content":"sitemap-index.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap-index.xml.ts","pathname":"/sitemap-index.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tds/cache/[action]","isIndex":false,"type":"endpoint","pattern":"^\\/tds\\/cache\\/([^/]+?)\\/?$","segments":[[{"content":"tds","dynamic":false,"spread":false}],[{"content":"cache","dynamic":false,"spread":false}],[{"content":"action","dynamic":true,"spread":false}]],"params":["action"],"component":"src/pages/tds/cache/[action].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tds/connect/status","isIndex":false,"type":"endpoint","pattern":"^\\/tds\\/connect\\/status\\/?$","segments":[[{"content":"tds","dynamic":false,"spread":false}],[{"content":"connect","dynamic":false,"spread":false}],[{"content":"status","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tds/connect/status.ts","pathname":"/tds/connect/status","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tds/connect","isIndex":false,"type":"endpoint","pattern":"^\\/tds\\/connect\\/?$","segments":[[{"content":"tds","dynamic":false,"spread":false}],[{"content":"connect","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tds/connect.ts","pathname":"/tds/connect","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tds-runtime.json","isIndex":false,"type":"endpoint","pattern":"^\\/tds-runtime\\.json$","segments":[[{"content":"tds-runtime.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tds-runtime.json.ts","pathname":"/tds-runtime.json","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"},{"type":"inline","content":":root[data-theme=dark] .site-logo[data-astro-cid-nen7h5rs]{filter:brightness(0)invert()}.site-logo[data-astro-cid-nen7h5rs]{transition:height .32s cubic-bezier(.4,0,.2,1)}.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:2rem}@media (min-width:1024px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:3rem}}@media (prefers-reduced-motion:reduce){.site-logo[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}.site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:62%;border-radius:var(--tds-radius-pill);background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);-webkit-backdrop-filter:blur(22px)saturate(150%);backdrop-filter:blur(22px)saturate(150%);transition:background-color .25s,box-shadow .25s}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:68%;background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:none}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:0 8px 22px -16px #0000008c}@media (max-width:1023px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false],:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{box-shadow:none;background-color:#0000}}@media (min-width:1024px){:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{background-color:#0000}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent)}.site-header[data-astro-cid-nen7h5rs]{max-width:100%;box-shadow:none;-webkit-backdrop-filter:blur(24px)saturate(150%);backdrop-filter:blur(24px)saturate(150%);background-color:#0000;margin-inline:auto;transition:max-width .32s cubic-bezier(.4,0,.2,1),top .32s cubic-bezier(.4,0,.2,1),background-color .25s,box-shadow .25s;top:.75rem;left:0;right:0;transform:none}.site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);max-width:56rem;top:1rem;box-shadow:0 8px 22px -16px #050f6847}}@media (prefers-reduced-motion:reduce){.site-header[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}\n.vcard[data-astro-cid-pbperak2]{background:var(--color-soft);border-radius:6px;padding:2rem 1.75rem}.vcard__head[data-astro-cid-pbperak2]{flex-wrap:wrap;align-items:center;gap:1.5rem;display:flex}.vcard__portrait[data-astro-cid-pbperak2]{border-radius:var(--tds-radius-pill);object-fit:cover;flex:none;width:5rem;height:5rem}.vcard__name[data-astro-cid-pbperak2]{font-family:var(--font-display);letter-spacing:-.02em;color:var(--color-black);margin:0;font-size:clamp(1.75rem,1.2rem + 2vw,2.5rem);line-height:1.1}.vcard__role[data-astro-cid-pbperak2]{color:var(--color-accent);margin:.5rem 0 0}.vcard__org[data-astro-cid-pbperak2]{color:var(--color-muted);margin:.15rem 0 0;font-size:.9375rem}.vcard__actions[data-astro-cid-pbperak2]{grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr));gap:.75rem;margin-top:2rem;display:grid}.vcard__action[data-astro-cid-pbperak2]{background:var(--color-paper);transition:background-color .2s var(--tds-ease-out), transform .2s var(--tds-ease-out);border-radius:6px;flex-direction:column;gap:.15rem;padding:.875rem 1rem;text-decoration:none;display:flex}.vcard__action[data-astro-cid-pbperak2]:hover{background:color-mix(in srgb, var(--color-accent) 8%, var(--color-paper));transform:translateY(-2px)}.vcard__action-label[data-astro-cid-pbperak2]{letter-spacing:.04em;text-transform:uppercase;color:var(--color-muted);font-size:.75rem}.vcard__action-value[data-astro-cid-pbperak2]{color:var(--color-black);overflow-wrap:anywhere}.vcard__save[data-astro-cid-pbperak2]{border-radius:var(--tds-radius-pill);background:var(--color-black);color:var(--color-paper);transition:transform .2s var(--tds-ease-out), opacity .2s var(--tds-ease-out);align-items:center;gap:.6rem;margin-top:1.5rem;padding:.85rem 1.5rem;text-decoration:none;display:inline-flex}.vcard__save[data-astro-cid-pbperak2]:hover{opacity:.9;transform:translateY(-2px)}.vcard__qr[data-astro-cid-pbperak2]{border-top:1px solid color-mix(in srgb, var(--color-black) 10%, transparent);flex-wrap:wrap;align-items:center;gap:1.5rem;margin-top:2rem;padding-top:2rem;display:flex}.vcard__qr-code[data-astro-cid-pbperak2]{box-sizing:border-box;background:#fff;border-radius:6px;flex:none;width:7.5rem;height:7.5rem;padding:.625rem;display:block}.vcard__qr-title[data-astro-cid-pbperak2]{font-family:var(--font-display);color:var(--color-black);margin:0 0 .35rem;font-size:1.125rem}.vcard__qr-text[data-astro-cid-pbperak2]{max-width:26rem;color:var(--color-muted);margin:0;line-height:1.6}.vcard-pitch[data-astro-cid-pbperak2]{margin-top:3rem}.vcard-pitch__title[data-astro-cid-pbperak2]{font-family:var(--font-display);color:var(--color-black);margin:0 0 .75rem;font-size:1.5rem;line-height:1.2}.vcard-pitch__text[data-astro-cid-pbperak2]{max-width:40rem;color:var(--color-muted);margin:0 0 1rem;line-height:1.7}@media (min-width:768px){.vcard[data-astro-cid-pbperak2]{padding:2.5rem}.vcard__portrait[data-astro-cid-pbperak2]{width:6.5rem;height:6.5rem}}@media (prefers-reduced-motion:reduce){.vcard__action[data-astro-cid-pbperak2]:hover,.vcard__save[data-astro-cid-pbperak2]:hover{transform:none}}\n"}],"routeData":{"route":"/visitenkarte","isIndex":false,"type":"page","pattern":"^\\/visitenkarte\\/?$","segments":[[{"content":"visitenkarte","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/visitenkarte.astro","pathname":"/visitenkarte","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/visitenkarte-qr.svg","isIndex":false,"type":"endpoint","pattern":"^\\/visitenkarte-qr\\.svg$","segments":[[{"content":"visitenkarte-qr.svg","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/visitenkarte-qr.svg.ts","pathname":"/visitenkarte-qr.svg","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.BSUk1rOw.css"},{"type":"inline","content":":root[data-theme=dark] .site-logo[data-astro-cid-nen7h5rs]{filter:brightness(0)invert()}.site-logo[data-astro-cid-nen7h5rs]{transition:height .32s cubic-bezier(.4,0,.2,1)}.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:2rem}@media (min-width:1024px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false] .site-logo[data-astro-cid-nen7h5rs]{height:3rem}}@media (prefers-reduced-motion:reduce){.site-logo[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}.site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:62%;border-radius:var(--tds-radius-pill);background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);-webkit-backdrop-filter:blur(22px)saturate(150%);backdrop-filter:blur(22px)saturate(150%);transition:background-color .25s,box-shadow .25s}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs]{--tds-header-tint:68%;background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:none}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent);box-shadow:0 8px 22px -16px #0000008c}@media (max-width:1023px){.site-header[data-astro-cid-nen7h5rs][data-scrolled=false],:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{box-shadow:none;background-color:#0000}}@media (min-width:1024px){:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=false]{background-color:#0000}:root[data-theme=dark] .site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-card) var(--tds-header-tint), transparent)}.site-header[data-astro-cid-nen7h5rs]{max-width:100%;box-shadow:none;-webkit-backdrop-filter:blur(24px)saturate(150%);backdrop-filter:blur(24px)saturate(150%);background-color:#0000;margin-inline:auto;transition:max-width .32s cubic-bezier(.4,0,.2,1),top .32s cubic-bezier(.4,0,.2,1),background-color .25s,box-shadow .25s;top:.75rem;left:0;right:0;transform:none}.site-header[data-astro-cid-nen7h5rs][data-scrolled=true]{background-color:color-mix(in srgb, var(--color-paper) var(--tds-header-tint), transparent);max-width:56rem;top:1rem;box-shadow:0 8px 22px -16px #050f6847}}@media (prefers-reduced-motion:reduce){.site-header[data-astro-cid-nen7h5rs]{transition-duration:.01ms}}\n"},{"type":"external","src":"_astro/Contact.DIKKDVMP.css"},{"type":"inline","content":".text-emph{color:var(--color-black);text-decoration:underline;-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent) 45%, transparent);text-underline-offset:.22em;font-weight:600;text-decoration-thickness:2px}.tds-tone-navy .text-emph,.tds-tone-ink .text-emph{-webkit-text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent);text-decoration-color:color-mix(in srgb, var(--color-accent-pink) 55%, transparent)}\n"},{"type":"external","src":"_astro/BusinessCardTile.B4evfchc.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"serverLike":true,"middlewareMode":"classic","site":"https://tracht-digital.de","base":"/","trailingSlash":"ignore","compressHTML":"jsx","componentMetadata":[["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/500.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/install.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/business-card.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/visitenkarte.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/legal/agb.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/legal/agb.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/preise.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/preise.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/services/[slug].astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/leistungen/[slug].astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/en/index.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/legal/datenschutz.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/legal/impressum.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000virtual:astro:middleware":"virtual_astro_middleware.mjs","\u0000virtual:astro:server-island-manifest":"chunks/_virtual_astro_server-island-manifest_C1Q2srgE.mjs","\u0000virtual:astro:session-driver":"chunks/_virtual_astro_session-driver_DS5V7T-N.mjs","\u0000virtual:astro:actions/noop-entrypoint":"chunks/noop-entrypoint_Z3zFhrGC.mjs","/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/node_modules/@astrojs/react/dist/vnode-children.js":"chunks/vnode-children_B6vVcKTz.mjs","@astrojs/node/server.js":"entry.mjs","\u0000virtual:astro:page:src/pages/tds/cache/[action]@_@ts":"chunks/_action__C25BJ7KX.mjs","\u0000virtual:astro:page:src/pages/leistungen/[slug]@_@astro":"chunks/_slug__CkSdI7WG.mjs","\u0000virtual:astro:page:src/pages/en/services/[slug]@_@astro":"chunks/_slug__D1t8xFfU.mjs","\u0000virtual:astro:page:src/pages/en/legal/agb@_@astro":"chunks/agb_BM4JljXd.mjs","\u0000virtual:astro:page:src/pages/en/legal/agb.pdf@_@ts":"chunks/agb_CUN8Itqz.mjs","\u0000virtual:astro:page:src/pages/legal/agb.pdf@_@ts":"chunks/agb_D19EDCVh.mjs","\u0000virtual:astro:page:src/pages/legal/agb@_@astro":"chunks/agb_DJxqPaW4.mjs","\u0000virtual:astro:page:src/pages/en/business-card@_@astro":"chunks/business-card_BqF0lJ0n.mjs","\u0000virtual:astro:page:src/pages/tds/connect@_@ts":"chunks/connect_C4GxZUOa.mjs","\u0000virtual:astro:page:src/pages/legal/datenschutz@_@astro":"chunks/datenschutz_imFcJjI2.mjs","\u0000virtual:astro:page:src/pages/legal/impressum@_@astro":"chunks/impressum_DQQE6F_7.mjs","\u0000virtual:astro:page:src/pages/index@_@astro":"chunks/index_CKqm5-xz.mjs","\u0000virtual:astro:page:src/pages/en/index@_@astro":"chunks/index_CzQhmef2.mjs","\u0000virtual:astro:page:node_modules/astro/dist/assets/endpoint/node@_@js":"chunks/node_CsrkemkU.mjs","\u0000virtual:astro:page:src/pages/preise@_@astro":"chunks/preise_Dk6MVJiE.mjs","\u0000virtual:astro:page:src/pages/en/preise@_@astro":"chunks/preise_nNw87ZxF.mjs","/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CzSKOrdg.mjs","\u0000virtual:astro:page:src/pages/sitemap-0.xml@_@ts":"chunks/sitemap-0_BcfG9V_u.mjs","\u0000virtual:astro:page:src/pages/tds/connect/status@_@ts":"chunks/status_DFMdLP0L.mjs","\u0000virtual:astro:page:src/pages/tds-runtime.json@_@ts":"chunks/tds-runtime_GkAkSCJb.mjs","\u0000virtual:astro:page:src/pages/visitenkarte@_@astro":"chunks/visitenkarte_Fr4Tol-z.mjs","~/components/islands/ContactForm.tsx":"_astro/ContactForm.bK444ve8.js","~/components/islands/CustomCursor.tsx":"_astro/CustomCursor.DjRu4Ii4.js","/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/FAQ.astro?astro&type=script&index=0&lang.ts":"_astro/FAQ.astro_astro_type_script_index_0_lang.BMphXjbf.js","/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/FloatingCta.astro?astro&type=script&index=0&lang.ts":"_astro/FloatingCta.astro_astro_type_script_index_0_lang.CNjWRqiz.js","/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.D5Fb8OyM.js","~/components/islands/Hero.tsx":"_astro/Hero.CZlnzC_b.js","~/components/islands/LanguageToggle.tsx":"_astro/LanguageToggle.xG6ycA5_.js","/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.Dhw4uqG_.js","/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts":"_astro/Layout.astro_astro_type_script_index_1_lang.CJVtyvS7.js","/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Process.astro?astro&type=script&index=0&lang.ts":"_astro/Process.astro_astro_type_script_index_0_lang.C8PaLH9X.js","~/components/islands/ScrollProgress.tsx":"_astro/ScrollProgress.Djg_5c74.js","/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Showcase.astro?astro&type=script&index=0&lang.ts":"_astro/Showcase.astro_astro_type_script_index_0_lang.1bBict7N.js","~/components/islands/SmoothScroll.tsx":"_astro/SmoothScroll.DEXMAiJ2.js","@astrojs/react/client.js":"_astro/client.DCemTDuA.js","@tracht-digital-solutions/tds-shared/components":"_astro/index.BSUiUjRz.js","@tracht-digital-solutions/tds-shared/install":"_astro/index.C-37c-NC.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/FAQ.astro?astro&type=script&index=0&lang.ts","var e=document.getElementById(`faq`);if(e){let t=Array.from(e.querySelectorAll(`[role=\"tab\"]`)),n=e=>{for(let n of t){let t=n===e;n.setAttribute(`aria-selected`,String(t)),n.tabIndex=t?0:-1;let r=document.getElementById(n.getAttribute(`aria-controls`)??``);r&&(r.hidden=!t)}};t.forEach((e,r)=>{e.addEventListener(`click`,()=>n(e)),e.addEventListener(`keydown`,e=>{let i=-1;e.key===`ArrowDown`||e.key===`ArrowRight`?i=(r+1)%t.length:e.key===`ArrowUp`||e.key===`ArrowLeft`?i=(r-1+t.length)%t.length:e.key===`Home`?i=0:e.key===`End`&&(i=t.length-1),i>=0&&(e.preventDefault(),t[i].focus(),n(t[i]))})})}"],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/FloatingCta.astro?astro&type=script&index=0&lang.ts","var e=document.querySelector(`.floating-cta-group`),t=e?.querySelector(`.floating-cta-top`);if(e){let n=[],r=0,i=()=>{let t=window.scrollY;n=Array.from(document.querySelectorAll(`.tds-tone-navy, .tds-tone-ink`)).map(e=>{let n=e.getBoundingClientRect();return[n.top+t,n.bottom+t]});let i=e.getBoundingClientRect();r=window.innerHeight-(i.top+i.height/2)},a=()=>document.documentElement.getAttribute(`data-theme`)===`dark`,o=0,s=(t,n)=>{let r=n?`true`:`false`;e.dataset[t]!==r&&(e.dataset[t]=r)},c=()=>{o=0,s(`scrolledDown`,window.scrollY>window.innerHeight*.8);let e=window.scrollY+window.innerHeight-r;s(`onDark`,a()||n.some(([t,n])=>e>=t&&e<=n))},l=()=>{o||=requestAnimationFrame(c)},u=()=>{i(),c()};if(i(),c(),window.addEventListener(`scroll`,l,{passive:!0}),window.addEventListener(`resize`,u),new ResizeObserver(u).observe(document.documentElement),new MutationObserver(c).observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`]}),window.matchMedia(`(hover: hover) and (pointer: fine)`).matches){let t=!1,n=0,r=0,i=0,a=()=>{i=0;let a=e.getBoundingClientRect(),o=Math.max(a.left-n,0,n-a.right),s=Math.max(a.top-r,0,r-a.bottom),c=Math.hypot(o,s)<150;c!==t&&(t=c,e.dataset.near=c?`true`:`false`)};window.addEventListener(`pointermove`,e=>{n=e.clientX,r=e.clientY,i||=requestAnimationFrame(a)},{passive:!0})}t?.addEventListener(`click`,()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,t=window.tdsScrollTo;t?t(0,{immediate:e}):window.scrollTo({top:0,behavior:e?`auto`:`smooth`})})}"],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/Header.astro?astro&type=script&index=0&lang.ts","var e=[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`[tabindex]:not([tabindex=\"-1\"])`].join(`,`);function t(){if(typeof document>`u`)return()=>{};let e=document.body,t=Number(e.dataset.tdsScrollLock??`0`)||0;t===0&&(e.dataset.tdsScrollLockPrev=e.style.overflow,e.style.overflow=`hidden`),e.dataset.tdsScrollLock=String(t+1);let n=!1;return()=>{if(n)return;n=!0;let t=(Number(e.dataset.tdsScrollLock??`1`)||1)-1;if(t>0){e.dataset.tdsScrollLock=String(t);return}let r=e.dataset.tdsScrollLockPrev??``;delete e.dataset.tdsScrollLock,delete e.dataset.tdsScrollLockPrev,e.style.overflow=r}}var n={open(){},close(){},toggle(){},isOpen:()=>!1,destroy(){}};function r(r){let{toggle:i,panel:a,desktopQuery:o=`(min-width: 64rem)`,linkSelector:s=`[data-menu-link]`,closeOnOutsideClick:c=!0,trapFocus:l=!0,onOpenChange:u}=r;if(typeof document>`u`||!i||!a)return n;let d=!1,f=null,p=[],m=(e,t,n)=>{e.addEventListener(t,n),p.push(()=>e.removeEventListener(t,n))},h=()=>[i,...Array.from(a.querySelectorAll(e))],g=()=>{let e=document.activeElement;return!e||e===document.body||a.contains(e)},_=(n,r=!0)=>{if(n!==d){if(d=n,i.setAttribute(`aria-expanded`,n?`true`:`false`),a.dataset.open=n?`true`:`false`,a.setAttribute(`aria-hidden`,n?`false`:`true`),n){f=t();let n=a.querySelector(e);n?n.focus():(a.tabIndex=-1,a.focus())}else f?.(),f=null,r&&g()&&i.focus();u?.(n)}};i.setAttribute(`aria-expanded`,`false`),a.dataset.open=`false`,a.setAttribute(`aria-hidden`,`true`),m(i,`click`,()=>_(!d)),m(a,`click`,e=>{let t=e.target;t instanceof Element&&t.closest(s)&&_(!1)}),m(document,`keydown`,e=>{if(!d)return;let t=e;if(t.key===`Escape`){_(!1);return}if(t.key!==`Tab`||!l)return;let n=h();if(n.length===0)return;let r=n[0],i=n[n.length-1],a=document.activeElement;!a||!n.includes(a)||!t.shiftKey&&a===i?(t.preventDefault(),r.focus()):t.shiftKey&&a===r&&(t.preventDefault(),i.focus())}),c&&m(document,`click`,e=>{if(!d)return;let t=e.target;t instanceof Node&&(a.contains(t)||i.contains(t)||_(!1,!1))});let v=typeof window<`u`?window.matchMedia?.(o):void 0;if(v){let e=e=>{e.matches&&_(!1,!1)};v.addEventListener(`change`,e),p.push(()=>v.removeEventListener(`change`,e))}return{open:()=>_(!0),close:()=>_(!1),toggle:()=>_(!d),isOpen:()=>d,destroy(){_(!1,!1);for(let e of p.splice(0))e()}}}var i=document.getElementById(`site-header`),a=document.getElementById(`menu-toggle`),o=document.getElementById(`mobile-menu`);if(i){let e=null,t=()=>{let t=window.scrollY>8;t!==e&&(e=t,i.dataset.scrolled=t?`true`:`false`)};t(),window.addEventListener(`scroll`,t,{passive:!0})}a&&o&&r({toggle:a,panel:o});var s=document.getElementById(`logo-link`);if(s){let e=e=>e.replace(/\\/+$/,``)||`/`;s.addEventListener(`click`,t=>{if(e(new URL(s.href).pathname)!==e(location.pathname))return;t.preventDefault();let n=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,r=window.tdsScrollTo;r?r(0,{immediate:n}):window.scrollTo({top:0,behavior:n?`auto`:`smooth`})})}"],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","function e(e){e.dataset.revealed=``}function t(t=document){let n=Array.from(t.querySelectorAll(`[data-reveal]`));if(n.length===0||window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)return()=>{};let r=new Map;for(let e of n){let n=Number.parseInt(e.dataset.revealIndex??``,10),i;if(Number.isFinite(n))i=n;else{let n=e.parentNode??t;i=r.get(n)??0,r.set(n,i+1)}let a=Math.min(Math.max(i,0),5);e.style.setProperty(`--lp-reveal-delay`,`${a*70}ms`)}document.documentElement.setAttribute(`data-reveal-active`,``);let i=new IntersectionObserver(e=>{for(let t of e){if(!t.isIntersecting)continue;let e=t.target;e.dataset.revealed=``,i.unobserve(e)}},{threshold:.01,rootMargin:`0px 0px -12% 0px`}),a=window.innerHeight;for(let t of n){if(t.getBoundingClientRect().top<a){e(t);continue}i.observe(t)}return()=>{i.disconnect(),document.documentElement.removeAttribute(`data-reveal-active`)}}t();"],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts","var e=document.title,t=e.includes(` — `)?e.split(` — `)[0]:e,n={de:{about:`Wieso ich?`,services:`Leistungen`,\"digital-responsibility\":`Eine Ansprechperson`,process:`Vorgehen`,\"pricing-teaser\":`Preise`,blog:`Journal`,faq:`Häufige Fragen`,contact:`Kontakt`},en:{about:`Why me?`,services:`Services`,\"digital-responsibility\":`One point of contact`,process:`Process`,\"pricing-teaser\":`Pricing`,blog:`Journal`,faq:`FAQ`,contact:`Contact`}}[document.documentElement.lang.startsWith(`en`)?`en`:`de`],r=document.querySelectorAll(`section[id]`);if(r.length>1){let i=e=>{if(e.dataset.title)return e.dataset.title;if(n[e.id])return n[e.id];let t=e.getAttribute(`aria-labelledby`),r=t?document.getElementById(t):null;return r?.textContent?r.textContent.trim():e.getAttribute(`aria-label`)||e.id},a=null,o=new IntersectionObserver(n=>{for(let r of n){if(!r.isIntersecting)continue;let n=r.target;n.id!==a&&(a=n.id,n.id===`hero`?document.title=e:document.title=`${i(n)} · ${t}`)}},{rootMargin:`-30% 0px -60% 0px`,threshold:0});r.forEach(e=>o.observe(e))}"],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Process.astro?astro&type=script&index=0&lang.ts","var e=document.getElementById(`process`);if(e){let t=Array.from(e.querySelectorAll(`.process-detail`)),n=e=>{for(let n of t)n.hidden=Number(n.dataset.detail)!==e};for(let t of e.querySelectorAll(`.process-step-item`)){let e=Number(t.dataset.step);t.addEventListener(`mouseenter`,()=>n(e)),t.addEventListener(`focusin`,()=>n(e))}}"],["/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/sections/Showcase.astro?astro&type=script&index=0&lang.ts","var e=document.querySelectorAll(`[data-carousel]`);for(let t of e){let e=t.querySelector(`[data-carousel-track]`),n=t.closest(`section`)?.querySelector(`[data-carousel-nav]`)??null,r=n?.querySelector(`[data-carousel-prev]`)??null,i=n?.querySelector(`[data-carousel-next]`)??null;if(!e||!n||!r||!i)continue;let a=window.matchMedia(`(prefers-reduced-motion: reduce)`),o=()=>{let t=e.firstElementChild;if(!t)return e.clientWidth;let n=Number.parseFloat(getComputedStyle(e).columnGap)||0;return t.getBoundingClientRect().width+n},s=t=>{e.scrollBy({left:t*o(),behavior:a.matches?`auto`:`smooth`})};r.addEventListener(`click`,()=>s(-1)),i.addEventListener(`click`,()=>s(1));let c=!1,l=!1,u=0,d=0,f=()=>{c&&(c=!1,e.classList.remove(`is-dragging`),e.style.scrollSnapType=``,e.style.scrollBehavior=``)};e.addEventListener(`pointerdown`,t=>{t.pointerType===`mouse`&&t.button===0&&(c=!0,l=!1,u=t.clientX,d=e.scrollLeft)}),e.addEventListener(`pointermove`,t=>{if(!c)return;let n=t.clientX-u;if(!l){if(Math.abs(n)<6)return;l=!0,e.classList.add(`is-dragging`),e.style.scrollSnapType=`none`,e.style.scrollBehavior=`auto`,e.setPointerCapture?.(t.pointerId)}e.scrollLeft=d-n});for(let t of[`pointerup`,`pointercancel`,`pointerleave`])e.addEventListener(t,f);e.addEventListener(`dragstart`,e=>e.preventDefault()),e.addEventListener(`click`,e=>{l&&(l=!1,e.preventDefault(),e.stopPropagation())},!0);let p=()=>{let t=e.scrollWidth-e.clientWidth;n.hidden=!(t>2),r.disabled=e.scrollLeft<=2,i.disabled=e.scrollLeft>=t-2};p(),e.addEventListener(`scroll`,p,{passive:!0}),typeof ResizeObserver<`u`?new ResizeObserver(p).observe(e):window.addEventListener(`resize`,p,{passive:!0})}"]],"assets":["/favicon.png","/llms.txt","/robots.txt","/demos/demo1-favicon.svg","/demos/demo1.webp","/_astro/ContactForm.bK444ve8.js","/_astro/CustomCursor.DjRu4Ii4.js","/_astro/Hero.CZlnzC_b.js","/_astro/LanguageToggle.xG6ycA5_.js","/_astro/ScrollProgress.Djg_5c74.js","/_astro/SmoothScroll.DEXMAiJ2.js","/_astro/client.DCemTDuA.js","/_astro/i18n.DP12w162.js","/_astro/index.BSUiUjRz.js","/_astro/index.C-37c-NC.js","/_astro/jsx-runtime.D7zcSYNz.js","/_astro/react-dom.DLqXjdJl.js","/_astro/react.OrosJ8bI.js","/images/business-card.webp","/images/logo-letters.png","/images/logo-with-text.webp","/images/logo.webp","/images/sections/contact.webp","/images/sections/hero.webp","/images/sections/pricing.webp","/images/sections/why-me.webp","/images/process/step-01.webp","/images/process/step-02.webp","/images/process/step-03.webp","/images/process/step-04.webp","/images/services/01-beratung.webp","/images/services/02-prozesse.webp","/images/services/03-loesungen.webp","/images/services/04-webauftritt.webp","/_astro/Layout.BSUk1rOw.css","/_astro/lato-latin-ext-400-normal.CK4GAP86.woff2","/_astro/lato-latin-400-normal.BEhtfm5r.woff2","/_astro/lato-latin-400-normal.B11PyLys.woff","/_astro/lato-latin-ext-700-normal.C6gwlRgY.woff2","/_astro/lato-latin-700-normal.BUGMgin4.woff2","/_astro/lato-latin-700-normal.DAdL7O4w.woff","/_astro/lato-latin-ext-900-normal.BhetttCG.woff2","/_astro/lato-latin-900-normal.C3uaq3BA.woff2","/_astro/lato-latin-900-normal.CZBfLiEO.woff","/_astro/plus-jakarta-sans-vietnamese-wght-normal.qRpaaN48.woff2","/_astro/plus-jakarta-sans-latin-ext-wght-normal.DmpS2jIq.woff2","/_astro/plus-jakarta-sans-latin-wght-normal.eXO_dkmS.woff2","/_astro/jetbrains-mono-cyrillic-wght-normal.D73BlboJ.woff2","/_astro/jetbrains-mono-greek-wght-normal.Bw9x6K1M.woff2","/_astro/jetbrains-mono-vietnamese-wght-normal.Bt-aOZkq.woff2","/_astro/jetbrains-mono-latin-ext-wght-normal.DBQx-q_a.woff2","/_astro/jetbrains-mono-latin-wght-normal.B9CIFXIH.woff2","/_astro/portrait.CiEJjxjj.webp","/_astro/BusinessCardTile.B4evfchc.css","/_astro/Contact.DIKKDVMP.css","/404.html","/500.html","/en/business-card-qr.svg","/install/index.html","/kontakt.vcf","/og/default.png","/sitemap-index.xml","/visitenkarte-qr.svg"],"i18n":{"fallbackType":"redirect","strategy":"pathname-prefix-other-locales","locales":["de","en"],"defaultLocale":"de","domainLookupTable":{}},"buildFormat":"directory","checkOrigin":true,"actionBodySizeLimit":1048576,"serverIslandBodySizeLimit":1048576,"allowedDomains":[],"key":"ZJglAJMRRKIZD+AAVBwWT2zTDbhvG5ngajbPzu5KrPk=","sessionConfig":{"driver":"unstorage/drivers/fs-lite","options":{"base":"/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/node_modules/.astro/sessions"}},"image":{},"devToolbar":{"enabled":false,"debugInfoOutput":""},"logLevel":"info","shouldInjectCspMetaTags":false});
var manifestRoutes = _manifest.routes;
var manifest = Object.assign(_manifest, {
	renderers,
	actions: () => import("./chunks/noop-entrypoint_Z3zFhrGC.mjs"),
	middleware: () => import("./virtual_astro_middleware.mjs"),
	sessionDriver: () => import("./chunks/_virtual_astro_session-driver_DS5V7T-N.mjs"),
	serverIslandMappings: () => import("./chunks/_virtual_astro_server-island-manifest_C1Q2srgE.mjs"),
	routes: manifestRoutes,
	pageMap
});
function getAmbientManifest() {
	const manifest$1 = manifest;
	if (!manifest$1) throw new AstroError(NoManifestAvailable);
	return manifest$1;
}
//#endregion
//#region node_modules/astro/dist/core/app/render-options.js
var renderOptionsSymbol = /* @__PURE__ */ Symbol.for("astro.renderOptions");
function getRenderOptions(request) {
	return Reflect.get(request, renderOptionsSymbol);
}
function setRenderOptions(request, options) {
	Reflect.set(request, renderOptionsSymbol, options);
}
//#endregion
//#region node_modules/astro/dist/core/app/origin-check.js
var FORM_CONTENT_TYPES = [
	"application/x-www-form-urlencoded",
	"multipart/form-data",
	"text/plain"
];
var SAFE_METHODS = [
	"GET",
	"HEAD",
	"OPTIONS"
];
function isForbiddenCrossOriginRequest(request, url, isPrerendered) {
	if (isPrerendered) return false;
	if (SAFE_METHODS.includes(request.method)) return false;
	const isSameOrigin = request.headers.get("origin") === url.origin;
	if (request.headers.has("content-type")) return hasFormLikeHeader(request.headers.get("content-type")) && !isSameOrigin;
	return !isSameOrigin;
}
function createCrossOriginForbiddenResponse(request) {
	return new Response(`Cross-site ${request.method} form submissions are forbidden`, { status: 403 });
}
function createOriginCheckMiddleware() {
	return defineMiddleware((context, next) => {
		const { request, url, isPrerendered } = context;
		if (isForbiddenCrossOriginRequest(request, url, isPrerendered)) return createCrossOriginForbiddenResponse(request);
		return next();
	});
}
function hasFormLikeHeader(contentType) {
	if (contentType) {
		for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) return true;
	}
	return false;
}
//#endregion
//#region node_modules/astro/dist/core/fetch/features.js
var FetchFeatures = {
	redirects: 1,
	sessions: 2,
	actions: 4,
	middleware: 8,
	i18n: 16,
	cache: 32
};
var ALL_FETCH_FEATURES = FetchFeatures.redirects | FetchFeatures.sessions | FetchFeatures.actions | FetchFeatures.middleware | FetchFeatures.i18n | FetchFeatures.cache;
var usedFeatures = /* @__PURE__ */ new WeakMap();
function markFeatureUsed(manifest, feature) {
	const entry = usedFeatures.get(manifest);
	if (entry) entry.bits |= feature;
	else usedFeatures.set(manifest, { bits: feature });
}
function getUsedFeatures(manifest) {
	return usedFeatures.get(manifest)?.bits ?? 0;
}
var ACTION_QUERY_PARAMS = {
	actionName: "_action",
	actionPayload: "_astroActionPayload"
};
//#endregion
//#region node_modules/astro/dist/actions/runtime/client.js
var codeToStatusMap = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	CONTENT_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	MISDIRECTED_REQUEST: 421,
	UNPROCESSABLE_CONTENT: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	TOO_EARLY: 425,
	UPGRADE_REQUIRED: 426,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	VARIANT_ALSO_NEGOTIATES: 506,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
	NETWORK_AUTHENTICATION_REQUIRED: 511
};
var statusToCodeMap = Object.fromEntries(Object.entries(codeToStatusMap).map(([key, value]) => [value, key]));
var ActionError = class ActionError extends Error {
	type = "AstroActionError";
	code = "INTERNAL_SERVER_ERROR";
	status = 500;
	constructor(params) {
		super(params.message);
		this.code = params.code;
		this.status = ActionError.codeToStatus(params.code);
		if (params.stack) this.stack = params.stack;
	}
	static codeToStatus(code) {
		return codeToStatusMap[code];
	}
	static statusToCode(status) {
		return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
	}
	static fromJson(body) {
		if (isInputError(body)) return new ActionInputError(body.issues);
		if (isActionError(body)) return new ActionError(body);
		return new ActionError({ code: "INTERNAL_SERVER_ERROR" });
	}
};
function isActionError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionError";
}
function isInputError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionInputError" && "issues" in error && Array.isArray(error.issues);
}
var ActionInputError = class extends ActionError {
	type = "AstroActionInputError";
	issues;
	fields;
	constructor(issues) {
		super({
			message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
			code: "BAD_REQUEST"
		});
		this.issues = issues;
		this.fields = {};
		for (const issue of issues) if (issue.path.length > 0) {
			const key = issue.path[0].toString();
			this.fields[key] ??= [];
			this.fields[key]?.push(issue.message);
		}
	}
};
function deserializeActionResult(res) {
	if (res.type === "error") {
		let json;
		try {
			json = JSON.parse(res.body);
		} catch {
			return {
				data: void 0,
				error: new ActionError({
					message: res.body,
					code: "INTERNAL_SERVER_ERROR"
				})
			};
		}
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"PUBLIC_DEMO_MODE": "true",
			"SITE": "https://tracht-digital.de",
			"SSR": true
		}, {
			CI: "true",
			_: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm"
		})?.PROD) return {
			error: ActionError.fromJson(json),
			data: void 0
		};
		else {
			const error = ActionError.fromJson(json);
			error.stack = actionResultErrorStack.get();
			return {
				error,
				data: void 0
			};
		}
	}
	if (res.type === "empty") return {
		data: void 0,
		error: void 0
	};
	return {
		data: parse(res.body, { URL: (href) => new URL(href) }),
		error: void 0
	};
}
var actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
	let errorStack;
	return {
		set(stack) {
			errorStack = stack;
		},
		get() {
			return errorStack;
		}
	};
})();
function getActionQueryString(name) {
	return `?${new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name }).toString()}`;
}
//#endregion
//#region node_modules/astro/dist/actions/utils.js
function hasActionPayload(locals) {
	return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
	return (actionFn) => {
		if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) return;
		return deserializeActionResult(locals._actionPayload.actionResult);
	};
}
function createCallAction(context) {
	return (baseAction, input) => {
		Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
		return baseAction.bind(context)(input);
	};
}
//#endregion
//#region node_modules/astro/dist/core/cookies/cookies.js
var DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
var DELETED_VALUE = "deleted";
var responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
var identity = (value) => value;
var AstroCookie = class {
	value;
	constructor(value) {
		this.value = value;
	}
	json() {
		if (this.value === void 0) throw new Error(`Cannot convert undefined to an object.`);
		return JSON.parse(this.value);
	}
	number() {
		return Number(this.value);
	}
	boolean() {
		if (this.value === "false") return false;
		if (this.value === "0") return false;
		return Boolean(this.value);
	}
};
var AstroCookies = class {
	#request;
	#requestValues;
	#outgoing;
	#consumed;
	#logger;
	constructor(request, logger) {
		this.#request = request;
		this.#requestValues = null;
		this.#outgoing = null;
		this.#consumed = false;
		this.#logger = logger;
	}
	/**
	* Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
	* in a Set-Cookie header added to the response.
	* @param key The cookie to delete
	* @param options Options related to this deletion, such as the path of the cookie.
	*/
	delete(key, options) {
		this.#ensureOutgoingMap().set(key, [
			DELETED_VALUE,
			stringifySetCookie({
				...options,
				name: key,
				value: DELETED_VALUE,
				expires: DELETED_EXPIRATION,
				maxAge: void 0
			}),
			false
		]);
	}
	/**
	* Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
	* request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
	* from that set call, overriding any values already part of the request.
	* @param key The cookie to get.
	* @returns An object containing the cookie value as well as convenience methods for converting its value.
	*/
	get(key, options = void 0) {
		if (this.#outgoing?.has(key)) {
			let [serializedValue, , isSetValue] = this.#outgoing.get(key);
			if (isSetValue) return new AstroCookie(serializedValue);
			else return;
		}
		const decode = options?.decode ?? decodeURIComponent;
		const values = this.#ensureParsed();
		if (key in values) {
			const value = values[key];
			if (value) {
				let decodedValue;
				try {
					decodedValue = decode(value);
				} catch (_error) {
					decodedValue = value;
				}
				return new AstroCookie(decodedValue);
			}
		}
	}
	/**
	* Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
	* part of the initial request or set via Astro.cookies.set(key)
	* @param key The cookie to check for.
	* @param _options This parameter is no longer used.
	* @returns
	*/
	has(key, _options) {
		if (this.#outgoing?.has(key)) {
			let [, , isSetValue] = this.#outgoing.get(key);
			return isSetValue;
		}
		return this.#ensureParsed()[key] !== void 0;
	}
	/**
	* Astro.cookies.set(key, value) is used to set a cookie's value. If provided
	* an object it will be stringified via JSON.stringify(value). Additionally you
	* can provide options customizing how this cookie will be set, such as setting httpOnly
	* in order to prevent the cookie from being read in client-side JavaScript.
	* @param key The name of the cookie to set.
	* @param value A value, either a string or other primitive or an object.
	* @param options Options for the cookie, such as the path and security settings.
	*/
	set(key, value, options) {
		if (this.#consumed) this.#logger.warn("SKIP_FORMAT", "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page.");
		let serializedValue;
		if (typeof value === "string") serializedValue = value;
		else {
			let toStringValue = value.toString();
			if (toStringValue === Object.prototype.toString.call(value)) serializedValue = JSON.stringify(value);
			else serializedValue = toStringValue;
		}
		const { encode, ...attributes } = options ?? {};
		this.#ensureOutgoingMap().set(key, [
			serializedValue,
			stringifySetCookie({
				...attributes,
				name: key,
				value: serializedValue
			}, { encode }),
			true
		]);
		if (this.#request[responseSentSymbol]) throw new AstroError({ ...ResponseSentError });
	}
	/**
	* Merges a new AstroCookies instance into the current instance. Any new cookies
	* will be added to the current instance, overwriting any existing cookies with the same name.
	*/
	merge(cookies) {
		const outgoing = cookies.#outgoing;
		if (outgoing) for (const [key, value] of outgoing) this.#ensureOutgoingMap().set(key, value);
	}
	/**
	* Astro.cookies.header() returns an iterator for the cookies that have previously
	* been set by either Astro.cookies.set() or Astro.cookies.delete().
	* This method is primarily used by adapters to set the header on outgoing responses.
	* @returns
	*/
	*headers() {
		if (this.#outgoing == null) return;
		for (const [, value] of this.#outgoing) yield value[1];
	}
	/**
	* Marks the cookies as consumed and returns the header values.
	* After consumption, any subsequent `set()` calls will warn.
	*/
	consume() {
		this.#consumed = true;
		return this.headers();
	}
	/**
	* @deprecated Use the instance method `cookies.consume()` instead.
	* Kept for backward compatibility with adapters.
	*/
	static consume(cookies) {
		return cookies.consume();
	}
	#ensureParsed() {
		if (!this.#requestValues) this.#parse();
		if (!this.#requestValues) this.#requestValues = /* @__PURE__ */ Object.create(null);
		return this.#requestValues;
	}
	#ensureOutgoingMap() {
		if (!this.#outgoing) this.#outgoing = /* @__PURE__ */ new Map();
		return this.#outgoing;
	}
	#parse() {
		const raw = this.#request.headers.get("cookie");
		if (!raw) return;
		this.#requestValues = parseCookie(raw, { decode: identity });
	}
};
//#endregion
//#region node_modules/astro/dist/core/cookies/response.js
var astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
	Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
	let cookies = Reflect.get(response, astroCookiesSymbol);
	if (cookies != null) return cookies;
	else return;
}
function* getSetCookiesFromResponse(response) {
	const cookies = getCookiesFromResponse(response);
	if (!cookies) return [];
	for (const headerValue of cookies.consume()) yield headerValue;
	return [];
}
//#endregion
//#region node_modules/astro/dist/core/routing/pattern.js
function getPattern(segments, base, addTrailingSlash) {
	const pathname = segments.map((segment) => {
		if (segment.length === 1 && segment[0].spread) return "(?:\\/(.*?))?";
		else return "\\/" + segment.map((part) => {
			if (part.spread) return "(.*?)";
			else if (part.dynamic) return "([^/]+?)";
			else return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}).join("");
	}).join("");
	const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
	let initial = "\\/";
	if (addTrailingSlash === "never" && base !== "/" && pathname !== "") initial = "";
	return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
	if (addTrailingSlash === "always") return "\\/$";
	if (addTrailingSlash === "never") return "$";
	return "\\/?$";
}
//#endregion
//#region node_modules/astro/dist/core/render/slots.js
function getFunctionExpression(slot) {
	if (!slot) return;
	const expressions = slot?.expressions?.filter((e) => isRenderInstruction(e) === false || isRenderTemplateResult(e));
	if (expressions?.length !== 1) return;
	const expression = expressions[0];
	if (isRenderTemplateResult(expression)) return getFunctionExpression(expression);
	return expression;
}
var Slots = class {
	#result;
	#slots;
	#logger;
	constructor(result, slots, logger) {
		this.#result = result;
		this.#slots = slots;
		this.#logger = logger;
		if (slots) for (const key of Object.keys(slots)) {
			if (this[key] !== void 0) throw new AstroError({
				...ReservedSlotName,
				message: ReservedSlotName.message(key)
			});
			Object.defineProperty(this, key, {
				get() {
					return true;
				},
				enumerable: true
			});
		}
	}
	has(name) {
		if (!this.#slots) return false;
		return Boolean(this.#slots[name]);
	}
	async render(name, args = []) {
		if (!this.#slots || !this.has(name)) return;
		const result = this.#result;
		if (!Array.isArray(args)) this.#logger.warn(null, `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`);
		else if (args.length > 0) {
			const slotValue = this.#slots[name];
			const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
			const expression = getFunctionExpression(component);
			if (expression) {
				const slot = async () => typeof expression === "function" ? expression(...args) : expression;
				return await renderSlotToString(result, slot).then((res) => {
					return res;
				});
			}
			if (typeof component === "function") return await renderJSX(result, component(...args)).then((res) => res != null ? String(res) : res);
		}
		const content = await renderSlotToString(result, this.#slots[name]);
		return chunkToString(result, content);
	}
};
//#endregion
//#region node_modules/astro/dist/i18n/fallback.js
function computeFallbackRoute(options) {
	const { pathname, responseStatus, fallback, fallbackType, locales, defaultLocale, strategy, base } = options;
	if (responseStatus !== 404) return { type: "none" };
	if (!fallback || Object.keys(fallback).length === 0) return { type: "none" };
	const urlLocale = pathname.split("/").find((segment) => {
		for (const locale of locales) if (typeof locale === "string") {
			if (locale === segment) return true;
		} else if (locale.path === segment) return true;
		return false;
	});
	if (!urlLocale) return { type: "none" };
	if (!Object.keys(fallback).includes(urlLocale)) return { type: "none" };
	const fallbackLocale = fallback[urlLocale];
	const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
	let newPathname;
	if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
		if (pathname.includes(`${base}`)) newPathname = pathname.replace(`/${urlLocale}`, ``);
		else newPathname = pathname.replace(`/${urlLocale}`, `/`);
	} else newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
	return {
		type: fallbackType,
		pathname: newPathname
	};
}
//#endregion
//#region node_modules/astro/dist/i18n/router.js
var I18nRouter = class {
	#strategy;
	#defaultLocale;
	#locales;
	#base;
	#domains;
	constructor(options) {
		this.#strategy = options.strategy;
		this.#defaultLocale = options.defaultLocale;
		this.#locales = options.locales;
		this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
		this.#domains = options.domains;
	}
	/**
	* Evaluate routing strategy for a pathname.
	* Returns decision object (not HTTP Response).
	*/
	match(pathname, context) {
		if (this.shouldSkipProcessing(pathname, context)) return { type: "continue" };
		switch (this.#strategy) {
			case "manual": return { type: "continue" };
			case "pathname-prefix-always": return this.matchPrefixAlways(pathname, context);
			case "domains-prefix-always":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlways(pathname, context);
			case "pathname-prefix-other-locales": return this.matchPrefixOtherLocales(pathname, context);
			case "domains-prefix-other-locales":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixOtherLocales(pathname, context);
			case "pathname-prefix-always-no-redirect": return this.matchPrefixAlwaysNoRedirect(pathname, context);
			case "domains-prefix-always-no-redirect":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlwaysNoRedirect(pathname, context);
			default: return { type: "continue" };
		}
	}
	/**
	* Check if i18n processing should be skipped for this request
	*/
	shouldSkipProcessing(pathname, context) {
		if (pathname.includes("/404") || pathname.includes("/500")) return true;
		if (pathname.includes("/_server-islands/")) return true;
		if (context.isReroute) return true;
		if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") return true;
		return false;
	}
	/**
	* Strategy: pathname-prefix-always
	* All locales must have a prefix, including the default locale.
	*/
	matchPrefixAlways(pathname, _context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return {
			type: "redirect",
			location: `${this.#base === "/" ? "" : this.#base}/${this.#defaultLocale}`
		};
		if (!pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-other-locales
	* Default locale has no prefix, other locales must have a prefix.
	*/
	matchPrefixOtherLocales(pathname, _context) {
		let pathnameContainsDefaultLocale = false;
		for (const segment of pathname.split("/")) if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
			pathnameContainsDefaultLocale = true;
			break;
		}
		if (pathnameContainsDefaultLocale) return {
			type: "notFound",
			location: pathname.replace(`/${this.#defaultLocale}`, "")
		};
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-always-no-redirect
	* Like prefix-always but allows root to serve instead of redirecting
	*/
	matchPrefixAlwaysNoRedirect(pathname, _context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return { type: "continue" };
		if (!pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Check if the current locale doesn't belong to the configured domain.
	* Used for domain-based routing strategies.
	*/
	localeHasntDomain(currentLocale, currentDomain) {
		if (!this.#domains || !currentDomain) return false;
		if (!currentLocale) return false;
		const localesForDomain = this.#domains[currentDomain];
		if (!localesForDomain) return true;
		return !localesForDomain.includes(currentLocale);
	}
};
//#endregion
//#region node_modules/astro/dist/core/i18n/handler.js
function compileI18n(i18n, base, trailingSlash, format) {
	return {
		config: i18n,
		base,
		trailingSlash,
		format,
		router: new I18nRouter({
			strategy: i18n.strategy,
			defaultLocale: i18n.defaultLocale,
			locales: i18n.locales,
			base,
			domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce((acc, domain) => {
				const locale = i18n.domainLookupTable[domain];
				if (!acc[domain]) acc[domain] = [];
				acc[domain].push(locale);
				return acc;
			}, {}) : void 0
		})
	};
}
var i18nMemo = createManifestMemo((manifest) => {
	const config = manifest.i18n;
	return config && config.strategy !== "manual" ? compileI18n(config, manifest.base, manifest.trailingSlash, manifest.buildFormat) : null;
});
function getI18n(manifest) {
	return i18nMemo.get(manifest);
}
async function finalizeI18n(compiled, state, response) {
	markFeatureUsed(state.manifest, FetchFeatures.i18n);
	const i18n = compiled.config;
	if (state.skipErrorReroute && typeof i18n.fallback === "undefined") return response;
	if (state.responseRouteType !== "page" && state.responseRouteType !== "fallback") return response;
	const url = state.url;
	const currentLocale = state.computeCurrentLocale();
	const isPrerendered = state.routeData.prerender;
	const routerContext = {
		currentLocale,
		currentDomain: url.hostname,
		routeType: state.responseRouteType,
		isReroute: false
	};
	const routeDecision = compiled.router.match(url.pathname, routerContext);
	switch (routeDecision.type) {
		case "redirect": {
			let location = routeDecision.location;
			if (shouldAppendForwardSlash(compiled.trailingSlash, compiled.format)) location = appendForwardSlash(location);
			return new Response(null, {
				status: routeDecision.status ?? 302,
				headers: { Location: location }
			});
		}
		case "notFound": {
			if (isPrerendered) {
				const prerenderedRes = new Response(response.body, {
					status: 404,
					headers: response.headers
				});
				state.skipErrorReroute = true;
				if (routeDecision.location) prerenderedRes.headers.set("Location", routeDecision.location);
				return prerenderedRes;
			}
			const headers = new Headers();
			if (routeDecision.location) headers.set("Location", routeDecision.location);
			return new Response(null, {
				status: 404,
				headers
			});
		}
	}
	if (i18n.fallback && i18n.fallbackType) {
		const effectiveStatus = state.responseRouteType === "fallback" ? 404 : response.status;
		const fallbackDecision = computeFallbackRoute({
			pathname: url.pathname,
			responseStatus: effectiveStatus,
			currentLocale,
			fallback: i18n.fallback,
			fallbackType: i18n.fallbackType,
			locales: i18n.locales,
			defaultLocale: i18n.defaultLocale,
			strategy: i18n.strategy,
			base: compiled.base
		});
		switch (fallbackDecision.type) {
			case "redirect": return new Response(null, {
				status: 302,
				headers: { Location: fallbackDecision.pathname + url.search }
			});
			case "rewrite": try {
				return await state.rewrite(fallbackDecision.pathname + url.search);
			} catch {
				break;
			}
		}
	}
	return response;
}
//#endregion
//#region node_modules/astro/dist/i18n/index.js
function getPathByLocale(locale, locales) {
	for (const loopLocale of locales) if (typeof loopLocale === "string") {
		if (loopLocale === locale) return loopLocale;
	} else for (const code of loopLocale.codes) if (code === locale) return loopLocale.path;
	throw new AstroError(i18nNoLocaleFoundInPath);
}
function getAllCodes(locales) {
	const result = [];
	for (const loopLocale of locales) if (typeof loopLocale === "string") result.push(loopLocale);
	else result.push(...loopLocale.codes);
	return result;
}
//#endregion
//#region node_modules/astro/dist/i18n/utils.js
function parseLocale(header) {
	if (header === "*") return [{
		locale: header,
		qualityValue: void 0
	}];
	const result = [];
	const localeValues = header.split(",").map((str) => str.trim());
	for (const localeValue of localeValues) {
		const split = localeValue.split(";").map((str) => str.trim());
		const localeName = split[0];
		const qualityValue = split[1];
		if (!split) continue;
		if (qualityValue && qualityValue.startsWith("q=")) {
			const qualityValueAsFloat = Number.parseFloat(qualityValue.slice(2));
			if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) result.push({
				locale: localeName,
				qualityValue: void 0
			});
			else result.push({
				locale: localeName,
				qualityValue: qualityValueAsFloat
			});
		} else result.push({
			locale: localeName,
			qualityValue: void 0
		});
	}
	return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
	const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
	return browserLocaleList.filter((browserLocale) => {
		if (browserLocale.locale !== "*") return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
		return true;
	}).sort((a, b) => {
		const qa = a.locale === "*" ? a.qualityValue ?? 0 : a.qualityValue ?? 1;
		return (b.locale === "*" ? b.qualityValue ?? 0 : b.qualityValue ?? 1) - qa;
	});
}
function computePreferredLocale(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = void 0;
	if (acceptHeader) {
		const firstResult = sortAndFilterLocales(parseLocale(acceptHeader), locales).at(0);
		if (firstResult && firstResult.locale !== "*") {
			outer: for (const currentLocale of locales) if (typeof currentLocale === "string") {
				if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
					result = currentLocale;
					break;
				}
			} else for (const currentCode of currentLocale.codes) if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
				result = currentCode;
				break outer;
			}
		}
	}
	return result;
}
function computePreferredLocaleList(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = [];
	if (acceptHeader) {
		const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
		if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") return getAllCodes(locales);
		else if (browserLocaleList.length > 0) {
			for (const browserLocale of browserLocaleList) for (const loopLocale of locales) if (typeof loopLocale === "string") {
				if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) result.push(loopLocale);
			} else for (const code of loopLocale.codes) if (code === browserLocale.locale) result.push(code);
		}
	}
	return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
	for (const segment of pathname.split("/").map(normalizeThePath)) for (const locale of locales) if (typeof locale === "string") {
		if (!segment.includes(locale)) continue;
		if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) return locale;
	} else if (locale.path === segment) return locale.codes.at(0);
	else for (const code of locale.codes) if (normalizeTheLocale(code) === normalizeTheLocale(segment)) return code;
	for (const locale of locales) if (typeof locale === "string") {
		if (locale === defaultLocale) return locale;
	} else if (locale.path === defaultLocale) return locale.codes.at(0);
}
function computeCurrentLocaleFromParams(params, locales) {
	const byNormalizedCode = /* @__PURE__ */ new Map();
	const byPath = /* @__PURE__ */ new Map();
	for (const locale of locales) if (typeof locale === "string") byNormalizedCode.set(normalizeTheLocale(locale), locale);
	else {
		byPath.set(locale.path, locale.codes[0]);
		for (const code of locale.codes) byNormalizedCode.set(normalizeTheLocale(code), code);
	}
	for (const value of Object.values(params)) {
		if (!value) continue;
		const pathMatch = byPath.get(value);
		if (pathMatch) return pathMatch;
		const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
		if (codeMatch) return codeMatch;
	}
}
//#endregion
//#region node_modules/astro/dist/core/app/prepare-response.js
function prepareResponse(response, { addCookieHeader }) {
	if (addCookieHeader) for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) response.headers.append("set-cookie", setCookieHeaderValue);
	Reflect.set(response, responseSentSymbol$1, true);
}
//#endregion
//#region node_modules/astro/dist/core/pages/handler.js
var EMPTY_SLOTS = Object.freeze({});
async function handlePages(state, ctx) {
	const { logger, streaming } = state;
	state.resetResponseMetadata();
	let response;
	const componentInstance = await state.loadComponentInstance();
	switch (state.routeData.type) {
		case "endpoint":
			response = await renderEndpoint(componentInstance, ctx, state.routeData.prerender, logger, state);
			break;
		case "page": {
			const props = await state.getProps();
			const actionApiContext = state.getActionAPIContext();
			const result = await state.createResult(componentInstance, actionApiContext);
			try {
				response = await renderPage(result, componentInstance?.default, props, state.slots ?? EMPTY_SLOTS, streaming, state.routeData);
			} catch (e) {
				result.cancelled = true;
				throw e;
			}
			state.responseRouteType = "page";
			if (state.routeData.route === "/404" || state.routeData.route === "/500") state.skipErrorReroute = true;
			break;
		}
		case "redirect": return new Response(null, {
			status: 404,
			headers: { [ASTRO_ERROR_HEADER]: "true" }
		});
		case "fallback":
			state.responseRouteType = "fallback";
			return new Response(null, { status: 500 });
	}
	const responseCookies = getCookiesFromResponse(response);
	if (responseCookies) state.cookies.merge(responseCookies);
	state.response = response;
	return response;
}
//#endregion
//#region node_modules/astro/dist/core/routing/match.js
function matchRoute$1(pathname, manifest) {
	if (isRoute404(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute404(route.route));
		if (errorRoute) return errorRoute;
	}
	if (isRoute500(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute500(route.route));
		if (errorRoute) return errorRoute;
	}
	return manifest.routes.find((route) => {
		return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
	});
}
function isRoute404or500(route) {
	return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
	return route.component === SERVER_ISLAND_COMPONENT;
}
//#endregion
//#region node_modules/astro/dist/core/routing/astro-designed-error-pages.js
function ensure404Route(manifest) {
	if (!manifest.routes.some((route) => route.route === "/404")) manifest.routes.push(DEFAULT_404_ROUTE);
	return manifest;
}
//#endregion
//#region node_modules/astro/dist/core/routing/priority.js
function routeComparator(a, b) {
	const commonLength = Math.min(a.segments.length, b.segments.length);
	for (let index = 0; index < commonLength; index++) {
		const aSegment = a.segments[index];
		const bSegment = b.segments[index];
		const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
		const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
		if (aIsStatic && bIsStatic) {
			const aContent = aSegment.map((part) => part.content).join("");
			const bContent = bSegment.map((part) => part.content).join("");
			if (aContent !== bContent) return aContent.localeCompare(bContent);
		}
		if (aIsStatic !== bIsStatic) return aIsStatic ? -1 : 1;
		const aAllDynamic = aSegment.every((part) => part.dynamic);
		if (aAllDynamic !== bSegment.every((part) => part.dynamic)) return aAllDynamic ? 1 : -1;
		const aHasSpread = aSegment.some((part) => part.spread);
		if (aHasSpread !== bSegment.some((part) => part.spread)) return aHasSpread ? 1 : -1;
	}
	const aLength = a.segments.length;
	const bLength = b.segments.length;
	if (aLength !== bLength) {
		const aEndsInRest = a.segments.at(-1)?.some((part) => part.spread);
		const bEndsInRest = b.segments.at(-1)?.some((part) => part.spread);
		if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
			if (aLength > bLength && aEndsInRest) return 1;
			if (bLength > aLength && bEndsInRest) return -1;
		}
		return aLength > bLength ? -1 : 1;
	}
	if (a.type === "endpoint" !== (b.type === "endpoint")) return a.type === "endpoint" ? -1 : 1;
	return a.route.localeCompare(b.route);
}
//#endregion
//#region node_modules/astro/dist/core/routing/router.js
var Router = class {
	#routes;
	#base;
	#baseWithoutTrailingSlash;
	#buildFormat;
	#trailingSlash;
	constructor(routes, options) {
		this.#routes = [...routes].sort(routeComparator);
		this.#base = normalizeBase(options.base);
		this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
		this.#buildFormat = options.buildFormat;
		this.#trailingSlash = options.trailingSlash;
	}
	/**
	* Match an input pathname against the route list.
	* If allowWithoutBase is true, a non-base-prefixed path is still considered.
	*/
	match(inputPathname, { allowWithoutBase = false } = {}) {
		const normalized = getRedirectForPathname(inputPathname);
		if (normalized.redirect) return {
			type: "redirect",
			location: normalized.redirect,
			status: 301
		};
		if (this.#base !== "/") {
			const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
			if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) return {
				type: "redirect",
				location: baseWithSlash,
				status: 301
			};
			if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) return {
				type: "redirect",
				location: this.#baseWithoutTrailingSlash,
				status: 301
			};
		}
		const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
		if (!baseResult) {
			if (!allowWithoutBase) return {
				type: "none",
				reason: "outside-base"
			};
		}
		let pathname = baseResult ?? normalized.pathname;
		if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
		const route = this.#routes.find((candidate) => {
			if (candidate.pattern.test(pathname)) return true;
			return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
		});
		if (!route) return {
			type: "none",
			reason: "no-match"
		};
		return {
			type: "match",
			route,
			params: getParams(route, pathname),
			pathname
		};
	}
	/**
	* Returns all routes that match the given pathname, in priority order.
	* Used when the first match (e.g. a prerendered route) cannot serve
	* the request and subsequent matches need to be tried.
	*/
	matchAll(inputPathname, { allowWithoutBase = false } = {}) {
		const normalized = getRedirectForPathname(inputPathname);
		if (normalized.redirect) return [];
		const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
		if (!baseResult && !allowWithoutBase) return [];
		let pathname = baseResult ?? normalized.pathname;
		if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
		return this.#routes.filter((candidate) => {
			if (candidate.pattern.test(pathname)) return true;
			return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
		});
	}
};
function normalizeBase(base) {
	if (!base) return "/";
	if (base === "/") return base;
	return prependForwardSlash$1(base);
}
function getRedirectForPathname(pathname) {
	let value = prependForwardSlash$1(pathname);
	if (value.startsWith("//")) return {
		pathname: value,
		redirect: `/${value.replace(/^\/+/, "")}`
	};
	return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
	if (base === "/") return pathname;
	const baseWithSlash = `${baseWithoutTrailingSlash}/`;
	if (pathname === baseWithoutTrailingSlash || pathname === base) return trailingSlash === "always" ? null : "/";
	if (pathname === baseWithSlash) return trailingSlash === "never" ? null : "/";
	if (pathname.startsWith(baseWithSlash)) return pathname.slice(baseWithoutTrailingSlash.length);
	return null;
}
function normalizeFileFormatPathname(pathname) {
	if (pathname.endsWith("/index.html")) {
		const trimmed = pathname.slice(0, -11);
		return trimmed === "" ? "/" : trimmed;
	}
	if (pathname.endsWith(".html")) {
		const trimmed = pathname.slice(0, -5);
		return trimmed === "" ? "/" : trimmed;
	}
	return pathname;
}
//#endregion
//#region node_modules/astro/dist/core/routing/route-table.js
function compileRouteTable(manifest, routes) {
	const routesList = ensure404Route({ routes });
	const router = new Router(routesList.routes, {
		base: manifest.base,
		trailingSlash: manifest.trailingSlash,
		buildFormat: manifest.buildFormat
	});
	return {
		routes: routesList.routes,
		router
	};
}
var routeTables = createManifestMemo((manifest) => compileRouteTable(manifest, (manifest.routes ?? []).map((route) => route.routeData)));
function getRouteTable(manifest) {
	return routeTables.get(manifest);
}
function updateRouteTable(manifest, routes) {
	routeTables.set(manifest, compileRouteTable(manifest, [...routes]));
}
function matchRoute(manifest, pathname) {
	const match = getRouteTable(manifest).router.match(pathname, { allowWithoutBase: true });
	if (match.type !== "match") return void 0;
	return match.route;
}
function matchAllRoutes(manifest, pathname) {
	return getRouteTable(manifest).router.matchAll(pathname, { allowWithoutBase: true });
}
//#endregion
//#region node_modules/astro/dist/core/session/driver.js
var sessionDriverMemo = createAsyncManifestMemo(async (manifest) => {
	if (manifest.sessionDriver) return (await manifest.sessionDriver())?.default || null;
	return null;
});
function getSessionDriver(manifest) {
	return sessionDriverMemo.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/session/runtime.js
var PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
var DEFAULT_COOKIE_NAME = "astro-session";
var VALID_COOKIE_REGEX = /^[\w-]+$/;
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var unflatten$1 = (parsed, _) => {
	return unflatten(parsed, { URL: (href) => new URL(href) });
};
var stringify$1 = (data, _) => {
	return stringify(data, { URL: (val) => val instanceof URL && val.href });
};
var AstroSession = class AstroSession {
	#cookies;
	#config;
	#cookieConfig;
	#cookieName;
	#storage;
	#data;
	#sessionID;
	#toDestroy = /* @__PURE__ */ new Set();
	#toDelete = /* @__PURE__ */ new Set();
	#dirty = false;
	#cookieSet = false;
	#sessionIDFromCookie = false;
	#partial = true;
	#logger;
	#driverFactory;
	static #sharedStorage = /* @__PURE__ */ new Map();
	constructor({ cookies, config, runtimeMode, driverFactory, mockStorage, logger }) {
		this.#logger = logger;
		if (!config) throw new AstroError({
			...SessionStorageInitError,
			message: SessionStorageInitError.message("No driver was defined in the session configuration and the adapter did not provide a default driver.")
		});
		this.#cookies = cookies;
		this.#driverFactory = driverFactory;
		const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config;
		let cookieConfigObject;
		if (typeof cookieConfig === "object") {
			const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
			this.#cookieName = name;
			cookieConfigObject = rest;
		} else this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
		this.#cookieConfig = {
			sameSite: "lax",
			secure: runtimeMode === "production",
			path: "/",
			...cookieConfigObject,
			httpOnly: true
		};
		this.#config = configRest;
		if (mockStorage) this.#storage = mockStorage;
	}
	/**
	* Gets a session value. Returns `undefined` if the session or value does not exist.
	*/
	async get(key) {
		return (await this.#ensureData()).get(key)?.data;
	}
	/**
	* Checks if a session value exists.
	*/
	async has(key) {
		return (await this.#ensureData()).has(key);
	}
	/**
	* Gets all session values.
	*/
	async keys() {
		return (await this.#ensureData()).keys();
	}
	/**
	* Gets all session values.
	*/
	async values() {
		return [...(await this.#ensureData()).values()].map((entry) => entry.data);
	}
	/**
	* Gets all session entries.
	*/
	async entries() {
		return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
	}
	/**
	* Deletes a session value.
	*/
	delete(key) {
		this.#data ??= /* @__PURE__ */ new Map();
		this.#data.delete(key);
		if (this.#partial) this.#toDelete.add(key);
		this.#dirty = true;
	}
	/**
	* Sets a session value. The session is created if it does not exist.
	*/
	set(key, value, { ttl } = {}) {
		if (!key) throw new AstroError({
			...SessionStorageSaveError,
			message: "The session key was not provided."
		});
		let cloned;
		try {
			cloned = unflatten$1(JSON.parse(stringify$1(value)));
		} catch (err) {
			throw new AstroError({
				...SessionStorageSaveError,
				message: `The session data for ${key} could not be serialized.`,
				hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
			}, { cause: err });
		}
		if (!this.#cookieSet) {
			this.#setCookie();
			this.#cookieSet = true;
		}
		this.#data ??= /* @__PURE__ */ new Map();
		const lifetime = ttl ?? this.#config.ttl;
		const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
		this.#data.set(key, {
			data: cloned,
			expires
		});
		this.#dirty = true;
	}
	/**
	* Destroys the session, clearing the cookie and storage if it exists.
	*/
	destroy() {
		const cookieValue = this.#cookies.get(this.#cookieName)?.value;
		const sessionId = this.#sessionID ?? (cookieValue && UUID_REGEX.test(cookieValue) ? cookieValue : void 0);
		if (sessionId) this.#toDestroy.add(sessionId);
		this.#cookies.delete(this.#cookieName, this.#cookieConfig);
		this.#sessionID = void 0;
		this.#data = void 0;
		this.#dirty = true;
	}
	/**
	* Regenerates the session, creating a new session ID. The existing session data is preserved.
	*/
	async regenerate() {
		let data = /* @__PURE__ */ new Map();
		try {
			data = await this.#ensureData();
		} catch (err) {
			this.#logger.error("session", `Failed to load session data during regeneration: ${err}`);
			this.#partial = false;
		}
		const oldSessionId = this.#sessionID;
		this.#sessionID = crypto.randomUUID();
		this.#sessionIDFromCookie = false;
		this.#data = data;
		this.#dirty = true;
		await this.#setCookie();
		if (oldSessionId && this.#storage) this.#storage.removeItem(oldSessionId).catch((err) => {
			this.#logger.error("session", `Failed to remove old session ${oldSessionId}: ${err}`);
		});
	}
	async [PERSIST_SYMBOL]() {
		if (!this.#dirty && !this.#toDestroy.size) return;
		const storage = await this.#ensureStorage();
		if (this.#dirty && this.#data) {
			const data = await this.#ensureData();
			this.#toDelete.forEach((key2) => data.delete(key2));
			const key = this.#ensureSessionID();
			let serialized;
			try {
				serialized = stringify$1(data);
			} catch (err) {
				throw new AstroError({
					...SessionStorageSaveError,
					message: SessionStorageSaveError.message("The session data could not be serialized.", this.#config.driver)
				}, { cause: err });
			}
			await storage.setItem(key, serialized);
			this.#dirty = false;
		}
		if (this.#toDestroy.size > 0) {
			const cleanupPromises = [...this.#toDestroy].map((sessionId) => storage.removeItem(sessionId).catch((err) => {
				this.#logger.error("session", `Failed to remove session ${sessionId}: ${err}`);
			}));
			await Promise.all(cleanupPromises);
			this.#toDestroy.clear();
		}
	}
	get sessionID() {
		return this.#sessionID;
	}
	/**
	* Loads a session from storage with the given ID, and replaces the current session.
	* Any changes made to the current session will be lost.
	* This is not normally needed, as the session is automatically loaded using the cookie.
	* However it can be used to restore a session where the ID has been recorded somewhere
	* else (e.g. in a database).
	*/
	async load(sessionID) {
		this.#sessionID = sessionID;
		this.#data = void 0;
		await this.#setCookie();
		await this.#ensureData();
	}
	/**
	* Sets the session cookie.
	*/
	async #setCookie() {
		if (!VALID_COOKIE_REGEX.test(this.#cookieName)) throw new AstroError({
			...SessionStorageSaveError,
			message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
		});
		const value = this.#ensureSessionID();
		this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
	}
	/**
	* Attempts to load the session data from storage, or creates a new data object if none exists.
	* If there is existing partial data, it will be merged into the new data object.
	*/
	async #ensureData() {
		if (this.#data && !this.#partial) return this.#data;
		this.#data ??= /* @__PURE__ */ new Map();
		if (!this.#sessionID && !this.#cookies.get(this.#cookieName)?.value) {
			this.#partial = false;
			return this.#data;
		}
		const raw = await (await this.#ensureStorage()).get(this.#ensureSessionID());
		if (!raw) {
			if (this.#sessionIDFromCookie) {
				this.#sessionID = crypto.randomUUID();
				this.#sessionIDFromCookie = false;
				if (this.#cookieSet) await this.#setCookie();
			}
			return this.#data;
		}
		try {
			const storedMap = unflatten$1(raw);
			if (!(storedMap instanceof Map)) {
				this.destroy();
				throw new AstroError({
					...SessionStorageInitError,
					message: SessionStorageInitError.message("The session data was an invalid type.", this.#config.driver)
				});
			}
			const now = Date.now();
			for (const [key, value] of storedMap) {
				const expired = typeof value.expires === "number" && value.expires < now;
				if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) this.#data.set(key, value);
			}
			this.#partial = false;
			return this.#data;
		} catch (err) {
			this.destroy();
			if (err instanceof AstroError) throw err;
			throw new AstroError({
				...SessionStorageInitError,
				message: SessionStorageInitError.message("The session data could not be parsed.", this.#config.driver)
			}, { cause: err });
		}
	}
	/**
	* Returns the session ID, generating a new one if it does not exist.
	*/
	#ensureSessionID() {
		if (!this.#sessionID) {
			const cookieValue = this.#cookies.get(this.#cookieName)?.value;
			if (cookieValue && UUID_REGEX.test(cookieValue)) {
				this.#sessionID = cookieValue;
				this.#sessionIDFromCookie = true;
			} else this.#sessionID = crypto.randomUUID();
		}
		return this.#sessionID;
	}
	/**
	* Ensures the storage is initialized.
	* This is called automatically when a storage operation is needed.
	*/
	async #ensureStorage() {
		if (this.#storage) return this.#storage;
		if (AstroSession.#sharedStorage.has(this.#config.driver)) {
			this.#storage = AstroSession.#sharedStorage.get(this.#config.driver);
			return this.#storage;
		}
		if (!this.#driverFactory) throw new AstroError({
			...SessionStorageInitError,
			message: SessionStorageInitError.message("Astro could not load the driver correctly. Does it exist?", this.#config.driver)
		});
		const driver = this.#driverFactory;
		try {
			this.#storage = createStorage({ driver: {
				...driver(this.#config.options),
				hasItem() {
					return false;
				},
				getKeys() {
					return [];
				}
			} });
			AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
			return this.#storage;
		} catch (err) {
			throw new AstroError({
				...SessionStorageInitError,
				message: SessionStorageInitError.message("Unknown error", this.#config.driver)
			}, { cause: err });
		}
	}
};
//#endregion
//#region node_modules/astro/dist/core/session/handler.js
var SESSION_KEY = "session";
function provideSession(state) {
	markFeatureUsed(state.manifest, FetchFeatures.sessions);
	const config = state.manifest.sessionConfig;
	if (!config) return;
	return provideSessionAsync(state, config);
}
async function provideSessionAsync(state, config) {
	const driverFactory = await getSessionDriver(state.manifest);
	if (!driverFactory) return;
	state.provide(SESSION_KEY, {
		create() {
			const cookies = state.cookies;
			return new AstroSession({
				cookies,
				config,
				runtimeMode: getEnvironment(state.manifest).runtimeMode,
				driverFactory,
				mockStorage: null,
				logger: state.logger
			});
		},
		finalize(session) {
			return session[PERSIST_SYMBOL]();
		}
	});
}
//#endregion
//#region node_modules/astro/dist/core/app/validate-headers.js
function getFirstForwardedValue(multiValueHeader) {
	return multiValueHeader?.toString().split(",").map((e) => e.trim())[0];
}
function sanitizeHost(hostname) {
	if (!hostname) return void 0;
	if (/[/\\]/.test(hostname)) return void 0;
	return hostname;
}
function parseHost(host) {
	const parts = host.split(":");
	if (parts.length > 2) return void 0;
	return {
		hostname: parts[0],
		port: parts[1]
	};
}
function matchesAllowedDomains(hostname, protocol, port, allowedDomains) {
	const urlString = `${protocol}://${port ? `${hostname}:${port}` : hostname}`;
	if (!URL.canParse(urlString)) return false;
	const testUrl = new URL(urlString);
	return allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
}
function validateHost(host, protocol, allowedDomains) {
	if (!host || host.length === 0) return void 0;
	if (!allowedDomains || allowedDomains.length === 0) return void 0;
	const sanitized = sanitizeHost(host);
	if (!sanitized) return void 0;
	const parsed = parseHost(sanitized);
	if (!parsed) return void 0;
	const { hostname, port } = parsed;
	if (matchesAllowedDomains(hostname, protocol, port, allowedDomains)) return sanitized;
}
function validateForwardedHeaders(forwardedProtocol, forwardedHost, forwardedPort, allowedDomains) {
	const result = {};
	if (forwardedProtocol) {
		if (allowedDomains && allowedDomains.length > 0) {
			if (allowedDomains.some((pattern) => pattern.protocol !== void 0)) try {
				const testUrl = new URL(`${forwardedProtocol}://example.com`);
				if (allowedDomains.some((pattern) => matchPattern(testUrl, { protocol: pattern.protocol }))) result.protocol = forwardedProtocol;
			} catch {}
			else if (/^https?$/.test(forwardedProtocol)) result.protocol = forwardedProtocol;
		}
	}
	if (forwardedPort && allowedDomains && allowedDomains.length > 0) {
		if (allowedDomains.some((pattern) => pattern.port !== void 0)) {
			if (allowedDomains.some((pattern) => pattern.port === forwardedPort)) result.port = forwardedPort;
		}
	}
	if (forwardedHost && forwardedHost.length > 0 && allowedDomains && allowedDomains.length > 0) {
		const protoForValidation = result.protocol || "https";
		const sanitized = sanitizeHost(forwardedHost);
		const parsed = sanitized ? parseHost(sanitized) : void 0;
		if (sanitized && parsed) {
			const { hostname, port: portFromHost } = parsed;
			if (matchesAllowedDomains(hostname, protoForValidation, result.port || portFromHost, allowedDomains)) result.host = sanitized;
		}
	}
	return result;
}
//#endregion
//#region node_modules/astro/dist/core/output-filename.js
var STATUS_CODE_PAGES = /* @__PURE__ */ new Set(["/404", "/500"]);
function getOutputFilename(buildFormat, name, routeData) {
	if (routeData.type === "endpoint") return name;
	if (name === "/" || name === "") return name === "" ? "index.html" : "/index.html";
	if (buildFormat === "file" || STATUS_CODE_PAGES.has(name)) return `${removeTrailingForwardSlash(name || "index")}.html`;
	if (buildFormat === "preserve" && !routeData.isIndex) return `${removeTrailingForwardSlash(name || "index")}.html`;
	return `${removeTrailingForwardSlash(name)}/index.html`;
}
//#endregion
//#region node_modules/astro/dist/core/errors/default-handler.js
async function renderDefaultError(manifest, request, { status, response: originalResponse, skipMiddleware = false, error, pathname, ...resolvedRenderOptions }) {
	const resolvedPathname = pathname ?? new FetchState(manifest, request).pathname;
	const routeTable = getRouteTable(manifest);
	const errorRouteData = matchRoute$1(getErrorRoutePath(resolvedPathname, status, routeTable.routes, manifest.i18n?.locales, manifest.trailingSlash === "always"), routeTable);
	const url = new URL(request.url);
	if (errorRouteData) {
		if (errorRouteData.prerender) {
			const allowedDomains = manifest.allowedDomains;
			const safeOrigin = validateHost(url.host, url.protocol.replace(":", ""), allowedDomains) ? url.origin : `${url.protocol}//localhost`;
			const statusURL = new URL(`${removeTrailingForwardSlash(manifest.base)}${getOutputFilename(manifest.buildFormat, errorRouteData.route, errorRouteData)}`, safeOrigin);
			if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) try {
				const newResponse = mergeResponses(await resolvedRenderOptions.prerenderedErrorPageFetch(statusURL.toString()), originalResponse, {
					status,
					removeContentEncodingHeaders: true
				});
				prepareResponse(newResponse, resolvedRenderOptions);
				return newResponse;
			} catch {
				const response2 = mergeResponses(new Response(null, { status }), originalResponse);
				prepareResponse(response2, resolvedRenderOptions);
				return response2;
			}
		}
		const mod = await getEnvironment(manifest).getComponentByRoute(manifest, errorRouteData);
		const errorState = new FetchState(manifest, request);
		errorState.skipMiddleware = skipMiddleware;
		errorState.clientAddress = resolvedRenderOptions.clientAddress;
		errorState.routeData = errorRouteData;
		errorState.pathname = resolvedPathname;
		errorState.status = status;
		errorState.componentInstance = mod;
		errorState.locals = resolvedRenderOptions.locals ?? {};
		errorState.initialProps = { error };
		try {
			await provideSession(errorState);
			const response2 = await handleMiddleware(errorState, handlePages);
			if (rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, errorState.routeData, response2)) return renderDefaultError(manifest, request, {
				...resolvedRenderOptions,
				status,
				error,
				response: originalResponse,
				skipMiddleware: true,
				pathname: resolvedPathname
			});
			const newResponse = mergeResponses(response2, originalResponse);
			prepareResponse(newResponse, resolvedRenderOptions);
			return newResponse;
		} catch {
			if (skipMiddleware === false) return renderDefaultError(manifest, request, {
				...resolvedRenderOptions,
				status,
				error,
				response: originalResponse,
				skipMiddleware: true,
				pathname: resolvedPathname
			});
		} finally {
			await errorState.finalizeAll();
		}
	}
	const response = mergeResponses(new Response(null, { status }), originalResponse);
	prepareResponse(response, resolvedRenderOptions);
	return response;
}
function mergeResponses(newResponse, originalResponse, override) {
	let newResponseHeaders = newResponse.headers;
	if (override?.removeContentEncodingHeaders) {
		newResponseHeaders = new Headers(newResponseHeaders);
		newResponseHeaders.delete("Content-Encoding");
		newResponseHeaders.delete("Content-Length");
	}
	if (!originalResponse) {
		if (override !== void 0) return new Response(newResponse.body, {
			status: override.status,
			statusText: newResponse.statusText,
			headers: newResponseHeaders
		});
		return newResponse;
	}
	const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
	try {
		originalResponse.headers.delete("Content-type");
		originalResponse.headers.delete("Content-Length");
		originalResponse.headers.delete("Transfer-Encoding");
	} catch {}
	const newHeaders = new Headers();
	const seen = /* @__PURE__ */ new Set();
	for (const [name, value] of originalResponse.headers) {
		newHeaders.append(name, value);
		seen.add(name.toLowerCase());
	}
	for (const [name, value] of newResponseHeaders) {
		const lower = name.toLowerCase();
		if (!seen.has(lower) || lower === "set-cookie") newHeaders.append(name, value);
	}
	const mergedResponse = new Response(newResponse.body, {
		status,
		statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
		headers: newHeaders
	});
	const originalCookies = getCookiesFromResponse(originalResponse);
	const newCookies = getCookiesFromResponse(newResponse);
	if (originalCookies) {
		if (newCookies) originalCookies.merge(newCookies);
		attachCookiesToResponse(mergedResponse, originalCookies);
	} else if (newCookies) attachCookiesToResponse(mergedResponse, newCookies);
	return mergedResponse;
}
//#endregion
//#region node_modules/astro/dist/core/errors/build-handler.js
async function renderBuildError(manifest, request, options) {
	if (options.status === 500) {
		if (options.response) return options.response;
		throw options.error;
	}
	return renderDefaultError(manifest, request, {
		...options,
		prerenderedErrorPageFetch: void 0
	});
}
//#endregion
//#region node_modules/astro/dist/core/errors/dev-handler.js
async function renderDevError(manifest, request, { skipMiddleware = false, error, status, response: _response, pathname, ...resolvedRenderOptions }, { shouldInjectCspMetaTags }) {
	if (isAstroError(error) && [MiddlewareNoDataOrNextCalled.name, MiddlewareNotAResponse.name].includes(error.name)) throw error;
	const resolvedPathname = pathname ?? new FetchState(manifest, request).pathname;
	const renderRoute = async (routeData) => {
		try {
			const preloadedComponent = await getEnvironment(manifest).getComponentByRoute(manifest, routeData);
			const errorState = new FetchState(manifest, request);
			errorState.skipMiddleware = skipMiddleware;
			errorState.clientAddress = resolvedRenderOptions.clientAddress;
			errorState.shouldInjectCspMetaTags = shouldInjectCspMetaTags ? !!manifest.csp : false;
			errorState.routeData = routeData;
			errorState.pathname = resolvedPathname;
			errorState.status = status;
			errorState.componentInstance = preloadedComponent;
			errorState.locals = resolvedRenderOptions.locals ?? {};
			errorState.initialProps = { error };
			const response = await handleMiddleware(errorState, handlePages);
			if (rewroteToEmptyErrorResponse(skipMiddleware, routeData, errorState.routeData, response)) return renderDevError(manifest, request, {
				...resolvedRenderOptions,
				status,
				error,
				skipMiddleware: true,
				pathname: resolvedPathname
			}, { shouldInjectCspMetaTags });
			if (error) getLogger(manifest).error("router", error.stack || error.message);
			return response;
		} catch (_err) {
			if (skipMiddleware === false) return renderDevError(manifest, request, {
				...resolvedRenderOptions,
				status: 500,
				skipMiddleware: true,
				error: _err,
				pathname: resolvedPathname
			}, { shouldInjectCspMetaTags });
			throw _err;
		}
	};
	if (status === 404) {
		const custom404 = getCustom404Route(getRouteTable(manifest));
		if (custom404) return renderRoute(custom404);
	}
	const custom500 = getCustom500Route(getRouteTable(manifest));
	if (!custom500) throw error;
	else return renderRoute(custom500);
}
//#endregion
//#region node_modules/astro/dist/core/errors/handler.js
function renderErrorPage(manifest, request, options) {
	const env = getEnvironment(manifest);
	switch (env.errorStrategy) {
		case "dev": return renderDevError(manifest, request, options, { shouldInjectCspMetaTags: env.injectCspMetaTagsOnErrorPages });
		case "build": return renderBuildError(manifest, request, options);
		case "default": return renderDefaultError(manifest, request, options);
	}
}
function renderErrorFromState(state, request, options) {
	if (state.renderError) return state.renderError(request, options);
	return renderErrorPage(state.manifest, request, options);
}
function rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, renderedRouteData, response) {
	return skipMiddleware === false && renderedRouteData !== errorRouteData && response.body === null && REROUTABLE_STATUS_CODES.includes(response.status);
}
//#endregion
//#region node_modules/astro/dist/core/middleware/callMiddleware.js
async function callMiddleware(onRequest, apiContext, responseFunction) {
	let nextCalled = false;
	let responseFunctionPromise = void 0;
	const next = async (payload) => {
		nextCalled = true;
		responseFunctionPromise = responseFunction(apiContext, payload);
		return responseFunctionPromise;
	};
	const middlewarePromise = onRequest(apiContext, next);
	return await Promise.resolve(middlewarePromise).then(async (value) => {
		if (nextCalled) {
			if (typeof value !== "undefined") {
				if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
				return value;
			} else if (responseFunctionPromise) return responseFunctionPromise;
			else throw new AstroError(MiddlewareNotAResponse);
		} else if (typeof value === "undefined") throw new AstroError(MiddlewareNoDataOrNextCalled);
		else if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
		else return value;
	});
}
//#endregion
//#region node_modules/astro/dist/core/middleware/load.js
var resolvedMiddleware = /* @__PURE__ */ new WeakMap();
var middlewareMemo = createAsyncManifestMemo(async (manifest) => {
	let handler;
	if (manifest.middleware) {
		const internalMiddlewares = [(await manifest.middleware()).onRequest ?? NOOP_MIDDLEWARE_FN];
		if (manifest.checkOrigin) internalMiddlewares.unshift(createOriginCheckMiddleware());
		handler = sequence(...internalMiddlewares);
	} else handler = NOOP_MIDDLEWARE_FN;
	resolvedMiddleware.set(manifest, handler);
	return handler;
});
function getMiddleware(manifest) {
	return middlewareMemo.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/cache/runtime/noop.js
var EMPTY_OPTIONS = Object.freeze({ tags: [] });
var NoopAstroCache = class {
	enabled = false;
	set() {}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {}
};
var hasWarned = false;
var DisabledAstroCache = class {
	enabled = false;
	#logger;
	constructor(logger) {
		this.#logger = logger;
	}
	#warn() {
		if (!hasWarned) {
			hasWarned = true;
			this.#logger?.warn("cache", "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `cache` to enable caching.");
		}
	}
	set() {
		this.#warn();
	}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {
		throw new AstroError(CacheNotEnabled);
	}
};
//#endregion
//#region node_modules/astro/dist/core/middleware/astro-middleware.js
async function handleMiddleware(state, renderRouteCallback) {
	markFeatureUsed(state.manifest, FetchFeatures.middleware);
	await state.getProps();
	const apiContext = state.getAPIContext();
	state.counter++;
	if (state.counter === 4) return new Response("Loop Detected", {
		status: 508,
		statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
	});
	const next = async (ctx, payload) => {
		if (payload) {
			state.logger.debug("router", "Called rewriting to:", payload);
			applyRewriteToState(state, payload, await getEnvironment(state.manifest).tryRewrite(state.manifest, payload, state.request));
		}
		return renderRouteCallback(state, ctx);
	};
	let response;
	if (state.skipMiddleware) response = await next(apiContext);
	else {
		const middleware = await getMiddleware(state.manifest);
		response = await callMiddleware(sequence(middleware), apiContext, next);
	}
	attachCookiesToResponse(response, state.cookies);
	state.response = response;
	return response;
}
//#endregion
//#region node_modules/astro/dist/core/util/normalized-url.js
function createNormalizedUrl(requestUrl) {
	return normalizeUrl(new URL(requestUrl));
}
function setPathname(url, pathname) {
	if (url.pathname !== pathname) url.pathname = pathname;
}
function normalizeUrl(url) {
	try {
		setPathname(url, validateAndDecodePathname(url.pathname));
	} catch {
		try {
			setPathname(url, decodeURI(url.pathname));
		} catch {}
	}
	setPathname(url, collapseDuplicateSlashes(url.pathname));
	return url;
}
//#endregion
//#region node_modules/astro/dist/core/rewrites/handler.js
function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
	const oldPathname = state.pathname;
	const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
	if (state.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) throw new AstroError({
		...ForbiddenRewrite,
		message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
		hint: ForbiddenRewrite.hint(routeData.component)
	});
	state.routeData = routeData;
	state.componentInstance = componentInstance;
	if (payload instanceof Request) state.request = payload;
	else state.request = copyRequest(newUrl, state.request, routeData.prerender, state.logger, state.routeData.route);
	state.url = createNormalizedUrl(state.request.url);
	if (mergeCookies) {
		const newCookies = new AstroCookies(state.request, state.logger);
		if (state.cookies) newCookies.merge(state.cookies);
		state.cookies = newCookies;
	}
	state.params = getParams(routeData, pathname);
	state.pathname = pathname;
	state.isRewriting = true;
	state.status = 200;
	setOriginPathname(state.request, oldPathname, state.manifest.trailingSlash, state.manifest.buildFormat);
	state.invalidateContexts();
}
async function executeRewrite(state, payload) {
	state.logger.debug("router", "Calling rewrite: ", payload);
	applyRewriteToState(state, payload, await getEnvironment(state.manifest).tryRewrite(state.manifest, payload, state.request), { mergeCookies: true });
	return handleMiddleware(state, handlePages);
}
//#endregion
//#region node_modules/astro/dist/core/i18n/domain.js
function computePathnameFromDomain(request, url, i18n, base, trailingSlash, logger, pathnameFromRequest) {
	let pathname = void 0;
	if (i18n && (i18n.strategy === "domains-prefix-always" || i18n.strategy === "domains-prefix-other-locales" || i18n.strategy === "domains-prefix-always-no-redirect")) {
		let host = request.headers.get("X-Forwarded-Host");
		let protocol = request.headers.get("X-Forwarded-Proto");
		if (protocol) protocol = protocol + ":";
		else protocol = url.protocol;
		if (!host) host = request.headers.get("Host");
		if (host && protocol) {
			host = host.split(":")[0];
			try {
				let locale;
				const hostAsUrl = new URL(`${protocol}//${host}`);
				for (const [domainKey, localeValue] of Object.entries(i18n.domainLookupTable)) {
					const domainKeyAsUrl = new URL(domainKey);
					if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
						locale = localeValue;
						break;
					}
				}
				if (locale) {
					const requestPathname = pathnameFromRequest ?? stripRequestBase(url.pathname, base);
					pathname = prependForwardSlash$1(joinPaths(normalizeTheLocale(locale), requestPathname));
					if (trailingSlash === "always") pathname = appendForwardSlash(pathname);
					else if (trailingSlash === "never") pathname = removeTrailingForwardSlash(pathname);
					else if (url.pathname.endsWith("/")) pathname = appendForwardSlash(pathname);
				}
			} catch (e) {
				logger.error("router", `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`);
				logger.error("router", `Error: ${e}`);
			}
		}
	}
	return pathname;
}
//#endregion
//#region node_modules/astro/dist/core/manifest/derived.js
var sites = createManifestMemo((manifest) => manifest.site ? new URL(manifest.site) : void 0);
function getSite(manifest) {
	return sites.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/server-islands/mappings.js
async function getServerIslands(manifest) {
	if (manifest.serverIslandMappings) return manifest.serverIslandMappings();
	return {
		serverIslandMap: /* @__PURE__ */ new Map(),
		serverIslandNameMap: /* @__PURE__ */ new Map()
	};
}
//#endregion
//#region node_modules/astro/dist/core/fetch/fetch-state.js
function getFetchStateFromAPIContext(context) {
	const state = context[fetchStateSymbol];
	if (!state) throw new Error("FetchState not found on APIContext. This is an internal error — the context was not created through Astro's request pipeline.");
	return state;
}
var FetchState = class {
	/** The manifest — the single ambient source of static, build-time data. */
	manifest;
	/** The manifest's identity-stable logger, captured once at construction. */
	logger;
	/**
	* Whether page renders stream. From the facade hooks on the fast path,
	* else the environment's default.
	*/
	streaming;
	/**
	* Internal facade hook: late-bound `app.renderError` dispatch. Undefined on
	* bare and custom-handler paths — those fall through to the environment's
	* error strategy (`renderErrorPage`).
	*/
	renderError;
	/**
	* Internal facade hook: late-bound `app.logThisRequest` dispatch. Undefined
	* on bare and custom-handler paths — those fall through to the
	* environment's `logRequest` behavior.
	*/
	logRequest;
	/**
	* The request to render. Mutated during rewrites so subsequent renders
	* see the rewritten URL.
	*/
	request;
	routeData;
	/**
	* The pathname to use for routing and rendering. Starts out as the raw,
	* base-stripped, decoded pathname from the request. May be further
	* normalized by `handleRequest` after routeData is known (in dev, when
	* the matched route has no `.html` extension, `.html` / `/index.html`
	* suffixes are stripped).
	*/
	pathname;
	/** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
	renderOptions;
	/** When the request started, used to log duration. */
	timeStart;
	/**
	* The route's loaded component module. Set before middleware runs; may
	* be swapped during in-flight rewrites from inside the middleware chain.
	*/
	componentInstance;
	/**
	* Slot overrides supplied by the container API. `undefined` for HTTP
	* requests — `PagesHandler` coalesces to `{}` on read so we don't
	* allocate an empty object per request.
	*/
	slots;
	/**
	* The `Response` produced by handlers, if any. Set after page
	* rendering or middleware completes.
	*/
	response;
	/**
	* Default HTTP status for the rendered response. Callers override
	* before rendering runs (e.g. `handleRequest` sets this from
	* `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
	*/
	status = 200;
	/** Whether user middleware should be skipped for this request. */
	skipMiddleware = false;
	/**
	* Set to `true` when the request path was encoded too many times to fully
	* decode (see {@link validateAndDecodePathname}). These requests are
	* rejected with a `400` before middleware or routing run.
	*/
	invalidEncoding = false;
	/** A flag that tells the render content if the rewriting was triggered. */
	isRewriting = false;
	/** A safety net in case of loops (rewrite counter). */
	counter = 0;
	/** Cookies for this request. Created lazily on first access. */
	cookies;
	/** Route params derived from routeData + pathname. Computed lazily. */
	#params;
	get params() {
		if (!this.#params && this.routeData) this.#params = getParams(this.routeData, this.pathname);
		return this.#params;
	}
	set params(value) {
		this.#params = value;
	}
	/** Normalized URL for this request. */
	url;
	/** Client address for this request. */
	clientAddress;
	/** Whether this is a partial render (container API). */
	partial;
	/** Internal metadata about the current response route type. */
	responseRouteType;
	/** Internal flag to prevent rerouting this response to an error page. */
	skipErrorReroute = false;
	/** Whether to inject CSP meta tags. */
	shouldInjectCspMetaTags;
	/** Request-scoped locals object, shared with user middleware. */
	locals = {};
	/**
	* Memoized `props` (see `getProps`). `null` means "not yet computed"
	* — using `null` (rather than `undefined`) keeps the hidden class
	* stable and distinct from a valid-but-empty result.
	*/
	props = null;
	/** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
	actionApiContext = null;
	/** Memoized `APIContext` (see `getAPIContext`). */
	apiContext = null;
	/** Registered context providers keyed by name. Lazy-initialized on first provide(). */
	#providers;
	/** Cached values from resolved providers. Lazy-initialized on first resolve(). */
	#providersResolvedValues;
	/** Cached promise for lazy component instance loading. */
	#componentInstancePromise;
	/** SSR result for the current page render. */
	result;
	/** Initial props (from container/error handler). */
	initialProps = {};
	/** Memoized Astro page partial. */
	#astroPagePartial;
	/**
	* Locale-prefixed pathname derived from the Host header for domain-based
	* i18n routing (e.g. `/en/boats/1/foo`), or `undefined` when the request
	* isn't served from a locale-mapped domain. When set, `this.pathname` is
	* derived from it so locale/param resolution match the route pattern.
	*/
	#domainPathname;
	/** Memoized current locale. */
	#currentLocale;
	/** Memoized preferred locale. */
	#preferredLocale;
	/** Memoized preferred locale list. */
	#preferredLocaleList;
	constructor(manifest, request, options, hooks) {
		this.manifest = manifest;
		this.logger = getLogger(manifest);
		this.streaming = hooks?.streaming ?? getEnvironment(manifest).defaultStreaming(manifest);
		this.renderError = hooks?.renderError;
		this.logRequest = hooks?.logRequest;
		this.request = request;
		options ??= getRenderOptions(request);
		this.routeData = options?.routeData;
		const self = this;
		this.renderOptions = {
			...options ?? {
				addCookieHeader: false,
				clientAddress: void 0,
				prerenderedErrorPageFetch: fetch,
				routeData: void 0,
				waitUntil: void 0
			},
			get locals() {
				return self.locals;
			}
		};
		this.componentInstance = void 0;
		this.slots = void 0;
		const url = new URL(request.url);
		const publicPathname = this.#normalizePathname(url.pathname);
		const pathname = this.#computePathname(publicPathname);
		setPathname(url, publicPathname);
		setPathname(url, collapseDuplicateSlashes(url.pathname));
		const domainPathname = computePathnameFromDomain(request, url, manifest.i18n, manifest.base, manifest.trailingSlash, this.logger, pathname);
		if (domainPathname) {
			this.#domainPathname = domainPathname;
			this.pathname = domainPathname;
		} else this.pathname = pathname;
		this.timeStart = performance.now();
		this.clientAddress = options?.clientAddress;
		this.locals = options?.locals ?? {};
		this.url = url;
		this.cookies = new AstroCookies(request, this.logger);
		if (manifest.allowedDomains && manifest.allowedDomains.length > 0 && !this.routeData?.prerender) this.#applyForwardedHeaders();
		if (!Reflect.get(this.request, originPathnameSymbol)) setOriginPathname(this.request, this.pathname, manifest.trailingSlash, manifest.buildFormat);
		this.#resolveRouteData();
	}
	/**
	* Triggers a rewrite. Delegates to the rewrites handler module.
	*/
	rewrite(payload) {
		return executeRewrite(this, payload);
	}
	/**
	* Creates the SSR result for the current page render.
	*/
	async createResult(mod, ctx) {
		const manifest = this.manifest;
		const env = getEnvironment(manifest);
		const { clientDirectives, inlinedScripts, compressHTML } = manifest;
		const renderers = env.getRenderers(manifest);
		const resolve = (specifier) => env.resolve(manifest, specifier);
		const routeData = this.routeData;
		const { links, scripts, styles } = await env.headElements(manifest, routeData);
		const extraStyleHashes = [];
		const extraScriptHashes = [];
		const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest.shouldInjectCspMetaTags;
		const cspAlgorithm = manifest.csp?.algorithm ?? "SHA-256";
		if (shouldInjectCspMetaTags) {
			for (const style of styles) extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
			for (const script of scripts) extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
		}
		const componentMetadata = await env.componentMetadata(manifest, routeData) ?? manifest.componentMetadata;
		const headers = new Headers({ "Content-Type": "text/html" });
		const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
		const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
		const status = this.status;
		const response = {
			status: actionResult?.error ? actionResult?.error.status : status,
			statusText: actionResult?.error ? actionResult?.error.type : "OK",
			get headers() {
				return headers;
			},
			set headers(_) {
				throw new AstroError(AstroResponseHeadersReassigned);
			}
		};
		const state = this;
		const result = {
			base: manifest.base,
			userAssetsBase: manifest.userAssetsBase,
			cancelled: false,
			clientDirectives,
			inlinedScripts,
			componentMetadata,
			compressHTML,
			cookies: this.cookies,
			createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
			links,
			params: this.params,
			partial,
			pathname: this.pathname,
			renderers,
			resolve,
			response,
			request: this.request,
			scripts,
			styles,
			actionResult,
			async getServerIslandNameMap() {
				return (await getServerIslands(manifest)).serverIslandNameMap ?? /* @__PURE__ */ new Map();
			},
			key: manifest.key,
			trailingSlash: manifest.trailingSlash,
			_metadata: {
				hasHydrationScript: false,
				rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
				hasRenderedHead: false,
				renderedScripts: /* @__PURE__ */ new Set(),
				hasDirectives: /* @__PURE__ */ new Set(),
				hasRenderedServerIslandRuntime: false,
				headInTree: false,
				extraHead: [],
				extraStyleHashes,
				extraScriptHashes,
				propagators: /* @__PURE__ */ new Set(),
				routeHasPropagation: false,
				pendingSlotEvaluations: [],
				templateDepth: 0
			},
			cspDestination: manifest.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
			shouldInjectCspMetaTags,
			cspAlgorithm,
			directives: manifest.csp?.directives ? [...manifest.csp.directives] : [],
			scriptHashes: manifest.csp?.scriptHashes ? [...manifest.csp.scriptHashes] : [],
			scriptResources: manifest.csp?.scriptResources ? [...manifest.csp.scriptResources] : [],
			styleHashes: manifest.csp?.styleHashes ? [...manifest.csp.styleHashes] : [],
			styleResources: manifest.csp?.styleResources ? [...manifest.csp.styleResources] : [],
			isStrictDynamic: manifest.csp?.isStrictDynamic ?? false,
			scriptDirective: {
				resources: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.resources] : [],
				hashes: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.hashes] : [],
				strictDynamic: manifest.csp?.scriptDirective?.strictDynamic ?? false
			},
			styleDirective: {
				resources: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.resources] : [],
				hashes: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.hashes] : []
			},
			speculationRulesContent: manifest.csp?.speculationRulesContent,
			internalFetchHeaders: manifest.internalFetchHeaders
		};
		this.result = result;
		return result;
	}
	/**
	* Creates the Astro global object for a component render.
	*/
	createAstro(result, props, slotValues, apiContext) {
		let astroPagePartial;
		if (this.isRewriting) this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
		this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
		astroPagePartial = this.#astroPagePartial;
		const astroComponentPartial = {
			props,
			self: null
		};
		const Astro = Object.assign(Object.create(astroPagePartial), astroComponentPartial);
		let _slots;
		Object.defineProperty(Astro, "slots", { get: () => {
			if (!_slots) _slots = new Slots(result, slotValues, this.logger);
			return _slots;
		} });
		return Astro;
	}
	/**
	* Creates the Astro page-level partial (prototype for Astro global).
	*/
	createAstroPagePartial(result, apiContext) {
		const state = this;
		const { cookies, locals, params, logger, url } = this;
		const { response } = result;
		const redirect = (path, status = 302) => {
			if (state.request[responseSentSymbol$1]) throw new AstroError({ ...ResponseSentError });
			return new Response(null, {
				status,
				headers: { Location: path }
			});
		};
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		const callAction = createCallAction(apiContext);
		const partial = {
			generator: ASTRO_GENERATOR,
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			cookies,
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			locals,
			redirect,
			rewrite,
			request: this.request,
			response,
			site: getSite(this.manifest),
			getActionResult: createGetActionResult(locals),
			get callAction() {
				return callAction;
			},
			url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return astroToRuntimeLogger(logger);
			}
		};
		this.defineProviderGetters(partial);
		return partial;
	}
	getClientAddress() {
		const { clientAddress } = this;
		const routeData = this.routeData;
		if (routeData.prerender) throw new AstroError({
			...PrerenderClientAddressNotAvailable,
			message: PrerenderClientAddressNotAvailable.message(routeData.component)
		});
		if (clientAddress) return clientAddress;
		if (this.manifest.adapterName) throw new AstroError({
			...ClientAddressNotAvailable,
			message: ClientAddressNotAvailable.message(this.manifest.adapterName)
		});
		throw new AstroError(StaticClientAddressNotAvailable);
	}
	getCookies() {
		return this.cookies;
	}
	getCsp() {
		const state = this;
		if (!this.manifest.csp) {
			if (getEnvironment(this.manifest).runtimeMode === "production") this.logger.warn("csp", `context.csp was used when rendering the route ${colors.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`);
			return;
		}
		const warnedFallback = /* @__PURE__ */ new Set();
		const warnFallback = (family, kind) => {
			if (kind === "default" || !state.result) return;
			const defaultResources = (family === "script" ? state.result.scriptDirective : state.result.styleDirective).resources.map(normalizeCspResourceEntry).filter((entry) => entry.kind === "default").map((entry) => entry.resource);
			if (defaultResources.length === 0) return;
			const key = `${family}:${kind}`;
			if (warnedFallback.has(key)) return;
			warnedFallback.add(key);
			const general = `${family}-src`;
			const specific = `${general}-${kind === "element" ? "elem" : "attr"}`;
			state.logger.warn("csp", `A resource was added to \`${specific}\`, but \`${general}\` also defines custom resources (${defaultResources.join(" ")}). Because \`${specific}\` overrides \`${general}\` for its scope (browsers do not fall back), those resources will not apply there. Add them to \`${specific}\` as well if needed.`);
		};
		return {
			insertDirective(payload) {
				if (state.result) state.result.directives = pushDirective(state.result.directives, payload);
			},
			insertScriptResource(payload) {
				if (!state.result) return;
				warnFallback("script", normalizeCspResourceEntry(payload).kind);
				state.result.scriptDirective.resources.push(payload);
			},
			insertStyleResource(payload) {
				if (!state.result) return;
				warnFallback("style", normalizeCspResourceEntry(payload).kind);
				state.result.styleDirective.resources.push(payload);
			},
			insertStyleHash(payload) {
				state.result?.styleDirective.hashes.push(payload);
			},
			insertScriptHash(payload) {
				state.result?.scriptDirective.hashes.push(payload);
			}
		};
	}
	computeCurrentLocale() {
		const { url, manifest: { i18n }, routeData } = this;
		if (!i18n || !routeData) return;
		const { defaultLocale, locales, strategy } = i18n;
		const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
		if (this.#currentLocale) return this.#currentLocale;
		let computedLocale;
		if (isRouteServerIsland(routeData)) {
			let referer = this.request.headers.get("referer");
			if (referer) {
				if (URL.canParse(referer)) referer = new URL(referer).pathname;
				computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
			}
		} else {
			let pathname = routeData.pathname;
			if (this.#domainPathname) pathname = this.pathname;
			else if (url && !routeData.pattern.test(url.pathname)) {
				for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(url.pathname)) {
					pathname = fallbackRoute.pathname;
					break;
				}
			}
			pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
			computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
			if (routeData.params.length > 0) {
				const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
				if (localeFromParams) computedLocale = localeFromParams;
			}
		}
		this.#currentLocale = computedLocale ?? fallbackTo;
		return this.#currentLocale;
	}
	computePreferredLocale() {
		const { manifest: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
	}
	computePreferredLocaleList() {
		const { manifest: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
	}
	/**
	* Lazily loads the route's component module. Returns the cached
	* instance if already loaded. The promise is cached so concurrent
	* callers share the same load.
	*/
	async loadComponentInstance() {
		if (this.componentInstance) return this.componentInstance;
		if (this.#componentInstancePromise) return this.#componentInstancePromise;
		this.#componentInstancePromise = getEnvironment(this.manifest).getComponentByRoute(this.manifest, this.routeData).then((mod) => {
			this.componentInstance = mod;
			return mod;
		});
		return this.#componentInstancePromise;
	}
	/**
	* Registers a context provider under the given key. Handlers call
	* this to contribute values to the request context (e.g. sessions).
	* The `create` factory is called lazily on the first `resolve(key)`.
	*/
	provide(key, provider) {
		(this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
	}
	/**
	* Lazily resolves a provider registered under `key`. Calls
	* `provider.create()` on first access and caches the result.
	* Returns `undefined` if no provider was registered for the key.
	*/
	resolve(key) {
		if (this.#providersResolvedValues?.has(key)) return this.#providersResolvedValues.get(key);
		const provider = this.#providers?.get(key);
		if (!provider) return void 0;
		const value = provider.create();
		(this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
		return value;
	}
	/**
	* Runs all registered `finalize` callbacks. Should be called after
	* the response is produced, typically in a `finally` block.
	*
	* Returns synchronously (no promise allocation) when nothing needs
	* finalizing — important for the hot path where sessions are not used.
	*/
	finalizeAll() {
		if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
		let chain;
		for (const [key, provider] of this.#providers) if (provider.finalize && this.#providersResolvedValues.has(key)) {
			const result = provider.finalize(this.#providersResolvedValues.get(key));
			if (result) chain = chain ? chain.then(() => result) : result;
		}
		return chain;
	}
	/**
	* Adds lazy getters to `target` for each registered provider key.
	* Used by context creation (APIContext, Astro global) so that
	* provider values like `session` and `cache` appear as properties
	* without hard-coding the keys.
	*
	* Always defines a `session` getter (returning `undefined` when no
	* provider is registered) so `ctx.session` / `Astro.session` is a
	* present property regardless of whether the sessions handler was
	* included in the pipeline.
	*/
	defineProviderGetters(target) {
		const state = this;
		if (this.#providers) for (const key of this.#providers.keys()) Object.defineProperty(target, key, {
			get: () => state.resolve(key),
			enumerable: true,
			configurable: true
		});
		if (!this.#providers?.has("session")) {
			let warned = false;
			Object.defineProperty(target, "session", {
				get() {
					if (!warned) {
						warned = true;
						state.logger.warn("session", "`Astro.session` was accessed but no session storage is configured. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/");
					}
				},
				enumerable: true,
				configurable: true
			});
		}
	}
	/**
	* Resolves the route to use for this request and stores it on
	* `this.routeData`. If the adapter (or the dev server) provided a
	* `routeData` via render options it's already set and this is a
	* no-op. Otherwise we use the app's synchronous route matcher and
	* fall back to a `404.astro` route so middleware can still run.
	*
	* Called eagerly from the constructor so individual handlers
	* (actions, pages, middleware, etc.) always see a resolved route
	* without the caller needing an extra setup step.
	*
	* Once routeData is known, finalizes `this.pathname`: in dev, if the
	* matched route has no `.html` extension, strip `.html` / `/index.html`
	* suffixes so the rendering pipeline sees the canonical pathname.
	*/
	/**
	* Strip `.html` / `/index.html` suffixes from the pathname so the
	* rendering pipeline sees the canonical route path. Only applies to
	* page routes where `.html` is framework-injected. Endpoint routes
	* preserve `.html` because any such suffix is user-provided (e.g.
	* from `getStaticPaths` params). Skipped when the matched route
	* itself has an `.html` extension in its definition.
	*/
	#stripHtmlExtension() {
		if (this.routeData && this.routeData.type === "page" && !routeHasHtmlExtension(this.routeData)) {
			const original = this.pathname;
			this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
			if (this.manifest.trailingSlash === "always" && this.pathname !== "" && !this.pathname.endsWith("/")) this.pathname += "/";
			if (this.pathname !== original && this.routeData.pattern.test(original) && !this.routeData.pattern.test(this.pathname)) this.pathname = original;
		}
	}
	#resolveRouteData() {
		if (this.routeData) {
			this.#stripHtmlExtension();
			return;
		}
		const matched = matchRoute(this.manifest, this.pathname);
		if (matched && matched.prerender && this.manifest.serverLike) {
			if (matched.params.length > 0) {
				const allMatches = matchAllRoutes(this.manifest, this.pathname);
				this.routeData = allMatches.find((r) => !r.prerender);
			} else this.routeData = void 0;
		} else this.routeData = matched;
		this.logger.debug("router", "Astro matched the following route for " + this.request.url);
		this.logger.debug("router", "RouteData:\n" + this.routeData);
		if (!this.routeData) {
			const custom404 = getCustom404Route(getRouteTable(this.manifest));
			if (custom404 && !custom404.prerender) this.routeData = custom404;
		}
		if (!this.routeData) {
			this.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
			this.logger.debug("router", "Here's the available routes:\n", getRouteTable(this.manifest));
			return;
		}
		this.#stripHtmlExtension();
	}
	/**
	* Strips the manifest's base from a normalized request pathname and prepends
	* a forward slash.
	*
	* Mirrors `BaseApp.removeBase`: the router matches against this stripped path
	* while middleware reads the un-stripped `context.url.pathname`, so both must
	* strip the base identically.
	*/
	#computePathname(normalizedPathname) {
		return prependForwardSlash$1(stripRequestBase(normalizedPathname, this.manifest.base));
	}
	/**
	* Decodes and normalizes the public request pathname before deriving the
	* separate pathname used for route matching.
	*/
	#normalizePathname(pathname) {
		try {
			pathname = validateAndDecodePathname(pathname);
		} catch (e) {
			if (e instanceof MultiLevelEncodingError) this.invalidEncoding = true;
			else this.logger.error(null, e.toString());
		}
		return collapseDuplicateSlashes(pathname);
	}
	/**
	* Reads X-Forwarded-Proto, X-Forwarded-Host, and X-Forwarded-Port
	* from the request headers, validates them against the manifest's
	* `allowedDomains`, and updates `this.url` accordingly. Also resolves
	* `clientAddress` from X-Forwarded-For when the host is trusted.
	*
	* Only called when `allowedDomains` is configured — without it,
	* forwarded headers are never trusted.
	*/
	#applyForwardedHeaders() {
		const headers = this.request.headers;
		const allowedDomains = this.manifest.allowedDomains;
		const validated = validateForwardedHeaders(getFirstForwardedValue(headers.get("x-forwarded-proto") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-host") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-port") ?? void 0), allowedDomains);
		if (!validated.protocol && !validated.host && !validated.port) return;
		if (validated.protocol) this.url.protocol = validated.protocol + ":";
		if (validated.host) {
			const colonIdx = validated.host.indexOf(":");
			if (colonIdx !== -1) {
				this.url.hostname = validated.host.slice(0, colonIdx);
				this.url.port = validated.host.slice(colonIdx + 1);
			} else {
				this.url.hostname = validated.host;
				this.url.port = "";
			}
		}
		if (validated.port) this.url.port = validated.port;
		if (validated.host !== void 0 && !this.clientAddress) {
			const forwardedFor = getFirstForwardedValue(this.request.headers.get("x-forwarded-for") ?? void 0);
			if (forwardedFor) this.clientAddress = forwardedFor;
		}
		this.request = new Request(this.url, this.request);
	}
	/**
	* Returns the resolved `props` for this render, computing them lazily
	* from the route + component module on first access. If the
	* `initialProps` already carries user-supplied props (e.g. the
	* container API) those are used verbatim.
	*/
	async getProps() {
		if (this.props !== null) return this.props;
		if (Object.keys(this.initialProps).length > 0) {
			this.props = this.initialProps;
			return this.props;
		}
		const mod = await this.loadComponentInstance();
		this.props = await getProps({
			mod,
			routeData: this.routeData,
			routeCache: getRouteCache(this.manifest),
			pathname: this.pathname,
			logger: this.logger,
			serverLike: this.manifest.serverLike,
			base: this.manifest.base,
			trailingSlash: this.manifest.trailingSlash
		});
		return this.props;
	}
	/**
	* Returns the `ActionAPIContext` for this render, creating it lazily.
	* Used by middleware, actions, and page dispatch.
	*/
	getActionAPIContext() {
		if (this.actionApiContext !== null) return this.actionApiContext;
		const state = this;
		const ctx = {
			get cookies() {
				return state.cookies;
			},
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			generator: ASTRO_GENERATOR,
			get locals() {
				return state.locals;
			},
			set locals(_) {
				throw new AstroError(LocalsReassigned);
			},
			params: this.params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			request: this.request,
			site: getSite(this.manifest),
			url: this.url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return astroToRuntimeLogger(state.logger);
			}
		};
		this.defineProviderGetters(ctx);
		this.actionApiContext = ctx;
		return this.actionApiContext;
	}
	/**
	* Returns the `APIContext` for this render, creating it lazily from
	* the memoized props + action context.
	*
	* Callers must ensure `getProps()` has resolved at least once before
	* calling this.
	*/
	getAPIContext() {
		if (this.apiContext !== null) return this.apiContext;
		const actionApiContext = this.getActionAPIContext();
		const state = this;
		const redirect = (path, status = 302) => new Response(null, {
			status,
			headers: { Location: path }
		});
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		actionApiContext[fetchStateSymbol] = this;
		this.apiContext = Object.assign(actionApiContext, {
			props: this.props,
			redirect,
			rewrite,
			getActionResult: createGetActionResult(actionApiContext.locals),
			callAction: createCallAction(actionApiContext)
		});
		return this.apiContext;
	}
	/**
	* Invalidates the cached `APIContext` so the next `getAPIContext()`
	* call re-derives it from the (possibly mutated) state. Used
	* after an in-flight rewrite swaps the route / request / params.
	*/
	invalidateContexts() {
		this.props = null;
		this.actionApiContext = null;
		this.apiContext = null;
	}
	resetResponseMetadata() {
		this.responseRouteType = void 0;
		this.skipErrorReroute = false;
	}
};
//#endregion
//#region node_modules/@astrojs/internal-helpers/dist/object.js
var FORBIDDEN_PATH_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
//#endregion
//#region node_modules/astro/dist/actions/noop-actions.js
var NOOP_ACTIONS_MOD = { server: {} };
//#endregion
//#region node_modules/astro/dist/actions/load.js
var actionsMemo = createAsyncManifestMemo(async (manifest) => manifest.actions ? await manifest.actions() : NOOP_ACTIONS_MOD);
function getActions(manifest) {
	return actionsMemo.get(manifest);
}
async function getAction(manifest, path) {
	const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
	let { server } = await getActions(manifest);
	if (!server || !(typeof server === "object")) throw new TypeError(`Expected \`server\` export in actions file to be an object. Received ${typeof server}.`);
	for (const key of pathKeys) {
		if (typeof server === "function") throw new AstroError({
			...ActionNotFoundError,
			message: ActionNotFoundError.message(pathKeys.join("."))
		});
		if (FORBIDDEN_PATH_KEYS.has(key)) throw new AstroError({
			...ActionNotFoundError,
			message: ActionNotFoundError.message(pathKeys.join("."))
		});
		if (!Object.hasOwn(server, key)) throw new AstroError({
			...ActionNotFoundError,
			message: ActionNotFoundError.message(pathKeys.join("."))
		});
		server = server[key];
	}
	if (typeof server !== "function") throw new TypeError(`Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server}.`);
	return server;
}
//#endregion
//#region node_modules/astro/dist/actions/runtime/server.js
function getActionContext(context) {
	const callerInfo = getCallerInfo(context);
	const actionResultAlreadySet = Boolean(context.locals._actionPayload);
	let action = void 0;
	if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) action = {
		calledFrom: callerInfo.from,
		name: callerInfo.name,
		handler: async () => {
			const { manifest } = getFetchStateFromAPIContext(context);
			const callerInfoName = shouldAppendForwardSlash(manifest.trailingSlash, manifest.buildFormat) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
			let baseAction;
			try {
				baseAction = await getAction(manifest, callerInfoName);
			} catch (error) {
				if (error instanceof Error && "name" in error && typeof error.name === "string" && error.name === ActionNotFoundError.name) return {
					data: void 0,
					error: new ActionError({ code: "NOT_FOUND" })
				};
				throw error;
			}
			const bodySizeLimit = manifest.actionBodySizeLimit;
			let input;
			try {
				input = await parseRequestBody(context.request, bodySizeLimit);
			} catch (e) {
				if (e instanceof ActionError) return {
					data: void 0,
					error: e
				};
				if (e instanceof TypeError) return {
					data: void 0,
					error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" })
				};
				throw e;
			}
			const omitKeys = [
				"props",
				"getActionResult",
				"callAction",
				"redirect"
			];
			const actionAPIContext = Object.create(Object.getPrototypeOf(context), Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(context)).filter(([key]) => !omitKeys.includes(key))));
			Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
			return baseAction.bind(actionAPIContext)(input);
		}
	};
	function setActionResult(actionName, actionResult) {
		context.locals._actionPayload = {
			actionResult,
			actionName
		};
	}
	return {
		action,
		setActionResult,
		serializeActionResult,
		deserializeActionResult
	};
}
function getCallerInfo(ctx) {
	if (ctx.routePattern === "/_actions/[...path]") return {
		from: "rpc",
		name: ctx.url.pathname.replace(/^.*\/_actions\//, "")
	};
	const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
	if (queryParam) return {
		from: "form",
		name: queryParam
	};
}
async function parseRequestBody(request, bodySizeLimit) {
	const contentType = request.headers.get("content-type");
	const contentLengthHeader = request.headers.get("content-length");
	const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
	const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
	if (!contentType) return void 0;
	if (hasContentLength && contentLength > bodySizeLimit) throw new ActionError({
		code: "CONTENT_TOO_LARGE",
		message: `Request body exceeds ${bodySizeLimit} bytes`
	});
	try {
		if (hasContentType(contentType, formContentTypes)) {
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				return await new Request(request.url, {
					method: request.method,
					headers: request.headers,
					body: toArrayBuffer(body)
				}).formData();
			}
			return await request.clone().formData();
		}
		if (hasContentType(contentType, ["application/json"])) {
			if (contentLength === 0) return void 0;
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				if (body.byteLength === 0) return void 0;
				return JSON.parse(new TextDecoder().decode(body));
			}
			return await request.clone().json();
		}
	} catch (e) {
		if (e instanceof BodySizeLimitError) throw new ActionError({
			code: "CONTENT_TOO_LARGE",
			message: `Request body exceeds ${bodySizeLimit} bytes`
		});
		throw e;
	}
	throw new TypeError("Unsupported content type");
}
var ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
var formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
	const type = contentType.split(";")[0].toLowerCase();
	return expected.some((t) => type === t);
}
function serializeActionResult(res) {
	if (res.error) {
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"PUBLIC_DEMO_MODE": "true",
			"SITE": "https://tracht-digital.de",
			"SSR": true
		}, { _: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm" })?.DEV) actionResultErrorStack.set(res.error.stack);
		let body2;
		if (res.error instanceof ActionInputError) body2 = {
			type: res.error.type,
			issues: res.error.issues,
			fields: res.error.fields
		};
		else body2 = {
			...res.error,
			message: res.error.message
		};
		return {
			type: "error",
			status: res.error.status,
			contentType: "application/json",
			body: JSON.stringify(body2)
		};
	}
	if (res.data === void 0) return {
		type: "empty",
		status: 204
	};
	let body;
	try {
		body = stringify(res.data, { URL: (value) => value instanceof URL && value.href });
	} catch (e) {
		let hint = ActionsReturnedInvalidDataError.hint;
		if (res.data instanceof Response) hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
		throw new AstroError({
			...ActionsReturnedInvalidDataError,
			message: ActionsReturnedInvalidDataError.message(String(e)),
			hint
		});
	}
	return {
		type: "data",
		status: 200,
		contentType: "application/json+devalue",
		body
	};
}
function toArrayBuffer(buffer) {
	const copy = new Uint8Array(buffer.byteLength);
	copy.set(buffer);
	return copy.buffer;
}
//#endregion
//#region node_modules/astro/dist/actions/handler.js
function handleAction(apiContext, state) {
	markFeatureUsed(state.manifest, FetchFeatures.actions);
	if (apiContext.isPrerendered) return;
	const { action, setActionResult } = getActionContext(apiContext);
	if (!action) return;
	if (state.manifest.checkOrigin && isForbiddenCrossOriginRequest(apiContext.request, apiContext.url, apiContext.isPrerendered)) return Promise.resolve(createCrossOriginForbiddenResponse(apiContext.request));
	return executeAction(action, setActionResult);
}
async function executeAction(action, setActionResult) {
	const serialized = serializeActionResult(await action.handler());
	if (action.calledFrom === "rpc") {
		if (serialized.type === "empty") return new Response(null, { status: serialized.status });
		return new Response(serialized.body, {
			status: serialized.status,
			headers: { "Content-Type": serialized.contentType }
		});
	}
	setActionResult(action.name, serialized);
}
//#endregion
//#region node_modules/astro/dist/core/routing/3xx.js
function redirectTemplate({ status, absoluteLocation, relativeLocation, from }) {
	const delay = status === 302 ? 2 : 0;
	const rel = escape(String(relativeLocation));
	return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${escape(String(absoluteLocation))}">
<body>
	<a href="${rel}">Redirecting ${from ? `from <code>${escape(from)}</code> ` : ""}to <code>${rel}</code></a>
</body>`;
}
//#endregion
//#region node_modules/astro/dist/core/routing/trailing-slash-handler.js
function handleTrailingSlash(state) {
	const url = new URL(state.request.url);
	const redirect = redirectTrailingSlash(state.manifest.trailingSlash, url.pathname);
	if (redirect === url.pathname) return;
	const addCookieHeader = state.renderOptions.addCookieHeader;
	const status = state.request.method === "GET" ? 301 : 308;
	const response = new Response(redirectTemplate({
		status,
		relativeLocation: url.pathname,
		absoluteLocation: redirect,
		from: state.request.url
	}), {
		status,
		headers: { location: redirect + url.search }
	});
	prepareResponse(response, { addCookieHeader });
	return response;
}
function redirectTrailingSlash(trailingSlash, pathname) {
	if (pathname === "/" || isInternalPath(pathname)) return pathname;
	const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
	if (path !== pathname) return path;
	if (trailingSlash === "ignore") return pathname;
	if (trailingSlash === "always" && !hasFileExtension(pathname)) return appendForwardSlash(pathname);
	if (trailingSlash === "never") return removeTrailingForwardSlash(pathname);
	return pathname;
}
//#endregion
//#region node_modules/astro/dist/core/cache/provider.js
var cacheProviderMemo = createAsyncManifestMemo(async (manifest) => {
	if (manifest.cacheProvider) {
		const factory = (await manifest.cacheProvider())?.default || null;
		return factory ? factory(manifest.cacheConfig?.options) : null;
	}
	return null;
});
function getCacheProvider(manifest) {
	return cacheProviderMemo.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/cache/runtime/utils.js
function defaultSetHeaders(options) {
	const headers = new Headers();
	const directives = [];
	if (options.maxAge !== void 0) directives.push(`max-age=${options.maxAge}`);
	if (options.swr !== void 0) directives.push(`stale-while-revalidate=${options.swr}`);
	if (directives.length > 0) headers.set("CDN-Cache-Control", directives.join(", "));
	if (options.tags && options.tags.length > 0) headers.set("Cache-Tag", options.tags.join(", "));
	if (options.lastModified) headers.set("Last-Modified", options.lastModified.toUTCString());
	if (options.etag) headers.set("ETag", options.etag);
	return headers;
}
function isLiveDataEntry(value) {
	return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
//#endregion
//#region node_modules/astro/dist/core/cache/runtime/cache.js
var APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
var IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
var AstroCache = class {
	#options = {};
	#tags = /* @__PURE__ */ new Set();
	#disabled = false;
	#provider;
	enabled = true;
	constructor(provider) {
		this.#provider = provider;
	}
	set(input) {
		if (input === false) {
			this.#disabled = true;
			this.#tags.clear();
			this.#options = {};
			return;
		}
		this.#disabled = false;
		let options;
		if (isLiveDataEntry(input)) {
			if (!input.cacheHint) return;
			options = input.cacheHint;
		} else options = input;
		if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
		if ("swr" in options && options.swr !== void 0) this.#options.swr = options.swr;
		if ("etag" in options && options.etag !== void 0) this.#options.etag = options.etag;
		if (options.lastModified !== void 0) {
			if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) this.#options.lastModified = options.lastModified;
		}
		if (options.tags) for (const tag of options.tags) this.#tags.add(tag);
	}
	get tags() {
		return [...this.#tags];
	}
	/**
	* Get the current cache options (read-only snapshot).
	* Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
	*/
	get options() {
		return {
			...this.#options,
			tags: this.tags
		};
	}
	async invalidate(input) {
		if (!this.#provider) throw new AstroError(CacheNotEnabled);
		let options;
		if (isLiveDataEntry(input)) options = { tags: input.cacheHint?.tags ?? [] };
		else options = input;
		return this.#provider.invalidate(options);
	}
	/** @internal */
	[APPLY_HEADERS](response, request) {
		if (this.#disabled) return;
		const finalOptions = {
			...this.#options,
			tags: this.tags
		};
		if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
		const headers = this.#provider?.setHeaders?.(finalOptions, request) ?? defaultSetHeaders(finalOptions);
		for (const [key, value] of headers) response.headers.set(key, value);
		if (!response.headers.has("Cache-Control") && !response.headers.has("Expires") && (response.headers.has("Last-Modified") || response.headers.has("ETag"))) response.headers.set("Cache-Control", "no-cache");
	}
	/** @internal */
	get [IS_ACTIVE]() {
		return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
	}
};
function applyCacheHeaders(cache, response, request) {
	if (APPLY_HEADERS in cache) cache[APPLY_HEADERS](response, request);
}
//#endregion
//#region node_modules/astro/dist/core/routing/parts.js
var ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
var ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
	const result = [];
	part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
		if (!str) return;
		const dynamic = i % 2 === 1;
		const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
		if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
		result.push({
			content,
			dynamic,
			spread: dynamic && ROUTE_SPREAD.test(content)
		});
	});
	return result;
}
//#endregion
//#region node_modules/astro/dist/core/cache/runtime/route-matching.js
function compileCacheRoutes(routes, base, trailingSlash) {
	const compiled = Object.entries(routes).map(([path, options]) => {
		const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s) => getParts(s, path));
		return {
			pattern: getPattern(segments, base, trailingSlash),
			options,
			segments,
			route: path
		};
	});
	compiled.sort((a, b) => routeComparator({
		segments: a.segments,
		route: a.route,
		type: "page"
	}, {
		segments: b.segments,
		route: b.route,
		type: "page"
	}));
	return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
	for (const route of compiledRoutes) if (route.pattern.test(pathname)) return route.options;
	return null;
}
//#endregion
//#region node_modules/astro/dist/core/cache/handler.js
var CACHE_KEY = "cache";
function provideCache(state) {
	const manifest = state.manifest;
	if (!manifest.cacheConfig) {
		state.provide(CACHE_KEY, { create: () => new DisabledAstroCache(state.logger) });
		return;
	}
	if (getEnvironment(manifest).runtimeMode === "development") {
		state.provide(CACHE_KEY, { create: () => new NoopAstroCache() });
		return;
	}
	return provideCacheAsync(state, manifest);
}
async function provideCacheAsync(state, manifest) {
	const cacheProvider = await getCacheProvider(manifest);
	state.provide(CACHE_KEY, { create() {
		const cache = new AstroCache(cacheProvider);
		if (manifest.cacheConfig?.routes) {
			const matched = matchCacheRoute(state.pathname, getCompiledCacheRoutes(manifest));
			if (matched) cache.set(matched);
		}
		return cache;
	} });
}
async function handleCache(state, next) {
	markFeatureUsed(state.manifest, FetchFeatures.cache);
	if (!state.manifest.cacheProvider) return next();
	const cache = state.resolve(CACHE_KEY);
	const cacheProvider = await getCacheProvider(state.manifest);
	if (cacheProvider?.onRequest) {
		const response2 = await cacheProvider.onRequest({
			request: state.request,
			url: new URL(state.request.url),
			waitUntil: state.renderOptions.waitUntil,
			logger: {
				info(msg) {
					state.logger.info("cache", msg);
				},
				warn(msg) {
					state.logger.warn("cache", msg);
				},
				error(msg) {
					state.logger.error("cache", msg);
				}
			}
		}, async () => {
			const res = await next();
			applyCacheHeaders(cache, res, state.request);
			return res;
		});
		response2.headers.delete("CDN-Cache-Control");
		response2.headers.delete("Cache-Tag");
		return response2;
	}
	const response = await next();
	applyCacheHeaders(cache, response, state.request);
	return response;
}
var compiledCacheRoutesMemo = createManifestMemo((manifest) => manifest.cacheConfig?.routes ? compileCacheRoutes(manifest.cacheConfig.routes, manifest.base, manifest.trailingSlash) : []);
function getCompiledCacheRoutes(manifest) {
	return compiledCacheRoutesMemo.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/redirects/render.js
function isExternalURL(url) {
	return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
	if (typeof redirect === "string") return isExternalURL(redirect);
	else return isExternalURL(redirect.destination);
}
function computeRedirectStatus(method, redirect, redirectRoute) {
	return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
	if (typeof redirectRoute !== "undefined") return getRouteGenerator(redirectRoute.segments, trailingSlash)(params) || redirectRoute?.pathname || "/";
	else if (typeof redirect === "string") {
		if (redirectIsExternal(redirect)) return redirect;
		else {
			let target = redirect;
			for (const param of Object.keys(params)) {
				const paramValue = params[param];
				target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
			}
			return target;
		}
	} else if (typeof redirect === "undefined") return "/";
	return redirect.destination;
}
async function renderRedirect(state) {
	markFeatureUsed(state.manifest, FetchFeatures.redirects);
	const { redirect, redirectRoute } = state.routeData;
	const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
	const headers = { location: encodeURI(resolveRedirectTarget(state.params, redirect, redirectRoute, state.manifest.trailingSlash)) };
	if (redirect && redirectIsExternal(redirect)) {
		if (typeof redirect === "string") return Response.redirect(redirect, status);
		else return Response.redirect(redirect.destination, status);
	}
	return new Response(null, {
		status,
		headers
	});
}
//#endregion
//#region node_modules/astro/dist/core/routing/handler.js
function logRequestFromState(state, payload) {
	if (state.logRequest) state.logRequest(payload);
	else getEnvironment(state.manifest).logRequest(state.manifest, payload);
}
function actionsAndPages(state, ctx) {
	if (!state.skipMiddleware) {
		const actionResult = handleAction(ctx, state);
		if (actionResult) return actionResult.then((response) => response ?? handlePages(state, ctx));
	}
	return handlePages(state, ctx);
}
async function handleRequest(state) {
	await getResolvedLogger(state.manifest);
	markFeatureUsed(state.manifest, ALL_FETCH_FEATURES);
	if (state.invalidEncoding) return new Response(null, {
		status: 400,
		statusText: "Bad Request"
	});
	const trailingSlashRedirect = handleTrailingSlash(state);
	if (trailingSlashRedirect) return trailingSlashRedirect;
	if (!state.routeData) return renderErrorFromState(state, state.request, {
		...state.renderOptions,
		status: 404,
		pathname: state.pathname
	});
	return render(state);
}
async function render(state) {
	const routeData = state.routeData;
	const pathname = state.pathname;
	const request = state.request;
	const { addCookieHeader } = state.renderOptions;
	state.status = getDefaultStatusCode(state.manifest, routeData, pathname);
	let response;
	let finalizeError;
	try {
		const sessionP = state.manifest.sessionConfig ? provideSession(state) : void 0;
		const cacheP = provideCache(state);
		if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
		markFeatureUsed(state.manifest, FetchFeatures.sessions);
		if (routeData.type === "redirect") {
			const redirectResponse = await renderRedirect(state);
			logRequestFromState(state, {
				pathname,
				method: request.method,
				statusCode: redirectResponse.status,
				isRewrite: false,
				timeStart: state.timeStart
			});
			prepareResponse(redirectResponse, { addCookieHeader });
			state.logger.flush();
			return redirectResponse;
		}
		const i18n = getI18n(state.manifest);
		if (!state.manifest.cacheProvider) {
			markFeatureUsed(state.manifest, FetchFeatures.cache);
			response = await handleMiddleware(state, actionsAndPages);
			if (i18n) response = await finalizeI18n(i18n, state, response);
		} else {
			const runPipeline = async () => {
				let res = await handleMiddleware(state, actionsAndPages);
				if (i18n) res = await finalizeI18n(i18n, state, res);
				return res;
			};
			response = await handleCache(state, runPipeline);
		}
		logRequestFromState(state, {
			pathname,
			method: request.method,
			statusCode: response.status,
			isRewrite: state.isRewriting,
			timeStart: state.timeStart
		});
	} catch (err) {
		state.logger.error(null, err.stack || err.message || String(err));
		return renderErrorFromState(state, request, {
			...state.renderOptions,
			status: 500,
			error: err,
			pathname: state.pathname
		});
	} finally {
		try {
			const finalize = state.finalizeAll();
			if (finalize) await finalize;
		} catch (err) {
			finalizeError = err;
			state.logger.error(null, err.stack || err.message || String(err));
		}
	}
	if (finalizeError) return renderErrorFromState(state, request, {
		...state.renderOptions,
		status: 500,
		error: finalizeError,
		pathname: state.pathname
	});
	if (REROUTABLE_STATUS_CODES.includes(response.status) && response.body === null && !state.skipErrorReroute) return renderErrorFromState(state, request, {
		...state.renderOptions,
		response,
		status: response.status,
		error: response.status === 500 ? null : void 0,
		pathname: state.pathname
	});
	prepareResponse(response, { addCookieHeader });
	state.logger.flush();
	return response;
}
//#endregion
//#region node_modules/astro/dist/core/fetch/default-handler.js
var DefaultFetchHandler = class {
	#manifest;
	/**
	* `BaseApp` passes itself so states resolve that app's manifest ahead of
	* the ambient one; generated builds construct the handler with no
	* arguments and use the ambient manifest.
	*/
	constructor(app) {
		this.#manifest = app?.manifest;
	}
	fetch = (request) => {
		const options = getRenderOptions(request);
		return handleRequest(new FetchState(this.#manifest ?? getAmbientManifest(), request, options));
	};
};
//#endregion
//#region \0virtual:astro:fetchable
var _virtual_astro_fetchable_default = new DefaultFetchHandler();
//#endregion
//#region node_modules/astro/dist/core/routing/match-request.js
function safeDecodePathname(manifest, pathname) {
	try {
		return validateAndDecodePathname(pathname);
	} catch (e) {
		new AstroIntegrationLogger(getLogger(manifest).options, manifest.adapterName).debug(e.toString());
		try {
			return decodeURI(pathname);
		} catch {
			return pathname;
		}
	}
}
function matchRequest(manifest, request, allowPrerenderedRoutes = false) {
	const url = new URL(request.url);
	if (manifest.assets.has(url.pathname)) return void 0;
	let pathname = computePathnameFromDomain(request, url, manifest.i18n, manifest.base, manifest.trailingSlash, getLogger(manifest));
	if (!pathname) pathname = prependForwardSlash$1(stripRequestBase(url.pathname, manifest.base));
	pathname = safeDecodePathname(manifest, pathname);
	const routeData = matchRoute(manifest, pathname);
	if (!routeData) return void 0;
	if (allowPrerenderedRoutes) return routeData;
	if (routeData.prerender) {
		if (routeData.params.length > 0) return matchAllRoutes(manifest, pathname).find((r) => !r.prerender);
		return;
	}
	return routeData;
}
//#endregion
//#region node_modules/astro/dist/core/app/base.js
var BaseApp = class BaseApp {
	manifest;
	#adapterLogger;
	baseWithoutTrailingSlash;
	/**
	* The streaming flag passed to the constructor, surfaced through the
	* protected `resolveStreaming()` hook and fed into the internal
	* `FetchState` facade hooks on the fast path.
	*/
	#streaming;
	/**
	* The handler that turns incoming `Request` objects into `Response`s.
	* Defaults to a `DefaultFetchHandler` pinned to this app and can be
	* overridden via `setFetchHandler` — typically by the bundled
	* entrypoint after importing `virtual:astro:fetchable`.
	*/
	#fetchHandler;
	#errorHandler;
	/**
	* Whether a custom fetch handler (from `src/fetch.ts`) has been set
	* via `setFetchHandler`. When false, the `DefaultFetchHandler` is
	* in use and all features are implicitly active.
	*/
	#hasCustomFetchHandler = false;
	/**
	* Whether the missing-feature check has already run. We only want
	* to warn once — after the first request in dev, or at build end.
	*/
	#featureCheckDone = false;
	get logger() {
		return getLogger(this.manifest);
	}
	/**
	* Route data derived from the manifest, used for route matching. Reads and
	* writes go through the single per-manifest route table, so HMR updates are
	* visible to every consumer at once.
	*/
	get manifestData() {
		return getRouteTable(this.manifest);
	}
	set manifestData(routesList) {
		updateRouteTable(this.manifest, routesList.routes);
	}
	get adapterLogger() {
		const currentOptions = this.logger.options;
		if (!this.#adapterLogger || this.#adapterLogger.options !== currentOptions) this.#adapterLogger = new AstroIntegrationLogger(currentOptions, this.manifest.adapterName);
		return this.#adapterLogger;
	}
	constructor(manifest, streaming = true) {
		this.manifest = manifest;
		this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest.base);
		this.#streaming = streaming;
		getRouteTable(manifest);
		getLogger(manifest);
		this.#fetchHandler = new DefaultFetchHandler(this);
		this.#errorHandler = this.createErrorHandler();
	}
	/**
	* Resolves the user-configured logger destination from the manifest and
	* returns the logger. Lazy and only resolves once; safe to call before
	* the first render (adapters use this to log startup messages through
	* the configured destination).
	*/
	getLogger() {
		return getResolvedLogger(this.manifest);
	}
	/**
	* The streaming flag fed into the internal `FetchState` facade hooks on
	* the fast path. Returns the constructor flag by
	* default; `BuildApp` overrides this to return `undefined` so streaming
	* falls through to the environment default (`manifest.serverLike`).
	*/
	resolveStreaming() {
		return this.#streaming;
	}
	/**
	* Override the fetch handler used to dispatch requests. Entrypoints
	* call this with the default export of `virtual:astro:fetchable` to
	* plug in a user-authored handler from `src/fetch.ts`.
	*/
	setFetchHandler(handler) {
		this.#fetchHandler = handler;
		this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
	}
	/**
	* Returns the error handler used by this app. The default is a thin
	* bridge over the functional error API — strategy selection (production
	* default / dev / build) is environment-driven inside `renderErrorPage`.
	* External subclasses can override this to customize error rendering.
	*/
	createErrorHandler() {
		return { renderError: (request, options) => renderErrorPage(this.manifest, request, options) };
	}
	/**
	* Resets the cached adapter logger so it picks up a new logger instance.
	* Used by BuildApp when the logger is replaced via setOptions().
	*/
	resetAdapterLogger() {
		this.#adapterLogger = void 0;
	}
	getAllowedDomains() {
		return this.manifest.allowedDomains;
	}
	matchesAllowedDomains(forwardedHost, protocol) {
		return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
	}
	static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
		if (!allowedDomains || allowedDomains.length === 0) return false;
		try {
			const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
			return allowedDomains.some((pattern) => {
				return matchPattern(testUrl, pattern);
			});
		} catch {
			return false;
		}
	}
	set setManifestData(newManifestData) {
		updateRouteTable(this.manifest, newManifestData.routes);
	}
	removeBase(pathname) {
		return stripRequestBase(pathname, this.manifest.base);
	}
	/**
	* Fully decodes a pathname, falling back to a single decode and then the raw pathname
	* when validation fails. Adapter matching runs before `render()`, so it must not throw
	* for request input that render-time validation handles.
	*/
	safeDecodePathname(pathname) {
		try {
			return validateAndDecodePathname(pathname);
		} catch (e) {
			this.adapterLogger.debug(e.toString());
			try {
				return decodeURI(pathname);
			} catch {
				return pathname;
			}
		}
	}
	/**
	* Extracts the base-stripped, decoded pathname from a request.
	* Used by adapters to compute the pathname for dev-mode route matching.
	*/
	getPathnameFromRequest(request) {
		const url = new URL(request.url);
		const pathname = prependForwardSlash$1(this.removeBase(url.pathname));
		return this.safeDecodePathname(pathname);
	}
	/**
	* Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
	* routes aren't returned, even if they are matched.
	*
	* When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
	* @param request
	* @param allowPrerenderedRoutes
	*/
	match(request, allowPrerenderedRoutes = false) {
		return matchRequest(this.manifest, request, allowPrerenderedRoutes);
	}
	/**
	* A matching route function to use in the development server.
	* Contrary to the `.match` function, this function resolves props and params, returning the correct
	* route based on the priority, segments. It also returns the correct, resolved pathname.
	* @param pathname
	*/
	devMatch(pathname) {}
	computePathnameFromDomain(request) {
		return computePathnameFromDomain(request, new URL(request.url), this.manifest.i18n, this.manifest.base, this.manifest.trailingSlash, this.logger);
	}
	async render(request, { addCookieHeader = false, clientAddress = Reflect.get(request, clientAddressSymbol), locals, prerenderedErrorPageFetch = fetch, routeData, waitUntil } = {}) {
		await getResolvedLogger(this.manifest);
		if (routeData) {
			this.logger.debug("router", "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ", request.url);
			this.logger.debug("router", "RouteData");
			this.logger.debug("router", routeData);
		}
		if (locals) {
			if (typeof locals !== "object") {
				const error = new AstroError(LocalsNotAnObject);
				this.logger.error(null, error.stack);
				return this.renderError(request, {
					addCookieHeader,
					clientAddress,
					prerenderedErrorPageFetch,
					locals: void 0,
					routeData,
					waitUntil,
					status: 500,
					error
				});
			}
		}
		if (!routeData) {
			const domainPathname = this.computePathnameFromDomain(request);
			if (domainPathname) routeData = matchRoute(this.manifest, this.safeDecodePathname(domainPathname));
		}
		const resolvedOptions = {
			addCookieHeader,
			clientAddress,
			prerenderedErrorPageFetch,
			locals,
			routeData,
			waitUntil
		};
		let response;
		if (this.#fetchHandler instanceof DefaultFetchHandler) response = await handleRequest(new FetchState(this.manifest, request, resolvedOptions, {
			streaming: this.resolveStreaming(),
			renderError: (req, opts) => this.renderError(req, opts),
			logRequest: (payload) => this.logThisRequest(payload)
		}));
		else {
			setRenderOptions(request, resolvedOptions);
			response = await this.#fetchHandler.fetch(request);
		}
		this.#warnMissingFeatures();
		if (response.headers.get("X-Astro-Error")) {
			response.headers.delete(ASTRO_ERROR_HEADER);
			return this.renderError(request, {
				addCookieHeader,
				clientAddress,
				prerenderedErrorPageFetch,
				locals,
				routeData,
				waitUntil,
				response,
				status: response.status,
				error: response.status === 500 ? null : void 0
			});
		}
		return response;
	}
	setCookieHeaders(response) {
		return getSetCookiesFromResponse(response);
	}
	/**
	* Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
	* For example,
	* ```ts
	* for (const cookie_ of App.getSetCookieFromResponse(response)) {
	*     const cookie: string = cookie_
	* }
	* ```
	* @param response The response to read cookies from.
	* @returns An iterator that yields key-value pairs as equal-sign-separated strings.
	*/
	static getSetCookieFromResponse = getSetCookiesFromResponse;
	/**
	* If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
	* This also handles pre-rendered /404 or /500 routes.
	*
	* Delegates to the app's configured `ErrorHandler`. To customize behavior
	* for a specific environment, override `createErrorHandler()` rather than
	* this method.
	*/
	async renderError(request, options) {
		return this.#errorHandler.renderError(request, options);
	}
	/**
	* One-shot check: after the first request with a custom `src/fetch.ts`,
	* compare `usedFeatures` against the manifest and warn about any
	* configured features the user's pipeline doesn't call.
	*/
	#warnMissingFeatures() {
		if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
		this.#featureCheckDone = true;
		const manifest = this.manifest;
		const missing = [];
		const used = getUsedFeatures(this.manifest);
		if (manifest.routes.some((r) => r.routeData.type === "redirect") && !(used & FetchFeatures.redirects)) missing.push("redirects");
		if (manifest.sessionConfig && !(used & FetchFeatures.sessions)) missing.push("sessions");
		if (manifest.actions && !(used & FetchFeatures.actions)) missing.push("actions");
		if (manifest.middleware && !(used & FetchFeatures.middleware)) missing.push("middleware");
		if (manifest.i18n && manifest.i18n.strategy !== "manual" && !(used & FetchFeatures.i18n)) missing.push("i18n");
		if (manifest.cacheConfig && !(used & FetchFeatures.cache)) missing.push("cache");
		for (const feature of missing) this.logger.warn("router", `Your project uses ${feature}, but your custom src/fetch.ts does not call the ${feature}() handler. This feature will not work unless your fetch handler calls it.`);
	}
	getDefaultStatusCode(routeData, pathname) {
		return getDefaultStatusCode(this.manifest, routeData, pathname);
	}
	getManifest() {
		return this.manifest;
	}
	logThisRequest({ pathname, method, statusCode, isRewrite, timeStart }) {
		const timeEnd = performance.now();
		this.logRequest({
			pathname,
			method,
			statusCode,
			isRewrite,
			reqTime: timeEnd - timeStart
		});
	}
};
//#endregion
//#region node_modules/astro/dist/core/app/app.js
var App = class extends BaseApp {
	isDev() {
		return false;
	}
	logRequest(_options) {}
};
//#endregion
//#region node_modules/astro/dist/core/app/entrypoints/virtual/prod.js
var createApp$1 = ({ streaming } = {}) => {
	const app = new App(manifest, streaming);
	app.setFetchHandler(_virtual_astro_fetchable_default);
	return app;
};
//#endregion
//#region node_modules/astro/dist/core/app/entrypoints/virtual/index.js
var createApp = createApp$1;
//#endregion
//#region \0virtual:astro-node:config
var _virtual_astro_node_config_exports = /* @__PURE__ */ __exportAll({
	bodySizeLimit: () => bodySizeLimit,
	client: () => client,
	experimentalDisableStreaming: () => true,
	host: () => false,
	mode: () => mode,
	port: () => port,
	server: () => server,
	staticHeaders: () => false
});
var mode = "standalone";
var client = "file:///home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/dist/client/";
var server = "file:///home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/dist/server/";
var port = 4321;
var bodySizeLimit = 1073741824;
//#endregion
//#region node_modules/astro/dist/core/app/createOutgoingHttpHeaders.js
var createOutgoingHttpHeaders = (headers) => {
	if (!headers) return;
	const nodeHeaders = Object.fromEntries(headers.entries());
	if (Object.keys(nodeHeaders).length === 0) return;
	if (headers.has("set-cookie")) {
		const cookieHeaders = headers.getSetCookie();
		if (cookieHeaders.length > 1) nodeHeaders["set-cookie"] = cookieHeaders;
	}
	return nodeHeaders;
};
//#endregion
//#region node_modules/astro/dist/core/app/node.js
function createRequestFromNodeRequest(req, { skipBody = false, allowedDomains = [], bodySizeLimit, port: serverPort } = {}) {
	const controller = new AbortController();
	const protocol = "encrypted" in req.socket && req.socket.encrypted ? "https" : "http";
	const url = buildRequestUrl(protocol, typeof req.headers.host === "string" ? req.headers.host : typeof req.headers[":authority"] === "string" ? req.headers[":authority"] : serverPort ? `localhost:${serverPort}` : "localhost", req.url, serverPort);
	const options = {
		method: req.method || "GET",
		headers: makeRequestHeaders(req),
		signal: controller.signal
	};
	if (options.method !== "HEAD" && options.method !== "GET" && skipBody === false) Object.assign(options, makeRequestBody(req, bodySizeLimit));
	const request = new Request(url, options);
	wireAbortController(req, controller);
	const untrustedHostname = req.headers.host ?? req.headers[":authority"];
	const validatedHostname = validateHost(typeof untrustedHostname === "string" ? untrustedHostname : void 0, protocol, allowedDomains);
	const validatedForwardedHost = validateForwardedHeaders(void 0, getFirstForwardedValue(req.headers["x-forwarded-host"]), void 0, allowedDomains).host;
	const clientIp = (validatedHostname !== void 0 || validatedForwardedHost !== void 0 ? getFirstForwardedValue(req.headers["x-forwarded-for"]) : void 0) || req.socket?.remoteAddress;
	if (clientIp) Reflect.set(request, clientAddressSymbol, clientIp);
	return request;
}
function wireAbortController(req, controller) {
	const socket = getRequestSocket(req);
	if (socket && typeof socket.on === "function") {
		const existingCleanup = getAbortControllerCleanup(req);
		if (existingCleanup) existingCleanup();
		let cleanedUp = false;
		const removeSocketListener = () => {
			if (typeof socket.off === "function") socket.off("close", onSocketClose);
			else if (typeof socket.removeListener === "function") socket.removeListener("close", onSocketClose);
		};
		const cleanup = () => {
			if (cleanedUp) return;
			cleanedUp = true;
			removeSocketListener();
			controller.signal.removeEventListener("abort", cleanup);
			Reflect.deleteProperty(req, nodeRequestAbortControllerCleanupSymbol);
		};
		const onSocketClose = () => {
			cleanup();
			if (!controller.signal.aborted) controller.abort();
		};
		socket.on("close", onSocketClose);
		controller.signal.addEventListener("abort", cleanup, { once: true });
		Reflect.set(req, nodeRequestAbortControllerCleanupSymbol, cleanup);
		if (socket.destroyed) onSocketClose();
	}
}
async function writeResponse(source, destination) {
	const { status, headers, body, statusText } = source;
	if (!(destination instanceof Http2ServerResponse)) destination.statusMessage = statusText;
	destination.writeHead(status, createOutgoingHttpHeaders(headers));
	const cleanupAbortFromDestination = getAbortControllerCleanup(destination.req ?? void 0);
	if (cleanupAbortFromDestination) {
		const runCleanup = () => {
			cleanupAbortFromDestination();
			if (typeof destination.off === "function") {
				destination.off("finish", runCleanup);
				destination.off("close", runCleanup);
			} else {
				destination.removeListener?.("finish", runCleanup);
				destination.removeListener?.("close", runCleanup);
			}
		};
		destination.on("finish", runCleanup);
		destination.on("close", runCleanup);
	}
	if (!body) return destination.end();
	try {
		const reader = body.getReader();
		destination.on("close", () => {
			reader.cancel().catch((err) => {
				console.error("There was an uncaught error in the middle of the stream while rendering %s.", destination.req.url, err);
			});
		});
		let result = await reader.read();
		while (!result.done) {
			destination.write(result.value);
			result = await reader.read();
		}
		destination.end();
	} catch (err) {
		destination.write("Internal server error", () => {
			err instanceof Error ? destination.destroy(err) : destination.destroy();
		});
	}
}
function buildRequestUrl(protocol, hostnamePort, requestPath, serverPort) {
	const path = requestPath ?? "";
	if (URL.canParse(`${protocol}://${hostnamePort}${path}`)) return new URL(`${protocol}://${hostnamePort}${path}`);
	if (URL.canParse(`${protocol}://${hostnamePort}`)) return new URL(`${protocol}://${hostnamePort}`);
	const fallbackHost = serverPort ? `localhost:${serverPort}` : "localhost";
	return new URL(`${protocol}://${fallbackHost}`);
}
function makeRequestHeaders(req) {
	const headers = new Headers();
	for (const [name, value] of Object.entries(req.headers)) {
		if (value === void 0) continue;
		if (Array.isArray(value)) for (const item of value) headers.append(name, item);
		else headers.append(name, value);
	}
	return headers;
}
function makeRequestBody(req, bodySizeLimit) {
	if (req.body !== void 0) {
		if (typeof req.body === "string" && req.body.length > 0) return { body: Buffer.from(req.body) };
		if (req.body instanceof ArrayBuffer || ArrayBuffer.isView(req.body)) return { body: req.body };
		if (typeof req.body === "object" && req.body !== null && Object.keys(req.body).length > 0) return { body: Buffer.from(JSON.stringify(req.body)) };
		if (typeof req.body === "object" && req.body !== null && typeof req.body[Symbol.asyncIterator] !== "undefined") return asyncIterableToBodyProps(req.body, bodySizeLimit);
	}
	return asyncIterableToBodyProps(req, bodySizeLimit);
}
function asyncIterableToBodyProps(iterable, bodySizeLimit) {
	return {
		body: bodySizeLimit != null ? limitAsyncIterable(iterable, bodySizeLimit) : iterable,
		duplex: "half"
	};
}
async function* limitAsyncIterable(iterable, limit) {
	let received = 0;
	for await (const chunk of iterable) {
		const byteLength = chunk instanceof Uint8Array ? chunk.byteLength : typeof chunk === "string" ? Buffer.byteLength(chunk) : 0;
		received += byteLength;
		if (received > limit) throw new Error(`Body size limit exceeded: received more than ${limit} bytes`);
		yield chunk;
	}
}
function getAbortControllerCleanup(req) {
	if (!req) return void 0;
	const cleanup = Reflect.get(req, nodeRequestAbortControllerCleanupSymbol);
	return typeof cleanup === "function" ? cleanup : void 0;
}
function getRequestSocket(req) {
	if (req.socket && typeof req.socket.on === "function") return req.socket;
	const http2Socket = req.stream?.session?.socket;
	if (http2Socket && typeof http2Socket.on === "function") return http2Socket;
}
function resolveClientDir(options) {
	const clientURLRaw = new URL(options.client);
	const serverURLRaw = new URL(options.server);
	const rel = path.relative(url.fileURLToPath(serverURLRaw), url.fileURLToPath(clientURLRaw));
	const serverFolder = path.basename(options.server);
	let serverEntryFolderURL = path.dirname(import.meta.url);
	let previous = "";
	while (!serverEntryFolderURL.endsWith(serverFolder)) {
		if (serverEntryFolderURL === previous) throw new Error(`[@astrojs/node] Could not find the server directory "${serverFolder}" by walking up from "${import.meta.url}". This can happen when the server entry point is bundled into a single file (e.g. with esbuild) so that import.meta.url no longer contains the original "${serverFolder}" path segment. When bundling the server entry, make sure the output path contains a "${serverFolder}" directory segment, or avoid bundling the server entry entirely.`);
		previous = serverEntryFolderURL;
		serverEntryFolderURL = path.dirname(serverEntryFolderURL);
	}
	const serverEntryURL = serverEntryFolderURL + "/entry.mjs";
	const clientURL = new URL(appendForwardSlash(rel), serverEntryURL);
	return url.fileURLToPath(clientURL);
}
//#endregion
//#region node_modules/@astrojs/node/dist/serve-app.js
var PRERENDERED_ROUTE_TYPES = ["page", "endpoint"];
async function readErrorPageFromDisk(client, status) {
	const filePaths = [`${status}.html`, `${status}/index.html`];
	for (const filePath of filePaths) {
		const fullPath = path.join(client, filePath);
		let stream;
		try {
			stream = createReadStream(fullPath);
			await new Promise((resolve, reject) => {
				stream.once("open", () => resolve());
				stream.once("error", reject);
			});
			const webStream = Readable.toWeb(stream);
			return new Response(webStream, { headers: { "Content-Type": "text/html; charset=utf-8" } });
		} catch {
			stream?.destroy();
		}
	}
}
function createAppHandler(app, options) {
	const als = new AsyncLocalStorage();
	const logger = app.adapterLogger;
	process.on("unhandledRejection", (reason) => {
		const requestUrl = als.getStore();
		logger.error(`Unhandled rejection while rendering ${requestUrl}`);
		console.error(reason);
	});
	const client = resolveClientDir(options);
	const prerenderedErrorPageFetch = async (url) => {
		const { pathname } = new URL(url);
		if (pathname.endsWith("/404.html") || pathname.endsWith("/404/index.html")) {
			const response = await readErrorPageFromDisk(client, 404);
			if (response) return response;
		}
		if (pathname.endsWith("/500.html") || pathname.endsWith("/500/index.html")) {
			const response = await readErrorPageFromDisk(client, 500);
			if (response) return response;
		}
		return new Response(null, { status: 404 });
	};
	const effectiveBodySizeLimit = options.bodySizeLimit === 0 || options.bodySizeLimit === Number.POSITIVE_INFINITY ? void 0 : options.bodySizeLimit;
	return async (req, res, next, locals) => {
		let request;
		try {
			request = createRequestFromNodeRequest(req, {
				allowedDomains: app.getAllowedDomains?.() ?? [],
				bodySizeLimit: effectiveBodySizeLimit,
				port: options.port
			});
		} catch (err) {
			logger.error(`Could not render ${req.url}`);
			console.error(err);
			res.statusCode = 500;
			res.end("Internal Server Error");
			return;
		}
		let routeData = app.match(request, true);
		if (routeData?.prerender && PRERENDERED_ROUTE_TYPES.includes(routeData.type)) routeData = app.match(request);
		if (routeData) await writeResponse(await als.run(request.url, () => app.render(request, {
			addCookieHeader: true,
			locals,
			routeData,
			prerenderedErrorPageFetch
		})), res);
		else if (next) {
			const cleanup = getAbortControllerCleanup(req);
			if (cleanup) cleanup();
			return next();
		} else await writeResponse(await app.render(request, {
			addCookieHeader: true,
			prerenderedErrorPageFetch
		}), res);
	};
}
//#endregion
//#region node_modules/@astrojs/node/dist/log-listening-on.js
var wildcardHosts = /* @__PURE__ */ new Set([
	"0.0.0.0",
	"::",
	"0000:0000:0000:0000:0000:0000:0000:0000"
]);
async function logListeningOn(logger, server, configuredHost) {
	await new Promise((resolve) => server.once("listening", resolve));
	const protocol = server instanceof https.Server ? "https" : "http";
	const host = getResolvedHostForHttpServer(configuredHost);
	const { port } = server.address();
	const address = getNetworkAddress(protocol, host, port);
	if (host === void 0 || wildcardHosts.has(host)) logger.info(`Server listening on 
  local: ${address.local[0]} 	
  network: ${address.network[0]}
`);
	else logger.info(`Server listening on ${address.local[0]}`);
}
function getResolvedHostForHttpServer(host) {
	if (host === false) return "localhost";
	else if (host === true) return;
	else return host;
}
function getNetworkAddress(protocol = "http", hostname, port, base) {
	const NetworkAddress = {
		local: [],
		network: []
	};
	Object.values(os.networkInterfaces()).flatMap((nInterface) => nInterface ?? []).filter((detail) => detail && detail.address && detail.family === "IPv4").forEach((detail) => {
		let host = detail.address.replace("127.0.0.1", hostname === void 0 || wildcardHosts.has(hostname) ? "localhost" : hostname);
		if (host.includes(":")) host = `[${host}]`;
		const url = `${protocol}://${host}:${port}${base ? base : ""}`;
		if (detail.address.includes("127.0.0.1")) NetworkAddress.local.push(url);
		else NetworkAddress.network.push(url);
	});
	return NetworkAddress;
}
//#endregion
//#region node_modules/@astrojs/node/dist/serve-static.js
function resolveStaticPath(client, urlPath) {
	const filePath = path.join(client, urlPath);
	const resolved = path.resolve(filePath);
	const resolvedClient = path.resolve(client);
	if (resolved !== resolvedClient && !resolved.startsWith(resolvedClient + path.sep)) return {
		filePath: resolved,
		isDirectory: false
	};
	let isDirectory = false;
	try {
		isDirectory = fs.lstatSync(filePath).isDirectory();
	} catch {}
	return {
		filePath: resolved,
		isDirectory
	};
}
function createStaticHandler(app, options, headersMap) {
	const client = resolveClientDir(options);
	return (req, res, ssr) => {
		if (req.url) {
			let fullUrl = req.url;
			if (req.url.includes("#")) fullUrl = fullUrl.slice(0, req.url.indexOf("#"));
			const [urlPath, urlQuery] = fullUrl.split("?");
			let fsPath = app.removeBase(urlPath);
			try {
				fsPath = decodeURI(fsPath);
			} catch {}
			const { isDirectory } = resolveStaticPath(client, fsPath);
			const hasSlash = urlPath.endsWith("/");
			let pathname = urlPath;
			if (headersMap && headersMap.length > 0) {
				const request = createRequestFromNodeRequest(req, { port: options.port });
				const routeData = app.match(request, true);
				getAbortControllerCleanup(req)?.();
				if (routeData && routeData.prerender) {
					const baselessPathname = prependForwardSlash(app.removeBase(urlPath));
					const matchedRoute = headersMap.find((header) => header.pathname.includes(baselessPathname));
					if (matchedRoute) for (const header of matchedRoute.headers) res.setHeader(header.key, header.value);
				}
			}
			switch (app.manifest.trailingSlash) {
				case "never":
					if (isDirectory && urlPath !== "/" && hasSlash) {
						pathname = urlPath.slice(0, -1) + (urlQuery ? "?" + urlQuery : "");
						res.statusCode = 301;
						res.setHeader("Location", pathname);
						return res.end();
					}
					if (isDirectory && !hasSlash) pathname = `${urlPath}/index.html`;
					break;
				case "ignore":
					if (isDirectory && !hasSlash) pathname = `${urlPath}/index.html`;
					break;
				case "always": if (!hasSlash && !hasFileExtension(urlPath) && !isInternalPath(urlPath)) {
					pathname = urlPath + "/" + (urlQuery ? "?" + urlQuery : "");
					res.statusCode = 301;
					res.setHeader("Location", pathname);
					return res.end();
				}
			}
			pathname = prependForwardSlash(app.removeBase(pathname));
			const normalizedPathname = path.posix.normalize(pathname);
			const stream = send(req, normalizedPathname, {
				root: client,
				dotfiles: normalizedPathname.startsWith("/.well-known/") ? "allow" : "deny",
				extensions: app.manifest.buildFormat === "file" || app.manifest.buildFormat === "preserve" ? ["html"] : []
			});
			let forwardError = false;
			stream.on("error", (err) => {
				if (forwardError) {
					const status = "statusCode" in err ? err.statusCode : 500;
					if (status >= 500) console.error(err.toString());
					res.writeHead(status);
					res.end(status >= 500 ? "Internal server error" : "");
					return;
				}
				ssr();
			});
			stream.on("file", () => {
				forwardError = true;
			});
			stream.on("stream", () => {
				if (normalizedPathname.startsWith(`/${app.manifest.assetsDir}/`)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
			});
			stream.pipe(res);
		} else ssr();
	};
}
function prependForwardSlash(pth) {
	return pth.startsWith("/") ? pth : "/" + pth;
}
//#endregion
//#region node_modules/@astrojs/node/dist/standalone.js
var hostOptions = (host) => {
	if (typeof host === "boolean") return host ? "0.0.0.0" : "localhost";
	return host;
};
function standalone(app, options, headersMap) {
	const port = process.env.PORT ? Number(process.env.PORT) : options.port ?? 8080;
	const host = process.env.HOST ?? hostOptions(options.host);
	const server = createServer(createStandaloneHandler(app, {
		...options,
		port
	}, headersMap), host, port);
	server.server.listen(port, host);
	if (process.env.ASTRO_NODE_LOGGING !== "disabled") app.getLogger().then(() => logListeningOn(app.adapterLogger, server.server, host));
	server.server.on("close", () => {
		app.logger.close();
	});
	return {
		server,
		done: server.closed()
	};
}
function createStandaloneHandler(app, options, headersMap) {
	const appHandler = createAppHandler(app, options);
	const staticHandler = createStaticHandler(app, options, headersMap);
	return (req, res) => {
		try {
			decodeURI(req.url);
		} catch {
			res.writeHead(400);
			res.end("Bad request.");
			return;
		}
		staticHandler(req, res, () => appHandler(req, res));
	};
}
function createServer(listener, host, port) {
	let httpServer;
	if (process.env.SERVER_CERT_PATH && process.env.SERVER_KEY_PATH) httpServer = https.createServer({
		key: fs.readFileSync(process.env.SERVER_KEY_PATH),
		cert: fs.readFileSync(process.env.SERVER_CERT_PATH)
	}, listener);
	else httpServer = http.createServer(listener);
	enableDestroy(httpServer);
	const closed = new Promise((resolve, reject) => {
		httpServer.addListener("close", resolve);
		httpServer.addListener("error", reject);
	});
	return {
		server: httpServer,
		host,
		port,
		closed() {
			return closed;
		},
		async stop() {
			await new Promise((resolve, reject) => {
				httpServer.destroy((err) => err ? reject(err) : resolve(void 0));
			});
		}
	};
}
var app = createApp({ streaming: false });
var headersMap = void 0;
var handler = createStandaloneHandler(app, _virtual_astro_node_config_exports, headersMap);
var startServer = () => standalone(app, _virtual_astro_node_config_exports, headersMap);
if (process.env.ASTRO_NODE_AUTOSTART !== "disabled") startServer();
//#endregion
export { handler, _virtual_astro_node_config_exports as options, startServer };
