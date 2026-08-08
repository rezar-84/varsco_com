import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Thermometer,
  Calendar,
  Plane,
  Award,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import { AnimatedOriginSourcing } from "@/components/visuals/AnimatedOriginSourcing";
import { AnimatedLabVerification } from "@/components/visuals/AnimatedLabVerification";
import { AnimatedGlobalShipping } from "@/components/visuals/AnimatedGlobalShipping";
import { getLocalizedMeta } from "@/lib/utils/seo";

export const Route = createFileRoute("/salmonid-ova-solutions")({
  head: () => ({ meta: getLocalizedMeta("salmonOva") }),
  component: SalmonidOvaHubPage,
});

function SalmonidOvaHubPage() {
  const { t } = useI18n();

  const OVA_TYPES = [
    {
      title: t("salmonidOva.types.atlantic.title"),
      species: "Salmo salar",
      desc: t("salmonidOva.types.atlantic.desc"),
      link: "/products/$category/$slug",
      params: { category: "hatchery-solutions", slug: "atlantic-salmon-egg" },
      hatchRate: t("salmonidOva.types.atlantic.hatchRate"),
      tags: [
        t("salmonidOva.types.atlantic.tags.0"),
        t("salmonidOva.types.atlantic.tags.1"),
        t("salmonidOva.types.atlantic.tags.2"),
      ],
    },
    {
      title: t("salmonidOva.types.coho.title"),
      species: "Oncorhynchus kisutch",
      desc: t("salmonidOva.types.coho.desc"),
      link: "/coho-salmon-eggs",
      params: null,
      hatchRate: t("salmonidOva.types.coho.hatchRate"),
      tags: [
        t("salmonidOva.types.coho.tags.0"),
        t("salmonidOva.types.coho.tags.1"),
        t("salmonidOva.types.coho.tags.2"),
      ],
    },
    {
      title: t("salmonidOva.types.trout.title"),
      species: "Oncorhynchus mykiss",
      desc: t("salmonidOva.types.trout.desc"),
      link: "/products/$category/$slug",
      params: { category: "seafood", slug: "rainbow-trout" },
      hatchRate: t("salmonidOva.types.trout.hatchRate"),
      tags: [
        t("salmonidOva.types.trout.tags.0"),
        t("salmonidOva.types.trout.tags.1"),
        t("salmonidOva.types.trout.tags.2"),
      ],
    },
  ];

  const STEPS = [
    {
      n: "01",
      title: t("home.step.01.title"),
      bullets: [t("home.step.01.b1"), t("home.step.01.b2"), t("home.step.01.b3")],
    },
    {
      n: "02",
      title: t("home.step.02.title"),
      bullets: [t("home.step.02.b1"), t("home.step.02.b2"), t("home.step.02.b3")],
    },
    {
      n: "03",
      title: t("home.step.03.title"),
      bullets: [t("home.step.03.b1"), t("home.step.03.b2"), t("home.step.03.b3")],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("salmonidOva.hero.eyebrow")}
        title={t("salmonidOva.hero.title")}
        description={t("salmonidOva.hero.description")}
      />

      <Section>
        <div className="space-y-10 max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display text-3xl font-bold text-navy">
              Complete Salmonid Portfolio
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every batch of ova is produced from SPF certified broodstock, disinfected, and packed
              in temperature-monitored air cargo containers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {OVA_TYPES.map((ova) => (
              <div
                key={ova.title}
                className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {ova.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-teal/20 text-[10px] font-bold text-navy"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-navy">{ova.title}</h3>
                    <p className="text-xs italic font-display text-muted-foreground">
                      {ova.species}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{ova.desc}</p>
                </div>

                <div className="pt-3 border-t border-border/60 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-semibold">
                      Hatching Efficiency:
                    </span>
                    <span className="font-bold text-mint-ink">{ova.hatchRate}</span>
                  </div>

                  <Button
                    size="sm"
                    asChild
                    className="w-full font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {ova.params ? (
                      <Link to={ova.link} params={ova.params}>
                        View Product Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <Link to={ova.link}>
                        Explore Coho Ova <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 3-Step Supply Control Pipeline Section */}
      <Section band className="relative overflow-hidden py-16 lg:py-24">
        {/* Background Decorative Gradient Orbs */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-mint/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto mb-12 max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
            <Workflow className="h-4 w-4 text-primary" /> {t("home.process.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-5xl leading-tight">
            {t("home.process.title")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("home.process.lead")}
          </p>
        </div>

        {/* Pipeline Progress Indicator */}
        <div className="mx-auto max-w-4xl mb-12 hidden md:block">
          <div className="grid grid-cols-3 gap-4 relative">
            <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-border -translate-y-1/2 -z-10" />

            <div className="flex items-center gap-3 bg-background p-3 rounded-2xl border border-border/80 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-navy text-mint font-display font-bold text-sm flex items-center justify-center shrink-0">
                01
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-navy">{t("home.pipeline.01.title")}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {t("home.pipeline.01.subtitle")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-background p-3 rounded-2xl border border-border/80 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-navy text-mint font-display font-bold text-sm flex items-center justify-center shrink-0">
                02
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-navy">{t("home.pipeline.02.title")}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {t("home.pipeline.02.subtitle")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-background p-3 rounded-2xl border border-border/80 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-navy text-mint font-display font-bold text-sm flex items-center justify-center shrink-0">
                03
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-navy">{t("home.pipeline.03.title")}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {t("home.pipeline.03.subtitle")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="space-y-12 max-w-6xl mx-auto">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className={`glass-card rounded-3xl p-6 sm:p-8 border border-border/80 bg-background shadow-lg hover:shadow-xl transition-all duration-300 grid items-center gap-8 md:grid-cols-12 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Vector Visual Column */}
              <div className="md:col-span-6 w-full">
                {i === 0 && <AnimatedOriginSourcing />}
                {i === 1 && <AnimatedLabVerification />}
                {i === 2 && <AnimatedGlobalShipping />}
              </div>

              {/* Text Content Column */}
              <div className="md:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div className="font-display text-4xl font-extrabold text-navy/15 select-none">
                    {t("home.process.phase")} {step.n}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy leading-tight">
                    {step.title}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {step.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                    >
                      <div className="p-1 rounded-lg bg-mint/20 text-navy shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-navy/90 font-medium">{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Technical Telemetry Footer Chip */}
                <div className="p-3.5 rounded-xl bg-surface-alt border border-border/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-navy font-bold">
                    <Zap className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      {i === 0
                        ? t("home.process.footer.01")
                        : i === 1
                          ? t("home.process.footer.02")
                          : t("home.process.footer.03")}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-mint bg-navy px-2 py-0.5 rounded-md">
                    {t("home.process.qualityBadge")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Bottom Guarantee Banner */}
        <div className="mt-12 mx-auto max-w-4xl glass-card rounded-2xl p-6 border border-mint/40 bg-mint/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-navy text-mint shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-navy">
                {t("home.process.guarantee.title")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("home.process.guarantee.body")}
              </div>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/request-quote">
              {t("home.process.guarantee.cta")} <ArrowRight className="ms-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
