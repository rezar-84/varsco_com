import type { LangCode } from "@/lib/types";

const VALID_LANGS: LangCode[] = ["tr", "ar", "de", "ru", "ja", "ko", "en", "zh", "es"];

/** Isomorphic locale resolution — mirrors the pattern in seo.ts's getSeoMeta(). */
export function getCurrentLocale(): LangCode {
  if (typeof window !== "undefined") {
    const first = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    if (first && VALID_LANGS.includes(first as LangCode)) {
      return first as LangCode;
    }
    return "en";
  }
  const storage = (globalThis as unknown as Record<string, unknown>).serverStorage as
    { getStore: () => { lang?: string } | undefined } | undefined;
  const lang = storage?.getStore()?.lang;
  return lang && VALID_LANGS.includes(lang as LangCode) ? (lang as LangCode) : "en";
}
