/**
 * Build-time OG image renderer for the marketing site's default
 * card. Satori turns a JSX-ish object tree into SVG; resvg-js
 * rasterises that SVG to PNG. Output lives at /og/default.png and
 * is referenced from every Layout.astro that doesn't override
 * `ogImage`.
 *
 * 1200×630 — the LinkedIn / Twitter Card size:
 *
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  TRACHT DIGITAL SOLUTIONS                                  │
 *   │                                                            │
 *   │  Digitale Lösungen, die                                    │
 *   │  wirklich passen.                                         │
 *   │                                                            │
 *   │  ─── tracht-digital.de             Schwarzenbek · Hamburg  │
 *   └────────────────────────────────────────────────────────────┘
 */
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// Resolved from the project root because Astro bundles this file into dist/,
// where `import.meta.url`-based relative paths no longer reach src/og/fonts.
const FONT_DIR = path.join(process.cwd(), "src/og/fonts");
let latoBold: Buffer | null = null;

function loadFonts() {
  if (latoBold === null) {
    latoBold = fs.readFileSync(path.join(FONT_DIR, "Lato-Bold.ttf"));
  }
  return {
    lato: latoBold!,
  };
}

const PAPER = "#fafaf7";
const INK = "#1a1a17";
const PRIMARY = "#050f68";
const ACCENT = "#820933";
const MUTED = "#6b6b66";

/**
 * The social card of one page: the brand eyebrow, the page's own headline and
 * the same footer line as the default card.
 *
 * A link to a platform page shared in a message or a post used to preview with
 * the brand motto, which says nothing about WooCommerce or TYPO3. Rendered at
 * build time like the default card (`pages/og/[lang]/[slug].png.ts`).
 */
export async function renderPageOgPng({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}): Promise<Buffer> {
  const { lato } = loadFonts();
  // Long headlines step down a size so they stay inside three lines.
  const fontSize = title.length > 44 ? 60 : 72;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPER,
          padding: "72px 80px",
          fontFamily: "Lato",
          color: INK,
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: "20px" },
              children: [
                { type: "div", props: { style: { width: "56px", height: "1px", backgroundColor: MUTED } } },
                {
                  type: "div",
                  props: {
                    style: {
                      fontFamily: "Lato",
                      fontSize: "20px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: MUTED,
                    },
                    children: eyebrow,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                fontFamily: "Lato",
                fontWeight: 700,
                fontSize: `${fontSize}px`,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: PRIMARY,
                marginTop: "28px",
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "40px",
                fontFamily: "Lato",
                fontSize: "22px",
                color: MUTED,
              },
              children: [
                {
                  type: "span",
                  props: { style: { color: ACCENT }, children: "Tracht Digital Solutions · tracht-digital.de" },
                },
                { type: "span", props: { children: "Schwarzenbek · Hamburg" } },
              ],
            },
          },
        ],
      },
    } as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Lato", data: lato, weight: 700, style: "normal" }],
    },
  );

  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

export async function renderDefaultOgPng(): Promise<Buffer> {
  const { lato } = loadFonts();

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPER,
          padding: "72px 80px",
          fontFamily: "Lato",
          color: INK,
        },
        children: [
          // Wordmark eyebrow
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "20px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { width: "56px", height: "1px", backgroundColor: MUTED },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontFamily: "Lato",
                      fontSize: "20px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: MUTED,
                    },
                    children: "Tracht Digital Solutions",
                  },
                },
              ],
            },
          },
          // Headline — head primary navy, accent word burgundy
          {
            type: "div",
            props: {
              style: {
                fontFamily: "Lato",
                fontWeight: 700,
                fontSize: "80px",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                color: PRIMARY,
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: "36px",
              },
              children: [
                {
                  type: "span",
                  props: { children: "Digitale Lösungen, die" },
                },
                {
                  type: "span",
                  props: {
                    style: { color: ACCENT },
                    children: "wirklich passen.",
                  },
                },
              ],
            },
          },
          // Footer: domain · location
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "48px",
                fontFamily: "Lato",
                fontSize: "22px",
                color: MUTED,
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: { color: INK },
                    children: "tracht-digital.de",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontFamily: "Lato",
                      fontSize: "22px",
                    },
                    children: "Schwarzenbek · Hamburg",
                  },
                },
              ],
            },
          },
        ],
      },
    } as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Lato", data: lato, weight: 700, style: "normal" },
      ],
    },
  );

  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();
}
