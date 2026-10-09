import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, R as unescapeHTML, j as maybeRenderHead, w as renderComponent } from "./sequence_n1BymCGP.mjs";
import { t as createComponent } from "./compiler_B89CkCkP.mjs";
import { a as readConsent, i as openConsentSettings, m as runtimeSetting, o as writeConsent, p as apiBase, r as necessaryOnly, t as $$Layout } from "./Layout_Bk719o5h.mjs";
import { m as cmsFor } from "./sitemapSections_C2iJeOpf.mjs";
import { t as renderMarkdown } from "./markdown_wZRCEcjf.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/analytics/index.js
var VISITOR_KEY = "tds-vid";
var SESSION_KEY = "tds-sid";
function readJson(store, key) {
	if (!store) return null;
	try {
		const raw = store.getItem(key);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function local() {
	try {
		return window.localStorage;
	} catch {
		return;
	}
}
function session() {
	try {
		return window.sessionStorage;
	} catch {
		return;
	}
}
function analyticsVisitorId() {
	if (typeof window === "undefined") return null;
	const v = readJson(local(), VISITOR_KEY);
	if (!v || typeof v.id !== "string" || typeof v.exp !== "number" || v.exp < Date.now()) return null;
	return v.id;
}
function clearAnalyticsIds() {
	try {
		local()?.removeItem(VISITOR_KEY);
	} catch {}
	try {
		session()?.removeItem(SESSION_KEY);
	} catch {}
}
async function resolveEndpoint(override) {
	if (override) return override.replace(/\/+$/, "");
	return `${(await runtimeSetting("apiBase", apiBase())).replace(/\/+$/, "")}/analytics`;
}
async function forgetAnalytics(endpoint) {
	const vid = analyticsVisitorId();
	if (!vid) {
		clearAnalyticsIds();
		return true;
	}
	try {
		const base = await resolveEndpoint(endpoint);
		const res = await fetch(`${base}/forget`, {
			method: "POST",
			credentials: "omit",
			headers: { "Content-Type": "text/plain;charset=UTF-8" },
			body: JSON.stringify({ visitorId: vid })
		});
		if (res.ok) clearAnalyticsIds();
		return res.ok;
	} catch {
		return false;
	}
}
//#endregion
//#region src/components/islands/AnalyticsControls.tsx
/**
* The privacy policy's controls for the site's own statistics: change the
* choice, or erase what was recorded under this browser's id. Erasing also
* withdraws the consent — otherwise the next page view would start a new id
* and the button would have done the opposite of what it says.
*
* The copy comes from the page: the legal register addresses the reader
* differently from the rest of the site, and only the legal pages own it.
*/
function AnalyticsControls({ copy }) {
	const [hasId, setHasId] = useState(false);
	const [state, setState] = useState("idle");
	useEffect(() => {
		setHasId(analyticsVisitorId() !== null);
	}, []);
	const erase = async () => {
		setState("busy");
		const ok = await forgetAnalytics();
		if (ok) {
			const current = readConsent()?.choices ?? necessaryOnly();
			writeConsent({
				...current,
				analytics: false
			}, "de");
			setHasId(false);
		}
		setState(ok ? "done" : "failed");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "analytics-controls",
		children: [/* @__PURE__ */ jsxs("p", { children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: () => openConsentSettings(),
				children: copy.settings
			}),
			" ",
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-ghost",
				disabled: !hasId || state === "busy",
				onClick: erase,
				children: copy.erase
			})
		] }), /* @__PURE__ */ jsx("p", {
			role: "status",
			className: "text-sm text-[var(--color-muted)] mt-2",
			children: state === "done" ? copy.done : state === "failed" ? copy.failed : !hasId ? copy.noId : ""
		})]
	});
}
//#endregion
//#region src/pages/legal/datenschutz.astro
var datenschutz_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Datenschutz,
	file: () => $$file,
	url: () => $$url
});
var $$Datenschutz = createComponent(async ($$result, $$props, $$slots) => {
	const edited = await cmsFor("legal_datenschutz", "de", { markdown: "" });
	const html = edited.markdown.trim() === "" ? null : renderMarkdown(edited.markdown);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Datenschutzerklärung — Tracht Digital Solutions",
		"description": "Datenschutzerklärung von Tracht Digital Solutions: welche Daten tracht-digital.de erhebt, wozu und wie lange — und welche Rechte Sie nach DSGVO haben.",
		"noindex": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main" class="min-h-screen bg-[var(--color-paper)]"><div class="max-w-3xl mx-auto px-6 md:px-8 py-24"><a href="/" class="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-12 block">← Zurück</a><h1 class="text-4xl md:text-5xl font-[var(--font-display)] font-medium text-[var(--color-black)] mb-4">Datenschutzerklärung</h1><p class="text-sm text-[var(--color-muted)] mb-12">Stand: Oktober 2026</p><section class="mb-12" aria-label="Statistik-Einstellungen">${renderComponent($$result, "AnalyticsControls", AnalyticsControls, {
		"client:idle": true,
		"copy": {
			settings: "Cookie- und Statistik-Einstellungen öffnen",
			erase: "Meine Statistikdaten löschen",
			done: "Erledigt: Die Daten zu Ihrer Kennung sind gelöscht, die Einwilligung ist widerrufen.",
			failed: "Das Löschen hat nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an kontakt@tracht-digital.de.",
			noId: "In diesem Browser ist auf tracht-digital.de keine Statistik-Kennung gespeichert."
		},
		"client:component-hydration": "idle",
		"client:component-path": "~/components/islands/AnalyticsControls",
		"client:component-export": "default"
	})}</section>${html ? renderTemplate`<div class="tds-prose">${unescapeHTML(html)}</div>` : renderTemplate`<div class="space-y-10 text-[var(--color-black)]"><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">1. Verantwortlicher</h2><p class="text-[var(--color-muted)] leading-relaxed">Julian Tracht – Tracht Digital Solutions<br>Elbinger Straße 19, 21493 Schwarzenbek<br>E-Mail:${" "}<a href="mailto:kontakt@tracht-digital.de" class="text-[var(--color-accent)]">kontakt@tracht-digital.de</a><br>Telefon: +49 178 822 4022</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">2. Erhebung allgemeiner Daten beim Websitebesuch (Server-Logs)</h2><p class="text-[var(--color-muted)] leading-relaxed">Beim Aufruf dieser Website werden automatisch Informationen in sogenannten Server-Log-Dateien gespeichert, die Ihr Browser übermittelt. Dies sind: Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Diese Daten werden ausschließlich zur technischen Bereitstellung der Website genutzt und nicht mit anderen Datenquellen zusammengeführt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der sicheren Bereitstellung des Angebots).</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">3. Cookies</h2><p class="text-[var(--color-muted)] leading-relaxed">Ohne Ihre Einwilligung legt diese Website (tracht-digital.de) nur technisch notwendige Informationen im lokalen Speicher des Browsers ab (z.&nbsp;B. Sprach-/Designeinstellung sowie Ihre Auswahl im Einwilligungsbanner). Sie enthalten keine personenbezogenen Daten (§&nbsp;25 Abs. 2 Nr. 2 TDDDG). Erst wenn Sie der Kategorie „Statistik“ zustimmen, speichert Ihr Browser zusätzlich eine zufällige Kennung für unsere eigene Reichweitenmessung (Ziffer 3b).</p><p class="text-[var(--color-muted)] leading-relaxed mt-3">Auf unserem Blog (blog.tracht-digital.de) können – sofern dort aktiviert – Anzeigen über Google AdSense eingebunden sein. Hierfür werden Cookies und ähnliche Technologien zu Werbezwecken erst gesetzt, <strong>nachdem Sie über den dortigen Einwilligungsbanner ausdrücklich zugestimmt haben</strong> (Art. 6 Abs. 1 lit. a DSGVO i.&nbsp;V.&nbsp;m. § 25 Abs. 1 TDDDG). Ohne Ihre Einwilligung werden keine Werbe-Cookies gesetzt und keine entsprechenden Skripte geladen. Ihre Einwilligung können Sie jederzeit mit Wirkung für die Zukunft über den Link „Werbe-Einwilligung ändern“ im Blog-Footer widerrufen. Einzelheiten zum Anbieter finden Sie unter Ziffer 5.</p><p class="text-[var(--color-muted)] leading-relaxed mt-3">Ebenfalls nur mit Ihrer Einwilligung (Kategorie „Komfort“ im dortigen Banner) merkt sich der Blog in einem Cookie („tds-interests“, höchstens 180 Tage), zu welchen Themen Sie Artikel gelesen haben, um unter „Für dich“ passende Artikel vorzuschlagen. Das Cookie bleibt in Ihrem Browser und wird nicht an uns übertragen. Ohne Einwilligung oder nach einem Widerruf wird es gelöscht (Art. 6 Abs. 1 lit. a DSGVO i.&nbsp;V.&nbsp;m. §&nbsp;25 Abs. 1 TDDDG).</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">3a. Login-Bereiche (Kundenportal &amp; Verwaltung)</h2><p class="text-[var(--color-muted)] leading-relaxed">Die zugangsgeschützten Bereiche unter app.tracht-digital.de (Kundenportal) und management.tracht-digital.de (Verwaltung) setzen bei der Anmeldung ein technisch notwendiges Session-Cookie („tds_session“). Es dient ausschließlich der sicheren Authentifizierung während Ihrer Sitzung, enthält keine Tracking-Funktionen und wird nach Ablauf der Sitzung bzw. beim Abmelden ungültig. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie §&nbsp;25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlicher Dienst); eine Einwilligung ist hierfür nicht erforderlich. Im Rahmen der Portalnutzung verarbeiten wir die zu Ihrem Kundenkonto gehörenden Vertrags- und Projektdaten (Name, E-Mail-Adresse, Unternehmensdaten, Projekt-, Rechnungs- und Supportdaten) zur Vertragserfüllung.</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">3b. Reichweitenmessung (eigene Statistik, nur mit Einwilligung)</h2><p class="text-[var(--color-muted)] leading-relaxed">Auf tracht-digital.de sowie auf blog., tools., shop. und auth.tracht-digital.de messen wir mit einer selbst betriebenen Statistik, welche Seiten gelesen werden, woher Besucher kommen, welche Schaltflächen genutzt werden und an welcher Stelle Besuche oder Formulare abbrechen. Das geschieht <strong>nur, wenn Sie im Einwilligungsbanner der jeweiligen Seite der Kategorie „Statistik“ zugestimmt haben</strong> (Art. 6 Abs. 1 lit. a DSGVO i.&nbsp;V.&nbsp;m. §&nbsp;25 Abs. 1 TDDDG). Ohne Einwilligung wird nichts gesendet und nichts gespeichert. Ein im Browser aktiviertes „Global Privacy Control“-Signal beachten wir auch nach einer Einwilligung.</p><p class="text-[var(--color-muted)] leading-relaxed mt-3"><strong>Was gespeichert wird:</strong> eine zufällige Besucherkennung (im lokalen Speicher Ihres Browsers, läuft nach 30 Tagen ab) und eine Sitzungskennung (endet mit dem Tab bzw. nach 30 Minuten Inaktivität); die aufgerufenen Seitenpfade ohne Parameter; die Domain der verweisenden Seite und UTM-Kampagnenangaben eines Links; Klicks auf gekennzeichnete Schaltflächen und die Zieldomain externer Links; die Scrolltiefe; bei Formularen nur, dass eines begonnen oder abgeschickt wurde und der <em>Name</em> des zuletzt ausgefüllten Feldes – niemals Ihre Eingaben; die Verweildauer; Sprache, Geräteklasse sowie Browser- und Betriebssystemfamilie ohne Versionsnummern; das Land.</p><p class="text-[var(--color-muted)] leading-relaxed mt-3"><strong>Was nicht gespeichert wird:</strong> Ihre IP-Adresse und die vollständige Browserkennung. Die IP-Adresse wird nur im Moment der Anfrage verwendet, um das Land in einer lokal auf unserem Server liegenden Datenbank nachzuschlagen (Länderdaten: DB-IP.com, CC BY 4.0), und als verschlüsselter Hashwert für einen kurzzeitigen Missbrauchsschutz; danach wird sie verworfen. Es gibt keine Weitergabe an Dritte und keine Verknüpfung mit Ihrem Kundenkonto oder Ihren Formulareingaben. Die Daten liegen auf unserem Server in Deutschland.</p><p class="text-[var(--color-muted)] leading-relaxed mt-3"><strong>Speicherdauer:</strong> Einzelne Besuche speichern wir 90 Tage. Danach werden sie zu anonymen Tagessummen (z.&nbsp;B. „120 Besuche über Suchmaschinen“) zusammengefasst und gelöscht; die Summen lassen keinen Rückschluss auf einzelne Besucher zu.</p><p class="text-[var(--color-muted)] leading-relaxed mt-3"><strong>Widerruf und Löschung:</strong> Sie können Ihre Einwilligung jederzeit über „Cookie-Einstellungen“ im Fußbereich der jeweiligen Seite widerrufen; die Kennung wird dann sofort aus Ihrem Browser gelöscht. Mit der Schaltfläche unten löschen Sie zusätzlich alle zu Ihrer Kennung auf tracht-digital.de gespeicherten Daten. Für die anderen Seiten genügt eine E-Mail an kontakt@tracht-digital.de.</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">4. Kontaktformular</h2><p class="text-[var(--color-muted)] leading-relaxed">Wenn Sie das Kontaktformular nutzen, werden die von Ihnen eingegebenen Daten (Name, E-Mail-Adresse, optional Unternehmen, Nachricht) zur Bearbeitung Ihrer Anfrage verarbeitet. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung).</p><p class="text-[var(--color-muted)] leading-relaxed mt-3">Die Daten werden nicht an Dritte weitergegeben, außer an den E-Mail-Dienst Resend (siehe unten), und nach Abschluss der Kommunikation gelöscht, sofern keine gesetzliche Aufbewahrungspflicht besteht.</p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">5. Externe Dienste</h2><div class="space-y-4 text-[var(--color-muted)] leading-relaxed"><div><strong class="text-[var(--color-black)]">netcup (Hosting)</strong><p class="mt-1">Diese Website wird über netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, Deutschland gehostet. netcup verarbeitet technische Zugriffsdaten (IP-Adresse, Anfragedaten) zur Bereitstellung des Dienstes. Es besteht ein Auftragsverarbeitungsvertrag (DPA). Weitere Informationen:${" "}<a href="https://www.netcup.de/kontakt/datenschutzerklaerung.php" target="_blank" rel="noopener noreferrer" class="text-[var(--color-accent)]">netcup.de/kontakt/datenschutzerklaerung</a></p></div><div><strong class="text-[var(--color-black)]">Resend (E-Mail-Versand)</strong><p class="mt-1">Zur Verarbeitung von Kontaktformular-Anfragen nutzen wir Resend (Resend Inc., USA). Ihre beim Kontaktformular angegebenen Daten werden zur Zustellung der E-Mail übermittelt. Mit Resend besteht ein Auftragsverarbeitungsvertrag; die Übermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).</p></div><div><strong class="text-[var(--color-black)]">Google AdSense (Werbung, nur im Blog)</strong><p class="mt-1">Auf dem Blog (blog.tracht-digital.de) binden wir – ausschließlich nach Ihrer Einwilligung (siehe Ziffer 3) – Anzeigen über Google AdSense ein (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Dabei können Cookies und ähnliche Kennungen gesetzt und Nutzungsdaten (u.&nbsp;a. IP-Adresse, Anzeigen-Interaktionen) verarbeitet werden, gegebenenfalls auch zur Auslieferung personalisierter Werbung. Eine Übermittlung in die USA (Google LLC) kann erfolgen; Grundlage sind die EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Rechtsgrundlage der Verarbeitung ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG); ohne Einwilligung findet keine Einbindung statt. Weitere Informationen:${" "}<a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="text-[var(--color-accent)]">policies.google.com/technologies/ads</a></p></div><div><strong class="text-[var(--color-black)]">Schriftarten</strong><p class="mt-1">Schriftarten werden lokal von unserem Server ausgeliefert. Es werden${" "}<strong>keine</strong> Anfragen an Drittanbieter wie Google Fonts oder Adobe Fonts gesendet.</p></div></div></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">6. Ihre Rechte (Art. 15–21 DSGVO)</h2><p class="text-[var(--color-muted)] leading-relaxed">Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21) gegen die Verarbeitung Ihrer personenbezogenen Daten. Zur Ausübung dieser Rechte wenden Sie sich an:${" "}<a href="mailto:kontakt@tracht-digital.de" class="text-[var(--color-accent)]">kontakt@tracht-digital.de</a></p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">7. Beschwerderecht bei der Aufsichtsbehörde</h2><p class="text-[var(--color-muted)] leading-relaxed">Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Behörde in Schleswig-Holstein ist das Unabhängige Landeszentrum für Datenschutz Schleswig-Holstein (ULD), Holstenstraße 98, 24103 Kiel,${" "}<a href="https://www.datenschutzzentrum.de" target="_blank" rel="noopener noreferrer" class="text-[var(--color-accent)]">www.datenschutzzentrum.de</a></p></section><section><h2 class="text-xl font-[var(--font-display)] font-medium mb-3">8. SSL-Verschlüsselung</h2><p class="text-[var(--color-muted)] leading-relaxed">Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt.</p></section></div>`}</div></main>` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/legal/datenschutz.astro", void 0);
var $$file = "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/pages/legal/datenschutz.astro";
var $$url = "/legal/datenschutz";
//#endregion
//#region \0virtual:astro:page:src/pages/legal/datenschutz@_@astro
var page = () => datenschutz_exports;
//#endregion
export { page };
