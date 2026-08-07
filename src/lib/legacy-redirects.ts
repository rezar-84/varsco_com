/**
 * 301 redirects for URLs indexed under the retired Odoo site.
 *
 * Sources: Search Console "Not found (404)" drilldown for varsco.com
 * (2026-08-06, 163 URLs), plus Odoo's own default paths. The affected-page
 * count was climbing — 110 on 2026-05-08 to 156 on 2026-07-24 — so these are
 * live crawl errors, not a stale backlog.
 */

/**
 * Storefront products that no longer resolve under their old slug.
 *
 * An earlier note here recorded that every /shop URL resolved unchanged
 * because this frontend reuses Odoo's own `ir.http._slug()` scheme against the
 * same records. That holds for products still published — but not for ones
 * that were retired or renamed since, and the 404 report shows 56 crawled
 * /shop URLs failing. Brinova Artemia is the clearest case: the line no longer
 * exists in the catalogue (Revive replaced it), so its slug can never resolve
 * again no matter what the slug helper does.
 *
 * Keys are the slug with Odoo's trailing `-<id>` already stripped, so a single
 * entry covers every id the same product was published under.
 */
export const LEGACY_SHOP_SLUGS: Record<string, string> = {
  // Retired Artemia brand — superseded by the Revive line.
  "brinova-artemia": "/products/live-feed-aquaculture/artemia",
  revive: "/products/live-feed-aquaculture/artemia",
  "revive-artemia": "/products/live-feed-aquaculture/artemia",
  // Decapsulated variants, indexed under localized slugs.
  "revive-kabuksuz-artemia": "/products/live-feed-aquaculture/decapsulated-dry-artemia-cysts",
  "revive-entkapselte-artemia": "/products/live-feed-aquaculture/decapsulated-dry-artemia-cysts",
  // Fresh Chlorella, indexed under several pack-size and locale spellings.
  "sv-12-20l": "/products/live-feed-aquaculture/super-fresh-chlorella-v12",
  "sv-12-20": "/products/live-feed-aquaculture/super-fresh-chlorella-v12",
  "v12-20": "/products/live-feed-aquaculture/super-fresh-chlorella-v12",
  "sv12-20-lit-case": "/products/live-feed-aquaculture/super-fresh-chlorella-v12",
  "superfrisch-chlorella-sv-12-20-lit": "/products/live-feed-aquaculture/super-fresh-chlorella-v12",
  // Chlorella powder, English/German/Turkish spellings.
  emerald: "/products/live-feed-aquaculture/emerald-chlorella-powder",
  "emerald-chlorella-powder": "/products/live-feed-aquaculture/emerald-chlorella-powder",
  "emerald-chlorella-pulver": "/products/live-feed-aquaculture/emerald-chlorella-powder",
  "emerald-chlorella-tozu": "/products/live-feed-aquaculture/emerald-chlorella-powder",
  // Salmon ova and feed ingredients under Turkish slugs.
  "atlantik-somon-yumurtas": "/products/hatchery-solutions/atlantic-salmon-egg",
  "fish-meal": "/products/feed-additives/fish-meal",
  "balk-unu": "/products/feed-additives/fish-meal",
};

/**
 * Odoo product ids seen bare in the report (`/shop/64`), where the slug that
 * would identify the product is absent from the URL. Mapped from sibling URLs
 * in the same report that carried both slug and id.
 */
const LEGACY_SHOP_IDS: Record<string, string> = {
  "10": "/products/live-feed-aquaculture/artemia",
  "64": "/products/live-feed-aquaculture/decapsulated-dry-artemia-cysts",
  "116": "/products/live-feed-aquaculture/artemia",
};

/**
 * Content pages from the retired site, including the pre-Odoo era.
 *
 * `/node/*` is Drupal — an earlier generation still being crawled. Those carry
 * no recoverable mapping, so they resolve to the closest section rather than
 * guessing at a specific page.
 */
