import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import { TurkeyAquacultureHeritage } from "@/components/visuals/TurkeyAquacultureHeritage";
import {
  Globe,
  Network,
  Telescope,
  MapPin,
  TrendingUp,
  PackageCheck,
  BrainCircuit,
} from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";
import seabass from "@/assets/seabass.jpg";
import { VarsLogo } from "@/components/layout/VarsLogo";
import { useI18n } from "@/context/I18nContext";

import { getSeoMeta } from "@/lib/utils/seo";

export const Route = createFileRoute("/about-us")({
  head: () => {
    const meta = getSeoMeta("about");
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
      ],
    };
  },
  component: AboutPage,
});

const CAPABILITIES = [
  {
    icon: Telescope,
    titleKey: "about.capabilities.1.title",
    bodyKey: "about.capabilities.1.body",
  },
  {
    icon: Network,
    titleKey: "about.capabilities.2.title",
    bodyKey: "about.capabilities.2.body",
  },
  {
    icon: Globe,
    titleKey: "about.capabilities.3.title",
    bodyKey: "about.capabilities.3.body",
  },
  {
    icon: MapPin,
    titleKey: "about.capabilities.4.title",
    bodyKey: "about.capabilities.4.body",
  },
];

const PILLARS = [
  {
    icon: PackageCheck,
    titleKey: "about.pillars.1.title",
    bodyKey: "about.pillars.1.body",
  },
  {
    icon: TrendingUp,
    titleKey: "about.pillars.2.title",
    bodyKey: "about.pillars.2.body",
  },
  {
    icon: BrainCircuit,
    titleKey: "about.pillars.3.title",
    bodyKey: "about.pillars.3.body",
  },
];

const TIMELINE = [
  {
    year: "2017",
    labelKey: "about.timeline.2017.label",
    bodyKey: "about.timeline.2017.body",
  },
  {
    year: "2018",
    labelKey: "about.timeline.2018.label",
    bodyKey: "about.timeline.2018.body",
  },
  {
    year: "2019",
    labelKey: "about.timeline.2019.label",
    bodyKey: "about.timeline.2019.body",
  },
  {
    year: "2020",
    labelKey: "about.timeline.2020.label",
    bodyKey: "about.timeline.2020.body",
  },
  {
    year: "2023",
    labelKey: "about.timeline.2023.label",
    bodyKey: "about.timeline.2023.body",
  },
  {
    year: "2024",
    labelKey: "about.timeline.2024.label",
    bodyKey: "about.timeline.2024.body",
  },
  {
    year: "2025",
    labelKey: "about.timeline.2025.label",
    bodyKey: "about.timeline.2025.body",
  },
];

function AboutPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("about.hero.eyebrow")}
        title={t("about.hero.title")}
        description={t("about.hero.description")}
      >
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-flat p-5">
            <div className="font-display text-4xl font-bold text-primary">10+</div>
            <p className="mt-1 text-sm text-muted-foreground">{t("about.stats.years.label")}</p>
          </div>
          <div className="card-flat p-5">
            <div className="font-display text-4xl font-bold text-primary">10+</div>
            <p className="mt-1 text-sm text-muted-foreground">{t("about.stats.countries.label")}</p>
          </div>
          <div className="card-flat p-5">
            <div className="font-display text-4xl font-bold text-primary">2017</div>
            <p className="mt-1 text-sm text-muted-foreground">{t("about.stats.since.label")}</p>
          </div>
          <div className="card-flat p-5">
            <div className="font-display text-4xl font-bold text-primary">
              {t("about.stats.group.value")}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t("about.stats.group.label")}</p>
          </div>
        </div>
      </PageHero>

      {/* Brand Identity & Logo Showcase Banner */}
      <Section className="py-10">
        <div className="rounded-3xl p-8 sm:p-10 border border-slate-800 bg-navy text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mint text-navy text-xs font-extrabold uppercase tracking-widest">
              {t("about.brand.badge")}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              VARS Aquaculture <span className="text-mint font-light">San. ve Tic. A.Ş.</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
              {t("about.brand.description.pre")}{" "}
              <strong>{t("about.brand.description.strong")}</strong>.
            </p>
          </div>

          <div className="relative z-10 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shrink-0 flex flex-col items-center gap-3 text-center">
            <VarsLogo variant="white" className="h-14 lg:h-16" />
            <div className="text-[11px] font-mono text-mint font-bold uppercase tracking-wider">
              {t("about.brand.certified")}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="inline-block h-[2px] w-8 bg-primary" />
              {t("about.origins.eyebrow")}
            </div>
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
              {t("about.origins.title")}
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p className="text-base leading-relaxed">{t("about.origins.p1")}</p>
              <p className="text-base leading-relaxed">{t("about.origins.p2")}</p>
              <p className="text-base leading-relaxed">{t("about.origins.p3")}</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border/80 shadow-md">
            <img
              src={heroFarm}
              alt="Aegean aquaculture hub"
              className="h-64 w-full object-cover md:h-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-mint">
                {t("about.origins.imageCaption.eyebrow")}
              </div>
              <div className="font-display text-xl font-bold">
                {t("about.origins.imageCaption.title")}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-[2px] w-8 bg-primary" />
            {t("about.capabilities.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("about.capabilities.title")}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <div key={c.titleKey} className="card-flat p-6">
              <c.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold text-navy">{t(c.titleKey)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(c.bodyKey)}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <TurkeyAquacultureHeritage />
      </Section>

      <Section band>
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-[2px] w-8 bg-primary" />
            {t("about.pillars.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("about.pillars.title")}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.titleKey} className="card-flat p-6">
              <p.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold text-navy">{t(p.titleKey)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(p.bodyKey)}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-[2px] w-8 bg-primary" />
            {t("about.timeline.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("about.timeline.title")}
          </h2>
          <p className="mt-2 text-muted-foreground">2017 — 2025</p>
        </div>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />
          <div className="space-y-8">
            {TIMELINE.map((m, i) => (
              <div
                key={m.year}
                className={`relative flex items-start gap-8 md:items-center ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="hidden w-[calc(50%-3rem)] text-sm md:block" />
                <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-surface font-display text-sm font-bold text-navy shadow-sm">
                  {m.year}
                </div>
                <div className="w-full md:w-[calc(50%-3rem)]">
                  <div className="card-flat p-5">
                    <div className="font-display text-lg font-semibold text-navy">
                      {t(m.labelKey)}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t(m.bodyKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="values-vision" band className="bg-surface-alt/60">
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-[2px] w-8 bg-primary" />
            {t("about.values.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("about.values.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("about.values.lead")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="card-flat p-6 space-y-3 bg-background border border-border/80 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <h3 className="font-display text-base font-bold text-navy">
              {t("about.values.biosecurity.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("about.values.biosecurity.body")}
            </p>
          </div>

          <div className="card-flat p-6 space-y-3 bg-background border border-border/80 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg">
              🌿
            </div>
            <h3 className="font-display text-base font-bold text-navy">
              {t("about.values.sustainability.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("about.values.sustainability.body")}
            </p>
          </div>

          <div className="card-flat p-6 space-y-3 bg-background border border-border/80 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg">
              ⚡
            </div>
            <h3 className="font-display text-base font-bold text-navy">
              {t("about.values.precision.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("about.values.precision.body")}
            </p>
          </div>

          <div className="card-flat p-6 space-y-3 bg-background border border-border/80 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-lg">
              🤝
            </div>
            <h3 className="font-display text-base font-bold text-navy">
              {t("about.values.partnership.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("about.values.partnership.body")}
            </p>
          </div>
        </div>
      </Section>

      <Section id="events" className="py-12 lg:py-16">
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-[2px] w-8 bg-primary" />
            {t("about.events.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("about.events.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("about.events.lead")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {t("about.events.seg.location")}
              </span>
              <span className="text-xs font-mono font-bold text-navy">
                {t("about.events.seg.date")}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-navy">
              {t("about.events.seg.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("about.events.seg.body")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                {t("about.events.ame.location")}
              </span>
              <span className="text-xs font-mono font-bold text-navy">
                {t("about.events.ame.date")}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-navy">
              {t("about.events.ame.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("about.events.ame.body")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 p-6 glass-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 bg-sky-500/10 px-2.5 py-0.5 rounded-full">
                {t("about.events.bisfe.location")}
              </span>
              <span className="text-xs font-mono font-bold text-navy">
                {t("about.events.bisfe.date")}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-navy">
              {t("about.events.bisfe.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("about.events.bisfe.body")}
            </p>
          </div>
        </div>
      </Section>

      <Section band className="bg-navy text-white">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-mint">
              <span className="inline-block h-[2px] w-8 bg-mint" />
              {t("about.group.eyebrow")}
            </div>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              {t("about.group.title")}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/80">{t("about.group.body")}</p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-md border border-white/10 bg-white/5 p-6">
              <div className="font-display text-3xl font-bold text-mint">2025</div>
              <p className="mt-1 text-sm text-white/70">{t("about.group.stat.joined.label")}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 p-6">
              <div className="font-display text-3xl font-bold text-mint">
                {t("about.group.stat.scale.value")}
              </div>
              <p className="mt-1 text-sm text-white/70">{t("about.group.stat.scale.label")}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 p-6">
              <div className="font-display text-3xl font-bold text-mint">
                {t("about.group.stat.coverage.value")}
              </div>
              <p className="mt-1 text-sm text-white/70">{t("about.group.stat.coverage.label")}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 p-6">
              <div className="font-display text-3xl font-bold text-mint">
                {t("about.group.stat.backbone.value")}
              </div>
              <p className="mt-1 text-sm text-white/70">{t("about.group.stat.backbone.label")}</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
