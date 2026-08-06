import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { i18nBootstrapScript, serverI18nPayload } from "@/lib/i18n-dict";
import { getCurrentLocale } from "@/lib/utils/locale";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { StoreCartProvider } from "@/context/StoreCartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { I18nProvider, LANGUAGES } from "@/context/I18nContext";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { SiteShell } from "@/components/layout/SiteShell";
import { getLocalizedPageMeta } from "@/lib/utils/seo";
import type { SeoPage } from "@/lib/utils/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Return to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page couldn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. You can try again or return to the home page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VARS Aquaculture",
  alternateName: "VARS Co.",
  url: "https://varsco.com",
  logo: "https://varsco.com/favicon.ico",
  description:
    "B2B supplier of bio-enhanced live feed, hatchery inputs, salmon eggs, and Mediterranean seafood shipped worldwide from Türkiye.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "İsmet Kaptan Mah., Şair Eşref Blv. No:6 D:304/B",
    addressLocality: "Konak, İzmir",
    postalCode: "35210",
    addressCountry: "TR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+90-232-000-0000",
    contactType: "sales",
    email: "info@varsco.com",
    availableLanguage: ["English", "Turkish", "Arabic", "Russian"],
  },
};

const SITE_URL = "https://varsco.com";
const ALTERNATE_LANGS = ["en", "tr", "ar", "de", "ru", "ja", "ko", "zh", "es"] as const;
const OG_IMAGE = `${SITE_URL}/vars-logo-header.png`;

