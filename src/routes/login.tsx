import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { z } from "zod";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  ArrowRight,
  FileCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { VarsLogo } from "@/components/layout/VarsLogo";
import { safeRedirectTarget } from "@/lib/utils/redirect";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Sign In — VARS Aquaculture B2B Portal" },
      {
        name: "description",
        content:
          "Sign in to access your VARS B2B portal account, custom Odoo price lists, and shipment clearances.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const { t } = useI18n();
  const { login, error: authError, clearError } = useAuth();
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
      email: z.string().trim().email(t("auth.validation.email")),
      password: z.string().min(1, t("auth.validation.passwordRequired")),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    const res = await login(parsed.data.email, parsed.data.password);
    setIsSubmitting(false);

    if (res.success) {
      router.navigate({ to: redirectTo as "/account" });
    } else if (res.error) {
      setFormError(res.error);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-alt/40">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-[600px] bg-mint/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Benefits Overview */}
        <div className="lg:col-span-6 space-y-6 hidden lg:block pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/15 text-navy text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5 text-mint-ink" /> {t("auth.login.badge")}
          </div>

          <h1 className="font-display text-4xl font-bold text-navy leading-tight">
            {t("auth.login.heroTitle")}
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("auth.login.heroBody")}
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-background border border-border/80 text-primary shrink-0 shadow-sm">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy">{t("auth.login.feature1Title")}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("auth.login.feature1Body")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-background border border-border/80 text-primary shrink-0 shadow-sm">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy">{t("auth.login.feature2Title")}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("auth.login.feature2Body")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-background border border-border/80 text-primary shrink-0 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy">{t("auth.login.feature3Title")}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("auth.login.feature3Body")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="lg:col-span-6 w-full">
          <div className="glass-card rounded-2xl p-8 sm:p-10 shadow-2xl border border-white/80 bg-background/95">
            <div className="text-center sm:text-left">
              <VarsLogo variant="header" className="mb-4 inline-flex lg:hidden" />
              <h2 className="font-display text-2xl font-bold text-navy">
                {t("auth.login.formTitle")}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">{t("auth.login.formSubtitle")}</p>
            </div>

            {(formError || authError) && (
              <div className="mt-6 flex items-start gap-3 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed animate-in fade-in-0">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError || authError}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email" className="text-xs font-bold text-navy">
                  {t("auth.emailLabel")}
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("auth.login.emailPlaceholder")}
                    required
                    className="pl-10 h-11 text-sm rounded-xl border-border/80 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-navy">
                    {t("auth.login.passwordLabel")}
                  </Label>
                  <a
                    href="#"
                    className="text-xs font-semibold text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(t("auth.login.resetAlert"));
                    }}
                  >
                    {t("auth.login.forgotPassword")}
                  </a>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 h-11 text-sm rounded-xl border-border/80 focus:border-primary"
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-md mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("auth.login.authenticating")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t("auth.login.signInButton")} <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/60 text-center text-xs text-muted-foreground">
              {t("auth.login.newPartner")}{" "}
              <Link
                to="/register"
                search={search.redirect ? { redirect: search.redirect } : undefined}
                className="font-bold text-primary hover:underline"
              >
                {t("auth.login.createAccount")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
