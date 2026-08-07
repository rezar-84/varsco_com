import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product, QuoteRequest } from "@/lib/types";
import type { SubmissionContext } from "@/lib/submission-context";

/**
 * Unwired from varsco_com's live UI on 2026-08-02 — kept working and intact
 * for potential reuse in a future project, not deleted. This is a multi-item
 * "quote cart" (add several products, submit one combined quote request),
 * distinct from the real transactional cart at StoreCartContext.tsx (which
 * backs /shop and stays live). It used to be consumed by:
 *   - src/components/ProductCard.tsx ("Add to Cart" button, now removed)
 *   - src/routes/products.$category.$slug.tsx ("Add to Quote Cart" button, now removed)
 *   - src/components/layout/SiteHeader.tsx (header cart badge, now points at useStoreCart())
 *   - src/components/FloatingQuoteCTA.tsx (no longer mounted in SiteShell.tsx)
 * CartProvider is still mounted at the root, so /cart, CartDrawer, and
 * FloatingQuoteCTA all still work standalone if reconnected — nothing here
 * was deleted, only unlinked from navigation and product pages.
 */
interface CartContextValue {
  items: CartItem[];
  count: number;
  isOpen: boolean;
  bumping: boolean;
  add: (product: Product, qty?: number) => void;
  remove: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  submitQuote: (data: QuoteRequest, context: SubmissionContext) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "vars.cart.v1";

function readStoredItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredItems);
  const [isOpen, setIsOpen] = useState(false);
  const [bumping, setBumping] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const bump = useCallback(() => {
    setBumping(true);
    setTimeout(() => setBumping(false), 450);
  }, []);

  const add = useCallback(
    (product: Product, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productSlug === product.slug);
        if (existing) {
          return prev.map((i) =>
            i.productSlug === product.slug ? { ...i, quantity: i.quantity + qty } : i,
          );
        }
        return [
          ...prev,
          {
            productSlug: product.slug,
            category: product.category,
            title: product.title,
            image: product.image,
            quantity: qty,
          },
        ];
      });
      bump();
    },
    [bump],
  );

  const remove = (slug: string) => setItems((prev) => prev.filter((i) => i.productSlug !== slug));

  const updateQty = (slug: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.productSlug === slug ? { ...i, quantity: Math.max(1, qty) } : i)),
    );

  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        isOpen,
        bumping,
        add,
        remove,
        updateQty,
        clear,
        openDrawer: () => setIsOpen(true),
        closeDrawer: () => setIsOpen(false),
        submitQuote: async (data, context) => {
          const response = await fetch("/api/quotes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              // Spread after `data` so the caller's submission context always
              // wins: `source` used to be a free-text string and a stale one
              // in the payload would have shadowed the real attribution.
              ...context,
              items: items.map((i) => ({
                productSlug: i.productSlug,
                category: i.category,
                title: i.title,
                quantity: i.quantity,
              })),
            }),
          });
          if (!response.ok) {
            const errBody = (await response.json().catch(() => ({}))) as {
              error?: string;
              message?: string;
            };
            // `message` is only worth showing on a 4xx, where it carries
            // something the buyer can act on. On a 5xx it is raw exception
            // text ("fetch failed"). Same rule as the other lead forms.
            const human = response.status < 500 ? errBody.message : undefined;
            throw new Error(human || "Failed to submit quote request");
          }
          clear();
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
