import React from "react";
import { ShieldCheck, Zap, CheckCircle2, Globe2, Package } from "lucide-react";

export function AnimatedCatalogHeader() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-navy/90 via-slate-900 to-navy p-6 overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between group">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-mint/15 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Interactive Telemetry Graphics */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 500 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated Concentric Radar Rings */}
        <circle
          cx="250"
          cy="190"
          r="140"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          strokeDasharray="6 6"
          className="animate-[spin_40s_linear_infinite]"
        />
        <circle
          cx="250"
          cy="190"
          r="100"
          stroke="rgba(78,205,196,0.2)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-[spin_25s_linear_infinite_reverse]"
        />
        <circle cx="250" cy="190" r="60" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Global Supply Corridor Flight Paths */}
        <path
          d="M 90 260 Q 250 100 410 260"
          stroke="url(#cyanGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="8 6"
          className="animate-pulse"
        />
        <path
          d="M 120 120 Q 250 250 380 120"
          stroke="url(#mintGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Pulsing Node Markers */}
        <g transform="translate(90, 260)">
          <circle r="12" fill="rgba(78,205,196,0.2)" className="animate-ping" />
          <circle r="6" fill="#4ECDC4" />
          <text x="12" y="4" fill="#FFFFFF" fontSize="10" fontWeight="bold">
            Reykjavik (SPF Ova)
          </text>
        </g>

        <g transform="translate(250, 110)">
          <circle r="14" fill="rgba(255,255,255,0.2)" className="animate-pulse" />
          <circle r="7" fill="#FFFFFF" />
          <text x="-30" y="-12" fill="#4ECDC4" fontSize="11" fontWeight="bold">
            İzmir HQ Lab
          </text>
        </g>

        <g transform="translate(410, 260)">
          <circle r="12" fill="rgba(78,205,196,0.2)" className="animate-ping" />
          <circle r="6" fill="#4ECDC4" />
          <text x="-75" y="4" fill="#FFFFFF" fontSize="10" fontWeight="bold">
            Incheon / Dubai
          </text>
        </g>

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#4ECDC4" stopOpacity="1" />
            <stop offset="100%" stopColor="#0A2540" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Interactive Badge Overlays */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/90 text-mint text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg">
          <ShieldCheck className="h-3.5 w-3.5" /> Biosecure ISO 9001
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-navy text-xs font-extrabold shadow-lg">
          <Zap className="h-3.5 w-3.5" /> Live Cold-Chain
        </div>
      </div>

      <div className="relative z-10 space-y-2 text-center my-auto">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <Package className="h-8 w-8 text-mint animate-bounce" />
        </div>
        <div className="text-white text-xs font-bold uppercase tracking-widest">
          100% Quality Guaranteed
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs font-bold text-white/90 pt-3 border-t border-white/10">
        <span className="flex items-center gap-1">
          <Globe2 className="h-3.5 w-3.5 text-mint" /> 10+ Air Corridors
        </span>
        <span className="flex items-center gap-1 text-mint">
          <CheckCircle2 className="h-3.5 w-3.5" /> HACCP Certified
        </span>
      </div>
    </div>
  );
}
