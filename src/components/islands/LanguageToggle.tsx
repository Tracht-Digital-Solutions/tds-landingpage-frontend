import { useEffect, useRef, useState } from "react";

type Lang = "de" | "en";

const STORAGE_KEY = "tdsLang";

const options: { code: Lang; flag: string; label: string }[] = [
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "en", flag: "🇬🇧", label: "English" },
];

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

/**
 * Compact language dropdown. Trigger shows the active flag + code;
 * the menu offers both locales with flag and full label. Selecting
 * an option persists the choice in localStorage and navigates to
 * the sibling URL in the other locale tree.
 *
 * Active locale is fed in by the server-rendered Header so the
 * trigger paints correctly on first frame without a hydration flash.
 */
export default function LanguageToggle({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: Lang) => {
    setOpen(false);
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

  const current = options.find((o) => o.code === lang) ?? options[0];

  return (
    <div ref={rootRef} className="relative ml-2">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={lang === "de" ? "Sprache wählen" : "Select language"}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 transition-colors cursor-pointer"
      >
        <span aria-hidden="true" className="text-base leading-none">
          {current.flag}
        </span>
        <span>{current.code}</span>
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={lang === "de" ? "Sprachen" : "Languages"}
          className="absolute right-0 top-full mt-2 min-w-[140px] py-1 rounded-xl bg-white shadow-[0_12px_32px_-12px_rgba(5,15,104,0.28)] border border-[var(--color-line)] z-50"
        >
          {options.map((opt) => {
            const active = opt.code === lang;
            return (
              <li key={opt.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => choose(opt.code)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors cursor-pointer ${
                    active
                      ? "text-[var(--color-primary)] font-medium bg-black/5"
                      : "text-[var(--color-black)] hover:bg-black/5"
                  }`}
                >
                  <span aria-hidden="true" className="text-lg leading-none">
                    {opt.flag}
                  </span>
                  <span className="flex-1">{opt.label}</span>
                  {active && (
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[var(--color-accent)]"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
