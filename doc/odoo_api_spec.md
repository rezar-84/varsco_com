# Odoo 19 Backend API Specification

This document defines the REST API contract required from the Odoo 19 ERP to support the headless Aqua Bloom Portal.

The reference implementation module is the sibling `varsco_content_api` Odoo addon (`git@github.com:rezar-84/varsco_content_api.git`) — the actual, currently-deployed source of truth for this contract; this document is a mirror of it maintained on the frontend side, and the two must be kept in sync (see that repo's own `docs/architecture.md` §5).

---

## 1. API Principles & Conventions

- **Decoupled Contracting**: Odoo functions as a headless data provider. It does not output raw XML/QWeb templates or classes. It returns clean JSON payloads.
- **HTTP Methods**:
  - `GET` for public, cacheable content queries.
  - `POST` for dynamic updates (auth logins, leads creation, order checkouts).
- **Routing Prefix**: All routes are versioned under `/api/v1/`.
- **Field Discipline**: All endpoints must explicitly permit which fields are returned. No internal margins, cost figures, or developer notes should be exposed on public routes.
- **Authentication Policies**:
  - **Public Reads**: Public accessibility, HTTP cacheable (`auth="public"`).
  - **Secure S2S (Server-to-Server) Writes**: Authenticated via bearer tokens (`Authorization: Bearer <secret>`).
  - **Customer Portal Reads/Writes**: Authenticated using Odoo's native session ID (`auth="user"`).

---

## 2. API Endpoints

### 2.1 Public Read Endpoints (`auth="public"`, GET)

These endpoints are cacheable at the CDN edge and are used for static generation and public site queries.

| Endpoint                                   | Purpose                                | Response Payload Key Contents                                                                                                     |
| ------------------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/v1/pages/{locale}`               | List pages for static route generation | `[ { slug, url_path, title, updated_at } ]`                                                                                       |
| `GET /api/v1/pages/{locale}/{url_path}`    | Detail page contents                   | `{ slug, url_path, title, body_html, sections: [ { type, content } ], seo: { title, description, canonical, hreflang, jsonld } }` |
| `GET /api/v1/products/{locale}`            | List catalog items                     | `{ data: [ CatalogItemSummary ], meta: { locale, updated_at } }` — see shape below                                                |
| `GET /api/v1/products/{locale}/{url_path}` | Catalog detail specs                   | `{ data: CatalogItemDetail, meta, seo }` — `CatalogItemDetail` extends `CatalogItemSummary` with `eyebrow`, `description_html`, `media`, `specification_groups`, `quote_cta_enabled` |
| `GET /api/v1/posts/{locale}`               | Blog listing                           | `[ { slug, title, excerpt, date, author } ]`                                                                                      |
| `GET /api/v1/posts/{locale}/{slug}`        | Blog article detail                    | `{ slug, title, content, date, author, category, seo }`                                                                           |
| `GET /api/v1/menu/{locale}`                | Navigation menu items                  | `[ { label, target_url, children } ]`                                                                                             |
| `GET /api/v1/redirects`                    | 301 Redirect map for retired URLs      | `[ { source_path, target_path, status_code } ]`                                                                                   |

**`CatalogItemSummary` shape** (each entry in the products list, and the base of the detail response):

```json
{
  "slug": "artemia-cysts-500g",
  "name": "Artemia Cysts 500g",
  "summary": "...",
  "url_path": "products/live-feed/artemia-cysts-500g",
  "category": { "slug": "live-feed", "name": "Live Feed", "url_path": "products/live-feed" },
  "primary_media": { "url": "...", "alt": "..." },
  "updated_at": "2026-08-02T00:00:00Z",
  "purchase": {
    "product_id": 42,
    "amount": 42.5,
    "currency": "TRY",
    "available": true,
    "qty_available": 10.0
  }
}
```

`purchase` is `null` for quote-only items (`item_type` `informational`/`purchasable_later` on the Odoo side) — render "Contact for Pricing" and hide Add to Cart when null. Only `purchasable_now` items ever carry a `purchase` block, and `purchase.product_id` is the only place a raw Odoo product id is exposed publicly — it's required to submit that item in `POST /api/v1/store/checkout`'s `items[].product_id`.

### 2.1b Storefront (Shop) Endpoints — real Odoo product data (`auth="public"`, GET)

**Distinct from 2.1 above.** `/api/v1/products/*` reads the curated `varsco.catalog.item` model behind the informational `/products` portfolio. `/api/v1/store/products/*` reads real `product.template` records directly — gated purely on Odoo's native `is_published` flag (`website_sale`) — the same data Odoo's own `erp.varsco.com/shop` storefront shows. This is what backs `/shop`. No curated re-entry step: toggling "Published" on a normal Odoo product is the entire content workflow.

| Endpoint | Purpose | Response |
| --- | --- | --- |
| `GET /api/v1/store/products/{locale}` | List every published storefront product | `{ data: [ CatalogItemSummary ], meta: { locale, updated_at } }` — same `CatalogItemSummary` shape as 2.1, `purchase` always populated (the shop is 100% transactional) |
| `GET /api/v1/store/products/{locale}/{slug}` | One product by its slug | `{ data: CatalogItemDetail, meta, seo }` — `slug` is generated by Odoo's own `ir.http._slug()` (`<slugified-name>-<id>`), the exact same helper `website_sale` uses for its own `/shop/<slug>-<id>` URLs, resolved back to an id via `_unslug()` — no fragile string-matching needed, pass the bare slug straight through |

Known current simplifications (see `varsco_content_api`'s `controllers/shop.py` docstring / ADR-010): every locale reads the same underlying field values (no per-locale translation-context switching yet); `specification_groups` is always `[]` (mapping product attributes into spec rows is tracked separately under "Attributes & variations").

### 2.2 Secure Server-to-Server Endpoint (`auth="public"`, POST with Token)

Used by the Astro/Start server to forward public requests securely.

#### `POST /api/v1/leads`

- **Headers**: `Authorization: Bearer <write_token>`
- **Request Payload**:

```json
{
  "name": "Full Name",
  "email": "user@example.com",
  "company": "Company Name",
  "message": "Inquiry text",
  "source": "contact_form",
  "cart_summary": "Item A (x2), Item B (x1)"
}
```

- **Response**: `201 Created` with `{"status": "success", "lead_id": 412}`.
- **Odoo Side Action**: Creates a `crm.lead` record.

### 2.3 Customer Portal Endpoints (`auth="user"`, Session-Cookie Authenticated)

Used for authenticated portal panels under `/account/*`. The Astro server acts as a proxy, passing the browser's HTTP-only session cookie to Odoo.

#### `POST /api/v1/portal/auth/login`

- **Request Payload**: `{"login": "user@example.com", "password": "secure_password"}`
- **Response**: `200 OK` with standard session cookie (`session_id`) and customer metadata.
- **Odoo Side Action**: Leverages standard `/web/session/authenticate` logic.

#### `GET /api/v1/portal/orders`

- **Response Payload**: List of sales orders associated with the authenticated user's `partner_id`.

```json
{
  "data": [
    {
      "order_id": 512,
      "name": "SO0024",
      "date": "2026-07-20T12:00:00Z",
      "amount_total": 4500.0,
      "state": "sale",
      "tracking_number": "TRK10245"
    }
  ]
}
```

#### `GET /api/v1/portal/customs`

- **Response Payload**: Customs clearance status and linked import documentation files.

```json
{
  "data": [
    {
      "file_number": "EXP-2026-981",
      "status": "customs_cleared",
      "vessel_name": "Aqua Carrier V1",
      "arrival_date": "2026-07-25",
      "documents": [
        { "name": "Certificate of Origin", "download_url": "/api/v1/portal/documents/102" },
        { "name": "Commercial Invoice", "download_url": "/api/v1/portal/documents/103" }
      ]
    }
  ]
}
```

#### `PUT /api/v1/portal/profile`

- **Request Payload**: `{ "name": "New Name", "street": "Main Road 1", "city": "Istanbul" }`
- **Response**: `200 OK` updating `res.partner`.

### 2.4 E-Commerce Checkout Endpoints (POST)

#### `POST /api/v1/store/checkout`

- **Request Payload**:

```json
{
  "shipping_partner_id": 421,
  "billing_partner_id": 421,
  "items": [
    { "product_id": 99, "qty": 10.0 },
    { "product_id": 105, "qty": 5.0 }
  ]
}
```

- **Odoo Action**: Re-validates every line against `item_type == "purchasable_now"` and live stock, resolves the ordering partner from the session (both `shipping_partner_id`/`billing_partner_id` are optional overrides — omit them to default to the authenticated partner), and creates a draft Sales Order (`sale.order`).
- **Response**: `{ "order_id": 1021, "amount_total": 9800.0, "currency": "TRY", "payment_url": "https://erp.varsco.com/my/orders/1021?access_token=..." }`
  - `payment_url` is **optional** — present only when a compatible `payment.provider` (e.g. Iyzico) is configured for the order. When present, it's the order's Odoo customer-portal URL: redirect the browser there to complete payment (Odoo's own `payment`/`payment_iyzico` modules handle the entire redirect/webhook/confirmation cycle natively — nothing else to implement on the frontend side for that flow). When absent, treat the order the same as before: a draft order was created, no online payment is available for it, and a human follow-up completes the sale.

### 2.5 Address Book Endpoints (Session-Cookie Authenticated)

Backed by plain `res.partner` child contacts (`type` in `invoice`/`delivery`) of the authenticated partner — not a new model. These are the *extra* addresses a buyer can save and pick between; the buyer's own partner record (used by default when `shipping_partner_id`/`billing_partner_id` are omitted from checkout) is managed separately via `PUT /api/v1/portal/profile`.

#### `GET /api/v1/store/addresses`

- **Response**: `{ "data": [{ "id": 501, "type": "delivery", "name": "Warehouse A", "street": "123 Harbor Rd", "street2": "", "city": "Izmir", "zip": "", "state": "", "country": "Türkiye", "phone": "" }] }`
- 401 if not authenticated.

#### `POST /api/v1/store/addresses`

- **Request Payload**: `{ "type": "delivery", "name": "Warehouse A", "street": "123 Harbor Rd", "street2": "", "city": "Izmir", "zip": "", "country": "Türkiye", "phone": "" }`
  - `type` (`invoice`|`delivery`), `name`, `street`, `city`, `country` are required. `country` is free-text, resolved the same way `portal_register`/`portal_profile_update` already do (exact name match, a couple of known aliases, then ISO alpha-2 code as a last resort).
- **Response**: `201` + the created address in the same shape as the list endpoint. `400` for a missing required field, invalid `type`, or unresolvable `country`. `401` if not authenticated.

#### `PUT /api/v1/store/addresses/{id}`

- **Request Payload**: any subset of the writable fields above.
- **Response**: `200` + the updated address. `404` if `{id}` isn't a child contact of the authenticated partner (never leaks whether an address belongs to someone else). `401` if not authenticated.

#### `DELETE /api/v1/store/addresses/{id}`

- **Response**: `200` on success. `404` for the same ownership reason as `PUT`. `409 address_in_use` if the address is still referenced as a `shipping_partner_id`/`billing_partner_id` on an existing sales order — archive/reassign that order first, the address book has no force-delete.
