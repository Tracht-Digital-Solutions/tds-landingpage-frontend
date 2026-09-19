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
  it("keeps the hero free of any animation runtime", () => {
    // The hero island once rendered Motion's `opacity:0` start state into the
    // SSR HTML and became its own mobile LCP (4.1s). It is plain Astro now.
    const hero = src("components/sections/Hero.astro");
    expect(hero).not.toMatch(/motion\/react|from ["']motion/);
    expect(hero).not.toMatch(/client:(load|idle|visible|only)/);
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
