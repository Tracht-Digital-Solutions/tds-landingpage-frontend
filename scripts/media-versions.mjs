import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * `virtual:media-versions` — a content hash for every screenshot this site
 * republishes under an UNCHANGING name.
 *
 * `/demos/demo1.webp` keeps its name when `npm run demos:sync` captures it
 * again, and `.htaccess` lets browsers keep `/demos`, `/references` and
 * `/images` for a week (`TDS_MEDIA`). So a new screenshot reached nobody who
 * had seen the old one: reloading showed the old picture for up to seven days.
 * Renaming on every sync would break the sync scripts' ownership of their
 * folders; a `?v=<hash>` does not — Apache serves the same file, and the
 * browser cache keys on the full URL.
 *
 * Hashing the BYTES (not a sync timestamp) means the version changes exactly
 * when the picture does, whoever replaced it and however.
 *
 * Used by `astro.config.mjs` and `vitest.config.ts`; read through
 * `mediaSrc()` in `src/lib/imageVariants.ts`.
 */
const ROOTS = ["demos", "references", "images/business-card.webp"];
const MEDIA = /\.(webp|png|jpe?g|avif|gif|svg|ico)$/i;

function walk(path) {
  if (!existsSync(path)) return [];
  if (statSync(path).isDirectory()) return readdirSync(path).flatMap((name) => walk(join(path, name)));
  return MEDIA.test(path) ? [path] : [];
}

export function mediaVersions(publicDir) {
  const versions = {};
  for (const root of ROOTS) {
    for (const file of walk(join(publicDir, root))) {
      const url = `/${relative(publicDir, file).split(sep).join("/")}`;
      versions[url] = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 10);
    }
  }
  return versions;
}

export function mediaVersionsPlugin(publicDir) {
  const id = "virtual:media-versions";
  const resolved = `\0${id}`;
  return {
    name: "tds-media-versions",
    resolveId(source) {
      return source === id ? resolved : null;
    },
    load(source) {
      if (source !== resolved) return null;
      return `export default ${JSON.stringify(mediaVersions(publicDir))};`;
    },
  };
}
