# Aqua Bloom Portal - Product Requirements Document (PRD)

---

## 1. Project Overview & Business Goals

The **Aqua Bloom Portal** is a next-generation web application designed for a B2B aquaculture and seafood business. It provides a secure customer portal for managing order operations and customs workflows, combined with a fast e-commerce catalog.

### Primary Objectives

- **Lead Generation**: Route B2B quote inquiries into Odoo CRM (`crm.lead`) safely and instantly.
- **Customer Self-Service**: Surface user panels in the frontend, enabling B2B clients to track orders, download customs/logistics documents, and manage billing profiles.
- **Store catalog & shopping cart**: Expose a static product catalog with client-side cart capabilities, ready to scale to transactional checkout.
- **Multilingual Coverage**: Support 7 key locales (`en`, `tr`, `ar`, `de`, `ja`, `ko`, `ru`) matching the target customer demographic.

---

## 2. Functional Requirements (FR)

### FR-1: Marketing & Storefront Pages

- **Public Pages**:
  - Homepage (`/`): High-end hero showcase, company profile, core offerings.
  - About Us (`/about-us`): Company history, mission, quality certifications.
  - Seafood Export (`/seafood-export`): Information on importing and exporting seafood from Turkey to Europe.
  - FAQs (`/faqs`): Standard support questions regarding ordering, logistics, and artemia.
  - Terms & Privacy (`/terms`, `/privacy`, `/kvkk-disclosure-text`): Regulatory compliance pages.

### FR-2: Public Products Catalog & Cart

- **Catalog Pages**:
  - Products Index (`/products`): Grid of main categories (e.g. Artemia, Seafood, Live Feed).
  - Category Pages (`/products/$category`): List of products filtered by category.
  - Product Detail (`/products/$category/$slug`): In-depth product description, technical specifications, and media gallery.
- **B2B Store Features**:
  - Cart Page (`/cart`): Displays currently selected item quantities.
  - Pricing & Stock Checks: Real-time price updates based on customer account level and dynamic stock status indicators.
  - Request Quote CTA: An on-page CTA routing product details directly to the request form on `/request-quote`.

### FR-3: Lead Creation & Quote Requests

- **Request Quote Form**: Located at `/request-quote` and `/contactus`.
- **Fields**: Full Name, Company, Email Address, Phone, Subject, Message, and selected Cart items.
- **Logic**: Form submission triggers a secure backend route that creates a CRM lead (`crm.lead`) in Odoo, including an attached summary of the user's cart contents.

### FR-4: User Authentication & Onboarding

- **Login & Registration**: Located at `/login` and `/register`.
- **Auth Lifecycle**:
  - Validate password strengths and email confirmation during registration.
  - Retain session states across client sessions using secure HTTP-only cookies.
  - Support secure passwords resets via email templates.

### FR-5: Authenticated Portal Panels (Customer Dashboard)

Located under `/account/*`. Accessible only to authenticated users.

- **Dashboard Summary** (`/account`): Overview of recent orders, active customs files, and fast profile shortcuts.
- **Order History** (`/account/orders`): Searchable list of past purchases and quotations. Clicking an order reveals details, tracking links, and a PDF invoice download.
- **Profile Management** (`/account/profile`): Allows editing contact name, company registry info, shipping addresses, and billing details.
- **Customs Panel** (`/account/customs`): Specifically engineered to display import/export files, custom clearances, certificate of origins, and shipping container logistics info pulled from Odoo custom models.

---

## 3. Non-Functional Requirements (NFR)

- **Performance & Speed**: Core Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- **SEO Integrity**:
  - Robots.txt and Sitemap.xml exclusions match exactly.
  - Correct `hreflang` headers and reciprocal canonical tags across all 7 locales.
  - JSON-LD structured data generated dynamically for products and articles.
- **Security & Privacy**:
  - No Odoo credentials, write tokens, or internal endpoints exposed in client browser JS.
  - Rate-limiting and recaptcha protections on public forms to prevent email spam.
  - GDPR/KVKK compliance banners and opt-in consent for analytics.
- **Scalability**: Decoupled design allows the Astro/TanStack frontend to be scaled globally via Cloudflare CDN without increasing the request load on the Odoo ERP.
