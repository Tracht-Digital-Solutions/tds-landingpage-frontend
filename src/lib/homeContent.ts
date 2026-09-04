import type { Lang } from "./i18n";

/**
 * Committed copy for the home page's editable blocks.
 *
 * Each object below is BOTH the default and the runtime schema `cmsFor()`
 * merges an admin-edited block over, so a field removed here stops being
 * overridable at all. Keep both languages in step: they are edited
 * separately in the panel and nothing checks them against each other.
 *
 * `*asterisks*` in a string mark a word for emphasis (see `./emphasis`).
 * They are optional: a CMS override without them renders as plain text.
 */

export interface HomeHeroContent {
  headline: string;
  headlineAccent: string;
  headlineSuffix: string;
  sub: string;
  cta1: string;
  cta2: string;
  scrollHint: string;
}

export interface WhyMeContent {
  headline: string;
  headlineAccent: string;
  lead: string;
  p1: string;
  p2: string;
  reasons: Array<{
    title: string;
    description: string;
  }>;
}

export interface ServicesOverviewContent {
  headline: string;
  headlineAccent: string;
  intro: string;
}

/**
 * Section copy for the website demos.
 *
 * Only the framing lives here. Every word ON a demo card — its name, its
 * description — comes from the demo site itself through
 * `npm run demos:sync`, and the hosts are code-owned in `demoCatalog.ts`. So
 * there is deliberately no list here to override: the CMS can retitle the
 * section, never repopulate it.
 *
 * `serviceIntro` is the shorter lead used on the Webauftritt service page,
 * where the surrounding page has already made the argument.
 *
 * ### Why there is a second, singular set
 *
 * How many demos render is decided by `getDemos()`, not by an editor — a host
 * with an expired certificate simply drops out. The plural copy ("Fertige
 * Beispielseiten", "Klicken Sie sich durch") then stands over a single card
 * and promises a shelf that is not there. So the section carries both counts
 * and `demosCopy()` picks; the accent word is shared because it does not
 * inflect in either language.
 */
export interface WebsiteDemosContent {
  headline: string;
  headlineAccent: string;
  intro: string;
  serviceIntro: string;
  /** Used verbatim when exactly one demo survived the availability check. */
  headlineSingle: string;
  introSingle: string;
  serviceIntroSingle: string;
}

/**
 * Framing for the home page's references section.
 *
 * `label` repeats the publication promise the service pages already make. It
 * belongs next to the cards, not only on the detail pages: the home page is
 * where most people meet a reference first, and the question the section has
 * to answer before it is asked is now "why does one card name a company and
 * the other does not" — so the sentence leads with approval, and treats
 * anonymity as the default it actually is.
 *
 * `references.test.ts` checks this string against the catalog: while a case is
 * published under a customer's name, no surface may claim that references are
 * anonymous without exception.
 */
export interface ReferencesHomeContent {
  headline: string;
  headlineAccent: string;
  intro: string;
  label: string;
  /** Link text on each card, pointing at the service the case belongs to. */
  serviceCta: string;
}

export interface DigitalResponsibilityContent {
  headline: string;
  headlineAccent: string;
  body: string;
  points: string[];
  primaryCta: string;
  secondaryCta: string;
}

/**
 * Nur die Überschrift des Kontaktabschnitts.
 *
 * Der Rest des `contact`-Blocks (Label, Untertitel, E-Mail, Telefon, Ort)
 * kommt weiterhin aus tds-shared, weil der Footer dieselben Felder liest.
 * Die Überschrift ist dagegen reine Startseiten-Copy: sie steht in genau
 * einem `<h2>` in `sections/Contact.astro` und nirgends sonst — deshalb
 * liegt sie hier bei den anderen Startseiten-Texten statt im geteilten
 * Paket, wo eine Textänderung eine Minor-Release samt Nachziehen der Pins
 * in allen Konsumenten bedeuten würde.
 */
export interface ContactHeadingContent {
  headline: string;
  headlineAccent: string;
}

interface HomeContent {
  hero: HomeHeroContent;
  whyMe: WhyMeContent;
  servicesOverview: ServicesOverviewContent;
  websiteDemos: WebsiteDemosContent;
  referencesHome: ReferencesHomeContent;
  digitalResponsibility: DigitalResponsibilityContent;
  contactHeading: ContactHeadingContent;
}

