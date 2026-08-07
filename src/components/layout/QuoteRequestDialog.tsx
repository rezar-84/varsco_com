import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteForm } from "./QuoteForm";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { buildSubmissionContext, SUBMISSION_SOURCES } from "@/lib/submission-context";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function QuoteRequestDialog({ open, onOpenChange }: Props) {
  const { submitQuote, closeDrawer } = useCart();
  const { t, lang } = useI18n();
  const [busy, setBusy] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("quote.title")}</DialogTitle>
          <DialogDescription>{t("quote.subtitle")}</DialogDescription>
        </DialogHeader>
        <QuoteForm
          busy={busy}
          onSubmit={async (data) => {
            setBusy(true);
            // Without the catch, a rejected submit left the dialog stuck on
            // "Submitting…" with no error. Mirrors QuoteDrawer.
            try {
              await submitQuote(
                data,
                buildSubmissionContext(SUBMISSION_SOURCES.cart, { locale: lang }),
              );
              toast.success(t("quote.success.title"), { description: t("quote.success.body") });
              onOpenChange(false);
              closeDrawer();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : t("quote.drawer.error"));
            } finally {
              setBusy(false);
            }
          }}
          Footer={({ children }) => <DialogFooter>{children}</DialogFooter>}
        />
      </DialogContent>
    </Dialog>
  );
}
