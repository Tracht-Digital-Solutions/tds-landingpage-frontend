import { I as addAttribute, M as maybeRenderHead, T as renderComponent, j as renderTemplate } from "./sequence_BJTD5713.mjs";
import { t as createComponent } from "./astro-component_Bf647iZ6.mjs";
import { t as createAstro } from "./compiler_CC8dBrdY.mjs";
import { t as $$Layout, u as localizePath } from "./Layout_Dun72iYX.mjs";
import { o as $$Header, t as $$Footer } from "./Footer_DKn_rjf2.mjs";
// src/components/ImageRightsPage.astro
createAstro("https://tracht-digital.de");
var $$ImageRightsPage = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ImageRightsPage;
	const { lang } = Astro.props;
	const pageDescriptions = {
		de: "Bildrechte auf den Seiten von Tracht Digital Solutions: Herkunft der Bilder, Nutzung, Credit-Angabe und der Weg zu einer Nutzungserlaubnis.",
		en: "Image rights on the Tracht Digital Solutions sites: where the images come from, how they may be used, the credit line and how to request permission."
	};
	const copy = lang === "de" ? {
		title: "Bildrechte",
		origin: "Herkunft",
		originText: "Alle Fotos und Illustrationen auf den Seiten von Tracht Digital Solutions wurden mit ChatGPT erstellt. Die Ausnahme ist das Porträt von Julian Tracht. Bildschirmfotos zeigen Websites aus Projekten und Demos, Zertifikate sind Abbildungen der Originale.",
		use: "Nutzung",
		useText: "Eine Nutzung außerhalb dieser Seiten braucht eine vorherige Erlaubnis. Credit-Angabe: Tracht Digital Solutions.",
		ask: "Erlaubnis anfragen",
		askText: "Eine Anfrage nennt das Bild, den Zweck, den Ort der Veröffentlichung.",
		cta: "Zum Kontaktformular"
	} : {
		title: "Image rights",
		origin: "Origin",
		originText: "All photos and illustrations on the Tracht Digital Solutions sites were created with ChatGPT. The exception is the portrait of Julian Tracht. Screenshots show websites from projects and demos; certificates are images of the originals.",
		use: "Use",
		useText: "Any use outside these sites needs prior permission. Credit line: Tracht Digital Solutions.",
		ask: "Request permission",
		askText: "A request names the image, the purpose, the place of publication.",
		cta: "To the contact form"
	};
	const contact = `${localizePath("/", lang)}#contact`;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${copy.title} — Tracht Digital`,
		"description": pageDescriptions[lang],
		"lang": lang,
		"alternates": {
			de: "/bildrechte",
			en: "/en/image-rights"
		}
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main id="main" class="pt-36 pb-24 md:pt-44 md:pb-32"><div class="lp-container max-w-3xl"><h1 class="display text-4xl sm:text-5xl text-[var(--color-black)] mb-8">${copy.title}</h1><h2 class="display text-2xl text-[var(--color-black)] mb-2">${copy.origin}</h2><p class="text-[var(--color-muted)] leading-relaxed mb-8">${copy.originText}</p><h2 class="display text-2xl text-[var(--color-black)] mb-2">${copy.use}</h2><p class="text-[var(--color-muted)] leading-relaxed mb-8">${copy.useText}</p><h2 class="display text-2xl text-[var(--color-black)] mb-2">${copy.ask}</h2><p class="text-[var(--color-muted)] leading-relaxed mb-4">${copy.askText}</p><a class="underline text-[var(--color-accent)]"${addAttribute(contact, "href")}>${copy.cta}</a></div></main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/ImageRightsPage.astro", void 0);
export { $$ImageRightsPage as t };
