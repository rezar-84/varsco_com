import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import { getCurrentLocale } from "@/lib/utils/locale";
import { getPostsByCategory, getLocalizedPost } from "@/lib/mock/blog";
import type { BlogPost } from "@/lib/types";
import { Clock, ChevronRight } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/blog/$category/")({
  loader: ({ params }) => {
    const posts = getPostsByCategory(params.category, getCurrentLocale());
    if (posts.length === 0) throw notFound();
    return { posts, categoryTitle: posts[0].category };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.categoryTitle ?? "Category"} — Aqua MAG` }],
  }),
  component: BlogCategory,
});

function BlogCategory() {
  const { posts: rawPosts, categoryTitle: rawCategoryTitle } = Route.useLoaderData() as {
    posts: BlogPost[];
    categoryTitle: string;
  };
  const { t, lang } = useI18n();
  const posts = rawPosts.map((p) => getLocalizedPost(p, lang));
  const categoryTitle = posts[0]?.category || rawCategoryTitle;

  return (
    <>
      <PageHero eyebrow="Aqua MAG" title={categoryTitle} />
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$category/$slug"
              params={{ category: p.categorySlug, slug: p.slug }}
              className="group flex flex-col justify-between glass-card rounded-3xl overflow-hidden border border-border/80 bg-background shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-muted relative">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl font-display font-bold text-navy/10">
                    {p.title.slice(0, 2)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                    <span className="text-primary uppercase tracking-wider">{p.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {p.readMinutes}{" "}
                      {t("blog.readMinutesSuffix") === "blog.readMinutesSuffix"
                        ? "min read"
                        : t("blog.readMinutesSuffix")}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-navy group-hover:text-primary transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {p.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(p.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-primary">
                    {t("blog.readArticleLink") === "blog.readArticleLink"
                      ? "Read"
                      : t("blog.readArticleLink")}{" "}
                    <ChevronRight className="ml-0.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
