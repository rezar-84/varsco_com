import type { StorePrice } from "@/lib/api/types";

export function formatPrice(price?: StorePrice | null): string | null {
  if (!price) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
      maximumFractionDigits: 2,
    }).format(price.amount);
  } catch {
    return `${price.amount.toFixed(2)} ${price.currency}`;
  }
}
