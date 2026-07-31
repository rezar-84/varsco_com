import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import {
  ShieldCheck,
  Truck,
  Globe2,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/seafood-export-from-turkey-to-europe")({
  head: () => ({
    meta: [
      { title: "Seafood Export from Türkiye to Europe — EU Certified Logistics | VARS" },
      {
        name: "description",
        content:
          "EU-approved establishment numbers, TRACES certificates, and 36-hour express cold-chain reefer shipments of sea bass, sea bream, and trout from İzmir to Milan, Frankfurt, and Madrid.",
      },
    ],
  }),
  component: EUExportPage,
});

function EUExportPage() {
  const { t } = useI18n();

  const EU_CERTIFICATIONS = [
    {
      title: t("exportEurope.cert1.title"),
      desc: t("exportEurope.cert1.desc"),
    },
    {
      title: t("exportEurope.cert2.title"),
      desc: t("exportEurope.cert2.desc"),
    },
    {
      title: t("exportEurope.cert3.title"),
      desc: t("exportEurope.cert3.desc"),
    },
    {
      title: t("exportEurope.cert4.title"),
      desc: t("exportEurope.cert4.desc"),
    },
    {
      title: t("exportEurope.cert5.title"),
      desc: t("exportEurope.cert5.desc"),
    },
    {
      title: t("exportEurope.cert6.title"),
      desc: t("exportEurope.cert6.desc"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("exportEurope.hero.eyebrow")}
        title={t("exportEurope.hero.title")}
        description={t("exportEurope.hero.description")}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/15 text-navy text-xs font-bold uppercase tracking-widest">
              <Globe2 className="h-3.5 w-3.5 text-mint" /> {t("exportEurope.badge")}
            </div>

            <h2 className="font-display text-3xl font-bold text-navy leading-tight md:text-4xl">
              {t("exportEurope.heading")}
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("exportEurope.intro")}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="glass-card rounded-2xl p-4 border border-border/80 bg-background shadow-sm">
                <div className="font-display text-2xl font-bold text-primary">
                  {t("exportEurope.stat1.value")}
                </div>
                <div className="text-xs font-bold text-navy mt-1">
                  {t("exportEurope.stat1.route")}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t("exportEurope.stat1.desc")}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-4 border border-border/80 bg-background shadow-sm">
                <div className="font-display text-2xl font-bold text-mint">
                  {t("exportEurope.stat2.value")}
                </div>
                <div className="text-xs font-bold text-navy mt-1">
                  {t("exportEurope.stat2.route")}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t("exportEurope.stat2.desc")}
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Button
                size="lg"
                asChild
                className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/request-quote">
                  <MessageCircle className="mr-2 h-4 w-4" /> {t("exportEurope.cta.quote")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl font-bold border-border/80"
              >
                <Link to="/products/$category" params={{ category: "seafood" }}>
                  {t("exportEurope.cta.browse")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl p-6 border border-border/80 shadow-xl bg-background space-y-4">
              <h3 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-mint" /> {t("exportEurope.compliance.title")}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("exportEurope.compliance.desc")}
              </p>

              <div className="space-y-3 pt-2">
                {EU_CERTIFICATIONS.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy">{item.title}: </span>
                      <span className="text-muted-foreground">{item.desc}</span>
                    </div>
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
