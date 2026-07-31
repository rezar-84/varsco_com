import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BLOG_POSTS } from "@/lib/mock/blog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen,
  Clock,
  ChevronRight,
  Mail,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { getSeoMeta } from "@/lib/utils/seo";

export const Route = createFileRoute("/blog/")({
  head: () => {
    const meta = getSeoMeta("blog");
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
      ],
    };
  },
  component: BlogIndex,
});

function BlogIndex() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const CATEGORIES = [
    { id: "all", label: "All Journal Articles" },
    { id: "aquaculture-10", label: "Aquaculture 101 & Fundamentals" },
    { id: "hatchery-feed-design-6", label: "Hatchery & Feed Engineering" },
    { id: "feed-innovation-sustainability-8", label: "Feed Innovation & Microalgae" },
    { id: "vars-company-1", label: "Company & Industry Milestones" },
    { id: "projects-4", label: "Field Projects & Trials" },
  ];

  const filteredPosts = BLOG_POSTS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.categorySlug === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0]; // First main cover story
  const editorsPicks = BLOG_POSTS.slice(1, 4); // 3 picks for sidebar
  const showFeaturedHero = selectedCategory === "all" && searchQuery.trim() === "";
  const gridPosts = showFeaturedHero
    ? filteredPosts.filter((p) => p.slug !== featuredPost.slug)
    : filteredPosts;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          company: "N/A",
          email: newsletterEmail,
          message: "Requested to subscribe to the Aqua MAG Journal newsletter.",
          source: "Blog Newsletter Signup",
          items: [],
        }),
      });
      if (!response.ok) {
        const errBody = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errBody.error || "Failed to subscribe. Please try again.");
      }
      toast.success("Subscribed to Aqua MAG Journal", {
        description: "You will receive quarterly technical intelligence digests and PDF reports.",
      });
      setNewsletterEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Editorial Journal Masthead */}
      <section className="border-b border-border/80 bg-navy text-white relative overflow-hidden py-14">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/15 text-mint text-xs font-bold uppercase tracking-widest mb-3">
                <BookOpen className="h-3.5 w-3.5" /> Peer-Reviewed & Technical Reports
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none">
                AQUA <span className="text-mint font-light">MAG</span>
              </h1>
              <p className="mt-2 text-sm text-white/80 max-w-xl font-medium">
                International Review of Aquaculture Science, Hatchery Engineering & Seafood
                Biotechnology
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-mint" /> ISSN 2984-1029
              </span>
              <span>•</span>
              <span>Quarterly Review</span>
              <span>•</span>
              <span className="text-mint font-bold">Vol. VIII · Issue 24</span>
            </div>
          </div>

          {/* Editorial Category Navigation Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.id === "all" ? "/blog" : "/blog/$category"}
                params={cat.id === "all" ? undefined : { category: cat.id }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-mint text-navy shadow-md scale-105"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Magazine Layout Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 space-y-16">
        {/* Top Hero Editorial Section (8:4 Layout) */}
        {showFeaturedHero && (
          <section className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Featured Article Cover Story (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between glass-card rounded-3xl overflow-hidden border border-border/80 bg-background shadow-xl hover:shadow-2xl transition-all duration-300">
              <Link
                to="/blog/$category/$slug"
                params={{ category: featuredPost.categorySlug, slug: featuredPost.slug }}
                className="group relative flex-1 flex flex-col"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-muted relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md">
                    <Flame className="h-3.5 w-3.5 fill-current" /> Featured Cover Story
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-mint">
                      <span>{featuredPost.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {featuredPost.readMinutes} min read
                      </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight group-hover:text-mint transition-colors">
                      {featuredPost.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-4 bg-background">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="float-left text-3xl font-display font-bold text-navy leading-none mr-2">
                      E
                    </span>
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/60">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback className="bg-navy text-xs font-bold text-white">
                          {featuredPost.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs font-bold text-navy">{featuredPost.author}</div>
                        <div className="text-[11px] text-muted-foreground">
                          Technical Editor · Aqua MAG
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Read Full Article <ArrowUpRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Editor's Picks & Technical Reports Sidebar (4 Cols) */}
            <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-border/80 bg-surface-alt/50 shadow-md flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 pb-4 border-b border-border/60">
                  <Award className="h-5 w-5 text-mint" />
                  <h3 className="font-display text-lg font-bold text-navy">
                    Editor's Picks & Briefs
                  </h3>
                </div>

                <div className="divide-y divide-border/60">
                  {editorsPicks.map((pick) => (
                    <Link
                      key={pick.slug}
                      to="/blog/$category/$slug"
                      params={{ category: pick.categorySlug, slug: pick.slug }}
                      className="group block py-4 space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                        <span className="text-primary uppercase tracking-wider">
                          {pick.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {pick.readMinutes}m
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-navy group-hover:text-primary transition-colors leading-snug">
                        {pick.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {pick.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-navy text-white space-y-2">
                <div className="text-xs font-bold text-mint flex items-center gap-1.5">
                  <Award className="h-4 w-4" /> Peer-Reviewed Standards
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  All technical protocols, CPG calculations, and hatching parameters published in
                  Aqua MAG are validated across operational Aegean and East Asian marine hatcheries.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Magazine Article Grid Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/60">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy">
                {selectedCategory === "all"
                  ? "Latest Technical Issues"
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Showing {gridPosts.length} Articles
              </p>
            </div>

            {/* Real-time search bar */}
            <div className="relative w-full sm:w-72">
              <Input
                type="text"
                placeholder="Search articles by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-alt border-border rounded-xl text-xs h-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <Link
                key={post.slug}
                to="/blog/$category/$slug"
                params={{ category: post.categorySlug, slug: post.slug }}
                className="glass-card rounded-2xl overflow-hidden border border-border/80 bg-background shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-navy/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-display text-base font-bold text-navy leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
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
                    <span className="font-medium text-navy">{post.author}</span>
                  </div>

                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Clock className="h-3 w-3" /> {post.readMinutes} min
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Expert Editorial Board & Authors */}
        <section className="space-y-8 my-16">
          <div className="border-b border-border pb-4">
            <h2 className="font-display text-2xl font-bold text-navy">Expert Editorial Board & Authors</h2>
            <p className="text-sm text-muted-foreground mt-1">Our technical contributors are active commercial aquaculture consultants and biologists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Author 1: Vahid */}
            <div className="glass-card rounded-3xl p-6 border border-border bg-surface-alt/20 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-navy text-sm font-bold text-white">VA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-display text-sm font-bold text-navy">Vahid A.</h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Holds a Master's degree in Biotechnology and brings 30 years of experience in agriculture, bioengineering, and aquaculture.
                </p>
              </div>
              <div className="pt-4 border-t border-border/60 text-xs text-primary font-semibold flex items-center justify-between">
                <span>9 Articles Published</span>
              </div>
            </div>

            {/* Author 2: Reza */}
            <div className="glass-card rounded-3xl p-6 border border-border bg-surface-alt/20 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-navy text-sm font-bold text-white">RR</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-display text-sm font-bold text-navy">Reza R.</h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Project Manager with an extensive background in the tech industry, overseeing cross-functional delivery and international coordination.
                </p>
              </div>
              <div className="pt-4 border-t border-border/60 text-xs text-primary font-semibold flex items-center justify-between">
                <span>9 Articles Published</span>
              </div>
            </div>

            {/* Author 3: Faysal */}
            <div className="glass-card rounded-3xl p-6 border border-border bg-surface-alt/20 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-navy text-sm font-bold text-white">FA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-display text-sm font-bold text-navy">Faysal</h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  One of the most experienced aquaculture experts in Turkey, having worked with the country's top firms. Well known across the community and sector, with more than 30 years of experience in hatchery and aquaculture.
                </p>
              </div>
              <div className="pt-4 border-t border-border/60 text-xs text-muted-foreground font-semibold flex items-center justify-between">
                <span>0 Articles Published (Advisory Board)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Journal Newsletter Subscription Block */}
        <section className="glass-card rounded-3xl p-8 sm:p-12 border border-border/80 bg-gradient-to-r from-navy via-navy/95 to-navy/90 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint text-navy text-xs font-bold uppercase tracking-widest">
              <Mail className="h-3.5 w-3.5" /> Technical Intelligence Dispatch
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Subscribe to Quarterly Aqua MAG Digests
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl mx-auto">
              Join over 3,000 hatchery engineers, marine biologists, and aquaculture investors.
              Receive peer-reviewed articles, market trend reports, and PDF datasheets.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your corporate email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
              />
              <Button
                type="submit"
                size="lg"
                className="h-11 rounded-xl font-bold bg-mint text-navy hover:bg-mint/90 shrink-0"
              >
                Subscribe Journal
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
