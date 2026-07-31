import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/layout/Page";
import { HorecaSupplyWidget } from "@/components/HorecaSupplyWidget";
import { AnimatedHorecaMiddleEastMap } from "@/components/visuals/AnimatedHorecaMiddleEastMap";
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Plane,
  Truck,
  Building2,
  Clock,
  MessageCircle,
  Award,
  UtensilsCrossed,
  Package,
  MapPin,
  FileCheck,
  ChevronRight,
  Scale,
  Thermometer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/context/I18nContext";

import seaBassImgFile from "@/assets/products/seabass.png";
import seaBreamImgFile from "@/assets/products/sea-bream.png";
import shrimpImgFile from "@/assets/products/shrimp.jpg";

import prawnIcon from "@/assets/icons/prawn.svg";
import reeferTruckIcon from "@/assets/icons/reefer-truck.svg";
import iceColdchainIcon from "@/assets/icons/ice-coldchain.svg";

export const Route = createFileRoute("/horeca-seafood-middle-east")({
  head: () => ({
    meta: [
      { title: "Middle East HORECA Seafood & Shrimp Direct Supply | VARS Aquaculture" },
      {
        name: "description",
        content:
          "Direct B2B supply of Mediterranean Sea Bass, Sea Bream, Jumbo Black Tiger & Vannamei Shrimps for hotel chains, fine dining restaurants, and catering in Dubai, KSA, Qatar, Oman & GCC. Daily 0°C air freight, Halal & SFDA/SASO certified.",
      },
    ],
  }),
  component: HorecaSeafoodMiddleEast,
});

