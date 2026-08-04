import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section } from "@/components/layout/Page";
import { BlogWidget } from "@/components/BlogWidget";
import { CATEGORIES, getCategory, getProductsByCategory } from "@/lib/mock/products";
import { translateStoreSsr } from "@/lib/utils/store-i18n";
import { ProductCard } from "@/components/ProductCard";
import { AnimatedCatalogHeader } from "@/components/visuals/AnimatedCatalogHeader";
import { ArrowRight, Package, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/types";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/products/$category/")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { category, products: getProductsByCategory(params.category) };
  },
  head: ({ loaderData }) => {
    // The page body already renders cat.<slug> / cat.<slug>.desc, which are
    // translated in all nine locales; the metadata was still reading the raw
    // English strings off the category record, so every locale shipped an
    // English <title> and description.
    const slug = loaderData?.category?.slug;
    const name = slug
      ? translateStoreSsr(`cat.${slug}`, loaderData?.category?.title ?? "")
      : translateStoreSsr("store.seo.categoryFallback", "Category");
    const desc = slug
      ? translateStoreSsr(`cat.${slug}.desc`, loaderData?.category?.description ?? "")
      : "";
    return {
      meta: [{ title: `${name} | VARS Aquaculture` }, { name: "description", content: desc }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { t } = useI18n();
  const { category, products } = Route.useLoaderData() as {
    category: ProductCategory;
    products: Product[];
  };
  const others = CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* High-Impact Category Hero Banner */}
      <section className="bg-navy text-white relative overflow-hidden py-12 lg:py-16 border-b border-border/80">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link to="/" className="hover:text-mint transition-colors">
              {t("categoryPage.breadcrumb.home")}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/products" className="hover:text-mint transition-colors">
              {t("categoryPage.breadcrumb.catalog")}
            </Link>
            <ChevronRight className="h-3 w-3 text-mint" />
            <span className="text-mint font-bold">{t(`cat.${category.slug}`)}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mint/15 text-mint text-xs font-bold uppercase tracking-widest border border-mint/30">
                <Package className="h-4 w-4" /> {t("categoryPage.badge")}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                {t(`cat.${category.slug}`)}
              </h1>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
                {t(`cat.${category.slug}.desc`)}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-xs text-white/80 font-semibold pt-4 border-t border-white/10">
                <span className="flex items-center gap-1.5 text-mint">
                  <ShieldCheck className="h-4 w-4" /> {t("categoryPage.trust.iso")}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-mint" />{" "}
                  {t("categoryPage.trust.directSupply")}
                </span>
              </div>
            </div>

            {/* Right Animated Vector Visual Column */}
            <div className="lg:col-span-5 w-full">
              <AnimatedCatalogHeader />
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 space-y-16">
        {/* Category Product Grid (3 Wider Columns) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <h2 className="font-display text-2xl font-bold text-navy">
              {t("categoryPage.portfolio.prefix")} {t(`cat.${category.slug}`)}{" "}
              {t("categoryPage.portfolio.suffix")} ({products.length})
            </h2>
            <Link
              to="/request-quote"
              search={{ category: category.slug }}
              className="text-xs font-bold text-primary hover:underline"
            >
              {t("categoryPage.portfolio.bulkQuote")}
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* Other Categories Links */}
        <section className="glass-card rounded-3xl p-8 border border-border/80 bg-surface-alt/70 space-y-6">
          <h2 className="font-display text-2xl font-bold text-navy">
            {t("categoryPage.otherCategories.heading")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((c) => (
              <Link
                key={c.slug}
                to="/products/$category"
                params={{ category: c.slug }}
                className="glass-card group flex items-center justify-between p-5 rounded-2xl bg-background border border-border/80 transition hover:border-primary hover:shadow-lg"
              >
                <div>
                  <h3 className="font-display text-base font-bold text-navy group-hover:text-primary transition-colors">
                    {t(`cat.${c.slug}`)}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {t(`cat.${c.slug}.desc`)}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-surface-alt group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shrink-0 ml-3">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        <section>
          <BlogWidget title={t("categoryPage.blogWidgetTitle")} />
        </section>
      </div>
    </div>
  );
}
