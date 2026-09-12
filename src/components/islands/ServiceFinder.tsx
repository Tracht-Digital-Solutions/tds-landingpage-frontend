import { useEffect, useId, useMemo, useRef, useState, type SyntheticEvent } from "react";
import type { Lang } from "~/lib/i18n";
import { handOffContactDraft } from "~/lib/contactDraft";
import {
  FINDER_COPY,
  STAGE_IDS,
  STEP_COUNT,
  TOPIC_IDS,
  buildDraft,
  recommend,
  situationOptions,
  type FinderService,
  type SituationChoice,
  type StageId,
  type TopicId,
} from "~/lib/serviceFinder";

interface Props {
  lang?: Lang;
  services: FinderService[];
  /** The contact section on the home page of this language. */
  contactHref: string;
}

/**
 * Leistungs-Finder — see `lib/serviceFinder.ts` for what it asks and why.
 *
 * ### Built as a form, not as a quiz widget
 *
 * - Every question is a `<fieldset>` whose `<legend>` is the question, and the
 *   answers are native checkboxes and radios inside their labels: announced,
 *   operable with Space, grouped, no ARIA to keep in sync.
 * - A step change moves focus to the new question (and to the result heading),
 *   so a screen reader hears where it is and a phone does not stay scrolled
 *   below a list that is gone. Never on the first render — hydrating must not
 *   pull focus out of the page.
 * - A missing answer is said in words (`role="alert"`, tied to the group), not
 *   by a disabled button nobody can explain.
 * - It sends nothing: the result's link hands a draft to the contact form.
 */
