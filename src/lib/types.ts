export type CategorySlug =
  "feed-additives" | "hatchery-solutions" | "live-feed-aquaculture" | "seafood";

export interface ProductCategory {
  slug: CategorySlug;
  title: string;
  description: string;
  image?: string;
}

export interface ProductMetric {
  label: string;
  value: string;
}

export interface SeafoodCulinaryInfo {
  whyChooseTitle?: string;
  whyChoosePoints?: Array<{ title: string; desc: string }>;
  cookingSuggestions?: string[];
  flavorProfile?: string;
  sizeGroups?: Array<{ group: string; weight: string; application: string }>;
  nutritionalNumbers?: Array<{ label: string; value: string }>;
}

/**
 * A commercial format a product ships in (frozen fillet, fresh gutted, live).
 *
 * Distinct from `culinaryInfo.sizeGroups`, which grades one format by weight.
 * A format changes what is being sold — processing, packing and the logistics
 * window all differ — so live fish carry a viability limit that a frozen
 * fillet has no equivalent for.
 */
export interface ProductExportForm {
  /** Stable key: doubles as the locale key prefix and the anchor id. */
  key: string;
  name: string;
  summary: string;
  /** Weight bands. Numeric — never translated, same rule as sizeGroups.weight. */
  sizes?: string[];
  /**
   * Buyer-selectable processing choices (fins on/off, plain or salted).
   *
   * `value` is the prose the product page shows. `choices` is the same option
   * expressed as the discrete answers a buyer actually picks from, which is
   * what the quote form needs — it cannot turn "Attached or trimmed, to order"
   * into a dropdown on its own. Options without `choices` are informational
   * (viability windows, worked examples) and the form skips them.
   */
  options?: { label: string; value: string; choices?: string[] }[];
  notes?: string;
}

export interface Product {
  slug: string;
  category: CategorySlug;
  title: string;
  latinName?: string;
  tagline: string;
  tags: string[];
  description: string;
  longDescription?: string[];
  highlights?: string[];
  metrics: ProductMetric[];
  specifications: { label: string; value: string }[];
  applications: string[];
  storage: string;
  image?: string;
  /** Optimized card/menu image. Keep `image` for the full product-detail view. */
  thumbnail?: string;
  gallery?: string[];
  pdfUrl?: string;
  pdfLabel?: string;
  culinaryInfo?: SeafoodCulinaryInfo;
  /** Commercial formats this product ships in. Optional — seafood lines only. */
  exportForms?: ProductExportForm[];
  /** Export paperwork available on request; applies across every format. */
  exportDocuments?: string[];
  seoKeywords?: string[];
  searchSynonyms?: string[];
  relatedProducts?: string[];
}

export interface CartItem {
  productSlug: string;
  category: CategorySlug;
  title: string;
  image?: string;
  quantity: number;
}

export interface QuoteRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  street?: string;
  city?: string;
  country?: string;
}

export type OrderStatus = "Pending Review" | "Approved" | "Shipped" | "Cancelled";

export interface Order {
  id: string;
  date: string;
  products: string[];
  status: OrderStatus;
  total?: string;
}

export interface CustomsDocument {
  id: string;
  name: string;
  type: "Invoice" | "Certificate" | "Customs";
  date: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  authorInitials: string;
  date: string;
  readMinutes: number;
  image?: string;
  translations?: Partial<
    Record<
      LangCode,
      {
        title: string;
        excerpt: string;
        /** Optional: a locale may have its title/excerpt translated before the
         *  full article body. getLocalizedPost() falls back to the English body. */
        body?: string;
        category?: string;
      }
    >
  >;
}

export type LangCode = "en" | "tr" | "ar" | "de" | "ja" | "ko" | "ru" | "zh" | "es";
