import { motion } from "motion/react";
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

/**
 * Staggered fade-up factory for the hero's entrance.
 *
 * Shortened from 0.7s/24px to 0.45s/12px with the "Digitale Maßarbeit"
 * pass: the brief rules out long intro animations, and a hero whose
 * headline is still travelling most of a second after paint reads as a
 * template's canned reveal rather than as a page that was simply ready.
 * Motion's `useReducedMotion` is not consulted here because it does not
 * need to be — `motion/react` already skips transitions entirely when
 * the user prefers reduced motion, landing every element on its
 * `animate` state immediately.
 */
function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease },
  };
}

/**
 * "Digitale Leitungsbahnen" — a short run of conduit with rounded 90°
 * corners and two nodes. Purely decorative, hence `aria-hidden`; the
 * `data-circuit-line` / `data-circuit-node` hooks and the `pathLength="1"`
 * are the contract `.tds-circuit--draw` in tds-shared animates against
 * (see the decoration layer in primitives.css).
 *
 * It is authored at a fixed 320×170 and NOT stretched: `preserveAspectRatio`
 * defaults to uniform scaling, and a squashed viewBox would turn the
 * carefully rounded corners into ellipses — which is precisely the
 * "organic blob" look the geometry exists to avoid.
 */
function CircuitRun({ className }: { className?: string }) {
  return (
    <span className={`tds-circuit tds-circuit--draw ${className ?? ""}`}>
      <svg viewBox="0 0 320 170" fill="none" aria-hidden="true" focusable="false">
        <path
          data-circuit-line
          pathLength="1"
          d="M0 150 H74 Q92 150 92 132 V58 Q92 40 110 40 H236"
        />
        <path
          data-circuit-line
          pathLength="1"
          d="M150 170 V116 Q150 98 168 98 H320"
        />
        <circle data-circuit-node cx="236" cy="40" r="4" />
        <circle data-circuit-node cx="92" cy="95" r="3" />
        <circle data-circuit-node cx="168" cy="98" r="3" />
      </svg>
    </span>
  );
}

type Lang = "de" | "en";

/**
 * Hero — full-viewport, on the warm "Digitale Maßarbeit" ground.
 *
 * WHAT REPLACED WHAT, so nobody restores it by accident. This used to be
 * a three-blob aurora: three blurred radial gradients on `mix-blend-multiply`,
 * each spring-following the cursor on X, parallaxing on Y at three
 * different rates, scaling with scroll, drifting on an infinite 17–24s
 * loop, over a 60px-blurred conic gradient that rotated with scroll and
 * pulsed its own opacity on a 12s loop, under a fractal-noise overlay.
 * It is exactly the "generischer bunter SaaS-Verlauf" + "zufällige
 * organische Blobs" + "starke Parallax-Effekte" the brand direction
 * rules out, and it cost a rAF-driven mousemove listener and eight
 * motion values on every page load for it.
 *
 * The replacement is CONSTRUCTED: soft brand fields at the outer edges
 * (`.tds-wash`, tds-shared), two large geometric shapes cut by the
 * viewport edge, one outlined rectangle, a single diagonal reference to
 * the logomark, and one run of conduit with three nodes. All of it is
 * static CSS from the shared decoration layer — the only motion left in
 * the hero is the entrance fade of the copy and the one-shot draw of the
 * conduit.
 *
 * Still `client:load`: the entrance animation and the CTA scroll
 * handlers want to be live immediately. The page passes `lang` via props
 * so the EN route hydrates with EN copy without a client-side swap.
 */
/** Editable hero copy — overrides the tds-shared default when the page
 *  passes an admin-edited block (fetched at build time). */
export type HeroContent = Partial<{
  headline: string;
  headlineAccent: string;
  headlineSuffix: string;
  tagline: string;
  sub: string;
  cta1: string;
  cta2: string;
  scrollHint: string;
}>;

