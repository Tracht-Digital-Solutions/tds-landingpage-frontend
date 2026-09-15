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
 *
 * ### The standing copy rules (see `homeContent.test.ts`, `addressForm.test.ts`)
 *
 * - **du**, lowercase (decided 2026-09-15). Only the legal texts stay formal.
 * - No free and no time-boxed first conversation: never "kostenlos",
 *   "kostenfrei", "gratis" or a minute count. The one sentence about cost is
 *   "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren." (decided
 *   2026-08, confirmed 2026-09-12).
 * - No project price ranges — the cost LOGIC is explained, nothing estimated.
 * - Every sentence states something the site can back: a fact from
 *   `siteConfig`, the reference catalog, the pricing block, or a promise the
 *   site already made elsewhere. No invented numbers, clients or outcomes.
 *
 * The blocks added in the 2026-09 redesign (`home_trust`, `first_call`,
 * `pricing_logic`) and the fields added on 2026-09-15 (`home_hero.ctaNote`,
 * `contact.sub`'s local default, `journalHeading`) have no Website-CMS schema
 * yet. Like `references_home` and `website_demos` before them they fall back
 * cleanly to what is written here until the panel declares them.
 */

export interface HomeHeroContent {
  /**
   * The line above the H1: WHO the page is for.
   *
   * A business decides in seconds whether a page is meant for it; the target
   * group belongs in the first line it reads.
   */
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  headlineSuffix: string;
  /** The benefit claim under the H1: the problems, and what the visitor ends up with. */
  sub: string;
  cta1: string;
  cta2: string;
  /**
   * One line under the actions that takes the risk out of the primary one:
   * when costs arise and how soon an answer comes — the two statements the site
   * already makes elsewhere, nothing new.
   */
  ctaNote: string;
  /** Not rendered since the 2026-09 redesign; kept so a stored `home_hero` block still loads. */
  scrollHint: string;
}

export interface WhyMeContent {
  headline: string;
  headlineAccent: string;
  lead: string;
  p1: string;
  p2: string;
  /**
   * Not rendered since the 2026-09 redesign — the hero's trust card carries
   * three facts that can be checked instead. Kept in the shape so a stored
   * `why_me` block stays readable in the editor.
   */
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
 * Section copy for the example sites (`sections/Showcase.astro` on the home
 * page, `sections/WebsiteDemos.astro` on the Webauftritt page).
 *
 * Only the framing lives here. Every word ON a demo card — its name, its
 * description — comes from the demo site itself through
 * `npm run demos:sync`, and the hosts are code-owned in `demoCatalog.ts`. So
 * there is deliberately no list here to override: the CMS can retitle the
 * section, never repopulate it.
 *
 * The framing says plainly that these are NOT client work.
 *
 * ### Why there is a second, singular set
 *
 * How many demos render is decided by `getDemos()`, not by an editor — a host
 * with an expired certificate simply drops out. The plural copy then stands
 * over a single card and promises a shelf that is not there. So the section
 * carries both counts and `demosCopy()` picks; the accent word is shared
 * because it does not inflect in either language.
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
 * Framing for the home page's CUSTOMER CASES (`sections/CustomerCases.astro`).
 *
 * The CMS key stays `references_home` — renaming the key would orphan whatever
 * is stored under it in the panel.
 *
 * `label` repeats the publication promise the service pages make. While a case
 * is published under a customer's name, no surface may claim that references
 * are anonymous without exception — `references.test.ts` checks this string
 * against the catalog.
 */
export interface ReferencesHomeContent {
  headline: string;
  headlineAccent: string;
  intro: string;
  label: string;
  /** Not rendered any more (the card's service badges replaced it); kept for stored blocks. */
  serviceCta: string;
}

/**
 * The navy positioning band. Not rendered since the 2026-09 redesign — it
 * repeated the hero's claim and the hero's two buttons one screen further
 * down. Kept so a stored `digital_responsibility` block still loads.
 */
export interface DigitalResponsibilityContent {
  headline: string;
  headlineAccent: string;
  body: string;
  points: string[];
  primaryCta: string;
  secondaryCta: string;
}

/**
 * The contact section's heading and the sentence under it.
 *
 * The rest of the `contact` block (label, email, phone, location) still comes
 * from tds-shared, because the footer reads the same fields. The heading and
 * the sub are home-page copy — and since 2026-09-15 the sub says "du", which
 * the shared bundle does not.
 */
export interface ContactHeadingContent {
  headline: string;
  headlineAccent: string;
  sub: string;
}

/** The journal teaser's heading — formerly tds-shared's `blog.headline`, shared with the blog. */
export interface JournalHeadingContent {
  headline: string;
  headlineAccent: string;
}

/**
 * One fact on the hero's trust card.
 *
 * `text` may carry `{name}`, `{town}` and `{rate}`. They are filled from
 * `siteConfig` and the pricing block by `resolveTrustFacts`, never typed into
 * the copy: the Impressum and the price list are where those values are true,
 * and a sentence that repeats them by hand drifts the first time either moves.
 */
export interface TrustFact {
  title: string;
  text: string;
  /** The link's words. Where it points is code-owned: {@link TRUST_TARGETS}. */
  linkLabel: string;
}

/**
 * The hero's trust card: THREE facts a visitor can check, each linking to the
 * part of the page that proves it. Not four, not a row of logos — a trust
 * signal that cannot be checked is decoration.
 */
export interface HomeTrustContent {
  title: string;
  facts: TrustFact[];
}

export interface FirstCallItem {
  label: string;
  text: string;
}

/**
 * What the first conversation is: goal, preparation, outcome, cost.
 * Rendered by `ui/FirstCall.astro` in the process section, the contact block
 * and above each service page's closing call to action.
 */
export interface FirstCallContent {
  title: string;
  /** The contact block's title for the same list: "So geht es weiter". */
  nextStepsTitle: string;
  items: FirstCallItem[];
  cta: string;
}

export interface PricingLogicStep {
  title: string;
  text: string;
}

/** "So entsteht dein Preis" — how a price comes about, without estimating one. */
export interface PricingLogicContent {
  title: string;
  steps: PricingLogicStep[];
  note: string;
}

interface HomeContent {
  hero: HomeHeroContent;
  whyMe: WhyMeContent;
  servicesOverview: ServicesOverviewContent;
  websiteDemos: WebsiteDemosContent;
  referencesHome: ReferencesHomeContent;
  digitalResponsibility: DigitalResponsibilityContent;
  contactHeading: ContactHeadingContent;
  journalHeading: JournalHeadingContent;
  trust: HomeTrustContent;
  firstCall: FirstCallContent;
  pricingLogic: PricingLogicContent;
}

const content: Record<Lang, HomeContent> = {
  de: {
    hero: {
      eyebrow: "Für Selbstständige, lokale Betriebe und kleine Unternehmen",
      // Two benefits for the site's two halves — the web presence and the
      // digitalization — and the split is the line break: the headline is one
      // line, the accent word starts the second. `text-wrap: balance` would
      // otherwise pull the accent word up onto line one.
      headline: "Websites, die Kunden bringen.",
      headlineAccent: "Digitalisierung,",
      headlineSuffix: "die entlastet.",
      sub:
        "Veraltete Website, Ärger mit dem Shop, doppelte Handarbeit? Ich plane die Lösung, setze sie selbst um und bleibe *dein fester Ansprechpartner*.",
      cta1: "Erstgespräch vereinbaren",
      cta2: "Leistungen ansehen",
      ctaNote:
        "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren. Antwort in der Regel innerhalb von 24 Stunden.",
      scrollHint: "Wieso ich?",
    },
    whyMe: {
      headline: "Wieso",
      headlineAccent: "ich?",
      lead:
        "Du brauchst jemanden, der *den Überblick behält* – nicht fünf Anbieter, die sich gegenseitig die Verantwortung zuschieben.",
      p1:
        "Ich berate und setze selbst um: Website, Shop und Abläufe aus einer Hand. Du musst nichts zwischen Agentur, Programmierer und Hoster übersetzen.",
      p2:
        "Ich erkläre dir die Möglichkeiten in normaler Sprache und bleibe auf Wunsch auch nach dem Start dein Ansprechpartner – aus Schwarzenbek bei Hamburg, für Betriebe in ganz Deutschland.",
      reasons: [
        {
          title: "Ein fester Ansprechpartner",
          description: "Du weißt immer, wer sich kümmert.",
        },
        {
          title: "Verständlich erklärt",
          description: "Klare Möglichkeiten und Kosten, ohne Fachsprache.",
        },
        {
          title: "Beratung und Umsetzung",
          description: "Ich plane es nicht nur – ich baue es auch.",
        },
        {
          title: "Auch nach dem Start da",
          description: "Auf Wunsch betreue ich alles dauerhaft weiter.",
        },
      ],
    },
    servicesOverview: {
      headline: "Wobei ich dir",
      headlineAccent: "helfe.",
      intro:
        "Vier Leistungen, *ein Ansprechpartner*: vom Webauftritt bis zur Digitalisierung deiner Abläufe. Such dir den passenden Einstieg aus.",
    },
    websiteDemos: {
      headline: "Beispielseiten zum",
      headlineAccent: "Ausprobieren.",
      intro:
        "Eigene Demos mit fiktiven Firmen und eigene Projekte – *keine Kundenaufträge*. Klick dich durch, bevor wir über deine Seite sprechen.",
      serviceIntro:
        "Eigene Demos und Projekte, live im Netz – *keine Kundenaufträge*. Klick dich durch, bevor wir über deine sprechen.",
      headlineSingle: "Eine Beispielseite zum",
      introSingle:
        "Eine eigene Beispielseite, live im Netz – *kein Kundenauftrag*. Schau dich um, bevor wir über deine Seite sprechen.",
      serviceIntroSingle:
        "Eine eigene Beispielseite, live im Netz – *kein Kundenauftrag*. Schau sie dir an, bevor wir über deine sprechen.",
    },
    referencesHome: {
      headline: "Umgesetzt für",
      headlineAccent: "Kunden.",
      intro:
        "Echte Projekte – mit dem, was *dabei herausgekommen ist*, und den Leistungen dahinter.",
      label:
        "Veröffentlicht nur mit ausdrücklicher Freigabe der Kunden – anonymisiert, sofern nicht anders vereinbart.",
      serviceCta: "Zur passenden Leistung",
    },
    digitalResponsibility: {
      headline: "Ein Ansprechpartner für",
      headlineAccent: "alles Digitale.",
      body:
        "Digitale Themen bleiben oft liegen: zwischen Projekten, Anbietern und der Frage, wer eigentlich zuständig ist. Ich behalte den Überblick und sorge dafür, dass alles zusammenpasst.",
      points: [
        "Sagen, was zuerst dran ist – verständlich",
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
      sub: "Schreib mir in zwei, drei Sätzen, wo es hakt. Ich antworte in der Regel innerhalb von 24 Stunden.",
    },
    journalHeading: {
      headline: "Wissen für",
      headlineAccent: "deinen Betrieb.",
    },
    trust: {
      title: "Darauf kannst du dich verlassen",
      facts: [
        {
          title: "Ein fester Ansprechpartner",
          text: "Du sprichst immer mit mir: {name}, Inhaber, aus {town} bei Hamburg.",
          linkLabel: "Wer ich bin",
        },
        {
          title: "Echte Kundenprojekte",
          text: "Umgesetzte Arbeit, veröffentlicht nur mit Freigabe der Kunden.",
          linkLabel: "Projekte ansehen",
        },
        {
          title: "Offene Preise",
          text: "Stundensätze ab {rate} € netto, Festpreis bei klarem Umfang.",
          linkLabel: "Preise ansehen",
        },
      ],
    },
    firstCall: {
      title: "Das Erstgespräch",
      nextStepsTitle: "So geht es weiter",
      items: [
        {
          label: "Ziel",
          text: "Du schilderst, wo es hakt. Ich frage nach und sage dir ehrlich, ob und wie ich helfen kann.",
        },
        {
          label: "Vorbereitung",
          text: "Zwei, drei Sätze zu deiner Lage genügen – ein Link hilft.",
        },
        {
          label: "Ergebnis",
          text: "Du weißt danach, was zuerst dran ist und was es ungefähr kostet.",
        },
        {
          label: "Kosten",
          text: "Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
        },
      ],
      cta: "Erstgespräch vereinbaren",
    },
    pricingLogic: {
      title: "So entsteht dein Preis",
      steps: [
        {
          title: "Einordnen",
          text: "Im Erstgespräch klären wir Ziel und Umfang. Kosten entstehen erst, wenn wir einen Auftrag vereinbaren.",
        },
        {
          title: "Abrechnen",
          text: "Nach Aufwand zum Stundensatz – oder zum Festpreis, wenn Ziel und Umfang vorher klar sind.",
        },
        {
          title: "Weiter betreuen",
          text: "Für die laufende Betreuung gibt es auf Wunsch Monatsmodelle.",
        },
      ],
      note: "Wovon der Aufwand abhängt: vom Bereich, vom Umfang und davon, wie klar die Aufgabe ist.",
    },
  },
  en: {
    hero: {
      eyebrow: "For the self-employed, local businesses and small companies",
      headline: "Websites that bring in customers.",
      headlineAccent: "Digitalization",
      headlineSuffix: "that saves you time.",
      sub:
        "An outdated website, trouble with your shop, data typed in twice? I plan the fix, build it myself and stay *your single point of contact*.",
      cta1: "Arrange an initial consultation",
      cta2: "View services",
      ctaNote: "Costs only arise once we agree on an assignment. I usually reply within 24 hours.",
      scrollHint: "Why me?",
    },
    whyMe: {
      headline: "Why",
      headlineAccent: "me?",
      lead:
        "You need someone who *keeps the whole picture* in view – not five suppliers passing responsibility back and forth.",
      p1:
        "I advise and build: website, shop and workflows from one source. You never have to translate between an agency, a developer and a host.",
      p2:
        "I explain the options in plain language and, if you like, stay your point of contact after launch – based in Schwarzenbek near Hamburg, working with businesses across Germany.",
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
      headline: "How I can",
      headlineAccent: "help.",
      intro:
        "Four services, *one point of contact*: from your web presence to digitalizing your workflows. Pick the starting point that fits.",
    },
    websiteDemos: {
      headline: "Example sites to",
      headlineAccent: "try out.",
      intro:
        "My own demos with fictional companies, plus projects of my own – *not client work*. Click through them before we talk about yours.",
      serviceIntro:
        "My own demos and projects, live on the web – *not client work*. Click through them before we talk about yours.",
      headlineSingle: "An example site to",
      introSingle:
        "One of my own example sites, live on the web – *not client work*. Take a look around before we talk about yours.",
      serviceIntroSingle:
        "One of my own example sites, live on the web – *not client work*. Have a look before we talk about yours.",
    },
    referencesHome: {
      headline: "Delivered for",
      headlineAccent: "clients.",
      intro:
        "Real projects – with *what came out of them* and the services behind them.",
      label:
        "Published only with the client's explicit approval – anonymised unless agreed otherwise.",
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
      sub: "Tell me in two or three sentences where things get stuck. I usually reply within 24 hours.",
    },
    journalHeading: {
      headline: "Know-how for",
      headlineAccent: "your business.",
    },
    trust: {
      title: "What you can rely on",
      facts: [
        {
          title: "One steady contact",
          text: "You always talk to me: {name}, owner, based in {town} near Hamburg.",
          linkLabel: "Who I am",
        },
        {
          title: "Real client projects",
          text: "Delivered work, published only with the client's approval.",
          linkLabel: "View projects",
        },
        {
          title: "Open pricing",
          text: "Hourly rates from €{rate} net, a fixed price when the scope is clear.",
          linkLabel: "View pricing",
        },
      ],
    },
    firstCall: {
      title: "The first conversation",
      nextStepsTitle: "What happens next",
      items: [
        {
          label: "Goal",
          text: "You describe where things get stuck. I ask questions and tell you honestly whether and how I can help.",
        },
        {
          label: "Preparation",
          text: "Two or three sentences about your situation are enough – a link helps.",
        },
        {
          label: "Outcome",
          text: "Afterwards you know what comes first and roughly what it costs.",
        },
        {
          label: "Costs",
          text: "Costs only arise once we agree on an assignment.",
        },
      ],
      cta: "Arrange an initial consultation",
    },
    pricingLogic: {
      title: "How your price comes about",
      steps: [
        {
          title: "Assess",
          text: "In the first conversation we clarify goal and scope. Costs only arise once we agree on an assignment.",
        },
        {
          title: "Invoice",
          text: "By effort at the hourly rate – or at a fixed price when goal and scope are clear up front.",
        },
        {
          title: "Look after it",
          text: "Monthly arrangements are available for ongoing support, if you want them.",
        },
      ],
      note: "What the effort depends on: the area, the scope and how clearly the task is defined.",
    },
  },
};

export function getHomeContent(lang: Lang): HomeContent {
  return content[lang];
}

/**
 * Where each trust fact points, by position. Code-owned like every other
 * destination on this site: an editor may reword a fact, never redirect it.
 */
export const TRUST_TARGETS = ["about", "cases", "preise"] as const;

export interface ResolvedTrustFact {
  title: string;
  text: string;
  href: string;
  linkLabel: string;
}

/**
 * The trust card, ready to render: placeholders filled, destinations attached.
 *
 * The "cases" fact is dropped when no case is published — a fact about client
 * projects that links to a section which renders nothing would be the one
 * unverifiable claim on a card that exists to be verifiable.
 */
export function resolveTrustFacts(
  trust: HomeTrustContent,
  values: { name: string; town: string; rate: number; hasCases: boolean },
): { title: string; facts: ResolvedTrustFact[] } {
  const fill = (text: string) =>
    text
      .replaceAll("{name}", values.name)
      .replaceAll("{town}", values.town)
      .replaceAll("{rate}", String(values.rate));

  const facts: ResolvedTrustFact[] = [];
  trust.facts.slice(0, TRUST_TARGETS.length).forEach((fact, index) => {
    const target = TRUST_TARGETS[index]!;
    if (target === "cases" && !values.hasCases) return;
    facts.push({
      title: fact.title,
      text: fill(fact.text),
      href: `#${target}`,
      linkLabel: fact.linkLabel,
    });
  });

  return { title: trust.title, facts };
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
