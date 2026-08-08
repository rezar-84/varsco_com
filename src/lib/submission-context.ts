/**
 * Context captured alongside every form submission.
 *
 * Before this, a lead arrived in Odoo with name/email/company/phone/message
 * and a free-text `source` string — nothing about where the buyer had been,
 * what they were looking at, or which language they were reading. Sales had
 * no way to tell a seabass hatchery enquiry from a salmon-ova one until they
 * opened the note.
 *
 * Everything here is first-party and derived from the page the user is already
 * on. No cookies are set and no third party is contacted, so this needs no
 * consent gate. The one exception is `visitorToken`, which is only ever
 * present for a visitor who accepted analytics — it is read, never created,
 * here (see readVisitorToken in lib/tracking.ts).
 */

import { readVisitorToken } from "@/lib/tracking";

/**
 * Which form produced the lead. A closed set rather than free text: the Odoo
 * side maps these onto utm.source records, so a typo used to mean a silently
 * unattributed lead. Values are stable identifiers — never translate them.
 */
export const SUBMISSION_SOURCES = {
  contact: "contact",
  servicesSolutions: "services-solutions",
  requestQuotePage: "request-quote-page",
  productDrawer: "product-quote-drawer",
  cart: "cart-quote",
  horeca: "horeca-middle-east",
  oliveFlounderLanding: "olive-flounder-export",
  newsletter: "newsletter",
} as const;

export type SubmissionSource = (typeof SUBMISSION_SOURCES)[keyof typeof SUBMISSION_SOURCES];

export interface SubmissionContext {
  /** Closed-set form identifier. */
  source: SubmissionSource;
  /** Path the form was submitted from, without query or hash. */
  pagePath?: string;
  /** Section within the page, where a page has several entry points. */
  pageSection?: string;
  /** Locale the buyer was reading — decides which language sales replies in. */
  locale?: string;
  /** Off-site referrer, if the browser reported one. */
  referrer?: string;
  /** Campaign parameters, if the visit carried them. */
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** Portal account id, when the submitter is signed in. */
  portalUserId?: string;
  /**
   * Anonymous visitor token, present only for a visitor who accepted
   * analytics. Lets Odoo attach the lead to the website.visitor whose
   * pageviews we already hold, so sales sees the journey that led here.
   */
  visitorToken?: string;
}

/** UTM keys we forward. Anything else in the query string is ignored. */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

/**
 * Read the campaign parameters for this visit.
 *
 * Checks the current URL first, then a sessionStorage copy written on the
 * landing page — a buyer who arrives on a campaign link and submits three
 * pages later would otherwise lose the attribution entirely.
 */
function readUtm(): Pick<SubmissionContext, "utmSource" | "utmMedium" | "utmCampaign"> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of UTM_KEYS) {
      const live = params.get(key);
      if (live) out[key] = live;
    }
    if (Object.keys(out).length > 0) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(out));
    } else {
      const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (stored) Object.assign(out, JSON.parse(stored) as Record<string, string>);
    }
  } catch {
    // Private browsing can throw on sessionStorage. Attribution is a
    // nice-to-have; never let it break a submission.
  }
  return {
    utmSource: out.utm_source,
    utmMedium: out.utm_medium,
    utmCampaign: out.utm_campaign,
  };
}

const UTM_STORAGE_KEY = "vars.utm.v1";

/**
 * Build the context for a submission.
 *
 * Safe to call during SSR: every browser-only read is guarded, and the result
 * simply carries less information rather than throwing.
 */
export function buildSubmissionContext(
  source: SubmissionSource,
  extra: { pageSection?: string; locale?: string; portalUserId?: string } = {},
): SubmissionContext {
  const onClient = typeof window !== "undefined";
  return {
    source,
    // Path only — the query string can carry campaign parameters and, on some
    // pages, buyer-entered search terms. Those are forwarded deliberately via
    // the UTM fields, not swept up wholesale.
    pagePath: onClient ? window.location.pathname : undefined,
    pageSection: extra.pageSection,
    locale: extra.locale,
    referrer: onClient && document.referrer ? document.referrer : undefined,
    ...readUtm(),
    portalUserId: extra.portalUserId,
    visitorToken: readVisitorToken() ?? undefined,
  };
}
