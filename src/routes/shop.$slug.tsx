import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Plus, Check, ShoppingBag, Loader2, Heart } from "lucide-react";
import { Section } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StoreProductCard } from "@/components/StoreProductCard";
import { StarRating } from "@/components/StarRating";
import { useStoreCart } from "@/context/StoreCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { loadStoreProduct, loadStoreProducts, loadProductReviews } from "@/lib/api/store-data";
import { formatPrice } from "@/lib/utils/price";
import { cn } from "@/lib/utils";
import type { CatalogItemSummary, ProductReview } from "@/lib/api/types";

const MAX_RELATED = 4;

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params }) => {
    const result = await loadStoreProduct(params.slug);
    if (result.status === "not_found") throw notFound();
    if (result.status === "unavailable")
      return { product: null, unavailable: true, related: [], reviews: [] as ProductReview[] };

    let related: CatalogItemSummary[] = [];
    const categorySlug = result.data.category?.slug;
    if (categorySlug) {
      const { data: allProducts } = await loadStoreProducts();
      related = allProducts
        .filter((p) => p.slug !== params.slug && p.category?.slug === categorySlug)
        .slice(0, MAX_RELATED);
    }

    const reviewsResult = await loadProductReviews(params.slug);

    return {
      product: result.data,
      unavailable: false,
      related,
      reviews: reviewsResult?.data ?? [],
    };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const productSchema = product
      ? {
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.name,
          image: product.media?.map((m) => m.url) ?? [],
          description: product.description_html?.replace(/<[^>]*>/g, "") ?? product.summary,
          ...(product.category ? { category: product.category.name } : {}),
          brand: { "@type": "Brand", name: "VARS Aquaculture" },
          ...(product.purchase
            ? {
                offers: {
                  "@type": "Offer",
                  priceCurrency: product.purchase.currency,
                  price: product.purchase.amount,
                  availability: product.purchase.available
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                  seller: { "@type": "Organization", name: "VARS Aquaculture" },
                },
              }
            : {}),
        }
      : null;

    return {
      meta: [
        { title: `${product?.name ?? "Product"} — VARS Store` },
        { name: "description", content: product?.summary ?? "" },
        { property: "og:title", content: product?.name ?? "" },
        { property: "og:description", content: product?.summary ?? "" },
      ],
      scripts: productSchema
        ? [{ type: "application/ld+json", children: JSON.stringify(productSchema) }]
        : [],
    };
  },
  component: ShopProductDetail,
});

