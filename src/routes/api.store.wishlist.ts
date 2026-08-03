import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ApiError, ApiNotFoundError, ApiUnauthorizedError } from "@/lib/api/types";
import { sessionIdFrom, sessionApiClient } from "@/lib/api/bff-session";

const addSchema = z.object({ product_id: z.number() });

export const Route = createFileRoute("/api/store/wishlist")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sessionId = sessionIdFrom(request);
        if (!sessionId) {
          return new Response(
            JSON.stringify({
              error: "unauthorized",
              message: "Please log in to view your wishlist",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }
        try {
          const result = await sessionApiClient(sessionId).listWishlist();
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
              message: "Unable to load your wishlist right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      POST: async ({ request }) => {
        const sessionId = sessionIdFrom(request);
        if (!sessionId) {
          return new Response(
            JSON.stringify({ error: "unauthorized", message: "Please log in to save items" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const body = await request.json();
        const validated = addSchema.safeParse(body);
        if (!validated.success) {
          return new Response(
            JSON.stringify({
              error: "validation_failed",
              message: "A valid product_id is required",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          const result = await sessionApiClient(sessionId).addToWishlist(validated.data.product_id);
          return new Response(JSON.stringify(result), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          if (error instanceof ApiUnauthorizedError) {
            return new Response(
              JSON.stringify({ error: "unauthorized", message: "Session expired or missing" }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }
          if (error instanceof ApiNotFoundError) {
            return new Response(
              JSON.stringify({ error: "not_found", message: "This product could not be found." }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }
          if (error instanceof ApiError) {
            console.error("[BFF Proxy Wishlist] Odoo API error:", error);
          }
          return new Response(
            JSON.stringify({
              error: "wishlist_service_unavailable",
              message: "Unable to save this item right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
