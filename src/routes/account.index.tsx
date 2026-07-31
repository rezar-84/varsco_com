import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import type { Order, CustomsDocument } from "@/lib/types";
import { Loader2, Package, FileText, ClipboardList, TrendingUp, ChevronRight, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/")({
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [documents, setDocuments] = useState<CustomsDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadDashboardData() {
      try {
        const [ordersRes, docsRes] = await Promise.all([
          fetch("/api/portal/orders"),
          fetch("/api/portal/customs"),
        ]);
        
        if (ordersRes.ok && docsRes.ok && active) {
          const ordersData = await ordersRes.json();
          const docsData = await docsRes.json();
          setOrders(ordersData.data || []);
          setDocuments(docsData.data || []);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const activeQuotesCount = orders.filter(
    (o) => o.status === "Pending Review" || o.status === "Approved",
  ).length;
  const completedOrdersCount = orders.filter((o) => o.status === "Shipped").length;
  const pendingDocsCount = documents.length;

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm font-semibold text-navy/80">{t("account.loadingDashboard") || "Loading dashboard data..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-4xl font-black tracking-tight text-navy">
          {t("account.dashboard.welcome") || "Welcome back"}, {user?.name} <span className="animate-wave inline-block">👋</span>
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-xl font-medium">
          {t("account.dashboard.subtitle") || "Manage your aquaculture orders, active shipments, customs clearance documentation, and company profile."}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { 
            label: t("account.dashboard.activeQuotes") || "Active Quotes", 
            value: activeQuotesCount, 
            icon: ClipboardList,
            color: "text-primary bg-primary/10 border-primary/20",
          },
          { 
            label: t("account.dashboard.completedOrders") || "Completed Orders", 
            value: completedOrdersCount, 
            icon: Package,
            color: "text-mint bg-mint/10 border-mint/20",
          },
          { 
            label: t("account.dashboard.pendingDocuments") || "Pending Documents", 
            value: pendingDocsCount, 
            icon: FileText,
            color: "text-teal bg-teal/10 border-teal/20",
          },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-6 border border-border/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-2 font-display text-3xl font-black text-navy">{s.value}</div>
            </div>
            <div className={cn("p-3.5 rounded-xl border transition-all duration-300 group-hover:scale-110", s.color)}>
              <s.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity Table */}
        <div className="glass-card rounded-2xl border border-border/60 overflow-hidden shadow-sm flex flex-col">
          <div className="border-b border-border/60 px-6 py-4.5 flex items-center justify-between bg-surface-alt/40">
            <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t("account.dashboard.recentActivity") || "Recent Activity"}
            </h2>
            <div className="text-xs font-bold text-primary hover:underline cursor-pointer">
              {t("account.dashboard.viewAll") || "View all"}
            </div>
          </div>
          <div className="flex-1 divide-y divide-border/40">
            {orders.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center p-6 space-y-2">
                <Package className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-xs font-bold text-navy/60">{t("account.dashboard.noOrders") || "No orders found"}</p>
              </div>
            ) : (
              orders.slice(0, 4).map((o) => {
                let StatusIcon = Clock;
                let statusColor = "text-amber-600 bg-amber-50 border-amber-200/50";
                if (o.status === "Approved") {
                  StatusIcon = ShieldCheck;
                  statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200/50";
                } else if (o.status === "Cancelled") {
                  StatusIcon = AlertCircle;
                  statusColor = "text-rose-600 bg-rose-50 border-rose-200/50";
                } else if (o.status === "Shipped") {
                  StatusIcon = Package;
                  statusColor = "text-sky-600 bg-sky-50 border-sky-200/50";
                }

                return (
                  <div key={o.id} className="flex items-center justify-between px-6 py-4.5 hover:bg-muted/30 transition-colors group">
                    <div className="space-y-1">
                      <div className="font-bold text-navy text-sm flex items-center gap-1.5">
                        {o.id}
                        <ChevronRight className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-muted-foreground font-medium truncate max-w-[200px] sm:max-w-[260px]">
                        {o.products.join(", ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-navy">{o.total ?? "—"}</span>
                      <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border", statusColor)}>
                        <StatusIcon className="h-3 w-3 shrink-0" />
                        {o.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Essential Documents Checklist */}
        <div className="glass-card rounded-2xl border border-border/60 overflow-hidden shadow-sm flex flex-col">
          <div className="border-b border-border/60 px-6 py-4.5 flex items-center justify-between bg-surface-alt/40">
            <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal" />
              {t("account.dashboard.customsDocuments") || "Customs Clearance Files"}
            </h2>
            <div className="text-xs font-bold text-teal hover:underline cursor-pointer">
              {t("account.dashboard.manageDocs") || "Manage documents"}
            </div>
          </div>
          <div className="flex-1 divide-y divide-border/40">
            {documents.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center p-6 space-y-2">
                <FileText className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-xs font-bold text-navy/60">{t("account.dashboard.noDocuments") || "No documents available"}</p>
              </div>
            ) : (
              documents.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center justify-between px-6 py-4.5 hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <div className="font-bold text-navy text-sm truncate max-w-[240px]">
                      {d.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {d.type} · {d.date}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal bg-teal/10 px-2 py-0.5 rounded border border-teal/20 uppercase tracking-wide">
                    {t("account.dashboard.available") || "Available"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
