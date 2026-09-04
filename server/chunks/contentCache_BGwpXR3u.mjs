import { r as connection } from "./connection_DiQacECW.mjs";
import { createHash, timingSafeEqual } from "crypto";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "fs/promises";
import { dirname, isAbsolute, join, resolve, sep } from "path";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from "fs";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/cache/index.js
var FORBIDDEN = /* @__PURE__ */ new Set([
	"/",
	"\\",
	":",
	"*",
	"?",
	"\"",
	"<",
	">",
	"|"
]);
function isSafeSegment(segment) {
	if (segment === "" || segment === "." || segment === "..") return false;
	if (segment.startsWith(".")) return false;
	for (const ch of segment) {
		if (FORBIDDEN.has(ch)) return false;
		const code = ch.codePointAt(0) ?? 0;
		if (code < 32 || code === 127) return false;
	}
	return true;
}
function hasExtension(segment) {
	const dot = segment.lastIndexOf(".");
	if (dot <= 0 || dot === segment.length - 1) return false;
	const ext = segment.slice(dot + 1);
	for (const ch of ext) if (!(ch >= "0" && ch <= "9") && !(ch >= "a" && ch <= "z") && !(ch >= "A" && ch <= "Z")) return false;
	return true;
}
function cacheLocation(pathname) {
	let decoded;
	try {
		decoded = decodeURIComponent(pathname);
	} catch {
		return null;
	}
	const segments = decoded.split("/").filter((s) => s !== "");
	if (!segments.every(isSafeSegment)) return null;
	if (segments.length === 0) return {
		file: "index.html",
		meta: "index.json",
		path: "/"
	};
	const joined = segments.join("/");
	const last = segments[segments.length - 1];
	return {
		file: hasExtension(last) ? joined : joined + "/index.html",
		meta: joined + ".json",
		path: "/" + joined
	};
}
function isCacheableMethod(method) {
	const m = method.toUpperCase();
	return m === "GET" || m === "HEAD";
}
var PageCacheStore = class {
	/**
	* @param dir      Where the served files go. In production this is what the
	*                 document root's `_tds-cache` symlink points at, so the web
	*                 server can answer a hit without waking Node.
	* @param metaDir  Where the sidecars go. Defaults to `<dir>/.meta` for local
	*                 use; production passes a directory OUTSIDE the web tree,
	*                 so nothing but rendered public HTML is ever reachable.
	*/
	constructor(dir, metaDir) {
		this.dir = dir;
		this.metaDir = metaDir ?? join(dir, ".meta");
	}
	dir;
	metaDir;
	/** Absolute path of a page file inside the cache directory. */
	abs(relative) {
		return join(this.dir, ...relative.split("/"));
	}
	/** Absolute path of a metadata sidecar. */
	absMeta(relative) {
		return join(this.metaDir, ...relative.split("/"));
	}
	/**
	* Read an entry, or `null` when there is none.
	*
	* Missing metadata is treated as a miss rather than a partially usable
	* entry: without the content type we would have to guess, and guessing
	* `text/html` for a cached `rss.xml` serves a feed the browser renders as a
	* broken page.
	*/
	async read(pathname) {
		const loc = cacheLocation(pathname);
		if (!loc) return null;
		try {
			const [body, metaRaw] = await Promise.all([readFile(this.abs(loc.file)), readFile(this.absMeta(loc.meta), "utf8")]);
			const meta = JSON.parse(metaRaw);
			if (typeof meta?.contentType !== "string") return null;
			return {
				body,
				meta
			};
		} catch {
			return null;
		}
	}
	/**
	* Write an entry atomically: a temporary file next to the target, then a
	* `rename` over it.
	*
	* The atomicity is the load-bearing part of "rebuild = render then swap".
	* A plain `writeFile` over a live entry leaves a window in which a visitor
	* reads a half-written document, and a truncated HTML page renders as a
	* blank white screen rather than as an error anyone would notice.
	*/
	async write(pathname, body, contentType) {
		const loc = cacheLocation(pathname);
		if (!loc) return null;
		const meta = {
			path: loc.path,
			contentType,
			renderedAt: (/* @__PURE__ */ new Date()).toISOString(),
			etag: "\"" + createHash("sha256").update(body).digest("hex").slice(0, 32) + "\""
		};
		await this.swap(this.abs(loc.file), body);
		await this.swap(this.absMeta(loc.meta), Buffer.from(JSON.stringify(meta), "utf8"));
		return meta;
	}
	async swap(target, body) {
		await mkdir(dirname(target), { recursive: true });
		const tmp = `${target}.${process.pid}.${Math.random().toString(36).slice(2, 10)}.tmp`;
		await writeFile(tmp, body);
		try {
			await rename(tmp, target);
		} catch (err) {
			await rm(tmp, { force: true });
			throw err;
		}
	}
	/** Remove one entry. Missing is success — purging twice is not an error. */
	async remove(pathname) {
		const loc = cacheLocation(pathname);
		if (!loc) return;
		await Promise.all([rm(this.abs(loc.file), { force: true }), rm(this.absMeta(loc.meta), { force: true })]);
	}
	/**
	* Empty both directories — their CONTENTS, never the directories themselves.
	*
	* Both, not just the pages: metadata left behind would make {@link list}
	* report entries that no longer exist, and a status screen that lies about
	* an empty cache is worse than none.
	*
	* And contents rather than the directory, because in production the pages
	* directory is reached through a symlink the document root owns. `rm -r` on
	* a symlink removes the LINK, so a "clear the cache" click would silently
	* disconnect the web server from the store until the next app restart
	* recreated it — every page a miss, no error anywhere, and nothing in the
	* cache directory to suggest why.
	*/
	async clear() {
		const empty = async (dir) => {
			let items;
			try {
				items = await readdir(dir);
			} catch {
				return;
			}
			await Promise.all(items.map((name) => rm(join(dir, name), {
				recursive: true,
				force: true
			})));
		};
		await Promise.all([empty(this.dir), empty(this.metaDir)]);
	}
	/**
	* Every entry currently stored, newest first.
	*
	* Derived from the metadata tree rather than the HTML tree, because the
	* metadata file names carry the request path directly and the HTML tree
	* would require re-deriving `/preise` from `preise/index.html`.
	*/
	async list() {
		const metaRoot = this.metaDir;
		const found = [];
		const walk = async (dir) => {
			let items;
			try {
				items = await readdir(dir, { withFileTypes: true });
			} catch {
				return;
			}
			for (const item of items) {
				const full = join(dir, item.name);
				if (item.isDirectory()) {
					await walk(full);
					continue;
				}
				if (!item.name.endsWith(".json")) continue;
				try {
					const meta = JSON.parse(await readFile(full, "utf8"));
					const body = await stat(this.abs(cacheLocation(meta.path)?.file ?? ""));
					found.push({
						path: meta.path,
						renderedAt: meta.renderedAt,
						bytes: body.size
					});
				} catch {}
			}
		};
		await walk(metaRoot);
		found.sort((a, b) => a.renderedAt < b.renderedAt ? 1 : -1);
		return found;
	}
	/** Where this store keeps its files — for the status endpoint and logs. */
	get directory() {
		return this.dir.endsWith(sep) ? this.dir.slice(0, -1) : this.dir;
	}
};
function tokenMatches(expected, given) {
	if (!expected || !given) return false;
	const a = createHash("sha256").update(expected).digest();
	const b = createHash("sha256").update(given).digest();
	return timingSafeEqual(a, b);
}
async function resolveEvents(map, events) {
	const paths = /* @__PURE__ */ new Set();
	const unknown = /* @__PURE__ */ new Set();
	for (const event of events) {
		const resolver = map[event.type];
		if (!resolver) {
			unknown.add(event.type);
			continue;
		}
		let resolved;
		try {
			resolved = await resolver(event);
		} catch {
			continue;
		}
		for (const path of resolved) if (typeof path === "string" && path.startsWith("/")) paths.add(path);
	}
	return {
		paths: [...paths].sort(),
		unknown: [...unknown].sort()
	};
}
function forLanguages(event, build) {
	if (event.lang === "de") return build("de");
	if (event.lang === "en") return build("en");
	return [...build("de"), ...build("en")];
}
function isStorable(contentType) {
	const t = contentType.toLowerCase();
	return t.includes("text/html") || t.includes("application/xml") || t.includes("text/xml") || t.includes("application/rss+xml") || t.includes("application/json") || t.includes("application/pdf") || t.includes("image/png");
}
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store"
		}
	});
}
function pageCache(options) {
	const { dir, metaDir, events, token = process.env.TDS_CACHE_TOKEN ?? "", tokenProvider, enabled = true, onInvalidate, alwaysPaths = [], concurrency = 4, logger = (m) => console.warn(m) } = options;
	const store = new PageCacheStore(dir, metaDir);
	const REFRESH = "x-tds-cache-refresh";
	const currentToken = () => {
		try {
			return (tokenProvider?.() ?? token).trim();
		} catch {
			return token.trim();
		}
	};
	async function control(action, request, url) {
		const activeToken = currentToken();
		if (!activeToken) return json({ error: "cache_token_not_configured" }, 503);
		if (!tokenMatches(activeToken, request.headers.get("x-tds-cache-token") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null)) return json({ error: "unauthorized" }, 401);
		if (action === "status" && request.method === "GET") {
			const entries = await store.list();
			return json({
				directory: store.directory,
				count: entries.length,
				newest: entries[0]?.renderedAt ?? null,
				oldest: entries[entries.length - 1]?.renderedAt ?? null,
				bytes: entries.reduce((sum, e) => sum + e.bytes, 0),
				entries: entries.slice(0, 500)
			});
		}
		if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
		let payload;
		try {
			payload = await request.json();
		} catch {
			return json({ error: "invalid_json" }, 400);
		}
		const resolved = await resolveEvents(events, payload.events ?? []);
		const explicit = (payload.paths ?? []).filter((p) => typeof p === "string" && p.startsWith("/"));
		if (action === "purge") {
			if (payload.all) {
				await store.clear();
				onInvalidate?.();
				return json({ purged: "all" });
			}
			const paths2 = [.../* @__PURE__ */ new Set([...resolved.paths, ...explicit])];
			await Promise.all(paths2.map((p) => store.remove(p)));
			onInvalidate?.();
			return json({
				purged: paths2,
				unknownEvents: resolved.unknown
			});
		}
		if (action !== "rebuild") return json({ error: "not_found" }, 404);
		let paths;
		if (payload.all) {
			const cached = (await store.list()).map((e) => e.path);
			paths = [.../* @__PURE__ */ new Set([...cached, ...alwaysPaths])].sort();
		} else paths = [.../* @__PURE__ */ new Set([...resolved.paths, ...explicit])];
		onInvalidate?.();
		const rebuilt = [];
		const skipped = [];
		const failed = [];
		const queue = [...paths];
		const worker = async () => {
			for (;;) {
				const path = queue.shift();
				if (path === void 0) return;
				try {
					const res = await fetch(new URL(path, url.origin), { headers: { [REFRESH]: activeToken } });
					await res.arrayBuffer();
					if (!res.ok) failed.push({
						path,
						status: res.status
					});
					else if (res.headers.get("x-tds-cache") === "BYPASS") skipped.push(path);
					else rebuilt.push(path);
				} catch (err) {
					failed.push({
						path,
						status: String(err)
					});
				}
			}
		};
		await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
		return json({
			rebuilt: rebuilt.sort(),
			skipped: skipped.sort(),
			failed,
			unknownEvents: resolved.unknown
		});
	}
	async function middleware(context, next) {
		const { request, url } = context;
		if (context.isPrerendered) return next();
		if (!enabled || !isCacheableMethod(request.method)) return next();
		const activeToken = currentToken();
		const refreshing = activeToken !== "" && tokenMatches(activeToken, request.headers.get(REFRESH));
		if (!refreshing) {
			const hit = await store.read(url.pathname);
			if (hit) {
				if (request.headers.get("if-none-match") === hit.meta.etag) return new Response(null, {
					status: 304,
					headers: {
						etag: hit.meta.etag,
						"x-tds-cache": "HIT"
					}
				});
				return new Response(request.method === "HEAD" ? null : new Uint8Array(hit.body), {
					status: 200,
					headers: {
						"content-type": hit.meta.contentType,
						etag: hit.meta.etag,
						"x-tds-cache": "HIT",
						"cache-control": "public, max-age=0, must-revalidate"
					}
				});
			}
		}
		const response = await next();
		const contentType = response.headers.get("content-type") ?? "";
		if (!(request.method === "GET" && response.status === 200 && isStorable(contentType) && !response.headers.has("set-cookie") && !(response.headers.get("cache-control") ?? "").includes("no-store"))) {
			const out = new Response(response.body, response);
			out.headers.set("x-tds-cache", "BYPASS");
			return out;
		}
		const body = Buffer.from(await response.arrayBuffer());
		let etag;
		try {
			etag = (await store.write(url.pathname, body, contentType))?.etag;
		} catch (err) {
			logger(`[tds-cache] could not store ${url.pathname}: ${String(err)}`);
		}
		const headers = new Headers(response.headers);
		headers.set("x-tds-cache", refreshing ? "REFRESH" : "MISS");
		headers.set("cache-control", "public, max-age=0, must-revalidate");
		if (etag) headers.set("etag", etag);
		return new Response(new Uint8Array(body), {
			status: 200,
			headers
		});
	}
	return {
		middleware,
		control: async (action, request, url) => {
			try {
				return await control(action, request, url);
			} catch (err) {
				logger(`[tds-cache] control request failed: ${String(err)}`);
				return json({ error: "internal" }, 500);
			}
		}
	};
}
function createGenerationCache() {
	let entries = /* @__PURE__ */ new Map();
	let generation = 0;
	return {
		get(key, load) {
			const existing = entries.get(key);
			if (existing) return existing;
			const bornIn = generation;
			const pending = load().catch((err) => {
				if (generation === bornIn && entries.get(key) === pending) entries.delete(key);
				throw err;
			});
			entries.set(key, pending);
			return pending;
		},
		invalidate() {
			generation += 1;
			entries = /* @__PURE__ */ new Map();
		},
		get generation() {
			return generation;
		}
	};
}
var CACHE_LINK_NAME = "_tds-cache";
var BUILD_MARKER_NAME = ".build-id";
var DEFAULT_ASSETS_DIR = "_astro";
function resolveCacheDirs(options = {}) {
	const { root = process.cwd(), publicDir = "client", assetsDir = DEFAULT_ASSETS_DIR, logger = (m) => console.warn(m) } = options;
	const fromEnv = (name) => {
		const value = (process.env[name] ?? "").trim();
		if (value === "") return null;
		return isAbsolute(value) ? value : resolve(root, value);
	};
	const base = join(root, "var", "page-cache");
	const dir = fromEnv("TDS_CACHE_DIR") ?? join(base, "pages");
	const metaDir = fromEnv("TDS_CACHE_META_DIR") ?? join(base, "meta");
	try {
		mkdirSync(dir, { recursive: true });
		mkdirSync(metaDir, { recursive: true });
	} catch (err) {
		logger(`[tds-cache] could not create the cache directories: ${String(err)}`);
		return {
			dir,
			metaDir
		};
	}
	discardCacheOfOtherBuild(join(root, publicDir), assetsDir, dir, metaDir, logger);
	linkIntoDocumentRoot(join(root, publicDir), dir, logger);
	return {
		dir,
		metaDir
	};
}
function discardCacheOfOtherBuild(documentRoot, assetsDir, dir, metaDir, logger) {
	const fingerprint = buildFingerprint(join(documentRoot, assetsDir));
	if (!fingerprint) return;
	const marker = join(metaDir, BUILD_MARKER_NAME);
	let previous = null;
	try {
		previous = readFileSync(marker, "utf8").trim();
	} catch {
		previous = null;
	}
	if (previous === fingerprint) return;
	emptyContents(dir, logger);
	emptyContents(metaDir, logger);
	logger(`[tds-cache] cache discarded: it was filled by build ${previous ?? "unknown"}, this is ${fingerprint}`);
	try {
		writeFileSync(marker, `${fingerprint}
`);
	} catch (err) {
		logger(`[tds-cache] could not record the build marker: ${String(err)}`);
	}
}
function buildFingerprint(assetsPath) {
	let names;
	try {
		names = readdirSync(assetsPath);
	} catch {
		return null;
	}
	if (names.length === 0) return null;
	return createHash("sha256").update(names.sort().join("\n")).digest("hex").slice(0, 16);
}
function emptyContents(dir, logger) {
	let items;
	try {
		items = readdirSync(dir);
	} catch {
		return;
	}
	for (const name of items) try {
		rmSync(join(dir, name), {
			recursive: true,
			force: true
		});
	} catch (err) {
		logger(`[tds-cache] could not remove ${join(dir, name)}: ${String(err)}`);
	}
}
function linkIntoDocumentRoot(documentRoot, target, logger) {
	if (!existsSync(documentRoot)) return;
	const link = join(documentRoot, CACHE_LINK_NAME);
	try {
		let entry = null;
		try {
			entry = lstatSync(link);
		} catch {
			entry = null;
		}
		if (entry) {
			if (!entry.isSymbolicLink()) return;
			if (existsSync(link)) return;
			unlinkSync(link);
		}
		symlinkSync(target, link, process.platform === "win32" ? "junction" : "dir");
	} catch (err) {
		logger(`[tds-cache] could not link ${link} -> ${target}: ${String(err)}`);
	}
}
//#endregion
//#region src/lib/siteKey.ts
/**
* Request-time protection for paired API reads.
*
* The private key is loaded dynamically from the server-side connection file.
* `connection.ts` retains `TDS_SITE_KEY` only as a one-release host fallback;
* builds and GitHub workflows no longer receive it.
*/
function currentSiteKey() {
	return connection.siteKey();
}
var SiteKeyRejectedError = class extends Error {
	status;
	constructor(status, url) {
		super(`[tds-landingpage] Der gekoppelte API-Zugang wurde abgelehnt (HTTP ${status}) von ${url}. Bitte die Website in ihren CMS-Einstellungen neu verbinden.`);
		this.name = "SiteKeyRejectedError";
		this.status = status;
	}
};
var BUCKET = "__tdsSiteKeyRejections__";
var siteKeyRejections = globalThis[BUCKET] ??= [];
var COUNTER = "__tdsSiteKeyRejectionCount__";
function siteKeyRejectionCount() {
	return globalThis[COUNTER] ?? 0;
}
function siteKeyHeaders() {
	return connection.siteKeyHeaders();
}
function assertKeyAccepted(res, url) {
	if (currentSiteKey() === "") return;
	if (res.status !== 401 && res.status !== 403) return;
	const where = String(url);
	if (!siteKeyRejections.includes(where)) siteKeyRejections.push(where);
	const store = globalThis;
	store[COUNTER] = (store[COUNTER] ?? 0) + 1;
	throw new SiteKeyRejectedError(res.status, where);
}
//#endregion
//#region src/lib/contentCache.ts
/**
* The one memo every content fetch on this site shares.
*
* It replaces the module-level `Map`/`let … = null` caches that `cms.ts` and
* `legal.ts` used to keep. Those were exactly right while this site was a
* static build — one process, one fetch per language, then exit — and become
* *permanent* under SSR: the server would answer with whatever it read at
* boot, for the life of the process, and a cache rebuild would faithfully
* re-render that stale content and report success. Nothing logs, nothing
* throws, nothing is red.
*
* The middleware calls `invalidate()` before any render a rebuild performs.
*
* ### Why this is its own module
*
* This memo is infrastructure; the route table in `cache.ts` is application
* knowledge that has to know every service page. Keeping both in one file made
* `cms.ts` depend on the route table, which closed a cycle:
* `services.ts` → `cms.ts` → `cache.ts` → `services.ts`. Entering that graph
* through `services.ts` left `serviceDefinitions` still uninitialised while
* `cache.ts` built its top-level path lists, throwing a `TypeError` that no
* type check can see. Splitting the memo out breaks the cycle at its cause —
* a content fetch has no business importing the sitemap of the site.
*/
var contentCache = createGenerationCache();
//#endregion
export { forLanguages as a, siteKeyRejectionCount as i, assertKeyAccepted as n, pageCache as o, siteKeyHeaders as r, resolveCacheDirs as s, contentCache as t };
