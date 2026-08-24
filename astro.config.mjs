import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
// Shared CSS minify settings (incl. the cssTarget that keeps lightningcss
// from dropping the header backdrop-filter prefix). See tds-shared#10.
import { tdsViteBuild } from "@tracht-digital-solutions/tds-shared/astro";
import { siteKeyGuard } from "./src/lib/siteKey";

export default defineConfig({
  site: "https://tracht-digital.de",

  // ─── Server-rendered, behind a file-backed page cache ───────────────────
  //
  // This site used to be `output: "static"`, and the repo AGENTS.md used to
  // forbid anything else on the grounds that the production host has no Node
  // runtime. That is no longer true: the Plesk host runs the site as a Node
  // app under Passenger (see DEPLOY-PLESK.md).
  //
  // Why the change: the ONLY cache between the CMS database and a visitor used
  // to be the static build itself, so correcting one sentence in a content
  // block meant a full CI rebuild and redeploy of every page. Now a page
  // renders on demand and the result is stored as a plain file the web server
  // serves directly — a hit costs exactly what the static file cost, because
  // it is one — and a content change costs one page render, triggered from the
  // admin panel.
  //
  // What did NOT change: everything that cannot vary with content stays
  // prerendered (`export const prerender = true`) — the OG card, the error
  // pages, /install, the vCard, the legal PDFs and the sitemap. That is what
  // keeps satori, @resvg/resvg-js and their native addon out of the runtime.
  output: "server",
  adapter: node({
    mode: "standalone",
    // The cache writer needs a complete body before it can store a page, and
    // a streamed response behind a proxy buys nothing here anyway.
    experimentalDisableStreaming: true,
  }),

  integrations: [
    react(),
    // Fails the build when TDS_SITE_KEY was rejected. It has to live here,
    // not in the fetch helpers: every content fetch is wrapped in a
    // fail-soft try/catch, and a throw from inside one is swallowed — a
    // real build against a 401 stub printed the abort message five times
    // and then completed green. astro:build:done runs outside all of them.
    //
    // NOTE: with content now fetched at REQUEST time, this guard only covers
    // whatever the prerendered routes read. The runtime counterpart is in
    // src/lib/siteKey.ts: a rejected key fails the cache WRITE, so a bad key
    // can never be baked into a stored page.
    siteKeyGuard(),
    // @astrojs/sitemap is deliberately gone. It derives its entries from the
    // BUILT routes, and under `output: "server"` the two indexable pages of
    // this site are no longer built — it would have emitted a sitemap holding
    // only the pages its own `filter` used to exclude, with nothing red
    // anywhere. src/pages/sitemap-*.xml.ts replaces it; those routes are
    // prerendered, because this site's route set only changes with a deploy.
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
    ssr: {
      // Bundle the first-party and pure-JS packages INTO dist/server.
      //
      // This is what removes the host's need to run `npm install` against
      // GitHub Packages: without it the server bundle keeps bare
      // `@tracht-digital-solutions/…` imports and the production host would
      // need a PAT with read:packages to boot at all.
      //
      // Enumerated rather than `noExternal: true` — the blanket form drags in
      // CJS-only packages and anything touching Node builtins, and the Rollup
      // pass fails in ways whose message points nowhere near the cause.
      //
      // The island libraries are bundled too, and not only to shrink the
      // shipped tree: left external, `motion` resolved `react` by walking UP
      // out of the release directory into the development checkout's
      // node_modules, so island SSR ran against a SECOND React instance and
      // every hook threw "Cannot read properties of null (reading 'useState')".
      // On the host, where there is no parent node_modules, the same setup
      // fails with a bare ERR_MODULE_NOT_FOUND instead. Bundling them leaves
      // exactly one React — the shipped one.
      noExternal: [
        /^@tracht-digital-solutions\//,
        "marked",
        "zod",
        // The whole motion family in one pattern: `motion` re-exports
        // `framer-motion`, which in turn imports `motion-dom` and
        // `motion-utils`. Listing them one at a time meant three rebuilds,
        // each revealing the next name.
        /^(framer-)?motion(-dom|-utils)?$/,
        "lenis",
        "react-hook-form",
        /^@hookform\//,
      ],
      // Native addons cannot be bundled; sharp must resolve from node_modules.
      external: ["sharp"],
    },
  },
});
