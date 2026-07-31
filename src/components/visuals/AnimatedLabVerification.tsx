import { Microscope, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function AnimatedLabVerification() {
  return (
    <div className="w-full h-full min-h-[260px] bg-gradient-to-br from-navy via-slate-900 to-navy/95 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between text-white border border-white/10 shadow-inner">
      {/* Background Grid Pattern & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />

      {/* Header telemetry badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-sky-300 text-[11px] font-bold uppercase tracking-wider border border-primary/40">
          <Microscope className="h-3.5 w-3.5" /> HACCP & PCR Lab Telemetry
        </div>
        <span className="text-[10px] font-mono text-white/60">LAB-QC #2026-PASS</span>
      </div>

      {/* Vector Illustration */}
      <div className="relative z-10 my-4 flex items-center justify-center">
        <svg
          className="w-full max-w-[280px] h-32"
          viewBox="0 0 300 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Test Tube / Petri Dish Graphic */}
          <g>
            <rect
              x="50"
              y="25"
              width="24"
              height="70"
              rx="12"
              className="fill-primary/20 stroke-primary stroke-2"
            />
            <rect x="54" y="55" width="16" height="35" rx="8" className="fill-primary/40" />
            {/* Bubbles */}
            <circle cx="62" cy="70" r="2.5" className="fill-sky-200 animate-bounce" />
            <circle cx="67" cy="80" r="1.5" className="fill-sky-300 animate-pulse" />
            <text x="62" y="110" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold">
              Protein 61%
            </text>
          </g>

          {/* Microbiology Analysis Bar */}
          <g>
            <rect
              x="115"
              y="30"
              width="70"
              height="60"
              rx="10"
              className="fill-white/5 stroke-white/20 stroke"
            />
            <line
              x1="125"
              y1="45"
              x2="175"
              y2="45"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="125"
              y1="60"
              x2="165"
              y2="60"
              stroke="#5eead4"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="125"
              y1="75"
              x2="170"
              y2="75"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text
              x="150"
              y="110"
              textAnchor="middle"
              fill="#99f6e4"
              fontSize="10"
              fontWeight="bold"
            >
              HUFA & Lipids
            </text>
          </g>

          {/* Quality Clearance Seal */}
          <g>
            <circle cx="240" cy="55" r="28" className="fill-mint/20 stroke-mint stroke-2" />
            <circle cx="240" cy="55" r="20" className="fill-mint/30 animate-pulse" />
            <path
              d="M232 55L238 61L248 49"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="240"
              y="105"
              textAnchor="middle"
              fill="#5eead4"
              fontSize="10"
              fontWeight="bold"
            >
              HACCP Approved
            </text>
          </g>
        </svg>
      </div>

      {/* Footer telemetry details */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-white/80">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-sky-300" /> Per-Batch PCR & Pathogen Screen
        </span>
        <span className="text-sky-300 font-bold">Zero Contamination</span>
      </div>
    </div>
  );
}
