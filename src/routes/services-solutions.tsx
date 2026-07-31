import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageHero, Section } from "@/components/layout/Page";
import { AnimatedRasDiagram } from "@/components/visuals/AnimatedRasDiagram";
import {
  Award,
  Users,
  Network,
  Rocket,
  Wrench,
  ShieldCheck,
  Building2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Clock,
  Compass,
  Layers,
  Cpu,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/services-solutions")({
  head: () => ({
    meta: [
      { title: "Expert Aquaculture Consulting, Advisory & Sourcing — 30+ Years Experience | VARS" },
      {
        name: "description",
        content:
          "Guided by industry experts with 30+ years of hands-on experience, VARS Aquaculture delivers expert investor guidance, equipment & feed sourcing facilitation, RAS hatchery design, operational troubleshooting, and export readiness.",
      },
    ],
  }),
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
  const { t } = useI18n();
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
        body: JSON.stringify({ ...parsed.data, items: [], source: "Services & Solutions" }),
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

  const INVESTOR_ROADMAP = [
    {
      step: "01",
      title: t("solutions.roadmap.item1.title"),
      desc: t("solutions.roadmap.item1.desc"),
    },
    {
      step: "02",
      title: t("solutions.roadmap.item2.title"),
      desc: t("solutions.roadmap.item2.desc"),
    },
    {
      step: "03",
      title: t("solutions.roadmap.item3.title"),
      desc: t("solutions.roadmap.item3.desc"),
    },
    {
      step: "04",
      title: t("solutions.roadmap.item4.title"),
      desc: t("solutions.roadmap.item4.desc"),
    },
    {
      step: "05",
      title: t("solutions.roadmap.item5.title"),
      desc: t("solutions.roadmap.item5.desc"),
    },
  ];

  const TROUBLESHOOTING_SERVICES = [
    {
      title: t("solutions.troubleshooting.item1.title"),
      desc: t("solutions.troubleshooting.item1.desc"),
    },
    {
      title: t("solutions.troubleshooting.item2.title"),
      desc: t("solutions.troubleshooting.item2.desc"),
    },
    {
      title: t("solutions.troubleshooting.item3.title"),
      desc: t("solutions.troubleshooting.item3.desc"),
    },
    {
      title: t("solutions.troubleshooting.item4.title"),
      desc: t("solutions.troubleshooting.item4.desc"),
    },
  ];

  const NETWORK_PILLARS = [
    {
      title: t("solutions.network.item1.title"),
      desc: t("solutions.network.item1.desc"),
    },
    {
      title: t("solutions.network.item2.title"),
      desc: t("solutions.network.item2.desc"),
    },
    {
      title: t("solutions.network.item3.title"),
      desc: t("solutions.network.item3.desc"),
    },
    {
      title: t("solutions.network.item4.title"),
      desc: t("solutions.network.item4.desc"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("solutions.hero.eyebrow")}
        title={t("solutions.hero.title")}
        description={t("solutions.hero.description")}
      />

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

      {/* Turn-Key Investor Roadmap (0 to 1) */}
      <Section>
        <div className="space-y-10 max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/15 text-navy text-xs font-bold uppercase tracking-widest">
              <Compass className="h-3.5 w-3.5 text-mint" /> {t("solutions.roadmap.badge")}
            </div>
            <h2 className="font-display text-3xl font-bold text-navy">
              {t("solutions.roadmap.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("solutions.roadmap.description")}
            </p>
          </div>

          <div className="space-y-4">
            {INVESTOR_ROADMAP.map((item) => (
              <div
                key={item.step}
                className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-sm flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="font-display text-4xl font-bold text-mint shrink-0">
                  {item.step}
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-navy">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Operational Troubleshooting (For Existing Operators) */}
      <Section className="bg-surface-alt/60 py-16 border-y border-border/60">
        <div className="space-y-10 max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-widest">
              <Wrench className="h-3.5 w-3.5 text-primary" /> {t("solutions.troubleshooting.badge")}
            </div>
            <h2 className="font-display text-3xl font-bold text-navy">
              {t("solutions.troubleshooting.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("solutions.troubleshooting.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TROUBLESHOOTING_SERVICES.map((t) => (
              <div
                key={t.title}
                className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-sm space-y-2"
              >
                <h3 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" /> {t.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Global Supplier & Procurement Network */}
      <Section>
        <div className="space-y-10 max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/15 text-navy text-xs font-bold uppercase tracking-widest">
              <Network className="h-3.5 w-3.5 text-mint" /> {t("solutions.network.badge")}
            </div>
            <h2 className="font-display text-3xl font-bold text-navy">
              {t("solutions.network.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("solutions.network.description")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {NETWORK_PILLARS.map((np) => (
              <div
                key={np.title}
                className="glass-card rounded-2xl p-6 border border-border/80 bg-background shadow-sm space-y-2"
              >
                <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" /> {np.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{np.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Consultation Inquiry Form */}
      <Section className="bg-surface-alt/40 py-16 border-t border-border/60">
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
                  <option value="new-investor">{t("solutions.form.option.newInvestor")}</option>
                  <option value="troubleshooting">
                    {t("solutions.form.option.troubleshooting")}
                  </option>
                  <option value="procurement">{t("solutions.form.option.procurement")}</option>
                  <option value="export-compliance">
                    {t("solutions.form.option.exportCompliance")}
                  </option>
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
