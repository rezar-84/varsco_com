import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PRODUCTS, CATEGORIES } from "@/lib/mock/products";
import { BLOG_POSTS } from "@/lib/mock/blog";

const BASE_URL = process.env.VITE_SITE_URL || "https://varsco.com";
const LANGS = ["en", "tr", "ar", "de", "ru", "ja", "ko"] as const;

interface Entry {
  path: string;
  changefreq?: "weekly" | "monthly" | "yearly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about-us", changefreq: "monthly", priority: "0.8" },
          { path: "/services-solutions", changefreq: "monthly", priority: "0.8" },
          { path: "/projects", changefreq: "monthly", priority: "0.7" },
          { path: "/seafood-export", changefreq: "monthly", priority: "0.8" },
          { path: "/seafood-export-from-turkey-to-europe", changefreq: "monthly", priority: "0.7" },
          { path: "/contactus", changefreq: "yearly", priority: "0.6" },
          { path: "/request-quote", changefreq: "yearly", priority: "0.7" },
          { path: "/products", changefreq: "weekly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/faqs", changefreq: "yearly", priority: "0.4" },
          { path: "/privacy", changefreq: "yearly", priority: "0.2" },
          { path: "/terms", changefreq: "yearly", priority: "0.2" },
          { path: "/kvkk-disclosure-text", changefreq: "yearly", priority: "0.2" },
          { path: "/distance-sales-agreement", changefreq: "yearly", priority: "0.2" },
        ];

        const catPaths: Entry[] = CATEGORIES.map((c) => ({
          path: `/products/${c.slug}`,
          changefreq: "weekly",
          priority: "0.8",
        }));

        const productPaths: Entry[] = PRODUCTS.map((p) => ({
          path: `/products/${p.category}/${p.slug}`,
          changefreq: "monthly",
          priority: "0.7",
        }));

        const blogPaths: Entry[] = BLOG_POSTS.map((b) => ({
          path: `/blog/${b.categorySlug}/${b.slug}`,
          changefreq: "monthly",
          priority: "0.5",
        }));

        const entries = [...staticPaths, ...catPaths, ...productPaths, ...blogPaths];

        const urls = entries
          .map((e) => {
            const alternates = LANGS.map(
              (l) =>
                `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}${e.path}?lang=${l}" />`,
            ).join("\n");
            return [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              alternates,
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${e.path}" />`,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n");
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
