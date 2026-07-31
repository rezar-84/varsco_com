import { Waves } from "lucide-react";

export function AnimatedArtemiaLifecycle() {
  return (
    <div className="w-full bg-gradient-to-br from-navy via-navy/95 to-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden text-white border border-white/10 shadow-2xl">
      {/* Background Grid Pattern & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#5eead4_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-mint/15 rounded-full blur-3xl" />

      {/* Header telemetry badge */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-navy text-[11px] font-bold uppercase tracking-wider">
          <Waves className="h-3.5 w-3.5 text-navy" /> Artemia Life Cycle
        </div>
        <span className="text-[10px] font-mono text-white/60">CYCLE #ARTEMIA-BIO</span>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stage 1: Dormant Cyst */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-16 h-16">
            <circle cx="50" cy="50" r="30" className="fill-amber-700/70 stroke-amber-500 stroke-2 animate-pulse-glow" />
            <circle cx="42" cy="42" r="4" fill="#fcd34d" opacity="0.6" />
          </svg>
          <div className="text-center">
            <div className="text-xs font-bold">Dormant Cyst</div>
            <p className="text-[10px] text-white/60 leading-relaxed mt-1">
              Dehydrated, cryptobiotic — stable for years in dry storage
            </p>
          </div>
        </div>

        {/* Stage 2: Hydration & Hatching */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-16 h-16">
            <circle cx="50" cy="50" r="28" className="fill-amber-600/60 stroke-amber-400 stroke-2" />
            <path d="M 30 50 Q 50 40 70 50" stroke="#fde68a" strokeWidth="2" fill="none" className="animate-pulse" />
            <circle cx="62" cy="35" r="3" className="fill-sky-300 animate-bounce" />
            <circle cx="68" cy="45" r="2" className="fill-sky-200 animate-bounce" />
          </svg>
          <div className="text-center">
            <div className="text-xs font-bold">Hydration & Hatching</div>
            <p className="text-[10px] text-white/60 leading-relaxed mt-1">
              Chorion absorbs water and splits within 18–24 hours
            </p>
          </div>
        </div>

        {/* Stage 3: Nauplius */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-16 h-16">
            <g className="animate-swim">
              <ellipse cx="50" cy="52" rx="14" ry="9" fill="#fb923c" />
              <path d="M 38 46 L 30 40 M 38 58 L 30 64" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="58" cy="49" r="2" fill="#0f172a" />
            </g>
          </svg>
          <div className="text-center">
            <div className="text-xs font-bold">Nauplius (Instar I)</div>
            <p className="text-[10px] text-white/60 leading-relaxed mt-1">
              Single eye, three appendage pairs — first live-feed stage
            </p>
          </div>
        </div>

        {/* Stage 4: Adult Brine Shrimp */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-16 h-16">
            <g className="animate-swim-delayed">
              <path d="M 20 50 L 30 44 L 30 56 Z" fill="#f472b6" />
              <ellipse cx="50" cy="50" rx="22" ry="8" fill="#f472b6" />
              <path d="M 40 44 L 40 30 M 48 43 L 48 28 M 56 44 L 56 30" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <circle cx="68" cy="47" r="2.5" fill="#0f172a" />
            </g>
          </svg>
          <div className="text-center">
            <div className="text-xs font-bold">Adult Brine Shrimp</div>
            <p className="text-[10px] text-white/60 leading-relaxed mt-1">
              Reaches maturity in 2–3 weeks; produces new cysts or live young
            </p>
          </div>
        </div>
      </div>

      {/* Footer telemetry details */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-white/80">
        <span>Cryptobiosis → Hatch → Nauplius → Adult</span>
        <span className="text-mint font-bold">Continuous Reproductive Cycle</span>
      </div>
    </div>
  );
}
