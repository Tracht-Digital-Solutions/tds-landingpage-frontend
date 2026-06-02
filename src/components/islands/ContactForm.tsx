import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { translations } from "@tracht-digital-solutions/tds-shared/i18n";
import { ContactSchema, type ContactFormData } from "@tracht-digital-solutions/tds-shared/schemas";

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

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [shake, setShake] = useState(false);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const res = await fetch(CONTACT_API_URL, {
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

  // Each field is wrapped in a `.field` <div> so the focus-within
  // styles in the scoped <style> on Contact.astro can light up the
  // label and underline together when the user lands on the input.
  const fieldClass = (hasError: boolean) =>
    [
      "contact-field block w-full appearance-none bg-transparent",
      "px-0 py-3 text-base text-white leading-snug",
      "border-0 outline-none focus:outline-none focus:ring-0",
      hasError ? "contact-field--error" : "",
    ].join(" ");

  const labelClass = "field-label";

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
            <span style={{ color: "var(--color-accent-pink)", fontSize: 40 }} aria-hidden>
              ✓
            </span>
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

            <div className={`field ${errors.name ? "field--error" : ""}`}>
              <label htmlFor="name" className={labelClass}>{t.contact.form.name}</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={t.contact.form.namePlaceholder}
                className={fieldClass(!!errors.name)}
                {...register("name")}
              />
              <span className="field-line" aria-hidden="true" />
              {errors.name && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.name}
                </p>
              )}
            </div>

            <div className={`field ${errors.email ? "field--error" : ""}`}>
              <label htmlFor="email" className={labelClass}>{t.contact.form.email}</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t.contact.form.emailPlaceholder}
                className={fieldClass(!!errors.email)}
                {...register("email")}
              />
              <span className="field-line" aria-hidden="true" />
              {errors.email && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="company" className={labelClass}>{t.contact.form.company}</label>
              <input
                id="company"
                type="text"
                autoComplete="organization"
                placeholder={t.contact.form.companyPlaceholder}
                className={fieldClass(false)}
                {...register("company")}
              />
              <span className="field-line" aria-hidden="true" />
            </div>

            <div className={`field ${errors.message ? "field--error" : ""}`}>
              <label htmlFor="message" className={labelClass}>{t.contact.form.message}</label>
              <textarea
                id="message"
                rows={4}
                placeholder={t.contact.form.messagePlaceholder}
                className={`${fieldClass(!!errors.message)} resize-none`}
                {...register("message")}
              />
              <span className="field-line" aria-hidden="true" />
              {errors.message && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-[2px] accent-[var(--color-accent-pink)] flex-shrink-0"
                  {...register("consent")}
                />
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
            </div>

            {submitState === "error" && (
              <p className="text-xs" style={{ color: "var(--color-accent-pink)" }} role="alert">
                {t.contact.form.errorMessage}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={submitState === "submitting"}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
              className="submit-button group relative w-full py-4 text-sm font-medium rounded-full overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="relative z-10 inline-flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-0.5">
                {submitState === "submitting"
                  ? t.contact.form.submitting
                  : t.contact.form.submit}
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
              </span>
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
