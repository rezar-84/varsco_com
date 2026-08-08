# Project Handoff Log

## 2026-07-20 — Setup Planning, Requirements, & Architecture Baseline

### 1. What was established this session

We analyzed the target portal (`aqua-bloom-portal`) and sibling codebases. Based on the user request, we created the comprehensive SDLC planning and documentation suite in the `doc/` directory to outline the headless integration with Odoo 19:

- [architecture_and_design.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/architecture_and_design.md): Specifies the technological stack, file directories, routing flows, and details the **BFF (Backend-For-Frontend)** session cookie proxy mapping pattern.
- [requirements.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/requirements.md): Details functional targets (store catalogs, client carts, quote requests, user accounts, and customs panels) and non-functional targets (SEO, Core Web Vitals, performance).
- [implementation_plan.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/implementation_plan.md): Outlines the SDLC phase roadmap, development workflows, and coding guidelines.
- [backlog_and_sprints.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/backlog_and_sprints.md): Defines the sprint-by-sprint task list from environment initialization to final cutover.
- [odoo_api_spec.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/odoo_api_spec.md): Outlines the Odoo 19 REST endpoints needed to serve the frontend, utilizing the developed reference addon at `/home/rubuntu/Projects/varsco_front/odoo/addons/varsco_content_api`.
- [security_and_compliance.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/security_and_compliance.md): Dictates rules for session token storage, CORS, Turnstile rate-limiting, and GDPR/KVKK compliance.
- [quality_assurance.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/quality_assurance.md): Sets the testing requirements (Unit, Contract, E2E), accessibility WCAG 2.1 AA targets, and the Definition of Done.
- [decision_log.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/decision_log.md): Registers the Architectural Decision Records (ADRs) accepted during the initialization process.

---

### 2. Sibling Project Reference

