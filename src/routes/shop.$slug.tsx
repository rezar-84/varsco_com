import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, Check, ShoppingBag } from "lucide-react";
import { Section } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { StoreProductCard } from "@/components/StoreProductCard";
import { useStoreCart } from "@/context/StoreCartContext";
import { useI18n } from "@/context/I18nContext";
import { loadStoreProduct, loadStoreProducts } from "@/lib/api/store-data";
import { formatPrice } from "@/lib/utils/price";
import { cn } from "@/lib/utils";
import type { CatalogItemSummary } from "@/lib/api/types";

const MAX_RELATED = 4;

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params }) => {
    const result = await loadStoreProduct(params.slug);
    if (result.status === "not_found") throw notFound();
    if (result.status === "unavailable") return { product: null, unavailable: true, related: [] };

    let related: CatalogItemSummary[] = [];
    const categorySlug = result.data.category?.slug;
    if (categorySlug) {
      const { data: allProducts } = await loadStoreProducts();
      related = allProducts
        .filter((p) => p.slug !== params.slug && p.category?.slug === categorySlug)
        .slice(0, MAX_RELATED);
    }

    return { product: result.data, unavailable: false, related };
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
  const { product, unavailable, related } = Route.useLoaderData();
  const { add, openDrawer } = useStoreCart();
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
  const media = product.media ?? [];
  const activeImage = media[activeImageIndex] ?? media[0];
  const descriptionText = product.description_html?.replace(/<[^>]*>/g, "").trim();

  return (
    <Section>
      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {t("store.detail.backToShop")}
      </Link>

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
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {product.category.name}
              </span>
            )}
            <h1 className="font-display text-3xl font-bold text-navy mt-1">{product.name}</h1>
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
