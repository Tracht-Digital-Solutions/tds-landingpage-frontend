import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The motion rules for this site, held as a source contract. None of these
 * fails visibly: a hero that ships `opacity:0` still looks fine on a fast
 * desktop, a document-wide `interpolate-size` still animates the FAQ, and a
 * focus effect that fires before the thank-you exists just leaves the focus
 * on <body>.
 */
const src = (path: string) => readFileSync(join(__dirname, "..", path), "utf8");

describe("motion on the landing page", () => {
  /**
   * The rule the 4.1s mobile LCP actually taught.
   *
   * The old hero island rendered Motion's `opacity:0` start state into the SSR
   * HTML for its eyebrow, headline, sub and buttons, so the first screen was
   * blank until React hydrated. The lesson is not "the hero may not animate" —
   * it is that nothing a visitor READS or LOOKS AT may wait on hydration.
   *
   * So: the copy and the photo stay plain Astro in `Hero.astro`, and the only
   * island it mounts is the decorative geometry, which is `aria-hidden` and
   * `hidden xl:block` — absent entirely on the device the incident was
   * measured on.
   */
  it("keeps the hero's copy and photo out of any animation runtime", () => {
    const hero = src("components/sections/Hero.astro");
    expect(hero).not.toMatch(/motion\/react|from ["']motion/);

    // Exactly one island, and it is the decoration.
    const hydrated = hero.match(/<(\w+)[^>]*client:(load|idle|visible|only|media)/g) ?? [];
    expect(hydrated).toHaveLength(1);
    expect(hydrated[0]).toContain("HeroDecor");
    // It loads at every width since 2026-09-21. It used to be gated on
    // `client:media="(min-width: 64rem)"`, because below that the shapes were
    // hidden and the island bought a phone nothing — but that also meant a
    // phone had NO motion in the hero at all. The shapes render everywhere
    // now, so the gate is gone; the ~129 KB it costs there is watched by
    // `npm run audit:perf` rather than by a directive.
    expect(hero).toContain("<HeroDecor client:idle />");

    // The things that must still be server-rendered text and markup.
    expect(hero).toContain("<h1");
    expect(hero).toContain("<picture>");
    for (const field of ["hero.headline", "hero.eyebrow", "hero.sub", "hero.cta1"]) {
      expect(hero, `${field} must render in Astro`).toContain(field);
    }
  });

  /**
   * The headline animates as ONE block, and this is the guard on that.
   *
   * A per-word stagger was built and measured out again: each word has to be
   * `inline-block` for a transform to apply, which (a) fragmented the H1 into
   * nine small LCP candidates so `p#hero-sub` took its place as the largest
   * paint, and (b) removed every opportunity for `hyphens: auto` to break a
   * long German word, which is the one thing the H1's own comment says it
   * must keep doing.
   */
  it("does not split the headline into transformable fragments", () => {
    const hero = src("components/sections/Hero.astro");
    const markup = hero.slice(hero.indexOf("<h1"), hero.indexOf("</h1>"));
    expect(markup).not.toMatch(/hero-word/);
    expect(markup).not.toMatch(/\.split\(/);
    // The properties that need an unbroken text block to work on.
    expect(hero).toMatch(/hyphens:\s*auto/);
    expect(hero).toMatch(/overflow-wrap:\s*break-word/);
  });

  it("lets the hero decoration animate, but nothing it renders is read", () => {
    const decor = src("components/islands/HeroDecor.tsx");
    // Through tds-shared, never a bare `motion` import — same rule as the form.
    expect(decor).toContain('from "@tracht-digital-solutions/tds-shared/motion/react"');
    expect(decor).not.toMatch(/from ["'](motion|framer-motion)["']/);
    // Decoration only: no text, no image, no control. Checked against the
    // code with its comments stripped — the file's own documentation names
    // `<picture>` as the thing that stays in Astro, and a naive grep reads
    // that mention as a violation of the rule it is explaining.
    const code = decor.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    expect(code).not.toMatch(/<(img|picture|h[1-6]|a|button|p)[\s>/]/);
    // It must have a branch that mounts no animation at all under reduced
    // motion — a zero duration still costs the listener and the frames.
    expect(decor).toContain("prefers-reduced-motion: reduce");
  });

  it("opens FAQ answers through tds-shared's disclosure, not a local copy", () => {
    const faq = src("components/ui/FaqAccordion.astro");
    expect(faq).toContain('class="faq-item tds-disclosure"');
    expect(faq).not.toContain("::details-content {");
    // Scoped by .tds-disclosure now; a document-wide switch is not needed.
    expect(src("styles/global.css")).not.toMatch(/^\s*interpolate-size:/m);
  });

  it("cross-fades between pages with the shared stylesheet", () => {
    expect(src("styles/global.css")).toContain(
      '@import "@tracht-digital-solutions/tds-shared/styles/page-transitions.css";',
    );
  });

  /**
   * The site's own half of the page transition.
   *
   * The shared stylesheet is opacity-only and says why: the header is
   * identical across a navigation, so moving the root snapshot moves the
   * chrome with it. Naming the chrome takes it out of that snapshot, which is
   * what makes the content's rise safe — the two rules are one mechanism and
   * removing either one silently breaks the other. Without the names, the
   * whole page lurches; without the rise, the names buy nothing.
   */
  it("holds the chrome still and moves only the content", () => {
    const css = src("styles/global.css");
    expect(css).toMatch(/\.site-header\s*\{\s*view-transition-name:\s*lp-site-header/);
    expect(css).toMatch(/\.site-footer\s*\{\s*view-transition-name:\s*lp-site-footer/);
    expect(css).toContain("animation-name: tds-page-in, lp-page-rise;");
    expect(css).toMatch(/@keyframes lp-page-rise/);

    // Every rule of this mechanism has to carry the `page` type: ThemeToggle
    // animates the same root pseudo-elements from JS for its theme wipe, and
    // that transition has no type. An unscoped rule would join it.
    // Comments stripped from the WHOLE file before looking, and no slicing:
    // the section marker itself lives inside a comment, so cutting there
    // starts the text mid-comment and every later `*/` pairs with the wrong
    // `/*` — which left the prose that explains this very rule looking like a
    // selector that breaks it.
    for (const line of css.replace(/\/\*[\s\S]*?\*\//g, "").split("\n")) {
      if (line.includes("::view-transition-")) {
        expect(line, "unscoped view-transition rule").toContain(
          "active-view-transition-type(page)",
        );
      }
    }
  });

  it("switches page transitions on inline, first in <head>", () => {
    // With the rule only in the stylesheet — linked at the end of a long
    // head — Chrome decided the opt-in too early and skipped the transition.
    const layout = src("layouts/Layout.astro");
    const head = layout.slice(layout.indexOf("<head>"));
    expect(head).toContain("<style is:inline set:html={pageTransitionOptIn} />");
    expect(head.indexOf("pageTransitionOptIn")).toBeLessThan(head.indexOf("themeBootstrapScript"));
  });

  it("animates the contact form only through the shared primitives", () => {
    const form = src("components/islands/ContactForm.tsx");
    expect(form).toContain('from "@tracht-digital-solutions/tds-shared/motion/react"');
    expect(form).not.toMatch(/from ["'](motion|framer-motion)/);
  });

  it("focuses the thank-you as it mounts, not from an effect", () => {
    // The thank-you fades in AFTER the form has faded out; an effect keyed on
    // the submit state runs while the heading does not exist yet.
    const form = src("components/islands/ContactForm.tsx");
    expect(form).toContain("ref={(el) => el?.focus()}");
    expect(form).not.toContain("successHeadingRef");
  });

  it("bundles motion into the server build", () => {
    expect(src("../astro.config.mjs")).toContain("...motionSsrNoExternal");
  });
});
