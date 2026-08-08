import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import { AnimatedDecapIllustration } from "@/components/visuals/AnimatedDecapIllustration";
import { AnimatedArtemiaLifecycle } from "@/components/visuals/AnimatedArtemiaLifecycle";
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  BookOpen,
  AlertCircle,
  FlaskConical,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import reviveDecapImg from "@/assets/products/revive-artemia-decap.png";
import { useI18n } from "@/context/I18nContext";
import { getLocalizedMeta } from "@/lib/utils/seo";

export const Route = createFileRoute("/decapsulated-artemia-guide")({
  head: () => ({ meta: getLocalizedMeta("decapGuide") }),
  component: DecapsulatedArtemiaGuide,
});

function DecapsulatedArtemiaGuide() {
  const { t } = useI18n();

  const COMPARISONS = [
    {
      feature: t("guideDecap.comparison.rows.shell.feature"),
      standard: t("guideDecap.comparison.rows.shell.standard"),
      decap: t("guideDecap.comparison.rows.shell.decap"),
    },
    {
      feature: t("guideDecap.comparison.rows.energy.feature"),
      standard: t("guideDecap.comparison.rows.energy.standard"),
      decap: t("guideDecap.comparison.rows.energy.decap"),
    },
    {
      feature: t("guideDecap.comparison.rows.equipment.feature"),
      standard: t("guideDecap.comparison.rows.equipment.standard"),
      decap: t("guideDecap.comparison.rows.equipment.decap"),
    },
    {
      feature: t("guideDecap.comparison.rows.biosecurity.feature"),
      standard: t("guideDecap.comparison.rows.biosecurity.standard"),
      decap: t("guideDecap.comparison.rows.biosecurity.decap"),
    },
    {
      feature: t("guideDecap.comparison.rows.protein.feature"),
      standard: t("guideDecap.comparison.rows.protein.standard"),
      decap: t("guideDecap.comparison.rows.protein.decap"),
    },
    {
      feature: t("guideDecap.comparison.rows.lipids.feature"),
      standard: t("guideDecap.comparison.rows.lipids.standard"),
      decap: t("guideDecap.comparison.rows.lipids.decap"),
    },
  ];

  const SEGMENT_APPLICATIONS = [
    {
      title: t("guideDecap.segments.items.hatcheries.title"),
      desc: t("guideDecap.segments.items.hatcheries.desc"),
    },
    {
      title: t("guideDecap.segments.items.aquariums.title"),
      desc: t("guideDecap.segments.items.aquariums.desc"),
    },
    {
      title: t("guideDecap.segments.items.retail.title"),
      desc: t("guideDecap.segments.items.retail.desc"),
    },
    {
      title: t("guideDecap.segments.items.hobbyists.title"),
      desc: t("guideDecap.segments.items.hobbyists.desc"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("guideDecap.hero.eyebrow")}
        title={t("guideDecap.hero.title")}
        description={t("guideDecap.hero.description")}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/15 text-navy text-xs font-bold uppercase tracking-widest">
              <FlaskConical className="h-3.5 w-3.5 text-mint-ink" /> {t("guideDecap.intro.badge")}
            </div>

            <h2 className="font-display text-3xl font-bold text-navy leading-tight md:text-4xl">
              {t("guideDecap.intro.heading")}
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("guideDecap.intro.paragraph1")}
            </p>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("guideDecap.intro.paragraph2")}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                size="lg"
                asChild
                className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link
                  to="/products/$category/$slug"
                  params={{
                    category: "hatchery-solutions",
                    slug: "decapsulated-dry-artemia-cysts",
                  }}
                >
                  <Zap className="mr-2 h-4 w-4" /> {t("guideDecap.intro.ctaOrder")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl font-bold border-border/80"
              >
                <Link to="/contactus">
                  <MessageCircle className="mr-2 h-4 w-4" /> {t("guideDecap.intro.ctaSamples")}
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Decapsulated Artemia Real Product Image Card */}
            <div className="rounded-3xl p-6 border border-border bg-surface-alt shadow-xl space-y-4 text-center relative overflow-hidden">
              <div className="aspect-square max-w-[280px] mx-auto overflow-hidden rounded-2xl bg-white p-4 border border-border/80 shadow-md">
                <img
                  src={reviveDecapImg}
                  alt={t("guideDecap.productCard.imageAlt")}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {t("guideDecap.productCard.badge")}
                </span>
                <h4 className="font-display text-lg font-bold text-navy">
                  {t("guideDecap.productCard.title")}
                </h4>
                <p className="text-xs text-muted-foreground">{t("guideDecap.productCard.desc")}</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-border/80 shadow-xl bg-background space-y-4">
              <h3 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-mint-ink" /> {t("guideDecap.metrics.title")}
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="glass-card rounded-xl p-3.5 border border-border/60">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">
                    {t("guideDecap.metrics.protein.label")}
                  </div>
                  <div className="text-xl font-bold text-navy mt-1">
                    {t("guideDecap.metrics.protein.value")}
                  </div>
                </div>
                <div className="glass-card rounded-xl p-3.5 border border-border/60">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">
                    {t("guideDecap.metrics.lipids.label")}
                  </div>
                  <div className="text-xl font-bold text-mint-ink mt-1">
                    {t("guideDecap.metrics.lipids.value")}
                  </div>
                </div>
                <div className="glass-card rounded-xl p-3.5 border border-border/60">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">
                    {t("guideDecap.metrics.energy.label")}
                  </div>
                  <div className="text-xl font-bold text-navy mt-1">
                    {t("guideDecap.metrics.energy.value")}
                  </div>
                </div>
                <div className="glass-card rounded-xl p-3.5 border border-border/60">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">
                    {t("guideDecap.metrics.shell.label")}
                  </div>
                  <div className="text-xl font-bold text-emerald-600 mt-1">
                    {t("guideDecap.metrics.shell.value")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <AnimatedDecapIllustration />
      </Section>

      <Section>
        <AnimatedArtemiaLifecycle />
      </Section>

      <Section className="bg-surface-alt/60 py-16 border-y border-border/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-navy text-center mb-8">
            {t("guideDecap.comparison.heading")}
          </h2>

          <div className="glass-card rounded-2xl overflow-hidden border border-border/80 bg-background shadow-md">
            <div className="divide-y divide-border/60">
              <div className="grid grid-cols-3 p-4 bg-navy text-white text-xs font-bold uppercase tracking-wider">
                <div>{t("guideDecap.comparison.headerFeature")}</div>
                <div>{t("guideDecap.comparison.headerStandard")}</div>
                <div className="text-mint">{t("guideDecap.comparison.headerDecap")}</div>
              </div>

              {COMPARISONS.map((row) => (
                <div key={row.feature} className="grid grid-cols-3 p-4 text-xs items-center gap-2">
                  <div className="font-bold text-navy">{row.feature}</div>
                  <div className="text-muted-foreground">{row.standard}</div>
                  <div className="font-bold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                    <span>{row.decap}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl font-bold text-navy">
              {t("guideDecap.segments.heading")}
            </h2>
            <p className="text-muted-foreground text-sm">{t("guideDecap.segments.subheading")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {SEGMENT_APPLICATIONS.map((seg) => (
              <div
                key={seg.title}
                className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-sm space-y-2"
              >
                <h3 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-mint-ink" /> {seg.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{seg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
