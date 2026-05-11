import { useEffect, useState } from "react";

const STORAGE_KEY = "tdsLang";
type Lang = "de" | "en";

function isLang(value: string | null): value is Lang {
  return value === "de" || value === "en";
}

/**
 * Visible DE | EN pill toggle. Persists the chosen language in
 * localStorage under "tdsLang" (the same key the shared lib's
 * `LanguageProvider` reads on mount) and reloads the page so any
 * server-rendered text re-renders against the new preference.
 *
 * NOTE: Astro pre-renders all `.astro` text on the server, so a full
 * DE/EN site needs either separate `/en/` routes or an edge-rewrite
 * layer. v1 of this toggle just flips the stored preference + reloads;
 * sections that need to retranslate live (the Hero island, ContactForm,
 * etc.) will pick it up via the shared `LanguageProvider`.
 */
export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("de");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) setLang(stored);
  }, []);

  const choose = (next: Lang) => {
    if (next === lang) return;
    localStorage.setItem(STORAGE_KEY, next);
    setLang(next);
    // Hard reload so server-rendered Astro markup also re-renders. Once
    // the whole site is i18n-aware (separate /en/ routes), drop this.
    if (typeof window !== "undefined") window.location.reload();
  };

  const base =
    "px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded-full transition-colors";
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
