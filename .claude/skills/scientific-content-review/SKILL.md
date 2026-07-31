---
name: scientific-content-review
description: Review or write aquaculture/seafood content (blog articles, product nutrition/biology/protocol claims) for scientific and factual accuracy before publishing on the VARS Aquaculture site. Use whenever asked to write, edit, or audit blog posts, product descriptions, nutrition metrics, species biology, or hatchery/feed protocols — or when the user says "content review," "scientific review," or "fact-check."
---

# Scientific content review (VARS Aquaculture)

This project publishes B2B claims about live-feed biology, hatchery protocols, and seafood nutrition. Getting these wrong is a credibility risk with actual customers (hatchery managers, feed formulators). Treat this content with the same rigor as code correctness.

## The core rule

**Never write or edit a technical/scientific claim without grounding it in a real source.** Don't invent plausible-sounding numbers or mechanisms. If you can't verify a claim, say so and ask, rather than silently asserting a "corrected" value.

## Where to look for ground truth, in priority order

1. **Real supplier/lab documents**, if the user has them (proforma invoices, spec sheets, certificates — check `/home/rubuntu/Documents/VARS/Products/<product>/` for this project). These reflect the actual product being sold, not a generic reference.
2. **Named real-world partners' own published data.** This site's homepage lists actual partner producers (Kılıç Deniz, Abalıoğlu, Akvatek, Nordzee, İlknak, Gümüşdoğa) — for Turkish-farmed seafood (sea bass, sea bream, trout, etc.), search for that producer's own published nutrition/species data first; it's more representative than a generic average.
3. **Authoritative reference databases** for nutrition: USDA FoodData Central, or species-specific peer-reviewed data when the species is unusual (e.g. Paralichthys olivaceus / olive flounder — generic "flounder" data can be misleading).
4. **Established aquaculture science** for biological relationships (see the canonical example below) — WebSearch to confirm before relying on background knowledge alone.

If none of these give a confident answer, flag it to the user instead of guessing. Note the confidence level of any claim you do change.

## Canonical example of what NOT to conflate

Chlorella (microalgae) is the direct feed for **rotifer** cultures. Artemia (brine shrimp) is a separate live feed, hatched and fed directly to **fish/shrimp larvae** once they've outgrown rotifers — it does not feed rotifers and doesn't belong in a "boosts rotifer production" claim. (Artemia nauplii *can* legitimately be gut-loaded/enriched with Chlorella before feeding to larvae — that's a different, valid mechanism from "combining them to grow more rotifers.") This exact conflation was found live on this site (a blog post title and a shared product widget) — see `doc/quality_assurance.md` § Content Accuracy Gate for the incident this skill originated from.

## Checklist when reviewing existing content

- [ ] Any nutrition figure (kcal/protein/fat/etc.) — does it match the product's actual form (raw vs. cooked, whole vs. fillet)? Cooked-fish/shellfish nutrition numbers are systematically higher than raw due to water loss — a common silent error.
- [ ] Any figure duplicated verbatim across two different species/products — likely a copy-paste error, not independently sourced data.
- [ ] Any biological/feeding-chain claim — does it correctly distinguish Artemia vs. Chlorella vs. rotifers vs. copepods?
- [ ] Any hatching/incubation parameter (salinity, temperature) — consistent across every page that states it (product page, guide page, blog post)?
- [ ] Any origin/sourcing claim — cross-check against real supplier documents if available, and confirm with the user before publishing country/supplier names (commercial disclosure is a business decision, not just a factual one).
- [ ] Garbled or leftover scraped-citation artifacts (e.g. stray `domain.com+12` tokens, truncated trailing text) — a data-integrity bug distinct from factual accuracy, but should be cleaned up in the same pass.

## Where the content actually lives in this repo

- Blog articles: `src/lib/mock/blog.ts`
- Product data (specs, metrics, applications, descriptions): `src/lib/mock/products.ts`
- Shared per-category "protocol widget" copy: `src/routes/products.$category.$slug.tsx` (`getProductWidgetData`) — this is rendered for every product in a category, so a claim accurate for one product in that category can be wrong for another; branch by `product.slug`/species when the claim isn't universally true for the category.
- Standalone guide pages: `src/routes/*-guide.tsx`, `src/routes/salmonid-ova-solutions.tsx`, etc.
