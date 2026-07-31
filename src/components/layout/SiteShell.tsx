import { type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CartDrawer } from "./CartDrawer";
import { FloatingQuoteCTA } from "./FloatingQuoteCTA";
import { WhatsAppWidget } from "./WhatsAppWidget";
import { Toaster } from "@/components/ui/sonner";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
      <FloatingQuoteCTA />
      <WhatsAppWidget />
      <Toaster position="top-right" />
    </div>
  );
}
