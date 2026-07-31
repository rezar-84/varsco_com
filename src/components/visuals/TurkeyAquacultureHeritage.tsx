import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Building2,
  Waves,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Minimize2,
} from "lucide-react";
import turkeyFlagSvg from "@/assets/icons/turkey-flag.svg";
import { useI18n } from "@/context/I18nContext";
import { TURKEY_MAP_VIEWBOX, TURKEY_PROVINCES_PATH_D } from "./turkeyProvincesPath";

const MAP_ZOOM = 3;

export interface HatcheryLocation {
  id: string;
  name: string;
  city: string;
  region: string;
  type: string;
  species: string[];
  description: string;
  x: number; // percentage coordinate on SVG map (0-100)
  y: number; // percentage coordinate on SVG map (0-100)
  isHQ?: boolean;
}

export function TurkeyAquacultureHeritage() {
  const { t } = useI18n();

  const TURKEY_LOCATIONS: HatcheryLocation[] = [
    {
      id: "vars-hq",
      name: t("trMap.loc.vars-hq.name"),
      city: "İzmir (Konak)",
      region: t("trMap.loc.vars-hq.region"),
      type: t("trMap.loc.vars-hq.type"),
      species: [
        t("trMap.loc.vars-hq.species.0"),
        t("trMap.loc.vars-hq.species.1"),
        t("trMap.loc.vars-hq.species.2"),
        t("trMap.loc.vars-hq.species.3"),
      ],
      description: t("trMap.loc.vars-hq.description"),
      x: 8.8,
      y: 58.8,
      isHQ: true,
    },
    {
      id: "kilic",
      name: t("trMap.loc.kilic.name"),
      city: "Bodrum / Milas (Muğla)",
      region: t("trMap.loc.kilic.region"),
      type: t("trMap.loc.kilic.type"),
      species: [
        t("trMap.loc.kilic.species.0"),
        t("trMap.loc.kilic.species.1"),
        t("trMap.loc.kilic.species.2"),
      ],
      description: t("trMap.loc.kilic.description"),
      x: 12.1,
      y: 74.4,
    },
    {
      id: "sursan",
      name: t("trMap.loc.sursan.name"),
      city: "Samsun & Black Sea Coast",
      region: t("trMap.loc.sursan.region"),
      type: t("trMap.loc.sursan.type"),
      species: [
        t("trMap.loc.sursan.species.0"),
        t("trMap.loc.sursan.species.1"),
        t("trMap.loc.sursan.species.2"),
      ],
      description: t("trMap.loc.sursan.description"),
      x: 56.0,
      y: 18.4,
    },
    {
      id: "noordzee",
      name: t("trMap.loc.noordzee.name"),
      city: "Didim & Söke (Aydın / İzmir)",
      region: t("trMap.loc.noordzee.region"),
      type: t("trMap.loc.noordzee.type"),
      species: [
        t("trMap.loc.noordzee.species.0"),
        t("trMap.loc.noordzee.species.1"),
        t("trMap.loc.noordzee.species.2"),
      ],
      description: t("trMap.loc.noordzee.description"),
      x: 10.0,
      y: 73.6,
    },
    {
      id: "abalioglu",
      name: t("trMap.loc.abalioglu.name"),
      city: "Denizli & Aegean Basin",
      region: t("trMap.loc.abalioglu.region"),
      type: t("trMap.loc.abalioglu.type"),
      species: [
        t("trMap.loc.abalioglu.species.0"),
        t("trMap.loc.abalioglu.species.1"),
        t("trMap.loc.abalioglu.species.2"),
      ],
      description: t("trMap.loc.abalioglu.description"),
      x: 18.8,
      y: 67.9,
    },
    {
      id: "ilknak",
      name: t("trMap.loc.ilknak.name"),
      city: "Dikili (İzmir)",
      region: t("trMap.loc.ilknak.region"),
      type: t("trMap.loc.ilknak.type"),
      species: [
        t("trMap.loc.ilknak.species.0"),
        t("trMap.loc.ilknak.species.1"),
        t("trMap.loc.ilknak.species.2"),
      ],
      description: t("trMap.loc.ilknak.description"),
      x: 7.5,
      y: 49.7,
    },
    {
      id: "akvatek",
      name: t("trMap.loc.akvatek.name"),
      city: "Urla (İzmir)",
      region: t("trMap.loc.akvatek.region"),
      type: t("trMap.loc.akvatek.type"),
      species: [
        t("trMap.loc.akvatek.species.0"),
        t("trMap.loc.akvatek.species.1"),
        t("trMap.loc.akvatek.species.2"),
      ],
      description: t("trMap.loc.akvatek.description"),
      x: 6.8,
      y: 60.2,
    },
  ];

  // Set the default state safely inside the component block, referencing local locations array
  const [selectedLoc, setSelectedLoc] = useState<HatcheryLocation>(TURKEY_LOCATIONS[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  const selectLocation = (loc: HatcheryLocation) => {
    setSelectedLoc(loc);
    setIsZoomed(true);
  };

  return (
    <div className="rounded-3xl p-6 sm:p-10 border border-slate-800 bg-slate-950 text-white shadow-2xl relative overflow-hidden space-y-8">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-6 relative z-10">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-extrabold uppercase tracking-wider border border-red-500/30">
            <img
              src={turkeyFlagSvg}
              alt="Flag of Türkiye"
              className="h-4 w-6 rounded object-cover shadow-sm"
            />
            <span>{t("trMap.badge")}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
            {t("trMap.title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            {t("trMap.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shrink-0 shadow-lg backdrop-blur-md">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-white">{t("trMap.hubsCount")}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">{t("trMap.hubsSub")}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Vector Map + Details Sidebar */}
      <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Outlined Vector Map Box */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-8 relative overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[440px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 z-20">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              {isZoomed ? t("trMap.clickHintZoomed") : t("trMap.clickHintWhole")}
            </div>
            {isZoomed ? (
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              >
                <Minimize2 className="h-3 w-3" /> {t("trMap.viewWhole")}
              </button>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {t("trMap.interactiveMap")}
              </span>
            )}
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[1024/500] my-auto overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 p-2 sm:p-4">
            {/* Zoom/Pan Layer — only the boundary map scales, so pins stay a fixed, readable size */}
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out"
              style={{
                transform: isZoomed
                  ? `scale(${MAP_ZOOM}) translate(${(50 - selectedLoc.x).toFixed(2)}%, ${(50 - selectedLoc.y).toFixed(2)}%)`
                  : "scale(1) translate(0%, 0%)",
              }}
            >
              {/* Geographically Accurate Türkiye Provinces Map (province boundaries, real coastline) */}
              <svg
                viewBox={TURKEY_MAP_VIEWBOX}
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(2,132,199,0.2)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.03)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>

                <rect width="1024" height="500" fill="url(#grid)" />

                {/* Real province boundary & coastline geometry (see turkeyProvincesPath.ts) */}
                <path
                  d={TURKEY_PROVINCES_PATH_D}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  strokeOpacity="0.65"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="filter drop-shadow-md"
                />
              </svg>
            </div>

            {/* Render Location Pins with Pulsing Circles Over Map — positioned to track the
                zoom/pan above, but kept outside the scaled layer so they don't balloon in size */}
            {TURKEY_LOCATIONS.map((loc) => {
              const isSelected = selectedLoc.id === loc.id;
              const left = isZoomed ? 50 + MAP_ZOOM * (loc.x - selectedLoc.x) : loc.x;
              const top = isZoomed ? 50 + MAP_ZOOM * (loc.y - selectedLoc.y) : loc.y;
              return (
                <button
                  key={loc.id}
                  onClick={() => selectLocation(loc)}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-[left,top,transform] duration-500 ease-out hover:scale-125 z-30"
                  aria-label={loc.name}
                >
                  {/* Outer Pulsing Ping Ring */}
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        loc.isHQ ? "bg-sky-400 opacity-80" : "bg-emerald-400 opacity-75"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-4 w-4 border-2 border-slate-950 shadow-lg ${
                        loc.isHQ
                          ? "bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.9)]"
                          : isSelected
                            ? "bg-emerald-400 scale-125 shadow-[0_0_20px_rgba(52,211,153,1)]"
                            : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                      }`}
                    />
                  </span>

                  {/* Floating Pin Label Pill */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-7 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all pointer-events-none shadow-md ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold scale-105 z-40"
                        : loc.isHQ
                          ? "bg-sky-950/90 text-sky-300 border-sky-500/40"
                          : "bg-slate-900/90 text-slate-200 border-slate-700/80 group-hover:bg-slate-800"
                    }`}
                  >
                    {loc.name.split(" ")[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Footer Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 z-20">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                <span className="font-bold text-white">{t("trMap.varsHq")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="font-bold text-white">{t("trMap.partnerHatcheries")}</span>
              </span>
            </div>
            <span className="text-slate-500">{t("trMap.coordinatesLabel")}</span>
          </div>
        </div>

        {/* Selected Hub Details Card Sidebar */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  selectedLoc.isHQ
                    ? "text-sky-300 bg-sky-500/20 border-sky-500/30"
                    : "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
                }`}
              >
                {selectedLoc.type}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {selectedLoc.region}
              </span>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Building2
                  className={`h-5 w-5 ${selectedLoc.isHQ ? "text-sky-400" : "text-emerald-400"}`}
                />
                {selectedLoc.name}
              </h3>
              <div className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span>{selectedLoc.city}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
              {selectedLoc.description}
            </p>

            {/* Species Focus Badges */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("trMap.opsFocus")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedLoc.species.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Location Selector Grid Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t("trMap.selectLocation")}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TURKEY_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => selectLocation(loc)}
                  className={`text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                    selectedLoc.id === loc.id
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md"
                      : loc.isHQ
                        ? "bg-sky-950/40 text-sky-300 border-sky-800/60 hover:bg-sky-900/60"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{loc.name.split(" ")[0]}</span>
                  <ChevronRight className="h-3 w-3 opacity-60 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
