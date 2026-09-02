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
 */
export interface WebsiteDemosContent {
  headline: string;
  headlineAccent: string;
  intro: string;
  serviceIntro: string;
}

/**
 * Framing for the home page's references section.
 *
 * `label` repeats the anonymisation promise the service pages already make.
 * It belongs next to the cards, not only on the detail pages: the home page is
 * where most people meet a reference first, and "why is there no company name
 * here" is a question the section should answer before it is asked.
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
      // would otherwise put "Ihre IT. Ein" on line one, which reads as a
      // sentence cut in half.
      headline: "Ihre IT.",
      headlineAccent: "Ein",
      headlineSuffix: "Ansprechpartner.",
      sub:
        "Ich plane, baue und betreue Ihre Technik. *Sie haben einen Ansprechpartner* — nicht fünf Firmen, die aufeinander zeigen.",
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
        "Sechs Bereiche, *ein Ansprechpartner*. Wählen Sie einen Einstieg — oder wir klären zuerst gemeinsam, was Sie wirklich brauchen.",
    },
    websiteDemos: {
      headline: "Webseiten zum",
      headlineAccent: "Anschauen.",
      intro:
        "Fertige Beispielseiten, live im Netz. *Klicken Sie sich durch* — so sehen Sie vorher, was Sie bekommen, statt es sich vorstellen zu müssen.",
      serviceIntro:
        "Fertige Beispielseiten, live im Netz. *Klicken Sie sich durch*, bevor wir über Ihre sprechen.",
    },
    referencesHome: {
      headline: "Aus der",
      headlineAccent: "Praxis.",
      intro:
        "Ein Projekt, das über Jahre läuft — von der ersten Einrichtung bis zur *laufenden Pflege*.",
      label:
        "Veröffentlichte Beispiele erscheinen ausschließlich anonymisiert und nach Freigabe.",
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
        "Auf Wunsch die ganze IT übernehmen",
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
      headline: "Your IT.",
      headlineAccent: "One",
      headlineSuffix: "point of contact.",
      sub:
        "I plan, build and look after your technology. *You get one contact* — not five suppliers pointing at each other.",
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
        "Six areas, *one point of contact*. Pick a starting point — or let us work out first what you actually need.",
    },
    websiteDemos: {
      headline: "Websites to",
      headlineAccent: "look at.",
      intro:
        "Finished example sites, live on the web. *Click through them* — so you can see beforehand what you get instead of having to imagine it.",
      serviceIntro:
        "Finished example sites, live on the web. *Click through them* before we talk about yours.",
    },
    referencesHome: {
      headline: "From",
      headlineAccent: "practice.",
      intro:
        "One project running over years — from the first setup through to the *ongoing upkeep*.",
      label:
        "Published examples appear anonymised and only with the client's approval.",
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
        "Take over the whole of your IT if you want",
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
