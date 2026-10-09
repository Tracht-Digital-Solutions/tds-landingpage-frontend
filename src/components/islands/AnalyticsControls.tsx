import { useEffect, useState } from "react";
import { analyticsVisitorId, forgetAnalytics } from "@tracht-digital-solutions/tds-shared/analytics";
import { necessaryOnly } from "@tracht-digital-solutions/tds-shared/consent";
import { openConsentSettings, readConsent, writeConsent } from "@tracht-digital-solutions/tds-shared/consent/store";

export interface AnalyticsControlsCopy {
  settings: string;
  erase: string;
  done: string;
  failed: string;
  noId: string;
}

/**
 * The privacy policy's controls for the site's own statistics: change the
 * choice, or erase what was recorded under this browser's id. Erasing also
 * withdraws the consent — otherwise the next page view would start a new id
 * and the button would have done the opposite of what it says.
 *
 * The copy comes from the page: the legal register addresses the reader
 * differently from the rest of the site, and only the legal pages own it.
 */
export default function AnalyticsControls({ copy }: { copy: AnalyticsControlsCopy }) {
  const [hasId, setHasId] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "failed">("idle");

  useEffect(() => {
    setHasId(analyticsVisitorId() !== null);
  }, []);

  const erase = async () => {
    setState("busy");
    const ok = await forgetAnalytics();
    if (ok) {
      const current = readConsent()?.choices ?? necessaryOnly();
      writeConsent({ ...current, analytics: false }, "de");
      setHasId(false);
    }
    setState(ok ? "done" : "failed");
  };

  return (
    <div className="analytics-controls">
      <p>
        <button type="button" className="btn btn-ghost" onClick={() => openConsentSettings()}>
          {copy.settings}
        </button>{" "}
        <button type="button" className="btn btn-ghost" disabled={!hasId || state === "busy"} onClick={erase}>
          {copy.erase}
        </button>
      </p>
      <p role="status" className="text-sm text-[var(--color-muted)] mt-2">
        {state === "done" ? copy.done : state === "failed" ? copy.failed : !hasId ? copy.noId : ""}
      </p>
    </div>
  );
}
