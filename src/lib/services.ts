import { cmsFor, fetchBlocks } from "./cms";
import type { Lang } from "./i18n";

export type ServiceId =
  | "consulting"
  | "process"
  | "solutions"
  | "custom-development"
  | "web-presence"
  | "complete-it";

export type ServiceCmsKey =
  | "service_consulting"
  | "service_process"
  | "service_solutions"
  | "service_custom_development"
  | "service_web_presence"
  | "service_complete_it";

export interface ServiceReference {
  title: string;
  context: string;
  challenge: string;
  solution: string;
  result: string;
  /** Optional, verifiable metric. An empty string means no metric is shown. */
  metric: string;
}

export interface ServiceContent {
  /** Back-link label for the services overview on the homepage. */
  label: string;
  title: string;
  /** Shared by the homepage card and the detail-page lead. */
  summary: string;
  intro: string;
  situationsTitle: string;
  situations: string[];
  responsibilitiesTitle: string;
  responsibilities: string[];
  outcomesTitle: string;
  outcomes: string[];
  boundariesTitle: string;
  boundaries: string[];
  processTitle: string;
  process: string[];
  priceLabel: string;
  priceText: string;
  referencesLabel: string;
  referencesHeadline: string;
  references: ServiceReference[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
}

export interface ServiceDefinition {
  /** Stable, code-owned identity. Never sourced from the CMS. */
  id: ServiceId;
  /** Stable display order shared by overview, sitemap and navigation. */
  number: string;
  /** Stable, code-owned CMS block key. */
  cmsKey: ServiceCmsKey;
  /** Stable, localized route segments. Never editable in the CMS. */
  slug: Record<Lang, string>;
  fallback: Record<Lang, ServiceContent>;
}

/**
 * Single source of truth for service identity, order, routes and local content.
 * The CMS may override every content field, but never ids, slugs or prices used
 * in structured data. References intentionally default to an empty list: no
 * customer story is published until a real, approved entry exists in the CMS.
 */
export const serviceDefinitions = [
  {
    id: "consulting",
    number: "01",
    cmsKey: "service_consulting",
    slug: { de: "beratung-konzeption", en: "consulting-planning" },
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Beratung & Konzeption",
        summary:
          "Ich ordne digitale Vorhaben, mache Optionen verständlich und entwickle mit Ihnen einen belastbaren Weg von der Idee bis zur Umsetzung.",
        intro:
          "Nicht jede technische Möglichkeit ist für Ihren Betrieb sinnvoll. Gemeinsam klären wir Ziele, Prioritäten und Abhängigkeiten, bevor Zeit und Budget in eine Lösung fließen.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Es gibt viele Ideen, aber keine klare Reihenfolge.",
          "Ein digitales Vorhaben soll vor einer Investition geprüft werden.",
          "Mehrere Systeme oder Dienstleister müssen zusammengebracht werden.",
          "Eine verständliche Entscheidungsgrundlage für die nächsten Schritte fehlt.",
        ],
        responsibilitiesTitle: "Was ich übernehme",
        responsibilities: [
          "Ziele, Abläufe und bestehende Systeme aufnehmen",
          "Optionen, Risiken und Abhängigkeiten verständlich einordnen",
          "Anforderungen und ein umsetzbares Konzept ausarbeiten",
          "Prioritäten, Etappen und passende nächste Schritte festlegen",
        ],
        outcomesTitle: "Was daraus entstehen kann",
        outcomes: [
          "Eine nachvollziehbare Entscheidungsgrundlage",
          "Ein klar abgegrenzter Projektumfang",
          "Realistische Etappen für Umsetzung und Einführung",
          "Weniger Fehlentscheidungen durch frühe Klärung",
        ],
        boundariesTitle: "Sinnvolle Abgrenzung",
        boundaries: [
          "Eine Beratung ersetzt keine rechtliche, steuerliche oder behördliche Prüfung.",
          "Aufwand und Terminplan werden erst nach der Bestandsaufnahme belastbar festgelegt.",
          "Die Umsetzung ist ein eigener Leistungsbaustein und wird transparent vereinbart.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ausgangslage und Zielbild gemeinsam aufnehmen",
          "Handlungsoptionen und Abhängigkeiten bewerten",
          "Empfehlung, Prioritäten und Umfang festhalten",
          "Umsetzung selbst starten oder koordiniert übergeben",
        ],
        priceLabel: "Preisprinzip",
        priceText:
          "120 € netto pro Stunde. Für klar abgegrenzte Konzeptpakete ist nach der Bestandsaufnahme auch ein Festpreis möglich.",
        referencesLabel:
          "Veröffentlichte Beispiele erscheinen ausschließlich anonymisiert und nach Freigabe.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Sie möchten zuerst Klarheit gewinnen?",
        ctaText:
          "Schildern Sie kurz Ihre Ausgangslage. Im Erstgespräch klären wir, welche Fragen zuerst beantwortet werden sollten.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Consulting & Planning",
        summary:
          "I structure digital initiatives, explain the options clearly and develop a practical path with you from the initial idea to implementation.",
        intro:
          "Not every technical option makes sense for your business. Together, we clarify goals, priorities and dependencies before time and budget are committed to a solution.",
        situationsTitle: "Typical starting points",
        situations: [
          "There are many ideas, but no clear order of priority.",
          "A digital initiative needs to be assessed before investing.",
          "Several systems or service providers need to work together.",
          "A clear basis for deciding the next steps is missing.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Understand goals, workflows and existing systems",
          "Explain options, risks and dependencies in plain language",
          "Develop requirements and a workable concept",
          "Define priorities, stages and suitable next steps",
        ],
        outcomesTitle: "What this can lead to",
        outcomes: [
          "A clear basis for decisions",
          "A well-defined project scope",
          "Realistic stages for delivery and adoption",
          "Fewer wrong turns through early clarification",
        ],
        boundariesTitle: "Useful boundaries",
        boundaries: [
          "Digital consulting does not replace legal, tax or regulatory advice.",
          "Effort and timelines can only be confirmed after the initial assessment.",
          "Implementation is a separate service and is agreed transparently.",
        ],
        processTitle: "How we proceed",
        process: [
          "Understand the current situation and desired outcome",
          "Assess options and dependencies",
          "Document the recommendation, priorities and scope",
          "Start implementation together or hand it over in a structured way",
        ],
        priceLabel: "Pricing principle",
        priceText:
          "€120 net per hour. A fixed price can also be agreed for a clearly defined planning package after the initial assessment.",
        referencesLabel:
          "Published examples appear only in anonymised form and after approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Would you like clarity before taking action?",
        ctaText:
          "Briefly describe your situation. In the initial conversation, we identify which questions should be answered first.",
        ctaButton: "Arrange an initial conversation",
      },
    },
  },
  {
    id: "process",
    number: "02",
    cmsKey: "service_process",
    slug: { de: "prozessoptimierung", en: "process-optimization" },
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Prozessoptimierung",
        summary:
          "Ich untersuche wiederkehrende Abläufe, beseitige unnötige Schritte und automatisiere dort, wo es im Arbeitsalltag wirklich entlastet.",
        intro:
          "Gute Digitalisierung beginnt nicht mit einem neuen Werkzeug, sondern mit einem klaren Blick auf die tägliche Arbeit. Bestehende Abläufe werden deshalb zuerst verstanden und erst dann gezielt verbessert.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Daten werden mehrfach übertragen oder in verschiedenen Listen gepflegt.",
          "Freigaben, Rückfragen und Übergaben kosten unnötig Zeit.",
          "Fehler entstehen durch manuelle Routinearbeiten.",
          "Ein bestehender Ablauf ist über Jahre gewachsen und schwer überschaubar.",
        ],
        responsibilitiesTitle: "Was ich übernehme",
        responsibilities: [
          "Den heutigen Ablauf mit den beteiligten Personen aufnehmen",
          "Zeitfresser, Medienbrüche und Fehlerquellen sichtbar machen",
          "Einen einfacheren Zielprozess entwerfen",
          "Geeignete Automatisierung auswählen und umsetzen",
        ],
        outcomesTitle: "Was daraus entstehen kann",
        outcomes: [
          "Weniger manuelle Wiederholungen",
          "Klarere Zuständigkeiten und Übergaben",
          "Nachvollziehbare, einheitliche Arbeitsschritte",
          "Mehr Zeit für Aufgaben, die menschliche Entscheidung brauchen",
        ],
        boundariesTitle: "Sinnvolle Abgrenzung",
        boundaries: [
          "Nicht jeder seltene Sonderfall sollte automatisiert werden.",
          "Änderungen werden mit den betroffenen Mitarbeitenden abgestimmt.",
          "Ergebnisse hängen auch von Datenqualität und konsequenter Nutzung ab.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ablauf und Beteiligte beobachten und dokumentieren",
          "Engpässe und Verbesserungshebel priorisieren",
          "Zielprozess im kleinen Rahmen erproben",
          "Lösung einführen, dokumentieren und bei Bedarf nachschärfen",
        ],
        priceLabel: "Preisprinzip",
        priceText:
          "110 € netto pro Stunde. Ein Festpreis ist möglich, sobald Prozess, Datenquellen und gewünschtes Ergebnis klar abgegrenzt sind.",
        referencesLabel:
          "Veröffentlichte Beispiele erscheinen ausschließlich anonymisiert und nach Freigabe.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Welcher Ablauf kostet Sie regelmäßig Zeit?",
        ctaText:
          "Beschreiben Sie den Prozess kurz. Gemeinsam prüfen wir, wo Vereinfachung oder Automatisierung sinnvoll ansetzt.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Process Optimization",
        summary:
          "I examine recurring workflows, remove unnecessary steps and automate where it creates meaningful relief in day-to-day work.",
        intro:
          "Effective digitalization starts with a clear view of daily work, not with a new tool. Existing workflows are understood first and then improved deliberately.",
        situationsTitle: "Typical starting points",
        situations: [
          "Data is transferred repeatedly or maintained in several lists.",
          "Approvals, questions and handovers take unnecessary time.",
          "Manual routine work creates avoidable errors.",
          "A workflow has grown over the years and is difficult to understand.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Map the current workflow with the people involved",
          "Identify time sinks, media breaks and sources of error",
          "Design a simpler target process",
          "Select and implement suitable automation",
        ],
        outcomesTitle: "What this can lead to",
        outcomes: [
          "Less repetitive manual work",
          "Clearer responsibilities and handovers",
          "Consistent, traceable working steps",
          "More time for tasks that need human judgement",
        ],
        boundariesTitle: "Useful boundaries",
        boundaries: [
          "Not every rare exception should be automated.",
          "Changes are coordinated with the employees affected by them.",
          "Results also depend on data quality and consistent use.",
        ],
        processTitle: "How we proceed",
        process: [
          "Observe and document the workflow and participants",
          "Prioritise bottlenecks and improvement opportunities",
          "Test the target process on a small scale",
          "Introduce, document and refine the solution as needed",
        ],
        priceLabel: "Pricing principle",
        priceText:
          "€110 net per hour. A fixed price is possible once the process, data sources and desired outcome are clearly defined.",
        referencesLabel:
          "Published examples appear only in anonymised form and after approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Which workflow repeatedly costs you time?",
        ctaText:
          "Briefly describe the process. Together, we assess where simplification or automation would make sense.",
        ctaButton: "Arrange an initial conversation",
      },
    },
  },
  {
    id: "solutions",
    number: "03",
    cmsKey: "service_solutions",
    slug: { de: "individuelle-loesungen", en: "tailored-solutions" },
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Individuelle Lösungen",
        summary:
          "Ich verbinde Abläufe, vorhandene Systeme, passende Standardwerkzeuge und eigene Software zu einer Lösung, die zu Ihrem Betrieb passt.",
        intro:
          "Manchmal reicht ein einzelnes Programm nicht aus. Dann entsteht ein abgestimmtes Gesamtpaket, das bestehende Technik weiter nutzt und nur dort individuell ergänzt, wo es einen echten Vorteil bringt.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Mehrere Einzellösungen arbeiten nicht sinnvoll zusammen.",
          "Eine Standardsoftware deckt wichtige betriebliche Besonderheiten nicht ab.",
          "Daten sollen zwischen bestehenden Werkzeugen zuverlässig fließen.",
          "Für ein neues digitales Angebot fehlt die passende Gesamtarchitektur.",
        ],
        responsibilitiesTitle: "Was ich übernehme",
        responsibilities: [
          "Anforderungen und vorhandene Systemlandschaft zusammenführen",
          "Standardlösungen, Schnittstellen und Eigenentwicklung abwägen",
          "Die Gesamtarchitektur und Einführung planen",
          "Bausteine umsetzen, integrieren und dokumentieren",
        ],
        outcomesTitle: "Was daraus entstehen kann",
        outcomes: [
          "Ein zusammenhängender Ablauf statt isolierter Werkzeuge",
          "Weniger doppelte Datenpflege",
          "Eine Lösung, die vorhandene Investitionen berücksichtigt",
          "Klare Zuständigkeit für das technische Gesamtbild",
        ],
        boundariesTitle: "Sinnvolle Abgrenzung",
        boundaries: [
          "Bewährte Standardsoftware wird nicht ohne Grund neu entwickelt.",
          "Schnittstellen hängen von den Möglichkeiten der beteiligten Anbieter ab.",
          "Umfang und Betrieb werden vor der Umsetzung eindeutig vereinbart.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ziele, Abläufe und bestehende Systeme erfassen",
          "Geeignete Bausteine und Integrationen auswählen",
          "Lösung in klaren Etappen umsetzen und testen",
          "Einführen, dokumentieren und weiter betreuen",
        ],
        priceLabel: "Preisprinzip",
        priceText:
          "110 € netto pro Stunde. Nach geklärtem Umfang sind Festpreise für einzelne Etappen oder klar definierte Gesamtpakete möglich.",
        referencesLabel:
          "Veröffentlichte Beispiele erscheinen ausschließlich anonymisiert und nach Freigabe.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Ihre Werkzeuge passen noch nicht zusammen?",
        ctaText:
          "Zeigen Sie mir die heutige Situation. Im Erstgespräch klären wir, welche Bausteine bleiben können und wo eine Ergänzung sinnvoll ist.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Tailored Solutions",
        summary:
          "I combine workflows, existing systems, suitable standard tools and custom software into a solution that fits your business.",
        intro:
          "Sometimes one application is not enough. In that case, I create a coordinated solution that continues to use existing technology and adds custom elements only where they provide a clear benefit.",
        situationsTitle: "Typical starting points",
        situations: [
          "Several isolated solutions do not work together effectively.",
          "Standard software does not cover important business requirements.",
          "Data needs to move reliably between existing tools.",
          "A new digital service needs a suitable overall architecture.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Bring requirements and the existing system landscape together",
          "Weigh standard products, integrations and custom development",
          "Plan the overall architecture and introduction",
          "Build, integrate and document the required elements",
        ],
        outcomesTitle: "What this can lead to",
        outcomes: [
          "One coherent workflow instead of isolated tools",
          "Less duplicate data maintenance",
          "A solution that respects existing investments",
          "Clear ownership of the overall technical picture",
        ],
        boundariesTitle: "Useful boundaries",
        boundaries: [
          "Proven standard software is not rebuilt without good reason.",
          "Integrations depend on the options offered by the providers involved.",
          "Scope and operational responsibility are agreed before implementation.",
        ],
        processTitle: "How we proceed",
        process: [
          "Understand goals, workflows and existing systems",
          "Select suitable components and integrations",
          "Build and test the solution in clear stages",
          "Introduce, document and continue supporting it",
        ],
        priceLabel: "Pricing principle",
        priceText:
          "€110 net per hour. Once the scope is clear, fixed prices are possible for individual stages or a clearly defined package.",
        referencesLabel:
          "Published examples appear only in anonymised form and after approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Do your tools still fail to work together?",
        ctaText:
          "Show me the current situation. In the initial conversation, we identify what can remain and where an addition would help.",
        ctaButton: "Arrange an initial conversation",
      },
    },
  },
  {
    id: "custom-development",
    number: "04",
    cmsKey: "service_custom_development",
    slug: { de: "auftragsprogrammierung", en: "contract-development" },
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Auftragsprogrammierung",
        summary:
          "Ich entwickle Software gezielt nach einer klaren Aufgabenstellung – als eigenständiges Werkzeug, Erweiterung oder technische Komponente.",
        intro:
          "Wenn Anforderungen und Einsatzbereich feststehen, setze ich die benötigte Software verlässlich und nachvollziehbar um. Sie erhalten keine unnötige Plattform, sondern den vereinbarten Funktionsumfang.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Für eine klar beschriebene Aufgabe fehlt ein passendes Werkzeug.",
          "Eine bestehende Anwendung benötigt eine definierte Erweiterung.",
          "Eine Schnittstelle oder ein technischer Dienst soll umgesetzt werden.",
          "Ein vorhandener Prototyp soll produktionsreif weiterentwickelt werden.",
        ],
        responsibilitiesTitle: "Was ich übernehme",
        responsibilities: [
          "Anforderungen technisch prüfen und präzisieren",
          "Architektur und Umsetzung für den vereinbarten Umfang planen",
          "Software entwickeln, testen und dokumentieren",
          "Übergabe, Inbetriebnahme und Wartung abstimmen",
        ],
        outcomesTitle: "Was daraus entstehen kann",
        outcomes: [
          "Ein Werkzeug für die konkret definierte Aufgabe",
          "Nachvollziehbarer Quellcode und dokumentierte Übergabe",
          "Klare Abnahmekriterien für den vereinbarten Umfang",
          "Eine belastbare Basis für spätere Erweiterungen",
        ],
        boundariesTitle: "Sinnvolle Abgrenzung",
        boundaries: [
          "Unklare Produktideen benötigen zuerst Beratung und Konzeption.",
          "Neue Anforderungen verändern Umfang, Budget und Zeitplan transparent.",
          "Betrieb, Wartung und Fremdlizenzen werden gesondert vereinbart.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Aufgabenstellung und Abnahmekriterien festhalten",
          "Technischen Ansatz und Etappen abstimmen",
          "Entwickeln, testen und regelmäßig Ergebnisse zeigen",
          "Abnehmen, dokumentieren und geordnet übergeben",
        ],
        priceLabel: "Preisprinzip",
        priceText:
          "105 € netto pro Stunde. Bei vollständig beschriebener Aufgabe und klaren Abnahmekriterien kann ein Festpreis vereinbart werden.",
        referencesLabel:
          "Veröffentlichte Beispiele erscheinen ausschließlich anonymisiert und nach Freigabe.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Sie haben eine konkrete Entwicklungsaufgabe?",
        ctaText:
          "Senden Sie mir die vorhandene Beschreibung. Im Erstgespräch klären wir Umfang, Schnittstellen und einen sinnvollen nächsten Schritt.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Contract Development",
        summary:
          "I develop software for a clearly defined brief—as a standalone tool, an extension or a specific technical component.",
        intro:
          "When the requirements and intended use are clear, I implement the software in a reliable and transparent way. You receive the agreed functionality rather than an unnecessary platform around it.",
        situationsTitle: "Typical starting points",
        situations: [
          "No suitable tool exists for a clearly described task.",
          "An existing application needs a defined extension.",
          "An interface or technical service needs to be implemented.",
          "An existing prototype needs to become production-ready.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Review and refine the technical requirements",
          "Plan architecture and delivery for the agreed scope",
          "Develop, test and document the software",
          "Coordinate handover, launch and maintenance",
        ],
        outcomesTitle: "What this can lead to",
        outcomes: [
          "A tool for the specifically defined task",
          "Understandable source code and a documented handover",
          "Clear acceptance criteria for the agreed scope",
          "A sound basis for later extensions",
        ],
        boundariesTitle: "Useful boundaries",
        boundaries: [
          "Unclear product ideas need consulting and planning first.",
          "New requirements transparently change scope, budget and timing.",
          "Hosting, maintenance and third-party licences are agreed separately.",
        ],
        processTitle: "How we proceed",
        process: [
          "Document the brief and acceptance criteria",
          "Agree the technical approach and delivery stages",
          "Develop, test and show results regularly",
          "Accept, document and hand over the finished work",
        ],
        priceLabel: "Pricing principle",
        priceText:
          "€105 net per hour. A fixed price can be agreed when the task and acceptance criteria are fully defined.",
        referencesLabel:
          "Published examples appear only in anonymised form and after approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Do you have a concrete development brief?",
        ctaText:
          "Send me the description you already have. In the initial conversation, we clarify scope, interfaces and a sensible next step.",
        ctaButton: "Arrange an initial conversation",
      },
    },
  },
  {
    id: "web-presence",
    number: "05",
    cmsKey: "service_web_presence",
    slug: { de: "webauftritt", en: "web-presence" },
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Webauftritt",
        summary:
          "Ich plane und realisiere Websites und digitale Auftritte, die Ihr Angebot verständlich machen und technisch dauerhaft betreut werden können.",
        intro:
          "Ein guter Webauftritt erklärt schnell, wofür Ihr Unternehmen steht, und führt Besucher zu einem sinnvollen nächsten Schritt. Gestaltung, Inhalte und Technik werden dafür gemeinsam gedacht.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Die bestehende Website ist veraltet oder schwer zu pflegen.",
          "Ein neues Unternehmen oder Angebot braucht einen klaren Auftritt.",
          "Inhalte, Struktur und technische Zuständigkeit sind ungeklärt.",
          "Formulare, Buchungen oder andere Funktionen sollen ergänzt werden.",
        ],
        responsibilitiesTitle: "Was ich übernehme",
        responsibilities: [
          "Ziele, Zielgruppen und Inhalte strukturieren",
          "Informationsarchitektur und Nutzerführung ausarbeiten",
          "Den Auftritt responsiv und zugänglich umsetzen",
          "Veröffentlichung, Pflege und technische Betreuung organisieren",
        ],
        outcomesTitle: "Was daraus entstehen kann",
        outcomes: [
          "Ein verständlicher und glaubwürdiger Unternehmensauftritt",
          "Klare Wege zu Anfrage, Kontakt oder Kauf",
          "Eine technisch wartbare und responsive Grundlage",
          "Geregelte Zuständigkeit nach der Veröffentlichung",
        ],
        boundariesTitle: "Sinnvolle Abgrenzung",
        boundaries: [
          "Texte, Fotos und rechtliche Inhalte benötigen abgestimmte Zuarbeit.",
          "Reichweite entsteht nicht allein durch die Veröffentlichung einer Website.",
          "Laufende Pflege, Hosting und externe Dienste werden transparent vereinbart.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Ziele, Inhalte und gewünschte Funktionen klären",
          "Struktur und gestalterische Richtung abstimmen",
          "Seite umsetzen, befüllen und gemeinsam prüfen",
          "Veröffentlichen und die weitere Betreuung festlegen",
        ],
        priceLabel: "Preisprinzip",
        priceText:
          "95 € netto pro Stunde. Für klar definierte Webauftritte sind Festpreise nach abgestimmtem Seiten- und Funktionsumfang möglich.",
        referencesLabel:
          "Veröffentlichte Beispiele erscheinen ausschließlich anonymisiert und nach Freigabe.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Soll Ihr Webauftritt klarer für Sie arbeiten?",
        ctaText:
          "Erzählen Sie mir, was die Seite leisten soll. Im Erstgespräch sortieren wir Ziele, Inhalte und den sinnvollen Umfang.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Web Presence",
        summary:
          "I plan and build websites and digital presences that explain your offer clearly and can be maintained reliably over time.",
        intro:
          "A good web presence quickly explains what your business stands for and guides visitors towards a meaningful next step. Design, content and technology are considered together.",
        situationsTitle: "Typical starting points",
        situations: [
          "The existing website is outdated or difficult to maintain.",
          "A new business or offer needs a clear presence.",
          "Content, structure and technical ownership are unresolved.",
          "Forms, booking or other functionality needs to be added.",
        ],
        responsibilitiesTitle: "What I take care of",
        responsibilities: [
          "Structure goals, audiences and content",
          "Develop the information architecture and user journey",
          "Build the presence responsively and accessibly",
          "Organise launch, maintenance and technical support",
        ],
        outcomesTitle: "What this can lead to",
        outcomes: [
          "A clear and credible business presence",
          "Direct paths to enquiries, contact or purchase",
          "A maintainable, responsive technical foundation",
          "Clear responsibility after launch",
        ],
        boundariesTitle: "Useful boundaries",
        boundaries: [
          "Copy, photography and legal content require coordinated input.",
          "Publishing a website alone does not create reach.",
          "Ongoing maintenance, hosting and external services are agreed transparently.",
        ],
        processTitle: "How we proceed",
        process: [
          "Clarify goals, content and required functionality",
          "Agree the structure and visual direction",
          "Build, populate and review the website together",
          "Launch it and define the ongoing support",
        ],
        priceLabel: "Pricing principle",
        priceText:
          "€95 net per hour. Fixed prices are possible for clearly defined web projects once the page and feature scope is agreed.",
        referencesLabel:
          "Published examples appear only in anonymised form and after approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Should your web presence work more clearly for you?",
        ctaText:
          "Tell me what the website needs to achieve. In the initial conversation, we structure the goals, content and suitable scope.",
        ctaButton: "Arrange an initial conversation",
      },
    },
  },
  {
    id: "complete-it",
    number: "06",
    cmsKey: "service_complete_it",
    slug: { de: "komplette-it", en: "complete-it" },
    fallback: {
      de: {
        label: "Alle Leistungen",
        title: "Komplette IT",
        summary:
          "Ich übernehme auf Wunsch die laufende Verantwortung für Geräte, Zugänge, Netzwerk, Sicherheit, Backups, Lizenzen und Support.",
        intro:
          "Sie erhalten eine feste Ansprechperson, die Ihre IT im Zusammenhang betrachtet, Aufgaben koordiniert und vereinbarte Themen dauerhaft betreut. Der konkrete Umfang richtet sich nach Ihrem Betrieb.",
        situationsTitle: "Typische Ausgangslagen",
        situations: [
          "Für IT-Fragen gibt es intern keine klare Zuständigkeit.",
          "Geräte, Zugänge und Lizenzen sind uneinheitlich organisiert.",
          "Sicherheit, Backups oder Dokumentation sollen verlässlich betreut werden.",
          "Mehrere Anbieter brauchen eine koordinierende Ansprechperson.",
        ],
        responsibilitiesTitle: "Was ich übernehmen kann",
        responsibilities: [
          "Geräte, Nutzerzugänge und Lizenzen verwalten",
          "Netzwerk, Sicherheit und Backup-Konzept betreuen",
          "Supportanfragen koordinieren und nachvollziehbar dokumentieren",
          "Externe Anbieter und notwendige Beschaffungen abstimmen",
        ],
        outcomesTitle: "Was daraus entstehen kann",
        outcomes: [
          "Eine feste Zuständigkeit für laufende IT-Themen",
          "Besser dokumentierte Geräte, Zugänge und Abläufe",
          "Planbare Wartung statt rein reaktiver Einzelmaßnahmen",
          "Ein abgestimmtes Gesamtbild über Systeme und Dienstleister hinweg",
        ],
        boundariesTitle: "Sinnvolle Abgrenzung",
        boundaries: [
          "Leistungsumfang und Zuständigkeiten werden nach einer Bestandsaufnahme vereinbart.",
          "Erreichbarkeit, Reaktionszeiten und Vor-Ort-Leistungen sind keine pauschalen 24/7-Zusagen.",
          "Geräte, Lizenzen und Leistungen Dritter werden getrennt ausgewiesen.",
        ],
        processTitle: "So gehen wir vor",
        process: [
          "Bestand, Risiken, Verträge und offene Aufgaben aufnehmen",
          "Verantwortungsbereich und Prioritäten gemeinsam festlegen",
          "Übergabe und notwendige Verbesserungen geordnet umsetzen",
          "Laufende Betreuung dokumentiert und vereinbarungsgemäß leisten",
        ],
        priceLabel: "Preisprinzip",
        priceText:
          "Individuelles Monatsangebot nach einer Bestandsaufnahme. Arbeitsplätze, Geräte, Lizenzen, Sicherheitsumfang, Vor-Ort-Leistungen und vereinbarte Erreichbarkeit bestimmen den Preis.",
        referencesLabel:
          "Veröffentlichte Beispiele erscheinen ausschließlich anonymisiert und nach Freigabe.",
        referencesHeadline: "Einblicke aus der Praxis",
        references: [],
        ctaTitle: "Sie wünschen sich eine feste Zuständigkeit für Ihre IT?",
        ctaText:
          "Im Erstgespräch klären wir den heutigen Bestand und welche Verantwortung sinnvoll übernommen werden kann.",
        ctaButton: "Erstgespräch vereinbaren",
      },
      en: {
        label: "All services",
        title: "Complete IT",
        summary:
          "If required, I take ongoing responsibility for devices, accounts, networks, security, backups, licences and support.",
        intro:
          "You gain one consistent point of contact who considers your IT as a whole, coordinates tasks and looks after the agreed areas over time. The exact scope depends on your business.",
        situationsTitle: "Typical starting points",
        situations: [
          "There is no clear internal owner for IT questions.",
          "Devices, accounts and licences are organised inconsistently.",
          "Security, backups or documentation need reliable ownership.",
          "Several providers need one coordinating point of contact.",
        ],
        responsibilitiesTitle: "What I can take care of",
        responsibilities: [
          "Manage devices, user accounts and licences",
          "Look after networks, security and the backup approach",
          "Coordinate support requests and document them clearly",
          "Coordinate external providers and necessary procurement",
        ],
        outcomesTitle: "What this can lead to",
        outcomes: [
          "One clear owner for ongoing IT matters",
          "Better documented devices, accounts and workflows",
          "Planned maintenance instead of purely reactive interventions",
          "A coordinated view across systems and providers",
        ],
        boundariesTitle: "Useful boundaries",
        boundaries: [
          "Scope and responsibilities are agreed after an initial assessment.",
          "Availability, response times and on-site work are not blanket 24/7 promises.",
          "Devices, licences and third-party services are itemised separately.",
        ],
        processTitle: "How we proceed",
        process: [
          "Review the estate, risks, contracts and open tasks",
          "Agree the area of responsibility and priorities",
          "Handle the transition and necessary improvements in a structured way",
          "Provide ongoing support as documented and agreed",
        ],
        priceLabel: "Pricing principle",
        priceText:
          "Individual monthly proposal after an initial assessment. Workstations, devices, licences, security scope, on-site work and agreed availability determine the price.",
        referencesLabel:
          "Published examples appear only in anonymised form and after approval.",
        referencesHeadline: "Examples from practice",
        references: [],
        ctaTitle: "Would you like clear ownership of your IT?",
        ctaText:
          "In the initial conversation, we review the current estate and which responsibilities can reasonably be taken on.",
        ctaButton: "Arrange an initial conversation",
      },
    },
  },
] satisfies readonly ServiceDefinition[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

/**
 * Validate the special empty-by-default reference collection.
 *
 * `cmsFor()` deliberately refuses to infer a schema from an empty fallback
 * list. References need an empty local default (publishing invented examples
 * is not acceptable), so this boundary validates the raw CMS field instead.
 * One malformed item rejects the complete collection, matching `cmsFor()`'s
 * safe list-boundary fallback behaviour.
 */
export function validateServiceReferences(value: unknown): ServiceReference[] {
  if (!Array.isArray(value) || value.length === 0) return [];

  const references: ServiceReference[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate)) return [];

    const title = requiredString(candidate.title);
    const context = requiredString(candidate.context);
    const challenge = requiredString(candidate.challenge);
    const solution = requiredString(candidate.solution);
    const result = requiredString(candidate.result);
    const metric =
      candidate.metric === undefined || candidate.metric === null || candidate.metric === ""
        ? ""
        : requiredString(candidate.metric);

    if (!title || !context || !challenge || !solution || !result || metric === null) {
      return [];
    }

    references.push({ title, context, challenge, solution, result, metric });
  }

  return references;
}