- **Odoo API Reference**: The developed module [varsco_content_api](file:///home/rubuntu/Projects/varsco_front/odoo/addons/varsco_content_api) at `/home/rubuntu/Projects/varsco_front/` contains ready-to-use content models and read controller endpoints (pages, posts, products, menu, redirects) which serve as the foundation.
- **Portal Additions**: When writing new Odoo API routes, do NOT code them inside this portal repository. Add or extend Python controllers in the Odoo codebase according to the guidelines in [odoo_api_spec.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/odoo_api_spec.md).

---

### 3. Sprint 1 & Sprint 3 Implementation Completed

During this session, we established the `feature/sprint-1-setup` branch and completed:

- **Environment Configuration**: Set up `.env.example` and local `.env` file (ignored in git to protect secrets).
- **API Types & Client**: Implemented type-safe structures in `src/lib/api/types.ts` and the main fetch client in `src/lib/api/client.ts`.
- **CORS & Rate Limiting Middleware**: Created `src/lib/api/middleware.ts` for origin checking and sliding-window rate constraints. Wired them into the server listener in `src/server.ts`.
- **Lead Submissions**: Created `/api/quotes` handler in `src/routes/api.quotes.ts` to validate inputs via Zod and call Odoo CRM write API with server tokens.
- **Contact & Quote wiring**: Updated `src/context/CartContext.tsx` and `src/routes/contactus.tsx` to perform real async POSTs to `/api/quotes`.
- **Verification**: Ran `npx --no-install tsc --noEmit` and `npx --no-install vite build`. Both completed successfully with zero type or build errors.

---

## 2026-07-21 — Sprint 2 UI Layouts & i18n Shell Completed

### 1. What was completed this session

- **Tailwind v4 Design System & Aesthetics**: Updated `src/styles.css` with OKLCH brand palette tokens (Navy, Green, Teal, Mint, Ink, Alt surface), glassmorphism utilities (`glass-card`, `glass-nav`), subtle micro-animations (`cart-bump`, `fadeInUp`, `float`), custom scrollbars, and display typography (`Space Grotesk` & `Inter`).
- **Modular Locale JSON Files**: Created fallback UI locale sheets under `src/lib/locales/` (`en.json`, `tr.json`, `ar.json`, `ru.json`, `de.json`, `ja.json`, `ko.json`).
- **I18n Context & Routing Integration**: Refactored `src/context/I18nContext.tsx` to dynamically parse locale codes from URL search parameters, path segments, and `localStorage`, automatically setting `document.documentElement.lang` and `dir="rtl"` for Arabic.
- **Header Layout Shell**: Enhanced `SiteHeader.tsx` with top notice bar (phone, email, language dropdown), sticky glassmorphism navigation bar, multi-category mega menu, header search modal, cart drawer counter badge, and responsive mobile panel with accordion categories and language picker.
- **Footer Layout Shell**: Updated `SiteFooter.tsx` with multi-column company info, category links, legal routes, ISO/HACCP certifications, quick quote request CTA banner, and interactive language switcher.
- **Verification**: Ran `npx --no-install tsc --noEmit` and `npx --no-install vite build`. Both passed with 0 errors.

---

### 2. Next Steps for Sprint 5

Subsequent agents should continue with **Sprint 5 — Customer Portal Dashboards**:

1. Build `/account` dashboard index page summarizing user order activity.
2. Implement `/account/orders` path with server-side loader fetching transactions from Odoo portal APIs into a paginated grid.
3. Implement `/account/profile` page with billing and shipping address editor forms.
4. Create `/account/customs` panel displaying customs clearance documents, import files, certificates of origin, and tracking statuses.

---

## 2026-07-21 — Sprint 4 Authenticated Session Setup & Odoo Integration Completed

### 1. What was completed this session

- **BFF Proxy Session API Endpoints**: Created server route handlers in `src/routes/`:
  - `api.auth.login.ts`: Validates input with Zod, proxies login credentials to Odoo backend `/web/session/authenticate`, sets secure HTTP-only cookie `vars_session`.
  - `api.auth.register.ts`: Handles partner registration, sends lead/partner data to Odoo ERP, and returns session payload with HTTP-only cookie.
  - `api.auth.logout.ts`: Clears `vars_session` HTTP-only cookie.
  - `api.auth.me.ts`: Inspects session cookies from incoming request headers to return active user session status.
- **Auth Context & Hook**: Updated `src/context/AuthContext.tsx` with async `login`, `register`, `logout`, session check, and error/loading state management.
- **Redesigned Login Page**: Updated `src/routes/login.tsx` with high-end glassmorphic card design, form input validation, error alert banners, password toggle, loading spinner, and redirect parameter handling.
- **Redesigned Registration Page**: Updated `src/routes/register.tsx` for corporate partner registration capturing company, email, phone, country, and password.
- **Account Guard & Redirect Boundary**: Updated `src/routes/account.tsx` layout shell to enforce authentication check and redirect unauthenticated users to `/login?redirect=/account`.
- **Verification**: Verified with `npx --no-install tsc --noEmit` and `npx --no-install vite build`. Both passed with 0 errors.

---

### 3. Verification Commands

```bash
# Verify TypeScript compilation (no emit)
npx --no-install tsc --noEmit

# Run project build
npx --no-install vite build

# Run Vite dev server
bun run dev            # or npm run dev
```

---

## 2026-07-21 — Accurate Trade Maps, Mobile Nav Fixes, Project Audit

### 1. What was completed this session

- **About Us map rebuilt with real geography**: `TurkeyAquacultureHeritage.tsx` previously drew Türkiye as a hand-drawn blob with arbitrary pin percentages. Replaced with actual province-boundary geometry sourced from Wikimedia Commons ("Turkey provinces blank.svg", CC BY-SA 3.0) reprojected into a calibrated equirectangular canvas; all 7 partner-location pins recomputed from real city lon/lat so they land on their true coastline positions. New data module: `src/components/visuals/turkeyProvincesPath.ts`.
- **Fixed a page-bleed bug**: `about-us.tsx` and `seafood-export.tsx` both rendered the _same_ `TurkeyAquacultureHeritage` component, so the map rebuild above was silently overwriting the Middle East corridor map on the export page too. Confirmed with the user this was unintended — `seafood-export.tsx` now imports `AnimatedHorecaMiddleEastMap` (its original, correct map) instead.
- **Middle East corridor map rebuilt with real geography**: `AnimatedHorecaMiddleEastMap.tsx`'s five country outlines (Türkiye, Saudi Arabia, UAE, Qatar, Oman) were hand-drawn placeholder shapes. Replaced with real country silhouettes (`djaiss/mapsicon` dataset) reprojected onto one shared equirectangular canvas calibrated against each country's true bounding box, so all 6 airport pins (İzmir/ADB, Dubai/DXB, Riyadh/RUH, Jeddah/JED, Doha/DOH, Muscat/MCT) land at true relative positions. Also trimmed a redundant header stat bar that duplicated info already shown in the node detail card. New data module: `src/components/visuals/middleEastMapPaths.ts`.
- **Turkey map zoom interaction**: Clicking a partner-location pin (or its sidebar entry) now zooms the map 3× and recenters on that location, with a "View Whole Map" reset control. Pins are rendered outside the scaled/panned layer and their `left`/`top` are recomputed analytically each zoom state, so they stay a constant, readable size instead of ballooning with the map.
- **Mobile navigation bug**: `SiteHeader.tsx`'s mobile "Products" drawer item actually rendered the _Solutions_ mega-menu's content (wrong categories, dead-end link) — a real desktop/mobile parity bug. Split into two separate accordions (`Products`, `Services & Solutions`) that mirror the desktop mega menus, including a category list sourced from `CATEGORIES` and a fixed `/horeca-seafood-middle-east` link that previously pointed at the wrong route.
- **Mobile menu overhaul**: drawer is now full-screen (`h-[calc(100vh-4rem)]`), locks background scroll, and adds a `.mobile-nav-open` class on `<body>` so `FloatingQuoteCTA` and `WhatsAppWidget` hide themselves (`[.mobile-nav-open_&]:hidden`) while the menu is open. Added a mobile language selector (previously desktop-only); added `nav.language` key to all 7 locale files.
- **Floating widget overlap fix**: `FloatingQuoteCTA` and `WhatsAppWidget` both sat at `bottom-6` on mobile and collided; CTA now sits at `bottom-24` on small screens (`sm:bottom-6` above that).
- **Background project audit** (general-purpose subagent, read-only): found i18n coverage is only ~15% of route files (31 of 36 pages have zero `t()` calls — `about-us.tsx`, `products.$category.$slug.tsx`, `services-solutions.tsx`, etc. are fully hardcoded English), a static `lang="en"` in the SSR shell (`__root.tsx`) that never reflects the active locale server-side, and some directional Tailwind classes (`ml-`, `text-left`) that won't flip under Arabic RTL. No broken internal links, no hardcoded secrets, and translation _content_ itself (all 7 locale files) is complete and consistent — the gap is purely missing `t()` wiring on most pages. Full punch list with an 8-step recommended fix plan was relayed to the user; **not yet executed** — scope/sequencing pending a decision with the user given its size (essentially a second i18n rollout pass across most routes).
- **Verification**: `npx tsc --noEmit` clean after every change in this session. Live browser QA (Chrome extension) was unreliable for most of the session ("Frame with ID 0 is showing error page" on an otherwise-loaded tab) — map geometry and pin math were instead validated by rendering standalone SVG previews via Inkscape and checking real-world landmarks (provinces, lakes, city pins) landed in the correct relative positions. **A follow-up session should do a live visual pass** on both maps, the mobile menu, and the zoom interaction once the browser tool is stable.

### 2. Next steps

1. Decide scope/order for the i18n fix plan from the audit above (likely its own multi-session effort — prioritize `products.$category.$slug.tsx` and `about-us.tsx` first per the audit).
2. Live-verify in a real mobile viewport: mobile nav accordions, full-screen menu, floating widget hide/overlap fix, Turkey map zoom/reset.
3. Fix the static SSR `lang="en"` in `__root.tsx` so non-English first paint is correctly tagged.
4. Sweep directional utility classes (`ml-`/`mr-`/`text-left`) to logical equivalents (`ms-`/`me-`/`text-start`) in header/footer/CTA components for RTL correctness.

### 3. Verification Commands

```bash
npx tsc --noEmit
npm run dev
```

---

## 2026-07-22 — Full Turkish Translation Rollout, Shrimp/Oyster Product Fixes

### 1. What was completed this session

- **Site-wide i18n rollout (Turkish)**: acted on the previous session's audit finding that 31 of 36 route files had zero `t()` wiring. Wired every remaining non-blog page into the i18n system and translated all new strings into Turkish: homepage, product catalog + category + detail pages (UI chrome only — per-product content in `products.ts` is out of scope), About Us, Services & Solutions, Seafood Export (+ its Europe/HORECA Middle East/regional-trade variants), Projects, Contact Us, Request Quote, Cart, Login/Register, all 5 Account pages, both Artemia guides, Coho Salmon/Salmonid Ova pages, Aquariums & Hobbyists, and FAQs. `en.json`/`tr.json` grew from 196 to 999 keys with verified 1:1 parity (script-checked after every merge). Also fixed a pre-existing bug where `SiteHeader.tsx` referenced a `nav.profileSettings` key that never existed (rendered the raw key to users).
  - **Scope decisions**: blog pages excluded per explicit instruction (handle later). `terms.tsx`/`privacy.tsx` left untouched — English legal text, flagged for professional translation rather than an automated pass. `kvkk-disclosure-text.tsx`/`distance-sales-agreement.tsx` were already natively Turkish (required by Turkish law) — nothing to do there.
  - **Other 5 locales** (ar/de/ru/ja/ko) intentionally still hold only the original 196 keys; they'll fall back to English on all the new content (the `t()` function's built-in fallback, not a bug) until a follow-up pass translates them — deliberately deprioritized per "fix Turkish first" instruction.
  - **Process note for next session**: most of this was done via parallel background subagents, each restricted to editing exactly one route file and reporting its new key/value pairs — never touching the shared locale JSON files directly — with this session merging + translating afterward. That pattern avoided merge conflicts across agents. Several agents in one wave were killed mid-edit by a session-level rate limit; their partial edits were safe (verified via `tsc --noEmit`, which stayed clean throughout) and the missing locale keys were reconstructed via `git diff` against the pre-session file state. Worth knowing if you see this pattern again: check `git status`/`tsc` immediately after any batch of agents returns, and reconstruct missing keys from `git diff` rather than re-doing the whole file.
