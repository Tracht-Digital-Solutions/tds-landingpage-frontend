/**
 * The page ground's shapes, generated (2026-11-03).
 *
 * `components/PageGround.astro` draws the brand's constructed 3D bodies
 * (capsule, quarter, half, rounded rect — the tds-shared `.tds-shape`
 * primitives, face plus outline rings like the hero's) on the one fixed
 * ground of the page. This module decides WHERE: a seeded random layout, so
 * it is generated rather than hand-placed, yet identical on every render.
 * That matters on a site behind a full-page cache: a layout per request
 * would make the cached HTML differ for no reason.
 *
 * Three depth planes. Each plane is one TILE that `PageGround.astro` repeats
 * vertically and moves at its own speed when the page scrolls, so the
 * shapes pass by in parallax and the loop has no seam. A shape that crosses
 * the tile's lower edge is drawn whole by its own copy; the copy above
 * covers the top edge — so nothing here has to wrap.
 *
 * Positions are percentages of the viewport width (x) and of the tile
 * height (y); sizes are rem. All bodies keep to the outer bands
 * of the width, where the page's negative space is.
 */

export type GroundShapeKind = "capsule" | "quarter-tl" | "quarter-tr" | "quarter-br" | "quarter-bl" | "half" | "rect";
export type GroundShapeColour = "navy" | "bordeaux" | "coral" | "gold";
export type GroundPlaneId = "far" | "mid" | "near";

export interface GroundShape {
  kind: GroundShapeKind;
  colour: GroundShapeColour;
  /** Left edge, % of the viewport width. May be negative: cut by the edge. */
  x: number;
  /** Top edge, % of the tile height. */
  y: number;
  /** rem */
  width: number;
  /** rem */
  height: number;
  /** Resting pose, degrees. */
  rx: number;
  ry: number;
  /** Turn per scrolled pixel, degrees. */
  vx: number;
  vy: number;
}

export interface GroundPlane {
  id: GroundPlaneId;
  /** Tile offset per scrolled pixel: the parallax depth. */
  speed: number;
  shapes: GroundShape[];
}

export const GROUND_KINDS: readonly GroundShapeKind[] = [
  "capsule",
  "quarter-tl",
  "quarter-tr",
  "quarter-br",
  "quarter-bl",
  "half",
  "rect",
];
/** Navy is the structure, so it is drawn most often. */
const COLOURS: readonly GroundShapeColour[] = ["navy", "navy", "navy", "bordeaux", "bordeaux", "coral", "gold"];

interface PlaneSpec {
  id: GroundPlaneId;
  speed: number;
  count: number;
  size: [number, number];
  /** Left-edge bands, % of the width: [left band, right band]. */
  bands: [[number, number], [number, number]];
}

/* Few and large (2026-11-03): five bodies per tile in all, each big enough to
   read as a constructed 3D form, and all of them in the outer bands where the
   page's negative space is. The speeds give a clear parallax on scroll. */
const PLANES: readonly PlaneSpec[] = [
  { id: "far", speed: 0.14, count: 2, size: [6, 8.5], bands: [[-4, 16], [74, 92]] },
  { id: "mid", speed: 0.3, count: 2, size: [11, 14], bands: [[-10, 8], [80, 92]] },
  { id: "near", speed: 0.5, count: 1, size: [17, 22], bands: [[-14, 4], [84, 94]] },
];

export const GROUND_SEED = 0x7d5;

/** mulberry32 — small, fast, and the same numbers on every runtime. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value: number, places = 2) => Number(value.toFixed(places));

function proportions(kind: GroundShapeKind, size: number): [number, number] {
  if (kind === "capsule") return [size, size * 0.4];
  if (kind === "half") return [size, size / 2];
  if (kind === "rect") return [size, size * 0.72];
  return [size, size];
}

/** Minimum distance between two bodies of a plane, in the % space. */
const MIN_GAP = 26;

export function generateGround(seed = GROUND_SEED): GroundPlane[] {
  const random = seededRandom(seed);
  const pick = <T>(list: readonly T[]): T => list[Math.floor(random() * list.length)] as T;
  const between = (min: number, max: number) => min + random() * (max - min);
  const sign = () => (random() < 0.5 ? -1 : 1);

  return PLANES.map((spec) => {
    const shapes: GroundShape[] = [];
    // Spread the bodies down the tile: one per slice, jittered inside it, so
    // the loop never shows a long empty stretch or a cluster.
    const slice = 100 / spec.count;
    for (let index = 0; index < spec.count; index += 1) {
      let x = 0;
      let y = 0;
      for (let attempt = 0; attempt < 24; attempt += 1) {
        // Alternating sides on the edge planes keeps the composition balanced.
        const [left, right] = spec.bands;
        x = (index + Math.floor(random() * 2)) % 2 === 0 ? between(...left) : between(...right);
        y = index * slice + between(slice * 0.1, slice * 0.8);
        const clear = shapes.every((other) => Math.hypot(other.x - x, other.y - y) >= MIN_GAP);
        if (clear) break;
      }
      const kind = pick(GROUND_KINDS);
      const [width, height] = proportions(kind, between(spec.size[0], spec.size[1]));
      shapes.push({
        kind,
        colour: pick(COLOURS),
        x: round(x),
        y: round(y),
        width: round(width),
        height: round(height),
        rx: round(sign() * between(10, 22), 1),
        ry: round(sign() * between(18, 30), 1),
        vx: round(sign() * between(0.025, 0.05), 4),
        vy: round(sign() * between(0.035, 0.07), 4),
      });
    }
    return { id: spec.id, speed: spec.speed, shapes };
  });
}
