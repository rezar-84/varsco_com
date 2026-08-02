import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { CatalogItemSummary } from "@/lib/api/types";
import { useAuth } from "@/context/AuthContext";

interface WishlistContextValue {
  items: CatalogItemSummary[];
  loading: boolean;
  isWishlisted: (productId: number) => boolean;
  toggle: (product: CatalogItemSummary) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

/**
 * Unlike StoreCartContext, this has no localStorage/guest mode — the
 * wishlist is always server-backed (varsco_content_api's /api/v1/store/wishlist,
 * session-authenticated only). It simply stays empty for a logged-out
 * visitor; toggle() below is a no-op if called without a product_id
 * (i.e. the product isn't purchasable), and callers should gate the UI
 * itself on useAuth().user rather than calling toggle() for guests.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CatalogItemSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    fetch("/api/store/wishlist")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((body: { data?: CatalogItemSummary[] }) => setItems(body.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  const isWishlisted = useCallback(
    (productId: number) => items.some((i) => i.purchase?.product_id === productId),
    [items],
  );

  const toggle = useCallback(
    async (product: CatalogItemSummary) => {
      const productId = product.purchase?.product_id;
      if (!productId || !user) return;

      const alreadyIn = items.some((i) => i.purchase?.product_id === productId);
      if (alreadyIn) {
        setItems((prev) => prev.filter((i) => i.purchase?.product_id !== productId));
        const res = await fetch(`/api/store/wishlist/${productId}`, { method: "DELETE" });
        if (!res.ok) setItems((prev) => [...prev, product]);
      } else {
        setItems((prev) => [...prev, product]);
        const res = await fetch("/api/store/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: productId }),
        });
        if (!res.ok) setItems((prev) => prev.filter((i) => i.purchase?.product_id !== productId));
      }
    },
    [items, user],
  );

  return (
    <WishlistContext.Provider value={{ items, loading, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
