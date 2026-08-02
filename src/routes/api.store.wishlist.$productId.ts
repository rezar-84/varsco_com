import { createFileRoute } from "@tanstack/react-router";
import { ContentApiClient } from "@/lib/api/client";
import { ApiUnauthorizedError } from "@/lib/api/types";

export const Route = createFileRoute("/api/store/wishlist/$productId")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        const cookieHeader = request.headers.get("cookie") || "";
        const sessionMatch = cookieHeader.match(/vars_session=([^;]+)/);
        if (!sessionMatch) {
          return new Response(
            JSON.stringify({
              error: "unauthorized",
              message: "Please log in to manage your wishlist",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const productId = Number(params.productId);
        if (!Number.isFinite(productId)) {
          return new Response(JSON.stringify({ error: "invalid_product_id" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
        const writeToken = process.env.ODOO_WRITE_TOKEN;
        const apiClient = new ContentApiClient({ baseUrl, writeToken, sessionId: sessionMatch[1] });

        try {
          const result = await apiClient.removeFromWishlist(productId);
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          if (error instanceof ApiUnauthorizedError) {
            return new Response(
              JSON.stringify({ error: "unauthorized", message: "Session expired or missing" }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }
          console.error("[BFF Proxy Wishlist] Odoo API error:", error);
          return new Response(
            JSON.stringify({
              error: "wishlist_service_unavailable",
              message: "Unable to remove this item right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
