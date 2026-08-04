import type { LangCode } from "@/lib/types";

export type Dict = Record<string, string>;

/**
 * Access to the active locale's translation dictionary.
 *
 * The nine locale JSON files total ~1.3 MB. They used to be statically
 * imported by I18nContext and store-i18n, which put every one of them into the
 * shared client chunk — so a Turkish visitor downloaded the Arabic, Russian,
 * Japanese, Korean, Chinese, German, Spanish and English dictionaries as well.
 *
 * Instead the server resolves ONE dictionary per request, already merged over
 * English so lookups need no fallback chain, and inlines it into the HTML.
 * The client reads that. No locale JSON reaches the browser bundle at all.
 *
 * The static imports live in src/server.ts, which is the nitro entry and is
 * never part of the client build — that is what keeps them out.
 */
export const I18N_GLOBAL_KEY = "__VARS_I18N__";

interface I18nPayload {
  lang: LangCode;
  dict: Dict;
}

type ServerStore = { lang?: string; path?: string; i18n?: I18nPayload };

function serverPayload(): I18nPayload | undefined {
  const storage = (globalThis as unknown as Record<string, unknown>).serverStorage as
    { getStore: () => ServerStore | undefined } | undefined;
  return storage?.getStore()?.i18n;
}

function clientPayload(): I18nPayload | undefined {
  return (globalThis as unknown as Record<string, I18nPayload | undefined>)[I18N_GLOBAL_KEY];
}

/**
 * The active dictionary. Empty only if neither side supplied one, in which
 * case callers fall back to the key or to a supplied default — the same
 * degradation as a missing key, never a crash.
 */
export function activeDict(): Dict {
  return (serverPayload() ?? clientPayload())?.dict ?? {};
}

/** Locale the active dictionary belongs to. */
export function activeDictLang(): LangCode | undefined {
  return (serverPayload() ?? clientPayload())?.lang;
}

/** Serialized <script> body that hands the dictionary to the client. */
export function i18nBootstrapScript(payload: I18nPayload): string {
  // JSON.stringify twice: the inner call serializes the payload, the outer one
  // produces a JS string literal that cannot terminate the surrounding
  // <script> element or inject markup.
  return `window[${JSON.stringify(I18N_GLOBAL_KEY)}]=JSON.parse(${JSON.stringify(
    JSON.stringify(payload),
  )});`;
}

/**
 * Server-side payload for the bootstrap script, or undefined on the client.
 *
 * head() runs isomorphically. Emitting the script only when a server payload
 * exists means the dictionary is serialized exactly once, during SSR.
 */
export function serverI18nPayload(): I18nPayload | undefined {
  return serverPayload();
}
