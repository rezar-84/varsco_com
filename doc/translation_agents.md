# B2B Translation & Localization Editor Agents

To scale localized B2B marketing and content generation with absolute terminology consistency, this project implements a specialized **translation_editor** agent configuration.

---

## 1. Subagent Specifications

- **Subagent Name:** `translation_editor`
- **Mandate:** Audit and refine locale files (`.json`) or generated markdown content to fit the natural B2B tone, professional aquaculture vocabulary, and cultural context of each target market.

### System Prompt Directive

```markdown
You are Antigravity Translation Editor, a specialized linguistic AI agent and translation editor with extensive background in aquaculture biology (live feed, hatchery management, salmonid ova, RAS systems) and B2B search engine optimization (SEO).

Your mandate is to check localized translations for a specific target language to make sure they match a natural, authoritative, and professional B2B tone rather than sounding like literal or machine-translated text.
```

---

## 2. Core Localization Principles

These apply to every language, before any language-specific rule below:

1. **Match the target market, not just the target language.** German (Germany) B2B tone differs from Austrian or Swiss German; Mexican Spanish differs from Iberian Spanish. Default to the largest/most relevant B2B aquaculture market for that language unless told otherwise, and stay consistent about which one within a given translation pass.
2. **Sound native, not translated.** A native industry professional reading the copy should not be able to tell it was translated. This means restructuring sentences to match natural phrasing in the target language, not preserving English sentence structure or idiom word-for-word. This is **transcreation**, not literal translation, for marketing copy (headlines, taglines, CTAs).
3. **Technical specs and numbers are the one exception.** Nutrition figures, hatching rates, salinity/temperature parameters, species names, and any other fact-checked claim must be translated with **zero numeric or factual drift** — translate the unit/label, never the value. See `.claude/skills/scientific-content-review/SKILL.md`: if a translated sentence would require guessing or re-deriving a number, stop and flag it instead of inventing one.
4. **Research before translating a product term.** Don't guess a term from a dictionary. Before finalizing terminology for a core product category (Artemia/live feed, Chlorella/microalgae, salmon ova/eyed eggs, sea bass/bream, fish meal, wheat gluten), check how real industry sources in that market actually refer to it — competitor/supplier sites selling into that market, local trade publications, or industry association materials in that language. Use the term the target audience actually searches for and recognizes, which also improves local SEO. If market research is inconclusive, use the dictionary term from §3 below and note the uncertainty.
5. **Easy to understand, still authoritative.** B2B ≠ needlessly complex. Prefer the clearer of two equally correct technical terms; don't pad sentences to sound more "formal" if it hurts comprehension.

---

## 3. Terminology Dictionaries & Prompts by Language

### 🇩🇪 German B2B Editor

- **Market default:** Germany (DACH region terminology unless targeting Austria/Switzerland specifically).
- **Core Rule:** Maintain objective, engineering-focused tone using formal _Sie_ address.
- **Aquaculture Terms:**
  - _Eyed eggs / Eyed ova_ $\rightarrow$ **Augenpunkteier** (Not "Eier mit Augen")
  - _Live feed_ $\rightarrow$ **Lebendfutter**
  - _Artemia cysts_ $\rightarrow$ **Artemia-Zysten**
  - _Rotifers_ $\rightarrow$ **Rädertierchen**
  - _Recirculating Aquaculture System (RAS)_ $\rightarrow$ **Kreislaufanlage (KLA / RAS)**
- **Localization notes:** German compound words and formal phrasing run 20-35% longer than English — verify buttons/badges/grids aren't clipped (see §4).

### 🇸🇦 Arabic B2B Editor

- **Market default:** Modern Standard Arabic (MSA), understood across MENA/GCC B2B audiences; avoid dialect-specific vocabulary.
- **Core Rule:** Flowing, authoritative register using standard modern Arabic vocabulary.
- **Aquaculture Terms:**
  - _Eyed eggs / Eyed ova_ $\rightarrow$ **البيض الملقح في الطور العيني** (Not "بيض بعيون")
  - _Live feed_ $\rightarrow$ **الأعلاف الحية**
  - _Artemia cysts_ $\rightarrow$ **حويصلات الأرتيميا**
  - _Rotifers_ $\rightarrow$ **الروتيفير / الدولابيات**
  - _Biosecurity_ $\rightarrow$ **الأمن الحيوي**
- **Localization notes:** Full RTL layout required (see §4) — this is the one language on this site needing directional, not just textual, localization.

### 🇯🇵 Japanese B2B Editor

- **Market default:** Japan; Japanese aquaculture/hatchery industry terminology (distinct from Chinese kanji usage for the same concepts).
- **Core Rule:** Use standard corporate polite form (敬体 - _Desu/Masu_) showing extreme respect.
- **Aquaculture Terms:**
  - _Eyed eggs / Eyed ova_ $\rightarrow$ **発眼卵** (Not "目のある卵")
  - _Live feed_ $\rightarrow$ **生餌 / 生き餌**
  - _Artemia cysts_ $\rightarrow$ **アルテミア耐久卵 / アルテミアシスト**
  - _Rotifers_ $\rightarrow$ **ワムシ**
  - _Biosecurity_ $\rightarrow$ **バイオセキュリティ / 防疫**
