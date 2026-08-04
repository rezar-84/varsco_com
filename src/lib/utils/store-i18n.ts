import { useMemo } from "react";
import type { LangCode } from "@/lib/types";
import { getCurrentLocale } from "@/lib/utils/locale";
import { useI18n } from "@/context/I18nContext";

import en from "@/lib/locales/en.json";
import tr from "@/lib/locales/tr.json";
import ar from "@/lib/locales/ar.json";
import ru from "@/lib/locales/ru.json";
import de from "@/lib/locales/de.json";
import ja from "@/lib/locales/ja.json";
import ko from "@/lib/locales/ko.json";
import zh from "@/lib/locales/zh.json";
import es from "@/lib/locales/es.json";

/**
 * Localization for the Odoo-backed /shop catalog.
 *
 * The store's product data comes from Odoo, whose shop controller reads every
 * field in the environment default language regardless of the locale in the
 * request path (documented in varsco_content_api's controllers/shop.py) — so
 * names, descriptions and category labels arrive in English for all nine
 * locales. Odoo's own translations are also incomplete (no zh/es language at
 * all) and it keys Korean as ko_KR where this site uses ko, so they can't
 * cover the locale set even in principle. Translations therefore live here, in
 * the locale JSON, the same way the /products portfolio already handles them
 * via ProductCard's tp() helper.
 */
const DICTS: Record<LangCode, Record<string, string>> = {
  en,
  tr,
  ar,
  ru,
  de,
  ja,
  ko,
  zh,
  es,
};

/**
 * Stable lookup key for an Odoo record, derived from its English name.
 *
 * Deliberately NOT derived from Odoo's own slug: `ir.http._slug()` appends the
 * record id (`atlantic-salmon-egg-88`), and ids differ between the dev,
 * staging and production databases, so a slug-derived key would silently miss
 * in one environment. It also builds category slugs from `display_name`, which
 * carries the parent path. The English name is the one identifier that is the
 * same everywhere.
 *
 * Mirrors Odoo's own slugify: strip diacritics, collapse every non-alphanumeric
 * run to a single hyphen, lowercase.
 */
export function storeDataKey(englishName: string): string {
  return englishName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

/**
 * Odoo's shop controller strips HTML tags from description_ecommerce but
 * leaves entities behind, so raw payloads still carry literal `&nbsp;` /
 * `&amp;` runs. Those reach React as a plain text node and render verbatim.
 * Only used for the untranslated fallback — the locale JSON stores clean text.
 */
export function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolve a store string: target locale, then English, then the live Odoo
 * value. Matching tp()'s contract, an absent key falls through to the value
 * Odoo supplied rather than exposing the raw key, so a product added in Odoo
 * with no locale entries still renders (in English) instead of breaking.
 */
export function translateStore(lang: LangCode, key: string, fallback: string): string {
  const hit = DICTS[lang]?.[key] ?? DICTS.en?.[key];
  if (hit) return hit;
  return decodeEntities(fallback ?? "");
}

/** SSR-safe variant for route `head()` blocks, which run outside React. */
export function translateStoreSsr(key: string, fallback: string): string {
  return translateStore(getCurrentLocale(), key, fallback);
}

export interface StoreTranslator {
  lang: LangCode;
  /** Product name/summary: `store.product.<key>.<field>`. */
  product: (englishName: string, field: "name" | "summary", fallback: string) => string;
  /** Public category label: `store.categoryName.<key>`. */
  category: (englishName: string) => string;
  /** Attribute label (Weight, size, brand): `store.attribute.<key>`. */
  attribute: (englishName: string) => string;
  /** Product tag: `store.tag.<key>`. */
  tag: (englishName: string) => string;
  /** Website ribbon ("New!", "Sale"): `store.ribbon.<key>`. */
  ribbon: (englishName: string) => string;
}

function build(lang: LangCode): StoreTranslator {
  const at = (prefix: string, name: string, fallback = name) =>
    translateStore(lang, `${prefix}.${storeDataKey(name)}`, fallback);
  return {
    lang,
    product: (englishName, field, fallback) =>
      translateStore(lang, `store.product.${storeDataKey(englishName)}.${field}`, fallback),
    category: (englishName) => at("store.categoryName", englishName),
    attribute: (englishName) => at("store.attribute", englishName),
    tag: (englishName) => at("store.tag", englishName),
    ribbon: (englishName) => at("store.ribbon", englishName),
  };
}

/**
 * Component-side translator; pairs with translateStoreSsr() in head().
 *
 * Memoized on `lang` because callers list it in useMemo dependency arrays
 * (shop.index.tsx's filter/sort and category memos) — a fresh object per render
 * would invalidate those on every render and defeat the memoization.
 */
export function useStoreT(): StoreTranslator {
  const { lang } = useI18n();
  return useMemo(() => build(lang), [lang]);
}

/** Same translator outside React (route loaders, head()). */
export function getStoreT(lang?: LangCode): StoreTranslator {
  return build(lang ?? getCurrentLocale());
}
