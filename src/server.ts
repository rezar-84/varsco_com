import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { validateCors, checkRateLimit } from "./lib/api/middleware";
import { resolveLegacyRedirect } from "./lib/legacy-redirects";

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

const serverStorage = new AsyncLocalStorage<{ lang: string; path: string }>();

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

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const requestUrl = new URL(request.url);

      // Consolidate the historical www host into the canonical host used by
      // canonicals, sitemap, and hreflang. Keep path and query intact.
      if (requestUrl.hostname.toLowerCase() === "www.varsco.com") {
        requestUrl.hostname = "varsco.com";
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
          requestUrl.origin,
        );
        destination.search = requestUrl.search;
        return new Response(null, {
          status: 301,
          headers: { Location: destination.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      // /en is not a canonical public prefix: English is the default locale.
      // Also normalize uppercase locale spellings before routing.
      if (supportedLocale && rawLocale === "en") {
        const rest = rawParts.slice(1).join("/");
        const destination = new URL(`/${rest}`, requestUrl.origin);
        destination.search = requestUrl.search;
        return new Response(null, {
          status: 301,
          headers: { Location: destination.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      if (rawParts[0] && rawParts[0] !== rawLocale && supportedLocale) {
        const rest = rawParts.slice(1).join("/");
        const destination = new URL(`/${rawLocale}${rest ? `/${rest}` : ""}`, requestUrl.origin);
        destination.search = requestUrl.search;
        return new Response(null, {
          status: 301,
          headers: { Location: destination.toString(), "Cache-Control": "public, max-age=86400" },
        });
      }

      // Retire high-volume legacy Odoo login URLs without exposing them to
      // search engines as application pages.
      if (requestUrl.pathname === "/web/login" || requestUrl.pathname === "/web/login/") {
        const destination = new URL("/login", requestUrl.origin);
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

      // 3. Legacy /shop/* redirects — retired URLs indexed under the old
      // Odoo website_sale shop, must 301 rather than 404.
      const legacyTarget = resolveLegacyRedirect(path);
      if (legacyTarget) {
        const localePrefix = lang === "en" ? "" : `/${lang}`;
        const destination = new URL(`${localePrefix}${legacyTarget}`, url.origin);
        return new Response(null, { status: 301, headers: { Location: destination.toString() } });
      }

      const handler = await getServerEntry();
      const response = await serverStorage.run({ lang, path }, () =>
        handler.fetch(rewrittenRequest, env, ctx),
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
