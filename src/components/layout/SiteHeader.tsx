import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useStoreCart } from "@/context/StoreCartContext";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { CATEGORIES, PRODUCTS } from "@/lib/mock/products";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { VarsLogo } from "@/components/layout/VarsLogo";
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Languages,
  BrainCircuit,
  Phone,
  Mail,
  User as UserIcon,
  MessageCircle,
  Building2,
  FileText,
  LogOut,
  Check,
  Compass,
  BookOpen,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SOLUTION_MODES } from "@/lib/solution-modes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BLOG_CATEGORIES = [
  { label: "Aquaculture 101", slug: "aquaculture-10" },
  { label: "Feed Innovation & Microalgae", slug: "feed-innovation-sustainability-8" },
  { label: "Hatchery Feed Design", slug: "hatchery-feed-design-6" },
  { label: "Company News", slug: "vars-company-1" },
  { label: "Projects", slug: "projects-4" },
];

export function SiteHeader() {
  const { count, openDrawer, bumping } = useStoreCart();
  const { user, logout } = useAuth();
  const { lang, setLang, t, languages } = useI18n();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [solutionsMegaOpen, setSolutionsMegaOpen] = useState(false);
  const [resourcesMegaOpen, setResourcesMegaOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(CATEGORIES[0].slug);
  const [scrolled, setScrolled] = useState(false);

  // Lock background scroll and signal other fixed-position widgets (floating
  // quote bar, WhatsApp button) to hide while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", mobileOpen);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.classList.remove("mobile-nav-open");
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const scheduleOpen = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (megaOpen) return;
    if (openTimer.current) return;
    openTimer.current = window.setTimeout(() => {
      setMegaOpen(true);
      setSolutionsMegaOpen(false);
      setResourcesMegaOpen(false);
      openTimer.current = null;
    }, 90);
  };

  const scheduleClose = () => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) return;
    closeTimer.current = window.setTimeout(() => {
      setMegaOpen(false);
      closeTimer.current = null;
    }, 180);
  };

  const closeNow = () => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMegaOpen(false);
    setSolutionsMegaOpen(false);
    setResourcesMegaOpen(false);
  };

  // Solutions Mega Menu Hover Handlers
  const solutionsOpenTimer = useRef<number | null>(null);
  const solutionsCloseTimer = useRef<number | null>(null);

  const scheduleSolutionsOpen = () => {
    if (solutionsCloseTimer.current) {
      window.clearTimeout(solutionsCloseTimer.current);
      solutionsCloseTimer.current = null;
    }
    if (solutionsMegaOpen) return;
    if (solutionsOpenTimer.current) return;
    solutionsOpenTimer.current = window.setTimeout(() => {
      setSolutionsMegaOpen(true);
      setMegaOpen(false);
      setResourcesMegaOpen(false);
      solutionsOpenTimer.current = null;
    }, 90);
  };

  const scheduleSolutionsClose = () => {
    if (solutionsOpenTimer.current) {
      window.clearTimeout(solutionsOpenTimer.current);
      solutionsOpenTimer.current = null;
    }
    if (solutionsCloseTimer.current) return;
    solutionsCloseTimer.current = window.setTimeout(() => {
      setSolutionsMegaOpen(false);
      solutionsCloseTimer.current = null;
    }, 180);
  };

  // Resources Mega Menu Hover Handlers
  const resourcesOpenTimer = useRef<number | null>(null);
  const resourcesCloseTimer = useRef<number | null>(null);

  const scheduleResourcesOpen = () => {
    if (resourcesCloseTimer.current) {
      window.clearTimeout(resourcesCloseTimer.current);
      resourcesCloseTimer.current = null;
    }
    if (resourcesMegaOpen) return;
    if (resourcesOpenTimer.current) return;
    resourcesOpenTimer.current = window.setTimeout(() => {
      setResourcesMegaOpen(true);
      setMegaOpen(false);
      setSolutionsMegaOpen(false);
      resourcesOpenTimer.current = null;
    }, 90);
  };

  const scheduleResourcesClose = () => {
    if (resourcesOpenTimer.current) {
      window.clearTimeout(resourcesOpenTimer.current);
      resourcesOpenTimer.current = null;
    }
    if (resourcesCloseTimer.current) return;
    resourcesCloseTimer.current = window.setTimeout(() => {
      setResourcesMegaOpen(false);
      resourcesCloseTimer.current = null;
    }, 180);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled((prev) => {
          const y = window.scrollY;
          if (!prev && y > 32) return true;
          if (prev && y < 16) return false;
          return prev;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const NAV: {
    to: string;
    label: string;
    hasMega?: boolean;
    hasSolutionsMega?: boolean;
    hasResourcesMega?: boolean;
  }[] = [
    { to: "/products", label: t("nav.products"), hasMega: true },
    { to: "/shop", label: t("nav.store") },
    { to: "/services-solutions", label: t("nav.solutions"), hasSolutionsMega: true },
    { to: "/projects", label: t("nav.projects") },
    { to: "/blog", label: t("nav.resources"), hasResourcesMega: true },
  ];

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Top Notice Bar */}
      <div className="hidden bg-navy py-1.5 text-xs text-white/80 lg:block border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-mint font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("notice.b2b")}
            </span>
            <span className="hidden xl:inline-flex items-center gap-1.5 text-white/60">
              <Globe2 className="h-3.5 w-3.5" />
              {t("notice.global")}
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <span className="hidden xl:inline-flex items-center gap-1.5 text-white/60">
              {t("footer.tagline")}
            </span>
            <span className="hidden xl:inline-flex items-center gap-1.5 text-white/60">
              <Phone className="h-3 w-3" /> +90 232 290 57 56
            </span>
            <span className="hidden xl:inline-flex items-center gap-1.5 text-white/60">
              <Mail className="h-3 w-3" /> info@varsco.com
            </span>

            {/* Language Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded bg-white/10 px-2 py-0.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
                <Languages className="h-3 w-3" aria-hidden="true" />
                <span>{lang.toUpperCase()}</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 p-1 bg-navy text-white border-white/20 shadow-xl"
              >
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l.code as any)}
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10 cursor-pointer rounded"
                  >
                    <span className="flex items-center gap-2" lang={l.code} dir={l.dir}>
                      <span className="w-6 shrink-0 text-white/50 tabular-nums">{l.label}</span>
                      <span>{l.nativeName}</span>
                    </span>
                    {lang === l.code && <Check className="h-3.5 w-3.5 text-mint" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "relative border-b border-border/60 bg-background/85 backdrop-blur-xl transition-[height,box-shadow,background-color] duration-300 ease-out will-change-[height]",
          scrolled ? "h-16 shadow-[0_4px_25px_-8px_rgba(0,30,64,0.15)]" : "h-16 lg:h-20",
        )}
        onMouseLeave={() => {
          scheduleClose();
          scheduleSolutionsClose();
          scheduleResourcesClose();
        }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Mobile menu trigger */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy active:bg-muted lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("menu.label")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center py-1 transition-transform hover:scale-[1.02]"
            aria-label="VARS Aquaculture"
          >
            <VarsLogo variant="header" className="hidden lg:flex" />
            <VarsLogo variant="sq" className="flex lg:hidden" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              item.hasMega ? (
                <div key={item.to} onMouseEnter={scheduleOpen} onMouseLeave={scheduleClose}>
                  <Link
                    to="/products"
                    aria-haspopup="true"
                    aria-expanded={megaOpen}
                    onFocus={scheduleOpen}
                    onClick={closeNow}
                    className={cn(
                      "relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200",
                      megaOpen
                        ? "bg-muted text-navy"
                        : "text-navy/80 hover:bg-muted/70 hover:text-navy",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        megaOpen && "rotate-180 text-primary",
                      )}
                    />
                  </Link>
                </div>
              ) : item.hasSolutionsMega ? (
                <div
                  key={item.to}
                  onMouseEnter={scheduleSolutionsOpen}
                  onMouseLeave={scheduleSolutionsClose}
                >
                  <Link
                    to="/services-solutions"
                    aria-haspopup="true"
                    aria-expanded={solutionsMegaOpen}
                    onFocus={scheduleSolutionsOpen}
                    onClick={closeNow}
                    className={cn(
                      "relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200",
                      solutionsMegaOpen
                        ? "bg-muted text-navy"
                        : "text-navy/80 hover:bg-muted/70 hover:text-navy",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        solutionsMegaOpen && "rotate-180 text-primary",
                      )}
                    />
                  </Link>
                </div>
              ) : item.hasResourcesMega ? (
                <div
                  key={item.to}
                  onMouseEnter={scheduleResourcesOpen}
                  onMouseLeave={scheduleResourcesClose}
                >
                  <Link
                    to="/blog"
                    aria-haspopup="true"
                    aria-expanded={resourcesMegaOpen}
                    onFocus={scheduleResourcesOpen}
                    onClick={closeNow}
                    className={cn(
                      "relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200",
                      resourcesMegaOpen
                        ? "bg-muted text-navy"
                        : "text-navy/80 hover:bg-muted/70 hover:text-navy",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        resourcesMegaOpen && "rotate-180 text-primary",
                      )}
                    />
                  </Link>
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to as "/services-solutions"}
                  className="rounded-lg px-3.5 py-2 text-sm font-semibold text-navy/80 transition-colors hover:bg-muted hover:text-navy"
                  activeProps={{ className: "text-navy bg-muted" }}
                >
                  {item.label}
                </Link>
              ),
            )}

            {/* Company Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold text-navy/80 transition-colors hover:bg-muted hover:text-navy outline-none">
                <span>{t("nav.company")}</span>
                <ChevronDown className="h-3.5 w-3.5 text-navy/60 transition-transform duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-2.5 shadow-2xl border border-border/80 rounded-2xl bg-background/95 backdrop-blur-2xl z-50 space-y-1"
              >
                <DropdownMenuLabel className="px-3 py-1.5 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                  {t("nav.corporateHub")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  asChild
                  className="rounded-xl cursor-pointer p-2.5 hover:bg-surface-alt"
                >
                  <Link to="/about-us" className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-navy">{t("nav.aboutUs")}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {t("nav.aboutUs.desc")}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="rounded-xl cursor-pointer p-2.5 hover:bg-surface-alt"
                >
                  <Link to="/contactus" className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-navy">{t("nav.contactUs")}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {t("nav.contactUs.desc")}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="rounded-xl cursor-pointer p-2.5 hover:bg-surface-alt"
                >
                  <Link to="/about-us" hash="events" className="flex items-start gap-3">
                    <Globe2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-navy">{t("nav.events")}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {t("nav.events.desc")}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="rounded-xl cursor-pointer p-2.5 hover:bg-surface-alt"
                >
                  <Link to="/about-us" hash="values-vision" className="flex items-start gap-3">
                    <BrainCircuit className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-navy">{t("nav.values")}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {t("nav.values.desc")}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Header Search Input */}
          <div className="hidden max-w-xs flex-1 lg:block">
            <HeaderSearch />
          </div>

          {/* Action Buttons (Quote, Cart, Account) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="sm"
              asChild
              className="hidden bg-primary font-bold text-primary-foreground shadow-sm hover:bg-primary/90 md:inline-flex rounded-lg px-4"
            >
              <Link to="/request-quote">
                <MessageCircle className="me-1.5 h-4 w-4" />
                {t("nav.quote")}
              </Link>
            </Button>

            {/* Cart Button */}
            <button
              onClick={openDrawer}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy/80 transition hover:bg-muted"
              aria-label={t("cart.open")}
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span
                  className={cn(
                    "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm",
                    bumping && "cart-bump",
                  )}
                >
                  {count}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="ms-1 rounded-full outline-none ring-2 ring-transparent transition hover:ring-primary/40">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-navy font-bold text-xs text-white">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 shadow-xl border-border/80">
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <div className="text-sm font-bold text-navy">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.company}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                    <Link to="/account" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      {t("nav.myPanel")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                    <Link to="/cart" className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      {t("nav.myCart")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                    <Link to="/account/profile" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {t("nav.profileSettings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-md cursor-pointer text-destructive focus:text-destructive flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="ms-1 hidden h-10 w-10 items-center justify-center rounded-lg text-navy/80 outline-none transition hover:bg-muted data-[state=open]:bg-muted lg:inline-flex"
                  aria-label={t("nav.login")}
                >
                  <UserIcon className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-1.5 shadow-xl border-border/80">
                  <DropdownMenuItem asChild className="rounded-md font-medium">
                    <Link to="/login">{t("nav.login")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md font-medium">
                    <Link to="/register">{t("nav.register")}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* PRODUCTS MEGA MENU OVERLAY */}
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-50 hidden lg:block",
            "transition-all duration-300 ease-out",
            megaOpen
              ? "visible pointer-events-auto translate-y-0 opacity-100"
              : "invisible pointer-events-none -translate-y-2 opacity-0",
          )}
          aria-hidden={!megaOpen}
          role="menu"
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
        >
          <div className="relative mx-auto max-w-6xl px-4 md:px-6">
            <div className="overflow-hidden rounded-b-2xl border border-t-0 border-border/80 bg-background/98 shadow-[0_30px_90px_-20px_rgba(0,30,64,0.35)] backdrop-blur-2xl ring-1 ring-navy/[0.04]">
              <div className="grid grid-cols-[260px_1fr]">
                <ul className="border-r border-border/60 bg-surface-alt/60 p-3.5 space-y-1">
                  {CATEGORIES.map((cat) => {
                    const isActive = (activeCat ?? CATEGORIES[0].slug) === cat.slug;
                    return (
                      <li key={cat.slug}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveCat(cat.slug)}
                          onFocus={() => setActiveCat(cat.slug)}
                          className={cn(
                            "group flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-3 text-start text-sm font-semibold transition-all",
                            isActive
                              ? "bg-background text-navy shadow-sm ring-1 ring-border/80"
                              : "text-navy/70 hover:bg-background/80 hover:text-navy",
                          )}
                        >
                          <span className="truncate">{t(`cat.${cat.slug}`)}</span>
                          <ArrowRight
                            className={cn(
                              "h-4 w-4 shrink-0 transition-all",
                              isActive
                                ? "text-primary translate-x-0 opacity-100"
                                : "-translate-x-1 opacity-0 group-hover:opacity-60",
                            )}
                          />
                        </button>
                      </li>
                    );
                  })}
                  <li className="pt-2 border-t border-border/60">
                    <Link
                      to="/products"
                      onClick={closeNow}
                      className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-3 text-sm font-bold text-primary hover:bg-background/80"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-primary" /> {t("nav.allCatalog")}
                      </span>
                    </Link>
                  </li>
                </ul>

                {megaOpen &&
                  (() => {
                    const activeSlug = activeCat ?? CATEGORIES[0].slug;
                    const cat = CATEGORIES.find((c) => c.slug === activeSlug) ?? CATEGORIES[0];
                    const products = PRODUCTS.filter((p) => p.category === cat.slug).slice(0, 6);
                    return (
                      <div key={cat.slug} className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-primary">
                              {t("nav.products")}
                            </p>
                            <h3 className="mt-1 font-display text-2xl font-bold text-navy">
                              {t(`cat.${cat.slug}`)}
                            </h3>
                            <p className="mt-1 line-clamp-2 max-w-lg text-xs leading-relaxed text-muted-foreground">
                              {t(`cat.${cat.slug}.desc`) === `cat.${cat.slug}.desc`
                                ? cat.description
                                : t(`cat.${cat.slug}.desc`)}
                            </p>
                          </div>
                          <Link
                            to="/products/$category"
                            params={{ category: cat.slug }}
                            onClick={closeNow}
                            className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-border/80 bg-background px-3.5 py-2 text-xs font-bold text-navy transition-all hover:border-primary/50 hover:text-primary hover:shadow-sm"
                          >
                            {t("export.products.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                          {products.map((p) => (
                            <Link
                              key={p.slug}
                              to="/products/$category/$slug"
                              params={{ category: cat.slug, slug: p.slug }}
                              onClick={closeNow}
                              className="group flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-all hover:border-border/80 hover:bg-surface-alt/70 hover:shadow-sm"
                            >
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-alt ring-1 ring-border/50">
                                {p.thumbnail || p.image ? (
                                  <img
                                    src={p.thumbnail ?? p.image}
                                    alt=""
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                  />
                                ) : null}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-xs font-bold text-navy group-hover:text-primary">
                                  {t(`product.${p.slug}.title`) === `product.${p.slug}.title`
                                    ? p.title
                                    : t(`product.${p.slug}.title`)}
                                </div>
                                {p.latinName ? (
                                  <div className="truncate text-[11px] italic text-muted-foreground">
                                    {p.latinName}
                                  </div>
                                ) : null}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>
        </div>

        {/* SOLUTIONS & ADVISORY MEGA MENU OVERLAY */}
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-50 hidden lg:block",
            "transition-all duration-300 ease-out",
            solutionsMegaOpen
              ? "visible pointer-events-auto translate-y-0 opacity-100"
              : "invisible pointer-events-none -translate-y-2 opacity-0",
          )}
          aria-hidden={!solutionsMegaOpen}
          role="menu"
          onMouseEnter={scheduleSolutionsOpen}
          onMouseLeave={scheduleSolutionsClose}
        >
          <div className="relative mx-auto max-w-6xl px-4 md:px-6">
            <div className="overflow-hidden rounded-b-3xl border border-t-0 border-navy/20 bg-background/98 p-7 shadow-[0_35px_100px_-15px_rgba(0,30,64,0.4)] backdrop-blur-2xl ring-1 ring-navy/[0.05]">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-teal via-mint to-primary" />

              <div className="grid grid-cols-2 gap-8">
                {/* Column 1: the four engagement modes, mirroring the section
                    order on /services-solutions and deep-linking to each. */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/80">
                    <div className="p-1.5 rounded-lg bg-teal/10 text-teal shrink-0">
                      <Compass className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-xs font-bold uppercase tracking-wider text-navy">
                        {t("nav.expertAdvisory")}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {t("nav.expertAdvisory.experience")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {SOLUTION_MODES.map((mode) => (
                      <Link
                        key={mode.key}
                        to="/services-solutions"
                        hash={`mode-${mode.key}`}
                        onClick={closeNow}
                        className="group block rounded-xl p-3 transition-all hover:bg-surface-alt/90 border-l-2 border-transparent hover:border-mint"
                      >
                        <div className="font-bold text-navy group-hover:text-primary flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-2">
                            <mode.icon className="h-3.5 w-3.5 text-teal shrink-0" />
                            {t(`solutions.mode.${mode.key}.title`)}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                        </div>
                        <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                          {t(`solutions.mode.${mode.key}.navDesc`)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 2: Seafood Export & Trade Corridors Sub-Menu */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/80">
                    <div className="p-1.5 rounded-lg bg-mint/15 text-navy font-bold shrink-0">
                      <Globe2 className="h-4 w-4 text-mint-ink" />
                    </div>
                    <div>
                      <h3 className="font-display text-xs font-bold uppercase tracking-wider text-navy">
                        {t("nav.seafoodHub")}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {t("nav.seafoodHub.desc")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <Link
                      to="/seafood-export"
                      onClick={closeNow}
                      className="group block rounded-xl p-3 bg-surface-alt/80 border border-primary/20 transition-all hover:bg-navy hover:text-white"
                    >
                      <div className="font-extrabold text-primary group-hover:text-mint flex items-center justify-between">
                        <span>{t("nav.seafoodPortal")}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-mint" />
                      </div>
                      <p className="text-muted-foreground group-hover:text-white/80 text-[11px] mt-1 leading-relaxed">
                        {t("nav.seafoodPortal.desc")}
                      </p>
                    </Link>

                    <Link
                      to="/horeca-seafood-middle-east"
                      onClick={closeNow}
                      className="group block rounded-xl p-3 transition-all hover:bg-surface-alt/90 border-l-2 border-transparent hover:border-mint"
                    >
                      <div className="font-bold text-navy group-hover:text-primary flex items-center justify-between">
                        <span>{t("nav.horecaSupply")}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                        {t("nav.horecaSupply.desc")}
                      </p>
                    </Link>

                    <Link
                      to="/salmonid-ova-solutions"
                      onClick={closeNow}
                      className="group block rounded-xl p-3 transition-all hover:bg-surface-alt/90 border-l-2 border-transparent hover:border-mint"
                    >
                      <div className="font-bold text-navy group-hover:text-primary flex items-center justify-between">
                        <span>{t("nav.salmonidOva")}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                        {t("nav.salmonidOva.desc")}
                      </p>
                    </Link>

                    <Link
                      to="/olive-flounder-export"
                      onClick={closeNow}
                      className="group block rounded-xl p-3 transition-all hover:bg-surface-alt/90 border-l-2 border-transparent hover:border-mint"
                    >
                      <div className="font-bold text-navy group-hover:text-primary flex items-center justify-between">
                        <span>{t("nav.oliveFlounder")}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                        {t("nav.oliveFlounder.desc")}
                      </p>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Consultation Banner */}
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between bg-surface-alt/60 rounded-2xl p-3.5">
                <div className="flex items-center gap-2.5 text-xs font-bold text-navy">
                  <BrainCircuit className="h-4 w-4 text-mint-ink shrink-0" />
                  <span>{t("nav.planningConsult")}</span>
                </div>
                <Link
                  to="/request-quote"
                  onClick={closeNow}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-navy transition-colors bg-white px-3 py-1.5 rounded-xl border border-border/80 shadow-sm"
                >
                  <span>{t("nav.bookAdvisor")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* RESOURCES MEGA MENU OVERLAY */}
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-50 hidden lg:block",
            "transition-all duration-300 ease-out",
            resourcesMegaOpen
              ? "visible pointer-events-auto translate-y-0 opacity-100"
              : "invisible pointer-events-none -translate-y-2 opacity-0",
          )}
          aria-hidden={!resourcesMegaOpen}
          role="menu"
          onMouseEnter={scheduleResourcesOpen}
          onMouseLeave={scheduleResourcesClose}
        >
          <div className="relative mx-auto max-w-6xl px-4 md:px-6">
            <div className="overflow-hidden rounded-b-3xl border border-t-0 border-navy/20 bg-background/98 p-7 shadow-[0_35px_100px_-15px_rgba(0,30,64,0.4)] backdrop-blur-2xl ring-1 ring-navy/[0.05]">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-teal via-mint to-primary" />

              <div className="grid grid-cols-2 gap-8">
                {/* Column 1: Educational Science Guides & Segments */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/80">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-xs font-bold uppercase tracking-wider text-navy">
                        {t("nav.scienceGuides")}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {t("nav.scienceGuides.desc")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <Link
                      to="/decapsulated-artemia-guide"
                      onClick={closeNow}
                      className="group block rounded-xl p-3 transition-all hover:bg-surface-alt/90 border-l-2 border-transparent hover:border-primary"
                    >
                      <div className="font-bold text-navy group-hover:text-primary flex items-center justify-between">
                        <span>{t("nav.artemiaScience")}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                        {t("nav.artemiaScience.desc")}
                      </p>
                    </Link>

                    <Link
                      to="/artemia-cysts-incubation-guide"
                      onClick={closeNow}
                      className="group block rounded-xl p-3 transition-all hover:bg-surface-alt/90 border-l-2 border-transparent hover:border-primary"
                    >
                      <div className="font-bold text-navy group-hover:text-primary flex items-center justify-between">
                        <span>{t("nav.artemiaIncubation")}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                        {t("nav.artemiaIncubation.desc")}
                      </p>
                    </Link>

                    <Link
                      to="/glossary"
                      onClick={closeNow}
                      className="group block rounded-xl p-3 transition-all hover:bg-surface-alt/90 border-l-2 border-transparent hover:border-primary"
                    >
                      <div className="font-bold text-navy group-hover:text-primary flex items-center justify-between">
                        <span>{t("nav.glossary")}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                        {t("nav.glossary.desc")}
                      </p>
                    </Link>

                    <Link
                      to="/aquariums-and-hobbyists"
                      onClick={closeNow}
                      className="group block rounded-xl p-3 transition-all hover:bg-surface-alt/90 border-l-2 border-transparent hover:border-primary"
                    >
                      <div className="font-bold text-primary flex items-center justify-between">
                        <span>{t("nav.aquariumsHobby")}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                        {t("nav.aquariumsHobby.desc")}
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 2: Aqua MAG Magazine */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/80">
                    <div className="p-1.5 rounded-lg bg-mint/15 text-navy font-bold shrink-0">
                      <Newspaper className="h-4 w-4 text-mint-ink" />
                    </div>
                    <div>
                      <h3 className="font-display text-xs font-bold uppercase tracking-wider text-navy">
                        {t("nav.blog")}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {t("nav.magazine.desc")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <Link
                      to="/blog"
                      onClick={closeNow}
                      className="group block rounded-xl p-3 bg-surface-alt/80 border border-primary/20 transition-all hover:bg-navy hover:text-white"
                    >
                      <div className="font-extrabold text-primary group-hover:text-mint flex items-center justify-between">
                        <span>{t("nav.magazineCta")}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-mint" />
                      </div>
                      <p className="text-muted-foreground group-hover:text-white/80 text-[11px] mt-1 leading-relaxed">
                        {t("nav.magazineCta.desc")}
                      </p>
                    </Link>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {BLOG_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          to="/blog/$category"
                          params={{ category: cat.slug }}
                          onClick={closeNow}
                          className="rounded-lg px-2.5 py-2 font-bold text-navy/80 hover:bg-surface-alt/90 hover:text-primary transition-colors truncate"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (full-screen) */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 border-b border-border/80 bg-background/98 p-4 backdrop-blur-2xl lg:hidden h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl">
          <div className="space-y-4">
            <div className="pb-2 border-b border-border/60">
              <HeaderSearch />
            </div>

            {/* Language Selector */}
            <div className="pb-3 border-b border-border/60">
              <div className="px-1 pb-2 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                {t("nav.language")}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code as any)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition-colors",
                      lang === l.code
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-alt text-navy hover:bg-muted",
                    )}
                  >
                    <span lang={l.code} dir={l.dir}>
                      {l.nativeName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <nav className="space-y-2">
              {/* Products — mirrors the desktop Products mega menu */}
              <button
                type="button"
                onClick={() => setMobileProductsOpen((v) => !v)}
                aria-expanded={mobileProductsOpen}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-navy hover:bg-surface-alt"
              >
                <span>{t("nav.products")}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    mobileProductsOpen && "rotate-180 text-primary",
                  )}
                />
              </button>

              {mobileProductsOpen && (
                <div className="pl-4 space-y-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      to="/products/$category"
                      params={{ category: cat.slug }}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                    >
                      {t(`cat.${cat.slug}`)}
                    </Link>
                  ))}
                  <Link
                    to="/products"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-primary hover:bg-surface-alt"
                  >
                    {t("nav.allCatalog")}
                  </Link>
                </div>
              )}

              <Link
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-navy hover:bg-surface-alt"
              >
                {t("nav.store")}
              </Link>

              {/* Services & Solutions — mirrors the desktop Solutions mega menu */}
              <button
                type="button"
                onClick={() => setMobileSolutionsOpen((v) => !v)}
                aria-expanded={mobileSolutionsOpen}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-navy hover:bg-surface-alt"
              >
                <span>{t("nav.solutions")}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    mobileSolutionsOpen && "rotate-180 text-primary",
                  )}
                />
              </button>

              {mobileSolutionsOpen && (
                <div className="pl-4 space-y-1">
                  {SOLUTION_MODES.map((mode) => (
                    <Link
                      key={mode.key}
                      to="/services-solutions"
                      hash={`mode-${mode.key}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                    >
                      <mode.icon className="h-3.5 w-3.5 text-teal shrink-0" />
                      {t(`solutions.mode.${mode.key}.title`)}
                    </Link>
                  ))}
                  <Link
                    to="/seafood-export"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    {t("nav.seafoodPortal")}
                  </Link>
                  <Link
                    to="/horeca-seafood-middle-east"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    {t("nav.horecaSupply")}
                  </Link>
                  <Link
                    to="/regional-trade-middle-east-europe"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    {t("nav.tradeCorridor")}
                  </Link>
                  <Link
                    to="/salmonid-ova-solutions"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    {t("nav.salmonidOva")}
                  </Link>
                  <Link
                    to="/olive-flounder-export"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    {t("nav.oliveFlounder")}
                  </Link>
                </div>
              )}

              <Link
                to="/seafood-export"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-navy hover:bg-surface-alt"
              >
                {t("nav.export")}
              </Link>

              <Link
                to="/projects"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-navy hover:bg-surface-alt"
              >
                {t("nav.projects")}
              </Link>

              {/* Resources — mirrors the desktop Resources mega menu */}
              <button
                type="button"
                onClick={() => setMobileResourcesOpen((v) => !v)}
                aria-expanded={mobileResourcesOpen}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-navy hover:bg-surface-alt"
              >
                <span>{t("nav.resources")}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    mobileResourcesOpen && "rotate-180 text-primary",
                  )}
                />
              </button>

              {mobileResourcesOpen && (
                <div className="pl-4 space-y-1">
                  <Link
                    to="/decapsulated-artemia-guide"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    {t("nav.decapGuide")}
                  </Link>
                  <Link
                    to="/artemia-cysts-incubation-guide"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    {t("nav.artemiaIncubation")}
                  </Link>
                  <Link
                    to="/glossary"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    {t("nav.glossary")}
                  </Link>
                  <Link
                    to="/aquariums-and-hobbyists"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-primary hover:bg-surface-alt"
                  >
                    {t("nav.aquariumsHobbyShort")}
                  </Link>
                  <Link
                    to="/blog"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    {t("nav.blog")}
                  </Link>
                </div>
              )}

              <div className="pt-2 border-t border-border/60">
                <div className="px-4 py-2 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                  {t("nav.company")}
                </div>
                <div className="space-y-1">
                  <Link
                    to="/about-us"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{t("nav.aboutUs")}</span>
                  </Link>

                  <Link
                    to="/contactus"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{t("nav.contactUs")}</span>
                  </Link>

                  <Link
                    to="/about-us"
                    hash="events"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    <Globe2 className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>{t("nav.events")}</span>
                  </Link>

                  <Link
                    to="/about-us"
                    hash="values-vision"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold text-navy hover:bg-surface-alt"
                  >
                    <BrainCircuit className="h-4 w-4 text-sky-500 shrink-0" />
                    <span>{t("nav.values")}</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
