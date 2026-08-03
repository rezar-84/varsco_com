# VARS Aquaculture SEO & CRO Master Plan

Updated 2026-08-03. This is the implementation hand-off for the multilingual SEO audit.

## Completed in this pass

- Added one SSR-safe SEO source for the nine supported locales: English, Turkish, Arabic, German, Russian, Japanese, Korean, Simplified Chinese, and Spanish.
- Localized title, description, Open Graph title/description, Twitter title/description, `og:locale`, canonical URL, `og:url`, social image, and document language handling.
- Prioritized English and Turkish commercial language around existing indexed topics: aquaculture, live feed, Artemia, Chlorella, salmon eggs, seafood export, B2B, cold chain, TRACES, hatchery, and RAS.
- Localized the main acquisition pages: services, projects, seafood export, Europe export, contact, quote request, FAQ, salmonid ova, Coho eggs, Artemia guides, HORECA, regional trade, and aquariums/hobbyists.
- Added `noindex, nofollow` behavior for account, panel, cart, authentication, and checkout pages. Added matching localized robots exclusions.
- Added missing public landing pages and technical guides to the XML sitemap.
- From the 2026-08-03 Search Console export, added 301 normalization for historical `/ko_KR` and `/ko-kr` URL families, `/en` duplicates, the `www.varsco.com` host, and `/web/login`; legacy `/web/*` responses now receive `X-Robots-Tag: noindex, nofollow`.
- Preserved the existing URL scheme, legacy redirect behavior, product SEO keywords, product JSON-LD, blog JSON-LD, Organization JSON-LD, and all existing content paths.

## Important SEO policy decisions

`meta keywords` are not a modern Google ranking signal. Existing product keyword fields are retained for compatibility and structured data, but new keyword stuffing should not be added. Use search terms naturally in the title, first paragraph, headings, internal anchor text, product data, and localized body copy.

Each translated URL is treated as a genuine language variant. Do not machine-translate species names, certification names, Latin names, product grades, or regulatory terms. Keep scientific names and official scheme names such as TRACES, ASC, BRC, SFDA, SASO, SPF, RAS, and MOQ stable.

## Priority 0 — measurement and index safety

The supplied report contains 585 currently valid URLs, 8,786 URLs excluded by `noindex`, 1,707 redirects, 1,514 robots-blocked URLs, 455 5xx URLs, 156 404s, 3,306 crawled-but-not-indexed URLs, and 40 canonical disagreements. The largest immediately actionable pattern is the historical `/ko_KR/...` URL family visible in the valid table; those URLs did not match the current `/ko` locale implementation.

1. Verify every production host and URL-prefix property in Google Search Console and Bing Webmaster Tools.
2. Export the last 16 months of queries, landing pages, clicks, impressions, CTR, average position, country, and device. Save the export before changing high-traffic titles.
3. Compare the export with the sitemap and record indexed URLs, excluded URLs, redirects, soft 404s, duplicate canonicals, and alternate-page errors.
4. Confirm that the production `VITE_SITE_URL`, sitemap host, canonical host, and redirect host are all `https://varsco.com`.
5. Test `/`, `/tr/`, `/about-us`, `/tr/about-us`, `/products`, `/tr/products`, representative product URLs, blog URLs, and all locale variants with URL Inspection.
6. Confirm that the business contact details in Organization JSON-LD are real. Replace placeholder phone data before relying on the schema for entity trust.

## Priority 1 — technical SEO

1. Add a route-level metadata test that checks exactly one effective title, one description, one canonical, and a matching `html[lang]` for every public locale route.
2. Add `BreadcrumbList` JSON-LD to catalog, product, store, blog category, and blog article routes. Ensure breadcrumb URLs use the current locale prefix.
3. Complete `Product` schema validation with real availability, price/currency where applicable, SKU, brand, image URLs, and `ItemList` schema on listing pages. Do not invent prices or reviews.
4. Add localized `FAQPage` schema only when the visible FAQ questions and answers are present in the same language.
5. Add `Article` fields for blog posts: `dateModified`, `mainEntityOfPage`, `inLanguage`, `image`, and a stable author/profile URL. Validate in Rich Results Test.
6. Review dynamic Odoo store product pages for SSR availability, stable canonical URLs, translated names/descriptions, and noindex behavior for thin or unavailable products.
7. Audit image alt text, intrinsic dimensions, lazy-loading, WebP/AVIF delivery, and oversized hero assets. The current build reports several multi-megabyte images.
8. Measure Core Web Vitals on mobile templates. Prioritize the homepage and product detail pages for LCP, INP, CLS, and JavaScript payload reduction.

## Priority 2 — information architecture and content

1. Build a keyword-to-URL map from Search Console and historical analytics. Assign one primary intent per URL and merge or redirect cannibalizing pages.
2. Create dedicated English/Turkish commercial hubs for: salmon eggs/ova, Artemia/live feed, Chlorella/microalgae, aquafeed ingredients, seafood export, and RAS/hatchery consulting.
3. Add visible comparison and buying guidance to high-intent pages: standard vs decapsulated Artemia, Atlantic vs Coho ova, and fresh vs frozen seafood logistics.
4. Strengthen internal links from technical articles to relevant products and quote requests, using descriptive anchors and locale-preserving URLs.
5. Add author credentials, source references, update dates, and editorial review notes to technical content to support aquaculture and food-supply trust.
6. Review Turkish terminology with a native aquaculture editor, especially `canlı yem`, `Artemia kistleri`, `gözlenmiş yumurta`, `kuluçkahane`, `su ürünleri ihracatı`, and regulatory terms.
7. Translate remaining static page metadata and visible page copy where fallback English remains. Do not mark a locale as fully translated until its page body and metadata are both complete.

## Priority 3 — CRO and commercial growth

1. Track quote CTA impressions, starts, validation errors, submits, qualified leads, WhatsApp clicks, email clicks, product-to-quote transitions, and language.
2. Add a clear response-time promise only where the sales team can meet it; report SLA attainment by language and destination market.
3. Pre-fill quote requests with product, category, quantity, destination, Incoterm, and required certification fields when a visitor arrives from a product page.
4. Add trust blocks near the primary CTA: legal company name, real certifications, shipping regions, documentation examples, case studies, and verified contact details.
5. A/B test English and Turkish hero value propositions, CTA labels, proof placement, and quote-form length with a qualified-lead outcome rather than raw submits.
6. Create market-specific landing pages only when there is real supply, logistics capability, and localized proof for that market.

## Preservation and release checklist

- Do not remove existing high-performing URLs or change slugs without a documented 301 mapping.
- Before deployment, snapshot Search Console performance and current sitemap URLs.
- Validate canonical and hreflang reciprocity after deployment; every alternate must resolve 200, self-canonicalize, and link back to the set.
- Monitor indexed pages, CTR, crawl stats, quote conversion, and qualified lead rate weekly for four weeks, then monthly.
- Roll back title/description experiments when impressions are stable but qualified conversion or CTR materially declines.
