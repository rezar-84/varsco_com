import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Snowflake,
  Fish,
  Waves,
  Plane,
  Ship,
  Clock,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { Section } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { QuoteDrawer } from "@/components/layout/QuoteDrawer";
import { getProduct } from "@/lib/mock/products";
import { useI18n } from "@/context/I18nContext";
import { getLocalizedMeta } from "@/lib/utils/seo";
import { SUBMISSION_SOURCES } from "@/lib/submission-context";
import heroFlounder from "@/assets/olive-flounder.jpg";

export const Route = createFileRoute("/olive-flounder-export")({
  head: () => ({ meta: getLocalizedMeta("oliveFlounderExport") }),
  component: OliveFlounderExportPage,
});

/** Icon per commercial format, keyed by the `key` field in products.ts. */
const FORMAT_ICONS: Record<string, typeof Snowflake> = {
  "frozen-fillet": Snowflake,
  "fresh-gutted": Fish,
  live: Waves,
};

function OliveFlounderExportPage() {
  const { t } = useI18n();
  const [quoteOpen, setQuoteOpen] = useState(false);

  // Formats and documents come from the catalogue entry rather than being
  // restated here. They already drive the product page's Export formats tab,
  // and duplicating them would let the two drift the first time a size band
  // or a certificate changed.
  const product = getProduct("seafood", "olive-flounder");
  const formats = product?.exportForms ?? [];
  const documents = product?.exportDocuments ?? [];

  /** Product-scoped translation, matching ProductCard/product detail's tp(). */
  const tp = (field: string, fallback: string): string => {
    const key = `product.olive-flounder.${field}`;
    const res = t(key);
    return res === key ? fallback : res;
  };

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <img
          src={heroFlounder}
          alt={t("flounderExport.hero.imageAlt")}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/92 to-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/60" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-mint">
              <span className="inline-block h-[2px] w-8 bg-mint" />
              {t("flounderExport.hero.eyebrow")}
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {t("flounderExport.hero.title")}
            </h1>
            {/* Scientific name adjacent to the trade name, per the species
                ruling in doc/translation_agents.md §3b. */}
            <p className="mt-3 text-sm font-medium italic text-mint/90">Paralichthys olivaceus</p>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {t("flounderExport.hero.description")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => setQuoteOpen(true)}
                className="rounded-xl bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20"
              >
                {t("flounderExport.hero.cta")} <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
              {/* Format chips double as in-page navigation. */}
              {formats.map((f, i) => (
                <a
                  key={f.key}
                  href={`#format-${f.key}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:border-mint/60 hover:bg-white/20"
                >
                  {tp(`exportForm.${i}.name`, f.name)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The four facts a buyer checks before reading anything else. */}
      <Section className="bg-navy py-10 text-white">
        <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {[
            { v: "2.0 – 2.5 kg", k: "flounderExport.stat.maxSize" },
            { v: "2", k: "flounderExport.stat.filletsPerFish" },
            { v: "24 – 30 h", k: "flounderExport.stat.liveWindow" },
            { v: "52", k: "flounderExport.stat.weeks" },
          ].map((s, i) => (
            <div key={s.k} className={i < 3 ? "border-e border-white/10 p-4" : "p-4"}>
              <div className="font-display text-3xl font-bold text-mint">{s.v}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                {t(s.k)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Commercial formats — the core of the page. */}
      <Section>
        <div className="mx-auto mb-12 max-w-3xl space-y-3 text-center">
          <h2 className="font-display text-3xl font-bold text-navy">
            {t("flounderExport.formats.heading")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("flounderExport.formats.description")}
          </p>
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          {formats.map((format, fi) => {
            const Icon = FORMAT_ICONS[format.key] ?? Fish;
            return (
              <div
                key={format.key}
                id={`format-${format.key}`}
                className="scroll-mt-24 rounded-2xl border border-border/80 bg-background p-6 shadow-sm md:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint/15 text-mint-ink">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-navy">
                        {tp(`exportForm.${fi}.name`, format.name)}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {tp(`exportForm.${fi}.summary`, format.summary)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl text-xs font-bold"
                    onClick={() => setQuoteOpen(true)}
                  >
                    {t("flounderExport.formats.cta")}
                  </Button>
                </div>

                {/* Weight bands are values, not copy — never translated. */}
                {format.sizes && format.sizes.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("productDetail.exportForms.sizesHeading")}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {format.sizes.map((size) => (
                        <span
                          key={size}
                          className="rounded-lg border border-border/60 bg-surface-alt px-2.5 py-1 text-xs font-bold text-navy"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {format.options && format.options.length > 0 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {format.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className="space-y-1 rounded-xl border border-border/40 bg-surface-alt/60 p-3"
                      >
                        <div className="text-xs font-bold text-navy">
                          {tp(`exportForm.${fi}.option.${oi}.label`, opt.label)}
                        </div>
                        <div className="text-xs leading-relaxed text-muted-foreground">
                          {tp(`exportForm.${fi}.option.${oi}.value`, opt.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {format.notes && (
                  <p className="mt-4 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground">
                    {tp(`exportForm.${fi}.notes`, format.notes)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Logistics. The live-fish viability window is the strongest proof of
          operational knowledge on this page, so it gets its own worked example
          rather than a claim. */}
      <Section band className="border-y border-border/60">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-3xl space-y-3">
            <h2 className="font-display text-3xl font-bold text-navy">
              {t("flounderExport.logistics.heading")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("flounderExport.logistics.description")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">
                <Plane className="h-4 w-4 text-mint-ink" aria-hidden="true" />
                {t("flounderExport.logistics.air.title")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {t("flounderExport.logistics.air.body")}
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">
                <Ship className="h-4 w-4 text-mint-ink" aria-hidden="true" />
                {t("flounderExport.logistics.sea.title")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {t("flounderExport.logistics.sea.body")}
              </p>
            </div>
          </div>

          {/* Worked corridor, stage by stage. */}
          <div className="mt-6 rounded-2xl border border-primary/25 bg-background p-6 shadow-sm md:p-8">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">
              <Clock className="h-4 w-4 text-mint-ink" aria-hidden="true" />
              {t("flounderExport.corridor.title")}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t("flounderExport.corridor.intro")}
            </p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
              {["a", "b", "c"].map((leg, i) => (
                <li key={leg} className="rounded-xl border border-border/60 bg-surface-alt/60 p-4">
                  <div className="font-display text-lg font-bold text-navy">
                    {t(`flounderExport.corridor.leg${i + 1}.time`)}
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t(`flounderExport.corridor.leg${i + 1}.label`)}
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-border/60 pt-4 text-xs font-semibold text-navy">
              {t("flounderExport.corridor.total")}
            </p>
          </div>
        </div>
      </Section>

      {/* Documentation */}
      <Section>
        <div className="mx-auto max-w-5xl rounded-2xl border border-border/80 bg-background p-6 shadow-sm md:p-8">
          <h2 className="font-display text-2xl font-bold text-navy">
            {t("productDetail.exportForms.documentsHeading")}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {t("productDetail.exportForms.documentsLead")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {/* Certification names are proper nouns — never translated. */}
            {documents.map((doc) => (
              <span
                key={doc}
                className="inline-flex items-center gap-1.5 rounded-lg border border-mint/30 bg-mint/15 px-2.5 py-1 text-xs font-bold text-navy"
              >
                <ShieldCheck className="h-3 w-3 text-primary" aria-hidden="true" />
                {doc}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* What we need in order to quote. Stating it up front shortens the
          back-and-forth: the drawer cannot capture these as structured fields
          yet, so the buyer is told what to include in their message. */}
      <Section band className="border-t border-border/60">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 space-y-3">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-navy">
              <ClipboardList className="h-5 w-5 text-mint-ink" aria-hidden="true" />
              {t("flounderExport.rfq.heading")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("flounderExport.rfq.description")}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <li
                key={n}
                className="flex items-start gap-2 rounded-xl border border-border/60 bg-background p-3"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-mint-ink"
                  aria-hidden="true"
                />
                <span className="text-xs leading-relaxed text-navy/80">
                  {t(`flounderExport.rfq.item${n}`)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={() => setQuoteOpen(true)}
              className="rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              {t("flounderExport.rfq.cta")} <ArrowRight className="ms-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>

      <QuoteDrawer
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        productSlug="olive-flounder"
        productTitle={tp("title", product?.title ?? "Olive Flounder")}
        source={SUBMISSION_SOURCES.oliveFlounderLanding}
      />
    </>
  );
}
