import { useState, useEffect, useMemo, type ReactNode } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/context/I18nContext";
import { PRODUCTS, CATEGORIES } from "@/lib/mock/products";
import { CountrySelect } from "@/components/ui/country-select";
import type { Product } from "@/lib/types";
import {
  ShieldCheck,
  Package,
  Plane,
  Thermometer,
  Truck,
  Check,
  Sliders,
  AlertCircle,
} from "lucide-react";

export interface QuoteFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  productSlug?: string;
  productTitle?: string;
  customFields?: Record<string, string>;
  message: string;
}

/**
 * `requireQuantity` is on whenever a product is selected. Volume is the first
 * thing sales needs in order to price anything, and no branch of this form used
 * to ask for it — so quotes arrived without the one number that makes them
 * actionable. A general enquiry has no product to quantify, so it stays exempt.
 */
const buildSchema = (t: (k: string) => string, requireQuantity: boolean) =>
  z.object({
    // min(2) matches /api/quotes. At min(1) a single character passed here and
    // was rejected server-side, so the buyer got a failure with no field marked.
    name: z.string().trim().min(2, t("quote.err.name")).max(100, t("quote.err.max")),
    company: z.string().trim().min(2, t("quote.err.company")).max(120, t("quote.err.max")),
    email: z.string().trim().email(t("quote.err.email")).max(200, t("quote.err.max")),
    phone: z.string().trim().min(6, t("quote.err.phone")).max(30, t("quote.err.max")),
    country: z.string().trim().max(80).optional().default(""),
    productSlug: z.string().optional().default(""),
    quantity: requireQuantity
      ? z.string().trim().min(1, t("quote.err.quantity")).max(80, t("quote.err.max"))
      : z.string().trim().max(80).optional().default(""),
    message: z.string().trim().max(1000).optional().default(""),
    consent: z.literal("on", { message: t("quote.err.consent") }),
  });

interface Props {
  busy: boolean;
  initialProductSlug?: string;
  onSubmit: (data: QuoteFormData) => void | Promise<void>;
  Footer?: (props: { children: ReactNode }) => ReactNode;
}

