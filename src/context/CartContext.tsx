import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, QuoteRequest } from "@/lib/types";

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
  submitQuote: (data: QuoteRequest, source?: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "vars.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [bumping, setBumping] = useState(false);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* noop */
    }
    isLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (isLoadedRef.current && typeof window !== "undefined") {
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
        submitQuote: async (data, source) => {
          const response = await fetch("/api/quotes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              source,
              items: items.map((i) => ({
                productSlug: i.productSlug,
                category: i.category,
                title: i.title,
                quantity: i.quantity,
              })),
            }),
          });
          if (!response.ok) {
            const errBody = (await response.json().catch(() => ({}))) as { error?: string };
            throw new Error(errBody.error || "Failed to submit quote request");
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
