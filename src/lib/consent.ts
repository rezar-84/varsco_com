/**
 * Cookie/tracking consent.
 *
 * VARS is a Turkish company selling into the EU and the Gulf, so both KVKK and
 * GDPR apply. Both treat anything beyond "strictly necessary" as requiring
 * opt-in *before* the first collection — not a banner that merely announces
 * tracking already underway.
 *
 * Only two categories, deliberately. A longer list reads as compliance theatre
 * and pushes people to "accept all" without reading, which produces consent
 * that is arguably not informed:
 *
 *   necessary — session, locale, cart. No consent needed, cannot be declined.
 *   analytics — the visitor-journey tracking that feeds Odoo's website.visitor.
 *
 * The submission context already sent with forms (page, locale, UTM, referrer
 * host) is deliberately NOT gated here: it is collected only at the moment a
 * user submits a form they chose to fill in, it is part of that submission, and
 * it sets no identifier and follows nobody around the site.
 */

export type ConsentCategory = "necessary" | "analytics";

export interface ConsentState {
  analytics: boolean;
  /** ISO timestamp of the decision — proof of when consent was given. */
  decidedAt: string;
  /** Bumped when the categories change, forcing a re-ask. */
  version: number;
}

/** Raise this if what we collect changes; stored decisions below it re-prompt. */
export const CONSENT_VERSION = 1;

const STORAGE_KEY = "vars.consent.v1";

/**
 * localStorage, not a cookie.
 *
 * The record of a consent decision is itself "strictly necessary" either way,
 * but localStorage keeps it off every HTTP request — there is no reason to ship
 * it to the server on each navigation when only the browser needs to read it.
 */
export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (typeof parsed?.analytics !== "boolean") return null;
    // A decision made against an older category set is not consent for the
    // current one.
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): ConsentState {
  const state: ConsentState = {
    analytics,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing. The banner will ask again next visit, which is the
    // correct failure mode — never assume consent we could not record.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
  return state;
}

/** Withdraw consent. Required by both regimes to be as easy as giving it. */
export function clearConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

/** Fired on any change so listeners can start or stop collecting immediately. */
export const CONSENT_EVENT = "vars:consent-changed";

/**
 * Whether analytics collection is permitted right now.
 *
 * Defaults to false — during SSR, before a decision, and on any read failure.
 * Every caller must treat "unknown" as "no".
 */
export function analyticsAllowed(): boolean {
  return readConsent()?.analytics === true;
}
