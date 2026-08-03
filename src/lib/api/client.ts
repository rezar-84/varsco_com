import {
  ApiError,
  ApiNotFoundError,
  ApiUnauthorizedError,
  type BlogPostDetail,
  type BlogPostSummary,
  type CatalogItemDetail,
  type CatalogItemSummary,
  type DetailEnvelope,
  type ListEnvelope,
  type LocaleCode,
  type MenuItem,
  type PageDetail,
  type PageListItem,
  type RedirectsEnvelope,
  type PortalUser,
  type PortalOrder,
  type PortalCustomsFile,
  type ReviewsListEnvelope,
  type ProductReview,
  type Address,
  type AddressInput,
  type AddressListEnvelope,
} from "./types";

export interface ContentApiClientOptions {
  baseUrl: string;
  writeToken?: string; // Server-to-server authorization token
  sessionId?: string; // Authenticated user session cookie
  fetchImpl?: typeof fetch;
}

/**
 * Typed client to interface with the Odoo 19 REST API.
 * Handles both public read content endpoints, authenticated portal endpoints, and checkouts.
 */
export class ContentApiClient {
  constructor(private readonly options: ContentApiClientOptions) {}

  /**
   * Helper to make HTTP requests.
   * Injecting session ID or authorization header when provided.
   */
  private async requestJson<T>(
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown,
  ): Promise<T> {
    const fetchImpl = this.options.fetchImpl ?? fetch;
    const url = `${this.options.baseUrl}${path}`;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    // If server-to-server token is set, attach as Bearer authorization
    if (this.options.writeToken) {
      headers["Authorization"] = `Bearer ${this.options.writeToken}`;
    }

    // If Odoo session ID is set, pass in Cookie header (or custom header)
    if (this.options.sessionId) {
      headers["Cookie"] = `session_id=${this.options.sessionId}`;
      headers["X-Openerp-Session-Id"] = this.options.sessionId;
    }

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetchImpl(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      throw new ApiUnauthorizedError(path);
    }
    if (response.status === 404) {
      throw new ApiNotFoundError(path);
    }
    if (!response.ok) {
      throw new ApiError(path, response.status);
    }

    return (await response.json()) as T;
  }

  // ==========================================
  // 1. PUBLIC READ CONTENT ENDPOINTS
  // ==========================================

  listPages(locale: LocaleCode): Promise<ListEnvelope<PageListItem>> {
    return this.requestJson(`/api/v1/pages/${locale}`);
  }

  getPage(locale: LocaleCode, urlPath: string): Promise<DetailEnvelope<PageDetail>> {
    const normalizedPath = urlPath === "/" ? "/" : urlPath.replace(/^\/+/, "");
    const encodedUrlPath = normalizedPath === "/" ? "_home" : this.encodeNestedPath(normalizedPath);
    return this.requestJson(`/api/v1/pages/${locale}/${encodedUrlPath}`);
  }

  listRedirects(): Promise<RedirectsEnvelope> {
    return this.requestJson("/api/v1/redirects");
  }

  getMenu(locale: LocaleCode): Promise<ListEnvelope<MenuItem>> {
    return this.requestJson(`/api/v1/menu/${locale}`);
  }

  listPosts(locale: LocaleCode): Promise<ListEnvelope<BlogPostSummary>> {
    return this.requestJson(`/api/v1/posts/${locale}`);
  }

  getPost(locale: LocaleCode, slug: string): Promise<DetailEnvelope<BlogPostDetail>> {
    return this.requestJson(`/api/v1/posts/${locale}/${encodeURIComponent(slug)}`);
  }

  listProducts(locale: LocaleCode): Promise<ListEnvelope<CatalogItemSummary>> {
    return this.requestJson(`/api/v1/products/${locale}`);
  }

  getProduct(locale: LocaleCode, urlPath: string): Promise<DetailEnvelope<CatalogItemDetail>> {
    const encodedUrlPath = this.encodeNestedPath(urlPath);
    return this.requestJson(`/api/v1/products/${locale}/${encodedUrlPath}`);
  }

  /**
   * Real Odoo storefront products (product.template, gated on is_published
   * via website_sale) — the data behind /shop. Distinct from listProducts()/
   * getProduct() above, which read the separate curated varsco.catalog.item
   * model behind the informational /products portfolio.
   */
  listStoreProducts(locale: LocaleCode): Promise<ListEnvelope<CatalogItemSummary>> {
    return this.requestJson(`/api/v1/store/products/${locale}`);
  }

