import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageHero, Section } from "@/components/layout/Page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  ShieldCheck,
  Clock,
  Send,
  Globe2,
  Plane,
  CheckCircle2,
  MessageCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import turkeyFlagSvg from "@/assets/icons/turkey-flag.svg";

import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/contactus")({
  head: () => ({
    meta: [
      { title: "Contact VARS Aquaculture — Global B2B Export Desk & İzmir HQ" },
      {
        name: "description",
        content:
          "Connect directly with VARS Aquaculture's export desk in İzmir, Türkiye. Inquire about certified salmon eggs, artemia live feed, seafood exports, or RAS technical engineering.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useI18n();
  const [inquiryType, setInquiryType] = useState("quote");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const INQUIRY_TYPES = [
    {
      id: "quote",
      label: t("contact.form.inquiry.quote.label"),
      desc: t("contact.form.inquiry.quote.desc"),
    },
    {
      id: "hatchery",
      label: t("contact.form.inquiry.hatchery.label"),
      desc: t("contact.form.inquiry.hatchery.desc"),
    },
    {
      id: "logistics",
      label: t("contact.form.inquiry.logistics.label"),
      desc: t("contact.form.inquiry.logistics.desc"),
    },
    {
      id: "technical",
      label: t("contact.form.inquiry.technical.label"),
      desc: t("contact.form.inquiry.technical.desc"),
    },
  ];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    data.inquiryType = inquiryType;

    const schema = z.object({
      name: z.string().trim().min(2, t("contact.validation.name")).max(100),
      company: z.string().trim().min(2, t("contact.validation.company")).max(120),
      email: z.string().trim().email(t("contact.validation.email")),
      phone: z.string().trim().min(6, t("contact.validation.phone")).max(30),
      inquiryType: z.string().min(1, t("contact.validation.inquiryType")),
      message: z.string().trim().min(5, t("contact.validation.message")).max(1000),
    });

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
        body: JSON.stringify({ ...parsed.data, items: [], source: "Contact Us" }),
      });
      if (!response.ok) {
        const errBody = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errBody.error || t("contact.toast.submitError"));
      }
      toast.success(t("contact.toast.successTitle"), {
        description: t("contact.toast.successDesc"),
      });
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("contact.toast.genericError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHero
        variant="navy"
        eyebrow={t("contact.hero.eyebrow")}
        title={
          <>
            {t("contact.hero.title.a")}{" "}
            <span className="text-mint">{t("contact.hero.title.b")}</span>
          </>
        }
        description={t("contact.hero.description")}
      >
        <div className="grid gap-8 lg:grid-cols-12 items-center pt-2">
          {/* Left Hero Telemetry Pills */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 font-semibold border-t border-white/10 pt-5">
              <span className="flex items-center gap-2 text-mint bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <img
                  src={turkeyFlagSvg}
                  alt="Flag of Türkiye"
                  className="h-3.5 w-5 rounded object-cover shadow-sm"
                />
                <span>{t("contact.hero.pill.hq")}</span>
              </span>
              <span className="flex items-center gap-1.5 text-sky-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <Plane className="h-4 w-4 text-sky-400" />
                <span>{t("contact.hero.pill.logistics")}</span>
              </span>
              <span className="flex items-center gap-1.5 text-mint bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <ShieldCheck className="h-4 w-4" />
                <span>{t("contact.sla")}</span>
              </span>
            </div>
          </div>

          {/* Right Hero Visual Card - Shifted Higher Alongside Hero Title & Description */}
          <div className="lg:col-span-5 lg:-mt-44 lg:mb-2 relative z-20">
            <div className="rounded-3xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4 relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-mint">
                    {t("contact.hero.card.liveLabel")}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/70">
                  {t("contact.hero.card.timezone")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-navy/80 border border-white/10 text-left">
                  <div className="text-[10px] font-bold text-mint uppercase tracking-wider">
                    {t("contact.hero.card.slaTitle")}
                  </div>
                  <div className="font-display text-lg font-bold text-white mt-0.5">
                    {t("contact.hero.card.slaValue")}
                  </div>
                  <div className="text-[9px] text-white/70 mt-0.5">
                    {t("contact.hero.card.slaNote")}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-navy/80 border border-white/10 text-left">
                  <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">
                    {t("contact.hero.card.logisticsTitle")}
                  </div>
                  <div className="font-display text-lg font-bold text-white mt-0.5">
                    {t("contact.hero.card.logisticsValue")}
                  </div>
                  <div className="text-[9px] text-white/70 mt-0.5">
                    {t("contact.hero.card.logisticsNote")}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-mint/15 border border-mint/30 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">
                  {t("contact.hero.card.activeDesksLabel")}
                </span>
                <span className="font-mono text-[11px] font-bold text-mint">
                  {t("contact.hero.card.activeDesksValue")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PageHero>

      <Section className="py-6 sm:py-10">
        <div className="grid gap-8 md:grid-cols-12 items-start">
          {/* Main Interactive Contact Form Box */}
          <div className="md:col-span-7 rounded-3xl p-6 sm:p-10 border border-border bg-background shadow-xl space-y-8">
            <div className="space-y-2 border-b border-border/80 pb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Send className="h-3.5 w-3.5" /> Fast Inquiry Router
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                {t("contact.form.sendInquiry")}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("contact.form.selectTopic")}
              </p>
            </div>

            {/* Inquiry Type Router Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                {t("contact.form.category")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {INQUIRY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInquiryType(type.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      inquiryType === type.id
                        ? "bg-navy text-white border-navy shadow-md scale-[1.02]"
                        : "bg-surface-alt text-navy hover:bg-background border-border/80"
                    }`}
                  >
                    <div className="font-bold text-xs leading-tight">{type.label}</div>
                    <div
                      className={`text-[10px] mt-1 ${inquiryType === type.id ? "text-mint font-medium" : "text-muted-foreground"}`}
                    >
                      {type.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form Fields */}
            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                  {t("contact.form.contactName")}
                </Label>
                <Input
                  name="name"
                  placeholder={t("contact.form.placeholder.name")}
                  disabled={busy}
                  className="h-11 text-xs font-semibold rounded-xl bg-background border-border"
                />
                {errors.name && (
                  <p className="text-[11px] text-destructive font-medium mt-0.5">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                  {t("contact.form.companyName")}
                </Label>
                <Input
                  name="company"
                  placeholder={t("contact.form.placeholder.company")}
                  disabled={busy}
                  className="h-11 text-xs font-semibold rounded-xl bg-background border-border"
                />
                {errors.company && (
                  <p className="text-[11px] text-destructive font-medium mt-0.5">
                    {errors.company}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                  {t("contact.form.corporateEmail")}
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder={t("contact.form.placeholder.email")}
                  disabled={busy}
                  className="h-11 text-xs font-semibold rounded-xl bg-background border-border"
                />
                {errors.email && (
                  <p className="text-[11px] text-destructive font-medium mt-0.5">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                  {t("contact.form.phone")}
                </Label>
                <Input
                  name="phone"
                  placeholder={t("contact.form.placeholder.phone")}
                  disabled={busy}
                  className="h-11 text-xs font-semibold rounded-xl bg-background border-border"
                />
                {errors.phone && (
                  <p className="text-[11px] text-destructive font-medium mt-0.5">{errors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                  {t("contact.form.details")}
                </Label>
                <Textarea
                  name="message"
                  rows={5}
                  placeholder={t("contact.form.placeholder.details")}
                  disabled={busy}
                  className="text-xs font-semibold rounded-xl bg-background border-border"
                />
                {errors.message && (
                  <p className="text-[11px] text-destructive font-medium mt-0.5">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={busy}
                size="lg"
                className="sm:col-span-2 h-12 font-bold rounded-xl bg-navy text-white hover:bg-primary shadow-xl text-sm transition-all hover:scale-[1.01]"
              >
                {busy ? t("contact.form.transmitting") : t("contact.form.submit")}
              </Button>
            </form>
          </div>

          {/* Regional Sales Desks & Corporate Info Sidebar - Positioned Side-by-Side with Form */}
          <aside className="md:col-span-5 space-y-6">
            {/* Global HQ Box */}
            <div className="rounded-3xl p-6 border border-border bg-surface-alt shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={turkeyFlagSvg}
                    alt="Flag of Türkiye"
                    className="h-5 w-7 rounded object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="font-display text-base font-bold text-navy">
                      {t("contact.hq")}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-semibold">
                      VARS Su Ürünleri A.Ş. • İzmir, Türkiye
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  ADB Hub
                </span>
              </div>

              {/* İzmir Skyline Vector Card */}
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-navy via-navy/95 to-slate-900 p-4 text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint bg-mint/15 px-2.5 py-0.5 rounded-full border border-mint/30">
                      {t("contact.form.card.title")}
                    </span>
                    <h4 className="font-display text-sm font-bold text-white mt-1">
                      {t("contact.form.card.subtitle")}
                    </h4>
                  </div>
                </div>
                <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-950/40 p-2 flex items-center justify-center border border-white/10">
                  <img
                    src="https://varsco.com/web/image/9761-682cbfc6/customized_Skyscrapers_in_Izmir_-_Turkey_7cc6f255-112b-42c5-a530-2ac66e31671c.svg"
                    alt={t("contact.form.card.alt")}
                    className="h-full w-full object-contain filter drop-shadow-md brightness-110 contrast-125"
                  />
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-navy font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-navy">{t("contact.hqAddress")}</div>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed text-[11px]">
                      İsmet Kaptan Mah., Şair Eşref Blv. No:6 D:304/B, Konak, İzmir, 35210, Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-bold text-navy">{t("contact.exportLine")}</div>
                    <a
                      href="tel:+902322905756"
                      className="text-muted-foreground hover:text-primary transition-colors text-[11px]"
                    >
                      +90 232 290 57 56
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-bold text-navy">{t("contact.emailLabel")}</div>
                    <a
                      href="mailto:info@varsco.com"
                      className="text-muted-foreground hover:text-primary transition-colors text-[11px]"
                    >
                      info@varsco.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-bold text-navy">{t("contact.workingHours")}</div>
                    <p className="text-muted-foreground text-[11px]">
                      {t("contact.workingHoursValue")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Sales Desks */}
            <div className="rounded-3xl p-6 border border-border bg-background shadow-lg space-y-4">
              <h4 className="font-display text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-primary" /> {t("contact.regionalDesks")}
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-surface-alt border border-border/80 space-y-1">
                  <div className="font-bold text-navy flex items-center justify-between">
                    <span>{t("contact.desk.gcc")}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {t("contact.desk.gcc.location")}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t("contact.desk.gcc.desc")}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-alt border border-border/80 space-y-1">
                  <div className="font-bold text-navy flex items-center justify-between">
                    <span>{t("contact.desk.eu")}</span>
                    <span className="text-[10px] text-sky-600 font-bold bg-sky-500/10 px-2 py-0.5 rounded-full">
                      {t("contact.desk.eu.status")}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t("contact.desk.eu.desc")}</p>
                </div>
              </div>
            </div>

            {/* {t("contact.responseGuarantee")} Box */}
            <div className="rounded-3xl bg-navy text-white p-6 border border-navy shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-mint uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" /> {t("contact.responseGuarantee")}
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Every inquiry submitted via our portal creates a priority lead in our Odoo CRM
                platform and is assigned to a senior sales engineer within 4 hours.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
