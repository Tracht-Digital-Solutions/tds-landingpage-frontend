/**
 * The sections of the sitemap (2026-10-06): the general pages, the services
 * and the platform pages, one child sitemap each, listed by
 * `/sitemap-index.xml` with each child's own newest date. A crawler re-reads
 * only the section that moved, and Search Console reports coverage per section.
 *
 * No imports — `cache.ts` needs the paths without the content modules.
 */
import { defineSitemapSections } from "@tracht-digital-solutions/tds-shared/site";

const sections = defineSitemapSections(["pages", "services", "platforms"] as const);

export const SITEMAP_SECTIONS = sections.sections;
export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];
export const isSitemapSection = sections.isSection;
/** `/sitemap-<section>.xml`. */
export const sectionPath = sections.sectionPath;
/** Every sitemap document the page cache rebuilds: index, legacy `sitemap-0.xml`, each section. */
export const SITEMAP_PATHS = sections.paths;
