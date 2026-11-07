import { F as addAttribute, O as renderTemplate, S as renderComponent, k as maybeRenderHead } from "./sequence_-pfDyphk.mjs";
import { t as createComponent } from "./astro-component_D398hF7X.mjs";
import { t as createAstro } from "./compiler_BVs5vHf6.mjs";
import { f as localizePath, t as $$Layout, u as $$Arrow } from "./Layout_BRUQ3vZE.mjs";
import { s as $$Header, t as $$Footer } from "./Footer_CR5vjmPP.mjs";
import { t as $$AccentLetters } from "./AccentLetters_uelZXL28.mjs";
import { t as $$PreviewLightbox } from "./PreviewLightbox_DIT5hTig.mjs";
import { a as designStudies, n as ownProjects, r as getCaseCards, t as $$ProjectTile } from "./ProjectTile_DaLnO_3M.mjs";
import { t as $$DetailMeta } from "./DetailMeta_tsyBJG_p.mjs";
import { o as getDemos } from "./DemoCard_Cb7yAt7m.mjs";
import { c as webPageNode, n as breadcrumbNode, t as asGraph } from "./jsonld_CGCkUqzY.mjs";
import { S as projectsHref, _ as PROJECTS_UPDATED_AT, a as getServiceById, b as projectEntry, u as serviceHref, v as caseEntry, w as studyEntry, x as projectsCopy, y as demoEntry } from "./sitemapSections_RyOEyUq6.mjs";
import { t as absolute } from "./sitemap_BDa-0iSZ.mjs";
// src/components/ProjectsPage.astro
createAstro("https://tracht-digital.de");
var $$ProjectsPage = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProjectsPage;
	const { lang } = Astro.props;
	const pageDescriptions = {
		de: "Kundenprojekte, eigene Projekte, Beispielseiten und Designstudien von Tracht Digital Solutions aus Schwarzenbek, als Kacheln mit klarer Herkunft.",
		en: "Client projects, own projects, example sites and design studies by Tracht Digital Solutions from Schwarzenbek, as tiles that state their origin."
	};
	const copy = projectsCopy[lang];
	const ui = copy.page;
	const groups = [
		{
			id: "kunden",
			...copy.groups.cases,
			entries: (await getCaseCards(lang)).map(caseEntry)
		},
		{
			id: "eigene",
			...copy.groups.own,
			entries: [...ownProjects.map(projectEntry), {
				kind: "business-card",
				key: "business-card"
			}]
		},
		{
			id: "beispiele",
			...copy.groups.demos,
			entries: (await getDemos()).map(demoEntry)
		},
		{
			id: "studien",
			...copy.groups.studies,
			entries: designStudies.map(studyEntry)
		}
	].filter((group) => group.entries.length > 0);
	const webPresence = getServiceById("web-presence");
	const serviceLink = {
		label: webPresence.fallback[lang].title,
		href: serviceHref(webPresence, lang)
	};
	const homeHref = localizePath("/", lang);
	const pageUrl = absolute(projectsHref(lang));
	const breadcrumbId = `${pageUrl}#breadcrumb`;
	const graph = asGraph(webPageNode({
		url: pageUrl,
		name: ui.name,
		description: pageDescriptions[lang],
		lang,
		dateModified: PROJECTS_UPDATED_AT,
		breadcrumbId
	}), breadcrumbNode(breadcrumbId, [{
		name: ui.home,
		url: absolute(homeHref)
	}, {
		name: ui.name,
		url: pageUrl
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${ui.name} — Tracht Digital`,
		"description": pageDescriptions[lang],
		"lang": lang,
		"alternates": {
			de: projectsHref("de"),
			en: projectsHref("en")
		},
		"jsonLd": graph,
		"data-astro-cid-buoisyys": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, { "data-astro-cid-buoisyys": true })}${maybeRenderHead($$result)}<main id="main" data-astro-cid-buoisyys><section class="relative pt-36 pb-10 md:pt-44 md:pb-14" aria-labelledby="projects-title" data-astro-cid-buoisyys><div class="relative lp-container" data-astro-cid-buoisyys><nav${addAttribute(ui.backNav, "aria-label")} class="mb-10" data-astro-cid-buoisyys><a${addAttribute(homeHref, "href")} class="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors [@media(pointer:coarse)]:min-h-11" data-astro-cid-buoisyys><span aria-hidden="true" data-astro-cid-buoisyys>${renderComponent($$result, "Arrow", $$Arrow, {
		"dir": "left",
		"data-astro-cid-buoisyys": true
	})}</span>${ui.back}</a></nav><div class="max-w-3xl" data-astro-cid-buoisyys><h1 id="projects-title" class="display text-4xl sm:text-5xl md:text-6xl text-[var(--color-black)] leading-[1.04] mb-6" data-astro-cid-buoisyys>${ui.headline}${" "}${renderComponent($$result, "AccentLetters", $$AccentLetters, {
		"text": ui.headlineAccent,
		"data-astro-cid-buoisyys": true
	})}</h1><span aria-hidden="true" class="tds-brandbar mb-8" data-astro-cid-buoisyys></span><p class="lead text-[var(--color-muted)]" data-astro-cid-buoisyys>${ui.answer}</p>${renderComponent($$result, "DetailMeta", $$DetailMeta, {
		"lang": lang,
		"updatedAt": PROJECTS_UPDATED_AT,
		"data-astro-cid-buoisyys": true
	})}</div><nav${addAttribute(ui.jump, "aria-label")} class="project-jump" data-astro-cid-buoisyys>${groups.map((group) => renderTemplate`<a class="project-jump__link"${addAttribute(`#${group.id}`, "href")} data-astro-cid-buoisyys>${group.title}<span class="project-jump__count" data-astro-cid-buoisyys>${group.entries.length}</span></a>`)}</nav></div></section>${groups.map((group) => renderTemplate`<section${addAttribute(group.id, "id")} class="project-group"${addAttribute(`${group.id}-title`, "aria-labelledby")} data-astro-cid-buoisyys><div class="lp-container" data-astro-cid-buoisyys><div class="project-group__head" data-astro-cid-buoisyys><h2${addAttribute(`${group.id}-title`, "id")} class="display text-2xl md:text-3xl text-[var(--color-black)] mb-2" data-astro-cid-buoisyys>${group.title}</h2><p class="text-[var(--color-muted)] leading-relaxed" data-astro-cid-buoisyys>${group.lead}</p></div><div class="project-grid" data-astro-cid-buoisyys>${group.entries.map((entry) => renderTemplate`<div class="project-grid__cell" data-astro-cid-buoisyys>${renderComponent($$result, "ProjectTile", $$ProjectTile, {
		"entry": entry,
		"lang": lang,
		"serviceLink": serviceLink,
		"data-astro-cid-buoisyys": true
	})}</div>`)}</div></div></section>`)}<section class="pb-24 md:pb-32" aria-labelledby="projects-cta" data-astro-cid-buoisyys><div class="lp-container" data-astro-cid-buoisyys><div class="project-cta" data-astro-cid-buoisyys><h2 id="projects-cta" class="display text-2xl md:text-3xl text-[var(--color-black)]" data-astro-cid-buoisyys>${ui.ctaLead}</h2><a${addAttribute(`${homeHref}#contact`, "href")} class="project-cta__link" data-cta data-track="projects-cta" data-astro-cid-buoisyys>${ui.cta}<span aria-hidden="true" data-astro-cid-buoisyys>${renderComponent($$result, "Arrow", $$Arrow, {
		"dir": "right",
		"data-astro-cid-buoisyys": true
	})}</span></a></div></div></section>${renderComponent($$result, "PreviewLightbox", $$PreviewLightbox, {
		"lang": lang,
		"data-astro-cid-buoisyys": true
	})}</main>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-buoisyys": true })}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ProjectsPage.astro", void 0);
export { $$ProjectsPage as t };
