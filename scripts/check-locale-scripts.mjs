#!/usr/bin/env node
/**
 * Flags writing systems that cannot legitimately appear in a locale file.
 *
 * This catches text bleeding from one translation into another — a mistake
 * made three times while building these files: a Cyrillic fragment inside a
 * Japanese sentence, an English word left inside a Chinese one, and the
 * Japanese topic particle は inside a Korean answer ("MOQは 제품..."). All
 * three read as plausible text and none is caught by key-coverage checks.
 *
 * Han characters are deliberately not policed: native to zh and ja, and
 * legitimate in ko. Latin is not policed either — brand names, units, Latin
 * binomials and certification schemes appear in every locale by design.
 *
 *   node scripts/check-locale-scripts.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/lib/locales");
const KANA = /[぀-ゟ゠-ヿ]/;
const HANGUL = /[가-힯ᄀ-ᇿ]/;
const CYRILLIC = /[Ѐ-ӿ]/;
const ARABIC = /[؀-ۿݐ-ݿ]/;
const LATIN_ONLY = [
  ["Kana", KANA],
  ["Hangul", HANGUL],
  ["Cyrillic", CYRILLIC],
  ["Arabic", ARABIC],
];
const FORBIDDEN = {
  en: LATIN_ONLY,
  tr: LATIN_ONLY,
  de: LATIN_ONLY,
  es: LATIN_ONLY,
  ru: [
    ["Kana", KANA],
    ["Hangul", HANGUL],
    ["Arabic", ARABIC],
  ],
  ar: [
    ["Kana", KANA],
    ["Hangul", HANGUL],
    ["Cyrillic", CYRILLIC],
  ],
  ja: [
    ["Hangul", HANGUL],
    ["Cyrillic", CYRILLIC],
    ["Arabic", ARABIC],
  ],
  ko: [
    ["Kana", KANA],
    ["Cyrillic", CYRILLIC],
    ["Arabic", ARABIC],
  ],
  zh: [
    ["Kana", KANA],
    ["Hangul", HANGUL],
    ["Cyrillic", CYRILLIC],
    ["Arabic", ARABIC],
  ],
};

let problems = 0;
let checked = 0;
for (const [lang, rules] of Object.entries(FORBIDDEN)) {
  const file = path.join(DIR, `${lang}.json`);
  if (!fs.existsSync(file)) continue;
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [key, value] of Object.entries(dict)) {
    checked++;
    for (const [script, re] of rules) {
      const hit = String(value).match(re);
      if (hit) {
        console.error(
          `FAIL ${lang}/${key}: ${script} character "${hit[0]}" — text leaked from another translation\n     ${String(value).slice(0, 90)}`,
        );
        problems++;
      }
    }
  }
}
console.log(`checked ${checked} strings across ${Object.keys(FORBIDDEN).length} locales`);
if (problems) {
  console.error(`\n${problems} leak(s).`);
  process.exit(1);
}
console.log("no script leakage");
