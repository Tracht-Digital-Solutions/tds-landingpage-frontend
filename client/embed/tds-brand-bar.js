/**
 * <tds-brand-bar> — the closing bar in TDS colours at the end of every example
 * site (demo1, demo2, demo3 …). ONE source for all of them since 2026-09-21.
 *
 * It used to be copied into each demo by hand, and the copies drifted: one
 * said "Zum Kontaktformular", another "Kontaktieren", one linked the name, one
 * shipped 8 px type. Now each demo embeds only this:
 *
 *   <tds-brand-bar lang="de">
 *     <a href="https://tracht-digital.de/">Design &amp; Umsetzung: Tracht Digital Solutions</a>
 *   </tds-brand-bar>
 *   <script src="https://tracht-digital.de/embed/tds-brand-bar.js" defer></script>
 *
 * - A CLASSIC script, not a module: a cross-origin module needs CORS headers,
 *   a classic script does not.
 * - Shadow DOM, so no stylesheet of the host site can restyle the bar — that
 *   is what keeps it identical everywhere.
 * - The light-DOM link inside the element is the fallback: without JavaScript,
 *   or before the script arrives, the visitor still sees and follows a link.
 *   Once upgraded, the shadow root replaces it (no <slot>).
 * - `lang="en"` (or an English document) switches copy and targets to /en/.
 *
 * Tested in tds-landingpage-frontend (`src/lib/brandBar.test.ts`).
 * Edit ONLY here; the demos pick the change up on their next page load.
 */
(() => {
  if (typeof customElements === "undefined" || customElements.get("tds-brand-bar")) return;

  const COPY = {
    de: {
      kicker: "Design & digitale Umsetzung",
      website: "Zur Website",
      websiteLabel: "Zur Website von Tracht Digital Solutions (öffnet neuen Tab)",
      contact: "Zum Kontaktformular",
      contactLabel: "Zum Kontaktformular von Tracht Digital Solutions (öffnet neuen Tab)",
      nav: "Tracht Digital Solutions: Website und Kontakt",
      home: "https://tracht-digital.de/",
      form: "https://tracht-digital.de/#contact",
    },
    en: {
      kicker: "Design & development",
      website: "Visit website",
      websiteLabel: "Website of Tracht Digital Solutions (opens a new tab)",
      contact: "Contact form",
      contactLabel: "Contact form of Tracht Digital Solutions (opens a new tab)",
      nav: "Tracht Digital Solutions: website and contact",
      home: "https://tracht-digital.de/en/",
      form: "https://tracht-digital.de/en/#contact",
    },
  };

  const CSS = `
    :host {
      display: block;
      --tds-navy: #050f68;
      --tds-bordeaux: #820933;
      --tds-cranberry: #a4153f;
      --tds-pink: #ff7a9c;
      --tds-gold: #e9b455;
      --tds-paper: #fafaf7;
      /* A fixed stack, not the host's font: the bar must look the same on
         every demo, and none of them loads the brand faces. */
      font-family: Arial, Helvetica, sans-serif;
    }
    * { box-sizing: border-box; }
    .bar {
      position: relative;
      overflow: hidden;
      color: var(--tds-paper);
      background:
        radial-gradient(circle at 88% 18%, rgb(255 122 156 / 16%), transparent 26%),
        linear-gradient(112deg, var(--tds-navy) 0 72%, var(--tds-bordeaux) 100%);
    }
    .inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 38px;
      min-height: 132px;
      padding: 26px clamp(18px, 4.15%, 80px);
      /* A host site sets this when something floats over the bar's lower
         edge (demo1's floating contact button on phones). Custom properties
         cross the shadow boundary, so this is the one knob a demo gets. */
      padding-bottom: var(--tds-brand-bar-pad-bottom, 26px);
    }
    .signature { display: grid; gap: 7px; }
    .kicker {
      color: rgb(255 255 255 / 72%);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .name {
      font-size: clamp(20px, 2vw, 25px);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.25;
    }
    .stripes { display: flex; gap: 6px; margin-top: 4px; }
    .stripes i { display: block; width: 42px; height: 4px; background: var(--tds-cranberry); }
    .stripes i:nth-child(2) { width: 20px; background: var(--tds-pink); }
    .stripes i:nth-child(3) { width: 12px; background: var(--tds-gold); }
    nav {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 10px;
    }
    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 46px;
      padding: 12px 18px;
      color: var(--tds-paper);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-decoration: none;
      text-transform: uppercase;
      transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
    }
    a svg { width: 15px; height: 15px; flex: 0 0 auto; }
    .website { background: rgb(250 250 247 / 10%); }
    .contact { background: var(--tds-pink); color: var(--tds-navy); }
    a:hover, a:focus-visible { background: var(--tds-paper); color: var(--tds-navy); }
    a:focus-visible { outline: 2px solid var(--tds-paper); outline-offset: 3px; }
    @media (prefers-reduced-motion: no-preference) {
      a:hover, a:focus-visible { transform: translateY(-2px); }
    }
    @media (max-width: 760px) {
      .inner { flex-direction: column; align-items: flex-start; gap: 22px; }
      nav { justify-content: flex-start; }
    }
    /* Phones: full-width buttons, a thumb-sized target each, and the
       stripes scaled down with the type. */
    @media (max-width: 560px) {
      .inner { min-height: 0; padding-top: 30px; }
      nav { width: 100%; }
      a { width: 100%; min-height: 48px; }
      .stripes { gap: 5px; }
      .stripes i { width: 28px; height: 3px; }
      .stripes i:nth-child(2) { width: 14px; }
      .stripes i:nth-child(3) { width: 8px; }
    }
  `;

  const ICON_EXTERNAL =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>';
  const ICON_MESSAGE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2ZM8 8h8M8 12h6"/></svg>';

  const langOf = (el) => {
    const raw = (el.getAttribute("lang") || document.documentElement.lang || "de").toLowerCase();
    return raw.startsWith("en") ? "en" : "de";
  };

  class TdsBrandBar extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const c = COPY[langOf(this)];
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `
        <style>${CSS}</style>
        <aside class="bar" part="bar" aria-label="Tracht Digital Solutions">
          <div class="inner">
            <div class="signature">
              <span class="kicker">${c.kicker.replace("&", "&amp;")}</span>
              <strong class="name">Tracht Digital Solutions</strong>
              <span class="stripes" aria-hidden="true"><i></i><i></i><i></i></span>
            </div>
            <nav aria-label="${c.nav}">
              <a class="website" href="${c.home}" target="_blank" rel="noopener" aria-label="${c.websiteLabel}">
                ${c.website} ${ICON_EXTERNAL}
              </a>
              <a class="contact" href="${c.form}" target="_blank" rel="noopener" aria-label="${c.contactLabel}">
                ${ICON_MESSAGE} ${c.contact}
              </a>
            </nav>
          </div>
        </aside>`;
    }
  }

  customElements.define("tds-brand-bar", TdsBrandBar);
})();
