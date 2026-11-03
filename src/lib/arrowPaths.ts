/**
 * The chevron paths behind `components/ui/Arrow.astro` and `ui/Arrow.tsx`:
 * arrowheads without a shaft (2026-11-03), on a 24-unit grid.
 */
export type ArrowDirection = "right" | "left" | "up-right" | "down";

export const ARROW_PATHS: Record<ArrowDirection, string> = {
  right: "m9 6 6 6-6 6",
  left: "m15 6-6 6 6 6",
  "up-right": "M8.5 7.5h8v8",
  down: "m6 9 6 6 6-6",
};
