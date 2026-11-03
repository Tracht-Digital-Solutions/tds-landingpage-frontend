import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, type ContactFormData } from "@tracht-digital-solutions/tds-shared/schemas";
import { runtimeSetting } from "@tracht-digital-solutions/tds-shared/api";
import { Collapse, Presence } from "@tracht-digital-solutions/tds-shared/motion/react";
import { CONTACT_DRAFT_EVENT, CONTACT_DRAFT_KEY, parseContactDraft } from "~/lib/contactDraft";
import { contactFormCopy } from "~/lib/contactCopy";

/**
 * Where this form posts if the host has not been configured.
 *
 * Baked in by Vite at build time. `runtimeSetting("contactUrl", …)` prefers
 * whatever `/install/` wrote into `tds-runtime.json` on the host, so
 * the endpoint can be re-pointed (or routed through the same-origin proxy)
 * without a rebuild. No config on the host means this value, i.e. exactly the
 * behaviour before the wizard existed.
 */
const CONTACT_API_URL =
  (import.meta.env.PUBLIC_CONTACT_API_URL as string | undefined) ??
  "https://api.tracht-digital.de/contact";

type SubmitState = "idle" | "submitting" | "success" | "error";

type Lang = "de" | "en";

/** Field ids double as the prefix of their error messages' ids. */
type FieldName = "name" | "email" | "message" | "consent";

const STEPS: Record<Lang, [string, string, string]> = {
  de: ["Kontaktdaten", "Anliegen", "Nachricht"],
  en: ["Contact details", "Your request", "Message"],
};

const STEPPER: Record<
  Lang,
  {
    next: string;
    back: string;
    progress: (step: number, total: number) => string;
    summary: string;
    edit: string;
    urgent: string;
  }
> = {
  de: {
    next: "Weiter",
    back: "Zurück",
    progress: (step, total) => `Schritt ${step} von ${total}`,
    summary: "Bisherige Angaben",
    edit: "Ändern",
    urgent: "Notfall",
  },
  en: {
    next: "Next",
    back: "Back",
    progress: (step, total) => `Step ${step} of ${total}`,
    summary: "Details so far",
    edit: "Change",
    urgent: "Emergency",
  },
};

/** The fields each step checks before "Weiter" moves on. */
const STEP_FIELDS: readonly (readonly FieldName[])[] = [["name", "email"], [], ["message", "consent"]];

/** Whether a value passes the shared schema's rule for that one field. */
function fieldValid(field: "name" | "email" | "company" | "message", value: unknown): boolean {
  if (!String(value ?? "").trim()) return false;
  const shape = (ContactSchema as unknown as { shape?: Record<string, { safeParse: (v: unknown) => { success: boolean } }> }).shape;
  return shape?.[field]?.safeParse(value).success ?? true;
}

const ICONS = {
  name: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  email: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></>,
  company: <><path d="M3 21h18M5 21V5l8-2v18M13 9l6 2v10M8 8h1M8 12h1M8 16h1" /></>,
  subject: <><path d="M4 5h16v11H8l-4 4z" /></>,
};

function InputIcon({ name }: { name: keyof typeof ICONS }) {
  return (
    <span className="contact-input__icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name]}
      </svg>
    </span>
  );
}

/**
 * One step of the form. Only the current one is shown (`hidden`, never
 * `opacity: 0`); its legend takes focus when the step changes.
 */
