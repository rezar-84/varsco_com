# Quality Assurance & Testing Specification

This document defines the testing pyramid, verification gates, and criteria required to release changes to the Aqua Bloom Portal.

---

## 1. The Testing Pyramid

We enforce a multi-layer verification strategy.

```
       / \
      /   \      E2E Tests (Playwright)
     / E2E \     • Form Submissions, Portal Logins
    /-------\
   / Contract\   Contract Tests (Schemathesis / Vitest)
  /           \  • Verification of Odoo API payloads
 /-------------\
/     Unit      \ Unit Tests (Vitest / pytest)
/               \ • UI Component Rendering, Pure utilities
-----------------
```

### 1.1 Unit Tests (Vitest & pytest)

- **Frontend**: Unit tests inside `src/lib/` and `src/components/` cover state mutations, routing configurations, and language translations.
- **Odoo Addon**: Standard Python unit tests cover data validators, constraints, and record mapping.

### 1.2 Contract & Integration Tests

- We enforce schema contracts between the Astro frontend and Odoo backend.
- Use Vitest mock handlers (`msw` or mock schemas) to test frontend API responses against real-world Odoo payloads.

### 1.3 End-to-End (E2E) Tests (Playwright)

- Cover the complete customer journey:
  - **Quote Submission**: Adding catalog products to cart -> going to `/request-quote` -> submitting form -> verifying redirect.
  - **User Authentication**: Registering account -> logging in -> checking portal redirection.
  - **Account Dashboard**: Navigating order list -> profile changes -> downloading mock invoices.

---

## 2. Core Web Vitals & SEO Gates

Every release must pass performance scans:

- **Largest Contentful Paint (LCP)**: < 2.5 seconds.
- **Interaction to Next Paint (INP)**: < 200 milliseconds.
- **Cumulative Layout Shift (CLS)**: < 0.1.
- **SEO Metadata Checks**:
  - Every public page must contain a valid title and meta description.
  - Pages in non-default locales must carry correct `hreflang` references mapping to their counterparts.
  - Dynamic `sitemap.xml` entries must only list crawlable HTTP 200 pages.

---

## 3. Accessibility (a11y) Gates

The portal must comply with WCAG 2.1 AA standards:

- **Keyboard Nav**: Check that all menus, inputs, and buttons are focusable and navigable using keyboard tab sequences.
- **Contrast Ratios**: Check that text color combinations satisfy accessibility limits (minimum 4.5:1 ratio).
- **Alt Metadata**: Verify that all product images and content assets contain descriptive alt text.
- **Semantic HTML**: Use native landmarks (e.g. `<header>`, `<main>`, `<section>`, `<nav>`) to support screen readers.

---

## 4. Content Accuracy Gate

Blog articles and product data (`src/lib/mock/blog.ts`, `src/lib/mock/products.ts`) make scientific and nutritional claims about live feed biology, hatchery protocols, and seafood composition. These are treated as a release gate, not just copy:

- No technical/scientific claim (nutrition figures, species biology, feeding-chain relationships, hatching/incubation parameters) may be written or edited without grounding it in a real source — see the `scientific-content-review` skill (`.claude/skills/scientific-content-review/SKILL.md`) for the source-priority order and review checklist.
- A hatching/dosage/incubation parameter stated on a product page, a guide page, and a blog post must agree across all three.
- Nutrition figures must match the product's actual form (raw vs. cooked, whole vs. fillet) — cooked-seafood data silently applied to a raw/frozen product is a common, easy-to-miss error.

**Origin incident (2026-07-28):** a published blog post title claimed combining Chlorella and Artemia "boosts rotifer production" — biologically wrong (Chlorella feeds rotifers directly; Artemia is a separate live feed for larvae, unrelated to rotifer culture). A shared per-category product widget had the same conflation. Both were corrected; the `scientific-content-review` skill exists to catch this class of error before publish, not just after.

---

## 5. Definition of Done (DoD)

A task is not considered finished until:

1. **Tests Pass**: All Unit, Integration, and E2E tests are green.
2. **Types & Lint**: Strict TypeScript check (`npx tsc --noEmit`) and formatting are green.
3. **No hardcoding**: All labels, colors, and API URLs are dynamic (fetched from Odoo, configs, or local translations).
4. **GDPR/KVKK Check**: User data collections require opt-in consents.
5. **SEO Audit**: Reciprocal alternate headers and canonical links are generated.
6. **PR Review**: The change passes visual inspection and automated CI pipelines.
