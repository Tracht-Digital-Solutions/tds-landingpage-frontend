declare module "virtual:media-versions" {
  /** Public URL → short content hash. See scripts/media-versions.mjs. */
  const versions: Record<string, string>;
  export default versions;
}
