/**
 * Contrast, measured from RENDERED PIXELS.
 *
 * ### Why this exists
 *
 * The glass pass (2026-09-29) gave the CTAs, the contact card and the bookmarks
 * a translucent fill over a `backdrop-filter`. Nothing in the toolchain can
 * check those from computed styles:
 *
 * - axe's `color-contrast` rule gives up when it cannot resolve what is behind
 *   the text and files the result under `incomplete`, which is not a violation.
 *   `ux-audit.mjs` used to drop `incomplete` entirely, so a button whose text
 *   had stopped being legible still printed "axe 0 violations".
 * - A `color-mix(… 88%, transparent)` fill has no single colour to compare
 *   against. What the reader sees is the composite of the fill, the blur, and
 *   whatever the page put behind it at that scroll position.
 *
 * So: screenshot the element, take the pixels, and compute the ratio between
 * its text colour and the actual background it was painted onto. Slow and
 * narrow on purpose — it answers one question the fast tools cannot.
 *
 * ### How a background is sampled
 *
 * Glyph pixels are not background, so the statistic has to be one they cannot
 * move: the MODE — the most common colour in the element, quantised to 4 bits a
 * channel. A fill is one flat colour covering most of the box; type is many
 * colours (anti-aliasing) covering less. So the mode is the fill, whatever the
 * glyph coverage.
 *
 * The median was the first attempt and it is wrong for small elements. It works
 * on a button, where glyphs are a small fraction of the box, and fails on a nav
 * link or a form label, where they are a large one: the first run reported
 * 2.13:1 on a header link whose muted-grey-on-paper is 5:1, and 1.34:1 on a
 * label, because the median had slid into the anti-aliased edge of the type.
 * Both were the tool, not the page.
 *
 * The text colour comes from the computed style, where it is a real opaque
 * value.
 *
 * Usage:
 *   node scripts/contrast-probe.mjs http://localhost:4321/
 *   npm run audit:contrast -- http://localhost:4321/
 */
import { chromium } from "playwright-core";

const base = (process.argv[2] ?? "http://localhost:4321/").replace(/\/$/, "");

/**
 * What to probe, and at which scroll position.
 *
 * `scrollTo` matters as much as the selector: a glass element's contrast is a
 * property of what is behind it, so a CTA over the hero photo and the same CTA
 * over flat paper are two different measurements. Each entry names the worst
 * case that could be found by hand.
 */
const PROBES = [
  // The CTAs are component classes and utilities, never `.btn` — see the note
  // in `global.css` above the glass rules.
  { label: "hero CTA over the photo", selector: ".hero-cta--primary", scrollTo: 0 },
  { label: "hero secondary CTA", selector: ".hero-cta--secondary", scrollTo: 0 },
  { label: "contact submit", selector: "#contact .submit-button", scrollTo: "#contact" },
  { label: "contact card e-mail row", selector: "#contact .contact-way", scrollTo: "#contact" },
  { label: "contact card address", selector: "#contact .contact-card__address", scrollTo: "#contact" },
  { label: "contact action button", selector: "#contact .contact-action", scrollTo: "#contact" },
  { label: "contact field label", selector: "#contact .contact-field-row label", scrollTo: "#contact" },
  { label: "header link (scrolled)", selector: "#site-header nav a[href*='#']", scrollTo: "#preise" },
  /**
   * NOT probed: the bookmarks (`.property-tab`).
   *
   * A parked tab is deliberately translated most of the way off the left edge of
   * the window, inside a container that clips it. An element screenshot of one
   * captures mostly the page BEHIND it, so the median it yields is the page's
   * luminance and not the tab's — a first run reported 1.37:1 on a tab whose
   * white-on-navy label is nowhere near that. Measuring it honestly means
   * sampling a fixed rectangle of the viewport while the tab is held out, which
   * is a different tool; it is checked by hand in the browser instead.
   */
];

