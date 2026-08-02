import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/account/profile")({
  component: Profile,
});

function Profile() {
  const { t } = useI18n();
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;

    const profileData = {
      name: data.name || user?.name,
      company: data.company || user?.company,
      email: data.email || user?.email,
      phone: data.phone || user?.phone,
      street: data.street || user?.street,
      city: data.city || user?.city,
      country: data.country || user?.country,
    };

    try {
      const response = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        updateUser(profileData);
        toast.success(t("account.profile.toastSuccess") || "Company profile updated successfully.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Network error. Failed to connect to server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-black text-navy">
          {t("account.profile.title") || "Corporate Profile"}
        </h1>
        <p className="mt-2 text-muted-foreground text-sm font-medium">
          {t("account.profile.subtitle") ||
            "Update your company representative contacts and billing destination details."}
        </p>
      </div>

      <div className="glass-card rounded-2xl border border-border/60 p-6 sm:p-8 max-w-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2 flex items-center gap-3 pb-4 border-b border-border/40">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-navy text-sm uppercase tracking-wider">
                {t("account.profile.section.partnerInfo") || "Partner Information"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {t("account.profile.section.partnerDesc") ||
                  "Provide official details linked to your ERP registration."}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="name" className="text-xs font-bold text-navy uppercase tracking-wider">
              {t("account.profile.fullName") || "Representative Name"}
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name}
              className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              required
            />
          </div>
          <div>
            <Label
              htmlFor="company"
              className="text-xs font-bold text-navy uppercase tracking-wider"
            >
              {t("account.profile.company") || "Registered Company"}
            </Label>
            <Input
              id="company"
              name="company"
              defaultValue={user?.company}
              className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-xs font-bold text-navy uppercase tracking-wider">
              {t("account.profile.email") || "B2B Email Address"}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email}
              className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-xs font-bold text-navy uppercase tracking-wider">
              {t("account.profile.phone") || "Business Phone"}
            </Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={user?.phone ?? ""}
              className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <Label
              htmlFor="street"
              className="text-xs font-bold text-navy uppercase tracking-wider"
            >
              {t("account.profile.street") || "Billing / Shipping Street Address"}
            </Label>
            <Input
              id="street"
              name="street"
              defaultValue={user?.street ?? ""}
              className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
            />
          </div>
          <div>
            <Label htmlFor="city" className="text-xs font-bold text-navy uppercase tracking-wider">
              {t("account.profile.city") || "City"}
            </Label>
            <Input
              id="city"
              name="city"
              defaultValue={user?.city ?? ""}
              className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
            />
          </div>
          <div>
            <Label
              htmlFor="country"
              className="text-xs font-bold text-navy uppercase tracking-wider"
            >
              {t("account.profile.country") || "Operation Country"}
            </Label>
            <Input
              id="country"
              name="country"
              defaultValue={user?.country ?? ""}
              className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
            />
          </div>

          <Button
            className="sm:col-span-2 justify-self-start mt-2 rounded-xl font-bold px-6 py-2.5 shadow-sm inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("account.profile.saving") || "Saving Changes..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t("account.profile.save") || "Save Settings"}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
