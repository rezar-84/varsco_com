import { useCallback, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Link2, Search, MessageCircle } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { getLocalizedMeta } from "@/lib/utils/seo";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  type GlossaryCategoryKey,
  type GlossaryTerm,
} from "@/lib/mock/glossary";

export const Route = createFileRoute("/glossary")({
  head: () => ({ meta: getLocalizedMeta("glossary") }),
  component: GlossaryPage,
});

function GlossaryPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<GlossaryCategoryKey | "all">("all");

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

  return (
    <>
      <PageHero
        eyebrow={t("glossary.hero.eyebrow")}
        title={t("glossary.hero.title")}
        description={t("glossary.hero.description")}
      />

      <Section>
        {/* Filter bar */}
        <div className="space-y-5">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("glossary.searchPlaceholder")}
              aria-label={t("glossary.searchPlaceholder")}
              className="h-12 ps-10 bg-background text-sm"
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
        </div>

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