export default function Hero({
  lang = "de",
  hero,
}: {
  lang?: Lang;
  hero?: HeroContent;
}) {
  const t = translations[lang];
  // Merge the edited block over the shared default so any missing field
  // falls back cleanly.
  const h = { ...t.hero, ...(hero ?? {}) };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Bounce-jump via Lenis when available; native smooth scroll otherwise.
    if (window.tdsScrollTo) window.tdsScrollTo(el);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="tds-wash relative min-h-svh flex flex-col justify-center overflow-hidden pt-20 pb-28"
      aria-label="Hero"
    >
      {/* Constructed brand geometry. Everything here is inside
          `.tds-decor`, which is inset-0, click-through and clipping — so
          each shape can be authored oversized and deliberately CUT by
          the viewport edge without ever producing horizontal overflow.
          Sizes and positions are compositional and therefore inline;
          the FORM and the tint come from the shared decoration layer. */}
      <div className="tds-decor" aria-hidden="true">
        {/* Große Kapsel, links angeschnitten — the anchor of the
            composition. `hidden md:block` is load-bearing, not a
            nicety: it is 38rem wide, so on a 375px screen the shape
            spans the whole viewport and the headline sits ON it rather
            than beside it. Verified at 375px, which is the only way to
            see it — the diff looks identical either way. */}
        <span
          className="tds-shape tds-shape--capsule tds-shape--navy hidden md:block"
          style={{ top: "9%", left: "-20rem", width: "38rem", height: "15rem" }}
        />
        {/* Viertelkreis unten rechts, über beide Ränder hinaus. */}
        <span
          className="tds-shape tds-shape--quarter-tl tds-shape--bordeaux"
          style={{
            bottom: "-9rem",
            right: "-7rem",
            width: "30rem",
            height: "30rem",
          }}
        />
        {/* Stark gerundetes Rechteck als reine Kontur — a drawn frame
            rather than a second filled mass. Hidden below `lg` because
            at tablet width it lands in the copy column. */}
        <span
          className="tds-shape tds-shape--rect tds-shape--outline tds-shape--navy hidden lg:block"
          style={{ top: "16%", right: "6%", width: "13rem", height: "22rem" }}
        />
        {/* Der eine diagonale Anschnitt — the logomark reference. One
            per screen, never across the content. */}
        <span
          className="tds-shape tds-shape--diagonal tds-shape--bordeaux hidden md:block"
          style={{ top: "-4rem", right: "26%", width: "1px", height: "20rem" }}
        />
        {/* Ein einzelner Ocker-Knoten als kleiner Überraschungsakzent. */}
        <span
          className="tds-shape tds-shape--capsule tds-shape--gold hidden md:block"
          style={{
            top: "72%",
            left: "12%",
            width: "0.5rem",
            height: "0.5rem",
            opacity: 0.9,
          }}
        />
        <CircuitRun className="hidden md:block bottom-[8%] right-[12%] w-[20rem] h-[10.6rem]" />
      </div>

      <div className="hero-body relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12 w-full text-center md:text-left">
        <motion.h1
          {...fadeUp(0.05)}
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[var(--font-display)] font-medium leading-[1.05] tracking-tight text-[var(--color-black)] mb-4 max-w-4xl mx-auto md:mx-0"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          {h.headline}{" "}
          {/* The accent word used to sit on a blurred pink/bordeaux
              ellipse. "Keine Dekoration direkt hinter Überschriften" —
              and it was also the one place the palette got loud, at the
              exact spot where legibility matters most. The word carries
              its own colour; it needs no halo. */}
          <span className="relative inline-block">
            <AccentLetters text={h.headlineAccent} />
          </span>{" "}
          {h.headlineSuffix}
        </motion.h1>

        {/* Third title-tier strapline — picks up secondary SEO
            (Beratung / Konzept / Code) the H1 doesn't carry. Sits
            directly under the H1, sized small enough to read as a
            supporting line. */}
        <motion.p
          {...fadeUp(0.07)}
          className="text-base sm:text-lg text-[var(--color-muted)] mb-4 max-w-2xl mx-auto md:mx-0"
        >
          {h.tagline}
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
          {h.sub}
        </motion.p>

        <motion.div
          {...fadeUp(0.15)}
          className="flex flex-wrap items-center justify-center md:justify-start gap-4"
        >
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className="px-7 py-3.5 text-sm font-medium text-white rounded-[100px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-12px_rgba(5,15,104,0.45)] bg-[var(--color-surface-navy)] hover:bg-[var(--color-surface-accent)] cursor-pointer"
          >
            {h.cta1}
          </button>
          <button
            type="button"
            onClick={() => scrollTo("services")}
            className="px-7 py-3.5 text-sm font-medium border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-card)_40%,transparent)] backdrop-blur-sm text-[var(--color-black)] rounded-[100px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
          >
            {h.cta2}
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
        aria-label={h.scrollHint}
      >
        <span>{h.scrollHint}</span>
        <span aria-hidden style={{ animation: "scrollHint 2s ease-in-out infinite" }}>↓</span>
      </motion.button>
    </section>
  );
}
