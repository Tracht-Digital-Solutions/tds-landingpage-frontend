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
const LINE = "#e8e6df";

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
                borderTop: `1px solid ${LINE}`,
                paddingTop: "32px",
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
