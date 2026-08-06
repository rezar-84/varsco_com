import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { validateCors, checkRateLimit } from "./lib/api/middleware";
import { resolveLegacyRedirect } from "./lib/legacy-redirects";
import type { Dict } from "./lib/i18n-dict";

// The nine locale dictionaries are imported HERE, in the nitro server entry,
// precisely because this file is never part of the client build. Importing
// them from I18nContext instead put all ~1.3 MB into the shared browser chunk.
import enDict from "./lib/locales/en.json";
import trDict from "./lib/locales/tr.json";
import arDict from "./lib/locales/ar.json";
import ruDict from "./lib/locales/ru.json";
import deDict from "./lib/locales/de.json";
import jaDict from "./lib/locales/ja.json";
import koDict from "./lib/locales/ko.json";
import zhDict from "./lib/locales/zh.json";
import esDict from "./lib/locales/es.json";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

import { AsyncLocalStorage } from "node:async_hooks";

const serverStorage = new AsyncLocalStorage<{
  lang: string;
  path: string;
  i18n: { lang: string; dict: Dict };
}>();

const ALL_DICTS: Record<string, Dict> = {
  en: enDict,
  tr: trDict,
  ar: arDict,
  ru: ruDict,
  de: deDict,
  ja: jaDict,
  ko: koDict,
  zh: zhDict,
  es: esDict,
};

/**
 * One dictionary per request, pre-merged over English so the client needs no
 * fallback chain — a missing key in the target locale is already filled with
 * the English string, matching the old DICTS[lang] ?? DICTS.en behaviour.
 * Cached per locale: the merge is pure and the inputs are static imports.
 */
const mergedCache = new Map<string, Dict>();
function mergedDict(lang: string): Dict {
  const cached = mergedCache.get(lang);
  if (cached) return cached;
  const target = ALL_DICTS[lang] ?? ALL_DICTS.en;
  const merged = lang === "en" ? { ...ALL_DICTS.en } : { ...ALL_DICTS.en, ...target };
  mergedCache.set(lang, merged);
  return merged;
}

/** Public URL prefixes. Mirrors VALID_LANGS in src/lib/utils/locale.ts. */
const SUPPORTED_LOCALES = ["tr", "ar", "de", "ru", "ja", "ko", "en", "zh", "es"];
(globalThis as unknown as Record<string, unknown>).serverStorage = serverStorage;

function deLocalizeRequest(request: Request): Request {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  if (pathParts.length > 0) {
    const firstPart = pathParts[0].toLowerCase();
    const validLangs = ["tr", "ar", "de", "ru", "ja", "ko", "en", "zh", "es"];
    if (validLangs.includes(firstPart)) {
      url.pathname = "/" + pathParts.slice(1).join("/");
      return new Request(url.toString(), request);
    }
  }
  return request;
}

/**
 * Origin to build redirect Locations from.
 *
 * TLS terminates at the proxy, so `request.url` arrives as http:// even for an
 * https request. Using redirectOrigin(request, requestUrl) directly made every 301 point at
 * http://, which the edge then bounced to https:// — an extra hop on every
 * redirect. Search Console shows those as chains, and each hop is a chance to
 * lose the referrer and a slice of link equity.
 *
 * Observed: https://varsco.com/ko_KR/contact 301'd to http://varsco.com/ko/contact,
 * which 301'd again to https://. Two redirects where one would do.
 */