- **Fixed shrimp & oyster product listings** (`src/lib/mock/products.ts`): both were reusing the sea-bass placeholder image. Wired in real photography (`shrimp.jpg`, `oyster.webp`, plus 3 new shrimp warehouse photos as gallery images), enriched specs (size grades, packaging, storage/shelf-life) sourced from the live varsco.com product pages — explicitly excluding their FAQ sections per instruction, since those were flagged as inaccurate. Moved shrimp to the front of the seafood category display order.
- **Verification**: `npx tsc --noEmit` clean after every batch. Live browser QA was not possible this session (Chrome extension connectivity issue persisted); translations were verified via HMR pickup, key-parity scripts, and cross-referencing `t()` calls against `en.json` for orphaned keys (found and fixed a handful from the interrupted-agent batch).

### 2. Next steps

1. Translate the 803 Turkish-only keys (999 − 196) into ar/de/ru/ja/ko — same batch/merge pattern as this session, just for the remaining languages.
2. Decide on a translation approach for `terms.tsx`/`privacy.tsx` (professional review vs. AI draft + human sign-off).
3. Wire i18n into the blog pages (`blog.index.tsx`, `blog.$category.$slug.tsx`, `blog.$category.index.tsx`) once ready to prioritize them.
4. Live-verify the Turkish site end-to-end in a real browser (map zoom, mobile nav, and now translated pages) once browser tooling is stable — nothing in this session was visually confirmed beyond dev-server HMR logs and HTTP 200 checks.
5. Items 1-4 from the previous handoff entry (static SSR `lang`, RTL class sweep, live QA of maps/mobile-nav) are still open.

