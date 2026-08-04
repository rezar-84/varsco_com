import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Section } from "@/components/layout/Page";
import { getCurrentLocale } from "@/lib/utils/locale";
import { getPost, BLOG_POSTS, getLocalizedPost } from "@/lib/mock/blog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
  BookOpen,
  User,
  Clock,
} from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { PRODUCTS } from "@/lib/mock/products";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/context/I18nContext";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$category/$slug")({
  loader: ({ params }) => {
    // Pass the locale: head() builds the <title>, description, og: tags and
    // BlogPosting JSON-LD from loaderData, so without it every locale's
    // metadata stayed English even where the visible article was translated.
    const post = getPost(params.slug, getCurrentLocale());
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) return {};
    const post = loaderData.post;
    const siteUrl = import.meta.env.VITE_SITE_URL || "https://varsco.com";
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      inLanguage: getCurrentLocale(),
      headline: post.title,
      description: post.excerpt,
      image: post.image ? `${siteUrl}${post.image}` : undefined,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: post.author,
        jobTitle: post.authorInitials === "VA" ? "Technical Advisor" : "Logistics Director",
        worksFor: {
          "@type": "Organization",
          name: "VARS Aquaculture",
        },
      },
      publisher: {
        "@type": "Organization",
        name: "VARS Aquaculture",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/vars-logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteUrl}/blog/${post.categorySlug}/${post.slug}`,
      },
    };
    return {
      meta: [
        { title: `${post.title} | Aqua MAG` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.date },
        { property: "article:author", content: post.author },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: Article,
});

function Article() {
  const { post: rawPost } = Route.useLoaderData() as { post: BlogPost };
  const { t, lang } = useI18n();
  const post = getLocalizedPost(rawPost, lang);

  // Find related articles in same category, or fallback to latest posts
  const localizedPosts = BLOG_POSTS.map((p) => getLocalizedPost(p, lang));
  let relatedPosts = localizedPosts.filter(
    (p) => p.categorySlug === post.categorySlug && p.slug !== post.slug,
  );
  if (relatedPosts.length < 3) {
    const extraPosts = localizedPosts.filter(
      (p) => p.slug !== post.slug && !relatedPosts.some((r) => r.slug === p.slug),
    );
    relatedPosts = [...relatedPosts, ...extraPosts].slice(0, 3);
  }

  // Social Share event handlers
  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
        "_blank",
      );
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== "undefined") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        "_blank",
      );
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Determine CTA block based on category
  const getCtaBlock = () => {
    if (
      post.categorySlug === "feed-nutrition" ||
      post.categorySlug === "feed-innovation-sustainability-8" ||
      post.categorySlug === "hatchery-feed-design-6"
    ) {
      return (
        <div className="glass-panel-dark rounded-3xl border border-mint/20 p-8 relative overflow-hidden shadow-2xl my-10">
          <div className="absolute top-0 right-0 w-36 h-36 bg-mint/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-4 max-w-xl relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-navy text-[10px] font-bold uppercase tracking-widest">
              Inbound Technical Program
            </div>
            <h3 className="font-display text-2xl font-bold text-white leading-tight">
              Optimize Hatchery Live Feed Yields Up to 8x
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Schedule a live consultation with our biotech feed specialists to audit your current
              rotifer and Artemia hatching protocols. Receive a customized SV12 Chlorella trial
              plan.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-mint text-navy hover:bg-mint/90 font-bold rounded-xl px-6"
              >
                <Link to="/contactus" search={{ inquiry: "live-feed" }}>
                  Request Protocol Consultation
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white rounded-xl px-6"
              >
                <Link to="/products" search={{ category: "live-feed-aquaculture" }}>
                  Explore Live Feed Range
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (post.categorySlug === "hatchery-solutions" || post.categorySlug === "aquaculture-10") {
      return (
        <div className="glass-panel-dark rounded-3xl border border-mint/20 p-8 relative overflow-hidden shadow-2xl my-10">
          <div className="absolute top-0 right-0 w-36 h-36 bg-mint/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-4 max-w-xl relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-navy text-[10px] font-bold uppercase tracking-widest">
              Broodstock & Genetics Program
            </div>
            <h3 className="font-display text-2xl font-bold text-white leading-tight">
              Secure Your Eyed Salmon Ova Allocation
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Ensure genetic optimization and biosecure cold-chain logistics for Atlantic or Coho
              salmon eggs. Coordinate shipping slots with our global compliance directors.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-mint text-navy hover:bg-mint/90 font-bold rounded-xl px-6"
              >
                <Link to="/contactus" search={{ inquiry: "salmon-ova" }}>
                  Secure Allocation Slot
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white rounded-xl px-6"
              >
                <Link to="/products" search={{ category: "hatchery-solutions" }}>
                  View Genetics Specifications
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="glass-panel-dark rounded-3xl border border-mint/20 p-8 relative overflow-hidden shadow-2xl my-10">
        <div className="absolute top-0 right-0 w-36 h-36 bg-mint/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-4 max-w-xl relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-navy text-[10px] font-bold uppercase tracking-widest">
            Corporate Sourcing Audit
          </div>
          <h3 className="font-display text-2xl font-bold text-white leading-tight">
            Schedule a Global Export Consultation
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Audit your Incoterm pathways, custom veterinary certifications, and cold-chain
            compliance with our regional export managers.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Button
              asChild
              className="bg-mint text-navy hover:bg-mint/90 font-bold rounded-xl px-6"
            >
              <Link to="/request-quote">Request Custom Quote</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/20 hover:bg-white/10 text-white rounded-xl px-6"
            >
              <Link to="/contactus">Contact Regional Director</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Author bios for authority signals (E-A-T)
  const AUTHOR_BIOS: Record<string, string> = {
    VA: "Holds a Master's degree in Biotechnology and brings 30 years of experience in agriculture, bioengineering, and aquaculture.",
    RR: "Project Manager with an extensive background in the tech industry, overseeing cross-functional delivery and international coordination.",
    FY: "One of the most experienced aquaculture experts in Turkey, having worked with the country's top firms. Well known across the community and sector, with more than 30 years of experience in hatchery and aquaculture.",
  };
  const authorBio = AUTHOR_BIOS[post.authorInitials] ?? AUTHOR_BIOS.RR;

  return (
    <>
      <section className="border-b bg-surface-alt">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 font-semibold overflow-x-auto whitespace-nowrap py-1">
            <Link to="/" className="hover:text-primary transition-colors">
              {t("nav.home") || "Home"}
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-primary transition-colors">
              Aqua MAG
            </Link>
            <span>/</span>
            <Link
              to="/blog/$category"
              params={{ category: post.categorySlug }}
              className="hover:text-primary transition-colors uppercase tracking-wider"
            >
              {post.category}
            </Link>
            <span>/</span>
            <span className="text-navy truncate max-w-[200px]">{post.title}</span>
          </nav>

          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-navy md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-navy text-xs text-white">
                {post.authorInitials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-navy">{post.author}</span>
            <span>·</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{post.readMinutes} min read</span>
          </div>
        </div>
      </section>

      {post.image && (
        <div className="mx-auto max-w-5xl -mt-8 px-4 md:px-6">
          <img
            src={post.image}
            alt={post.title}
            className="aspect-[16/9] w-full rounded-3xl border object-cover shadow-lg"
          />
        </div>
      )}

      <Section>
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <article className="prose prose-neutral max-w-none text-base leading-relaxed">
              <MarkdownRenderer content={post.body} />
            </article>

            {/* Custom Inbound CTA Block */}
            {getCtaBlock()}

            {/* Social Share widget */}
            <div className="mt-12 flex items-center gap-3 border-t pt-6 text-sm text-muted-foreground">
              <Share2 className="h-4 w-4" /> Share:
              <button
                onClick={handleShareTwitter}
                className="rounded p-1 hover:bg-muted cursor-pointer transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="rounded p-1 hover:bg-muted cursor-pointer transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="rounded p-1 hover:bg-muted cursor-pointer transition-colors"
                aria-label="Copy link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8">
            {/* E-A-T Author Bio Card */}
            <div className="glass-card rounded-3xl p-6 border border-border/80 bg-surface-alt/30 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                <User className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-bold text-navy">About the Author</h3>
              </div>
              <div className="flex gap-3 items-start">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-navy text-xs text-white">
                    {post.authorInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xs font-bold text-navy">{post.author}</h4>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{authorBio}</p>
            </div>

            {/* Related Articles Card */}
            <div className="glass-card rounded-3xl p-6 border border-border/80 bg-surface-alt/30 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-bold text-navy">Related Articles</h3>
              </div>
              <div className="space-y-4">
                {relatedPosts.map((r) => (
                  <Link
                    key={r.slug}
                    to="/blog/$category/$slug"
                    params={{ category: r.categorySlug, slug: r.slug }}
                    className="group block space-y-1"
                  >
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                      {r.category}
                    </span>
                    <h4 className="font-display text-xs font-bold text-navy group-hover:text-primary transition-colors leading-snug">
                      {r.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Related Products Section in Magazine Article */}
      <Section band className="border-t border-border/80 bg-surface-alt/40 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Featured Products Mentioned</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy tracking-tight">
                Featured Aqua Inputs & Export Solutions
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Explore premium live feed concentrates, salmonid ova, and certified seafood exports
                referenced in this article.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-navy transition-colors shrink-0 group"
            >
              <span>Explore Product Catalog</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const matched = PRODUCTS.filter((p) => {
                if (post.slug.includes("artemia")) {
                  return [
                    "revive-artemia-cysts-2kg",
                    "revive-decapsulated-artemia",
                    "super-fresh-chlorella-v12",
                  ].includes(p.slug);
                }
                if (post.slug.includes("salmon") || post.slug.includes("ova")) {
                  return [
                    "atlantic-salmon-ova",
                    "triploid-all-female-salmon-ova",
                    "vital-wheat-gluten-82",
                  ].includes(p.slug);
                }
                if (
                  post.slug.includes("export") ||
                  post.slug.includes("seafood") ||
                  post.slug.includes("middle-east")
                ) {
                  return [
                    "mediterranean-sea-bass",
                    "mediterranean-sea-bream",
                    "brown-meagre",
                  ].includes(p.slug);
                }
                return false;
              });
              const displayList = matched.length > 0 ? matched : PRODUCTS.slice(0, 3);
              return displayList.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ));
            })()}
          </div>
        </div>
      </Section>
    </>
  );
}
