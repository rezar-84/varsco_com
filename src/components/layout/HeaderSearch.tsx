import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/mock/products";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

export function HeaderSearch({ className }: { className?: string }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => {
      const matchText = [
        p.title,
        p.slug,
        p.latinName ?? "",
        p.description,
        p.category,
        ...(p.tags ?? []),
        ...(p.seoKeywords ?? []),
        ...(p.searchSynonyms ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return matchText.includes(q);
    }).slice(0, 6);
  }, [query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => setActive(0), [query]);

  const go = (idx: number) => {
    const r = results[idx];
    if (!r) return;
    setOpen(false);
    setQuery("");
    navigate({
      to: "/products/$category/$slug",
      params: { category: r.category, slug: r.slug },
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length) go(active);
      else if (query.trim()) {
        setOpen(false);
        navigate({ to: "/products", search: { q: query.trim() } as never });
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const placeholder = t("search.placeholder") || "Search products…";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/50" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-10 w-full rounded-xl border border-border/80 bg-background pl-9 pr-9 text-sm text-navy placeholder:text-muted-foreground placeholder:font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-navy/50 hover:bg-muted hover:text-navy"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border/60 bg-background shadow-[0_20px_60px_-20px_rgba(0,30,64,0.35)]">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t("search.empty") || "No products found"}
            </div>
          ) : (
            <ul className="max-h-[70vh] overflow-y-auto py-1">
              {results.map((p, i) => {
                const cat = CATEGORIES.find((c) => c.slug === p.category);
                return (
                  <li key={`${p.category}-${p.slug}`}>
                    <Link
                      to="/products/$category/$slug"
                      params={{ category: p.category, slug: p.slug }}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm",
                        i === active ? "bg-muted" : "hover:bg-muted/60",
                      )}
                    >
                      <img
                        src={p.thumbnail ?? p.image}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-navy">{p.title}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {cat?.title}
                          {p.latinName ? ` · ${p.latinName}` : ""}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="border-t border-border/60 bg-surface-alt px-3 py-2 text-right">
            <Link
              to="/products"
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="text-xs font-semibold text-primary hover:text-navy"
            >
              {t("search.viewAll") || "View all products →"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
