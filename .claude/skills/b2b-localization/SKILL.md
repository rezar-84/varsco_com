---
name: b2b-localization
description: Translate or localize VARS Aquaculture site content (locale JSON files, blog posts, product copy) into any of the site's 8 non-English languages (tr, de, es, ru, ar, ja, ko, zh). Use whenever asked to translate, localize, add a language, or review/fix existing translations — trigger on "translate," "localization," "locale file," or a language name plus "translation."
---

# B2B localization (VARS Aquaculture)

This project sells to real international B2B buyers in each of its languages, so translations must read as if written by a native industry professional — not machine-translated marketing copy. Full guideline: `doc/translation_agents.md`.

## Before translating anything

1. **Read `doc/translation_agents.md`** for the target language's terminology dictionary, market default, and tone rules.
2. **Identify which strings are marketing copy vs. technical/numeric fact.** Marketing copy (headlines, taglines, CTAs) gets transcreated to sound native. Numbers, units, species names, and hatching/nutrition figures get translated label-only — the value never changes. If unsure which a string is, treat it as technical and preserve the value exactly.
3. **Research the actual market term for any product category you're not confident about** (Artemia/live feed, Chlorella/microalgae, salmon ova, sea bass/bream, fish meal, wheat gluten) via WebSearch — check what real competitor/supplier sites or trade publications in that language use, don't guess from a dictionary. This also improves local SEO since it matches what buyers actually search.
4. **For any technical/scientific claim**, defer to `.claude/skills/scientific-content-review/SKILL.md` — a translation must never introduce a number or claim that wasn't in the reviewed English source.

## Where content lives in this repo

- UI/marketing strings: `src/lib/locales/<lang>.json` — flat key→string maps, English source of truth is `en.json`. Missing keys fall back to English automatically (`I18nContext.tsx`), so a partial translation degrades gracefully rather than breaking.
- Per-product translation overrides: `product.<slug>.<field>` keys (see `tr.json` for examples) — same fallback pattern via the `tp()` helper in `ProductCard.tsx` and the product detail route.
- Blog content (`src/lib/mock/blog.ts`) currently has **no i18n mechanism at all** — post title/excerpt/body render directly in English regardless of selected language. Translating blog posts requires first adding the same `tp()`-style override lookup (keyed `blog.<slug>.<field>`) to the blog routes before any translated post content will actually render.

## After translating

- Validate every edited `.json` file parses (`node -e "JSON.parse(require('fs').readFileSync('<file>','utf8'))"`).
- Run the Localization Standards checklist in `doc/translation_agents.md` §4 (RTL for Arabic, length/clipping for German/Russian/Spanish, CJK line-breaks for Japanese/Chinese/Korean, accented-character encoding for Turkish/Spanish).
- Don't touch keys outside the ones you were asked to translate — a partial, targeted diff is easier to review than a full-file rewrite.
