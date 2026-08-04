import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Fish,
  Egg,
  Leaf,
  Truck,
  ShieldCheck,
  Globe2,
  Award,
  Star,
  Package,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/Page";
import { BlogWidget } from "@/components/BlogWidget";
import { AnimatedSalmonOvaCycle } from "@/components/visuals/AnimatedSalmonOvaCycle";
import { CATEGORIES } from "@/lib/mock/products";
import { useI18n } from "@/context/I18nContext";
import salmonEggs from "@/assets/salmon-eggs.jpg";
import artemia from "@/assets/artemia-in-spoon.jpg";
import chlorella from "@/assets/chlorella.jpg";
import sv12ProductImg from "@/assets/products/super-fresh-chlorella-sv12.png";
import heroFarm from "@/assets/hero-farm.jpg";
import reviveDecap from "@/assets/products/revive-artemia-decap.png";

const HERO_SLIDES = [
  {
    src: heroFarm,
    alt: "Aquaculture Farm",
    eyebrowKey: "home.eyebrow",
    titleAKey: "home.hero.title.a",
    titleBKey: "home.hero.title.b",
    leadKey: "home.hero.lead",
  },
  {
    src: salmonEggs,
    alt: "Salmon Eggs / Ova",
    eyebrowKey: "home.hero.slide2.eyebrow",
    titleAKey: "home.hero.slide2.title.a",
    titleBKey: "home.hero.slide2.title.b",
    leadKey: "home.hero.slide2.lead",
  },
  {
    src: artemia,
    alt: "Artemia Cysts",
    eyebrowKey: "home.hero.slide3.eyebrow",
    titleAKey: "home.hero.slide3.title.a",
    titleBKey: "home.hero.slide3.title.b",
    leadKey: "home.hero.slide3.lead",
  },
  {
    src: chlorella,
    alt: "Chlorella Algae",
    eyebrowKey: "home.hero.slide4.eyebrow",
    titleAKey: "home.hero.slide4.title.a",
    titleBKey: "home.hero.slide4.title.b",
    leadKey: "home.hero.slide4.lead",
  },
];

// Partner/Client logo imports
import partnerPtaqua from "@/assets/partners/ptaqua.png";
import partnerIlknak from "@/assets/partners/ilknak.png";
import partnerNordzee from "@/assets/partners/nordzee.png";
import partnerGumusdoga from "@/assets/partners/gumusdoga.png";
import partnerAbaliaqua from "@/assets/partners/abaliaqua.png";
import partnerKilic from "@/assets/partners/kilic.png";
import partnerRevive from "@/assets/partners/revive.png";
import partnerSursan from "@/assets/partners/sursan.png";

import { getSeoMeta } from "@/lib/utils/seo";

