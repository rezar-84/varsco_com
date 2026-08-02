import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";
import { ApiNotFoundError, ApiUnauthorizedError } from "@/lib/api/types";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.number(),
        qty: z.number().min(1),
      }),
    )
    .min(1, "Cart is empty"),
});

export const Route = createFileRoute("/api/store/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") || "";
        const sessionMatch = cookieHeader.match(/vars_session=([^;]+)/);

        if (!sessionMatch) {
          return new Response(
            JSON.stringify({ error: "unauthorized", message: "Please log in to place an order" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const body = await request.json();
        const validated = checkoutSchema.safeParse(body);

        if (!validated.success) {
          return new Response(
            JSON.stringify({
              error: "validation_failed",
              details: validated.error.flatten().fieldErrors,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const sessionId = sessionMatch[1];
        const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
        const writeToken = process.env.ODOO_WRITE_TOKEN;
        const apiClient = new ContentApiClient({ baseUrl, writeToken, sessionId });

        try {
          const result = await apiClient.submitCheckout({ items: validated.data.items });
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
            // /api/v1/store/checkout isn't confirmed live in Odoo yet — unlike
            // read endpoints, this is a real transaction, so it must not
            // silently report success. Surface a clear, honest failure.
            return new Response(
              JSON.stringify({
                error: "checkout_unavailable",
                message:
                  "Online checkout isn't available yet. Please contact us to place this order.",
              }),
              { status: 503, headers: { "Content-Type": "application/json" } },
            );
          }
          console.error("[BFF Proxy Store Checkout] Odoo API error:", error);
          return new Response(
            JSON.stringify({
              error: "checkout_service_unavailable",
              message: "Unable to submit your order right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
