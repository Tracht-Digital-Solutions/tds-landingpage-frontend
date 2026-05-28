import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { translations } from "@tracht-digital-solutions/tds-shared/i18n";
import { ease } from "@tracht-digital-solutions/tds-shared/motion";

/** Staggered fade-up factory for hero entrance animations. */
function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  };
}

type Lang = "de" | "en";

/**
 * Hero — full-viewport with a colourful three-blob aurora that drifts
 * behind the cursor. Ported from legacy tds-lp/app/components/sections/Hero.tsx.
 *
 * Renders as `client:load` so the parallax + entrance animations happen
 * immediately on page load. The page passes `lang` via props so the EN
 * route hydrates with EN copy without a client-side swap.
 */
export default function Hero({ lang = "de" }: { lang?: Lang }) {
  const t = translations[lang];
  const containerRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const blob1X = useSpring(mouseX, { stiffness: 20, damping: 30 });
  const blob1Y = useSpring(mouseY, { stiffness: 20, damping: 30 });
  const blob2X = useSpring(mouseX, { stiffness: 15, damping: 35 });
  const blob2Y = useSpring(mouseY, { stiffness: 15, damping: 35 });
  const blob3X = useSpring(mouseX, { stiffness: 12, damping: 28 });
  const blob3Y = useSpring(mouseY, { stiffness: 12, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      mouseX.set(((e.clientX - rect.left - cx) / cx) * 30);
      mouseY.set(((e.clientY - rect.top - cy) / cy) * 30);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
      aria-label="Hero"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "conic-gradient(from 220deg at 70% 30%, rgba(5,15,104,0.08), rgba(255,122,156,0.06), rgba(130,9,51,0.07), rgba(5,15,104,0.08))",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        className="absolute top-[15%] -left-40 w-[640px] h-[640px] rounded-full pointer-events-none mix-blend-multiply"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(5,15,104,0.22) 0%, rgba(5,15,104,0.05) 45%, transparent 70%)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        className="absolute bottom-[10%] -right-40 w-[560px] h-[560px] rounded-full pointer-events-none mix-blend-multiply"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(130,9,51,0.20) 0%, rgba(130,9,51,0.05) 45%, transparent 70%)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ x: blob3X, y: blob3Y }}
        className="absolute top-[40%] left-[35%] w-[440px] h-[440px] rounded-full pointer-events-none mix-blend-multiply"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,122,156,0.22) 0%, rgba(255,122,156,0.06) 45%, transparent 70%)",
          }}
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-24 w-full">
        <motion.div
          {...fadeUp(0)}
          className="inline-flex items-center gap-3 mb-8 text-sm text-[var(--color-muted)] pl-1.5 pr-3.5 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-[var(--color-line)]"
        >
          <span className="flex items-center gap-2">
            <span
              className="pulse-dot inline-block w-2 h-2 rounded-full bg-[var(--color-accent)]"
              aria-hidden
            />
            {t.hero.availability}
          </span>
          <span className="text-[var(--color-line)]" aria-hidden>
            ·
          </span>
          <span>{t.hero.location}</span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.05)}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-[var(--font-display)] font-medium leading-tight tracking-tight text-[var(--color-black)] mb-6 max-w-4xl"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          {t.hero.headline}{" "}
          <span className="relative inline-block">
            <span
              aria-hidden
              className="absolute inset-0 -z-10 blur-2xl opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,122,156,0.55) 0%, rgba(130,9,51,0.25) 60%, transparent 80%)",
              }}
            />
            <em className="not-italic italic text-[var(--color-accent)]">
              {t.hero.headlineAccent}
            </em>
          </span>{" "}
          {t.hero.headlineSuffix}
        </motion.h1>

        <motion.p
          {...fadeUp(0.1)}
          className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mb-10 leading-relaxed"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          {...fadeUp(0.15)}
          className="flex flex-wrap items-center gap-4"
        >
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className="px-7 py-3.5 text-sm font-medium text-white rounded-[100px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(5,15,104,0.28)] bg-[var(--color-primary)] hover:bg-[var(--color-accent)] cursor-pointer"
          >
            {t.hero.cta1}
          </button>
          <button
            type="button"
            onClick={() => scrollTo("services")}
            className="px-7 py-3.5 text-sm font-medium border border-[var(--color-line)] bg-white/40 backdrop-blur-sm text-[var(--color-black)] rounded-[100px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
          >
            {t.hero.cta2}
          </button>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollTo("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ y: -2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer p-2 rounded-md"
        aria-label={t.hero.scrollHint}
      >
        <span>{t.hero.scrollHint}</span>
        <span aria-hidden style={{ animation: "scrollHint 2s ease-in-out infinite" }}>↓</span>
      </motion.button>
    </section>
  );
}
