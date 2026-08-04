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

/**
 * Static paths from the retired Odoo website that have no equivalent route
 * here and would otherwise 404.
 *
 * These are Odoo's own defaults (`website`, `portal`, `website_sale`), not
 * URLs anyone authored, so they exist on every Odoo install and are the ones
 * search engines and old bookmarks still point at. Paths that happen to match
 * a real route are deliberately absent — `/contactus` is a live route here, so
 * it must not redirect.
 */
const LEGACY_ODOO_PATHS: Record<string, string> = {
  "/aboutus": "/about-us",
  "/page/aboutus": "/about-us",
  "/page/about-us": "/about-us",
  "/page/contactus": "/contactus",
  "/page/homepage": "/",
  "/my": "/account",
  "/my/home": "/account",
  "/my/account": "/account/profile",
  "/my/orders": "/account/orders",
  "/my/quotes": "/account/orders",
  "/my/addresses": "/account/addresses",
  "/web/signup": "/register",
  "/web/reset_password": "/login",
  "/shop/cart": "/cart",
};

/**
 * Matches the delocalized pathname (no /tr, /ar, etc. prefix) against the
 * legacy redirect maps. Odoo's portal paths are matched by prefix as well, so
 * deeper URLs like /my/orders/1234 land on the account area rather than 404.
 */
export function resolveLegacyRedirect(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const direct = LEGACY_SHOP_REDIRECTS[normalized] ?? LEGACY_ODOO_PATHS[normalized];
  if (direct) return direct;
  if (normalized === "/my" || normalized.startsWith("/my/")) return "/account";
  return null;
}
