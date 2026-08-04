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
  gallery?: string[];
  pdfUrl?: string;
  pdfLabel?: string;
  culinaryInfo?: SeafoodCulinaryInfo;
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
