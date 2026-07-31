import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import { AnimatedAquariumEcosystem } from "@/components/visuals/AnimatedAquariumEcosystem";
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Store,
  Fish,
  Droplets,
  Building2,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/aquariums-and-hobbyists")({
  head: () => ({
    meta: [
      { title: "Public Aquariums, Shops & Reef Aquarists Live Feed | VARS Aquaculture" },
      {
        name: "description",
        content:
          "Professional live feed, Artemia cysts, Decapsulated Artemia, and liquid Chlorella microalgae for Public Aquariums, Pet Shops, Fish Breeders, and Reef Tank Hobbyists worldwide.",
      },
    ],
  }),
  component: AquariumsAndHobbyistsPage,
});

function AquariumsAndHobbyistsPage() {
  const { t } = useI18n();

  const SECTORS = [
    {
      icon: Building2,
      title: t("hobbyists.sector.public.title"),
      desc: t("hobbyists.sector.public.desc"),
      bullets: [
        t("hobbyists.sector.public.b1"),
        t("hobbyists.sector.public.b2"),
        t("hobbyists.sector.public.b3"),
      ],
    },
    {
      icon: Store,
      title: t("hobbyists.sector.shops.title"),
      desc: t("hobbyists.sector.shops.desc"),
      bullets: [
        t("hobbyists.sector.shops.b1"),
        t("hobbyists.sector.shops.b2"),
        t("hobbyists.sector.shops.b3"),
      ],
    },
    {
      icon: Fish,
      title: t("hobbyists.sector.breeders.title"),
      desc: t("hobbyists.sector.breeders.desc"),
      bullets: [
        t("hobbyists.sector.breeders.b1"),
        t("hobbyists.sector.breeders.b2"),
        t("hobbyists.sector.breeders.b3"),
      ],
    },
    {
      icon: Droplets,
      title: t("hobbyists.sector.reef.title"),
      desc: t("hobbyists.sector.reef.desc"),
      bullets: [
        t("hobbyists.sector.reef.b1"),
        t("hobbyists.sector.reef.b2"),
        t("hobbyists.sector.reef.b3"),
      ],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("hobbyists.hero.eyebrow")}
        title={t("hobbyists.hero.title")}
        description={t("hobbyists.hero.description")}
      />

      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          {SECTORS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="glass-card rounded-2xl p-8 border border-border/80 bg-background shadow-md space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-teal/20 text-navy flex items-center justify-center font-bold shrink-0">
                    <Icon className="h-6 w-6 text-mint" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-navy">{s.title}</h2>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>

                <ul className="space-y-2 pt-2 border-t border-border/60">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs font-semibold text-navy">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <AnimatedAquariumEcosystem />
        </div>

        <div className="mt-12 text-center glass-card rounded-2xl p-8 border border-border/80 bg-surface-alt/60 max-w-3xl mx-auto space-y-4">
          <h3 className="font-display text-2xl font-bold text-navy">{t("hobbyists.cta.title")}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("hobbyists.cta.description")}
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              asChild
              className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/contactus">
                <HeartHandshake className="mr-2 h-4 w-4" /> {t("hobbyists.cta.button")}
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
