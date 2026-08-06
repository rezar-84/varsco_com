import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import { readConsent, writeConsent, CONSENT_EVENT } from "@/lib/consent";

/**
 * Consent prompt for analytics tracking.
 *
 * Deliberately not a modal and not a full-screen overlay: neither KVKK nor
 * GDPR requires blocking the page, and a wall in front of the content pressures
 * people into accepting to get past it — which undermines the "freely given"
 * requirement it is supposed to satisfy.
 *
 * Accept and decline carry equal visual weight for the same reason. A greyed
 * out "decline" next to a bright "accept all" is the pattern regulators
 * single out.
 *
 * Renders nothing until mounted, so the server never guesses at a decision it
 * cannot read.
 */
export function ConsentBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // A stored decision from an older CONSENT_VERSION reads as null, which
    // re-prompts — correct, since the categories it agreed to have changed.
    if (readConsent() === null) setVisible(true);
    const onChange = () => setVisible(readConsent() === null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!visible) return null;

  const decide = (analytics: boolean) => {
    writeConsent(analytics);
    setVisible(false);
  };

  return (
    <div
      // role="region" rather than "dialog": it does not trap focus, and
      // announcing it as a dialog would imply the page is blocked.
      role="region"
      aria-label={t("consent.aria.label")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/98 backdrop-blur-md shadow-[0_-8px_32px_-12px_rgba(0,30,64,0.25)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 hidden shrink-0 rounded-xl bg-primary/10 p-2 text-primary sm:block">
            <Cookie className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("consent.body")}{" "}
            <Link to="/privacy" className="font-bold text-primary hover:text-navy">
              {t("consent.privacyLink")}
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Equal weight: same size, same shape, both filled. */}
          <Button
            variant="outline"
            className="rounded-xl text-xs font-bold"
            onClick={() => decide(false)}
          >
            {t("consent.decline")}
          </Button>
          <Button className="rounded-xl text-xs font-bold" onClick={() => decide(true)}>
            {t("consent.accept")}
          </Button>
          {/* Dismissing without choosing is a refusal, not a deferral — we must
              not collect while waiting for someone to decide later. */}
          <button
            type="button"
            onClick={() => decide(false)}
            aria-label={t("consent.dismiss")}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-alt hover:text-navy"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
