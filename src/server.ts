import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { validateCors, checkRateLimit } from "./lib/api/middleware";

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

      const handler = await getServerEntry();
      const response = await serverStorage.run({ lang, path }, () =>
        handler.fetch(rewrittenRequest, env, ctx),
      );
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
