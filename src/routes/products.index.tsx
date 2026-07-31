import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/layout/Page";
import { CATEGORIES, PRODUCTS } from "@/lib/mock/products";
import { ProductCard } from "@/components/ProductCard";
import { AnimatedCatalogHeader } from "@/components/visuals/AnimatedCatalogHeader";
import { Input } from "@/components/ui/input";
import { Search, Package, ShieldCheck, Globe2, Filter, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";

import { getSeoMeta } from "@/lib/utils/seo";

export const Route = createFileRoute("/products/")({
  head: () => {
    const meta = getSeoMeta("products");
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
      ],
    };
  },
  component: Catalog,
});

function Catalog() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = PRODUCTS.filter((p) => {
    const matchesCat = activeCat === "all" || p.category === activeCat;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      [
        p.title,
        p.tagline,
        p.category,
        p.latinName ?? "",
        ...(p.tags ?? []),
        ...(p.seoKeywords ?? []),
        ...(p.searchSynonyms ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* High-Impact Hero Banner */}
      <section className="bg-navy text-white relative overflow-hidden py-12 lg:py-16 border-b border-border/80">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mint/15 text-mint text-xs font-bold uppercase tracking-widest border border-mint/30">
                <Package className="h-4 w-4" /> {t("catalog.badge")}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {t("catalog.title.a")}{" "}
                <span className="text-mint font-light">{t("catalog.title.b")}</span>
              </h1>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
                {t("catalog.lead")}
              </p>

              {/* Key Metric Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-display text-xl font-bold text-mint">0% Shells</div>
                  <div className="text-[11px] font-semibold text-white/70 mt-0.5">
                    {t("catalog.stat1.label")}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-display text-xl font-bold text-white">4.0 °C</div>
                  <div className="text-[11px] font-semibold text-white/70 mt-0.5">
                    {t("catalog.stat2.label")}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-display text-xl font-bold text-mint">10+</div>
                  <div className="text-[11px] font-semibold text-white/70 mt-0.5">
                    {t("catalog.stat3.label")}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-display text-xl font-bold text-white">100%</div>
                  <div className="text-[11px] font-semibold text-white/70 mt-0.5">
                    {t("catalog.stat4.label")}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Animated Vector Visual Column */}
            <div className="lg:col-span-5 w-full">
              <AnimatedCatalogHeader />
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 space-y-8">
        {/* Search & Category Filter Toolbar */}
        <div className="glass-card rounded-3xl p-6 border border-border/80 bg-background shadow-md space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-bold text-navy">
                {t("catalog.filter.title")}
              </h2>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("catalog.filter.searchPlaceholder")}
                className="pl-10 pr-8 h-10 rounded-xl border-border/80 bg-background text-xs font-medium placeholder:text-muted-foreground placeholder:font-normal focus:border-primary shadow-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCat("all")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeCat === "all"
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-surface-alt text-navy/80 hover:bg-muted hover:text-navy border border-border/60",
              )}
            >
              {t("catalog.filter.allProducts")} ({PRODUCTS.length})
            </button>
            {CATEGORIES.map((c) => {
              const count = PRODUCTS.filter((p) => p.category === c.slug).length;
              return (
                <button
                  key={c.slug}
                  onClick={() => setActiveCat(c.slug)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                    activeCat === c.slug
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-surface-alt text-navy/80 hover:bg-muted hover:text-navy border border-border/60",
                  )}
                >
                  {t(`cat.${c.slug}`)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Count Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("catalog.results.prefix")} {filtered.length} {t("catalog.results.suffix")}
          </span>
          {activeCat !== "all" && (
            <button
              onClick={() => setActiveCat("all")}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              {t("catalog.results.reset")}
            </button>
          )}
        </div>

        {/* Wider 3-Column Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-4 glass-card rounded-3xl p-8 border border-border">
            <Package className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-display text-xl font-bold text-navy">{t("catalog.empty.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("catalog.empty.body")}</p>
            <Button
              onClick={() => {
                setQuery("");
                setActiveCat("all");
              }}
              variant="outline"
              className="rounded-xl font-bold"
            >
              {t("catalog.empty.cta")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
