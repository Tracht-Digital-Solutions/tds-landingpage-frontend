import { DEMO_KINDS } from "./demoCatalog";
import { demoUi, getDemos, type ResolvedDemo } from "./demos";
import type { Lang } from "./i18n";
import { referenceCases, type ReferenceCase } from "./references";
import { getReferencePreviews, type ResolvedPreview } from "./referencePreviews";
import { getServiceById, serviceHref } from "./services";

/**
 * The hero slider's slides — the work this business can actually be judged by:
 * published reference cases and live website demos, flattened to what a card
 * in the hero needs and nothing else.
 *
 * ### Why work and not the service catalog
 *
 * The hero says what this business is ("Alles Digitale. Ein Ansprechpartner.")
 * and the four service cards a screen further down say what that means. The
 * hero slider used to repeat those four cards, which put the same claim on the
 * screen twice and still asked the visitor to take it on trust. What a
 * stranger cannot assume is that any of it was ever built. So the slider shows
 * the built things — the delivered cases and the demo sites — and links to
 * them, and the services keep the section that is already theirs.
 *
 * ### Why this is resolved on the SERVER
 *
 * `Hero.tsx` is a client island. Importing the reference and demo modules from
 * it would ship the whole case catalogue, the demo snapshot and the
 * availability probes to the browser so the hero can show a handful of titles.
 * The page resolves the slides here and hands over the fields that are
 * actually rendered.
 *
 * ### Availability is not decorative
 *
 * A demo that does not answer, answers over a certificate a browser rejects,
 * or serves a hosting placeholder is not shown — `getDemos()` owns that rule
 * and this file does not get to soften it, least of all in the hero, where a
 * dead link is the first thing a visitor touches. Reference screenshots pass
 * the same gate plus consent (`getReferencePreviews()`).
 *
 * Both are memoised per render generation, and `Showcase.astro` on the same
 * page calls both. The hero therefore costs no extra round of probes; it
 * shares the shelf's.
 */

/** Which family a slide came from. The renderer styles both the same. */
export type HeroSlideKind = "reference" | "demo";

export interface HeroSlide {
  /**
   * Stable React key and tab/panel id stem. Prefixed by family because a case
   * id and a demo id live in different namespaces and could collide.
   */
  id: string;
  kind: HeroSlideKind;
  /**
   * The line above the title.
   *
   * For a demo this is the genre etiquette from `DEMO_KINDS` — the single
   * code-owned string on a demo card, and it names the genre, never the
   * subject. For a case it is the case's own `context`, which is what that
   * line already is on the reference card.
   */
  eyebrow: string;
  title: string;
  /** The demo's own meta description, or the case's reported result. */
  summary: string;
  /** Mono pills: a demo's address, a case's countable metric. Already localized. */
  chips: readonly string[];
  href: string;
  /** Demos live on their own hosts, so their links leave this site. */
  external: boolean;
  /** The link's own words — "Demo ansehen" reads differently from "Mehr erfahren". */
  cta: string;
  /** `null` renders no image and no box: a slide without artwork is quieter, not broken. */
  image: string | null;
  /** Describes the picture in the PAGE's language, as on the demo card. */
  imageAlt: string;
  imageWidth: number | null;
  imageHeight: number | null;
}

/**
 * The link label on a reference slide — this site's words about its own work.
 *
 * A demo slide takes `demoUi.visit` instead ("Demo ansehen"), because the two
 * links do different things: one opens a sample site on its own host, the
 * other walks further into this one.
 */
export const heroSlideUi: Record<Lang, { more: string }> = {
  de: { more: "Mehr erfahren" },
  en: { more: "Learn more" },
};

/** One slide from one live demo. Exported for the test. */
export function toDemoSlide(demo: ResolvedDemo, lang: Lang): HeroSlide {
  const { definition } = demo;
  return {
    id: `demo:${definition.id}`,
    kind: "demo",
    eyebrow: DEMO_KINDS[definition.kind][lang],
    title: demo.title,
    // Never written for the demo: one with no meta description shows none.
    summary: demo.description ?? "",
    chips: [definition.host],
    href: definition.url,
    external: true,
    cta: demoUi[lang].visit,
    image: demo.preview,
    imageAlt:
      lang === "de"
        ? `Startseite der Demo-Webseite ${demo.title}`
        : `Home page of the demo website ${demo.title}`,
    imageWidth: demo.previewWidth,
    imageHeight: demo.previewHeight,
  };
}

/** One slide from one published case. Exported for the test. */
export function toReferenceSlide(
  entry: ReferenceCase,
  lang: Lang,
  preview: ResolvedPreview | null,
): HeroSlide {
  const content = entry.content[lang];
  // The FIRST service is the primary one — the same link the home page's
  // reference card leads with. A case naming three services still has one
  // page it belongs to first.
  const service = getServiceById(entry.services[0]!);
  const metric = content.metric?.trim() ?? "";

  return {
    id: `reference:${entry.id}`,
    kind: "reference",
    eyebrow: content.context,
    title: content.title,
    // The outcome, not the problem. Three lines in the hero are worth spending
    // on what came out of the work rather than on what was wrong before it.
    summary: content.result,
    chips: metric === "" ? [] : [metric],
    href: serviceHref(service, lang),
    external: false,
    cta: heroSlideUi[lang].more,
    image: preview?.src ?? null,
    imageAlt:
      lang === "de"
        ? `Webseite aus dem Referenzprojekt ${content.title}`
        : `Website from the reference project ${content.title}`,
    imageWidth: preview?.width ?? null,
    imageHeight: preview?.height ?? null,
  };
}

/**
 * Pull the first slide that carries a picture to the front.
 *
 * The same decision `Showcase.astro` makes about its lead card, for the same
 * reason and deliberately not a second ordering rule. Cases come before demos
 * because a delivered project is the stronger claim — but a case without an
 * approved screenshot is a paragraph of text, and without this the hero would
 * open on one while the slide that SHOWS a built page waits six seconds
 * off-screen. A visitor who came to see what this does should not have to wait
 * for it.
 *
 * The hoist is for a property a slide either has or does not have, never for
 * being a demo. It was written when every case was `previewAllowed: false` and
 * a demo was the only slide with a picture; `hof-meerheck` has since been
 * cleared for a screenshot and now leads, without a line here changing. That
 * is the rule working, not an exception to it.
 */
export function leadWithPicture(slides: readonly HeroSlide[]): HeroSlide[] {
  const index = slides.findIndex((slide) => slide.image !== null);
  if (index <= 0) return [...slides];
  return [slides[index]!, ...slides.slice(0, index), ...slides.slice(index + 1)];
}

/**
 * Every showable case and demo, ready for the hero island.
 *
 * Returns an empty array when nothing is showable — no case, every demo down.
 * `Hero.tsx` then renders its single-column self, with no empty frame where a
 * card would be. That is a real state, not a failure: the availability rules
 * above can empty this list overnight without anybody deploying.
 */
export async function getHeroSlides(lang: Lang): Promise<HeroSlide[]> {
  const [demos, previews] = await Promise.all([getDemos(), getReferencePreviews()]);

  // Read straight from `referenceCases`, exactly as `Showcase.astro` does and
  // NOT through `resolveServiceContent`: the documented way to pull a case off
  // a service page without a deploy is an explicitly empty `references` array
  // in that service's block, and it is scoped to that service page. It does
  // not reach the home page, and it must not silently reach the hero either.
  const references = referenceCases.map((entry) =>
    toReferenceSlide(entry, lang, previews.get(entry.id) ?? null),
  );

  return leadWithPicture([...references, ...demos.map((demo) => toDemoSlide(demo, lang))]);
}
