import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShoppingBag, Filter, X } from "lucide-react";
import { Section, PageHero } from "@/components/layout/Page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StoreProductCard } from "@/components/StoreProductCard";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { loadStoreProducts } from "@/lib/api/store-data";

export const Route = createFileRoute("/shop/")({
  loader: async () => {
    const { data, placeholder } = await loadStoreProducts();
    return { products: data, placeholder };
  },
  head: () => ({
    meta: [
      { title: "Store — VARS Aquaculture B2B" },
      {
        name: "description",
        content:
          "Order certified aquaculture feed, hatchery inputs, and Mediterranean seafood directly online with live pricing and stock.",
      },
    ],
  }),
  component: ShopIndex,
});

function ShopIndex() {
  const { t } = useI18n();
  const { products, placeholder } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    products.forEach((p) =>
      map.set(p.category.slug, { slug: p.category.slug, name: p.category.name }),
    );
    return Array.from(map.values());
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesCat = activeCat === "all" || p.category.slug === activeCat;
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || `${p.name} ${p.summary}`.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <>
      <PageHero
        eyebrow={t("store.badge")}
        title={
          <>
            {t("store.hero.title.a")}{" "}
            <span className="text-primary">{t("store.hero.title.b")}</span>
          </>
        }
        description={t("store.hero.lead")}
        variant="navy"
      />

      <Section>
        {placeholder || products.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center max-w-xl mx-auto border border-border/80 shadow-md space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-display text-xl font-bold text-navy">
              {t("store.comingSoon.title")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("store.comingSoon.body")}</p>
            <Button asChild className="rounded-xl font-bold">
              <a href="/products">{t("store.comingSoon.browsePortfolio")}</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="glass-card rounded-3xl p-6 border border-border/80 bg-background shadow-md space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-lg font-bold text-navy">
                    {t("store.toolbar.title")}
                  </h2>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("store.toolbar.searchPlaceholder")}
                    className="pl-10 pr-8 h-10 rounded-xl border-border/80 bg-background text-xs font-medium shadow-sm"
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
                  {t("store.filter.allProducts")} ({products.length})
                </button>
                {categories.map((c) => {
                  const count = products.filter((p) => p.category.slug === c.slug).length;
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
                      {c.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("store.results.prefix")} {filtered.length} {t("store.results.suffix")}
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <StoreProductCard key={p.slug} product={p} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 space-y-4 glass-card rounded-3xl p-8 border border-border">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="font-display text-xl font-bold text-navy">
                  {t("store.empty.title")}
                </h3>
                <p className="text-xs text-muted-foreground">{t("store.empty.body")}</p>
                <Button
                  onClick={() => {
                    setQuery("");
                    setActiveCat("all");
                  }}
                  variant="outline"
                  className="rounded-xl font-bold"
                >
                  {t("store.empty.cta")}
                </Button>
              </div>
            )}
          </div>
        )}
      </Section>
    </>
  );
}
