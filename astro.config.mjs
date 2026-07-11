import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
// Shared CSS minify settings (incl. the cssTarget that keeps lightningcss
// from dropping the header backdrop-filter prefix). See tds-shared#10.
import { tdsViteBuild } from "@tracht-digital-solutions/tds-shared/astro";

export default defineConfig({
  site: "https://tracht-digital.de",
  output: "static",
  integrations: [
    react(),
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
