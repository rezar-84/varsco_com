/**
 * Builds a URL for an Odoo-hosted store/catalog asset (product image,
 * spec-sheet PDF, document) that's served through this frontend's own
 * /api/assets/odoo proxy rather than linking to the Odoo host directly —
 * keeps the Odoo domain out of user-facing URLs and survives Odoo moving
 * hosts again in the future without touching every reference.
 *
 * `odooPath` is the path (+ query string) Odoo itself would serve, e.g.
 * "/web/image/product.product/63/image_1024" or
 * "/web/content/12514?unique=...&access_token=...".
 */
export function odooAssetUrl(odooPath: string): string {
  return `/api/assets/odoo?path=${encodeURIComponent(odooPath)}`;
}

/**
 * A direct (non-proxied) link to an Odoo-hosted page — for things like a
 * Documents-app share link that's a whole interactive page (with its own
 * relative asset references), not a single static file /api/assets/odoo
 * can usefully stream through.
 */
export function odooDirectUrl(odooPath: string): string {
  const baseUrl = import.meta.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
  return `${baseUrl}${odooPath}`;
}
