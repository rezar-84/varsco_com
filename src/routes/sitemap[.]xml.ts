import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PRODUCTS, CATEGORIES } from "@/lib/mock/products";
import { BLOG_POSTS } from "@/lib/mock/blog";
import { ContentApiClient } from "@/lib/api/client";
import type { CatalogItemSummary, LocaleCode } from "@/lib/api/types";

const BASE_URL = process.env.VITE_SITE_URL || "https://varsco.com";
const LANGS = ["en", "tr", "ar", "de", "ru", "ja", "ko", "zh", "es"] as const;

interface Entry {
  path: string;
  locale?: (typeof LANGS)[number];
  alternates?: Partial<Record<(typeof LANGS)[number], string>>;
  changefreq?: "weekly" | "monthly" | "yearly";
  priority?: string;
}

function localizedPath(locale: (typeof LANGS)[number], path: string) {
  return locale === "en" ? path : `/${locale}${path}`;
}

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&apos;", '"': "&quot;" })[character] ??
      character,
  );
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
          { path: "/salmonid-ova-solutions", changefreq: "monthly", priority: "0.8" },
          { path: "/olive-flounder-export", changefreq: "monthly", priority: "0.8" },
          { path: "/coho-salmon-eggs", changefreq: "monthly", priority: "0.7" },
          { path: "/aquariums-and-hobbyists", changefreq: "monthly", priority: "0.6" },
          { path: "/horeca-seafood-middle-east", changefreq: "monthly", priority: "0.7" },
          { path: "/regional-trade-middle-east-europe", changefreq: "monthly", priority: "0.6" },
          { path: "/artemia-cysts-incubation-guide", changefreq: "yearly", priority: "0.6" },
          { path: "/decapsulated-artemia-guide", changefreq: "yearly", priority: "0.6" },
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

        // The store is live Odoo data. Fetch each locale independently so a
        // translated slug is only emitted when that locale actually resolves
        // it. If Odoo is unavailable, keep the stable /shop URL only.
        const shopPaths: Entry[] = [{ path: "/shop", changefreq: "weekly", priority: "0.9" }];
        try {
          const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
          const apiClient = new ContentApiClient({ baseUrl });
          const localizedStore = new Map<
            string,
            { locale: (typeof LANGS)[number]; product: CatalogItemSummary }[]
          >();
          const productsByLocale = new Map<(typeof LANGS)[number], CatalogItemSummary[]>();

          await Promise.all(
            LANGS.map(async (locale) => {
              try {
                const { data } = await apiClient.listStoreProducts(locale as LocaleCode);
                productsByLocale.set(locale, data);
                data.forEach((product) => {
                  const key = String(
                    product.purchase?.product_id ?? product.url_path ?? product.slug,
                  );
                  const records = localizedStore.get(key) ?? [];
                  records.push({ locale, product });
                  localizedStore.set(key, records);
                });
              } catch {
                // A locale may not be enabled in Odoo yet; omit only that
                // locale instead of publishing a guaranteed-bad alternate.
              }
            }),
          );

          localizedStore.forEach((records) => {
            const alternatePaths: Partial<Record<(typeof LANGS)[number], string>> = {};
            records.forEach(({ locale, product }) => {
              alternatePaths[locale] = `/shop/${product.slug}`;
            });
            records.forEach(({ locale, product }) => {
              shopPaths.push({
                path: `/shop/${product.slug}`,
                locale,
                alternates: alternatePaths,
                changefreq: "monthly",
                priority: "0.7",
              });
            });
          });

          const categories = new Map<string, { locale: (typeof LANGS)[number]; slug: string }[]>();
          for (const locale of LANGS) {
            const data = productsByLocale.get(locale) ?? [];
            data.forEach((product) => {
              if (!product.category) return;
              const records = categories.get(product.category.slug) ?? [];
              if (!records.some((record) => record.locale === locale)) {
                records.push({ locale, slug: product.category.slug });
              }
              categories.set(product.category.slug, records);
            });
          }
          categories.forEach((records) => {
            const alternates: Partial<Record<(typeof LANGS)[number], string>> = {};
            records.forEach(({ locale, slug }) => {
              alternates[locale] = `/shop/category/${slug}`;
            });
            records.forEach(({ locale, slug }) => {
              shopPaths.push({
                path: `/shop/category/${slug}`,
                locale,
                alternates,
                changefreq: "weekly",
                priority: "0.8",
              });
            });
          });
        } catch {
          // Store backend not live yet — /shop index still gets listed above.
        }

        const entries = [
          ...staticPaths,
          ...catPaths,
          ...productPaths,
          ...shopPaths,
          ...blogPaths,
        ].filter(
          (entry, index, all) =>
            all.findIndex(
              (candidate) => candidate.path === entry.path && candidate.locale === entry.locale,
            ) === index,
        );

        const urls = entries
          .map((e) => {
            const canonicalPath = e.locale ? localizedPath(e.locale, e.path) : e.path;
            const alternatePaths =
              e.alternates ?? Object.fromEntries(LANGS.map((l) => [l, e.path]));
            const defaultPath = alternatePaths.en ?? e.path;
            const alternates = LANGS.filter((l) => alternatePaths[l])
              .map(
                (l) =>
                  `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(`${BASE_URL}${localizedPath(l, alternatePaths[l]!)}`)}" />`,
              )
              .join("\n");
            return [
              `  <url>`,
              `    <loc>${escapeXml(`${BASE_URL}${canonicalPath}`)}</loc>`,
              alternates,
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${BASE_URL}${defaultPath}`)}" />`,
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
