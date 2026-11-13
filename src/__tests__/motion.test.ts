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
  it("keeps the hero's copy out of any animation runtime", () => {
    const hero = src("components/sections/Hero.astro");
    expect(hero).not.toMatch(/motion\/react|from ["']motion/);

    // No island at all since 2026-10-22: the decoration is markup here and
    // moves through the vanilla motion layer (`lib/motion/heroDecor.ts`), so
    // the first screen loads no React.
    const hydrated = hero.match(/<(\w+)[^>]*client:\w+/g) ?? [];
    expect(hydrated).toEqual([]);
    // No decoration of its own since 2026-11-03: the page ground shows through.
    expect(hero).not.toMatch(/tds-decor|hero-shape|CircuitRun/);

    // The things that must still be server-rendered text and markup.
    expect(hero).toContain("<h1");
    // No photo ground since 2026-11-03: it covered the page ground's shapes.
    expect(hero).not.toContain("<picture>");
    // Title, lead, slogan and two buttons (2026-11-13), nothing else.
    for (const field of ["{title}", "{lead}", "{slogan}", "{cta1}", "{cta2}"]) {
      expect(hero, `${field} must render in Astro`).toContain(field);
    }
    expect(hero).not.toMatch(/hero-trust|hero-sub|hero-eyebrow|hero-note/);
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
    // Balance + hyphens split "Lösungen" on phones; short words stay whole.
    expect(hero).toMatch(/hyphenate-limit-chars:\s*12/);
  });

  it("moves the page ground's shapes with scroll and pointer, never from <html>", () => {
    const ground = src("lib/motion/groundScroll.ts");
    expect(ground).not.toMatch(/from ["'](motion|framer-motion)["']/);
    expect(src("lib/motion/boot.ts")).toContain("groundScroll.mountGroundScroll(dom)");
    // Written onto the ground layer only: an inherited property on <html>
    // restyles the whole page (docs/agents/motion.md, jank rules).
    expect(ground).not.toMatch(/documentElement\.style\.setProperty/);
    expect(ground).toContain('ground.style.setProperty("--lp-ground-y"');
    // The live motion switch stops it, and the frame loop parks when settled.
    expect(ground).toContain("data-a11y-motion");
    expect(ground).toMatch(/cancelAnimationFrame|settled/);
    // Decoration only: the layer holds no readable content.
    const layer = src("components/PageGround.astro");
    expect(layer).toContain('aria-hidden="true"');
    expect(layer).not.toMatch(/<(img|picture|h[1-6]|a|button|p)[\s>/]/);
  });

  it("opens FAQ answers through tds-shared's disclosure, not a local copy", () => {
    const faq = src("components/ui/FaqAccordion.astro");
    expect(faq).toContain('class="faq-item tds-disclosure"');
    expect(faq).not.toContain("::details-content {");
    // Scoped by .tds-disclosure now; a document-wide switch is not needed.
    expect(src("styles/global.css")).not.toMatch(/^\s*interpolate-size:/m);
  });

  /**
   * Page transitions are Motion's since 2026-09-21 (`lib/motion/pageTransition.ts`).
   * The native cross-document View Transition is gone — two mechanisms on one
   * navigation would play two animations.
   */
  it("animates page changes with Motion, not a native View Transition", () => {
    const css = src("styles/global.css");
    expect(css).not.toContain("page-transitions.css");
    expect(css.replace(/\/\*[\s\S]*?\*\//g, "")).not.toMatch(/view-transition/);
    const layout = src("layouts/Layout.astro");
    expect(layout).not.toContain("pageTransitionOptIn");
    // The hand-over script runs first in <head>, before the body paints.
    const head = layout.slice(layout.indexOf("<head>"));
    expect(head).toContain("<script is:inline set:html={PAGE_ENTER_SCRIPT} />");
    expect(head.indexOf("PAGE_ENTER_SCRIPT")).toBeLessThan(head.indexOf("themeBootstrapScript"));
  });

  it("never leaves the incoming page hidden", () => {
    // The start state exists only under the attribute, and a failsafe
    // keyframe shows <main> whatever happens to the script.
    const css = src("styles/global.css");
    expect(css).toMatch(/html\[data-page-enter\] #main \{[^}]*animation: lp-enter-failsafe/);
    expect(css).toMatch(/@keyframes lp-enter-failsafe \{\s*to \{\s*opacity: 1;/);
    // The flag is set only after an internal click, and never under reduced motion.
    expect(src("lib/motion/constants.ts")).toContain("prefers-reduced-motion: reduce");
    expect(src("lib/motion/pageTransition.ts")).toContain('addEventListener("pageshow"');
  });

  /**
   * Every modal bounces in AND out through one helper (2026-09-21), shows one
   * flat colour behind it, and closes with a bare cross.
   */
  it("animates every modal through lib/motion/dialog.ts", () => {
    for (const file of ["components/ServiceAssistant.astro", "components/ui/PreviewLightbox.astro"]) {
      const code = src(file);
      expect(code, file).toContain('import { animatedDialog } from "~/lib/motion/dialog"');
      // No raw open/close left that would skip the animation.
      const script = code.slice(code.indexOf("<script>"));
      expect(script, file).not.toMatch(/dialog\.(showModal|close)\(\)/);
      // The cross has no chip behind it.
      expect(code, file).toMatch(/__close \{[^}]*background: none;/);
      // One flat colour behind the dialog.
      expect(code, file).toMatch(/::backdrop \{[^}]*background: var\(--color-surface-navy\);/);
    }
    const helper = src("lib/motion/dialog.ts");
    expect(helper).toContain('addEventListener("cancel"');
    expect(helper).toContain("prefers-reduced-motion: reduce");
    expect(helper).toMatch(/setTimeout\(finish/);
  });

  it("keeps the header out of every animation", () => {
    // It holds still because it is not inside <main>, the only thing the
    // transition moves.
    const header = src("components/Header.astro");
    expect(header).not.toMatch(/data-cta|data-motion-image/);
    expect(src("lib/motion/pageTransition.ts")).toContain('getElementById("main")');
  });

  it("loads the Motion runtime lazily, through tds-shared, and not under reduced motion", () => {
    const boot = src("lib/motion/boot.ts");
    expect(boot).toContain('import("@tracht-digital-solutions/tds-shared/motion/dom")');
    expect(boot).not.toMatch(/^import .*motion\/dom/m);
    expect(boot).toContain("prefers-reduced-motion: reduce");
    for (const file of ["boot", "cta", "images", "pageTransition", "businessCard", "ux", "tilt"]) {
      const code = src(`lib/motion/${file}.ts`);
      expect(code, file).not.toMatch(/from ["'](motion|framer-motion)["']/);
    }
  });

  it("gives the generated photos and the CTA their Motion hooks", () => {
    for (const file of ["components/sections/Contact.astro", "components/ui/ServiceCard.astro"]) {
      expect(src(file), file).toContain("data-motion-image");
    }
    // Nothing photographic lies on the page ground (2026-11-03): it would cover
    // the generated shapes of `components/PageGround.astro`.
    for (const file of [
      "components/sections/Hero.astro",
      "components/sections/About.astro",
      "components/detail/DetailHero.astro",
    ]) {
      expect(src(file), file).not.toContain("data-motion-image");
    }
    expect(src("components/sections/Hero.astro")).toMatch(/hero-cta--primary" data-cta/);
    // Start states come from JS, off screen only — never from the markup.
    expect(src("lib/motion/images.ts")).toContain("onScreen(image)");
    expect(src("lib/motion/ux.ts")).toContain("onScreen(group)");
  });

  it("tilts the interactive cards in depth, under a fine pointer only", () => {
    expect(src("components/ui/ProjectCard.astro")).toContain("data-motion-tilt");
    const tilt = src("lib/motion/tilt.ts");
    expect(tilt).toContain("hasFinePointer()");
    // Transform only: a transitioned box-shadow is ruled out in design.md.
    expect(tilt).not.toMatch(/boxShadow|box-shadow:/);
    expect(src("lib/motion/boot.ts")).toContain('import("./tilt")');
  });

  it("plays the process scenes once, from finished markup, never under less motion", () => {
    const scene = src("components/ui/ProcessScene.astro");
    // The markup is the finished picture: no attribute, no motion.
    expect(scene).toContain('<div class="ps" data-process-scene aria-hidden="true">');
    // Every animation sits behind the OS setting and the site's switch, and none loops.
    expect(scene).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(scene).toContain("html:not([data-a11y-motion])");
    expect(scene).not.toMatch(/infinite/);
    expect(scene).not.toMatch(/gradient|box-shadow|blur\(/);
    const process = src("components/sections/Process.astro");
    expect(process).toContain("lessMotion()");
    // The first frame is only written while the row is off screen.
    expect(process).toMatch(/box\.bottom <= 0 \|\| box\.top >= window\.innerHeight[\s\S]*?"armed"/);
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
