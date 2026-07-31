import { Droplets, Thermometer, Wind, Sun } from "lucide-react";

export function AnimatedIncubationCone() {
  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background shadow-xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Wind className="h-4 w-4" /> Conical Reactor Vector
          </span>
          <h3 className="font-display text-xl font-bold text-navy">
            Optimal Hatching Conical Tank Dynamics
          </h3>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 relative aspect-[3/4] max-w-[240px] mx-auto bg-navy/95 rounded-2xl overflow-hidden border border-white/10 p-4 shadow-inner flex items-center justify-center">
          <svg viewBox="0 0 100 120" className="w-full h-full">
            {/* Conical Hatching Vessel */}
            <polygon
              points="20,20 80,20 50,100"
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38bdf8"
              strokeWidth="2"
            />

            {/* Rising Bubbles Animation */}
            <circle cx="50" cy="90" r="2" fill="#ffffff" className="animate-bounce" />
            <circle cx="48" cy="70" r="2.5" fill="#ffffff" className="animate-pulse" />
            <circle cx="52" cy="50" r="3" fill="#ffffff" className="animate-ping" />
            <circle cx="46" cy="30" r="2" fill="#ffffff" className="animate-bounce" />

            {/* Aeration Line Base */}
            <line x1="50" y1="100" x2="50" y2="115" stroke="#4ade80" strokeWidth="2" />

            {/* Target Nauplii Light Sensor */}
            <circle cx="50" cy="100" r="4" fill="#4ade80" />
            <text x="50" y="15" fontSize="4" fontWeight="bold" fill="#38bdf8" textAnchor="middle">
              2,000 LUX LIGHT
            </text>
          </svg>
        </div>

        <div className="md:col-span-6 space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-alt border border-border/60 space-y-1">
            <div className="font-bold text-navy flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-primary" /> 25 – 35 ppt Salinity
            </div>
            <p className="text-muted-foreground">
              Maintains osmotic balance for rapid embryo hydration.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt border border-border/60 space-y-1">
            <div className="font-bold text-navy flex items-center gap-1.5">
              <Thermometer className="h-4 w-4 text-mint" /> 28 – 30 °C Constant Temperature
            </div>
            <p className="text-muted-foreground">
              Ensures synchronized 20–24 hr hatch-out velocity.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt border border-border/60 space-y-1">
            <div className="font-bold text-navy flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-primary" /> Bottom Aeration Column
            </div>
            <p className="text-muted-foreground">
              Prevents cyst sedimentation and dead zones in tank corners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
