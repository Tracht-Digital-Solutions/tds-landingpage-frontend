import { assertKeyAccepted, siteKeyHeaders } from "./siteKey";

/**
 * One read against the content API: site-key headers, a timeout, the key
 * check, and a THROW on any non-2xx.
 *
 * The fetch / `assertKeyAccepted` / `res.ok` block was repeated in every
 * loader, and each spelled the failure differently — some returned `[]` on a
 * 500, which `memoisedOr` would then remember. Throwing here is what lets a
 * caller decide, in one place, what a failure renders as.
 */
export async function readContentJson<T>(url: string | URL, timeoutMs = 10_000): Promise<T> {
  // A HANGING api host would otherwise block a render until the job timeout.
  const res = await fetch(url, { headers: siteKeyHeaders(), signal: AbortSignal.timeout(timeoutMs) });
  assertKeyAccepted(res, url);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${String(url)}`);
  return (await res.json()) as T;
}
