import { useCallback, useId, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { AnimatePresence, MotionScope, m } from "@tracht-digital-solutions/tds-shared/motion/react";
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
  /** The pricing section, where "how your price comes about" is explained. */
  pricesHref: string;
}

/**
 * Leistungsassistent — see `lib/serviceFinder.ts` for what it asks and why, and
 * `components/ServiceAssistant.astro` for the dialog it lives in.
 *
 * ### Built as a form, not as a quiz widget
 *
 * - Every question is a `<fieldset>` whose `<legend>` is the question, and the
 *   answers are native checkboxes and radios inside their labels: announced,
 *   operable with Space, grouped, no ARIA to keep in sync. The inputs are only
 *   visually replaced — they stay focusable, and the ring is drawn around the
 *   whole answer card.
 * - A step change moves focus to the new question (and to the result heading),
 *   so a screen reader hears where it is and a phone does not stay scrolled
 *   below a list that is gone. Never on the first render — hydrating must not
 *   pull focus out of the page. Because a new step mounts only once the old one
 *   has left (`mode="wait"`), the focus is given by a callback ref on mount.
 * - A missing answer is said in words (`role="alert"`, tied to the group), not
 *   by a disabled button nobody can explain.
 * - It sends nothing: the result's link hands a draft to the contact form, and
 *   the dialog closes on that hand-off.
 *
 * ### Motion (2026-09-22)
 *
 * The progress fills segment by segment on a spring; a question slides in from
 * the side it is going to (forward from the right, back from the left); a
 * checked answer pops its tick; the result cards arrive one after another.
 * `initial={false}` on the presence: the first question is on screen as it
 * hydrates, never animated in from `opacity: 0`. Reduced motion (the OS, via
 * `MotionScope`, or the site's own switch) turns every one of them off.
 */
