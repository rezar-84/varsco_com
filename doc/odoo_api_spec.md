# Odoo 19 Backend API Specification

This document defines the REST API contract required from the Odoo 19 ERP to support the headless Aqua Bloom Portal.

The reference implementation module at `/home/rubuntu/Projects/varsco_front/odoo/addons/varsco_content_api` is the baseline API module. This specification outlines its structure and extensions needed for portals, auth, and checkout.

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
| `GET /api/v1/products/{locale}`            | List catalog items                     | `[ { slug, url_path, name, category, image_url } ]`                                                                               |
| `GET /api/v1/products/{locale}/{url_path}` | Catalog detail specs                   | `{ slug, name, description, specifications: [ { label, value } ], image_urls, related_products }`                                 |
| `GET /api/v1/posts/{locale}`               | Blog listing                           | `[ { slug, title, excerpt, date, author } ]`                                                                                      |
| `GET /api/v1/posts/{locale}/{slug}`        | Blog article detail                    | `{ slug, title, content, date, author, category, seo }`                                                                           |
| `GET /api/v1/menu/{locale}`                | Navigation menu items                  | `[ { label, target_url, children } ]`                                                                                             |
| `GET /api/v1/redirects`                    | 301 Redirect map for retired URLs      | `[ { source_path, target_path, status_code } ]`                                                                                   |

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

- **Odoo Action**: Resolves partner discounts/pricelist tier, checks stock availability, calculates sales tax and logistics shipping fee, and creates a draft Sales Order (`sale.order`).
- **Response**: `{ "order_id": 1021, "amount_total": 9800.0, "currency": "TRY" }`
