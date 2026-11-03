import { ARROW_PATHS, type ArrowDirection } from "~/lib/arrowPaths";

/** The island twin of `Arrow.astro`: a chevron without a shaft. */
export default function Arrow({ dir = "right", className }: { dir?: ArrowDirection; className?: string }) {
  return (
    <svg
      className={className ? `lp-arrow ${className}` : "lp-arrow"}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ARROW_PATHS[dir]} />
    </svg>
  );
}
