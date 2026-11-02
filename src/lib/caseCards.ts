/**
 * The client cases as cards, for the home page and the project overview.
 *
 * Reads `referenceCases` directly, not `resolveServiceContent`: the empty-array
 * off-switch on a service block does not reach these two surfaces, so removing
 * a named customer from them is a code change.
 */
import type { Lang } from "./i18n";
import { getReferencePreviews } from "./referencePreviews";
import { articleUrl, referenceCases } from "./references";
import { getServiceById, serviceHref } from "./services";

export interface ReferenceCardData {
  id: string;
  preview: { src: string; width: number; height: number } | null;
  reference: {
    title: string;
    context: string;
    result: string;
    metric?: string | null;
  };
  /** Every service the case used, in catalog order, each with its page. */
  services: { label: string; href: string }[];
  articleHref: string | null;
  siteHref: string | null;
}

export async function getCaseCards(lang: Lang): Promise<ReferenceCardData[]> {
  // Consent, a live site and a captured screenshot: a case missing any one of
  // the three is absent from this map and its card renders without a band.
  const previews = await getReferencePreviews();

  return (
    referenceCases
      .map((entry) => ({
        id: entry.id,
        preview: previews.get(entry.id) ?? null,
        reference: entry.content[lang],
        // The label comes from the committed catalog, not through `cmsFor`: a
        // badge names a page this site owns.
        services: entry.services.map((id) => {
          const service = getServiceById(id);
          return { label: service.fallback[lang].title, href: serviceHref(service, lang) };
        }),
        articleHref: entry.articleSlug ? articleUrl(entry.articleSlug, lang) : null,
        siteHref: entry.siteUrl,
      }))
      // Stable sort: a case that shows its work leads, the catalog order holds
      // otherwise.
      .sort((a, b) => Number(b.preview !== null) - Number(a.preview !== null))
  );
}
