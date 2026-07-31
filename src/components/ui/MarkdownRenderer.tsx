import React from "react";
import { Link } from "@tanstack/react-router";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split by paragraph blocks
  const blocks = content.split(/\n\n+/);

  const renderInline = (text: string) => {
    // Parse links: [text](url) and bold text: **text**
    const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        if (href.startsWith("/")) {
          return (
            <Link key={idx} to={href} className="font-semibold text-mint underline decoration-mint/40 underline-offset-2 hover:decoration-mint">
              {label}
            </Link>
          );
        }
        return (
          <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-mint underline decoration-mint/40 underline-offset-2 hover:decoration-mint">
            {label}
          </a>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="font-bold text-navy">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 text-navy/90">
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 0. Parse Images
        if (trimmed.startsWith("![") && trimmed.includes("](") && trimmed.endsWith(")")) {
          const match = trimmed.match(/^!\[([^\]]*)\]\(([^)]*)\)$/);
          if (match) {
            const alt = match[1];
            const src = match[2];
            return (
              <div key={blockIdx} className="my-6 overflow-hidden rounded-2xl border border-border/80 bg-background shadow-md max-w-2xl mx-auto">
                <img src={src} alt={alt} className="w-full object-cover max-h-[400px]" />
                {alt && (
                  <div className="bg-surface-alt/40 border-t p-2.5 text-center text-xs text-muted-foreground font-semibold">
                    {alt}
                  </div>
                )}
              </div>
            );
          }
        }

        // 1. Parse Headings
        if (trimmed.startsWith("###")) {
          return (
            <h3 key={blockIdx} className="font-display text-xl font-bold text-navy mt-6 mb-2">
              {renderInline(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h2 key={blockIdx} className="font-display text-2xl font-bold text-navy mt-8 mb-3 border-b pb-2">
              {renderInline(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h1 key={blockIdx} className="font-display text-3xl font-bold text-navy mt-10 mb-4">
              {renderInline(trimmed.replace(/^#\s+/, ""))}
            </h1>
          );
        }

        // 2. Parse Lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split(/\n[*-]\s+/);
          // clean first item prefix
          items[0] = items[0].replace(/^[*-]\s+/, "");
          return (
            <ul key={blockIdx} className="list-disc pl-5 space-y-2 my-4 text-muted-foreground">
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        // 3. Parse Tables
        if (trimmed.startsWith("|") && trimmed.includes("\n|")) {
          const lines = trimmed.split("\n").filter(l => l.trim().startsWith("|"));
          if (lines.length >= 2) {
            // Find headers
            const headerCells = lines[0]
              .split("|")
              .map(c => c.trim())
              .filter((c, i, a) => i > 0 && i < a.length - 1);
            
            // Find data rows (skip separator row like | :--- | :--- |)
            const rows = lines.slice(1)
              .filter(l => !l.includes("---"))
              .map(l => 
                l.split("|")
                  .map(c => c.trim())
                  .filter((c, i, a) => i > 0 && i < a.length - 1)
              );

            return (
              <div key={blockIdx} className="my-6 overflow-hidden rounded-2xl border border-white/20 bg-surface-alt/40 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-navy/5 border-b border-white/20">
                      {headerCells.map((h, idx) => (
                        <th key={idx} className="p-3 text-xs font-bold text-navy uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm">
                    {rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-white/10 transition-colors">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="p-3 text-navy/80 font-medium">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // 4. Custom Chart blocks (Render charts beautifully)
        // If we detect specific keywords for visual charts
        if (trimmed.includes("Rotifer Yield") && trimmed.includes("350%") && trimmed.includes("800%")) {
          return (
            <div key={blockIdx} className="my-8 rounded-3xl border border-white/20 bg-gradient-to-br from-navy to-navy-light p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-mint/10 rounded-full blur-2xl pointer-events-none" />
              <h4 className="font-display text-lg font-bold text-white mb-2">Rotifer Sourcing Efficiency Comparison</h4>
              <p className="text-xs text-white/70 mb-6">Comparison of rotifer production yield in a standard 3-day culture cycle.</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-white/80">Standard Industry Production (Before Optimization)</span>
                    <span className="text-red-400 font-bold">350% (3.5x Yield)</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-red-400 h-full rounded-full transition-all duration-1000" style={{ width: "35%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-white/80">VARS Algae Protocol (Fresh Chlorella SV12)</span>
                    <span className="text-mint font-bold">800% (8.0x Yield)</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-mint to-teal-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(45,212,191,0.3)]" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-[10px] text-white/50">
                <span>* Measured in average industrial trials.</span>
                <span>Source: VARS Biotech R&D Lab</span>
              </div>
            </div>
          );
        }

        if (trimmed.includes("Price vs. Performance") || (trimmed.includes("Artemia") && trimmed.includes("Viable larva") && trimmed.includes("US Artemia"))) {
          return (
            <div key={blockIdx} className="my-8 rounded-3xl border border-white/20 bg-gradient-to-br from-navy to-navy-light p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-mint/10 rounded-full blur-2xl pointer-events-none" />
              <h4 className="font-display text-lg font-bold text-white mb-2">Artemia Sourcing Cost-to-Performance Index</h4>
              <p className="text-xs text-white/70 mb-6">Normalized cost per viable surviving larva (Lower index indicates superior economics).</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-white/80">Premium US Artemia Sourcing</span>
                    <span className="text-white font-bold">100 (Baseline Cost)</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-white/40 h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-white/80">Aral Sea Artemia + Fresh Chlorella SV12 Protocol</span>
                    <span className="text-mint font-bold">60 (40% Cost Reduction)</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-mint to-teal-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(45,212,191,0.3)]" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-[10px] text-white/50">
                <span>* Represents cost per million larvae.</span>
                <span>Source: Commercial Hatchery Trial (2025)</span>
              </div>
            </div>
          );
        }

        // 5. Default: Paragraph
        return (
          <p key={blockIdx} className="text-navy/80 leading-relaxed text-base font-normal my-4">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