const content: Record<Lang, HomeContent> = {
  de: {
    hero: {
      // Three parts, and the split is the line break: the headline is set
      // on one line, the accent word starts the second. `text-wrap: balance`
      // would otherwise pull "Ein" up onto line one, which reads as a
      // sentence cut in half.
      headline: "Alles Digitale.",
      headlineAccent: "Ein",
      headlineSuffix: "Ansprechpartner.",
      sub:
        "Ich plane und baue, was Ihr Betrieb wirklich braucht. *Sie haben einen Ansprechpartner* — nicht fünf Firmen, die aufeinander zeigen.",
      cta1: "Erstgespräch vereinbaren",
      cta2: "zu den Leistungen",
      scrollHint: "Wieso ich?",
    },
    whyMe: {
      headline: "Wieso",
      headlineAccent: "ich?",
      lead:
        "Sie brauchen jemanden, der den *Überblick behält* — nicht jemanden, der einzelne Aufträge abarbeitet.",
      p1:
        "Ich berate und setze selbst um. Sie müssen nichts zwischen mehreren Firmen übersetzen, und es gibt immer jemanden, der das ganze Bild kennt.",
      p2:
        "Ich erkläre Ihnen die Möglichkeiten in normaler Sprache und bleibe auf Wunsch auch nach dem Start zuständig.",
      reasons: [
        {
          title: "Ein fester Ansprechpartner",
          description: "Sie wissen immer, wer sich kümmert.",
        },
        {
          title: "Verständlich erklärt",
          description: "Klare Möglichkeiten und Kosten, ohne Fachsprache.",
        },
        {
          title: "Beratung und Umsetzung",
          description: "Ich plane es nicht nur — ich baue es auch.",
        },
        {
          title: "Auch nach dem Start da",
          description: "Auf Wunsch betreue ich alles dauerhaft weiter.",
        },
      ],
    },
    servicesOverview: {
      headline: "Was ich",
      headlineAccent: "anbiete?",
      intro:
        "Vier Bereiche, *ein Ansprechpartner*. Wählen Sie einen Einstieg — oder wir klären zuerst gemeinsam, was Sie wirklich brauchen.",
    },
    websiteDemos: {
      headline: "Webseiten zum",
      headlineAccent: "Anschauen.",
      intro:
        "Fertige Beispielseiten, live im Netz. *Klicken Sie sich durch* — so sehen Sie vorher, was Sie bekommen, statt es sich vorstellen zu müssen.",
      serviceIntro:
        "Fertige Beispielseiten, live im Netz. *Klicken Sie sich durch*, bevor wir über Ihre sprechen.",
      headlineSingle: "Eine Webseite zum",
      introSingle:
        "Eine fertige Beispielseite, live im Netz. *Sehen Sie sich um* — so sehen Sie vorher, was Sie bekommen, statt es sich vorstellen zu müssen.",
      serviceIntroSingle:
        "Eine fertige Beispielseite, live im Netz. *Sehen Sie sich um*, bevor wir über Ihre sprechen.",
    },
    referencesHome: {
      headline: "Aus der",
      headlineAccent: "Praxis.",
      intro:
        "Projekte, die nicht mit dem Livegang enden — von der ersten Einrichtung bis zur *laufenden Pflege*.",
      label:
        "Veröffentlicht wird nur nach ausdrücklicher Freigabe — anonymisiert, sofern nicht anders vereinbart.",
      serviceCta: "Zur passenden Leistung",
    },
    digitalResponsibility: {
      headline: "Ein Ansprechpartner für",
      headlineAccent: "alles Digitale.",
      body:
        "Digitale Themen bleiben oft liegen: zwischen Projekten, Anbietern und der Frage, wer eigentlich zuständig ist. Ich behalte den Überblick und sorge dafür, dass alles zusammenpasst.",
      points: [
        "Sagen, was zuerst dran ist — verständlich",
        "Projekte selbst umsetzen oder Beteiligte steuern",
        "Vorhandene Systeme und neue Lösungen zusammenbringen",
        "Den Auftritt sichtbar machen und dort pflegen, wo er wirkt",
      ],
      primaryCta: "Erstgespräch vereinbaren",
      secondaryCta: "Preise ansehen",
    },
    contactHeading: {
      headline: "Womit fangen",
      headlineAccent: "wir an?",
    },
  },
  en: {
    hero: {
      headline: "Everything digital.",
      headlineAccent: "One",
      headlineSuffix: "point of contact.",
      sub:
        "I plan and build what your business actually needs. *You get one contact* — not five suppliers pointing at each other.",
      cta1: "Arrange an initial consultation",
      cta2: "View services",
      scrollHint: "Why me?",
    },
    whyMe: {
      headline: "Why",
      headlineAccent: "me?",
      lead:
        "You need someone who *keeps the whole picture* in view — not someone who works through isolated tasks.",
      p1:
        "I advise and build. You never have to translate a decision between suppliers, and someone always knows how the whole setup fits together.",
      p2:
        "I explain the options in plain language and, if you want, stay responsible after launch.",
      reasons: [
        {
          title: "One steady contact",
          description: "You always know who is taking care of it.",
        },
        {
          title: "Explained plainly",
          description: "Clear options and costs, without the jargon.",
        },
        {
          title: "Advice and delivery",
          description: "I do not just plan it — I build it.",
        },
        {
          title: "Still there after launch",
          description: "I can keep running and improving it for you.",
        },
      ],
    },
    servicesOverview: {
      headline: "What I",
      headlineAccent: "offer?",
      intro:
        "Four areas, *one point of contact*. Pick a starting point — or let us work out first what you actually need.",
    },
    websiteDemos: {
      headline: "Websites to",
      headlineAccent: "look at.",
      intro:
        "Finished example sites, live on the web. *Click through them* — so you can see beforehand what you get instead of having to imagine it.",
      serviceIntro:
        "Finished example sites, live on the web. *Click through them* before we talk about yours.",
      headlineSingle: "A website to",
      introSingle:
        "A finished example site, live on the web. *Take a look around* — so you can see beforehand what you get instead of having to imagine it.",
      serviceIntroSingle:
        "A finished example site, live on the web. *Take a look around* before we talk about yours.",
    },
    referencesHome: {
      headline: "From",
      headlineAccent: "practice.",
      intro:
        "Projects that do not end at launch — from the first setup through to the *ongoing upkeep*.",
      label:
        "Published only with the client's explicit approval — anonymised unless agreed otherwise.",
      serviceCta: "See the matching service",
    },
    digitalResponsibility: {
      headline: "One point of contact for",
      headlineAccent: "everything digital.",
      body:
        "Digital work tends to stall between one-off projects, suppliers and the question of who owns it. I keep the overview and make sure the pieces fit together.",
      points: [
        "Say what comes first — in plain terms",
        "Deliver projects directly or steer the people involved",
        "Bring existing systems and new solutions together",
        "Make the presence visible and keep it working over time",
      ],
      primaryCta: "Arrange an initial consultation",
      secondaryCta: "View pricing",
    },
    contactHeading: {
      headline: "Where shall we",
      headlineAccent: "start?",
    },
  },
};

export function getHomeContent(lang: Lang): HomeContent {
  return content[lang];
}

/** The three strings the demos section renders, for one count and one surface. */
export interface DemosCopy {
  headline: string;
  headlineAccent: string;
  intro: string;
}

/**
 * Pick the demo section's framing for the number of cards that survived.
 *
 * Takes the already-merged content, so a CMS override of any single field is
 * honoured on both counts. `count` is the length of `getDemos()`, never a
 * configured number: the section only ever describes what it is about to show.
 *
 * A count of 0 never reaches a reader — the section renders nothing at all —
 * but it returns the plural set rather than throwing, because a section header
 * is not the place to discover an empty list.
 */
export function demosCopy(
  content: WebsiteDemosContent,
  count: number,
  variant: "home" | "service",
): DemosCopy {
  const single = count === 1;
  return {
    headline: single ? content.headlineSingle : content.headline,
    headlineAccent: content.headlineAccent,
    intro: single
      ? variant === "service"
        ? content.serviceIntroSingle
        : content.introSingle
      : variant === "service"
        ? content.serviceIntro
        : content.intro,
  };
}
