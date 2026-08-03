import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ApiError, ApiUnauthorizedError } from "@/lib/api/types";
import { sessionIdFrom, sessionApiClient } from "@/lib/api/bff-session";

const addressSchema = z.object({
  type: z.enum(["invoice", "delivery"]),
  name: z.string().trim().min(1),
  street: z.string().trim().min(1),
  street2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  zip: z.string().trim().optional(),
  country: z.string().trim().min(1),
  phone: z.string().trim().optional(),
});

export const Route = createFileRoute("/api/store/addresses")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sessionId = sessionIdFrom(request);
        if (!sessionId) {
          return new Response(
            JSON.stringify({
              error: "unauthorized",
              message: "Please log in to view your addresses",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }
        try {
          const result = await sessionApiClient(sessionId).listAddresses();
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
          console.error("[BFF Proxy Addresses] Odoo API error:", error);
          return new Response(
            JSON.stringify({
              error: "addresses_service_unavailable",
              message: "Unable to load your addresses right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      POST: async ({ request }) => {
        const sessionId = sessionIdFrom(request);
        if (!sessionId) {
          return new Response(
            JSON.stringify({ error: "unauthorized", message: "Please log in to save an address" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const body = await request.json();
        const validated = addressSchema.safeParse(body);
        if (!validated.success) {
          return new Response(
            JSON.stringify({
              error: "validation_failed",
              message: validated.error.issues[0]?.message || "Invalid address",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          const result = await sessionApiClient(sessionId).createAddress(validated.data);
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
            return new Response(
              JSON.stringify({
                error: "validation_failed",
                message: "That address couldn't be saved — check the country and required fields.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }
          console.error("[BFF Proxy Addresses] Odoo API error:", error);
          return new Response(
            JSON.stringify({
              error: "addresses_service_unavailable",
              message: "Unable to save this address right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
