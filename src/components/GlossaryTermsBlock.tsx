import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { findGlossaryMentions, type GlossaryTerm } from "@/lib/mock/glossary";

/**
 * "Terms in this article" — glossary entries the surrounding copy actually
 * mentions, linked to their definitions.
 *
 * Rendered beside the text rather than woven into it. MarkdownRenderer is a
 * hand-rolled parser, and teaching it to inject links mid-prose while dodging
 * existing links, headings and code would be a large amount of fragile work
 * for a smaller payoff than a clean signpost at the end.
 *
 * Renders nothing when the copy mentions no terms, so it never appears as an
 * empty box on a page it has nothing to say about.
 */
export function GlossaryTermsBlock({
  text,
  headingKey = "glossary.mentions.heading",
  limit = 6,
}: {
  /** Copy to scan — article body, product description, or several joined. */
  text: string;
  headingKey?: string;
  limit?: number;
}) {
  const { t } = useI18n();
  const terms: GlossaryTerm[] = findGlossaryMentions(text, limit);
  if (terms.length === 0) return null;

  /** Falls back to the English source, matching the glossary page's own tg(). */
  const label = (entry: GlossaryTerm): string => {
    const key = `glossary.term.${entry.slug}.term`;
    const res = t(key);
    return res === key ? entry.term : res;
  };

  return (
    <aside className="mt-10 rounded-2xl border border-border/80 bg-surface-alt p-5">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 shrink-0 text-primary" />
        <h3 className="font-display text-sm font-bold text-navy">{t(headingKey)}</h3>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {terms.map((entry) => (
          <li key={entry.slug}>
            <Link
              to="/glossary"
              hash={entry.slug}
              className="inline-flex items-center rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-primary hover:text-primary"
            >
              {label(entry)}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/glossary"
        className="mt-3 inline-flex items-center text-xs font-bold text-primary hover:text-navy"
      >
        {t("glossary.mentions.cta")} <ArrowRight className="ms-1 h-3 w-3" />
      </Link>
    </aside>
  );
}
