import { useState } from "react";
import { Cpu, RefreshCw, Droplets, Zap, ShieldCheck, Activity } from "lucide-react";

/**
 * The four stage-to-stage pipe runs, in flow order: rearing tank → drum filter
 * → bio-filter → UV/ozone → degasser. Each `d` is written left-to-right so the
 * dash animation and the travelling marker both move downstream; reversing a
 * path here would silently reverse the water.
 */
const STAGE_PIPES = [
  { id: "tank-drum", d: "M 110 160 H 170", color: "#38bdf8" },
  { id: "drum-bio", d: "M 230 160 H 280", color: "#f59e0b" },
  { id: "bio-uv", d: "M 340 160 H 390", color: "#10b981" },
  { id: "uv-degas", d: "M 450 160 H 490", color: "#8b5cf6" },
];

/** Degasser back to the rearing tank — the leg that closes the loop. */
const RETURN_PIPE = "M 490 190 V 270 H 60 V 190";

export function AnimatedRasDiagram() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const STEPS = [
    {
      title: "Primary Rearing Tank",
      desc: "High-density clean oxygenated water environment for optimal fish & shrimp growth with continuous waste removal.",
      icon: Droplets,
      color: "#38bdf8",
    },
    {
      title: "Drum Filter (Mechanical)",
      desc: "Rotating mesh drum removes solid waste, uneaten feed, and organic suspended particles down to 30 microns.",
      icon: RefreshCw,
      color: "#f59e0b",
    },
    {
      title: "Moving Bed Bio-Filter (MBBR)",
      desc: "Billions of nitrifying bacteria colonize bio-media chips, converting toxic ammonia into harmless nitrate.",
      icon: Activity,
      color: "#10b981",
    },
    {
      title: "UV & Ozone Sterilization",
      desc: "Dual UV-C lamps and ozone dosing eliminate 99.9% of biological pathogens, bacteria, and micro-parasites.",
      icon: Zap,
      color: "#8b5cf6",
    },
    {
      title: "Oxygenation & Degassing Tower",
      desc: "Strips accumulated CO2 gas and injects pure dissolved oxygen before returning pristine water to rearing tanks.",
      icon: ShieldCheck,
      color: "#06b6d4",
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-background shadow-2xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Cpu className="h-4 w-4 text-primary" /> Closed-Loop Engineering Vector
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy">
            Recirculating Aquaculture System (RAS)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold text-xs border border-emerald-500/20">
            <RefreshCw className="h-3.5 w-3.5 text-emerald-500" /> 98% Water Recirculation
            Efficiency
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Animated Vector SVG Canvas */}
        <div className="lg:col-span-8 relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-4 shadow-2xl">
          <svg
            className="w-full h-auto min-h-[300px]"
            viewBox="0 0 550 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Grid Pattern */}
            <pattern id="rasGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            </pattern>
            <rect width="550" height="320" fill="url(#rasGrid)" />

            {/* Pipes. Each is drawn in the direction water travels, so the
                marching dashes read as downstream flow. */}
            {STAGE_PIPES.map((pipe) => (
              <path
                key={pipe.id}
                d={pipe.d}
                stroke={pipe.color}
                strokeWidth="4"
                strokeDasharray="6 4"
                className="animate-ras-flow"
              />
            ))}

            {/* Recirculation return: degasser bottom, along the floor, back up
                into the rearing tank. This leg is the whole point of a closed
                loop and previously carried no flow marker at all. */}
            <path
              d={RETURN_PIPE}
              stroke="#06b6d4"
              strokeWidth="3"
              strokeDasharray="8 4"
              opacity="0.6"
              className="animate-ras-flow-return"
            />

            {/* Flow markers that actually travel their pipe.
                These were animate-ping circles pinned at fixed coordinates —
                ping scales and fades in place, so they blinked like status
                LEDs instead of showing water moving between stages. */}
            {STAGE_PIPES.map((pipe) => (
              <circle key={`${pipe.id}-marker`} r="3.5" fill={pipe.color}>
                <animateMotion dur="1.9s" repeatCount="indefinite" path={pipe.d} />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.15;0.85;1"
                  dur="1.9s"
                  repeatCount="indefinite"
                />
              </circle>
            ))}

            {/* Three staggered markers on the return leg: it is far longer than
                a stage gap, so one marker would leave it empty most of the time
                and the loop would not read as continuous. */}
            {["0s", "1.6s", "3.2s"].map((begin) => (
              <circle key={`return-${begin}`} r="3" fill="#06b6d4">
                <animateMotion
                  dur="4.8s"
                  begin={begin}
                  repeatCount="indefinite"
                  path={RETURN_PIPE}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.08;0.92;1"
                  dur="4.8s"
                  begin={begin}
                  repeatCount="indefinite"
                />
              </circle>
            ))}

            {/* STEP 1: REARING TANK */}
            <g onClick={() => setActiveStep(0)} className="cursor-pointer group">
              <rect
                x="15"
                y="80"
                width="95"
                height="110"
                rx="12"
                fill="#0f172a"
                stroke={activeStep === 0 ? "#38bdf8" : "#334155"}
                strokeWidth={activeStep === 0 ? "3" : "1.5"}
                filter={activeStep === 0 ? "url(#glow)" : undefined}
                className="transition-all group-hover:brightness-125"
              />
              <rect
                x="23"
                y="110"
                width="79"
                height="72"
                rx="6"
                fill="#0284c7"
                fillOpacity="0.25"
              />
              <text
                x="62"
                y="100"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
              >
                1. REARING TANK
              </text>

              {/* Swimming Fish Illustration */}
              <g className="animate-swim">
                <path d="M 45 133 L 36 128 L 38 133 L 36 138 Z" fill="#38bdf8" />
                <ellipse cx="54" cy="133" rx="11" ry="5.5" fill="#38bdf8" />
                <path d="M 51 128.5 L 55 124 L 57 128.5 Z" fill="#38bdf8" />
                <circle cx="61" cy="131.5" r="1.1" fill="#0f172a" />
              </g>
              <g className="animate-swim-delayed" opacity="0.75">
                <path d="M 52 157 L 45 153 L 47 157 L 45 161 Z" fill="#38bdf8" />
                <ellipse cx="59" cy="157" rx="9" ry="4.5" fill="#38bdf8" />
                <path d="M 56.5 153.5 L 59.5 150 L 61 153.5 Z" fill="#38bdf8" />
                <circle cx="65" cy="155.7" r="0.9" fill="#0f172a" />
              </g>
              <text x="62" y="178" textAnchor="middle" fill="#7dd3fc" fontSize="8" fontWeight="600">
                Pure O2 Flow
              </text>
            </g>

            {/* STEP 2: DRUM FILTER */}
            <g onClick={() => setActiveStep(1)} className="cursor-pointer group">
              <rect
                x="170"
                y="80"
                width="60"
                height="110"
                rx="12"
                fill="#0f172a"
                stroke={activeStep === 1 ? "#f59e0b" : "#334155"}
                strokeWidth={activeStep === 1 ? "3" : "1.5"}
                filter={activeStep === 1 ? "url(#glow)" : undefined}
                className="transition-all group-hover:brightness-125"
              />
              <circle
                cx="200"
                cy="135"
                r="22"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 2"
                className="animate-spin"
                style={{ transformOrigin: "200px 135px" }}
              />
              <text
                x="200"
                y="100"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
              >
                2. DRUM FILTER
              </text>
              <text
                x="200"
                y="178"
                textAnchor="middle"
                fill="#fcd34d"
                fontSize="8"
                fontWeight="600"
              >
                Solid Waste &gt;30µm
              </text>
            </g>

            {/* STEP 3: BIO-FILTER */}
            <g onClick={() => setActiveStep(2)} className="cursor-pointer group">
              <rect
                x="280"
                y="80"
                width="60"
                height="110"
                rx="12"
                fill="#0f172a"
                stroke={activeStep === 2 ? "#10b981" : "#334155"}
                strokeWidth={activeStep === 2 ? "3" : "1.5"}
                filter={activeStep === 2 ? "url(#glow)" : undefined}
                className="transition-all group-hover:brightness-125"
              />
              {/* Floating Bio Media Chips */}
              <circle cx="295" cy="125" r="4" fill="#10b981" className="animate-float" />
              <circle cx="310" cy="140" r="3" fill="#34d399" className="animate-float-delayed" />
              <circle cx="325" cy="130" r="4" fill="#059669" className="animate-float" />
              <text
                x="310"
                y="100"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
              >
                3. BIO-FILTER
              </text>
              <text
                x="310"
                y="178"
                textAnchor="middle"
                fill="#6ee7b7"
                fontSize="8"
                fontWeight="600"
              >
                Ammonia Bio-Conversion
              </text>
            </g>

            {/* STEP 4: UV & OZONE */}
            <g onClick={() => setActiveStep(3)} className="cursor-pointer group">
              <rect
                x="390"
                y="80"
                width="60"
                height="110"
                rx="12"
                fill="#0f172a"
                stroke={activeStep === 3 ? "#8b5cf6" : "#334155"}
                strokeWidth={activeStep === 3 ? "3" : "1.5"}
                filter={activeStep === 3 ? "url(#glow)" : undefined}
                className="transition-all group-hover:brightness-125"
              />
              {/* UV Ray Lines */}
              <line
                x1="420"
                y1="115"
                x2="420"
                y2="155"
                stroke="#a78bfa"
                strokeWidth="4"
                className="animate-pulse"
              />
              <text
                x="420"
                y="100"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
              >
                4. UV / OZONE
              </text>
              <text
                x="420"
                y="178"
                textAnchor="middle"
                fill="#c4b5fd"
                fontSize="8"
                fontWeight="600"
              >
                99.9% Pathogen Kill
              </text>
            </g>

            {/* STEP 5: OXYGENATION & DEGASSER */}
            <g onClick={() => setActiveStep(4)} className="cursor-pointer group">
              <rect
                x="475"
                y="80"
                width="60"
                height="110"
                rx="12"
                fill="#0f172a"
                stroke={activeStep === 4 ? "#06b6d4" : "#334155"}
                strokeWidth={activeStep === 4 ? "3" : "1.5"}
                filter={activeStep === 4 ? "url(#glow)" : undefined}
                className="transition-all group-hover:brightness-125"
              />
              {/* Oxygen Bubbles */}
              <circle cx="495" cy="160" r="2.5" fill="#67e8f9" className="animate-bubble-rise" />
              <circle
                cx="515"
                cy="165"
                r="3.5"
                fill="#22d3ee"
                className="animate-bubble-rise-delayed"
              />
              <text
                x="505"
                y="100"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="bold"
              >
                5. O2 DEGASSER
              </text>
              <text
                x="505"
                y="178"
                textAnchor="middle"
                fill="#a5f3fc"
                fontSize="8"
                fontWeight="600"
              >
                CO2 Strip & O2 Inject
              </text>
            </g>

            {/* Flow Legend Banner at Bottom */}
            <rect x="60" y="255" width="430" height="30" rx="8" fill="#0f172a" stroke="#334155" />
            <text
              x="275"
              y="274"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontWeight="bold"
            >
              CONTINUOUS CLOSED-LOOP RECIRCULATION • 98% WATER RECOVERED
            </text>
          </svg>
        </div>

        {/* Step Breakdown Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3 p-5 rounded-2xl bg-surface-alt border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Stage 0{activeStep + 1} of 05
              </span>
              {(() => {
                const IconComp = STEPS[activeStep].icon;
                return <IconComp className="h-5 w-5" style={{ color: STEPS[activeStep].color }} />;
              })()}
            </div>
            <h4 className="font-display text-xl font-bold text-navy">{STEPS[activeStep].title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {STEPS[activeStep].desc}
            </p>
          </div>

          {/* Interactive Step Switcher Tabs */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-navy uppercase tracking-wider">
              Select System Component
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {STEPS.map((s, idx) => (
                <button
                  key={s.title}
                  onClick={() => setActiveStep(idx)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all border ${
                    activeStep === idx
                      ? "bg-navy text-white border-navy shadow-md scale-[1.03]"
                      : "bg-background text-navy hover:bg-surface-alt border-border"
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
