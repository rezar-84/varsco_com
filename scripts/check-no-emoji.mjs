#!/usr/bin/env node
/**
 * Guard: no emoji in source or content.
 *
 * The site's visual language is lucide icons. Emoji were previously used as
 * card icons, language-switcher flags and inline markers; they render
 * differently on every platform, ignore the theme's colour tokens, and screen
 * readers announce them as words mid-sentence ("shield Biosecurity").
 *
 * Deliberately NOT flagged: typographic characters that happen to sit in the
 * same Unicode neighbourhoods — arrows (→ ➔ ←), ™ © ®, bullets, and the
 * dingbat check/cross marks. Those are punctuation, not pictographs.
 */
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOTS = ["src", "scripts"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css", ".html"]);

// Pictographs, emoticons, transport/map, supplemental symbols, and the
// regional-indicator pairs that compose flag emoji.
const EMOJI =
  /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{FE0F}]/gu;

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (EXTS.has(extname(e.name))) out.push(p);
  }
  return out;
}

let failures = 0;
for (const root of ROOTS) {
  let files;
  try {
    files = await walk(root);
  } catch {
    continue; // root absent — nothing to check
  }
  for (const file of files) {
    if (file === "scripts/check-no-emoji.mjs") continue; // the pattern itself
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const hits = line.match(EMOJI);
      if (!hits) return;
      failures++;
      console.error(`${file}:${i + 1}  ${[...new Set(hits)].join(" ")}  ${line.trim().slice(0, 90)}`);
    });
  }
}

if (failures) {
  console.error(`\n${failures} line(s) contain emoji. Use a lucide icon instead.`);
  process.exit(1);
}
console.log("check-no-emoji: clean");
