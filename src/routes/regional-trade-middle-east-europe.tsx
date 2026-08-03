import { createFileRoute, Link } from "@tanstack/react-router";
import { getLocalizedMeta } from "@/lib/utils/seo";
import { PageHero, Section } from "@/components/layout/Page";
import { InteractiveSupplyMap } from "@/components/InteractiveSupplyMap";
import { ShieldCheck, Globe2, Truck, Plane, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/regional-trade-middle-east-europe")({
  head: () => ({ meta: getLocalizedMeta("regionalTrade") }),
  component: RegionalTradePage,
});

function RegionalTradePage() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t("regionalTrade.hero.eyebrow")}
        title={t("regionalTrade.hero.title")}
        description={t("regionalTrade.hero.description")}
      />

      <Section>
        <div className="space-y-12">
          <InteractiveSupplyMap />

          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-teal/20 text-navy flex items-center justify-center font-bold">
                <Globe2 className="h-5 w-5 text-mint" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy">
                {t("regionalTrade.card1.title")}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("regionalTrade.card1.desc")}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-teal/20 text-navy flex items-center justify-center font-bold">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy">
                {t("regionalTrade.card2.title")}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("regionalTrade.card2.desc")}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-teal/20 text-navy flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5 text-mint" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy">
                {t("regionalTrade.card3.title")}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("regionalTrade.card3.desc")}
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button
              size="lg"
              asChild
              className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/request-quote">
                <MessageCircle className="mr-2 h-4 w-4" /> {t("regionalTrade.cta")}
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
