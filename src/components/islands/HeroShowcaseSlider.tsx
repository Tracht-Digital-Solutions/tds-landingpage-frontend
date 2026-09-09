import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { HeroSlide } from "~/lib/heroSlides";

type Lang = "de" | "en";

/**
 * The hero's showcase slider — the reference cases and the live website demos,
 * one card at a time, in the hero's right column.
 *
 * ### What it is for
 *
 * The hero said what this business is ("Alles Digitale. Ein Ansprechpartner.")
 * and then sent the visitor down the page to find out whether any of it was
 * ever built. This answers that in the same screen: delivered work and demo
 * sites, each with its own picture, its own words and a link straight to it.
 *
 * Nothing here is new copy. The slides are resolved on the server
 * (`lib/heroSlides.ts`) from the same two sources the showcase shelf further
 * down the page reads, so the hero cannot advertise a case the shelf has
 * dropped or a demo that is currently unreachable.
 *
 * ### Two families, one card
 *
 * A case and a demo render identically on purpose. They are the same promise
 * to the visitor — here is something you can look at — and giving each its own
 * treatment in a box this size would read as two widgets rather than one
 * shelf. `HeroSlide.kind` survives only so the markup can be labelled.
 *
 * ### The tabs pattern, not a "carousel widget"
 *
 * Dots are `role="tab"`, panels are `role="tabpanel"`, and arrow keys move
 * between them with automatic activation. That is the pattern assistive tech
 * already knows, and it costs nothing over a bespoke one. Inactive panels stay
 * in the DOM (they are what gives the stage its height) and are taken out of
 * play with `inert` + `aria-hidden` rather than `hidden`, which would kill the
 * transition and collapse the box.
 *
 * ### Motion, and its off switch
 *
 * It advances on its own every 6 s, because a slider nobody notices is a
 * static card with dots. Anything that moves on its own for longer than five
 * seconds needs a way to stop it (WCAG 2.2.2), so there is a real pause
 * button — and it also stops on hover, on focus anywhere inside, and while the
 * tab is in the background, since a slide changing under a reader's cursor is
 * the actual complaint behind that rule.
 *
 * Under `prefers-reduced-motion` it never starts. The dots, the arrows and the
 * drag still work, so the content is fully reachable; it simply does not move
 * unless the visitor moves it. `reduced` starts as `true` and is resolved
 * after hydration: the server has no media query, and starting "in motion"
 * would run one rotation before the preference is known.
 */

const DRAG_THRESHOLD = 48;
const ROTATE_MS = 6000;

/**
 * The slider's own chrome. The words INSIDE a slide — its title, its sentence,
 * its link label — come with the slide from the server, because a demo's title
 * is the demo's and a case's result is the customer's.
 */
const ui: Record<
  Lang,
  { list: string; prev: string; next: string; pause: string; play: string; newTab: string }
> = {
  de: {
    list: "Beispiele und Referenzen",
    prev: "Vorheriges Beispiel",
    next: "Nächstes Beispiel",
    pause: "Automatischen Wechsel anhalten",
    play: "Automatischen Wechsel fortsetzen",
    newTab: "öffnet in neuem Tab",
  },
  en: {
    list: "Examples and references",
    prev: "Previous example",
    next: "Next example",
    pause: "Pause automatic rotation",
    play: "Resume automatic rotation",
    newTab: "opens in a new tab",
  },
};

