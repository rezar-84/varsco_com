import { ContentApiClient } from "@/lib/api/client";
import { ApiNotFoundError } from "@/lib/api/types";
import type { CatalogItemDetail, CatalogItemSummary, LocaleCode } from "@/lib/api/types";
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
    const response = await getApiClient().listProducts(locale);
    return { data: response.data, placeholder: false };
  } catch (error) {
    console.warn("[Store Data] Odoo product list error:", error);
    return { data: [], placeholder: true };
  }
}

export type StoreProductResult =
  { status: "ok"; data: CatalogItemDetail } | { status: "not_found" } | { status: "unavailable" };

/**
 * The detail endpoint (GET /api/v1/products/{locale}/{url_path}) matches
 * against varsco.catalog.item's raw `url_path` field (e.g.
 * "products/live-feed/artemia-cysts") — NOT the bare item slug our flat
 * /shop/$slug route uses. The list endpoint only returns the *display*
 * url_path (locale-prefixed, e.g. "/tr/products/live-feed/artemia-cysts"
 * for a non-default locale). Strip the same locale prefix server.ts already
 * applies (ADR-003's scheme: unprefixed default locale "en", "/xx" for
 * every other locale) to recover the raw path the detail route expects.
 */
function toRawUrlPath(displayUrlPath: string, locale: LocaleCode): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const withoutLocale =
    prefix && displayUrlPath.startsWith(prefix)
      ? displayUrlPath.slice(prefix.length)
      : displayUrlPath;
  return withoutLocale.replace(/^\/+/, "");
}

export async function getStoreProduct(
  locale: LocaleCode,
  slug: string,
): Promise<StoreProductResult> {
  try {
    const client = getApiClient();
    const { data: summaries } = await client.listProducts(locale);
    const match = summaries.find((item) => item.slug === slug);
    if (!match) return { status: "not_found" };

    const response = await client.getProduct(locale, toRawUrlPath(match.url_path, locale));
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
