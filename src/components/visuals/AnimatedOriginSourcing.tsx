import { ShieldCheck, Anchor } from "lucide-react";

export function AnimatedOriginSourcing() {
  return (
    <div className="w-full h-full min-h-[260px] bg-gradient-to-br from-navy via-navy/95 to-slate-900 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between text-white border border-white/10 shadow-inner">
      {/* Background Grid Pattern & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-mint/20 rounded-full blur-3xl" />

      {/* Header telemetry badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/15 text-mint text-[11px] font-bold uppercase tracking-wider border border-mint/30">
          <Anchor className="h-3.5 w-3.5" /> Salmon Egg Sourcing Network
        </div>
        <span className="text-[10px] font-mono text-white/60">AUDIT #OVA-2026</span>
      </div>

      {/* Vector Illustration */}
      <div className="relative z-10 my-4 flex items-center justify-center">
        <svg
          className="w-full max-w-[280px] h-32"
          viewBox="0 0 300 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Globe representing multiple certified origins */}
          <circle cx="150" cy="60" r="34" className="fill-teal/10 stroke-teal stroke-2" />
          <ellipse cx="150" cy="60" rx="34" ry="11" fill="none" stroke="#5eead4" strokeWidth="0.8" opacity="0.5" />
          <ellipse cx="150" cy="60" rx="34" ry="22" fill="none" stroke="#5eead4" strokeWidth="0.8" opacity="0.5" />
          <ellipse cx="150" cy="60" rx="11" ry="34" fill="none" stroke="#5eead4" strokeWidth="0.8" opacity="0.5" />
          <line x1="116" y1="60" x2="184" y2="60" stroke="#5eead4" strokeWidth="0.8" opacity="0.5" />

          {/* Certified origin markers scattered across the globe */}
          <circle cx="134" cy="44" r="2.2" fill="#4ade80" className="animate-pulse-glow" />
          <circle cx="168" cy="50" r="2.2" fill="#4ade80" className="animate-pulse-glow" />
          <circle cx="140" cy="76" r="2.2" fill="#4ade80" className="animate-pulse-glow" />
          <circle cx="170" cy="72" r="2.2" fill="#4ade80" className="animate-pulse-glow" />

          {/* Magnifier raster-scanning the globe, left to right, line by line */}
          <g transform="translate(122, 40)">
            <g className="animate-scan-globe">
              <circle cx="0" cy="0" r="8" fill="rgba(15,23,42,0.6)" stroke="#ffffff" strokeWidth="2.2" />
              <line x1="5.6" y1="5.6" x2="13" y2="13" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
            </g>
          </g>

          <text x="150" y="108" textAnchor="middle" fill="#99f6e4" fontSize="10" fontWeight="bold">
            Multi-Origin Salmon Hatcheries
          </text>
        </svg>
      </div>

      {/* Footer telemetry details */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-white/80">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-mint" /> SPF Pathogen-Free Broodstock
        </span>
        <span className="text-mint font-bold">100% Direct Contract</span>
      </div>
    </div>
  );
}
