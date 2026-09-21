import versions from "virtual:media-versions";

/**
 * A republished screenshot's URL with its content version: `/demos/demo1.webp`
 * → `/demos/demo1.webp?v=3f9a…`.
 *
 * The files keep their names across `demos:sync`, `references:sync` and
 * `businesscard:sync`, and browsers may keep them for a week — so without the
 * version a new capture did not show on reload. The hash is of the bytes
 * (`scripts/media-versions.mjs`), so it changes exactly when the picture does.
 * A path without a known version is returned unchanged.
 *
 * Separate from `imageVariants.ts` on purpose: that module has no imports,
 * because the sync scripts run it under plain Node.
 */
export function mediaSrc(path: string): string {
  const version = versions[path];
  return version ? `${path}?v=${version}` : path;
}
