import type { Lang } from "./i18n";
import { hreflangGroup } from "./sitemap";

/**
 * Where the header's language switch may point on this page — or `null`, in
 * which case the switch is not rendered at all.
 *
 * The target comes from the route inventory (`hreflangGroup` in `sitemap.ts`),
 * the same pairing the sitemap and the `hreflang` tags are built from. That is
 * the only source that knows `/leistungen/webauftritt` pairs with
 * `/en/services/web-presence`; no prefix rule can derive it.
 *
 * What this replaced is the reason it exists. The old toggle read
 * `<link rel="alternate">` from the head and, when there was none, glued `/en`
 * onto the path. A page served `noindex` (sitemap exclusion) carries no
 * alternates, so a service page sent visitors to `/en/leistungen/…` — a 404.
 * Offering a language that does not exist is worse than not offering one.
 *
 * The inventory is the FULL list, not the panel-filtered one: a page merely
 * hidden from search still has its twin, and the switch should still find it.
 */
export function alternatePath(pathname: string, target: Lang): string | null {
  const group = hreflangGroup(pathname);
  if (group.length !== 2) return null;
  const [de, en] = group;
  return (target === "de" ? de : en) ?? null;
}
