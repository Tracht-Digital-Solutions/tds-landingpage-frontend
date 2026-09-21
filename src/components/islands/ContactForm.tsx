import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, type ContactFormData } from "@tracht-digital-solutions/tds-shared/schemas";
import { runtimeSetting } from "@tracht-digital-solutions/tds-shared/api";
import { Collapse, Presence } from "@tracht-digital-solutions/tds-shared/motion/react";
import { CONTACT_DRAFT_EVENT, CONTACT_DRAFT_KEY } from "~/lib/contactDraft";
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
 * - **The words come from `lib/contactCopy.ts`** (2026-09-15): the site says
 *   "du", the shared bundle says "Sie", and the sentences that address the
 *   visitor — errors, success, the failure message — are overridden there.
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
  nextSteps,
}: {
  lang?: Lang;
  /** Options for the reason dropdown, already resolved against the CMS. */
  reasons?: readonly string[];
  /** What happens after sending — rendered in place of the form. */
  nextSteps?: { title: string; items: readonly { label: string; text: string }[] };
}) {
  const copy = contactFormCopy(lang);

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [shake, setShake] = useState(false);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
    const apply = (draft: unknown) => {
      if (typeof draft !== "string" || draft.trim() === "") return;
      const current = String(getValues("message") ?? "");
      if (current.includes(draft.trim())) return;
      setValue("message", current.trim() ? `${current.trimEnd()}\n\n${draft}` : draft, { shouldDirty: true });
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
  }, [getValues, setValue]);

  useEffect(
    () => () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    },
    [],
  );

  const triggerShake = () => {
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    setShake(true);
    shakeTimerRef.current = setTimeout(() => setShake(false), 600);
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
        body: JSON.stringify({ ...data, lang }),
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
  // focus-within styles in Contact.astro can light up the label and underline
  // together when the visitor lands on the input. The wrapper family is
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

  const form = (
    <div className={shake ? "shake" : ""}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8" noValidate>
        <div
          style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
          aria-hidden="true"
        >
          <label htmlFor="website">Website</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <div className={rowClass("name")}>
          <label htmlFor="name" className="contact-field-label">
            {copy.form.name}
          </label>
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
          <span className="contact-field-line" aria-hidden="true" />
          <Collapse open={Boolean(errors.name)}>
            <p id={errorId("name")} className="contact-field-error text-xs mt-2">
              {copy.errors.name}
            </p>
          </Collapse>
        </div>

        <div className={rowClass("email")}>
          <label htmlFor="email" className="contact-field-label">
            {copy.form.email}
          </label>
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
          <span className="contact-field-line" aria-hidden="true" />
          <Collapse open={Boolean(errors.email)}>
            <p id={errorId("email")} className="contact-field-error text-xs mt-2">
              {copy.errors.email}
            </p>
          </Collapse>
        </div>

        <div className={rowClass()}>
          <label htmlFor="company" className="contact-field-label">
            {copy.form.company}
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            placeholder={copy.form.companyPlaceholder}
            className={fieldClass}
            {...register("company")}
          />
          <span className="contact-field-line" aria-hidden="true" />
        </div>

        {/* The reason for getting in touch. Optional on purpose: making it
            mandatory costs submissions from the people whose request fits no
            entry, and they are the ones worth hearing from. Rendered only when
            there are options — the list is CMS-editable and can be emptied. */}
        {reasons.length > 0 && (
          <div className={rowClass()}>
            <label htmlFor="subject" className="contact-field-label">
              {copy.reasonLabel}
            </label>
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
            <span className="contact-field-line" aria-hidden="true" />
          </div>
        )}

        <div className={rowClass("message")}>
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
            rows={4}
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
          <span className="contact-field-line" aria-hidden="true" />
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

        <button
          type="submit"
          disabled={submitting}
          className="submit-button group relative w-full min-h-[3.25rem] py-4 text-sm font-medium rounded-full overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
