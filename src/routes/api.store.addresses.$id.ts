import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ApiError, ApiNotFoundError, ApiUnauthorizedError } from "@/lib/api/types";
import { sessionIdFrom, sessionApiClient } from "@/lib/api/bff-session";

const addressUpdateSchema = z.object({
  type: z.enum(["invoice", "delivery"]).optional(),
  name: z.string().trim().min(1).optional(),
  street: z.string().trim().min(1).optional(),
  street2: z.string().trim().optional(),
  city: z.string().trim().min(1).optional(),
  zip: z.string().trim().optional(),
  country: z.string().trim().min(1).optional(),
  phone: z.string().trim().optional(),
});

export const Route = createFileRoute("/api/store/addresses/$id")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        const sessionId = sessionIdFrom(request);
        if (!sessionId) {
          return new Response(
            JSON.stringify({
              error: "unauthorized",
              message: "Please log in to manage your addresses",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const addressId = Number(params.id);
        if (!Number.isFinite(addressId)) {
          return new Response(JSON.stringify({ error: "invalid_address_id" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const body = await request.json();
        const validated = addressUpdateSchema.safeParse(body);
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
          const result = await sessionApiClient(sessionId).updateAddress(addressId, validated.data);
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
          if (error instanceof ApiNotFoundError) {
            return new Response(
              JSON.stringify({ error: "not_found", message: "This address could not be found." }),
              { status: 404, headers: { "Content-Type": "application/json" } },
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
              message: "Unable to update this address right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      DELETE: async ({ request, params }) => {
        const sessionId = sessionIdFrom(request);
        if (!sessionId) {
          return new Response(
            JSON.stringify({
              error: "unauthorized",
              message: "Please log in to manage your addresses",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const addressId = Number(params.id);
        if (!Number.isFinite(addressId)) {
          return new Response(JSON.stringify({ error: "invalid_address_id" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const result = await sessionApiClient(sessionId).deleteAddress(addressId);
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
          if (error instanceof ApiNotFoundError) {
            return new Response(
              JSON.stringify({ error: "not_found", message: "This address could not be found." }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }
          if (error instanceof ApiError && error.status === 409) {
            return new Response(
              JSON.stringify({
                error: "address_in_use",
                message: "This address is used on an existing order and can't be removed.",
              }),
              { status: 409, headers: { "Content-Type": "application/json" } },
            );
          }
          console.error("[BFF Proxy Addresses] Odoo API error:", error);
          return new Response(
            JSON.stringify({
              error: "addresses_service_unavailable",
              message: "Unable to remove this address right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
