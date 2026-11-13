import type { Lang } from "./i18n";

/**
 * One spelling per page (public/.htaccess rule 0a): no trailing slash except
 * on the two roots, so canonical, hreflang, sitemap and share links agree.
 */
export function canonicalPath(pathname: string): string {
  return pathname.replace(/(.)\/+$/, "$1").replace(/^\/en$/, "/en/");
}

export function canonicalUrl(pathname: string, origin: string): string {
  return new URL(canonicalPath(pathname), origin).toString();
}

export interface ShareTarget {
  id: "linkedin" | "whatsapp" | "email";
  label: string;
  href: string;
}

/**
 * Share links for one page (2026-11-13). Plain links, so they work without
 * JavaScript and SEO checkers recognise them; the native share sheet and
 * "copy link" are buttons added by `ShareLinks.astro`. Nothing is loaded from
 * the networks themselves: no widget, no tracking pixel, no consent needed.
 */
export function shareTargets(url: string, lang: Lang): ShareTarget[] {
  const subject = "Tracht Digital Solutions";
  const encoded = encodeURIComponent(url);
  return [
    { id: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encoded}` },
    {
      id: "email",
      label: lang === "de" ? "E-Mail" : "Email",
      href: `mailto:?subject=${encodeURIComponent(subject)}&body=${encoded}`,
    },
  ];
}