export function getServiceById(id: ServiceId): ServiceDefinition {
  const service = serviceDefinitions.find((candidate) => candidate.id === id);
  // The ServiceId union and the committed catalog are maintained together.
  // Throwing here exposes an internal drift during development instead of
  // returning a broken link in production.
  if (!service) throw new Error(`Unknown service id: ${id}`);
  return service;
}

export function getServiceBySlug(
  lang: Lang,
  slug: string | undefined,
): ServiceDefinition | undefined {
  if (!slug) return undefined;
  return serviceDefinitions.find((service) => service.slug[lang] === slug);
}

export function serviceHref(service: ServiceDefinition, lang: Lang): string {
  return lang === "de"
    ? `/leistungen/${service.slug.de}`
    : `/en/services/${service.slug.en}`;
}

/** Resolve the editable CMS block over the committed localized fallback. */
export async function resolveServiceContent(
  service: ServiceDefinition,
  lang: Lang,
): Promise<ServiceContent> {
  const { references: _references, ...fallback } = service.fallback[lang];
  const resolved = await cmsFor(service.cmsKey, lang, fallback);
  const blocks = await fetchBlocks(lang);
  const block = blocks[service.cmsKey];
  const references = isRecord(block)
    ? validateServiceReferences(block.references)
    : [];

  return { ...resolved, references };
}
