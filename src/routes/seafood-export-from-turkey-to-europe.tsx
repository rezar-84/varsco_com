import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/layout/Page";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Snowflake,
  Thermometer,
  Building2,
  Truck,
  Users,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/mock/products";
import heroCages from "@/assets/aegean-fish-cages.jpg";
import { useI18n } from "@/context/I18nContext";
import { getLocalizedMeta } from "@/lib/utils/seo";

export const Route = createFileRoute("/seafood-export-from-turkey-to-europe")({
  head: () => ({ meta: getLocalizedMeta("seafoodEurope") }),
  component: EUExportPage,
});

/**
 * Species shown are read from the catalogue rather than restated here, so the
 * trade name, the scientific name and the photo cannot drift away from the
 * product pages this section links to.
 */
const SPECIES = [
  { category: "seafood", slug: "mediterranean-sea-bass" },
  { category: "seafood", slug: "mediterranean-sea-bream" },
  { category: "seafood", slug: "brown-meagre" },
  { category: "seafood", slug: "amberjack" },
] as const;

const AUDIENCE = [
  { icon: Building2, key: "importers" },
  { icon: Truck, key: "distributors" },
  { icon: Users, key: "horeca" },
  { icon: Globe2, key: "traders" },
] as const;

function EUExportPage() {
  const { t } = useI18n();

  /** Product-scoped translation, matching ProductCard and the product detail page. */
  const tp = (slug: string, field: string, fallback: string): string => {
    const key = `product.${slug}.${field}`;
    const res = t(key);
    return res === key ? fallback : res;
  };

  const species = SPECIES.map((s) => getProduct(s.category, s.slug)).filter(
    (p): p is NonNullable<typeof p> => !!p,
  );

  // Five items, all of them things a shipment actually carries. The previous
  // six included transit-time guarantees and certification claims that were
  // not backed, and were removed rather than reworded.
  const compliance = ["cert1", "cert2", "cert3", "cert4", "cert5"] as const;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <img
          src={heroCages}
          alt={t("exportEurope.hero.imageAlt")}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/92 to-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/60" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-mint">
              <span className="inline-block h-[2px] w-8 bg-mint" />
              {t("exportEurope.hero.eyebrow")}
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {t("exportEurope.hero.title")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {t("exportEurope.hero.description")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                asChild
                className="rounded-xl bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20"
              >
                <Link to="/request-quote">
                  <MessageCircle className="me-2 h-4 w-4" /> {t("exportEurope.cta.quote")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl border-white/25 bg-white/10 font-bold text-white hover:bg-white/20"
              >
                <Link to="/products/$category" params={{ category: "seafood" }}>
                  {t("exportEurope.cta.browse")} <ArrowRight className="ms-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Species available for export */}
      <Section>
        <div className="mx-auto mb-12 max-w-3xl space-y-3 text-center">
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("exportEurope.species.heading")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("exportEurope.species.intro")}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {species.map((p) => (
            <Link
              key={p.slug}
              to="/products/$category/$slug"
              params={{ category: p.category, slug: p.slug }}
              className="card-flat group flex flex-col overflow-hidden transition hover:border-primary"
            >
              <div className="aspect-[4/3] overflow-hidden bg-surface-alt">
                <img
                  src={p.image}
                  alt={tp(p.slug, "title", p.title)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-base font-bold text-navy group-hover:text-primary">
                  {tp(p.slug, "title", p.title)}
                </h3>
                {/* Scientific name adjacent to the trade name, per the species
                    ruling in doc/translation_agents.md §3b. */}
                {p.latinName && (
                  <p className="mt-1 text-xs font-medium italic text-muted-foreground">
                    {p.latinName}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center text-xs font-bold text-primary">
                  {t("exportEurope.species.viewProduct")}
                  <ArrowRight className="ms-1 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("exportEurope.species.onRequest")}
        </p>

        {/* Formats and the two caveats that keep this honest: what ships is
            seasonal, and the spec is agreed per buyer rather than promised here. */}
        <div className="mt-10 rounded-2xl border border-border/80 bg-surface-alt p-6">
          <h3 className="font-display text-lg font-bold text-navy">
            {t("exportEurope.formats.heading")}
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs font-bold text-navy">
              <Thermometer className="h-4 w-4 text-primary" /> {t("exportEurope.formats.fresh")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs font-bold text-navy">
              <Snowflake className="h-4 w-4 text-primary" /> {t("exportEurope.formats.frozen")}
            </span>
          </div>
          <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
            <li>· {t("exportEurope.formats.seasonalNote")}</li>
            <li>· {t("exportEurope.formats.specsNote")}</li>
          </ul>
        </div>
      </Section>

      {/* Who this is for */}
      <Section band>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("exportEurope.audience.heading")}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map((a) => (
            <div key={a.key} className="card-flat p-6">
              <a.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-display text-base font-bold text-navy">
                {t(`exportEurope.audience.${a.key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`exportEurope.audience.${a.key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Compliance and documentation */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="space-y-4 lg:col-span-5">
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
              {t("exportEurope.compliance.title")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("exportEurope.compliance.desc")}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card space-y-3 rounded-2xl border border-border/80 bg-background p-6 shadow-md">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
                <ShieldCheck className="h-5 w-5 text-mint" />{" "}
                {t("exportEurope.compliance.listTitle")}
              </h3>
              {compliance.map((c) => (
                <div key={c} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <span className="font-bold text-navy">{t(`exportEurope.${c}.title`)}: </span>
                    <span className="text-muted-foreground">{t(`exportEurope.${c}.desc`)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Why Türkiye */}
      <Section band>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-6">
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
              {t("exportEurope.whyTurkey.heading")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("exportEurope.whyTurkey.body")}
            </p>
            <Button asChild variant="outline" className="rounded-xl font-bold">
              <Link to="/seafood-export">
                {t("exportEurope.whyTurkey.otherMarkets")} <ArrowRight className="ms-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="lg:col-span-6">
            <ul className="space-y-3">
              {(["proximity", "infrastructure", "production", "partner"] as const).map((k) => (
                <li key={k} className="flex items-start gap-3 rounded-xl bg-background p-4 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                  <div>
                    <span className="font-bold text-navy">
                      {t(`exportEurope.whyTurkey.${k}.title`)}:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {t(`exportEurope.whyTurkey.${k}.body`)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
