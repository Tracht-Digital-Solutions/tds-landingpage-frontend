import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { translations } from "@tracht-digital-solutions/tds-shared/i18n";
import { ContactSchema, type ContactFormData } from "@tracht-digital-solutions/tds-shared/schemas";
import { runtimeSetting } from "@tracht-digital-solutions/tds-shared/api";

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

/**
 * Contact form ported from legacy. Posts to tds-contact-api over CORS.
 * Uses ContactSchema from @tds-shared so frontend + backend validation
 * stay in sync (the PHP backend mirrors the same schema by hand).
 */
type Lang = "de" | "en";

export default function ContactForm({ lang = "de" }: { lang?: Lang }) {
  const t = translations[lang];

  // Friendlier, on-brand failure copy than the shared default — and it
  // asks the visitor to retry *later* (the API is likely briefly down),
  // not to bash the button again right now.
  const errorCopy =
    lang === "de"
      ? "Hoppla – diese Nachricht hat sich irgendwo im Datennirwana verlaufen. Probiere es später noch einmal, oder schreib mir direkt: "
      : "Well, that message wandered off into the data void. Please try again later, or just drop me an email directly: ";

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [shake, setShake] = useState(false);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = useReducedMotion();

  // Staggered entrance — the island hydrates via `client:visible`, so
  // mounting coincides with the section scrolling into view. The form
  // is the variants parent; each field below carries `fieldItem` and
  // rises in sequence. Reduced motion drops the offset and stagger, but
  // `show` must still target { opacity: 1, y: 0 }: the SSR HTML bakes the
  // `hidden` state (opacity 0) into the markup, and an empty `show`
  // variant would leave the form invisible for reduced-motion users.
  const formStagger = {
    hidden: {},
    show: {
      transition: prefersReduced
        ? {}
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };
  const fieldItem = {
    hidden: prefersReduced ? {} : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { consent: undefined as unknown as true },
  });

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
  // focus-within styles in the scoped <style> on Contact.astro can light
  // up the label and underline together when the user lands on the input.
  // The wrapper family is deliberately `contact-field-*`, not `field-*`:
  // tds-shared's primitives.css owns a `.field` class for the *input
  // element*, and the two semantics would collide (tds-shared#…).
  // The error state is carried by the wrapper, not the input.
  const fieldClass = () =>
    [
      "contact-field block w-full appearance-none bg-transparent",
      "px-3 py-3 text-base text-white leading-snug",
      "border-0 outline-none focus:outline-none focus:ring-0",
    ].join(" ");

  const labelClass = "contact-field-label";

  return (
    <div className={shake ? "shake" : ""}>
      <AnimatePresence mode="wait">
        {submitState === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start gap-4 py-12"
          >
            <motion.span
              initial={prefersReduced ? false : { scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.1 }}
              style={{ color: "var(--color-accent-pink)", fontSize: 40, lineHeight: 1 }}
              aria-hidden
            >
              ✓
            </motion.span>
            <h3
              className="text-2xl font-[var(--font-display)] font-medium text-white"
              style={{ fontVariationSettings: '"opsz" 144' }}
            >
              {t.contact.form.successTitle}
            </h3>
            <p className="text-white/60">{t.contact.form.successMessage}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8"
            noValidate
            aria-live="polite"
            variants={formStagger}
            initial="hidden"
            animate="show"
          >
            <div
              style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
              aria-hidden="true"
            >
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <motion.div variants={fieldItem} className={`contact-field-row ${errors.name ? "contact-field-row--error" : ""}`}>
              <label htmlFor="name" className={labelClass}>{t.contact.form.name}</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={t.contact.form.namePlaceholder}
                className={fieldClass()}
                {...register("name")}
              />
              <span className="contact-field-line" aria-hidden="true" />
              {errors.name && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.name}
                </p>
              )}
            </motion.div>

            <motion.div variants={fieldItem} className={`contact-field-row ${errors.email ? "contact-field-row--error" : ""}`}>
              <label htmlFor="email" className={labelClass}>{t.contact.form.email}</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t.contact.form.emailPlaceholder}
                className={fieldClass()}
                {...register("email")}
              />
              <span className="contact-field-line" aria-hidden="true" />
              {errors.email && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.email}
                </p>
              )}
            </motion.div>

            <motion.div variants={fieldItem} className="contact-field-row">
              <label htmlFor="company" className={labelClass}>{t.contact.form.company}</label>
              <input
                id="company"
                type="text"
                autoComplete="organization"
                placeholder={t.contact.form.companyPlaceholder}
                className={fieldClass()}
                {...register("company")}
              />
              <span className="contact-field-line" aria-hidden="true" />
            </motion.div>

            <motion.div variants={fieldItem} className={`contact-field-row ${errors.message ? "contact-field-row--error" : ""}`}>
              <label htmlFor="message" className={labelClass}>{t.contact.form.message}</label>
              <textarea
                id="message"
                rows={4}
                placeholder={t.contact.form.messagePlaceholder}
                className={`${fieldClass()} resize-none`}
                {...register("message")}
              />
              <span className="contact-field-line" aria-hidden="true" />
              {errors.message && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={fieldItem}>
              <label className="flex items-center gap-3 cursor-pointer">
                {/* The native checkbox stays the control — focusable, in the tab
                    order, announced as a checkbox — and is only made invisible.
                    The round box beside it is a <span>, and that split is not
                    decoration: an `appearance: none` <input> painted its tick
                    background as a dark hole on this page, reproducibly, while
                    an identical element cloned next to it rendered correctly.
                    A span has no native control paint to fight. */}
                <input
                  type="checkbox"
                  className="contact-consent-input"
                  {...register("consent")}
                />
                <span className="contact-consent-box" aria-hidden="true" />
                <span className="text-xs text-white/60 leading-relaxed">
                  {t.contact.form.consent}{" "}
                  <a
                    href="/legal/datenschutz"
                    className="hover:underline"
                    style={{ color: "var(--color-accent-pink)" }}
                  >
                    {t.contact.form.consentLink}
                  </a>{" "}
                  {t.contact.form.consentSuffix}
                </span>
              </label>
              {errors.consent && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.consent}
                </p>
              )}
            </motion.div>

            {submitState === "error" && (
              <p className="text-xs" style={{ color: "var(--color-accent-pink)" }} role="alert">
                {errorCopy}
                <a href={`mailto:${t.contact.info.email}`} className="underline">
                  {t.contact.info.email}
                </a>
              </p>
            )}

            <motion.button
              type="submit"
              disabled={submitState === "submitting"}
              variants={fieldItem}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
              className="submit-button group relative w-full py-4 text-sm font-medium rounded-full overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="relative z-10 inline-flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-0.5">
                {submitState === "submitting"
                  ? t.contact.form.submitting
                  : t.contact.form.submit}
                {submitState === "submitting" ? (
                  <motion.svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </motion.svg>
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
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
