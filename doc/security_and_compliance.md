# Security & Compliance Specification

This document details the security safeguards, authentication protocols, and regulatory compliance standards required for the headless Aqua Bloom Portal.

---

## 1. Authentication & Session Security

To protect client accounts and transactional boundaries:

- **HTTP-Only Cookies**: Astro server functions map Odoo's stateful `session_id` into a secure cookie (`varsco_session`). It MUST carry the `HttpOnly`, `Secure`, and `SameSite=Strict` flags. This blocks cross-site script (XSS) reading.
- **Server-to-Server Tokenization**: Any write API route that operates under general permissions (e.g. creating a lead from a contact form) requires a secure server bearer token. The token is stored in the environment `.env` file on Astro, meaning the browser client has no knowledge of it.
- **Token Rotation**: Set up token rotation policies on production environments for both writing tokens and session keys.

---

## 2. API Security & Input Sanitation

- **CORS Rules**: Configure Odoo to reject cross-origin requests from domains other than the verified storefront URL.
- **Input Validation**: Utilize **Zod validation schemas** on all frontend entry portals (Contact forms, registration inputs, checkout profiles). Any malformed payload is rejected at the Astro BFF layer prior to querying the Odoo ERP, neutralizing potential SQL injections.
- **Access Control Lists (ACL)**: Apply rigorous record-level security rules (Record Rules) inside Odoo. Authenticated portal requests are scoped strictly to the partner ID of the logged-in user:
  ```python
  # Odoo domain filter constraint
  [('partner_id', '=', user.partner_id.id)]
  ```
- **PII Logging Safeguards**: Never write complete request bodies, passwords, or personal identity information (PII) to log servers. Write clean transaction indices and error codes instead.

---

## 3. Rate Limiting & Anti-Spam

- **Form Abuse Mitigation**: Integrate **Cloudflare Turnstile** or **reCAPTCHA** on `/contactus` and `/request-quote` entry points. The form cannot submit to Astro's API route without completing the challenge.
- **IP Rate Limiting**: Configure Cloudflare WAF or rate-limiter scripts at the Astro edge, capping form submits to a maximum of 5 requests per IP address per minute, and logins to 10 trials per IP address per minute.
- **Error Rate Shunning**: Temporarily block client IPs that trigger repeated validation errors (HTTP 400s) to prevent API scanning bots.

---

## 4. GDPR & KVKK Compliance

Since the company trades in Turkey and Europe, it must comply with both the **General Data Protection Regulation (GDPR)** and the **Turkish Data Protection Law (KVKK)**:

- **Data Processing Consent**: Every form capturing contact details or profiles MUST include a checkbox where the customer explicitly consents to their details being processed according to the corporate Privacy Policy and KVKK Disclosure. This check is validated on the backend.
- **Data Erasure (Right to be Forgotten)**: Implement procedures to erase or anonymize contact profiles inside Odoo upon verified client requests.
- **Consent Banner**: Implement a customizable cookie consent banner on the storefront, disabling non-essential script loading (analytics, tracking tags) until user acceptance.
