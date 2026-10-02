/**
 * The content reader: key headers, a timeout, the key check, and a THROW on any
 * non-2xx, so the caller decides in one place what a failure renders as.
 * tds-shared/site's, bound to this site's key in `./siteKey`.
 */
export { readContentJson } from "./siteKey";
