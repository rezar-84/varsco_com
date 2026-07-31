import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, BookOpen, Flame } from "lucide-react";
import { BLOG_POSTS } from "@/lib/mock/blog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BlogWidgetProps {
  title?: string;
  eyebrow?: string;
  limit?: number;
  category?: string;
  variant?: "grid" | "compact";
}

export function BlogWidget({
  title = "Aqua MAG — Latest Technical Reports",
  eyebrow = "Journal & Research",
  limit = 3,
  category,
  variant = "grid",
}: BlogWidgetProps) {
  const posts = (
    category ? BLOG_POSTS.filter((p) => p.categorySlug === category) : BLOG_POSTS
  ).slice(0, limit);

  if (!posts.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-widest mb-2">
            <BookOpen className="h-3.5 w-3.5 text-mint" /> {eyebrow}
          </div>
          <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">{title}</h2>
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-navy transition-colors"
        >
          Explore Aqua MAG Library <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div
        className={
          variant === "compact" ? "grid gap-4 md:grid-cols-3" : "grid gap-6 md:grid-cols-3"
        }
      >
        {posts.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$category/$slug"
            params={{ category: post.categorySlug, slug: post.slug }}
            className="glass-card rounded-2xl overflow-hidden border border-border/80 bg-background shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {post.image && (
                <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-navy/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                    {post.category}
                  </div>
                </div>
              )}

              <div className="p-5 space-y-2">
                <h3 className="font-display text-base font-bold leading-snug text-navy group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 mt-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-navy text-[10px] font-bold text-white">
                    {post.authorInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-navy text-[11px]">{post.author}</span>
              </div>
              <span className="flex items-center gap-1 font-semibold text-primary text-[11px]">
                <Clock className="h-3 w-3" /> {post.readMinutes} min
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
