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
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { I18nProvider } from "@/context/I18nContext";
import { SiteShell } from "@/components/layout/SiteShell";

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

// Content path is the URL with any /<lang> prefix stripped — used to build
// self-referencing canonical + hreflang links that match how server.ts
// rewrites localized requests (see deLocalizeRequest).
function getContentPath(): string {
  if (typeof window !== "undefined") {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts.length > 0 && (ALTERNATE_LANGS as readonly string[]).includes(parts[0].toLowerCase())) {
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
    const contentPath = getContentPath();
    const pathSuffix = contentPath === "/" ? "" : contentPath;

    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VARS Aquaculture — Premium B2B Aquaculture & Seafood Portal" },
      {
        name: "description",
        content:
          "Certified salmon eggs, artemia, chlorella, feed additives and Mediterranean seafood — shipped worldwide from Türkiye.",
      },
      { name: "author", content: "VARS Aquaculture" },
      {
        name: "keywords",
        content:
          "aquaculture, live feed, artemia, chlorella, salmon eggs, seafood export, B2B, Türkiye",
      },
      { property: "og:site_name", content: "VARS Aquaculture" },
      {
        property: "og:title",
        content: "VARS Aquaculture — Premium B2B Aquaculture & Seafood Portal",
      },
      {
        property: "og:description",
        content:
          "Certified salmon eggs, artemia, chlorella, feed additives and Mediterranean seafood — shipped worldwide from Türkiye.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "tr_TR" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "VARS Aquaculture — Premium B2B Aquaculture & Seafood Portal",
      },
      {
        name: "twitter:description",
        content:
          "Certified salmon eggs, artemia, chlorella, feed additives and Mediterranean seafood — shipped worldwide from Türkiye.",
      },
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
      { rel: "canonical", href: `${SITE_URL}${pathSuffix}` },
      ...ALTERNATE_LANGS.map((l) => ({
        rel: "alternate",
        hrefLang: l,
        href: `${SITE_URL}${l === "en" ? "" : "/" + l}${pathSuffix}`,
      })),
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${pathSuffix}` },
    ],
    scripts: [
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
  return (
    <html lang="en">
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <SiteShell>
              <Outlet />
            </SiteShell>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
