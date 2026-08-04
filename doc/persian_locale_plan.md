# Plan — add Persian (fa) as the tenth locale

Status: **not started**. This is a scoping document, not implemented work.

## Why the flag is the first technical problem, not a footnote

Persian must ship with the **Lion and Sun** flag, not the current official
Iranian flag.

That is not a one-line change, because the language switcher currently stores
flags as **emoji string literals**:

```ts
// src/context/I18nContext.tsx
{ code: "tr", label: "TR", nativeName: "Türkçe", flag: "🇹🇷", dir: "ltr" },
```

and renders them as bare text in four places — `SiteHeader.tsx:261`,
`SiteFooter.tsx:216`, and twice in `InteractiveSupplyMap.tsx`.

**There is no Lion and Sun emoji.** Unicode has one code point per ISO country
(`🇮🇷` renders the current official flag) and no mechanism for historical or
alternative flags. So the flag field has to stop being "a string that happens
to be an emoji" and become something that can also be an asset reference.

### Approach

1. Widen `LanguageInfo.flag` to `{ emoji: string } | { src: string; alt: string }`,
   or add an optional `flagSrc` that takes precedence when present. The second
   is the smaller diff and keeps the other nine locales untouched.
2. Add `src/assets/flags/lion-and-sun.svg`. SVG, so it stays crisp at the
   ~16-20px the switcher renders at. **This asset does not exist in the repo —
   it must be supplied.**
3. Update the four render sites to emit an `<img>` when `flagSrc` is set and
   the plain emoji otherwise.
4. `alt` text should name the flag, not the country, and gets its own
   translation key.

No other locale changes behaviour.

## RTL

Persian is right-to-left, so it joins Arabic as the second RTL locale:

- `dir: "rtl"` in the `LANGUAGES` entry — `I18nContext` already sets
  `document.documentElement.dir` per locale, so the plumbing exists.
- Arabic already exercises the RTL layout paths, which means the risk here is
  much lower than it would have been before Arabic shipped. Still needs a
  visual pass: the shop filters, product tab bar, size-group tables and the
  telemetry panel are the places where Arabic previously needed attention.
- Persian uses **Eastern Arabic-Indic digits** (۰۱۲۳۴۵۶۷۸۹) in prose but
  conventionally keeps Western digits in technical specs. Decide once and
  record it; the catalogue has ~135 numeric values that must stay legible to a
  B2B buyer reading a spec sheet.

## Scope of the content itself

Persian is a **full tenth locale**, not a partial one. Current state per locale:

| Surface | Volume |
|---|---|
| Locale JSON keys | 2,344 |
| Blog article bodies | 18 (~69,000 chars of English source) |
| Legal pages | Privacy + Terms currently EN/TR only |

Adding `fa` therefore means ~2,344 keys plus 18 article bodies, matching what
each of tr/de/ja/ko already carries.

## Code changes required

- `LangCode` union — `src/lib/types.ts`
- `VALID_LANGS` — `src/lib/utils/locale.ts`
- `LocaleCode` union — `src/lib/api/types.ts`
- `LANGUAGES` — `src/context/I18nContext.tsx` (+ flag asset, + `dir: "rtl"`)
- `SUPPORTED_LOCALES` — `src/server.ts` (drives the Odoo locale-code redirects)
- `ALL_DICTS` — `src/server.ts` (the per-request merged dictionary)
- `DICTS` fallback map — `src/lib/i18n-dict.ts` has none; it reads the
  server-provided payload, so no change needed there
- `FORBIDDEN` script map — `scripts/check-locale-scripts.mjs`. Persian uses the
  Arabic script, so `fa` must permit Arabic and forbid Cyrillic/Hangul/Kana —
  and, importantly, **`ar` and `fa` cannot be distinguished by script**, so the
  leakage guard will not catch Persian text landing in the Arabic file or vice
  versa. Worth noting as a known blind spot rather than assuming coverage.
- `MIN_RATIO` — `scripts/check-blog-translations.mjs`; Persian runs close to
  Arabic in length, so `0.5` is the right starting floor.
- `LANGS` arrays in all three check scripts
- Sitemap and hreflang generation — `src/lib/utils/seo.ts`

## SEO and infrastructure

- `/fa` prefix, consistent with the other nine.
- hreflang set must be reciprocal — every existing locale gains an `fa`
  alternate, and `fa` links back to all of them.
- Sitemap entries for every public route under `/fa`.
- The generalized Odoo locale-code redirect already handles `fa_IR` → `/fa`
  once `fa` is in `SUPPORTED_LOCALES`; no new redirect logic needed.

## Odoo

Odoo has **no Persian language active** and `fa` is not in
`content_locales.xml` — the same situation as `zh` and `es`. Since store and
catalogue translations live in this repo rather than Odoo, this is not a
blocker: Persian will work exactly the way Chinese and Spanish already do.

## Terminology

`doc/translation_agents.md` §3 has no Persian section. One must be added before
translation starts, covering at minimum the terms the other dictionaries fix:
eyed eggs, live feed, Artemia cysts, rotifers, RAS, biosecurity, hatchery.
Persian aquaculture vocabulary should be checked against real Iranian industry
sources rather than derived from Arabic, despite the shared script — the
technical vocabulary diverges.

## Open questions

1. **The flag asset** — needs to be supplied; not in the repo.
2. **Digits** — Eastern Arabic-Indic or Western in technical specs?
3. **Market** — Iran domestic, or the wider Persian-speaking diaspora? Affects
   register, currency references and which certifications to foreground.
4. **Legal pages** — Privacy and Terms are currently EN/TR only. Persian
   presumably takes the English text as its source, as the other seven do.
