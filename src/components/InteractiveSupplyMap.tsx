import { useState } from "react";
import { Plane, Truck, Ship, ShieldCheck, Clock, MapPin, ArrowRight } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

type RegionNode = {
  id: string;
  name: string;
  flag: string;
  x: number; // SVG % x
  y: number; // SVG % y
  transitAir: string;
  transitSea: string;
  incoterms: string[];
  keyPorts: string[];
  description: string;
};

export function InteractiveSupplyMap() {
  const { t } = useI18n();

  const REGIONS: RegionNode[] = [
    {
      id: "turkey",
      name: t("supplyMap.region.turkey.name"),
      flag: "🇹🇷",
      x: 48,
      y: 35,
      transitAir: t("supplyMap.region.turkey.transitAir"),
      transitSea: t("supplyMap.region.turkey.transitSea"),
      incoterms: ["FOB İzmir", "FOB Mersin", "EXW", "CIF", "DDP"],
      keyPorts: ["İzmir Adnan Menderes Airport (ADB)", "Alsancak Port", "Mersin Port"],
      description: t("supplyMap.region.turkey.desc"),
    },
    {
      id: "dubai",
      name: t("supplyMap.region.dubai.name"),
      flag: "🇦🇪",
      x: 72,
      y: 54,
      transitAir: t("supplyMap.region.dubai.transitAir"),
      transitSea: t("supplyMap.region.dubai.transitSea"),
      incoterms: ["CIF Dubai", "FOB İzmir", "DDP Dubai Cargo City"],
      keyPorts: ["Dubai International (DXB)", "Al Maktoum (DWC)", "Jebel Ali Port"],
      description: t("supplyMap.region.dubai.desc"),
    },
    {
      id: "ksa",
      name: t("supplyMap.region.ksa.name"),
      flag: "🇸🇦",
      x: 64,
      y: 58,
      transitAir: t("supplyMap.region.ksa.transitAir"),
      transitSea: t("supplyMap.region.ksa.transitSea"),
      incoterms: ["CIF Jeddah", "CIF Dammam", "FOB İzmir"],
      keyPorts: ["Jeddah Islamic Port", "King Abdulaziz Port Dammam", "Riyadh Airport (RUH)"],
      description: t("supplyMap.region.ksa.desc"),
    },
    {
      id: "oman",
      name: t("supplyMap.region.oman.name"),
      flag: "🇴🇲",
      x: 75,
      y: 64,
      transitAir: t("supplyMap.region.oman.transitAir"),
      transitSea: t("supplyMap.region.oman.transitSea"),
      incoterms: ["CIF Muscat", "CIF Salalah", "FOB İzmir"],
      keyPorts: ["Muscat International (MCT)", "Port of Salalah", "Sohar Port"],
      description: t("supplyMap.region.oman.desc"),
    },
    {
      id: "qatar",
      name: t("supplyMap.region.qatar.name"),
      flag: "🇶🇦",
      x: 69,
      y: 53,
      transitAir: t("supplyMap.region.qatar.transitAir"),
      transitSea: t("supplyMap.region.qatar.transitSea"),
      incoterms: ["CIF Doha", "FOB İzmir"],
      keyPorts: ["Hamad International Airport (DOH)", "Hamad Port"],
      description: t("supplyMap.region.qatar.desc"),
    },
    {
      id: "europe",
      name: t("supplyMap.region.europe.name"),
      flag: "🇪🇺",
      x: 28,
      y: 28,
      transitAir: t("supplyMap.region.europe.transitAir"),
      transitSea: t("supplyMap.region.europe.transitSea"),
      incoterms: ["CIF Rotterdam", "CIF Hamburg", "CIF Milan", "DDP EU"],
      keyPorts: ["Milan Malpensa", "Frankfurt Airport", "Rotterdam Port", "Verona Logistics Hub"],
      description: t("supplyMap.region.europe.desc"),
    },
  ];
  const [selected, setSelected] = useState<RegionNode>(REGIONS[0]);

  const hub = REGIONS[0]; // Turkey

  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background shadow-xl overflow-hidden p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
        <div>
          <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <MapPin className="h-4 w-4" /> Global & Regional Supply Lines
          </span>
          <h3 className="font-display text-2xl font-bold text-navy">
            Interactive Vector Trade Routes
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selected.id === r.id
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-surface-alt text-navy hover:bg-muted"
              }`}
            >
              <span className="mr-1.5">{r.flag}</span>
              {r.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Interactive Map Visual */}
        <div className="lg:col-span-7 relative aspect-[16/10] bg-navy/95 rounded-2xl overflow-hidden border border-white/10 p-4 shadow-inner">
          <svg className="w-full h-full text-white/20" viewBox="0 0 100 70" fill="none">
            {/* Ambient Grid Background */}
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100" height="70" fill="url(#grid)" />

            {/* Connecting Trade Route Lines from İzmir (Hub) */}
            {REGIONS.slice(1).map((r) => (
              <g key={r.id}>
                <line
                  x1={hub.x}
                  y1={hub.y}
                  x2={r.x}
                  y2={r.y}
                  stroke={selected.id === r.id ? "#38bdf8" : "rgba(255,255,255,0.15)"}
                  strokeWidth={selected.id === r.id ? "1.5" : "0.8"}
                  strokeDasharray={selected.id === r.id ? "none" : "2,2"}
                  className="transition-all duration-300"
                />
                {selected.id === r.id && (
                  <circle
                    cx={(hub.x + r.x) / 2}
                    cy={(hub.y + r.y) / 2}
                    r="1"
                    fill="#38bdf8"
                    className="animate-ping"
                  />
                )}
              </g>
            ))}

            {/* Map Node Dots */}
            {REGIONS.map((r) => {
              const isSelected = selected.id === r.id;
              const isHub = r.id === "turkey";

              return (
                <g key={r.id} onClick={() => setSelected(r)} className="cursor-pointer group">
                  {isSelected && (
                    <circle
                      cx={r.x}
                      cy={r.y}
                      r="4.5"
                      fill="none"
                      stroke={isHub ? "#4ade80" : "#38bdf8"}
                      strokeWidth="0.8"
                      className="animate-pulse"
                    />
                  )}
                  <circle
                    cx={r.x}
                    cy={r.y}
                    r={isHub ? "3" : "2"}
                    fill={isHub ? "#4ade80" : isSelected ? "#38bdf8" : "rgba(255,255,255,0.6)"}
                    className="transition-transform duration-300 group-hover:scale-125"
                  />
                  <text
                    x={r.x}
                    y={r.y + 4.5}
                    fontSize="2.5"
                    fontWeight="bold"
                    fill={isSelected ? "#ffffff" : "rgba(255,255,255,0.7)"}
                    textAnchor="middle"
                  >
                    {r.flag} {r.id === "turkey" ? "İZMİR" : r.id.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Region Logistics Details Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{selected.flag}</span>
            <div>
              <h4 className="font-display text-xl font-bold text-navy">{selected.name}</h4>
              <span className="text-xs text-mint font-bold uppercase tracking-wider">
                {t("supplyMap.activeCorridor")}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">{selected.description}</p>

          <div className="space-y-2.5 pt-2 border-t border-border/60 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-alt border border-border/60">
              <span className="flex items-center gap-2 text-navy font-semibold">
                <Plane className="h-4 w-4 text-primary" /> {t("supplyMap.expressAir")}
              </span>
              <span className="font-bold text-navy">{selected.transitAir}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-alt border border-border/60">
              <span className="flex items-center gap-2 text-navy font-semibold">
                <Ship className="h-4 w-4 text-mint" /> {t("supplyMap.oceanReefer")}
              </span>
              <span className="font-bold text-navy">{selected.transitSea}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-navy">{t("supplyMap.incoterms")}</div>
            <div className="flex flex-wrap gap-1.5">
              {selected.incoterms.map((inc) => (
                <span
                  key={inc}
                  className="px-2.5 py-1 rounded-lg bg-teal/20 text-navy font-bold text-[11px]"
                >
                  {inc}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="text-xs font-bold text-navy">{t("supplyMap.gateways")}</div>
            <div className="text-xs text-muted-foreground leading-normal">
              {selected.keyPorts.join(" · ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
