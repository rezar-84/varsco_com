import { useState } from "react";
import { MessageSquare, X, Send, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createWhatsAppUrl } from "@/lib/utils/whatsapp";
import { useI18n } from "@/context/I18nContext";

export function WhatsAppWidget() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const quickTopics = [
    {
      label: t("whatsapp.topic.liveFeed"),
      text: t("whatsapp.topic.liveFeed.text"),
    },
    {
      label: t("whatsapp.topic.seafood"),
      text: t("whatsapp.topic.seafood.text"),
    },
    {
      label: t("whatsapp.topic.salmon"),
      text: t("whatsapp.topic.salmon.text"),
    },
    {
      label: t("whatsapp.topic.general"),
      text: t("whatsapp.topic.general.text"),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 flex flex-col items-end [.mobile-nav-open_&]:hidden">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 rounded-3xl glass-card border border-emerald-500/30 bg-background/95 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-600/30">
                  VARS
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-navy flex items-center gap-1.5">
                  <span>{t("whatsapp.desk")}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </h4>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {t("whatsapp.online")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Close WhatsApp Drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="my-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 space-y-1">
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> {t("whatsapp.line")}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t("whatsapp.selectCat")}
            </p>
          </div>

          <div className="space-y-2">
            {quickTopics.map((topic, idx) => (
              <a
                key={idx}
                href={createWhatsAppUrl({ customMessage: topic.text })}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-alt/70 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-border/60 transition-all text-xs font-semibold text-navy group"
              >
                <span>{topic.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transform group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 text-center">
            <a
              href={createWhatsAppUrl({})}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{t("whatsapp.blankChat")}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Toggle WhatsApp Export Chat"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageSquare className="h-5 w-5 fill-current" />
        <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">
          {t("whatsapp.b2bQuote")}
        </span>
      </button>
    </div>
  );
}
