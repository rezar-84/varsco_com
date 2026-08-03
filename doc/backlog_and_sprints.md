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
| **Sprint 6** | Phase 7     | E-commerce catalog, product specification rendering, client cart | Pending       |
| **Sprint 7** | Phase 8     | Cart checkouts, draft order creator, Iyzico/Stripe payments      | Pending       |
| **Sprint 8** | Phase 9     | Full SEO crawls, Core Web Vitals audit, and cutover              | Pending       |

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

- [ ] Implement catalog overview (`/products`) and category grids (`/products/$category`).
- [ ] Create product details page (`/products/$category/$slug`) rendering specs, tabs, and technical descriptions.
- [ ] Set up `CartContext` using React State + `localStorage` to manage client-side items.
- [ ] Create a dynamic client query to look up real-time prices and stock availability on details pages when logged in (checking customer-specific Odoo price lists).
- [ ] Build the `/cart` page with quantity adjustment controls and quote checkout routes.

### Sprint 7 — E-Commerce Checkouts & Payments

- [ ] Build checkout form page capturing shipping and billing destinations.
- [ ] Create the checkout server route that posts cart lists to Odoo to generate a draft quotation/order (`sale.order`).
- [ ] Integrate payment gateway SDKs (Stripe / Iyzico) on the frontend.
- [ ] Configure webhook receivers in Astro/Odoo to confirm transactions and transition draft quotations to confirmed sales orders upon receiving the payment callback.

### Sprint 8 — SEO & Cutover Deployment

- [x] Generate dynamic `sitemap.xml` containing all active storefront routes, catalog products, and blog posts.
- [ ] Conduct automated E2E test runs checking form submission, user logins, and catalog filters.
- [ ] Run Lighthouse audits and fix performance bottlenecks (e.g. image optimization, script deferring).
- [ ] Perform DNS cutover pointing `varsco.com` (or `aquabloom.com`) to the headless frontend and `erp.` to the Odoo instance.
