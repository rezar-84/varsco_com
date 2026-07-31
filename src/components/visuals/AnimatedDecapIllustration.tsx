import { ShieldCheck, Zap, Sliders } from "lucide-react";

export function AnimatedDecapIllustration() {
  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background shadow-xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sliders className="h-4 w-4 text-mint" /> Shell Removal Mechanism
          </span>
          <h3 className="font-display text-xl font-bold text-navy">
            Standard Cyst vs Decapsulated Embryo
          </h3>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* Standard Cyst */}
        <div className="glass-card rounded-2xl p-5 border border-border bg-surface-alt/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy">Standard Artemia Cyst</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
              For Hatching & Culture
            </span>
          </div>

          <div className="relative aspect-square max-w-[160px] mx-auto flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer Thick Shell (Chorion) */}
              <circle cx="50" cy="50" r="42" fill="#78350f" stroke="#451a03" strokeWidth="6" />
              {/* Inner Embryo */}
              <circle cx="50" cy="50" r="28" fill="#f59e0b" />
              <text x="50" y="54" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                CHORION SHELL
              </text>
            </svg>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Retains its natural chorion shell. Hatch before feeding to very young fry, or feed
            directly to species that tolerate shell content.
          </p>
        </div>

        {/* Decapsulated Embryo */}
        <div className="glass-card rounded-2xl p-5 border border-mint/40 bg-mint/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy">VARS Decapsulated Embryo</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-mint/20 text-navy">
              Ready to Feed Directly
            </span>
          </div>

          <div className="relative aspect-square max-w-[160px] mx-auto flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Pulsing Clean Membrane */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                strokeDasharray="4,2"
                className="animate-pulse-glow"
              />
              {/* Pure High-Energy Embryo */}
              <circle cx="50" cy="50" r="34" fill="#38bdf8" className="animate-pulse" />
              <text x="50" y="53" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                100% DIGESTIBLE
              </text>
            </svg>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Chorion fully removed. Higher net energy density (502 kcal/100g) with no hatching
            step — feed directly from the can.
          </p>
        </div>
      </div>
    </div>
  );
}
