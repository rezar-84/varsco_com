import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Search } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/mock/products";
import type { Product } from "@/lib/types";
import { useI18n } from "@/context/I18nContext";
import { NotFoundIllustration } from "@/components/visuals/NotFoundIllustration";

/**
 * 404 page that tries to answer the request rather than just reporting failure.
 *
 * The Search Console 404 drilldown showed the shape of real misses: retired
 * product slugs, old category paths, and localized spellings from the previous
 * site. Most carry enough signal in the URL itself to name a likely
 * destination — `/shop/emerald-chlorella-pulver` is unmistakably about
 * Chlorella even though nothing at that path resolves.
 *
 * Anything with a confident mapping is a 301 in lib/legacy-redirects.ts and
 * never reaches here. This handles the rest: guess from the URL, and when the
 * guess is weak, fall back to the catalogue instead of a dead end.
 */

/** Words that appear in every URL and carry no signal about intent. */
const STOPWORDS = new Set([
  "shop",
  "products",
  "product",
  "page",
  "en",
  "tr",
  "ar",
  "de",
  "ru",
  "ja",
  "ko",
  "zh",
  "es",
  "index",
  "html",
  "htm",
  "category",
  "www",
  "com",
  "node",
]);

/**
 * Score products against the tokens in the failed path.
 *
 * Matches the same haystack HeaderSearch builds (title, slug, latin name,
 * tags, seoKeywords, searchSynonyms), so a term that finds a product in the
 * search box finds it here too. Localized slugs are covered because
 * searchSynonyms already carries them.
 */
function guessProducts(pathname: string): Product[] {
  const tokens = pathname
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((tok) => tok.length > 2 && !STOPWORDS.has(tok) && !/^\d+$/.test(tok));
  if (tokens.length === 0) return [];

  const scored = PRODUCTS.map((p) => {
    const haystack = [
      p.title,
      p.slug,
      p.latinName ?? "",
      p.category,
      ...(p.tags ?? []),
      ...(p.seoKeywords ?? []),
      ...(p.searchSynonyms ?? []),
    ]
      .join(" ")
      .toLowerCase();
    // Slug hits weigh double: a token appearing in the slug is far stronger
    // evidence than the same token buried in a keyword list.
    const score = tokens.reduce(
      (acc, tok) => acc + (haystack.includes(tok) ? 1 : 0) + (p.slug.includes(tok) ? 1 : 0),
      0,
    );
    return { product: p, score };
  }).filter((s) => s.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.product);
}

/** Best-selling lines, shown when the URL yields no usable signal. */
const FEATURED_SLUGS = [
  "artemia",
  "super-fresh-chlorella-v12",
  "atlantic-salmon-egg",
  "olive-flounder",
];

export function NotFoundView({ pathname }: { pathname?: string }) {
  const { t } = useI18n();

  const path = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  const guesses = useMemo(() => guessProducts(path), [path]);

  const featured = useMemo(
    () =>
      FEATURED_SLUGS.map((slug) => PRODUCTS.find((p) => p.slug === slug)).filter(
        (p): p is Product => Boolean(p),
      ),
    [],
  );

  // Only claim a match when the URL actually pointed at something.
  const shown = guesses.length > 0 ? guesses : featured;
  const isGuess = guesses.length > 0;

  const tp = (p: Product, field: string, fallback: string): string => {
    const key = `product.${p.slug}.${field}`;
    const res = t(key);
    return res === key ? fallback : res;
  };

  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden border-b border-border/60 bg-surface-alt/50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
          <div className="order-2 md:order-1">
            {/* The status code stated plainly. A visitor who has hit a dead
                link needs to recognise it as one immediately — the fish tells
                the story, but "404" is what people actually look for, and
                support requests are easier when they can quote it. */}
            <div className="mb-5 flex items-center gap-3">
              <span className="font-display text-5xl font-black leading-none text-navy/15 md:text-6xl">
                404
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-surface-alt px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
                {t("notFound.eyebrow")}
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-navy md:text-5xl">
              {t("notFound.title")}
            </h1>

            {/* The path that failed, so the visitor can see what was asked for
                and spot a typo or a truncated link themselves. */}
            {path && path !== "/" && (
              <p className="mt-3 truncate font-mono text-xs text-muted-foreground/80" dir="ltr">
                {path}
              </p>
            )}
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {t("notFound.description")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                <Compass className="h-4 w-4" aria-hidden="true" />
                {t("notFound.cta.catalogue")}
              </Link>
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-surface-alt"
              >
                {t("notFound.cta.quote")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Section shortcuts: a visitor who landed wrong usually wants a
                whole area, not one page. Ordered as the main nav is. */}
            <div className="mt-8 border-t border-border/60 pt-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("notFound.sections")}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to="/products/$category"
                    params={{ category: c.slug }}
                    className="rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-bold text-navy transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {t(`cat.${c.slug}`)}
                  </Link>
                ))}
                <Link
                  to="/shop"
                  className="rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-bold text-navy transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {t("nav.store")}
                </Link>
                <Link
                  to="/blog"
                  className="rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-bold text-navy transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {t("nav.resources")}
                </Link>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <NotFoundIllustration />
          </div>
        </div>
      </section>

      {/* Products: either what the URL was probably after, or the top lines. */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="mb-6 flex items-center gap-2">
          <Search className="h-4 w-4 text-mint-ink" aria-hidden="true" />
          <h2 className="font-display text-xl font-bold text-navy">
            {isGuess ? t("notFound.guess.heading") : t("notFound.featured.heading")}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p) => (
            <Link
              key={p.slug}
              to="/products/$category/$slug"
              params={{ category: p.category, slug: p.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-sm transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-surface-alt/70 p-4">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={tp(p, "title", p.title)}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="font-display text-3xl font-bold text-navy/10">
                    {p.title.slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <h3 className="font-display text-sm font-bold text-navy group-hover:text-primary">
                  {tp(p, "title", p.title)}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {tp(p, "tagline", p.tagline)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
