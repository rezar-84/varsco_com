#!/usr/bin/env node
/**
 * Reports how complete the blog translations are, and catches the specific
 * failure this codebase already shipped once: a "translation" that is really a
 * short stub, with the article's headings, tables and links silently dropped.
 *
 * getLocalizedPost() falls back with `translation.body || post.body`, so a
 * missing or truncated body renders as English with no error — exactly the way
 * the previous Turkish stubs (5-32% of the source length, zero headings) looked
 * fine in the UI while omitting most of each article.
 *
 * Structural checks per translated body:
 *   - length ratio vs the English source (flags likely truncation)
 *   - markdown heading count matches
 *   - markdown table row count matches
 *   - every inline link target from the source is still present
 *
 *   node scripts/check-blog-translations.mjs [--strict]
 *
 * --strict exits non-zero when any locale is incomplete; the default reports
 * progress without failing, since locales are being filled in one at a time.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MOCK = path.join(ROOT, "src/lib/mock");
const LANGS = ["tr", "de", "es", "ru", "ar", "ja", "ko", "zh"];
const STRICT = process.argv.includes("--strict");
const MIN_RATIO = 0.6;

const headings = (s) => (s.match(/^#{1,6}\s/gm) || []).length;
const tableRows = (s) => (s.match(/^\|.*\|\s*$/gm) || []).length;
const links = (s) => (s.match(/\]\(([^)]+)\)/g) || []).map((m) => m.slice(2, -1));

/** English sources, parsed straight out of the blog.ts object literal. */
const blogSrc = fs.readFileSync(path.join(MOCK, "blog.ts"), "utf8");
const english = new Map(
  [...blogSrc.matchAll(/slug:\s*"([^"]+)"[\s\S]*?body:\s*`([\s\S]*?)`,\n/g)].map((m) => [
    m[1],
    m[2],
  ]),
);

/** Translated bodies: read each per-locale module without executing it. */
function bodiesFor(lang) {
  const file = path.join(MOCK, "blog_bodies", `${lang}.ts`);
  if (!fs.existsSync(file)) return new Map();
  const src = fs.readFileSync(file, "utf8");
  return new Map(
    [...src.matchAll(/^ {2}"([^"]+)":\s*`([\s\S]*?)`,\s*$/gm)].map((m) => [m[1], m[2]]),
  );
}

console.log(`English posts: ${english.size}`);
let incomplete = 0;
const problems = [];

for (const lang of LANGS) {
  const bodies = bodiesFor(lang);
  const missing = [...english.keys()].filter((s) => !bodies.has(s));
  if (missing.length) incomplete++;

  for (const [slug, translated] of bodies) {
    const source = english.get(slug);
    if (!source) {
      problems.push(`${lang}/${slug}: body for a slug that no longer exists in blog.ts`);
      continue;
    }
    const ratio = translated.length / source.length;
    if (ratio < MIN_RATIO) {
      problems.push(
        `${lang}/${slug}: body is ${(ratio * 100).toFixed(0)}% of the English length — likely truncated`,
      );
    }
    if (headings(translated) !== headings(source)) {
      problems.push(
        `${lang}/${slug}: ${headings(translated)} headings vs ${headings(source)} in English`,
      );
    }
    if (tableRows(translated) !== tableRows(source)) {
      problems.push(
        `${lang}/${slug}: ${tableRows(translated)} table rows vs ${tableRows(source)} in English`,
      );
    }
    const lost = links(source).filter((l) => !translated.includes(l));
    if (lost.length) {
      problems.push(`${lang}/${slug}: dropped link(s) ${lost.join(", ")}`);
    }
  }

  const done = bodies.size;
  const bar = `${done}/${english.size}`;
  console.log(
    `${lang}: ${bar.padEnd(6)} bodies translated${missing.length ? ` — ${missing.length} still English` : "  ✓ complete"}`,
  );
}

for (const p of problems) console.error(`FAIL: ${p}`);
if (problems.length) {
  console.error(`\n${problems.length} structural problem(s).`);
  process.exit(1);
}
if (STRICT && incomplete) {
  console.error(`\n${incomplete} locale(s) incomplete.`);
  process.exit(1);
}
console.log("\nNo structural problems in the bodies translated so far.");
