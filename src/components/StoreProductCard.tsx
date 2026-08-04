import { Link } from "@tanstack/react-router";
import { Plus, Check, ArrowRight, Heart } from "lucide-react";
import { useState } from "react";
import type { CatalogItemSummary } from "@/lib/api/types";
import { useStoreCart } from "@/context/StoreCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { formatPrice } from "@/lib/utils/price";
import { useStoreT } from "@/lib/utils/store-i18n";

export function StoreProductCard({
  product,
  layout = "grid",
}: {
  product: CatalogItemSummary;
  layout?: "grid" | "list";
}) {
  const { add, openDrawer } = useStoreCart();
  const { user } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const { t } = useI18n();
  const st = useStoreT();
  const [added, setAdded] = useState(false);
  // Odoo serves the whole catalog in English regardless of locale, so every
  // Odoo-sourced label goes through the store translator (see store-i18n.ts).
  const name = st.product(product.name, "name", product.name);
  const summary = st.product(product.name, "summary", product.summary);
  const categoryName = product.category ? st.category(product.category.name) : "";
  const price = formatPrice(product.purchase);
  const canAddToCart = Boolean(product.purchase?.available);
  const productId = product.purchase?.product_id;
  const wishlisted = productId ? isWishlisted(productId) : false;

  if (layout === "list") {
    return (
      <div className="group relative glass-card rounded-2xl flex flex-col sm:flex-row overflow-hidden transition-all duration-300 hover:border-primary/60 hover:shadow-xl bg-background border border-border/80">
        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          className="absolute inset-0 z-0"
          aria-hidden="true"
          tabIndex={-1}
        />
        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          className="relative block w-full sm:w-40 md:w-48 shrink-0 aspect-[4/3] sm:aspect-square overflow-hidden bg-surface-alt/80 p-3 flex items-center justify-center"
        >
          {product.primary_media?.url ? (
            <img
              src={product.primary_media.url}
              alt={product.primary_media.alt || name}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl font-display font-bold text-navy/10">
              {name.slice(0, 2)}
            </div>
          )}
          {product.ribbon && (
            <span
              className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md"
              style={{ backgroundColor: product.ribbon.bg_color, color: product.ribbon.text_color }}
            >
              {st.ribbon(product.ribbon.name)}
            </span>
          )}
        </Link>

        <div className="relative z-10 flex flex-1 flex-col gap-2 p-5 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {product.category && (
                <Link
                  to="/shop/category/$slug"
                  params={{ slug: product.category.slug }}
                  className="text-[10px] font-extrabold uppercase tracking-wider text-primary hover:underline"
                >
                  {categoryName}
                </Link>
              )}
              <h3 className="font-display text-lg font-bold text-navy group-hover:text-primary transition-colors leading-snug truncate">
                <Link to="/shop/$slug" params={{ slug: product.slug }}>
                  {name}
                </Link>
              </h3>
              {Boolean(product.rating_count) && (
                <div className="mt-1 flex items-center gap-1.5">
                  <StarRating value={product.rating_avg ?? 0} />
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    ({product.rating_count})
                  </span>
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {user && productId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggle(product);
                  }}
                  aria-label={
                    wishlisted ? t("store.card.removeFromWishlist") : t("store.card.addToWishlist")
                  }
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-md hover:scale-110 transition-transform"
                >
                  <Heart
                    className={cn(
                      "h-3.5 w-3.5",
                      wishlisted ? "fill-destructive text-destructive" : "text-navy/70",
                    )}
                  />
                </button>
              )}
              {product.purchase && (
                <div
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold shadow-md max-w-[8rem] truncate",
                    product.purchase.available
                      ? "bg-mint text-navy"
                      : "bg-destructive/90 text-white",
                  )}
                >
                  {product.purchase.available
                    ? t("store.card.inStock")
                    : product.purchase.out_of_stock_message || t("store.card.outOfStock")}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-navy/80 leading-relaxed line-clamp-2 font-normal">{summary}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-navy/5 px-2 py-0.5 text-[10px] font-extrabold text-navy/90 border border-navy/10"
                >
                  #{st.tag(tag)}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
            <div className="text-sm font-bold text-navy">
              {price ?? (
                <span className="text-xs font-semibold text-muted-foreground">
                  {t("store.card.contactForPricing")}
                </span>
              )}
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <Button
                size="sm"
                asChild
                variant="outline"
                className="rounded-xl text-xs font-bold border-border/80 hover:bg-navy hover:text-white"
              >
                <Link to="/shop/$slug" params={{ slug: product.slug }}>
                  {t("store.card.viewDetails")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                size="sm"
                disabled={!canAddToCart}
                onClick={() => {
                  add(product);
                  openDrawer();
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1500);
                }}
                className={cn(
                  "rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
                  added && "bg-mint text-navy",
                )}
              >
                {added ? (
                  <span className="flex items-center gap-1 font-extrabold">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" /> {t("store.card.addToCart")}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative glass-card rounded-3xl flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/60 hover:shadow-2xl bg-background border border-border/80">
      <Link
        to="/shop/$slug"
        params={{ slug: product.slug }}
        className="absolute inset-0 z-0"
        aria-hidden="true"
        tabIndex={-1}
      />
      <Link
        to="/shop/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-surface-alt/80 p-3 flex items-center justify-center"
      >
        {product.primary_media?.url ? (
          <img
            src={product.primary_media.url}
            alt={product.primary_media.alt || name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-display font-bold text-navy/10">
            {name.slice(0, 2)}
          </div>
        )}
      </Link>

      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col items-start gap-1.5">
        {product.ribbon && (
          <span
            className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md"
            style={{ backgroundColor: product.ribbon.bg_color, color: product.ribbon.text_color }}
          >
            {st.ribbon(product.ribbon.name)}
          </span>
        )}
        {product.category && (
          <Link
            to="/shop/category/$slug"
            params={{ slug: product.category.slug }}
            className="px-3 py-1 rounded-full bg-navy/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm hover:bg-navy transition-colors"
          >
            {categoryName}
          </Link>
        )}
      </div>

      <div className="absolute top-3.5 right-3.5 z-10 flex flex-col items-end gap-1.5">
        {user && productId && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle(product);
            }}
            aria-label={
              wishlisted ? t("store.card.removeFromWishlist") : t("store.card.addToWishlist")
            }
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-md hover:scale-110 transition-transform"
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5",
                wishlisted ? "fill-destructive text-destructive" : "text-navy/70",
              )}
            />
          </button>
        )}
        {product.purchase && (
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold shadow-md max-w-[10rem] truncate",
              product.purchase.available ? "bg-mint text-navy" : "bg-destructive/90 text-white",
            )}
          >
            {product.purchase.available
              ? t("store.card.inStock")
              : product.purchase.out_of_stock_message || t("store.card.outOfStock")}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-navy group-hover:text-primary transition-colors leading-snug">
            <Link to="/shop/$slug" params={{ slug: product.slug }}>
              {name}
            </Link>
          </h3>
          {Boolean(product.rating_count) && (
            <div className="mt-1 flex items-center gap-1.5">
              <StarRating value={product.rating_avg ?? 0} />
              <span className="text-[11px] font-semibold text-muted-foreground">
                ({product.rating_count})
              </span>
            </div>
          )}
        </div>

        <p className="flex-1 text-xs text-navy/80 leading-relaxed line-clamp-2 font-normal">
          {summary}
        </p>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-navy/5 px-2 py-0.5 text-[10px] font-extrabold text-navy/90 border border-navy/10"
              >
                #{st.tag(tag)}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm font-bold text-navy">
          {price ?? (
            <span className="text-xs font-semibold text-muted-foreground">
              {t("store.card.contactForPricing")}
            </span>
          )}
        </div>

        <div className="relative z-10 pt-4 border-t border-border/60 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            asChild
            variant="outline"
            className="rounded-xl text-xs font-bold border-border/80 hover:bg-navy hover:text-white"
          >
            <Link to="/shop/$slug" params={{ slug: product.slug }}>
              {t("store.card.viewDetails")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            size="sm"
            disabled={!canAddToCart}
            onClick={() => {
              add(product);
              openDrawer();
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            className={cn(
              "rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
              added && "bg-mint text-navy",
            )}
          >
            {added ? (
              <span className="flex items-center gap-1 font-extrabold">
                <Check className="h-3.5 w-3.5" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> {t("store.card.addToCart")}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
