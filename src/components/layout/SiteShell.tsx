import { type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CartDrawer } from "./CartDrawer";
import { StoreCartDrawer } from "./StoreCartDrawer";
import { WhatsAppWidget } from "./WhatsAppWidget";
import { Toaster } from "@/components/ui/sonner";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {/* CartDrawer (legacy "quote cart") stays mounted so /cart still works
          standalone — see CartContext.tsx's top-of-file note. FloatingQuoteCTA
          is intentionally NOT mounted here anymore: it was the last persistent
          entry point into that quote-cart from every page. */}
      <CartDrawer />
      <StoreCartDrawer />
      <WhatsAppWidget />
      <Toaster position="top-right" />
    </div>
  );
}