const LEGACY_PATHS: Record<string, string> = {
  // Odoo/website defaults
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

  // Home and contact under their old names. `/home` was Odoo's homepage path;
  // this site serves the homepage at `/`.
  "/home": "/",
  "/index.htm": "/",
  "/index.html": "/",
  "/contact": "/contactus",
  "/contact-us": "/contactus",
  "/iletisim": "/contactus",

  // Product pages that used to sit at the site root, without the /products
  // prefix or a category segment.
  "/live-feed-aquaculture/brinova-artemia": "/products/live-feed-aquaculture/artemia",
  "/mediterranean-sea-bass": "/products/seafood/mediterranean-sea-bass",
  "/mediterranean-sea-bream": "/products/seafood/mediterranean-sea-bream",
  // Renamed product slug.
  "/products/live-feed-aquaculture/artemia-cyst": "/products/live-feed-aquaculture/artemia",
  // Corrected species: the catalogue described Argyrosomus regius but was
  // named and labelled as Sciaena umbra, a different fish. The old slug is a
  // species claim too, so it redirects rather than resolving.
  "/products/seafood/brown-meagre": "/products/seafood/meagre",

  // Export landing pages under their former names.
  "/global-fish-seafood-export-from-turkey": "/seafood-export",
  "/seafood-export-from-turkey-to-asia-the-middle-east": "/horeca-seafood-middle-east",

  // Turkish-language paths from the old site.
  "/projeler": "/projects",
  "/urunler": "/products",
  "/hakkimizda": "/about-us",

  // Pages that never had an equivalent here; sent to the nearest real content
  // rather than 404. `/jobs` and `/pricing` have no counterpart at all, so
  // they go to the pages that answer the underlying question.
  "/product-inquiry": "/request-quote",
  "/pricing": "/request-quote",
  "/events": "/about-us",
  "/jobs": "/contactus",
  "/help": "/faqs",
  // `/glossary` was mapped here too while the term reference did not exist.
  // It is a real page now, so the redirect is gone and the URL resolves.
  "/knowledge-base": "/glossary",
  "/delivery-policy": "/distance-sales-agreement",
  "/delivery": "/distance-sales-agreement",
};

/** Section fallbacks for legacy URL families with no per-page mapping. */
const LEGACY_PREFIXES: [RegExp, string][] = [
  // Drupal-era paths from before the Odoo site.
  [/^\/node(\/|$)/, "/"],
  // Odoo CRM/website marketing pages that were never rebuilt.
  [/^\/customers(\/|$)/, "/projects"],
  [/^\/livechat(\/|$)/, "/contactus"],
  [/^\/website\/social(\/|$)/, "/contactus"],
  // Old sitemap index paths.
  [/^\/sitemaps(\/|$)/, "/sitemap.xml"],
];

/**
 * Matches a delocalized pathname (no /tr, /ar prefix) against the legacy maps.
 *
 * Returns null when nothing matches, leaving the request to 404 — a wrong
 * redirect is worse than a 404, because it hides the broken link from
 * Search Console while giving the visitor the wrong page.
 */
export function resolveLegacyRedirect(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "").toLowerCase() || "/";

  const direct = LEGACY_PATHS[normalized];
  if (direct) return direct;

  // /shop/<slug>-<id> or /shop/<id>
  const shopMatch = normalized.match(/^\/shop\/([a-z0-9-]+)$/);
  if (shopMatch) {
    const raw = shopMatch[1];
    if (/^\d+$/.test(raw)) return LEGACY_SHOP_IDS[raw] ?? "/shop";
    const slug = raw.replace(/-\d+$/, "");
    const mapped = LEGACY_SHOP_SLUGS[slug];
    if (mapped) return mapped;
    // Unmapped storefront URL: the catalogue index is a far better landing
    // than a 404 for a shopper who followed an old product link.
    return "/shop";
  }
  // /shop/category/<slug>-<id> and any other /shop/* shape.
  if (normalized.startsWith("/shop/")) return "/shop";

  if (normalized === "/my" || normalized.startsWith("/my/")) return "/account";

  for (const [pattern, target] of LEGACY_PREFIXES) {
    if (pattern.test(normalized)) return target;
  }

  return null;
}
