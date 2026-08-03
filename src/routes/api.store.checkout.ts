import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";
import { ApiError, ApiNotFoundError, ApiUnauthorizedError } from "@/lib/api/types";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.number(),
        qty: z.number().min(1),
      }),
    )
    .min(1, "Cart is empty"),
  shipping_partner_id: z.number().optional(),
  billing_partner_id: z.number().optional(),
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
          const result = await apiClient.submitCheckout({
            items: validated.data.items,
            shipping_partner_id: validated.data.shipping_partner_id,
            billing_partner_id: validated.data.billing_partner_id,
          });

          // Trust boundary: only forward payment_url if it actually points at
          // our configured Odoo instance. The value always originates from
          // Odoo's own response, never client input, but validating it here
          // (rather than trusting it blindly through to a browser redirect)
          // costs nothing and fails closed if it's ever malformed/unexpected.
          if (result.payment_url && !result.payment_url.startsWith(baseUrl)) {
            console.error(
              "[BFF Proxy Store Checkout] Dropping payment_url — its origin doesn't match " +
                "VITE_ODOO_BASE_URL. This silently hides a valid payment link from every " +
                "checkout until fixed. Expected origin (VITE_ODOO_BASE_URL):",
              baseUrl,
              "Actual payment_url returned by Odoo:",
              result.payment_url,
              "— confirm VITE_ODOO_BASE_URL matches Odoo's own web.base.url system parameter.",
            );
            delete result.payment_url;
          }

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
          if (error instanceof ApiError && error.status === 400) {
            // Most commonly a stale shipping_partner_id/billing_partner_id —
            // e.g. the address was deleted in another tab after the
            // checkout page loaded. Surface it plainly rather than the
            // generic 503 below, which would mask a fixable input error.
            return new Response(
              JSON.stringify({
                error: "invalid_checkout_request",
                message: "That order couldn't be placed — please re-check the selected address.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
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
