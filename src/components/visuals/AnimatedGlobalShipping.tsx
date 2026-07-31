import { Plane, Globe2 } from "lucide-react";

export function AnimatedGlobalShipping() {
  return (
    <div className="w-full h-full min-h-[260px] bg-gradient-to-br from-slate-900 via-navy to-navy/95 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between text-white border border-white/10 shadow-inner">
      {/* Background Grid Pattern & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#5eead4_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-mint/20 rounded-full blur-3xl" />

      {/* Header telemetry badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-navy text-[11px] font-bold uppercase tracking-wider">
          <Plane className="h-3.5 w-3.5 text-navy" /> 4.0 °C Cold-Chain Flight Corridor
        </div>
        <span className="text-[10px] font-mono text-white/60">TEMP-LOG #4.0C-STABLE</span>
      </div>

      {/* Vector Illustration */}
      <div className="relative z-10 my-4 flex items-center justify-center">
        <svg
          className="w-full max-w-[280px] h-32"
          viewBox="0 0 300 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shipping lanes (defined as paths for markers to follow) */}
          <path id="ship-lane-a" d="M 150 32 Q 95 14, 55 10" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.55" />
          <path id="ship-lane-b" d="M 176 38 Q 225 16, 262 14" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.55" />
          <path id="ship-lane-c" d="M 124 84 Q 78 100, 38 106" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.55" />
          <path id="ship-lane-d" d="M 168 86 Q 218 102, 258 108" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.55" />

          {/* Destination markers */}
          <circle cx="55" cy="10" r="2.5" className="fill-mint animate-pulse" />
          <circle cx="262" cy="14" r="2.5" className="fill-mint animate-pulse" />
          <circle cx="38" cy="106" r="2.5" className="fill-mint animate-pulse" />
          <circle cx="258" cy="108" r="2.5" className="fill-mint animate-pulse" />

          {/* Globe (multi-origin hub) */}
          <circle cx="150" cy="60" r="30" className="fill-mint/10 stroke-mint stroke-2" />
          <ellipse cx="150" cy="60" rx="30" ry="10" fill="none" stroke="#5eead4" strokeWidth="0.8" opacity="0.5" />
          <ellipse cx="150" cy="60" rx="30" ry="20" fill="none" stroke="#5eead4" strokeWidth="0.8" opacity="0.5" />
          <ellipse cx="150" cy="60" rx="10" ry="30" fill="none" stroke="#5eead4" strokeWidth="0.8" opacity="0.5" />
          <line x1="120" y1="60" x2="180" y2="60" stroke="#5eead4" strokeWidth="0.8" opacity="0.5" />

          {/* Origin pulse points on the globe surface */}
          <circle cx="138" cy="46" r="2" fill="#4ade80" className="animate-pulse-glow" />
          <circle cx="164" cy="52" r="2" fill="#4ade80" className="animate-pulse-glow" />
          <circle cx="146" cy="74" r="2" fill="#4ade80" className="animate-pulse-glow" />

          {/* Traveling flight markers following each lane */}
          <circle r="2.4" fill="#ffffff">
            <animateMotion dur="2.6s" repeatCount="indefinite" begin="0s">
              <mpath href="#ship-lane-a" />
            </animateMotion>
          </circle>
          <circle r="2.4" fill="#ffffff">
            <animateMotion dur="2.9s" repeatCount="indefinite" begin="0.5s">
              <mpath href="#ship-lane-b" />
            </animateMotion>
          </circle>
          <circle r="2.4" fill="#ffffff">
            <animateMotion dur="2.4s" repeatCount="indefinite" begin="1s">
              <mpath href="#ship-lane-c" />
            </animateMotion>
          </circle>
          <circle r="2.4" fill="#ffffff">
            <animateMotion dur="3.1s" repeatCount="indefinite" begin="0.2s">
              <mpath href="#ship-lane-d" />
            </animateMotion>
          </circle>
        </svg>
      </div>

      {/* Footer telemetry details */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-white/80">
        <span className="flex items-center gap-1">
          <Globe2 className="h-3.5 w-3.5 text-mint" /> Global Air & Reefer Shipping Corridors
        </span>
        <span className="text-mint font-bold">Fast Customs Clearance</span>
      </div>
    </div>
  );
}
