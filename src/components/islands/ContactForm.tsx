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

  const fieldClass = (hasError: boolean) =>
    `contact-field w-full bg-transparent border-b py-3 text-base text-white placeholder-white/40 leading-snug transition-colors duration-200 outline-none focus:placeholder-white/25 focus:border-[var(--color-accent-pink)] ${
      hasError ? "border-[var(--color-accent-pink)]" : "border-white/25"
    }`;

  const labelClass =
    "block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest";

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
            className="space-y-8"
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

            <div>
              <label htmlFor="name" className={labelClass}>{t.contact.form.name}</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={t.contact.form.namePlaceholder}
                className={fieldClass(!!errors.name)}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>{t.contact.form.email}</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t.contact.form.emailPlaceholder}
                className={fieldClass(!!errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="company" className={labelClass}>{t.contact.form.company}</label>
              <input
                id="company"
                type="text"
                autoComplete="organization"
                placeholder={t.contact.form.companyPlaceholder}
                className={fieldClass(false)}
                {...register("company")}
              />
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>{t.contact.form.message}</label>
              <textarea
                id="message"
                rows={4}
                placeholder={t.contact.form.messagePlaceholder}
                className={`${fieldClass(!!errors.message)} resize-none`}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-xs mt-2" style={{ color: "var(--color-accent-pink)" }}>
                  {t.errors.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded-[2px] accent-[var(--color-accent-pink)] flex-shrink-0"
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
              whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.15 }}
              className="w-full py-4 text-sm font-medium rounded-[100px] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              style={{ backgroundColor: "var(--color-accent-pink)", color: "var(--color-primary)" }}
            >
              {submitState === "submitting" ? t.contact.form.submitting : t.contact.form.submit}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
