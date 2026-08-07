import { analyticsAllowed, CONSENT_EVENT } from "@/lib/consent";

/**
 * Google Tag Manager, loaded only after the visitor opts in.
 *
 * The container is deliberately NOT emitted from head().scripts. That renders
 * into the SSR HTML on every request, which would contact Google for every
 * visitor regardless of consent — the exact thing the rest of this site
 * refuses to do (see lib/tracking.ts, which will not even buffer events while
 * consent is absent). Nothing here touches the network until analyticsAllowed()
 * is true, so a visitor who declines or ignores the banner never makes a single
 * request to Google.
 *
 * Consent Mode's "load with everything denied, update later" pattern is not
 * used for the same reason: it still contacts googletagmanager.com and sends
 * cookieless pings before a decision. Its payoff — modelled conversions —
 * requires far more daily traffic than a B2B exporter sees, so it would be
 * paying a real compliance cost for nothing.
 *
 * GA4 is configured as a tag inside the container, so the measurement ID never
 * appears in this codebase and tag changes do not need a redeploy.
 */

/**
 * Inlined at build time, not read at runtime — a VITE_ prefixed variable must
 * be present as a *build* argument in Dokploy. Absent, this module is inert:
 * dev and any unconfigured environment stay clean by construction rather than
 * by remembering to switch something off.
 */
const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined;

/** Google's own container id shape, checked so a malformed value fails here. */
const ID_PATTERN = /^GTM-[A-Z0-9]+$/;

type ConsentValue = "granted" | "denied";

interface ConsentSignals {
  analytics_storage: ConsentValue;
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let loaded = false;

function dataLayer(): unknown[] {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

/**
 * Google's gtag shim, kept verbatim in behaviour: it pushes the raw `arguments`
 * object, not an array. Consent Mode distinguishes gtag commands from ordinary
 * dataLayer events by that arguments-object shape, so pushing a real array is
 * the classic silent failure — it lands on the queue and is never applied.
 */
function gtag(command: "consent", action: "default" | "update", signals: ConsentSignals): void {
  // eslint-disable-next-line prefer-rest-params
  dataLayer().push(arguments);
}

/**
 * Advertising signals stay denied in every state. The banner offers a single
 * analytics category, VARS does not run Google Ads, and claiming ad consent we
 * never asked for would be worse than not measuring at all.
 */
function consentState(analytics: ConsentValue): ConsentSignals {
  return {
    analytics_storage: analytics,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
}

/**
 * Load the container. Idempotent, and a no-op unless consent is present.
 *
 * Safe to call on every mount: a returning visitor who consented on an earlier
 * visit gets picked up without having to interact with the banner again.
 */
export function loadGtm(): void {
  if (typeof window === "undefined") return;
  if (loaded || !GTM_ID || !ID_PATTERN.test(GTM_ID)) return;
  if (!analyticsAllowed()) return;

  loaded = true;

  // Consent is declared before the container script is injected, so tags never
  // observe an unset state during the window while gtm.js is in flight.
  gtag("consent", "default", consentState("granted"));
  dataLayer().push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(script);
}

/**
 * Record a client-side navigation.
 *
 * Pushed explicitly rather than relying on GTM's History Change trigger, which
 * infers navigations from pushState and is easy to get subtly wrong against a
 * client-side router. No-op when the container was never loaded.
 */
export function pushPageView(url: string): void {
  if (typeof window === "undefined" || !loaded || !analyticsAllowed()) return;
  dataLayer().push({ event: "page_view", page_path: url });
}

/**
 * Withdrawal, done honestly.
 *
 * A container already running in this page cannot be unloaded, so pretending
 * otherwise would be the easy lie. Instead: deny the signal so tags stop
 * writing storage, stop pushing events, and delete the identifier GA4 has
 * already set. The next page load never injects the container at all, because
 * analyticsAllowed() is false by then.
 *
 * Clearing the cookies is the part that makes this a real withdrawal rather
 * than a UI gesture — it mirrors clearVisitorToken() in lib/tracking.ts.
 */
function revokeGtm(): void {
  if (typeof window === "undefined") return;
  if (loaded) gtag("consent", "update", consentState("denied"));
  clearGaCookies();
}

/**
 * GA4 writes `_ga` plus one `_ga_<container>` per property. They are set on the
 * registrable domain, so expiring them on the exact hostname alone leaves the
 * dot-prefixed parent copy behind — which is why both are attempted.
 */
function clearGaCookies(): void {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0]?.trim())
    .filter((n): n is string => !!n && (n === "_ga" || n.startsWith("_ga_")));

  const { hostname } = window.location;
  const parent = hostname.split(".").slice(-2).join(".");
  const domains = [undefined, hostname, `.${hostname}`, `.${parent}`];

  for (const name of new Set(names)) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${
        domain ? `; domain=${domain}` : ""
      }`;
    }
  }
}

/** Start loading on consent, revoke on withdrawal. Returns an unsubscribe. */
export function initGtmConsentListener(): () => void {
  const onChange = () => {
    if (analyticsAllowed()) loadGtm();
    else revokeGtm();
  };
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}
