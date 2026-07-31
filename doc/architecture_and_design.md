# Aqua Bloom Portal - Software Architecture & UI Design System

**Role**: Lead Software Architect & UI Developer

---

## 1. Technological Stack

The Aqua Bloom Portal is a headless B2B web application designed to render fast, support dynamic client features, and integrate securely with Odoo 19.

- **Core Framework**: **TanStack Start** (React 19 + Vite 8). Resolves the complexity of mixing Static Site Generation (SSG) with Server-Side Rendering (SSR) for authenticated pages (portal panels, accounts).
- **Styling**: **Tailwind CSS v4** (packaged with Vite CSS compilers) for a responsive design system.
- **Routing**: **TanStack Router** with file-based routing and strict type safety.
- **Data Fetching & Hydration**: **TanStack Query v5** for caching, optimistic updates, and client-side page state.
- **Backend ERP**: **Odoo 19** as the system of record.
- **BFF (Backend-For-Frontend)**: Astro/Start server functions act as a secure proxy API layer to communicate with Odoo, avoiding direct browser-to-ERP requests.
- **Language & Types**: Strict TypeScript (`tsconfig.json`).

---

## 2. Headless Integration Architecture (The BFF Proxy Pattern)

To support CRM leads, authenticated user logins, custom portal panels, and store checkout without CORS errors or cookie isolation issues, we use the **BFF (Backend-For-Frontend) Proxy Pattern**.

```
   ┌─────────────────────────────────────────────────────────────┐
   │                       CLIENT BROWSER                        │
   │  ┌───────────────────────┐       ┌───────────────────────┐  │
   │  │   Static storefront   │       │  Dynamic React Islands│  │
   │  │   (SSG, cached HTML)  │       │  (Portal/Cart/Forms)  │  │
   │  └───────────┬───────────┘       └───────────┬───────────┘  │
   └──────────────┼───────────────────────────────┼──────────────┘
                  │ Web Requests                  │ Client-side JSON API
                  ▼                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                    TANSTACK START (BFF)                     │
   │  ┌───────────────────────┐       ┌───────────────────────┐  │
   │  │   Edge CDN Caching    │       │ Server API Functions  │  │
   │  │   (Vite / Nitro)      │       │ (Validate, Map Session)│ │
   │  └───────────────────────┘       └───────────┬───────────┘  │
   └──────────────────────────────────────────────┼──────────────┘
                                                  │ Auth Header Token
                                                  │ or Session Cookie
                                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                       ODOO 19 BACKEND                       │
   │  ┌───────────────────────────────────────────────────────┐  │
   │  │         `varsco_content_api` (Reference Addon)        │  │
   │  │  - Public Catalog (Read-Only)  - Auth Portal (user)   │  │
   │  │  - Leads submission (token)    - Store checkout       │  │
   │  └───────────────────────────────────────────────────────┘  │
   └─────────────────────────────────────────────────────────────┘
```

### Integration Flow Mechanisms

1. **CRM Leads**: Client-side submit ──► Astro/Start Server Route (validates email, filters inputs, blocks spam) ──► Odoo REST endpoint `/api/v1/leads` (authenticated via a server-to-server header token).
2. **User Authentication**: Client credentials ──► Start Server function ──► Odoo `/web/session/authenticate` (obtains Odoo session ID) ──► Astro/Start sets a secure, HTTP-only, SameSite=Strict cookie containing the session token in the client browser.
3. **Portal Dashboard**: Browser sends mapped HTTP-only cookie ──► Start Server function (extracts session ID) ──► Odoo authenticated portal endpoints (queries data on behalf of the user using session security).
4. **Checkout & Shop**: Local client-side cart ──► Start Server function (validates prices and inventory with Odoo) ──► Odoo draft order creation (`sale.order`) ──► Payment provider redirects (Stripe/Iyzico) ──► Webhook IPN updates Odoo state.

---

## 3. Directory Layout & Routing Architecture

### 📂 Codebase Directory Layout

```text
aqua-bloom-portal/
├── doc/                        # Planning, requirements, and compliance docs
│   ├── architecture_and_design.md
│   ├── requirements.md
│   ├── implementation_plan.md
│   ├── backlog_and_sprints.md
│   ├── odoo_api_spec.md
│   └── ...
├── public/                     # Static assets (favicons, images)
└── src/
    ├── components/             # Reusable React components
    │   ├── ui/                 # Shadcn primitives (Dialog, Select, Tab, Table)
    │   └── portal/             # Custom portal panel blocks (OrderGrid, ProfileForm)
    ├── context/                # Global states (AuthContext, CartContext)
    ├── hooks/                  # React queries and system hooks
    ├── lib/                    # Shared code (API Client, Zod schemas)
    └── routes/                 # File-based routing folder (TanStack Router)
        ├── __root.tsx          # Root Layout & Shell (Header, Footer, Navbar)
        ├── index.tsx           # Homepage
        ├── about-us.tsx        # About Us page
        ├── login.tsx           # User Auth Login page
        ├── register.tsx        # User Account Register page
        ├── cart.tsx            # Shop Cart overview page
        ├── request-quote.tsx   # Request Quote (CRM lead submission) page
        ├── account.tsx         # Customer Portal Wrapper
        │   ├── index.tsx       # Customer Dashboard home
        │   ├── orders.tsx      # Order History panel
        │   ├── profile.tsx     # Profile & Address manager
        │   └── customs.tsx     # Custom Import/Export & Customs panel
        ├── products/           # Catalog browsing
        │   ├── index.tsx       # Products root index
        │   ├── $category.index.tsx
        │   └── $category.$slug.tsx  # Product detail with price lookup & cart
        └── blog/               # Magazine/Blog section
            ├── index.tsx
            ├── $category.index.tsx
            └── $category.$slug.tsx
```

---

## 4. Routing & Hydration Flow

### ⚙️ Server-Side Rendering (SSR) & Dynamic Pages

1. **Static Storefront**: Pages like `/about-us` and `/products` are static and SEO-optimized. They are generated and edge-cached using TanStack Start's server-rendering engine.
2. **Dynamic Portal (Client-only/SSR hybrid)**:
   - Routes under `/account/*` check authentication in the route's `beforeLoad` function.
   - If the user is unauthenticated, they are redirected to `/login`.
   - If authenticated, the route fetches order history, invoices, and customs documents during the loading sequence, using TanStack Query to hydrate page data on the server without flashes of unstyled content (FOUC).

### 🌐 Localization & Asymmetric Routing

Following the URL structure of the reference project:

- The default locale (`en`) is unprefixed (e.g. `/products`).
- Other locales (`tr`, `ar`, `ru`, etc.) are routed using dynamic prefixes or subdirectories.
- Meta alternate tags and `hreflang` headers are built dynamically for crawlers, pointing Spanish users to `/es/products` and Turkish users to `/tr/products` matching Odoo's configured translations.
