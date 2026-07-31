import { type ReactNode, useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Shield, Scale, ScrollText, ChevronRight, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  variant = "light",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  variant?: "light" | "navy";
  children?: ReactNode;
}) {
  return (
    <section
      className={cn("border-b", variant === "navy" ? "bg-navy text-white" : "bg-surface-alt")}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        {eyebrow && (
          <div
            className={cn(
              "mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]",
              variant === "navy" ? "text-mint" : "text-primary",
            )}
          >
            <span
              className={cn(
                "inline-block h-[2px] w-8",
                variant === "navy" ? "bg-mint" : "bg-primary",
              )}
            />
            {eyebrow}
          </div>
        )}
        <h1
          className={cn(
            "max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl",
            variant === "navy" ? "text-white" : "text-navy",
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-4 max-w-2xl text-base md:text-lg",
              variant === "navy" ? "text-white/75" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function Section({
  children,
  band = false,
  className,
  id,
}: {
  children: ReactNode;
  band?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn(band && "bg-surface-alt", className)}>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">{children}</div>
    </section>
  );
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const articleRef = useRef<HTMLElement>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!articleRef.current) return;
    const h2Elements = articleRef.current.querySelectorAll("h2");
    const list: { id: string; text: string }[] = [];

    h2Elements.forEach((h2, idx) => {
      let id = h2.id;
      if (!id) {
        id = `section-${idx + 1}-${
          h2.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || idx
        }`;
        h2.id = id;
      }
      list.push({ id, text: h2.textContent || `Section ${idx + 1}` });
    });

    setHeadings(list);
    if (list.length > 0) setActiveId(list[0].id);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = h2Elements.length - 1; i >= 0; i--) {
        const el = h2Elements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(el.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [children]);

  const LEGAL_NAV = [
    { title: "Privacy Policy", to: "/privacy", icon: Shield },
    { title: "Terms of Service", to: "/terms", icon: Scale },
    { title: "KVKK Aydınlatma", to: "/kvkk-disclosure-text", icon: FileText },
    { title: "Mesafeli Satış", to: "/distance-sales-agreement", icon: ScrollText },
  ];

  return (
    <>
      <PageHero eyebrow="Legal & Compliance" title={title} />
      <Section className="py-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Side Sticky Index Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28 space-y-6">
            {/* TOC Index Card */}
            {headings.length > 0 && (
              <div className="rounded-3xl p-5 border border-border bg-surface-alt/90 shadow-md space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-border/80 text-navy font-display font-bold text-xs uppercase tracking-wider">
                  <List className="h-4 w-4 text-primary" /> Table of Contents
                </div>
                <nav className="space-y-1 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const target = document.getElementById(h.id);
                        if (target) {
                          const yOffset = -100;
                          const y =
                            target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: "smooth" });
                        }
                      }}
                      className={`group flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
                        activeId === h.id
                          ? "bg-navy text-white shadow-sm font-bold pl-3"
                          : "text-muted-foreground hover:text-navy hover:bg-background"
                      }`}
                    >
                      <span className="truncate">{h.text}</span>
                      <ChevronRight
                        className={`h-3 w-3 shrink-0 transition-transform ${activeId === h.id ? "text-mint" : "opacity-0 group-hover:opacity-100"}`}
                      />
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Legal Documents Switcher Card */}
            <div className="rounded-3xl p-5 border border-border bg-background shadow-md space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Legal Agreements
              </div>
              <div className="space-y-1.5">
                {LEGAL_NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-navy hover:bg-surface-alt transition-colors"
                      activeProps={{ className: "bg-primary/10 text-primary font-extrabold" }}
                    >
                      <Icon className="h-4 w-4 text-primary shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Main Legal Text Body */}
          <main className="flex-1 min-w-0">
            <article
              ref={articleRef}
              className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-navy prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border prose-p:text-sm prose-p:leading-relaxed prose-li:text-sm"
            >
              {children}
            </article>
          </main>
        </div>
      </Section>
    </>
  );
}
