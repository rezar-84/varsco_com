import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, ShoppingBag, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingQuoteCTA() {
  const { count, openDrawer } = useCart();
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Only show on catalog, products, seafood, or solutions pages
  const isTargetPage =
    pathname.startsWith("/products") ||
    pathname.startsWith("/services-solutions") ||
    pathname.startsWith("/seafood-export");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        // Show after scrolling 400px down
        setVisible(y > 400);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!isTargetPage || !visible) return null;

  return (
    <div className="fixed bottom-24 xl:bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 animate-in fade-in-0 slide-in-from-bottom-6 duration-300 [.mobile-nav-open_&]:hidden">
      <div className="glass-panel-dark rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,30,64,0.4)] border border-white/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 pl-2 min-w-0">
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-mint/20 text-mint shrink-0">
            <Zap className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>{t("cta.fastQuote")}</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-mint/20 text-[10px] text-mint font-semibold">
                <ShieldCheck className="h-3 w-3" /> {t("cta.certified")}
              </span>
            </div>
            {/* The Zap icon in the adjacent badge already carries the speed cue. */}
            <p className="text-[11px] text-white/70 truncate">{t("cta.responseTime")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openDrawer}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-bold transition-all"
          >
            <ShoppingBag className="h-4 w-4 text-teal" />
            <span className="hidden xs:inline">{t("cta.cart")}</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-primary-foreground">
                {count}
              </span>
            )}
          </button>

          <Button
            size="sm"
            asChild
            className="bg-mint text-navy font-bold hover:bg-mint/90 rounded-xl px-4 text-xs h-9 shadow-md"
          >
            <Link to="/request-quote" className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span>{t("nav.quote")}</span>
              <ArrowRight className="h-3.5 w-3.5 hidden xs:inline" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
