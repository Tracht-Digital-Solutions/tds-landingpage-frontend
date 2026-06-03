import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://tracht-digital.de",
  output: "static",
  integrations: [react(), sitemap()],
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
    build: {
      // Minify CSS aggressively (default is `esbuild`; `lightningcss`
      // shaves a few more bytes off the production bundle).
      cssMinify: "lightningcss",
      // The lightningcss minify step derives its prefixing targets from
      // `cssTarget` (it ignores `css.lightningcss.targets`). Vite's
      // default baseline includes Firefox versions that predate any
      // `backdrop-filter` support, so lightningcss concludes only the
      // `-webkit-` prefix is needed and DROPS the unprefixed
      // declaration — killing the frosted nav blur in Firefox, which
      // only supports the standard property (since FF 103). Pinning a
      // Firefox target that supports it forces lightningcss to keep BOTH
      // the standard and `-webkit-` declarations; safari15 keeps the
      // `-webkit-` prefix for Safari.
      cssTarget: ["chrome90", "edge90", "firefox103", "safari15"],
    },
  },
});
