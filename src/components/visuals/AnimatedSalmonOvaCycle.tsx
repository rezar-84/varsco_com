import { ShieldCheck, Thermometer, Plane } from "lucide-react";

export function AnimatedSalmonOvaCycle() {
  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background shadow-xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <ShieldCheck className="h-4 w-4" /> Eyed-Egg Embryogenesis Vector
          </span>
          <h3 className="font-display text-xl font-bold text-navy">
            Eyed Ova Development & Cold-Chain Logistics
          </h3>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="relative aspect-square max-w-[180px] mx-auto bg-navy/95 rounded-2xl overflow-hidden border border-white/10 p-4 shadow-inner flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Salmon Egg Shell */}
            <circle cx="50" cy="50" r="40" fill="#f97316" stroke="#ea580c" strokeWidth="3" />
            {/* Yolk Matrix */}
            <circle cx="50" cy="50" r="30" fill="#fb923c" />
            {/* Embryonic Eye Spots */}
            <circle cx="42" cy="45" r="3.5" fill="#000000" className="animate-pulse" />
            <circle cx="58" cy="45" r="3.5" fill="#000000" className="animate-pulse" />
            <circle cx="43" cy="44" r="1" fill="#ffffff" />
            <circle cx="59" cy="44" r="1" fill="#ffffff" />
            <text x="50" y="72" fontSize="5" fontWeight="bold" fill="#ffffff" textAnchor="middle">
              EYED EMBRYO
            </text>
          </svg>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-alt border border-border/60 space-y-1">
            <div className="font-bold text-navy flex items-center gap-1.5">
              <Thermometer className="h-4 w-4 text-primary" /> 4.0 °C Controlled Cold Chain
            </div>
            <p className="text-muted-foreground">
              Maintains metabolic dormancy during air transit.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt border border-border/60 space-y-1">
            <div className="font-bold text-navy flex items-center gap-1.5">
              <Plane className="h-4 w-4 text-mint" /> Insulated Container Validation
            </div>
            <p className="text-muted-foreground">
              Dispatched with real-time temperature logger sensors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
