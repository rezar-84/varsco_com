import { analyticsAllowed, CONSENT_EVENT } from "@/lib/consent";

/**
 * Pageview tracking, gated on analytics consent.
 *
 * Sends to our own /api/track, never to Odoo directly — the write token stays
 * server-side, and the origin is where events can be dropped.
 *
 * Consent is checked here rather than on the server because the server cannot
 * tell a consented visitor from a forged claim. The client is the only place
 * that actually knows, so it is the only place that decides. Nothing is
 * queued while consent is absent: buffering "just in case" someone accepts
 * later would be collection before consent, which is the thing consent exists
 * to prevent.
 */

const TOKEN_KEY = "vars.visitor.v1";
const FLUSH_DELAY_MS = 2000;
const MAX_BATCH = 50;

interface PageEvent {
  url: string;
  at: string;
}

let queue: PageEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * A 32-character lowercase hex token, matching what Odoo expects for an
 * anonymous website.visitor: it parses anything else as a res.partner id
 * (website_visitor.py::_compute_partner_id), which raises inside a computed
 * field and 500s the whole request.
 *
 * Stored in localStorage rather than a cookie so it is never attached to
 * ordinary page requests — it exists only to correlate this visitor's own
 * events, and there is no reason to broadcast it on every navigation.
 */
function getVisitorToken(): string | null {
  try {
    const existing = localStorage.getItem(TOKEN_KEY);
    if (existing && /^[0-9a-f]{32}$/.test(existing)) return existing;
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    localStorage.setItem(TOKEN_KEY, token);
    return token;
  } catch {
    // Private browsing: no stable token, so no correlation is possible.
    // Skip rather than inventing a per-pageview token, which would inflate
    // the visitor count with phantom one-view visitors.
    return null;
  }
}

/**
 * The existing visitor token, or null — for attaching a form submission to the
 * journey that preceded it.
 *
 * Read-only on purpose. Unlike getVisitorToken it never mints one: submitting a
 * form is not consent to be tracked, and a token created at submission time
 * would correlate with nothing anyway, since no pageview was ever recorded
 * under it. Absent consent this returns null and the lead simply arrives
 * unlinked, exactly as it did before.
 */
export function readVisitorToken(): string | null {
  if (typeof window === "undefined" || !analyticsAllowed()) return null;
  try {
    const existing = localStorage.getItem(TOKEN_KEY);
    return existing && /^[0-9a-f]{32}$/.test(existing) ? existing : null;
  } catch {
    return null;
  }
}

/** Forget the visitor entirely. Called when consent is withdrawn. */
export function clearVisitorToken(): void {
  queue = [];
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* nothing to remove */
  }
}

async function flush(): Promise<void> {
  flushTimer = null;
  if (!analyticsAllowed() || queue.length === 0) return;
  const token = getVisitorToken();
  if (!token) return;

  const events = queue.slice(0, MAX_BATCH);
  queue = queue.slice(events.length);

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorToken: token,
        langCode: document.documentElement.lang || undefined,
        events,
      }),
      // The page may be unloading; this lets the request outlive it.
      keepalive: true,
    });
  } catch {
    // Analytics must never surface an error to a visitor who is just reading.
  }
}

/**
 * Record a pageview. Silently does nothing without consent.
 *
 * Batched on a short timer so a burst of client-side navigations becomes one
 * request rather than one per route change.
 */
export function trackPageView(url: string): void {
  if (typeof window === "undefined" || !analyticsAllowed()) return;
  queue.push({ url, at: new Date().toISOString() });
  if (queue.length >= MAX_BATCH) {
    void flush();
    return;
  }
  if (!flushTimer) flushTimer = setTimeout(() => void flush(), FLUSH_DELAY_MS);
}

/** Wire up withdrawal: stop collecting and drop the token immediately. */
export function initTrackingConsentListener(): () => void {
  const onChange = () => {
    if (!analyticsAllowed()) clearVisitorToken();
  };
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}