export default function ServiceFinder({ lang = "de", services, contactHref, pricesHref }: Props) {
  const copy = FINDER_COPY[lang];
  const uid = useId();
  // 0 topics · 1 starting points · 2 stage · STEP_COUNT result
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [topics, setTopics] = useState<TopicId[]>([]);
  const [situations, setSituations] = useState<SituationChoice[]>([]);
  const [stage, setStage] = useState<StageId | null>(null);
  const [hint, setHint] = useState("");
  const firstRender = useRef(true);

  const siteMotionOff =
    typeof document !== "undefined" && document.documentElement.hasAttribute("data-a11y-motion");
  const still = siteMotionOff ? { duration: 0 } : undefined;

  const options = useMemo(() => situationOptions(topics, services), [topics, services]);
  const matches = useMemo(
    () => (step === STEP_COUNT ? recommend({ topics, situations, stage }, lang) : []),
    [step, topics, situations, stage, lang],
  );

  /** Focus a freshly mounted question or result — never on hydration. */
  // Stable identity: an inline callback ref runs again on every render, and
  // would pull focus off the checkbox the visitor just ticked.
  const focusOnMount = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    node.focus();
  }, []);

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
    setDirection(1);
    setStep((current) => Math.min(current + 1, STEP_COUNT));
  };

  const back = () => {
    setHint("");
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 0));
  };

  const restart = () => {
    setTopics([]);
    setSituations([]);
    setStage(null);
    setHint("");
    setDirection(-1);
    setStep(0);
  };

  const handOff = () => {
    handOffContactDraft(buildDraft(matches, { topics, situations, stage }, services, lang));
  };

  /** A step slides in from the side it goes to, and out to the other. */
  const slide = {
    enter: (dir: 1 | -1) => ({ x: dir * 48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: dir * -48, opacity: 0 }),
  };
  const slideTransition = still ?? {
    x: { type: "spring" as const, bounce: 0.2, visualDuration: 0.38 },
    opacity: { duration: 0.18 },
  };


  const question = step === 0 ? copy.topicsQuestion : step === 1 ? copy.situationsQuestion : copy.stageQuestion;
  const help = step === 0 ? copy.topicsHelp : step === 1 ? copy.situationsHelp : copy.stageHelp;
  const helpId = `${uid}-help`;
  const hintId = `${uid}-hint`;
  const done = Math.min(step + 1, STEP_COUNT);

  return (
    <MotionScope>
      <div className="finder" data-step={step === STEP_COUNT ? "result" : step + 1}>
        {/* Progress: the words carry it; the segments only repeat it for the eye. */}
        <div className="finder__progress">
          <span>{step === STEP_COUNT ? copy.resultLabel : copy.progress(done, STEP_COUNT)}</span>
          <span className="finder__segments" aria-hidden="true">
            {Array.from({ length: STEP_COUNT }, (_, index) => (
              <span key={index} className="finder__segment">
                <m.i
                  initial={false}
                  animate={{ scaleX: index < done ? 1 : 0 }}
                  transition={still ?? { type: "spring", bounce: 0.3, visualDuration: 0.45 }}
                />
              </span>
            ))}
          </span>
        </div>

        <AnimatePresence initial={false} mode="wait" custom={direction}>
          {step === STEP_COUNT ? (
            <m.div
              key="result"
              className="finder__stage"
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
            >
              <h3 ref={focusOnMount} tabIndex={-1} className="finder__result-title">
                {copy.resultTitle}
              </h3>
              <ol className="finder__matches">
                {matches.map((match, index) => {
                  const service = services.find((candidate) => candidate.id === match.serviceId);
                  if (!service) return null;
                  return (
                    <m.li
                      key={match.serviceId}
                      className="finder__match"
                      data-rank={index === 0 ? "best" : "also"}
                      initial={still ? false : { y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={still ?? { type: "spring", bounce: 0.3, visualDuration: 0.45, delay: 0.12 + index * 0.09 }}
                    >
                      <p className="finder__rank">
                        <span className="finder__rank-badge" aria-hidden="true">
                          {index + 1}
                        </span>
                        {index === 0 ? copy.rankBest : copy.rankAlso}
                      </p>
                      <h4 className="finder__match-title">{service.title}</h4>
                      <p className="finder__summary">{service.summary}</p>
                      <p className="finder__rate">
                        <span className="finder__rate-label">{copy.rateLabel}</span>{" "}
                        <span className="finder__rate-value">
                          {service.fromPrice !== undefined ? copy.priceFrom(service.fromPrice) : copy.priceOnRequest}
                        </span>
                      </p>
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
                      {service.platforms && service.platforms.length > 0 && (
                        <>
                          <p className="finder__why-label">{copy.platformsLabel}</p>
                          <ul className="finder__platforms">
                            {service.platforms.map((platform) => (
                              <li key={platform.href}>
                                <a href={platform.href}>{platform.label}</a>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <a className="finder__detail" href={service.href}>
                        {copy.detailLink}
                        <span aria-hidden="true">→</span>
                      </a>
                    </m.li>
                  );
                })}
              </ol>
              <p className="finder__note">
                {copy.note}{" "}
                <a className="finder__price-link" href={pricesHref}>
                  {copy.priceLink}
                </a>
              </p>
              <div className="finder__actions">
                <a className="finder__cta finder__cta--contact" href={contactHref} onClick={handOff}>
                  {copy.cta}
                  <span aria-hidden="true">→</span>
                </a>
                <button type="button" className="finder__secondary" onClick={restart}>
                  {copy.restart}
                </button>
                <p className="finder__handoff">{copy.handoffNote}</p>
              </div>
            </m.div>
          ) : (
            <m.form
              key={`step-${step}`}
              className="finder__stage"
              onSubmit={next}
              noValidate
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
            >
              <fieldset className="finder__fieldset" aria-describedby={hint ? `${helpId} ${hintId}` : helpId}>
                <legend ref={focusOnMount} tabIndex={-1} className="finder__question">
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
                        <Tick on={topics.includes(id)} still={still} />
                        <span className="finder__option-body">
                          <span className="finder__option-label">{copy.topics[id].label}</span>
                          <span className="finder__option-hint">{copy.topics[id].hint ?? serviceTitle(id)}</span>
                        </span>
                      </label>
                    ))}

                  {step === 1 &&
                    options.map((choice) => {
                      const on = situations.some((selected) => selected.key === choice.key);
                      return (
                        <label key={choice.key} className="finder__option">
                          <input
                            className="finder__input"
                            type="checkbox"
                            name={`${uid}-situation`}
                            value={choice.key}
                            checked={on}
                            onChange={() => toggleSituation(choice)}
                          />
                          <Tick on={on} still={still} />
                          <span className="finder__option-body">
                            <span className="finder__option-label">{choice.text}</span>
                          </span>
                        </label>
                      );
                    })}

                  {step === 2 &&
                    STAGE_IDS.map((id) => (
                      <label key={id} className="finder__option finder__option--radio">
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
                        <Tick on={stage === id} still={still} />
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
            </m.form>
          )}
        </AnimatePresence>
      </div>
    </MotionScope>
  );
}

/**
 * The tick that pops when an answer is chosen. A component of its own, OUTSIDE
 * the finder: defined inside, it would be a new component type on every render,
 * remount each time and never play its entrance.
 */
function Tick({ on, still }: { on: boolean; still?: { duration: number } }) {
  return (
    <span className="finder__check" aria-hidden="true">
      <AnimatePresence initial={false}>
        {on && (
          <m.svg
            key="tick"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ scale: 0.2, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.2, opacity: 0 }}
            transition={still ?? { type: "spring", bounce: 0.55, visualDuration: 0.32 }}
          >
            <polyline points="5 12.5 10 17.5 19 7" />
          </m.svg>
        )}
      </AnimatePresence>
    </span>
  );
}
