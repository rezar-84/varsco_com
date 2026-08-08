import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageCircle,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, PageHero } from "@/components/layout/Page";
import { useCart } from "@/context/CartContext";
import { QuoteRequestDialog } from "@/components/layout/QuoteRequestDialog";
import { toast } from "sonner";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart & B2B Quote Request — VARS Aquaculture" },
      {
        name: "description",
        content:
          "Review your selected aquaculture feed, hatchery items, or seafood for B2B quotation.",
      },
    ],
  }),
  component: CartPage,
});

export function CartPage() {
  const { items, updateQty, remove, clear } = useCart();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [incoterm, setIncoterm] = useState("FOB İzmir Port");
  const router = useRouter();
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t("cartPage.hero.eyebrow")}
        title={t("cartPage.hero.title")}
        description={t("cartPage.hero.description")}
      />

      <Section>
        {items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-xl mx-auto border border-border/80 shadow-md">
            <div className="h-16 w-16 bg-surface-alt rounded-2xl flex items-center justify-center mx-auto text-muted-foreground mb-4">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-navy">
              {t("cartPage.empty.title")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("cartPage.empty.description")}</p>
            <Button className="mt-6 font-bold rounded-xl px-6" asChild>
              <Link to="/products">{t("cartPage.empty.browseCta")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
            {/* Left: Cart Items Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-border/80 shadow-lg bg-background">
              <div className="p-4 bg-surface-alt/60 border-b border-border/60 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-navy">
                  {t("cartPage.items.selected")} ({items.length})
                </span>
                <button
                  onClick={clear}
                  className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> {t("cartPage.items.clearCart")}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-border/60 bg-surface-alt/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">{t("cartPage.table.product")}</th>
                      <th className="px-5 py-3.5">{t("cartPage.table.category")}</th>
                      <th className="px-5 py-3.5 text-center">{t("cartPage.table.quantity")}</th>
                      <th className="px-5 py-3.5 text-right">{t("cartPage.table.action")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {items.map((it) => (
                      <tr
                        key={it.productSlug}
                        className="hover:bg-surface-alt/40 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-alt border border-border/60">
                              {it.image && (
                                <img
                                  src={it.image}
                                  alt={it.title}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-navy">{it.title}</div>
                              <div className="text-[11px] text-muted-foreground">
                                {t("cartPage.items.sku")}: {it.productSlug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-muted-foreground capitalize">
                          {it.category.replace(/-/g, " ")}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-background p-1 shadow-sm">
                            <button
                              onClick={() => updateQty(it.productSlug, it.quantity - 1)}
                              className="rounded-lg p-1 text-navy hover:bg-muted transition-colors"
                              aria-label={t("cartPage.quantity.decrease")}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <input
                              type="number"
                              value={it.quantity}
                              min={1}
                              onChange={(e) =>
                                updateQty(it.productSlug, Number(e.target.value) || 1)
                              }
                              className="w-12 text-center text-xs font-bold text-navy outline-none bg-transparent"
                            />
                            <button
                              onClick={() => updateQty(it.productSlug, it.quantity + 1)}
                              className="rounded-lg p-1 text-navy hover:bg-muted transition-colors"
                              aria-label={t("cartPage.quantity.increase")}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => remove(it.productSlug)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            aria-label={t("cartPage.items.removeItem")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Incoterms & Delivery Preferences */}
              <div className="p-6 bg-surface-alt/40 border-t border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" /> {t("cartPage.delivery.heading")}
                </h4>
                <div className="grid sm:grid-cols-3 gap-2">
                  {["FOB İzmir Port", "FOB Mersin Port", "CIF Rotterdam", "CIF Hamburg", "DDP"].map(
                    (term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setIncoterm(term)}
                        className={`px-3 py-2 text-xs rounded-xl font-semibold border transition-all text-left ${
                          incoterm === term
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                            : "bg-background border-border/80 text-navy hover:border-primary/50"
                        }`}
                      >
                        {term}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Right: B2B Quote Summary Sidebar */}
            <aside className="glass-card rounded-2xl p-6 border border-border/80 shadow-lg bg-background h-fit space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-navy">
                  {t("cartPage.summary.heading")}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("cartPage.summary.description")}
                </p>
              </div>

              <div className="space-y-3 text-xs border-y border-border/60 py-4">
                <div className="flex justify-between text-navy">
                  <span className="text-muted-foreground">
                    {t("cartPage.summary.totalLineItems")}
                  </span>
                  <span className="font-bold">
                    {items.length} {t("cartPage.summary.itemsUnit")}
                  </span>
                </div>
                <div className="flex justify-between text-navy">
                  <span className="text-muted-foreground">
                    {t("cartPage.summary.selectedTerm")}
                  </span>
                  <span className="font-bold text-primary">{incoterm}</span>
                </div>
                <div className="flex justify-between text-navy">
                  <span className="text-muted-foreground">
                    {t("cartPage.summary.responseGuarantee")}
                  </span>
                  <span className="font-bold text-mint-ink flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" /> {t("cartPage.summary.responseTime")}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Button
                  onClick={() => setQuoteOpen(true)}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-md"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t("cartPage.actions.requestQuote")}
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl font-bold border-border/80 hover:bg-muted"
                  onClick={() => {
                    toast.success(t("cartPage.toast.draftCreatedTitle"), {
                      description: t("cartPage.toast.draftCreatedDescription").replace(
                        "{incoterm}",
                        incoterm,
                      ),
                    });
                    clear();
                    router.navigate({ to: "/" });
                  }}
                >
                  {t("cartPage.actions.createDraftOrder")}
                </Button>
              </div>

              <div className="rounded-xl bg-surface-alt p-3.5 border border-border/60 text-[11px] text-muted-foreground space-y-1.5">
                <div className="font-bold text-navy flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-mint-ink shrink-0" />
                  {t("cartPage.guarantee.title")}
                </div>
                <p>{t("cartPage.guarantee.description")}</p>
              </div>
            </aside>
          </div>
        )}
      </Section>

      <QuoteRequestDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}
