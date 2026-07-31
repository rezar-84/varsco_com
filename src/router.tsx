import { QueryClient } from "@tanstack/react-query";
import { createRouter, createBrowserHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Helper to strip language prefix from pathname
function deLocalizePath(pathname: string): { path: string; lang?: string } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0) {
    const firstPart = parts[0].toLowerCase();
    const validLangs = ["tr", "ar", "de", "ru", "ja", "ko", "en", "zh", "es"];
    if (validLangs.includes(firstPart)) {
      return {
        path: "/" + parts.slice(1).join("/"),
        lang: firstPart,
      };
    }
  }
  return { path: pathname };
}

// Helper to detect current language from URL
function getCurrentLangFromUrl(): string {
  if (typeof window === "undefined") return "en";
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0) {
    const firstPart = parts[0].toLowerCase();
    const validLangs = ["tr", "ar", "de", "ru", "ja", "ko", "en", "zh", "es"];
    if (validLangs.includes(firstPart)) {
      return firstPart;
    }
  }
  try {
    const stored = localStorage.getItem("vars.lang");
    if (stored) return stored;
  } catch (err) {
    // ignore localStorage errors in non-browser env or security settings
  }
  return "en";
}

// Parse pathname/search/hash
function parsePath(path: string) {
  const [pathnameAndSearch, hash = ""] = path.split("#");
  const [pathname, search = ""] = pathnameAndSearch.split("?");
  return {
    pathname,
    search: search ? `?${search}` : "",
    hash: hash ? `#${hash}` : "",
  };
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const isClient = typeof window !== "undefined";

  const customHistory = isClient
    ? createBrowserHistory({
        parseLocation: () => {
          const fullPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
          const raw = parsePath(fullPath);
          const deLocalized = deLocalizePath(raw.pathname);
          return {
            pathname: deLocalized.path,
            search: raw.search,
            hash: raw.hash,
            href: `${deLocalized.path}${raw.search}${raw.hash}`,
            state: window.history.state || { __TSR_index: 0 },
          };
        },
        createHref: (path: string) => {
          if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("//")) {
            return path;
          }
          const cleanPath = path.startsWith("/") ? path : `/${path}`;
          const deLocalized = deLocalizePath(cleanPath);
          if (deLocalized.lang) {
            return cleanPath;
          }
          const lang = getCurrentLangFromUrl();
          const prefix = lang === "en" ? "" : `/${lang}`;
          return `${prefix}${cleanPath}`;
        },
      })
    : undefined;

  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: customHistory,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