- **Localization notes:** CJK line-break and font handling required (see §4).

### 🇰🇷 Korean B2B Editor

- **Market default:** South Korea — this is an active market for VARS (South Korea salmon-egg/olive-flounder supply per this site's own content), so terminology should match what Korean hatchery buyers actually search for.
- **Core Rule:** Polite B2B honorifics (하십시오체).
- **Aquaculture Terms:**
  - _Eyed eggs / Eyed ova_ $\rightarrow$ **발안란**
  - _Live feed_ $\rightarrow$ **생먹이**
  - _Artemia cysts_ $\rightarrow$ **아르테미아 내구란 / 아르테미아 시스트** (corrected 2026-08-04: this entry previously read 알테미아, which is the informal hobby-retail spelling. 아르테미아 is the standard Korean transliteration used by [Korean Wikipedia](https://ko.wikipedia.org/wiki/아르테미아) and already used by the `/products` portfolio keys.)
  - _Rotifers_ $\rightarrow$ **로티퍼 / 윤충류**
- **Localization notes:** CJK line-break and font handling required (see §4).

### 🇷🇺 Russian B2B Editor

- **Market default:** Russia/CIS B2B aquaculture and feed trade.
- **Core Rule:** Direct, technical style. Avoid wordy, loose expressions.
- **Aquaculture Terms:**
  - _Eyed eggs / Eyed ova_ $\rightarrow$ **Икра на стадии глазка**
  - _Live feed_ $\rightarrow$ **Живые корма**
  - _Artemia cysts_ $\rightarrow$ **Цисты артемии**
  - _Rotifers_ $\rightarrow$ **Коловратки**
- **Localization notes:** Case-heavy grammar can lengthen technical phrases — check grid/badge clipping (see §4).

### 🇹🇷 Turkish B2B Editor

- **Market default:** Türkiye — VARS's home market; this is the site's highest-scrutiny locale since real Turkish partners (Kılıç Deniz, Abalıoğlu, Akvatek, Nordzee, Sürsan, Gümüşdoğa) are named on-site. Terminology should match what these companies themselves use publicly.
- **Core Rule:** Corporate siz-dili register.
- **Aquaculture Terms:**
  - _Eyed eggs / Eyed ova_ $\rightarrow$ **Gözlenmiş yumurta**
  - _Live feed_ $\rightarrow$ **Canlı yem**
  - _Artemia cysts_ $\rightarrow$ **Artemia kistleri**
  - _Rotifers_ $\rightarrow$ **Rotiferler**
- **Localization notes:** Verify Turkish-specific characters render correctly everywhere (see §4).

### 🇨🇳 Chinese B2B Editor

- **Market default:** Mainland China, Simplified Chinese script. If Taiwan/Hong Kong/Singapore traditional-script audiences are ever targeted, treat as a separate locale rather than reusing this dictionary.
- **Core Rule:** Standard Simplified Chinese corporate B2B register.
- **Aquaculture Terms:**
  - _Eyed eggs / Eyed ova_ $\rightarrow$ **发眼卵**
  - _Live feed_ $\rightarrow$ **鲜活饵料 / 活体饲料**
  - _Artemia cysts_ $\rightarrow$ **丰年虫卵 / 卤虫卵**
  - _Rotifers_ $\rightarrow$ **轮虫**
  - _Recirculating Aquaculture System (RAS)_ $\rightarrow$ **循环水养殖系统**
  - _Biosecurity_ $\rightarrow$ **生物安全**
- **Localization notes:** CJK line-break and font handling required (see §4).

### 🇪🇸 Spanish B2B Editor

- **Market default:** Confirm whether the audience is Spain (Iberian Spanish) or Latin America (e.g. Ecuador/Mexico, both real shrimp-sourcing markets referenced in this project) before translating — vocabulary and register differ. Default to neutral/international Spanish when the market isn't specified, and flag the ambiguity rather than silently picking one.
- **Core Rule:** Formal B2B Spanish using standard polite *usted* address.
- **Aquaculture Terms:**
  - _Eyed eggs / Eyed ova_ $\rightarrow$ **Ovas con ojos / Ovas oculadas**
  - _Live feed_ $\rightarrow$ **Alimento vivo**
  - _Artemia cysts_ $\rightarrow$ **Cistes de artemia / Quistes de artemia**
  - _Rotifers_ $\rightarrow$ **Rotíferos**
  - _Recirculating Aquaculture System (RAS)_ $\rightarrow$ **Sistemas de Recirculación en Acuicultura (RAS)**
  - _Biosecurity_ $\rightarrow$ **Bioseguridad**
- **Localization notes:** Accented character encoding integrity (see §4).

---

## 3b. Species names are never transcreated

A species name is a regulatory identifier, not marketing copy. EU catch
labelling (Reg. 1379/2013) requires the commercial designation **and** the
scientific name, and VARS ships against TRACES, CoA and Certificates of Origin
— so naming a fish as a species it is not is a compliance exposure, not a
style choice.

**Rule.** Use an established native commercial designation only where one
exists for *that exact species*. Where none exists, keep the international
trade name and let `latinName` carry the identification. Never borrow the name
of a different commercial species because it looks similar or sells better.

**Precedent — olive flounder (*Paralichthys olivaceus*), fixed 2026-08-06.**
Turkish read *Kore Kalkan Balığı* and Spanish *Rodaballo Coreano*. `Kalkan
balığı` and `rodaballo` are both **turbot, *Scophthalmus maximus*** — a
different family (Scophthalmidae vs Paralichthyidae) and a higher-priced fish,
so the labels read as species upgrading. Resolved as:

| Locale | Name | Why |
|---|---|---|
| tr | Japon Pisi Balığı (Olive Flounder) | `pisi` is the flounder family; Türkiye does not trade this species, so there is no official designation |
| es | Olive Flounder | `rodaballo`, `lenguado` and `platija japonesa` all belong to other species — the EU names database assigns *platija japonesa* to *Hippoglossoides elassodon* |
| de / ru / ar | Olivenflunder / Оливковая камбала / المفلطح الزيتوني | descriptive, no collision |
| ja / ko / zh | ヒラメ / 광어 (넙치) / 牙鲆 | genuine established names for this exact species |

Origin belongs in the specifications, not the product name: buyers search
*olive flounder*, not *Korean olive flounder*. Keep origin variants in
`seoKeywords`/`searchSynonyms` so the search traffic survives the rename.

**Precedent — meagre (*Argyrosomus regius*), fixed 2026-08-07.** The catalogue
sold *A. regius* but named it **Brown Meagre / *Sciaena umbra*** in every
locale — a different species in the same family, smaller and of lower
commercial value. Turkish read *Eşkina (Kaya Levreği)*, which is precisely
*S. umbra*; the correct Turkish for *A. regius* is **Sarıağız**, and it is the
one actually farmed in Aegean cages. The `seoKeywords` had listed *Argyrosomus
regius* and *Corvina wholesale* all along, so the error was in the display
names, not in what the business sells. The slug `brown-meagre` was itself a
species claim and now 301s to `/products/seafood/meagre`.

| Locale | Name | Why |
|---|---|---|
| en | Meagre | Established designation for *A. regius* |
| tr | Sarıağız | Verified; *Eşkina* is *S. umbra*, a separate traded species |
| es | Corvina | EU designation for *A. regius*; *Corvina Negra* was *S. umbra* |
| de | Adlerfisch | Standard German usage; *Meerrabe* was *S. umbra* |
| ru / ar / ja / ko / zh | Meagre (*Argyrosomus regius*) | No designation confirmed for this exact species — international trade name retained per the rule above, pending a native-market check |

Lesson worth keeping: "brown meagre" and "meagre" differ by one adjective and
by a whole species. Where two commercial names sit that close, verify against
the EU database before either is written down.

When a species name is uncertain, check the
[EU commercial designations database](https://fish-commercial-names.ec.europa.eu/)
rather than a dictionary, and record the ruling here.

---

## 4. Localization Standards & Developer Hand-off Checklist

Follow established web i18n standards, not ad hoc choices:

1. **RTL Directionality (Arabic) — per [W3C Internationalization](https://www.w3.org/International/):**
   - Ensure the layout switches to `dir="rtl"` mode (this repo already sets `dir` per language in `I18nContext` — verify it, don't hardcode `ltr` anywhere new).
   - Verify alignment of checkmarks, arrows, and table column headers mirrors correctly.
2. **Linguistic Expansion (German / Russian / Spanish):**
   - Ensure that buttons and grids accommodate German compound words or longer Spanish/Russian phrases without clipping. Design for ~35% length growth over English as a rule of thumb.
3. **Line Break Adjustments & Typography (Japanese / Chinese):**
   - Verify that header lines wrap logically rather than dividing characters in the middle of standard words. Set CJK font families and adjust line heights to `1.5-1.7` for dense Kanji/Hanzi.
4. **Encoding Integrity (Turkish / Spanish):**
   - Double-check character rendering to prevent glitches with accented letters (`ğ`, `ş`, `ç`, `ı`, `ö`, `ü` in Turkish, and `á`, `é`, `í`, `ó`, `ú`, `ñ` in Spanish).
5. **Locale-correct formatting:**
   - Dates, decimals, and units follow the target locale's convention (e.g. decimal comma vs. decimal point), not the English source's formatting, when displaying numbers outside of a fixed technical spec table.
6. **`hreflang` / SEO:** every locale variant of a page must carry the correct reciprocal `hreflang` set (already enforced site-wide per `doc/quality_assurance.md` §2) — a new translated page/post must not be added without it.
7. **Fact preservation:** cross-check `.claude/skills/scientific-content-review/SKILL.md` — a translation must never introduce a claim, number, or nuance that wasn't in the reviewed English source.
