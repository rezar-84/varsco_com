import type { LangCode } from "@/lib/types";
import { TR_BODIES } from "./tr";
import { KO_BODIES } from "./ko";
import { JA_BODIES } from "./ja";
import { DE_BODIES } from "./de";
import { ES_BODIES } from "./es";
import { RU_BODIES } from "./ru";
import { AR_BODIES } from "./ar";

/**
 * Translated article bodies, by locale then post slug.
 *
 * Separate from BLOG_TRANSLATIONS (title/excerpt/category) so a locale's bodies
 * can land independently: bodies are the bulk of the content and are being
 * translated locale by locale. A slug absent here simply keeps the English
 * body, via getLocalizedPost()'s `translation.body || post.body` fallback.
 */
export const BLOG_BODIES: Partial<Record<LangCode, Record<string, string>>> = {
  tr: TR_BODIES,
  ko: KO_BODIES,
  ja: JA_BODIES,
  de: DE_BODIES,
  es: ES_BODIES,
  ru: RU_BODIES,
  ar: AR_BODIES,
};
