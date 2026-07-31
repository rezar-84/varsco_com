import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { BlogWidget } from "@/components/BlogWidget";
import {
  ArrowRight,
  Globe2,
  Ship,
  FileCheck2,
  ShieldCheck,
  Snowflake,
  PackageCheck,
} from "lucide-react";
import { getProductsByCategory } from "@/lib/mock/products";
import { ProductCard } from "@/components/ProductCard";
import { AnimatedHorecaMiddleEastMap } from "@/components/visuals/AnimatedHorecaMiddleEastMap";
import { AnimatedGlobalShipping } from "@/components/visuals/AnimatedGlobalShipping";
import turkeyFlagSvg from "@/assets/icons/turkey-flag.svg";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/seafood-export")({
  head: () => ({
    meta: [
      { title: "Seafood Export — From Türkiye to the World | VARS Aquaculture" },
      {
        name: "description",
        content:
          "Premium seafood export from Türkiye to Europe, the Middle East, Far East and North America. ASC, BRC and EU-certified production with full customs and reefer logistics support.",
      },
      {
        property: "og:title",
        content: "Seafood Export — B2B Global Fish Sourcing from Türkiye",
      },
      {
        property: "og:description",
        content:
          "Reliable sourcing, export expertise, compliance management and flexible delivery across Europe, MENA, Asia and North America.",
      },
    ],
  }),
  component: SeafoodExport,
});

const DESTINATIONS = [
  {
    code: "EU",
    titleKey: "export.destinations.card.eu.title",
    bodyKey: "export.destinations.card.eu.body",
    to: "/seafood-export-from-turkey-to-europe" as const,
  },
  {
    code: "NA",
    titleKey: "export.destinations.card.na.title",
    bodyKey: "export.destinations.card.na.body",
    to: "/seafood-export" as const,
  },
  {
    code: "ME",
    titleKey: "export.destinations.card.me.title",
    bodyKey: "export.destinations.card.me.body",
    to: "/seafood-export" as const,
  },
  {
    code: "AS",
    titleKey: "export.destinations.card.as.title",
    bodyKey: "export.destinations.card.as.body",
    to: "/seafood-export" as const,
  },
];

const CAPABILITIES = [
  {
    icon: Ship,
    titleKey: "export.capabilities.item.logistics.title",
    bodyKey: "export.capabilities.item.logistics.body",
  },
  {
    icon: FileCheck2,
    titleKey: "export.capabilities.item.customs.title",
    bodyKey: "export.capabilities.item.customs.body",
  },
  {
    icon: PackageCheck,
    titleKey: "export.capabilities.item.packaging.title",
    bodyKey: "export.capabilities.item.packaging.body",
  },
  {
    icon: ShieldCheck,
    titleKey: "export.capabilities.item.certifications.title",
    bodyKey: "export.capabilities.item.certifications.body",
  },
  {
    icon: Snowflake,
    titleKey: "export.capabilities.item.coldChain.title",
    bodyKey: "export.capabilities.item.coldChain.body",
  },
  {
    icon: Globe2,
    titleKey: "export.capabilities.item.network.title",
    bodyKey: "export.capabilities.item.network.body",
  },
];

const PROCESS = [
  {
    n: "01",
    titleKey: "export.process.step.enquiry.title",
    bodyKey: "export.process.step.enquiry.body",
  },
  {
    n: "02",
    titleKey: "export.process.step.production.title",
    bodyKey: "export.process.step.production.body",
  },
  {
    n: "03",
    titleKey: "export.process.step.delivery.title",
    bodyKey: "export.process.step.delivery.body",
  },
];

