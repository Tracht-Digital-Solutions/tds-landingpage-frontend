/**
 * A quote request arriving from the Shop.
 *
 * The shop lives on another origin, so `lib/contactDraft.ts`'s sessionStorage
 * cannot reach it: the text comes in the query string. It is only ever a draft
 * in the message field, which the visitor reads before sending. The page cache
 * keys on the path, so the parameter never changes what the server renders.
 */
export const QUOTE_PARAM = "anfrage";
const MAX_LENGTH = 2000;

/** The draft text from a query string, or null. Control characters go, line breaks stay. */
export function readQuoteRequest(search: string): string | null {
  const raw = new URLSearchParams(search).get(QUOTE_PARAM);
  if (!raw) return null;
  // eslint-disable-next-line no-control-regex
  const text = raw.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim().slice(0, MAX_LENGTH);
  return text === "" ? null : text;
}