function getRootPageSeo(path: string) {
  const page = path.replace(/^\//, "").split("/")[0];
  const pageMap: Record<string, SeoPage> = {
    "services-solutions": "services",
    projects: "projects",
    "seafood-export": "seafood",
    "seafood-export-from-turkey-to-europe": "seafoodEurope",
    contactus: "contact",
    "request-quote": "quote",
    faqs: "faq",
    "salmonid-ova-solutions": "salmonOva",
    "coho-salmon-eggs": "coho",
    "artemia-cysts-incubation-guide": "artemiaGuide",
    "decapsulated-artemia-guide": "decapGuide",
    "horeca-seafood-middle-east": "horeca",
    "regional-trade-middle-east-europe": "regionalTrade",
    "aquariums-and-hobbyists": "aquariums",
    privacy: "privacy",
    terms: "terms",
    login: "login",
    register: "register",
    account: "account",
    cart: "cart",
    shop: "shop",
  };
  return pageMap[page] ? getLocalizedPageMeta(pageMap[page]) : getLocalizedPageMeta("home");
}

// Content path is the URL with any /<lang> prefix stripped — used to build
// self-referencing canonical + hreflang links that match how server.ts
// rewrites localized requests (see deLocalizeRequest).
function getContentPath(): string {
  if (typeof window !== "undefined") {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (
      parts.length > 0 &&
      (ALTERNATE_LANGS as readonly string[]).includes(parts[0].toLowerCase())
    ) {
      return "/" + parts.slice(1).join("/");
    }
    return window.location.pathname;
  }
  const storage = (globalThis as unknown as Record<string, unknown>).serverStorage as
    { getStore: () => { path?: string } | undefined } | undefined;
  return storage?.getStore()?.path ?? "/";
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const i18nPayload = serverI18nPayload();
    const contentPath = getContentPath();
    const pathSuffix = contentPath === "/" ? "" : contentPath;
    // getContentPath() strips the locale prefix, so pathSuffix alone points at
    // the ENGLISH URL. Canonical and og:url must be self-referencing: pointing
    // every localized page at the English one tells Google the translations
    // are duplicates, which makes it ignore the hreflang set on this same page
    // and drop all eight non-English locales from the index.
    const activeLang = getCurrentLocale();
    const localePrefix = activeLang === "en" ? "" : `/${activeLang}`;
    const selfUrl = `${SITE_URL}${localePrefix}${pathSuffix}`;
    const pageMeta = getRootPageSeo(contentPath);
    const isPrivate =
      /^(\/account(?:\/|$)|\/panel(?:\/|$)|\/cart$|\/login$|\/register$|\/shop\/checkout$)/.test(
        contentPath,
      );
    const localeMap: Record<string, string> = {
      en: "en_US",
      tr: "tr_TR",
      ar: "ar_SA",
      de: "de_DE",
      ru: "ru_RU",
      ja: "ja_JP",
      ko: "ko_KR",
      zh: "zh_CN",
      es: "es_ES",
    };
    const storage = (globalThis as unknown as Record<string, unknown>).serverStorage as
      { getStore: () => { lang?: string } | undefined } | undefined;
    const lang = storage?.getStore()?.lang ?? "en";

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: pageMeta.title },
        {
          name: "description",
          content: pageMeta.description,
        },
        { name: "author", content: "VARS Aquaculture" },
        {
          name: "keywords",
          content:
            "aquaculture, live feed, Artemia, Chlorella, salmon eggs, seafood export, B2B, Türkiye",
        },
        { property: "og:site_name", content: "VARS Aquaculture" },
        {
          property: "og:title",
          content: pageMeta.title,
        },
        {
          property: "og:description",
          content: pageMeta.description,
        },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: localeMap[lang] ?? "en_US" },
        ...ALTERNATE_LANGS.filter((l) => l !== lang).map((l) => ({
          property: "og:locale:alternate",
          content: localeMap[l],
        })),
        { property: "og:url", content: selfUrl },
        { property: "og:image", content: OG_IMAGE },
        { property: "og:image:alt", content: "VARS Aquaculture" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: pageMeta.title,
        },
        {
          name: "twitter:description",
          content: pageMeta.description,
        },
        { name: "twitter:image", content: OG_IMAGE },
        ...(isPrivate ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.png", type: "image/png" },
        { rel: "alternate icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
        },
        { rel: "canonical", href: selfUrl },
        ...ALTERNATE_LANGS.map((l) => ({
          rel: "alternate",
          // The URL prefix stays "zh", but hreflang needs a script subtag:
          // bare "zh" does not tell Google whether the page is Simplified or
          // Traditional. This content is Simplified.
          hrefLang: l === "zh" ? "zh-Hans" : l,
          href: `${SITE_URL}${l === "en" ? "" : "/" + l}${pathSuffix}`,
        })),
        { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${pathSuffix}` },
      ],
      scripts: [
        // Hands the active locale's dictionary to the browser. On the server
        // this reads the per-request merged dict; on the client it returns
        // undefined and emits nothing, because the SSR-rendered script has
        // already populated window during hydration. This is what lets the
        // locale JSON stay out of the client bundle entirely.
        ...(i18nPayload ? [{ children: i18nBootstrapScript(i18nPayload) }] : []),
        {
          type: "application/ld+json",
          children: JSON.stringify(organizationSchema),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const lang = getServerLang();
  return (
    <html lang={lang} dir={getServerDir(lang)}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function getServerLang() {
  const storage = (globalThis as unknown as Record<string, unknown>).serverStorage as
    { getStore: () => { lang?: string } | undefined } | undefined;
  return storage?.getStore()?.lang ?? "en";
}

/**
 * Text direction for the server-rendered <html>.
 *
 * I18nContext sets documentElement.dir in an effect, which only runs after
 * hydration — so Arabic pages were served as LTR and flipped once JS landed.
 * Crawlers and no-JS clients never saw RTL at all. Emitting it here means the
 * very first painted frame is already correct; the effect then agrees with it.
 *
 * Read from LANGUAGES rather than a second list, so a new RTL locale (Persian
 * is planned) is right by construction.
 */
function getServerDir(lang: string): "ltr" | "rtl" {
  return LANGUAGES.find((l) => l.code === lang)?.dir ?? "ltr";
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <StoreCartProvider>
              <WishlistProvider>
                <SiteShell>
                  <Outlet />
                </SiteShell>
                <ConsentBanner />
              </WishlistProvider>
            </StoreCartProvider>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
