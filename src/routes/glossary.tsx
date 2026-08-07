import { useCallback, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { PageHero, Section } from "@/components/layout/Page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Link2, Search, MessageCircle } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { activeDict, activeDictLang } from "@/lib/i18n-dict";
import { getLocalizedMeta } from "@/lib/utils/seo";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  type GlossaryCategoryKey,
  type GlossaryTerm,
} from "@/lib/mock/glossary";

/** Same source blog.$category.$slug.tsx uses for absolute URLs in its schema. */
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://varsco.com";

/**
 * Filter state lives in the URL so a filtered view can be linked, bookmarked
 * and crawled. Both are optional — a bare /glossary is the unfiltered set.
 */
const glossarySearchSchema = z.object({
  q: z.string().trim().max(80).optional(),
  cat: z.enum(["live-feed", "hatchery", "salmonid", "health", "feed", "export"]).optional(),
});

/**
 * DefinedTermSet for the whole glossary.
 *
 * Built in head(), which runs outside React, so definitions are read through
 * activeDict() — the same SSR bridge products.$category.$slug.tsx uses — and
 * the schema carries the active locale rather than always English.
 *
 * Worth being straight about the payoff: there is no Google rich result for
 * DefinedTermSet. This buys entity clarity and makes the definitions legible
 * to answer engines; it will not change how the page looks in search.
 */
function glossarySchema() {
  const dict = activeDict();
  const lang = activeDictLang() ?? "en";
  const tr = (slug: string, field: "term" | "definition", fallback: string) =>
    dict[`glossary.term.${slug}.${field}`] || fallback;

  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/glossary`,
    name: dict["glossary.hero.title"] || "Aquaculture Glossary",
    description: dict["glossary.hero.description"] || undefined,
    inLanguage: lang,
    hasDefinedTerm: GLOSSARY.map((e) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/glossary#${e.slug}`,
      name: tr(e.slug, "term", e.term),
      ...(e.abbr ? { alternateName: e.abbr } : {}),
      description: tr(e.slug, "definition", e.definition),
      inDefinedTermSet: `${SITE_URL}/glossary`,
    })),
  };
}

export const Route = createFileRoute("/glossary")({
  validateSearch: (search) => glossarySearchSchema.parse(search),
  head: () => ({
    meta: getLocalizedMeta("glossary"),
    scripts: [
      {
        // Stable id so client-side navigation replaces this block instead of
        // appending a second copy alongside the previous route's schema.
        id: "ld-glossary",
        type: "application/ld+json",
        children: JSON.stringify(glossarySchema()),
      },
    ],
  }),
  component: GlossaryPage,
});

