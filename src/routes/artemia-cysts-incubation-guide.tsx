import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import { AnimatedIncubationCone } from "@/components/visuals/AnimatedIncubationCone";
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import { getLocalizedMeta } from "@/lib/utils/seo";

export const Route = createFileRoute("/artemia-cysts-incubation-guide")({
  head: () => ({ meta: getLocalizedMeta("artemiaGuide") }),
  component: ArtemiaIncubationGuide,
});

function ArtemiaIncubationGuide() {
  const { t } = useI18n();

  const PARAMETERS = [
    {
      icon: Droplets,
      title: t("guideIncubation.parameters.items.salinity.title"),
      target: t("guideIncubation.parameters.items.salinity.target"),
      desc: t("guideIncubation.parameters.items.salinity.desc"),
    },
    {
      icon: Thermometer,
      title: t("guideIncubation.parameters.items.temperature.title"),
      target: t("guideIncubation.parameters.items.temperature.target"),
      desc: t("guideIncubation.parameters.items.temperature.desc"),
    },
    {
      icon: Wind,
      title: t("guideIncubation.parameters.items.aeration.title"),
      target: t("guideIncubation.parameters.items.aeration.target"),
      desc: t("guideIncubation.parameters.items.aeration.desc"),
    },
    {
      icon: Sun,
      title: t("guideIncubation.parameters.items.light.title"),
      target: t("guideIncubation.parameters.items.light.target"),
      desc: t("guideIncubation.parameters.items.light.desc"),
    },
  ];

  const STEPS = [
    {
      step: "01",
      title: t("guideIncubation.steps.items.step1.title"),
      desc: t("guideIncubation.steps.items.step1.desc"),
    },
    {
      step: "02",
      title: t("guideIncubation.steps.items.step2.title"),
      desc: t("guideIncubation.steps.items.step2.desc"),
    },
    {
      step: "03",
      title: t("guideIncubation.steps.items.step3.title"),
      desc: t("guideIncubation.steps.items.step3.desc"),
    },
    {
      step: "04",
      title: t("guideIncubation.steps.items.step4.title"),
      desc: t("guideIncubation.steps.items.step4.desc"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("guideIncubation.hero.eyebrow")}
        title={t("guideIncubation.hero.title")}
        description={t("guideIncubation.hero.description")}
      />

      <Section>
        <div className="space-y-10 max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display text-3xl font-bold text-navy">
              Optimal Hatching Parameters
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Achieving consistent high hatching efficiency requires strict control of environmental
              factors in conical hatching tanks.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PARAMETERS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="glass-card rounded-2xl p-5 border border-border/80 bg-background shadow-sm space-y-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-teal/20 text-navy flex items-center justify-center font-bold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy">{p.title}</h3>
                  <div className="text-sm font-bold text-mint-ink">{p.target}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section>
        <AnimatedIncubationCone />
      </Section>

      <Section className="bg-surface-alt/60 py-16 border-y border-border/60">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-display text-2xl font-bold text-navy text-center">
            4-Step Hatchery Operating Procedure
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-sm flex items-start gap-4"
              >
                <div className="font-display text-3xl font-bold text-mint-ink shrink-0">{s.step}</div>
                <div>
                  <h3 className="font-display text-base font-bold text-navy">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button
              size="lg"
              asChild
              className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link
                to="/products/$category/$slug"
                params={{ category: "live-feed-aquaculture", slug: "artemia" }}
              >
                <Zap className="mr-2 h-4 w-4" /> View Revive Artemia Cyst Specs
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
