#!/usr/bin/env node
/**
 * Guards the /shop localization that lives in src/lib/locales/*.json.
 *
 * The store's product data is authored in Odoo but translated here, so two
 * things can silently rot:
 *
 *  1. Coverage — I18nContext's t() falls back to English without warning, so a
 *     key missing from a locale looks like working English rather than a gap.
 *  2. Drift — because the English source text is duplicated into en.json, a
 *     rename in Odoo leaves the repo serving a stale name with no signal.
 *
 * Coverage always runs. The drift check needs the Odoo database and is skipped
 * (not failed) when psql or the DB is unreachable, so CI without a database
 * still gets the coverage guarantee.
 *
 *   node scripts/check-store-translations.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOCALE_DIR = path.join(ROOT, "src/lib/locales");
const LOCALES = ["en", "tr", "de", "es", "ru", "ar", "ja", "ko", "zh"];
const STORE_DATA_PREFIXES = [
  "store.product.",
  "store.categoryName.",
  "store.attribute.",
  "store.tag.",
  "store.ribbon.",
  "store.seo.",
];

/** Must stay identical to storeDataKey() in src/lib/utils/store-i18n.ts. */
function storeDataKey(englishName) {
  return englishName
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

const dicts = Object.fromEntries(
  LOCALES.map((l) => [l, JSON.parse(fs.readFileSync(path.join(LOCALE_DIR, `${l}.json`), "utf8"))]),
);

const problems = [];
const notes = [];

// --- 1. Coverage: every store data key in en.json exists in all locales ----
const englishStoreKeys = Object.keys(dicts.en).filter((k) =>
  STORE_DATA_PREFIXES.some((p) => k.startsWith(p)),
);
for (const lang of LOCALES.filter((l) => l !== "en")) {
  const missing = englishStoreKeys.filter((k) => !(k in dicts[lang]));
  if (missing.length) {
    problems.push(
      `${lang}: ${missing.length} store key(s) missing — ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ", ..." : ""}`,
    );
  }
  const untranslated = englishStoreKeys.filter(
    // Brand-only strings are intentionally identical across locales.
    (k) =>
      dicts[lang][k] === dicts.en[k] && !/seachem|super-fresh|^store\.product\..*\.name$/.test(k),
  );
  if (untranslated.length) {
    notes.push(
      `${lang}: ${untranslated.length} store key(s) identical to English (check intent) — ${untranslated.slice(0, 3).join(", ")}`,
    );
  }
}
console.log(`coverage: ${englishStoreKeys.length} store keys x ${LOCALES.length} locales`);

// --- 2. Drift: en.json text still matches what Odoo serves ----------------
function queryOdoo(sql) {
  return execFileSync(
    "psql",
    [
      "-h",
      "127.0.0.1",
      "-p",
      "54329",
      "-U",
      "odoo",
      "-d",
      "varsco_com",
      "-At",
      "-F",
      "",
      "-c",
      sql,
    ],
    {
      env: { ...process.env, PGPASSWORD: process.env.PGPASSWORD || "odoo_dev_password" },
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  )
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(""));
}

const SOURCES = [
  {
    label: "product",
    prefix: "store.product.",
    suffix: ".name",
    sql: "SELECT name->>'en_US' FROM product_template WHERE is_published = true",
  },
  {
    label: "category",
    prefix: "store.categoryName.",
    suffix: "",
    sql: "SELECT name->>'en_US' FROM product_public_category",
  },
  {
    label: "attribute",
    prefix: "store.attribute.",
    suffix: "",
    sql: "SELECT a.name->>'en_US' FROM product_attribute a WHERE a.id IN (SELECT l.attribute_id FROM product_template_attribute_line l JOIN product_template t ON t.id = l.product_tmpl_id WHERE t.is_published = true)",
  },
  {
    label: "tag",
    prefix: "store.tag.",
    suffix: "",
    sql: "SELECT DISTINCT g.name->>'en_US' FROM product_tag g JOIN product_tag_product_template_rel r ON r.product_tag_id = g.id JOIN product_template t ON t.id = r.product_template_id WHERE t.is_published = true",
  },
  {
    label: "ribbon",
    prefix: "store.ribbon.",
    suffix: "",
    sql: "SELECT name->>'en_US' FROM product_ribbon",
  },
];

try {
  for (const src of SOURCES) {
    for (const [raw] of queryOdoo(src.sql)) {
      if (!raw) continue;
      const key = `${src.prefix}${storeDataKey(raw)}${src.suffix}`;
      if (!(key in dicts.en)) {
        notes.push(
          `${src.label} "${raw}" has no repo key (${key}) — renders untranslated English from Odoo`,
        );
      }
    }
  }
  console.log("drift: checked against Odoo (varsco_com)");
} catch {
  console.log("drift: SKIPPED — Odoo database not reachable");
}

for (const n of notes) console.log(`note: ${n}`);
for (const p of problems) console.error(`FAIL: ${p}`);
if (problems.length) process.exit(1);
console.log("OK");
