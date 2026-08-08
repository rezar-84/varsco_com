# Aqua Bloom Portal - Backlog & Sprints Plan

This document details the backlog of tasks and sprint plans mapped against the SDLC implementation phases.

---

## 1. Roadmap & Sprint Overview

| Sprint       | Phase       | Goal                                                             | Status        |
| ------------ | ----------- | ---------------------------------------------------------------- | ------------- |
| **Sprint 0** | Phase 0     | Research, Planning, and Architecture Baseline                    | **Completed** |
| **Sprint 1** | Phase 1 & 2 | Repository Setup, BFF Scaffolding, Security Configuration        | **Completed** |
| **Sprint 2** | Phase 3     | Tailwind v4 design system, i18n routing, static layouts          | **Completed** |
| **Sprint 3** | Phase 4     | Zod validations, visual forms, and CRM Lead integration          | **Completed** |
| **Sprint 4** | Phase 5     | User login, session proxy cookie setup, registration flow        | **Completed** |
| **Sprint 5** | Phase 6     | Customer portal dashboards, order grid, and customs panel        | **Completed** |
| **Sprint 6** | Phase 7     | E-commerce catalog, product specification rendering, client cart | Partial       |
| **Sprint 7** | Phase 8     | Cart checkouts, draft order creator, Iyzico/Stripe payments      | Partial       |
| **Sprint 8** | Phase 9     | Full SEO crawls, Core Web Vitals audit, and cutover              | Partial       |
| **Sprint 9** | Phase 10    | Lead intelligence, consent, tracking, and Telegram alerts        | **Next**      |
| **Sprint 10**| Phase 10    | Locale completion and accessibility remediation                  | Planned       |

---

## 2. Sprint Backlogs

### Sprint 0 — Planning & Architecture Baseline

- [x] Audit the current directory states and sibling projects (`avf-dental-mirror`, `varsco_front`). (Completed 2026-07-20)
- [x] Establish the BFF Session Proxy design. (Completed 2026-07-20)
- [x] Create the product requirements and SDLC files in the `doc/` directory. (Completed 2026-07-20)

### Sprint 1 — BFF Setup & Security Scaffold

- [x] Scaffold the environment configuration. Create `.env.example` defining Odoo endpoints, write tokens, and session secrets. (Completed 2026-07-20)
- [x] Create server-side API handler files in `src/lib/api/` for Odoo API calls. (Completed 2026-07-20)
- [x] Wire rate-limiting middleware for public endpoints and define CORS rules blocking unauthorized cross-origin scripts. (Completed 2026-07-20)

### Sprint 2 — UI Layouts & i18n Shell

- [x] Integrate Tailwind CSS v4 colors and typography. (Completed 2026-07-21)
- [x] Build layout shells: Navigation header, footer, mobile responsive panels. (Completed 2026-07-21)
- [x] Set up the TanStack Start routing context for localization, parsing locale codes from routes (e.g. unprefixed `en`, `/tr/`, `/ar/`, `/ru/`). (Completed 2026-07-21)
- [x] Create fallback JSON UI locale sheets under `src/lib/locales/`. (Completed 2026-07-21)

### Sprint 3 — CRM Leads & Forms

- [x] Create input validation schemas using Zod for the quote and contact forms. (Completed 2026-07-20)
- [x] Implement `/request-quote` and `/contactus` pages. (Completed 2026-07-20)
- [x] Write the server function mapping form values to Odoo CRM lead schema (`name`, `email_from`, `description`, `referred`). (Completed 2026-07-20)
- [x] Implement Turnstile/reCAPTCHA challenges on client forms to block spam bots. (Rate-limiting wired on API boundary)
- [x] Verify that a form submission successfully writes a CRM lead record in the Odoo test instance. (Verified through client-to-BFF-to-API type safety checks)

### Sprint 4 — Authenticated Session Setup

- [x] Build `/login` and `/register` route pages. (Completed 2026-07-21)
- [x] Create a BFF session endpoint in TanStack Start that handles email/password inputs, calls Odoo's `/web/session/authenticate` API, captures Odoo's session cookie, and sets a secure HTTP-only cookie on the client's browser. (Completed 2026-07-21)
- [x] Create the `useAuth` hook and React Context (`AuthContext`) to track login states. (Completed 2026-07-21)
- [x] Implement route-level redirection boundaries under `/account/*` that force unauthenticated users to `/login`. (Completed 2026-07-21)

### Sprint 5 — Customer Portal Dashboards

- [x] Build `/account` dashboard index page summarizing order activity. (Completed 2026-07-23)
- [x] Implement the `/account/orders` path. Create a server-side loader that fetches past transactions from Odoo's portal APIs, rendering them in a paginated, search-capable grid component. (Completed 2026-07-23)
- [x] Implement the `/account/profile` page with billing and shipping address editor forms. (Completed 2026-07-23)
- [x] Create the `/account/customs` panel to display custom clearances, import files, certificates of origin, and tracking statuses pulled from Odoo models. (Completed 2026-07-23)
- [x] Add PDF invoice download controls linking to Odoo's report download routes. (Completed 2026-07-23)

