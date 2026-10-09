import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead } from "./sequence_n1BymCGP.mjs";
import { t as createComponent } from "./compiler_B89CkCkP.mjs";
import { _ as localizePath } from "./Layout_C6zy917v.mjs";
import { q as siteConfig } from "./sitemapSections_B_rjjcBB.mjs";
//#region src/components/detail/DetailMeta.astro
createAstro("https://tracht-digital.de");
var $$DetailMeta = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DetailMeta;
	const { lang, updatedAt } = Astro.props;
	const date = /* @__PURE__ */ new Date(`${updatedAt}T12:00:00Z`);
	const month = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(date);
	const aboutHref = `${localizePath("/", lang)}#about`;
	const ui = lang === "de" ? {
		updated: "Stand",
		by: "Von",
		role: `Inhaber von ${siteConfig.name}, ${siteConfig.address.addressLocality} bei Hamburg`
	} : {
		updated: "Updated",
		by: "By",
		role: `owner of ${siteConfig.name}, ${siteConfig.address.addressLocality} near Hamburg`
	};
	return renderTemplate`${maybeRenderHead($$result)}<p class="mt-8 text-sm leading-relaxed text-[var(--color-muted)]">${ui.updated}: <time${addAttribute(updatedAt, "datetime")}>${month}</time><span aria-hidden="true"> · </span>${ui.by}${" "}<a${addAttribute(aboutHref, "href")} class="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-line)] hover:text-[var(--color-primary)] transition-colors [@media(pointer:coarse)]:inline-flex [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:items-center">${siteConfig.founder.name}</a>, ${ui.role}</p>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/detail/DetailMeta.astro", void 0);
//#endregion
export { $$DetailMeta as t };
