import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { QuoteForm } from "@/components/layout/QuoteForm";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";

/**
 * The quote form in a drawer over the current page.
 *
 * The product page used to navigate to /request-quote carrying `product` and
 * `category` in the search string — both of which it already knew. The
 * navigation therefore added no information and cost the buyer the specs, MOQ
 * and image at exactly the moment they were describing what they needed.
 *
 * A full inline form would have been worse: QuoteForm is 17 fields, so
 * embedding it in every product page pushes the ranking content down and
 * leaves two form implementations to keep in sync. Wrapping the existing
 * component keeps one implementation and one validation schema.
 *
 * /request-quote stays a real route: direct links, campaigns and multi-product
 * RFQs from the cart all still need a URL of their own.
 */
export function QuoteDrawer({
  open,
  onOpenChange,
  productSlug,
  productTitle,
  source = "Product Detail Drawer",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productSlug?: string;
  productTitle?: string;
  source?: string;
}) {
  const { t } = useI18n();
  const { submitQuote } = useCart();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    // Reset to the form when the drawer is reopened, so a second enquiry does
    // not land on the previous success panel.
    if (!next) setDone(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto p-0"
        aria-describedby={undefined}
      >
        <div className="p-6 sm:p-8">
          <SheetHeader className="mb-6 text-start">
            <SheetTitle className="font-display text-2xl font-bold text-navy">
              {t("quote.title")}
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              {productTitle
                ? `${t("quote.drawer.forProduct")} ${productTitle}`
                : t("quote.page.descGeneral")}
            </SheetDescription>
          </SheetHeader>

          {done ? (
            <div className="space-y-4 rounded-2xl border border-border/80 bg-surface-alt/60 p-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-navy">
                {t("quote.success.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("quote.success.body")}
              </p>
              <Button
                variant="outline"
                className="rounded-xl font-bold"
                onClick={() => handleOpenChange(false)}
              >
                {t("quote.drawer.close")}
              </Button>
            </div>
          ) : (
            <>
              <QuoteForm
                busy={busy}
                initialProductSlug={productSlug}
                onSubmit={async (data) => {
                  setBusy(true);
                  try {
                    await submitQuote(data, source);
                    setDone(true);
                    toast.success(t("quote.success.title"), {
                      description: t("quote.success.body"),
                    });
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : t("quote.drawer.error"));
                  } finally {
                    setBusy(false);
                  }
                }}
              />

              {/* Escape hatch to the full page, which carries the trust banner,
                  SLA copy and the multi-product cart flow this drawer omits. */}
              <div className="mt-6 border-t border-border/60 pt-4 text-center">
                <Link
                  to="/request-quote"
                  search={productSlug ? { product: productSlug } : {}}
                  onClick={() => handleOpenChange(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-navy transition-colors"
                >
                  {t("quote.drawer.fullPage")} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
