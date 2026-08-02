import { ContentApiClient } from "@/lib/api/client";
import { ApiNotFoundError } from "@/lib/api/types";
import type {
  CatalogItemDetail,
  CatalogItemSummary,
  LocaleCode,
  ReviewsListEnvelope,
} from "@/lib/api/types";
import { getCurrentLocale } from "@/lib/utils/locale";

/**
 * Shared Odoo store-catalog access, used both by the /api/store/* BFF routes
 * (for client-side re-fetches) and directly by page loaders on the server
 * (avoiding a self-referential HTTP round-trip during SSR, which is fragile
 * in dev — the dev server's actual port can differ from VITE_SITE_URL — and
 * unnecessary indirection in production).
 */
function getApiClient() {
  const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
  return new ContentApiClient({ baseUrl });
}

export async function getStoreProducts(
  locale: LocaleCode,
): Promise<{ data: CatalogItemSummary[]; placeholder: boolean }> {
  try {
    const response = await getApiClient().listStoreProducts(locale);
    return { data: response.data, placeholder: false };
  } catch (error) {
    console.warn("[Store Data] Odoo product list error:", error);
    return { data: [], placeholder: true };
  }
}

export type StoreProductResult =
  { status: "ok"; data: CatalogItemDetail } | { status: "not_found" } | { status: "unavailable" };

/**
 * Unlike the curated /products endpoint, the shop detail route
 * (GET /api/v1/store/products/{locale}/{url_path}) resolves the trailing
 * slug straight to a product id via Odoo's own ir.http._unslug() — no
 * list-then-match dance needed, the bare slug from our flat /shop/$slug
 * route works directly.
 */
export async function getStoreProduct(
  locale: LocaleCode,
  slug: string,
): Promise<StoreProductResult> {
  try {
    const response = await getApiClient().getStoreProduct(locale, slug);
    return { status: "ok", data: response.data };
  } catch (error) {
    if (error instanceof ApiNotFoundError) return { status: "not_found" };
    console.error("[Store Data] Odoo product detail error:", error);
    return { status: "unavailable" };
  }
}

/** Isomorphic: direct Odoo client call on the server, BFF fetch in the browser. */
export async function loadStoreProducts(): Promise<{
  data: CatalogItemSummary[];
  placeholder: boolean;
}> {
  const locale = getCurrentLocale();
  if (typeof window === "undefined") {
    return getStoreProducts(locale as LocaleCode);
  }
  const res = await fetch(`/api/store/products?locale=${locale}`);
  const body = (await res.json()) as { data?: CatalogItemSummary[]; placeholder?: boolean };
  return { data: body.data ?? [], placeholder: Boolean(body.placeholder) };
}

export async function loadStoreProduct(slug: string): Promise<StoreProductResult> {
  const locale = getCurrentLocale();
  if (typeof window === "undefined") {
    return getStoreProduct(locale as LocaleCode, slug);
  }
  const res = await fetch(`/api/store/products/${encodeURIComponent(slug)}?locale=${locale}`);
  if (res.status === 404) return { status: "not_found" };
  if (!res.ok) return { status: "unavailable" };
  const body = (await res.json()) as { data: CatalogItemDetail };
  return { status: "ok", data: body.data };
}

export async function getProductReviews(
  locale: LocaleCode,
  slug: string,
): Promise<ReviewsListEnvelope | null> {
  try {
    return await getApiClient().listProductReviews(locale, slug);
  } catch (error) {
    console.warn("[Store Data] Odoo reviews list error:", error);
    return null;
  }
}

export async function loadProductReviews(slug: string): Promise<ReviewsListEnvelope | null> {
  const locale = getCurrentLocale();
  if (typeof window === "undefined") {
    return getProductReviews(locale as LocaleCode, slug);
  }
  const res = await fetch(
    `/api/store/products/${encodeURIComponent(slug)}/reviews?locale=${locale}`,
  );
  if (!res.ok) return null;
  return (await res.json()) as ReviewsListEnvelope;
}