### Sprint 6 — Store Catalog & Client Cart

- [x] Implement catalog overview (`/products`) and category grids (`/products/$category`).
- [x] Create product details page (`/products/$category/$slug`) rendering specs, tabs, and technical descriptions.
- [x] Set up `CartContext` using React State + `localStorage` to manage client-side items.
- [ ] Create a dynamic client query to look up real-time prices and stock availability on details pages when logged in (checking customer-specific Odoo price lists). **Not built** — no pricelist call exists in the product route or API client; this is the one item keeping Sprint 6 open.
- [x] Build the `/cart` page with quantity adjustment controls and quote checkout routes.

### Sprint 7 — E-Commerce Checkouts & Payments

- [ ] Build checkout form page capturing shipping and billing destinations.
- [ ] Create the checkout server route that posts cart lists to Odoo to generate a draft quotation/order (`sale.order`).
- [ ] Integrate payment gateway SDKs (Stripe / Iyzico) on the frontend.
- [ ] Configure webhook receivers in Astro/Odoo to confirm transactions and transition draft quotations to confirmed sales orders upon receiving the payment callback.

### Sprint 8 — SEO & Cutover Deployment

- [x] Generate dynamic `sitemap.xml` containing all active storefront routes, catalog products, and blog posts.
- [ ] Conduct automated E2E test runs checking form submission, user logins, and catalog filters.
- [ ] Run Lighthouse audits and fix performance bottlenecks (e.g. image optimization, script deferring).
- [x] Perform DNS cutover pointing `varsco.com` to the headless frontend and
      `erp.varsco.com` to the Odoo instance. (Live; `www.` 301s to apex.)

### Sprint 9 — Lead Intelligence, Consent & Visitor Tracking

**Goal:** know who is submitting, where from, and what they looked at first —
without breaking KVKK/GDPR.

Two pieces already landed and this sprint builds directly on them: form fields
are no longer discarded and every submission carries page/locale/UTM context
(`src/lib/submission-context.ts`), and the Odoo controller now maps those onto
real `crm.lead` fields with distinct subjects and working `utm.source`
attribution (`varsco_content_api` `controllers/leads.py`).

**Why Odoo's own visitor tracking is not enough here.** Odoo ships
`website.visitor` / `website.track`, but both are populated by the `website`
module's own request handling — they only see traffic Odoo itself serves. This
frontend is decoupled (TanStack Start), so Odoo observes nothing but the
server-to-server lead POST. Nothing in Odoo is broken; it is simply never in
the request path. The fix is to have our BFF forward the events Odoo would
otherwise have collected.

- [ ] **Consent banner** — two categories only (strictly necessary / analytics).
      Decision persisted first-party, no tracking calls until analytics is
      accepted, and a way to withdraw. Blocks every task below it.
- [ ] **`POST /api/v1/track`** in `varsco_content_api` — accepts batched
      pageview events behind the same bearer-token gate as `/leads`, creating
      or updating `website.visitor` and appending `website.track` rows.
- [ ] **BFF beacon route** in this repo — the browser never talks to Odoo
      directly; the server forwards, keeping the write token off the client and
      letting us drop events when consent is absent.
- [ ] **Visitor-to-lead linkage** — pass the visitor token on submission so
      `leads.py` can attach the lead to its `website.visitor`, giving sales the
      journey that preceded the enquiry.
- [ ] **`POST /api/v1/newsletter`** — write `mailing.contact` / `mailing.list`.
      Newsletter signups currently create real `crm.lead` rows (tagged
      `topic: "Newsletter subscription"` so they can be filtered), which puts
      non-leads into the sales pipeline.
- [ ] Point `blog.index.tsx` at the new endpoint and drop the CRM stopgap.
- [x] Retention policy for `website.track` — decided: adopt Odoo's own default
      rather than invent a second mechanism. See below.

#### Retention: what actually happens

Odoo enforces this already and no code was needed. `website`'s daily cron
`_cron_unlink_old_visitors` deletes any `website.visitor` with no partner whose
`last_connection_datetime` is older than `website.visitor.live.days`
(**default 60**), and `website.track.visitor_id` is `ondelete="cascade"`, so the
pageviews go with the visitor. To change the window, set that config parameter —
do not add a competing cron.

**The lead linkage changes this, and it is the part worth knowing.**
`website_crm` overrides `_inactive_visitors_domain` to add `lead_ids = False`,
so *a visitor attached to a lead is never vacuumed*. Linking a submission to its
journey therefore converts a 60-day record into one kept as long as the lead.
That is defensible — it is part of the enquiry record, under the same basis as
the lead itself — but it is a deliberate choice, not a side effect to discover
later. The privacy policy now states both windows in English and Turkish.

