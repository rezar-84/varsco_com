import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Compass, CheckCircle2, TrendingUp, ShieldCheck, ArrowRight, Activity } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export function AnimatedProjectLifecycle() {
  const { t } = useI18n();
  const [activeStep, setActiveStep] = useState<number>(0);

  const STAGES = [
    {
      titleKey: "lifecycle.step1.title",
      descKey: "lifecycle.step1.desc",
    },
    {
      titleKey: "lifecycle.step2.title",
      descKey: "lifecycle.step2.desc",
    },
    {
      titleKey: "lifecycle.step3.title",
      descKey: "lifecycle.step3.desc",
    },
    {
      titleKey: "lifecycle.step4.title",
      descKey: "lifecycle.step4.desc",
    },
  ];

  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background shadow-xl p-6 md:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          {/* mint-ink, not mint: this card sits on a light surface, where mint
              is 2.17:1 and fails WCAG AA for text. */}
          <span className="text-xs font-bold text-mint-ink uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Activity className="h-4 w-4" /> {t("lifecycle.eyebrow")}
          </span>
          <h3 className="font-display text-2xl font-bold text-navy">{t("lifecycle.title")}</h3>
        </div>

        {/* The badge names which engagement modes this lifecycle belongs to, and
            links back to them — it describes how one kind of project runs, not a
            second competing "how we work" framework. */}
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <span className="px-3 py-1 rounded-full bg-mint/20 text-navy font-bold text-xs">
            {t("lifecycle.badge")}
          </span>
          <Link
            to="/services-solutions"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-navy transition-colors"
          >
            {t("lifecycle.modesLink")} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Animated Process Vector */}
        <div className="lg:col-span-7 relative aspect-[16/9] bg-navy/95 rounded-2xl overflow-hidden border border-white/10 p-5 shadow-inner flex items-center justify-center">
          <svg viewBox="0 0 120 60" className="w-full h-full text-white/20">
            {/* Connecting Process Pipe */}
            <line
              x1="20"
              y1="30"
              x2="100"
              y2="30"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="3,3"
              className="animate-pulse"
            />

            {/* Stage 1 Node */}
            <g onClick={() => setActiveStep(0)} className="cursor-pointer">
              <circle
                cx="20"
                cy="30"
                r="10"
                fill="#001e40"
                stroke={activeStep === 0 ? "#4ade80" : "#38bdf8"}
                strokeWidth="2"
              />
              <text x="20" y="32" fontSize="5" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                01
              </text>
            </g>

            {/* Stage 2 Node */}
            <g onClick={() => setActiveStep(1)} className="cursor-pointer">
              <circle
                cx="46"
                cy="30"
                r="10"
                fill="#001e40"
                stroke={activeStep === 1 ? "#4ade80" : "rgba(255,255,255,0.4)"}
                strokeWidth="2"
              />
              <text x="46" y="32" fontSize="5" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                02
              </text>
            </g>

            {/* Stage 3 Node */}
            <g onClick={() => setActiveStep(2)} className="cursor-pointer">
              <circle
                cx="74"
                cy="30"
                r="10"
                fill="#001e40"
                stroke={activeStep === 2 ? "#4ade80" : "rgba(255,255,255,0.4)"}
                strokeWidth="2"
              />
              <text x="74" y="32" fontSize="5" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                03
              </text>
            </g>

            {/* Stage 4 Node */}
            <g onClick={() => setActiveStep(3)} className="cursor-pointer">
              <circle
                cx="100"
                cy="30"
                r="10"
                fill="#001e40"
                stroke={activeStep === 3 ? "#4ade80" : "rgba(255,255,255,0.4)"}
                strokeWidth="2"
              />
              <text
                x="100"
                y="32"
                fontSize="5"
                fontWeight="bold"
                fill="#ffffff"
                textAnchor="middle"
              >
                04
              </text>
            </g>
          </svg>

          <div className="absolute bottom-3 left-3 text-[10px] text-mint-ink font-bold uppercase tracking-wider">
            {t("lifecycle.nodeHint")}
          </div>
        </div>

        {/* Step Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-mint-ink uppercase tracking-wider">
            {t("lifecycle.phaseCounter")
              .replace("{n}", String(activeStep + 1).padStart(2, "0"))
              .replace("{total}", String(STAGES.length).padStart(2, "0"))}
          </div>
          <h4 className="font-display text-xl font-bold text-navy">
            {t(STAGES[activeStep].titleKey)}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t(STAGES[activeStep].descKey)}
          </p>

          <div className="grid grid-cols-4 gap-2 pt-4">
            {STAGES.map((s, idx) => (
              <button
                key={s.titleKey}
                onClick={() => setActiveStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeStep === idx ? "bg-primary w-full" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
