import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
// Shared CSS minify settings (incl. the cssTarget that keeps lightningcss
// from dropping the header backdrop-filter prefix). See tds-shared#10.
import { tdsViteBuild } from "@tracht-digital-solutions/tds-shared/astro";
import { siteKeyGuard } from "./src/lib/siteKey";

export default defineConfig({
  site: "https://tracht-digital.de",
  output: "static",
  integrations: [
    react(),
    // Fails the build when TDS_SITE_KEY was rejected. It has to live here,
    // not in the fetch helpers: every content fetch is wrapped in a
    // fail-soft try/catch, and a throw from inside one is swallowed — a
    // real build against a 401 stub printed the abort message five times
    // and then completed green. astro:build:done runs outside all of them.
    siteKeyGuard(),
    sitemap({
      // Emit xhtml:link hreflang alternates into the sitemap. Safe here
      // because every indexable route has an exact /en/ twin (legal pages
      // are noindex and filtered below) — do NOT copy this option to the
      // blog, whose routes don't mirror by prefix (/kategorie vs /en/category).
      i18n: {
        defaultLocale: "de",
        locales: { de: "de-DE", en: "en-GB" },
      },
      // Keep noindex legal pages, the OG endpoint, the vCard file and error
      // pages out.
      filter: (page) =>
        // `/install` is an operator page: noindex, and it has no /en/ twin, so
        // the i18n option above would emit an hreflang alternate pointing at a
        // 404 — which invalidates the whole set, this page's German side
        // included. It was invisible here while it was a public/ directory.
        !page.includes("/install") &&
        !page.includes("/legal/") &&
        !page.includes("/og/") &&
        !page.includes(".vcf") &&
        !page.includes("/404") &&
        !page.includes("/500"),
    }),
  ],
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  trailingSlash: "ignore",
  build: {
    format: "directory",
    // Inline small stylesheets into <head> so the critical CSS
    // ships in the initial HTML and the browser doesn't have to
    // round-trip for a separate .css file before paint.
    inlineStylesheets: "auto",
  },
  // Astro's default image service is `sharp`. Pinning it
  // explicitly + raising the quality default so future `<Image />`
  // consumers don't need to repeat the q value at every site.
  // WebP at 82 / AVIF at 55 are the convention captured in
  // IMAGES.md — keep them in sync.
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },
  vite: {
    build: { ...tdsViteBuild },
  },
});
