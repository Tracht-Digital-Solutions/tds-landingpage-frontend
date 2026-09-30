/**
 * The behaviour a unit test cannot see and a screenshot cannot settle.
 *
 *   npm run audit:chrome -- http://localhost:4321
 *
 * Every check here guards something that failed, or could fail, in complete
 * silence — a green suite and a plausible-looking page either way:
 *
 * - **A parked bookmark** is a 20px strip at the very edge of a 1440px window.
 *   Its icon was 6 of 22 pixels on screen for a week (`--tab-bleed` was
 *   subtracted from the peek), and nothing about that is visible in a diff, in a
 *   full-page screenshot or in `propertyTabs.test.ts`, which can only assert the
 *   arithmetic. This measures the icon's real position.
 * - **The header's shadow** is a pseudo-element's `translate` and `opacity` in
 *   two scroll states, layered against a `::before` that carries the glass. The
 *   layering is the part that bit: `z-index: -1` does not go behind a parent that
 *   forms a stacking context, so the plate painted OVER the bar until the fill
 *   moved to `::before`. Asserted as paint order, not as a look.
 * - **The theme preview** exists only while the toggle is hovered. That it is a
 *   radial-gradient and not a `clip-path` is the whole antialiasing argument, and
 *   it is one property.
 * - **The shelf has to stay endless with motion switched off.** That is the
 *   reported white gap, and the one state a normal run never enters.
 * - **The contact rows have to be the whole link.** A row that is only clickable
 *   on its text looks identical.
 *
 * Run it against a preview whose page cache has been cleared
 * (`rm -rf var/page-cache`) — a stale cached page will happily pass or fail on
 * markup that is no longer in the build.
 */
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:4321";
const browser = await chromium.launch({ channel: "chrome" });
const out = [];
const check = (label, ok, detail) => out.push(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? " — " + detail : ""}`);

// ── 1. Bookmarks: is the whole icon on screen while parked? ──────────────────
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const tabs = await page.evaluate(() => {
    const out = [];
    for (const tab of document.querySelectorAll(".property-tab")) {
      const icon = tab.querySelector(".property-tab__icon");
      if (!icon) continue;
      const r = icon.getBoundingClientRect();
      out.push({
        label: tab.textContent.trim().split("\n")[0],
        iconLeft: Math.round(r.left),
        iconRight: Math.round(r.right),
        tabRight: Math.round(tab.getBoundingClientRect().right),
      });
    }
    return out;
  });
  if (tabs.length === 0) check("bookmarks render at 1440", false, "none found");
  for (const tab of tabs) {
    check(
      `bookmark icon fully on screen: ${tab.label}`,
      tab.iconLeft >= 0,
      `icon x ${tab.iconLeft}…${tab.iconRight}, tab right edge ${tab.tabRight}`,
    );
  }
  await context.close();
}

// ── 2. Header: does the shadow plate retract when docked? ────────────────────
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const readPlate = () =>
    page.evaluate(() => {
      const header = document.getElementById("site-header");
      const plate = getComputedStyle(header, "::after");
      const glass = getComputedStyle(header, "::before");
      return {
        scrolled: header.dataset.scrolled,
        plateTranslate: plate.translate || plate.getPropertyValue("translate"),
        plateOpacity: plate.opacity,
        plateBg: plate.backgroundColor,
        headerBg: getComputedStyle(header).backgroundColor,
        glassBg: glass.backgroundColor,
        glassFilter: glass.backdropFilter,
        glassZ: glass.zIndex,
        plateZ: plate.zIndex,
      };
    });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(600);
  const docked = await readPlate();
  await page.evaluate(() => window.scrollTo({ top: 1400, behavior: "instant" }));
  await page.waitForTimeout(900);
  const away = await readPlate();

  check("header docked at top", docked.scrolled === "false", `data-scrolled=${docked.scrolled}`);
  check("plate hidden while docked", Number(docked.plateOpacity) === 0, `opacity ${docked.plateOpacity}, translate ${docked.plateTranslate}`);
  check("plate shown when scrolled", Number(away.plateOpacity) === 1, `opacity ${away.plateOpacity}, translate ${away.plateTranslate}`);
  check("plate offset is the hard shadow's", /3px/.test(away.plateTranslate), away.plateTranslate);
  check("the element itself has no fill", /rgba\(0, 0, 0, 0\)|transparent/.test(away.headerBg), away.headerBg);
  check("the glass is on ::before", away.glassFilter.includes("blur"), `${away.glassBg} / ${away.glassFilter}`);
  check("plate paints behind the glass", Number(away.plateZ) < Number(away.glassZ), `plate z${away.plateZ} < glass z${away.glassZ}`);
  await context.close();
}

// ── 3. The theme toggle's hover preview ─────────────────────────────────────
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  /**
   * Scrolled to a KNOWN-LIGHT part of the page before hovering.
   *
   * At the top the bar is docked and transparent over the hero photograph, which
   * is itself dark (L 0.15 behind the bar). A preview measured there compares a
   * dark patch against a dark ground and says almost nothing — the first run of
   * the check below read 0.052 inside against 0.147 outside and looked like a
   * failure. y=1600 is inside the services section, flat paper.
   */
  await page.evaluate(() => window.scrollTo({ top: 1600, behavior: "instant" }));
  await page.waitForTimeout(1500);
  const toggle = await page.$(".tds-theme-toggle");
  if (!toggle) {
    check("theme toggle present", false);
  } else {
    await toggle.hover();
    await page.waitForTimeout(400);
    const shown = await page.evaluate(() => {
      const el = document.querySelector(".tds-theme-preview");
      if (!el) return null;
      const style = getComputedStyle(el);
      return {
        visible: el.getAttribute("data-visible"),
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
        hidden: el.getAttribute("aria-hidden"),
        // A gradient, never a clip — the whole antialiasing argument.
        usesGradient: style.backgroundImage.includes("radial-gradient"),
        usesClip: style.clipPath !== "none",
        x: el.style.getPropertyValue("--tds-theme-preview-x"),
        y: el.style.getPropertyValue("--tds-theme-preview-y"),
        z: style.zIndex,
      };
    });
    check("preview appears on hover", shown !== null);
    if (shown) {
      check("preview is a gradient, not a clip", shown.usesGradient && !shown.usesClip, `gradient=${shown.usesGradient} clip=${shown.usesClip}`);
      check("preview takes no pointer", shown.pointerEvents === "none" && shown.hidden === "true");
      check("preview is positioned at the cursor", shown.x !== "" && shown.y !== "", `${shown.x} ${shown.y}`);
      check("preview clears the fixed header", Number(shown.z) > 40, `z-index ${shown.z}`);

      /**
       * The RENDERED edge, scanned out from the centre along one row.
       *
       * Asked for as a hard edge (2026-09-30) and drawn as a 1.5px gradient step
       * rather than a `clip-path`, so that it looks hard without the rim
       * staircasing and crawling as the pointer moves. Neither half of that is
       * visible in the CSS alone: a stop written in the wrong unit, or a stray
       * `background-size`, softens it back to the smudge this replaced and
       * nothing else would notice.
       *
       * The radius has to be resolved through layout — `getPropertyValue` on a
       * custom property returns the written `clamp(...)`, not a length.
       */
      const edge = await page.evaluate(() => {
        const el = document.querySelector(".tds-theme-preview");
        const probe = document.createElement("div");
        probe.style.cssText =
          "position:absolute;visibility:hidden;width:var(--tds-theme-preview-r)";
        el.appendChild(probe);
        const r = probe.getBoundingClientRect().width;
        probe.remove();
        return {
          r,
          x: parseFloat(el.style.getPropertyValue("--tds-theme-preview-x")),
          y: parseFloat(el.style.getPropertyValue("--tds-theme-preview-y")),
        };
      });
      const cx = Math.round(edge.x);
      const cy = Math.round(edge.y);
      const radius = Math.round(edge.r);
      /**
       * Scan toward whichever side has room for the whole radius plus a margin.
       *
       * The toggle sits at the right end of the bar, so the circle around it runs
       * off the right edge of the viewport — a rightward scan never leaves the
       * circle and reports the ground as "outside", which read as the preview
       * being lighter outside than in. Leftward there is always the width of the
       * page.
       */
      const room = 12;
      const dir = cx + radius + room <= 1440 ? 1 : -1;
      const x0 = dir === 1 ? cx : Math.max(0, cx - radius - room);
      const width = dir === 1 ? Math.min(radius + room, 1440 - cx) : cx - x0;
      if (width > radius && cy >= 1) {
        const strip = await page.screenshot({
          clip: { x: x0, y: cy - 1, width, height: 3 },
        });
        const scan = await page.evaluate(async (data) => {
          const image = new Image();
          await new Promise((r) => {
            image.onload = r;
            image.src = `data:image/png;base64,${data}`;
          });
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext("2d", { willReadFrequently: true });
          context.drawImage(image, 0, 0);
          const pixels = context.getImageData(0, 1, canvas.width, 1).data;
          const out = [];
          for (let i = 0; i < pixels.length; i += 4) {
            const ch = (v) => {
              v /= 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            };
            out.push(
              0.2126 * ch(pixels[i]) + 0.7152 * ch(pixels[i + 1]) + 0.0722 * ch(pixels[i + 2]),
            );
          }
          return out;
        }, strip.toString("base64"));

        // Walk outward from the centre, in whichever direction was chosen.
        const centre = dir === 1 ? 0 : scan.length - 1;
        const ray = [];
        for (let step = 0; step < scan.length; step++) {
          ray.push(scan[centre + dir * step]);
        }
        const inside = ray[0];
        const outside = ray[ray.length - 1];
        const mid = (inside + outside) / 2;
        let from = null;
        let to = null;
        for (let i = 0; i < ray.length; i++) {
          if (from === null && ray[i] > inside + (mid - inside) * 0.1) from = i;
          if (from !== null && ray[i] > outside - (outside - mid) * 0.1) {
            to = i;
            break;
          }
        }
        const rim = from !== null && to !== null ? to - from : null;
        check(
          "preview edge is hard (≤3px)",
          rim !== null && rim <= 3,
          rim === null ? "no rim found" : `${rim}px at ${radius}px radius`,
        );
        // And the region really is the other theme's ground, not a light dim.
        check(
          "preview really is dark inside",
          inside < 0.12 && outside > 0.4,
          `L ${inside.toFixed(3)} inside → ${outside.toFixed(3)} outside`,
        );
      }
    }
    // Move away: it has to go.
    await page.mouse.move(700, 600);
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => {
      const el = document.querySelector(".tds-theme-preview");
      return el ? el.getAttribute("data-visible") : "removed";
    });
    check("preview ends with the hover", after === "removed" || after === null, `state: ${after}`);
  }
  await context.close();
}

// ── 4. The shelf wraps with motion switched OFF ─────────────────────────────
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const shelf = await page.$("[data-carousel] .showcase__track, .showcase__track");
  if (!shelf) {
    check("shelf found", false);
  } else {
    await shelf.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    const state = await page.evaluate(() => {
      const track = document.querySelector(".showcase__track");
      return {
        children: track.children.length,
        clones: track.querySelectorAll(".showcase__slide--clone").length,
        autoplay: track.classList.contains("is-autoplay"),
        scrollWidth: track.scrollWidth,
        clientWidth: track.clientWidth,
      };
    });
    check("clones exist under reduced motion", state.clones > 0, `${state.clones} clones of ${state.children} slides`);
    check("no drift under reduced motion", state.autoplay === false, `is-autoplay=${state.autoplay}`);

    // Push it past the wrap point by hand and see whether it comes back.
    const wrapped = await page.evaluate(async () => {
      const track = document.querySelector(".showcase__track");
      const originals = [...track.children].filter((c) => !c.classList.contains("showcase__slide--clone"));
      const firstClone = track.querySelector(".showcase__slide--clone");
      if (!firstClone) return { loop: 0 };
      const loop = firstClone.offsetLeft - originals[0].offsetLeft;
      track.scrollLeft = loop + 40;
      await new Promise((r) => setTimeout(r, 300));
      return { loop, after: track.scrollLeft };
    });
    check(
      "a hand scroll past the set wraps back",
      wrapped.loop > 0 && wrapped.after < wrapped.loop,
      `loop ${wrapped.loop}px, pushed to ${wrapped.loop + 40}, landed at ${Math.round(wrapped.after)}`,
    );
  }
  await context.close();
}

// ── 5. The contact card ─────────────────────────────────────────────────────
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const card = await page.$("#contact .contact-card");
  if (!card) check("contact card present", false);
  else {
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const rows = await page.evaluate(() => {
      const card = document.querySelector("#contact .contact-card");
      const cardWidth = card.getBoundingClientRect().width;
      return [...card.querySelectorAll(".contact-way")].map((a) => {
        const r = a.getBoundingClientRect();
        return {
          href: a.getAttribute("href").slice(0, 28),
          width: Math.round(r.width),
          height: Math.round(r.height),
          share: r.width / cardWidth,
        };
      });
    });
    check("three ways to reach a person", rows.length === 3, rows.map((r) => r.href).join(", "));
    for (const row of rows) {
      check(
        `row is the whole link: ${row.href}`,
        row.share > 0.9 && row.height >= 44,
        `${row.width}×${row.height}px, ${Math.round(row.share * 100)}% of the card`,
      );
    }
    const glass = await page.evaluate(() => {
      const s = getComputedStyle(document.querySelector("#contact .contact-card"));
      const f = getComputedStyle(document.querySelector("#contact .contact-form-card"));
      return { card: s.backdropFilter, form: f.backdropFilter };
    });
    check("both cards are glass", glass.card.includes("blur") && glass.form.includes("blur"), `${glass.card} / ${glass.form}`);
    await context.close();
  }
}

await browser.close();
console.log(out.join("\n"));
const failed = out.filter((l) => l.startsWith("FAIL")).length;
console.log(`\n${failed === 0 ? "✓ all checks passed" : `✗ ${failed} check(s) failed`}`);
process.exit(failed === 0 ? 0 : 1);
