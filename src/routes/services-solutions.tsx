import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Section } from "@/components/layout/Page";
import heroHatchery from "@/assets/aegean-region-klcdeniz-hatchery-trials-2.webp";
import { AnimatedRasDiagram } from "@/components/visuals/AnimatedRasDiagram";
import { ModePattern } from "@/components/visuals/ModePattern";
import {
  Award,
  Users,
  Rocket,
  ShieldCheck,
  Building2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Clock,
  Layers,
  Cpu,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SOLUTION_MODES } from "@/lib/solution-modes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/context/I18nContext";
import { buildSubmissionContext, SUBMISSION_SOURCES } from "@/lib/submission-context";
import { getLocalizedMeta } from "@/lib/utils/seo";

export const Route = createFileRoute("/services-solutions")({
  head: () => ({ meta: getLocalizedMeta("services") }),
  component: ServicesPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  company: z.string().trim().min(2, "Company name is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().min(6, "Phone is required"),
  serviceType: z.string().optional(),
  message: z.string().trim().min(5, "Please share a brief description of your project or issue"),
});

function ServicesPage() {
  const { t, lang } = useI18n();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const iss of parsed.error.issues) errs[String(iss.path[0])] = iss.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          topic: parsed.data.serviceType,
          items: [],
          ...buildSubmissionContext(SUBMISSION_SOURCES.servicesSolutions, {
            locale: lang,
            pageSection: parsed.data.serviceType,
          }),
        }),
      });
      if (!response.ok) {
        const errBody = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errBody.error || t("solutions.form.error.submitFailed"));
      }
      toast.success(t("solutions.form.toast.successTitle"), {
        description: t("solutions.form.toast.successDescription"),
      });
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("solutions.form.error.generic"));
    } finally {
      setBusy(false);
    }
  };

  // Four engagement modes, matching how a buyer self-identifies: they are
  // starting from nothing, they want someone to run it, they are producing but
  // underperforming, or they need supply. Replaces the previous
  // investor/producer split, which had no home for managed operations.
  // Shared with the header mega menu — see src/lib/solution-modes.ts.
  const MODES = SOLUTION_MODES;

  return (
    <>
      {/* Custom hero rather than PageHero: this page needs a photographic
          background, and PageHero has no image variant. The image is our own
          hatchery trial work — evidence for the claim, not stock decoration. */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <img
          src={heroHatchery}
          alt={t("solutions.hero.imageAlt")}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        {/* Two overlays: a horizontal one that keeps the left column readable,
            and a vertical one that seats the section into the banner below. */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/92 to-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/60" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-mint">
              <span className="inline-block h-[2px] w-8 bg-mint" />
              {t("solutions.hero.eyebrow")}
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {t("solutions.hero.title")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {t("solutions.hero.description")}
            </p>

            {/* Mode chips double as in-page navigation, so the four sections
                below are reachable without scrolling the whole page. */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {MODES.map((mode) => (
                <a
                  key={mode.key}
                  href={`#mode-${mode.key}`}
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:border-mint/60 hover:bg-white/20"
                >
                  <mode.icon className="h-3.5 w-3.5 text-mint" aria-hidden="true" />
                  {t(`solutions.mode.${mode.key}.title`)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Authority Banner Section */}
      <Section className="py-12 bg-navy text-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 border-r border-white/10 last:border-r-0">
            <div className="font-display text-4xl font-bold text-mint">
              {t("solutions.banner.stat1.value")}
            </div>
            <div className="text-xs font-semibold text-white/80 mt-1 uppercase tracking-wider">
              {t("solutions.banner.stat1.label")}
            </div>
          </div>
          <div className="p-4 border-r border-white/10 last:border-r-0">
            <div className="font-display text-4xl font-bold text-white">
              {t("solutions.banner.stat2.value")}
            </div>
            <div className="text-xs font-semibold text-white/80 mt-1 uppercase tracking-wider">
              {t("solutions.banner.stat2.label")}
            </div>
          </div>
          <div className="p-4 border-r border-white/10 last:border-r-0">
            <div className="font-display text-4xl font-bold text-mint">
              {t("solutions.banner.stat3.value")}
            </div>
            <div className="text-xs font-semibold text-white/80 mt-1 uppercase tracking-wider">
              {t("solutions.banner.stat3.label")}
            </div>
          </div>
          <div className="p-4">
            <div className="font-display text-4xl font-bold text-white">
              {t("solutions.banner.stat4.value")}
            </div>
            <div className="text-xs font-semibold text-white/80 mt-1 uppercase tracking-wider">
              {t("solutions.banner.stat4.label")}
            </div>
          </div>
        </div>
      </Section>

      {/* Interactive RAS Engineering Diagram */}
      <Section>
        <AnimatedRasDiagram />
      </Section>

      {/* Four engagement modes */}
      <Section>
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="font-display text-3xl font-bold text-navy">
            {t("solutions.modes.heading")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("solutions.modes.description")}
          </p>
        </div>
      </Section>

      {MODES.map((mode, mi) => {
        const Icon = mode.icon;
        const shaded = mi % 2 === 1;
        return (
          /* Custom section rather than <Section>: the pattern layer has to be a
             full-bleed sibling of the content container, which Section's fixed
             inner max-w-7xl cannot give it. */
          <section
            key={mode.key}
            id={`mode-${mode.key}`}
            className={cn(
              "relative isolate overflow-hidden",
              shaded ? "bg-surface-alt/60 border-y border-border/60" : "bg-background",
            )}
          >
            <ModePattern kind={mode.key} accent={mode.accent} />
            <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
              <div className="space-y-10 max-w-5xl mx-auto">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-navy text-xs font-bold uppercase tracking-widest",
                      mode.accent === "mint" ? "bg-mint/15" : "bg-teal/20",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5",
                        mode.accent === "mint" ? "text-mint-ink" : "text-primary",
                      )}
                    />{" "}
                    {t(`solutions.mode.${mode.key}.badge`)}
                  </div>
                  <h2 className="font-display text-3xl font-bold text-navy">
                    {t(`solutions.mode.${mode.key}.title`)}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`solutions.mode.${mode.key}.description`)}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {mode.items.map((n) => (
                    <div
                      key={n}
                      className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-sm space-y-2"
                    >
                      <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-mint-ink shrink-0" />{" "}
                        {t(`solutions.mode.${mode.key}.item${n}.title`)}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(`solutions.mode.${mode.key}.item${n}.desc`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Mid-page CTA: previously the only conversion point was the form at the
          very bottom, after four full sections of scrolling. */}
      <Section className="py-12">
        <div className="glass-card rounded-3xl border border-primary/25 bg-gradient-to-r from-teal/10 via-background to-mint/10 p-8 md:p-10 max-w-4xl mx-auto text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-navy">
            {t("solutions.midcta.title")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("solutions.midcta.description")}
          </p>
          <Button asChild size="lg" className="rounded-xl font-bold">
            <a href="#advisory-form">
              {t("solutions.midcta.button")} <ArrowRight className="ms-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </Section>

      {/* Consultation Inquiry Form */}
      <Section id="advisory-form" className="bg-surface-alt/40 py-16 border-t border-border/60">
        <div className="grid gap-10 lg:grid-cols-[1fr,380px] max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-8 border border-border/80 bg-background shadow-md space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy">
                {t("solutions.form.title")}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t("solutions.form.description")}
              </p>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-bold text-navy">
                  {t("solutions.form.label.name")}
                </Label>
                <Input
                  name="name"
                  placeholder={t("solutions.form.placeholder.name")}
                  disabled={busy}
                  className="mt-1.5 h-11 text-sm rounded-xl"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label className="text-xs font-bold text-navy">
                  {t("solutions.form.label.company")}
                </Label>
                <Input
                  name="company"
                  placeholder={t("solutions.form.placeholder.company")}
                  disabled={busy}
                  className="mt-1.5 h-11 text-sm rounded-xl"
                />
                {errors.company && (
                  <p className="text-xs text-destructive mt-1">{errors.company}</p>
                )}
              </div>

              <div>
                <Label className="text-xs font-bold text-navy">
                  {t("solutions.form.label.email")}
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder={t("solutions.form.placeholder.email")}
                  disabled={busy}
                  className="mt-1.5 h-11 text-sm rounded-xl"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label className="text-xs font-bold text-navy">
                  {t("solutions.form.label.phone")}
                </Label>
                <Input
                  name="phone"
                  placeholder={t("solutions.form.placeholder.phone")}
                  disabled={busy}
                  className="mt-1.5 h-11 text-sm rounded-xl"
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-bold text-navy">
                  {t("solutions.form.label.serviceType")}
                </Label>
                <select
                  name="serviceType"
                  disabled={busy}
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium text-navy shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="build">{t("solutions.form.option.build")}</option>
                  <option value="run">{t("solutions.form.option.run")}</option>
                  <option value="improve">{t("solutions.form.option.improve")}</option>
                  <option value="source">{t("solutions.form.option.source")}</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-bold text-navy">
                  {t("solutions.form.label.message")}
                </Label>
                <Textarea
                  name="message"
                  rows={4}
                  placeholder={t("solutions.form.placeholder.message")}
                  disabled={busy}
                  className="mt-1.5 text-sm rounded-xl"
                />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={busy}
                className="sm:col-span-2 h-11 font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              >
                {busy ? t("solutions.form.submit.busy") : t("solutions.form.submit.default")}
              </Button>
            </form>
          </div>

          <aside className="glass-card rounded-2xl p-6 border border-border/80 shadow-md bg-background h-fit space-y-6">
            <h3 className="font-display text-lg font-bold text-navy flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-mint" /> {t("solutions.aside.title")}
            </h3>

            <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-navy">{t("solutions.aside.point1.strong")}</strong>{" "}
                {t("solutions.aside.point1.body")}
              </p>
              <p>
                <strong className="text-navy">{t("solutions.aside.point2.strong")}</strong>{" "}
                {t("solutions.aside.point2.body")}
              </p>
              <p>
                <strong className="text-navy">{t("solutions.aside.point3.strong")}</strong>{" "}
                {t("solutions.aside.point3.body")}
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
