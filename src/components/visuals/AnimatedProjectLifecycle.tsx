import { useState } from "react";
import { Compass, CheckCircle2, TrendingUp, ShieldCheck, ArrowRight, Activity } from "lucide-react";

export function AnimatedProjectLifecycle() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const STAGES = [
    {
      title: "01. Baseline Audit & Lab Diagnostics",
      desc: "Water quality analysis, current FCR evaluation, rotifer/artemia density benchmarking, and pathogen screening.",
    },
    {
      title: "02. Custom Feed & RAS Protocol Design",
      desc: "Formulating specific Chlorella V12 density curves, decapsulated Artemia inclusion rates, or SPF salmon ova arrival schedules.",
    },
    {
      title: "03. Cold-Chain Logistics & Dispatch",
      desc: "Deploying temperature-controlled air freight containers (4 °C) with real-time IoT temperature logging sensors.",
    },
    {
      title: "04. On-Site Field Trial & Yield Verification",
      desc: "Bi-weekly growth tracking, survival rate comparison against control groups, and cost-per-kg optimization report.",
    },
  ];

  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background shadow-xl p-6 md:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Activity className="h-4 w-4" /> 4-Phase Field Implementation Methodology
          </span>
          <h3 className="font-display text-2xl font-bold text-navy">
            Turn-Key Project Execution Lifecycle
          </h3>
        </div>

        <span className="px-3 py-1 rounded-full bg-mint/20 text-navy font-bold text-xs self-start sm:self-auto">
          30+ Years Proven Methodology
        </span>
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

          <div className="absolute bottom-3 left-3 text-[10px] text-mint font-bold uppercase tracking-wider">
            Click nodes to explore phase details
          </div>
        </div>

        {/* Step Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-mint uppercase tracking-wider">
            Phase 0{activeStep + 1} of 04
          </div>
          <h4 className="font-display text-xl font-bold text-navy">{STAGES[activeStep].title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{STAGES[activeStep].desc}</p>

          <div className="grid grid-cols-4 gap-2 pt-4">
            {STAGES.map((s, idx) => (
              <button
                key={s.title}
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