export function QuoteForm({ busy, initialProductSlug, onSubmit, Footer }: Props) {
  const { t, lang } = useI18n();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedSlug, setSelectedSlug] = useState<string>(initialProductSlug || "");
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    initialProductSlug ? PRODUCTS.find((p) => p.slug === initialProductSlug) : undefined,
  );

  // Dynamic Custom Specs Fields
  const [customSpecs, setCustomSpecs] = useState<Record<string, string>>({});
  // Which export format the buyer picked. Drives the size bands and processing
  // options below it, so it resets whenever the product changes.
  const [exportFormKey, setExportFormKey] = useState<string>("");

  useEffect(() => {
    if (initialProductSlug) {
      const prod = PRODUCTS.find((p) => p.slug === initialProductSlug);
      if (prod) {
        setSelectedSlug(prod.slug);
        setSelectedProduct(prod);
        setExportFormKey("");
      }
    }
  }, [initialProductSlug]);

  const handleProductChange = (slug: string) => {
    setExportFormKey("");
    setSelectedSlug(slug);
    const prod = PRODUCTS.find((p) => p.slug === slug);
    setSelectedProduct(prod);
    setCustomSpecs({}); // Reset dynamic specs when product changes
  };

  // Falls back to the English default when no translation override exists.
  const tp = (product: Product, field: "title" | "tagline"): string => {
    const key = `product.${product.slug}.${field}`;
    const res = t(key);
    return res === key ? product[field] : res;
  };

  const schema = buildSchema(t, !!selectedProduct);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      return;
    }

    setErrors({});
    const { consent: _c, quantity, ...data } = parsed.data;

    // Quantity travels with the other custom specs so Odoo renders it as a
    // labelled field, and leads the summary line because it is the first thing
    // read when the lead is triaged.
    const specs = quantity ? { quantity, ...customSpecs } : customSpecs;

    const finalData: QuoteFormData = {
      ...data,
      productSlug: selectedSlug,
      productTitle: selectedProduct?.title || "General Inquiry",
      customFields: specs,
      message: `${selectedProduct ? `[PRODUCT REQUEST: ${tp(selectedProduct, "title")}] ` : ""}${
        quantity ? `[QTY: ${quantity}] ` : ""
      }${data.message}${
        Object.keys(specs).length > 0 ? `\n\nCustom Specs: ${JSON.stringify(specs)}` : ""
      }`,
    };

    await onSubmit(finalData);
  };

  // Determine Product Type for Dynamic Form Fields.
  // Matched against actual product slugs/categories (not fragile slug substring
  // guesses) so fields never mismatch after a product is recategorized.
  const SALMON_EGG_SLUGS = ["atlantic-salmon-egg", "coho-salmon-egg"];
  const SHRIMP_SLUGS = ["shrimp"];
  const OTHER_SEAFOOD_SLUGS = ["oyster", "blue-crab"];

  const isSalmonOva = !!selectedProduct && SALMON_EGG_SLUGS.includes(selectedProduct.slug);
  const isLiveFeed =
    !!selectedProduct &&
    (selectedProduct.category === "live-feed-aquaculture" ||
      selectedProduct.slug === "decapsulated-dry-artemia-cysts");
  const isFeedAdditive = selectedProduct?.category === "feed-additives";
  const isShrimp = !!selectedProduct && SHRIMP_SLUGS.includes(selectedProduct.slug);
  const isOtherSeafood = !!selectedProduct && OTHER_SEAFOOD_SLUGS.includes(selectedProduct.slug);
  // Whole/fillet finfish without published export formats (sea bass, sea bream,
  // trout, amberjack, brown meagre) share one "Whole Round / D&G / Dressed /
  // Fillets" segment rather than branching per species.
  //
  // Products that publish export formats (olive flounder today) get a form
  // driven by that data instead of the generic finfish pair of free-text boxes.
  // A buyer quoting live fish and a buyer quoting frozen fillet are answering
  // different questions, and "Portion & Cut Specification" asked neither well.
  const exportForms = selectedProduct?.exportForms ?? [];
  const hasExportForms = exportForms.length > 0;
  const activeFormIndex = exportForms.findIndex((f) => f.key === exportFormKey);
  const activeForm = activeFormIndex >= 0 ? exportForms[activeFormIndex] : undefined;

  const isFinfish =
    !!selectedProduct &&
    selectedProduct.category === "seafood" &&
    !isShrimp &&
    !isOtherSeafood &&
    !hasExportForms;

  /** Export-format strings follow the same override convention as the product page. */
  const tf = (index: number, field: string, fallback: string): string => {
    if (!selectedProduct) return fallback;
    const key = `product.${selectedProduct.slug}.exportForm.${index}.${field}`;
    const res = t(key);
    return res === key ? fallback : res;
  };

  // Real packaging/format spec for the selected product, used as placeholder text
  // so the form always reflects what that exact product actually ships in.
  const specValue = (labelIncludes: string) =>
    selectedProduct?.specifications.find((s) =>
      s.label.toLowerCase().includes(labelIncludes.toLowerCase()),
    )?.value;

  // Numbering is computed, not baked into the strings, so the labels stay
  // correct if a step is added or dropped later.
  const stepKeys = ["quoteForm.step1", "quoteForm.step3"];
  const stepLabel = (key: string) =>
    `${String(stepKeys.indexOf(key) + 1).padStart(2, "0")}. ${t(key)}`;

  const submitBtn = (
    <Button
      type="submit"
      disabled={busy}
      className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg text-sm transition-all hover:scale-[1.01]"
    >
      {busy
        ? t("quote.submitting")
        : selectedProduct
          ? `Request Quote for ${tp(selectedProduct, "title")} →`
          : "Submit B2B Commercial Inquiry →"}
    </Button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint-ink">
            B2B Commercial RFQ
          </span>
          <h3 className="font-display text-lg font-bold text-navy">
            {selectedProduct
              ? `Quotation: ${tp(selectedProduct, "title")}`
              : t("quoteForm.generalInquiry")}
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-surface-alt px-3 py-1 text-[11px] font-bold text-navy border border-border/80">
          <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
          <span>{t("quoteForm.sla")}</span>
        </div>
      </div>

      {/* Product Selection & Context Card */}
      <div className="space-y-3">
        <Label
          htmlFor="productSelect"
          className="font-bold text-navy text-xs uppercase tracking-wider flex items-center justify-between"
        >
          <span>{stepLabel("quoteForm.step1")}</span>
          <span className="text-[11px] font-normal text-muted-foreground">
            {t("quoteForm.required")}
          </span>
        </Label>
        <select
          id="productSelect"
          value={selectedSlug}
          onChange={(e) => handleProductChange(e.target.value)}
          className="w-full h-11 rounded-xl border border-border/80 bg-background px-3 text-xs font-semibold text-navy shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">{t("quoteForm.generalInquiryOption")}</option>
          {CATEGORIES.map((cat) => (
            <optgroup
              key={cat.slug}
              label={t(`cat.${cat.slug}`) === `cat.${cat.slug}` ? cat.title : t(`cat.${cat.slug}`)}
            >
              {PRODUCTS.filter((p) => p.category === cat.slug).map((p) => (
                <option key={p.slug} value={p.slug}>
                  {tp(p, "title")}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* Selected Product Context Banner */}
        {selectedProduct && (
          <div className="glass-card rounded-2xl p-4 border border-mint/40 bg-mint/5 flex items-center gap-4 transition-all">
            {selectedProduct.image ? (
              <img
                src={selectedProduct.image}
                alt={tp(selectedProduct, "title")}
                className="h-16 w-16 rounded-xl object-contain border border-border/60 bg-background shrink-0 p-1"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-navy text-white font-bold flex items-center justify-center text-xs shrink-0">
                {selectedProduct.title.slice(0, 2)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-mint">
                <ShieldCheck className="h-3.5 w-3.5" /> Certified Product Selected
              </div>
              <h4 className="font-display text-sm font-bold text-navy truncate">
                {tp(selectedProduct, "title")}
              </h4>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {tp(selectedProduct, "tagline")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC CATEGORY-SPECIFIC REQUIREMENTS */}
      {selectedProduct && (
        <div className="p-4 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-navy uppercase tracking-wider">
              <Sliders className="h-4 w-4 text-mint-ink" /> Technical & Delivery Parameters
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Customized Form
            </span>
          </div>

          {/* Quantity sits above the per-category fields because it applies to
              every product and is the one answer a quote cannot be priced
              without. Required whenever a product is selected. */}
          <div className="text-xs">
            <Label htmlFor="quantity" className="text-[11px] font-bold text-navy">
              {t("quoteForm.quantityLabel")} <span className="text-primary">*</span>
            </Label>
            <Input
              id="quantity"
              name="quantity"
              required
              aria-invalid={!!errors.quantity}
              placeholder={
                isSalmonOva
                  ? t("quoteForm.quantityPlaceholder.ova")
                  : t("quoteForm.quantityPlaceholder.generic")
              }
              className="bg-background h-9 text-xs"
            />
            {errors.quantity && (
              <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.quantity}
              </p>
            )}
          </div>

          {/* Type A: Salmon Ova Parameters */}
          {isSalmonOva && (
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <Label htmlFor="eyedStage" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.eyedStageLabel")}
                </Label>
                <Input
                  id="eyedStage"
                  placeholder={t("quoteForm.eyedStagePlaceholder")}
                  onChange={(e) => setCustomSpecs({ ...customSpecs, eyedStage: e.target.value })}
                  className="bg-background h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="orderPurpose" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.purposeLabel")}
                </Label>
                {/* Commercial grow-out, a research trial and "something else"
                    carry different volumes, certification needs and lead times,
                    so this changes how the enquiry is handled. */}
                <select
                  id="orderPurpose"
                  value={customSpecs.orderPurpose ?? ""}
                  onChange={(e) => setCustomSpecs({ ...customSpecs, orderPurpose: e.target.value })}
                  className="mt-0.5 h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="">{t("quoteForm.purpose.unset")}</option>
                  <option value="farming">{t("quoteForm.purpose.farming")}</option>
                  <option value="research">{t("quoteForm.purpose.research")}</option>
                  <option value="other">{t("quoteForm.purpose.other")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="deliveryWeek" className="text-[11px] font-bold text-navy">
                  Target Delivery Week / Month
                </Label>
                <Input
                  id="deliveryWeek"
                  placeholder="e.g. Week 14, 2026"
                  onChange={(e) => setCustomSpecs({ ...customSpecs, deliveryWeek: e.target.value })}
                  className="bg-background h-9 text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="requiredCertifications"
                  className="text-[11px] font-bold text-navy flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-mint-ink" />
                  {t("quoteForm.certificationsLabel")}
                </Label>
                <Input
                  id="requiredCertifications"
                  placeholder={t("quoteForm.certificationsPlaceholder")}
                  onChange={(e) =>
                    setCustomSpecs({ ...customSpecs, requiredCertifications: e.target.value })
                  }
                  className="bg-background h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="airportEntry" className="text-[11px] font-bold text-navy">
                  Air Freight Destination Airport
                </Label>
                <Input
                  id="airportEntry"
                  placeholder="e.g. Incheon (ICN) / Narita (NRT) / Istanbul (IST)"
                  onChange={(e) => setCustomSpecs({ ...customSpecs, airportEntry: e.target.value })}
                  className="bg-background h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="incubationTemp" className="text-[11px] font-bold text-navy">
                  Hatchery Water Temp (°C)
                </Label>
                <Input
                  id="incubationTemp"
                  placeholder="e.g. 4.0 °C to 6.0 °C"
                  onChange={(e) =>
                    setCustomSpecs({ ...customSpecs, incubationTemp: e.target.value })
                  }
                  className="bg-background h-9 text-xs"
                />
              </div>
            </div>
          )}

          {/* Type B: Live Feed & Microalgae Parameters */}
          {isLiveFeed && (
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <Label htmlFor="packFormat" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.packagingLabel")}
                </Label>
                <Input
                  id="packFormat"
                  placeholder={
                    specValue("Packaging") ? `e.g. ${specValue("Packaging")}` : undefined
                  }
                  onChange={(e) => setCustomSpecs({ ...customSpecs, packFormat: e.target.value })}
                  className="bg-background h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="tankCapacity" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.tankCapacityLabel")}
                </Label>
                <Input
                  id="tankCapacity"
                  placeholder={t("quoteForm.tankCapacityPlaceholder")}
                  onChange={(e) => setCustomSpecs({ ...customSpecs, tankCapacity: e.target.value })}
                  className="bg-background h-9 text-xs"
                />
              </div>
            </div>
          )}

          {/* Type C: Additives & Raw Materials */}
          {isFeedAdditive && (
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <Label htmlFor="containerVolume" className="text-[11px] font-bold text-navy">
                  Target Order Volume
                </Label>
                <select
                  id="containerVolume"
                  onChange={(e) =>
                    setCustomSpecs({ ...customSpecs, containerVolume: e.target.value })
                  }
                  className="w-full h-9 rounded-md border border-border/80 bg-background px-2 text-xs font-medium"
                >
                  <option value="20ft FCL">20ft Full Container Load (FCL)</option>
                  <option value="40ft FCL">40ft Full Container Load (FCL)</option>
                  <option value="Bulk Bags">800 kg Jumbo Bags</option>
                </select>
                {specValue("Packaging") && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Standard packaging: {specValue("Packaging")}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="destinationPort" className="text-[11px] font-bold text-navy">
                  Destination Sea Port (CIF/FOB)
                </Label>
                <Input
                  id="destinationPort"
                  placeholder="e.g. Port of Rotterdam / Busan / Jebel Ali"
                  onChange={(e) =>
                    setCustomSpecs({ ...customSpecs, destinationPort: e.target.value })
                  }
                  className="bg-background h-9 text-xs"
                />
              </div>
            </div>
          )}

          {/* Type D1: products that publish export formats (olive flounder).
              Format first, because everything under it depends on the answer —
              a live fish has no fillet cut and a frozen fillet has no
              viability window. */}
          {hasExportForms && (
            <div className="space-y-3 text-xs">
              <div>
                <Label className="text-[11px] font-bold text-navy">
                  {t("quoteForm.exportFormat.label")}
                </Label>
                <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                  {exportForms.map((form, i) => (
                    <label
                      key={form.key}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 transition-colors ${
                        exportFormKey === form.key
                          ? "border-primary bg-primary/5"
                          : "border-border/80 hover:bg-surface-alt"
                      }`}
                    >
                      <input
                        type="radio"
                        name="exportFormat"
                        value={form.key}
                        checked={exportFormKey === form.key}
                        onChange={() => {
                          setExportFormKey(form.key);
                          // Bands and options belong to the format that was
                          // just replaced; carrying them over would quote a
                          // fillet weight against a live fish.
                          const { sizeBand: _s, ...rest } = customSpecs;
                          const kept = Object.fromEntries(
                            Object.entries(rest).filter(([k]) => !k.startsWith("option")),
                          );
                          setCustomSpecs({ ...kept, exportFormat: tf(i, "name", form.name) });
                        }}
                        className="text-primary"
                      />
                      <span className="font-bold text-navy">{tf(i, "name", form.name)}</span>
                    </label>
                  ))}
                </div>
                {activeForm && (
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    {tf(activeFormIndex, "summary", activeForm.summary)}
                  </p>
                )}
              </div>

              {activeForm && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Real published bands, so nobody asks for a weight we do
                      not harvest and then has to be talked back down. */}
                  {activeForm.sizes && activeForm.sizes.length > 0 && (
                    <div>
                      <Label htmlFor="sizeBand" className="text-[11px] font-bold text-navy">
                        {t("quoteForm.sizeBand.label")}
                      </Label>
                      <select
                        id="sizeBand"
                        value={customSpecs.sizeBand ?? ""}
                        onChange={(e) =>
                          setCustomSpecs({ ...customSpecs, sizeBand: e.target.value })
                        }
                        className="mt-1 h-9 w-full rounded-md border border-border/80 bg-background px-2 text-xs font-semibold text-navy focus:border-primary focus:outline-none"
                      >
                        <option value="">{t("quoteForm.sizeBand.any")}</option>
                        {activeForm.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Only options with discrete answers become fields. The rest
                      (viability windows, worked examples) are guidance and
                      appear as the note below. */}
                  {activeForm.options
                    ?.map((opt, oi) => ({ opt, oi }))
                    .filter(({ opt }) => opt.choices && opt.choices.length > 0)
                    .map(({ opt, oi }) => {
                      const label = tf(activeFormIndex, `option.${oi}.label`, opt.label);
                      const field = `option${oi}`;
                      return (
                        <div key={opt.label}>
                          <Label htmlFor={field} className="text-[11px] font-bold text-navy">
                            {label}
                          </Label>
                          <select
                            id={field}
                            value={customSpecs[field] ?? ""}
                            onChange={(e) =>
                              setCustomSpecs({
                                ...customSpecs,
                                [field]: e.target.value ? `${label}: ${e.target.value}` : "",
                              })
                            }
                            className="mt-1 h-9 w-full rounded-md border border-border/80 bg-background px-2 text-xs font-semibold text-navy focus:border-primary focus:outline-none"
                          >
                            <option value="">{t("quoteForm.option.noPreference")}</option>
                            {opt.choices!.map((choice, ci) => (
                              <option
                                key={choice}
                                value={tf(activeFormIndex, `option.${oi}.choice.${ci}`, choice)}
                              >
                                {tf(activeFormIndex, `option.${oi}.choice.${ci}`, choice)}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}

                  <div>
                    <Label htmlFor="gccDestination" className="text-[11px] font-bold text-navy">
                      {t("quoteForm.destinationLabel")}
                    </Label>
                    <Input
                      id="gccDestination"
                      placeholder={t("quoteForm.destinationPlaceholder")}
                      value={customSpecs.gccDestination ?? ""}
                      onChange={(e) =>
                        setCustomSpecs({ ...customSpecs, gccDestination: e.target.value })
                      }
                      className="bg-background h-9 text-xs"
                    />
                  </div>

                  <div>
                    <Label htmlFor="orderVolume" className="text-[11px] font-bold text-navy">
                      {t("quoteForm.orderVolume.label")}
                    </Label>
                    <Input
                      id="orderVolume"
                      placeholder={t("quoteForm.orderVolume.placeholder")}
                      value={customSpecs.orderVolume ?? ""}
                      onChange={(e) =>
                        setCustomSpecs({ ...customSpecs, orderVolume: e.target.value })
                      }
                      className="bg-background h-9 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* The format's own caveat, verbatim from the product page — the
                  live viability window is the one a buyer must read before
                  committing to a corridor. */}
              {activeForm?.notes && (
                <p className="rounded-lg border border-border/60 bg-background p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                  {tf(activeFormIndex, "notes", activeForm.notes)}
                </p>
              )}
            </div>
          )}

          {/* Type D: Finfish — sea bass, sea bream, trout, amberjack, brown meagre */}
          {isFinfish && (
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <Label htmlFor="portionSpec" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.portionLabel")}
                </Label>
                <Input
                  id="portionSpec"
                  placeholder={
                    specValue("Product form") ? `e.g. ${specValue("Product form")}` : undefined
                  }
                  onChange={(e) => setCustomSpecs({ ...customSpecs, portionSpec: e.target.value })}
                  className="bg-background h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="gccDestination" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.destinationLabel")}
                </Label>
                <Input
                  id="gccDestination"
                  placeholder={t("quoteForm.destinationPlaceholder")}
                  onChange={(e) =>
                    setCustomSpecs({ ...customSpecs, gccDestination: e.target.value })
                  }
                  className="bg-background h-9 text-xs"
                />
              </div>
            </div>
          )}

          {/* Type E: Shrimp */}
          {isShrimp && (
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <Label htmlFor="portionSpec" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.portionLabel")}
                </Label>
                <Input
                  id="portionSpec"
                  placeholder={specValue("Formats") ? `e.g. ${specValue("Formats")}` : undefined}
                  onChange={(e) => setCustomSpecs({ ...customSpecs, portionSpec: e.target.value })}
                  className="bg-background h-9 text-xs"
                />
                {specValue("Size grades") && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Size grades: {specValue("Size grades")}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="gccDestination" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.destinationLabel")}
                </Label>
                <Input
                  id="gccDestination"
                  placeholder={t("quoteForm.destinationPlaceholder")}
                  onChange={(e) =>
                    setCustomSpecs({ ...customSpecs, gccDestination: e.target.value })
                  }
                  className="bg-background h-9 text-xs"
                />
              </div>
            </div>
          )}

          {/* Type F: Other seafood — oyster, blue crab */}
          {isOtherSeafood && (
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <Label htmlFor="portionSpec" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.portionLabel")}
                </Label>
                <Input
                  id="portionSpec"
                  placeholder={specValue("Formats") ? `e.g. ${specValue("Formats")}` : undefined}
                  onChange={(e) => setCustomSpecs({ ...customSpecs, portionSpec: e.target.value })}
                  className="bg-background h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="gccDestination" className="text-[11px] font-bold text-navy">
                  {t("quoteForm.destinationLabel")}
                </Label>
                <Input
                  id="gccDestination"
                  placeholder={t("quoteForm.destinationPlaceholder")}
                  onChange={(e) =>
                    setCustomSpecs({ ...customSpecs, gccDestination: e.target.value })
                  }
                  className="bg-background h-9 text-xs"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* STANDARD CONTACT INFORMATION FIELDS */}
      <div className="space-y-3">
        <Label className="font-bold text-navy text-xs uppercase tracking-wider block">
          {stepLabel("quoteForm.step3")}
        </Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t("quote.name")} name="name" error={errors.name} required />
          <Field label={t("quote.company")} name="company" error={errors.company} required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t("quote.email")} name="email" type="email" error={errors.email} required />
          <Field label={t("quote.phone")} name="phone" error={errors.phone} required />
        </div>
        <CountrySelect
          name="country"
          label={t("quote.country")}
          placeholder={t("quote.countryPlaceholder")}
          searchPlaceholder={t("quote.countrySearch")}
          emptyLabel={t("quote.countryEmpty")}
          mainGroupLabel={t("quote.countryGroup.main")}
          allGroupLabel={t("quote.countryGroup.all")}
          lang={lang}
          error={errors.country}
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-xs font-bold text-navy">
          {t("quote.message")}
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          placeholder={t("quote.messagePh")}
          maxLength={1000}
          className="text-xs"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" name="consent" value="on" className="mt-0.5" />
        <span>{t("quote.consent")}</span>
      </label>
      {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
      {Footer ? <Footer>{submitBtn}</Footer> : <div className="pt-2">{submitBtn}</div>}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={name} className="text-xs font-bold text-navy">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input id={name} name={name} type={type} aria-required={required} className="h-10 text-xs" />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