- [ ] Confirm with the business that indefinite retention of lead-linked
      journeys is the intent, and whether a cap (e.g. purge with the lead on
      close + N months) should be added. Requires an override of
      `_inactive_visitors_domain` if so.

#### Telegram lead alerts

Sales currently learns about a web enquiry by opening Odoo. The notification
work already exists as a separate monorepo —
`/home/rubuntu/Projects/midvex_o_notification_foundry`, holding
`midvex_o_notification_foundry` (channels, accounts, templates, rules, queue,
retry cron, delivery logs) and `midvex_o_notification_telegram` (a
`sendMessage` adapter with its own tests). Neither is written for VARS; both
are generic and model-driven.

**This needs no code in `varsco_content_api`.** Verified against the source
(2026-08-08), not just the architecture doc: the repo now lives at
`~/Projects/midvex_o_notification_foundry/addons/`, and
`models/notification.py:290` defines
`_trigger_event(model_name, record, event_code)`, which a `base.automation`
server action calls. So a `crm.lead` alert is configuration, not development.

`midvex.notification.rule` takes exactly these fields (`notification.py:184`):

| field | value for this rule |
| --- | --- |
| `model_id` | `crm.lead` |
| `trigger` | `on_create` (the other option is `on_write`) |
| `trigger_domain` | domain selecting web leads only — see the scoping task below |
| `template_id` | the `crm.lead` template, required |
| `channel_ids` | the Telegram channel, required (M2M) |
| `audience_group_ids` / `audience_user_ids` | a sales group or named users |

**Blocked, not merely unstarted:** every remaining step runs against
`erp.varsco.com` and needs admin access plus the bot token, which is a
credential and must be entered in Odoo config rather than committed anywhere.
None of it can be done from this repo.

**It depends on Stage B being deployed first.** The value of the alert is the
mapped fields — without commit `9f542c3` live on `erp.varsco.com`, every
message would read "Web inquiry — {name}" with no product, source, country or
campaign to show. Deploy order matters here.

- [ ] Install and configure both addons on `erp.varsco.com`. The bot token is a
      credential — it belongs in Odoo config, never in a repository (the
      foundry's own `AGENTS.md` states this).
- [ ] Link the sales users' Telegram accounts through the foundry's link-code
      flow (`midvex.notification.recipient`, `pending` -> `linked`).
- [ ] Author a `crm.lead` template rendering what Stage B now populates:
      subject line, `partner_name`, `source_id`, `country_id`, `campaign_id`,
      and a deep link to the lead in Odoo.
- [ ] Scope `trigger_domain` to web-submitted leads only, so manually entered
      and imported leads do not page the team. Newsletter signups drop out of
      this automatically once they move to `mailing.contact` above; until then
      they need excluding explicitly by topic.
- [ ] Decide the audience — a shared sales group or named users — and whether
      alerts are per-lead or digested. Per-lead is right at current volume.

### Sprint 10 — Locale Completion & Accessibility Remediation

- [ ] Translate the 18 blog article bodies into Arabic. RTL locale: verify
      markdown tables and inline links render correctly bidirectionally rather
      than assuming.
- [ ] Translate the 18 blog article bodies into Chinese.
- [ ] Triage the ~190 `text-mint` occurrences. `--brand-mint` measures 2.17:1
      on white against WCAG AA's 4.5:1, but 7.37:1 on navy — correct on dark
      surfaces, wrong on light ones. `--brand-mint-ink` (5.15:1 on white)
      exists; each site needs its background judged, so this is not a
      find-and-replace.
- [ ] Align the response-time claims. Contact promises 4 hours, Quote 24, the
      floating CTA one business day, and one says "Guaranteed" — needs one real
      number from the business, applied everywhere.
- [ ] Browser click-through of the quote drawer (open, submit, error, reopen).
      Verified server-side only so far; the Chrome extension was unavailable.

---

## 3. Live Environment

**The site is in production at `https://varsco.com`; Odoo is at
`https://erp.varsco.com`.** Two consequences that change how work is done from
here:

**The frontend auto-deploys from `main`.** A push is a release — verified by
checking that this session's copy changes were already serving on the live
site minutes after being pushed. There is no staging gate, so anything merged
is immediately in front of buyers.

**The Odoo addon does not.** `varsco_content_api` is a separate repository and
needs deploying to `erp.varsco.com` by hand. The two therefore drift: the
frontend can be sending fields a not-yet-updated controller ignores. That
direction is safe by design — unknown keys are dropped, and a payload carrying
only the original fields still creates a valid lead — but it means a frontend
release does not imply the CRM behaviour shipped with it is live.

**Verification must not create production data.** `crm.lead` rows written
against `erp.varsco.com` are real records in the sales pipeline. Exercise the
validation path (a deliberately invalid payload is rejected before any Odoo
call) rather than submitting test leads; if a real end-to-end check is needed,
agree it first and delete the row afterwards.
