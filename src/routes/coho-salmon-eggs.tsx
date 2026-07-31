import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import { AnimatedSalmonOvaCycle } from "@/components/visuals/AnimatedSalmonOvaCycle";
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Thermometer,
  Calendar,
  Plane,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/coho-salmon-eggs")({
  head: () => ({
    meta: [
      { title: "Coho Fertilized Salmon Eggs (Oncorhynchus kisutch) — SPF Certified Ova | VARS" },
      {
        name: "description",
        content:
          "SPF certified fertilized Coho Salmon eggs (Oncorhynchus kisutch) for RAS and cold-water hatcheries. High hatching rate (≥ 95%), rapid early fry growth, disease-free status, and air-freight logistics.",
      },
    ],
  }),
  component: CohoSalmonEggsPage,
});

function CohoSalmonEggsPage() {
  const { t } = useI18n();

  const METRICS = [
    {
      label: t("cohoSalmon.metrics.hatchingRate.label"),
      value: t("cohoSalmon.metrics.hatchingRate.value"),
    },
    {
      label: t("cohoSalmon.metrics.healthStatus.label"),
      value: t("cohoSalmon.metrics.healthStatus.value"),
    },
    { label: t("cohoSalmon.metrics.ploidy.label"), value: t("cohoSalmon.metrics.ploidy.value") },
    {
      label: t("cohoSalmon.metrics.airShipmentTemp.label"),
      value: t("cohoSalmon.metrics.airShipmentTemp.value"),
    },
  ];

  const ADVANTAGES = [
    {
      title: t("cohoSalmon.advantages.rapidGrowth.title"),
      desc: t("cohoSalmon.advantages.rapidGrowth.desc"),
    },
    {
      title: t("cohoSalmon.advantages.spfStatus.title"),
      desc: t("cohoSalmon.advantages.spfStatus.desc"),
    },
    {
      title: t("cohoSalmon.advantages.rasAdaptability.title"),
      desc: t("cohoSalmon.advantages.rasAdaptability.desc"),
    },
    {
      title: t("cohoSalmon.advantages.tempLogged.title"),
      desc: t("cohoSalmon.advantages.tempLogged.desc"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("cohoSalmon.hero.eyebrow")}
        title={t("cohoSalmon.hero.title")}
        description={t("cohoSalmon.hero.description")}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/15 text-navy text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-mint" /> {t("cohoSalmon.badge")}
            </div>

            <h2 className="font-display text-3xl font-bold text-navy leading-tight md:text-4xl">
              {t("cohoSalmon.section.heading")}
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("cohoSalmon.section.paragraph")}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className="glass-card rounded-xl p-3.5 border border-border/80 bg-background shadow-sm"
                >
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">
                    {m.label}
                  </div>
                  <div className="text-xl font-bold text-navy mt-1">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Button
                size="lg"
                asChild
                className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/request-quote">
                  <MessageCircle className="mr-2 h-4 w-4" /> {t("cohoSalmon.cta.requestQuote")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl font-bold border-border/80"
              >
                <Link to="/salmonid-ova-solutions">
                  {t("cohoSalmon.cta.exploreHub")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <AnimatedSalmonOvaCycle />

            <div className="glass-card rounded-2xl p-6 border border-border/80 shadow-xl bg-background space-y-4">
              <h3 className="font-display text-lg font-bold text-navy">
                {t("cohoSalmon.whyChoose.heading")}
              </h3>
              <div className="space-y-3 pt-2">
                {ADVANTAGES.map((adv) => (
                  <div key={adv.title} className="space-y-0.5 text-xs">
                    <div className="font-bold text-navy flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                      <span>{adv.title}</span>
                    </div>
                    <p className="text-muted-foreground pl-5 leading-normal">{adv.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
