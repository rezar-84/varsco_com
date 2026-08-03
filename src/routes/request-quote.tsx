import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/layout/Page";
import { QuoteForm } from "@/components/layout/QuoteForm";
import { useI18n } from "@/context/I18nContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import {
  ShieldCheck,
  Clock,
  Globe2,
  PhoneCall,
  CheckCircle2,
  Award,
  Truck,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { z } from "zod";
import { getLocalizedMeta } from "@/lib/utils/seo";

const quoteSearchSchema = z.object({
  product: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/request-quote")({
  validateSearch: (search) => quoteSearchSchema.parse(search),
  head: () => ({
    meta: [...getLocalizedMeta("quote"), { property: "og:type", content: "website" }],
  }),
  component: RequestQuotePage,
});

function RequestQuotePage() {
  const { t } = useI18n();
  const { submitQuote } = useCart();
  const search = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <>
      <PageHero
        eyebrow={search.product ? t("quote.page.eyebrowProduct") : t("quote.page.eyebrowGeneral")}
        title={t("quote.title")}
        description={search.product ? t("quote.page.descProduct") : t("quote.page.descGeneral")}
      />

      <Section>
        {/* Top Trust & SLA Banner */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card flex items-center gap-3.5 rounded-2xl p-4 border border-border/80 bg-background/80 shadow-sm">
            <div className="rounded-xl bg-mint/15 p-2.5 text-mint shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-navy">
                {t("quote.banner.slaTitle")}
              </div>
              <div className="text-xs text-muted-foreground">{t("quote.banner.slaBody")}</div>
            </div>
          </div>

          <div className="glass-card flex items-center gap-3.5 rounded-2xl p-4 border border-border/80 bg-background/80 shadow-sm">
            <div className="rounded-xl bg-primary/15 p-2.5 text-primary shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-navy">
                {t("quote.banner.certTitle")}
              </div>
              <div className="text-xs text-muted-foreground">{t("quote.banner.certBody")}</div>
            </div>
          </div>

          <div className="glass-card flex items-center gap-3.5 rounded-2xl p-4 border border-border/80 bg-background/80 shadow-sm">
            <div className="rounded-xl bg-teal/20 p-2.5 text-navy shrink-0 border border-teal/40">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-navy">
                {t("quote.banner.coldChainTitle")}
              </div>
              <div className="text-xs text-muted-foreground">{t("quote.banner.coldChainBody")}</div>
            </div>
          </div>

          <div className="glass-card flex items-center gap-3.5 rounded-2xl p-4 border border-border/80 bg-background/80 shadow-sm">
            <div className="rounded-xl bg-amber-500/15 p-2.5 text-amber-600 shrink-0">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-navy">
                {t("quote.banner.langTitle")}
              </div>
              <div className="text-xs text-muted-foreground">{t("quote.banner.langBody")}</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column High-Converting B2B RFQ Portal */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Interactive Form (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="card-flat p-6 sm:p-8 border border-border/80 bg-background/95 shadow-xl rounded-3xl relative overflow-hidden">
              {/* Subtle visual accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-mint to-teal" />

              {done ? (
                <div className="py-12 text-center space-y-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint/20 text-mint animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-3xl font-bold text-navy">
                      {t("quote.success.title")}
                    </h2>
                    <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
                      {t("quote.success.body")}
                    </p>
                  </div>

                  <div className="mx-auto max-w-sm rounded-2xl bg-surface-alt p-4 border border-border/80 space-y-3 text-xs text-left">
                    <div className="font-bold text-navy flex items-center gap-2">
                      <Clock className="h-4 w-4 text-mint" /> {t("quote.next.title")}
                    </div>
                    <ul className="space-y-2 text-muted-foreground text-[11px]">
                      <li className="flex items-center gap-2">
                        <span className="font-bold text-primary">01.</span> {t("quote.next.step1")}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="font-bold text-primary">02.</span> {t("quote.next.step2")}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="font-bold text-primary">03.</span> {t("quote.next.step3")}
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setDone(false)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                    >
                      <span>{t("quote.next.another")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <QuoteForm
                  busy={busy}
                  initialProductSlug={search.product}
                  onSubmit={async (data) => {
                    setBusy(true);
                    await submitQuote(data, "Request Quote Page");
                    setBusy(false);
                    setDone(true);
                    toast.success(t("quote.success.title"), {
                      description: t("quote.success.body"),
                    });
                  }}
                />
              )}
            </div>
          </div>

          {/* Right Column: CRO Sales & Trust Sidebar (4 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Urgent Assistance / Live Sales Desk */}
            <div className="rounded-3xl bg-navy text-white p-6 shadow-xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 h-32 w-32 rounded-full bg-mint/10 blur-2xl" />

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-white/10 text-mint shrink-0">
                  <Headphones className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint">
                    {t("quote.sidebar.deskLabel")}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {t("quote.sidebar.deskTitle")}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed mb-5">
                {t("quote.sidebar.deskBody")}
              </p>

              <div className="space-y-3 text-xs">
                <a
                  href="tel:+902322905756"
                  className="flex items-center justify-between rounded-xl bg-white/10 p-3 font-semibold text-white hover:bg-white/20 transition-all border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-mint" /> +90 (232) 290 57 56
                  </span>
                  <span className="text-[10px] font-bold text-mint uppercase">
                    {t("quote.sidebar.callSales")}
                  </span>
                </a>

                <a
                  href="mailto:sales@varsco.com"
                  className="flex items-center justify-between rounded-xl bg-white/10 p-3 font-semibold text-white hover:bg-white/20 transition-all border border-white/10"
                >
                  <span className="truncate">sales@varsco.com</span>
                  <span className="text-[10px] font-bold text-mint uppercase">
                    {t("quote.sidebar.email")}
                  </span>
                </a>
              </div>
            </div>

            {/* Why VARS Aquaculture Card */}
            <div className="glass-card rounded-3xl p-6 border border-border/80 bg-background/80 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-bold text-navy">
                  {t("quote.why.title")}
                </h3>
              </div>

              <ul className="space-y-3 text-xs text-navy/90 font-medium">
                <li className="flex gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy">{t("quote.why.item1Title")}</strong>{" "}
                    {t("quote.why.item1Body")}
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy">{t("quote.why.item2Title")}</strong>{" "}
                    {t("quote.why.item2Body")}
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy">{t("quote.why.item3Title")}</strong>{" "}
                    {t("quote.why.item3Body")}
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy">{t("quote.why.item4Title")}</strong>{" "}
                    {t("quote.why.item4Body")}
                  </span>
                </li>
              </ul>
            </div>

            {/* Global Trade Hub Link */}
            <div className="rounded-2xl bg-surface-alt p-5 border border-border/80 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-xs font-bold text-navy uppercase tracking-wider">
                  {t("quote.tradeHub.title")}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t("quote.tradeHub.body")}
                </p>
              </div>
              <Link
                to="/regional-trade-middle-east-europe"
                className="shrink-0 rounded-xl bg-navy px-3 py-2 text-xs font-bold text-white hover:bg-primary transition-colors"
              >
                {t("quote.tradeHub.cta")}
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