/** WCAG relative luminance from 8-bit sRGB. */
function luminance(r, g, b) {
  const channel = (value) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a, b) {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

function parseColor(value) {
  const nums = value.match(/[\d.]+/g);
  if (!nums || nums.length < 3) return null;
  return [Number(nums[0]), Number(nums[1]), Number(nums[2])];
}

/** Luminance of the most common colour in a PNG buffer, decoded in the browser. */
async function backgroundLuminance(page, shot) {
  const base64 = shot.toString("base64");
  return page.evaluate(async (data) => {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = `data:image/png;base64,${data}`;
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    const { data: pixels } = context.getImageData(0, 0, canvas.width, canvas.height);

    // Histogram over 4-bit-per-channel buckets. Coarse on purpose: a blurred
    // backdrop makes a fill very slightly uneven, and 8-bit buckets would split
    // one flat surface across dozens of neighbours and hand the mode to the type.
    const counts = new Map();
    for (let i = 0; i < pixels.length; i += 4) {
      const key =
        ((pixels[i] >> 4) << 8) | ((pixels[i + 1] >> 4) << 4) | (pixels[i + 2] >> 4);
      const entry = counts.get(key);
      if (entry) {
        entry.n += 1;
        entry.r += pixels[i];
        entry.g += pixels[i + 1];
        entry.b += pixels[i + 2];
      } else {
        counts.set(key, { n: 1, r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] });
      }
    }
    let best = null;
    for (const entry of counts.values()) if (!best || entry.n > best.n) best = entry;

    const channel = (value) => {
      const v = value / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    // The bucket's own average, so the answer is a real colour rather than the
    // corner of a 16-wide box.
    const rgb = [
      Math.round(best.r / best.n),
      Math.round(best.g / best.n),
      Math.round(best.b / best.n),
    ];
    return {
      luminance:
        0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]),
      // Printed with every result: a ratio on its own cannot tell a page
      // problem from a sampling problem, and this line is what separates them.
      rgb,
      share: best.n / (pixels.length / 4),
    };
  }, base64);
}

let failures = 0;

async function probeTheme(browser, theme) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme,
    // Transitions mid-measurement would sample a half-faded fill.
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.emulateMedia({ colorScheme: theme });
  // The toggle writes `data-theme`; the media emulation alone does not, and the
  // site reads the attribute.
  await page.evaluate((next) => document.documentElement.setAttribute("data-theme", next), theme);

  console.log(`\n${theme}`);
  for (const probe of PROBES) {
    if (typeof probe.scrollTo === "number") {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), probe.scrollTo);
    } else {
      const target = await page.$(probe.scrollTo);
      if (target) await target.scrollIntoViewIfNeeded();
    }
    // The header's docking and the reveal both settle within a few frames.
    await page.waitForTimeout(400);

    const element = await page.$(probe.selector);
    if (!element) {
      console.log(`  · ${probe.label}: not found (${probe.selector})`);
      continue;
    }
    if (probe.hover) {
      await element.hover();
      await page.waitForTimeout(500);
    }
    const box = await element.boundingBox();
    if (!box || box.width < 4 || box.height < 4) {
      console.log(`  · ${probe.label}: not visible`);
      continue;
    }

    const color = await element.evaluate((node) => getComputedStyle(node).color);
    const rgb = parseColor(color);
    if (!rgb) {
      console.log(`  · ${probe.label}: could not read its colour (${color})`);
      continue;
    }
    const shot = await element.screenshot();
    const sample = await backgroundLuminance(page, shot);
    const text = luminance(rgb[0], rgb[1], rgb[2]);
    const value = ratio(text, sample.luminance);

    // 4.5:1 for normal text; a CTA's label is 13px, so the large-text
    // allowance (3:1) never applies to anything probed here.
    const ok = value >= 4.5;
    if (!ok) failures += 1;
    console.log(
      `  ${ok ? "·" : "✗"} ${probe.label}: ${value.toFixed(2)}:1` +
        `  text ${rgb.join(",")} on ${sample.rgb.join(",")}` +
        ` (${Math.round(sample.share * 100)}% of the box)` +
        `${ok ? "" : " — below 4.5:1"}`,
    );
  }
  await context.close();
}

const browser = await chromium.launch({ channel: "chrome" });
try {
  await probeTheme(browser, "light");
  await probeTheme(browser, "dark");
} finally {
  await browser.close();
}

if (failures > 0) {
  console.error(`\n✗ ${failures} probe(s) below 4.5:1`);
  process.exit(1);
}
console.log("\n✓ every probe at or above 4.5:1");