export const Route = createFileRoute("/")({
  head: () => {
    const meta = getSeoMeta("home");
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
      ],
    };
  },
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const SEGMENTS = [
    { icon: Egg, label: t("home.seg.hatchery") },
    { icon: Fish, label: t("home.seg.livefeed") },
    { icon: Leaf, label: t("home.seg.additives") },
    { icon: Truck, label: t("home.seg.export") },
  ];

  const WHY_US = [
    { icon: ShieldCheck, title: t("home.why.1.title"), body: t("home.why.1.body") },
    { icon: Globe2, title: t("home.why.2.title"), body: t("home.why.2.body") },
    { icon: Award, title: t("home.why.3.title"), body: t("home.why.3.body") },
    { icon: Truck, title: t("home.why.4.title"), body: t("home.why.4.body") },
  ];

  const PARTNERS = [
    { name: "PT Aqua", logo: partnerPtaqua },
    { name: "Kılıç Deniz", logo: partnerKilic },
    { name: "Abalıoğlu Aqua", logo: partnerAbaliaqua },
    { name: "Nordzee", logo: partnerNordzee },
    { name: "İlknak", logo: partnerIlknak },
    { name: "Gümüşdoğa", logo: partnerGumusdoga },
    { name: "Sürsan", logo: partnerSursan },
    { name: "Revive", logo: partnerRevive },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        {HERO_SLIDES.map((img, idx) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
              idx === currentHeroIndex
                ? "opacity-65 scale-100 pointer-events-auto"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
            width={1920}
            height={1080}
          />
        ))}
        {/* Navigation dots for the hero slider */}
        <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2.5 md:left-[8%] md:translate-x-0 md:bottom-28">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentHeroIndex ? "w-8 bg-mint" : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        {/* Gradients to ensure text readability while keeping the image clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-navy/60 to-transparent pointer-events-none" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 md:grid-cols-2 md:px-6 md:py-32">
          <div className="space-y-6 flex flex-col justify-center">
            <div key={currentHeroIndex} className="contents">
              <div className="inline-flex items-center gap-3 rounded-full border border-mint/40 bg-mint/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-mint w-fit animate-fade-in-up">
                <Star className="h-3.5 w-3.5 fill-mint" />
                {t(HERO_SLIDES[currentHeroIndex].eyebrowKey)}
              </div>
              <h1 className="font-display text-5xl font-bold leading-[1.05] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] md:text-6xl lg:text-7xl animate-fade-in-up [animation-delay:150ms] fill-mode-both">
                {t(HERO_SLIDES[currentHeroIndex].titleAKey)}{" "}
                <span className="text-mint">{t(HERO_SLIDES[currentHeroIndex].titleBKey)}</span>
              </h1>
              <p className="max-w-xl text-lg font-medium text-white/95 animate-fade-in-up [animation-delay:300ms] fill-mode-both">
                {t(HERO_SLIDES[currentHeroIndex].leadKey)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 animate-fade-in-up [animation-delay:450ms] fill-mode-both">
              <Button size="lg" asChild>
                <Link to="/products">
                  {t("home.hero.cta.primary")} <ArrowRight className="ms-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/60 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
              >
                <Link to="/contactus">{t("home.hero.cta.secondary")}</Link>
              </Button>
            </div>
          </div>

          {/* Right column: Interactive Visual Showcase & Telemetry Panel */}
          <div className="relative flex items-center justify-center lg:pl-10 animate-fade-in-up [animation-delay:600ms] fill-mode-both">
            {/* Background ambient glowing balls */}
            <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
            <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-mint/15 blur-3xl animate-pulse-glow [animation-delay:2s]" />

            {/* Main Interactive Telemetry Board */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-md animate-float">
              {/* Scanline overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mint/[0.02] to-transparent opacity-60 pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint"></span>
                  </span>
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-mint">
                    {t("home.telemetry.title")}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/50">
                  {t("home.telemetry.batch")}
                </span>
              </div>

              {/* Progress items */}
              <div className="mt-5 space-y-4">
                {/* Salmon Egg tracking */}
                <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3.5 transition-all hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{t("home.telemetry.item1.name")}</span>
                    <span className="text-mint">{t("home.telemetry.item1.status")}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-mint rounded-full transition-all duration-1000"
                      style={{ width: "75%" }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-white/60 font-mono">
                    <span>{t("home.telemetry.item1.temp")}</span>
                    <span>{t("home.telemetry.item1.eta")}</span>
                  </div>
                </div>

                {/* Artemia feed tracking */}
                <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3.5 transition-all hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{t("home.telemetry.item2.name")}</span>
                    <span className="text-mint">{t("home.telemetry.item2.status")}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-mint rounded-full transition-all duration-1000"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-white/60 font-mono">
                    <span>{t("home.telemetry.item2.hatch")}</span>
                    <span>{t("home.telemetry.item2.hufa")}</span>
                  </div>
                </div>

                {/* Seafood export tracking */}
                <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3.5 transition-all hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{t("home.telemetry.item3.name")}</span>
                    <span className="text-mint">{t("home.telemetry.item3.status")}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-mint rounded-full transition-all duration-1000"
                      style={{ width: "90%" }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-white/60 font-mono">
                    <span>{t("home.telemetry.item3.dest")}</span>
                    <span>{t("home.telemetry.item3.asc")}</span>
                  </div>
                </div>
              </div>

              {/* Mini details badge */}
              <div className="mt-4 flex items-center justify-between rounded-md bg-white/[0.03] p-2.5 text-[11px] text-white/70">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Award className="h-3.5 w-3.5 text-mint" /> {t("home.telemetry.guarantee")}
                </span>
                <span className="font-semibold text-white">{t("home.telemetry.haccp")}</span>
              </div>
            </div>

            {/* Floating Mini Sibling Card */}
            <div className="absolute -bottom-6 -left-4 rounded-xl border border-white/10 bg-navy/90 p-4 shadow-xl backdrop-blur-md max-w-[200px] hidden sm:block animate-float-delayed">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                {t("home.telemetry.activeCountries")}
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-mint">10+</div>
              <div className="mt-1 text-[11px] text-white/70">
                {t("home.telemetry.activeCountriesBody")}
              </div>
            </div>
          </div>
        </div>

        {/* Segments strip */}
        <div className="relative border-t border-white/10 bg-navy">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x">
            {SEGMENTS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-6 py-5">
                <s.icon className="h-5 w-5 text-mint" />
                <span className="text-sm font-medium text-white">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top 4 Products — best sellers, right after the hero */}
      <Section className="py-16 lg:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
            <TrendingUp className="h-4 w-4 text-primary" /> {t("home.top.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-5xl leading-tight">
            {t("home.top.title")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("home.top.lead")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Revive Artemia Cyst */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-primary/40 hover:shadow-lg">
            <Link
              to="/products/$category/$slug"
              params={{ category: "live-feed-aquaculture", slug: "artemia" }}
              className="absolute inset-0 z-0"
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={artemia}
                alt={t("home.top.card1.title")}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="w-fit text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded">
                {t("home.top.card1.badge")}
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-navy">
                {t("home.top.card1.title")}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">
                {t("home.top.card1.tagline")}
              </p>
              <div className="relative z-10 mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-[11px] font-semibold text-teal">
                  {t("home.top.card1.tag")}
                </span>
                <Link
                  to="/products/$category/$slug"
                  params={{ category: "live-feed-aquaculture", slug: "artemia" }}
                  className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1"
                >
                  {t("home.top.learnMore")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Revive Artemia Decapsulated */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-primary/40 hover:shadow-lg">
            <Link
              to="/products/$category/$slug"
              params={{
                category: "hatchery-solutions",
                slug: "decapsulated-dry-artemia-cysts",
              }}
              className="absolute inset-0 z-0"
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="aspect-[4/3] overflow-hidden bg-muted p-3 flex items-center justify-center">
              <img
                src={reviveDecap}
                alt={t("home.top.card2.title")}
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="w-fit text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded">
                {t("home.top.card2.badge")}
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-navy">
                {t("home.top.card2.title")}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">
                {t("home.top.card2.tagline")}
              </p>
              <div className="relative z-10 mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-[11px] font-semibold text-teal">
                  {t("home.top.card2.tag")}
                </span>
                <Link
                  to="/products/$category/$slug"
                  params={{
                    category: "hatchery-solutions",
                    slug: "decapsulated-dry-artemia-cysts",
                  }}
                  className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1"
                >
                  {t("home.top.learnMore")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Super Fresh Chlorella SV-12 */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-primary/40 hover:shadow-lg">
            <Link
              to="/products/$category/$slug"
              params={{ category: "live-feed-aquaculture", slug: "super-fresh-chlorella-v12" }}
              className="absolute inset-0 z-0"
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={sv12ProductImg}
                alt={t("home.top.card3.title")}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="w-fit text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded">
                {t("home.top.card3.badge")}
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-navy">
                {t("home.top.card3.title")}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">
                {t("home.top.card3.tagline")}
              </p>
              <div className="relative z-10 mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-[11px] font-semibold text-teal">
                  {t("home.top.card3.tag")}
                </span>
                <Link
                  to="/products/$category/$slug"
                  params={{ category: "live-feed-aquaculture", slug: "super-fresh-chlorella-v12" }}
                  className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1"
                >
                  {t("home.top.learnMore")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 4: Atlantic & Coho Salmon Eggs — flagship sourcing story */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-mint/50 bg-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-mint hover:shadow-lg">
            <Link
              to="/products/$category/$slug"
              params={{ category: "hatchery-solutions", slug: "atlantic-salmon-egg" }}
              className="absolute inset-0 z-0"
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={salmonEggs}
                alt={t("home.top.card4.title")}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="w-fit text-[10px] font-bold uppercase tracking-wider text-navy bg-mint px-2.5 py-1 rounded">
                {t("home.top.card4.badge")}
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-navy">
                {t("home.top.card4.title")}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">
                {t("home.top.card4.tagline")}
              </p>
              <div className="relative z-10 mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-[11px] font-semibold text-teal">
                  {t("home.top.card4.tag")}
                </span>
                <Link
                  to="/products/$category/$slug"
                  params={{ category: "hatchery-solutions", slug: "atlantic-salmon-egg" }}
                  className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1"
                >
                  {t("home.top.learnMore")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <Link
                to="/products/$category/$slug"
                params={{ category: "hatchery-solutions", slug: "coho-salmon-egg" }}
                className="relative z-10 mt-2 text-[11px] font-semibold text-muted-foreground hover:text-primary hover:underline"
              >
                {t("home.top.card4.cohoLink")} →
              </Link>
            </div>
          </div>
        </div>

        {/* Salmon sourcing spotlight callout */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2 items-center rounded-3xl border border-border/80 bg-surface-alt/60 p-6 sm:p-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="inline-block h-[2px] w-8 bg-primary" />{" "}
              {t("home.top.sourcing.eyebrow")}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-navy leading-tight">
              {t("home.top.sourcing.title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("home.top.sourcing.body")}
            </p>
            <Button asChild className="mt-2 rounded-xl font-bold">
              <Link to="/salmonid-ova-solutions">
                {t("home.top.sourcing.cta")} <ArrowRight className="ms-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <AnimatedSalmonOvaCycle />
        </div>

        <div className="mt-10 text-center">
          <Button variant="ghost" asChild>
            <Link to="/products">
              {t("home.top.viewAll")} <ArrowRight className="ms-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Customer logos */}
      <section className="border-b bg-surface-alt py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-navy/40">
            {t("home.customers.title")}
          </p>
          <div className="grid grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-4 lg:grid-cols-8">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="flex h-16 w-full max-w-[130px] items-center justify-center rounded-xl border border-border bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.05] hover:border-teal/30 hover:shadow-md"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain filter grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redesigned End-to-End Aquaculture Product Portfolio Section */}
      <Section className="py-16 lg:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
            <Package className="h-4 w-4 text-primary" /> {t("home.cats.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-5xl leading-tight">
            {t("home.cats.title")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("home.cats.lead")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/products/$category"
              params={{ category: c.slug }}
              className="glass-card group flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-background shadow-md hover:shadow-2xl hover:border-primary/60 transition-all duration-300"
            >
              <div>
                {/* Category Image Header */}
                <div className="aspect-[4/3] overflow-hidden bg-navy relative">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105 opacity-90"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-navy text-3xl font-display font-bold text-mint/40">
                      {c.title.slice(0, 2)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                  {/* Certified Seal Badge Overlay */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-navy/90 text-mint text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
                    <ShieldCheck className="inline h-3 w-3 me-1" /> {t("home.cats.certifiedBadge")}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-lg font-bold text-navy group-hover:text-primary transition-colors leading-snug">
                    {t(`cat.${c.slug}`)}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {c.description}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary group-hover:text-navy transition-colors">
                  <span>{t("home.cats.explore")}</span>
                  <div className="h-8 w-8 rounded-full bg-surface-alt group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Catalog CTA Banner */}
        <div className="mt-12 glass-card rounded-3xl p-6 sm:p-8 border border-border/80 bg-surface-alt/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-navy text-mint shrink-0">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-base font-bold text-navy">
                {t("home.cats.ctaBanner.title")}
              </div>
              <div className="text-xs text-muted-foreground">{t("home.cats.ctaBanner.body")}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              asChild
              className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            >
              <Link to="/products">
                {t("home.cats.all")} <ArrowRight className="ms-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Shop Online CTA Banner — transactional counterpart to the browse-only catalog above */}
        <div className="mt-6 glass-card rounded-3xl p-6 sm:p-8 border-2 border-mint/50 bg-navy text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-mint text-navy shrink-0">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-base font-bold text-white">
                {t("home.shopBanner.title")}
              </div>
              <div className="text-xs text-white/70">{t("home.shopBanner.body")}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              asChild
              className="rounded-xl font-bold bg-mint text-navy hover:bg-mint/90 shadow-md"
            >
              <Link to="/shop">
                {t("home.shopBanner.cta")} <ArrowRight className="ms-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-[2px] w-8 bg-primary" /> {t("home.why.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            {t("home.why.title")}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((f) => (
            <div key={f.title} className="card-flat p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h4 className="mt-4 font-display text-lg font-semibold text-navy">{f.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section band>
        <BlogWidget title={t("home.blog.title")} />
      </Section>

      {/* Premium High-Impact Conversion CTA */}
      <section className="relative overflow-hidden bg-navy text-white py-20 lg:py-28 border-t border-white/5">
        {/* Subtle grid pattern background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Ambient glowing radial lights */}
        <div className="absolute -left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-mint/5 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 text-center md:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-mint mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint"></span>
            </span>
            {t("home.finalCta.badge")}
          </div>

          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl max-w-3xl mx-auto leading-tight">
            {t("home.finalCta.title.a")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-teal">
              {t("home.finalCta.title.b")}
            </span>
          </h2>

          <p className="mt-6 text-lg text-white/95 max-w-2xl mx-auto font-medium leading-relaxed">
            {t("home.finalCta.lead")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-mint text-navy hover:bg-mint/90 font-bold px-8 shadow-lg shadow-mint/10 hover:shadow-mint/20 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/contactus">
                {t("home.finalCta.cta.primary")} <ArrowRight className="ms-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/40 font-semibold px-8 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/products">{t("home.finalCta.cta.secondary")}</Link>
            </Button>
          </div>

          {/* Verification tags */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs text-white/85 font-semibold uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4 text-mint" /> {t("home.finalCta.tag.haccp")}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-mint" /> {t("home.finalCta.tag.asc")}
            </span>
            <span className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-mint" /> {t("home.finalCta.tag.logistics")}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
