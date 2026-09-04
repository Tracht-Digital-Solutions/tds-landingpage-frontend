import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { o as localizePath, t as $$Layout } from "./Layout_V8d2QaQ-.mjs";
import { r as legalDocMeta, t as legalCopy } from "./legal_OVfRDxl5.mjs";
//#region src/components/LegalDocPage.astro
createAstro("https://tracht-digital.de");
var $$LegalDocPage = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LegalDocPage;
	const { docKey, lang } = Astro.props;
	const copy = legalCopy[lang];
	const meta = await legalDocMeta(docKey, lang);
	const pdfHref = localizePath(`/legal/${docKey}.pdf`, lang);
	const homeHref = localizePath("/", lang);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${copy.agbTitle} — Tracht Digital Solutions`,
		"description": copy.agbDescription,
		"lang": lang,
		"noindex": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main" class="min-h-screen bg-[var(--color-paper)]"><div class="max-w-3xl mx-auto px-6 md:px-8 py-24"><a${addAttribute(homeHref, "href")} class="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-12 block">${copy.back}</a><h1 class="text-3xl sm:text-4xl md:text-5xl font-[var(--font-display)] font-medium text-[var(--color-black)] mb-4 hyphens-auto">${copy.agbTitle}</h1>${meta?.versionLabel && renderTemplate`<p class="text-sm text-[var(--color-muted)]">${meta.versionLabel}</p>`}<div class="mt-8 mb-10 flex flex-wrap items-center gap-3"><a${addAttribute(pdfHref, "href")} download class="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium bg-[var(--color-black)] text-[var(--color-paper)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(0,0,0,0.18)] transition-all duration-200">${copy.download}<span aria-hidden="true" class="group-hover:translate-y-0.5 transition-transform">↓</span></a><a${addAttribute(pdfHref, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium bg-[var(--color-soft)] text-[var(--color-black)] hover:bg-[color-mix(in_srgb,var(--color-accent)_12%,var(--color-soft))] hover:text-[var(--color-accent)] hover:-translate-y-0.5 transition-all duration-200">${copy.openInNewTab}</a></div><object${addAttribute(`${pdfHref}#view=FitH&navpanes=0`, "data")} type="application/pdf"${addAttribute(copy.viewerLabel, "aria-label")} class="hidden md:block w-full h-[80vh] rounded-[6px] bg-white"><p class="p-6 text-[var(--color-muted)] leading-relaxed">${copy.viewerFallback}</p></object><p class="md:hidden text-sm text-[var(--color-muted)] leading-relaxed">${copy.viewerFallback}</p></div></main>` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/LegalDocPage.astro", void 0);
//#endregion
export { $$LegalDocPage as t };
