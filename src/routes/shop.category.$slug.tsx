import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Section, PageHero } from "@/components/layout/Page";
import { StoreProductCard } from "@/components/StoreProductCard";
import { useI18n } from "@/context/I18nContext";
import { loadStoreProducts } from "@/lib/api/store-data";
import { getStoreT, useStoreT, translateStoreSsr } from "@/lib/utils/store-i18n";

export const Route = createFileRoute("/shop/category/$slug")({
  loader: async ({ params }) => {
    const { data: allProducts, placeholder } = await loadStoreProducts();

    if (placeholder) {
      return { products: [], categoryName: params.slug, placeholder: true };
    }

    const products = allProducts.filter((p) => p.category?.slug === params.slug);
    if (products.length === 0) throw notFound();

    return {
      products,
      categoryName: products[0].category?.name ?? params.slug,
      placeholder: false,
    };
  },
  head: ({ loaderData }) => {
    // categoryName arrives from Odoo in English for every locale, so translate
    // it here too — otherwise the <title> disagrees with the visible heading.
    const raw = loaderData?.categoryName ?? "";
    const name = raw
      ? getStoreT().category(raw)
      : translateStoreSsr("store.seo.categoryFallback", "Category");
    return {
      meta: [
        { title: `${name}${translateStoreSsr("store.seo.titleSuffix", " — VARS Store")}` },
        {
          name: "description",
          content: translateStoreSsr(
            "store.seo.categoryDescription",
            "Order {category} online from VARS Aquaculture.",
          ).replace("{category}", name),
        },
      ],
    };
  },
  component: ShopCategoryPage,
});

function ShopCategoryPage() {
  const { t } = useI18n();
  const st = useStoreT();
  const { products, categoryName } = Route.useLoaderData();
  const localizedCategory = categoryName ? st.category(categoryName) : categoryName;

  return (
    <>
      <PageHero
        eyebrow={t("store.category.breadcrumbShop")}
        title={localizedCategory}
        variant="navy"
      >
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-mint hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("store.category.backToShop")}
        </Link>
      </PageHero>

      <Section>
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <StoreProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4 glass-card rounded-3xl p-8 border border-border">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-display text-xl font-bold text-navy">
              {t("store.category.notFound.title")}
            </h3>
            <p className="text-xs text-muted-foreground">{t("store.category.notFound.body")}</p>
          </div>
        )}
      </Section>
    </>
  );
}
