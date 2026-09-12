/**
 * Leistungs-Finder — three questions that point a visitor at one or more of the
 * four services, and the copy for them.
 *
 * ### Why it exists
 *
 * The services section describes four offers from the provider's side. A
 * visitor arrives with a problem, not with a service name, and "which of these
 * is mine?" is exactly the question that makes people leave instead of writing.
 * The finder asks from the visitor's side — what bothers you, what do you
 * recognise, how far along are you — and answers with services, reasons and the
 * way to the first conversation.
 *
 * ### What it may and may not claim
 *
 * - The starting points it offers are the services' own `situations`, resolved
 *   on the server exactly like on the service pages (the island receives them as
 *   props). An edit in the panel therefore changes the finder too, and the finder
 *   never states a problem the service pages do not.
 * - The result is an orientation, and says so. It names no price and no
 *   duration (`serviceFinder.test.ts` holds the same copy rules as
 *   `homeContent.test.ts`).
 * - It sends nothing. The result becomes a draft in the contact form's message
 *   field (`contactDraft.ts`); the visitor reads it, edits it, and submits.
 *
 * **No runtime imports.** The island bundles this file; type imports only.
 */
import type { Lang } from "./i18n";
import type { ServiceId } from "./services";

/** The catalogue order — also the tie-breaker between equally strong matches. */
export const SERVICE_ORDER: readonly ServiceId[] = ["consulting", "process", "solutions", "web-presence"];

export type TopicId = ServiceId | "unsure";
export type StageId = "clear" | "rough" | "open";

export const TOPIC_IDS: readonly TopicId[] = [...SERVICE_ORDER, "unsure"];
export const STAGE_IDS: readonly StageId[] = ["clear", "rough", "open"];

/** Topic, starting point, stage. The result is step `STEP_COUNT`. */
export const STEP_COUNT = 3;

/** What the island receives per service, resolved on the server. */
export interface FinderService {
  id: ServiceId;
  title: string;
  summary: string;
  href: string;
  situations: string[];
}

export interface SituationChoice {
  /** `<serviceId>:<index>` — stable while the offered list does not change. */
  key: string;
  serviceId: ServiceId;
  text: string;
}

export interface FinderAnswers {
  topics: readonly TopicId[];
  situations: readonly SituationChoice[];
  stage: StageId | null;
}

export interface FinderMatch {
  serviceId: ServiceId;
  score: number;
  /** The visitor's own choices that pointed here, in the order they were made. */
  reasons: string[];
}

/*
 * The weights. A chosen topic is a direct statement (3); a recognised starting
 * point confirms or discovers a service (2); a project that is still open makes
 * the sorting conversation worth suggesting (2), a rough idea only nudges (1).
 * A service needs 2 to be recommended, so one recognised starting point is
 * enough on its own — and an open project always brings Beratung & Konzeption
 * along, below whatever the visitor chose.
 */
const TOPIC_WEIGHT = 3;
const SITUATION_WEIGHT = 2;
const STAGE_CONSULTING_WEIGHT: Record<StageId, number> = { clear: 0, rough: 1, open: 2 };
const MIN_SCORE = 2;

interface FinderCopy {
  progress: (step: number, total: number) => string;
  topicsQuestion: string;
  topicsHelp: string;
  /** Service topics show the service's title as their hint; only `unsure` needs its own. */
  topics: Record<TopicId, { label: string; hint?: string }>;
  situationsQuestion: string;
  situationsHelp: string;
  stageQuestion: string;
  stageHelp: string;
  stages: Record<StageId, { label: string; hint: string }>;
  pickOne: string;
  pickStage: string;
  next: string;
  back: string;
  showResult: string;
  restart: string;
  resultTitle: string;
  rankBest: string;
  rankAlso: string;
  whyLabel: string;
  detailLink: string;
  note: string;
  cta: string;
  handoffNote: string;
  draft: { intro: string; services: string; situations: string; stage: string };
}

