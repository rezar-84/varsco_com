import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Download,
  Plus,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  MessageCircle,
  Maximize2,
  X,
  Sparkles,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Droplets,
  Thermometer,
  Wind,
  Utensils,
  Flame,
  Award,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/layout/Page";
import { AnimatedIncubationCone } from "@/components/visuals/AnimatedIncubationCone";
import { getProduct, getCategory } from "@/lib/mock/products";
import { useCart } from "@/context/CartContext";
import { createWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { Product, ProductCategory } from "@/lib/types";
import { RelatedProductsWidget } from "@/components/RelatedProductsWidget";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/products/$category/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.category, params.slug);
    const category = getCategory(params.category);
    if (!product || !category) throw notFound();
    return { product, category };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const productSchema = product
      ? {
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.title,
          alternateName: product.searchSynonyms ?? [],
          image: product.image ? [product.image] : [],
          description: product.description || product.tagline,
          keywords: (product.seoKeywords ?? []).join(", "),
          category: product.category,
          brand: {
            "@type": "Brand",
            name: "VARS Aquaculture",
          },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            offerCount: "100",
            seller: {
              "@type": "Organization",
              name: "VARS Aquaculture",
            },
          },
        }
      : null;

    const keywordsMeta = product?.seoKeywords?.join(", ") ?? "";

    return {
      meta: [
        { title: `${product?.title ?? "Product"} — VARS Aquaculture B2B` },
        { name: "description", content: product?.tagline ?? "" },
        ...(keywordsMeta ? [{ name: "keywords", content: keywordsMeta }] : []),
        { property: "og:title", content: product?.title ?? "" },
        { property: "og:description", content: product?.tagline ?? "" },
        { property: "og:image", content: product?.image ?? "" },
      ],
      scripts: productSchema
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(productSchema),
            },
          ]
        : [],
    };
  },
  component: ProductDetail,
});

type LoaderData = { product: Product; category: ProductCategory };

