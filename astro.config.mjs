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
  },
});
