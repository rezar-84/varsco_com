import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/context/I18nContext";
import type { Order, OrderStatus } from "@/lib/types";
import { Loader2, Search, ArrowUpDown, ExternalLink, ShieldCheck, Clock, AlertCircle, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/orders")({
  component: Orders,
});

const statusVariant: Record<OrderStatus, { badge: string; icon: any }> = {
  "Pending Review": { badge: "bg-amber-50 text-amber-700 border-amber-200/60", icon: Clock },
  Approved: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60", icon: ShieldCheck },
  Shipped: { badge: "bg-sky-50 text-sky-700 border-sky-200/60", icon: Package },
  Cancelled: { badge: "bg-rose-50 text-rose-700 border-rose-200/60", icon: AlertCircle },
};

function Orders() {
  const { t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<"date" | "total">("date");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadOrders() {
      try {
        const res = await fetch("/api/portal/orders");
        if (res.ok && active) {
          const json = await res.json();
          setOrders(json.data || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  const handleSort = (field: "date" | "total") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(query) ||
      o.status.toLowerCase().includes(query) ||
      o.products.some((p) => p.toLowerCase().includes(query))
    );
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === "date") {
      const valA = new Date(a.date).getTime();
      const valB = new Date(b.date).getTime();
      return sortAsc ? valA - valB : valB - valA;
    } else {
      const valA = parseFloat(a.total?.replace(/[^0-9.]/g, "") || "0");
      const valB = parseFloat(b.total?.replace(/[^0-9.]/g, "") || "0");
      return sortAsc ? valA - valB : valB - valA;
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-black text-navy">{t("account.orders.title") || "Order History"}</h1>
        <p className="mt-2 text-muted-foreground text-sm font-medium">{t("account.orders.subtitle") || "Track your active B2B orders and reference details."}</p>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder={t("account.orders.searchPlaceholder") || "Search orders or products..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-semibold text-navy/80">{t("account.loadingOrders") || "Loading order records..."}</p>
          </div>
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-border/60 max-w-lg mx-auto space-y-4">
          <Package className="h-12 w-12 text-muted-foreground/60 mx-auto" />
          <div className="font-display text-xl font-bold text-navy">{t("account.orders.emptyTitle") || "No Orders Found"}</div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">{t("account.orders.emptyBody") || "You do not have any orders matching your criteria at this time."}</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-left">
              <thead className="bg-surface-alt/50 border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">{t("account.orders.col.quote") || "Reference"}</th>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1.5">
                      {t("account.orders.col.date") || "Order Date"}
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4">{t("account.orders.col.products") || "Details"}</th>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center gap-1.5">
                      {t("account.orders.col.amount") || "Total Value"}
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4">{t("account.orders.col.status") || "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {sortedOrders.map((o) => {
                  const statusInfo = statusVariant[o.status] || statusVariant["Pending Review"];
                  const StatusIcon = statusInfo.icon;
                  return (
                    <tr key={o.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4.5 font-bold text-navy flex items-center gap-2">
                        {o.id}
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/45 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all cursor-pointer" />
                      </td>
                      <td className="px-6 py-4.5 text-muted-foreground font-semibold">{o.date}</td>
                      <td className="px-6 py-4.5 font-medium text-navy/90 max-w-[240px] truncate">{o.products.join(", ")}</td>
                      <td className="px-6 py-4.5 font-bold text-navy">{o.total ?? "—"}</td>
                      <td className="px-6 py-4.5">
                        <Badge className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border shadow-none", statusInfo.badge)}>
                          <StatusIcon className="h-3.5 w-3.5 shrink-0" />
                          {o.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
