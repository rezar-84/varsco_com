import { Fish, Droplets } from "lucide-react";

export function AnimatedAquariumEcosystem() {
  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background shadow-xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-bold text-mint-ink uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Fish className="h-4 w-4" /> Aquarium & Reef Ecosystem Vector
          </span>
          <h3 className="font-display text-xl font-bold text-navy">
            Microalgae & Live Feed Ecosystem Flow
          </h3>
        </div>
      </div>

      <div className="relative aspect-[16/9] bg-navy/95 rounded-2xl overflow-hidden border border-white/10 p-4 shadow-inner">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* Background Water Currents (decorative) */}
          <path
            d="M 0 8 Q 25 4, 50 8 T 100 8"
            fill="none"
            stroke="rgba(56, 189, 248, 0.15)"
            strokeWidth="1"
          />
          <path
            d="M 0 54 Q 25 58, 50 54 T 100 54"
            fill="none"
            stroke="rgba(74, 222, 128, 0.15)"
            strokeWidth="1"
          />

          {/* Stage Zone Boundaries */}
          <rect x="4" y="12" width="22" height="34" rx="6" fill="none" stroke="rgba(74,222,128,0.35)" strokeWidth="0.6" strokeDasharray="2 1.5" />
          <rect x="39" y="12" width="22" height="34" rx="6" fill="none" stroke="rgba(251,146,60,0.35)" strokeWidth="0.6" strokeDasharray="2 1.5" />
          <rect x="74" y="12" width="22" height="34" rx="6" fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth="0.6" strokeDasharray="2 1.5" />

          {/* STAGE 1: Microalgae Culture */}
          <circle cx="11" cy="24" r="2" fill="#4ade80" className="animate-float" />
          <circle cx="17" cy="21" r="1.6" fill="#4ade80" className="animate-float-delayed" />
          <circle cx="13" cy="32" r="1.8" fill="#4ade80" className="animate-float-delayed" />
          <circle cx="19" cy="35" r="1.4" fill="#4ade80" className="animate-float" />
          <circle cx="9" cy="38" r="1.5" fill="#4ade80" className="animate-float" />

          {/* Connector 1: Microalgae -> Live Feed */}
          <line x1="26" y1="22" x2="39" y2="22" stroke="rgba(74,222,128,0.5)" strokeWidth="1" strokeDasharray="1.5 1.2" />
          <circle cx="26" cy="22" r="1.1" fill="#4ade80" className="animate-flow-short" />
          <circle cx="26" cy="22" r="1.1" fill="#4ade80" className="animate-flow-short-delayed" />

          {/* STAGE 2: Live Feed Culture (rotifers / Artemia nauplii) */}
          <g transform="translate(46, 24)">
            <g className="animate-swim">
              <path d="M -3 -2 L -6.5 -4.2 M -3 2 L -6.5 4.2" stroke="#fb923c" strokeWidth="0.8" strokeLinecap="round" />
              <ellipse cx="0" cy="0" rx="4.2" ry="2.6" fill="#fb923c" />
              <circle cx="2.8" cy="-0.6" r="0.7" fill="#0f172a" />
            </g>
          </g>
          <g transform="translate(53, 36)">
            <g className="animate-swim-delayed">
              <path d="M -2.6 -1.8 L -5.6 -3.6 M -2.6 1.8 L -5.6 3.6" stroke="#fdba74" strokeWidth="0.7" strokeLinecap="round" />
              <ellipse cx="0" cy="0" rx="3.6" ry="2.2" fill="#fdba74" />
              <circle cx="2.3" cy="-0.5" r="0.6" fill="#0f172a" />
            </g>
          </g>

          {/* Connector 2: Live Feed -> Fish & Coral */}
          <line x1="61" y1="22" x2="74" y2="22" stroke="rgba(251,146,60,0.5)" strokeWidth="1" strokeDasharray="1.5 1.2" />
          <circle cx="61" cy="22" r="1.1" fill="#fb923c" className="animate-flow-short" />
          <circle cx="61" cy="22" r="1.1" fill="#fb923c" className="animate-flow-short-delayed" />

          {/* STAGE 3: Fish & Coral Tank */}
          <g transform="translate(84, 23)">
            <g className="animate-swim">
              <path d="M -8 0 L -11.5 -2.8 L -10.4 0 L -11.5 2.8 Z" fill="#38bdf8" />
              <ellipse cx="-2" cy="0" rx="6" ry="3.1" fill="#38bdf8" />
              <path d="M -4 -2.6 L -2 -5.2 L -0.8 -2.6 Z" fill="#38bdf8" />
              <circle cx="2.2" cy="-0.8" r="0.7" fill="#0f172a" />
            </g>
          </g>
          <g transform="translate(88, 42)">
            <g className="animate-pulse-glow">
              <line x1="0" y1="0" x2="-3" y2="-7" stroke="#fb7185" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="0" y1="0" x2="0" y2="-8" stroke="#fb7185" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="0" y1="0" x2="3" y2="-7" stroke="#fb7185" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="-2.2" y1="0" x2="-5" y2="-5" stroke="#fb7185" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
              <line x1="2.2" y1="0" x2="5" y2="-5" stroke="#fb7185" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
              <circle cx="0" cy="1" r="2" fill="#fb7185" opacity="0.7" />
            </g>
          </g>

          {/* Return Path: Fish & Coral tank water recirculates nutrients back to Microalgae culture */}
          <path d="M 85 46 L 15 46" stroke="rgba(94,234,212,0.4)" strokeWidth="1" strokeDasharray="2 1.5" />
          <circle cx="85" cy="46" r="1.3" fill="#5eead4" className="animate-flow-return" />
        </svg>

        {/* Stage Labels */}
        <div className="absolute top-2 left-4 right-4 grid grid-cols-3 gap-2 text-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-mint-ink">Microalgae</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">Live Feed</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-sky-300">Fish &amp; Coral</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/80 font-semibold bg-navy/80 p-2 rounded-xl backdrop-blur-md">
          <span className="flex items-center gap-1 text-mint-ink">
            <Droplets className="h-3.5 w-3.5" /> High Reef Polyp Extension
          </span>
          <span>Zero Tank Water Clouding</span>
        </div>
      </div>
    </div>
  );
}
