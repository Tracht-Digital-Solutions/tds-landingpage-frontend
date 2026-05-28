import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://tracht-digital.de",
  output: "static",
  integrations: [react(), sitemap()],
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
});