function redirectOrigin(request: Request, url: URL): string {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const proto = forwardedProto || url.protocol.replace(":", "");
  return `${proto}://${forwardedHost || url.host}`;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const requestUrl = new URL(request.url);

      // Consolidate the historical www host into the canonical host used by
      // canonicals, sitemap, and hreflang. Keep path and query intact.
      if (requestUrl.hostname.toLowerCase() === "www.varsco.com") {
        requestUrl.hostname = "varsco.com";
        requestUrl.protocol = "https:";
        return new Response(null, {
          status: 301,
          headers: { Location: requestUrl.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      const rawParts = requestUrl.pathname.split("/").filter(Boolean);
      const rawLocale = rawParts[0]?.toLowerCase();
      const supportedLocale = SUPPORTED_LOCALES.includes(rawLocale ?? "");

      // Odoo publishes its URL space under full locale codes — ko_KR, de_DE,
      // tr_TR, ru_RU, ja_JP, zh_CN, es_ES, and region-numeric forms like
      // ar_001 / es_419. This site prefixes with the bare subtag only, so map
      // any xx_YY / xx-yy form back onto it instead of serving a 404 or a
      // duplicate. Previously only ko_KR/ko-kr was handled, leaving every
      // other locale's historical Odoo URLs to 404.
      const legacyBase = rawLocale?.match(/^([a-z]{2})[_-][a-z0-9]{2,4}$/)?.[1];
      if (legacyBase && SUPPORTED_LOCALES.includes(legacyBase)) {
        const rest = rawParts.slice(1).join("/");
        // English is the default locale and carries no public prefix.
        const prefix = legacyBase === "en" ? "" : `/${legacyBase}`;
        const destination = new URL(
          `${prefix}/${rest}`.replace(/\/+$/, "") || "/",
          redirectOrigin(request, requestUrl),
        );
        destination.search = requestUrl.search;
        return new Response(null, {
          status: 301,
          headers: { Location: destination.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      // ?lang=xx renders that locale but leaves the URL unprefixed, producing a
      // second URL for the same content whose canonical points at the English
      // page. Redirect it into the real locale path instead.
      const queryLang = requestUrl.searchParams.get("lang")?.toLowerCase();
      if (queryLang && SUPPORTED_LOCALES.includes(queryLang) && !supportedLocale) {
        const destination = new URL(
          `${queryLang === "en" ? "" : `/${queryLang}`}${requestUrl.pathname}`.replace(
            /\/+$/,
            "",
          ) || "/",
          redirectOrigin(request, requestUrl),
        );
        destination.search = requestUrl.search;
        destination.searchParams.delete("lang");
        return new Response(null, {
          status: 301,
          headers: { Location: destination.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      // Honour an explicit language choice, made by the visitor via the
      // switcher and stored in vars.lang, before rendering. Deliberately NOT
      // based on Accept-Language: auto-redirecting on browser language is
      // contrary to Google's guidance and would stop an English speaker with a
      // non-English browser from reaching the English pages at all. Crawlers
      // send no cookie and therefore always get the URL they asked for.
      if (!supportedLocale && request.method === "GET") {
        const cookieLang = /(?:^|;\s*)vars\.lang=([a-z]{2})(?:;|$)/.exec(
          request.headers.get("cookie") ?? "",
        )?.[1];
        if (cookieLang && cookieLang !== "en" && SUPPORTED_LOCALES.includes(cookieLang)) {
          const destination = new URL(
            `/${cookieLang}${requestUrl.pathname}`.replace(/\/+$/, "") || `/${cookieLang}`,
            redirectOrigin(request, requestUrl),
          );
          destination.search = requestUrl.search;
          return new Response(null, {
            status: 302,
            headers: { Location: destination.toString(), Vary: "Cookie" },
          });
        }
      }

      // /en is not a canonical public prefix: English is the default locale.
      // Also normalize uppercase locale spellings before routing.
      if (supportedLocale && rawLocale === "en") {
        const rest = rawParts.slice(1).join("/");
        const destination = new URL(`/${rest}`, redirectOrigin(request, requestUrl));
        destination.search = requestUrl.search;
        return new Response(null, {
          status: 301,
          headers: { Location: destination.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      if (rawParts[0] && rawParts[0] !== rawLocale && supportedLocale) {
        const rest = rawParts.slice(1).join("/");
        const destination = new URL(
          `/${rawLocale}${rest ? `/${rest}` : ""}`,
          redirectOrigin(request, requestUrl),
        );
        destination.search = requestUrl.search;
        return new Response(null, {
          status: 301,
          headers: { Location: destination.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      // Retire high-volume legacy Odoo login URLs without exposing them to
      // search engines as application pages.
      if (requestUrl.pathname === "/web/login" || requestUrl.pathname === "/web/login/") {
        const destination = new URL("/login", redirectOrigin(request, requestUrl));
        const redirectTarget = requestUrl.searchParams.get("redirect");
        if (redirectTarget?.startsWith("/"))
          destination.searchParams.set("redirect", redirectTarget);
        return new Response(null, {
          status: 301,
          headers: { Location: destination.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      // 1. Run CORS check
      const corsResponse = validateCors(request);
      if (corsResponse) return corsResponse;

      // 2. Run Rate Limiting check
      const clientIp = request.headers.get("cf-connecting-ip") || "127.0.0.1";
      const rateLimitResponse = checkRateLimit(request, clientIp);
      if (rateLimitResponse) return rateLimitResponse;

      const rewrittenRequest = deLocalizeRequest(request);
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/").filter(Boolean);
      let lang = "en";
      if (pathParts.length > 0) {
        const firstPart = pathParts[0].toLowerCase();
        const validLangs = ["tr", "ar", "de", "ru", "ja", "ko", "en", "zh", "es"];
        if (validLangs.includes(firstPart)) {
          lang = firstPart;
        }
      }
      const path = new URL(rewrittenRequest.url).pathname;

      // 3. Legacy redirects — URLs indexed under the retired Odoo (and
      // pre-Odoo Drupal) site, which must 301 rather than 404. Sourced from
      // the Search Console 404 drilldown; see lib/legacy-redirects.ts.
      const legacyTarget = resolveLegacyRedirect(path);
      if (legacyTarget) {
        const localePrefix = lang === "en" ? "" : `/${lang}`;
        const destination = new URL(
          `${localePrefix}${legacyTarget}`,
          redirectOrigin(request, requestUrl),
        );
        // Preserve the query string: campaign parameters on an old link are
        // still worth attributing, and dropping them loses the referral data
        // on exactly the traffic these redirects exist to rescue.
        destination.search = requestUrl.search;
        return new Response(null, {
          status: 301,
          headers: { Location: destination.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      const handler = await getServerEntry();
      const response = await serverStorage.run(
        { lang, path, i18n: { lang, dict: mergedDict(lang) } },
        () => handler.fetch(rewrittenRequest, env, ctx),
      );
      if (requestUrl.pathname === "/web" || requestUrl.pathname.startsWith("/web/")) {
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
      }
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
