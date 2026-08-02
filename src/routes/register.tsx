import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { z } from "zod";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { VarsLogo } from "@/components/layout/VarsLogo";
import { safeRedirectTarget } from "@/lib/utils/redirect";

const registerSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/register")({
  validateSearch: (search) => registerSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "B2B Partner Registration — VARS Aquaculture" },
      {
        name: "description",
        content:
          "Register your company to access custom pricing, instant B2B quotes, and Odoo portal services.",
      },
    ],
  }),
  component: Register,
});

function Register() {
  const { t } = useI18n();
  const { register, error: authError, clearError } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const search = Route.useSearch();
  const redirectTo = safeRedirectTarget(search.redirect);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;

    const schema = z.object({
      name: z.string().trim().min(2, t("auth.validation.nameRequired")),
      company: z.string().trim().min(2, t("auth.validation.companyRequired")),
      country: z.string().trim().min(2, t("auth.validation.countryRequired")),
      email: z.string().trim().email(t("auth.validation.email")),
      phone: z.string().trim().min(6, t("auth.validation.phoneRequired")),
      password: z.string().min(6, t("auth.validation.passwordMin")),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    const res = await register(parsed.data);
    setIsSubmitting(false);

    if (res.success) {
      router.navigate({ to: redirectTo as "/account" });
    } else if (res.error) {
      setFormError(res.error);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-alt/40">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-[700px] bg-teal/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-4xl">
        <div className="glass-card rounded-2xl p-8 sm:p-12 shadow-2xl border border-white/80 bg-background/95">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-mint" /> {t("auth.register.badge")}
            </div>
            <h1 className="font-display text-3xl font-bold text-navy">
              {t("auth.register.heading")}
            </h1>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {t("auth.register.subheading")}
            </p>
          </div>

          {(formError || authError) && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed max-w-xl mx-auto animate-in fade-in-0">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{formError || authError}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <Label htmlFor="name" className="text-xs font-bold text-navy">
                {t("auth.register.contactName")}
              </Label>
              <div className="relative mt-1.5">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="name"
                  name="name"
                  placeholder={t("auth.register.contactNamePlaceholder")}
                  required
                  className="pl-10 h-11 text-sm rounded-xl border-border/80"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="company" className="text-xs font-bold text-navy">
                {t("auth.register.companyName")}
              </Label>
              <div className="relative mt-1.5">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="company"
                  name="company"
                  placeholder={t("auth.register.companyNamePlaceholder")}
                  required
                  className="pl-10 h-11 text-sm rounded-xl border-border/80"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="email" className="text-xs font-bold text-navy">
                {t("auth.emailLabel")}
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("auth.register.emailPlaceholder")}
                  required
                  className="pl-10 h-11 text-sm rounded-xl border-border/80"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="phone" className="text-xs font-bold text-navy">
                {t("auth.register.phone")}
              </Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder={t("auth.register.phonePlaceholder")}
                  required
                  className="pl-10 h-11 text-sm rounded-xl border-border/80"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="country" className="text-xs font-bold text-navy">
                {t("auth.register.country")}
              </Label>
              <div className="relative mt-1.5">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="country"
                  name="country"
                  placeholder={t("auth.register.countryPlaceholder")}
                  required
                  className="pl-10 h-11 text-sm rounded-xl border-border/80"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="password" className="text-xs font-bold text-navy">
                {t("auth.register.password")}
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.register.passwordPlaceholder")}
                  required
                  className="pl-10 pr-10 h-11 text-sm rounded-xl border-border/80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("auth.register.submitBusy")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t("auth.register.submitDefault")} <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-border/60 text-center text-xs text-muted-foreground">
            {t("auth.register.haveAccount")}{" "}
            <Link
              to="/login"
              search={search.redirect ? { redirect: search.redirect } : undefined}
              className="font-bold text-primary hover:underline"
            >
              {t("auth.register.signIn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
