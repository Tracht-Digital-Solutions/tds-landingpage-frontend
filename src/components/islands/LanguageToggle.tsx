type Lang = "de" | "en";

const STORAGE_KEY = "tdsLang";

/**
 * DE | EN pill toggle that drives navigation, not just preference.
 *
 * Astro's i18n routing produces two URL trees (`/` for DE,
 * `/en/...` for EN); this control maps the current pathname to its
 * sibling in the other locale and navigates there. The chosen
 * locale is also persisted in localStorage so future visits land
 * on the same language when the user hits "/".
 *
 * Receives the build-time `lang` from the page wrapper so the
 * active state renders correctly on first paint (no hydration flash).
 */
function swapLocaleInPath(pathname: string, target: Lang): string {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  const inEn = trimmed === "/en" || trimmed.startsWith("/en/");

  if (target === "en") {
    if (inEn) return pathname;
    return trimmed === "/" ? "/en/" : `/en${trimmed}`;
  }
  if (!inEn) return pathname;
  const stripped = trimmed.replace(/^\/en/, "") || "/";
  return stripped;
}

export default function LanguageToggle({ lang }: { lang: Lang }) {
  const choose = (next: Lang) => {
    if (next === lang) return;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — Safari private mode etc.
    }
    if (typeof window !== "undefined") {
      const target = swapLocaleInPath(window.location.pathname, next);
      window.location.assign(target + window.location.hash);
    }
  };

  const base =
    "px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded-full transition-colors cursor-pointer";
  const active = "bg-[var(--color-primary)] text-white";
  const idle = "text-[var(--color-muted)] hover:text-[var(--color-primary)]";

  return (
    <div
      role="group"
      aria-label="Sprache wählen"
      className="flex items-center gap-1 ml-2"
    >
      <button
        type="button"
        aria-pressed={lang === "de"}
        onClick={() => choose("de")}
        className={`${base} ${lang === "de" ? active : idle}`}
      >
        DE
      </button>
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => choose("en")}
        className={`${base} ${lang === "en" ? active : idle}`}
      >
        EN
      </button>
    </div>
  );
}
