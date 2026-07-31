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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/salmonid-ova-solutions")({
  head: () => ({
    meta: [
      { title: "Salmonid Ova Solutions — Atlantic, Coho & Trout Fertilized Eggs | VARS" },
      {
        name: "description",
        content:
          "Leading global supplier of fertilized Atlantic Salmon eggs (Salmo salar), Coho Salmon eggs (Oncorhynchus kisutch), and Rainbow Trout ova. Certified disease-free SPF status, temperature-logged cold chain, and continuous year-round availability.",
      },
    ],
  }),
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
                    <span className="font-bold text-mint">{ova.hatchRate}</span>
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
    </>
  );
}
