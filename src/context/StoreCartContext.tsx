import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { CatalogItemDetail, CatalogItemSummary, StorePrice } from "@/lib/api/types";

export interface StoreCartItem {
  productId: number;
  slug: string;
  name: string;
  image?: string | null;
  price?: StorePrice | null;
  quantity: number;
}

export interface StoreCheckoutResult {
  order_id: number;
  amount_total: number;
  currency: string;
  payment_url?: string;
}

interface StoreCartContextValue {
  items: StoreCartItem[];
  count: number;
  isOpen: boolean;
  bumping: boolean;
  add: (product: CatalogItemSummary | CatalogItemDetail, qty?: number) => void;
  remove: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  submitOrder: () => Promise<StoreCheckoutResult>;
}

const StoreCartContext = createContext<StoreCartContextValue | null>(null);
const STORAGE_KEY = "vars.store-cart.v1";

function readStoredItems(): StoreCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function StoreCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoreCartItem[]>(readStoredItems);
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
    (product: CatalogItemSummary | CatalogItemDetail, qty = 1) => {
      if (!product.purchase?.available) return;
      const productId = product.purchase.product_id;
      const price: StorePrice = {
        amount: product.purchase.amount,
        currency: product.purchase.currency,
      };
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + qty } : i,
          );
        }
        return [
          ...prev,
          {
            productId,
            slug: product.slug,
            name: product.name,
            image: product.primary_media?.url ?? null,
            price,
            quantity: qty,
          },
        ];
      });
      bump();
    },
    [bump],
  );

  const remove = (productId: number) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const updateQty = (productId: number, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i)),
    );

  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <StoreCartContext.Provider
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
        submitOrder: async () => {
          const response = await fetch("/api/store/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: items.map((i) => ({ product_id: i.productId, qty: i.quantity })),
            }),
          });
          if (!response.ok) {
            const errBody = (await response.json().catch(() => ({}))) as {
              error?: string;
              message?: string;
            };
            throw new Error(errBody.message || "Failed to submit order");
          }
          const result = (await response.json()) as StoreCheckoutResult;
          clear();
          return result;
        },
      }}
    >
      {children}
    </StoreCartContext.Provider>
  );
}

export function useStoreCart() {
  const ctx = useContext(StoreCartContext);
  if (!ctx) throw new Error("useStoreCart must be used inside StoreCartProvider");
  return ctx;
}
