import type { Lang } from "./i18n";
import { referenceCases } from "./references";

/**
 * The home page's section navigation — ONE list for the header, the mobile
 * menu and the footer.
 *
 * There used to be three hand-written copies, and they had drifted: the footer
 * still said "Was ich anbiete?" while the header said "Leistungen", and both
 * pointed at sections the page no longer led with. The labels are this site's
 * own words about its own sections, so they are code-owned and follow the
 * page's locale; the ids ARE the section ids and double as the anchors.
 *
 * "Projekte" is listed only while a published case exists. The cases section
 * renders nothing without one (`sections/CustomerCases.astro`), and a menu
 * entry that points at an anchor which is not on the page is a link that does
 * nothing at all.
 */
export interface SectionLink {
  /** The section's `id`, i.e. the anchor. */
  id: string;
  label: string;
}

export function sectionLinks(lang: Lang): SectionLink[] {
  const de = lang === "de";
  return [
    { id: "services", label: de ? "Leistungen" : "Services" },
    ...(referenceCases.length > 0 ? [{ id: "cases", label: de ? "Projekte" : "Projects" }] : []),
    { id: "process", label: de ? "Vorgehen" : "Process" },
    { id: "preise", label: de ? "Preise" : "Pricing" },
  ];
}