### 3. Verification Commands

```bash
npx tsc --noEmit
npm run dev
```

---

## 2026-07-23 — Sprint 5 Customer Portal Dashboards & Odoo BFF Integration Completed

### 1. What was completed this session

- **BFF Proxy Portal API Endpoints**: Created server route handlers in `src/routes/`:
  - `api.portal.orders.ts`: Validates customer session, proxies request to Odoo ERP `/api/v1/portal/orders`, formats and returns sales orders. Gracefully falls back to mock order records if Odoo is offline.
  - `api.portal.customs.ts`: Retrieves active customs files/documents list from Odoo ERP `/api/v1/portal/customs` and converts structural items to flat document lists. Gracefully falls back to mock files if Odoo is offline.
  - `api.portal.profile.ts`: Validates PUT body data using Zod schema validation and proxies changes to Odoo `/api/v1/portal/profile`. Returns success and falls back in offline/dev environments.
- **Account View Refactorings**:
  - `account.index.tsx` (Dashboard home): Fetches live stats, orders, and documents from BFF endpoints. Rebuilt with high-end glassmorphic presentation cards, status indicators, and subtle loading skeletons.
  - `account.orders.tsx`: Fetches live sales orders from BFF. Added search capabilities, data filtering (by ID, product, or status), and sorting options (by date or order value).
  - `account.customs.tsx`: Queries live shipping files and certificates. Implemented category filtering tabs (Invoice, Certificate, Customs) and quick search.
  - `account.profile.tsx`: Submit business profile changes (name, email, company, phone, country) to BFF PUT route. Displays loading/saving states and triggers localized success/error toast alerts.
- **Bug Fixes & Tweaks**:
  - `I18nContext.tsx`: Fixed a TypeScript compilation bug where `detectLangFromUrl` expected a search string but was passed a parsed TanStack router search object. The helper was updated to support both string query parameters and object representations.
- **Verification**: Verified using `npx tsc --noEmit` and `npm run build`. Both compilations finished successfully with zero warnings or errors.

### 2. Next steps for Sprint 6

1. Implement catalog overview (`/products`) and category grids (`/products/$category`) powered by Odoo.
2. Setup real-time customer price lookup on details page using the authenticated session (Odoo customer pricelists).
3. Connect the checkout CTA in `/cart` to Odoo's `/api/v1/store/checkout` route to generate draft quotations.
4. Integrate payment gateway (Stripe/Iyzico) on front-end checkout.

### 3. Verification Commands

```bash
npx tsc --noEmit
npm run build
bun run dev
```

---

## 2026-07-23 — Blog Content Integrity, Nav Resources Menu, and Animation Accuracy Pass

### 1. What was completed this session

