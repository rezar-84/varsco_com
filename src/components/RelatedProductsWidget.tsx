import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { PRODUCTS } from "@/lib/mock/products";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/context/I18nContext";

export function RelatedProductsWidget({ currentProduct }: { currentProduct: Product }) {
  const { t } = useI18n();
  // Find related products: either explicit mapped relatedProducts or same-category fallback
  const relatedList: Product[] = (() => {
    if (currentProduct.relatedProducts && currentProduct.relatedProducts.length > 0) {
      const mapped = currentProduct.relatedProducts
        .map((slug) => PRODUCTS.find((p) => p.slug === slug))
        .filter((p): p is Product => p !== undefined);
      if (mapped.length > 0) return mapped;
    }

    // Fallback: Pick up to 3 other products from the same category
    return PRODUCTS.filter(
      (p) => p.category === currentProduct.category && p.slug !== currentProduct.slug,
    ).slice(0, 3);
  })();

  if (relatedList.length === 0) return null;

  return (
    <section className="bg-surface-alt/30 py-12 lg:py-16 border-t border-border/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>{t("relatedProducts.crossSell")}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy tracking-tight">
              {t("relatedProducts.title")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Discover biosecure live feeds, specialized hatchery ova, functional feed additives,
              and Mediterranean seafood exports engineered to optimize your operational workflow.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-navy transition-colors shrink-0 group"
          >
            <span>{t("relatedProducts.viewAll")}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedList.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
