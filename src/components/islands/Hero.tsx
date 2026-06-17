import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { translations } from "@tracht-digital-solutions/tds-shared/i18n";
import { ease } from "@tracht-digital-solutions/tds-shared/motion";

/**
 * Inline mirror of `src/components/ui/AccentLetters.astro` for use
 * inside this React island. Styles live globally in global.css under
 * `.accent-letters / .accent-letter` so both versions render identically.
 */
function AccentLetters({
  text,
  tone = "light",
}: {
  text: string;
  tone?: "light" | "dark";
}) {
  return (
    <span aria-label={text} className="accent-letters" data-tone={tone}>
      {Array.from(text).map((char, i) => (
        <span key={i} aria-hidden="true" className="accent-letter">
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

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

  // X axis tracks the cursor (spring-damped per layer for depth).
  // Y axis is now scroll-driven — the blobs translate vertically with
  // scroll and horizontally with the cursor, which reads as proper 3D drift.
  const mouseX = useMotionValue(0);
  const blob1X = useSpring(mouseX, { stiffness: 20, damping: 30 });
  const blob2X = useSpring(mouseX, { stiffness: 15, damping: 35 });
  const blob3X = useSpring(mouseX, { stiffness: 12, damping: 28 });

  // Scroll-linked parallax. Each layer translates and scales at a
  // different rate so the aurora moves visibly while the user
  // scrolls. The base conic gradient rotates and pans as well so
  // the whole hero background reads as alive without overpowering
  // the cursor parallax.
  const { scrollY } = useScroll();
  const parallaxBack = useTransform(scrollY, [0, 800], [0, -160]);
  const parallaxMid = useTransform(scrollY, [0, 800], [0, -260]);
  const parallaxFront = useTransform(scrollY, [0, 800], [0, -360]);
  const blob1Scale = useTransform(scrollY, [0, 800], [1, 1.15]);
  const blob2Scale = useTransform(scrollY, [0, 800], [1, 0.9]);
  const blob3Scale = useTransform(scrollY, [0, 800], [1, 1.25]);
  const conicRotate = useTransform(scrollY, [0, 1200], [0, 60]);
  const conicY = useTransform(scrollY, [0, 800], [0, -80]);

  // Ambient drift — a slow, autonomous float on each blob so the
  // aurora stays alive even with no cursor movement or scrolling
  // (touch devices, or a visitor who's just reading). Applied to the
  // inner gradient layer so it composes on top of the cursor (x) and
  // scroll (y/scale) transforms on the wrapper rather than fighting
  // them. Honour prefers-reduced-motion by dropping the loop entirely.
  const prefersReduced = useReducedMotion();
  const drift = (
    keyframes: { x: number[]; y: number[]; scale: number[] },
    duration: number,
  ) =>
    prefersReduced
      ? undefined
      : {
          animate: keyframes,
          transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
        };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.width / 2;
      mouseX.set(((e.clientX - rect.left - cx) / cx) * 30);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-svh flex flex-col justify-center overflow-hidden pt-20 pb-28"
      aria-label="Hero"
    >
      <motion.div
        aria-hidden
        className="absolute -inset-20 pointer-events-none"
        style={{
          rotate: conicRotate,
          y: conicY,
          background:
            "conic-gradient(from 220deg at 70% 30%, rgba(5,15,104,0.08), rgba(255,122,156,0.06), rgba(130,9,51,0.07), rgba(5,15,104,0.08))",
          filter: "blur(60px)",
        }}
        animate={prefersReduced ? undefined : { opacity: [0.45, 0.68, 0.45] }}
        transition={
          prefersReduced
            ? undefined
            : { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }
        initial={{ opacity: 0.6 }}
      />

      <motion.div
        style={{ x: blob1X, y: parallaxBack, scale: blob1Scale }}
        className="absolute top-[15%] -left-40 w-[640px] h-[640px] rounded-full pointer-events-none mix-blend-multiply"
        aria-hidden
      >
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(5,15,104,0.22) 0%, rgba(5,15,104,0.05) 45%, transparent 70%)",
          }}
          {...drift({ x: [0, 30, -20, 0], y: [0, 25, -15, 0], scale: [1, 1.06, 0.97, 1] }, 20)}
        />
      </motion.div>

      <motion.div
        style={{ x: blob2X, y: parallaxMid, scale: blob2Scale }}
        className="absolute bottom-[10%] -right-40 w-[560px] h-[560px] rounded-full pointer-events-none mix-blend-multiply"
        aria-hidden
      >
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(130,9,51,0.20) 0%, rgba(130,9,51,0.05) 45%, transparent 70%)",
          }}
          {...drift({ x: [0, -35, 20, 0], y: [0, -20, 25, 0], scale: [1, 0.95, 1.05, 1] }, 24)}
        />
      </motion.div>

      <motion.div
        style={{ x: blob3X, y: parallaxFront, scale: blob3Scale }}
        className="absolute top-[40%] left-[35%] w-[440px] h-[440px] rounded-full pointer-events-none mix-blend-multiply"
        aria-hidden
      >
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,122,156,0.22) 0%, rgba(255,122,156,0.06) 45%, transparent 70%)",
          }}
          {...drift({ x: [0, 25, -30, 0], y: [0, 30, -10, 0], scale: [1, 1.08, 0.94, 1] }, 17)}
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

      <div className="hero-body relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12 w-full text-center md:text-left">
        <motion.h1
          {...fadeUp(0.05)}
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[var(--font-display)] font-medium leading-[1.05] tracking-tight text-[var(--color-black)] mb-4 max-w-4xl mx-auto md:mx-0"
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
            <AccentLetters text={t.hero.headlineAccent} />
          </span>{" "}
          {t.hero.headlineSuffix}
        </motion.h1>

        {/* Third title-tier strapline — picks up secondary SEO
            (Beratung / Konzept / Code) the H1 doesn't carry. Sits
            directly under the H1, sized small enough to read as a
            supporting line. */}
        <motion.p
          {...fadeUp(0.07)}
          className="text-base sm:text-lg text-[var(--color-muted)] mb-4 max-w-2xl mx-auto md:mx-0"
        >
          {t.hero.tagline}
        </motion.p>

        {/* Second main title — brand slogan picked up from
            tds-shared. Sits between the H1 strapline and the sub
            paragraph, sized smaller than the h1 but still display-
            tier so it reads as a secondary banner rather than an
            eyebrow. */}
        <motion.p
          {...fadeUp(0.08)}
          className="hero-slogan text-xl sm:text-2xl md:text-3xl font-[var(--font-display)] italic text-[var(--color-accent)] mb-6 max-w-3xl leading-snug mx-auto md:mx-0"
        >
          {t.footer.slogan}
        </motion.p>

        <motion.p
          {...fadeUp(0.1)}
          className="text-base md:text-lg text-[var(--color-muted)] max-w-2xl mb-8 leading-relaxed mx-auto md:mx-0"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          {...fadeUp(0.15)}
          className="flex flex-wrap items-center justify-center md:justify-start gap-4"
        >
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className="px-7 py-3.5 text-sm font-medium text-white rounded-[100px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(5,15,104,0.28)] bg-[var(--color-surface-navy)] hover:bg-[var(--color-surface-accent)] cursor-pointer"
          >
            {t.hero.cta1}
          </button>
          <button
            type="button"
            onClick={() => scrollTo("services")}
            className="px-7 py-3.5 text-sm font-medium border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-card)_40%,transparent)] backdrop-blur-sm text-[var(--color-black)] rounded-[100px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer p-2 rounded-md"
        aria-label={t.hero.scrollHint}
      >
        <span>{t.hero.scrollHint}</span>
        <span aria-hidden style={{ animation: "scrollHint 2s ease-in-out infinite" }}>↓</span>
      </motion.button>
    </section>
  );
}
