import { useEffect, useRef, useState } from "react";

type Lang = "de" | "en";

const STORAGE_KEY = "tdsLang";

// Inline SVG flags — flag emoji ( 🇩🇪 / 🇬🇧 ) renders as bare regional
// indicator letters ("DE" / "GB") on Windows because Win32 doesn't
// bundle colour flag glyphs. Cross-platform-consistent SVG marks
// keep the brand polish on every OS.
function FlagDE({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 5 3"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="5" height="1" y="0" fill="#000000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  );
}

function FlagGB({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <clipPath id="tds-flag-gb-clip">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#tds-flag-gb-clip)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

const options: { code: Lang; Flag: typeof FlagDE; label: string }[] = [
  { code: "de", Flag: FlagDE, label: "Deutsch" },
  { code: "en", Flag: FlagGB, label: "English" },
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
 * Compact language dropdown. Trigger shows the active flag; the
 * menu offers both locales with flag + full label. Selecting an
 * option persists the choice in localStorage and navigates to the
 * sibling URL in the other locale tree.
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
  const CurrentFlag = current.Flag;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={lang === "de" ? "Sprache wählen" : "Select language"}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
      >
        <span className="block w-5 h-3.5 overflow-hidden rounded-[2px]">
          <CurrentFlag className="block w-full h-full" />
        </span>
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
          className="absolute right-0 top-full mt-4 min-w-[160px] overflow-hidden rounded-xl bg-[var(--color-card)] shadow-[0_12px_32px_-12px_rgba(5,15,104,0.28)] z-50"
        >
          {options.map((opt) => {
            const active = opt.code === lang;
            const OptionFlag = opt.Flag;
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
                  <span className="block w-6 h-4 overflow-hidden rounded-[2px] shrink-0">
                    <OptionFlag className="block w-full h-full" />
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