  getStoreProduct(locale: LocaleCode, urlPath: string): Promise<DetailEnvelope<CatalogItemDetail>> {
    const encodedUrlPath = this.encodeNestedPath(urlPath);
    return this.requestJson(`/api/v1/store/products/${locale}/${encodedUrlPath}`);
  }

  listProductReviews(locale: LocaleCode, urlPath: string): Promise<ReviewsListEnvelope> {
    const encodedUrlPath = this.encodeNestedPath(urlPath);
    return this.requestJson(`/api/v1/store/products/${locale}/${encodedUrlPath}/reviews`);
  }

  /** Session-authenticated — the caller must set sessionId on this client instance. */
  submitProductReview(
    locale: LocaleCode,
    urlPath: string,
    review: { rating: number; feedback?: string },
  ): Promise<{ data: ProductReview }> {
    const encodedUrlPath = this.encodeNestedPath(urlPath);
    return this.requestJson(
      `/api/v1/store/products/${locale}/${encodedUrlPath}/reviews`,
      "POST",
      review,
    );
  }

  /** All three wishlist methods are session-authenticated — no guest wishlist. */
  listWishlist(): Promise<{ data: CatalogItemSummary[] }> {
    return this.requestJson("/api/v1/store/wishlist");
  }

  addToWishlist(productId: number): Promise<{ data: CatalogItemSummary }> {
    return this.requestJson("/api/v1/store/wishlist", "POST", { product_id: productId });
  }

  removeFromWishlist(productId: number): Promise<{ status: string }> {
    return this.requestJson(`/api/v1/store/wishlist/${productId}`, "DELETE");
  }

  /** All four address-book methods are session-authenticated. */
  listAddresses(): Promise<AddressListEnvelope> {
    return this.requestJson("/api/v1/store/addresses");
  }

  createAddress(address: AddressInput): Promise<{ data: Address }> {
    return this.requestJson("/api/v1/store/addresses", "POST", address);
  }

  updateAddress(id: number, address: Partial<AddressInput>): Promise<{ data: Address }> {
    return this.requestJson(`/api/v1/store/addresses/${id}`, "PUT", address);
  }

  deleteAddress(id: number): Promise<{ status: string }> {
    return this.requestJson(`/api/v1/store/addresses/${id}`, "DELETE");
  }

  // ==========================================
  // 2. LEAD SUBMISSIONS
  // ==========================================

  submitLead(payload: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
    source: string;
    cart_summary?: string;
  }): Promise<{ status: string; lead_id: number }> {
    return this.requestJson("/api/v1/leads", "POST", payload);
  }

  // ==========================================
  // 3. USER PORTAL & AUTHENTICATION
  // ==========================================

  authenticateUser(credentials: {
    login: string;
    password: string;
  }): Promise<{ session_id: string; user: PortalUser }> {
    return this.requestJson("/api/v1/portal/auth/login", "POST", credentials);
  }

  registerUser(details: {
    name: string;
    email: string;
    phone: string;
    company: string;
    country: string;
    password: string;
  }): Promise<{ session_id: string; user: PortalUser }> {
    return this.requestJson("/api/v1/portal/auth/register", "POST", details);
  }

  getPortalOrders(): Promise<{ data: PortalOrder[] }> {
    return this.requestJson("/api/v1/portal/orders", "GET");
  }

  getPortalCustomsFiles(): Promise<{ data: PortalCustomsFile[] }> {
    return this.requestJson("/api/v1/portal/customs", "GET");
  }

  updatePortalProfile(profile: Partial<PortalUser>): Promise<{ status: string }> {
    return this.requestJson("/api/v1/portal/profile", "PUT", profile);
  }

  // ==========================================
  // 4. STORE CHECKOUTS
  // ==========================================

  /**
   * shipping/billing partner ids are optional overrides — when omitted, Odoo
   * resolves the ordering partner from the session cookie, same as the other
   * `auth="user"` portal endpoints (getPortalOrders, updatePortalProfile).
   */
  submitCheckout(checkoutData: {
    shipping_partner_id?: number;
    billing_partner_id?: number;
    items: { product_id: number; qty: number }[];
  }): Promise<{
    order_id: number;
    amount_total: number;
    currency: string;
    /** Absolute URL to Odoo's customer-portal "Pay Now" page — present only when a compatible payment.provider is configured. */
    payment_url?: string;
  }> {
    return this.requestJson("/api/v1/store/checkout", "POST", checkoutData);
  }

  // ==========================================
  // HELPERS
  // ==========================================

  private encodeNestedPath(urlPath: string): string {
    return urlPath.replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/");
  }
}
