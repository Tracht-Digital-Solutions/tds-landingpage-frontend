import { translations } from "@tracht-digital-solutions/tds-shared/i18n";

export type Lang = "de" | "en";

export function resolveLang(currentLocale: string | undefined): Lang {
  return currentLocale === "en" ? "en" : "de";
}

export function tFor(currentLocale: string | undefined) {
  return translations[resolveLang(currentLocale)];
}

/** Prefix a site-internal path with the EN locale segment when needed. */
export function localizePath(path: string, lang: Lang): string {
  if (lang === "de") return path;
  if (path.startsWith("/en/") || path === "/en") return path;
  if (path === "/") return "/en/";
  return `/en${path.startsWith("/") ? "" : "/"}${path}`;
}
