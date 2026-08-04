import { createFileRoute, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Minus, Plus, Trash2, ShieldCheck, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Section, PageHero } from "@/components/layout/Page";
import { useStoreCart } from "@/context/StoreCartContext";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { formatPrice } from "@/lib/utils/price";
import type { Address } from "@/lib/api/types";
import { useStoreT } from "@/lib/utils/store-i18n";

const DEFAULT_ADDRESS_VALUE = "default";

function addressLabel(address: Address) {
  return `${address.name} — ${address.street}, ${address.city}`;
}

export const Route = createFileRoute("/shop/checkout")({
  head: () => ({
    meta: [{ title: "Store Checkout — VARS Aquaculture" }],
  }),
  component: ShopCheckoutPage,
});

function ShopCheckoutPage() {
  const { t } = useI18n();
  const { items, updateQty, remove, submitOrder } = useStoreCart();
  const st = useStoreT();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingId, setShippingId] = useState<string>(DEFAULT_ADDRESS_VALUE);
  const [billingId, setBillingId] = useState<string>(DEFAULT_ADDRESS_VALUE);

  useEffect(() => {
    if (!isLoading && !user) {
      router.navigate({ to: "/login", search: { redirect: pathname } as Record<string, string> });
    }
  }, [user, isLoading, router, pathname]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/store/addresses")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((payload) => setAddresses(payload.data ?? []))
      .catch(() => setAddresses([]));
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const checkoutResult = await submitOrder({
        shipping_partner_id: shippingId === DEFAULT_ADDRESS_VALUE ? undefined : Number(shippingId),
        billing_partner_id: billingId === DEFAULT_ADDRESS_VALUE ? undefined : Number(billingId),
      });
      if (checkoutResult.payment_url) {
        setPaymentUrl(checkoutResult.payment_url);
        window.location.href = checkoutResult.payment_url;
        return;
      }
      setResult({ ok: true, message: t("store.checkout.success.body") });
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : t("store.checkout.genericError.body"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow={t("store.checkout.hero.eyebrow")}
        title={t("store.checkout.hero.title")}
        description={t("store.checkout.hero.description")}
      />

      <Section>
        {paymentUrl ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-xl mx-auto border border-border/80 shadow-md space-y-4">
            <CreditCard className="h-12 w-12 text-primary mx-auto animate-pulse" />
            <h3 className="font-display text-xl font-bold text-navy">
              {t("store.checkout.redirectingToPayment.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("store.checkout.redirectingToPayment.body")}
            </p>
            <a href={paymentUrl} className="text-xs font-semibold text-primary hover:underline">
              {t("store.checkout.manualPaymentLink")}
            </a>
          </div>
        ) : result?.ok ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-xl mx-auto border border-border/80 shadow-md space-y-4">
            <ShieldCheck className="h-12 w-12 text-mint mx-auto" />
            <h3 className="font-display text-xl font-bold text-navy">
              {t("store.checkout.success.title")}
            </h3>
            <p className="text-sm text-muted-foreground">{result.message}</p>
            <Button asChild className="rounded-xl font-bold">
              <Link to="/shop">{t("store.detail.backToShop")}</Link>
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-xl mx-auto border border-border/80 shadow-md space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-display text-xl font-bold text-navy">
              {t("store.checkout.empty.title")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("store.checkout.empty.body")}</p>
            <Button asChild className="rounded-xl font-bold">
              <Link to="/shop">{t("store.checkout.empty.browseCta")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
            <div className="glass-card rounded-2xl overflow-hidden border border-border/80 shadow-lg bg-background">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-border/60 bg-surface-alt/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">{t("store.checkout.table.product")}</th>
                      <th className="px-5 py-3.5 text-center">
                        {t("store.checkout.table.quantity")}
                      </th>
                      <th className="px-5 py-3.5 text-right">{t("store.checkout.table.action")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {items.map((item) => {
                      const price = formatPrice(item.price);
                      return (
                        <tr
                          key={item.productId}
                          className="hover:bg-surface-alt/40 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-alt border border-border/60">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={st.product(item.name, "name", item.name)}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-navy">
                                  {st.product(item.name, "name", item.name)}
                                </div>
                                {price && (
                                  <div className="text-[11px] text-muted-foreground">{price}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <div className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-background p-1 shadow-sm">
                              <button
                                onClick={() => updateQty(item.productId, item.quantity - 1)}
                                className="rounded-lg p-1 text-navy hover:bg-muted transition-colors"
                                aria-label={t("store.quantity.decrease")}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(item.productId, item.quantity + 1)}
                                className="rounded-lg p-1 text-navy hover:bg-muted transition-colors"
                                aria-label={t("store.quantity.increase")}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => remove(item.productId)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                              aria-label={t("store.items.removeItem")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="glass-card rounded-2xl p-6 border border-border/80 shadow-lg bg-background h-fit space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-navy">
                  {t("store.checkout.summary.heading")}
                </h3>
              </div>

              <div className="space-y-3 text-xs border-y border-border/60 py-4">
                <div className="flex justify-between text-navy">
                  <span className="text-muted-foreground">
                    {t("store.checkout.summary.totalLineItems")}
                  </span>
                  <span className="font-bold">{items.length}</span>
                </div>
              </div>

              {addresses.length > 0 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("store.checkout.shippingAddress")}
                    </label>
                    <Select value={shippingId} onValueChange={setShippingId}>
                      <SelectTrigger className="mt-1.5 h-10 rounded-xl border-border/80 bg-background text-xs font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={DEFAULT_ADDRESS_VALUE}>
                          {t("store.checkout.useAccountAddress")}
                        </SelectItem>
                        {addresses.map((address) => (
                          <SelectItem key={address.id} value={String(address.id)}>
                            {addressLabel(address)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("store.checkout.billingAddress")}
                    </label>
                    <Select value={billingId} onValueChange={setBillingId}>
                      <SelectTrigger className="mt-1.5 h-10 rounded-xl border-border/80 bg-background text-xs font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={DEFAULT_ADDRESS_VALUE}>
                          {t("store.checkout.useAccountAddress")}
                        </SelectItem>
                        {addresses.map((address) => (
                          <SelectItem key={address.id} value={String(address.id)}>
                            {addressLabel(address)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {result && !result.ok && (
                <p className="text-xs font-semibold text-destructive">{result.message}</p>
              )}

              <Button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-md"
              >
                {submitting ? t("store.checkout.placing") : t("store.checkout.placeOrder")}
              </Button>

              <p className="text-[11px] text-muted-foreground">
                {t("store.checkout.summary.note")}
              </p>
            </aside>
          </div>
        )}
      </Section>
    </>
  );
}
