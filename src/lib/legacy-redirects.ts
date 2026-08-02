/**
 * 301 redirect map for URLs indexed under the old Odoo `website_sale` shop
 * (crawled from https://erp.varsco.com/sitemap.xml, where the old instance
 * now lives — but these paths were originally indexed under varsco.com's
 * main domain before the move to this headless frontend).
 *
 * The new Store catalog is populated dynamically from Odoo, so none of the
 * old numeric-id-suffixed slugs (e.g. `atlantic-salmon-egg-88`) are
 * guaranteed to match a new product/category slug 1:1 yet. Every entry
 * below redirects to `/shop` for now rather than guessing a specific path
 * that might 404 — the `slugGuess` comment records the likely new-catalog
 * equivalent so a future pass can upgrade these to precise redirects once
 * the real product/category slugs are confirmed.
 */
export const LEGACY_SHOP_REDIRECTS: Record<string, string> = {
  // Products (slugGuess: strip trailing "-<id>")
  "/shop/atlantic-salmon-egg-88": "/shop", // slugGuess: /shop/atlantic-salmon-egg
  "/shop/emerald-chlorella-powder-86": "/shop", // slugGuess: /shop/emerald-chlorella-powder
  "/shop/fish-meal-99": "/shop", // slugGuess: /shop/fish-meal
  "/shop/revive-artemia-115": "/shop", // slugGuess: /shop/revive-artemia
  "/shop/seachem-stability-119": "/shop", // slugGuess: /shop/seachem-stability
  "/shop/super-fresh-chlorella-sv-12-80": "/shop", // slugGuess: /shop/super-fresh-chlorella-sv-12
  "/shop/vital-wheat-gluten-83": "/shop", // slugGuess: /shop/vital-wheat-gluten

  // Categories (slugGuess: /shop/category/<slug without trailing "-<id>">)
  "/shop/category/live-feed-2": "/shop", // slugGuess: /shop/category/live-feed
  "/shop/category/aquaculture-3": "/shop", // slugGuess: /shop/category/aquaculture
  "/shop/category/aquaculture-hatchery-4": "/shop", // slugGuess: /shop/category/aquaculture-hatchery
  "/shop/category/feed-additives-6": "/shop", // slugGuess: /shop/category/feed-additives
  "/shop/category/aquarium-ornamental-feed-7": "/shop", // slugGuess: /shop/category/aquarium-ornamental-feed
  "/shop/category/live-feed-artemia-cysts-8": "/shop", // slugGuess: /shop/category/live-feed-artemia-cysts
  "/shop/category/feed-additives-plant-proteins-12": "/shop", // slugGuess: /shop/category/feed-additives-plant-proteins
  "/shop/category/aquarium-ornamental-feed-water-treatment-biologicals-13": "/shop", // slugGuess: /shop/category/aquarium-ornamental-feed-water-treatment-biologicals
  "/shop/category/live-feed-chlorella-14": "/shop", // slugGuess: /shop/category/live-feed-chlorella
  "/shop/category/feed-additives-animal-based-proteins-16": "/shop", // slugGuess: /shop/category/feed-additives-animal-based-proteins
  "/shop/category/feed-additives-animal-based-proteins-fish-meal-17": "/shop", // slugGuess: /shop/category/feed-additives-animal-based-proteins-fish-meal
};

/** Matches the delocalized pathname (no /tr, /ar, etc. prefix) against the legacy redirect map. */
export function resolveLegacyRedirect(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return LEGACY_SHOP_REDIRECTS[normalized] ?? null;
}
