import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShoppingBag, X, SlidersHorizontal } from "lucide-react";
import { Section, PageHero } from "@/components/layout/Page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoreProductCard } from "@/components/StoreProductCard";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { loadStoreProducts } from "@/lib/api/store-data";
import { formatPrice } from "@/lib/utils/price";
import type { CatalogItemSummary } from "@/lib/api/types";

type SortOption = "featured" | "name-asc" | "price-asc" | "price-desc";

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

function priceBoundsOf(products: CatalogItemSummary[]): [number, number] {
  const amounts = products
    .map((p) => p.purchase?.amount)
    .filter((n): n is number => typeof n === "number");
  if (amounts.length === 0) return [0, 0];
  return [Math.floor(Math.min(...amounts)), Math.ceil(Math.max(...amounts))];
}

function currencyOf(products: CatalogItemSummary[]): string {
  return products.find((p) => p.purchase)?.purchase?.currency ?? "USD";
}

function ShopIndex() {
  const { t } = useI18n();
  const { products, placeholder } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const fullPriceBounds = useMemo(() => priceBoundsOf(products), [products]);
  const productsCurrency = useMemo(() => currencyOf(products), [products]);
  const [priceRange, setPriceRange] = useState<[number, number]>(fullPriceBounds);
  const hasPriceFilter = fullPriceBounds[0] !== fullPriceBounds[1];

  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    products.forEach((p) => {
      if (p.category) map.set(p.category.slug, { slug: p.category.slug, name: p.category.name });
    });
    return Array.from(map.values());
  }, [products]);

  const toggleCategory = (slug: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const clearAllFilters = () => {
    setQuery("");
    setSelectedCats(new Set());
    setInStockOnly(false);
    setSortBy("featured");
    setPriceRange(fullPriceBounds);
  };

  const hasActiveFilters =
    query !== "" ||
    selectedCats.size > 0 ||
    inStockOnly ||
    (hasPriceFilter &&
      (priceRange[0] !== fullPriceBounds[0] || priceRange[1] !== fullPriceBounds[1]));

  const filtered = useMemo(() => {
    const matches = products.filter((p) => {
      const matchesCat =
        selectedCats.size === 0 || (p.category && selectedCats.has(p.category.slug));
      const q = query.toLowerCase().trim();
      const matchesQuery = !q || `${p.name} ${p.summary}`.toLowerCase().includes(q);
      const matchesStock = !inStockOnly || Boolean(p.purchase?.available);
      const amount = p.purchase?.amount;
      const matchesPrice =
        !hasPriceFilter ||
        amount === undefined ||
        (amount >= priceRange[0] && amount <= priceRange[1]);
      return matchesCat && matchesQuery && matchesStock && matchesPrice;
    });

    const sorted = [...matches];
    const priceOf = (p: CatalogItemSummary) => p.purchase?.amount ?? Number.POSITIVE_INFINITY;
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        sorted.sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => priceOf(b) - priceOf(a));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, selectedCats, query, inStockOnly, sortBy, hasPriceFilter, priceRange]);

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
          <div className="grid gap-8 lg:grid-cols-[260px_1fr] items-start">
            <aside className="glass-card rounded-3xl border border-border/80 bg-background shadow-md p-6 space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-base font-bold text-navy">
                    {t("store.filter.heading")}
                  </h2>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    {t("store.filter.clearAll")}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("store.filter.categoriesHeading")}
                </h3>
                <div className="space-y-2">
                  {categories.map((c) => {
                    const count = products.filter((p) => p.category?.slug === c.slug).length;
                    return (
                      <label
                        key={c.slug}
                        className="flex items-center justify-between gap-2 cursor-pointer group"
                      >
                        <span className="flex items-center gap-2 text-xs font-semibold text-navy/80 group-hover:text-navy">
                          <Checkbox
                            checked={selectedCats.has(c.slug)}
                            onCheckedChange={() => toggleCategory(c.slug)}
                          />
                          {c.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {hasPriceFilter && (
                <div className="space-y-3 border-t border-border/60 pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("store.filter.priceHeading")}
                  </h3>
                  <Slider
                    min={fullPriceBounds[0]}
                    max={fullPriceBounds[1]}
                    step={1}
                    value={priceRange}
                    onValueChange={(v) => setPriceRange(v as [number, number])}
                  />
                  <div className="flex items-center justify-between text-[11px] font-bold text-navy">
                    <span>
                      {formatPrice({ amount: priceRange[0], currency: productsCurrency })}
                    </span>
                    <span>
                      {formatPrice({ amount: priceRange[1], currency: productsCurrency })}
                    </span>
                  </div>
                </div>
              )}

              <div className="border-t border-border/60 pt-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-navy/80 cursor-pointer">
                  <Switch checked={inStockOnly} onCheckedChange={setInStockOnly} />
                  {t("store.filter.inStockOnly")}
                </label>
              </div>
            </aside>

            <div className="space-y-6 min-w-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
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

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-full sm:w-56 h-10 rounded-xl border-border/80 bg-background text-xs font-semibold shrink-0">
                    <SelectValue placeholder={t("store.sort.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">{t("store.sort.featured")}</SelectItem>
                    <SelectItem value="name-asc">{t("store.sort.nameAsc")}</SelectItem>
                    <SelectItem value="price-asc">{t("store.sort.priceAsc")}</SelectItem>
                    <SelectItem value="price-desc">{t("store.sort.priceDesc")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("store.results.prefix")} {filtered.length} {t("store.results.suffix")}
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                    onClick={clearAllFilters}
                    variant="outline"
                    className="rounded-xl font-bold"
                  >
                    {t("store.empty.cta")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
