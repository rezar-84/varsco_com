import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, FileText, Loader2, Search, Filter } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import type { CustomsDocument } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/customs")({
  component: Customs,
});

function Customs() {
  const { t } = useI18n();
  const [documents, setDocuments] = useState<CustomsDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");

  useEffect(() => {
    let active = true;
    async function loadDocuments() {
      try {
        const res = await fetch("/api/portal/customs");
        if (res.ok && active) {
          const json = await res.json();
          setDocuments(json.data || []);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDocuments();
    return () => {
      active = false;
    };
  }, []);

  const handleDownload = (docName: string) => {
    toast.success(t("account.customs.toastTitle") ? t("account.customs.toastTitle").replace("{doc}", docName) : `Downloading ${docName}`, {
      description: t("account.customs.toastDesc") || "The document request was proxied successfully. Preparing download...",
    });
  };

  const filteredDocs = documents.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || d.type === selectedType;
    return matchesSearch && matchesType;
  });

  const docTypes = ["All", "Invoice", "Certificate", "Customs"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-black text-navy">{t("account.customs.title") || "Customs & Logistics Documentation"}</h1>
        <p className="mt-2 text-muted-foreground text-sm font-medium">{t("account.customs.subtitle") || "Access Certificates of Origin, commercial invoices, and regulatory clearances."}</p>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder={t("account.customs.searchPlaceholder") || "Search document name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-muted-foreground/80 shrink-0 mr-1 hidden sm:block" />
          {docTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                selectedType === type
                  ? "bg-navy text-white shadow-sm"
                  : "bg-surface-alt/80 hover:bg-muted text-navy/80"
              )}
            >
              {type === "All" ? (t("account.customs.filter.all") || "All Docs") : type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-semibold text-navy/80">{t("account.loadingDocuments") || "Loading secure portal files..."}</p>
          </div>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-border/60 max-w-md mx-auto space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground/60 mx-auto" />
          <div className="font-display text-xl font-bold text-navy">{t("account.customs.emptyTitle") || "No Documents Found"}</div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">{t("account.customs.emptyBody") || "No documentation matches the active filters."}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDocs.map((d) => (
            <div 
              key={d.id} 
              className="glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-border/60 hover:shadow-md hover:border-border transition-all duration-300 gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "rounded-xl p-3 border",
                  d.type === "Invoice" ? "bg-primary/10 text-primary border-primary/20" :
                  d.type === "Certificate" ? "bg-mint/10 text-mint border-mint/20" :
                  "bg-teal/10 text-teal border-teal/20"
                )}>
                  <FileText className="h-6 w-6 shrink-0" />
                </div>
                <div>
                  <div className="font-bold text-navy text-base leading-snug">{d.name}</div>
                  <div className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-2">
                    <span className="bg-surface-alt px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider">{d.type}</span>
                    <span>·</span>
                    <span>{d.date}</span>
                    <span>·</span>
                    <span className="font-mono text-[10px]">{d.id}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDownload(d.name)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-navy hover:bg-muted font-bold transition-all hover:shadow-sm cursor-pointer shadow-sm bg-white"
              >
                <Download className="h-4 w-4" /> {t("account.customs.download") || "Download File"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