function Step({
  number,
  title,
  done,
  grow,
  current,
  children,
}: {
  number: number;
  title: string;
  done: boolean;
  grow?: boolean;
  current: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset
      className={`contact-step${grow ? " contact-step--grow" : ""}`}
      data-done={done ? "" : undefined}
      hidden={!current}
    >
      {/* Visually hidden: the progress row above already shows the title. */}
      <legend className="contact-step__head sr-only" id={`contact-step-${number}`} tabIndex={-1}>
        <span className="contact-step__num" aria-hidden="true">{done ? "✓" : number}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

/**
 * Contact form. Posts to tds-contact-api over CORS and validates with
 * `ContactSchema` from tds-shared, so frontend and backend agree on the rules
 * (the PHP backend mirrors the same schema by hand).
 *
 * ### What changed in the 2026-09 pass, and why
 *
 * - **No `motion`.** Every field was a motion element whose server-rendered
 *   markup carried its entrance's start state, `opacity: 0`, until the island
 *   hydrated — so without JavaScript, or before `client:visible` fired, the
 *   form was an empty navy box. The fields render visible now; the only motion
 *   left is CSS the reduced-motion clamp already handles.
 * - **Errors are tied to their fields.** A message below an input used to be a
 *   loose paragraph; it is now that input's `aria-describedby`, the input says
 *   `aria-invalid`, and required fields say so. react-hook-form still moves
 *   focus to the first invalid field on submit.
 * - **One live region, for status only.** `aria-live` used to sit on the whole
 *   form, which asks a screen reader to announce every change inside it.
 * - **Success takes focus.** The form is replaced by the confirmation; focus
 *   would otherwise fall back to `<body>` and the confirmation go unheard.
 * - **The words come from `lib/contactCopy.ts`** (2026-09-15): the site
 *   addresses no one directly (2026-10-12), the shared bundle says "Sie", and
 *   the sentences that would address the visitor — errors, success, the
 *   failure message — are overridden there.
 * - **A reason dropdown, and the next steps AFTER sending** (2026-09-21). The
 *   chosen reason travels as `subject`, so the request arrives in the panel
 *   under a heading instead of as one more untitled message. And the four
 *   "what happens next" points, which used to sit above the form, now fill the
 *   confirmation: on the way in they were a wall between the visitor and the
 *   field they came to type in, and they duplicated the process section word
 *   for word. Afterwards they are the answer to the only question left.
 *
 * ### Why `reasons` and `nextSteps` are props
 *
 * Both are CMS-editable (`contact.reasons`, `first_call`), and resolving a
 * block means `cmsFor`, which is server-only. An island cannot call it. So
 * `sections/Contact.astro` resolves and hands the finished values down.
 */
export default function ContactForm({
  lang = "de",
  reasons = [],
  assistantReasons = {},
  nextSteps,
}: {
  lang?: Lang;
  /** Options for the reason dropdown, already resolved against the CMS. */
  reasons?: readonly string[];
  /**
   * Service id → the reason that service preselects, from
   * `sections/Contact.astro`. A prop rather than a lookup here: the options
   * are written there and are CMS-editable, so the mapping has to live beside
   * them or the two drift apart silently.
   */
  assistantReasons?: Readonly<Record<string, string>>;
  /** What happens after sending — rendered in place of the form. */
  nextSteps?: { title: string; items: readonly { label: string; text: string }[] };
}) {
  const copy = contactFormCopy(lang);

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  // The emergency checkbox. Not a form field: `ContactSchema` knows no such
  // key and zodResolver would drop it. It marks the subject instead (below).
  const [urgent, setUrgent] = useState(false);
  const [shake, setShake] = useState(false);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The stepper: which step shows, and how far the visitor has come.
  const [stage, setStage] = useState(0);
  const [reached, setReached] = useState(0);
  const movedRef = useRef(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { consent: undefined as unknown as true },
  });

  // A draft from the service assistant (`lib/contactDraft.ts`): read from
  // storage when this form hydrates after the jump down here, or taken from the
  // event when it is already live. Text in the field, nothing else — the
  // visitor still reads, edits and sends. What they typed themselves is never
  // replaced; the draft goes underneath it.
  useEffect(() => {
    const apply = (value: unknown) => {
      const draft = parseContactDraft(value);
      if (!draft) return;

      /**
       * The reason the assistant's recommendation maps to — and only while the
       * visitor has not chosen one themselves. It is checked against the
       * options actually rendered: a value the select has no `<option>` for
       * would set the field to nothing at all, and a panel edit to the list is
       * exactly how that happens.
       */
      const mapped = draft.service ? assistantReasons[draft.service] : undefined;
      if (mapped && reasons.includes(mapped) && !String(getValues("subject") ?? "").trim()) {
        setValue("subject", mapped, { shouldDirty: true });
      }

      const current = String(getValues("message") ?? "");
      if (current.includes(draft.message.trim())) return;
      setValue(
        "message",
        current.trim() ? `${current.trimEnd()}\n\n${draft.message}` : draft.message,
        { shouldDirty: true },
      );
    };
    try {
      const stored = window.sessionStorage.getItem(CONTACT_DRAFT_KEY);
      if (stored) {
        apply(stored);
        window.sessionStorage.removeItem(CONTACT_DRAFT_KEY);
      }
    } catch {
      // Storage blocked: the event below still delivers to a live form.
    }
    const onDraft = (event: Event) => {
      apply((event as CustomEvent<unknown>).detail);
      try {
        window.sessionStorage.removeItem(CONTACT_DRAFT_KEY);
      } catch {
        // ignore
      }
    };
    window.addEventListener(CONTACT_DRAFT_EVENT, onDraft);
    return () => window.removeEventListener(CONTACT_DRAFT_EVENT, onDraft);
  }, [getValues, setValue, reasons, assistantReasons]);

  useEffect(
    () => () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    },
    [],
  );

  // A step change moves focus to the new step's legend; never on hydration.
  useEffect(() => {
    if (!movedRef.current) return;
    document.getElementById(`contact-step-${stage + 1}`)?.focus();
  }, [stage]);

  const goTo = (index: number) => {
    movedRef.current = true;
    setStage(index);
    setReached((value) => Math.max(value, index));
  };

  const next = async () => {
    const fields = STEP_FIELDS[stage] as FieldName[];
    if (fields.length > 0 && !(await trigger(fields))) return;
    goTo(Math.min(stage + 1, STEP_FIELDS.length - 1));
  };

  /** After a failed submit, show the first step that holds an error. */
  const onInvalid = (invalid: Partial<Record<string, unknown>>) => {
    const first = STEP_FIELDS.findIndex((fields) => fields.some((field) => invalid[field]));
    if (first >= 0 && first !== stage) goTo(first);
  };

  const triggerShake = () => {
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    setShake(true);
    shakeTimerRef.current = setTimeout(() => setShake(false), 600);
  };

  /** The chosen reason, marked as an emergency when the box is ticked. */
  const subjectFor = (subject: string | undefined) => {
    const reason = String(subject ?? "").trim();
    if (!urgent) return reason || undefined;
    return (reason ? `${copy.urgentSubject} – ${reason}` : copy.urgentSubject).slice(0, 200);
  };

  const onSubmit = async (data: ContactFormData) => {
    setSubmitState("submitting");
    try {
      // Resolved on submit, not at mount: the config is one memoised request
      // and this keeps it off the critical path of a page most visitors never
      // submit anything on.
      const endpoint = await runtimeSetting("contactUrl", CONTACT_API_URL);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, subject: subjectFor(data.subject), lang }),
        // A hanging endpoint left the form in "submitting" for good, with the
        // button disabled and nothing to say why. 20s, then the error view.
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok) {
        setSubmitState("success");
      } else {
        setSubmitState("error");
        triggerShake();
      }
    } catch {
      setSubmitState("error");
      triggerShake();
    }
  };

  // Each field is wrapped in a `.contact-field-row` <div> so the
  // focus-within styles in Contact.astro can light up the label when the
  // visitor lands on the input. The wrapper family is
  // deliberately `contact-field-*`, not `field-*`: tds-shared's primitives.css
  // owns a `.field` class for the *input element*.
  const fieldClass = [
    "contact-field block w-full appearance-none bg-transparent",
    "px-3 py-3 text-base text-white leading-snug",
    "border-0 outline-none focus:outline-none focus:ring-0",
  ].join(" ");

  const errorId = (field: FieldName) => `contact-${field}-error`;
  const a11yFor = (field: FieldName) =>
    errors[field]
      ? { "aria-invalid": true as const, "aria-describedby": errorId(field) }
      : {};

  const rowClass = (field?: FieldName) =>
    `contact-field-row ${field && errors[field] ? "contact-field-row--error" : ""}`;
  /** A field that is complete and valid is filled (`.contact-field-row[data-filled]`). */
  const filled = (ok: boolean) => (ok ? "" : undefined);

  // Plain JSX, not an inner component (a component declared in here would be
  // a new type every render and remount the form on each keystroke).
  const success = (
      <div className="contact-success flex flex-col items-start gap-4 py-12" role="status">
        <span className="contact-success__mark" aria-hidden="true">
          ✓
        </span>
        <h3
          // Focused as it MOUNTS: the success view fades in after the form has
          // faded out, so an effect keyed on submitState would find no heading.
          ref={(el) => el?.focus()}
          tabIndex={-1}
          className="text-2xl font-[var(--font-display)] font-medium text-white outline-none"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          {copy.form.successTitle}
        </h3>
        <p className="text-white/75">{copy.form.successMessage}</p>

        {/* The next steps, at the one moment they are the whole question.
            A <dl>, like `ui/FirstCall.astro` renders them, so the pairing of
            label and text survives without the visual card around it. */}
        {nextSteps && nextSteps.items.length > 0 && (
          <div className="contact-next mt-4 w-full">
            <h4 className="contact-next__title">{nextSteps.title}</h4>
            <dl className="contact-next__list">
              {nextSteps.items.map((item) => (
                <div className="contact-next__item" key={item.label}>
                  <dt className="contact-next__label">{item.label}</dt>
                  <dd className="contact-next__text">{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
  );

  const submitting = submitState === "submitting";
  const [nameValue, emailValue, companyValue, subjectValue, messageValue] = watch([
    "name",
    "email",
    "company",
    "subject",
    "message",
  ]);
  const steps = STEPS[lang];
  const stepper = STEPPER[lang];
  const nameOk = fieldValid("name", nameValue);
  const emailOk = fieldValid("email", emailValue);
  const messageOk = fieldValid("message", messageValue);
  const doneSteps = [nameOk && emailOk, Boolean(subjectValue || urgent), messageOk];
  const last = STEP_FIELDS.length - 1;

  const form = (
    <div className={shake ? "shake" : ""}>
      {/* `data-motion-stagger`: the rows — the reason dropdown among them —
          arrive one after another as the form scrolls in (lib/motion/ux.ts,
          vanilla Motion on this markup, off screen only). The honeypot is
          `aria-hidden` and skipped, or the fade would reveal it. */}
      <form
        onSubmit={(event) => {
          // Enter in an early step moves on instead of sending.
          if (stage < last) {
            event.preventDefault();
            void next();
            return;
          }
          void handleSubmit(onSubmit, onInvalid)(event);
        }}
        className="contact-form space-y-6"
        noValidate
        data-motion-stagger
        data-track-form="contact"
      >
        <div
          style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
          aria-hidden="true"
        >
          <label htmlFor="website">Website</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {/* The stepper (2026-11-03): one step at a time, so the card never
            asks everything at once. Earlier steps stay reachable. */}
        <ol
          className="contact-progress"
          aria-label={stepper.progress(stage + 1, steps.length)}
          style={{ "--contact-progress": stage / (steps.length - 1) } as CSSProperties}
        >
          {steps.map((title, index) => (
            <li key={title} className="contact-progress__item" data-state={index === stage ? "current" : doneSteps[index] ? "done" : undefined}>
              <button
                type="button"
                className="contact-progress__button"
                disabled={index > reached}
                aria-current={index === stage ? "step" : undefined}
                onClick={() => goTo(index)}
              >
                <span className="contact-progress__num" aria-hidden="true">
                  {doneSteps[index] && index !== stage ? "✓" : index + 1}
                </span>
                <span className="contact-progress__title">{title}</span>
              </button>
            </li>
          ))}
        </ol>

        <Step number={1} title={steps[0]} done={doneSteps[0]} current={stage === 0}>
        <div className="contact-form-pair">
        <div className={rowClass("name")} data-filled={filled(nameOk)}>
          <label htmlFor="name" className="contact-field-label">
            {copy.form.name}
          </label>
          <div className="contact-input">
            <InputIcon name="name" />
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            placeholder={copy.form.namePlaceholder}
            className={fieldClass}
            {...a11yFor("name")}
            {...register("name")}
          />
          </div>
          <Collapse open={Boolean(errors.name)}>
            <p id={errorId("name")} className="contact-field-error text-xs mt-2">
              {copy.errors.name}
            </p>
          </Collapse>
        </div>

        <div className={rowClass("email")} data-filled={filled(emailOk)}>
          <label htmlFor="email" className="contact-field-label">
            {copy.form.email}
          </label>
          <div className="contact-input">
            <InputIcon name="email" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder={copy.form.emailPlaceholder}
            className={fieldClass}
            {...a11yFor("email")}
            {...register("email")}
          />
          </div>
          <Collapse open={Boolean(errors.email)}>
            <p id={errorId("email")} className="contact-field-error text-xs mt-2">
              {copy.errors.email}
            </p>
          </Collapse>
        </div>

        </div>

        <div className={rowClass()} data-filled={filled(fieldValid("company", companyValue))}>
          <label htmlFor="company" className="contact-field-label">
            {copy.form.company}
          </label>
          <div className="contact-input">
            <InputIcon name="company" />
          <input
            id="company"
            type="text"
            autoComplete="organization"
            placeholder={copy.form.companyPlaceholder}
            className={fieldClass}
            {...register("company")}
          />
          </div>
        </div>

        </Step>

        <Step number={2} title={steps[1]} done={doneSteps[1]} current={stage === 1}>
        <div className="contact-form-pair">
        {/* The reason for getting in touch. Optional on purpose: making it
            mandatory costs submissions from the people whose request fits no
            entry, and they are the ones worth hearing from. Rendered only when
            there are options — the list is CMS-editable and can be emptied. */}
        {reasons.length > 0 && (
          <div className={rowClass()} data-filled={filled(Boolean(subjectValue))}>
            <label htmlFor="subject" className="contact-field-label">
              {copy.reasonLabel}
            </label>
            {/* The SAME `fieldClass` as the text fields (2026-09-21): the closed
                control reads as one more row of the form — transparent, on
                the row's underline, with the accent line growing on focus.
                Only the OPEN list keeps its own frosted surface
                (`::picker(select)` in Contact.astro). */}
            <div className="contact-input">
              <InputIcon name="subject" />
            <select
              id="subject"
              className={`${fieldClass} contact-select`}
              defaultValue=""
              {...register("subject")}
            >
              <option value="">{copy.reasonEmpty}</option>
              {reasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            </div>
          </div>
        )}

        {/* Short-notice emergencies are taken (2026-10-11). The same round box
            as the consent below, in a row that fills pink when ticked. Just the
            word, no description (2026-10-12). */}
        <label className="contact-urgent-toggle">
          <input
            type="checkbox"
            className="contact-consent-input"
            checked={urgent}
            onChange={(event) => setUrgent(event.target.checked)}
          />
          <span className="contact-consent-box" aria-hidden="true" />
          <span className="contact-urgent-toggle__title">{copy.urgentLabel}</span>
        </label>
        </div>
        </Step>

        <Step number={3} title={steps[2]} done={doneSteps[2]} grow current={stage === 2}>
        {/* Everything entered so far, with a way back to each step: the
            earlier steps are hidden, so the last one shows what will be sent. */}
        <div className="contact-summary">
          <p className="contact-summary__title">{stepper.summary}</p>
          <dl className="contact-summary__list">
            <div className="contact-summary__row">
              <dt>{steps[0]}</dt>
              <dd>
                {[nameValue, emailValue, companyValue].map((value) => String(value ?? "").trim()).filter(Boolean).join(" · ")}
              </dd>
              <button type="button" className="contact-summary__edit" onClick={() => goTo(0)}>
                {stepper.edit}
              </button>
            </div>
            <div className="contact-summary__row">
              <dt>{steps[1]}</dt>
              <dd>{[subjectValue, urgent ? stepper.urgent : ""].filter(Boolean).join(" · ") || "–"}</dd>
              <button type="button" className="contact-summary__edit" onClick={() => goTo(1)}>
                {stepper.edit}
              </button>
            </div>
          </dl>
        </div>
        <div className={`${rowClass("message")} contact-field-row--message`} data-filled={filled(messageOk)}>
          <label htmlFor="message" className="contact-field-label">
            {copy.form.message}
          </label>
          {/* The guidance is a real element, not the placeholder: a
              placeholder vanishes with the first keystroke, which is when the
              visitor still needs to know what to write. Tied to the field with
              `aria-describedby`, alongside the error when there is one. */}
          <p id="contact-message-hint" className="contact-field-hint">
            {copy.messageHint}
          </p>
          <textarea
            id="message"
            rows={6}
            required
            className={`${fieldClass} resize-none`}
            {...a11yFor("message")}
            // Overrides the `aria-describedby` from `a11yFor` deliberately:
            // the hint applies whether or not there is an error, so when there
            // IS one the field has to point at both, in reading order.
            aria-describedby={
              errors.message
                ? `contact-message-hint ${errorId("message")}`
                : "contact-message-hint"
            }
            {...register("message")}
          />
          <Collapse open={Boolean(errors.message)}>
            <p id={errorId("message")} className="contact-field-error text-xs mt-2">
              {copy.errors.message}
            </p>
          </Collapse>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            {/* The native checkbox stays the control — focusable, in the tab
                order, announced as a checkbox — and is only made invisible.
                The round box beside it is a <span>, and that split is not
                decoration: an `appearance: none` <input> painted its tick
                background as a dark hole on this page, reproducibly. */}
            <input
              type="checkbox"
              className="contact-consent-input"
              required
              {...a11yFor("consent")}
              {...register("consent")}
            />
            <span className="contact-consent-box" aria-hidden="true" />
            <span className="text-xs text-white/75 leading-relaxed">
              {copy.form.consent}{" "}
              <a
                href="/legal/datenschutz"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--color-accent-pink)" }}
              >
                {copy.form.consentLink}
              </a>{" "}
              {copy.form.consentSuffix}
            </span>
          </label>
          <Collapse open={Boolean(errors.consent)}>
            <p id={errorId("consent")} className="contact-field-error text-xs mt-2">
              {copy.errors.consent}
            </p>
          </Collapse>
        </div>

        <Collapse open={submitState === "error"}>
          <p id="contact-form-error" className="contact-field-error text-sm" role="alert">
            {copy.failure}
            <a href={`mailto:${copy.email}`} className="underline">
              {copy.email}
            </a>
          </p>
        </Collapse>

        </Step>

        <div className="contact-stepper-actions">
        {stage > 0 && (
          <button type="button" className="contact-back" onClick={() => goTo(stage - 1)}>
            <span aria-hidden="true">←</span> {stepper.back}
          </button>
        )}
        {stage < last ? (
          <button key="next" type="button" className="submit-button contact-next-button min-h-[3.25rem] px-8 py-4 text-[0.9375rem] font-semibold rounded-full inline-flex items-center justify-center gap-2 cursor-pointer" onClick={() => void next()}>
            {stepper.next} <span aria-hidden="true">→</span>
          </button>
        ) : (
        <button
          // Its own key: React would otherwise reuse the "Weiter" element and
          // flip its type to submit inside that very click, sending the form.
          key="submit"
          type="submit"
          disabled={submitting}
          className="submit-button group relative w-full sm:w-auto min-h-[3.25rem] px-8 py-4 text-[0.9375rem] font-semibold rounded-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="relative z-10 inline-flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-0.5">
            {submitting ? copy.form.submitting : copy.form.submit}
            {submitting ? (
              <span className="tds-spinner tds-spinner--sm" aria-hidden="true" />
            ) : (
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </span>
        </button>
        )}
        </div>

        {/* Status only — the error above is its own `role="alert"`. */}
        <p className="sr-only" aria-live="polite">
          {submitting ? copy.form.submitting : ""}
        </p>
      </form>
    </div>
  );

  // Form -> thank-you: a cross-fade rather than a cut. Server-rendered as the
  // form, never hidden (Presence does not animate its first mount).
  return (
    <Presence view={submitState === "success" ? "success" : "form"}>
      {submitState === "success" ? success : form}
    </Presence>
  );
}
