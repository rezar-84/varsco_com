import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/layout/Page";
import { AnimatedProjectLifecycle } from "@/components/visuals/AnimatedProjectLifecycle";
import {
  Building2,
  Globe2,
  CheckCircle2,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageCircle,
  FileText,
  MapPin,
  Calendar,
  Handshake,
  ChevronRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";

import salmonEggs from "@/assets/salmon-eggs.jpg";
import artemia from "@/assets/artemia.jpg";
import chlorella from "@/assets/chlorella.jpg";
import heroFarm from "@/assets/hero-farm.jpg";
import seabass from "@/assets/seabass.jpg";

import flounderIcon from "@/assets/icons/flounder.svg";
import salmonTunaIcon from "@/assets/icons/salmon-tuna.svg";
import hatcheryBuildingIcon from "@/assets/icons/hatchery-building.svg";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Authentic Global Field Projects & Supply Chain | VARS Aquaculture" },
      {
        name: "description",
        content:
          "Explore VARS Aquaculture's real-world projects: Aegean hatchery SV12 rotifer 8X biomass optimization, first-ever Atlantic salmon egg shipping to South Korea, salmon ova exports to Japan, and BlueGen Korea Olive Flounder megafarm supply chain collaboration.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const CATEGORIES = [
    { id: "all", label: t("projects.categories.all") },
    { id: "live-feed", label: t("projects.categories.liveFeed") },
    { id: "salmon-ova", label: t("projects.categories.salmonOva") },
    { id: "hatchery-ras", label: t("projects.categories.hatcheryRas") },
  ];

  const PROJECTS = [
    {
      id: "aegean-rotifer-sv12-optimization",
      title: t("projects.case1.title"),
      category: "live-feed",
      categoryLabel: t("projects.case1.categoryLabel"),
      client: t("projects.case1.client"),
      location: t("projects.case1.location"),
      year: "2025 – 2026",
      image: heroFarm,
      highlight: t("projects.case1.highlight"),
      description: t("projects.case1.description"),
      metrics: [
        { label: t("projects.case1.metric1.label"), value: t("projects.case1.metric1.value") },
        { label: t("projects.case1.metric2.label"), value: t("projects.case1.metric2.value") },
        { label: t("projects.case1.metric3.label"), value: t("projects.case1.metric3.value") },
      ],
      tags: [
        t("projects.case1.tag1"),
        t("projects.case1.tag2"),
        t("projects.case1.tag3"),
        t("projects.case1.tag4"),
      ],
    },
    {
      id: "first-ever-south-korea-atlantic-salmon-eggs",
      title: t("projects.case2.title"),
      category: "salmon-ova",
      categoryLabel: t("projects.case2.categoryLabel"),
      client: t("projects.case2.client"),
      location: t("projects.case2.location"),
      year: "2024 – 2026",
      image: salmonEggs,
      highlight: t("projects.case2.highlight"),
      description: t("projects.case2.description"),
      metrics: [
        { label: t("projects.case2.metric1.label"), value: t("projects.case2.metric1.value") },
        { label: t("projects.case2.metric2.label"), value: t("projects.case2.metric2.value") },
        { label: t("projects.case2.metric3.label"), value: t("projects.case2.metric3.value") },
      ],
      tags: [
        t("projects.case2.tag1"),
        t("projects.case2.tag2"),
        t("projects.case2.tag3"),
        t("projects.case2.tag4"),
      ],
    },
    {
      id: "japan-salmon-egg-export-culture",
      title: t("projects.case3.title"),
      category: "salmon-ova",
      categoryLabel: t("projects.case3.categoryLabel"),
      client: t("projects.case3.client"),
      location: t("projects.case3.location"),
      year: "2024 – 2025",
      image: salmonEggs,
      highlight: t("projects.case3.highlight"),
      description: t("projects.case3.description"),
      metrics: [
        { label: t("projects.case3.metric1.label"), value: t("projects.case3.metric1.value") },
        { label: t("projects.case3.metric2.label"), value: t("projects.case3.metric2.value") },
        { label: t("projects.case3.metric3.label"), value: t("projects.case3.metric3.value") },
      ],
      tags: [
        t("projects.case3.tag1"),
        t("projects.case3.tag2"),
        t("projects.case3.tag3"),
        t("projects.case3.tag4"),
      ],
    },
    {
      id: "bluegen-korea-olive-flounder-supply-chain",
      title: t("projects.case4.title"),
      category: "hatchery-ras",
      categoryLabel: t("projects.case4.categoryLabel"),
      client: t("projects.case4.client"),
      location: t("projects.case4.location"),
      year: "2025 – 2026",
      image: seabass,
      highlight: t("projects.case4.highlight"),
      description: t("projects.case4.description"),
      metrics: [
        { label: t("projects.case4.metric1.label"), value: t("projects.case4.metric1.value") },
        { label: t("projects.case4.metric2.label"), value: t("projects.case4.metric2.value") },
        { label: t("projects.case4.metric3.label"), value: t("projects.case4.metric3.value") },
      ],
      tags: [
        t("projects.case4.tag1"),
        t("projects.case4.tag2"),
        t("projects.case4.tag3"),
        t("projects.case4.tag4"),
      ],
    },
  ];

  const filteredProjects =
    selectedCategory === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === selectedCategory);

  const TESTIMONIALS = [
    {
      quote: t("projects.testimonial1.quote"),
      author: t("projects.testimonial1.author"),
      role: t("projects.testimonial1.role"),
      company: t("projects.testimonial1.company"),
    },
    {
      quote: t("projects.testimonial2.quote"),
      author: t("projects.testimonial2.author"),
      role: t("projects.testimonial2.role"),
      company: t("projects.testimonial2.company"),
    },
    {
      quote: t("projects.testimonial3.quote"),
      author: t("projects.testimonial3.author"),
      role: t("projects.testimonial3.role"),
      company: t("projects.testimonial3.company"),
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* High-Impact Hero Banner */}
      <section className="bg-navy text-white relative overflow-hidden py-16 lg:py-20 border-b border-border/80">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/15 text-mint text-xs font-bold uppercase tracking-widest">
              <Globe2 className="h-3.5 w-3.5" /> {t("projects.hero.badge")}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {t("projects.hero.title.a")}{" "}
              <span className="text-mint font-light">{t("projects.hero.title.b")}</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              {t("projects.hero.lead")}
            </p>
          </div>

          {/* Key Metric Highlights Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="font-display text-3xl sm:text-4xl font-bold text-mint">
                {t("projects.hero.stat1.value")}
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">
                {t("projects.hero.stat1.label")}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="font-display text-3xl sm:text-4xl font-bold text-white">
                {t("projects.hero.stat2.value")}
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">
                {t("projects.hero.stat2.label")}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="font-display text-3xl sm:text-4xl font-bold text-mint">
                {t("projects.hero.stat3.value")}
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">
                {t("projects.hero.stat3.label")}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="font-display text-3xl sm:text-4xl font-bold text-white">
                {t("projects.hero.stat4.value")}
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">
                {t("projects.hero.stat4.label")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 space-y-16">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-surface-alt text-navy/80 hover:bg-muted hover:text-navy border border-border/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Case Studies Grid */}
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <h2 className="font-display text-2xl font-bold text-navy">
              {selectedCategory === "all"
                ? t("projects.grid.titleAll")
                : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
            </h2>
            <span className="text-xs font-bold text-muted-foreground">
              {t("projects.grid.count.prefix")} {filteredProjects.length}{" "}
              {t("projects.grid.count.suffix")}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-3xl overflow-hidden border border-border/80 bg-background shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Media Header */}
                  <div className="aspect-[16/9] overflow-hidden bg-navy relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />

                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                      {project.id.includes("flounder") && (
                        <img src={flounderIcon} alt="" className="h-4 w-4 filter invert" />
                      )}
                      {project.id.includes("salmon") && (
                        <img src={salmonTunaIcon} alt="" className="h-4 w-4 filter invert" />
                      )}
                      {project.id.includes("rotifer") && (
                        <img src={hatcheryBuildingIcon} alt="" className="h-4 w-4 filter invert" />
                      )}
                      <span>{project.categoryLabel}</span>
                    </div>

                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-mint text-navy text-xs font-bold shadow-md">
                      {project.highlight}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                      <div className="flex items-center gap-3 text-xs font-semibold text-white/80">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-mint" /> {project.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {project.year}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white group-hover:text-mint transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between text-xs font-bold pb-3 border-b border-border/80">
                      <span className="text-navy/80">
                        {t("projects.card.clientLabel")}{" "}
                        <span className="text-navy font-extrabold">{project.client}</span>
                      </span>
                      <span className="text-primary font-bold flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-mint" />{" "}
                        {t("projects.card.verifiedBadge")}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-navy/90 font-normal leading-relaxed">
                      {project.description}
                    </p>

                    {/* Key Outcome Metrics Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {project.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="p-3 rounded-xl bg-surface-alt border border-border/80 text-center"
                        >
                          <div className="font-display text-base font-extrabold text-navy">
                            {m.value}
                          </div>
                          <div className="text-[10px] text-navy/70 font-bold mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tag Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-navy/10 text-navy text-[11px] font-extrabold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="w-full rounded-xl font-bold border-navy text-navy hover:bg-navy hover:text-white"
                  >
                    <Link to="/request-quote">
                      {t("projects.card.cta")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Animated Process Vector Section */}
        <section>
          <AnimatedProjectLifecycle />
        </section>

        {/* Client Endorsements Section (Hidden until endorsements are confirmed)
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Users className="h-4 w-4" /> {t("projects.testimonials.eyebrow")}
            </span>
            <h2 className="font-display text-3xl font-bold text-navy">
              {t("projects.testimonials.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.author}
                className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-md flex flex-col justify-between space-y-4"
              >
                <p className="text-xs sm:text-sm text-navy/90 leading-relaxed italic font-medium">
                  "{item.quote}"
                </p>
                <div className="pt-4 border-t border-border/60">
                  <div className="text-xs font-extrabold text-navy">{item.author}</div>
                  <div className="text-[11px] font-semibold text-navy/70">{item.role}</div>
                  <div className="text-[11px] font-bold text-primary mt-0.5">{item.company}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        */}

        {/* Bottom High-Contrast CTA Banner */}
        <section className="glass-card rounded-3xl p-8 sm:p-12 border border-white/20 bg-gradient-to-br from-navy via-slate-900 to-navy text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/25 text-mint text-xs font-bold uppercase tracking-widest border border-mint/40 shadow-sm">
              <Handshake className="h-3.5 w-3.5 text-mint" /> {t("projects.cta.badge")}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {t("projects.cta.title")}
            </h2>
            <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed">
              {t("projects.cta.lead")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="rounded-xl font-extrabold bg-white text-navy hover:bg-mint hover:text-navy shadow-lg text-sm px-6 h-12"
              >
                <Link to="/request-quote">
                  <MessageCircle className="mr-2 h-4 w-4 text-primary" />{" "}
                  {t("projects.cta.primaryBtn")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl font-extrabold border-2 border-white/80 bg-white/10 text-white hover:bg-white hover:text-navy text-sm px-6 h-12 backdrop-blur-md"
              >
                <Link to="/services-solutions">
                  {t("projects.cta.secondaryBtn")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
