import { Link, useRouter } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { QuoteRequestDialog } from "./QuoteRequestDialog";
import { createWhatsAppUrl } from "@/lib/utils/whatsapp";
import { useI18n } from "@/context/I18nContext";

export function CartDrawer() {
  const { items, isOpen, closeDrawer, updateQty, remove } = useCart();
  const { t } = useI18n();
  const router = useRouter();
  const [quoteOpen, setQuoteOpen] = useState(false);

  const whatsappUrl = createWhatsAppUrl({
    cartItems: items.map((i) => ({ title: i.title, quantity: i.quantity })),
  });

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(v) => !v && closeDrawer()}>
        <SheetContent side="right" className="flex w-full max-w-md flex-col">
          <SheetHeader>
            <SheetTitle>{t("cart.title")}</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
              <p className="text-muted-foreground">{t("cart.empty")}</p>
              <Button asChild onClick={closeDrawer}>
                <Link to="/products">{t("cart.browse")}</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col overflow-y-auto space-y-4 pr-1 mt-4">
              {items.map((item) => (
                <div
                  key={item.productSlug}
                  className="flex items-center justify-between gap-4 rounded-xl border p-3 bg-surface-alt/50"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={
                        t(`product.${item.productSlug}.title`) ===
                        `product.${item.productSlug}.title`
                          ? item.title
                          : t(`product.${item.productSlug}.title`)
                      }
                      className="h-14 w-14 object-cover rounded-lg border"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-navy">
                      {t(`product.${item.productSlug}.title`) ===
                      `product.${item.productSlug}.title`
                        ? item.title
                        : t(`product.${item.productSlug}.title`)}
                    </h4>
                    <span className="text-xs text-muted-foreground uppercase">
                      {item.category.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.productSlug, item.quantity - 1)}
                      className="rounded p-1 hover:bg-muted"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.productSlug, item.quantity + 1)}
                      className="rounded p-1 hover:bg-muted"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => remove(item.productSlug)}
                      className="rounded p-1 text-destructive hover:bg-destructive/10 ms-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={closeDrawer}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4 fill-current" />
                <span>{t("cart.whatsapp")}</span>
              </a>
              <Button className="w-full" onClick={() => setQuoteOpen(true)}>
                {t("cart.formalQuote")}
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  closeDrawer();
                  router.navigate({ to: "/cart" });
                }}
              >
                {t("cart.checkout")}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <QuoteRequestDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}
