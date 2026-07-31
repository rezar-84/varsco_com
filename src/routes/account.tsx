import { createFileRoute, Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Package, User as UserIcon, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "B2B Customer Dashboard | VARS Aquaculture" },
      {
        name: "description",
        content:
          "Manage your B2B aquaculture orders, active cold-chain shipments, customs clearance documentation, and company profile.",
      },
    ],
  }),
  component: AccountLayout,
});

const LINKS: { to: string; labelKey: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/account", labelKey: "account.nav.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/account/orders", labelKey: "account.nav.orders", icon: Package },
  { to: "/account/profile", labelKey: "account.nav.profile", icon: UserIcon },
  { to: "/account/customs", labelKey: "account.nav.customs", icon: FileText },
];

function AccountLayout() {
  const { t } = useI18n();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isLoading && !user) {
      router.navigate({ to: "/login", search: { redirect: pathname } as any });
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm font-semibold text-navy">{t("account.verifyingSession")}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[260px,1fr] md:px-6 md:py-12">
      <aside className="glass-card rounded-2xl h-fit p-3 border border-border/80 shadow-md">
        <div className="border-b border-border/60 px-3 py-3.5">
          <div className="text-xs uppercase tracking-widest font-bold text-mint">
            {t("account.nav.partnerPortal")}
          </div>
          <div className="font-display text-lg font-bold text-navy truncate mt-0.5">
            {user.name}
          </div>
          <div className="text-xs text-muted-foreground truncate">{user.company}</div>
        </div>
        <nav className="mt-3 flex flex-col gap-1">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-navy/80 hover:bg-muted hover:text-navy",
                )}
              >
                <l.icon className="h-4 w-4 shrink-0" />
                {t(l.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
