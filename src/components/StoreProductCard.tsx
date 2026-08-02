import { Link } from "@tanstack/react-router";
import { Plus, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { CatalogItemSummary } from "@/lib/api/types";
import { useStoreCart } from "@/context/StoreCartContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { formatPrice } from "@/lib/utils/price";

export function StoreProductCard({ product }: { product: CatalogItemSummary }) {
  const { add, openDrawer } = useStoreCart();
  const { t } = useI18n();
  const [added, setAdded] = useState(false);
  const price = formatPrice(product.purchase);
  const canAddToCart = Boolean(product.purchase?.available);

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
            alt={product.primary_media.alt || product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-display font-bold text-navy/10">
            {product.name.slice(0, 2)}
          </div>
        )}

        {product.category && (
          <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-navy/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
            {product.category.name}
          </div>
        )}

        {product.purchase && (
          <div
            className={cn(
              "absolute top-3.5 right-3.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold shadow-md",
              product.purchase.available ? "bg-mint text-navy" : "bg-destructive/90 text-white",
            )}
          >
            {product.purchase.available ? t("store.card.inStock") : t("store.card.outOfStock")}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-navy group-hover:text-primary transition-colors leading-snug">
            <Link to="/shop/$slug" params={{ slug: product.slug }}>
              {product.name}
            </Link>
          </h3>
        </div>

        <p className="flex-1 text-xs text-navy/80 leading-relaxed line-clamp-2 font-normal">
          {product.summary}
        </p>

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
