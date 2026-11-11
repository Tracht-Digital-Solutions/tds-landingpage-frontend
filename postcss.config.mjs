// Astro 6 ships Vite 7 with rolldown, which is incompatible with the
// @tailwindcss/vite plugin's expected resolver shape (withastro/astro#16542).
// The @tailwindcss/postcss variant runs Tailwind through PostCSS instead and
// sidesteps the rolldown plugin contract entirely.
//
// After Tailwind (which inlines tds-shared's stylesheets), the second plugin
// drops the shared component styles this site never renders — see
// scripts/postcss-drop-unused-shared.mjs.
import tailwind from "@tailwindcss/postcss";
import dropUnusedShared from "./scripts/postcss-drop-unused-shared.mjs";

export default {
  plugins: [tailwind(), dropUnusedShared()],
};
