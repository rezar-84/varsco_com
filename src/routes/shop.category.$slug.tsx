import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Section, PageHero } from "@/components/layout/Page";
import { StoreProductCard } from "@/components/StoreProductCard";
import { useI18n } from "@/context/I18nContext";
import { loadStoreProducts } from "@/lib/api/store-data";

export const Route = createFileRoute("/shop/category/$slug")({
  loader: async ({ params }) => {
    const { data: allProducts, placeholder } = await loadStoreProducts();

    if (placeholder) {
      return { products: [], categoryName: params.slug, placeholder: true };
    }

    const products = allProducts.filter((p) => p.category.slug === params.slug);
    if (products.length === 0) throw notFound();

    return { products, categoryName: products[0].category.name, placeholder: false };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.categoryName ?? "Category"} — VARS Store` },
      {
        name: "description",
        content: `Order ${loaderData?.categoryName ?? ""} online from VARS Aquaculture.`,
      },
    ],
  }),
  component: ShopCategoryPage,
});

function ShopCategoryPage() {
  const { t } = useI18n();
  const { products, categoryName } = Route.useLoaderData();

  return (
    <>
      <PageHero eyebrow={t("store.category.breadcrumbShop")} title={categoryName} variant="navy">
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
