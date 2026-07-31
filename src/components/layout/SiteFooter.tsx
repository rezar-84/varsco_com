import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Globe, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { VarsLogo } from "./VarsLogo";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const { t, languages, lang, setLang, currentLanguage } = useI18n();

  return (
    <footer className="bg-navy text-white border-t border-white/10 relative overflow-hidden">
      {/* Background subtle glow overlay */}
      <div className="absolute top-0 right-1/4 -mt-24 h-96 w-96 rounded-full bg-mint/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-24 h-96 w-96 rounded-full bg-teal/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <VarsLogo variant="white" />
            <p className="text-sm font-semibold italic text-mint">{t("footer.tagline")}</p>
            <p className="text-sm leading-relaxed text-white/75 max-w-md">{t("footer.intro")}</p>

            <div className="pt-2 space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-teal shrink-0" />
                <span>İsmet Kaptan Mah., Şair Eşref Blv. No:6 D:304/B, Konak, İzmir, Türkiye</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-teal shrink-0" />
                <span>info@varsco.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-teal shrink-0" />
                <span>+90 232 290 57 56</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-mint pt-1 font-semibold">
                <ShieldCheck className="h-4 w-4 text-mint shrink-0" />
                <span>{t("footer.qcSystem")}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-mint mb-4">
              {t("footer.company")}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors">
                  {t("nav.aboutUs")}
                </Link>
              </li>
              <li>
                <Link to="/contactus" className="hover:text-white transition-colors">
                  {t("nav.contactUs")}
                </Link>
              </li>
              <li>
                <Link to="/about-us" hash="events" className="hover:text-white transition-colors">
                  {t("nav.events")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  hash="values-vision"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.values")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-mint mb-4">
              {t("footer.products")}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link
                  to="/products/$category"
                  params={{ category: "feed-additives" }}
                  className="hover:text-white transition-colors"
                >
                  {t("cat.feed-additives")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products/$category"
                  params={{ category: "hatchery-solutions" }}
                  className="hover:text-white transition-colors"
                >
                  {t("cat.hatchery-solutions")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products/$category"
                  params={{ category: "live-feed-aquaculture" }}
                  className="hover:text-white transition-colors"
                >
                  {t("cat.live-feed-aquaculture")}
                </Link>
              </li>
              <li>
                <Link
                  to="/aquariums-and-hobbyists"
                  className="hover:text-white transition-colors text-mint font-semibold"
                >
                  {t("footer.aquariumsHobby")}
                </Link>
              </li>
              <li>
                <Link
                  to="/horeca-seafood-middle-east"
                  className="hover:text-white transition-colors text-mint font-semibold"
                >
                  {t("footer.horecaSeafood")}
                </Link>
              </li>
              <li>
                <Link
                  to="/decapsulated-artemia-guide"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.decapGuide")}
                </Link>
              </li>
              <li>
                <Link
                  to="/artemia-cysts-incubation-guide"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.artemiaGuide")}
                </Link>
              </li>
              <li>
                <Link
                  to="/regional-trade-middle-east-europe"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.meEuTrade")}
                </Link>
              </li>
              <li>
                <Link to="/salmonid-ova-solutions" className="hover:text-white transition-colors">
                  {t("footer.salmonOva")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Language */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-mint mb-4">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75 mb-6">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link to="/kvkk-disclosure-text" className="hover:text-white transition-colors">
                  {t("footer.kvkk")}
                </Link>
              </li>
              <li>
                <Link to="/distance-sales-agreement" className="hover:text-white transition-colors">
                  {t("footer.dsa")}
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">
                  {t("footer.faqs")}
                </Link>
              </li>
            </ul>

            {/* Language Picker in Footer */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50 block mb-2">
                {t("footer.languageLabel")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center gap-1 ${
                      lang === l.code
                        ? "bg-mint text-navy font-bold shadow-sm"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick B2B Quote Banner */}
        <div className="mt-12 rounded-2xl bg-white/5 p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h5 className="font-display text-base font-bold text-white">{t("home.cta.title")}</h5>
            <p className="text-xs text-white/70 mt-1">{t("home.cta.body")}</p>
          </div>
          <Button asChild className="bg-mint text-navy font-bold hover:bg-mint/90 shrink-0">
            <Link to="/request-quote" className="flex items-center gap-2">
              {t("home.cta.button")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-white/60 md:flex-row sm:px-6 md:px-8">
          <div className="space-y-1 text-center md:text-start">
            <div>
              © {new Date().getFullYear()} VARS Su Ürünleri İth. İhc. San. ve Tic. Ltd. Şti.{" "}
              {t("footer.rights")}
            </div>
            <div className="text-[10px] text-white/40">
              Registered Address: İsmet Kaptan Mah., Şair Eşref Blv. No:6 D:304/B, Konak, İzmir,
              Türkiye • Tax ID: 9240533729
            </div>
          </div>

          {/* iyzico Payment Partner Band */}
          <div className="flex flex-col items-center md:items-end gap-1.5 shrink-0">
            <img
              src="https://varsco.com/web/image/8921-bb62da9e/logo_band_white%403x.webp"
              alt="iyzico Secure Payment Gateway — Visa, Mastercard, Troy, American Express"
              className="h-7 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <div className="text-[9px] font-mono text-mint/80 flex items-center gap-1.5">
              <span>🔒 256-Bit SSL Encrypted</span>
              <span>•</span>
              <span>{t("footer.paymentInfra")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