function ShopProductDetail() {
  const { t } = useI18n();
  const { product, unavailable, related, reviews } = Route.useLoaderData();
  const { add, openDrawer } = useStoreCart();
  const { user } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (unavailable || !product) {
    return (
      <Section>
        <div className="text-center py-16 space-y-4 glass-card rounded-3xl p-8 border border-border max-w-xl mx-auto">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="font-display text-xl font-bold text-navy">
            {t("store.detail.notFound.title")}
          </h3>
          <p className="text-xs text-muted-foreground">{t("store.detail.notFound.body")}</p>
          <Button asChild variant="outline" className="rounded-xl font-bold">
            <Link to="/shop">{t("store.detail.backToShop")}</Link>
          </Button>
        </div>
      </Section>
    );
  }

  const price = formatPrice(product.purchase);
  const canAddToCart = Boolean(product.purchase?.available);
  const productId = product.purchase?.product_id;
  const wishlisted = productId ? isWishlisted(productId) : false;
  const media = product.media ?? [];
  const activeImage = media[activeImageIndex] ?? media[0];
  const descriptionText = product.description_html?.replace(/<[^>]*>/g, "").trim();

  return (
    <Section>
      <nav className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-muted-foreground mb-8">
        <Link to="/shop" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> {t("store.detail.backToShop")}
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              to="/shop/category/$slug"
              params={{ slug: product.category.slug }}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-square rounded-3xl overflow-hidden bg-surface-alt border border-border/80 flex items-center justify-center">
            {activeImage?.url ? (
              <img
                src={activeImage.url}
                alt={activeImage.alt || product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-6xl font-display font-bold text-navy/10">
                {product.name.slice(0, 2)}
              </div>
            )}
          </div>

          {media.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {media.map((item, index) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-surface-alt transition-colors",
                    index === activeImageIndex
                      ? "border-primary"
                      : "border-border/60 hover:border-border",
                  )}
                  aria-label={item.alt || `${product.name} ${index + 1}`}
                  aria-current={index === activeImageIndex}
                >
                  <img
                    src={item.url}
                    alt={item.alt || product.name}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            {product.category && (
              <Link
                to="/shop/category/$slug"
                params={{ slug: product.category.slug }}
                className="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="font-display text-3xl font-bold text-navy mt-1">{product.name}</h1>
            {Boolean(product.rating_count) && (
              <div className="mt-1.5 flex items-center gap-2">
                <StarRating value={product.rating_avg ?? 0} />
                <span className="text-xs font-semibold text-muted-foreground">
                  {product.rating_avg?.toFixed(1)} ({product.rating_count}{" "}
                  {t("store.reviews.reviewCountSuffix")})
                </span>
              </div>
            )}
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{product.summary}</p>
          </div>

          <div className="text-2xl font-display font-bold text-navy">
            {price ?? (
              <span className="text-sm font-semibold text-muted-foreground">
                {t("store.detail.contactForPricing")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-background p-1 shadow-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="rounded-lg px-3 py-1.5 text-navy hover:bg-muted transition-colors font-bold"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="rounded-lg px-3 py-1.5 text-navy hover:bg-muted transition-colors font-bold"
              >
                +
              </button>
            </div>

            <Button
              disabled={!canAddToCart}
              onClick={() => {
                add(product, qty);
                openDrawer();
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              className="flex-1 h-11 rounded-xl font-bold"
            >
              {added ? (
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> {t("store.card.addToCart")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Plus className="h-4 w-4" /> {t("store.detail.addToCart")}
                </span>
              )}
            </Button>

            {user && productId && (
              <button
                type="button"
                onClick={() => toggle(product)}
                aria-label={
                  wishlisted ? t("store.card.removeFromWishlist") : t("store.card.addToWishlist")
                }
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-background hover:bg-muted transition-colors"
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    wishlisted ? "fill-destructive text-destructive" : "text-navy/70",
                  )}
                />
              </button>
            )}
          </div>

          {descriptionText && (
            <div className="border-t border-border/60 pt-6 space-y-2">
              <h3 className="font-display text-lg font-bold text-navy">
                {t("store.detail.description")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {descriptionText}
              </p>
            </div>
          )}

          {product.specification_groups && product.specification_groups.length > 0 && (
            <div className="border-t border-border/60 pt-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-navy">
                {t("store.detail.specifications")}
              </h3>
              {product.specification_groups.map((group, gi) => (
                <div key={gi} className="space-y-2">
                  {group.heading && (
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {group.heading}
                    </h4>
                  )}
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {group.items.map((item, ii) => (
                      <div
                        key={ii}
                        className="flex justify-between border-b border-border/40 py-1.5"
                      >
                        <dt className="text-muted-foreground">{item.label}</dt>
                        <dd className="font-semibold text-navy">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewsSection slug={product.slug} initialReviews={reviews} />

      {related.length > 0 && (
        <div className="mt-16 border-t border-border/60 pt-10">
          <h2 className="font-display text-xl font-bold text-navy mb-6">
            {t("store.detail.relatedProducts")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <StoreProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function ReviewsSection({
  slug,
  initialReviews,
}: {
  slug: string;
  initialReviews: ProductReview[];
}) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [ratingInput, setRatingInput] = useState(0);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingInput < 1) {
      setFormError(t("store.reviews.form.ratingRequired"));
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch(`/api/store/products/${encodeURIComponent(slug)}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: ratingInput,
          feedback: feedbackInput.trim() || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setFormError(body.message || t("store.reviews.form.genericError"));
        return;
      }
      setReviews((prev) => [body.data as ProductReview, ...prev]);
      setSubmitted(true);
      setRatingInput(0);
      setFeedbackInput("");
    } catch {
      setFormError(t("store.reviews.form.networkError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-border/60 pt-10">
      <h2 className="font-display text-xl font-bold text-navy mb-6">
        {t("store.reviews.heading")}
        {reviews.length > 0 ? ` (${reviews.length})` : ""}
      </h2>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("store.reviews.empty")}</p>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-border/80 p-5 glass-card space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StarRating value={r.rating} />
                    <span className="text-sm font-bold text-navy">{r.author_name}</span>
                  </div>
                  {r.created_at && (
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {r.feedback && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.feedback}</p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-4 h-fit">
          <h3 className="font-display text-base font-bold text-navy">
            {t("store.reviews.form.heading")}
          </h3>

          {!user ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{t("store.reviews.form.loginPrompt")}</p>
              <Button asChild size="sm" className="rounded-xl font-bold">
                <Link to="/login" search={{ redirect: `/shop/${slug}` }}>
                  {t("store.reviews.form.loginCta")}
                </Link>
              </Button>
            </div>
          ) : submitted ? (
            <p className="text-sm text-mint font-semibold">{t("store.reviews.form.thankYou")}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-1.5">
                  {t("store.reviews.form.ratingLabel")}
                </label>
                <StarRating value={ratingInput} size="lg" interactive onChange={setRatingInput} />
              </div>
              <Textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder={t("store.reviews.form.feedbackPlaceholder")}
                className="min-h-24 rounded-xl border-border/80 bg-background text-sm"
                maxLength={2000}
              />
              {formError && <p className="text-xs text-destructive font-semibold">{formError}</p>}
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="w-full rounded-xl font-bold"
              >
                {submitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {t("store.reviews.form.submitting")}
                  </span>
                ) : (
                  t("store.reviews.form.submit")
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
