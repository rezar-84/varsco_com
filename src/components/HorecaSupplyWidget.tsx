import { useState } from "react";
import {
  Plane,
  Truck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Award,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/context/I18nContext";

export function HorecaSupplyWidget() {
  const { t } = useI18n();
  const [selectedCity, setSelectedCity] = useState<string>("dubai");

  const CITIES = [
    {
      id: "dubai",
      name: "Dubai & Abu Dhabi (UAE)",
      transit: "< 4.5 Hours Air / 7 Days Reefer",
      port: "DXB / AUH Air & Jebel Ali Port",
      cert: "Halal & UAE ESMA Certified",
    },
    {
      id: "riyadh",
      name: "Riyadh & Jeddah (KSA)",
      transit: "< 4 Hours Air / Daily",
      port: "RUH / JED Airports & SFDA Clearance",
      cert: "SFDA & SASO Approved",
    },
    {
      id: "doha",
      name: "Doha (Qatar)",
      transit: "< 4.5 Hours Air",
      port: "DOH Hamad International",
      cert: "MOPH Qatar Halal Certified",
    },
    {
      id: "muscat",
      name: "Muscat (Oman)",
      transit: "< 5 Hours Air / Daily Reefer",
      port: "MCT Airport & Hatta Land Border",
      cert: "Oman Agricultural Clearance",
    },
  ];

  const cityData = CITIES.find((c) => c.id === selectedCity) ?? CITIES[0];

  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background shadow-xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-bold text-mint-ink uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Plane className="h-4 w-4 text-mint-ink" /> Direct Middle East HORECA Supply
          </span>
          <h3 className="font-display text-2xl font-bold text-navy">
            GCC Air Freight & Cold-Chain Logistics
          </h3>
        </div>

        <Link
          to="/horeca-seafood-middle-east"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-navy transition-colors shrink-0"
        >
          View Full HORECA Guide <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* City Switcher Tabs */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-navy uppercase tracking-wider mb-2">
            Select Destination Hub
          </div>
          <div className="space-y-2">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCity(c.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold text-left transition-all ${
                  selectedCity === c.id
                    ? "bg-navy text-white shadow-md scale-[1.02]"
                    : "bg-surface-alt text-navy/80 hover:bg-muted hover:text-navy border border-border/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MapPin
                    className={`h-4 w-4 ${selectedCity === c.id ? "text-mint-ink" : "text-primary"}`}
                  />
                  <span>{c.name}</span>
                </span>
                <ArrowRight
                  className={`h-3.5 w-3.5 ${selectedCity === c.id ? "opacity-100" : "opacity-0"}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Selected Hub Live Details */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-border/80 bg-surface-alt/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mint-ink uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {t("horeca.flightSchedule")}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-mint/20 text-navy font-bold text-[11px]">
              {t("horeca.chilledSkinPack")}
            </span>
          </div>

          <h4 className="font-display text-xl font-bold text-navy">{cityData.name}</h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-background border border-border/60 space-y-1">
              <div className="text-[10px] text-muted-foreground font-semibold">
                {t("horeca.transitTime")}
              </div>
              <div className="font-bold text-navy">{cityData.transit}</div>
            </div>
            <div className="p-3 rounded-xl bg-background border border-border/60 space-y-1">
              <div className="text-[10px] text-muted-foreground font-semibold">
                {t("horeca.clearancePort")}
              </div>
              <div className="font-bold text-navy">{cityData.port}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy text-white text-xs space-y-1">
            <div className="font-bold text-mint flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> {t("horeca.complianceCert")}
            </div>
            <p className="text-white/80 text-[11px] leading-relaxed">{cityData.cert}</p>
          </div>

          <div className="pt-2">
            <Button
              size="sm"
              asChild
              className="w-full rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/request-quote">
                Request Middle East HORECA Master Pricelist <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
