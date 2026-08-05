import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LangCode } from "@/lib/types";
import { useLocation } from "@tanstack/react-router";
import { activeDict } from "@/lib/i18n-dict";

export interface LanguageInfo {
  code: LangCode;
  label: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

/**
 * No flag field: the switcher used emoji flags, and emoji are not part of this
 * site's icon system (lucide throughout). Country flags are also the wrong
 * signifier for a language — the UK flag excluded every other English market,
 * and the Saudi flag stood in for Arabic across Egypt, Morocco and the Gulf
 * alike.
 *
 * The switcher now renders the ISO code plus `nativeName`, which is what a
 * speaker actually recognises. If flags are ever wanted back they must be SVG
 * assets rather than emoji — that path is also the one Persian needs, since
 * Unicode has no Lion and Sun code point (see doc/persian_locale_plan.md).
 */
export const LANGUAGES: LanguageInfo[] = [
  { code: "en", label: "EN", nativeName: "English", dir: "ltr" },
  { code: "tr", label: "TR", nativeName: "Türkçe", dir: "ltr" },
  { code: "ar", label: "AR", nativeName: "العربية", dir: "rtl" },
  { code: "de", label: "DE", nativeName: "Deutsch", dir: "ltr" },
  { code: "ru", label: "RU", nativeName: "Русский", dir: "ltr" },
  { code: "ja", label: "JA", nativeName: "日本語", dir: "ltr" },
  { code: "ko", label: "KO", nativeName: "한국어", dir: "ltr" },
  { code: "zh", label: "ZH", nativeName: "简体中文", dir: "ltr" },
  { code: "es", label: "ES", nativeName: "Español", dir: "ltr" },
];

/**
 * Locale codes only. The dictionaries themselves are no longer imported here:
 * doing so pulled all nine (~1.3 MB) into the shared client chunk. The active
 * one is resolved per request on the server and inlined into the HTML — see
 * src/lib/i18n-dict.ts.
 */
const DICTS: Record<LangCode, true> = {
  en: true,
  tr: true,
  ar: true,
  ru: true,
  de: true,
  ja: true,
  ko: true,
  zh: true,
  es: true,
};

interface I18nContextValue {
  lang: LangCode;
  dir: "ltr" | "rtl";
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
  languages: LanguageInfo[];
  currentLanguage: LanguageInfo;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "vars.lang";

export function detectLangFromUrl(
  pathname: string,
  search: string | Record<string, any>,
): LangCode {
  let qLang: LangCode | null = null;
  if (typeof search === "string") {
    const params = new URLSearchParams(search);
    qLang = params.get("lang") as LangCode | null;
  } else if (search && typeof search === "object") {
    qLang = search.lang as LangCode | null;
  }

  if (qLang && DICTS[qLang]) return qLang;

  const pathParts = pathname.split("/").filter(Boolean);
  if (pathParts.length > 0) {
    const maybeLang = pathParts[0].toLowerCase() as LangCode;
    if (DICTS[maybeLang]) return maybeLang;
  }
  return "en";
}

export function detectLangFromLocation(): LangCode {
  if (typeof window === "undefined") return "en";

  // 1. URL check
  const urlLang = detectLangFromUrl(window.location.pathname, window.location.search);
  if (urlLang !== "en") return urlLang;

  // 2. LocalStorage check
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && DICTS[stored]) return stored;
  } catch (err) {
    // ignore
  }

  // 3. Browser preference
  const navLang = navigator.language.slice(0, 2).toLowerCase() as LangCode;
  if (DICTS[navLang]) return navLang;

  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  // Initialize state based strictly on the URL (and server storage on SSR) to match server-side render exactly!
  const [lang, setLangState] = useState<LangCode>(() => {
    if (typeof window === "undefined") {
      const storage = (globalThis as unknown as Record<string, unknown>).serverStorage as
        { getStore: () => { lang?: string } | undefined } | undefined;
      const store = storage?.getStore();
      if (store?.lang) return store.lang as LangCode;
      return "en";
    }
    return detectLangFromUrl(window.location.pathname, window.location.search);
  });

  // Keep state in sync with route location changes reactively (e.g. when clicking regular links)
  useEffect(() => {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : location.pathname;
    const currentSearch = typeof window !== "undefined" ? window.location.search : location.search;
    const urlLang = detectLangFromUrl(currentPath, currentSearch);
    if (urlLang !== lang) {
      setLangState(urlLang);
    }
  }, [location.pathname, location.search, lang]);

  useEffect(() => {
    const currentInfo = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
    const dir = currentInfo.dir;

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  // No post-hydration locale redirect.
  //
  // This used to read localStorage and navigator.language on mount and bounce
  // the user to another locale. Two problems: redirecting on browser language
  // alone is contrary to Google's guidance and left an English speaker with a
  // non-English browser unable to reach the English pages; and since the
  // dictionary now arrives with the document, the bounce cost a second full
  // page load. Locale preference is resolved server-side from the vars.lang
  // cookie instead — see src/server.ts.

  const setLang = (l: LangCode) => {
    if (!DICTS[l]) return;
    setLangState(l);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, l);
        // Also a cookie: the server reads this to serve the preferred locale
        // on the first request, which avoids the post-hydration redirect and
        // the extra full page load it caused.
        document.cookie = `${STORAGE_KEY}=${l}; path=/; max-age=31536000; samesite=lax`;
      } catch {
        /* ignore */
      }

      // Sync URL prefix
      const currentPath = window.location.pathname;
      const parts = currentPath.split("/").filter(Boolean);
      let restOfPath = "";
      if (parts.length > 0) {
        const firstPart = parts[0].toLowerCase();
        const validLangs = ["tr", "ar", "de", "ru", "ja", "ko", "en", "zh", "es"];
        if (validLangs.includes(firstPart)) {
          restOfPath = "/" + parts.slice(1).join("/");
        } else {
          restOfPath = "/" + parts.join("/");
        }
      } else {
        restOfPath = "/";
      }

      const prefix = l === "en" ? "" : `/${l}`;
      const newPath = `${prefix}${restOfPath === "/" ? "" : restOfPath}` || "/";

      if (window.location.pathname !== newPath) {
        // See the note above: switching locale must re-request the page so the
        // server inlines the target locale's dictionary.
        window.location.assign(newPath);
      }
    }
  };

  // activeDict() is pre-merged over English server-side, so a key missing from
  // the target locale already carries the English string — same result as the
  // previous DICTS[lang] ?? DICTS.en chain, without shipping nine dictionaries.
  const t = (key: string): string => activeDict()[key] ?? key;

  const currentLanguage = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <I18nContext.Provider
      value={{
        lang,
        dir: currentLanguage.dir,
        setLang,
        t,
        languages: LANGUAGES,
        currentLanguage,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
