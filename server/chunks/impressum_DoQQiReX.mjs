import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, R as unescapeHTML, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { t as $$Layout } from "./Layout_BtTxcu-r.mjs";
import { u as cmsFor } from "./services_rIITeUoa.mjs";
import { t as renderMarkdown } from "./markdown_BXKCkzAJ.mjs";
//#region src/pages/legal/impressum.astro
var impressum_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Impressum,
	file: () => $$file,
	url: () => $$url
});
var $$Impressum = createComponent(async ($$result, $$props, $$slots) => {
	const edited = await cmsFor("legal_impressum", "de", { markdown: "" });
	const html = edited.markdown.trim() === "" ? null : renderMarkdown(edited.markdown);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Impressum — Tracht Digital Solutions",
		"description": "Impressum von Tracht Digital Solutions: Julian Tracht, Elbinger Straße 19, 21493 Schwarzenbek bei Hamburg — Kontakt, USt-IdNr. und Verantwortliche.",
		"noindex": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main" class="min-h-screen bg-[var(--color-paper)]"><div class="max-w-3xl mx-auto px-6 md:px-8 py-24"><a href="/" class="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-12 block">← Zurück</a><h1 class="text-4xl md:text-5xl font-[var(--font-display)] font-medium text-[var(--color-black)] mb-12">Impressum</h1>${html ? renderTemplate`<div class="tds-prose">${unescapeHTML(html)}</div>` : renderTemplate`<div class="max-w-none space-y-8 text-[var(--color-black)]"><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">Angaben gemäß § 5 DDG</h2><p class="text-[var(--color-muted)] leading-relaxed">Julian Tracht<br>Tracht Digital Solutions<br>Elbinger Straße 19<br>21493 Schwarzenbek<br>Deutschland</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">Kontakt</h2><p class="text-[var(--color-muted)] leading-relaxed">Telefon: +49 178 822 4022<br>E-Mail:${" "}<a href="mailto:kontakt@tracht-digital.de" class="text-[var(--color-accent)]">kontakt@tracht-digital.de</a></p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">Umsatzsteuer-ID</h2><p class="text-[var(--color-muted)] leading-relaxed">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br><strong>DE 450 639 725</strong></p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2><p class="text-[var(--color-muted)] leading-relaxed">Julian Tracht<br>Elbinger Straße 19<br>21493 Schwarzenbek</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">Streitschlichtung</h2><p class="text-[var(--color-muted)] leading-relaxed">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">Haftung für Inhalte</h2><p class="text-[var(--color-muted)] leading-relaxed">Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht unter der Voraussetzung verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p><p class="text-[var(--color-muted)] leading-relaxed mt-3">Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">Haftung für Links</h2><p class="text-[var(--color-muted)] leading-relaxed">Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">Urheberrecht</h2><p class="text-[var(--color-muted)] leading-relaxed">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p></section></div>`}</div></main>` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/legal/impressum.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/legal/impressum.astro";
var $$url = "/legal/impressum";
//#endregion
//#region \0virtual:astro:page:src/pages/legal/impressum@_@astro
var page = () => impressum_exports;
//#endregion
export { page };
