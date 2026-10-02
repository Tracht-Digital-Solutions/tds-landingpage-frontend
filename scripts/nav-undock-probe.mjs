/**
 * The navigation bar's undock, sampled frame by frame.
 *
 *   node scripts/nav-undock-probe.mjs http://localhost:4321
 *
 * ### What it is for
 *
 * `.site-header::after` is a solid navy plate lying directly behind the glass
 * bar. In the steady state that is deliberate — the bar is 62–68% tint, so the
 * plate reads through it as a hard shadow. During the transition it is a trap:
 * if the plate's opacity outruns the glass fill above it, the bar is briefly a
 * navy slab under a faint wash. That was the 2026-10-02 report, "beim Scrollen
 * wird die Leiste kurz blau/dunkel", and it is invisible to every other check
 * here — axe does not look at mid-transition frames, and a screenshot taken
 * after the transition shows the correct end state.
 *
 * So this scrolls the page, samples both layers every ~16ms while the
 * transition runs, and reports the worst frame: how opaque the plate is at the
 * moment the glass above it is least able to hide it.
 *
 * It fails when the plate ever leads the glass. Both directions are measured —
 * a delay that fixes the undock re-creates the flash on the way back.
 */

const base = (process.argv[2] ?? "http://localhost:4321").replace(/\/$/, "");
const { chromium } = await import("playwright-core");

/**
 * A computed colour as `{ r, g, b, a }`, each 0..1.
 *
 * Chrome reports a transitioning colour in whatever space it is interpolating
 * in — `oklab(0 0 0 / 0)`, `color(srgb 0.98 0.98 0.97 / 0.4)`, `rgba(…)`. The
 * numbers are what matter here, not the space: the question is whether the
 * fill is heading for paper or for black.
 */
function parseColour(colour) {
  if (colour === "transparent") return { lightness: 0, a: 0 };
  const numbers = [...colour.matchAll(/-?\d*\.?\d+(?:e-?\d+)?/g)].map((m) => Number.parseFloat(m[0]));
  if (numbers.length < 3) return { lightness: 0, a: 1 };
  const a = numbers.length >= 4 ? numbers[3] : 1;

  // THE SPACE MATTERS, and getting it wrong is how this probe first reported a
  // bug that was already fixed. Chrome reports a colour mid-transition in the
  // space it is interpolating in, and for these values that is `oklab`, whose
  // FIRST component is the lightness — reading it as a red channel and running
  // the sRGB luminance formula over L, a, b turned a perfectly light paper
  // (L 0.984) into "0.21 lightness", a phantom 0.77 drop on every frame.
  if (/^oklab\(/.test(colour)) return { lightness: numbers[0], a };

  const isByte = /^rgba?\(/.test(colour);
  const [x, y, z] = numbers;
  const [r, g, b] = isByte ? [x / 255, y / 255, z / 255] : [x, y, z];
  return { lightness: 0.2126 * r + 0.7152 * g + 0.0722 * b, a };
}

/** Perceived lightness, 0 (black) .. 1 (white). */
const lightnessOf = (c) => c.lightness;

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--force-prefers-reduced-motion=no-preference"],
});
const failures = [];

for (const theme of ["light", "dark"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate((value) => document.documentElement.setAttribute("data-theme", value), theme);

  for (const direction of ["undock", "dock"]) {
    // Settle into the starting state without sampling it.
    await page.evaluate((y) => window.scrollTo(0, y), direction === "undock" ? 0 : 600);
    await page.waitForTimeout(600);

    const samples = await page.evaluate(async (y) => {
      const header = document.querySelector(".site-header");
      const read = () => ({
        t: performance.now(),
        plate: getComputedStyle(header, "::after").opacity,
        glass: getComputedStyle(header, "::before").backgroundColor,
      });
      const out = [];
      window.scrollTo(0, y);
      const started = performance.now();
      while (performance.now() - started < 520) {
        out.push(read());
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      return out;
    }, direction === "undock" ? 600 : 0);

    const label = `${theme}/${direction}`;
    const settled = parseColour(samples.at(-1).glass);

    /**
     * The alpha of the FILLED state, whichever end of the run that is.
     *
     * Normalising against the end of this particular direction is wrong and
     * was the probe's second false reading: docking ends at `transparent`, so
     * dividing by that end alpha made a plate that was correctly fading out
     * first look like a plate leading by 1.00. What the check is really asking
     * is "how far along is the glass towards being painted", and the painted
     * state is the maximum alpha the run ever shows.
     */
    const painted = Math.max(...samples.map((s) => parseColour(s.glass).a), 0.0001);

    // Two independent ways the bar can go dark mid-transition.
    let worstPlate = { lead: -Infinity };
    let worstHue = { drop: -Infinity };
    for (const sample of samples) {
      const plate = Number.parseFloat(sample.plate);
      const glass = parseColour(sample.glass);

      // 1. The shadow plate showing through a fill that has not arrived.
      const lead = plate - glass.a / painted;
      if (lead > worstPlate.lead) worstPlate = { lead, plate, alpha: glass.a };

      // 2. The fill itself interpolating through a darker colour than it ends
      //    on. `transparent` is BLACK at zero alpha, so a fade from it drags
      //    the hue down. Only frames with something actually painted count —
      //    the hue of a fully transparent colour is not on screen.
      //    Only meaningful while BOTH the frame and the end state are painted:
      //    comparing a lit frame against a transparent end state measures the
      //    end state's absence, not the frame's colour.
      if (glass.a > 0.02 && settled.a > 0.02) {
        const drop = lightnessOf(settled) - lightnessOf(glass);
        if (drop > worstHue.drop) worstHue = { drop, alpha: glass.a };
      }
    }

    console.log(
      `  ${label.padEnd(14)} plate lead ${worstPlate.lead.toFixed(2)} · ` +
        `darkest fill ${worstHue.drop === -Infinity ? "n/a" : worstHue.drop.toFixed(3)} below its end colour`,
    );

    // A small lead is unavoidable and invisible; a large one is the flash.
    if (worstPlate.lead > 0.35) {
      failures.push(`${label}: the shadow plate leads the glass by ${worstPlate.lead.toFixed(2)}`);
    }
    // The fill must never be meaningfully darker than the colour it ends on.
    if (worstHue.drop > 0.12) {
      failures.push(
        `${label}: the fill passes ${worstHue.drop.toFixed(3)} darker than its end colour — ` +
          "a docked state of `transparent` interpolates from black",
      );
    }
  }

  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.log("\nFailures:");
  for (const message of failures) console.log(`  x ${message}`);
  process.exit(1);
}
console.log("\nThe shadow plate never outruns the glass.");