export default function ServiceFinder({ lang = "de", services, contactHref }: Props) {
  const copy = FINDER_COPY[lang];
  const uid = useId();
  // 0 topics · 1 starting points · 2 stage · STEP_COUNT result
  const [step, setStep] = useState(0);
  const [topics, setTopics] = useState<TopicId[]>([]);
  const [situations, setSituations] = useState<SituationChoice[]>([]);
  const [stage, setStage] = useState<StageId | null>(null);
  const [hint, setHint] = useState("");
  const questionRef = useRef<HTMLLegendElement | null>(null);
  const resultRef = useRef<HTMLHeadingElement | null>(null);
  const firstRender = useRef(true);

  const options = useMemo(() => situationOptions(topics, services), [topics, services]);
  const matches = useMemo(
    () => (step === STEP_COUNT ? recommend({ topics, situations, stage }, lang) : []),
    [step, topics, situations, stage, lang],
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    (step === STEP_COUNT ? resultRef.current : questionRef.current)?.focus();
  }, [step]);

  const serviceTitle = (id: TopicId) => services.find((service) => service.id === id)?.title;

  const toggleTopic = (id: TopicId) => {
    setHint("");
    setTopics((current) => (current.includes(id) ? current.filter((topic) => topic !== id) : [...current, id]));
  };

  const toggleSituation = (choice: SituationChoice) => {
    setSituations((current) =>
      current.some((selected) => selected.key === choice.key)
        ? current.filter((selected) => selected.key !== choice.key)
        : [...current, choice],
    );
  };

  const next = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === 0 && topics.length === 0) {
      setHint(copy.pickOne);
      return;
    }
    if (step === 2 && stage === null) {
      setHint(copy.pickStage);
      return;
    }
    if (step === 0) {
      // Starting points of a topic the visitor has since deselected are no
      // longer on offer, so they must not count either.
      const offered = new Set(situationOptions(topics, services).map((choice) => choice.key));
      setSituations((current) => current.filter((choice) => offered.has(choice.key)));
    }
    setHint("");
    setStep((current) => Math.min(current + 1, STEP_COUNT));
  };

  const back = () => {
    setHint("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const restart = () => {
    setTopics([]);
    setSituations([]);
    setStage(null);
    setHint("");
    setStep(0);
  };

  const handOff = () => {
    handOffContactDraft(buildDraft(matches, { topics, situations, stage }, services, lang));
  };

  if (step === STEP_COUNT) {
    return (
      <div className="finder" data-step="result">
        <h3 ref={resultRef} tabIndex={-1} className="finder__result-title">
          {copy.resultTitle}
        </h3>
        <ol className="finder__matches">
          {matches.map((match, index) => {
            const service = services.find((candidate) => candidate.id === match.serviceId);
            if (!service) return null;
            return (
              <li key={match.serviceId} className="finder__match">
                <p className="finder__rank">{index === 0 ? copy.rankBest : copy.rankAlso}</p>
                <h4 className="finder__match-title">{service.title}</h4>
                <p className="finder__summary">{service.summary}</p>
                {match.reasons.length > 0 && (
                  <>
                    <p className="finder__why-label">{copy.whyLabel}</p>
                    <ul className="finder__why">
                      {match.reasons.map((reason) => (
                        <li key={reason}>
                          <span aria-hidden="true" className="finder__tick">
                            ✓
                          </span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <a className="finder__detail" href={service.href}>
                  {copy.detailLink}
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            );
          })}
        </ol>
        <p className="finder__note">{copy.note}</p>
        <div className="finder__actions">
          <a className="finder__cta" href={contactHref} onClick={handOff}>
            {copy.cta}
            <span aria-hidden="true">→</span>
          </a>
          <button type="button" className="finder__secondary" onClick={restart}>
            {copy.restart}
          </button>
          <p className="finder__handoff">{copy.handoffNote}</p>
        </div>
      </div>
    );
  }

  const question = step === 0 ? copy.topicsQuestion : step === 1 ? copy.situationsQuestion : copy.stageQuestion;
  const help = step === 0 ? copy.topicsHelp : step === 1 ? copy.situationsHelp : copy.stageHelp;
  const helpId = `${uid}-help`;
  const hintId = `${uid}-hint`;

  return (
    <form className="finder" data-step={step + 1} onSubmit={next} noValidate>
      <p className="finder__progress">
        <span>{copy.progress(step + 1, STEP_COUNT)}</span>
        <span className="finder__bar" aria-hidden="true">
          <i style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }} />
        </span>
      </p>

      <fieldset className="finder__fieldset" aria-describedby={hint ? `${helpId} ${hintId}` : helpId}>
        <legend ref={questionRef} tabIndex={-1} className="finder__question">
          {question}
        </legend>
        <p id={helpId} className="finder__help">
          {help}
        </p>

        <div className="finder__options">
          {step === 0 &&
            TOPIC_IDS.map((id) => (
              <label key={id} className="finder__option">
                <input
                  className="finder__input"
                  type="checkbox"
                  name={`${uid}-topic`}
                  value={id}
                  checked={topics.includes(id)}
                  onChange={() => toggleTopic(id)}
                />
                <span className="finder__option-body">
                  <span className="finder__option-label">{copy.topics[id].label}</span>
                  <span className="finder__option-hint">{copy.topics[id].hint ?? serviceTitle(id)}</span>
                </span>
              </label>
            ))}

          {step === 1 &&
            options.map((choice) => (
              <label key={choice.key} className="finder__option">
                <input
                  className="finder__input"
                  type="checkbox"
                  name={`${uid}-situation`}
                  value={choice.key}
                  checked={situations.some((selected) => selected.key === choice.key)}
                  onChange={() => toggleSituation(choice)}
                />
                <span className="finder__option-body">
                  <span className="finder__option-label">{choice.text}</span>
                </span>
              </label>
            ))}

          {step === 2 &&
            STAGE_IDS.map((id) => (
              <label key={id} className="finder__option">
                <input
                  className="finder__input"
                  type="radio"
                  name={`${uid}-stage`}
                  value={id}
                  checked={stage === id}
                  onChange={() => {
                    setHint("");
                    setStage(id);
                  }}
                />
                <span className="finder__option-body">
                  <span className="finder__option-label">{copy.stages[id].label}</span>
                  <span className="finder__option-hint">{copy.stages[id].hint}</span>
                </span>
              </label>
            ))}
        </div>
      </fieldset>

      {hint && (
        <p id={hintId} className="finder__hint" role="alert">
          {hint}
        </p>
      )}

      <div className="finder__nav">
        {step > 0 && (
          <button type="button" className="finder__secondary" onClick={back}>
            {copy.back}
          </button>
        )}
        <button type="submit" className="finder__cta">
          {step === STEP_COUNT - 1 ? copy.showResult : copy.next}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