function ProductDetail() {
  const { product, category } = Route.useLoaderData() as LoaderData;
  const { t } = useI18n();

  const tp = (field: string, defaultValue: string): string => {
    const key = `product.${product.slug}.${field}`;
    const res = t(key);
    return res === key ? defaultValue : res;
  };

  const tpArray = (field: string, defaultArray: string[]): string[] => {
    const result: string[] = [];
    let idx = 0;
    while (true) {
      const key = `product.${product.slug}.${field}.${idx}`;
      const res = t(key);
      if (res === key) break;
      result.push(res);
      idx++;
    }
    return result.length > 0 ? result : defaultArray;
  };

  const tpSpecs = (defaultSpecs: { label: string; value: string }[]) => {
    return defaultSpecs.map((s, idx) => {
      const labelKey = `product.${product.slug}.specifications.${idx}.label`;
      const valKey = `product.${product.slug}.specifications.${idx}.value`;
      const l = t(labelKey);
      const v = t(valKey);
      return {
        label: l === labelKey ? s.label : l,
        value: v === valKey ? s.value : v,
      };
    });
  };

  const tpMetrics = (defaultMetrics: { label: string; value: string }[]) => {
    return defaultMetrics.map((m, idx) => {
      const labelKey = `product.${product.slug}.metrics.${idx}.label`;
      const valKey = `product.${product.slug}.metrics.${idx}.value`;
      const l = t(labelKey);
      const v = t(valKey);
      return {
        label: l === labelKey ? m.label : l,
        value: v === valKey ? m.value : v,
      };
    });
  };
  const { add, openDrawer } = useCart();
  const [added, setAdded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Combine product main image and gallery images into a unique list
  const allImages = [product.image, ...(product.gallery ?? [])].filter(
    (src, idx, arr): src is string => Boolean(src) && arr.indexOf(src) === idx,
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImage = allImages[activeImageIndex] || product.image;

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, allImages.length]);

  return (
    <>
      <section className="bg-surface-alt/60 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Link to="/products" className="hover:text-navy transition-colors">
              {t("productDetail.breadcrumb.products")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              to="/products/$category"
              params={{ category: category.slug }}
              className="hover:text-navy transition-colors"
            >
              {t(`cat.${category.slug}`)}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-navy font-bold">{tp("title", product.title)}</span>
          </nav>
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-4 md:grid-cols-2 md:px-6">
          <div>
            {/* Main Showcase Image Display Box */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-b from-navy/5 via-surface-alt to-teal/10 shadow-2xl p-6 md:p-8 flex items-center justify-center group">
              {/* Ambient Glow Effects */}
              <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-teal/20 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

              {/* Fullscreen Zoom Trigger - Top Right */}
              {currentImage && (
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label={t("productDetail.gallery.zoomAriaLabel")}
                  className="absolute top-4 right-4 z-10 p-2.5 rounded-2xl bg-white/85 text-navy hover:bg-navy hover:text-white backdrop-blur-md shadow-lg border border-white/80 transition-all scale-95 hover:scale-105 active:scale-95 group/zoom"
                  title={t("productDetail.gallery.zoomTitle")}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              )}

              {/* Main Product Image */}
              {currentImage ? (
                <div
                  className="relative h-full w-full flex items-center justify-center cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={currentImage}
                    alt={tp("title", product.title)}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl transition-all duration-500 group-hover:scale-108 group-hover:-translate-y-1"
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center font-display text-6xl font-bold text-navy/20">
                  {product.title.slice(0, 2)}
                </div>
              )}

              {/* Navigation Arrows overlay */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={t("productDetail.gallery.previousImage")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-navy opacity-80 backdrop-blur-md transition-all hover:bg-navy hover:text-white hover:scale-110 hover:opacity-100 shadow-xl border border-white/50"
                  >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={t("productDetail.gallery.nextImage")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-navy opacity-80 backdrop-blur-md transition-all hover:bg-navy hover:text-white hover:scale-110 hover:opacity-100 shadow-xl border border-white/50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Active Image Indicator Counter */}
                  <div className="absolute bottom-4 right-4 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-mono font-bold text-white backdrop-blur-md shadow-md border border-white/20">
                    {activeImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Gallery Bar */}
            {allImages.length > 1 && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {allImages.map((src, index) => {
                  const isActive = index === activeImageIndex;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative aspect-square w-20 overflow-hidden rounded-2xl border bg-background p-2 shadow-sm transition-all focus:outline-none ${
                        isActive
                          ? "border-primary ring-2 ring-primary/40 scale-105 shadow-md bg-surface-alt"
                          : "border-border/80 hover:border-navy/50 opacity-70 hover:opacity-100 hover:scale-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                      {isActive && (
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-primary rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Fullscreen Lightbox Zoom Modal */}
          {isLightboxOpen && currentImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 z-50 rounded-full bg-white/20 p-3 text-white hover:bg-white hover:text-black transition-all shadow-2xl"
                aria-label={t("productDetail.lightbox.closeAriaLabel")}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="relative max-h-[90vh] max-w-[90vw] flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={tp("title", product.title)}
                  className="max-h-[85vh] max-w-[85vw] object-contain drop-shadow-2xl rounded-2xl"
                />

                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white hover:text-black transition-all"
                    >
                      <ChevronRight className="h-6 w-6 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white hover:text-black transition-all"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-[-2rem] text-center text-xs font-bold text-white/80 font-mono">
                  {tp("title", product.title)} — {activeImageIndex + 1}{" "}
                  {t("productDetail.lightbox.of")} {allImages.length} (
                  {t("productDetail.lightbox.pressEscToClose")})
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-teal/20 px-2.5 py-1 text-xs font-bold text-navy border border-teal/40"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-3xl font-bold text-navy md:text-4xl leading-tight">
                {tp("title", product.title)}
              </h1>
              {product.latinName && (
                <p className="mt-1 font-display italic text-base text-muted-foreground">
                  {product.latinName}
                </p>
              )}
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {tp("tagline", product.tagline)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tpMetrics(product.metrics).map((m) => (
                <div key={m.label} className="glass-card rounded-xl p-4 border border-border/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </div>
                  <div className="mt-1 font-display text-xl font-bold text-navy">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-background p-5 border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-mint font-bold">
                  <ShieldCheck className="h-4 w-4" /> {t("productDetail.badges.labCertified")}
                </span>
                <span className="flex items-center gap-1 font-semibold text-navy">
                  <Zap className="h-3.5 w-3.5 text-primary" />{" "}
                  {t("productDetail.badges.b2bPricing")}
                </span>
              </div>
              <div className="space-y-3 pt-2">
                {/* Tier 1: Main Primary Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    onClick={() => {
                      add(product);
                      openDrawer();
                      setAdded(true);
                      setTimeout(() => setAdded(false), 1500);
                    }}
                    className="rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 py-6 text-base"
                  >
                    {added ? <Check className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                    {added
                      ? t("productDetail.actions.addedToCart")
                      : t("productDetail.actions.addToQuoteCart")}
                  </Button>

                  <a
                    href={createWhatsAppUrl({
                      productTitle: tp("title", product.title),
                      categoryTitle: t(`cat.${category.slug}`),
                      latinName: product.latinName,
                      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5 fill-current" />
                    <span>{t("productDetail.actions.whatsappQuote")}</span>
                  </a>
                </div>

                {/* Tier 2: Sub-Actions Utility Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface-alt/70 border border-border/60 backdrop-blur-sm">
                  <Link
                    to="/request-quote"
                    search={{ product: product.slug, category: product.category }}
                    className="inline-flex items-center gap-2 text-xs font-bold text-navy hover:text-primary transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <span>{t("productDetail.actions.rfqForm")}</span>
                  </Link>

                  {product.pdfUrl && (
                    <a
                      href={product.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-navy hover:text-primary transition-colors border-l border-border/80 pl-3"
                    >
                      <Download className="h-4 w-4 text-emerald-600" />
                      <span>
                        {product.pdfLabel ?? t("productDetail.actions.downloadDatasheet")}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="bg-surface-alt p-1 rounded-xl flex-wrap h-auto gap-1">
            <TabsTrigger value="specs" className="rounded-lg font-bold text-xs">
              {t("productDetail.tabs.specifications")}
            </TabsTrigger>
            {PRODUCT_DETAILED_TABLES[product.slug] && (
              <TabsTrigger value="composition" className="rounded-lg font-bold text-xs">
                {t("productDetail.tabs.composition")}
              </TabsTrigger>
            )}
            {(product.slug === "artemia" || product.slug === "decapsulated-dry-artemia-cysts") && (
              <TabsTrigger value="hatching-protocol" className="rounded-lg font-bold text-xs">
                {t("productDetail.tabs.hatchingProtocol")}
              </TabsTrigger>
            )}
            {product.culinaryInfo && (
              <TabsTrigger value="culinary" className="rounded-lg font-bold text-xs">
                {t("productDetail.tabs.culinary")}
              </TabsTrigger>
            )}
            <TabsTrigger value="apps" className="rounded-lg font-bold text-xs">
              {t("productDetail.tabs.applications")}
            </TabsTrigger>
            <TabsTrigger value="storage" className="rounded-lg font-bold text-xs">
              {t("productDetail.tabs.storage")}
            </TabsTrigger>
            <TabsTrigger value="desc" className="rounded-lg font-bold text-xs">
              {t("productDetail.tabs.description")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="mt-6">
            <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-4">
              <h3 className="font-display text-lg font-bold text-navy">
                {t("productDetail.specs.heading")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {tpSpecs(product.specifications).map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-xl bg-surface-alt/60 border border-border/40"
                  >
                    <span className="text-xs font-semibold text-muted-foreground">{s.label}</span>
                    <span className="text-xs font-bold text-navy">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {PRODUCT_DETAILED_TABLES[product.slug] && (
            <TabsContent value="composition" className="mt-6">
              <div className="space-y-6">
                {PRODUCT_DETAILED_TABLES[product.slug].map((table, tIdx) => (
                  <div
                    key={tIdx}
                    className="rounded-2xl border border-border/80 p-6 glass-card space-y-4"
                  >
                    <h3 className="font-display text-lg font-bold text-navy">{table.title}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-surface-alt text-navy font-bold border-b border-border/60">
                          <tr>
                            {table.headers?.map((h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {table.rows.map((r, rIdx) => (
                            <tr key={rIdx} className="hover:bg-surface-alt/40 transition-colors">
                              <td className="px-4 py-2.5 font-semibold text-navy">{r.col1}</td>
                              <td className="px-4 py-2.5 font-bold text-primary">{r.col2}</td>
                              {r.col3 && <td className="px-4 py-2.5 text-navy/80">{r.col3}</td>}
                              {r.col4 && (
                                <td className="px-4 py-2.5 text-navy font-medium">{r.col4}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {(product.slug === "artemia" || product.slug === "decapsulated-dry-artemia-cysts") && (
            <TabsContent value="hatching-protocol" className="mt-6">
              <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-navy flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      {t("productDetail.hatching.heading")}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("productDetail.hatching.subheading")}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {ARTEMIA_HATCHING_STEPS.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-surface-alt/60 border border-border/50 space-y-2 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                          {s.step}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-navy">{s.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {product.culinaryInfo && (
            <TabsContent value="culinary" className="mt-6">
              <div className="space-y-6">
                {/* Why Choose Section */}
                <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-4">
                  <h3 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    {product.culinaryInfo.whyChooseTitle ??
                      t("productDetail.culinary.whyChooseDefaultTitle")}
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {product.culinaryInfo.whyChoosePoints?.map((pt, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-surface-alt/60 border border-border/40 space-y-1.5"
                      >
                        <h4 className="font-bold text-sm text-navy">{pt.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{pt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flavor & Cooking Grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {product.culinaryInfo.cookingSuggestions && (
                    <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-3">
                      <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        {t("productDetail.culinary.cookingSuggestionsHeading")}
                      </h3>
                      <ul className="space-y-2 text-xs">
                        {product.culinaryInfo.cookingSuggestions.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-navy font-medium">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.culinaryInfo.flavorProfile && (
                    <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-3">
                      <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        {t("productDetail.culinary.flavorProfileHeading")}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {product.culinaryInfo.flavorProfile}
                      </p>
                    </div>
                  )}
                </div>

                {/* Size Groups Table */}
                {product.culinaryInfo.sizeGroups && (
                  <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-4">
                    <h3 className="font-display text-lg font-bold text-navy">
                      {t("productDetail.culinary.sizeGroupsHeading")}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-surface-alt text-navy font-bold border-b border-border/60">
                          <tr>
                            <th className="px-4 py-3">
                              {t("productDetail.culinary.sizeGroupCol")}
                            </th>
                            <th className="px-4 py-3">
                              {t("productDetail.culinary.weightRangeCol")}
                            </th>
                            <th className="px-4 py-3">
                              {t("productDetail.culinary.primaryApplicationCol")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {product.culinaryInfo.sizeGroups.map((sg, idx) => (
                            <tr key={idx} className="hover:bg-surface-alt/40 transition-colors">
                              <td className="px-4 py-2.5 font-semibold text-navy">{sg.group}</td>
                              <td className="px-4 py-2.5 font-bold text-primary">{sg.weight}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {sg.application}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          <TabsContent value="apps" className="mt-6">
            <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-4">
              <h3 className="font-display text-lg font-bold text-navy">
                {t("productDetail.applications.heading")}
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3 text-xs">
                {tpArray("applications", product.applications).map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 p-3 rounded-xl bg-surface-alt/60 border border-border/40 font-medium text-navy"
                  >
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="storage">
            <div className="glass-card rounded-2xl mt-4 p-6 border border-border/80 text-xs leading-relaxed text-navy/80 space-y-4">
              <p className="font-semibold text-navy">{tp("storage", product.storage)}</p>
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-surface-alt border border-border/60">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">
                    {t("productDetail.storage.coldChainTempLabel")}
                  </div>
                  <div className="font-bold text-navy text-xs mt-1">
                    {t("productDetail.storage.coldChainTempValue")}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-alt border border-border/60">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">
                    {t("productDetail.storage.logisticsModeLabel")}
                  </div>
                  <div className="font-bold text-navy text-xs mt-1">
                    {t("productDetail.storage.logisticsModeValue")}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-alt border border-border/60">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">
                    {t("productDetail.storage.documentationLabel")}
                  </div>
                  <div className="font-bold text-navy text-xs mt-1">
                    {t("productDetail.storage.documentationValue")}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="desc">
            <div className="glass-card rounded-2xl mt-4 p-6 border border-border/80 space-y-4 text-xs leading-relaxed text-navy/80">
              <p className="font-medium text-sm leading-relaxed text-navy">{product.description}</p>
              {product.longDescription?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Section>

      {/* Product FAQ & Incubation Guide Widget Section */}
      <Section className="border-t border-border/60 pt-16 mt-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* FAQ Accordion Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4" /> {t("productDetail.faq.eyebrow")}
              </span>
              <h2 className="font-display text-2xl font-bold text-navy">
                {t("productDetail.faq.heading")}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("productDetail.faq.introPrefix")} {tp("title", product.title)}.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {(PRODUCT_FAQS[product.slug] || DEFAULT_FAQS).map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="glass-card rounded-xl px-5 border border-border/80"
                >
                  <AccordionTrigger className="text-left font-display text-sm font-semibold text-navy hover:no-underline py-4">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Dynamic Technical & Hatchery Widget Column */}
          {(() => {
            const widget = getProductWidgetData(product);
            return (
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-card rounded-3xl border border-primary/20 bg-gradient-to-b from-teal/10 via-background to-navy/5 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                    <BookOpen className="h-4 w-4 text-mint" />
                    <span>{widget.badge}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-navy">{widget.title}</h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {widget.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-2 text-xs">
                    <div className="p-3 rounded-xl bg-background/80 border border-border/60">
                      <div className="text-muted-foreground text-[10px] font-semibold">
                        {widget.metric1Label}
                      </div>
                      <div className="font-bold text-navy text-xs mt-0.5">
                        {widget.metric1Value}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-background/80 border border-border/60">
                      <div className="text-muted-foreground text-[10px] font-semibold">
                        {widget.metric2Label}
                      </div>
                      <div className="font-bold text-navy text-xs mt-0.5">
                        {widget.metric2Value}
                      </div>
                    </div>
                  </div>

                  <Link to={widget.linkTo} className="w-full block">
                    <Button className="w-full rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 text-xs cursor-pointer">
                      <span>{widget.buttonText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  {widget.secondaryLinkTo && (
                    <Link
                      to={widget.secondaryLinkTo}
                      className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      {widget.secondaryLinkText} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </Section>

      <RelatedProductsWidget currentProduct={product} />
    </>
  );
}

const PRODUCT_FAQS: Record<string, Array<{ q: string; a: string }>> = {
  artemia: [
    {
      q: "What are the optimal hatching parameters for Revive Artemia Cysts?",
      a: "For optimal ≥ 85% hatch rates, maintain water salinity at 25–35 ppt (g/L), temperature at 28–30 °C, pH between 8.0–8.5, and provide continuous strong bottom aeration under 2,000 Lux light.",
    },
    {
      q: "How many hours does full Artemia hatch-out take?",
      a: "Under recommended conditions (28–30 °C), initial hatching begins at 15–18 hours, reaching maximum hatch-out efficiency within 20–24 hours.",
    },
    {
      q: "Where can I view the step-by-step incubation procedure?",
      a: "Our complete incubation manual, including tank density, aeration setup, and nauplii separation, is available in the Artemia Incubation Guide.",
    },
  ],
  "decapsulated-dry-artemia-cysts": [
    {
      q: "Do decapsulated Artemia cysts require incubation or hatching?",
      a: "No hatching is required! Decapsulated cysts have the indigestible outer shell removed and can be fed directly to larvae and post-larvae with zero shell contamination.",
    },
    {
      q: "What is the nutritional value compared to live nauplii?",
      a: "Decapsulated cysts retain 100% of their embryonic energy reserves (61% protein, 24.5% lipids, 502 kcal/100g), delivering higher caloric value than hatched nauplii.",
    },
  ],
  "super-fresh-chlorella-v12": [
    {
      q: "What makes Super Fresh Chlorella V12 different from dry algae powders?",
      a: "SV-12 is 100% live, fresh liquid Chlorella concentrate (14 billion cells/ml) shipped under continuous 2–6 °C cold chain. Cell walls remain intact and live, delivering maximum DHA/EPA/B12 bio-availability to rotifer and fish larval cultures.",
    },
    {
      q: "How does SV-12 accelerate rotifer culture multiplication?",
      a: "The live 2–4 µm cell size and rich lipid profile allow rotifers to achieve up to 8-fold population multiplication within 3 days without settling or fouling culture water.",
    },
  ],
  "emerald-chlorella-powder": [
    {
      q: "How is Emerald Chlorella Powder reconstituted in hatchery tanks?",
      a: "Mix 50–100 g per 1,000 L of hatchery water under continuous aeration. High Vitamin B12 (1000 µg/100g) and 60.6% protein content provide excellent green-water conditioning and copepod enrichment.",
    },
  ],
  "atlantic-salmon-egg": [
    {
      q: "How are fertilized salmon eggs delivered while preserving biosecurity?",
      a: "Salmon ova are shipped in temperature-controlled insulated containers with continuous digital temperature loggers maintaining 4–8 °C throughout air transport.",
    },
    {
      q: "What incubation water temperature is recommended upon arrival?",
      a: "Transfer eyed salmon eggs into incubation trays supplied with clean, well-oxygenated freshwater maintained at 4–8 °C.",
    },
  ],
  "coho-salmon-egg": [
    {
      q: "Are Coho salmon eggs certified disease-free?",
      a: "Yes, all Coho salmon eggs are SPF certified and tested free of IPNV, VHSV, and IHNV pathogens under strict biosecurity protocols.",
    },
  ],
  "vital-wheat-gluten": [
    {
      q: "What is the binding strength and water stability of VARS Vital Wheat Gluten?",
      a: "With ≥ 150% water absorption capacity and ≥ 82% protein content, it forms a cohesive viscoelastic matrix that prevents pellet disintegration and nutrient leaching in extruded fish and shrimp diets.",
    },
    {
      q: "Is VARS Vital Wheat Gluten suitable for marine finfish and shrimp feeds?",
      a: "Yes, it is widely used as a highly digestible plant protein binder in salmonid, sea bass, sea bream, and shrimp feeds to replace expensive synthetic binders.",
    },
  ],
  "fish-meal": [
    {
      q: "What pelagic species are used in VARS Steam-Dried Fish Meal?",
      a: "Sourced from wild-caught pelagic species and trimmings under strict IFFO-RS and EU sustainability standards, delivering 55–65% crude protein and balanced essential amino acids.",
    },
  ],
  "potato-protein-meal": [
    {
      q: "How much fish meal can be substituted with VARS Potato Protein Meal in aquafeed?",
      a: "Trial data shows up to 20% of marine fish meal can be replaced in sea bass and sea bream diets while maintaining equivalent feed conversion ratios (FCR) and 92% protein digestibility.",
    },
  ],
  "krill-meal-bio-additives": [
    {
      q: "Does Krill Meal enhance fillet pigmentation in salmon and trout?",
      a: "Yes! Rich in natural astaxanthin (≥ 150 ppm) bound to marine phospholipids, it enhances flesh color, immune resilience, and feeding response in broodstock and fry.",
    },
  ],
  "mediterranean-sea-bass": [
    {
      q: "What product forms are available for wholesale export of Mediterranean Sea Bass?",
      a: "We export Whole Round, Descaled & Gutted (D&G), Dressed, and Fresh/Frozen Fillets in standard sizes (300–400g, 400–600g, 600–800g, 800–1000g+).",
    },
    {
      q: "What cold-chain logistics options are used for EU & MENA delivery?",
      a: "Shipped in styrofoam boxes with gel packs or flake ice via temperature-controlled air freight (0–2 °C) or reefer trucks (−18 °C for frozen).",
    },
  ],
  "mediterranean-sea-bream": [
    {
      q: "Are VARS Mediterranean Sea Bream certified by ASC and GlobalG.A.P.?",
      a: "Yes, all sea bream are cultured in open-sea cages with pristine water exchange, certified compliant with ASC and GlobalG.A.P export standards.",
    },
  ],
  "brown-meagre": [
    {
      q: "What is the flavor and culinary profile of VARS Brown Meagre (Sciaena umbra)?",
      a: "Brown Meagre offers a mild, sweet flavor and firm white flesh with low fat and high protein content (18g/100g), ideal for whole fish grilling, salt-crust roasting, and fine dining fillets.",
    },
  ],
  amberjack: [
    {
      q: "Is VARS Amberjack (Seriola dumerili) suitable for raw sashimi applications?",
      a: "Yes, our Turkey-origin Greater Amberjack is harvested under strict biosecurity protocols and immediate slush-ice chilling, providing sashimi-grade firm texture for HORECA and fine dining.",
    },
  ],
  "olive-flounder": [
    {
      q: "How is Olive Flounder (Paralichthys olivaceus) packaged for air freight?",
      a: "Shipped fresh on ice or live in oxygen-injected marine containers, engineered for 52-week continuous supply to high-end sushi restaurants and distributors.",
    },
  ],
  "rainbow-trout": [
    {
      q: "What product forms and sizes are available for Rainbow Trout export?",
      a: "Available whole round, gutted, and filleted (200–300g portion size up to 1kg+ executive cuts) for smoking, retail, and HORECA supply.",
    },
  ],
};

const DEFAULT_FAQS = [
  {
    q: "What is the typical minimum order quantity (MOQ)?",
    a: "MOQs depend on the product category: 1 carton for live feed, 50,000 for salmon eggs, and 500 kg for seafood export orders.",
  },
  {
    q: "How do you ensure cold-chain & biosecurity during shipment?",
    a: "Every shipment is packed in temperature-monitored, insulated containers with data loggers to ensure zero quality degradation during transit.",
  },
  {
    q: "Can I request technical datasheets and certificates of analysis (CoA)?",
    a: "Yes! Full technical specification sheets, laboratory analysis reports, and origin certificates are provided upon quote request.",
  },
];

const ARTEMIA_HATCHING_STEPS = [
  {
    step: "Step 1",
    title: "Prepare Incubation Solution",
    content:
      "Prepare a saline solution using sea salt at 28–30 ppt (g/L) or UV/ozone treated filtered seawater. Adjust pH to 7.9–8.5 (add 2 g Sodium Bicarbonate NaHCO₃ per liter if pH is lower). Maintain water temperature at 27–29 °C.",
  },
  {
    step: "Step 2",
    title: "Prepare Decapsulation Solution",
    content:
      "Standard ratio for 454 g (1 lb) of dry cysts: use 1.5 L Sodium Hypochlorite (NaOCl - 10% active chlorine) combined with 34–50 ml saturated NaOH solution.",
  },
  {
    step: "Step 3",
    title: "Hydration Phase",
    content:
      "Place dry Artemia cysts in clean freshwater under strong aeration for 1 hour at 20–25 °C. Hydration is complete when cysts change from biconcave disk shape to fully spherical.",
  },
  {
    step: "Step 4",
    title: "First Decapsulation Bath",
    content:
      "Transfer hydrated cysts into 0.75 L of decapsulation solution. Stir continuously for 25–40 minutes until the outer brown shell dissolves and turns bright orange.",
  },
  {
    step: "Step 5",
    title: "Separation & Washing",
    content:
      "Immediately strain the decapsulated embryos through a 125 µm sieve mesh and rinse thoroughly with clean tap water or seawater to remove residual chlorine.",
  },
  {
    step: "Step 6",
    title: "Second Decapsulation (Optional)",
    content:
      "If shell fragments remain, perform a brief 3–5 minute secondary wash bath in diluted NaOCl solution before final rinsing.",
  },
  {
    step: "Step 7",
    title: "Chemical Dechlorination & Activation",
    content:
      "Neutralize active chlorine by dipping strained cysts into a 0.1% sodium thiosulfate (Na₂S₂O₃) or ascorbic acid solution for 1 minute.",
  },
  {
    step: "Step 8",
    title: "Conical Reactor Incubation",
    content:
      "Transfer activated cysts into a conical hatching vessel filled with 28–30 ppt seawater at 28–30 °C. Provide continuous bottom aeration and 2,000 Lux continuous light for 20–24 hours.",
  },
  {
    step: "Step 9",
    title: "Harvesting & Nauplii Collection",
    content:
      "Turn off aeration for 10–15 minutes. Empty shells float to the surface while live phototactic nauplii concentrate at the bottom light source for easy siphoning.",
  },
];

interface TableCategory {
  title: string;
  rows: Array<{ col1: string; col2: string; col3?: string; col4?: string }>;
  headers?: string[];
}

const PRODUCT_DETAILED_TABLES: Record<string, TableCategory[]> = {
  "super-fresh-chlorella-v12": [
    {
      title: "Nutritional Composition (per 100g dry net weight)",
      headers: ["Component", "Amount"],
      rows: [
        { col1: "Protein", col2: "54.80%" },
        { col1: "Fat (Lipids)", col2: "13.20%" },
        { col1: "Fibre", col2: "0.50%" },
        { col1: "CHO (Carbohydrates)", col2: "24.30%" },
        { col1: "Ash (Minerals)", col2: "7.20%" },
      ],
    },
    {
      title: "Essential Minerals",
      headers: ["Mineral", "Amount (mg/100g)"],
      rows: [
        { col1: "Calcium (Ca)", col2: "250 mg" },
        { col1: "Magnesium (Mg)", col2: "240 mg" },
        { col1: "Iron (Fe)", col2: "150 mg" },
        { col1: "Potassium (K)", col2: "1,000 mg" },
        { col1: "Phosphorus (P)", col2: "1,950 mg" },
      ],
    },
    {
      title: "Fatty Acid Profile (Total Lipid: 22.1%)",
      headers: ["Fatty Acid", "Lipid No.", "% of Lipids"],
      rows: [
        { col1: "Myristic Acid", col2: "C14:0", col3: "0.60%" },
        { col1: "Palmitic Acid", col2: "C16:0", col3: "14.40%" },
        { col1: "Palmitoleic Acid", col2: "C16:1", col3: "2.00%" },
        { col1: "Hexadecadienoic Acid", col2: "C16:2", col3: "8.10%" },
        { col1: "Stearic Acid", col2: "C18:0", col3: "0.60%" },
        { col1: "Linoleic Acid (ω6)", col2: "C18:2", col3: "18.80%" },
        { col1: "Linolenic Acid (ω3)", col2: "C18:3", col3: "13.70%" },
        { col1: "EPA (Eicosapentaenoic)", col2: "C20:5", col3: "8.50%" },
        { col1: "DPA (Docosapentaenoic)", col2: "C22:5", col3: "4.00%" },
        { col1: "DHA (Docosahexaenoic)", col2: "C22:6", col3: "15.00%" },
      ],
    },
    {
      title: "Vitamins & Bioactive Compounds",
      headers: ["Compound", "Concentration"],
      rows: [
        { col1: "Vitamin B12", col2: "> 320 µg/l (0.4 mg/100g)" },
        { col1: "Vitamin B2 (Riboflavin)", col2: "6.5 mg/100g" },
        { col1: "Vitamin B6", col2: "1.0 mg/100g" },
        { col1: "Vitamin C", col2: "51 mg/100g" },
        { col1: "Niacin", col2: "20 mg/100g" },
        { col1: "γ-Tocopherol (Vitamin E)", col2: "19 mg/100g" },
        { col1: "Chlorophyll", col2: "2.6 mg/100g" },
        { col1: "Carotene", col2: "68 mg/100g" },
        { col1: "Xanthophyll", col2: "92 mg/100g" },
        { col1: "Inositol", col2: "200 mg/100g" },
        { col1: "Choline", col2: "350 mg/100g" },
      ],
    },
    {
      title: "Amino Acid Profile",
      headers: ["Amino Acid", "g / 100g"],
      rows: [
        { col1: "Arginine", col2: "2.82 g" },
        { col1: "Lysine", col2: "2.82 g" },
        { col1: "Histidine", col2: "1.05 g" },
        { col1: "Phenylalanine", col2: "4.80 g" },
        { col1: "Tyrosine", col2: "1.51 g" },
        { col1: "Leucine", col2: "3.92 g" },
        { col1: "Isoleucine", col2: "1.98 g" },
        { col1: "Methionine", col2: "0.55 g" },
        { col1: "Valine", col2: "2.87 g" },
        { col1: "Alanine", col2: "3.70 g" },
        { col1: "Glycine", col2: "2.95 g" },
        { col1: "Proline", col2: "1.60 g" },
        { col1: "Glutamic Acid", col2: "7.35 g" },
        { col1: "Serine", col2: "1.89 g" },
        { col1: "Threonine", col2: "2.06 g" },
        { col1: "Aspartic Acid", col2: "4.37 g" },
        { col1: "Tryptophan", col2: "1.04 g" },
        { col1: "Cystine", col2: "0.51 g" },
      ],
    },
    {
      title: "Lipid Classes Distribution",
      headers: ["Class", "Proportion"],
      rows: [
        { col1: "Glycolipid", col2: "36%" },
        { col1: "Phospholipid", col2: "25%" },
        { col1: "Neutral Lipid", col2: "36%" },
      ],
    },
  ],
  artemia: [
    {
      title: "Guaranteed Physical & Hatching Specifications",
      headers: ["Component", "Value"],
      rows: [
        { col1: "Moisture Content", col2: "< 9.0%" },
        { col1: "Crude Protein", col2: "55.0%" },
        { col1: "Crude Fat", col2: "12.0%" },
        { col1: "Cysts Per Gram (CPG)", col2: "210,000" },
        { col1: "Guaranteed Hatching Rate", col2: "Min 85%" },
        { col1: "Harvest Lakes Origin", col2: "VARS Salt Lakes (700t wet / 400t dry annual)" },
      ],
    },
    {
      title: "Omega-3 Essential Fatty Acid Profile",
      headers: ["Fatty Acid", "Lipid No.", "% of Lipids", "mg / 100g"],
      rows: [
        { col1: "Alpha-Linolenic Acid (ALA)", col2: "C18:3", col3: "24.8%", col4: "3,931.7 mg" },
        { col1: "Eicosapentaenoic Acid (EPA)", col2: "C20:5", col3: "6.5%", col4: "1,028.7 mg" },
        { col1: "Docosahexaenoic Acid (DHA)", col2: "C22:6", col3: "0.1%", col4: "20.8 mg" },
      ],
    },
    {
      title: "Omega-6 Essential Fatty Acid Profile",
      headers: ["Fatty Acid", "Lipid No.", "% of Lipids", "mg / 100g"],
      rows: [
        { col1: "Linoleic Acid (LA)", col2: "C18:2", col3: "5.3%", col4: "834.0 mg" },
        { col1: "Arachidonic Acid (AA)", col2: "C20:4", col3: "1.0%", col4: "160.4 mg" },
      ],
    },
  ],
  "decapsulated-dry-artemia-cysts": [
    {
      title: "Decapsulated Shell-Free Specifications",
      headers: ["Parameter", "Laboratory Standard"],
      rows: [
        { col1: "Form", col2: "Dry shell-free decapsulated cysts" },
        { col1: "Chorion Shell Content", col2: "0% (Zero shell contamination)" },
        { col1: "Light & Heavy Impurities", col2: "0% Light / 0% Heavy" },
        { col1: "Moisture Control", col2: "4.0 – 5.0%" },
        { col1: "Crude Protein", col2: "61.0%" },
        { col1: "Crude Fat", col2: "24.5%" },
        { col1: "Caloric Energy Density", col2: "502 kcal / 100g" },
      ],
    },
  ],
};

const AQUARIUM_TARGETED_SLUGS = ["artemia", "decapsulated-dry-artemia-cysts"];

function getProductWidgetData(product: Product) {
  const aquariumCallout = AQUARIUM_TARGETED_SLUGS.includes(product.slug)
    ? {
        secondaryLinkTo: "/aquariums-and-hobbyists",
        secondaryLinkText: "Also perfect for aquariums & reef tanks",
      }
    : {};

  const isChlorellaProduct =
    product.slug === "emerald-chlorella-powder" || product.slug === "super-fresh-chlorella-v12";

  if (isChlorellaProduct) {
    return {
      badge: "Live Feed Protocol Widget",
      title: "Rotifer & Microalgae Culture Protocol",
      description:
        "Chlorella is the direct feed source for rotifer cultures — access green-water dosing guidance, cell density targets, and stocking parameters for consistent, high-density rotifer production.",
      metric1Label: "Cell/Nutrient Density",
      metric1Value:
        product.metrics.find((m) => m.label.toLowerCase().includes("density"))?.value ??
        product.metrics.find((m) => m.label.includes("Protein"))?.value ??
        "See specifications",
      metric2Label: "Feeds",
      metric2Value: "Rotifer & copepod cultures",
      linkTo: "/artemia-cysts-incubation-guide",
      buttonText: "View Live Feed Protocol Guide",
      ...aquariumCallout,
    };
  }

  if (
    product.category === "live-feed-aquaculture" ||
    product.slug === "decapsulated-dry-artemia-cysts"
  ) {
    return {
      badge: "Live Feed Protocol Widget",
      title: "Artemia Hatching Protocol",
      description:
        "Access step-by-step scientific incubation parameters — salinity standards (25–35 ppt), temperature limits (28–30 °C), and hatching-cone setup — for consistent, high-yield Artemia nauplii. Artemia is fed directly to fish and shrimp larvae, a separate stage from rotifer culture.",
      metric1Label: "Salinity Standard",
      metric1Value: "25 – 35 ppt",
      metric2Label: "Hatch Temperature",
      metric2Value: "28 – 30 °C",
      linkTo: "/artemia-cysts-incubation-guide",
      buttonText: "View Artemia Incubation Manual",
      ...aquariumCallout,
    };
  }

  if (product.category === "hatchery-solutions") {
    return {
      badge: "Hatchery Ova Widget",
      title: "Salmon Ova Incubation & Cold-Chain Protocol",
      description:
        "Explore SPF disease-free salmon ova incubation tray protocols, temperature data logging, smolt vigor optimization, and biosecurity transport.",
      metric1Label: "Incubation Water Temp",
      metric1Value: "4 – 8 °C",
      metric2Label: "Eyed Hatch Rate",
      metric2Value: "≥ 95% Certified",
      linkTo: "/salmonid-ova-solutions",
      buttonText: "View Salmonid Ova Hatchery Guide",
    };
  }

  if (product.category === "feed-additives") {
    return {
      badge: "Feed Technical Widget",
      title: "Aquafeed Formulation & Extrusion Guide",
      description:
        "Review inclusion rate guidelines, protein digestibility parameters (≥ 92%), water absorption binding (≥ 150%), and pellet stability protocols.",
      metric1Label: "Protein Content",
      metric1Value: product.metrics.find((m) => m.label.includes("Protein"))?.value || "55–82%",
      metric2Label: "Binding / Digestibility",
      metric2Value: "High Extrusion Rank",
      linkTo: "/services-solutions",
      buttonText: "View Feed Formulations & Solutions",
    };
  }

  // Seafood Export category
  return {
    badge: "Seafood Logistics Widget",
    title: "Cold-Chain Preservation & HORECA Supply",
    description: `Explore 52-week continuous harvest cycles, ASC & GlobalG.A.P biosecurity standards, and temperature-logged fresh/frozen delivery for ${product.title}.`,
    metric1Label: "Fresh Storage Temp",
    metric1Value: "0 °C – 2 °C",
    metric2Label: "Deep Freeze Standard",
    metric2Value: "−18 °C",
    linkTo: "/horeca-seafood-middle-east",
    buttonText: "View HORECA & Trade Logistics Guide",
  };
}