export const FINDER_COPY: Record<Lang, FinderCopy> = {
  de: {
    progress: (step, total) => `Schritt ${step} von ${total}`,
    topicsQuestion: "Worum geht es Ihnen vor allem?",
    topicsHelp: "Mehrfachauswahl möglich.",
    topics: {
      consulting: { label: "Erst klären, was sinnvoll ist" },
      process: { label: "Abläufe kosten zu viel Zeit" },
      solutions: { label: "Programme arbeiten nicht zusammen" },
      "web-presence": { label: "Webseite, Webshop oder Sichtbarkeit" },
      unsure: { label: "Ich weiß es noch nicht", hint: "Dann sortieren wir zuerst gemeinsam." },
    },
    situationsQuestion: "Was davon kennen Sie aus Ihrem Betrieb?",
    situationsHelp: "Mehrfachauswahl möglich – oder ohne Auswahl weiter.",
    stageQuestion: "Wie weit ist Ihr Vorhaben?",
    stageHelp: "Eine Antwort.",
    stages: {
      clear: { label: "Klar umrissen", hint: "Ziel und Umfang stehen, es soll umgesetzt werden." },
      rough: { label: "Eine grobe Idee", hint: "Die Richtung ist klar, die Details noch nicht." },
      open: { label: "Noch ganz offen", hint: "Erst einmal sortieren, was überhaupt dran ist." },
    },
    pickOne: "Bitte wählen Sie mindestens eine Antwort.",
    pickStage: "Bitte wählen Sie eine Antwort.",
    next: "Weiter",
    back: "Zurück",
    showResult: "Ergebnis anzeigen",
    restart: "Neu starten",
    resultTitle: "Das passt zu Ihrem Anliegen",
    rankBest: "Passt am besten",
    rankAlso: "Passt ebenfalls",
    whyLabel: "Ihre Angaben dazu:",
    detailLink: "Leistung im Detail",
    note: "Eine erste Orientierung, keine Festlegung – im Erstgespräch klären wir, was wirklich passt.",
    cta: "Mit dieser Auswahl Erstgespräch vereinbaren",
    handoffNote:
      "Ihre Auswahl steht dann im Nachrichtenfeld des Kontaktformulars. Gesendet wird erst, wenn Sie das Formular selbst abschicken.",
    draft: {
      intro: "Aus dem Leistungs-Finder:",
      services: "Passende Leistungen",
      situations: "Ausgangslage",
      stage: "Stand",
    },
  },
  en: {
    progress: (step, total) => `Step ${step} of ${total}`,
    topicsQuestion: "What matters most to you?",
    topicsHelp: "Choose as many as apply.",
    topics: {
      consulting: { label: "Work out first what makes sense" },
      process: { label: "Workflows take too much time" },
      solutions: { label: "Programs do not work together" },
      "web-presence": { label: "Website, online shop or visibility" },
      unsure: { label: "I do not know yet", hint: "Then we sort things out together first." },
    },
    situationsQuestion: "Which of these do you recognise from your business?",
    situationsHelp: "Choose as many as apply – or continue without.",
    stageQuestion: "How far along is your project?",
    stageHelp: "One answer.",
    stages: {
      clear: { label: "Clearly defined", hint: "Goal and scope are set, and it needs to be built." },
      rough: { label: "A rough idea", hint: "The direction is clear, the details are not." },
      open: { label: "Still completely open", hint: "First work out what actually needs doing." },
    },
    pickOne: "Please choose at least one answer.",
    pickStage: "Please choose one answer.",
    next: "Next",
    back: "Back",
    showResult: "Show result",
    restart: "Start again",
    resultTitle: "What fits your request",
    rankBest: "Best fit",
    rankAlso: "Also fits",
    whyLabel: "Your answers:",
    detailLink: "Service details",
    note: "A first sense of direction, not a commitment – in the first conversation we work out what really fits.",
    cta: "Arrange an initial consultation with this selection",
    handoffNote:
      "Your selection then appears in the message field of the contact form. Nothing is sent until you submit the form yourself.",
    draft: {
      intro: "From the service finder:",
      services: "Matching services",
      situations: "Starting point",
      stage: "Stage",
    },
  },
};

