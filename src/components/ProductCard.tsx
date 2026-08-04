import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  const tp = (field: string, defaultValue: string): string => {
    const key = `product.${product.slug}.${field}`;
    const res = t(key);
    return res === key ? defaultValue : res;
  };
  // Same key scheme the detail route uses (product.<slug>.<field>.<idx>[.label|.value]),
  // so a tag or metric reads identically on the card and on the detail page.
  const tpTag = (idx: number, fallback: string) => tp(`tags.${idx}`, fallback);
  const tpMetric = (idx: number, part: "label" | "value", fallback: string) =>
    tp(`metrics.${idx}.${part}`, fallback);

  return (
    <div className="group relative glass-card rounded-3xl flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/60 hover:shadow-2xl bg-background border border-border/80">
      {/* Stretched link: makes the whole card clickable/tappable, not just the title text */}
      <Link
        to="/products/$category/$slug"
        params={{ category: product.category, slug: product.slug }}
        className="absolute inset-0 z-0"
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* Media Header - 4:3 Aspect Ratio */}
      <Link
        to="/products/$category/$slug"
        params={{ category: product.category, slug: product.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-surface-alt/80 p-3 flex items-center justify-center"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={tp("title", product.title)}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-display font-bold text-navy/10">
            {product.title.slice(0, 2)}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Pill Badge */}
        <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-navy/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
          {t(`cat.${product.category}`)}
        </div>

        {/* Quality Guarantee Seal */}
        <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 rounded-full bg-mint text-navy px-2.5 py-0.5 text-[10px] font-extrabold shadow-md">
          <ShieldCheck className="h-3 w-3" /> {t("productCard.certified")}
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-navy group-hover:text-primary transition-colors leading-snug">
            <Link
              to="/products/$category/$slug"
              params={{ category: product.category, slug: product.slug }}
            >
              {tp("title", product.title)}
            </Link>
          </h3>

          {product.latinName && (
            <p className="text-xs italic font-medium text-primary/80 mt-0.5">{product.latinName}</p>
          )}
        </div>

        <p className="flex-1 text-xs text-navy/80 leading-relaxed line-clamp-2 font-normal">
          {tp("tagline", product.tagline)}
        </p>

        {/* Metrics Bar */}
        {product.metrics && product.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {product.metrics.slice(0, 2).map((m, mi) => (
              <div
                key={m.label}
                className="p-2 rounded-xl bg-surface-alt/80 border border-border/60 text-center"
              >
                <div className="font-display text-xs font-bold text-navy">
                  {tpMetric(mi, "value", m.value)}
                </div>
                <div className="text-[9px] text-muted-foreground font-semibold truncate">
                  {tpMetric(mi, "label", m.label)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tag Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.tags.slice(0, 2).map((t, ti) => (
            <span
              key={t}
              className="rounded-lg bg-navy/5 px-2.5 py-0.5 text-[10px] font-extrabold text-navy/90 border border-navy/10"
            >
              #{tpTag(ti, t)}
            </span>
          ))}
        </div>

        {/* Action Button Bar */}
        <div className="relative z-10 pt-4 border-t border-border/60">
          <Button
            size="sm"
            asChild
            className="w-full rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Link
              to="/request-quote"
              search={{ product: product.slug, category: product.category }}
            >
              {t("productCard.quote")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