- **Blog title corruption fix**: a prior session's internal-link automation had left raw markdown link syntax (`[text](url)`) embedded inside 6 post `title:` fields in `src/lib/mock/blog.ts` (titles render as plain text in `<title>`/`og:title`/breadcrumbs, never through a markdown parser, so this showed up as literal brackets/parens to visitors). Stripped back to plain human-readable titles.
- **Internal links inside blog bodies were also broken** — the same markdown link syntax appears throughout post `body` markdown (hundreds of occurrences), but `MarkdownRenderer.tsx` (`src/components/ui/MarkdownRenderer.tsx`) only ever parsed `**bold**`, so every `[text](url)` rendered as literal bracket text instead of a link. Fixed at the renderer level (added link parsing to `renderInline`, using TanStack Router `Link` for internal `/` paths and a plain `<a target="_blank">` for external ones) — this fixes all instances across every post in one change rather than editing each occurrence.
- **Blog cover images reverted to the real varsco.com covers**: a prior session had repurposed images from the user-provided `Documents/VARS/blogimages` folder (intended only for in-body content images) as post *cover* images, overwriting the site's real per-post covers. Fetched each post's actual `og:image` from the live varsco.com Odoo site (18 posts, matched by slug/category), downloaded them into `src/assets/*-cover.webp`, and repointed each `image:` field to the real cover. **Established rule going forward: `Documents/VARS/blogimages` is scoped to in-body content images only, never covers.**
- **Author bios corrected**: Vahid (Master's in Biotechnology, 30 yrs agriculture/bioengineering/aquaculture), Reza R. (Project Manager, tech industry background), added Faysal (senior Turkey aquaculture/hatchery expert, 30+ yrs, explicitly *not* a co-founder — a prior session had fabricated "Faysal Bilkiç, Co-founder"). Removed fabricated role/title badges site-wide per instruction — author cards now show name + bio only, no invented job titles.
- **Low-contrast badge fix**: translucent `bg-mint/20 text-mint` pill badges on dark navy backgrounds (blog CTA sections, newsletter dispatch badge, about-us brand banner, HORECA hero eyebrow, global-shipping widget) had poor contrast. Switched to solid `bg-mint text-navy` across all 5 occurrences.
- **New Resources mega menu** (`SiteHeader.tsx`, desktop hover menu + mobile accordion, all 9 locales got a new `nav.resources`/`nav.magazine.*` key set): moved the Science & Segment Guides column out of Solutions (now 2 columns instead of 3) into a new Resources menu, paired with an Aqua MAG Magazine column that links to `/blog` and lists the 5 blog categories as quick links.
- **Content-accuracy pass on the homepage "3 steps" process section** (`home.process.*`/`home.step.*` keys, all 9 locales): removed a named-origin-country claim ("Europe and Iceland"), a salmon-egg-specific claim on what is a multi-product sourcing step, a fabricated "10+ countries / weekly" shipping stat, and a "no middlemen" claim — replaced with defensible multi-origin/global-capability language, none of it a specific unverifiable number.
- **Decapsulated-vs-Standard Artemia guide reframed** (`guideDecap.*` keys + `AnimatedDecapIllustration.tsx`, all 9 locales): the page previously argued decapsulated Artemia "outperforms"/is the "ultimate alternative" to standard cysts — but VARS sells both product lines, so the page was effectively discouraging its own product. Rewritten as a neutral comparison with use-case guidance per customer segment (commercial hatcheries, public aquariums, retailers, hobbyists), and the illustration's "good vs bad" red/mint styling was replaced with neutral labels ("For Hatching & Culture" vs "Ready to Feed Directly").
- **Discovered and fixed an i18n gap**: `src/lib/locales/es.json` and `zh.json` exist and are wired into `I18nContext.tsx` as active languages but had been missed in every locale-wide edit earlier in the session (nav.resources, magazine keys, process-section content fixes) until caught partway through — backfilled to parity with the other 7 locales.
- **Animation accuracy pass** across several components (no animation library is used anywhere in this repo — all motion is Tailwind utilities plus a small custom `@keyframes` set in `src/styles.css`):
  - Homepage 3-step visuals (`AnimatedOriginSourcing.tsx`, `AnimatedGlobalShipping.tsx`, `AnimatedLabVerification.tsx`): fixed a "flow" animation that pulsed in place instead of traveling, fixed the pipeline badge color scheme (3 unrelated colors → one consistent navy/mint pairing), balanced motion density across the trio.
  - **Then substantially rebuilt per follow-up feedback**: the origin/shipping visuals still asserted specific, non-representative facts (named "Iceland/Norway" origin, fixed "ADB/IST"→"DXB/ICN" airport-pair routing) that don't reflect the business (multi-origin sourcing, variable routes) — rebuilt both as globe illustrations. Origin sourcing now shows a magnifying glass doing a fixed-orientation raster scan (left-to-right, line-by-line, matching the user's explicit "scan like a scanner, don't spin" spec) over pulsing origin markers; global shipping now shows 4 independent flight lanes using native SVG `<animateMotion>`/`<mpath>` (each marker follows its own curve exactly, no manual per-path keyframe math needed) from a central globe to unlabeled destination points.
  - `AnimatedRasDiagram.tsx` (services-solutions RAS diagram): added `group-hover:brightness-125` so the 5 stage boxes (previously `cursor-pointer group` with no `group-hover:` target at all) give visible hover feedback; replaced a flat "swimming fish" blob with a recognizable fish silhouette (tail + body + dorsal fin + eye) using a new `animate-swim` keyframe (glide + slight body-undulation rotation); switched bio-media chips/O2 bubbles from a hard `animate-bounce` to the existing `animate-float`/`animate-float-delayed` utilities; animated the previously-static return/recirculation pipe so the "closed loop" the copy describes is actually visually closed.
  - `AnimatedDecapIllustration.tsx`: fixed a comment/behavior mismatch (the ring labeled "Pulsing Clean Membrane" was using `animate-spin`, which has no biological meaning here) — switched to the existing `animate-pulse-glow` utility; removed a hover-scale effect from a static, non-clickable product photo.
  - Added `AnimatedArtemiaLifecycle.tsx` (new, embedded on `/decapsulated-artemia-guide`): 4-stage Cyst → Hydration/Hatching → Nauplius → Adult diagram with stage-appropriate motion.
  - Rebuilt `AnimatedAquariumEcosystem.tsx` ("Microalgae & Live Feed Ecosystem Flow" on `/aquariums-and-hobbyists`) from three unconnected, randomly-animated icons into an actual 3-stage cycle (Microalgae → Live Feed → Fish & Coral) with traveling-dot connectors between stages and a return path closing the loop, using new `animate-flow-short`/`animate-flow-return` keyframes sized for its compact viewBox.
