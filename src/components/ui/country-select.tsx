import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { COUNTRY_CODES, PRIORITY_COUNTRY_CODES, countryName } from "@/lib/countries";

/**
 * Searchable country picker.
 *
 * A native <select> of ~195 entries is a scroll on desktop and a full-screen
 * wheel on mobile, and typing only jumps to the first letter — a buyer looking
 * for the United Arab Emirates has to know the list files it under U. This is a
 * combobox instead: type any part of the name and the list narrows.
 *
 * Matching also covers the English name and the ISO code, so "UAE", "Emirates"
 * and "AE" all find the same country even when the interface is in Turkish or
 * Japanese. Buyers write to us in English constantly; the UI language is not a
 * reliable guide to what they will type.
 *
 * The submitted value is the ISO code, carried by a hidden input so plain
 * FormData collection keeps working. Odoo's resolve_country() matches
 * res.country.code exactly, where a localized name would have missed.
 */
export function CountrySelect({
  name,
  label,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  mainGroupLabel,
  allGroupLabel,
  lang,
  error,
  defaultValue = "",
}: {
  name: string;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
  mainGroupLabel: string;
  allGroupLabel: string;
  lang: string;
  error?: string;
  defaultValue?: string;
}) {
  const id = useId();
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Built once per language: the localized label used for display and sorting,
  // plus a lowercase haystack of localized name + English name + ISO code.
  const countries = useMemo(() => {
    const collator = new Intl.Collator(lang);
    const priority = new Set<string>(PRIORITY_COUNTRY_CODES);
    return COUNTRY_CODES.map((code) => {
      const label = countryName(code, lang);
      const english = countryName(code, "en");
      return {
        code,
        label,
        priority: priority.has(code),
        haystack: `${label} ${english} ${code}`.toLowerCase(),
      };
    }).sort((a, b) => {
      // Shipping corridors first, then alphabetical in the reader's own
      // collation — Turkish sorts Ç after C, CJK locales by their own rules.
      if (a.priority !== b.priority) return a.priority ? -1 : 1;
      return collator.compare(a.label, b.label);
    });
  }, [lang]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.haystack.includes(q));
  }, [countries, query]);

  const selectedCountry = countries.find((c) => c.code === selected);

  useEffect(() => setActiveIndex(0), [query, open]);

  // Keep the highlighted row in view when arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex, open]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const choose = (code: string) => {
    setSelected(code);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((i) =>
        filtered.length ? (i + delta + filtered.length) % filtered.length : 0,
      );
    } else if (e.key === "Enter") {
      // Never let Enter submit the form from inside the picker — a buyer
      // narrowing the list would post a half-filled quote.
      e.preventDefault();
      if (open && filtered[activeIndex]) choose(filtered[activeIndex].code);
      else setOpen(true);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      }
    }
  };

  // Only the group directly under the search box is labelled; once a query
  // narrows the list, "Main export markets" no longer describes what is there.
  const showGroups = !query.trim();
  const firstNonPriority = filtered.findIndex((c) => !c.priority);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
      }}
    >
      <label htmlFor={`${id}-btn`} className="text-xs font-bold text-navy">
        {label}
      </label>
      <input type="hidden" name={name} value={selected} />

      <button
        id={`${id}-btn`}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="mt-1 flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border/80 bg-background px-3 text-xs font-semibold text-navy transition-colors hover:bg-surface-alt focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className={selectedCountry ? "text-navy" : "text-muted-foreground font-normal"}>
          {selectedCountry ? selectedCountry.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-border/80 bg-background shadow-xl">
          <div className="flex items-center gap-2 border-b border-border/60 px-3">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              aria-controls={`${id}-list`}
              aria-autocomplete="list"
              aria-activedescendant={
                filtered[activeIndex] ? `${id}-opt-${filtered[activeIndex].code}` : undefined
              }
              className="h-10 w-full bg-transparent text-xs font-semibold text-navy placeholder:font-normal placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            className="max-h-60 overflow-y-auto py-1"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-xs text-muted-foreground">{emptyLabel}</li>
            )}
            {filtered.map((c, i) => (
              <li key={c.code}>
                {showGroups && (i === 0 || i === firstNonPriority) && (
                  <div
                    className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    role="presentation"
                  >
                    {i === 0 ? mainGroupLabel : allGroupLabel}
                  </div>
                )}
                <div
                  id={`${id}-opt-${c.code}`}
                  role="option"
                  aria-selected={c.code === selected}
                  data-active={i === activeIndex}
                  // onMouseDown, not onClick: onClick fires after blur, which
                  // has already closed the list by then.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(c.code);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-xs font-semibold ${
                    i === activeIndex ? "bg-primary/10 text-primary" : "text-navy"
                  }`}
                >
                  <span>{c.label}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground">{c.code}</span>
                    {c.code === selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