function HorecaSeafoodMiddleEast() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    destination: t("horeca.form.destination.default"),
    productInterest: "Sea Bass & Jumbo Shrimps",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          message: `Destination: ${formData.destination}\nProduct interest: ${formData.productInterest}\n\n${formData.notes}`,
          source: "HORECA Middle East Export",
          items: [],
        }),
      });
      if (!response.ok) {
        const errBody = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errBody.error || t("horeca.form.toast.errorDesc"));
      }
      toast.success(t("horeca.form.toast.title"), {
        description: t("horeca.form.toast.desc"),
      });
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        destination: t("horeca.form.destination.default"),
        productInterest: "Sea Bass & Jumbo Shrimps",
        notes: "",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("horeca.form.toast.errorDesc"));
    } finally {
      setLoading(false);
    }
  };

  const PRODUCTS = [
    {
      title: t("horeca.products.shrimp.title"),
      latin: "Penaeus monodon / Litopenaeus vannamei",
      image: shrimpImgFile,
      desc: t("horeca.products.shrimp.desc"),
      specs: [
        t("horeca.products.shrimp.spec1"),
        t("horeca.products.shrimp.spec2"),
        t("horeca.products.shrimp.spec3"),
        t("horeca.products.shrimp.spec4"),
      ],
      badge: t("horeca.products.shrimp.badge"),
    },
    {
      title: t("horeca.products.seabass.title"),
      latin: "Dicentrarchus labrax",
      image: seaBassImgFile,
      desc: t("horeca.products.seabass.desc"),
      specs: [
        t("horeca.products.seabass.spec1"),
        t("horeca.products.seabass.spec2"),
        t("horeca.products.seabass.spec3"),
        t("horeca.products.seabass.spec4"),
      ],
      badge: t("horeca.products.seabass.badge"),
    },
    {
      title: t("horeca.products.seabream.title"),
      latin: "Sparus aurata",
      image: seaBreamImgFile,
      desc: t("horeca.products.seabream.desc"),
      specs: [
        t("horeca.products.seabream.spec1"),
        t("horeca.products.seabream.spec2"),
        t("horeca.products.seabream.spec3"),
        t("horeca.products.seabream.spec4"),
      ],
      badge: t("horeca.products.seabream.badge"),
    },
  ];

  const HORECA_ADVANTAGES = [
    {
      icon: Scale,
      title: t("horeca.advantages.portion.title"),
      desc: t("horeca.advantages.portion.desc"),
    },
    {
      icon: Plane,
      title: t("horeca.advantages.coldchain.title"),
      desc: t("horeca.advantages.coldchain.desc"),
    },
    {
      icon: FileCheck,
      title: t("horeca.advantages.compliance.title"),
      desc: t("horeca.advantages.compliance.desc"),
    },
    {
      icon: UtensilsCrossed,
      title: t("horeca.advantages.packing.title"),
      desc: t("horeca.advantages.packing.desc"),
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* High Impact Hero Banner */}
      <section className="bg-navy text-white relative overflow-hidden py-16 lg:py-24 border-b border-border/80">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint text-navy text-xs font-bold uppercase tracking-widest">
              <UtensilsCrossed className="h-3.5 w-3.5" /> {t("horeca.hero.eyebrow")}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {t("horeca.hero.title.a")}{" "}
              <span className="text-mint font-light">{t("horeca.hero.title.b")}</span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              {t("horeca.hero.lead")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-white/80 font-semibold pt-4 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-mint">
              <ShieldCheck className="h-4 w-4" /> {t("horeca.hero.badge.halal")}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Plane className="h-4 w-4 text-mint" /> {t("horeca.hero.badge.flight")}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-mint" /> {t("horeca.hero.badge.compliance")}
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 space-y-16">
        {/* Interactive HORECA Logistics Widget & Vector Map */}
        <section className="space-y-12">
          <AnimatedHorecaMiddleEastMap />
          <HorecaSupplyWidget />
        </section>

        {/* Product Portfolio Section */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Package className="h-4 w-4" /> {t("horeca.portfolio.eyebrow")}
            </span>
            <h2 className="font-display text-3xl font-bold text-navy">
              {t("horeca.portfolio.title")}
            </h2>
            <p className="text-xs text-muted-foreground">{t("horeca.portfolio.lead")}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <div
                key={p.title}
                className="glass-card rounded-3xl overflow-hidden border border-border/80 bg-background shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-navy relative">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-mint text-navy text-xs font-bold shadow-md">
                      {p.badge}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-navy group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <div className="text-xs italic text-muted-foreground">{p.latin}</div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>

                    <div className="space-y-2 pt-2 border-t border-border/60">
                      <div className="text-[11px] font-bold text-navy uppercase tracking-wider">
                        {t("horeca.portfolio.specsLabel")}
                      </div>
                      {p.specs.map((spec) => (
                        <div
                          key={spec}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-mint shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button
                    size="sm"
                    asChild
                    className="w-full rounded-xl font-bold bg-navy text-white hover:bg-navy/90"
                  >
                    <Link to="/request-quote">
                      {t("horeca.portfolio.cta")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HORECA Value Proposition Grid */}
        <section className="glass-card rounded-3xl p-8 sm:p-12 border border-border/80 bg-surface-alt/60 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display text-3xl font-bold text-navy">
              {t("horeca.advantages.title")}
            </h2>
            <p className="text-xs text-muted-foreground">{t("horeca.advantages.lead")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HORECA_ADVANTAGES.map((adv) => {
              const Icon = adv.icon;
              return (
                <div
                  key={adv.title}
                  className="glass-card rounded-2xl p-5 border border-border/80 bg-background shadow-sm space-y-2"
                >
                  <div className="h-10 w-10 rounded-xl bg-mint/20 flex items-center justify-center text-navy font-bold mb-3">
                    <Icon className="h-5 w-5 text-mint" />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy">{adv.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* B2B HORECA Quote Request Form Section */}
        <section
          id="horeca-form"
          className="rounded-3xl p-8 sm:p-12 border border-border bg-surface-alt shadow-2xl space-y-8"
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-widest border border-primary/20">
                <Building2 className="h-3.5 w-3.5" /> {t("horeca.form.eyebrow")}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy leading-tight">
                {t("horeca.form.title")}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                {t("horeca.form.lead")}
              </p>

              <div className="space-y-3 pt-4 border-t border-border text-xs text-navy font-semibold">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                  <span>{t("horeca.form.bullet1")}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                  <span>{t("horeca.form.bullet2")}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                  <span>{t("horeca.form.bullet3")}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="card-flat rounded-3xl p-6 sm:p-8 border border-border/80 bg-background shadow-xl space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                      {t("horeca.form.label.name")}
                    </label>
                    <Input
                      required
                      placeholder={t("horeca.form.placeholder.name")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-border text-navy font-semibold placeholder:text-muted-foreground text-xs h-11 rounded-xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                      {t("horeca.form.label.company")}
                    </label>
                    <Input
                      required
                      placeholder={t("horeca.form.placeholder.company")}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-background border-border text-navy font-semibold placeholder:text-muted-foreground text-xs h-11 rounded-xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                      {t("horeca.form.label.email")}
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder={t("horeca.form.placeholder.email")}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background border-border text-navy font-semibold placeholder:text-muted-foreground text-xs h-11 rounded-xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                      {t("horeca.form.label.phone")}
                    </label>
                    <Input
                      required
                      placeholder={t("horeca.form.placeholder.phone")}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background border-border text-navy font-semibold placeholder:text-muted-foreground text-xs h-11 rounded-xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                    {t("horeca.form.label.destination")}
                  </label>
                  <Input
                    placeholder={t("horeca.form.placeholder.destination")}
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="bg-background border-border text-navy font-semibold placeholder:text-muted-foreground text-xs h-11 rounded-xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                    {t("horeca.form.label.notes")}
                  </label>
                  <Textarea
                    placeholder={t("horeca.form.placeholder.notes")}
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-background border-border text-navy font-semibold placeholder:text-muted-foreground text-xs rounded-xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full h-12 rounded-xl font-bold bg-navy text-white hover:bg-primary shadow-lg text-sm transition-all hover:scale-[1.01]"
                >
                  {loading ? t("horeca.form.submit.loading") : t("horeca.form.submit.idle")}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