function SeafoodExport() {
  const { t } = useI18n();
  const seafood = getProductsByCategory("seafood");

  return (
    <>
      <PageHero
        variant="navy"
        eyebrow={t("export.hero.eyebrow")}
        title={
          <>
            {t("export.hero.title.line1")}{" "}
            <span className="text-mint">{t("export.hero.title.line2")}</span>
          </>
        }
        description={t("export.hero.description")}
      >
        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                asChild
                className="rounded-xl font-bold bg-mint text-navy hover:bg-mint/90 shadow-lg"
              >
                <Link to="/request-quote">
                  {t("export.hero.cta.quote")} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 rounded-xl"
              >
                <Link to="/products/$category" params={{ category: "seafood" }}>
                  {t("export.hero.cta.catalog")}
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-white/80 font-semibold border-t border-white/10 pt-4">
              <span className="flex items-center gap-2 text-mint">
                <img
                  src={turkeyFlagSvg}
                  alt="Flag of Türkiye"
                  className="h-3.5 w-5 rounded object-cover shadow-sm"
                />
                <span>{t("export.hero.badge.izmir")}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-sky-400" />
                <span>{t("export.hero.badge.milas")}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-mint">
                <ShieldCheck className="h-4 w-4" />
                <span>{t("export.hero.badge.certified")}</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <AnimatedGlobalShipping />
          </div>
        </div>
      </PageHero>

      {/* Middle East HORECA Export Corridor Map */}
      <Section>
        <AnimatedHorecaMiddleEastMap />
      </Section>

      {/* Destinations */}
      <Section>
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-[2px] w-8 bg-primary" />{" "}
            {t("export.destinations.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("export.destinations.title")}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((d) => (
            <Link
              key={d.code}
              to={d.to}
              className="card-flat group flex flex-col p-6 transition hover:border-primary"
            >
              <div className="font-display text-5xl font-bold text-primary/20 group-hover:text-primary/40">
                {d.code}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-navy">{t(d.titleKey)}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t(d.bodyKey)}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                {t("export.destinations.learnMore")}{" "}
                <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Capabilities */}
      <Section band>
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-[2px] w-8 bg-primary" />{" "}
            {t("export.capabilities.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("export.capabilities.title")}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <div key={c.titleKey} className="card-flat p-6">
              <c.icon className="h-6 w-6 text-primary" />
              <h4 className="mt-4 font-display text-lg font-semibold text-navy">{t(c.titleKey)}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{t(c.bodyKey)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Seafood products */}
      <Section>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="inline-block h-[2px] w-8 bg-primary" />{" "}
              {t("export.products.eyebrow")}
            </div>
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
              {t("export.products.title")}
            </h2>
          </div>
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link to="/products/$category" params={{ category: "seafood" }}>
              {t("export.products.viewAll")} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {seafood.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section band>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-[2px] w-8 bg-primary" /> {t("export.process.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("export.process.title")}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PROCESS.map((s) => (
            <div key={s.n} className="card-flat p-6">
              <div className="font-display text-5xl font-bold text-primary/20">{s.n}</div>
              <h3 className="mt-3 font-display text-xl font-bold text-navy">{t(s.titleKey)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(s.bodyKey)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Blog widget */}
      <Section>
        <BlogWidget title={t("export.blog.title")} />
      </Section>

      {/* Related links / SEO */}
      <Section band>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="card-flat p-6">
            <h4 className="font-display text-lg font-semibold text-navy">
              {t("export.related.europe.title")}
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">{t("export.related.europe.body")}</p>
            <Link
              to="/seafood-export-from-turkey-to-europe"
              className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-navy"
            >
              {t("export.related.europe.cta")} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="card-flat p-6">
            <h4 className="font-display text-lg font-semibold text-navy">
              {t("export.related.solutions.title")}
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("export.related.solutions.body")}
            </p>
            <Link
              to="/services-solutions"
              className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-navy"
            >
              {t("export.related.solutions.cta")} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="card-flat p-6">
            <h4 className="font-display text-lg font-semibold text-navy">
              {t("export.related.projects.title")}
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("export.related.projects.body")}
            </p>
            <Link
              to="/projects"
              className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-navy"
            >
              {t("export.related.projects.cta")} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      <section className="bg-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center md:px-6">
          <div>
            <h3 className="font-display text-2xl font-bold md:text-3xl">{t("export.cta.title")}</h3>
            <p className="mt-2 text-white/70">{t("export.cta.description")}</p>
          </div>
          <Button size="lg" asChild>
            <Link to="/contactus">{t("export.cta.button")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