export default function HeroShowcaseSlider({
  lang = "de",
  slides,
}: {
  lang?: Lang;
  slides: HeroSlide[];
}) {
  const t = ui[lang];
  const base = useId();

  const [index, setIndex] = useState(0);
  /** Which way the next panel comes in from. Only ever used for the offset. */
  const [direction, setDirection] = useState<1 | -1>(1);
  const [reduced, setReduced] = useState(true);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [backgrounded, setBackgrounded] = useState(false);

  const tabsRef = useRef<HTMLDivElement | null>(null);
  const dragFrom = useRef<{ x: number; y: number } | null>(null);

  const count = slides.length;

  const go = useCallback(
    (next: number, from: 1 | -1) => {
      if (count === 0) return;
      setDirection(from);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // Resolve the motion preference after hydration; see the note above.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  // A slider rotating in a tab nobody is looking at is only a way to arrive at
  // slide three with no idea how.
  useEffect(() => {
    const onVisibility = () => setBackgrounded(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const running = !reduced && !stopped && !hovered && !focused && !backgrounded && count > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % count);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [running, count]);

  if (count === 0) return null;

  /** Automatic activation: the arrow keys select, they do not merely move. */
  const onTabsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0 && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();

    const target =
      event.key === "Home" ? 0 : event.key === "End" ? count - 1 : index + step;
    go(target, step === -1 ? -1 : 1);

    // Focus follows selection, which is what "automatic activation" means; the
    // roving tabindex below has already made the new tab the focusable one.
    window.requestAnimationFrame(() => {
      tabsRef.current
        ?.querySelectorAll<HTMLButtonElement>("[role='tab']")
        [((target % count) + count) % count]?.focus();
    });
  };

  /**
   * Drag between slides.
   *
   * No `setPointerCapture` on `pointerdown` — capturing there swallows the
   * click that follows and takes every link inside the slide with it. The
   * gesture is measured on `pointerup` instead, and a movement that is mostly
   * vertical is left alone so a touch drag still scrolls the page.
   */
  const onPointerDown = (event: React.PointerEvent) => {
    dragFrom.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const from = dragFrom.current;
    dragFrom.current = null;
    if (!from) return;

    const dx = event.clientX - from.x;
    const dy = event.clientY - from.y;
    if (Math.abs(dx) < DRAG_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;

    go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="hero-slider"
      data-reduced={reduced ? "" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      <div
        className="hero-slider__stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragFrom.current = null;
        }}
      >
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <article
              key={slide.id}
              id={`${base}-panel-${slide.id}`}
              role="tabpanel"
              aria-labelledby={`${base}-tab-${slide.id}`}
              aria-hidden={active ? undefined : "true"}
              inert={!active}
              className="hero-slider__panel"
              data-kind={slide.kind}
              data-active={active ? "" : undefined}
              style={{ "--hero-slide-from": `${direction * 16}px` } as React.CSSProperties}
            >
              {slide.image && (
                /* A real screenshot of a real page, so it gets real alt text —
                   written on the server in the page's language, exactly as on
                   the demo card. This is not decoration. */
                <div className="hero-slider__shot">
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    width={slide.imageWidth ?? undefined}
                    height={slide.imageHeight ?? undefined}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}

              <div className="hero-slider__body">
                <p className="hero-slider__kind">{slide.eyebrow}</p>
                <h2 className="hero-slider__title">{slide.title}</h2>
                {/* A demo that publishes no meta description shows none —
                    an empty paragraph would still cost its line-height. */}
                {slide.summary !== "" && <p className="hero-slider__text">{slide.summary}</p>}

                {slide.chips.length > 0 && (
                  <ul className="hero-slider__chips">
                    {slide.chips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                )}

                <a
                  className="hero-slider__more"
                  href={slide.href}
                  {...(slide.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {slide.cta}
                  {/* The link leaves the site; a screen reader should hear so
                      before following it, and a sighted reader has the arrow. */}
                  {slide.external && <span className="sr-only"> ({t.newTab})</span>}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hero-slider__controls">
        <button
          type="button"
          className="hero-slider__arrow"
          onClick={() => go(index - 1, -1)}
          aria-label={t.prev}
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>

        <div
          className="hero-slider__dots"
          role="tablist"
          aria-label={t.list}
          ref={tabsRef}
          onKeyDown={onTabsKeyDown}
        >
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              id={`${base}-tab-${slide.id}`}
              role="tab"
              aria-selected={i === index}
              aria-controls={`${base}-panel-${slide.id}`}
              /* Roving tabindex: one stop for the whole set, then arrow keys. */
              tabIndex={i === index ? 0 : -1}
              className="hero-slider__dot"
              onClick={() => go(i, i > index ? 1 : -1)}
            >
              <span className="sr-only">{slide.title}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="hero-slider__arrow"
          onClick={() => go(index + 1, 1)}
          aria-label={t.next}
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>

        {/* Only where there is something to pause. Under reduced motion the
            slider never advances on its own, so a pause button would be a
            control for a thing that is not happening. */}
        {!reduced && count > 1 && (
          <button
            type="button"
            className="hero-slider__toggle"
            onClick={() => setStopped((value) => !value)}
            aria-label={stopped ? t.play : t.pause}
          >
            {stopped ? (
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="7" y="5" width="3.5" height="14" rx="1" />
                <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
