import { I as addAttribute, M as maybeRenderHead, T as renderComponent, j as renderTemplate } from "./sequence_BJTD5713.mjs";
import { t as createComponent } from "./astro-component_Bf647iZ6.mjs";
import { t as createAstro } from "./compiler_CC8dBrdY.mjs";
import { c as $$Arrow, t as $$Layout, u as localizePath } from "./Layout_AJxkPOGm.mjs";
import { o as $$Header, t as $$Footer } from "./Footer_CmavQmZr.mjs";
import { t as headingText } from "./heading_BXIDnTl1.mjs";
import { B as credentials, G as formatDuration, H as credentialsInGroup, J as credentialImageSrc, L as CREDENTIALS_UPDATED_AT, R as CREDENTIAL_GROUPS, V as credentialsHref, W as formatCompleted, q as CREDENTIAL_IMAGE, tt as siteConfig, z as CREDENTIAL_GROUP_ORDER } from "./sitemapSections_DLBFBv_Z.mjs";
import { l as srcsetFor, r as PREVIEW_VARIANT_WIDTHS } from "./imageVariants_CcEhls79.mjs";
import { n as mediaSrc, t as $$CardActions } from "./CardActions_BeO81rOm.mjs";
import { t as $$PreviewLightbox } from "./PreviewLightbox_CpYBukMH.mjs";
import { t as $$DetailMeta } from "./DetailMeta_KxTlAFVo.mjs";
import { a as personSchema, c as webPageNode, i as organizationSchema, n as breadcrumbNode, t as asGraph } from "./jsonld_CVz9M7cS.mjs";
import { t as absolute } from "./sitemap_BYaZa4J4.mjs";
// src/components/ui/CredentialCard.astro
createAstro("https://tracht-digital.de");
var $$CredentialCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CredentialCard;
	const { credential, lang } = Astro.props;
	const ui = lang === "de" ? {
		open: "Zertifikat ansehen",
		idLabel: "Zertifikat-Nr.",
		skillsLabel: "Inhalte"
	} : {
		open: "View the certificate",
		idLabel: "Certificate no.",
		skillsLabel: "Covered"
	};
	const src = credentialImageSrc(credential.id);
	const alt = lang === "de" ? `Zertifikat: ${credential.title}, abgeschlossen von Julian Tracht` : `Certificate: ${credential.title}, completed by Julian Tracht`;
	const completed = formatCompleted(credential.completedAt, lang);
	const duration = formatDuration(credential.durationMinutes, lang);
	const meta = `${credential.issuer} · ${completed} · ${duration}`;
	return renderTemplate`${maybeRenderHead($$result)}<article class="credential-card-slot" data-reveal data-astro-cid-4jda5jnd><div class="credential-card" data-astro-cid-4jda5jnd><div class="credential-card__sheet" data-astro-cid-4jda5jnd><img${addAttribute(mediaSrc(src), "src")}${addAttribute(srcsetFor(src, PREVIEW_VARIANT_WIDTHS, CREDENTIAL_IMAGE.width, mediaSrc), "srcset")} sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 45vw, 88vw"${addAttribute(alt, "alt")}${addAttribute(CREDENTIAL_IMAGE.width, "width")}${addAttribute(CREDENTIAL_IMAGE.height, "height")} loading="lazy" decoding="async" data-astro-cid-4jda5jnd></div><div class="credential-card__body" data-astro-cid-4jda5jnd><h3 class="credential-card__title" data-astro-cid-4jda5jnd>${credential.title}</h3><p class="credential-card__meta" data-astro-cid-4jda5jnd>${meta}</p><p class="credential-card__note" data-astro-cid-4jda5jnd>${credential.note[lang]}</p><ul class="credential-card__skills"${addAttribute(ui.skillsLabel, "aria-label")} data-astro-cid-4jda5jnd>${credential.skills.map((skill) => renderTemplate`<li data-astro-cid-4jda5jnd>${skill}</li>`)}</ul><p class="credential-card__id" data-astro-cid-4jda5jnd><span class="sr-only" data-astro-cid-4jda5jnd>${ui.idLabel}: </span>${credential.certificateId}</p></div>${renderComponent($$result, "CardActions", $$CardActions, {
		"lang": lang,
		"cta": {
			label: ui.open,
			detail: credential.title,
			preview: {
				src: mediaSrc(src),
				alt,
				title: credential.title,
				caption: meta,
				ratio: `${CREDENTIAL_IMAGE.width} / ${CREDENTIAL_IMAGE.height}`
			}
		},
		"data-astro-cid-4jda5jnd": true
	})}</div></article>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ui/CredentialCard.astro", void 0);
// src/components/CredentialsPage.astro
createAstro("https://tracht-digital.de");
var $$CredentialsPage = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CredentialsPage;
	const { lang } = Astro.props;
	const pageDescriptions = {
		de: "Die Qualifikationen von Julian Tracht: abgeschlossene Weiterbildungen zu SEO, Projekten, Technik und Daten — jedes Zertifikat im Original zum Nachlesen.",
		en: "The qualifications of Julian Tracht: completed training in SEO, project management, engineering and data — every certificate shown in full, to read yourself."
	};
	const ui = lang === "de" ? {
		back: "Zurück zur Startseite",
		backNav: "Seitenpfad",
		title: "Qualifikationen",
		headline: "Meine",
		headlineAccent: "Qualifikationen.",
		lead: `${credentials.length} Zertifikate aus abgeschlossenen Weiterbildungen — von der Arbeit an Suchmaschinen bis zur Absicherung einer Seite. Jedes steht hier im Original.`,
		answer: "Julian Tracht, Inhaber von Tracht Digital Solutions in Schwarzenbek bei Hamburg, führt hier jede abgeschlossene Weiterbildung mit dem zugehörigen Zertifikat auf. Es sind Zertifikate aus Kursen zu Suchmaschinen, Projektarbeit, Technik und Daten – keine Hochschulabschlüsse. Wer prüfen will, worauf eine Empfehlung beruht, kann jedes Dokument hier im Original ansehen.",
		ctaLead: "Was davon bringt eine Website weiter?",
		cta: "Erstgespräch vereinbaren"
	} : {
		back: "Back to the home page",
		backNav: "Breadcrumb",
		title: "Qualifications",
		headline: "My",
		headlineAccent: "qualifications.",
		lead: `${credentials.length} records of completed training — from working with search engines to securing a site. Every certificate is shown here in full.`,
		answer: "Julian Tracht, owner of Tracht Digital Solutions in Schwarzenbek near Hamburg, lists every completed course here together with its certificate. They are records from training in search engines, project work, engineering and data – not university degrees. Anyone who wants to check what a recommendation rests on can read each document here in full.",
		ctaLead: "What does any of it do for a website?",
		cta: "Arrange an initial consultation"
	};
	const homeHref = localizePath("/", lang);
	const contactHref = `${homeHref}#contact`;
	const person = {
		...personSchema(),
		hasCredential: credentials.map((entry) => ({
			"@type": "EducationalOccupationalCredential",
			name: entry.title,
			credentialCategory: "certificate",
			dateCreated: entry.completedAt,
			identifier: entry.certificateId,
			recognizedBy: {
				"@type": "Organization",
				name: entry.issuer
			},
			url: `${siteConfig.url}/zertifikate/${entry.id}.webp`
		}))
	};
	const pageUrl = absolute(credentialsHref(lang));
	const breadcrumbId = `${pageUrl}#breadcrumb`;
	const graph = asGraph(webPageNode({
		url: pageUrl,
		name: ui.title,
		description: pageDescriptions[lang],
		lang,
		dateModified: CREDENTIALS_UPDATED_AT,
		breadcrumbId
	}), breadcrumbNode(breadcrumbId, [{
		name: lang === "de" ? "Startseite" : "Home",
		url: absolute(homeHref)
	}, {
		name: ui.title,
		url: pageUrl
	}]), person, organizationSchema());
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${lang === "de" ? "Qualifikationen" : "Qualifications"} — ${siteConfig.name}`,
		"description": pageDescriptions[lang],
		"lang": lang,
		"alternates": {
			de: credentialsHref("de"),
			en: credentialsHref("en")
		},
		"jsonLd": graph,
		"data-astro-cid-tg2offfu": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, { "data-astro-cid-tg2offfu": true })}${maybeRenderHead($$result)}<main id="main" data-astro-cid-tg2offfu><section class="relative pt-36 pb-12 md:pt-44 md:pb-16" aria-labelledby="credentials-title" data-astro-cid-tg2offfu><div class="tds-decor" aria-hidden="true" data-astro-cid-tg2offfu><span class="tds-shape tds-shape--quarter-tl tds-shape--bordeaux" style="right: -8rem; bottom: -11rem; width: 29rem; height: 29rem; --tds-decor-shape-alpha: 0.13;" data-astro-cid-tg2offfu></span><span class="tds-shape tds-shape--rect tds-shape--outline tds-shape--navy hidden lg:block" style="right: 9%; top: 8rem; width: 11rem; height: 16rem; --tds-decor-shape-alpha: 0.2;" data-astro-cid-tg2offfu></span></div><div class="relative lp-container" data-astro-cid-tg2offfu><nav${addAttribute(ui.backNav, "aria-label")} class="mb-10" data-astro-cid-tg2offfu><a${addAttribute(homeHref, "href")} class="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors group [@media(pointer:coarse)]:min-h-11" data-astro-cid-tg2offfu><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-0.5" data-astro-cid-tg2offfu><line x1="19" y1="12" x2="5" y2="12" data-astro-cid-tg2offfu></line><polyline points="12 19 5 12 12 5" data-astro-cid-tg2offfu></polyline></svg>${ui.back}</a></nav><div class="max-w-3xl" data-astro-cid-tg2offfu><h1 id="credentials-title" class="display text-4xl sm:text-5xl md:text-6xl text-[var(--color-black)] leading-[1.04] mb-6" data-astro-cid-tg2offfu>${headingText(ui.headline, ui.headlineAccent)}</h1><span aria-hidden="true" class="tds-brandbar mb-8" data-astro-cid-tg2offfu></span><p class="lead text-[var(--color-muted)] mb-5" data-astro-cid-tg2offfu>${ui.lead}</p><p class="text-[var(--color-muted)] leading-relaxed" data-astro-cid-tg2offfu>${ui.answer}</p>${renderComponent($$result, "DetailMeta", $$DetailMeta, {
		"lang": lang,
		"updatedAt": CREDENTIALS_UPDATED_AT,
		"data-astro-cid-tg2offfu": true
	})}</div></div></section>${CREDENTIAL_GROUP_ORDER.map((group) => {
		const entries = credentialsInGroup(group);
		const heading = CREDENTIAL_GROUPS[group][lang];
		return renderTemplate`<section class="pb-14 md:pb-20"${addAttribute(`credentials-${group}`, "aria-labelledby")} data-astro-cid-tg2offfu><div class="lp-container" data-astro-cid-tg2offfu><div class="mb-8 max-w-2xl" data-astro-cid-tg2offfu><h2${addAttribute(`credentials-${group}`, "id")} class="display text-2xl md:text-3xl text-[var(--color-black)] mb-2" data-astro-cid-tg2offfu>${heading.title}</h2><p class="text-[var(--color-muted)] leading-relaxed" data-astro-cid-tg2offfu>${heading.lead}</p></div><div class="credential-grid"${addAttribute(`--credential-count: ${entries.length}`, "style")} data-astro-cid-tg2offfu>${entries.map((credential) => renderTemplate`${renderComponent($$result, "CredentialCard", $$CredentialCard, {
			"credential": credential,
			"lang": lang,
			"data-astro-cid-tg2offfu": true
		})}`)}</div></div></section>`;
	})}<section class="pb-24 md:pb-32" aria-labelledby="credentials-cta" data-astro-cid-tg2offfu><div class="lp-container" data-astro-cid-tg2offfu><div class="credential-cta" data-astro-cid-tg2offfu><h2 id="credentials-cta" class="display text-2xl md:text-3xl text-[var(--color-black)]" data-astro-cid-tg2offfu>${ui.ctaLead}</h2><a${addAttribute(contactHref, "href")} class="credential-cta__link" data-cta data-track="credentials-cta" data-astro-cid-tg2offfu>${ui.cta}<span aria-hidden="true" data-astro-cid-tg2offfu>${renderComponent($$result, "Arrow", $$Arrow, {
		"dir": "right",
		"data-astro-cid-tg2offfu": true
	})}</span></a></div></div></section>${renderComponent($$result, "PreviewLightbox", $$PreviewLightbox, {
		"lang": lang,
		"data-astro-cid-tg2offfu": true
	})}</main>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-tg2offfu": true })}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/CredentialsPage.astro", void 0);
export { $$CredentialsPage as t };