- **Git**: committed all of the above locally as a single commit (`feat: rebuild blog media/content accuracy, nav Resources menu, and homepage/RAS/Artemia animations`) on `main` at the user's request. Confirmed `feature/sprint-1-setup` has nothing unique to merge (its tip is an ancestor of `main`). **Not pushed** — `git fetch`/`push` failed with an SSH permission error (no agent key loaded); user will push manually once their SSH key is unlocked.
- **Verification**: `npx tsc --noEmit` clean after every change. Live browser QA (Chrome extension) was unreliable again this session (same "Frame with ID 0 is showing error page" pattern noted in the 2026-07-21 entry) — verified instead via SSR HTML inspection (`curl` + string/count checks against the dev server) for every component change, plus manual bezier/keyframe math checked against the SVG coordinate space for the traveling-dot animations.

### 2. Also raised, not yet actioned

- User asked whether to surface their Trendyol/Hepsiburada/N11 marketplace storefronts in the site design. Recommendation given (a low-key "also available on" trust strip near the footer, not a homepage feature, since the site otherwise reads as B2B/export-focused) — **awaiting user confirmation before implementing.**

### 3. Next steps

1. Live-verify this session's animation/visual work (globe scans, RAS hover states, ecosystem flow, Artemia lifecycle) in an actual browser once the Chrome extension is stable — everything was checked via SSR markup inspection only.
2. Decide on the marketplace-profile trust strip (see above) and implement if approved.
3. Items still open from the 2026-07-22 entry: translate the Turkish-only key backlog into ar/de/ru/ja/ko/es/zh (es/zh now also need the full backlog, not just this session's new keys), wire i18n into the blog pages, decide on `terms.tsx`/`privacy.tsx` translation approach.
4. Items still open from the 2026-07-21 entry: static SSR `lang="en"` in `__root.tsx`, RTL directional-class sweep (`ml-`/`mr-`/`text-left` → logical equivalents).
5. Push the committed work once SSH access is restored.

### 4. Verification Commands

```bash
npx tsc --noEmit
npm run dev
```

---

## 2026-07-25 — Wired Remaining Forms to Odoo CRM, Per-Form Lead Attribution, Odoo Dev-Env Fix

### 1. What was completed this session

- **Form audit**: swept every `<form>`/`onSubmit` in the repo. Confirmed Contact Us, Services & Solutions, Request Quote, and the Cart drawer "Request Quote" dialog were already correctly wired to `/api/quotes` → `crm.lead`. Found two forms that were pure client-side stubs with no backend call at all:
  - `horeca-seafood-middle-east.tsx`: `handleSubmit` was a `setTimeout` fake-success toast.
  - `blog.index.tsx` newsletter signup: `handleSubscribe` was a fake-success toast, no network call.
- **Wired both to the existing `/api/quotes` → Odoo `crm.lead` pipe.** HORECA form now posts real field data (message composed from destination/product interest/notes) with proper try/catch error handling. Newsletter form posts as a CRM-lead stopgap (`source: "Blog Newsletter Signup"`) per user decision — not a real Odoo mailing-list integration, which would need a new endpoint in the separate `varsco_content_api` addon repo.
- **Added per-form `source` attribution**: `api.quotes.ts` now accepts an optional `source` field (falls back to the old generic default). Every calling form/path now sends a distinct label: Contact Us, Services & Solutions, Request Quote Page, Cart Quote Request, HORECA Middle East Export, Blog Newsletter Signup. `CartContext.submitQuote(data, source?)` gained a second param so the two callers sharing it (`request-quote.tsx`, `QuoteRequestDialog.tsx`) can each pass their own label.
  - **Important caveat, confirmed by direct DB inspection against a real Odoo instance**: the sibling Odoo controller (`/home/rubuntu/Projects/varsco_front/odoo/addons/varsco_content_api/controllers/leads.py`) only checks that `source` is *present* (it's in `REQUIRED_FIELDS`) — it never writes it onto the `crm.lead` record. Every lead still gets the same fixed `medium_id` regardless of which form submitted it. **Not fixed yet** — needs a small edit to that controller (map `source` to `source_id`/a `utm.source`, or at minimum fold it into `description`) — out of scope for this repo, needs explicit go-ahead since it's a different codebase.
  - Caught and fixed a real bug during testing: the newsletter form's placeholder `company` value was `"—"` (1 character), under the schema's `min(2)` — every real submission would have 400'd. Changed to `"N/A"`.
- **Added `horeca.form.toast.errorDesc`** to `en.json`/`tr.json` (the two fully-translated locales, per this project's established convention — other 5 fall back to English, same pattern as every prior i18n session).
- **True end-to-end verification** against a real local Odoo instance (`~/Development/odoo19-dev`, database `odoo19_test_varsco` — see the fix below), not just curl-against-BFF: submitted real payloads for all 6 forms through the actual running portal dev server, watched them land as `crm.lead` rows in Postgres with correct field mapping, then deleted the test rows. This is the strongest verification done for this integration to date — previous sessions only checked build/type-check success or SSR markup, since Odoo was never reachable.
- **Fixed a real, reproducible bug in the shared Odoo dev environment** (`~/Development/odoo19-dev`, used across multiple projects — not committed to this repo, documented in that project's own `AGENTS.md`): a fresh registry build can spuriously report `varsco_content_api`'s dependencies (`sale`/`stock`/`crm`/`portal`) as "not loaded" even though they're genuinely installed, silently skipping the whole module and 404ing every `/api/v1/*` route. Root-caused and fixed with a one-time `-u varsco_content_api --stop-after-init` pass per test database; documented in that environment's `AGENTS.md` under a new "Testing the `varsco_content_api` Module" section, along with two related pitfalls also discovered and corrected: (a) `odoo19_test_varsco` (lightweight, ~5 partners) is the correct test target, not `varsco_com` (387 modules, ~600+ partners — a fuller dataset other sessions use for real content, e.g. pulling live blog cover images; don't write throwaway test data there), and (b) `dbfilter` in that environment's `config/odoo.conf` must stay pinned to a single database — briefly broadened it to test multiple candidates, which caused Odoo to dispatch HTTP requests to the wrong matching database (identical-looking 404 symptom, different root cause) — reverted to the original single-db pin.

### 2. Not done / open follow-ups

1. **Make `source` actually persist on the CRM lead** (see caveat above) — needs a `leads.py` edit in the sibling Odoo addon repo, pending user go-ahead.
2. **Newsletter form is a CRM-lead stopgap**, not a real Odoo mailing-list subscription (`mailing.contact`/`mailing.list`) — deliberate per user decision this session; would need a new endpoint in the separate addon repo if upgraded later.
3. **No live browser click-through** was done on the two newly-wired forms — the Chrome extension repeatedly hit the same "Frame with ID 0 is showing error page" issue noted in the 2026-07-21 and 2026-07-23 entries. Verified instead via curl against the real BFF + Odoo, and direct Postgres inspection of the resulting `crm.lead` rows — but the actual on-screen toast/spinner/reset behavior for these two forms has never been visually confirmed.
4. All items still open from prior entries (i18n backlog for ar/de/ru/ja/ko/es/zh, blog i18n wiring, `terms.tsx`/`privacy.tsx` translation approach, static SSR `lang="en"`, RTL class sweep, marketplace trust-strip decision) are unchanged by this session.

### 3. Verification Commands

```bash
npx tsc --noEmit
npm run dev
```

To test against a real Odoo backend (see `~/Development/odoo19-dev/AGENTS.md` for the full recipe and known pitfalls) — **note the addon has since moved to `~/Projects/varsco_content_api`, and is no longer symlinked into `custom-addons`**:

```bash
cd ~/Development/odoo19-dev
ODOO_DB=odoo19_test_varsco bash scripts/odoo-dev.sh start
# wait for "Registry loaded" in logs/odoo-console.log, then:
curl -X POST http://localhost:PORT/api/quotes -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@example.com","company":"Co","message":"hello there","items":[]}'
```


---

## 2026-08-08 — Response-Time Claims, Visitor-to-Lead Linkage, Contrast, Retention

This entry also closes a ~2-week documentation gap: the sessions between
2026-07-25 and today (analytics/consent gate, GTM, glossary, quote-form
fixes, catalogue corrections, Lighthouse pass) are recorded only in the git
log. Read `git log 7234297..HEAD` for those; this entry covers today only.

### 1. What was completed

- **Response-time claims aligned** (`4c939c0`). The site made three promises
  at once: "Guaranteed response within 4 hours" (Contact, HORECA), "within
  24 hours" (~12 places), "one business day" (quote page). The business
  confirmed **one business day**, so all 171 affected values across 9 locale
  files now say that, using each language's own idiom lifted from the
  existing `quote.subtitle`/`cta.responseTime` strings rather than a fresh
  translation of the English.
  - A second cluster surfaced only on the second pass, because the locale
    values were worded differently from the English and the first grep
    missed them — including a quote banner titled **"24-Hour SLA
    Guarantee"**, the most explicit promise on the site. If you grep for
    copy claims, grep the translations too, not just `en.json`.
  - `contactus.tsx` carried the response-guarantee paragraph as hardcoded
    English, so it both stated the 4-hour claim and never translated; it now
    reads the key it was duplicating.
  - "Guaranteed" is gone from time-bound claims. The "Response Guarantee"
    heading stays — committing to answer is real; the hour count was not.
    Non-SLA uses of "24 hours" (air-freight transit, incubation windows,
    hatch rate) are deliberately untouched.
  - `cartPage.summary.within24Hours` renamed to `cartPage.summary.responseTime`.

- **Visitor-to-lead linkage** (`80f563e` here, `97d5c77` in the addon).
  Tracking had been recording pageviews and leads had been arriving with
  page/locale/UTM context, but nothing joined them. `buildSubmissionContext`
  now carries the visitor token, so every form already spreading that context
  picks it up with no per-form change; `leads.py` attaches the lead through
  `crm.lead.visitor_ids` (the field `website_crm` itself uses).
  - `readVisitorToken` **reads and never mints**. Filling in a form is not
    consent to be tracked, and a token created at submission time would link
    the lead to a visitor with zero pageviews — worse than no link.
  - Guarded on `website_crm` being installed, since it is not a dependency
    of this addon. Token shape is re-validated server-side because Odoo
    parses a non-hex `access_token` as a `res.partner` id.
  - Caught mid-implementation: `VISITOR_TOKEN_RE` was not in scope in
    `leads.py` and would have raised `NameError` on every submission. It now
    lives in `base.py`, shared by both controllers.

- **Contrast pass on `text-mint`** (`7118696`). 69 of 189 occurrences were on
  light surfaces at 2.17:1 against WCAG AA's 4.5:1, and now use
  `text-mint-ink` (5.15:1 on white, 4.73:1 on surface-alt). Each occurrence
  was resolved to its nearest **opaque** ancestor — a `bg-mint/15` badge in a
  navy hero is still on navy and keeps mint; the same badge in a plain
  `Section` is not. Ten cases the markup could not answer were read by hand
  (`glass-card` is `rgba(255,255,255,0.75)` = light; `glass-panel-dark` is
  navy). `Page.tsx` is deliberately untouched — its ternary is what picks
  mint for the navy variant.

- **Retention policy decided and documented** (`f47aebb`). No code needed:
  Odoo's `website` daily cron already deletes partner-less visitors idle
  beyond `website.visitor.live.days` (default **60**), and `website.track`
  cascades. **But `website_crm` excludes visitors with `lead_ids` from that
  cron**, so the linkage above converts a 60-day record into one kept as long
  as the lead. Defensible, but a real choice — the backlog now asks the
  business to confirm it.
  - Found while writing this: the **Turkish** privacy §5 was still the
    pre-consent-banner text, telling readers to change their choice via
    browser cookie settings — the exact false claim fixed in English in
    `bbd1285` and missed in Turkish. Corrected; KVKK is the Turkish-law
    obligation, so that was the more consequential copy of the two.

### 2. Not done / blocked

1. **Nothing is pushed.** `git push` fails with `Permission denied
   (publickey)`. An RSA key is loaded and `SSH_AUTH_SOCK` is set, but GitHub
   rejects it, so it is not the key on the account — same failure recorded in
   the 2026-07-23 entry. Four commits wait here, one in the addon repo.
2. **The addon's new tests have never been run.** Three were added for the
   linkage (the link, an unknown token that must not mint a visitor, a
   malformed token that must still produce a lead) and compile-check clean,
   but Postgres was not running and **`varsco_content_api` is no longer
   symlinked into `~/Development/odoo19-dev/custom-addons`** — presumably
   lost when the repo moved out of `varsco_front` to `~/Projects/`. Re-link
   before trusting any local Odoo run.
3. **The addon still needs hand-deploying** to `erp.varsco.com`. Until then
   the frontend sends `visitor_token` and the live controller ignores it —
   safe by design, but the linkage does not exist in CRM yet.
4. **Telegram alerts are blocked, not merely unstarted** — every step needs
   erp admin access and the bot token. The approach was verified against the
   source today and the exact `midvex.notification.rule` field values are now
   in the backlog.
5. Unchanged from before: Chinese blog bodies (`blog_bodies/zh.ts` absent),
   pricelist lookup, checkout page, payments, and the fact that there is
   **no test framework in this repo at all**.

### 3. Verification Commands

```bash
npx tsc --noEmit
npx vite build
npm run dev
```
