import type { Lang } from "./i18n";

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

export interface DigitalResponsibilityContent {
  headline: string;
  headlineAccent: string;
  body: string;
  points: string[];
  primaryCta: string;
  secondaryCta: string;
}

interface HomeContent {
  hero: HomeHeroContent;
  whyMe: WhyMeContent;
  servicesOverview: ServicesOverviewContent;
  digitalResponsibility: DigitalResponsibilityContent;
}

const content: Record<Lang, HomeContent> = {
  de: {
    hero: {
      headline: "Digitalisierung, die",
      headlineAccent: "Arbeit",
      headlineSuffix: "abnimmt.",
      sub:
        "Ich bin Ihre feste Ansprechperson für Digitalisierung: Ich ordne ein, plane, setze um und kümmere mich darum, dass digitale Lösungen im Alltag zuverlässig funktionieren.",
      cta1: "Erstgespräch vereinbaren",
      cta2: "Was ich anbiete",
      scrollHint: "Wieso ich?",
    },
    whyMe: {
      headline: "Wieso",
      headlineAccent: "ich?",
      lead:
        "Digitale Themen brauchen jemanden, der den Überblick behält und Verantwortung übernimmt — nicht nur einzelne Aufträge abarbeitet.",
      p1:
        "Ich verbinde Beratung und Umsetzung. Dadurch müssen Sie Entscheidungen nicht zwischen mehreren Dienstleistern übersetzen und haben jederzeit eine Person, die das Gesamtbild kennt.",
      p2:
        "Ich erkläre Optionen verständlich, empfehle nur, was zu Ihrem Betrieb passt, und bleibe auf Wunsch auch nach der Einführung für Betrieb und Weiterentwicklung zuständig.",
      reasons: [
        {
          title: "Eine feste Ansprechperson",
          description:
            "Keine wechselnden Zuständigkeiten: Sie wissen, wer den Überblick hat und sich um den nächsten Schritt kümmert.",
        },
        {
          title: "Verständliche Beratung",
          description:
            "Sie erhalten klare Optionen, Kosten und Konsequenzen — ohne Fachsprache und ohne unnötige Technik.",
        },
        {
          title: "Beratung und Umsetzung",
          description:
            "Empfehlungen bleiben nicht auf Papier. Ich plane die Lösung und setze sie selbst oder gemeinsam mit passenden Partnern um.",
        },
        {
          title: "Dauerhafte Verantwortung",
          description:
            "Nach dem Start ist nicht Schluss. Auf Wunsch betreue ich Systeme, koordiniere Dienstleister und entwickle Lösungen weiter.",
        },
      ],
    },
    servicesOverview: {
      headline: "Was ich",
      headlineAccent: "anbiete?",
      intro:
        "Von der ersten Einordnung bis zum laufenden Betrieb: Wählen Sie den passenden Einstieg oder lassen Sie uns gemeinsam klären, was wirklich gebraucht wird.",
    },
    digitalResponsibility: {
      headline: "Eine Ansprechperson für",
      headlineAccent: "Ihre Digitalisierung.",
      body:
        "Digitalisierung sollte nicht zwischen Einzelprojekten, Software-Anbietern und offenen Zuständigkeiten liegen bleiben. Ich halte den Überblick, bereite Entscheidungen vor und sorge dafür, dass Maßnahmen zusammenpassen.",
      points: [
        "Prioritäten und Investitionen verständlich einordnen",
        "Projekte selbst umsetzen oder passende Beteiligte koordinieren",
        "Bestehende Systeme, Dienstleister und neue Lösungen zusammenführen",
        "Auf Wunsch die operative IT dauerhaft übernehmen",
      ],
      primaryCta: "Erstgespräch vereinbaren",
      secondaryCta: "Preise ansehen",
    },
  },
  en: {
    hero: {
      headline: "Digitalization that takes",
      headlineAccent: "work",
      headlineSuffix: "off your hands.",
      sub:
        "I am your dedicated point of contact for digitalization: I assess, plan, implement and make sure digital solutions keep working reliably in day-to-day operations.",
      cta1: "Arrange an initial consultation",
      cta2: "What I offer",
      scrollHint: "Why me?",
    },
    whyMe: {
      headline: "Why",
      headlineAccent: "me?",
      lead:
        "Digital work needs someone who keeps the full picture in view and takes responsibility — not someone who merely completes isolated tasks.",
      p1:
        "I combine advice with implementation. You do not have to translate decisions between several providers, and you always know who understands the whole setup.",
      p2:
        "I explain the options clearly, recommend only what fits your business and, if you wish, remain responsible for operations and further development after launch.",
      reasons: [
        {
          title: "One dedicated contact",
          description:
            "No shifting responsibilities: you know who has the overview and who is taking care of the next step.",
        },
        {
          title: "Advice in plain language",
          description:
            "You get clear options, costs and consequences — without jargon or unnecessary technology.",
        },
        {
          title: "Advice and delivery",
          description:
            "Recommendations do not stay on paper. I plan the solution and implement it myself or with suitable partners.",
        },
        {
          title: "Long-term responsibility",
          description:
            "Launch is not the finish line. I can operate systems, coordinate providers and keep solutions moving forward.",
        },
      ],
    },
    servicesOverview: {
      headline: "What I",
      headlineAccent: "offer?",
      intro:
        "From the first assessment to ongoing operations: choose the right starting point, or let us work out together what is actually needed.",
    },
    digitalResponsibility: {
      headline: "One point of contact for",
      headlineAccent: "your digitalization.",
      body:
        "Digitalization should not get lost between one-off projects, software vendors and unclear ownership. I keep the overview, prepare decisions and make sure each measure fits the wider setup.",
      points: [
        "Put priorities and investments into clear business terms",
        "Deliver projects directly or coordinate the right contributors",
        "Connect existing systems, providers and new solutions",
        "Take over day-to-day IT operations if required",
      ],
      primaryCta: "Arrange an initial consultation",
      secondaryCta: "View pricing",
    },
  },
};

export function getHomeContent(lang: Lang): HomeContent {
  return content[lang];
}