/** The section around the finder, and the pointer to it from the services. */
export const FINDER_SECTION: Record<
  Lang,
  { headline: string; headlineAccent: string; intro: string; servicesLink: string }
> = {
  de: {
    headline: "Welche Leistung passt zu",
    headlineAccent: "Ihnen?",
    intro:
      "Drei kurze Fragen, eine erste Orientierung. Das Ergebnis können Sie direkt ins Kontaktformular übernehmen – gesendet wird erst, wenn Sie es selbst abschicken.",
    servicesLink: "Unsicher, was passt? Zum Leistungs-Finder",
  },
  en: {
    headline: "Which service fits",
    headlineAccent: "you?",
    intro:
      "Three short questions, a first sense of direction. You can take the result straight into the contact form – nothing is sent until you submit it yourself.",
    servicesLink: "Not sure which fits? Try the service finder",
  },
};

/**
 * The starting points offered in step two.
 *
 * Those of the chosen services, or a couple of every service when the visitor
 * chose none (only "not sure yet"). Never more than eight: four services with
 * four sentences each is a wall nobody reads on a phone.
 */
export function situationOptions(
  topics: readonly TopicId[],
  services: readonly FinderService[],
): SituationChoice[] {
  const chosen = SERVICE_ORDER.filter((id) => topics.includes(id));
  const ids = chosen.length > 0 ? chosen : SERVICE_ORDER;
  const perService = ids.length <= 2 ? 4 : 2;
  return ids.flatMap((id) => {
    const service = services.find((candidate) => candidate.id === id);
    return (service?.situations ?? [])
      .slice(0, perService)
      .map((text, index) => ({ key: `${id}:${index}`, serviceId: id, text }));
  });
}

/** Services worth suggesting, strongest first. Never empty. */
export function recommend(answers: FinderAnswers, lang: Lang): FinderMatch[] {
  const copy = FINDER_COPY[lang];
  const tally = new Map<ServiceId, { score: number; reasons: string[] }>(
    SERVICE_ORDER.map((id) => [id, { score: 0, reasons: [] }]),
  );
  const add = (id: ServiceId, weight: number, reason: string) => {
    const entry = tally.get(id);
    if (!entry || weight <= 0) return;
    entry.score += weight;
    if (!entry.reasons.includes(reason)) entry.reasons.push(reason);
  };

  for (const topic of answers.topics) {
    add(topic === "unsure" ? "consulting" : topic, TOPIC_WEIGHT, copy.topics[topic].label);
  }
  for (const choice of answers.situations) add(choice.serviceId, SITUATION_WEIGHT, choice.text);
  if (answers.stage) {
    add("consulting", STAGE_CONSULTING_WEIGHT[answers.stage], copy.stages[answers.stage].label);
  }

  const matches = SERVICE_ORDER.map((serviceId, order) => ({ serviceId, order, ...tally.get(serviceId)! }))
    .filter((match) => match.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map(({ serviceId, score, reasons }) => ({ serviceId, score, reasons }));

  // Nothing pointed anywhere: the sorting conversation is the honest answer.
  return matches.length > 0 ? matches : [{ serviceId: "consulting", score: 0, reasons: [] }];
}

/** The text handed to the contact form — the visitor's choices, nothing invented. */
export function buildDraft(
  matches: readonly FinderMatch[],
  answers: FinderAnswers,
  services: readonly FinderService[],
  lang: Lang,
): string {
  const { draft, stages } = FINDER_COPY[lang];
  const title = (id: ServiceId) => services.find((service) => service.id === id)?.title ?? id;
  const lines = [draft.intro, `${draft.services}: ${matches.map((match) => title(match.serviceId)).join(", ")}`];
  if (answers.situations.length > 0) {
    lines.push(`${draft.situations}: ${answers.situations.map((choice) => choice.text).join(" ")}`);
  }
  if (answers.stage) lines.push(`${draft.stage}: ${stages[answers.stage].label}`);
  return `${lines.join("\n")}\n\n`;
}
