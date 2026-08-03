import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/context/I18nContext";
import type { Address, AddressInput, AddressType } from "@/lib/api/types";

export const Route = createFileRoute("/account/addresses")({
  component: Addresses,
});

const EMPTY_FORM: AddressInput = {
  type: "delivery",
  name: "",
  street: "",
  street2: "",
  city: "",
  zip: "",
  country: "",
  phone: "",
};

function Addresses() {
  const { t } = useI18n();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/store/addresses");
      if (response.ok) {
        const payload = await response.json();
        setAddresses(payload.data ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setForm({
      type: address.type,
      name: address.name,
      street: address.street,
      street2: address.street2,
      city: address.city,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(
        editing ? `/api/store/addresses/${editing.id}` : "/api/store/addresses",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      if (response.ok) {
        toast.success(t("account.addresses.saveSuccess"));
        setDialogOpen(false);
        await load();
      } else {
        toast.error(t("account.addresses.saveError"));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (address: Address) => {
    if (!window.confirm(t("account.addresses.deleteConfirm"))) return;
    const response = await fetch(`/api/store/addresses/${address.id}`, { method: "DELETE" });
    if (response.ok) {
      toast.success(t("account.addresses.deleteSuccess"));
      setAddresses((prev) => prev.filter((a) => a.id !== address.id));
    } else if (response.status === 409) {
      toast.error(t("account.addresses.deleteInUse"));
    } else {
      toast.error(t("account.addresses.saveError"));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-black text-navy">
            {t("account.addresses.title")}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm font-medium">
            {t("account.addresses.subtitle")}
          </p>
        </div>
        <Button onClick={openAdd} className="rounded-xl font-bold gap-1.5">
          <Plus className="h-4 w-4" /> {t("account.addresses.add")}
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-semibold text-navy/80">{t("account.addresses.loading")}</p>
          </div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-border/60 max-w-lg mx-auto space-y-4">
          <MapPin className="h-12 w-12 text-muted-foreground/60 mx-auto" />
          <div className="font-display text-xl font-bold text-navy">
            {t("account.addresses.emptyTitle")}
          </div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {t("account.addresses.emptyBody")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="glass-card rounded-2xl border border-border/60 p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center rounded-full bg-navy/5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-navy/80 border border-navy/10">
                  {address.type === "invoice"
                    ? t("account.addresses.typeInvoice")
                    : t("account.addresses.typeDelivery")}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(address)}
                    aria-label={t("account.addresses.edit")}
                    className="p-1.5 rounded-lg text-navy/60 hover:bg-muted hover:text-navy"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address)}
                    aria-label={t("account.addresses.delete")}
                    className="p-1.5 rounded-lg text-navy/60 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-sm">
                <div className="font-bold text-navy">{address.name}</div>
                <div className="text-muted-foreground">{address.street}</div>
                {address.street2 && <div className="text-muted-foreground">{address.street2}</div>}
                <div className="text-muted-foreground">
                  {[address.city, address.zip].filter(Boolean).join(" ")}
                </div>
                <div className="text-muted-foreground">{address.country}</div>
                {address.phone && <div className="text-muted-foreground">{address.phone}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? t("account.addresses.formTitleEdit") : t("account.addresses.formTitleAdd")}
            </DialogTitle>
            <DialogDescription>{t("account.addresses.subtitle")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                {t("account.addresses.formType")}
              </Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((f) => ({ ...f, type: v as AddressType }))}
              >
                <SelectTrigger className="mt-1.5 rounded-xl border-border bg-white shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">{t("account.addresses.typeDelivery")}</SelectItem>
                  <SelectItem value="invoice">{t("account.addresses.typeInvoice")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                {t("account.addresses.formName")}
              </Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                {t("account.addresses.formStreet")}
              </Label>
              <Input
                required
                value={form.street}
                onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                {t("account.addresses.formStreet2")}
              </Label>
              <Input
                value={form.street2}
                onChange={(e) => setForm((f) => ({ ...f, street2: e.target.value }))}
                className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                {t("account.addresses.formCity")}
              </Label>
              <Input
                required
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                {t("account.addresses.formZip")}
              </Label>
              <Input
                value={form.zip}
                onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                {t("account.addresses.formCountry")}
              </Label>
              <Input
                required
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                {t("account.addresses.formPhone")}
              </Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-1.5 rounded-xl border-border bg-white shadow-sm"
              />
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl font-bold"
                onClick={() => setDialogOpen(false)}
              >
                {t("account.addresses.cancel")}
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl font-bold gap-1.5">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? t("account.addresses.saving") : t("account.addresses.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
