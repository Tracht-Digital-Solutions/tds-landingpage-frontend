/**
 * The shape and the vocabulary of a card's footer bar.
 *
 * Split out of `ui/CardActions.astro` for the reason `demoCatalog.ts` is split
 * from `demos.ts` and `referencePreviewMeta.ts` from `referencePreviews.ts`:
 * an `.astro` file is a component, not a module other files can import a type
 * from. Four card families hand this component the same two links, and they
 * need one definition of what a link is rather than four hand-copied ones.
 */
import type { Lang } from "./i18n";

/**
 * What the enlarging button hands `ui/PreviewLightbox.astro` when it is
 * pressed. Every field lands on the button as a `data-preview-*` attribute.
 *
 * Present on a `CardAction` INSTEAD of `href`: a design study and a
 * certificate have no page to send anybody to — the picture is the whole of
 * them — so their call to action opens the dialog rather than navigating.
 */
export interface CardPreview {
  src: string;
  alt: string;
  title: string;
  /** The caption line under the title: a host, a sector, an issuer. */
  caption: string;
  /** `tall` lets the dialog scroll a full-page capture instead of squashing it. */
  fit?: "cover" | "tall";
  /** `width / height` of the picture, so the dialog reserves the right box. */
  ratio?: string;
  /** Further captures of the same thing, offered as a strip under the picture. */
  views?: ReadonlyArray<{ id: string; label: string; src: string; ratio: string }>;
}

export interface CardAction {
  /** The link's destination — or absent, when `preview` opens a dialog instead. */
  href?: string;
  /** Opens the shared lightbox instead of navigating. Never set beside `href`. */
  preview?: CardPreview;
  label: string;
  /** Leaves this site: new tab, `rel`, outward arrow, spoken hint. */
  external?: boolean;
  /** Only when the target's language differs from the page's. */
  hreflang?: string;
  /**
   * Words only a screen reader hears, appended to the link's accessible name.
   *
   * The call to action reads "Demo ansehen" on screen, which says nothing
   * about WHICH demo — and since its stretched `::after` covers the whole
   * card, it is the card's accessible name too. The card's title goes here.
   */
  detail?: string;
}

/**
 * The bar's own words — this site talking about its own controls, so they
 * follow the page's locale and are not editable copy. A mislabelled control is
 * an accessibility defect, not a matter of tone.
 *
 * `newTab` says the same thing as `demoUi.newTab` and `ReferenceCard`'s own
 * copy of it, and that repetition is deliberate: the bar is used by card
 * families that are kept apart on purpose, and reaching into one of their
 * vocabularies for one string would couple all of them to it.
 */
export const cardActionUi: Record<Lang, { service: string; newTab: string }> = {
  de: { service: "Leistung", newTab: "öffnet in neuem Tab" },
  en: { service: "Service", newTab: "opens in a new tab" },
};
