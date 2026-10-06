/**
 * The sections of the sitemap (2026-10-06): the general pages, the services
 * and the platform pages, one child sitemap each, listed by
 * `/sitemap-index.xml` with each child's own newest date. A crawler re-reads
 * only the section that moved, and Search Console reports coverage per section.
 *
 * No imports — `cache.ts` needs the paths without the content modules.
 */
export const SITEMAP_SECTIONS = ["pages", "services", "platforms"] as const;
export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];

export function isSitemapSection(value: string | undefined): value is SitemapSection {
  return (SITEMAP_SECTIONS as readonly string[]).includes(value ?? "");
}

export function sectionPath(section: SitemapSection): string {
  return `/sitemap-${section}.xml`;
}

/** Every sitemap document a rebuild must refresh (index, sections, legacy single file). */
export const SITEMAP_PATHS: readonly string[] = [
  "/sitemap-index.xml",
  "/sitemap-0.xml",
  ...SITEMAP_SECTIONS.map(sectionPath),
];
