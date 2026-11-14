import { St as defineMiddleware, t as sequence } from "./chunks/sequence_BJTD5713.mjs";
import { t as siteCache } from "./chunks/pageCache_CbJvCg3j.mjs";
import { d as guardSiteKey } from "./chunks/siteKey_B3C2A64j.mjs";
// src/lib/charset.ts
/** Text types whose header should carry `charset=utf-8`. */
var TEXTUAL = /^(text\/[\w.+-]+|application\/(json|ld\+json|xml|rss\+xml|manifest\+json|javascript))\s*(;|$)/i;
/**
* Returns `response` with `; charset=utf-8` on a textual `Content-Type` that
* names no charset. Everything else passes through untouched. A response with
* immutable headers (a cached or fetched one) is copied first.
*/
function withUtf8Charset(response) {
	const type = response.headers.get("content-type");
	if (!type || /charset=/i.test(type) || !TEXTUAL.test(type)) return response;
	const value = `${type.replace(/;\s*$/, "")}; charset=utf-8`;
	try {
		response.headers.set("content-type", value);
		return response;
	} catch {
		const headers = new Headers(response.headers);
		headers.set("content-type", value);
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	}
}
// src/middleware.ts
/**
* Serve cached pages and store rendered ones.
*
* The control plane that drives it is NOT here — it is a real route
* (`src/pages/tds/cache/[action].ts`), because Astro never runs middleware for
* a path no route matches. See that file.
*
* ### In production Apache usually answers first
*
* `public/.htaccess` serves an existing cache entry straight off disk, so a
* hit normally never reaches Node at all — that is the point of the design.
* The hit path here still matters: it is what `npm run dev`, `npm start` and
* any host without the rewrite use, and having both read the same store keeps
* the two implementations honest.
*/
/**
* Refuse to STORE a page that was rendered while the API rejected our site key.
*
* `siteKeyGuard()` in `astro.config.mjs` covers the build, and it cannot cover
* this: every content fetch is deliberately fail-soft, so at request time a
* rejected key produces a perfectly valid page full of baked fallbacks. Cached,
* that page would outlive the misconfiguration and there would be nothing to
* see — a site quietly serving its own placeholder copy is exactly the failure
* the build-time guard exists to prevent.
*
* Comparing the rejection counter around the render is enough. Two requests
* racing can only make this refuse to store a page that was fine; it can never
* make it store one that was not, and a needless miss costs one render.
*/
var refuseStaleKey = defineMiddleware((_context, next) => guardSiteKey(next));
/**
* `sequence` runs these outside-in, so the cache wraps the guard: the guard's
* `no-store` is already on the response by the time the cache decides whether
* to store it. Reversing the two would put the guard outside the cache, where
* it would see hits it never rendered and mark them unstorable for no reason.
*/
/**
* Name the character set in the HTTP header (2026-11-13). Astro answers
* `text/html` without one, and the SEO checkers flag it; the `<meta charset>`
* alone only counts once the parser has reached it. Apache adds the same for
* cache hits it serves itself (`AddDefaultCharset` in `public/.htaccess`).
*/
var utf8Charset = defineMiddleware(async (_context, next) => withUtf8Charset(await next()));
var onRequest$1 = sequence(utf8Charset, defineMiddleware((context, next) => siteCache.middleware({
	request: context.request,
	url: context.url,
	isPrerendered: context.isPrerendered
}, next)), refuseStaleKey);
// \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
export { onRequest };
