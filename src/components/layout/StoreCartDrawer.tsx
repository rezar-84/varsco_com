import { Link, useRouter } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useStoreCart } from "@/context/StoreCartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useI18n } from "@/context/I18nContext";
import { formatPrice } from "@/lib/utils/price";

export function StoreCartDrawer() {
  const { items, isOpen, closeDrawer, updateQty, remove } = useStoreCart();
  const { t } = useI18n();
  const router = useRouter();

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && closeDrawer()}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col">
        <SheetHeader>
          <SheetTitle>{t("store.cartDrawer.title")}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
            <p className="text-muted-foreground">{t("store.cartDrawer.empty")}</p>
            <Button asChild onClick={closeDrawer}>
              <Link to="/shop">{t("store.cartDrawer.browse")}</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-y-auto space-y-4 pr-1 mt-4">
            {items.map((item) => {
              const price = formatPrice(item.price);
              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 rounded-xl border p-3 bg-surface-alt/50"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 object-cover rounded-lg border"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-navy">{item.name}</h4>
                    {price && <span className="text-xs text-muted-foreground">{price}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                      className="rounded p-1 hover:bg-muted"
                      aria-label={t("store.quantity.decrease")}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      className="rounded p-1 hover:bg-muted"
                      aria-label={t("store.quantity.increase")}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => remove(item.productId)}
                      className="rounded p-1 text-destructive hover:bg-destructive/10 ms-1"
                      aria-label={t("store.items.removeItem")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-4 space-y-2 border-t pt-4">
            <Button
              className="w-full"
              onClick={() => {
                closeDrawer();
                router.navigate({ to: "/shop/checkout" });
              }}
            >
              {t("store.cartDrawer.checkout")}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
