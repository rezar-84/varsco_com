import { useState } from "react";
import { Plane, ShieldCheck, Thermometer, Clock, MapPin, ArrowRight, Globe } from "lucide-react";
import turkeyFlagSvg from "@/assets/icons/turkey-flag.svg";
import { useI18n } from "@/context/I18nContext";
import {
  ME_MAP_VIEWBOX,
  TURKEY_OUTLINE_D,
  SAUDI_OUTLINE_D,
  UAE_OUTLINE_D,
  QATAR_OUTLINE_D,
  OMAN_OUTLINE_D,
} from "./middleEastMapPaths";

const ORIGIN = { x: 75.6, y: 128.6 };

interface CorridorNode {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  countryShort: string;
  x: number;
  y: number;
  flightHours: string;
  temp: string;
  certs: string[];
  type: "origin" | "hub";
}

export function AnimatedHorecaMiddleEastMap() {
  const { t } = useI18n();

  const NODES: CorridorNode[] = [
    {
      id: "izmir",
      name: t("meMap.node.izmir.name"),
      code: "ADB",
      city: "İzmir",
      country: t("meMap.country.turkey"),
      countryShort: "TÜRKIYE",
      x: ORIGIN.x,
      y: ORIGIN.y,
      flightHours: t("meMap.node.izmir.flightHours"),
      temp: t("meMap.node.izmir.temp"),
      certs: [t("meMap.cert.traces"), t("meMap.cert.iso"), t("meMap.cert.euSfda")],
      type: "origin",
    },
    {
      id: "dubai",
      name: t("meMap.node.dubai.name"),
      code: "DXB",
      city: "Dubai",
      country: t("meMap.country.uae"),
      countryShort: "UAE",
      x: 750.7,
      y: 445.7,
      flightHours: t("meMap.node.dubai.flightHours"),
      temp: t("meMap.node.dubai.temp"),
      certs: [t("meMap.cert.esma"), t("meMap.cert.halal"), t("meMap.cert.ddp")],
      type: "hub",
    },
    {
      id: "riyadh",
      name: t("meMap.node.riyadh.name"),
      code: "RUH",
      city: "Riyadh",
      country: t("meMap.country.ksa"),
      countryShort: "KSA",
      x: 544.4,
      y: 457.5,
      flightHours: t("meMap.node.riyadh.flightHours"),
      temp: t("meMap.node.riyadh.temp"),
      certs: [t("meMap.cert.sfda"), t("meMap.cert.saso"), t("meMap.cert.halalCompliant")],
      type: "hub",
    },
    {
      id: "jeddah",
      name: t("meMap.node.jeddah.name"),
      code: "JED",
      city: "Jeddah",
      country: t("meMap.country.ksa"),
      countryShort: "KSA",
      x: 364.8,
      y: 535.0,
      flightHours: t("meMap.node.jeddah.flightHours"),
      temp: t("meMap.node.jeddah.temp"),
      certs: [t("meMap.cert.sfda"), t("meMap.cert.redSea")],
      type: "hub",
    },
    {
      id: "doha",
      name: t("meMap.node.doha.name"),
      code: "DOH",
      city: "Doha",
      country: t("meMap.country.qatar"),
      countryShort: "QATAR",
      x: 660.9,
      y: 443.8,
      flightHours: t("meMap.node.doha.flightHours"),
      temp: t("meMap.node.doha.temp"),
      certs: [t("meMap.cert.qatarMoph"), t("meMap.cert.horeca")],
      type: "hub",
    },
    {
      id: "muscat",
      name: t("meMap.node.muscat.name"),
      code: "MCT",
      city: "Muscat",
      country: t("meMap.country.oman"),
      countryShort: "OMAN",
      x: 825.9,
      y: 484.6,
      flightHours: t("meMap.node.muscat.flightHours"),
      temp: t("meMap.node.muscat.temp"),
      certs: [t("meMap.cert.omanAgri"), t("meMap.cert.resort")],
      type: "hub",
    },
  ];
  const [activeNode, setActiveNode] = useState<CorridorNode>(NODES[1]); // Default Dubai

  return (
    <div className="rounded-3xl p-6 sm:p-8 border border-slate-800 bg-slate-950 text-white shadow-2xl relative overflow-hidden">
      {/* Ambient Radial Background Lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      {/* Header Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <Plane className="h-3.5 w-3.5" /> {t("meMap.telemetry")}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>{t("meMap.centralHub")}</span>
            <ArrowRight className="h-5 w-5 text-emerald-400" />
            <span>{t("meMap.gulfAirports")}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 shadow-md">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold">{t("meMap.liveCorridors")}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* SVG Vector Map Container (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 relative rounded-2xl bg-slate-900/95 p-4 border border-slate-800 shadow-inner">
          <svg viewBox={ME_MAP_VIEWBOX} className="w-full h-auto drop-shadow-2xl select-none">
            <defs>
              {/* Active arc gradient */}
              <linearGradient id="arcGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="1" />
              </linearGradient>

              <filter id="vectorGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grid Coordinates */}
            <g className="opacity-10 stroke-slate-500" strokeWidth="0.5">
              <path d="M0 175 H900 M0 350 H900 M0 525 H900" strokeDasharray="4 4" />
              <path d="M225 0 V700 M450 0 V700 M675 0 V700" strokeDasharray="4 4" />
            </g>

            {/* REAL COUNTRY BOUNDARIES (reprojected from true geographic outlines) */}
            <g id="country-boundaries">
              <path d={TURKEY_OUTLINE_D} fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
              <path d={SAUDI_OUTLINE_D} fill="#0F172A" stroke="#475569" strokeWidth="2" />
              <path d={UAE_OUTLINE_D} fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
              <path d={QATAR_OUTLINE_D} fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
              <path d={OMAN_OUTLINE_D} fill="#0F172A" stroke="#6366F1" strokeWidth="1.5" />
            </g>

            {/* FLIGHT CORRIDOR ARCS */}
            {NODES.slice(1).map((node) => {
              const isSelected = activeNode.id === node.id;
              const midX = (ORIGIN.x + node.x) / 2 - 30;
              const midY = (ORIGIN.y + node.y) / 2 - 90;

              return (
                <g key={`route-${node.id}`}>
                  <path
                    d={`M${ORIGIN.x} ${ORIGIN.y} Q ${midX} ${midY} ${node.x} ${node.y}`}
                    fill="none"
                    stroke={isSelected ? "url(#arcGlowGrad)" : "#334155"}
                    strokeWidth={isSelected ? "4" : "1.5"}
                    strokeDasharray={isSelected ? "8 4" : "4 4"}
                    filter={isSelected ? "url(#vectorGlow)" : undefined}
                  />

                  {/* Traveling Pulse Particle */}
                  {isSelected && (
                    <circle r="5" fill="#34D399" filter="url(#vectorGlow)">
                      <animateMotion
                        path={`M${ORIGIN.x} ${ORIGIN.y} Q ${midX} ${midY} ${node.x} ${node.y}`}
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* HIGH CONTRAST NODE PINS & COUNTRY BADGES */}
            {NODES.map((node) => {
              const isSelected = activeNode.id === node.id;
              const isOrigin = node.type === "origin";

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setActiveNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Aura */}
                  <circle
                    r={isSelected ? "22" : isOrigin ? "18" : "14"}
                    fill={isOrigin ? "#38BDF8" : "#10B981"}
                    fillOpacity={isSelected ? "0.4" : "0.15"}
                    className="transition-all duration-300"
                  >
                    {isSelected && (
                      <animate
                        attributeName="r"
                        values="16;26;16"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>

                  {/* Core Pin */}
                  <circle
                    r={isOrigin ? "10" : "8"}
                    fill={isOrigin ? "#0284C7" : isSelected ? "#10B981" : "#475569"}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    filter={isSelected ? "url(#vectorGlow)" : undefined}
                  />

                  {/* City & Country Name Pill Badge above Pin */}
                  <g transform="translate(0, -26)">
                    <rect
                      x="-55"
                      y="-13"
                      width="110"
                      height="20"
                      rx="6"
                      fill={isSelected ? "#10B981" : isOrigin ? "#0284C7" : "#0F172A"}
                      stroke={isSelected ? "#6EE7B7" : isOrigin ? "#38BDF8" : "#334155"}
                      strokeWidth="1.5"
                      className="shadow-xl"
                    />
                    <text
                      y="1"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      className="text-[10px] font-black tracking-wider"
                    >
                      {node.city}, {node.countryShort} ({node.code})
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* User Guide Hint */}
          <div className="absolute bottom-3 left-4 text-xs text-slate-300 font-semibold flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>{t("meMap.clickHint")}</span>
          </div>
        </div>

        {/* Selected Node Telemetry Details Box (4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="rounded-2xl p-6 border border-emerald-500/40 bg-slate-900 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {activeNode.type === "origin"
                    ? t("meMap.exportHubLabel")
                    : t("meMap.gccHubLabel")}
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-2 flex items-center gap-2">
                  <span>{activeNode.name}</span>
                </h3>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-1.5 text-white font-bold text-xs shrink-0 border border-slate-700">
                {activeNode.type === "origin" && (
                  <img
                    src={turkeyFlagSvg}
                    alt="Flag of Türkiye"
                    className="h-3.5 w-5 rounded object-cover"
                  />
                )}
                <span>{activeNode.country}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Clock className="h-4 w-4 text-emerald-400" /> {t("meMap.corridorLabel")}
                </span>
                <span className="font-bold text-white">{activeNode.flightHours}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Thermometer className="h-4 w-4 text-sky-400" /> {t("meMap.coldChainLabel")}
                </span>
                <span className="font-bold text-sky-300">{activeNode.temp}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> {t("meMap.approvalsLabel")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeNode.certs.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#horeca-form"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg hover:scale-[1.01]"
              >
                <span>
                  {t("meMap.requestCta")} {activeNode.code} ({activeNode.city})
                </span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
