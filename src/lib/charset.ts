/** Text types whose header should carry `charset=utf-8`. */
const TEXTUAL = /^(text\/[\w.+-]+|application\/(json|ld\+json|xml|rss\+xml|manifest\+json|javascript))\s*(;|$)/i;

/**
 * Returns `response` with `; charset=utf-8` on a textual `Content-Type` that
 * names no charset. Everything else passes through untouched. A response with
 * immutable headers (a cached or fetched one) is copied first.
 */
export function withUtf8Charset(response: Response): Response {
  const type = response.headers.get("content-type");
  if (!type || /charset=/i.test(type) || !TEXTUAL.test(type)) return response;
  const value = `${type.replace(/;\s*$/, "")}; charset=utf-8`;
  try {
    response.headers.set("content-type", value);
    return response;
  } catch {
    const headers = new Headers(response.headers);
    headers.set("content-type", value);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
}
