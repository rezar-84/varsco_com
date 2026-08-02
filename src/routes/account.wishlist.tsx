import { createFileRoute } from "@tanstack/react-router";
import { Heart, Loader2 } from "lucide-react";
import { StoreProductCard } from "@/components/StoreProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/account/wishlist")({
  component: Wishlist,
});

function Wishlist() {
  const { t } = useI18n();
  const { items, loading } = useWishlist();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-black text-navy">
          {t("account.wishlist.title")}
        </h1>
        <p className="mt-2 text-muted-foreground text-sm font-medium">
          {t("account.wishlist.subtitle")}
        </p>
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-semibold text-navy/80">{t("account.wishlist.loading")}</p>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-border/60 max-w-lg mx-auto space-y-4">
          <Heart className="h-12 w-12 text-muted-foreground/60 mx-auto" />
          <div className="font-display text-xl font-bold text-navy">
            {t("account.wishlist.emptyTitle")}
          </div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {t("account.wishlist.emptyBody")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <StoreProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
