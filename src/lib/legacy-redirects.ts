/**
 * 301 redirect map for /shop/* URLs that no longer resolve on their own.
 *
 * The Store catalog now reads real Odoo product.template/product.public.category
 * records directly (is_published, via varsco_content_api's controllers/shop.py),
 * using the exact same `ir.http._slug()` helper Odoo's own `website_sale`
 * storefront uses for its `/shop/<slug>-<id>` and `/shop/category/<slug>-<id>`
 * URLs. Because it's the same records in the same database, a product/category
 * indexed under the old storefront resolves at the *identical* path on this
 * frontend once published here too — no redirect needed, `/shop/$slug` and
 * `/shop/category/$slug` serve it directly.
 *
 * Verified 2026-08-02 against https://erp.varsco.com (the old instance, still
 * live): every URL crawled from its sitemap resolved with a plain 200 at the
 * unchanged slug, confirming no entry belongs in this map right now. Add an
 * entry here only for a URL that genuinely no longer resolves under its old
 * slug (product renamed/removed, category restructured) — resolving to the
 * generic `/shop` fallback is preferable to a 404 in that case.
 */
export const LEGACY_SHOP_REDIRECTS: Record<string, string> = {};

/** Matches the delocalized pathname (no /tr, /ar, etc. prefix) against the legacy redirect map. */
export function resolveLegacyRedirect(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return LEGACY_SHOP_REDIRECTS[normalized] ?? null;
}
