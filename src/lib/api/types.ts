/**
 * Typed contract for the Odoo API endpoints.
 * Mirrors the API specification in doc/odoo_api_spec.md
 */

/**
 * Must stay in sync with LangCode / VALID_LANGS (src/lib/utils/locale.ts):
 * getCurrentLocale() can return any of the nine site locales and its result is
 * passed straight to these endpoints, so a narrower union here is a type lie.
 */
export type LocaleCode = "en" | "tr" | "ar" | "de" | "ja" | "ko" | "ru" | "zh" | "es";

export interface ResponseMeta {
  locale: LocaleCode;
  updated_at: string | null;
}

export interface SeoBlock {
  title: string;
  description: string;
  canonical: string;
  og: Record<string, string>;
  hreflang: Partial<Record<LocaleCode, string>>;
  jsonld: unknown[];
}

export interface PageListItem {
  slug: string;
  title: string;
  url_path: string;
  updated_at: string | null;
}

export interface ContentMedia {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export type ContentAction =
  { kind: "quote"; label: string } | { kind: "link" | "download"; label: string; url: string };

export interface SpecificationItem {
  label: string;
  value: string;
}

export type PageSection =
  | {
      type: "hero";
      content: {
        eyebrow?: string;
        heading: string;
        summary?: string;
        media?: ContentMedia;
        actions?: ContentAction[];
      };
    }
  | { type: "rich_text"; content: { heading?: string; html: string } }
  | {
      type: "media_text";
      content: {
        eyebrow?: string;
        heading: string;
        html?: string;
        media: ContentMedia;
        alignment?: "start" | "end";
      };
    }
  | {
      type: "feature_grid";
      content: {
        heading?: string;
        items: { heading: string; text: string; media?: ContentMedia }[];
      };
    }
  | {
      type: "specifications";
      content: { heading?: string; groups: { heading?: string; items: SpecificationItem[] }[] };
    }
  | {
      type: "stats";
      content: { heading?: string; items: { label: string; value: string }[] };
    }
  | {
      type: "table";
      content: { heading?: string; columns: string[]; rows: string[][] };
    }
  | {
      type: "timeline";
      content: { heading?: string; items: { label: string; heading: string; text: string }[] };
    }
  | {
      type: "tabs";
      content: { heading?: string; items: { label: string; html: string }[] };
    }
  | {
      type: "catalog_collection";
      content: {
        heading?: string;
        category_slug?: string;
        item_slugs?: string[];
        limit?: number;
      };
    }
  | {
      type: "post_collection";
      content: { heading?: string; category_slug?: string; limit?: number };
    }
  | {
      type: "form";
      content: { heading?: string; text?: string; form_key: "contact" | "quote" };
    }
  | {
      type: "cta";
      content: { heading?: string; text?: string; action: ContentAction };
    };

export interface PageDetail {
  slug: string;
  title: string;
  body_html: string;
  page_type: "static" | "legal" | "product_category" | "product_detail";
  url_path: string;
  quote_cta_enabled: boolean;
  updated_at: string | null;
  sections: PageSection[];
}

export interface BlogCategorySummary {
  slug: string;
  name: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategorySummary;
  author: string;
  published_at: string | null;
  url_path: string;
  updated_at: string | null;
}

export interface BlogPostDetail extends BlogPostSummary {
  body_html: string;
}

export interface CatalogCategorySummary {
  slug: string;
  name: string;
  url_path: string;
}

export interface StorePrice {
  amount: number;
  currency: string;
}

/**
 * Mirrors varsco_content_api's `varsco.catalog.item._public_commerce_fields()`
 * exactly: null unless the item's item_type is "purchasable_now". Never
 * flatten these onto the parent object — the real API nests them under a
 * single `purchase` key.
 */
export interface StorePurchase {
  product_id: number;
  amount: number;
  currency: string;
  /** qty_available > 0 OR sell_when_out_of_stock — a backorderable item stays "available" at zero stock. */
  available: boolean;
  qty_available: number;
  sell_when_out_of_stock?: boolean;
  show_qty?: boolean;
  out_of_stock_message?: string;
}

export interface ProductRibbon {
  name: string;
  bg_color: string;
  text_color: string;
  style: string;
  position: string;
}

export interface CatalogItemSummary {
  slug: string;
  name: string;
  summary: string;
  url_path: string;
  /** null when the product has no website category assigned (e.g. Odoo's public_categ_ids is empty). */
  category: CatalogCategorySummary | null;
  primary_media: ContentMedia | null;
  updated_at: string | null;
  /** null for quote-only (informational / purchasable_later) items — render "Contact for Pricing" when null. */
  purchase: StorePurchase | null;
  /** Only present on real /shop store products — the curated /products portfolio doesn't carry reviews. */
  rating_avg?: number | null;
  rating_count?: number;
  ribbon?: ProductRibbon | null;
  tags?: string[];
}

export interface ProductReview {
  id: number;
  author_name: string;
  rating: number;
  feedback: string;
  created_at: string | null;
}

export interface ReviewsListEnvelope {
  data: ProductReview[];
  meta: {
    locale: LocaleCode;
    rating_avg: number | null;
    rating_count: number;
  };
}

export type AddressType = "invoice" | "delivery";

export interface Address {
  id: number;
  type: AddressType;
  name: string;
  street: string;
  street2: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  phone: string;
}

export interface AddressInput {
  type: AddressType;
  name: string;
  street: string;
  street2?: string;
  city: string;
  zip?: string;
  country: string;
  phone?: string;
}

export interface AddressListEnvelope {
  data: Address[];
}

export interface CatalogItemDetail extends CatalogItemSummary {
  eyebrow: string;
  description_html: string;
  media: ContentMedia[];
  specification_groups: { heading?: string; items: SpecificationItem[] }[];
  quote_cta_enabled: boolean;
  /** Odoo's own curated cross-sell relations — only present on real /shop store products. */
  alternative_products?: CatalogItemSummary[];
  accessory_products?: CatalogItemSummary[];
  optional_products?: CatalogItemSummary[];
}

export interface RedirectRule {
  source_path: string;
  target_path: string;
  status_code: 301 | 302;
}

export interface RedirectsEnvelope {
  data: RedirectRule[];
  meta: { count: number };
}

export interface MenuItem {
  label: string;
  url_path: string | null;
  children: MenuItem[];
}

export interface ListEnvelope<T> {
  data: T[];
  meta: ResponseMeta;
}

export interface DetailEnvelope<T> {
  data: T;
  meta: ResponseMeta;
  seo: SeoBlock;
}

// User & Portal-Specific API Interfaces
export interface PortalUser {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  street?: string;
  city?: string;
  country?: string;
}

export interface PortalOrder {
  id: string;
  name: string;
  date: string;
  amount_total: number;
  state: "draft" | "sent" | "sale" | "done" | "cancel";
  tracking_number?: string;
}

export interface PortalCustomsFile {
  file_number: string;
  status: "draft" | "customs_cleared" | "pending_documents" | "in_transit";
  vessel_name?: string;
  arrival_date?: string;
  documents: { name: string; type: string; download_url: string }[];
}

export class ApiNotFoundError extends Error {
  constructor(path: string) {
    super(`Odoo API returned 404 for ${path}`);
    this.name = "ApiNotFoundError";
  }
}

export class ApiError extends Error {
  constructor(
    path: string,
    public readonly status: number,
    message?: string,
  ) {
    super(message ?? `Odoo API returned ${status} for ${path}`);
    this.name = "ApiError";
  }
}

export class ApiUnauthorizedError extends Error {
  constructor(path: string) {
    super(`Odoo API returned 401 Unauthorized for ${path}`);
    this.name = "ApiUnauthorizedError";
  }
}