function GlossaryPage() {
  const { t } = useI18n();
  const { q, cat } = Route.useSearch();
  const navigate = useNavigate({ from: "/glossary" });

  const query = q ?? "";
  const activeCat: GlossaryCategoryKey | "all" = cat ?? "all";

  // `replace` so typing does not fill the back button with one entry per
  // keystroke; the shareable URL is the point, not the history trail.
  const setQuery = (next: string) =>
    navigate({ search: (s) => ({ ...s, q: next || undefined }), replace: true });

  const setActiveCat = (next: GlossaryCategoryKey | "all") =>
    navigate({ search: (s) => ({ ...s, cat: next === "all" ? undefined : next }), replace: true });

  /**
   * Entries fall back to the English source when a locale carries no override,
   * matching the convention product copy uses.
   */
  const tg = useCallback(
    (entry: GlossaryTerm, field: "term" | "definition"): string => {
      const key = `glossary.term.${entry.slug}.${field}`;
      const res = t(key);
      return res === key ? entry[field] : res;
    },
    [t],
  );

  const tcat = (key: GlossaryCategoryKey, fallback: string): string => {
    const res = t(`glossary.category.${key}`);
    return res === `glossary.category.${key}` ? fallback : res;
  };

  // Search covers the definition too, not just the term — buyers arrive knowing
  // the concept ("shell in the cysts") far more often than the word ("chorion").
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((e) => {
      if (activeCat !== "all" && e.category !== activeCat) return false;
      if (!q) return true;
      return (
        tg(e, "term").toLowerCase().includes(q) ||
        e.term.toLowerCase().includes(q) ||
        (e.abbr?.toLowerCase().includes(q) ?? false) ||
        tg(e, "definition").toLowerCase().includes(q)
      );
    });
  }, [query, activeCat, tg]);

  const visibleCategories = GLOSSARY_CATEGORIES.filter((c) =>
    matches.some((e) => e.category === c.key),
  );

  // First entry at each initial, in the order the results actually render, so
  // a letter jump always lands on something.
  const letters = useMemo(() => {
    const seen = new Map<string, string>();
    for (const cat of visibleCategories) {
      const inCat = matches
        .filter((e) => e.category === cat.key)
        .sort((a, b) => tg(a, "term").localeCompare(tg(b, "term")));
      for (const e of inCat) {
        const letter = tg(e, "term").charAt(0).toLocaleUpperCase();
        if (!seen.has(letter)) seen.set(letter, e.slug);
      }
    }
    return [...seen.entries()]
      .map(([letter, slug]) => ({ letter, slug }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [matches, visibleCategories, tg]);

  return (
    <>
      <PageHero
        eyebrow={t("glossary.hero.eyebrow")}
        title={t("glossary.hero.title")}
        description={t("glossary.hero.description")}
      />

      {/* Filter bar. Sticky so the category and letter jumps stay reachable
          while scrolling 88 entries, which is the point at which a flat list
          stops being navigable. */}
      <div className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 md:px-6">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("glossary.searchPlaceholder")}
              aria-label={t("glossary.searchPlaceholder")}
              className="h-11 ps-10 bg-background text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <CatChip
              active={activeCat === "all"}
              onClick={() => setActiveCat("all")}
              label={`${t("glossary.filter.all")} (${GLOSSARY.length})`}
            />
            {GLOSSARY_CATEGORIES.map((c) => (
              <CatChip
                key={c.key}
                active={activeCat === c.key}
                onClick={() => setActiveCat(c.key)}
                label={tcat(c.key, c.label)}
              />
            ))}
          </div>

          {/* Letters present in the current result set only — offering a jump
              to a letter with nothing behind it is worse than omitting it. */}
          {letters.length > 1 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {letters.map(({ letter, slug }) => (
                <a
                  key={letter}
                  href={`#${slug}`}
                  className="rounded px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground transition-colors hover:bg-surface-alt hover:text-primary"
                >
                  {letter}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <Section>
        {/* Results */}
        {matches.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground">
            {t("glossary.noResults")} <span className="font-bold text-navy">“{query}”</span>.
          </p>
        ) : (
          <div className="mt-12 space-y-14">
            {visibleCategories.map((cat) => {
              const entries = matches
                .filter((e) => e.category === cat.key)
                .sort((a, b) => tg(a, "term").localeCompare(tg(b, "term")));

              return (
                <div key={cat.key} id={`cat-${cat.key}`} className="scroll-mt-28">
                  <div className="mb-6 flex items-center gap-3 border-b border-border/80 pb-3">
                    <BookOpen className="h-5 w-5 shrink-0 text-primary" />
                    <h2 className="font-display text-xl font-bold text-navy md:text-2xl">
                      {tcat(cat.key, cat.label)}
                    </h2>
                    <span className="ms-auto text-xs font-bold text-muted-foreground">
                      {entries.length}
                    </span>
                  </div>

                  <dl className="grid gap-4 md:grid-cols-2">
                    {entries.map((e) => (
                      <div
                        key={e.slug}
                        id={e.slug}
                        className="card-flat scroll-mt-28 p-5 transition hover:border-primary/60"
                      >
                        <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <a
                            href={`#${e.slug}`}
                            className="group font-display text-base font-bold text-navy hover:text-primary"
                          >
                            {tg(e, "term")}
                            <Link2 className="ms-1.5 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          </a>
                          {e.abbr && (
                            <span className="text-[11px] font-semibold italic text-muted-foreground">
                              {e.abbr}
                            </span>
                          )}
                        </dt>

                        <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {tg(e, "definition")}
                        </dd>

                        {(e.product || e.guide || e.seeAlso?.length) && (
                          <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-3 text-[11px]">
                            {e.product && (
                              <Link
                                to="/products/$category/$slug"
                                params={{ category: e.product.category, slug: e.product.slug }}
                                className="inline-flex items-center font-bold text-primary hover:text-navy"
                              >
                                {t("glossary.viewProduct")}
                                <ArrowRight className="ms-1 h-3 w-3" />
                              </Link>
                            )}
                            {e.guide && (
                              <Link
                                to={e.guide}
                                className="inline-flex items-center font-bold text-primary hover:text-navy"
                              >
                                {t("glossary.readGuide")}
                                <ArrowRight className="ms-1 h-3 w-3" />
                              </Link>
                            )}
                            {e.seeAlso?.length ? (
                              <span className="text-muted-foreground">
                                <span className="font-semibold">{t("glossary.seeAlso")}</span>{" "}
                                {e.seeAlso.map((slug, i) => {
                                  const rel = GLOSSARY.find((g) => g.slug === slug);
                                  if (!rel) return null;
                                  return (
                                    <span key={slug}>
                                      {i > 0 && ", "}
                                      <a
                                        href={`#${slug}`}
                                        className="font-semibold text-navy underline decoration-border underline-offset-2 hover:text-primary"
                                      >
                                        {tg(rel, "term")}
                                      </a>
                                    </span>
                                  );
                                })}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section band>
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">
            {t("glossary.cta.title")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("glossary.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-xl font-bold">
              <Link to="/request-quote">
                <MessageCircle className="me-2 h-4 w-4" /> {t("glossary.cta.quote")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl font-bold">
              <Link to="/blog">
                {t("glossary.cta.blog")} <ArrowRight className="ms-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function CatChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/80 bg-background text-navy hover:border-primary/50 hover:bg-surface-alt"
      }`}
    >
      {label}
    </button>
  );
}
